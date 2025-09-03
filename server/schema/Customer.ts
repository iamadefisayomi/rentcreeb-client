import { Schema, model, models } from 'mongoose';

const CustomerSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: { type: String },
    customerId: {type: String, unique: true},
    userId: {type: String, unique: true}
  },
  {
    timestamps: true,
  }
);

const Customer = models.Customer || model('Customer', CustomerSchema);

export default Customer;
