import { loginUser } from "../services/authService";

const handleLogin = async () => {
  const { data, error } = await loginUser(email, password);

  if (error) return alert(error.message);

  const role = data.user.user_metadata?.role;

  if (role === "admin") {
    navigate("/admin");
  } else {
    navigate("/dashboard");
  }
};