import json
import sys
import subprocess
import os

try:
    res = open("done.json", "r").read()
except:
    print("done.json not found, creating new one", flush=True)
    open("done.json", "w").write("{}")
    res = "{}"

res = json.loads(res)
path = sys.argv[1]
print("checking", path, end=", ", flush=True)
now = subprocess.check_output(f"git log -n 1 --pretty=format:\"%H\" \"{path}\"", shell=True).decode("utf-8")
last = res.get(path)
if last == now:
    print("No changes", flush=True)
    sys.exit(0)

print("Changes detected", flush=True)
if os.path.exists(f"{path}/start.sh"):
    os.system(f'chmod +x "{path}/start.sh"')
    errcode = os.system(f"cd \"{path}\" && ./start.sh")
    if errcode != 0:
        print("Error executing script", flush=True)
        sys.exit(1)
    else:
        print("Script executed successfully", flush=True)

else:
    print("No start.sh file found, continuing...", flush=True)

res[path] = now
open("done.json", "w").write(json.dumps(res))