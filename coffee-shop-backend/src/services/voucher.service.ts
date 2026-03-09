import prisma from "../prisma.js";
import { discount_type } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createVoucher = async (data: any) => {
  return await prisma.voucher.create({
    data,
  });
};

export const getVouchers = async () => {
  return await prisma.voucher.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getVoucherById = async (id: number) => {
  return await prisma.voucher.findUnique({
    where: { id },
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateVoucher = async (id: number, data: any) => {
  return await prisma.voucher.update({
    where: { id },
    data,
  });
};

export const deleteVoucher = async (id: number) => {
  return await prisma.voucher.delete({
    where: { id },
  });
};

export const validateVoucher = async (code: string, orderTotal: number) => {
  const voucher = await prisma.voucher.findUnique({
    where: { code },
  });

  if (!voucher) {
    throw new Error("Voucher not found");
  }

  if (!voucher.isActive) {
    throw new Error("Voucher is not active");
  }

  const now = new Date();
  if (now < voucher.startDate || now > voucher.endDate) {
    throw new Error("Voucher is expired or not yet valid");
  }

  if (voucher.usedCount >= voucher.usageLimit) {
    throw new Error("Voucher usage limit reached");
  }

  if (orderTotal < Number(voucher.minOrderValue)) {
    throw new Error(`Minimum order total of ${voucher.minOrderValue} required`);
  }

  let discountAmount = 0;
  if (voucher.discountType === discount_type.PERCENTAGE) {
    discountAmount = (orderTotal * Number(voucher.discountValue)) / 100;
    if (voucher.maxDiscount && discountAmount > Number(voucher.maxDiscount)) {
      discountAmount = Number(voucher.maxDiscount);
    }
  } else {
    discountAmount = Number(voucher.discountValue);
  }

  return {
    voucher,
    discountAmount,
  };
};
