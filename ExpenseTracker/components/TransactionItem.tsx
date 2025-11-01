import { Transaction } from "@/type/transaction";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../database/db";

type Props = {
  item: Transaction;
  refresh: () => void;
};

export const TransactionItem = ({ item, refresh }: Props) => {
  const router = useRouter();

  // ✅ Hàm xoá (đánh dấu là deleted = 1)
  const handleDelete = () => {
    Alert.alert(
      "Xác nhận xoá",
      `Bạn có chắc muốn xoá "${item.title}" không?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xoá",
          style: "destructive",
          onPress: async () => {
            try {
              await db.runAsync(
                "UPDATE transactions SET deleted = 1 WHERE id = ?",
                [item.id]
              );
              refresh(); // Cập nhật lại danh sách
              Alert.alert("Đã xoá", `"${item.title}" đã được chuyển vào thùng rác.`);
            } catch (error) {
              console.error(error);
              Alert.alert("Lỗi", "Không thể xoá giao dịch.");
            }
          },
        },
      ]
    );
  };

  // ✅ Hàm sửa
  const handleEdit = () => {
    router.push({ pathname: "/edit", params: { id: String(item.id) } });
  };

  return (
    <TouchableOpacity
      onPress={handleEdit}
      onLongPress={handleDelete}
      style={styles.item}
    >
      <View style={styles.row}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.amount}>
          {Number(item.amount).toLocaleString()} ₫
        </Text>
      </View>
      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 5,
    borderLeftColor: "#2b8aef",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: { fontSize: 16, fontWeight: "600", color: "#333" },
  amount: { fontSize: 16, fontWeight: "600", color: "#2b8aef" },
  date: { fontSize: 12, color: "#777", marginTop: 4 },
});
