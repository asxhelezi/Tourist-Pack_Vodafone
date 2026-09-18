const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

export interface CreateOrderPayload {
  packageId: number;
  paymentMethod: "card" | "paypal" | "mobileWallet";
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  cardLast4?: string;
  locale?: string;
}

export interface OrderResponse {
  id: number;
  status: "PENDING" | "PAID" | "FAILED";
  amount: number;
  currency: string;
  packageName: string;
  userEmail: string;
  createdAt: string;
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
  const res = await fetch(`${BACKEND_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to create order (${res.status})`);
  return res.json();
}

export async function confirmOrderPayment(orderId: number): Promise<OrderResponse> {
  const res = await fetch(`${BACKEND_URL}/api/orders/${orderId}/confirm-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Failed to confirm payment (${res.status})`);
  return res.json();
}
