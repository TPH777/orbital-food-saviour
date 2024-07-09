export const getErrorMessage = (error: any) => {
  switch (error.code) {
    case "auth/invalid-credential":
      return "Invalid credentials. Please check your email and password.";
    case "auth/invalid-email":
      return "Invalid email address.";
    default:
      return error.message;
  }
};
