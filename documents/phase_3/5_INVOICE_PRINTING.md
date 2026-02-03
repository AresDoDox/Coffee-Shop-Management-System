# Phase 3 (Phần 5): Tích hợp Máy in Hóa đơn (Invoice Printing)

**Trạng thái:** ✅ Đã hoàn thành
**Công nghệ:** `react-to-print`, `React forwardRef`, `CSS Print Media`
**Mục tiêu:** Tạo tính năng in hóa đơn chuẩn khổ giấy nhiệt (80mm) cho máy POS từ trình duyệt web.

---

## 1. Vấn đề & Giải pháp Kỹ thuật

### Vấn đề: "Web to Paper"
Trình duyệt web mặc định (`Ctrl + P`) sẽ in toàn bộ giao diện đang hiển thị (bao gồm thanh menu, nút bấm, màu nền...). Điều này:
1.  Gây lãng phí mực/giấy.
2.  Không đúng khổ giấy của máy in nhiệt chuyên dụng.
3.  Nhìn thiếu chuyên nghiệp.

### Giải pháp: "Hidden Component"
Chúng ta sử dụng kỹ thuật **Render ẩn**:
1.  Tạo một Component `Invoice` được style riêng cho việc in (khổ 80mm, chữ đen trắng).
2.  Render Component này vào DOM nhưng dùng CSS `display: none` để ẩn khỏi mắt người dùng.
3.  Dùng thư viện `react-to-print` để trích xuất HTML của Component ẩn đó và gửi lệnh in trực tiếp.



---

## 2. Chi tiết Triển khai (Implementation)

### A. Component Hóa đơn (`src/components/Invoice.tsx`)
Điểm mấu chốt là sử dụng `React.forwardRef`. Thư viện in cần một cái "móc" (ref) gắn vào thẻ `<div>` cha của hóa đơn để biết cần in nội dung nào.

```tsx
export const Invoice = forwardRef<HTMLDivElement, InvoiceProps>((props, ref) => {
  return (
    // ref được gắn ở đây để thư viện "chụp" lấy nội dung này
    <div ref={ref} className="invoice-container" style={{ width: '80mm', padding: '10px' }}>
      <h1>COFFEE SHOP</h1>
      {/* ... Nội dung chi tiết ... */}
    </div>
  );
});
```

### B. Logic In ấn (src/pages/Payment.tsx)
Sử dụng hook useReactToPrint.

```tsx
const Payment = () => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef, // Trỏ tới component hóa đơn
    documentTitle: 'Hoa-don-ban-hang', // Tên file khi lưu PDF
  });

  return (
    <div>
      <button onClick={handlePrint}>In Hóa Đơn</button>

      {/* Render ẩn: Luôn tồn tại trong DOM để máy in đọc được, nhưng user không thấy */}
      <div style={{ display: 'none' }}>
        <Invoice ref={invoiceRef} order={data} />
      </div>
    </div>
  );
};
```

---

## 3. Lưu ý về CSS cho Máy in (Print Styling)
Khi làm việc với máy in nhiệt, cần lưu ý:

- Đơn vị đo: Nên dùng mm (milimet) thay vì px. Khổ phổ biến là 80mm hoặc 58mm.

- Màu sắc: Máy in nhiệt chỉ in đen trắng. Tránh dùng màu nhạt (xám nhẹ, vàng nhạt) vì in ra sẽ không thấy gì.

- Font chữ: Nên dùng font sans-serif đậm, rõ ràng (như Arial, Roboto) và size tối thiểu 12px.

---

## 4. Checklist
- [x] Đã cài đặt react-to-print.
- [x] Component Invoice hiển thị đầy đủ thông tin (Món, SL, Tổng tiền, QR note).
- [x] Nút "In hóa đơn" kích hoạt được cửa sổ Print Preview của trình duyệt.
- [x] Bản in hiển thị đúng layout, không bị vỡ dòng, không chứa các thành phần thừa (menu, button).
