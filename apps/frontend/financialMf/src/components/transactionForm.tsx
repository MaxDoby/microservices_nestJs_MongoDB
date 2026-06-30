import { useState } from 'react';
import {
  expenseCategories,
  incomeCategories,
  type CreateTransactionPayload,
  type TransactionType,
  type TransactionCategory,
} from '../types/transaction.types';

interface TransactionFormProps {
  onCreateTransaction: (payload: CreateTransactionPayload) => Promise<void>;
}

export const TransactionForm = ({
  onCreateTransaction,
}: TransactionFormProps) => {
  const [type, setType] = useState<TransactionType>('income');
  const [category, setCategory] = useState<TransactionCategory>('sales');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  const updateType = (nextType: TransactionType) => {
    setType(nextType);
    setCategory(nextType === 'income' ? 'sales' : 'salary');
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onCreateTransaction({
      type,
      amount: Number(amount),
      category,
      description: description || undefined,
      date,
    });

    setAmount('');
    setDescription('');
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <select
        value={type}
        onChange={(event) => updateType(event.target.value as TransactionType)}
      >
        <option value={'income'}>Income</option>
        <option value={'expense'}>Expense</option>
      </select>

      <select
        value={category}
        onChange={(event) =>
          setCategory(event.target.value as TransactionCategory)
        }
      >
        {categories.map((categoryOption) => (
          <option key={categoryOption} value={categoryOption}>
            {categoryOption}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
      />

      <button type="submit">Create transaction</button>
    </form>
  );
};
