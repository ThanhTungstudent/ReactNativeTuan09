import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("expense.db");

export const initDB = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // ✅ Thêm cột deleted nếu chưa có
  try {
    await db.execAsync(`ALTER TABLE transactions ADD COLUMN deleted INTEGER DEFAULT 0`);
  } catch (error) {
    // Bỏ qua nếu cột đã tồn tại
  }
};
