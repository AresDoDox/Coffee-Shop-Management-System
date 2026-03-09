# Voucher Management Feature

## 1. Overview
The Voucher Management feature allows staff and admins of the Coffee Shop to create, manage, and distribute promotional vouchers. Customers or cashiers will apply these vouchers during checkout to receive discounts on their orders.

## 2. Business Logic
- **Voucher Creation:** Admins can create vouchers with a unique `code`.
- **Discount Types:** A voucher can be either a `PERCENTAGE` discount or a `FIXED` amount discount.
- **Constraints:**
  - `minOrderValue`: The minimum total order amount required to apply the voucher.
  - `maxDiscount`: For percentage discounts, the maximum discount amount allowed.
  - `startDate` and `endDate`: The validity period of the voucher.
  - `usageLimit`: Total number of times this voucher can be used across all orders.
- **Voucher Application:**
  - When applying a voucher to an order, the system validates the code, checks the dates, checks `usageLimit` vs `usedCount`, and verifies the `minOrderValue`.
  - The calculated discount is subtracted from the order's `totalAmount`.
  - The order records the `voucherId` and the `discount` applied.
  - Upon order completion, the voucher's `usedCount` is incremented.

## 3. Workflows

### 3.1 Voucher Creation (Admin)
```mermaid
sequenceDiagram
    actor Admin
    participant Frontend
    participant Backend
    participant Database

    Admin->>Frontend: Fill Voucher Form (Code, Value, Types, Limits)
    Frontend->>Backend: POST /api/v1/vouchers
    Backend->>Database: Validate uniqueness of Code
    Backend->>Database: Insert new Voucher
    Database-->>Backend: Return Voucher ID
    Backend-->>Frontend: 201 Created
    Frontend-->>Admin: Show Success Message
```

### 3.2 Apply Voucher to Order (POS Cashier / User)
```mermaid
sequenceDiagram
    actor User as Cashier/User
    participant POS as Frontend (POS)
    participant API as Backend (Order Service)
    participant DB as Database

    User->>POS: Enter Voucher Code & Click "Apply"
    POS->>API: POST /api/v1/vouchers/validate { code, orderTotal }
    API->>DB: Find Voucher by code
    alt Voucher Not Found or Inactive
        API-->>POS: 400 Error (Invalid Voucher)
    else Expired or Usage Limit Reached
        API-->>POS: 400 Error (Voucher Expired/Max Limits)
    else Total < minOrderValue
        API-->>POS: 400 Error (Minimum total not met)
    else Valid
        API-->>POS: 200 OK (Calculated Discount & Voucher info)
        POS->>POS: Update UI with Discounted Total
    end
```
