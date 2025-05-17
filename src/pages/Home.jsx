import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center p-4 bg-white">
      <h1 className="font-bold text-center text-2xl mt-6">Home page</h1>
      <div className="flex flex-col gap-2 mt-6 p-4 items-center">
        <div className="flex flex-col gap-2 items-center">
          <h2>To create a document, please log in to your account.</h2>
          <Link
            to="create-new-document"
            className="bg-blue-200 rounded p-2 w-full text-center hover:bg-blue-400 transition duration-300"
          >
            Create Document
          </Link>
        </div>
        <Link
          to="/view-all-documents"
          className="bg-green-200 rounded p-2 w-full text-center hover:bg-green-400 transition duration-300 mt-2"
        >
          View All Documents
        </Link>
        <Link
          to="/search-document"
          className="bg-green-200 rounded p-2 w-full text-center hover:bg-green-400 transition duration-300"
        >
          Search Document
        </Link>
      </div>
    </div>
  );
};

export default Home;
