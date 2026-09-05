const { requireUser } = require("../auth");

const mutationResolvers = {
  updateProfile: async (_, { input }, ctx) => {
    requireUser(ctx);

    return ctx.db.updateProfile(ctx.user.profileId, {
      bio: input.bio
    });
  }
};

module.exports = { mutationResolvers };
