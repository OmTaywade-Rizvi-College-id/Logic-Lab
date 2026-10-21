
const ACCOUNT_KEY = "logic_lab_local_account";
const SESSION_COOKIE = "logic_lab_user";

type LocalAccount = {
  username: string;
  email: string;
  passwordHash: string;
  salt: string;
};

async function hashPassword(password: string, salt: string) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function createSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));

  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function readAccount(): LocalAccount | null {
  try {
    const value = localStorage.getItem(ACCOUNT_KEY);
    return value ? (JSON.parse(value) as LocalAccount) : null;
  } catch {
    return null;
  }
}

function setSession(email: string) {
  document.cookie =
    `${SESSION_COOKIE}=${encodeURIComponent(email)}; ` +
    "Path=/; SameSite=Lax; Max-Age=86400";
}

export async function signup(
  username: string,
  email: string,
  password: string
) {
  const normalizedEmail = email.trim().toLowerCase();

  if (username.trim().length < 2) {
    throw new Error("Username must contain at least 2 characters.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error("Enter a valid email address.");
  }

  if (password.length < 8 || password.length > 72) {
    throw new Error("Password must contain 8 to 72 characters.");
  }

  if (readAccount()) {
    throw new Error("A local account already exists in this browser.");
  }

  const salt = createSalt();
  const passwordHash = await hashPassword(password, salt);

  const account: LocalAccount = {
    username: username.trim(),
    email: normalizedEmail,
    passwordHash,
    salt,
  };

  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  setSession(normalizedEmail);

  return { username: account.username, email: account.email };
}

export async function login(email: string, password: string) {
  const account = readAccount();
  const normalizedEmail = email.trim().toLowerCase();

  if (!account || account.email !== normalizedEmail) {
    throw new Error("Invalid email or password.");
  }

  const passwordHash = await hashPassword(password, account.salt);

  if (passwordHash !== account.passwordHash) {
    throw new Error("Invalid email or password.");
  }

  setSession(account.email);

  return { username: account.username, email: account.email };
}

export function logout() {
  document.cookie =
    `${SESSION_COOKIE}=; Path=/; SameSite=Lax; Max-Age=0`;
}

export function getLocalUser() {
  const account = readAccount();

  if (!account) return null;

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${SESSION_COOKIE}=`));

  if (!cookie) return null;

  const email = decodeURIComponent(
    cookie.slice(SESSION_COOKIE.length + 1)
  );

  if (email !== account.email) return null;

  return { username: account.username, email: account.email };
}