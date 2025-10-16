"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getSingleImage } from "@/hooks/useGetImage";
import useAlert from "@/hooks/useAlert";
import {Loader2} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/hooks/useAuth";
import { deleteSingleImage, uploadSingleImage } from "@/actions/imagekit";
import { authClient } from "@/auth-client";


export default function ImageUploader() {
    
  const [open, setOpen] = useState(false)
  const {user, refetchUser} = useAuth()
  const [uploading, setUploading] = useState(false)
  const {setAlert} = useAlert()
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const image = await getSingleImage(e)
      if (!image.success && image.message) throw new Error(image.message)
        // 
      setUploading(true)
      const {message, success, data} = await uploadSingleImage(image.data as File)
      if (!success && message) throw new Error(message)
        //
      const {data: res, error} = await authClient.updateUser({
            image: data?.url
        })
      if (error) throw new Error(error.message)
      await refetchUser()
      
      return setAlert('Profile photo upload successful', 'success')
    }
    catch(err: any) {
      return setAlert(err.message, 'error')
    }
    finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setUploading(true)
      const {message, success} = await deleteSingleImage(user?.image as string)
      if (!success) throw new Error(message)
      // 
      const {data: res, error} = await authClient.updateUser({
            image: ''
        })
      if (error) throw new Error(error.message)
      await refetchUser()
      
      setAlert('Profile photo upload successful', 'success')
      return setOpen(false)
    }
    catch(err: any) {
      return setAlert(err.message, 'error')
    }
    finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full flex flex-col md:flex-row items-center gap-4 justify-start">
      <Avatar className="border-2 cursor-pointer w-32 h-32 md:w-14 md:h-14 flex items-center justify-center">
        {
          uploading ? <Loader2 className="w-4 animate-spin duration-1000" /> : (
            <>
              <AvatarImage className="w-full h-full object-cover flex" src={user?.image || ''} />
              <AvatarFallback className="uppercase text-sm">
                {user?.name?.slice(0, 2)}
              </AvatarFallback>
            </>
          )
        }
        
      </Avatar>

      <label 
        htmlFor="profile_image"
        className="border-2 border-slate-400 hover:bg-muted cursor-pointer md:rounded-3xl rounded-lg capitalize w-[80%] md:w-fit px-3 h-9 flex items-center justify-center text-[11px] font-medium text-gray-800"
      >
        {
        !uploading && 
        <input
          type="file"
          accept="image/*"
          id='profile_image'
          name='profile_image'
          onChange={handleFileChange}
          className="hidden"
        />}
        upload new picture
        </label>

        

        {/* ----------------------------- */}
          <AlertDialog onOpenChange={setOpen} open={open}>
            <AlertDialogTrigger asChild>
              <Button disabled={uploading} variant='ghost' className="h-10 md:bg-muted bg-destructive md:rounded-3xl rounded-lg capitalize w-[80%] md:w-fit">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-fit aspect-[3/2] flex flex-col justify-between items-center">
              <Avatar className="border-2 cursor-pointer w-32 h-32 md:w-14 md:h-14 flex items-center justify-center ">
                {
                  uploading ? <Loader2 className="w-4 animate-spin duration-1000" /> : (
                    <>
                      <AvatarImage className="w-full h-full object-cover flex" src={user?.image || ''} />
                      <AvatarFallback className="uppercase text-sm">
                        {user?.name?.slice(0, 2)}
                      </AvatarFallback>
                    </>
                  )
                }
                
              </Avatar>

                <AlertDialogTitle className=" text-[11px] font-medium ">Are you sure you want to delete this picture ?</AlertDialogTitle>
              <div className="w-full grid grid-cols-2 gap-3">
                <Button size='sm' variant='outline' onClick={() => setOpen(false)}>Cancel</Button>
                <Button size='sm' loading={uploading} onClick={handleDelete}>Continue</Button>
              </div>
            </AlertDialogContent>
          </AlertDialog>
    </div>
  );
}
