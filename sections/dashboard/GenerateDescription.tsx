"use client"

import { generatePropertyDescription } from "@/actions/ai"
import {
  AlertDialog,
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


export default function GenerateDescription ({description, property, className, setDescription}: {description: string, property?: any, className?: string, setDescription?: any}) {
  const [prompt, setPrompt] = useState(description || `Generate standard description ${property?.title ? ` this ${property.title}` : 'this property'}`)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  // 
  const handleGetDescription = async () => {
    setLoading(true)
    try {
      const {success, message, data} = await generatePropertyDescription({description: prompt, property})
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
            Let our AI generate a standard Property description that converts for you.
          </AlertDialogTitle>
          
          <AlertDialogDescription>
            <p className="text-[10px] text-muted-foreground lowercase">Write a prompt</p>
            <Textarea 
              disabled={loading}
              value={text || prompt}
              onChange={(e) => setPrompt(e.target.value)}
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
