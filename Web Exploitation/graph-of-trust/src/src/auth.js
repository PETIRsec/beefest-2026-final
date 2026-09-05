const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");

function signUser(user) {
  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
}

function getBearerToken(req) {
  const header = req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) {
    return null;
  }

  return header.slice("Bearer ".length);
}

function getUserFromRequest(req, db) {
  const token = getBearerToken(req);

  if (!token) {
    return null;
  }

  try {
    const claims = jwt.verify(token, JWT_SECRET);
    return db.getUser(claims.sub);
  } catch {
    return null;
  }
}

async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

function requireUser(ctx) {
  if (!ctx.user) {
    throw new Error("Authentication required");
  }
}

module.exports = {
  getUserFromRequest,
  hashPassword,
  requireUser,
  signUser,
  verifyPassword
};
