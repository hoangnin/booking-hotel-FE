export const validateUsername = (username) => {
  if (!username.trim()) return "Username is required";
  if (username.length < 3 || username.length > 20)
    return "Username must be between 3 and 20 characters";
  return null;
};

export const validateEmail = (email) => {
  if (!email.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format";
  return null;
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8 || password.length > 30)
    return "Password must be between 8 and 30 characters";
  return null;
};
