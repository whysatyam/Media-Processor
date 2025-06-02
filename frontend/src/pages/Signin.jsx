import { Link } from "react-router-dom";
import { useState } from "react";
import ywaiLogo from "../assets/ywai.png";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthLoader from "../components/TinyLoader";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSignin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Welcome back! Good to see you");
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md space-y-6">
        <div className="flex justify-center">
          <img src={ywaiLogo} alt="Logo" className="h-12" />
        </div>
        <h2 className="text-2xl font-bold text-center">Sign In to Your Account</h2>
        <form onSubmit={handleSignin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition relative flex items-center justify-center"
          >
            Sign In
            {loading && (
              <span className="absolute right-4">
                <AuthLoader />
              </span>
            )}
          </button>
        </form>
        <p className="text-sm text-center">
          Not a member?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
