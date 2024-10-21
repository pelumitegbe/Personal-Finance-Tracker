"use client";

import React from "react";
import Layout from "./../layout/index";
import { TransactionProps } from "../interface";
import TransactionsChart from "../components/TransactionsChart";
import TableContainer from "../components/TableContainer";
import {
  FaHandHoldingDollar ,
} from "react-icons/fa6";
import {  GiMoneyStack  } from "react-icons/gi";
import { RiExchangeDollarLine } from "react-icons/ri";
import "./index.css"
import DashboardCard from "../components/DashboardCard";

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
      <div className="dashboard">
      <div className="cardFlex">
        <DashboardCard
          title="Total No. of Transactions"
          count={11}
          Icon={RiExchangeDollarLine}
          color="cyan"
          colorInner="lightCyan"
        />
        <DashboardCard
          title="Total No. of Income"
          count={3}
          Icon={GiMoneyStack}
          color="green"
          colorInner="lightGreen"
        />
        <DashboardCard
          title="Total No. of Expenses"
          count={8}
          Icon={FaHandHoldingDollar }
          color="crimson"
          colorInner="lightCrimson"
        />
        </div>
        <div className="tableContainer">
        <h2>Recent Transactions</h2>
        <TableContainer data={dummyTransactions.slice(0, 5)} 
        columns={[{field: "category", title: "Category"},
           {field: "amount", title: "Amount"}, 
           {field:"date", title: "Date"}]}/>
        </div>
        <div className="chart">
            <h3>Expenses by Category</h3>
            <p>
              This is the visual representation of your expenses by category
            </p>
        <TransactionsChart transactions={dummyTransactions} />
          </div>
      </div>
    </Layout>
  );
}
