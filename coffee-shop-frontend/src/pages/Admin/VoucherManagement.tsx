import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { voucherService } from '../../services/voucher.service';
import dayjs from 'dayjs';

interface Voucher {
  id: number;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export const VoucherManagement: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [open, setOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderValue: '0',
    maxDiscount: '',
    startDate: dayjs().format('YYYY-MM-DDTHH:mm'),
    endDate: dayjs().add(1, 'month').format('YYYY-MM-DDTHH:mm'),
    usageLimit: '100',
    isActive: true
  });

  const fetchVouchers = async () => {
    try {
      const data = await voucherService.getVouchers();
      setVouchers(data || []);
    } catch (error) {
      console.error("Failed to fetch vouchers:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchVouchers();
  }, []);

  const handleOpen = (voucher?: Voucher) => {
    if (voucher) {
      setEditingVoucher(voucher);
      setFormData({
        code: voucher.code,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue.toString(),
        minOrderValue: voucher.minOrderValue.toString(),
        maxDiscount: voucher.maxDiscount ? voucher.maxDiscount.toString() : '',
        startDate: dayjs(voucher.startDate).format('YYYY-MM-DDTHH:mm'),
        endDate: dayjs(voucher.endDate).format('YYYY-MM-DDTHH:mm'),
        usageLimit: voucher.usageLimit.toString(),
        isActive: voucher.isActive
      });
    } else {
      setEditingVoucher(null);
      setFormData({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        minOrderValue: '0',
        maxDiscount: '',
        startDate: dayjs().format('YYYY-MM-DDTHH:mm'),
        endDate: dayjs().add(1, 'month').format('YYYY-MM-DDTHH:mm'),
        usageLimit: '100',
        isActive: true
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        ...formData,
        discountValue: Number(formData.discountValue),
        minOrderValue: Number(formData.minOrderValue),
        usageLimit: Number(formData.usageLimit)
      };
      
      if (formData.maxDiscount) {
        payload.maxDiscount = Number(formData.maxDiscount);
      }

      if (editingVoucher) {
        await voucherService.updateVoucher(editingVoucher.id, payload);
      } else {
        await voucherService.createVoucher(payload);
      }
      handleClose();
      fetchVouchers();
    } catch (error) {
      console.error("Save failed:", error);
      alert("Error saving voucher");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this voucher?")) {
      try {
        await voucherService.deleteVoucher(id);
        fetchVouchers();
      } catch (error) {
        console.error("Delete failed", error);
        alert("Error deleting voucher");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-black tracking-tight text-textMain">Voucher Management</h1>
        <button 
          onClick={() => handleOpen()}
          className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition"
        >
          <Plus size={18} />
          <span>Add Voucher</span>
        </button>
      </div>

      <div className="overflow-x-auto bg-surface rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/20 text-textMain border-b border-secondary">
              <th className="p-4 font-semibold">Code</th>
              <th className="p-4 font-semibold">Type / Value</th>
              <th className="p-4 font-semibold">Min Order</th>
              <th className="p-4 font-semibold">Usage</th>
              <th className="p-4 font-semibold">Validity</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((voucher) => (
              <tr key={voucher.id} className="border-b border-secondary hover:bg-secondary/10">
                <td className="p-4 font-bold text-textMain">{voucher.code}</td>
                <td className="p-4 text-textMain">
                  {voucher.discountType === 'PERCENTAGE' 
                    ? <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-100">{voucher.discountValue}%</span>
                    : <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-100">${voucher.discountValue}</span>
                  }
                </td>
                <td className="p-4 text-textMain">${voucher.minOrderValue}</td>
                <td className="p-4 text-textMain">
                  <span className="font-medium">{voucher.usedCount}</span>
                  <span className="mx-1 opacity-50">/</span>
                  <span className="opacity-75">{voucher.usageLimit}</span>
                </td>
                <td className="p-4 text-textMain text-xs">
                  <div>{dayjs(voucher.startDate).format('MMM DD, YYYY')}</div>
                  <div className="opacity-50">to</div>
                  <div>{dayjs(voucher.endDate).format('MMM DD, YYYY')}</div>
                </td>
                <td className="p-4 text-textMain">
                  {voucher.isActive ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-100">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2 text-textMain">
                    <button 
                      onClick={() => handleOpen(voucher)} 
                      className="rounded p-1 text-blue-500 hover:bg-blue-500/10 transition"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(voucher.id)} 
                      className="rounded p-1 text-red-500 hover:bg-red-500/10 transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {vouchers.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-textMain opacity-50">
                  No vouchers found. Click "Add Voucher" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tailwind Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4">
          <div className="relative w-full max-w-lg rounded-xl bg-surface border border-secondary shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-secondary p-5">
              <h3 className="text-xl font-semibold text-textMain">
                {editingVoucher ? 'Edit Voucher' : 'Create Voucher'}
              </h3>
              <button
                onClick={handleClose}
                className="rounded-lg bg-transparent p-1.5 text-sm text-textMain opacity-50 hover:opacity-100 hover:bg-secondary/20"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <form onSubmit={handleSubmit}>
              <div className="p-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-textMain">Voucher Code (Unique)</label>
                  <input
                    type="text"
                    required
                    className="block w-full rounded border border-secondary bg-surface p-2.5 text-sm text-textMain focus:border-primary focus:ring-primary outline-none"
                    placeholder="e.g. SUMMER20"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-textMain">Discount Type</label>
                    <select
                      className="block w-full rounded border border-secondary bg-surface p-2.5 text-sm text-textMain focus:border-primary focus:ring-primary outline-none"
                      value={formData.discountType}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onChange={(e) => setFormData({...formData, discountType: e.target.value as any})}
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-textMain">Discount Value</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="any"
                      className="block w-full rounded border border-secondary bg-surface p-2.5 text-sm text-textMain focus:border-primary focus:ring-primary outline-none"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-textMain">Min Order Value</label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="block w-full rounded border border-secondary bg-surface p-2.5 text-sm text-textMain focus:border-primary focus:ring-primary outline-none"
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData({...formData, minOrderValue: e.target.value})}
                    />
                  </div>
                  {formData.discountType === 'PERCENTAGE' && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-textMain">Max Discount ($)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Optional"
                        className="block w-full rounded border border-secondary bg-surface p-2.5 text-sm text-textMain focus:border-primary focus:ring-primary outline-none"
                        value={formData.maxDiscount}
                        onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-textMain">Start Date</label>
                    <input
                      type="datetime-local"
                      required
                      className="block w-full rounded border border-secondary bg-surface p-2.5 text-sm text-textMain focus:border-primary focus:ring-primary outline-none dark:scheme-dark"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-textMain">End Date</label>
                    <input
                      type="datetime-local"
                      required
                      className="block w-full rounded border border-secondary bg-surface p-2.5 text-sm text-textMain focus:border-primary focus:ring-primary outline-none dark:scheme-dark"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-textMain">Usage Limit</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="block w-full rounded border border-secondary bg-surface p-2.5 text-sm text-textMain focus:border-primary focus:ring-primary outline-none"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-textMain">Status</label>
                    <select
                      className="block w-full rounded border border-secondary bg-surface p-2.5 text-sm text-textMain focus:border-primary focus:ring-primary outline-none"
                      value={formData.isActive.toString()}
                      onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-end space-x-2 rounded-b border-t border-secondary p-5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded border border-secondary bg-surface px-5 py-2.5 text-sm font-medium text-textMain opacity-80 hover:bg-secondary/20 hover:opacity-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-primary px-5 py-2.5 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
                >
                  Save Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherManagement;
