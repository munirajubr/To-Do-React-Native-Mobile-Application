import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

export default function TaskDetails({ visible, task, onClose, onDelete }) {
  if (!task) return null;

  const { _id, title, description, startDate, deadline, status } = task;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Task Details</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={22}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <Text style={styles.label}>Title</Text>
          <Text style={styles.value}>{title}</Text>

          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>
            {description || "No description"}
          </Text>

          <Text style={styles.label}>Start Date</Text>
          <Text style={styles.value}>{startDate || "-"}</Text>

          <Text style={styles.label}>Deadline</Text>
          <Text style={styles.value}>{deadline || "-"}</Text>

          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>
            {status === "completed" ? "Completed" : "Pending"}
          </Text>

          {/* Delete button */}
          <TouchableOpacity
            onPress={() => onDelete?.(_id)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={18} color="#ff3b3b" />
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  label: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 10,
  },
  value: {
    fontSize: 14,
    color: COLORS.textDark,
    marginTop: 4,
  },
  deleteButton: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  deleteText: {
    marginLeft: 6,
    fontSize: 15,
    color: "#ff3b3b",
    fontWeight: "500",
  },
});
