"use client";

import React, { useRef } from "react";
import Layout from "../layout/index";
import { TransactionProps } from "../interface";
import TransactionsChart from "../components/TransactionsChart";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { GiMoneyStack } from "react-icons/gi";
import { RiExchangeDollarLine } from "react-icons/ri";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import "./index.css";
import DashboardCard from "../components/DashboardCard";
import TransactionsCard from "../components/TransactionsCard";

export default function DashboardPage() {
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

	const dummyTransactions: TransactionProps[] = [
		{
			id: 1,
			category: "Groceries",
			amount: 50.5,
			date: "2024-10-01",
			description: "test description",
		},
		{
			id: 2,
			category: "Entertainment",
			amount: 120.0,
			date: "2024-10-05",
			description: "test description",
		},
		{
			id: 3,
			category: "Rent",
			amount: 805.0,
			date: "2024-10-03",
			description: "test description",
		},
		{
			id: 4,
			category: "Utilities",
			amount: 150.0,
			date: "2024-10-08",
			description: "test description",
		},
		{
			id: 5,
			category: "Transportation",
			amount: 40.0,
			date: "2024-10-10",
			description: "test description",
		},
	];

	return (
		<Layout
			name='Dashboard'
			pageTitle='Dashboard'>
			<div className='dashboard'>
				<div className='cardFlex'>
					<DashboardCard
						title='Total No. of Transactions'
						count={11}
						Icon={RiExchangeDollarLine}
						color='cyan'
						colorInner='lightCyan'
					/>
					<DashboardCard
						title='Total No. of Income'
						count={3}
						Icon={GiMoneyStack}
						color='green'
						colorInner='lightGreen'
					/>
					<DashboardCard
						title='Total No. of Expenses'
						count={8}
						Icon={FaHandHoldingDollar}
						color='crimson'
						colorInner='lightCrimson'
					/>
				</div>
				<div className='transactions'>
					<h2>Recent Transactions</h2>{" "}
					<div
						className='transactionsContainer'
						ref={scrollRef}>
						{dummyTransactions.slice(0, 5)?.map((d, index) => (
							<TransactionsCard
								key={index}
								amount={d?.amount}
								category={d?.category}
								date={d?.date}
								description={d?.description}
							/>
						))}
					</div>
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
					<TransactionsChart transactions={dummyTransactions} />
				</div>
			</div>
		</Layout>
	);
}
