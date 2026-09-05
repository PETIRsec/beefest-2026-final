const bcrypt = require("bcryptjs");

function buildSeed() {
  const flag = process.env.FLAG || "BeeCTF{kat4_auric_harus_c0b4_sancha_tap1_aku_ootea_t3rus}";

  return {
    departments: [
      {
        id: "10",
        name: "Engineering"
      },
      {
        id: "20",
        name: "Operations"
      }
    ],

    users: [
      {
        id: "1",
        username: "administrator",
        passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || "admin-local-only", 10),
        role: "ADMIN",
        displayName: "Ada Lovelace",
        departmentId: "10",
        profileId: "1",
        managerId: null
      },
      {
        id: "3",
        username: "alice",
        passwordHash: bcrypt.hashSync(process.env.ALICE_PASSWORD || "alice-local-only", 10),
        role: "USER",
        displayName: "Alice Chen",
        departmentId: "10",
        profileId: "3",
        managerId: "1"
      },
      {
        id: "4",
        username: "morgan",
        passwordHash: bcrypt.hashSync(process.env.MORGAN_PASSWORD || "morgan-local-only", 10),
        role: "USER",
        displayName: "Morgan Shah",
        departmentId: "20",
        profileId: "4",
        managerId: null
      }
    ],

    profiles: [
      {
        id: "1",
        bio: "Maintains internal platform reliability and production access reviews."
      },
      {
        id: "3",
        bio: "Backend engineer focused on search and observability."
      },
      {
        id: "4",
        bio: "Coordinates office operations and vendor onboarding."
      }
    ],

    privateRecords: [
      {
        profileId: "1",
        salary: "USD 215,000",
        dateOfBirth: "1979-12-10",
        bankAccount: "110000000-000000001041",
        flag
      },
      {
        profileId: "3",
        salary: "USD 128,000",
        dateOfBirth: "1994-03-18",
        bankAccount: "110000000-000000007724",
        flag: "-"
      },
      {
        profileId: "4",
        salary: "USD 91,000",
        dateOfBirth: "1988-09-02",
        bankAccount: "110000000-000000003508",
        flag: "-"
      }
    ],

    payrollRecords: [
      {
        userId: "1",
        salary: "USD 215,000",
        bankAccount: "110000000-000000001041",
        lastUpdated: "2026-07-14"
      },
      {
        userId: "3",
        salary: "USD 128,000",
        bankAccount: "110000000-000000007724",
        lastUpdated: "2026-07-18"
      },
      {
        userId: "4",
        salary: "USD 91,000",
        bankAccount: "110000000-000000003508",
        lastUpdated: "2026-07-09"
      }
    ]
  };
}

module.exports = { buildSeed };
