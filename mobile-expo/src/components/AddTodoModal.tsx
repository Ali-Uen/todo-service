import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TodoRequest } from '../types/Todo';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (todo: TodoRequest) => void;
  loading?: boolean;
}

export const AddTodoModal: React.FC<Props> = ({ 
  visible, 
  onClose, 
  onSubmit, 
  loading = false 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your todo');
      return;
    }

    const todo: TodoRequest = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
    };

    onSubmit(todo);
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
  };

  const PriorityButton: React.FC<{
    level: 'HIGH' | 'MEDIUM' | 'LOW';
    color: string;
    label: string;
  }> = ({ level, color, label }) => (
    <TouchableOpacity
      style={[
        styles.priorityButton,
        {
          backgroundColor: priority === level ? color : '#F2F2F7',
          borderColor: priority === level ? color : '#C7C7CC',
        },
      ]}
      onPress={() => setPriority(level)}
      disabled={loading}
    >
      <Text
        style={[
          styles.priorityButtonText,
          {
            color: priority === level ? 'white' : '#1C1C1E',
            fontWeight: priority === level ? '600' : '500',
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleCancel}
            disabled={loading}
            style={styles.headerButton}
          >
            <Text style={[
              styles.cancelButton,
              { opacity: loading ? 0.5 : 1 }
            ]}>
              Cancel
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>New Todo</Text>
          
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading || !title.trim()}
            style={styles.headerButton}
          >
            <Text style={[
              styles.saveButton,
              { 
                opacity: (loading || !title.trim()) ? 0.5 : 1,
                color: (loading || !title.trim()) ? '#C7C7CC' : '#007AFF'
              }
            ]}>
              {loading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          {/* Title Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="What needs to be done?"
              maxLength={100}
              autoFocus
              editable={!loading}
              multiline
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>
              {title.length}/100
            </Text>
          </View>

          {/* Description Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Add more details... (optional)"
              multiline
              numberOfLines={4}
              maxLength={500}
              editable={!loading}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>
              {description.length}/500
            </Text>
          </View>

          {/* Priority Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              <PriorityButton
                level="HIGH"
                color="#FF3B30"
                label="🔴 High"
              />
              <PriorityButton
                level="MEDIUM"
                color="#FF9500"
                label="🟡 Medium"
              />
              <PriorityButton
                level="LOW"
                color="#34C759"
                label="🟢 Low"
              />
            </View>
          </View>

          {/* Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 Tips</Text>
            <Text style={styles.tipsText}>
              • Keep titles short and actionable{'\n'}
              • Use descriptions for context and details{'\n'}
              • High priority for urgent tasks{'\n'}
              • Tap and hold todos to edit them later
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C7C7CC',
  },
  headerButton: {
    minWidth: 60,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  cancelButton: {
    fontSize: 17,
    color: '#8E8E93',
  },
  saveButton: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'right',
  },
  form: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    minHeight: 60,
    maxHeight: 100,
  },
  descriptionInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    minHeight: 100,
    maxHeight: 150,
  },
  charCount: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
    marginTop: 4,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  priorityButtonText: {
    fontSize: 14,
    textAlign: 'center',
  },
  tipsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
});