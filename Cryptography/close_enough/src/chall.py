from Crypto.Util.number import bytes_to_long, getPrime
from math import gcd, isqrt

BITS = 768
UV_NUM, UV_DEN = 3, 4
ERROR_NUM, ERROR_DEN = 13, 8


def is_convergent(a, b, num, den):
    p0, p1, q0, q1 = 0, 1, 1, 0
    while b:
        z, r = divmod(a, b)
        a, b = b, r
        p0, p1 = p1, z * p1 + p0
        q0, q1 = q1, z * q1 + q0
        if p1 == num and q1 == den:
            return True
    return False


def factor_approximation(N, e, u, v):
    inner = (N * N + 1) ** 2 - e * u // v
    if inner <= 0:
        return None
    middle = isqrt(inner)
    if middle <= 2 * N:
        return None
    return (isqrt(2 * N + middle) + isqrt(-2 * N + middle)) // 2


with open("flag.txt", "rb") as f:
    flag = f.read().strip()

while True:
    p, q = getPrime(BITS // 2), getPrime(BITS // 2)
    if p < q:
        p, q = q, p
    N = p * q
    if N.bit_length() != BITS or p >= 2 * q:
        continue

    phi4 = (p**4 - 1) * (q**4 - 1)
    bound = (2 * N**4 - 49 * N**2 + 2) // (4 * N + 170 * N**2)
    uv_bits = BITS * UV_NUM // UV_DEN
    u, v = getPrime(uv_bits), getPrime(uv_bits - 2)
    if v >= u or u * v >= bound:
        continue

    residue = (-phi4 * v) % u
    scale = 1 << (BITS * ERROR_NUM // ERROR_DEN)
    target = v * scale
    w = residue + max(0, (target - residue) // u) * u
    e = (phi4 * v + w) // u
    if not 0 < e < phi4 or gcd(e, (p - 1) * (q - 1)) != 1:
        continue
    denominator = 2 * N**4 - 49 * N**2 + 2
    if not is_convergent(2 * e, denominator, v, u):
        continue

    approximation = factor_approximation(N, e, u, v)
    if approximation is None:
        continue
    error = p - approximation
    if not (1 << 80) < abs(error) < (1 << (BITS * 19 // 100)):
        continue
    break

m = bytes_to_long(flag)
assert m < N
c = pow(m, e, N)

print(f"N = {N}")
print(f"e = {e}")
print(f"c = {c}")
