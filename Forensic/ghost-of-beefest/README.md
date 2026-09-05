# Ghost of Beefest — Forensics Writeup

## Soal
Tools "pembersih storage" yang diunduh Brian ternyata ransomware: mengenkripsi
file di server, lalu mengenkripsi disknya sendiri (LUKS). Diberikan RAM dump
dan disk LUKS yang terenkripsi. Tugas: cari key LUKS, buka disknya, temukan
malware yang sudah dihapus attacker, lalu ambil flag dari dalamnya.

## Evidence
| File | Ukuran | Kegunaan |
|---|---|---|
| `evidence1.vmem` | 4 GB | RAM dump (VM Linux `aren-server`, user `arenaru`) |
| `evidence1.vmss` | 5.7 MB | VMware suspend state (pelengkap memori) |
| `evidence2.dat` | 50 MB | Disk LUKS2 terenkripsi |

---

## 1. Cari key LUKS di memory

RAM dump adalah tempat terbaik karena attacker mengetik passphrase secara live.
Pakai **Volatility3**, plugin `linux.bash.Bash`, buat recover history bash
langsung dari struktur memory proses `bash` (lebih akurat daripada `strings`
karena ngikutin struktur history buffer, bukan nebak dari raw text).

```bash
vol -f evidence1.vmem  -u https://github.com/Abyss-W4tcher/volatility3-symbols/raw/master/banners/banners.json linux.bash.Bash
```

Kalau mau cross-check / cari proses & environment variable-nya juga:

```bash
vol -f evidence1.vmem linux.pslist.PsList        # cari PID bash/cryptsetup
vol -f evidence1.vmem linux.psaux.PsAux            # command line lengkap tiap proses
vol -f evidence1.vmem linux.envars.Envars --pid <PID>   # cek VAULT_TOKEN di environment
```

Ketemu bash history attacker:

```
read -s VAULT_TOKEN
VAULT_TOKEN=bintang123#
echo -n "$VAULT_TOKEN" > /dev/shm/.ram_key
sudo cryptsetup luksOpen cache_data.dat hidden_vault --key-file /dev/shm/.ram_key
```

**Key LUKS: `bintang123#`**

## 2. Decrypt disk

```bash
printf 'bintang123#' > key.txt
sudo cryptsetup open --key-file key.txt evidence2.dat vault
# -> /dev/mapper/vault (ext4)
```

## 3. Analisa disk dengan Autopsy

1. Buka Autopsy → **New Case** → tambahkan **Data Source** → pilih *Logical File* / *Disk Image*, arahkan ke `/dev/mapper/vault` (atau dd image dari device tersebut).
2. Jalankan ingest module standar (File Type Identification, Recent Activity, dst).
3. Di panel kiri, buka **Data Sources → vault**, review isi filesystem:
   - `README.txt` — pesan ransom: *"Don't bother looking for the malware, I already wiped the binary from this disk."*
   - `*.enc` files (file korban yang sudah dienkripsi)
4. Buka tab **Deleted Files** (di bawah data source) — di sinilah hint README kepake: malware sudah dihapus dari disk, jadi harus dicari di sini.
5. Sort/filter deleted files by **File Type**, cari yang punya extracted content bertipe **ELF / executable**. Autopsy biasanya tetap bisa carve & preview file yang belum ke-overwrite blocknya.
6. Klik kanan file ELF yang ditemukan → **Extract File(s)** untuk export ke disk lokal (misal `malware_full.bin`).

## 4. Analisa ELF dengan Ghidra

- Import `malware_full.bin` ke Ghidra, auto-analyze.
- Cari fungsi enkripsi file.
- Di situ juga ada string ter-obfuscate (XOR) di `.rodata`. Trace disassembly untuk nemu byte key XOR-nya (misal `xor eax, 0x55`). Basically key nya adalah flagnya.

## 5. Decode flag

```python
key = 0x55
flag = bytes(b ^ key for b in ciphertext)
```

**Flag:** `BEECTF{th1s_1s_n0t_a_d3c0y_#realflag_#congratulationyougottheflag!!!}`

---

## Flow ringkas

```
evidence1.vmem --volatility3 linux.bash.Bash--> key LUKS = 'bintang123#'
evidence2.dat --cryptsetup open--> /dev/mapper/vault
      --Autopsy: browse--> README.txt (hint: malware dihapus)
      --Autopsy: Deleted Files--> carve ELF (malware_full.bin)
      --Ghidra: reverse--> XOR key ditemukan
      --decode .rodata--> FLAG
```