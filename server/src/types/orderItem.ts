export interface OrderItem {
  _id: string;
  orderId: string;
  itemId: string;
  quantity: number;
  status: "PENDING" | "COMPLETED" | "PROCESSING" | "SERVED";
  price: number;
  chefId?: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
