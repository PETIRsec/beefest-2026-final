import os
import subprocess
import secrets
import stat
import argparse

REPO_URL = "https://github.com/chrisandoryan/CTFd-Nginx-LetsEncrypt"
TARGET_DIR = "CTFd-Nginx-LetsEncrypt"

def generate_secret(length=32):
    return secrets.token_hex(length)

def run_command(command, shell=True):
    try:
        subprocess.check_call(command, shell=shell)
    except subprocess.CalledProcessError as e:
        print(f"Error executing: {command}\n{e}")
        exit(1)

def prepare_files(domain, email, sk, db_pass):
    compose_file = "docker-compose.yml"
    template_file = f"../template.{compose_file}"
    
    if not os.path.exists(template_file):
        print(f"Error: {template_file} not found.")
        return

    run_command("git checkout .")
    
    with open(template_file, "r") as f:
        content = f.read()
    content = content.replace("${DB_PASSWORD}", db_pass)
    content = content.replace("${SECRET_KEY}", sk)
    with open(compose_file, "w") as f:
        f.write(content)
    
    run_command(f"sed -i 's/^email=.*/email=\"{email}\"/' init-letsencrypt.sh")
    run_command(f"sed -i 's/^domains=.*/domains=({domain})/' init-letsencrypt.sh")
    run_command(f"sed -i 's/certbot certonly/certbot certonly --non-interactive --no-eff-email /' init-letsencrypt.sh")

    nginx_conf_dir = "./data/nginx"
    ssl_dummy_dir = "./data/nginx/ssl"
    os.makedirs(ssl_dummy_dir, exist_ok=True)
    
    print("[*] Generating dummy SSL certificate for IP rejection...")
    run_command(f"openssl req -x509 -nodes -days 365 -newkey rsa:2048 "
                f"-keyout {ssl_dummy_dir}/selfsigned.key "
                f"-out {ssl_dummy_dir}/selfsigned.crt "
                f"-subj '/CN=localhost'")

    nginx_config = f"""server {{
    listen 80 default_server;
    server_name _;
    return 444;
}}

server {{
    listen 443 ssl default_server;
    server_name _;
    ssl_certificate /etc/nginx/ssl/selfsigned.crt;
    ssl_certificate_key /etc/nginx/ssl/selfsigned.key;
    return 444;
}}

server {{
    listen 80;
    server_name {domain};
    location /.well-known/acme-challenge/ {{
        root /var/www/certbot;
    }}
    location / {{
        return 301 https://$host$request_uri;
    }}
}}

server {{
    listen 443 ssl;
    server_name {domain};
    client_max_body_size 4G;

    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    ssl_certificate /etc/letsencrypt/live/{domain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/{domain}/privkey.pem;

    location / {{
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://ctfd:8000/;
    }}
}}
"""
    with open(f"{nginx_conf_dir}/app.conf", "w") as f:
        f.write(nginx_config)

    st = os.stat('init-letsencrypt.sh')
    os.chmod('init-letsencrypt.sh', st.st_mode | stat.S_IEXEC)

def main():
    parser = argparse.ArgumentParser(description="Deploy CTFd with IP rejection.")
    parser.add_argument("-d", "--domain", required=True)
    parser.add_argument("-e", "--email", required=True)
    args = parser.parse_args()

    if not os.path.exists(TARGET_DIR):
        run_command(f"git clone {REPO_URL} {TARGET_DIR}")
    
    os.chdir(TARGET_DIR)
    prepare_files(args.domain, args.email, generate_secret(64), generate_secret(24))

    if os.path.exists(f"data/certbot/conf/live/{args.domain}/fullchain.pem"):
        run_command("docker compose up -d")
    else:
        run_command("./init-letsencrypt.sh")

if __name__ == "__main__":
    main()