const typeDefs = `#graphql
  enum Role {
    USER
    ADMIN
  }

  type Query {
    me: User!
    employee(id: ID!): User
    searchEmployees(term: String!): [User!]!
  }

  type User {
    id: ID!
    username: String!
    role: Role!
    displayName: String!
    department: Department!
    manager: User
    profile: Profile!
    payroll: PayrollRecord
  }

  type Department {
    id: ID!
    name: String!
    employees: [User!]!
  }

  type Profile {
    id: ID!
    bio: String
    privateRecord: PrivateRecord
  }

  type PrivateRecord {
    salary: String
    dateOfBirth: String
    bankAccount: String
    flag: String
  }

  type PayrollRecord {
    salary: String!
    bankAccount: String!
    lastUpdated: String!
  }

  type Mutation {
    updateProfile(input: UpdateProfileInput!): Profile!
  }

  input UpdateProfileInput {
    bio: String
  }
`;

module.exports = { typeDefs };
