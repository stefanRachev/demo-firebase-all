import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { db } from "../firebase/firebase";
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    deleteDoc,
    doc,
    updateDoc,
    serverTimestamp,
} from "firebase/firestore";
import LoadingScreen from "../components/LoadingScreen";

const ViewAllDocuments = () => {
    const { user, loading } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDoc, setCurrentDoc] = useState(null);


    const openModal = (doc) => {
        setCurrentDoc(doc);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentDoc(null);
    };


    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const q = query(
                    collection(db, "documents"),
                    orderBy("createdAt", "desc")
                );
                const querySnapshot = await getDocs(q);
                const docsArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setDocuments(docsArray);
            } catch (err) {
                console.error("Failed to fetch documents:", err);
                setError("Error fetching documents.");
            }
        };
        fetchDocuments();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "documents", id));
            setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== id));
        } catch (error) {
            console.error("Error deleting document:", error);
            setError("Failed to delete the document.");
        }
    };

    const editDocument = async (id) => {
        if (!currentDoc) {
            console.error("No document selected for editing.");
            return;
        }
        try {
            const docRef = doc(db, "documents", id);

            await updateDoc(docRef, {
                title: currentDoc.title,
                content: currentDoc.content,
                updatedAt: serverTimestamp(),
            });

            // setDocuments((prevDocs) =>
            //     prevDocs.map((doc) =>
            //         doc.id === id
            //             ? { ...doc, title: currentDoc.title, content: currentDoc.content  }
            //             : doc
            //     )
            // );
            const snapshot = await getDocs(collection(db, "documents"));
            const docsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDocuments(docsData)
            closeModal();
        } catch (error) {
            console.error("Error updating document:", error);
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className="max-w-4xl mx-auto bg-white rounded p-4">
            <h1 className="text-center font-bold text-2xl p-2">Your Documents</h1>

            {error && <p className="text-red-400 text-center">{error}</p>}

            {documents.length === 0 ? (
                <p className="text-center">No documents found.</p>
            ) : (
                <ul className="space-y-4">
                    {documents.map((doc) => (
                        <li key={doc.id} className="p-4 border rounded shadow">
                            <h2 className="font-bold text-xl">{doc.title}</h2>
                            <p className="text-gray-700">{doc.content}</p>
                            <p className="text-sm text-gray-400">
                                Created: {doc.createdAt.toDate().toLocaleString("bg-BG")}
                            </p>
                            {doc.updatedAt && (
                                <p className="text-sm text-gray-400">
                                    Updated: {doc.updatedAt.toDate().toLocaleString("bg-BG")}
                                </p>
                            )}
                            <p className="text-sm text-gray-500 italic">
                                Author: {doc.author || "Unknown"}
                            </p>

                            {user && user.uid === doc.userId && (
                                <div className="flex justify-end space-x-2 mt-2">
                                    <button
                                        className="bg-blue-300 rounded px-2 py-1 hover:bg-blue-500"
                                        onClick={() => handleDelete(doc.id)}
                                    >
                                        Delete
                                    </button>
                                    <button className="bg-blue-300 rounded px-2 py-1 hover:bg-blue-500"
                                        onClick={() => openModal(doc)}
                                    >
                                        Update
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {isModalOpen && currentDoc && (
                <div className="fixed inset-0 flex justify-center items-center w-full bg-gray-400 bg-opacity-50 z-50">
                    <div className="bg-white p-6 m-2 rounded-lg max-w-md lg:max-w-2xl shadow-lg w-full">
                        <label htmlFor="title" className="block mb-2">
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

                        <label htmlFor="content" className="block mb-2">
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
                                currentDoc.createdAt.toDate().toLocaleString()}
                            <br />
                            {currentDoc.updatedAt && (
                                <>
                                    Updated: {currentDoc.updatedAt.toDate().toLocaleString()}
                                </>
                            )}
                        </div>

                        <div className="flex justify-between mt-4">
                            <button
                                className="bg-gray-300 rounded px-4 py-2 hover:bg-gray-400"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-300 rounded px-4 py-2 hover:bg-green-500"
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
