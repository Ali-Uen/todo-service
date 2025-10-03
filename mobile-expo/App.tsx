import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TodoList } from './src/components/TodoList';
import { AddTodoModal } from './src/components/AddTodoModal';
import { TodoApiService } from './src/services/todoApi';
import { Todo, TodoRequest } from './src/types/Todo';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addingTodo, setAddingTodo] = useState(false);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  // Initialize app and check API connection
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    console.log('🚀 Initializing Todo App...');
    
    // Check API connection first
    const isConnected = await TodoApiService.testConnection();
    setApiConnected(isConnected);
    
    if (isConnected) {
      await loadTodos();
    } else {
      setLoading(false);
      Alert.alert(
        'Connection Error',
        'Cannot connect to the todo service. Please check your network connection and try again.',
        [
          { text: 'Retry', onPress: initializeApp },
          { text: 'Continue Offline', style: 'cancel' }
        ]
      );
    }
  };

  const loadTodos = async () => {
    try {
      console.log('📋 Loading todos...');
      const todosData = await TodoApiService.getAllTodos();
      setTodos(todosData);
      console.log(`✅ Loaded ${todosData.length} todos`);
    } catch (error) {
      console.error('❌ Error loading todos:', error);
      Alert.alert('Error', 'Failed to load todos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTodos();
    setRefreshing(false);
  };

  const handleAddTodo = async (todoRequest: TodoRequest) => {
    if (!apiConnected) {
      Alert.alert('Offline', 'Cannot add todos while offline');
      return;
    }

    setAddingTodo(true);
    try {
      console.log('➕ Adding new todo:', todoRequest);
      const newTodo = await TodoApiService.createTodo(todoRequest);
      setTodos(prevTodos => [newTodo, ...prevTodos]);
      setAddModalVisible(false);
      console.log('✅ Todo added successfully:', newTodo.id);
      
      // Show success feedback
      Alert.alert('Success', 'Todo added successfully!');
    } catch (error) {
      console.error('❌ Error adding todo:', error);
      Alert.alert(
        'Error', 
        'Failed to add todo. Please check your connection and try again.'
      );
    } finally {
      setAddingTodo(false);
    }
  };

  const handleToggleTodo = async (id: number, done: boolean) => {
    if (!apiConnected) {
      Alert.alert('Offline', 'Cannot update todos while offline');
      return;
    }

    try {
      console.log(`🔄 Toggling todo ${id} to ${done ? 'completed' : 'pending'}`);
      // Get the current todo and update it
      const currentTodo = todos.find(t => t.id === id);
      if (!currentTodo) return;
      
      const updatedTodo = await TodoApiService.updateTodo(id, {
        title: currentTodo.title,
        description: currentTodo.description,
        priority: currentTodo.priority,
        done
      });
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? updatedTodo : todo
        )
      );
      console.log(`✅ Todo ${id} updated successfully`);
    } catch (error) {
      console.error('❌ Error updating todo:', error);
      Alert.alert('Error', 'Failed to update todo. Please try again.');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (!apiConnected) {
      Alert.alert('Offline', 'Cannot delete todos while offline');
      return;
    }

    try {
      console.log(`🗑️ Deleting todo ${id}`);
      await TodoApiService.deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      console.log(`✅ Todo ${id} deleted successfully`);
    } catch (error) {
      console.error('❌ Error deleting todo:', error);
      Alert.alert('Error', 'Failed to delete todo. Please try again.');
    }
  };

  const ConnectionStatus: React.FC = () => {
    if (apiConnected === null) return null;
    
    return (
      <View style={[
        styles.connectionStatus,
        { backgroundColor: apiConnected ? '#E7F5E7' : '#FFF0F0' }
      ]}>
        <Text style={[
          styles.connectionStatusText,
          { color: apiConnected ? '#2D5A2D' : '#B91C1C' }
        ]}>
          {apiConnected ? '🟢 Connected to Todo Service' : '🔴 Offline - Check your connection'}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your todos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Todos</Text>
        <TouchableOpacity
          style={[
            styles.addButton,
            { opacity: apiConnected ? 1 : 0.5 }
          ]}
          onPress={() => setAddModalVisible(true)}
          disabled={!apiConnected}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Connection Status */}
      <ConnectionStatus />

      {/* Todo List */}
      <TodoList
        todos={todos}
        onToggle={handleToggleTodo}
        onDelete={handleDeleteTodo}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        emptyStateMessage={
          !apiConnected 
            ? "You're offline. Connect to add and sync your todos."
            : "No todos yet. Tap the + button to add your first todo!"
        }
      />

      {/* Add Todo Modal */}
      <AddTodoModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSubmit={handleAddTodo}
        loading={addingTodo}
      />

      {/* Debug Info (Development Only) */}
      {__DEV__ && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>
            Debug: {todos.length} todos • API: {apiConnected ? 'OK' : 'Error'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C7C7CC',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: '300',
    lineHeight: 28,
  },
  connectionStatus: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  connectionStatusText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  debugInfo: {
    position: 'absolute',
    bottom: 50,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  debugText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
});
