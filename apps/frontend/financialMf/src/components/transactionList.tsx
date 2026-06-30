import type { Transaction } from '../types/transaction.types';

interface TransactionListProps {
  transactions: Transaction[];
  selectedTransactionIds: string[];
  onToggleTransaction: (transactionId: string) => void;
  onToggleCurrentPage: () => void;
}

export const TransactionList = ({
  transactions,
  selectedTransactionIds,
  onToggleTransaction,
  onToggleCurrentPage,
}: TransactionListProps) => {
  if (transactions.length === 0) {
    return <p>No transactions found.</p>;
  }

  const isCurrentPageSelected = transactions.every((transaction) =>
    selectedTransactionIds.includes(transaction.id),
  );

  return (
    <section className="transaction-list-section">
      <label className="select-all-control">
        <input
          type="checkbox"
          checked={isCurrentPageSelected}
          onChange={onToggleCurrentPage}
        />
        Select current page
      </label>

      <ul className="transaction-list">
        {transactions.map((transaction) => (
          <li className="transaction-item" key={transaction.id}>
            <input
              type="checkbox"
              checked={selectedTransactionIds.includes(transaction.id)}
              onChange={() => onToggleTransaction(transaction.id)}
            />

            <div>
              <strong>{transaction.type}</strong>
              <span>{transaction.category}</span>
            </div>

            <div>
              <strong>{transaction.amount}</strong>
              <span>{transaction.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
