import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { db } from "../database/db";
import { useRouter } from "expo-router";

type MonthlyStat = {
  month: string; // "01", "02", ...
  thu: number;
  chi: number;
};

export default function StatisticsScreen() {
  const [stats, setStats] = useState<MonthlyStat[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchMonthlyStats();
  }, []);

  // ✅ Lấy tổng thu/chi theo tháng
  const fetchMonthlyStats = async () => {
    const result = await db.getAllAsync<{
      month: string;
      type: string;
      total: number;
    }>(
      `
      SELECT 
        strftime('%m', createdAt) AS month,
        type,
        SUM(amount) AS total
      FROM transactions
      WHERE deleted = 0
      GROUP BY month, type
      ORDER BY month ASC
      `
    );

    // Khởi tạo 12 tháng
    const monthly: MonthlyStat[] = Array.from({ length: 12 }).map((_, i) => ({
      month: String(i + 1).padStart(2, "0"),
      thu: 0,
      chi: 0,
    }));

    // Gán dữ liệu
    result.forEach((row) => {
      const index = Number(row.month) - 1;
      if (row.type === "Thu") monthly[index].thu = row.total;
      if (row.type === "Chi") monthly[index].chi = row.total;
    });

    setStats(monthly);
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Biểu đồ thu – chi theo tháng</Text>

      {/* Nút quay lại */}
      <Text style={styles.backBtn} onPress={() => router.back()}>
        ⬅️ Quay lại
      </Text>

      <LineChart
        data={{
          labels: stats.map((m) => m.month),
          datasets: [
            {
              data: stats.map((m) => Number(m.thu) || 0),
              color: () => "#28a745",
              strokeWidth: 2,
            },
            {
              data: stats.map((m) => Number(m.chi) || 0),
              color: () => "#dc3545",
              strokeWidth: 2,
            },
          ],
          legend: ["Thu", "Chi"],
        }}
        width={screenWidth - 20}
        height={280}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          labelColor: () => "#333",
        }}
        bezier
        style={{ marginVertical: 16, borderRadius: 12 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  backBtn: {
    color: "#2b8aef",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
});
