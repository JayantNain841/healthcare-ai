import { Activity, MessageCircle, Stethoscope, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-cyan-500/20 text-cyan-400"
        : "text-gray-300 hover:text-cyan-400"
    }`;

  return (
    <div className="flex justify-between items-center px-8 py-4 max-w-6xl mx-auto bg-black/30 backdrop-blur-lg border-b border-white/10">

      <h1 className="text-2xl font-bold text-cyan-400">
        🧠 HealthAI
      </h1>

      <div className="flex gap-4">

        <Link to="/" className={linkClass("/")}>
          <LayoutDashboard size={18}/> Dashboard
        </Link>

        <Link to="/prediction" className={linkClass("/prediction")}>
          <Activity size={18}/> Prediction
        </Link>

        <Link to="/diagnosis" className={linkClass("/diagnosis")}>
          <Stethoscope size={18}/> Diagnosis
        </Link>

        <Link to="/chat" className={linkClass("/chat")}>
          <MessageCircle size={18}/> Chat
        </Link>

      </div>
    </div>
  );
}