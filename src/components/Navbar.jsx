const Navbar = () => {
    return (
        <div className="h-16 bg-white border-b px-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
                Admin Dashboard
            </h1>

            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                        Admin User
                    </p>
                    <p className="text-xs text-gray-500">
                        AUTHENTICATED
                    </p>
                </div>

                <img
                    src="https://i.pravatar.cc/40"
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                />
            </div>
        </div>
    );
};

export default Navbar;