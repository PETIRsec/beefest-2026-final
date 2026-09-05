const { requireUser } = require("../auth");

const departmentResolvers = {
  employees: async (department, _, ctx) => {
    requireUser(ctx);

    const employees = ctx.db.getUsersByDepartment(department.id);

    if (ctx.user.role === "ADMIN") {
      return employees;
    }

    return employees.filter((employee) => employee.role !== "ADMIN");
  }
};

module.exports = { departmentResolvers };
