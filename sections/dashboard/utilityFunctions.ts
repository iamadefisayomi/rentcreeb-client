import { errorMessage } from "@/constants"
import axios from 'axios'

export const getAllCountriesAndCodes = async () => {
    try {
        const res = await axios.get('https://countriesnow.space/api/v0.1/countries/codes')
            // 
        return ({
            success: true,
            data: res.data.data,
            message: ''
        })
    }
    catch(err: any) {
        return errorMessage(err.message)
    }
}

export const getStates = async (country: string) => {
    try {
        const res = await axios.post('https://countriesnow.space/api/v0.1/countries/states', {country})
            // 
        return ({
            success: true,
            data: res.data?.data?.states,
            message: ''
        })
    }
    catch(err: any) {
        return errorMessage(err.message)
    }
}