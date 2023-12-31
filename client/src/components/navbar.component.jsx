import { useState } from "react";
import logo from "../imgs/logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  // State to manage the visibility of the search box
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);

  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar">
        {/* Logo with a link to the home page */}
        <Link to="/" className="flex-none w-10">
          <img src={logo} className="w-full" alt="Logo" />
        </Link>

        {/* Search Box */}
        <div
          className={
            "absolute bg-white w-full left-0 top-full mt-0.5 border-b border-gray py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
            (searchBoxVisibility ? "show" : "hide")
          }
        >
          {/* Input for search */}
          <input
            type="text"
            placeholder="Search"
            className="w-full md:w-auto bg-gray p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
          />

          {/* Search icon */}
          <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-5 md:gap-6 ml-auto">
          {/* Search button for mobile view */}
          <button
            className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
            onClick={() => setSearchBoxVisibility(!searchBoxVisibility)}
          >
            <i className="fi fi-rr-search"></i>
          </button>

          {/* Link to the editor page */}
          <Link to="/editor" className="hidden md:flex gap-2 link">
            <i className="fi fi-rr-file-edit"></i>
            <p>Write</p>
          </Link>

          {/* Link to the sign-in page */}
          <Link to="/signin" className="btn-dark py-2">
            Sign In
          </Link>

          {/* Link to the sign-up page (hidden on mobile) */}
          <Link to="/signup" className="btn-light py-2 hidden md:block">
            Sign Up
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
