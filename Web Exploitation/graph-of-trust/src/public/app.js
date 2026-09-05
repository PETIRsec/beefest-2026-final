const loginPanel = document.querySelector("#login-panel");
const loginForm = document.querySelector("#login-form");
const loginError = document.querySelector("#login-error");
const passwordInput = document.querySelector("#password");
const primaryAuthButton = document.querySelector("#primary-auth-button");
const authModeToggle = document.querySelector("#auth-mode-toggle");
const directory = document.querySelector("#directory");
const currentUser = document.querySelector("#current-user");
const directoryTab = document.querySelector("#directory-tab");
const profileTab = document.querySelector("#profile-tab");
const directoryPage = document.querySelector("#directory-page");
const profilePage = document.querySelector("#profile-page");
const departmentName = document.querySelector("#department-name");
const rosterSummary = document.querySelector("#roster-summary");
const employeeList = document.querySelector("#employee-list");
const profileName = document.querySelector("#profile-name");
const profileUsername = document.querySelector("#profile-username");
const profileBio = document.querySelector("#profile-bio");
const profileForm = document.querySelector("#profile-form");
const profileUsernameInput = document.querySelector("#profile-username-input");
const profileBioInput = document.querySelector("#profile-bio-input");
const profileStatus = document.querySelector("#profile-status");
const privateRecordButton = document.querySelector("#private-record-button");
const privateRecord = document.querySelector("#private-record");
const logoutButton = document.querySelector("#logout");

let token = window.localStorage.getItem("token");
let employees = [];
let selectedEmployee = null;
let authMode = "register";
let currentEmployee = null;

async function graphql(query, variables = {}) {
  const response = await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ query, variables })
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors.map((error) => error.message).join(", "));
  }

  return result.data;
}

function setAuthMode(mode) {
  authMode = mode;
  const registering = authMode === "register";

  passwordInput.autocomplete = registering ? "new-password" : "current-password";
  primaryAuthButton.textContent = registering ? "Create account" : "Sign in";
  authModeToggle.textContent = registering ? "Sign in instead" : "Create account instead";
  loginError.textContent = "";
}

function renderProfile(employee) {
  selectedEmployee = employee;
  profileName.textContent = employee.displayName;
  profileUsername.textContent = `@${employee.username}`;
  profileBio.textContent = employee.profile.bio || "";
  privateRecord.replaceChildren();

  document.querySelectorAll(".employee-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.id === employee.id);
  });
}

function setView(view) {
  const showingProfile = view === "profile";

  profilePage.classList.toggle("hidden", !showingProfile);
  directoryPage.classList.toggle("hidden", showingProfile);
  profileTab.classList.toggle("active", showingProfile);
  directoryTab.classList.toggle("active", !showingProfile);
}

function addPrivateRow(label, value) {
  const row = document.createElement("p");
  const strong = document.createElement("strong");
  const text = document.createTextNode(value || "not set");

  strong.textContent = `${label}: `;
  row.append(strong, text);
  privateRecord.append(row);
}

async function openPrivateRecord() {
  if (!selectedEmployee) {
    return;
  }

  privateRecord.replaceChildren();
  privateRecordButton.disabled = true;

  try {
    const data = await graphql(
      `
        query PrivateRecord($id: ID!) {
          employee(id: $id) {
            profile {
              privateRecord {
                salary
                dateOfBirth
                bankAccount
                flag
              }
            }
          }
        }
      `,
      { id: selectedEmployee.id }
    );

    const employee = data.employee;
    const record = employee.profile.privateRecord;

    addPrivateRow("Salary", record.salary);
    addPrivateRow("Date of birth", record.dateOfBirth);
    addPrivateRow("Bank account", record.bankAccount);
    addPrivateRow("Flag", record.flag);
  } catch (error) {
    const denied = document.createElement("p");
    denied.className = "error";
    denied.textContent = `Private record access denied for @${selectedEmployee.username}.`;
    privateRecord.append(denied);
  } finally {
    privateRecordButton.disabled = false;
  }
}

function renderDirectory(data) {
  const me = data.me;
  currentEmployee = me;
  employees = me.department.employees;

  currentUser.textContent = `${me.displayName} (@${me.username})`;
  departmentName.textContent = me.department.name;
  rosterSummary.textContent = `${employees.length} visible employee${
    employees.length === 1 ? "" : "s"
  } in this department.`;
  profileUsernameInput.value = me.username;
  profileBioInput.value = me.profile.bio || "";
  profileStatus.textContent = "";
  employeeList.replaceChildren();

  employees.forEach((employee) => {
    const button = document.createElement("button");
    const name = document.createElement("span");
    const username = document.createElement("small");

    button.type = "button";
    button.className = "employee-button";
    button.dataset.id = employee.id;
    name.textContent = employee.displayName;
    username.textContent = `@${employee.username}`;

    button.append(name, username);
    button.addEventListener("click", () => renderProfile(employee));
    employeeList.append(button);
  });

  renderProfile(employees.find((employee) => employee.id === me.id) || employees[0]);
  loginPanel.classList.add("hidden");
  directory.classList.remove("hidden");
  setView("directory");
}

async function loadDirectory() {
  const data = await graphql(`
    query Directory {
      me {
        id
        username
        displayName
        profile {
          bio
        }
        department {
          id
          name
          employees {
            id
            username
            displayName
            profile {
              bio
            }
          }
        }
      }
    }
  `);

  renderDirectory(data);
}

privateRecordButton.addEventListener("click", openPrivateRecord);

directoryTab.addEventListener("click", () => setView("directory"));
profileTab.addEventListener("click", () => setView("profile"));

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  profileStatus.textContent = "";

  const bio = profileBioInput.value;

  try {
    const data = await graphql(
      `
        mutation UpdateProfile($input: UpdateProfileInput!) {
          updateProfile(input: $input) {
            bio
          }
        }
      `,
      { input: { bio } }
    );

    if (currentEmployee) {
      currentEmployee.profile.bio = data.updateProfile.bio;
    }

    employees = employees.map((employee) => {
      if (currentEmployee && employee.id === currentEmployee.id) {
        return {
          ...employee,
          profile: {
            ...employee.profile,
            bio: data.updateProfile.bio
          }
        };
      }

      return employee;
    });

    if (selectedEmployee && currentEmployee && selectedEmployee.id === currentEmployee.id) {
      renderProfile(employees.find((employee) => employee.id === currentEmployee.id));
    }

    profileStatus.textContent = "Saved.";
  } catch (error) {
    profileStatus.textContent = "Could not save profile.";
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.textContent = "";

  const form = new FormData(loginForm);
  const endpoint = authMode === "register" ? "/api/register" : "/api/login";
  const payload = {
    username: form.get("username"),
    password: form.get("password")
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    loginError.textContent = result?.error || "Authentication failed.";
    return;
  }

  const data = await response.json();
  token = data.token;
  window.localStorage.setItem("token", token);
  await loadDirectory();
});

authModeToggle.addEventListener("click", () => {
  setAuthMode(authMode === "register" ? "login" : "register");
});

logoutButton.addEventListener("click", () => {
  token = null;
  employees = [];
  selectedEmployee = null;
  currentEmployee = null;
  window.localStorage.removeItem("token");
  directory.classList.add("hidden");
  loginPanel.classList.remove("hidden");
});

if (token) {
  loadDirectory().catch(() => {
    window.localStorage.removeItem("token");
    token = null;
  });
}

setAuthMode("register");
