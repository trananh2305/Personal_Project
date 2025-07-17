import { OrderItem } from "./orderItem";

export interface Order {
  _id: string;
  tableId: string;
  items: OrderItem[];
  userId: string;
  status:
    | "PENDING"
    | "COMPLETED"
    | "CANCELED"
    | "IN_PROGRESS"
    | "CONFIRMED"
    | "SERVED";
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
