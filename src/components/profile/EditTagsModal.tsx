import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
} from 'react-native';
import { X, Check, Plus, Heart } from 'lucide-react-native';

interface EditTagsModalProps {
  visible: boolean;
  title: string;
  subtitle: string;
  availableTags: string[];
  selectedTags: string[];
  onClose: () => void;
  onSave: (tags: string[]) => void;
}

export const EditTagsModal: React.FC<EditTagsModalProps> = ({
  visible,
  title,
  subtitle,
  availableTags,
  selectedTags,
  onClose,
  onSave,
}) => {
  const [currentSelected, setCurrentSelected] = useState<string[]>(selectedTags);
  const [customTagInput, setCustomTagInput] = useState('');

  useEffect(() => {
    setCurrentSelected(selectedTags);
  }, [selectedTags, visible]);

  const toggleTag = (tag: string) => {
    if (currentSelected.includes(tag)) {
      setCurrentSelected((prev) => prev.filter((t) => t !== tag));
    } else {
      setCurrentSelected((prev) => [...prev, tag]);
    }
  };

  const handleAddCustom = () => {
    const trimmed = customTagInput.trim();
    if (trimmed && !currentSelected.includes(trimmed)) {
      setCurrentSelected((prev) => [...prev, trimmed]);
      setCustomTagInput('');
    }
  };

  const handleSave = () => {
    onSave(currentSelected);
    onClose();
  };

  // Combine available + any already selected custom tags
  const allTags = Array.from(new Set([...availableTags, ...currentSelected]));

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Custom Tag Add */}
            <View style={styles.addCustomRow}>
              <TextInput
                style={styles.customInput}
                value={customTagInput}
                onChangeText={setCustomTagInput}
                placeholder="Add custom tag..."
                placeholderTextColor="#94A3B8"
                onSubmitEditing={handleAddCustom}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={[styles.addBtn, !customTagInput.trim() && { opacity: 0.5 }]}
                onPress={handleAddCustom}
                disabled={!customTagInput.trim()}
              >
                <Plus size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Tags Grid */}
            <Text style={styles.sectionHeading}>Select tags that describe you best:</Text>
            <View style={styles.tagsWrap}>
              {allTags.map((tag) => {
                const isSelected = currentSelected.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.tagPill, isSelected && styles.tagPillSelected]}
                    onPress={() => toggleTag(tag)}
                    activeOpacity={0.8}
                  >
                    {isSelected && (
                      <Check size={14} color="#E11D48" style={{ marginRight: 6 }} />
                    )}
                    <Text
                      style={[styles.tagText, isSelected && styles.tagTextSelected]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={{ height: 24 }} />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
              <Heart size={16} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.saveBtnText}>Save Tags 💖</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
  },
  scrollArea: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  addCustomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  customInput: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#0F172A',
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 12,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tagPillSelected: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  tagTextSelected: {
    color: '#E11D48',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  saveBtn: {
    flex: 2,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
