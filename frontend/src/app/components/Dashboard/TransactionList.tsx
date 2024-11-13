import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, XIcon } from 'lucide-react';
import { 
  Utensils, 
  Bus, 
  Home, 
  Lightbulb, 
  Gamepad2, 
  Heart, 
  GraduationCap, 
  Package 
} from 'lucide-react'

const categoryIcons = {
  'Food': Utensils,
  'Transportation': Bus,
  'Housing': Home,
  'Utilities': Lightbulb,
  'Entertainment': Gamepad2,
  'Healthcare': Heart,
  'Education': GraduationCap,
  'Other': Package
} as const

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  timestamp: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: number) => void;
}

export default function TransactionList({ transactions, onDeleteTransaction }: TransactionListProps) {
  const formatDate = (dateStr: string) => {
    try {
      if (dateStr.includes(',')) return dateStr;
      
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateStr);
        return dateStr;
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr;
    }
  };

  console.log('Transactions being rendered:', transactions);

  return (
    <Card className="bg-white border-2 border-black rounded-lg overflow-hidden">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-center text-gray-500">No transactions yet.</p>
        ) : (
          <ul className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
            {transactions.map((transaction) => {
              console.log('Rendering transaction:', {
                id: transaction.id,
                date: transaction.date,
                formattedDate: formatDate(transaction.date)
              });

              const CategoryIcon = categoryIcons[transaction.category as keyof typeof categoryIcons] || Package;
              return (
                <li key={transaction.id} className="flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <span className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'expense' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      <CategoryIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{transaction.category}</span>
                        <span>•</span>
                        <span>{formatDate(transaction.date)}</span>
                        <span>•</span>
                        <span>{transaction.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className={`font-bold ${transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                      {transaction.type === 'expense' ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <Button
                      onClick={() => onDeleteTransaction(transaction.id)}
                      className="p-1 hover:bg-gray-200 rounded-full"
                    >
                      <XIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}