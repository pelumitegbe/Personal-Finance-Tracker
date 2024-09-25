'use client'

import { useState } from 'react'
import TransactionForm from '../app/components/TransactionForm'
import TransactionList from '../app/components/TransactionList'
import { Transaction, NewTransaction } from '../app/lib/types'

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const addTransaction = (transaction: NewTransaction) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now(),
    }
    setTransactions((prevTransactions) => [...prevTransactions, newTransaction])
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7fafc', // equivalent to Tailwind's bg-gray-100
      }}
    >
      <main
        style={{
          width: '100%',
          maxWidth: '72rem', // equivalent to Tailwind's max-w-6xl
          padding: '1rem',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: '1.875rem', // equivalent to Tailwind's text-3xl
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          Finance Tracker
        </h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem', // equivalent to Tailwind's space-y-6
            alignItems: 'flex-start',
          }}
        >
          <div style={{ width: '100%' }}>
            <TransactionForm onAddTransaction={addTransaction} />
          </div>
          <div style={{ width: '100%' }}>
            <TransactionList transactions={transactions} />
          </div>
        </div>
      </main>
    </div>
  )
}
