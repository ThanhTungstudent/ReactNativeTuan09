import { Transaction } from "@/type/transaction";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { db } from "../database/db";

export default function EditTransaction() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");


  // ✅ Lấy dữ liệu hiện tại từ DB
  useEffect(() => {
    const fetchTransaction = async () => {
      if (!id) return;
      const result = await db.getAllAsync<Transaction>(
        "SELECT * FROM transactions WHERE id = ?",
        [id]
      );
      if (result.length > 0) {
        const item = result[0];
        setTitle(item.title);
        setAmount(String(item.amount));
      }
    };
    fetchTransaction();
  }, [id]);

  // ✅ Hàm cập nhật DB
  const handleSave = async () => {
    if (!title || !amount) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    await db.runAsync(
      "UPDATE transactions SET title = ?, amount = ? WHERE id = ?",
      [title, Number(amount), id]
    );

    Alert.alert("Thành công", "Cập nhật giao dịch thành công!");
    router.back(); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chỉnh sửa giao dịch</Text>

      <Text style={styles.label}>Tên giao dịch</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Nhập tên giao dịch"
      />

      <Text style={styles.label}>Số tiền</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder="Nhập số tiền"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>💾 Lưu thay đổi</Text>
      </TouchableOpacity>
      <TouchableOpacity
  style={styles.backButton}
  onPress={() => router.back()}
>
  <Text style={styles.backButtonText}>↩ Quay lại</Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { fontSize: 20, fontWeight: "700", marginBottom: 20 },
  label: { fontSize: 14, color: "#444", marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: "#2b8aef",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: { color: "#fff", fontWeight: "600" },
  backButton: {
    backgroundColor: "#6c757d",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  backButtonText: { color: "#fff", fontWeight: "600" },
});
