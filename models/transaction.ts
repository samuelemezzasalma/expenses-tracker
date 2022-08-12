import mongoose from "mongoose"

const now = new Date().getTime()

const TransactionSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true
  },
  date: {
    type: Number,
    default: now,
  },
})

export const Transaction = mongoose.model('transaction', TransactionSchema)

