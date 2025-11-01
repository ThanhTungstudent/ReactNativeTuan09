import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("expense.db");

export const initDB = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now','localtime'))
    );
  `);
};
