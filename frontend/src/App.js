import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import Diagnosis from "./pages/Diagnosis";
import Chat from "./pages/Chat";

function App() {
  return (
    <Router>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>

    </Router>
  );
}

export default App;