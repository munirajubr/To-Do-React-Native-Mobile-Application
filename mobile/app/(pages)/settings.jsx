import {
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Settings</Text>

        {/* Spacer to balance header */}
        <View style={{ width: 24 }} />
      </View>

      {/* PREFERENCES */}
      <View style={styles.section}>
        <SettingsItem
          icon="moon-outline"
          label="Dark Mode"
          rightComponent={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
            />
          }
        />

        <SettingsItem
          icon="notifications-outline"
          label="Notifications"
          rightComponent={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
            />
          }
        />
      </View>

      {/* ACCOUNT */}
      <View style={[styles.section, { marginTop: 20 }]}>
        <SettingsItem icon="person-outline" label="Account Settings" />
        <SettingsItem icon="lock-closed-outline" label="Privacy & Security" />
        <SettingsItem icon="key-outline" label="Change Password" />
      </View>

      {/* ABOUT */}
      <View style={[styles.section, { marginTop: 20 }]}>
        <SettingsItem icon="information-circle-outline" label="About App" />
        <SettingsItem icon="document-text-outline" label="Terms & Conditions" />
        <SettingsItem icon="shield-checkmark-outline" label="Privacy Policy" />
      </View>
    </SafeAreaView>
  );
}

/* ---------------- SETTINGS ITEM ---------------- */
const SettingsItem = ({ icon, label, rightComponent }) => (
  <TouchableOpacity
    style={styles.item}
    activeOpacity={rightComponent ? 1 : 0.7}
  >
    <View style={styles.itemLeft}>
      <Ionicons name={icon} size={22} color="#4630EB" />
      <Text style={styles.itemText}>{label}</Text>
    </View>
    {rightComponent ? (
      rightComponent
    ) : (
      <Ionicons name="chevron-forward" size={20} color="#999" />
    )}
  </TouchableOpacity>
);

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 8,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
});
