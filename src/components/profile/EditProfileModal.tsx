import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { X, Check, User, Briefcase, GraduationCap, MapPin, Globe, Heart } from 'lucide-react-native';

export interface ProfileFormData {
  fullName: string;
  age: number;
  gender: string;
  location: string;
  profession: string;
  education: string;
  languages: string;
  bio: string;
}

interface EditProfileModalProps {
  visible: boolean;
  initialData: ProfileFormData;
  onClose: () => void;
  onSave: (data: ProfileFormData) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  initialData,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ProfileFormData>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData, visible]);

  const handleSave = () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Required Field', 'Please enter your name.');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Edit Profile</Text>
              <Text style={styles.subtitle}>Update your public executive details</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Full Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <User size={18} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.fullName}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, fullName: text }))}
                  placeholder="Enter full name"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Age & Gender Row */}
            <View style={styles.row}>
              <View style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.fieldLabel}>Age</Text>
                <TextInput
                  style={styles.inputSimple}
                  value={formData.age.toString()}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, age: parseInt(text, 10) || prev.age }))
                  }
                  keyboardType="numeric"
                  placeholder="Age"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={[styles.fieldGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.fieldLabel}>Gender</Text>
                <TextInput
                  style={styles.inputSimple}
                  value={formData.gender}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, gender: text }))}
                  placeholder="Gender"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Location */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Location</Text>
              <View style={styles.inputWrapper}>
                <MapPin size={18} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.location}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, location: text }))}
                  placeholder="City, State"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Profession */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Profession</Text>
              <View style={styles.inputWrapper}>
                <Briefcase size={18} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.profession}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, profession: text }))}
                  placeholder="Your profession"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Education */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Highest Education</Text>
              <View style={styles.inputWrapper}>
                <GraduationCap size={18} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.education}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, education: text }))}
                  placeholder="Degree or University"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Languages */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Languages Spoken</Text>
              <View style={styles.inputWrapper}>
                <Globe size={18} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.languages}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, languages: text }))}
                  placeholder="Languages (e.g. Malayalam, English)"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Bio / About Me */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>About Me</Text>
              <TextInput
                style={[styles.inputSimple, styles.textArea]}
                value={formData.bio}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, bio: text }))}
                multiline
                numberOfLines={4}
                placeholder="Share about yourself, your lifestyle, and what you're looking for..."
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Action Bar */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
              <Heart size={16} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.saveBtnText}>Save Changes 💖</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: '92%',
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  inputSimple: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14,
    color: '#0F172A',
  },
  textArea: {
    height: 100,
    paddingTop: 10,
    textAlignVertical: 'top',
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
