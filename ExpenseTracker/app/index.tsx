import { Transaction } from "@/type/transaction";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    FlatList,
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
    const [searchQuery, setSearchQuery] = useState(""); // 🔍 text input
    const router = useRouter();

    const fetchTransactions = async (query: string = "") => {
        let sql = "SELECT * FROM transactions WHERE deleted = 0";
        let params: string[] = [];

        if (query.trim() !== "") {
            sql += " AND (title LIKE ? OR type LIKE ?)";
            params = [`%${query}%`, `%${query}%`];
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
                    <TouchableOpacity style={styles.syncButton}>
                        <Text style={styles.syncButtonText}>Đồng bộ</Text>
                    </TouchableOpacity>
                </View>

                {/* 🔍 Tìm kiếm */}
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

                {/* Danh sách giao dịch */}
                <View style={styles.listContainer}>
                    <Text style={styles.listTitle}>Danh sách giao dịch</Text>
                    <FlatList
                        data={transactions}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TransactionItem item={item} refresh={fetchTransactions} />
                        )}
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

    // 🔍 Styles cho tìm kiếm
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
});
