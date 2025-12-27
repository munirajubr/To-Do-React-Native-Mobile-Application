import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { API_URL } from "../../constants/api";

export default function AddTaskScreen() {
  const router = useRouter();
  const username = "muniraj"; // 🔴 hardcoded for now

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [startDate, setStartDate] = useState(null);
  const [deadline, setDeadline] = useState(null);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);

  const [loading, setLoading] = useState(false);

  /* ---------------- ADD TASK ---------------- */
  const handleAddTask = async () => {
    if (!title || !startDate || !deadline) return;

    setLoading(true);
    try {
      await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          title,
          description,
          startDate,
          deadline,
        }),
      });

      router.back(); // go back to Home
    } catch (err) {
      console.log("Add task error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Add Task</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* FORM */}
      <TextInput
        placeholder="Task title *"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Description (optional)"
        style={[styles.input, { height: 90 }]}
        multiline
        value={description}
        onChangeText={setDescription}
      />

      {/* START DATE */}
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowStartPicker(true)}
      >
        <Ionicons name="calendar-outline" size={20} />
        <Text>
          {startDate
            ? new Date(startDate).toDateString()
            : "Select Start Date *"}
        </Text>
      </TouchableOpacity>

      {/* DEADLINE */}
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowDeadlinePicker(true)}
      >
        <Ionicons name="calendar-outline" size={20} />
        <Text>
          {deadline
            ? new Date(deadline).toDateString()
            : "Select Deadline *"}
        </Text>
      </TouchableOpacity>

      {/* DATE PICKERS */}
      {showStartPicker && (
        <DateTimePicker
          value={startDate ? new Date(startDate) : new Date()}
          mode="date"
          onChange={(event, date) => {
            setShowStartPicker(false);
            if (event.type === "set" && date) {
              setStartDate(date.toISOString());
            }
          }}
        />
      )}

      {showDeadlinePicker && (
        <DateTimePicker
          value={deadline ? new Date(deadline) : new Date()}
          mode="date"
          onChange={(event, date) => {
            setShowDeadlinePicker(false);
            if (event.type === "set" && date) {
              setDeadline(date.toISOString());
            }
          }}
        />
      )}

      {/* SAVE BUTTON */}
      <TouchableOpacity
        style={[
          styles.saveBtn,
          (!title || !startDate || !deadline) && { opacity: 0.5 },
        ]}
        disabled={!title || !startDate || !deadline || loading}
        onPress={handleAddTask}
      >
        <Text style={styles.saveText}>
          {loading ? "Saving..." : "Save Task"}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f2f2",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  saveBtn: {
    backgroundColor: "#083b52ff",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
