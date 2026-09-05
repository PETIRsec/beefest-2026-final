const path = require("path");
const cors = require("cors");
const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");
const { ApolloServerPluginLandingPageLocalDefault } = require("@apollo/server/plugin/landingPage/default");
const { getUserFromRequest, hashPassword, signUser, verifyPassword } = require("./auth");
const { createDatabase } = require("./db");
const { normalizeRegistrationInput } = require("./registration");
const { resolvers } = require("./resolvers");
const { buildSeed } = require("./seed");
const { typeDefs } = require("./schema");

async function main() {
  const db = createDatabase(buildSeed());
  const app = express();
  const port = Number(process.env.PORT || 3000);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })]
  });

  await server.start();

  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "..", "public")));

  app.post("/api/register", async (req, res) => {
    const input = normalizeRegistrationInput(req.body);
    const departmentId = input.departmentId || "20";

    if (!/^[a-z0-9_.-]{3,32}$/.test(input.username)) {
      return res.status(400).json({ error: "Username must be 3-32 characters: letters, numbers, dot, underscore, or dash." });
    }

    if (!db.getDepartment(departmentId)) {
      return res.status(400).json({ error: "Unknown department." });
    }

    if (db.getUserByUsername(input.username)) {
      return res.status(409).json({ error: "Username already exists." });
    }

    const user = db.createRegisteredUser({
      ...input,
      passwordHash: await hashPassword(input.password),
      departmentId
    });

    return res.status(201).json({
      token: signUser(user),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        displayName: user.displayName
      }
    });
  });

  app.post("/api/login", async (req, res) => {
    const username = String(req.body?.username || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    const user = db.getUserByUsername(username);

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    return res.json({
      token: signUser(user),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        displayName: user.displayName
      }
    });
  });

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => ({
        db,
        user: getUserFromRequest(req, db)
      })
    })
  );

  app.listen(port, () => {
    console.log(`Graph of Trust running at http://localhost:${port}`);
    console.log(`GraphQL endpoint available at http://localhost:${port}/graphql`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
