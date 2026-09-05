const profileResolvers = {
  privateRecord: async (profile, _, ctx) => {
    return ctx.db.getPrivateRecord(profile.id);
  }
};

module.exports = { profileResolvers };
