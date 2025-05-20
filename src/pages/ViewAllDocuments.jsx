import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  limit,
  startAfter,
} from "firebase/firestore";
import LoadingScreen from "../components/LoadingScreen";

const ViewAllDocuments = () => {
  const { user, loading } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);

  const [lastVisible, setLastVisible] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 5;

  const fetchDocuments = async () => {
    try {
      const q = query(
        collection(db, "documents"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );

      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDocuments(docs);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setError("Error fetching documents.");
    }
  };

  const fetchMoreDocuments = async () => {
    if (!lastVisible || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const next = query(
        collection(db, "documents"),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(PAGE_SIZE)
      );

      const snapshot = await getDocs(next);
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDocuments((prev) => [...prev, ...docs]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (err) {
      console.error("Error loading more documents:", err);
      setError("Failed to load more documents.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id) => {
    if (!user) {
      setError("Unauthorized action.");
      return;
    }

    try {
      await deleteDoc(doc(db, "documents", id));
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error("Error deleting document:", err);
      setError("Failed to delete document.");
    }
  };

  const editDocument = async (id) => {
    if (!user || !currentDoc) {
      setError("No user or document selected.");
      return;
    }

    try {
      const docRef = doc(db, "documents", id);

      await updateDoc(docRef, {
        title: currentDoc.title,
        content: currentDoc.content,
        updatedAt: serverTimestamp(),
      });

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id
            ? {
                ...doc,
                title: currentDoc.title,
                content: currentDoc.content,
                updatedAt: { toDate: () => new Date() }, 
              }
            : doc
        )
      );

      closeModal();
    } catch (err) {
      console.error("Error updating document:", err);
      setError("Failed to update document.");
    }
  };

  const openModal = (doc) => {
    setCurrentDoc(doc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentDoc(null);
    setIsModalOpen(false);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded p-4">
      <h1 className="text-center font-bold text-2xl p-2">All Documents</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      {documents.length === 0 ? (
        <p className="text-center">No documents found.</p>
      ) : (
        <ul className="space-y-4">
          {documents.map((doc) => (
            <li key={doc.id} className="p-4 border rounded shadow">
              <h2 className="font-bold text-xl">{doc.title}</h2>
              <p className="text-gray-700">{doc.content}</p>
              {doc.createdAt && (
                <p className="text-sm text-gray-400">
                  Created: {doc.createdAt.toDate().toLocaleString("bg-BG")}
                </p>
              )}
              {doc.updatedAt && (
                <p className="text-sm text-gray-400">
                  Updated: {doc.updatedAt.toDate().toLocaleString("bg-BG")}
                </p>
              )}
              <p className="text-sm italic text-gray-500">
                Author: {doc.author || "Unknown"}
              </p>

              {user && user.uid === doc.userId && (
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    className="bg-red-400 hover:bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(doc.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-400 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => openModal(doc)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {hasMore && (
        <div className="text-center mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={fetchMoreDocuments}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {isModalOpen && currentDoc && (
        <div className="fixed inset-0 flex justify-center items-center w-full bg-gray-400 bg-opacity-50 z-50">
          <div className="bg-white p-6 m-2 rounded-lg max-w-md lg:max-w-2xl shadow-lg w-full">
            <label htmlFor="title" className="block mb-2 font-bold">
              Title:
              <input
                type="text"
                value={currentDoc.title}
                onChange={(e) =>
                  setCurrentDoc({ ...currentDoc, title: e.target.value })
                }
                name="title"
                id="title"
                className="w-full border rounded p-2 mt-1"
              />
            </label>

            <label htmlFor="content" className="block mb-2 font-bold">
              Content:
              <textarea
                name="content"
                id="content"
                value={currentDoc.content}
                onChange={(e) =>
                  setCurrentDoc({ ...currentDoc, content: e.target.value })
                }
                className="w-full border rounded p-2 mt-1"
              ></textarea>
            </label>

            <div className="text-center text-sm text-gray-600 my-2">
              Created:{" "}
              {currentDoc.createdAt &&
                currentDoc.createdAt.toDate().toLocaleString("bg-BG")}
              <br />
              {currentDoc.updatedAt && (
                <>Updated: {currentDoc.updatedAt.toDate().toLocaleString("bg-BG")}</>
              )}
            </div>

            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={() => editDocument(currentDoc.id)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllDocuments;

