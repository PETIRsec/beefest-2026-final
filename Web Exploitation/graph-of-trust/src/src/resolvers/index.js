const { departmentResolvers } = require("./department");
const { mutationResolvers } = require("./mutation");
const { profileResolvers } = require("./profile");
const { queryResolvers } = require("./query");
const { userResolvers } = require("./user");

const resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
  User: userResolvers,
  Department: departmentResolvers,
  Profile: profileResolvers
};

module.exports = { resolvers };
