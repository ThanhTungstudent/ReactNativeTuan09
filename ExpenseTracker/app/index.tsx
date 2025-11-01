
import { Transaction } from "@/type/transaction";
import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TransactionItem } from "../components/TransactionItem";


export default function HomeScreen() {
  const transactions: Transaction[] = [{
    id: 1,
    title: "Lương tháng 10",
    amount: 10000000,
    createdAt: "2025-10-31",
    type: "income",
  },
  {
    id: 2,
    title: "Mua cà phê",
    amount: 50000,
    createdAt: "2025-11-01",
    type: "expense",
  },];

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
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Thêm giao dịch</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.syncButton}>
            <Text style={styles.syncButtonText}>Đồng bộ</Text>
          </TouchableOpacity>
        </View>

        {/* Danh sách giao dịch */}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Danh sách giao dịch</Text>
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <TransactionItem item={item}/>}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Chưa có giao dịch nào</Text>
            }
          />
        </View>
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
  listContainer: { marginTop: 20 },
  listTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  transactionItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 16,
  },
});
