import mongoose, { Model, Document } from "mongoose"

export interface TransactionDocument extends Document {
  value: number
  date: number
  user_id: string
}

interface TransactionModel extends Model<TransactionDocument> {}

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
  user_id: {
    type: String,
    required: true
  }
})

export const Transaction: TransactionModel = mongoose.model<TransactionDocument>('transaction', TransactionSchema)

