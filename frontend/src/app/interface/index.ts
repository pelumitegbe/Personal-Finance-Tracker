import { FC } from "react";

export interface LayoutProps {
  name: string;
  pageTitle: string;
  children: JSX.Element[] | JSX.Element;
}

export interface ChildProps {
  children: JSX.Element[] | JSX.Element;
}

// export interface userProps {
//   _id: string;
//   firstname: string;
//   lastname: string;
//   phone: string;
//   email: string;
//   role?: string;
// }
export interface userProps {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role?: string;
}

export interface IDecodedUser {
  email: string;
  exp: number;
  iat: number;
  jti?: string;
  phone: string;
  role: string;
  token_type?: string;
  _id: string;
  fullname?: string;
}

export interface LoginProps {
  email: string;
  password: string;
}

export interface RegisterProps {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface TransactionProps {
  id: number;
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface TransactionsListProps {
  transactions: TransactionProps[];
}
export interface DashboardCardProps {
  Icon: FC;
  title: string;
  count: number;
  url?: string;
  color: string;
  colorInner: string;
}
export interface TransactionCardProps {
  category: string;
  amount: number;
  date: string;
  description: string;
  type: string;
}
export interface FormInputProps {
  name: string;
  value: string;
  placeholder?: string;
  type: string;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface Category { id: string; name: string; created_at: string; }

export interface Transaction {
  id: number
  description: string
  amount: string | number
  type: 'income' | 'expense'
  category: string
  date: string
}