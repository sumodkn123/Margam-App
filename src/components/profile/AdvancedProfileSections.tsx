import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {
  User,
  Heart,
  Briefcase,
  GraduationCap,
  Home,
  Globe,
  Compass,
  Calendar,
  Sparkles,
  Lock,
  CheckCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
  Sliders,
  Activity,
  Dumbbell,
  Coffee,
  Plane,
  Eye,
  Building2,
  Flame,
} from 'lucide-react-native';
import {
  AdvancedMatrimonialProfile,
  FilteredDisplayProfile,
  LockedSectionState,
  AccessRequestSection,
  MargamProfileItem,
} from '../../types/profile';
import { LifeMapVisualizer } from './LifeMapVisualizer';

interface AdvancedProfileSectionsProps {
  isOwner: boolean;
  ownerProfile?: AdvancedMatrimonialProfile;
  displayProfile?: FilteredDisplayProfile;
  onRequestAccess?: (section: AccessRequestSection) => void;
  onEditSection?: (sectionKey: string) => void;
  onOpenAiStudio?: () => void;
  onOpenLifeMapEdit?: () => void;
}

export const AdvancedProfileSections: React.FC<AdvancedProfileSectionsProps> = ({
  isOwner,
  ownerProfile,
  displayProfile,
  onRequestAccess,
  onEditSection,
  onOpenAiStudio,
  onOpenLifeMapEdit,
}) => {
  // Track open/collapsed state for the 17 sections (default some popular ones open)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    aboutMe: true,
    basicDetails: true,
    margams: true,
    lifeMap: true,
    educationCareer: true,
    family: true,
    religionCulture: false,
    lifestyle: false,
    horoscope: false,
    partnerPreferences: false,
    futureGoals: false,
    verification: false,
    privacySettings: false,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isLocked = (data: any): data is LockedSectionState => {
    return data && typeof data === 'object' && data.isLocked === true;
  };

  const renderChevron = (expanded: boolean) => (
    <View
      style={{
        width: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ rotate: expanded ? '90deg' : '0deg' }],
      }}
    >
      <ChevronRight size={16} color="#94A3B8" />
    </View>
  );

  const renderMinimizeButton = (expanded: boolean) => (
    <View
      style={[
        styles.minimizeBtn,
        expanded ? styles.minimizeBtnActive : styles.minimizeBtnInactive,
      ]}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ rotate: expanded ? '-90deg' : '90deg' }],
        }}
      >
        <ChevronRight size={16} color={expanded ? '#0F172A' : '#64748B'} strokeWidth={2.5} />
      </View>
    </View>
  );

  // Helper for rendering a lock card
  const renderLockCard = (
    sectionKey: AccessRequestSection,
    title: string,
    message?: string,
    canRequest: boolean = true
  ) => (
    <View style={styles.lockContainer}>
      <View style={styles.lockBadge}>
        <Lock size={18} color="#D97706" />
      </View>
      <Text style={styles.lockTitle}>{title} is Protected</Text>
      <Text style={styles.lockDesc}>
        {message ||
          'This information requires mutual consent or an approved access request.'}
      </Text>
      {canRequest && onRequestAccess && (
        <TouchableOpacity
          style={styles.requestAccessBtn}
          onPress={() => onRequestAccess(sectionKey)}
          activeOpacity={0.8}
        >
          <Sparkles size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.requestAccessBtnText}>Request Access to {title}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ------------------------------------------------------------- */}
      {/* 1. ABOUT ME */}
      {/* ------------------------------------------------------------- */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => toggleSection('aboutMe')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#FFF1F2' }]}>
            <User size={18} color="#E11D48" />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
              About Me
            </Text>
            <Text style={styles.cardSubtitle} numberOfLines={1} ellipsizeMode="tail">
              Personal statement & authentic reflections
            </Text>
          </View>
          <View style={styles.headerRightControls}>
            <View style={styles.statusCompleteBadge}>
              <CheckCircle size={12} color="#059669" style={{ marginRight: 3 }} />
              <Text style={styles.statusCompleteText}>Complete</Text>
            </View>
            {renderChevron(expandedSections.aboutMe)}
          </View>
        </TouchableOpacity>

        {expandedSections.aboutMe && (
          <View style={styles.cardBody}>
            {isOwner ? (
              <>
                <Text style={styles.bodyParagraph}>{ownerProfile?.aboutMe.bio}</Text>
                <View style={styles.buttonActionRow}>
                  {onOpenAiStudio && (
                    <TouchableOpacity
                      style={styles.aiStudioBtn}
                      onPress={onOpenAiStudio}
                      activeOpacity={0.8}
                    >
                      <Sparkles size={14} color="#7C3AED" style={{ marginRight: 6 }} />
                      <Text style={styles.aiStudioBtnText}>Improve with AI Studio</Text>
                    </TouchableOpacity>
                  )}
                  {onEditSection && (
                    <TouchableOpacity
                      style={styles.editSectionBtn}
                      onPress={() => onEditSection('aboutMe')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.editSectionBtnText}>Edit</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            ) : isLocked(displayProfile?.aboutMe) ? (
              renderLockCard('full_bio', 'About Me', (displayProfile?.aboutMe as LockedSectionState).message)
            ) : (
              <Text style={styles.bodyParagraph}>
                {displayProfile?.aboutMe?.bio || 'No bio provided yet.'}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* ------------------------------------------------------------- */}
      {/* 2. BASIC DETAILS (Age Privacy, Height, Marital Status) */}
      {/* ------------------------------------------------------------- */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => toggleSection('basicDetails')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#F0FDF4' }]}>
            <Calendar size={18} color="#16A34A" />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
              Basic Details
            </Text>
            <Text style={styles.cardSubtitle} numberOfLines={1} ellipsizeMode="tail">
              {isOwner ? 'Age, Height, Languages & Privacy' : 'Identity & Physical Profile'}
            </Text>
          </View>
          <View style={styles.headerRightControls}>
            <View style={styles.statusCompleteBadge}>
              <CheckCircle size={12} color="#059669" style={{ marginRight: 3 }} />
              <Text style={styles.statusCompleteText}>Verified</Text>
            </View>
            {renderChevron(expandedSections.basicDetails)}
          </View>
        </TouchableOpacity>

        {expandedSections.basicDetails && (
          <View style={styles.cardBody}>
            {isOwner ? (
              <View style={styles.detailGrid}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Date of Birth Display</Text>
                  <Text style={styles.gridValue}>
                    {ownerProfile?.basicDetails.age} yrs ({ownerProfile?.basicDetails.dobDisplayMode === 'age_only' ? 'Age only visible' : 'Year visible'})
                  </Text>
                  <Text style={styles.gridNote}>Exact DOB strictly protected</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Height</Text>
                  <Text style={styles.gridValue}>
                    {ownerProfile?.basicDetails.heightCm} cm (5'10")
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Marital Status</Text>
                  <Text style={styles.gridValue}>
                    {ownerProfile?.basicDetails.maritalStatus}
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Mother Tongue</Text>
                  <Text style={styles.gridValue}>
                    {ownerProfile?.basicDetails.motherTongue}
                  </Text>
                </View>
                <View style={[styles.gridItem, { width: '100%' }]}>
                  <Text style={styles.gridLabel}>Languages Spoken</Text>
                  <Text style={styles.gridValue}>
                    {ownerProfile?.basicDetails?.languagesSpoken?.join(', ') || 'Malayalam, English'}
                  </Text>
                </View>
              </View>
            ) : isLocked(displayProfile?.basicDetails) ? (
              renderLockCard('full_bio', 'Basic Details')
            ) : (
              <View style={styles.detailGrid}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Age</Text>
                  <Text style={styles.gridValue}>{displayProfile?.basicDetails?.ageDisplay}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Height</Text>
                  <Text style={styles.gridValue}>{displayProfile?.basicDetails?.heightDisplay}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Marital Status</Text>
                  <Text style={styles.gridValue}>{displayProfile?.basicDetails?.maritalStatus}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Mother Tongue</Text>
                  <Text style={styles.gridValue}>{displayProfile?.basicDetails?.motherTongue}</Text>
                </View>
                <View style={[styles.gridItem, { width: '100%' }]}>
                  <Text style={styles.gridLabel}>Languages</Text>
                  <Text style={styles.gridValue}>
                    {displayProfile?.basicDetails?.languages?.join(', ') || 'Malayalam, English'}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </View>

      {/* ------------------------------------------------------------- */}
      {/* 3. MARGAMS WITH INTENT (Core Paths & Life Intent) */}
      {/* ------------------------------------------------------------- */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => toggleSection('margams')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#FAF5FF' }]}>
            <Flame size={18} color="#9333EA" />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
              Margams & Life Paths
            </Text>
            <Text style={styles.cardSubtitle} numberOfLines={1} ellipsizeMode="tail">
              Shared passions, ambitions & intent
            </Text>
          </View>
          <View style={styles.headerRightControls}>
            <View style={styles.statusCompleteBadge}>
              <Text style={styles.statusCompleteText}>Top 3 Core</Text>
            </View>
            {renderChevron(expandedSections.margams)}
          </View>
        </TouchableOpacity>

        {expandedSections.margams && (
          <View style={styles.cardBody}>
            {isOwner ? (
              <View style={styles.margamsList}>
                {ownerProfile?.margams.map((m) => (
                  <View key={m.id} style={styles.margamItemCard}>
                    <View style={styles.margamTopRow}>
                      <View style={styles.margamTitleWrap}>
                        <Text style={styles.margamEmoji}>{m.emoji}</Text>
                        <Text style={styles.margamName}>{m.name}</Text>
                      </View>
                      {m.isCoreMargam && (
                        <View style={styles.coreMargamBadge}>
                          <Text style={styles.coreMargamText}>Core Margam</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.intentRow}>
                      <Text style={styles.intentBadgeText}>Intent: {m.intent.replace(/_/g, ' ')}</Text>
                    </View>
                    <Text style={styles.margamDesc}>{m.intentDescription}</Text>
                  </View>
                ))}
              </View>
            ) : isLocked(displayProfile?.margams) ? (
              renderLockCard('full_bio', 'Margams')
            ) : (
              <View style={styles.margamsList}>
                {displayProfile?.margams?.allMargams.map((m) => (
                  <View key={m.id} style={styles.margamItemCard}>
                    <View style={styles.margamTopRow}>
                      <View style={styles.margamTitleWrap}>
                        <Text style={styles.margamEmoji}>{m.emoji}</Text>
                        <Text style={styles.margamName}>{m.name}</Text>
                      </View>
                      {m.isCoreMargam && (
                        <View style={styles.coreMargamBadge}>
                          <Text style={styles.coreMargamText}>Core Margam</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.margamDesc}>{m.intentDescription}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>

      {/* ------------------------------------------------------------- */}
      {/* 4. LIFE MAP (Visual Stepper: NOW → NEXT → 3-5 YEARS → FUTURE) */}
      {/* ------------------------------------------------------------- */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => toggleSection('lifeMap')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#ECFDF5' }]}>
            <Compass size={18} color="#059669" />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
              Life Map & Journey
            </Text>
            <Text style={styles.cardSubtitle} numberOfLines={1} ellipsizeMode="tail">
              Timeline of horizons & future visions
            </Text>
          </View>
          <View style={styles.headerRightControls}>
            {renderChevron(expandedSections.lifeMap)}
          </View>
        </TouchableOpacity>

        {expandedSections.lifeMap && (
          <View style={styles.cardBody}>
            <LifeMapVisualizer
              lifeMap={isOwner ? ownerProfile?.lifeMap : displayProfile?.lifeMap}
              isOwner={isOwner}
              onEdit={onOpenLifeMapEdit}
              onRequestAccess={
                onRequestAccess ? () => onRequestAccess('full_bio') : undefined
              }
            />
          </View>
        )}
      </View>

      {/* ------------------------------------------------------------- */}
      {/* 5. EDUCATION & CAREER (Income Privacy) */}
      {/* ------------------------------------------------------------- */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => toggleSection('educationCareer')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
            <Briefcase size={18} color="#2563EB" />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
              Education & Career
            </Text>
            <Text style={styles.cardSubtitle} numberOfLines={1} ellipsizeMode="tail">
              Degrees, profession & venture ambitions
            </Text>
          </View>
          <View style={styles.headerRightControls}>
            {renderChevron(expandedSections.educationCareer)}
          </View>
        </TouchableOpacity>

        {expandedSections.educationCareer && (
          <View style={styles.cardBody}>
            {isOwner ? (
              <View style={styles.detailGrid}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Highest Degree</Text>
                  <Text style={styles.gridValue}>
                    {ownerProfile?.educationCareer.highestEducation}
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Profession</Text>
                  <Text style={styles.gridValue}>
                    {ownerProfile?.educationCareer.jobTitle}
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Industry</Text>
                  <Text style={styles.gridValue}>
                    {ownerProfile?.educationCareer.industry}
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Annual Income</Text>
                  <Text style={styles.gridValue}>
                    {ownerProfile?.educationCareer.incomeRange}
                  </Text>
                  <Text style={styles.gridNote}>
                    Visibility: {ownerProfile?.educationCareer.incomeVisibility}
                  </Text>
                </View>
                {ownerProfile?.educationCareer.businessProfile?.isBusinessOwner && (
                  <View style={[styles.gridItem, { width: '100%', backgroundColor: '#F0FDF4' }]}>
                    <Text style={[styles.gridLabel, { color: '#166534' }]}>
                      Entrepreneurship / Business
                    </Text>
                    <Text style={[styles.gridValue, { color: '#14532D' }]}>
                      {ownerProfile.educationCareer.businessProfile.businessType} (
                      {ownerProfile.educationCareer.businessProfile.businessStage})
                    </Text>
                  </View>
                )}
              </View>
            ) : isLocked(displayProfile?.educationCareer) ? (
              renderLockCard('income', 'Career Details')
            ) : (
              <View style={styles.detailGrid}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Education</Text>
                  <Text style={styles.gridValue}>
                    {displayProfile?.educationCareer?.highestEducation}
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Profession</Text>
                  <Text style={styles.gridValue}>
                    {displayProfile?.educationCareer?.jobTitle}
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Annual Income</Text>
                  <Text style={styles.gridValue}>
                    {displayProfile?.educationCareer?.incomeDisplay || 'Undisclosed'}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </View>

      {/* ------------------------------------------------------------- */}
      {/* 6. FAMILY DETAILS (Parents, Siblings & Values) */}
      {/* ------------------------------------------------------------- */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => toggleSection('family')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#FFF7ED' }]}>
            <Home size={18} color="#EA580C" />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
              Family Details
            </Text>
            <Text style={styles.cardSubtitle} numberOfLines={1} ellipsizeMode="tail">
              Parents, siblings, and family culture
            </Text>
          </View>
          <View style={styles.headerRightControls}>
            {renderChevron(expandedSections.family)}
          </View>
        </TouchableOpacity>

        {expandedSections.family && (
          <View style={styles.cardBody}>
            {isOwner ? (
              <View style={styles.detailGrid}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Family Type</Text>
                  <Text style={styles.gridValue}>
                    {ownerProfile?.family.familyType} ({ownerProfile?.family.familyValues})
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Father</Text>
                  <Text style={styles.gridValue}>
                    {ownerProfile?.family.fatherStatus} ({ownerProfile?.family.fatherProfession})
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Mother</Text>
                  <Text style={styles.gridValue}>
                    {ownerProfile?.family.motherStatus} ({ownerProfile?.family.motherProfession})
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Siblings</Text>
                  <Text style={styles.gridValue}>
                    {ownerProfile?.family.brothersCount} Brother, {ownerProfile?.family.sistersCount} Sister
                  </Text>
                </View>
              </View>
            ) : isLocked(displayProfile?.family) ? (
              renderLockCard(
                'family',
                'Family Details',
                (displayProfile?.family as LockedSectionState).message
              )
            ) : (
              <View style={styles.detailGrid}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Family Type</Text>
                  <Text style={styles.gridValue}>{displayProfile?.family?.familyType}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Values</Text>
                  <Text style={styles.gridValue}>{displayProfile?.family?.familyValues}</Text>
                </View>
                <View style={[styles.gridItem, { width: '100%' }]}>
                  <Text style={styles.gridLabel}>Siblings Summary</Text>
                  <Text style={styles.gridValue}>{displayProfile?.family?.siblingSummary}</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </View>

      {/* ------------------------------------------------------------- */}
      {/* 7. HOROSCOPE / JATHAKAM */}
      {/* ------------------------------------------------------------- */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => toggleSection('horoscope')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
            <Sparkles size={18} color="#D97706" />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
              Horoscope & Jathakam
            </Text>
            <Text style={styles.cardSubtitle} numberOfLines={1} ellipsizeMode="tail">
              Nakshatra, Rasi & Compatibility
            </Text>
          </View>
          <View style={styles.headerRightControls}>
            {renderChevron(expandedSections.horoscope)}
          </View>
        </TouchableOpacity>

        {expandedSections.horoscope && (
          <View style={styles.cardBody}>
            {isOwner ? (
              <View style={styles.detailGrid}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Nakshatra (Star)</Text>
                  <Text style={styles.gridValue}>{ownerProfile?.horoscope.nakshatra}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Rasi (Moon Sign)</Text>
                  <Text style={styles.gridValue}>{ownerProfile?.horoscope.rasi}</Text>
                </View>
                <View style={[styles.gridItem, { width: '100%', backgroundColor: '#EFF6FF' }]}>
                  <Text style={[styles.gridLabel, { color: '#1E40AF' }]}>
                    Compatibility Calculation Engine
                  </Text>
                  <Text style={[styles.gridValue, { color: '#1D4ED8' }]}>
                    Enabled — Algorithm matches stars automatically without exposing birth minute.
                  </Text>
                </View>
              </View>
            ) : isLocked(displayProfile?.horoscope) ? (
              renderLockCard(
                'horoscope',
                'Horoscope Details',
                (displayProfile?.horoscope as LockedSectionState).message
              )
            ) : (
              <View style={styles.detailGrid}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Nakshatra</Text>
                  <Text style={styles.gridValue}>{displayProfile?.horoscope?.nakshatra}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Rasi</Text>
                  <Text style={styles.gridValue}>{displayProfile?.horoscope?.rasi}</Text>
                </View>
                <View style={[styles.gridItem, { width: '100%' }]}>
                  <Text style={styles.gridLabel}>Horoscope Match</Text>
                  <Text style={styles.gridValue}>Compatible Alignment</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </View>

      {/* ------------------------------------------------------------- */}
      {/* 8. LIFESTYLE & HABITS */}
      {/* ------------------------------------------------------------- */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => toggleSection('lifestyle')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#F1F5F9' }]}>
            <Coffee size={18} color="#475569" />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
              Lifestyle & Habits
            </Text>
            <Text style={styles.cardSubtitle} numberOfLines={1} ellipsizeMode="tail">
              Diet, fitness, travel & routines
            </Text>
          </View>
          <View style={styles.headerRightControls}>
            {renderChevron(expandedSections.lifestyle)}
          </View>
        </TouchableOpacity>

        {expandedSections.lifestyle && (
          <View style={styles.cardBody}>
            {isOwner ? (
              <View style={styles.pillsWrap}>
                <View style={styles.pillItem}>
                  <Text style={styles.pillText}>Diet: {ownerProfile?.lifestyle.foodPreference}</Text>
                </View>
                <View style={styles.pillItem}>
                  <Text style={styles.pillText}>Fitness: {ownerProfile?.lifestyle.fitnessLevel}</Text>
                </View>
                <View style={styles.pillItem}>
                  <Text style={styles.pillText}>Sleep: {ownerProfile?.lifestyle.sleepPattern}</Text>
                </View>
                <View style={styles.pillItem}>
                  <Text style={styles.pillText}>Pets: {ownerProfile?.lifestyle.pets}</Text>
                </View>
                <View style={styles.pillItem}>
                  <Text style={styles.pillText}>Smoking: {ownerProfile?.lifestyle.smoking}</Text>
                </View>
                <View style={styles.pillItem}>
                  <Text style={styles.pillText}>Alcohol: {ownerProfile?.lifestyle.alcohol}</Text>
                </View>
              </View>
            ) : isLocked(displayProfile?.lifestyle) ? (
              renderLockCard('full_bio', 'Lifestyle Details')
            ) : (
              <View style={styles.pillsWrap}>
                <View style={styles.pillItem}>
                  <Text style={styles.pillText}>Diet: {displayProfile?.lifestyle?.foodPreference}</Text>
                </View>
                <View style={styles.pillItem}>
                  <Text style={styles.pillText}>Fitness: {displayProfile?.lifestyle?.fitnessLevel}</Text>
                </View>
                <View style={styles.pillItem}>
                  <Text style={styles.pillText}>Social: {displayProfile?.lifestyle?.socialLifestyle}</Text>
                </View>
                <View style={styles.pillItem}>
                  <Text style={styles.pillText}>Pets: {displayProfile?.lifestyle?.pets}</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </View>

      {/* ------------------------------------------------------------- */}
      {/* 9. PARTNER PREFERENCES & DEAL-BREAKERS */}
      {/* ------------------------------------------------------------- */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => toggleSection('partnerPreferences')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#FFF1F2' }]}>
            <Heart size={18} color="#E11D48" fill="#E11D48" />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
              Partner Preferences
            </Text>
            <Text style={styles.cardSubtitle} numberOfLines={1} ellipsizeMode="tail">
              Expected traits & compatibility criteria
            </Text>
          </View>
          <View style={styles.headerRightControls}>
            {renderChevron(expandedSections.partnerPreferences)}
          </View>
        </TouchableOpacity>

        {expandedSections.partnerPreferences && (
          <View style={styles.cardBody}>
            {isOwner ? (
              <View style={styles.detailGrid}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Age Range</Text>
                  <Text style={styles.gridValue}>
                    {ownerProfile?.partnerPreferences?.ageRange?.value?.min ?? 24} – {ownerProfile?.partnerPreferences?.ageRange?.value?.max ?? 32} yrs
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Height Range</Text>
                  <Text style={styles.gridValue}>
                    {ownerProfile?.partnerPreferences?.heightRangeCm?.value?.min ?? 155} – {ownerProfile?.partnerPreferences?.heightRangeCm?.value?.max ?? 185} cm
                  </Text>
                </View>
                <View style={[styles.gridItem, { width: '100%' }]}>
                  <Text style={styles.gridLabel}>Preferred Locations</Text>
                  <Text style={styles.gridValue}>
                    {ownerProfile?.partnerPreferences?.locations?.value?.join(', ') || 'Kerala, India'}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.detailGrid}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Age Range</Text>
                  <Text style={styles.gridValue}>
                    {displayProfile?.partnerPreferencesSummary && !('isLocked' in displayProfile.partnerPreferencesSummary)
                      ? displayProfile.partnerPreferencesSummary.ageRangeDisplay
                      : 'Open'}
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Locations</Text>
                  <Text style={styles.gridValue}>
                    {displayProfile?.partnerPreferencesSummary && !('isLocked' in displayProfile.partnerPreferencesSummary)
                      ? displayProfile.partnerPreferencesSummary.locationSummary
                      : 'Kerala'}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </View>

      {/* ------------------------------------------------------------- */}
      {/* 10. VERIFICATION & TRUST */}
      {/* ------------------------------------------------------------- */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => toggleSection('verification')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#ECFDF5' }]}>
            <ShieldCheck size={18} color="#059669" />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
              Trust & Verification
            </Text>
            <Text style={styles.cardSubtitle} numberOfLines={1} ellipsizeMode="tail">
              Government ID, Mobile, Photo verification
            </Text>
          </View>
          <View style={styles.headerRightControls}>
            <View style={styles.statusCompleteBadge}>
              <CheckCircle size={12} color="#059669" style={{ marginRight: 3 }} />
              <Text style={styles.statusCompleteText}>Verified</Text>
            </View>
            {renderChevron(expandedSections.verification)}
          </View>
        </TouchableOpacity>

        {expandedSections.verification && (
          <View style={styles.cardBody}>
            <View style={styles.trustGrid}>
              <View style={styles.trustBadgeItem}>
                <CheckCircle size={15} color="#059669" style={{ marginRight: 6 }} />
                <Text style={styles.trustBadgeText}>Government ID Verified</Text>
              </View>
              <View style={styles.trustBadgeItem}>
                <CheckCircle size={15} color="#059669" style={{ marginRight: 6 }} />
                <Text style={styles.trustBadgeText}>Selfie Verified</Text>
              </View>
              <View style={styles.trustBadgeItem}>
                <CheckCircle size={15} color="#059669" style={{ marginRight: 6 }} />
                <Text style={styles.trustBadgeText}>Phone Verified</Text>
              </View>
              <View style={styles.trustBadgeItem}>
                <CheckCircle size={15} color="#059669" style={{ marginRight: 6 }} />
                <Text style={styles.trustBadgeText}>Education Verified</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  minimizeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  minimizeBtnActive: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  minimizeBtnInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  statusCompleteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  statusCompleteText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  bodyParagraph: {
    fontSize: 13,
    lineHeight: 21,
    color: '#334155',
    marginTop: 10,
  },
  buttonActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
  },
  aiStudioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  aiStudioBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C3AED',
  },
  editSectionBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editSectionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  gridItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    width: '48%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  gridLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  gridValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 3,
  },
  gridNote: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    fontStyle: 'italic',
  },
  margamsList: {
    gap: 10,
    marginTop: 10,
  },
  margamItemCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  margamTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  margamTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  margamEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  margamName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  coreMargamBadge: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  coreMargamText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  intentRow: {
    marginBottom: 4,
  },
  intentBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7C3AED',
  },
  margamDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  pillItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  trustGrid: {
    gap: 8,
    marginTop: 10,
  },
  trustBadgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  trustBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  lockContainer: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  lockBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  lockTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  lockDesc: {
    fontSize: 11,
    color: '#B45309',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 12,
  },
  requestAccessBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D97706',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  requestAccessBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
