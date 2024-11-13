"use client";

import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import TransactionForm from "../components/Dashboard/TransactionForm";
import TransactionList from "../components/Dashboard/TransactionList";
import CategoryFilter from "../components/Dashboard/CategoryFilter";
import AudioRecorder from "../components/Dashboard/AudioRecorder";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "../layout/index";
import { useCreateTransaction, useTransaction } from "../hooks/transactions";
import { Transaction } from "../interface";
import { AuthContext } from "../context";

export default function DashboardPage() {
	const [filteredTransactions, setFilteredTransactions] = useState<
		Transaction[]
	>([]);
	const [balance, setBalance] = useState(0);
	const [categoryFilter, setCategoryFilter] = useState("All");

	const { user } = useContext(AuthContext);

	const { mutate, isSuccess, isError, error, reset } = useCreateTransaction();

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

  useEffect(() => {
    const updateFilteredTransactions = () => {
      if (categoryFilter === "All") {
        setFilteredTransactions(transactions || []);
      } else {
        setFilteredTransactions(transactions?.filter((t) => t.category === categoryFilter) || []);
      }
    };
    updateFilteredTransactions();
  }, [categoryFilter, transactions]);

  const addTransaction = useCallback((transaction: Transaction) => {
    const newTransaction = { ...transaction, amount: transaction?.amount?.toString() };
    mutate(newTransaction);
  }, [mutate]);

	const deleteTransaction = (id: number) => {
		console.log(`Deleting transaction with id: ${id}`);
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

	return (
		<Layout
			name='Transactions'
			pageTitle='Transactions'>
			<div className='flex flex-col md:flex-row gap-6'>
				<div className='w-full md:w-1/3 space-y-6'>
					<Card className='bg-white border-2 border-grey rounded-lg overflow-hidden'>
						<CardContent className='p-6'>
							<h2 className='text-2xl font-bold mb-2'>Current Balance</h2>
							<p
								className={`text-4xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"
									}`}>
								${balance?.toFixed(2)}
							</p>
						</CardContent>
					</Card>

					<TransactionForm onAddTransaction={addTransaction} />

					<div className='flex justify-center'>
						<AudioRecorder
							onTransactionComplete={handleTransactionComplete}
							onError={handleAudioError}
						/>
					</div>
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
