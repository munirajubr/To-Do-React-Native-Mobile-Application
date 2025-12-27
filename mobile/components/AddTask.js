import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import { endpoints } from "../constants/api";

const today = () => new Date();
const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d;
};

const formatDate = (d) => {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export default function AddTask({ username, visible, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDateObj, setStartDateObj] = useState(today());
  const [deadlineDateObj, setDeadlineDateObj] = useState(tomorrow());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!username) return;
    if (!title.trim()) {
      Alert.alert("Validation", "Task name is required");
      return;
    }

    const body = {
      username,
      title,
      description: description || "",
      startDate: formatDate(startDateObj || today()),
      deadline: formatDate(deadlineDateObj || tomorrow()),
      status: "pending",
    };

    try {
      setSubmitting(true);
      const res = await fetch(endpoints.addTask, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        Alert.alert("Add task failed", text || "Unknown error");
        return;
      }

      const json = await res.json(); // { message, tasks }
      onSuccess?.(json.tasks || []);

      // reset form
      setTitle("");
      setDescription("");
      setStartDateObj(today());
      setDeadlineDateObj(tomorrow());
      onClose?.();
    } catch (e) {
      Alert.alert("Error", e.message);
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
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header same as TaskDetails */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add New Task</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={styles.label}>Task Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="task title"
            placeholderTextColor={COLORS.placeholderText}
            style={styles.input}
          />

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="description"
            placeholderTextColor={COLORS.placeholderText}
            style={styles.input}
          />

          {/* Dates row */}
          <View style={styles.datesRow}>
            <View style={styles.dateCol}>
              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                style={styles.datePicker}
              >
                <Text
                  style={[
                    styles.dateText,
                    !startDateObj && { color: COLORS.placeholderText },
                  ]}
                >
                  {startDateObj ? formatDate(startDateObj) : "Select date"}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.dateCol}>
              <Text style={styles.label}>Deadline</Text>
              <TouchableOpacity
                onPress={() => setShowDeadlinePicker(true)}
                style={styles.datePicker}
              >
                <Text
                  style={[
                    styles.dateText,
                    !deadlineDateObj && { color: COLORS.placeholderText },
                  ]}
                >
                  {deadlineDateObj
                    ? formatDate(deadlineDateObj)
                    : "Select date"}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Primary button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting}
            style={[
              styles.primaryButton,
              submitting && { opacity: 0.7 },
            ]}
          >
            <Text style={styles.primaryText}>
              {submitting ? "Adding..." : "Add Task"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date pickers */}
      {showStartPicker && (
        <DateTimePicker
          value={startDateObj || today()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowStartPicker(false);
            if (event.type === "set" && date) setStartDateObj(date);
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
            if (event.type === "set" && date) setDeadlineDateObj(date);
          }}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  closeText: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.textSecondary,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 10,
  },
  input: {
    fontSize: 14,
    color: COLORS.textDark,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 6,
    marginTop: 4,
  },
  datesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  dateCol: {
    flex: 1,
    marginHorizontal: 4,
  },
  datePicker: {
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  primaryButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },
  cancelWrapper: {
    marginTop: 10,
    alignItems: "center",
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
