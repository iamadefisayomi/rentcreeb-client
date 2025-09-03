"use client"

import { authClient } from "@/auth-client" 
import useAlert from "./useAlert"
import Routes from "@/Routes"
import { useRouter } from "next/navigation"
import { NEXT_PUBLIC_BASE_URL } from "@/constants"



export function useAuth () {

    const { 
        data,
        isPending,
        error,
        refetch: refetchUser
    } = authClient.useSession() 
    const {setAlert} = useAlert()
    const router = useRouter()

    return ({
        user: data?.user,
        isPending,
        error,
        refetchUser,
        loginWithSocial: async (type: 'google' | 'facebook' | 'twitter') => {
            try {
                const { data: res, error } = await authClient.signIn.social({
                    provider: type,
                    newUserCallbackURL: Routes.dashboard["account management"]["account information"],
                    callbackURL: Routes.home,
                })
                if (error) throw new Error(error.message)
                else {
                    await refetchUser()
                    return
                }
            }
            catch(err: any) {
                return setAlert(err.message, 'error')
            }
        },
        logOut: async () => {
            try {
                const {data, error} = await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                    router.push(Routes.login);
                    },
                },
                })
                if (error) throw new Error(error.message)
                if (data && data.success) {
                    setAlert(`Have a lovely day buddy!`, 'info')
                }
                return
            }
            catch(err: any) {
                return setAlert(err.message, 'error')
            }
        },
        emailSignin: async (data: {email: string, password: string, remember: boolean}) => {
            try {
                const {data: res, error} = await authClient.signIn.email({
                    email: data.email,
                    password: data.password,
                    rememberMe: data.remember,
                    callbackURL: Routes.home,
                });
                if (error) throw new Error(error.message)
                if (res && res.user) {
                    setAlert(`welcome back ${res.user?.name.split(' ')[0]}`, 'success')
                }
                return
            }
            catch(err: any) {
                return setAlert(err.message || 'server error', 'error')
            }
        },
        emailSignup: async (data: {email: string, password: string, fullName: string, username: string, role: 'agent' | 'renter', setConfirmEmail: any}) => {
            try {
                const { data: res, error } = await authClient.signUp.email({
                    name: data.fullName,
                    email: data.email,
                    password: data.password,
                    username: data.username,
                    role: data.role,
                    callbackURL: Routes.dashboard["account management"]["account information"]
                })
                if (error) throw new Error(error.message)
                return data.setConfirmEmail(true)
            }
            catch(err: any) {
                return setAlert(err.message, 'error')
            }
        },
        resetPasswordRequest: async (email: string) => {
            try {
                const { data, error } = await authClient.requestPasswordReset({
                    email,
                    redirectTo: `${NEXT_PUBLIC_BASE_URL}/${Routes.resetPassword}/new`,
                })
                if (error) throw new Error(error.message)
                if (data && data.status) {
                    setAlert(`we sent a reset password link to your email`, 'success')
                }
                return
            }
            catch(err: any) {
                return setAlert(err.message, 'error')
            }
        },
        resetPasswordConfirm: async (data: {newPassword: string, token: string}) => {
            try {
                const { data: res, error } = await authClient.resetPassword({
                    newPassword: data.newPassword,
                    token: data.token
                })
                if (error) throw new Error(error.message)
                if (res && res.status) {
                    setAlert(`Your password is successfuly reset`, 'success')
                    router.push(Routes.login)
                }
                return
            }
            catch(err: any) {
                return setAlert(err.message, 'error')
            }
        },
        listAccounts: async () => {
            return await authClient.listAccounts()
        }
    })
}