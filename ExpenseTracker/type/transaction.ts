export type Transaction = {
  id: number;
  title: string;
  amount: number;
  createdAt: string;
  type: "income" | "expense";
}