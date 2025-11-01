import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../database/db";

export default function AddScreen() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"Thu" | "Chi">("Chi");

  const titleRef = useRef<TextInput>(null);
  const amountRef = useRef<TextInput>(null);
  const router = useRouter();

  const handleSave = async () => {
    if (!title || !amount) {
      Alert.alert("Thiếu dữ liệu", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) {
      Alert.alert("Sai định dạng", "Số tiền phải là số!");
      return;
    }

    await db.runAsync(
      "INSERT INTO transactions (title, amount, type) VALUES (?, ?, ?)",
      [title, amountNum, type]
    );

    // Clear nội dung ô nhập
    setTitle("");
    setAmount("");
    titleRef.current?.clear();
    amountRef.current?.clear();

     Alert.alert("✅ Thành công", "Đã thêm giao dịch!", [
    {
      text: "OK",
      onPress: () => router.back(), 
    },
  ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        Thêm giao dịch mới
      </Text>

      {/* --- Tên khoản --- */}
      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 6 }}>
          Tên khoản
        </Text>
        <TextInput
          ref={titleRef}
          placeholder="Nhập tên khoản chi hoặc thu"
          value={title}
          onChangeText={setTitle}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            borderRadius: 8,
          }}
        />
      </View>

      {/* --- Số tiền --- */}
      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 6 }}>
          Số tiền
        </Text>
        <TextInput
          ref={amountRef}
          placeholder="Nhập số tiền (VD: 150000)"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            borderRadius: 8,
          }}
        />
      </View>

      {/* --- Loại giao dịch --- */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
          Loại giao dịch
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginVertical: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => setType("Thu")}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 30,
              backgroundColor: type === "Thu" ? "#28a745" : "#e0e0e0",
              borderRadius: 8,
            }}
          >
            <Text style={{ color: type === "Thu" ? "white" : "black" }}>
              Thu
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setType("Chi")}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 30,
              backgroundColor: type === "Chi" ? "#dc3545" : "#e0e0e0",
              borderRadius: 8,
            }}
          >
            <Text style={{ color: type === "Chi" ? "white" : "black" }}>
              Chi
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- Nút lưu --- */}
      <TouchableOpacity
        onPress={handleSave}
        style={{
          backgroundColor: "#007bff",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>💾 Lưu</Text>
      </TouchableOpacity>

      {/* --- Nút quay lại --- */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          marginTop: 10,
          backgroundColor: "#6c757d",
          padding: 10,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>⬅️ Quay lại</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
