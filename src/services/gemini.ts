import { GoogleGenAI, Type } from '@google/genai';
import type { Volunteer, Need } from './mockData';

// Initialize the Gemini SDK
// Note: In production, never hardcode the API key in the frontend. It should be passed via environment variables.
const ai = new GoogleGenAI({ apiKey: 'AIzaSyDMOMAAEi6DXLnOFbZjCQPNeZ2zYEzdVF4' });

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

export const analyzeNeedWithGemini = async (input: ReportInput): Promise<AIAnalysisResult> => {
  const prompt = `You are an AI assistant helping NGOs prioritize community needs.
Input:
- Type of need: ${input.typeOfNeed}
- Number of people affected: ${input.peopleAffected}
- Urgency level: ${input.urgencyLevel}
- Description: ${input.description}

Task:
Generate:
1. Priority score (1-100)
2. Reason for priority
3. Suggested action

Keep output structured and consistent.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priorityScore: {
              type: Type.INTEGER,
              description: 'Score from 1 to 100 based on urgency and impact'
            },
            reason: {
              type: Type.STRING,
              description: 'Detailed reason for the assigned priority score'
            },
            suggestedAction: {
              type: Type.STRING,
              description: 'Actionable next steps for the NGO command center'
            }
          },
          required: ['priorityScore', 'reason', 'suggestedAction']
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResult;
    }
    throw new Error('Empty response from Gemini');
  } catch (error) {
    console.error('Error analyzing need with Gemini:', error);
    // Fallback if API fails
    return {
      priorityScore: 50,
      reason: 'Fallback generated due to API error. Manual review required.',
      suggestedAction: 'Please review this report manually as AI analysis temporarily failed.'
    };
  }
};

export interface MatchResult {
  matches: Volunteer[];
  reason: string;
  assignmentPlan: string;
}

export const matchVolunteersWithGemini = async (need: Need, availableVolunteers: Volunteer[]): Promise<MatchResult> => {
  const prompt = `You are an AI system that matches volunteers to community tasks.
Input:
- Task details: Type: ${need.typeOfNeed}, Urgency: ${need.urgencyLevel}, People Affected: ${need.peopleAffected}. Description: ${need.description}
- List of available volunteers:
${JSON.stringify(availableVolunteers, null, 2)}

Task:
Return:
1. Best matched volunteers (list their IDs)
2. Reason for matching
3. Suggested assignment plan

Keep output simple and clear.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchedVolunteerIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Array of volunteer IDs that best match the task'
            },
            reason: {
              type: Type.STRING,
              description: 'Explanation of why these specific volunteers were selected'
            },
            assignmentPlan: {
              type: Type.STRING,
              description: 'Step-by-step assignment plan for the matched volunteers'
            }
          },
          required: ['matchedVolunteerIds', 'reason', 'assignmentPlan']
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      const matchedVolunteerIds = parsed.matchedVolunteerIds as string[];
      
      const matches = availableVolunteers.filter(v => matchedVolunteerIds.includes(v.id));
      
      return {
        matches,
        reason: parsed.reason,
        assignmentPlan: parsed.assignmentPlan
      };
    }
    throw new Error('Empty response from Gemini');
  } catch (error) {
    console.error('Error matching volunteers with Gemini:', error);
    // Fallback
    return {
      matches: availableVolunteers.slice(0, 3), // Just return top 3
      reason: 'Fallback generated due to API error. Returned general volunteers.',
      assignmentPlan: 'Manually dispatch available volunteers.'
    };
  }
};
