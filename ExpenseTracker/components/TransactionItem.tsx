
import { Transaction } from "@/type/transaction";
import React from "react";
import { StyleSheet, Text, View } from "react-native";



interface Props {
  item: Transaction;
}

export const TransactionItem: React.FC<Props> = ({ item }) => {
  const isIncome = item.type === "Thu";

  return (
    <View style={[styles.itemContainer, isIncome ? styles.income : styles.expense]}>
      <View style={styles.rowBetween}>
        <Text style={styles.title}>{item.title}</Text>
        <Text
          style={[
            styles.amount,
            { color: isIncome ? "#2ecc71" : "#e74c3c" },
          ]}
        >
          {isIncome ? `+ ${item.amount.toLocaleString()} ₫` : `- ${item.amount.toLocaleString()} ₫`}
        </Text>
      </View>
      <Text style={styles.date}>{item.createdAt}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 16, fontWeight: "600", color: "#333" },
  amount: { fontSize: 16, fontWeight: "700" },
  date: { fontSize: 12, color: "#777", marginTop: 4 },
  income: { borderLeftWidth: 4, borderLeftColor: "#2ecc71" },
  expense: { borderLeftWidth: 4, borderLeftColor: "#e74c3c" },
});
