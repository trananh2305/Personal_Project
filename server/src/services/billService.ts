import { emit } from "process";
import BillModel from "../models/bill/billModel";
import OrderModel from "../models/order/orderModel";
import { getIo } from "../socket";
import { Discount } from "../types/discount";
import { updateTableStatusService } from "./tableService";
import { updateDiscountService } from "./discountService";

export const requestBillService = async (
  orderId: string,
  discount: Discount
) => {
  try {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    const taxRate = 0.08; // 8% VAT
    const priceWithTax = order.totalPrice * (1 + taxRate);

    let lastPayment = 0;
    if (discount) {
      if (discount.type === "fixed") {
        lastPayment = priceWithTax - discount.value;
      } else {
        // Giả định discount.value là %
        lastPayment = priceWithTax * (1 - discount.value / 100);
      }
    }

    lastPayment = Math.max(0, lastPayment); // đảm bảo không âm

    const newBill = await BillModel.create({
      orderId,
      discountId: discount._id,
      lastPayment,
    });

    const updatedUserUsed = [
      ...(discount.userUsed || []).map((id: any) => id.toString()),
      order.userId.toString(),
    ];
    const newDiscont = {
      ...discount,
      userUsed: updatedUserUsed,
    };

    await updateDiscountService(discount._id, newDiscont);

    return getBillByIdService(newBill._id.toString());
  } catch (error: any) {
    throw new Error(
      "Error creating bill: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
};

export const getBillByIdService = async (id: string) => {
  try {
    const bill = await BillModel.findById(id).populate([
      "orderId",
      "discountId",
    ]);
    return bill;
  } catch (error) {
    throw new Error(
      "Error fetching bill: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
};

export const getAllBillService = async () => {
  try {
    const allBills = await BillModel.find({ active: { $nin: false } });
    return allBills;
  } catch (error) {
    throw new Error(
      "Error fetching bills: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
};

export const updateBillService = async (id: string, tableId: string) => {
  try {
    const io = getIo();
    const updateBill = await BillModel.findByIdAndUpdate(
      id,
      { active: true },
      { new: true }
    );

    if (!updateBill) {
      throw new Error("Bill not found");
    }
    const updateStatusTable = await updateTableStatusService(
      tableId,
      "OCCUPIED"
    );
    io.emit("tableStatus", updateStatusTable);
    return updateBill;
  } catch (error) {
    throw new Error(
      "Error fetching bills: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
};
