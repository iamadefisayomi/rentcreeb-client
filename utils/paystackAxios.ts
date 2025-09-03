import axios from 'axios'

export const paystackAxios = axios.create({
    baseURL: 'https://api.paystack.co',
    headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_API}`,
        "Content-Type": "application/json"
    }
})