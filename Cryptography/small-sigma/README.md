# small sigma

cryptography - RSA low public exponent

- RSA low public exponent
- chall.py & output.txt untuk peserta

1. c = m^e mod n -> ini menunjukkan RSA biasa, tapi plaintext tidak langsung flag, bentuknya m = pad * 2^shift + sigma
2. Karena bagian atas plaintext pad diketahui, bagian bawahnya adalah salt, peserta bisa tahu semua bagian plaintext kecuali bagian kecil salt-nya.
3. Blob-nya tinggal di-reverse saja; saat di-reverse peserta mendapatkan n, e, c, pad, shift
4. Karena e-nya 3, n besar (ga realistis difaktorin), plaintext punya format yg diketahui, dan ciphertext cuma 1, ini biasanya disebut stereotyped message attack / coppersmith small root attack
5. Peserta juga bisa searching di internet untuk keyword-keyword challenge ini (contoh: rsa known prefix, e =3 rsa attack, small root rsa, sage solver rsa)

## logic math

jadi gini, dari `chall.py` kita dapet:

```text
c = m^e mod n
m = pad * 2^shift + sigma
```

c = m^e mod n -> ini RSA biasa. Tapi plaintextnya ngga langsung flag, dia dibentuk dari pad yg kita tau sama sigma.

nah karena `pad * 2^shift` itu udah diketahui, satu-satunya yg belum tau cuma sigma, anggap aja sigma ini variable x.

berarti:

```text
c = (pad * 2^shift + x)^e mod n
```

pindah ruas biar jadi polynomial:

```text
(pad * 2^shift + x)^e - c = 0 mod n
```

atau ditulis gini:

```text
f(x) = (pad * 2^shift + x)^e - c
```

sigma asli adalah akar dari polynomial ini modulo n

masalahnya, nyari akar polynomial modulo bilangan komposit besar itu susahh. solusinya pakai coppersmith, karena bisa nyari akar kecil dari polynomial modulo n

di challenge ini x = salt || flag, ukurannya masih kecil banget dibanding n

syarat buat univariate Coppersmith di RSA gini:

```text
x < n^(1/e)
```

karena e = 3 dan n sekitar 2304-bit:

```text
n^(1/3) sekitar 768 bit
```

bagian sigma cuma puluhan byte, masih jauh di bawah batas itu. Makanya small_roots() bisa dipakai.

## Flow Solve untuk Peserta

1. Buka `chall.py`.
2. Keliatan kan ini RSA, ada `n = p * q`, `e`, sama `pow(m, e, n)`.
3. `e = 3` -> low exponent RSA.
4. `m` dibentuk dari `pad` yang diketahui + bagian kecil rahasia:
   ```text
   m = pad * 2^shift + sigma
   ```
5. Bongkar `blob` dari `output.txt`.
6. Ambil `n`, `e`, `c`, `pad`, dan `shift`.
7. Anggap bagian rahasia itu variabel `x`.
8. Bentuk polynomial:
   ```text
   f(x) = (pad * 2^shift + x)^e - c
   ```
9. Pake Sage `small_roots()` buat nyari `x`.
10. Ubah hasil integer ke bytes sepanjang `shift // 8`.
11. Potong 6 byte salt di depan, sisanya flag.

## Important Links

- [SageMath `small_roots()` documentation](https://doc.sagemath.org/html/en/reference/polynomial_rings/sage/rings/polynomial/polynomial_modn_dense_ntl.html)
- [CTFtime RSA Small writeup](https://ctftime.org/writeup/32646)
- [squ1rrel CTF Partial RSA writeup](https://nightxade.github.io/ctf-writeups/writeups/2024/squ1rrel-CTF-2024/crypto/partial-rsa.html)
- [CTF Wiki RSA Coppersmith](https://ctfwiki.stinger.team/crypto/asymmetric/rsa/rsa_coppersmith_attack)