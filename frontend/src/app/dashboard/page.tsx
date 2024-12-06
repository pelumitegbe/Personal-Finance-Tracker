"use client";

import React, { useRef, useContext, useMemo } from "react";
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
import ReactECharts from "echarts-for-react";

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
			title: "Household Essentials",
			amount: 500,
			startDate: "2024-12-01",
			endDate: "2024-12-31",
			categorySpecified: "Yes",
			categories: [
				{
					id: "aa0d44e8-c6e5-456d-8019-1345c10e1a3b",
					category: "Food",
					amount: 300,
				},
				{
					id: "fb9f164d-94e1-4e7d-b19f-f664e8e0c838",
					category: "Transportation",
					amount: 100,
				},
				{
					id: "d6fd6aab-2e04-4947-aa9e-a7844f35f080",
					category: "Utilities",
					amount: 100,
				},
			],
		},
		{
			id: 2,
			title: "Transportation",
			amount: 200,
			startDate: "2024-11-01",
			endDate: "2024-11-30",
			categorySpecified: "Yes",
			categories: [
				{
					id: "e4662c63-89b5-42e8-91f1-1219a13b3f80",
					category: "Other",
					amount: 120,
				},
				{
					id: "2df813e7-db5b-449e-a53d-80d886cde569",
					category: "Rent",
					amount: 50,
				},
				{
					id: "aa0d44e8-c6e5-456d-8019-1345c10e1a3b",
					category: "Food",
					amount: 30,
				},
			],
		},
		{
			id: 3,
			title: "Entertainment and Leisure",
			amount: 300,
			startDate: "2024-10-01",
			endDate: "2024-10-31",
			categorySpecified: "No",
			categories: [],
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

	// Sort transactions by date in descending order and get the most recent 5
	const sortedTransactions = [...transactions].sort(
		(a, b) =>
			new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
	);
	const mostRecentTransactions = sortedTransactions.slice(0, 5);

	const chartOptions = {
		tooltip: {
			trigger: "axis",
		},
		legend: {
			data: ["Budgeted", "Spent"],
		},
		xAxis: {
			type: "category",
			data: activeBudget?.categories.map((cat) => cat.category) || [],
			axisLabel: {
				rotate: 45,
			},
		},
		yAxis: {
			type: "value",
		},
		series: [
			{
				name: "Budgeted",
				type: "bar",
				data: activeBudget?.categories.map((cat) => cat.amount) || [],
				itemStyle: {
					color: "#28a745",
				},
			},
			{
				name: "Spent",
				type: "bar",
				data:
					activeBudget?.categories.map((cat) =>
						transactions
							.filter((t) => t.categories_id === cat.id)
							.reduce((sum, t) => sum + parseFloat(t.amount), 0),
					) || [],
				itemStyle: {
					color: "#ffc6d2",
				},
			},
		],
	};

	console.log({ activeBudget });
	console.log({ transactions });

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
					<h2>Recent Transactions</h2>
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
				<div className='categorizedBudgetSection'>
					{activeBudget && activeBudget.categories.length > 0 ? (
						<>
							<h3>Budget Summary</h3>
							<div className='totalBudget'>
								<h2>{activeBudget.title}</h2>
								<div className='budgetDetails'>
									<p>
										<strong>Total Budget:</strong> $
										{activeBudget.amount.toFixed(2)}
									</p>
									<p>
										<strong>Start Date:</strong>{" "}
										{new Date(activeBudget.startDate).toLocaleDateString()}
									</p>
									<p>
										<strong>End Date:</strong>{" "}
										{new Date(activeBudget.endDate).toLocaleDateString()}
									</p>
								</div>
								<div className=''>
									{/* Calculate total spending and progress */}
									{(() => {
										const totalSpending = transactions.reduce(
											(sum, t) =>
												activeBudget.categories.some(
													(c) => c.id === t.categories_id,
												)
													? sum + parseFloat(t.amount)
													: sum,
											0,
										);
										const totalProgress =
											(totalSpending / activeBudget.amount) * 100;

										return (
											<>
												<p>
													<strong>Spent:</strong> ${totalSpending.toFixed(2)}
												</p>
												<p>
													<strong>Remaining:</strong> $
													{Math.max(
														activeBudget.amount - totalSpending,
														0,
													).toFixed(2)}
												</p>
												<div className='progressBarContainer'>
												<div
													className='progressBar'
													style={{
														width: `${Math.min(totalProgress, 100)}%`,
														backgroundColor:
															totalProgress > 100 ? "#ffc6d2" : "#28a745",
													}}></div>
											</div>
												
											</>
										);
									})()}
								</div>
							</div>
							<br/>
							<h3>Category Breakdown</h3>
							<ReactECharts
								option={chartOptions}
								style={{ height: "400px", width: "100%" }}
							/>
							<div className='categoriesTable'>
								{activeBudget.categories.map((cat, index) => {
									const actualSpending = transactions
										.filter((t) => t.categories_id === cat.id)
										.reduce((sum, t) => sum + parseFloat(t.amount), 0);
									const remaining = cat.amount - actualSpending;
									const progress = (actualSpending / cat.amount) * 100;

									return (
										<div
											key={index}
											className='categoryRow'>
											<h2 className='categoryName'>{cat.category}</h2>
											<div className='budgetedAmount'>
												Planned: ${cat.amount.toFixed(2)}
											</div>
											<div className='actualSpending'>
												Spent: ${actualSpending.toFixed(2)}
											</div>
											<div className='remaining'>
												Remaining: ${Math.max(remaining, 0).toFixed(2)}
											</div>
											<div className='progressBarContainer'>
												<div
													className='progressBar'
													style={{
														width: `${Math.min(progress, 100)}%`,
														backgroundColor:
															progress > 100 ? "#ffc6d2" : "#28a745",
													}}></div>
											</div>
										</div>
									);
								})}
							</div>
						</>
					) : (
						<p>No detailed category breakdown for the active budget.</p>
					)}
				</div>
			</div>
		</Layout>
	);
}
