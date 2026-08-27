import json
import sys
import subprocess
import os

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
    errcode = os.system(f"ctf challenge install \"{path}\"")
elif status == "update":
    errcode = os.system(f"ctf challenge sync \"{path}\"")

if errcode != 0:
    print("[+] Error installing or syncing", flush=True)
    sys.exit(1)

res[path] = now
open("done_install.json", "w").write(json.dumps(res))