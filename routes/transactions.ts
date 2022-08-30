// const Transaction = require("../models/transaction")
// const Router = require("express")

import { Request, RequestHandler, Response, Router } from "express"
import { Transaction, TransactionDocument } from "../models/transaction"
import { UserDocument } from "../models/user"

const transactionsRoutes = Router()

function ensureLogin(req: Request, res: Response, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send({message: 'Not authenticated'})
  }
  next()
}

/**
 * Homepage
 * get all transactions
 */
transactionsRoutes.get('/', ensureLogin, async (req: Request, res: Response) => {
  try {
    const user: UserDocument = <UserDocument>req.user
    const transactions = await Transaction.find({user_id: user._id}).exec()
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
transactionsRoutes.post('/', ensureLogin, async (req: Request, res: Response) => {
  const { value, date } = req.body
  const user: UserDocument = <UserDocument>req.user
  const newTRansaction = new Transaction({ value, date, user_id: user._id })
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

transactionsRoutes.delete('/:id', ensureLogin, async (req: Request, res: Response) => {
  const { id } = req.params
  const user: UserDocument = <UserDocument>req.user
  try {
    const transaction = await Transaction.findById<TransactionDocument>(id)
    if (!transaction) {
      throw new Error("No transaction was found");
    }
    if (transaction.user_id !== new String(user._id)) {
      res.status(403).json({message: 'Unauthorized'})
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