import { BrainCircuit, HeartHandshake, ShieldAlert, Zap, Globe, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="flex flex-col gap-10 animate-fade-in pb-12" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Hero Section */}
      <header className="glass-panel relative overflow-hidden" style={{ padding: '4rem 2rem', textAlign: 'center', background: 'linear-gradient(180deg, rgba(15,23,42,0.6) 0%, rgba(2,6,23,0.8) 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"></div>
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <Sparkles className="text-primary" size={16} />
            <span className="text-sm font-semibold text-primary">Powered by Google Gemini</span>
          </div>
          
          <h1 className="font-bold mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            The Intelligent <br />
            <span className="text-gradient">Command Center</span>
          </h1>
          
          <p className="text-muted max-w-2xl mx-auto" style={{ fontSize: '1.125rem', lineHeight: 1.6 }}>
            SevaSync AI bridges the gap between critical community needs and volunteers. We replace manual triage with autonomous, AI-driven disaster response.
          </p>
        </div>
      </header>

      {/* The Problem & Solution Split */}
      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card flex flex-col" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), transparent)' }}>
          <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <ShieldAlert className="text-accent-red" size={24} />
          </div>
          <h2 className="text-2xl font-bold mb-4">The Chaos of Crises</h2>
          <p className="text-muted leading-relaxed flex-1">
            During emergencies, reports of human needs are scattered and overwhelming. NGOs struggle to manually triage thousands of requests, leading to severely delayed responses and inefficient allocation of life-saving resources.
          </p>
        </div>

        <div className="glass-card flex flex-col" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), transparent)' }}>
          <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <BrainCircuit className="text-primary" size={24} />
          </div>
          <h2 className="text-2xl font-bold mb-4">The AI Solution</h2>
          <p className="text-muted leading-relaxed flex-1">
            SevaSync acts as an autonomous triage engine. By leveraging Gemini Flash, it instantly parses unstructured reports, assigns a quantitative urgency score, and intelligently routes the perfect volunteers to the right place.
          </p>
        </div>
      </div>

      {/* Core Features */}
      <div className="mt-8 text-center">
        <h2 className="text-3xl font-bold mb-8">Platform Capabilities</h2>
        <div className="grid grid-cols-3 gap-6">
          
          <div className="glass-card flex flex-col items-start text-left" style={{ padding: '2rem' }}>
            <div className="w-14 h-14 rounded-2xl mb-5 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--primary), #6d28d9)', boxShadow: '0 8px 16px -4px rgba(139, 92, 246, 0.4)' }}>
              <Zap color="white" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Live Needs Triage</h3>
            <p className="text-sm text-muted leading-relaxed">
              The moment a need is reported, Gemini analyzes the text, determines the category, and calculates a priority score (1-100) based on urgency and lives affected.
            </p>
          </div>

          <div className="glass-card flex flex-col items-start text-left" style={{ padding: '2rem' }}>
            <div className="w-14 h-14 rounded-2xl mb-5 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--secondary), #0369a1)', boxShadow: '0 8px 16px -4px rgba(6, 182, 212, 0.4)' }}>
              <HeartHandshake color="white" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Smart Matching</h3>
            <p className="text-sm text-muted leading-relaxed">
              Gone are the days of manual scheduling. Our AI cross-references specific emergency requirements with our volunteer database to generate instant deployment plans.
            </p>
          </div>

          <div className="glass-card flex flex-col items-start text-left" style={{ padding: '2rem' }}>
            <div className="w-14 h-14 rounded-2xl mb-5 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-blue), #1d4ed8)', boxShadow: '0 8px 16px -4px rgba(59, 130, 246, 0.4)' }}>
              <Globe color="white" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Global Command</h3>
            <p className="text-sm text-muted leading-relaxed">
              A real-time, synchronized dashboard powered by Firebase. Decision-makers get a bird's-eye view of all critical operations globally.
            </p>
          </div>

        </div>
      </div>

      {/* Call to Action */}
      <div className="glass-panel mt-8 flex flex-col items-center justify-center relative overflow-hidden" style={{ padding: '4rem 2rem', border: '1px solid rgba(139, 92, 246, 0.3)', background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)' }}>
        <h2 className="text-3xl font-bold mb-4">Experience the Impact</h2>
        <p className="text-muted mb-8 max-w-lg text-center">Take control of the command center. Report a simulated need or test the AI volunteer matching engine right now.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/report" className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-transform hover:-translate-y-1" style={{ background: 'linear-gradient(to right, var(--primary), var(--secondary))', boxShadow: '0 10px 20px -5px rgba(139, 92, 246, 0.4)' }}>
            Report a Need <ArrowRight size={18} />
          </Link>
          <Link to="/dashboard" className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-transform hover:-translate-y-1" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
            View Dashboard
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Welcome;
