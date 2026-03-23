import { useState } from "react";
import useAuthStore from "../store/authStore";
import { useNavigate, Link } from "react-router";
import Swal from "sweetalert2";

const RegisterPage = () => {
  const { register, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      Swal.fire({ icon: "success", title: "NEW PLAYER CREATED!", timer: 1500, showConfirmButton: false, background: "#fff", color: "#000" });
      navigate("/login");
    } catch (_) {}
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-20 px-4 pb-20">
      <div className="w-full max-w-md">
        
        {/* Title block */}
        <div className="text-center mb-8">
          <div className="inline-block bg-[var(--mario-green)] border-[5px] border-[var(--mario-black)] shadow-[6px_6px_0_var(--mario-black)] px-6 py-4 mb-4">
            <span className="text-white text-xl pixel-font drop-shadow-[2px_2px_0_var(--mario-black)]">★ NEW PLAYER</span>
          </div>
          <p className="text-white text-xs pixel-font drop-shadow-[2px_2px_0_var(--mario-black)] mt-2">
            CREATE YOUR CHARACTER
          </p>
        </div>

        {/* DaisyUI Card (Mario border override) */}
        <div className="card bg-base-100 shadow-xl border-4 border-[var(--mario-black)] rounded-none">
          <div className="card-body">
            
            {/* Error Alert */}
            {error && (
              <div className="alert alert-error rounded-none border-4 border-[var(--mario-black)] mb-2 shadow-[4px_4px_0_var(--mario-black)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="font-bold text-lg">{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-extrabold text-[var(--mario-dark)] text-sm tracking-wide">USERNAME</span>
                </label>
                <input 
                  type="text" 
                  name="username"
                  placeholder="mario_player" 
                  className="input input-bordered w-full rounded-none border-[3px] border-[var(--mario-black)] bg-white text-black focus:outline-none focus:border-[var(--mario-green)] font-semibold text-lg py-6"
                  value={form.username} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-extrabold text-[var(--mario-dark)] text-sm tracking-wide">EMAIL</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="mario@example.com" 
                  className="input input-bordered w-full rounded-none border-[3px] border-[var(--mario-black)] bg-white text-black focus:outline-none focus:border-[var(--mario-green)] font-semibold text-lg py-6"
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-extrabold text-[var(--mario-dark)] text-sm tracking-wide">PASSWORD</span>
                </label>
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••" 
                  className="input input-bordered w-full rounded-none border-[3px] border-[var(--mario-black)] bg-white text-black focus:outline-none focus:border-[var(--mario-green)] font-semibold text-lg py-6 tracking-[0.2em]"
                  value={form.password} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-control mt-8">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="btn bg-[var(--mario-green)] hover:bg-[#328230] text-white border-4 border-[var(--mario-black)] hover:border-[var(--mario-black)] rounded-none text-sm pixel-font shadow-[4px_4px_0_var(--mario-black)] active:translate-y-1 active:shadow-none transition-all h-auto py-4 mt-4"
                >
                  {loading ? <span className="loading loading-spinner"></span> : "★ CREATE PLAYER"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="text-center mt-8 text-white text-sm font-bold drop-shadow-[2px_2px_0_var(--mario-black)]">
          ALREADY A PLAYER?{" "}
          <Link to="/login" className="text-[var(--mario-yellow)] hover:underline ml-1">
            ← LOGIN
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;
