"use client";

import React from "react";
import Layout from "./../layout/index";
import { TransactionProps } from "../interface";
import TransactionsList from "../components/TransactionList";
import TransactionsChart from "../components/TransactionsChart";

export default function DashboardPage() {
  const dummyTransactions: TransactionProps[] = [
    { id: 1, category: "Groceries", amount: 50.5, date: "2024-10-01" },
    { id: 2, category: "Entertainment", amount: 120.0, date: "2024-10-05" },
    { id: 3, category: "Rent", amount: 800.0, date: "2024-10-03" },
    { id: 4, category: "Utilities", amount: 150.0, date: "2024-10-08" },
    { id: 5, category: "Transportation", amount: 40.0, date: "2024-10-10" },
  ];

  return (
    <Layout name="Dashboard" pageTitle="Dashboard">
      <div style={{display:"flex", gap:"2rem", justifyContent:"center", flexDirection:"column"}}>
        <h2>Recent Transactions</h2>
        <TransactionsList transactions={dummyTransactions.slice(0, 5)} />
        <h2>Transactions by Category</h2>
        <TransactionsChart transactions={dummyTransactions} />
      </div>
    </Layout>
  );
}
