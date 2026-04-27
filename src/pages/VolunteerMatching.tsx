import { useState, useEffect } from 'react';
import { Search, MapPin, Star, UserPlus, BrainCircuit } from 'lucide-react';
import { mockVolunteers } from '../services/mockData';
import type { Need } from '../services/mockData';
import { matchVolunteersWithGemini } from '../services/gemini';
import type { MatchResult } from '../services/gemini';
import { db } from '../services/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const VolunteerMatching = () => {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [selectedNeed, setSelectedNeed] = useState<Need | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'needs'), orderBy('priorityScore', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const needsData: Need[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Need;
        if (data.status === 'Open') {
          needsData.push({ id: doc.id, ...data });
        }
      });
      setNeeds(needsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleMatch = async (need: Need) => {
    setSelectedNeed(need);
    setIsMatching(true);
    setMatchResult(null);

    // Call Live Gemini API to search database for best volunteers
    const result = await matchVolunteersWithGemini(need, mockVolunteers);
    
    setMatchResult(result);
    setIsMatching(false);
  };

  return (
    <div className="animate-fade-in flex flex-col h-full">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">AI Volunteer Matching</h1>
        <p>Select an urgent need to let SevaSync AI find the most suitable volunteers based on skills, location, and rating.</p>
      </header>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Needs List */}
        <div className="col-span-5 glass-panel flex flex-col p-4 overflow-hidden">
          <div className="search-bar mb-4 mx-2">
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search active needs..." 
            />
          </div>
          
          <div className="overflow-y-auto pr-2 flex-1 flex flex-col gap-3">
            {loading ? (
              <div className="text-center p-4 text-muted">Loading active needs...</div>
            ) : needs.length === 0 ? (
              <div className="text-center p-4 text-muted">No open needs found.</div>
            ) : needs.map(need => (
              <div 
                key={need.id} 
                onClick={() => handleMatch(need)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedNeed?.id === need.id ? 'border-primary bg-primary/10' : 'border-glass-border hover:bg-white/5'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold">{need.typeOfNeed}</h4>
                  <span className="text-xs font-bold text-primary">{need.priorityScore} pts</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted mb-3">
                  <MapPin size={12} /> {need.peopleAffected} people affected
                </div>
                <div className="flex gap-2">
                  {need.category && <span className="badge badge-blue">{need.category}</span>}
                  {(need.urgencyLevel === 'High' || need.urgencyLevel === 'Critical') && <span className="badge badge-red">{need.urgencyLevel}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Matching Interface */}
        <div className="col-span-7 glass-panel p-6 flex flex-col">
          {!selectedNeed ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted opacity-60">
              <BrainCircuit size={64} className="mb-4" />
              <h3 className="text-xl font-bold">Select a need to begin matching</h3>
              <p className="text-sm">Our AI will analyze required skills and location to find the perfect volunteers.</p>
            </div>
          ) : isMatching ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping"></div>
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary relative z-10">
                  <BrainCircuit size={40} className="text-primary animate-pulse" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gradient mb-2">Finding Optimal Matches...</h3>
              <p className="text-muted text-sm text-center max-w-sm">
                Analyzing database of 1,240 volunteers against the required skills for "{selectedNeed.category}"...
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col animate-fade-in">
              <div className="mb-6 pb-6 border-b border-glass-border">
                <h2 className="text-2xl font-bold mb-2">Top AI Matches for:</h2>
                <h3 className="text-lg text-primary">{selectedNeed.typeOfNeed}</h3>
              </div>

              <div className="flex-1 overflow-y-auto pr-2">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Star className="text-accent-yellow" size={18} fill="currentColor" /> 
                  Recommended Volunteers ({matchResult?.matches.length || 0})
                </h4>

                <div className="flex flex-col gap-4 mb-8">
                  {matchResult?.matches.map((volunteer) => (
                    <div key={volunteer.id} className="glass-card p-4 flex justify-between items-center delay-100 animate-fade-in">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-xl shadow-lg">
                          {volunteer.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{volunteer.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted mb-2">
                            <span>⭐ {volunteer.rating} Rating</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><MapPin size={12}/> {volunteer.location}</span>
                          </div>
                          <div className="flex gap-2">
                            {volunteer.skills.map(skill => (
                              <span key={skill} className="text-xs px-2 py-1 bg-white/10 rounded-md border border-white/5">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                        <UserPlus size={16} /> Dispatch
                      </button>
                    </div>
                  ))}

                  {matchResult?.matches.length === 0 && (
                    <div className="p-8 text-center text-muted">
                      No exact matches found for this requirement. Try broadening the search.
                    </div>
                  )}
                </div>

                {matchResult && matchResult.matches.length > 0 && (
                  <div className="animate-fade-in delay-300">
                    <h4 className="font-bold mb-3">AI Reasoning & Plan</h4>
                    <div className="bg-darker rounded-xl p-4 border border-glass-border">
                      <div className="mb-4">
                        <span className="text-sm text-primary font-bold mb-1 block">Reason for Matching</span>
                        <p className="text-sm text-light">{matchResult.reason}</p>
                      </div>
                      <div>
                        <span className="text-sm text-secondary font-bold mb-1 block">Suggested Assignment Plan</span>
                        <p className="text-sm text-light whitespace-pre-line">{matchResult.assignmentPlan}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerMatching;
