'use client'

import React, { useState, useEffect } from 'react'
import TransactionForm from '../components/Dashboard/TransactionForm'
import TransactionList from '../components/Dashboard/TransactionList'
import CategoryFilter from '../components/Dashboard/CategoryFilter'
import AudioRecorder from '../components/Dashboard/AudioRecorder'
import { Card, CardContent } from "@/components/ui/card"

interface Transaction {
  id: number
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    console.log('Recalculating balance. Current transactions:', transactions);
    const newBalance = transactions.reduce((acc, transaction) => {
      console.log(`Processing transaction:`, transaction);
      // Use the transaction amount directly, as it's already negative for expenses
      const change = transaction.amount;
      console.log(`Change to balance: ${change}`);
      return acc + change;
    }, 0)
    console.log(`New balance calculated: ${newBalance}`);
    setBalance(newBalance)
  }, [transactions])

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now(),
      date: new Date().toISOString(),
    }
    console.log('Adding new transaction:', newTransaction);
    setTransactions(prev => {
      const newTransactions = [newTransaction, ...prev];
      console.log('Updated transactions list:', newTransactions);
      return newTransactions;
    })
  }

  const deleteTransaction = (id: number) => {
    console.log(`Deleting transaction with id: ${id}`);
    setTransactions(prev => {
      const updatedTransactions = prev.filter(t => t.id !== id);
      console.log('Updated transactions list after deletion:', updatedTransactions);
      return updatedTransactions;
    })
  }

  const handleTransactionComplete = (parsedTransaction: Omit<Transaction, 'id'>) => {
    console.log('Received parsed transaction from audio:', parsedTransaction);
    addTransaction(parsedTransaction)
  }

  const handleAudioError = (error: string) => {
    console.error("Audio recording error:", error)
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <div className="w-full md:w-1/3 space-y-6">
        <Card className="bg-white border-2 border-black rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">Current Balance</h2>
            <p className={`text-4xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${balance.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        
        <TransactionForm onAddTransaction={addTransaction} />
        
        <div className="flex justify-center">
          <AudioRecorder 
            onTransactionComplete={handleTransactionComplete}
            onError={handleAudioError}
          />
        </div>
      </div>

      <div className="w-full md:w-2/3">
        <TransactionList 
          transactions={transactions} 
          onDeleteTransaction={deleteTransaction} 
        />
      </div>
    </div>
  )
}