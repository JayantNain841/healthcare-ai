export default function Card({ children }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
      {children}
    </div>
  );
}