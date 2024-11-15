"use client";

import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import TransactionForm from "../components/Dashboard/TransactionForm";
import TransactionList from "../components/Dashboard/TransactionList";
import CategoryFilter from "../components/Dashboard/CategoryFilter";
import AudioRecorder from "../components/Dashboard/AudioRecorder";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "../layout/index";
import { useCreateTransaction, useDeleteTransaction, useTransaction } from "../hooks/transactions";
import { Transaction } from "../interface";
import { AuthContext } from "../context";
import { useCategory } from "../hooks/category";
import { Category } from "../interface";
import swal from "sweetalert";
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
  transaction_type: 'income' | 'expense'
  category: string
  created_at: string
  // timestamp: string
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
	const [filteredTransactions, setFilteredTransactions] = useState<
		Transaction[]
	>([]);
	const [balance, setBalance] = useState(0);
	const [categoryFilter, setCategoryFilter] = useState("All");
	const categories: Category[] = useCategory();

	const { user } = useContext(AuthContext);

	const { mutate, isSuccess, isError, error, reset } = useCreateTransaction();

	const { mutate: del} = useDeleteTransaction();

	const trans = useTransaction();

// Memoize the transactions based on user.id, avoiding unnecessary recomputations
	const transactions = useMemo(() => {
		return trans?.filter((t) => t?.user_id === user?.id) || [];
	}, [user?.id, trans]);

	useEffect(() => {
    const newBalance = transactions?.reduce((acc, transaction) => {
      const change = parseFloat(transaction.amount);
      return transaction.transaction_type === "income" ? acc + change : acc - change;
    }, 0) || 0;
    setBalance(newBalance);
  }, [transactions]);

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
    const updateFilteredTransactions = () => {
      if (categoryFilter === "All") {
        setFilteredTransactions(transactions || []);
      } else {
				const category = categories?.find(c =>c?.name === categoryFilter)
				setFilteredTransactions(transactions?.filter((t) => t.categories_id === category.id) || []);
      }
    };
    updateFilteredTransactions();
  }, [categoryFilter, transactions]);


  const addTransaction = useCallback((transaction: Transaction) => {
    const newTransaction = { ...transaction, amount: transaction?.amount?.toString() };
    mutate(newTransaction);
  }, [mutate]);

	const deleteTransaction = (id: number) => {
		swal({
			title: "Are you sure?",
			text: "Once deleted, you will not be able to recover this",
			icon: "warning",
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//    @ts-expect-error
			buttons: true,
			dangerMode: true,
		  }).then((willDelete) => {
			if (willDelete) {
			  // mutateDelete(res.ID);
			  del(id);			
      }
		  });
		// setTransactions((prev) => prev.filter((t) => t.id !== id));
	};

	const handleTransactionComplete = (
		parsedTransaction: Omit<Transaction, "id">,
	) => {
		console.log("Received parsed transaction from audio:", parsedTransaction);
		addTransaction(parsedTransaction);
	};

	const handleAudioError = (error: string) => {
		console.error("Audio recording error:", error);
	};

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
          transaction_type: 'expense',
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

				<div className='w-full md:w-2/3 space-y-6'>
					<CategoryFilter onCategoryChange={setCategoryFilter} />
					<TransactionList
						transactions={filteredTransactions}
						onDeleteTransaction={deleteTransaction}
					/>
				</div>
			</div>
		</Layout>
	);
}
