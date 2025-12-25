// Header/Navbar.jsx
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setAdmin } from "../store/userSlice";
import mattyLogo from "../assets/mattyLogo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.user.user);
  const isAdmin = useSelector((state) => state.user.isAdmin);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    dispatch(setUser(null));
    dispatch(setAdmin(false));
    navigate("/");
  };

  const navItems = [
    { name: "Editor", route: "/editor", active: !!authStatus },
    { name: "Templates", route: "/templates", active: true },
    {
      name: "Dashboard",
      route: "/dashboard",
      active: !!authStatus && !isAdmin,
    },
    { name: "Admin Dashboard", route: "/admindashboard", active: isAdmin },
    { name: "Users", route: "/users", active: isAdmin },
    { name: "Add Template", route: "/addtemp", active: isAdmin },
    { name: "Login", route: "/signin", active: !authStatus && !isAdmin },
    { name: "AdminLogin", route: "/admin", active: !authStatus && !isAdmin },
    { name: "Signup", route: "/register", active: !authStatus && !isAdmin },
    { name: "About", route: "/about", active: true },
  ];

  return (
    <nav className="w-full h-[60px] bg-gray-900 flex justify-between">
      <div className="h-[60px] flex py-2 px-3">
        <img
          src={mattyLogo}
          alt="Matty Logo"
          className="mr-2 h-[40px] md:h-[50px] w-auto"
        />
        <Link
          to="/"
          className="md:text-3xl text-xl text-red-300 font-bold font-cursive py-1"
        >
          Matty
        </Link>
      </div>
      <div className="h-[60px] py-2 px-3">
        <div className="flex">
          {navItems.map((item) =>
            item.active ? (
              <NavLink
                key={item.name}
                to={item.route}
                className={({ isActive }) =>
                  `${
                    isActive ? "underline text-red-300 font-medium" : ""
                  } inline-block text-gray-300 py-2 w-auto md:px-2 text-sm px-1 md:text-lg duration-200 hover:text-red-300 hover:underline rounded-full`
                }
              >
                {item.name}
              </NavLink>
            ) : null
          )}
          {(authStatus || isAdmin) && (
            <button
              className="inline-block bg-red-400 md:px-2 px-[1px] py-[1px] md:py-1 m-1 text-white rounded-md text-center"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
