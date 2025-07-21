export interface Bill {
  _id: string;
  orderId: string;
  lastPayment: number;
  discountId?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
