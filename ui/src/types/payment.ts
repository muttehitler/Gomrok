export type PaymentStatus = "pending" | "completed" | "failed";
export type PaymentMethod = "crypto" | "card";

export interface PaymentUser {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    chatId: number;
    photoUrl?: string;
}

export interface Payment {
    id: string;
    amount: number;
    cardNumber?: string;
    completed: boolean;
    createdAt: string; // ISO Date String
    currency: string;
    hash?: string;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
    updatedAt: string; // ISO Date String
    walletAddress?: string;
    user: PaymentUser;
}