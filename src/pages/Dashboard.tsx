import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, Users, Loader } from 'lucide-react';
import type { Need } from '../services/mockData';
import { db } from '../services/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const Dashboard = () => {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'needs'), orderBy('reportedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const needsData: Need[] = [];
      querySnapshot.forEach((doc) => {
        needsData.push({ id: doc.id, ...doc.data() } as Need);
      });
      setNeeds(needsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const urgentCount = needs.filter(n => n.urgencyLevel === 'High' || n.urgencyLevel === 'Critical').length;
  const activeCount = needs.filter(n => n.status === 'Open' || n.status === 'In Progress').length;

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Command Center</h1>
        <p>Overview of community needs and active responses.</p>
      </header>

      {/* Metrics Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="glass-card flex items-center gap-4">
          <div className="p-4 rounded-full" style={{ background: 'rgba(139, 92, 246, 0.2)', color: 'var(--primary)' }}>
            {loading ? <Loader className="animate-spin" size={32} /> : <Activity size={32} />}
          </div>
          <div>
            <h3 className="text-2xl font-bold">{loading ? '-' : activeCount}</h3>
            <p className="text-sm">Active Needs</p>
          </div>
        </div>
        
        <div className="glass-card flex items-center gap-4">
          <div className="p-4 rounded-full" style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--accent-red)' }}>
            {loading ? <Loader className="animate-spin" size={32} /> : <AlertTriangle size={32} />}
          </div>
          <div>
            <h3 className="text-2xl font-bold">{loading ? '-' : urgentCount}</h3>
            <p className="text-sm">Critical Issues</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4">
          <div className="p-4 rounded-full" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-green)' }}>
            <Users size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold">124</h3>
            <p className="text-sm">Active Volunteers</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Map / List */}
      <h2 className="text-xl font-bold mb-4">Urgent Needs Prioritized by AI</h2>
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 text-muted opacity-50">
          <Loader className="animate-spin mb-4" size={48} />
          <p>Syncing Command Center with Database...</p>
        </div>
      ) : needs.length === 0 ? (
        <div className="glass-panel p-12 text-center text-muted">
          No community needs have been reported yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {needs.sort((a, b) => b.priorityScore - a.priorityScore).map((need, idx) => (
            <div key={need.id} className={`glass-panel p-6 flex justify-between items-center delay-${(idx % 3 + 1) * 100} animate-fade-in`}>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold">{need.typeOfNeed}</h3>
                  {need.urgencyLevel === 'High' || need.urgencyLevel === 'Critical' ? <span className="badge badge-red">{need.urgencyLevel} Urgency</span> : null}
                  {need.category && <span className="badge badge-blue">{need.category}</span>}
                </div>
                <p className="text-sm mb-2 text-light" style={{ maxWidth: '800px' }}>{need.description}</p>
                <div className="flex items-center gap-4 text-xs">
                  <span>👥 {need.peopleAffected} people affected</span>
                  <span>⏱ {need.reportedAt?.toDate ? need.reportedAt.toDate().toLocaleString() : 'Just now'}</span>
                </div>
              </div>
              
              <div className="text-right flex flex-col items-end">
                <div className="mb-2">
                  <span className="text-xs mr-2 text-muted">AI Priority Score</span>
                  <span className="font-bold text-xl text-gradient">{need.priorityScore}/100</span>
                </div>
                <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
