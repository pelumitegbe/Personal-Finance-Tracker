"use client";

import React, { useRef, useContext, useMemo, useState } from "react";
import Layout from "../layout/index";
import TransactionsChart from "../components/TransactionsChart";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { GiMoneyStack } from "react-icons/gi";
import { RiExchangeDollarLine } from "react-icons/ri";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import "./index.css";
import DashboardCard from "../components/DashboardCard";
import TransactionsCard from "../components/TransactionsCard";
import { useTransaction } from "../hooks/transactions";
import { AuthContext } from "../context";
import { useCategory } from "../hooks/category";
import { Category } from "../interface";

export default function DashboardPage() {
	const { user } = useContext(AuthContext);
	const trans = useTransaction();

	const categories: Category[] = useCategory();

	// Memoize the transactions based on user.id, avoiding unnecessary recomputations
	const transactions = useMemo(() => {
		return trans?.filter((t) => t?.user_id === user?.id) || [];
	}, [user?.id, trans]);

	const scrollRef = useRef<HTMLDivElement>(null);
	const scroll = (direction: string) => {
		const current = scrollRef.current;
		if (current) {
			if (direction === "left") {
				current.scrollLeft -= 300;
			} else {
				current.scrollLeft += 300;
			}
		}
	};

	const staticBudgets = [
		{
			id: 1,
			name: "Groceries",
			amount: 200,
			startDate: "2024-12-01",
			endDate: "2024-12-31",
		},
		{
			id: 2,
			name: "Transport",
			amount: 100,
			startDate: "2024-12-01",
			endDate: "2024-12-31",
		},
		{
			id: 3,
			name: "Entertainment",
			amount: 150,
			startDate: "2024-12-01",
			endDate: "2024-12-31",
		},
	];

	// Function to check if today's date falls within the budget period
	const isBudgetActive = (startDate: string, endDate: string): boolean => {
		const today = new Date();
		const start = new Date(startDate);
		const end = new Date(endDate);
		return today >= start && today <= end;
	};
	// Find the active budget based on today's date
	const getActiveBudget = () => {
		return staticBudgets?.find((budget) =>
			isBudgetActive(budget.startDate, budget.endDate),
		);
	};

	const activeBudget = getActiveBudget();

	// Calculate total income, expenses, and balance
	const totalIncome = transactions
		.filter((t) => t.transaction_type === "income")
		.reduce((sum, t) => sum + parseFloat(t?.amount), 0);
	const totalExpenses = transactions
		.filter((t) => t.transaction_type === "expense")
		.reduce((sum, t) => sum + parseFloat(t?.amount), 0);

	const currentBalance = totalIncome - totalExpenses;

	// Calculate remaining budget and progress for the active budget
	const spentBudget = totalExpenses;
	const remainingBudget = activeBudget ? activeBudget.amount - spentBudget : 0;
	const budgetProgress = activeBudget
		? (spentBudget / activeBudget.amount) * 100
		: 0;

	console.log({ transactions });
	console.log({ activeBudget });
	console.log({ totalIncome });
	console.log({ totalExpenses });

	// Sort transactions by date in descending order and get the most recent 5
	const sortedTransactions = [...transactions].sort(
		(a, b) =>
			new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
	);
	const mostRecentTransactions = sortedTransactions.slice(0, 5);

	return (
		<Layout
			name='Dashboard'
			pageTitle='Dashboard'>
			<div className='dashboard'>
				<div className='cardFlex'>
					<DashboardCard
						title='Total No. of Transactions'
						count={transactions.length}
						Icon={RiExchangeDollarLine}
						color='cyan'
						colorInner='lightCyan'
					/>
					<DashboardCard
						title='Total No. of Income'
						count={
							transactions.filter((t) => t.transaction_type === "income").length
						}
						Icon={GiMoneyStack}
						color='green'
						colorInner='lightGreen'
					/>
					<DashboardCard
						title='Total No. of Expenses'
						count={
							transactions.filter((t) => t.transaction_type === "expense")
								.length
						}
						Icon={FaHandHoldingDollar}
						color='crimson'
						colorInner='lightCrimson'
					/>
				</div>
				<div className='transactions'>
					<h2>Recent Transactions</h2>{" "}
					{mostRecentTransactions?.length === 0 ? (
						<p>No transactions to display</p>
					) : (
						<div
							className='transactionsContainer'
							ref={scrollRef}>
							{mostRecentTransactions?.map((d, index) => {
								const categoryName =
									categories?.find((c) => c.id === d.categories_id)?.name ||
									"Unknown";
								return (
									<TransactionsCard
										key={index}
										amount={d.amount}
										category={categoryName}
										date={d.created_at}
										type={d.transaction_type}
										description={d.description?.String || ""}
									/>
								);
							})}
						</div>
					)}
					<div className='scrollButtons'>
						<button onClick={() => scroll("left")}>
							<FaAngleLeft />
						</button>
						<button onClick={() => scroll("right")}>
							<FaAngleRight />
						</button>
					</div>
				</div>
				<div className='chart'>
					<h3>Expenses by Category</h3>
					<p>This is the visual representation of your expenses by category</p>
					<TransactionsChart transactions={transactions || []} />
				</div>
				{activeBudget && (
					<div className='generalBudgetProgress'>
						<h3>Active Budget Progress</h3> <p>Budget: ${activeBudget.amount}</p>{" "}
						<p>Spent: ${spentBudget}</p> <p>Remaining: ${remainingBudget}</p>{" "}
						<div className='progressBarContainer'>
							<div
								className='progressBar'
								style={{
									width: `${budgetProgress}%`,
									backgroundColor: budgetProgress > 100 ? "red" : "green",
								}}></div>
						</div>
					</div>
				)}
				{!activeBudget && (
					<div className='generalBudgetProgress'>
						<h3>No Active Budget</h3>
					</div>
				)}
			</div>
		</Layout>
	);
}
