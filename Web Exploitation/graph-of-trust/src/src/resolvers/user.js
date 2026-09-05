const { requireUser } = require("../auth");

const userResolvers = {
  department: async (user, _, ctx) => {
    return ctx.db.getDepartment(user.departmentId);
  },

  manager: async (user, _, ctx) => {
    requireUser(ctx);

    if (!user.managerId) {
      return null;
    }

    const manager = ctx.db.getUser(user.managerId);

    if (!manager) {
      return null;
    }

    return manager;
  },

  profile: async (user, _, ctx) => {
    return ctx.db.getProfile(user.profileId);
  },

  payroll: async (user, _, ctx) => {
    requireUser(ctx);

    if (ctx.user.id !== user.id && ctx.user.role !== "ADMIN") {
      throw new Error("Forbidden");
    }

    return ctx.db.getPayrollRecord(user.id);
  }
};

module.exports = { userResolvers };
