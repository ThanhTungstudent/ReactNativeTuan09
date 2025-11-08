import { Transaction } from "@/type/transaction";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TransactionItem } from "../components/TransactionItem";
import { db, initDB } from "../database/db";

export default function HomeScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const [filter, setFilter] = useState<"all" | "Thu" | "Chi">("all");

  // ✅ Lấy danh sách giao dịch
  const fetchTransactions = async (query: string = "", filterType = filter) => {
    let sql = "SELECT * FROM transactions WHERE deleted = 0";
    let params: string[] = [];

    if (query.trim() !== "") {
      sql += " AND (title LIKE ? OR type LIKE ?)";
      params = [`%${query}%`, `%${query}%`];
    }

    if (filterType !== "all") {
      sql += " AND type = ?";
      params.push(filterType);
    }

    sql += " ORDER BY id DESC";
    const result = await db.getAllAsync<Transaction>(sql, params);
    setTransactions(result);
  };

  useEffect(() => {
    initDB();
    fetchTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTransactions(searchQuery);
    }, [searchQuery])
  );

  const handleAdd = () => {
    router.push({ pathname: "/add" });
  };

  const handleSearch = () => {
    fetchTransactions(searchQuery);
  };

  // ✅ Khi kéo xuống để refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions(searchQuery);
    setRefreshing(false);
  };

  // ✅ Hàm đồng bộ với API
  const handleSync = async () => {
    Alert.prompt(
      "Nhập link API để đồng bộ",
      "Dán link MockAPI.io (vd: https://68e7623b10e3f82fbf3ee539.mockapi.io/transactions)",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đồng bộ",
          onPress: async (apiUrl?: string) => {
            if (!apiUrl) {
              Alert.alert("⚠️ Thiếu link API");
              return;
            }

            try {
              // ✅ Lấy toàn bộ data trên API để xóa
              const existing = await fetch(apiUrl);
              const data = await existing.json();

              for (const item of data) {
                await fetch(`${apiUrl}/${item.id}`, { method: "DELETE" });
              }

              // ✅ Lấy tất cả giao dịch trong SQLite
              const localData = await db.getAllAsync<Transaction>(
                "SELECT * FROM transactions WHERE deleted = 0"
              );

              // ✅ POST lên API
              for (const t of localData) {
                await fetch(apiUrl, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    title: t.title,
                    amount: t.amount,
                    type: t.type,
                    createdAt: t.createdAt,
                  }),
                });
              }

              Alert.alert("✅ Thành công", "Đã đồng bộ dữ liệu lên API!");
            } catch (error) {
              console.error(error);
              Alert.alert(
                "❌ Lỗi",
                "Không thể đồng bộ. Vui lòng kiểm tra lại link API."
              );
            }
          },
        },
      ],
      "plain-text"
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EXPENSE TRACKER</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Tổng quan */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Tổng chi tiêu</Text>
          <Text style={styles.summaryAmount}>0 ₫</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
            <Text style={styles.addButtonText}>Thêm giao dịch</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSync} style={styles.syncButton}>
            <Text style={styles.syncButtonText}>Đồng bộ</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/statistics")}>
            <Text style={{ color: "#2b8aef", marginTop: 12 }}>
              📊 Xem thống kê
            </Text>
          </TouchableOpacity>
        </View>

        {/* 🔍 Thanh tìm kiếm */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Nhập từ khóa..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Tìm</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          {["all", "Thu", "Chi"].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => {
                setFilter(type as any);
                fetchTransactions(searchQuery, type as any);
              }}
              style={[
                styles.filterButton,
                filter === type && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === type && styles.filterTextActive,
                ]}
              >
                {type === "all" ? "Tất cả" : type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ✅ Danh sách giao dịch có kéo để làm mới */}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Danh sách giao dịch</Text>
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TransactionItem item={item} refresh={fetchTransactions} />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#2b8aef"]}
              />
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>Chưa có giao dịch nào</Text>
            }
          />
        </View>

        <TouchableOpacity onPress={() => router.push("/trash")}>
          <Text>🗑️ Xem thùng rác</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },
  header: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#333" },
  body: { flex: 1, padding: 16 },
  summaryCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  summaryLabel: { color: "#555", fontSize: 14 },
  summaryAmount: { fontSize: 26, fontWeight: "bold", marginTop: 8 },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  addButton: {
    flex: 1,
    backgroundColor: "#2b8aef",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  syncButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#2b8aef",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 8,
    backgroundColor: "#fff",
  },
  addButtonText: { color: "#fff", fontWeight: "600" },
  syncButtonText: { color: "#2b8aef", fontWeight: "600" },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: "#2b8aef",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  searchButtonText: { color: "#fff", fontWeight: "600" },
  listContainer: { marginTop: 20 },
  listTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  emptyText: { textAlign: "center", color: "#777", marginTop: 16 },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 4,
  },

  filterButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#2b8aef",
    borderRadius: 8,
    alignItems: "center",
  },

  filterButtonActive: {
    backgroundColor: "#2b8aef",
  },

  filterText: {
    color: "#2b8aef",
    fontWeight: "600",
  },

  filterTextActive: {
    color: "#fff",
  },
});
