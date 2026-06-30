import { useEffect, useState } from 'react';
import {
  createTransactionRequest,
  deleteTransactionsRequest,
  fetchTransactions,
} from '../services/transaction.api';
import type {
  CreateTransactionPayload,
  Transaction,
} from '../types/transaction.types';

const TRANSACTIONS_PER_PAGE = 20;

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<
    string[]
  >([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [message, setMessage] = useState('');

  const loadTransactions = async (nextPage = page) => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      setMessage('You must login first.');
      return;
    }

    try {
      const data = await fetchTransactions(
        authToken,
        nextPage,
        TRANSACTIONS_PER_PAGE,
      );
      setTransactions(data.items);
      setPage(data.page);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
      setSelectedTransactionIds([]);
      setMessage('');
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Could not load transactions.',
      );
    }
  };

  const createTransaction = async (payload: CreateTransactionPayload) => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      setMessage('You must login first');
      return;
    }

    try {
      await createTransactionRequest(authToken, payload);
      const data = await fetchTransactions(authToken, 1, TRANSACTIONS_PER_PAGE);

      setTransactions(data.items);
      setPage(data.page);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
      setSelectedTransactionIds([]);
      setMessage('Transaction created.');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Could not create transaction.',
      );
    }
  };

  const deleteSelectedTransactions = async () => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      setMessage('You must login first');
      return;
    }

    if (selectedTransactionIds.length === 0) {
      setMessage('Select at least one transaction.');
      return;
    }

    try {
      const targetPage =
        selectedTransactionIds.length === transactions.length && page > 1
          ? page - 1
          : page;

      const data = await deleteTransactionsRequest(authToken, {
        transactionIds: selectedTransactionIds,
      });

      await loadTransactions(targetPage);
      setMessage(`${data.deletedCount} transaction(s) deleted.`);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Could not delete transactions.',
      );
    }
  };

  const toggleTransactionSelection = (transactionId: string) => {
    setSelectedTransactionIds((currentIds) =>
      currentIds.includes(transactionId)
        ? currentIds.filter((currentId) => currentId !== transactionId)
        : [...currentIds, transactionId],
    );
  };

  const toggleCurrentPageSelection = () => {
    const currentPageIds = transactions.map((transaction) => transaction.id);
    const isCurrentPageSelected = currentPageIds.every((transactionId) =>
      selectedTransactionIds.includes(transactionId),
    );

    setSelectedTransactionIds(
      isCurrentPageSelected
        ? selectedTransactionIds.filter(
            (transactionId) => !currentPageIds.includes(transactionId),
          )
        : Array.from(new Set([...selectedTransactionIds, ...currentPageIds])),
    );
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return {
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
  };
};
