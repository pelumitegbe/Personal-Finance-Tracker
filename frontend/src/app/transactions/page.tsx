'use client'

import React, { useState, useEffect } from 'react'
import TransactionForm from '../components/Dashboard/TransactionForm'
import TransactionList from '../components/Dashboard/TransactionList'
import CategoryFilter from '../components/Dashboard/CategoryFilter'
import AudioRecorder from '../components/Dashboard/AudioRecorder'
import { Card, CardContent } from "@/components/ui/card"
import Layout from "../layout/index";
import { 
  Utensils, 
  Bus, 
  Home, 
  Lightbulb, 
  Gamepad2, 
  Heart, 
  GraduationCap, 
  Package, 
  Mic, 
  Square, 
  HelpCircle, 
  Upload, 
  Camera 
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useHotkeys } from 'react-hotkeys-hook'
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion";

interface Transaction {
  id: number
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  timestamp: string
}

// Add category icon mapping
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

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [balance, setBalance] = useState(0)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [isScanning, setIsScanning] = useState(false);

  // Hotkeys setup
  useHotkeys('ctrl+shift+v', () => {
    const micButton = document.querySelector('[data-testid="mic-button"]');
    if (micButton) (micButton as HTMLButtonElement).click();
  }, { preventDefault: true });

  useHotkeys('ctrl+shift+s', () => {
    const scanButton = document.querySelector('[data-testid="scan-button"]');
    if (scanButton) (scanButton as HTMLButtonElement).click();
  }, { preventDefault: true });

  useEffect(() => {
    console.log('Recalculating balance. Current transactions:', transactions);
    const newBalance = transactions.reduce((acc, transaction) => {
      console.log(`Processing transaction:`, transaction);
      const change = transaction.type === 'expense' ? -transaction.amount : transaction.amount;
      console.log(`Change to balance: ${change}`);
      return acc + change;
    }, 0)
    console.log(`New balance calculated: ${newBalance}`);
    setBalance(newBalance)

    if (categoryFilter === 'All') {
      setFilteredTransactions(transactions)
    } else {
      setFilteredTransactions(transactions.filter(t => t.category === categoryFilter))
    }
  }, [transactions, categoryFilter])

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now(),
      date: transaction.date || new Date().toISOString().split('T')[0],
      timestamp: transaction.timestamp || new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    }
    console.log('Adding new transaction:', newTransaction);
    setTransactions(prev => [newTransaction, ...prev])
  }

  const deleteTransaction = (id: number) => {
    console.log(`Deleting transaction with id: ${id}`);
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const handleTransactionComplete = (parsedTransaction: Omit<Transaction, 'id'>) => {
    console.log('Received parsed transaction from audio:', parsedTransaction);
    addTransaction(parsedTransaction)
  }

  const handleAudioError = (error: string) => {
    console.error("Audio recording error:", error)
  }

  // Receipt scanning
  const handleReceiptUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const formData = new FormData();
    formData.append('receipt', file);

    try {
      const response = await fetch('/api/scan-receipt', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.parsedReceipt) {
        addTransaction({
          description: data.parsedReceipt.store_name,
          amount: data.parsedReceipt.total_amount,
          type: 'expense',
          category: data.parsedReceipt.category,
          date: data.parsedReceipt.date,
          timestamp: data.parsedReceipt.timestamp
        });
      }
    } catch (error) {
      console.error('Error scanning receipt:', error);
    } finally {
      setIsScanning(false);
    }
  };

  // Helper function to calculate font size and padding
  const getBalanceStyles = (balance: number) => {
    const numLength = Math.abs(balance).toFixed(2).length;
    let fontSize = 32; // Smaller default size
    let paddingX = '0.75rem';

    if (numLength > 8) {
      fontSize = 28;
      paddingX = '1rem';
    }
    if (numLength > 10) {
      fontSize = 24;
      paddingX = '1.25rem';
    }
    if (numLength > 12) {
      fontSize = 20;
      paddingX = '1.5rem';
    }

    return {
      fontSize: `${fontSize}px`,
      padding: `0.25rem ${paddingX}`
    };
  };

  return (
    <Layout name="Transactions" pageTitle="Transactions">
      <div className="flex flex-col md:flex-row gap-6 p-6">
        <div className="w-full md:w-1/3 space-y-6">
          <div className="flex gap-4">
            <Card className="flex-1 bg-white border-2 border-black rounded-lg overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center justify-center min-h-[120px]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-semibold">Balance</span>
                </div>
                <div className="flex-1 flex items-center justify-center w-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={balance}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`rounded-md ${
                        balance >= 0 ? 'bg-green-50/50' : 'bg-red-50/50'
                      } px-4 py-2`}
                    >
                      <span 
                        className={`font-bold tracking-tight tabular-nums text-center whitespace-nowrap ${
                          balance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                        style={getBalanceStyles(balance)}
                      >
                        ${Math.abs(Math.round(balance)).toLocaleString('en-US')}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1 bg-white border-2 border-black rounded-lg overflow-hidden">
              <CardContent className="p-6">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 cursor-help mb-4">
                        <span className="text-lg font-semibold">Quick Add</span>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="right" 
                      className="bg-white border-2 border-gray-200 shadow-lg p-4 rounded-lg animate-in fade-in-0 zoom-in-95"
                      sideOffset={5}
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-4 h-4 bg-blue-500 rounded-full" />
                            <div className="absolute bottom-3 w-2 h-2 animate-bounce">
                              <div className="w-2 h-1 bg-blue-700 rounded-full animate-pulse" />
                            </div>
                          </div>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <div className="w-1 h-2 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
                            <div className="w-1 h-3 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
                            <div className="w-1 h-2 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '0.4s' }} />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            Just click the mic and say something like:
                          </p>
                          <p className="text-sm font-medium text-blue-600 mt-2">
                            "Just spent 23 bucks at McDonald's"
                          </p>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <AudioRecorder 
                  onTransactionComplete={handleTransactionComplete}
                  onError={handleAudioError}
                />
              </CardContent>
            </Card>
          </div>

          <TransactionForm 
            onAddTransaction={addTransaction} 
            onReceiptUpload={handleReceiptUpload}
            isScanning={isScanning}
          />
        </div>

        <div className="w-full md:w-2/3 space-y-6">
          <CategoryFilter onCategoryChange={setCategoryFilter} />
          <TransactionList 
            transactions={filteredTransactions} 
            onDeleteTransaction={deleteTransaction} 
          />
        </div>
      </div>
    </Layout>
  )
}
