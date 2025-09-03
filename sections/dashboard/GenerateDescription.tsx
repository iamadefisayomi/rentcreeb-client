"use client"

import { generatePropertyDescription } from "@/actions/ai"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"


export default function GenerateDescription ({description, property, className, setDescription}: {description: string, property?: string, className?: string, setDescription?: any}) {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  // 
  const handleGetDescription = async () => {
    setLoading(true)
    try {
      const {success, message, data} = await generatePropertyDescription({description, property})
      if (!success && message) throw new Error(message)
        // 
      setText(data)
    }
    catch(err: any) {
      return err.message
    }
    finally {
      setLoading(false)
    }
  }

  const handleUse = () => {
    setDescription(text)
    return setOpen(false)
  }


  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild className={className}>
        <Button className="text-[10px]" size='sm'>Use our AI to generate description</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xs font-medium">
            Let our AI generate a standard description for you.
          </AlertDialogTitle>
          
          <AlertDialogDescription>
            <p className="text-[10px] text-muted-foreground lowercase">Write a prompt</p>
            <Textarea 
              defaultValue={description || ''}
              disabled={loading}
              value={text || description || ''}
              onChange={(e) => setText(e.target.value)}
              rows={8}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="text-[11px] min-w-[150px]">Cancel</AlertDialogCancel>
          <Button 
            onClick={text ? handleUse : handleGetDescription}
            className="text-[11px] min-w-[150px]"
            disabled={loading}
            loading={loading}
          >
            {loading ? 'Generating description...' : text ? 'use' : 'Generate description'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
