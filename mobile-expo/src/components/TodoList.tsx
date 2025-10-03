import React from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ListRenderItem,
} from 'react-native';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  onToggle: (id: number, done: boolean) => void;
  onDelete: (id: number) => void;
  onEdit?: (todo: Todo) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  loading?: boolean;
  emptyStateMessage?: string;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onToggle,
  onDelete,
  onEdit,
  onRefresh,
  refreshing = false,
  loading = false,
  emptyStateMessage = "No todos yet. Add your first todo!",
}) => {
  const renderTodo: ListRenderItem<Todo> = ({ item }) => (
    <TodoItem
      todo={item}
      onToggle={(id, done) => onToggle(id, done)}
      onDelete={onDelete}
      onEdit={onEdit}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📝</Text>
      <Text style={styles.emptyTitle}>No Todos Yet!</Text>
      <Text style={styles.emptySubtitle}>
        {emptyStateMessage}
      </Text>
    </View>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  // Sort todos: incomplete first, then by priority, then by creation date
  const sortedTodos = [...todos].sort((a, b) => {
    // First, sort by completion status (incomplete first)
    if (a.done !== b.done) {
      return a.done ? 1 : -1;
    }
    
    // Then by priority (HIGH > MEDIUM > LOW)
    const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    
    // Finally by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <View style={styles.container}>
      {todos.length > 0 && (
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {todos.filter(t => !t.done).length} of {todos.length} remaining
          </Text>
        </View>
      )}
      
      <FlatList
        data={sortedTodos}
        renderItem={renderTodo}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.list,
          todos.length === 0 && styles.emptyList
        ]}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={renderSeparator}
        refreshControl={
          onRefresh ? (
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="#007AFF"
              colors={['#007AFF']}
            />
          ) : undefined
        }
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
  },
  headerText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
    textAlign: 'center',
  },
  flatList: {
    flex: 1,
  },
  list: {
    paddingVertical: 8,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  separator: {
    height: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
});