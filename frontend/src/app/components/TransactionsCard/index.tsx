import React from "react";
import styles from "./styles.module.css";
import {TransactionCardProps} from "../../interface"

const TransactionsCard: React.FC<TransactionCardProps> = ({ category, amount, date, type, description }) => {
  const transactionStyle = type === "expense" ? styles.expense : styles.income;

  // Format the date using Intl.DateTimeFormat 
  const formattedDate = new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
  }).format(new Date(date));

  return (
    <div className={`${styles.transactionCard} ${transactionStyle}`}>
        <h1>{category}</h1>
        <h2>${amount}</h2>
        <p>{description}</p>
        <p>{formattedDate}</p>
    </div>
  );
};

export default TransactionsCard;
