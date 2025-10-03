import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  onToggle: (id: number, done: boolean) => void;
  onDelete: (id: number) => void;
  onEdit?: (todo: Todo) => void;
}

export const TodoItem: React.FC<Props> = ({ 
  todo, 
  onToggle, 
  onDelete, 
  onEdit 
}) => {
  const handleDelete = () => {
    Alert.alert(
      'Delete Todo',
      `Are you sure you want to delete "${todo.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => onDelete(todo.id) 
        },
      ]
    );
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'HIGH': return '#FF3B30';    // Red
      case 'MEDIUM': return '#FF9500';  // Orange  
      case 'LOW': return '#34C759';     // Green
      default: return '#8E8E93';        // Gray
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Checkbox */}
        <TouchableOpacity
          style={[
            styles.checkbox,
            { 
              backgroundColor: todo.done ? '#34C759' : 'transparent',
              borderColor: todo.done ? '#34C759' : '#C7C7CC'
            },
          ]}
          onPress={() => onToggle(todo.id, !todo.done)}
          accessibilityLabel={`Toggle todo: ${todo.title}`}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: todo.done }}
        >
          {todo.done && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        
        {/* Todo Content */}
        <TouchableOpacity 
          style={styles.textContainer}
          onPress={() => onEdit?.(todo)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.title, 
            todo.done && styles.completedText
          ]}>
            {todo.title}
          </Text>
          
          {todo.description && (
            <Text style={[
              styles.description, 
              todo.done && styles.completedText
            ]}>
              {todo.description}
            </Text>
          )}
          
          <View style={styles.meta}>
            <View style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(todo.priority) }
            ]}>
              <Text style={styles.priorityText}>{todo.priority}</Text>
            </View>
            
            <Text style={styles.dateText}>
              {formatDate(todo.createdAt)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        accessibilityLabel={`Delete todo: ${todo.title}`}
        accessibilityRole="button"
      >
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
    lineHeight: 20,
  },
  description: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
    lineHeight: 18,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: 11,
    color: '#C7C7CC',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteIcon: {
    fontSize: 18,
  },
});