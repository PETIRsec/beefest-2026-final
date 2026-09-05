const { requireUser } = require("../auth");

const queryResolvers = {
  me: async (_, __, ctx) => {
    requireUser(ctx);
    return ctx.user;
  },

  employee: async (_, { id }, ctx) => {
    requireUser(ctx);

    const employee = ctx.db.getUser(id);

    if (!employee) {
      return null;
    }

    if (ctx.user.id !== employee.id && ctx.user.role !== "ADMIN") {
      throw new Error("Forbidden");
    }

    return employee;
  },

  searchEmployees: async (_, { term }, ctx) => {
    requireUser(ctx);

    return ctx.db.searchUsers(term).filter((employee) => employee.role !== "ADMIN");
  }
};

module.exports = { queryResolvers };
