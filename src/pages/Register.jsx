import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Register = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
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

    const { username, email, password, repeatPassword } = formData;

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required!");
      setTimeout(() => setError(""), 3000);
      setIsSubmitting(false);
      return;
    }
    if (password !== repeatPassword) {
      setError("Passwords do not match!");
      setTimeout(() => setError(""), 3000);
      setIsSubmitting(false);
      return;
    }
    if (!email.includes("@")) {
      setError("Enter a valid email!");
      setTimeout(() => setError(""), 3000);
      setIsSubmitting(false);
      return;
    }

    try {
      await register(email, password, username);

      setError("");
      setFormData({
        username: "",
        email: "",
        password: "",
        repeatPassword: "",
      });

      navigate("/");
    } catch (error) {
      setError(error.message);
      console.error("Firebase register error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl">
      <h1 className="text-center font-bold text-2xl mt-10 p-4">
        Register Page
      </h1>

      {error && (
        <p className="text-red-400 text-2xl text-center font-bold">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 p-4">
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="enter username"
            value={formData.username}
            onChange={handleChangeForm}
            className="border w-full rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="enter email"
            value={formData.email}
            onChange={handleChangeForm}
            className="border w-full rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="enter password"
            value={formData.password}
            onChange={handleChangeForm}
            className="border w-full rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="repeatPassword">Confirm-Password</label>
          <input
            type="password"
            id="repeatPassword"
            name="repeatPassword"
            placeholder="confirm-password"
            value={formData.repeatPassword}
            onChange={handleChangeForm}
            className="border w-full rounded p-2"
          />
        </div>

        <button
          className="bg-blue-500 rounded p-2 mx-auto hover:bg-blue-800 text-white transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Register..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
