import React from "react";
import { TransactionsListProps } from "../../interface";

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
}) => {
  return (
    <ul>
      {transactions.map((transaction) => (
        <li key={transaction.id}>
          {transaction.category}: ${transaction.amount} on{" "}
          {new Date(transaction.date).toLocaleDateString()}
        </li>
      ))}
    </ul>
  );
};

export default TransactionsList;
