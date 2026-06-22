import { Link } from "react-router-dom";
import { FileText, Users, Award, ArrowRight, CheckCircle, Sparkles, Shield, Zap } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden font-sans text-indigo-950">
      {/* ── Custom Animations ── */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .anim-fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .anim-fade-up-1 { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both; }
        .anim-fade-up-2 { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both; }
        .anim-fade-up-3 { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; }
        .anim-fade-up-4 { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both; }
        
        .text-gradient {
          background: linear-gradient(to right, #2563eb, #8b5cf6, #ec4899, #2563eb);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: gradientShift 6s linear infinite;
        }
      `}</style>

      {/* ── Vibrant Ambient Background Mesh ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/30 mix-blend-multiply filter blur-[100px] animate-[floatSlow_10s_ease-in-out_infinite]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-400/30 mix-blend-multiply filter blur-[100px] animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-pink-400/20 mix-blend-multiply filter blur-[120px] animate-[floatSlow_12s_ease-in-out_infinite_reverse]" />
      </div>

      {/* ── Sticky Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-indigo-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/30">
              P
            </div>
            <span className="font-bold text-xl tracking-tight text-indigo-950">Proposely</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-indigo-800 font-medium hover:text-purple-600 transition-colors text-sm">
              Sign In
            </Link>
            <Link to="/register" className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-950 text-white text-sm font-semibold rounded-xl hover:bg-indigo-800 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5">
              Get Started 
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="anim-fade-up inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-purple-100/80 border border-purple-200 backdrop-blur-md shadow-sm">
          <Sparkles size={16} className="text-purple-600 animate-[pulse-soft_2s_ease-in-out_infinite]" />
          <span className="text-purple-800 text-sm font-semibold tracking-wide">AI-Powered Academic Platform</span>
        </div>

        <h1 className="anim-fade-up-1 font-extrabold mb-6 leading-[1.1] tracking-tight text-5xl md:text-6xl lg:text-7xl text-indigo-950">
          Research Proposals, <br className="hidden md:block" />
          <span className="text-gradient">Reimagined</span>
        </h1>

        <p className="anim-fade-up-2 text-lg md:text-xl text-indigo-800/80 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          The modern platform for students, lecturers, and admins to create, review, and approve research proposals — faster and smarter.
        </p>

        <div className="anim-fade-up-3 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register" className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all duration-300 border border-white/10">
            Start for Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/login" className="flex items-center justify-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-md text-indigo-900 border border-indigo-200 rounded-2xl font-semibold text-lg hover:bg-white hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md">
            Sign In
          </Link>
        </div>

        {/* Feature pills */}
        <div className="anim-fade-up-4 flex justify-center items-center gap-4 md:gap-8 mt-14 flex-wrap">
          {[
            { label: "Markdown Editor", color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200" },
            { label: "Version Control", color: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-200" },
            { label: "AI Feedback", color: "text-pink-600", bg: "bg-pink-100", border: "border-pink-200" },
            { label: "Role-Based Access", color: "text-amber-600", bg: "bg-amber-100", border: "border-amber-200" },
          ].map(({ label, color, bg, border }) => (
            <span key={label} className={`flex items-center gap-2 text-sm font-semibold text-indigo-900 ${bg} ${border} border px-4 py-2 rounded-full shadow-sm`}>
              <CheckCircle size={16} className={color} /> {label}
            </span>
          ))}
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="font-bold text-3xl md:text-4xl text-indigo-950 tracking-tight mb-4">
            Built for every role
          </h2>
          <p className="text-indigo-800/70 text-lg font-medium">One platform, three powerful workflows.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: FileText, title: "Smart Editor", desc: "Rich markdown with live preview, auto-save, and full version history.", color: "text-blue-700", iconBg: "bg-blue-100", cardBg: "hover:bg-blue-50/50", border: "border-indigo-100 group-hover:border-blue-300", shadow: "group-hover:shadow-blue-500/10" },
            { icon: Users, title: "Collaborative Review", desc: "Seamless role-based experience for Students, Lecturers & Admins.", color: "text-rose-600", iconBg: "bg-rose-100", cardBg: "hover:bg-rose-50/50", border: "border-indigo-100 group-hover:border-rose-300", shadow: "group-hover:shadow-rose-500/10" },
            { icon: Award, title: "AI Assistance", desc: "Intelligent feedback powered by AI — between every proposal version.", color: "text-purple-700", iconBg: "bg-purple-100", cardBg: "hover:bg-purple-50/50", border: "border-indigo-100 group-hover:border-purple-300", shadow: "group-hover:shadow-purple-500/10" },
          ].map((f, i) => (
            <div key={i} className={`group relative bg-white/80 backdrop-blur-xl border rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 shadow-sm ${f.shadow} ${f.border} ${f.cardBg}`}>
              <div className={`w-16 h-16 rounded-2xl ${f.iconBg} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                <f.icon size={32} className={f.color} />
              </div>
              <h3 className="font-bold text-xl text-indigo-950 mb-3">{f.title}</h3>
              <p className="text-indigo-900/70 leading-relaxed mb-6 font-medium">{f.desc}</p>
              <div className={`flex items-center gap-1 text-sm font-bold ${f.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                Learn more <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative z-10 py-24 bg-gradient-to-b from-indigo-100/50 via-purple-50/30 to-transparent backdrop-blur-sm border-y border-indigo-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-bold text-3xl md:text-4xl text-indigo-950 tracking-tight mb-4">How it works</h2>
            <p className="text-indigo-800/70 text-lg font-medium">Three steps to a reviewed and approved proposal.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector line (Desktop only) */}
            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-1 bg-gradient-to-r from-blue-300 via-purple-300 to-emerald-300 z-0 rounded-full opacity-60" />
            
            {[
              { step: "01", icon: Zap, title: "Create", desc: "Write your proposal using the rich markdown editor with real-time preview.", color: "text-blue-600", bg: "bg-blue-100", ring: "ring-blue-100" },
              { step: "02", icon: Users, title: "Review", desc: "Lecturers are assigned and provide detailed, contextual feedback.", color: "text-purple-600", bg: "bg-purple-100", ring: "ring-purple-100" },
              { step: "03", icon: Shield, title: "Approve", desc: "Admins oversee the workflow and finalize proposal approval.", color: "text-emerald-600", bg: "bg-emerald-100", ring: "ring-emerald-100" },
            ].map((s, i) => (
              <div key={i} className="relative z-10 text-center group">
                <div className={`w-20 h-20 mx-auto bg-white rounded-2xl shadow-md flex items-center justify-center mb-6 ring-8 ${s.ring} transition-transform duration-300 group-hover:-translate-y-2`}>
                  <div className={`w-14 h-14 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <s.icon size={28} className={s.color} />
                  </div>
                </div>
                <div className={`text-sm font-black tracking-widest ${s.color} mb-3`}>STEP {s.step}</div>
                <h3 className="font-bold text-xl text-indigo-950 mb-3">{s.title}</h3>
                <p className="text-indigo-900/70 leading-relaxed px-4 font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div className="relative overflow-hidden rounded-[2.5rem] px-8 py-20 text-center shadow-2xl">
          {/* Vibrant Animated Gradient Background inside CTA */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />
            {/* Inner decorative glows */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-500 rounded-full mix-blend-screen filter blur-[60px] opacity-60 animate-pulse" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-400 rounded-full mix-blend-screen filter blur-[70px] opacity-60" />
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-extrabold text-3xl md:text-5xl text-white tracking-tight mb-6 drop-shadow-sm">
              Ready to modernize your proposal process?
            </h2>
            <p className="text-indigo-100 text-lg md:text-xl mb-10 leading-relaxed font-medium">
              Join students and faculty already using Proposely for academic excellence.
            </p>
            <Link to="/register" className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-900 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
              Create Free Account 
              <ArrowRight size={20} className="text-purple-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-10 text-center border-t border-indigo-200/60 bg-white/50 backdrop-blur-md">
        <p className="text-indigo-800/60 font-semibold text-sm">
          © {new Date().getFullYear()} Proposely · Built with <span className="text-rose-500 animate-pulse">❤️</span> for academic excellence
        </p>
      </footer>
    </div>
  );
};

export default Home;