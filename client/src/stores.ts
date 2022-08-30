import axios from 'axios';
import { derived, writable, Writable } from 'svelte/store';

export interface Transaction {
  _id?: number;
  date: number;
  value: number;
}

export interface User {
  _id?: number;
  username: string;
  password: string;
}

export const user = writable<User>(null)

export const transactions = writable<Transaction[]>([])

export const sortedTransactions = derived<Writable<Transaction[]>, Transaction[]>(transactions, (values) => { return values.sort((a, b) => b.date - a.date) })

export const balance = derived<Writable<Transaction[]>, number>(transactions, (values) => {
  return values.reduce(
    (accumulator, t) => accumulator + t.value,
    0
  )
})

export const income = derived<Writable<Transaction[]>, number>(transactions, (values) => {
  return values.filter((t) => t.value > 0)
    .reduce((accumulator, t) => accumulator + t.value, 0)
})

export const expenses = derived<Writable<Transaction[]>, number>(transactions, (values) => {
  return values.filter((t) => t.value < 0)
    .reduce((accumulator, t) => accumulator + t.value, 0)
})

export async function addTrans(transaction: Transaction) {
  let result = false;
  try {
    const response = await axios.post("/api/transactions", transaction);
    transactions.update((values) => {
      return [response.data, ...values]
    })
    result = true;
  } catch (error) {
    console.log({ message: error.message });
  }
  return result
}

export async function fetchTransactions() {
  let result = false;
  try {
    const { data } = await axios.get<Transaction[]>("/api/transactions");
    transactions.set(data)
    result = true;
  } catch (error) {
    console.log({ message: error.message });
  }
  return result
}

export async function deleteTransaction(id: number) {
  let result = false;
  try {
    const { data } = await axios.delete<{ id: number }>("/api/transactions/" + id);
    if (data.id === id) {
      transactions.update((values) => {
        const filteredValues = values.filter((t) => t._id !== id)
        return [...filteredValues]
      })
    }
    result = true;
  } catch (error) {
    console.log({ message: error.message });
  }
  return result
}
