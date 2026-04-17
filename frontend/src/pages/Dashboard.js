import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">

      {/* HERO */}
      <div className="text-center max-w-3xl mb-12">

        <h1 className="text-5xl font-bold mb-4">
          Intelligent Healthcare Platform
        </h1>

        <p className="text-gray-400 text-lg">
          AI-powered prediction, diagnosis & health assistant
        </p>

      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">

        {/* CARD 1 */}
        <Link to="/prediction">
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:scale-105 transition cursor-pointer">

            <h2 className="text-xl font-semibold mb-2">🫀 Heart Prediction</h2>

            <p className="text-gray-400 text-sm">
              Predict heart disease risk using ML + rule-based system
            </p>

          </div>
        </Link>

        {/* CARD 2 */}
        <Link to="/diagnosis">
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:scale-105 transition cursor-pointer">

            <h2 className="text-xl font-semibold mb-2">🩺 Diagnosis</h2>

            <p className="text-gray-400 text-sm">
              Get possible diseases from symptoms instantly
            </p>

          </div>
        </Link>

        {/* CARD 3 */}
        <Link to="/chat">
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:scale-105 transition cursor-pointer">

            <h2 className="text-xl font-semibold mb-2">🤖 AI Chat</h2>

            <p className="text-gray-400 text-sm">
              Ask health-related questions anytime
            </p>

          </div>
        </Link>

      </div>

    </div>
  );
}