import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { endpoints } from '../constants/api';

const today = () => new Date();
const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d;
};

const formatDate = (d) => {
  if (!d) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export default function AddTask({ username, visible, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDateObj, setStartDateObj] = useState(today());
  const [deadlineDateObj, setDeadlineDateObj] = useState(tomorrow());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!username) return;
    if (!title.trim()) {
      Alert.alert('Validation', 'Task name is required');
      return;
    }

    const body = {
      username,
      title,
      description: description || '',
      startDate: formatDate(startDateObj || today()),
      deadline: formatDate(deadlineDateObj || tomorrow()),
      status: 'pending',
    };

    try {
      setSubmitting(true);
      const res = await fetch(endpoints.addTask, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        console.log('Add task error status:', res.status);
        console.log('Add task error body:', text);
        Alert.alert('Add task failed', text || 'Unknown error');
        return;
      }

      const json = await res.json(); // { message, tasks }
      onSuccess?.(json.tasks || []);

      // reset form
      setTitle('');
      setDescription('');
      setStartDateObj(today());
      setDeadlineDateObj(tomorrow());
      onClose?.();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 16,
            paddingBottom: 24,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: COLORS.textDark,
              marginBottom: 12,
            }}
          >
            Add New Task
          </Text>

          {/* Task title */}
          <Text style={{ color: COLORS.textPrimary, fontWeight: '600' }}>
            Task Title
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="task title"
            placeholderTextColor={COLORS.placeholderText}
            style={{
              borderBottomWidth: 1,
              borderColor: COLORS.border,
              paddingVertical: 6,
              marginBottom: 16,
              color: COLORS.textDark,
            }}
          />

          {/* Description */}
          <Text style={{ color: COLORS.textPrimary, fontWeight: '600' }}>
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="description"
            placeholderTextColor={COLORS.placeholderText}
            style={{
              borderBottomWidth: 1,
              borderColor: COLORS.border,
              paddingVertical: 6,
              marginBottom: 16,
              color: COLORS.textDark,
            }}
          />

          {/* Dates */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 8,
            }}
          >
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text
                style={{ color: COLORS.textPrimary, fontWeight: '600' }}
              >
                Start Date
              </Text>
              <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                style={{
                  borderBottomWidth: 1,
                  borderColor: COLORS.border,
                  paddingVertical: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{
                    color: startDateObj
                      ? COLORS.textDark
                      : COLORS.placeholderText,
                  }}
                >
                  {startDateObj ? formatDate(startDateObj) : 'Select date'}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text
                style={{ color: COLORS.textPrimary, fontWeight: '600' }}
              >
                Deadline
              </Text>
              <TouchableOpacity
                onPress={() => setShowDeadlinePicker(true)}
                style={{
                  borderBottomWidth: 1,
                  borderColor: COLORS.border,
                  paddingVertical: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{
                    color: deadlineDateObj
                      ? COLORS.textDark
                      : COLORS.placeholderText,
                  }}
                >
                  {deadlineDateObj
                    ? formatDate(deadlineDateObj)
                    : 'Select date'}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting}
            style={{
              marginTop: 24,
              backgroundColor: COLORS.primary,
              borderRadius: 15,
              paddingVertical: 12,
              alignItems: 'center',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            <Text
              style={{
                color: COLORS.white,
                fontWeight: '600',
                fontSize: 16,
              }}
            >
              {submitting ? 'Adding...' : 'Add Task'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={{ marginTop: 10, alignItems: 'center' }}
          >
            <Text style={{ color: COLORS.textSecondary }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDateObj || today()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowStartPicker(false);
            if (event.type === 'set' && date) {
              setStartDateObj(date);
            }
          }}
        />
      )}

      {showDeadlinePicker && (
        <DateTimePicker
          value={deadlineDateObj || tomorrow()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDeadlinePicker(false);
            if (event.type === 'set' && date) {
              setDeadlineDateObj(date);
            }
          }}
        />
      )}
    </Modal>
  );
}
