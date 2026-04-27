export interface Need {
  id?: string;
  typeOfNeed: string;
  peopleAffected: number;
  urgencyLevel: string;
  description: string;
  category: string;
  priorityScore: number;
  reason: string;
  suggestedAction: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  reportedAt: any;
}

export interface Volunteer {
  id: string;
  name: string;
  skills: string[];
  location: string;
  availability: 'High' | 'Medium' | 'Low';
  rating: number;
}

export const mockNeeds: Need[] = [];

export const mockVolunteers: Volunteer[] = [
  {
    id: 'v1',
    name: 'Dr. Sarah Jenkins',
    skills: ['First Aid', 'Triage', 'General Medicine'],
    location: 'North District',
    availability: 'Medium',
    rating: 4.9,
  },
  {
    id: 'v2',
    name: 'Michael Chang',
    skills: ['Carpentry', 'Construction', 'Heavy Lifting'],
    location: 'Eastside Village',
    availability: 'High',
    rating: 4.7,
  },
  {
    id: 'v3',
    name: 'Priya Patel',
    skills: ['Logistics', 'Food Handling', 'Organization'],
    location: 'Downtown',
    availability: 'High',
    rating: 5.0,
  },
  {
    id: 'v4',
    name: 'David Osei',
    skills: ['Driving', 'First Aid', 'Logistics'],
    location: 'South District',
    availability: 'Low',
    rating: 4.5,
  }
];

export interface MatchResult {
  matches: Volunteer[];
  reason: string;
  assignmentPlan: string;
}

// Simulated AI Matching Function
export const simulateGeminiMatch = async (need: Need): Promise<MatchResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let matches = [...mockVolunteers];
      let reason = "Volunteers selected based on general availability.";
      let assignmentPlan = "Dispatch all available volunteers to the location.";
      
      if (need.category === 'Medical') {
        matches = matches.filter(v => v.skills.includes('First Aid') || v.skills.includes('General Medicine'));
        reason = "Selected volunteers have critical 'First Aid' and 'General Medicine' skills required for this medical emergency.";
        assignmentPlan = "1. Dr. Jenkins leads triage.\n2. Other volunteers handle basic first aid and transport.";
      } else if (need.category === 'Infrastructure') {
        matches = matches.filter(v => v.skills.includes('Construction') || v.skills.includes('Carpentry'));
        reason = "Selected volunteers have 'Carpentry' and 'Construction' skills needed to handle the infrastructure repair safely.";
        assignmentPlan = "1. Michael Chang to assess structural damage.\n2. Team to deploy tarps immediately before attempting permanent fixes.";
      } else if (need.category === 'Food') {
        matches = matches.filter(v => v.skills.includes('Food Handling') || v.skills.includes('Logistics'));
        reason = "Selected volunteers possess 'Food Handling' and 'Logistics' expertise to ensure safe and efficient distribution.";
        assignmentPlan = "1. Priya Patel to organize the distribution queue.\n2. Remaining volunteers to plate and serve meals.";
      }

      matches.sort((a, b) => b.rating - a.rating);
      
      resolve({
        matches: matches.slice(0, 3),
        reason,
        assignmentPlan
      });
    }, 1500); 
  });
};

export interface AIAnalysisResult {
  priorityScore: number;
  reason: string;
  suggestedAction: string;
}

export interface ReportInput {
  typeOfNeed: string;
  peopleAffected: number;
  urgencyLevel: string;
  description: string;
}

// Simulated AI Analysis based on the prompt structure
export const simulateGeminiAnalysis = async (input: ReportInput): Promise<AIAnalysisResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let priorityScore = 50;
      let reason = "Standard community need requiring regular attention.";
      let suggestedAction = "Log the request and assign to the general volunteer pool when available.";

      const desc = input.description.toLowerCase();
      const type = input.typeOfNeed.toLowerCase();

      // Basic logic to simulate AI processing the new parameters
      if (input.urgencyLevel === 'High') {
        priorityScore += 25;
      }

      if (input.peopleAffected > 50) {
        priorityScore += 15;
        reason = `Large impact event affecting ${input.peopleAffected} individuals. Immediate resource mobilization required.`;
      }

      if (type.includes('medical') || desc.includes('injury') || desc.includes('doctor')) {
        priorityScore = Math.min(100, priorityScore + 20);
        reason = `Medical emergencies carry high risk to life. Affecting ${input.peopleAffected} people.`;
        suggestedAction = "Dispatch emergency medical personnel and triage supplies immediately. Alert nearby clinics.";
      } else if (type.includes('food') || desc.includes('hungry') || desc.includes('water')) {
        priorityScore = Math.min(100, priorityScore + 10);
        suggestedAction = "Coordinate with local food banks for emergency rationing and setup a distribution point.";
      } else if (input.urgencyLevel === 'High' && input.peopleAffected > 100) {
        priorityScore = 95;
        reason = `Critical mass disaster affecting ${input.peopleAffected} people with high urgency.`;
        suggestedAction = "Trigger mass emergency protocol. Coordinate with local government and all available volunteer networks.";
      }

      resolve({ priorityScore, reason, suggestedAction });
    }, 2000);
  });
};
