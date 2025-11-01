export type Transaction = {
  id: number;
  title: string;
  amount: number;
  createdAt: string;
  type: "Thu" | "Chi";
  deleted: number;
}