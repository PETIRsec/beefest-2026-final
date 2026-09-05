function createDatabase(seed) {
  const users = new Map(seed.users.map((user) => [String(user.id), user]));
  const departments = new Map(seed.departments.map((department) => [String(department.id), department]));
  const profiles = new Map(seed.profiles.map((profile) => [String(profile.id), profile]));
  const privateRecords = new Map(
    seed.privateRecords.map((record) => [String(record.profileId), record])
  );
  const payrollRecords = new Map(
    seed.payrollRecords.map((record) => [String(record.userId), record])
  );
  let nextUserId = Math.max(...Array.from(users.keys()).map(Number)) + 1;
  let nextProfileId = Math.max(...Array.from(profiles.keys()).map(Number)) + 1;

  return {
    getUser(id) {
      return users.get(String(id)) || null;
    },

    getUserByUsername(username) {
      return Array.from(users.values()).find((user) => user.username === username) || null;
    },

    getUserByProfileId(profileId) {
      return Array.from(users.values()).find((user) => String(user.profileId) === String(profileId)) || null;
    },

    createRegisteredUser({ username, passwordHash, departmentId = "20" }) {
      const id = String(nextUserId++);
      const profileId = String(nextProfileId++);

      const user = {
        id,
        username,
        passwordHash,
        role: "USER",
        displayName: username,
        departmentId,
        profileId,
        managerId: null
      };

      users.set(id, user);
      profiles.set(profileId, {
        id: profileId,
        bio: "Engineering employee profile pending completion."
      });
      privateRecords.set(profileId, {
        profileId,
        salary: "USD 92,000",
        dateOfBirth: "1998-04-12",
        bankAccount: "021000021-000123456789",
        flag: "-"
      });
      payrollRecords.set(id, {
        userId: id,
        salary: "USD 92,000",
        bankAccount: "021000021-000123456789",
        lastUpdated: "2026-08-01"
      });

      return user;
    },

    searchUsers(term) {
      const normalizedTerm = String(term || "").trim().toLowerCase();

      if (!normalizedTerm) {
        return [];
      }

      return Array.from(users.values()).filter((user) => {
        return (
          user.username.toLowerCase().includes(normalizedTerm) ||
          user.displayName.toLowerCase().includes(normalizedTerm)
        );
      });
    },

    getDepartment(id) {
      return departments.get(String(id)) || null;
    },

    getUsersByDepartment(departmentId) {
      return Array.from(users.values()).filter(
        (user) => String(user.departmentId) === String(departmentId)
      );
    },

    getProfile(id) {
      return profiles.get(String(id)) || null;
    },

    getPrivateRecord(profileId) {
      return privateRecords.get(String(profileId)) || null;
    },

    getPayrollRecord(userId) {
      return payrollRecords.get(String(userId)) || null;
    },

    updateProfile(id, patch) {
      const current = profiles.get(String(id));

      if (!current) {
        return null;
      }

      const next = {
        ...current,
        ...patch
      };

      profiles.set(String(id), next);
      return next;
    }
  };
}

module.exports = { createDatabase };
