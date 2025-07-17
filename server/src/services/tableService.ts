import TableModel from "../models/table/tableModel";
import { Table } from "../types/table";
import QRCode from "qrcode";
import { deleteImage, uploadImage } from "./uploadImage";

export const createTableService = async (table: Table) => {
  try {
    const qr = await QRCode.toDataURL(
      `${process.env.CLIENT_URL}/${table.slug}`
    );
    const base64Data = qr.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const { url, public_id } = await uploadImage(buffer, table.slug);
    const newTable = {
      ...table,
      qrCode: url,
      public_id,
    };
    const createdTable = await TableModel.create(newTable);
    return createdTable;
  } catch (error: any) {
    throw new Error(`Error creating table: ${error.message}`);
  }
};

export const getTableByIdService = async (id: string) => {
  try {
    const table = await TableModel.findById(id);
    if (!table) {
      throw new Error("Table not found");
    }
    return table;
  } catch (error: any) {
    throw new Error(`Error fetching table: ${error.message}`);
  }
};

export const updateTableStatusService = async (
  id: string,
  status: "OCCUPIED" | "UNOCCUPIED"
) => {
  try {
    const updatedTable = await TableModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedTable) {
      throw new Error("Table not found");
    }
    return updatedTable;
  } catch (error: any) {
    throw new Error(`Error updating table status: ${error.message}`);
  }
};

export const deleteTableService = async (id: string) => {
  try {
    const deletedTable = await TableModel.findByIdAndDelete(id);
    if (deletedTable?.public_id)
      await deleteImage(deletedTable?.public_id || "");

    if (!deletedTable) {
      throw new Error("Table not found");
    }
    return deletedTable;
  } catch (error: any) {
    throw new Error(`Error deleting table: ${error.message}`);
  }
};

export const getAllTablesService = async () => {
  try {
    const tables = await TableModel.find();
    return tables;
  } catch (error: any) {
    throw new Error(`Error fetching tables: ${error.message}`);
  }
};
