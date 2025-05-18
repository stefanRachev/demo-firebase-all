import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { db } from "../firebase/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import LoadingScreen from "../components/LoadingScreen";

const ViewAllDocuments = () => {
    const { user, loading } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState("");
   
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const q = query(
                    collection(db, "documents"),
                    orderBy("createdAt", "desc")
                );
                const querySnapshot = await getDocs(q);
                const docsArray = querySnapshot.docs.map(doc => ({
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

    if (loading) return <LoadingScreen />;

    return (
        <div className="max-w-4xl mx-auto bg-white rounded p-4">
            <h1 className="text-center font-bold text-2xl p-2">Your Documents</h1>

            {error && <p className="text-red-400 text-center">{error}</p>}

            {documents.length === 0 ? (
                <p className="text-center">No documents found.</p>
            ) : (
                <ul className="space-y-4">
                    {documents.map(doc => (
                        <li key={doc.id} className="p-4 border rounded shadow">
                            <h2 className="font-bold text-xl">{doc.title}</h2>
                            <p className="text-gray-700">{doc.content}</p>
                            <p className="text-sm text-gray-400">
                                Created: {doc.createdAt.toDate().toLocaleString()}
                            </p>
                           <p className="text-sm text-gray-500 italic">Author: {doc.author || "Unknown"}</p>
                            {user && user.uid === doc.userId && (
                                <div className="flex justify-end space-x-2 mt-2">
                                    <button className="bg-blue-300 rounded px-2 py-1 hover:bg-blue-500">Delete</button>
                                    <button className="bg-blue-300 rounded px-2 py-1 hover:bg-blue-500">Update</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewAllDocuments;
