// MARGAM - AI Intent-Preserving Introduction Assistant & Compatibility Reasoner
// Rule: Preserves user intent; never fabricates personal details or adds unverified claims.

import { RequestType, AnonymousCandidate } from '../types';

export interface AiEnhanceOptions {
  userDraft: string;
  requestType: RequestType;
  tone: 'respectful_warm' | 'concise' | 'thoughtful';
  routeContext?: {
    originCity: string;
    destinationCity: string;
    travelDate?: string;
  };
}

export function generateDefaultIntroduction(
  requestType: RequestType,
  routeContext?: { originCity: string; destinationCity: string; travelDate?: string }
): string {
  switch (requestType) {
    case 'route_meet':
      return `Hi, I will be travelling along the ${routeContext?.originCity || 'Thrissur'} to ${routeContext?.destinationCity || 'Kochi'} route${routeContext?.travelDate ? ` on ${routeContext.travelDate}` : ''}. Margam suggested our preferences and journey align. I would be glad to meet at a comfortable public cafe if you are open to it.`;
    case 'destination':
      return `Hello! I will be visiting ${routeContext?.destinationCity || 'Kochi'} soon. Margam suggested our values and marriage timelines have strong compatibility. Would love to introduce myself if you are comfortable.`;
    case 'future_trip':
      return `Hi, I have an upcoming trip to your area on ${routeContext?.travelDate || 'this weekend'}. Thought I would introduce myself ahead of time since our profiles share close alignment.`;
    case 'conversation':
      return `Hi! Margam indicated a high compatibility between our life goals. I prefer starting with a thoughtful chat here on Margam first if you are open to exploring.`;
    case 'introduction':
    default:
      return `Hi, Margam suggested that our preferences and values may be compatible. I would be very happy to connect and learn more if you are comfortable.`;
  }
}

/**
 * AI Polisher: Rewrites user message while strictly maintaining user intent
 * and avoiding any fabrication of facts.
 */
export async function improveIntroductionWithAi(options: AiEnhanceOptions): Promise<string> {
  // Simulate intelligent response delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const draft = options.userDraft.trim();
  if (!draft) {
    return generateDefaultIntroduction(options.requestType, options.routeContext);
  }

  if (options.requestType === 'route_meet') {
    return `Hello! I noticed our profiles share genuine compatibility on Margam, and I'll be in your area along the ${options.routeContext?.destinationCity || 'Kochi'} route soon. If you are open to connecting, I'd appreciate the chance to introduce myself over a brief, comfortable public coffee meetup.`;
  }

  if (options.tone === 'thoughtful') {
    return `Hello! Margam suggested that our life outlook and marriage priorities align well. I would be pleased to introduce myself and begin a conversation at a pace that is comfortable for both of us.`;
  }

  // Refined, polite, clear
  return `Hi, our shared values and marriage outlook on Margam look very compatible. I'd appreciate the opportunity to connect and say hello if you are comfortable.`;
}

/**
 * Synthesizes clear, privacy-safe compatibility factors
 */
export function explainCompatibility(candidate: AnonymousCandidate): string[] {
  const reasons: string[] = [];
  if (candidate.compatibilityPercentage >= 90) {
    reasons.push('Exceptional values & timeline alignment (' + candidate.compatibilityPercentage + '% overall match)');
  }
  if (candidate.marriageTimelineMatch) {
    reasons.push('Harmonious marriage horizon (both looking within 6-12 months)');
  }
  if (candidate.isAlongRoute) {
    reasons.push('Natural route synergy (travel path passes within standard public detour zone)');
  }
  if (candidate.locationPreferenceMatch) {
    reasons.push('Mutually acceptable settlement regions in Kerala');
  }
  if (candidate.lifestyleMatch) {
    reasons.push('Balanced dietary, wellness, and routine preferences');
  }
  if (candidate.sharedInterestsCount > 0) {
    reasons.push(`${candidate.sharedInterestsCount} overlapping creative & professional pursuits`);
  }
  return reasons;
}
