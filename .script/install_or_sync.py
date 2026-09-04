import json
import sys
import subprocess


def run_ctf(action, challenge_path):
    result = subprocess.run(
        ["ctf", "challenge", action, challenge_path],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )
    if result.stdout:
        print(result.stdout, end="", flush=True)
    return result.returncode, result.stdout or ""


def should_install_after_sync_error(output):
    return (
        "Could not find existing challenge" in output
        and "Perhaps you meant install instead of sync" in output
    )


try:
    res = open("done_install.json", "r").read()
except:
    print("done_install.json not found, creating new one", flush=True)
    open("done_install.json", "w").write("{}")
    res = "{}"

res = json.loads(res)
path = sys.argv[1]
print("[+] checking", path, end=", ", flush=True)
now = subprocess.check_output(f"git log -n 1 --pretty=format:\"%H\" \"{path}\"", shell=True).decode("utf-8")
last = res.get(path)
status = ""
if last == None:
    print("New challenges, installing", flush=True)
    status = "install"
elif last == now:
    print("No changes", flush=True)
    status = "nochange"
    sys.exit(0)
elif last != now:
    print("Changes detected", flush=True)
    status = "update"

if status == "install":
    errcode, _ = run_ctf("install", path)
elif status == "update":
    errcode, output = run_ctf("sync", path)
    if errcode != 0 and should_install_after_sync_error(output):
        print("[+] Existing challenge was not found in CTFd, installing instead", flush=True)
        errcode, _ = run_ctf("install", path)

if errcode != 0:
    print("[+] Error installing or syncing", flush=True)
    sys.exit(1)

res[path] = now
open("done_install.json", "w").write(json.dumps(res))
