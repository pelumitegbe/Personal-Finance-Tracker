"use client";

import React, { useState, useEffect } from "react";
import TransactionForm from "../components/Dashboard/TransactionForm";
import TransactionList from "../components/Dashboard/TransactionList";
import CategoryFilter from "../components/Dashboard/CategoryFilter";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "./../layout/index";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [balance, setBalance] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const newBalance = transactions.reduce((acc, transaction) => {
      return transaction.type === "income"
        ? acc + transaction.amount
        : acc - transaction.amount;
    }, 0);
    setBalance(newBalance);

    if (categoryFilter === "All") {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(
        transactions.filter((t) => t.category === categoryFilter)
      );
    }
  }, [transactions, categoryFilter]);

  const addTransaction = (transaction: Omit<Transaction, "id" | "date">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <Layout name="Dashboard" pageTitle="Dashboard">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 space-y-6">
          <Card className="bg-white border-2 border-black rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2">Current Balance</h2>
              <p
                className={`text-4xl font-bold ${
                  balance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ${balance.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <TransactionForm onAddTransaction={addTransaction} />
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
  );
}
