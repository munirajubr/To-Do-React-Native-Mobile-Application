import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { endpoints } from '../../constants/api';
import COLORS from '../../constants/colors';

export default function Tasks() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const username = user?.username;

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!username) return;
    try {
      setLoading(true);
      const res = await fetch(endpoints.tasksByUser(username));
      if (!res.ok) {
        const text = await res.text();
        console.log('Fetch tasks error body:', text);
        throw new Error('Failed to load tasks');
      }
      const json = await res.json();
      setTasks(Array.isArray(json) ? json : []);
    } catch (e) {
      console.log('Fetch tasks error:', e);
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCompleteToggle = async (item) => {
    if (!username) return;
    if (item.status === 'completed') {
      Alert.alert('Info', 'Toggle to pending API not implemented yet');
      return;
    }
    try {
      const res = await fetch(endpoints.completeTask(username, item._id), {
        method: 'PATCH',
      });
      if (!res.ok) {
        const text = await res.text();
        console.log('Complete task error body:', text);
        throw new Error('Failed to complete task');
      }
      await fetchTasks();
    } catch (e) {
      console.log('Complete task error:', e);
      Alert.alert('Error', e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!username) return;
    try {
      const res = await fetch(endpoints.deleteTask(username, id), {
        method: 'DELETE',
      });
      if (!res.ok) {
        const text = await res.text();
        console.log('Delete task error body:', text);
        throw new Error('Failed to delete task');
      }
      await fetchTasks();
    } catch (e) {
      console.log('Delete task error:', e);
      Alert.alert('Error', e.message);
    }
  };

  const handleAddPress = () => {
    // TODO: navigate to your Add Task screen or open modal
    Alert.alert('Add Task', 'Open add task screen / bottom sheet here');
  };

  const renderItem = ({ item }) => {
    const completed = item.status === 'completed';
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: COLORS.cardBackground,
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderRadius: 16,
          marginVertical: 6,
          shadowColor: COLORS.black,
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        {/* Checkbox */}
        <TouchableOpacity
          onPress={() => handleCompleteToggle(item)}
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: COLORS.textDark,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
            backgroundColor: completed ? COLORS.primary : COLORS.white,
          }}
        >
          {completed && (
            <Ionicons name="checkmark" size={16} color={COLORS.white} />
          )}
        </TouchableOpacity>

        {/* Title */}
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              color: COLORS.textDark,
              fontSize: 16,
              textDecorationLine: completed ? 'line-through' : 'none',
            }}
          >
            {item.title}
          </Text>
        </View>

        {/* Menu icon (long press to delete) */}
        <TouchableOpacity
          onLongPress={() => handleDelete(item._id)}
          style={{ marginLeft: 8 }}
        >
          <Ionicons
            name="menu"
            size={20}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        paddingHorizontal: 16,
        paddingTop: 40,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 26,
              fontWeight: '700',
              color: COLORS.textDark,
            }}
          >
            My Tasks
          </Text>
          <Text style={{ color: COLORS.textSecondary, marginTop: 4 }}>
            Track your daily tasks
          </Text>
        </View>

        {/* Profile icon */}
        <TouchableOpacity
          onPress={logout}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: COLORS.border,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.cardBackground,
          }}
        >
          <Ionicons
            name="person-outline"
            size={20}
            color={COLORS.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* Tasks list */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        onRefresh={fetchTasks}
        refreshing={loading}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Floating Add Task button */}
      <TouchableOpacity
        onPress={handleAddPress}
        style={{
          position: 'absolute',
          right: 16,
          bottom: 24,
          backgroundColor: COLORS.primary,
          paddingHorizontal: 22,
          paddingVertical: 14,
          borderRadius: 24,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: COLORS.black,
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 4,
        }}
      >
        <Ionicons name="add" size={20} color={COLORS.white} />
        <Text
          style={{
            color: COLORS.white,
            marginLeft: 8,
            fontWeight: '600',
          }}
        >
          Add Task
        </Text>
      </TouchableOpacity>
    </View>
  );
}
