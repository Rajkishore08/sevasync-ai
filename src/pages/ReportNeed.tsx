import { useState } from 'react';
import { Send, Loader, Zap, Target, Activity, FileText } from 'lucide-react';
import { analyzeNeedWithGemini } from '../services/gemini';
import type { AIAnalysisResult, ReportInput } from '../services/gemini';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

const ReportNeed = () => {
  const [typeOfNeed, setTypeOfNeed] = useState('');
  const [peopleAffected, setPeopleAffected] = useState<number | ''>('');
  const [urgencyLevel, setUrgencyLevel] = useState('Medium');
  const [description, setDescription] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !typeOfNeed || peopleAffected === '') return;
    
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const inputData: ReportInput = {
      typeOfNeed,
      peopleAffected: Number(peopleAffected),
      urgencyLevel,
      description
    };

    const result = await analyzeNeedWithGemini(inputData);
    
    try {
      await addDoc(collection(db, 'needs'), {
        ...inputData,
        ...result,
        category: result.suggestedAction.toLowerCase().includes('medical') ? 'Medical' : 
                  result.suggestedAction.toLowerCase().includes('food') ? 'Food' : 
                  inputData.typeOfNeed.toLowerCase().includes('build') || inputData.typeOfNeed.toLowerCase().includes('roof') ? 'Infrastructure' : 'Other',
        status: 'Open',
        reportedAt: serverTimestamp()
      });
      toast.success('Need reported successfully!');
      
      // Reset form
      setTypeOfNeed('');
      setPeopleAffected('');
      setUrgencyLevel('Medium');
      setDescription('');
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error('Failed to submit report.');
    }
    
    setIsAnalyzing(false);
    setAnalysisResult(result);
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Report Community Need</h1>
        <p>Submit request parameters. Our AI will prioritize the issue and suggest actionable steps.</p>
      </header>

      <div className="grid grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="glass-panel p-6">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Type of Need</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g., Medical, Food, Infrastructure..."
                value={typeOfNeed}
                onChange={(e) => setTypeOfNeed(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Number of People Affected</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="e.g., 50"
                min="1"
                value={peopleAffected}
                onChange={(e) => setPeopleAffected(e.target.value === '' ? '' : Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Urgency Level</label>
              <select 
                className="form-control"
                value={urgencyLevel}
                onChange={(e) => setUrgencyLevel(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                className="form-control" 
                placeholder="Describe the situation in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full mt-4" disabled={isAnalyzing}>
              {isAnalyzing ? (
                <><Loader className="animate-spin" size={20} /> Analyzing with Gemini...</>
              ) : (
                <><Send size={20} /> Submit Report</>
              )}
            </button>
          </form>
        </div>

        {/* AI Analysis Result Section */}
        <div className="flex flex-col gap-4">
          <div className="glass-card flex-1 flex flex-col items-center justify-center text-center p-8" style={{ minHeight: '300px' }}>
            {isAnalyzing ? (
              <div className="flex flex-col items-center gap-4 text-primary">
                <Zap className="animate-pulse" size={48} />
                <h3 className="text-lg font-bold">Gemini is processing parameters...</h3>
                <p className="text-sm text-muted">Calculating priority score and generating action plan.</p>
              </div>
            ) : analysisResult ? (
              <div className="animate-fade-in w-full">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
                    <Target size={32} color="white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gradient">AI Priority Assigned</h3>
                </div>
                
                <div className="bg-darker rounded-xl p-5 border border-glass-border mb-4 text-left">
                  
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-glass-border">
                    <span className="text-muted text-sm font-bold flex items-center gap-2">
                      <Activity size={16} /> Priority Score
                    </span>
                    <span className="font-bold text-3xl text-primary">{analysisResult.priorityScore}/100</span>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-muted text-sm font-bold flex items-center gap-2 mb-2">
                      <FileText size={16} /> Reason for Priority
                    </span>
                    <p className="text-sm text-light bg-white/5 p-3 rounded-lg border border-white/5">
                      {analysisResult.reason}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted text-sm font-bold flex items-center gap-2 mb-2">
                      <Zap size={16} /> Suggested Action
                    </span>
                    <p className="text-sm text-light bg-primary/10 p-3 rounded-lg border border-primary/20">
                      {analysisResult.suggestedAction}
                    </p>
                  </div>

                </div>

                <button className="btn btn-outline w-full" onClick={() => setAnalysisResult(null)}>
                  Evaluate Another Need
                </button>
              </div>
            ) : (
              <div className="text-muted opacity-50 flex flex-col items-center gap-4">
                <Target size={48} />
                <p>Submit data to see Gemini's prioritization reasoning.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportNeed;
