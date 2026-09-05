function normalizeRegistrationInput(body) {
  const input = {};

  for (const [key, value] of Object.entries(body || {})) {
    if (typeof value === "string") {
      input[key] = value.trim();
    }
  }

  input.username = String(input.username || "").toLowerCase();
  input.password = String(input.password || "");

  return input;
}

module.exports = { normalizeRegistrationInput };
