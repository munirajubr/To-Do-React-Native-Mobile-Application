import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";
import DraggableFlatList from "react-native-draggable-flatlist";
import DateTimePicker from "@react-native-community/datetimepicker";

/* ---------------- SAMPLE TASKS ---------------- */
const SAMPLE_TASKS = [
  { _id: "1", title: "Design Home Screen UI", status: "pending" },
  { _id: "2", title: "Integrate Task API", status: "pending" },
  { _id: "3", title: "Fix Navigation Bugs", status: "completed" },
];

export default function HomeScreen() {
  const router = useRouter();

  const [tasks, setTasks] = useState(SAMPLE_TASKS);
  const [showAddTask, setShowAddTask] = useState(false);

  // Add Task form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);

  /* ---------- SPLIT TASKS ---------- */
  const pendingTasks = tasks.filter(t => t.status === "pending");
  const completedTasks = tasks.filter(t => t.status === "completed");

  /* ---------- TOGGLE COMPLETE ---------- */
  const toggleTask = (taskId) => {
    setTasks(prev =>
      prev.map(task =>
        task._id === taskId
          ? {
              ...task,
              status:
                task.status === "pending" ? "completed" : "pending",
            }
          : task
      )
    );
  };

  /* ---------- REORDER (PENDING ONLY) ---------- */
  const onDragEnd = ({ data }) => {
    setTasks([...data, ...completedTasks]);
  };

  /* ---------- ADD TASK ---------- */
  const handleAddTask = () => {
    if (!title || !startDate || !deadline) return;

    setTasks(prev => [
      ...prev,
      {
        _id: Date.now().toString(),
        title,
        status: "pending",
      },
    ]);

    // reset
    setTitle("");
    setDescription("");
    setStartDate(null);
    setDeadline(null);
    setShowAddTask(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>My Tasks</Text>
          <Text style={styles.subHeading}>
            Drag to reorder • Tap to complete
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(pages)/profile")}
        >
          <Image
            source={{
              uri: "https://xsgames.co/randomusers/avatar.php?g=male",
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* PENDING TASKS */}
      <DraggableFlatList
        data={pendingTasks}
        keyExtractor={(item) => item._id}
        onDragEnd={onDragEnd}
        renderItem={({ item, drag, isActive }) => (
          <TouchableOpacity
            onLongPress={drag}
            disabled={isActive}
            style={[
              styles.taskCard,
              isActive && { backgroundColor: "#ddd" },
            ]}
          >
            <View style={styles.taskLeft}>
              <TouchableOpacity onPress={() => toggleTask(item._id)}>
                <Ionicons
                  name="square-outline"
                  size={24}
                  color="#333"
                />
              </TouchableOpacity>

              <Text style={styles.taskText}>{item.title}</Text>
            </View>

            <Ionicons
              name="reorder-three-outline"
              size={24}
              color="#555"
            />
          </TouchableOpacity>
        )}
      />

      {/* COMPLETED TASKS */}
      {completedTasks.length > 0 && (
        <Text style={styles.completedHeading}>Completed</Text>
      )}

      {completedTasks.map(task => (
        <View
          key={task._id}
          style={[styles.taskCard, styles.completedTask]}
        >
          <View style={styles.taskLeft}>
            <TouchableOpacity onPress={() => toggleTask(task._id)}>
              <Ionicons
                name="checkbox"
                size={24}
                color="#777"
              />
            </TouchableOpacity>

            <Text style={styles.completedText}>
              {task.title}
            </Text>
          </View>
        </View>
      ))}

      {/* ADD TASK FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddTask(true)}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* ADD TASK MODAL (BOTTOM SHEET) */}
      <Modal
        visible={showAddTask}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalRoot}>
          {/* Overlay */}
          <Pressable
            style={styles.backdrop}
            onPress={() => setShowAddTask(false)}
          />

          {/* Bottom Sheet */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.sheetWrapper}
          >
            <View style={styles.sheet}>
              <View style={styles.handle} />

              <Text style={styles.sheetTitle}>Add New Task</Text>

              <TextInput
                placeholder="Task title *"
                style={styles.input}
                value={title}
                onChangeText={setTitle}
              />

              <TextInput
                placeholder="Description"
                style={styles.input}
                value={description}
                onChangeText={setDescription}
              />

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

              {showStartPicker && (
                <DateTimePicker
                  value={startDate ? new Date(startDate) : new Date()}
                  mode="date"
                  onChange={(e, date) => {
                    setShowStartPicker(false);
                    if (e.type === "set" && date)
                      setStartDate(date.toISOString());
                  }}
                />
              )}

              {showDeadlinePicker && (
                <DateTimePicker
                  value={deadline ? new Date(deadline) : new Date()}
                  mode="date"
                  onChange={(e, date) => {
                    setShowDeadlinePicker(false);
                    if (e.type === "set" && date)
                      setDeadline(date.toISOString());
                  }}
                />
              )}

              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  (!title || !startDate || !deadline) && {
                    opacity: 0.5,
                  },
                ]}
                disabled={!title || !startDate || !deadline}
                onPress={handleAddTask}
              >
                <Text style={styles.saveText}>Save Task</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
  },
  subHeading: {
    color: "#777",
    marginTop: 2,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },

  taskCard: {
    backgroundColor: "#eaeaea",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  taskLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    flex: 1,
  },

  completedHeading: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#777",
  },
  completedTask: {
    opacity: 0.5,
  },
  completedText: {
    fontSize: 16,
    textDecorationLine: "line-through",
    color: "#777",
  },

  fab: {
    position: "absolute",
    right: 24,
    bottom: 30,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#083b52ff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  modalRoot: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  backdrop: {
    flex: 1,
  },
  sheetWrapper: {
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 10,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: "#083b52ff",
    paddingVertical: 16,
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
