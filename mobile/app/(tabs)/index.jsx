import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { endpoints } from '../../constants/api';
import COLORS from '../../constants/colors';
import AddTask from '../../components/AddTask';

export default function Tasks() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const username = user?.username;

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addVisible, setAddVisible] = useState(false);

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
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCheckboxPress = async (item) => {
    if (!username) return;
    if (item.status === 'completed') return;

    try {
      const res = await fetch(endpoints.completeTask(username, item._id), {
        method: 'PATCH',
      });
      if (!res.ok) {
        const text = await res.text();
        console.log('Complete task error body:', text);
        throw new Error('Failed to update status');
      }
      await fetchTasks();
    } catch (e) {
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
      Alert.alert('Error', e.message);
    }
  };

  const handleDragEnd = ({ data }) => {
    setTasks(data);
  };

  const renderItem = ({ item, drag, isActive }) => {
    const completed = item.status === 'completed';

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onLongPress={drag}
        style={{
          backgroundColor: COLORS.cardBackground,
          borderRadius: 16,
          paddingVertical: 10,
          paddingHorizontal: 12,
          marginVertical: 6,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: COLORS.black,
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 2,
          opacity: isActive ? 0.9 : 1,
        }}
      >
        {/* Checkbox */}
        <TouchableOpacity
          onPress={() => handleCheckboxPress(item)}
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: COLORS.textDark,
            backgroundColor: completed ? COLORS.primary : COLORS.white,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
          }}
        >
          {completed && (
            <Ionicons name="checkmark" size={14} color={COLORS.white} />
          )}
        </TouchableOpacity>

        {/* Title */}
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              color: COLORS.textDark,
              fontSize: 15,
              textDecorationLine: completed ? 'line-through' : 'none',
            }}
          >
            {item.title}
          </Text>
        </View>

        {/* Drag icon */}
        <TouchableOpacity
          onLongPress={drag}
          style={{
            marginLeft: 8,
            paddingHorizontal: 4,
            paddingVertical: 4,
          }}
        >
          <Ionicons
            name="menu"
            size={18}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>

        {/* Optional delete */}
        {/* <TouchableOpacity onPress={() => handleDelete(item._id)} style={{ marginLeft: 8 }}>
          <Ionicons name="trash-outline" size={18} color="#ff3b3b" />
        </TouchableOpacity> */}
      </TouchableOpacity>
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
          marginBottom: 16,
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
      <View style={{ flex: 1 }}>
        <DraggableFlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          onRefresh={fetchTasks}
          refreshing={loading}
          contentContainerStyle={{ paddingBottom: 120 }}
          onDragEnd={handleDragEnd}
        />
      </View>

      {/* Floating Add Task button like screenshot */}
      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          right: 16,
          bottom: 24,
        }}
      >
        <TouchableOpacity
          onPress={() => setAddVisible(true)}
          style={{
            backgroundColor: COLORS.primary,
            paddingHorizontal: 26,
            paddingVertical: 12,
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: COLORS.black,
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          <Ionicons name="add" size={18} color={COLORS.white} />
          <Text
            style={{
              color: COLORS.white,
              marginLeft: 6,
              fontWeight: '600',
            }}
          >
            Add Task
          </Text>
        </TouchableOpacity>
      </View>

      {/* AddTask popup */}
      <AddTask
        username={username}
        visible={addVisible}
        onClose={() => setAddVisible(false)}
        onSuccess={(newTasks) => setTasks(newTasks)}
      />
    </View>
  );
}
