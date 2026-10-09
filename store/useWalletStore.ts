import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WalletTransaction {
  id: string;
  type: "credit" | "debit";
  title: string;
  amount: number;
  date: string;
  status: "Completed" | "Pending" | "Failed";
  method?: string;
  reference?: string;
}

interface WalletState {
  balance: number;
  transactions: WalletTransaction[];
  addFunds: (amount: number, method: string) => void;
  deductFunds: (amount: number, title: string, reference?: string) => boolean;
  refundFunds: (amount: number, title: string, reference?: string) => void;
  resetWallet: () => void;
}

const initialTransactions: WalletTransaction[] = [
  {
    id: "TXN-GW99201",
    type: "credit",
    title: "Welcome Rail Passenger Credit",
    amount: 5000,
    date: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    status: "Completed",
    method: "Indian Railways Incentive",
    reference: "WELCOME-GADDVYA",
  },
];

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      balance: 5000,
      transactions: initialTransactions,

      addFunds: (amount: number, method: string) => {
        const newTxn: WalletTransaction = {
          id: `TXN-GW${Math.floor(100000 + Math.random() * 900000)}`,
          type: "credit",
          title: "Wallet Top-up",
          amount,
          date: new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          status: "Completed",
          method,
          reference: `UPI-${Date.now().toString().slice(-6)}`,
        };

        set((state) => ({
          balance: state.balance + amount,
          transactions: [newTxn, ...state.transactions],
        }));
      },

      deductFunds: (amount: number, title: string, reference?: string) => {
        const currentBalance = get().balance;
        if (currentBalance < amount) {
          return false;
        }

        const newTxn: WalletTransaction = {
          id: `TXN-GW${Math.floor(100000 + Math.random() * 900000)}`,
          type: "debit",
          title,
          amount,
          date: new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          status: "Completed",
          method: "GADDVYA Rail Wallet",
          reference,
        };

        set((state) => ({
          balance: state.balance - amount,
          transactions: [newTxn, ...state.transactions],
        }));
        return true;
      },

      refundFunds: (amount: number, title: string, reference?: string) => {
        const newTxn: WalletTransaction = {
          id: `TXN-GW${Math.floor(100000 + Math.random() * 900000)}`,
          type: "credit",
          title: `Refund: ${title}`,
          amount,
          date: new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          status: "Completed",
          method: "Instant Rail Refund",
          reference,
        };

        set((state) => ({
          balance: state.balance + amount,
          transactions: [newTxn, ...state.transactions],
        }));
      },

      resetWallet: () => {
        set({
          balance: 5000,
          transactions: initialTransactions,
        });
      },
    }),
    {
      name: "gaddvya-wallet-storage",
    }
  )
);
