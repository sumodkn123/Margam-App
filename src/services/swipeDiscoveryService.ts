import {
  MargamProfileCandidate,
  DiscoveryAction,
  DiscoveryActionType,
  DiscoveryActionSource,
  SavedMargamProfile,
  SavedProfileCategory,
  MargamSwipeFilterOptions,
  SwipeSessionState,
} from '../types';
import { MARGAM_CANDIDATES } from './margamService';

// In-memory persistent actions store
let discoveryActionsStore: DiscoveryAction[] = [];
let savedProfilesStore: Map<string, SavedMargamProfile> = new Map();
let hiddenProfilesSet: Set<string> = new Set();
let blockedProfilesSet: Set<string> = new Set();

// Candidates with pre-existing mutual interest in the system
const PRE_EXISTING_INTEREST_CANDIDATE_IDS = new Set(['margam-cand-1', 'margam-cand-3']); // Ananya & Meera

// Default discovery filter options
export const DEFAULT_SWIPE_FILTERS: MargamSwipeFilterOptions = {
  selectedMargam: 'Café Business',
  matchMode: 'ANY',
  intentFilters: [],
  coreOnly: false,
  minAge: 21,
  maxAge: 35,
  minCompatibility: 75,
  maxDistanceKm: 50,
  verifiedOnly: false,
};

/**
 * Generates discovery context badge string for a candidate
 */
export function getCandidateDiscoveryContext(
  candidate: MargamProfileCandidate,
  selectedMargam: string,
  source: DiscoveryActionSource = 'MARGAMS_SWIPE'
): string {
  if (source === 'ALONG_ROUTE') return 'Along your route (NH 544)';
  if (source === 'AT_DESTINATION') return 'At your selected destination';
  if (source === 'NEW_MATCH') return 'New match in your area';

  // Find if matching selected margam
  const sharesSelected = candidate.sharedMargams.some((m) =>
    m.name.toLowerCase().includes(selectedMargam.toLowerCase()) ||
    selectedMargam.toLowerCase().includes(m.name.toLowerCase())
  );

  if (sharesSelected) {
    return `Shared Margam: ${selectedMargam}`;
  }

  if (candidate.compatibilityPercentage >= 90) {
    return `High compatibility (${candidate.compatibilityPercentage}%)`;
  }

  if (candidate.lookingToBuild && candidate.lookingToBuild.length > 5) {
    return 'Shared future life goal';
  }

  return 'Complementary life paths';
}

/**
 * Fetches the active swipe discovery queue based on Margam and filters
 */
export function getSwipeDiscoveryQueue(
  viewerId: string = 'usr-current',
  filters: Partial<MargamSwipeFilterOptions> = {}
): MargamProfileCandidate[] {
  const activeFilters = { ...DEFAULT_SWIPE_FILTERS, ...filters };
  const targetMargam = activeFilters.selectedMargam.toLowerCase();

  // Get all passed or blocked profile IDs in this session
  const passedIds = new Set(
    discoveryActionsStore
      .filter((a) => a.viewerId === viewerId && a.actionType === 'PASSED')
      .map((a) => a.profileId)
  );

  return MARGAM_CANDIDATES.filter((cand) => {
    // 1. Exclude blocked or hidden
    if (blockedProfilesSet.has(cand.id) || hiddenProfilesSet.has(cand.id)) {
      return false;
    }

    // 2. Exclude previously passed profiles
    if (passedIds.has(cand.id)) {
      return false;
    }

    // 3. Age filter
    if (cand.age < activeFilters.minAge || cand.age > activeFilters.maxAge) {
      return false;
    }

    // 4. Compatibility threshold
    if (cand.compatibilityPercentage < activeFilters.minCompatibility) {
      return false;
    }

    // 5. Verified only
    if (activeFilters.verifiedOnly && !cand.isVerified) {
      return false;
    }

    // 6. Selected Margam filter
    if (targetMargam && !targetMargam.includes('all')) {
      const hasMargam = cand.sharedMargams.some(
        (m) =>
          m.name.toLowerCase().includes(targetMargam) ||
          targetMargam.includes(m.name.toLowerCase())
      );
      if (!hasMargam) {
        return false;
      }
    }

    // 7. Relocation preference filter
    if (activeFilters.relocation && activeFilters.relocation !== 'Any') {
      if (
        activeFilters.relocation === 'Within Kerala' &&
        cand.openToRelocate.toLowerCase().includes('abroad only')
      ) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Records a discovery action: PASSED, INTEREST_SHOWN, SAVED, PRIORITY_INTEREST
 */
export function recordSwipeAction(params: {
  viewerId?: string;
  profileId: string;
  actionType: DiscoveryActionType;
  source?: DiscoveryActionSource;
  margamId?: string;
  sessionId?: string;
}): {
  success: boolean;
  isMutualInterest: boolean;
  action: DiscoveryAction;
} {
  const {
    viewerId = 'usr-current',
    profileId,
    actionType,
    source = 'MARGAMS_SWIPE',
    margamId,
    sessionId = 'session-current',
  } = params;

  const newAction: DiscoveryAction = {
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    viewerId,
    profileId,
    actionType,
    source,
    margamId,
    sessionId,
    createdAt: new Date().toISOString(),
  };

  discoveryActionsStore.push(newAction);

  // Check for mutual interest when user shows interest
  let isMutualInterest = false;
  if (actionType === 'INTEREST_SHOWN' || actionType === 'PRIORITY_INTEREST') {
    if (PRE_EXISTING_INTEREST_CANDIDATE_IDS.has(profileId)) {
      isMutualInterest = true;
      // Record mutual interest action
      discoveryActionsStore.push({
        id: `act-mutual-${Date.now()}`,
        viewerId,
        profileId,
        actionType: 'MUTUAL_INTEREST',
        source,
        margamId,
        sessionId,
        createdAt: new Date().toISOString(),
      });
    }
  }

  return {
    success: true,
    isMutualInterest,
    action: newAction,
  };
}

/**
 * Undoes the most recent action for a viewer and returns the restored candidate
 */
export function undoLastSwipeAction(
  viewerId: string = 'usr-current'
): {
  undoneCandidate: MargamProfileCandidate | null;
  lastAction: DiscoveryAction | null;
} {
  // Find last action
  const viewerActions = discoveryActionsStore.filter((a) => a.viewerId === viewerId);
  if (viewerActions.length === 0) {
    return { undoneCandidate: null, lastAction: null };
  }

  const lastAction = viewerActions[viewerActions.length - 1];

  // Remove this action from store
  const actionIdx = discoveryActionsStore.findIndex((a) => a.id === lastAction.id);
  if (actionIdx !== -1) {
    discoveryActionsStore.splice(actionIdx, 1);
  }

  // Find candidate to restore
  const restoredCandidate =
    MARGAM_CANDIDATES.find((c) => c.id === lastAction.profileId) || null;

  return {
    undoneCandidate: restoredCandidate,
    lastAction,
  };
}

/**
 * Toggles bookmark / private saving of candidate profile
 */
export function toggleSaveCandidate(
  candidate: MargamProfileCandidate,
  viewerId: string = 'usr-current'
): {
  isSaved: boolean;
  savedItem: SavedMargamProfile | null;
} {
  const profileKey = `${viewerId}_${candidate.id}`;

  if (savedProfilesStore.has(profileKey)) {
    savedProfilesStore.delete(profileKey);
    return { isSaved: false, savedItem: null };
  }

  // Determine appropriate category
  let category: SavedProfileCategory = 'Saved Recently';
  if (candidate.compatibilityPercentage >= 90) {
    category = 'High Compatibility';
  } else if (candidate.sharedMargams.length >= 3) {
    category = 'Shared Margams';
  } else if (candidate.lookingToBuild) {
    category = 'Potential Future Matches';
  }

  const savedItem: SavedMargamProfile = {
    candidate,
    savedAt: 'Just now',
    category,
    currentState: 'Saved',
    notes: `Saved from ${candidate.sharedMargams[0]?.name || 'Margams'} discovery`,
  };

  savedProfilesStore.set(profileKey, savedItem);

  // Also record action
  recordSwipeAction({
    viewerId,
    profileId: candidate.id,
    actionType: 'SAVED',
    source: 'MARGAMS_SWIPE',
  });

  return { isSaved: true, savedItem };
}

/**
 * Checks if a candidate is saved
 */
export function isCandidateSaved(
  candidateId: string,
  viewerId: string = 'usr-current'
): boolean {
  return savedProfilesStore.has(`${viewerId}_${candidateId}`);
}

/**
 * Returns all saved profiles grouped by category
 */
export function getSavedProfilesGrouped(
  viewerId: string = 'usr-current'
): {
  recentlySaved: SavedMargamProfile[];
  highCompatibility: SavedMargamProfile[];
  sharedMargams: SavedMargamProfile[];
  futureMatches: SavedMargamProfile[];
  allCount: number;
} {
  const allSaved = Array.from(savedProfilesStore.values());

  return {
    recentlySaved: allSaved.filter((p) => p.category === 'Saved Recently'),
    highCompatibility: allSaved.filter((p) => p.category === 'High Compatibility'),
    sharedMargams: allSaved.filter((p) => p.category === 'Shared Margams'),
    futureMatches: allSaved.filter((p) => p.category === 'Potential Future Matches'),
    allCount: allSaved.length,
  };
}

/**
 * Removes a profile from saved list
 */
export function removeSavedProfile(
  candidateId: string,
  viewerId: string = 'usr-current'
): boolean {
  return savedProfilesStore.delete(`${viewerId}_${candidateId}`);
}

/**
 * Updates lifecycle state of a saved profile (e.g. Saved -> Interested -> Request Sent)
 */
export function updateSavedProfileState(
  candidateId: string,
  newState: SavedMargamProfile['currentState'],
  viewerId: string = 'usr-current'
): void {
  const key = `${viewerId}_${candidateId}`;
  const existing = savedProfilesStore.get(key);
  if (existing) {
    savedProfilesStore.set(key, { ...existing, currentState: newState });
  }
}

/**
 * Moderation actions
 */
export function hideCandidate(candidateId: string): void {
  hiddenProfilesSet.add(candidateId);
}

export function blockCandidate(candidateId: string): void {
  blockedProfilesSet.add(candidateId);
}

export function reportCandidate(
  candidateId: string,
  reason: string,
  details?: string
): { success: boolean; reportId: string } {
  // Automatically hide reported candidate
  hiddenProfilesSet.add(candidateId);
  return {
    success: true,
    reportId: `rep-${Date.now()}`,
  };
}

/**
 * Resets discovery history for testing
 */
export function resetDiscoveryEngine(): void {
  discoveryActionsStore = [];
  savedProfilesStore.clear();
  hiddenProfilesSet.clear();
  blockedProfilesSet.clear();
}
