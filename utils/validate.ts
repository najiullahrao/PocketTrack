export const validateSignup = ({ name, email, password, confirmPassword }: any) => {
    if (!name || !email || !password || !confirmPassword) return "All fields are required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  };
  