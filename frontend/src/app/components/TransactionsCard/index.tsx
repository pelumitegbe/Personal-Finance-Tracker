import React from "react";
import styles from "./styles.module.css";
import {TransactionCardProps} from "../../interface"

const TransactionsCard: React.FC<TransactionCardProps> = ({ category, amount, date, description }) => {
  return (
    <div className={styles.transactionCard}>
        <h1>{category}</h1>
        <h2>${amount}</h2>
        <p>{description}</p>
        <p>{date}</p>
    </div>
  );
};

export default TransactionsCard;
