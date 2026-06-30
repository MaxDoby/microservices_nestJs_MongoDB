import { TransactionList } from './components/transactionList';
import { TransactionForm } from './components/transactionForm';
import { useTransactions } from './hooks/useTransactions';

export const App = () => {
  const {
    transactions,
    selectedTransactionIds,
    page,
    totalPages,
    totalItems,
    message,
    loadTransactions,
    createTransaction,
    deleteSelectedTransactions,
    toggleTransactionSelection,
    toggleCurrentPageSelection,
  } = useTransactions();

  return (
    <section data-testid="financialMf" className="panel-stack">
      <div className="section-heading">
        <h2>Transactions</h2>
        <p>Create and review income and expense records.</p>
      </div>

      <TransactionForm onCreateTransaction={createTransaction} />

      <div className="toolbar">
        <button
          type="button"
          className="secondary-button"
          onClick={() => loadTransactions(page)}
        >
          Refresh
        </button>

        <button
          type="button"
          className="danger-button"
          onClick={deleteSelectedTransactions}
        >
          Delete selected
        </button>
      </div>

      {message && <p className="status-message">{message}</p>}

      <TransactionList
        transactions={transactions}
        selectedTransactionIds={selectedTransactionIds}
        onToggleTransaction={toggleTransactionSelection}
        onToggleCurrentPage={toggleCurrentPageSelection}
      />

      <div className="pagination">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => loadTransactions(page - 1)}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages} / {totalItems} transaction(s)
        </span>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => loadTransactions(page + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default App;
