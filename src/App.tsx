import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, FileText, HeartHandshake, Menu, X, LogOut, Sparkles } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import ReportNeed from './pages/ReportNeed';
import VolunteerMatching from './pages/VolunteerMatching';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import SoftAurora from './components/SoftAurora';
import './index.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="flex w-full h-screen items-center justify-center text-primary">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function Sidebar({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) {
  const location = useLocation();
  const { logout, currentUser } = useAuth();

  const navItems = [
    { path: '/', label: 'Overview', icon: <Sparkles size={20} /> },
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/report', label: 'Report Need', icon: <FileText size={20} /> },
    { path: '/match', label: 'Volunteer Match', icon: <HeartHandshake size={20} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="mobile-overlay md:hidden" onClick={toggleSidebar}></div>}
      
      <aside className={`glass-panel sidebar ${isOpen ? 'open' : ''}`} 
             style={{ width: '280px', height: 'calc(100vh - 2rem)', margin: '1rem', display: 'flex', flexDirection: 'column', padding: '1.5rem', position: 'relative' }}>
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HeartHandshake color="white" size={24} />
            </div>
            <h2 className="text-gradient" style={{ fontSize: '1.5rem', margin: 0 }}>SevaSync</h2>
          </div>
          <button className="md:hidden text-muted hover:text-white" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-3 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => { if(window.innerWidth <= 768) toggleSidebar(); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'shadow-md' : 'hover:bg-white/5'}`}
                style={{
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 500,
                  textDecoration: 'none'
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6" style={{ borderTop: '1px solid var(--glass-border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3" style={{ overflow: 'hidden' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(to top right, var(--secondary), var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white', flexShrink: 0, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                {currentUser?.displayName?.charAt(0) || 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p className="text-light" style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{currentUser?.displayName || 'User'}</p>
                <p className="text-muted" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{currentUser?.email}</p>
              </div>
            </div>
            <button onClick={logout} className="text-muted p-2" style={{ transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-red)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'} title="Log out">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="layout-container flex w-full h-full relative">
      {/* Mobile Topbar */}
      <div className="mobile-topbar flex items-center justify-between p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 30 }}>
        <div className="flex items-center gap-2">
           <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HeartHandshake color="white" size={18} />
          </div>
          <h2 className="text-gradient" style={{ fontWeight: 'bold', fontSize: '1.25rem', margin: 0 }}>SevaSync</h2>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="text-light p-1" style={{ background: 'transparent', border: 'none' }}>
          <Menu size={28} />
        </button>
      </div>

      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="main-content flex-1 w-full" style={{ overflowY: 'auto', height: '100vh', padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report" element={<ReportNeed />} />
          <Route path="/match" element={<VolunteerMatching />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ 
          style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } }
        }} />
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
          <SoftAurora
            speed={0.6}
            scale={1.5}
            brightness={1.0}
            color1="#8b5cf6" // Using primary
            color2="#06b6d4" // Using secondary
            noiseFrequency={2.5}
            noiseAmplitude={1.0}
            bandHeight={0.5}
            bandSpread={1.0}
            octaveDecay={0.1}
            layerOffset={0}
            colorSpeed={1.0}
            enableMouseInteraction={true}
            mouseInfluence={0.25}
          />
        </div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
