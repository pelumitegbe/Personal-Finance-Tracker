// types.ts

// lib/types.ts
export interface Transaction {
    id: number;
    type: 'expense' | 'income';
    description: string;
    amount: number;
    date: string; // or Date if you're working with Date objects
  }
  
  
  export type NewTransaction = Omit<Transaction, 'id'>;
  
  export interface TransactionFormProps {
    onAddTransaction: (transaction: NewTransaction) => void;
  }
  
  export interface TransactionListProps {
    transactions: Transaction[];
  }