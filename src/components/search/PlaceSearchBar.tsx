import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Keyboard,
  Platform,
} from 'react-native';
import { Search, X, MapPin, Building, Compass, Coffee, ShoppingBag, ArrowRight } from 'lucide-react-native';
import { THEME } from '../../constants/theme';
import { PlaceSearchResult } from '../../types';
import { searchRealPlaces, POPULAR_DESTINATIONS } from '../../services/geocodingService';

interface PlaceSearchBarProps {
  onSelectPlace: (place: PlaceSearchResult) => void;
  userLocation?: { latitude: number; longitude: number };
  placeholder?: string;
  selectedPlaceName?: string;
  onClear?: () => void;
}

export const PlaceSearchBar: React.FC<PlaceSearchBarProps> = ({
  onSelectPlace,
  userLocation,
  placeholder = 'Search destination or area...',
  selectedPlaceName,
  onClear,
}) => {
  const [query, setQuery] = useState(selectedPlaceName || '');
  const [results, setResults] = useState<PlaceSearchResult[]>(() => POPULAR_DESTINATIONS.slice(0, 8));
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimer = useRef<any>(null);
  const prevSelectedPlaceName = useRef(selectedPlaceName);

  useEffect(() => {
    if (selectedPlaceName !== prevSelectedPlaceName.current) {
      prevSelectedPlaceName.current = selectedPlaceName;
      setQuery(selectedPlaceName || '');
    }
  }, [selectedPlaceName]);

  const handleTextChange = (text: string) => {
    setQuery(text);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const clean = text.trim().toLowerCase();
    if (!clean) {
      setResults(POPULAR_DESTINATIONS.slice(0, 8));
      setIsOpen(true);
      setIsLoading(false);
      return;
    }

    // 1. Instant local matches (0ms delay for fast typing feedback)
    const instant = POPULAR_DESTINATIONS.filter(
      (p) =>
        p.name.toLowerCase().includes(clean) ||
        p.subtext.toLowerCase().includes(clean)
    );
    if (instant.length > 0) {
      setResults(instant);
    }
    setIsOpen(true);
    setIsLoading(true);

    // 2. Debounced API search for comprehensive results
    debounceTimer.current = setTimeout(async () => {
      try {
        const places = await searchRealPlaces(text, userLocation);
        if (places && places.length > 0) {
          setResults(places);
        }
      } catch (err) {
        console.warn('[PlaceSearchBar] Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 200);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsOpen(true);
    const clean = query.trim().toLowerCase();
    if (!clean) {
      setResults(POPULAR_DESTINATIONS.slice(0, 8));
    } else {
      const instant = POPULAR_DESTINATIONS.filter(
        (p) =>
          p.name.toLowerCase().includes(clean) ||
          p.subtext.toLowerCase().includes(clean)
      );
      setResults(instant.length > 0 ? instant : POPULAR_DESTINATIONS.slice(0, 8));
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Small delay so item taps register before dropdown unmounts
    setTimeout(() => {
      setIsOpen(false);
    }, 250);
  };

  const handleSelect = (place: PlaceSearchResult) => {
    setQuery(place.name);
    setIsOpen(false);
    setIsFocused(false);
    Keyboard.dismiss();
    onSelectPlace(place);
  };

  const handleClear = () => {
    setQuery('');
    setResults(POPULAR_DESTINATIONS.slice(0, 8));
    setIsOpen(true);
    if (onClear) onClear();
  };

  const renderIcon = (cat?: PlaceSearchResult['category']) => {
    switch (cat) {
      case 'city':
        return <Building size={16} color={THEME.colors.primary} />;
      case 'mall':
        return <ShoppingBag size={16} color="#D97706" />;
      case 'cafe':
        return <Coffee size={16} color="#7C2D12" />;
      case 'landmark':
        return <Compass size={16} color="#2563EB" />;
      default:
        return <MapPin size={16} color={THEME.colors.primary} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}>
        <Search size={18} color={isFocused ? '#3B82F6' : '#64748B'} style={styles.searchIcon} />
        <TextInput
          style={[styles.input, { color: '#0F172A', fontSize: 15, fontWeight: '600' }]}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={query}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCorrect={false}
          autoCapitalize="words"
          selectionColor="#3B82F6"
          returnKeyType="search"
          clearButtonMode="never"
        />
        {isLoading ? (
          <ActivityIndicator size="small" color="#3B82F6" style={styles.clearBtn} />
        ) : query ? (
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <X size={16} color="#64748B" />
          </TouchableOpacity>
        ) : null}
      </View>

      {isOpen && results.length > 0 && (
        <View style={styles.dropdown}>
          <View style={styles.dropdownHeader}>
            <Text style={styles.dropdownTitle}>
              {query.trim() ? `Matching Places (${results.length})` : 'Popular Destinations'}
            </Text>
            <TouchableOpacity onPress={() => setIsOpen(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.closeText}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.list}
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled
            showsVerticalScrollIndicator={true}
          >
            {results.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.item}
                activeOpacity={0.7}
                onPress={() => handleSelect(item)}
              >
                <View style={styles.itemIconContainer}>
                  {renderIcon(item.category)}
                </View>
                <View style={styles.itemTextContainer}>
                  <Text style={[styles.itemName, { color: '#0F172A' }]} numberOfLines={1}>{item.name}</Text>
                  <Text style={[styles.itemSubtext, { color: '#64748B' }]} numberOfLines={1}>{item.subtext}</Text>
                </View>
                <ArrowRight size={14} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 99999,
    position: 'relative',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  inputWrapperFocused: {
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOpacity: 0.15,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A', // Dark Slate Black — High Contrast & 100% Crisp Visibility
    fontWeight: '600',
    paddingVertical: 8,
  },
  clearBtn: {
    padding: 4,
    marginLeft: 6,
  },
  dropdown: {
    position: 'absolute',
    top: 54,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    maxHeight: 280,
    zIndex: 99999,
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    overflow: 'hidden',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
  },
  dropdownTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  closeText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '700',
  },
  list: {
    maxHeight: 226,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A', // Dark Slate Black
    marginBottom: 2,
  },
  itemSubtext: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
});

