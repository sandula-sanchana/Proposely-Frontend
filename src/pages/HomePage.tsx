const Home = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-md p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-500">
                    Dashboard
                </h1>

                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
                    Logout
                </button>
            </nav>

            <div className="p-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold mb-2">
                        Welcome
                    </h2>

                    <p className="text-gray-600">
                        Your frontend is working successfully.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;