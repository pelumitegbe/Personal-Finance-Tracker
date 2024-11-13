import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Loader2, Receipt } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"

interface TransactionFormProps {
  onAddTransaction: (transaction: {
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
  }) => void;
  onReceiptUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isScanning: boolean;
}

const categories = [
  "Food", "Transportation", "Housing", "Utilities", "Entertainment", "Healthcare", "Education", "Other"
];

export default function TransactionForm({ onAddTransaction, onReceiptUpload, isScanning }: TransactionFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState("Other");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description && amount) {
      onAddTransaction({
        description,
        amount: parseFloat(amount),
        type,
        category,
      });
      setDescription("");
      setAmount("");
      setType('expense');
      setCategory("Other");
    }
  };

  return (
    <Card className="bg-white border-2 border-black rounded-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Transaction</h2>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onReceiptUpload}
                    data-testid="scan-button"
                  />
                  <div className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300
                    ${isScanning ? 'bg-blue-100' : 'bg-gray-100 hover:bg-gray-200'}
                    border border-gray-200
                  `}>
                    {isScanning ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        <span className="text-sm text-blue-600">Scanning...</span>
                      </>
                    ) : (
                      <>
                        <Receipt className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-600">Scan Receipt</span>
                      </>
                    )}
                  </div>
                </label>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-white p-3 border-2 border-gray-200 shadow-lg">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium">Quick Add from Receipt</p>
                  <p className="text-xs text-gray-500">Upload a receipt image to automatically fill transaction details</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description" className="font-semibold">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-2 border-black mt-1 rounded-md"
              required
            />
          </div>
          <div>
            <Label htmlFor="amount" className="font-semibold">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border-2 border-black mt-1 rounded-md"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <Label htmlFor="type" className="font-semibold">Type</Label>
            <Select value={type} onValueChange={(value: 'income' | 'expense') => setType(value)}>
              <SelectTrigger className="border-2 border-black mt-1 rounded-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-black rounded-md shadow-lg">
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="category" className="font-semibold">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="border-2 border-black mt-1 rounded-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-black rounded-md shadow-lg">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 rounded-md">
            Add Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}