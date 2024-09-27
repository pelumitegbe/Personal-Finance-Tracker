import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Transaction } from '../lib/types' // Adjust the path as necessary

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions = [] }: TransactionListProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-gray-500">No transactions yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {/* Color based on the transaction type (red for expense, green for income) */}
                  <span className={`mr-2 flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                    transaction.type === 'expense' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {transaction.type === 'expense' ? (
                      <ArrowDownIcon className="h-5 w-5" />
                    ) : (
                      <ArrowUpIcon className="h-5 w-5" />
                    )}
                  </span>
                  <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                </div>
                <div className="ml-3 flex-shrink-0">
                  {/* Amount styling based on type */}
                  <p className={`text-sm font-semibold ${
                    transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {new Date(transaction.date).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
