import type { Request, Response } from "express";
import * as voucherService from "../services/voucher.service.js";

export const createVoucher = async (req: Request, res: Response) => {
  try {
    const data = {
      ...req.body,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
    };
    const voucher = await voucherService.createVoucher(data);
    res.status(201).json(voucher);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create voucher";
    res.status(400).json({ error: message });
  }
};

export const getVouchers = async (req: Request, res: Response) => {
  try {
    const vouchers = await voucherService.getVouchers();
    res.status(200).json(vouchers);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch vouchers";
    res.status(400).json({ error: message });
  }
};

export const getVoucherById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const voucher = await voucherService.getVoucherById(id);
    if (!voucher) {
      return res.status(404).json({ error: "Voucher not found" });
    }
    res.status(200).json(voucher);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch voucher";
    res.status(400).json({ error: message });
  }
};

export const updateVoucher = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const data = { ...req.body };
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    
    const voucher = await voucherService.updateVoucher(id, data);
    res.status(200).json(voucher);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update voucher";
    res.status(400).json({ error: message });
  }
};

export const deleteVoucher = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    await voucherService.deleteVoucher(id);
    res.status(200).json({ message: "Voucher deleted successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete voucher";
    res.status(400).json({ error: message });
  }
};

export const validateVoucher = async (req: Request, res: Response) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code || orderTotal === undefined) {
      return res.status(400).json({ error: "code and orderTotal are required" });
    }
    const result = await voucherService.validateVoucher(code, Number(orderTotal));
    res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid voucher";
    res.status(400).json({ error: message });
  }
};
