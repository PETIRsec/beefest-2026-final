import hashlib
import hmac
import secrets
import threading
import time

from flask import Flask, jsonify, request

app = Flask(__name__)

# --- Config (mirrored from native-lib.cpp constants) ---
INIT_HMAC_KEY  = "1n1t_k3y_n1k4h_2026"
NONCE_SIGN_KEY = "n0nc3_s1gn_s3cr3t_x"
DEFUSE_KEY     = "d3fus3_k3y_s3cr3t_y"
KILL_SW_SALT   = "4nd4ng4n_s4lt_2026"
PACKAGE_NAME   = "com.undangan.nikah"
FLAG           = "BeeCTF{bangjangangitubanginibeneransuratundangannikahkokbukanmalwareplispercayasamaaplikasiakubang:pray}"
NONCE_TTL      = 1800  # 30 minutes

# In-memory nonce store: {nonce: expires_at}
_nonces: dict[str, float] = {}
_lock   = threading.Lock()


# ---- Helpers ----

def _hmac_hex(key: str, msg: str) -> str:
    return hmac.new(key.encode(), msg.encode(), hashlib.sha256).hexdigest()


def _issue_nonce(device_id: str) -> str:
    nonce = secrets.token_hex(16)
    sig   = _hmac_hex(NONCE_SIGN_KEY, f"{nonce}:{device_id}")
    with _lock:
        # Evict expired entries on each issue
        now = time.time()
        expired = [k for k, v in _nonces.items() if v < now]
        for k in expired:
            del _nonces[k]
        # Hard cap: prevent memory DoS (1000 active nonces is absurd for a CTF)
        if len(_nonces) >= 1000:
            return None
        _nonces[nonce] = now + NONCE_TTL
    return f"{nonce}:{sig}"


def _verify_nonce(nonce_token: str, device_id: str) -> tuple[bool, str]:
    """Verify nonce signature and TTL WITHOUT consuming it. Returns (ok, raw_nonce)."""
    parts = nonce_token.split(":", 1)
    if len(parts) != 2:
        return False, ""
    nonce, sig = parts
    expected = _hmac_hex(NONCE_SIGN_KEY, f"{nonce}:{device_id}")
    if not hmac.compare_digest(sig, expected):
        return False, ""
    with _lock:
        exp = _nonces.get(nonce)
        if exp is None or time.time() > exp:
            return False, ""
    return True, nonce


def _consume_nonce(nonce: str) -> bool:
    """Mark nonce as consumed (single-use). Call only after full validation succeeds."""
    with _lock:
        if nonce not in _nonces:
            return False
        del _nonces[nonce]
    return True


def _kill_switch_token() -> str:
    """Server-side recomputation of what the APK derives natively."""
    raw = hashlib.sha256(f"{PACKAGE_NAME}{KILL_SW_SALT}".encode()).hexdigest()
    return raw[:32]


# ---- Routes ----

@app.route("/health")
def health():
    return jsonify({"ok": True})


@app.route("/api/v1/register", methods=["POST"])
def register():
    """
    APK calls this at startup to obtain a session nonce.
    Body: { "d": device_id, "t": unix_timestamp, "s": HMAC-SHA256(d+t, INIT_HMAC_KEY) }
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"e": "bad_request"}), 400

    device_id = str(data.get("d", ""))
    timestamp = data.get("t", 0)
    sig       = str(data.get("s", ""))

    try:
        timestamp = int(timestamp)
    except (TypeError, ValueError):
        return jsonify({"e": "bad_request"}), 400

    if abs(time.time() - timestamp) > 300:
        return jsonify({"e": "expired"}), 400

    expected = _hmac_hex(INIT_HMAC_KEY, f"{device_id}{timestamp}")
    if not hmac.compare_digest(sig, expected):
        return jsonify({"e": "forbidden"}), 403

    nonce_token = _issue_nonce(device_id)
    if nonce_token is None:
        return jsonify({"e": "server_busy"}), 503
    return jsonify({"n": nonce_token})


@app.route("/api/v1/redeem", methods=["POST"])
def redeem():
    """
    APK calls this after a successful defuse.
    Body: { "d": device_id, "n": nonce_token, "k": defuse_token }

    defuse_token = HMAC-SHA256(device_id + raw_nonce + kill_switch_token, DEFUSE_KEY)
    kill_switch_token = SHA256(package_name + KILL_SW_SALT)[:32]
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"e": "bad_request"}), 400

    device_id   = str(data.get("d", ""))
    nonce_token = str(data.get("n", ""))
    token       = str(data.get("k", ""))

    # Verify nonce first (without consuming)
    ok, raw_nonce = _verify_nonce(nonce_token, device_id)
    if not ok:
        return jsonify({"e": "invalid_nonce"}), 403

    # Verify defuse token
    ks_token = _kill_switch_token()
    expected = _hmac_hex(DEFUSE_KEY, f"{device_id}{raw_nonce}{ks_token}")
    if not hmac.compare_digest(token, expected):
        return jsonify({"e": "invalid_token"}), 403

    # Only consume nonce after ALL validation passes
    if not _consume_nonce(raw_nonce):
        return jsonify({"e": "invalid_nonce"}), 403

    return jsonify({"f": FLAG})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
