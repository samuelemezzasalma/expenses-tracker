// const Transaction = require("../models/transaction")
// const Router = require("express")

import { Router } from "express"
import { Transaction } from "../models/transaction"

const transactionsRoutes = Router()

/**
 * Homepage
 * get all transactions
 */
transactionsRoutes.get('/', async (req: any, res: any) => {
  try {
    const transactions = await Transaction.find()
    if (!transactions) {
      throw new Error('No transactions')
    }
    res.status(200).json(transactions)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
})

/**
 * 
 * Add a new transaction
 */
transactionsRoutes.post('/', async (req: any, res: any) => {
  const { value, date } = req.body
  const newTRansaction = new Transaction({ value, date })
  try {
    const transaction = await newTRansaction.save()
    if (!transaction) {
      throw new Error("There was an error saving the transaction");
    }
    res.status(200).json(transaction)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }

})

transactionsRoutes.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const transaction = Transaction.findById(id)
    if (!transaction) {
      throw new Error("No transaction was found");
    }
    const removed = await transaction.remove()
    if (!removed) {
      throw new Error("There was a problem deleting the transaction");
    }
    res.status(200).json({ id })
  } catch (error) {
    res.status(404).json({message: error.message})
  }
})

export default transactionsRoutes