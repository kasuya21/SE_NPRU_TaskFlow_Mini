import { Link, useNavigate } from "react-router";
import useAuthStore from "../store/authStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = async () => { await logout(); navigate("/login"); };

  return (
    <nav className="navbar bg-[var(--mario-red)] border-b-[6px] border-[var(--mario-black)] px-6 shadow-[0_6px_0_var(--mario-black)] z-50">
      <div className="flex flex-1 gap-8 items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center hover:scale-105 active:scale-95 transition-transform"
        >
          <span className="text-3xl drop-shadow-[2px_2px_0_var(--mario-black)] mr-3">🍄</span>
          <span className="pixel-font text-white text-xl tracking-[0.1em]" style={{ textShadow: "3px 3px 0 var(--mario-black)" }}>
            TASKFLOW
          </span>
        </Link>

        {/* Navigation Links */}
        {user && (
          <Link 
            to="/tasks" 
            className="pixel-font bg-[var(--mario-yellow)] text-[var(--mario-black)] px-4 py-2 border-[3px] border-[var(--mario-black)] shadow-[4px_4px_0_var(--mario-black)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--mario-black)] active:translate-y-[2px] active:shadow-[1px_1px_0_var(--mario-black)] transition-all text-[11px]"
          >
            ★ MY TASKS
          </Link>
        )}
      </div>

      <div className="flex-none gap-4">
        {user ? (
          <>
            {/* User HUD */}
            <div className="hidden sm:flex items-center gap-3 bg-[var(--mario-dark)] border-[3px] border-[var(--mario-black)] px-3 py-1 shadow-[4px_4px_0_var(--mario-black)]">
              {user.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt="avatar" 
                  className="w-7 h-7 border-2 border-[var(--mario-black)] bg-white object-cover shadow-[2px_2px_0_var(--mario-black)]"
                />
              ) : (
                <span className="text-xl drop-shadow-[2px_2px_0_var(--mario-black)]">🍄</span>
              )}
              <span className="pixel-font text-[var(--mario-yellow)] text-[10px]">
                {user.username?.toUpperCase()}
              </span>
            </div>
            
            {/* Profile Button */}
            <Link 
              to="/profile" 
              className="pixel-font bg-white text-[var(--mario-black)] px-4 py-2 border-[3px] border-[var(--mario-black)] shadow-[4px_4px_0_var(--mario-black)] hover:bg-[#e0e0e0] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--mario-black)] active:translate-y-[2px] active:shadow-[1px_1px_0_var(--mario-black)] transition-all text-[10px]"
            >
              PROFILE
            </Link>
            
            {/* Logout Button */}
            <button 
              onClick={handleLogout} 
              className="pixel-font bg-[#d42d1f] text-white px-4 py-2 border-[3px] border-[var(--mario-black)] shadow-[4px_4px_0_var(--mario-black)] hover:bg-[#b02216] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--mario-black)] active:translate-y-[2px] active:shadow-[1px_1px_0_var(--mario-black)] transition-all text-[10px]"
            >
              LOGOUT
            </button>
          </>
        ) : (
          <Link 
            to="/login" 
            className="pixel-font bg-[var(--mario-yellow)] text-[var(--mario-black)] px-6 py-2 border-[3px] border-[var(--mario-black)] shadow-[4px_4px_0_var(--mario-black)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--mario-black)] active:translate-y-[2px] active:shadow-[1px_1px_0_var(--mario-black)] transition-all text-[11px]"
          >
            ▶ LOGIN
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
