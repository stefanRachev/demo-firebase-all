import { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const Search =() => {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!term.trim()) return;
    setLoading(true);
    setError("");
    try {
      const q = query(
        collection(db, "documents"),
        where("title", ">=", term),
        where("title", "<=", term + "\uf8ff")
      );
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setResults(docs);
    } catch (err) {
      setError("Error searching documents.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Search Documents</h1>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Enter search term..."
        className="border p-2 w-full mb-4"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="mt-4 space-y-3">
        {results.length === 0 && !loading && <p>No results found.</p>}
        {results.map((doc) => (
          <li key={doc.id} className="border p-3 rounded shadow">
            <h2 className="font-semibold">{doc.title}</h2>
            <p>{doc.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Search
