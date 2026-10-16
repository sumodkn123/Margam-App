import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { MARGAM_INTERESTS } from '../../services/margamService';
import { MargamInterestItem } from '../../types';

interface MargamCategoryFilterModalProps {
  visible: boolean;
  selectedInterest: string;
  onSelectInterest: (interest: MargamInterestItem) => void;
  onClose: () => void;
}

export const MargamCategoryFilterModal: React.FC<MargamCategoryFilterModalProps> = ({
  visible,
  selectedInterest,
  onSelectInterest,
  onClose,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <SafeAreaView style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Explore Margams</Text>
              <Text style={styles.subTitle}>Select a life path or ambition to explore candidates</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
              <X size={20} color="#1E293B" />
            </TouchableOpacity>
          </View>

          {/* List of Interests */}
          <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
            {MARGAM_INTERESTS.map((item) => {
              const isSelected = selectedInterest.toLowerCase().includes(item.name.toLowerCase());

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.itemCard, isSelected && styles.itemCardSelected]}
                  activeOpacity={0.8}
                  onPress={() => {
                    onSelectInterest(item);
                    onClose();
                  }}
                >
                  <View style={styles.itemEmojiWrap}>
                    <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
                  </View>

                  <View style={styles.itemTextCol}>
                    <Text style={[styles.itemName, isSelected && styles.itemNameSelected]}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemDesc} numberOfLines={1}>
                      {item.description}
                    </Text>
                  </View>

                  {isSelected && (
                    <View style={styles.checkCircle}>
                      <Check size={14} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '75%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  subTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollList: {
    marginTop: 4,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemCardSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  itemEmojiWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemTextCol: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemNameSelected: {
    color: '#1D4ED8',
  },
  itemDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
