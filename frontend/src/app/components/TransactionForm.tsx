'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TransactionFormProps {
  onAddTransaction: (transaction: Transaction) => void;
}

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: string;
  date: string;
}

export default function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (description && amount) {
      const transaction: Transaction = {
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        type,
        date: new Date().toISOString(),
      }
      onAddTransaction(transaction)
      setDescription('')
      setAmount('')
      setType('expense')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="border border-gray-300">
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="expense" className="text-red-500">Expense</SelectItem>
                <SelectItem value="income" className="text-green-500">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Add Transaction</Button>
        </form>
      </CardContent>
    </Card>
  )
}
