import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const { email, password } = formData;

    if (!email.trim() || !password.trim()) {
      setError("All fields are required!");
      setIsSubmitting(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Enter a valid email!");
      setIsSubmitting(false);
      return;
    }

    try {
      const userCredential = await login(email, password);
      
      setFormData({ email: "", password: "" });
      navigate("/");
    } catch (error) {
      console.error("Login error:", error.code);
      if (error.code === "auth/user-not-found") {
        setError("User not found.");
      } else if (error.code === "auth/invalid-credential") {
        setError("Invalid credentials provided.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white mx-auto rounded">
      <h1 className="text-2xl text-center font-bold mt-10 p-4">Login Page</h1>

      {error && (
        <p className="text-red-400 text-2xl text-center font-bold">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4 p-2">
        <div className="w-full p-2">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="enter email"
            value={formData.email}
            onChange={handleChangeForm}
            className="border rounded w-full p-2"
          />
        </div>
        <div className="w-full p-2">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="enter password"
            value={formData.password}
            onChange={handleChangeForm}
            className="border rounded w-full p-2"
          />
        </div>
        <button
          className="bg-blue-500 text-white p-2 px-4 mx-auto rounded hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="w-full flex flex-col p-2 mx-auto gap-2">
        <p className="text-center">Don't have a registration?</p>
        <Link
          to="/register"
          className="text-center rounded mx-auto p-2 underline hover:bg-blue-200"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
