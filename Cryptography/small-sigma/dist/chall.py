from Crypto.Random import *
from Crypto.Util.number import *
from base64 import b85encode
from math import gcd
import json

flag = open("flag.txt", "rb").read().strip()

# what the sigma
sigma = get_random_bytes(6) + flag
shift = 8 * len(sigma)

e = 3
while True:
    p = getPrime(1152)
    q = getPrime(1152)
    phi = (p - 1) * (q - 1)
    if gcd(e, phi) == 1:
        break

n = p * q

pad = bytes_to_long(b"nota/" + get_random_bytes(180))
m = (pad << shift) + bytes_to_long(sigma)

assert m < n
assert shift < n.bit_length() // e - 220

c = pow(m, e, n)

data = {
    "n": n,
    "e": e,
    "c": c,
    "pad": pad,
    "shift": shift,
}

raw = json.dumps(data, separators=(",", ":")).encode()
blob = b85encode(raw)[::-1].decode()

open("output.txt", "w").write(f"blob = {blob!r}\n")






















# Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ
# Σ H#IgJG@>Q7ARlp/Dfp(CFD5T'/0K"JB5M'"@W-M Σ
# Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ Σ