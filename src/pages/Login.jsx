import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const api_url = import.meta.env.VITE_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();


  const handleChangeForm = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { email, password } = formData;

    if (!email.trim() || !password.trim()) {
      setError("All fields are require!");
      setTimeout(() => setError(""), 3000);
      setIsSubmitting(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Enter valid email!");
      setTimeout(() => setError(""), 3000);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${api_url}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsSubmitting(false);
        throw new Error(data.message || "Login failed");
      }

      login(data.user);
      setError("");

      setFormData({
        email: "",
        password: "",
      });

      navigate("/");
    } catch (error) {
      setError(error.message);
      console.error("Login  error", error);
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
        <button className="bg-blue-500 text-white p-2 px-4 mx-auto rounded   hover:bg-blue-700">
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