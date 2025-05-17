import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import LoadingScreen from "../components/LoadingScreen";

const CreateDocument = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { user, loading } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <LoadingScreen />;
  }
  
  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, content } = formData;

    try {
      if (!user || !title.trim() || !content.trim()) {
        throw new Error("All fields are required!");
      }

      const docRef = await addDoc(collection(db, "documents"), {
        userId: user.uid,
        title: title.trim(),
        content: content.trim(),
        createdAt: Timestamp.now(),
      });

      setMessage("Document created successfully!");
      setTimeout(() => setMessage(""), 2000);

      setError("");
      setFormData({ title: "", content: "" });
    } catch (error) {
      console.error("Failed to create document:", error);
      setError(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded">
      <h1 className="text-center font-bold text-2xl p-2">
        Create new Document
      </h1>

      {error && (
        <p className="text-2xl text-red-400 text-center p-2">{error}</p>
      )}
      {message && (
        <p className="text-2xl text-green-400 text-center p-2">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4">
        <label htmlFor="title" className="p-2">
          Title:
          <input
            type="text"
            id="title"
            name="title"
            placeholder="enter title"
            value={formData.title}
            onChange={handleChangeForm}
            className="border rounded w-full p-2"
          />
        </label>

        <label htmlFor="content" className="p-2">
          Content:
          <textarea
            name="content"
            id="content"
            placeholder="enter content..."
            value={formData.content}
            onChange={handleChangeForm}
            className="border rounded w-full p-2"
            rows={6}
          ></textarea>
        </label>
        <button className="bg-blue-400 rounded text-white py-4 px-17 mx-auto  hover:bg-blue-500 transition duration-300">
          Save document
        </button>
      </form>
      <Link
        to="/view-all-documents"
        className="w-full max-w-sm mx-auto font-semibold text-center block m-2 underline hover:text-gray-300 rounded p-2"
      >
        View All Documents
      </Link>
    </div>
  );
};

export default CreateDocument;
