import { Link, NavLink } from "react-router-dom";

const navbarlinks = [
  { name: "Home", path: "/home" },
  { name: "Dinesh", path: "/contact" },
];
function Navbar() {
  return (
    <header className="fixed w-full inset-x-0 top-0 z-50 border-b border-slate-700/70 bg-slate-900/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <Link to="/" className="inline-flex items-center">
            <img
              src="/image.png"
              alt="logo"
              className="h-10 transition-transform duration-200 hover:scale-105"
            />
          </Link>
        </div>
        <nav>
          <ul className="flex items-center gap-4 sm:gap-8">
            {navbarlinks.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `relative text-sm font-medium transition-colors duration-200 sm:text-base ${
                      isActive
                        ? "text-sky-400 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-sky-400"
                        : "text-slate-200 hover:text-sky-400"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
export default Navbar;
