import e, { Request, Response } from "express";
import { Table } from "../types/table";
import {
  createTableService,
  deleteTableService,
  getAllTablesService,
  getTableByIdService,
  updateTableStatusService,
} from "../services/tableService";

export const createTable = async (
  req: Request<unknown, unknown, Table>,
  res: Response
) => {
  try {
    const table: Table = req.body;
    const createdTable = await createTableService(table);
    res.status(201).json(createdTable);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating table: ${error.message}` });
  }
};

export const getTableById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const table = await getTableByIdService(id);
    res.status(200).json(table);
  } catch (error: any) {
    res.status(500).json({ message: `Error fetching table: ${error.message}` });
  }
};

export const updateTableStatus = async (
  req: Request<{ id: string }, unknown, { status: "OCCUPIED" | "UNOCCUPIED" }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedTable = await updateTableStatusService(id, status);
    res.status(200).json(updatedTable);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating table status: ${error.message}` });
  }
};

export const deleteTable = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const deletedTable = await deleteTableService(id);
    res
      .status(200)
      .json({ message: "Table deleted successfully", deletedTable });
  } catch (error: any) {
    res.status(500).json({ message: `Error deleting table: ${error.message}` });
  }
};

export const getAllTables = async (req: Request, res: Response) => {
  try {
    const tables = await getAllTablesService();
    res.status(200).json(tables);
  } catch (error: any) {
    res.status(500).json({ message: `Error fetching tables: ${error.message}` });
  }
};
