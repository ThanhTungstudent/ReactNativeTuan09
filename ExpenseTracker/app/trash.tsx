import { Transaction } from "@/type/transaction";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../database/db";

export default function TrashScreen() {
  const [trash, setTrash] = useState<Transaction[]>([]);
  const router = useRouter();

  // ✅ Lấy danh sách đã xoá
  const fetchTrash = async () => {
    const result = await db.getAllAsync<Transaction>(
      "SELECT * FROM transactions WHERE deleted = 1 ORDER BY createdAt DESC"
    );
    setTrash(result);
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  // ✅ Khôi phục item
  const restoreItem = async (id: number) => {
    await db.runAsync("UPDATE transactions SET deleted = 0 WHERE id = ?", [id]);
    fetchTrash();
    Alert.alert("✅ Đã khôi phục", "Giao dịch đã được khôi phục!");
  };

  // ✅ Xoá vĩnh viễn
  const deleteForever = async (id: number) => {
    Alert.alert("⚠️ Xác nhận xoá vĩnh viễn", "Thao tác này không thể hoàn tác!", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xoá vĩnh viễn",
        style: "destructive",
        onPress: async () => {
          await db.runAsync("DELETE FROM transactions WHERE id = ?", [id]);
          fetchTrash();
          Alert.alert("🗑️ Đã xoá vĩnh viễn");
        },
      },
    ]);
  };

  // ✅ Hiện menu khi chạm lâu vào item
  const handleLongPress = (id: number) => {
    Alert.alert(
      "Chọn hành động",
      "Bạn muốn làm gì với giao dịch này?",
      [
        { text: "Khôi phục", onPress: () => restoreItem(id) },
        { text: "Xoá vĩnh viễn", style: "destructive", onPress: () => deleteForever(id) },
        { text: "Hủy", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {/* ✅ Header có nút quay lại */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>⬅️ Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.header}>🗑️ Thùng rác</Text>
        <View style={{ width: 80 }} />
      </View>

      {/* ✅ Danh sách các giao dịch đã xoá */}
      <FlatList
        data={trash}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onLongPress={() => handleLongPress(item.id)}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={{ color: "#777" }}>{item.amount} đ</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#777", marginTop: 20 }}>
            Thùng rác trống
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  header: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  backButton: { color: "#2b8aef", fontWeight: "600", fontSize: 16 },
  item: {
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
});
