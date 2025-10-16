"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCirclePlus, NotebookText } from "lucide-react";
import { useState, ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getRandomSingleStarterMessage } from "./_starterMessage";
import useAlert from "@/hooks/useAlert";
import { sendMessage } from "@/actions/chat";
import { useRouter } from "next/navigation";



export default function StartMessageAndBookInspection({propertyId}: {propertyId: string}) {

  const [startMessage, setStartMessage] = useState(false);
  const [message, setMessage] = useState<string>(getRandomSingleStarterMessage() || "")
  const [isSending, setIsSending] = useState(false)
  const router = useRouter()
  const {setAlert} = useAlert()
  const handleChangeMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    };

  const handleSendMessage = async () => {
    try {
        setIsSending(true)
        // 
        if (!message || message.length < 10) throw new Error('at least 10 characters is required')
        // 
        const res = await sendMessage({chatId: propertyId, content: message})
        router.push(`/messages/${res.chatId}`)
    }
    catch(err: any) {
        return setAlert(err.message, 'error')
    }
    finally {
        setIsSending(false)
    }
  }


  return (
    <div className="w-full flex flex-col">
      {/* Buttons */}
      <div className="w-full grid grid-cols-2 gap-4">
        <Button
          variant="ghost"
          onClick={() => setStartMessage(!startMessage)}
          size="lg"
          className="flex items-center gap-2 h-12 border-2 border-blue-400"
        >
          <MessageCirclePlus className="w-5 text-muted-foreground" /> Message Agent
        </Button>

        <Button size="lg" className="flex items-center gap-2 h-12">
          <NotebookText className="w-6" /> Book Inspection
        </Button>
      </div>

      <AnimatePresence>
        {startMessage && (
          <motion.div
            key="messageBox"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full relative mt-4"
          >
            <Textarea
              placeholder="Type your message"
              rows={8}
              className="bg-white"
              value={message}
              onChange={handleChangeMessage}
            />
            <Button loading={isSending} size="sm" onClick={handleSendMessage} className="absolute right-2 bottom-2 px-4">
              Send message
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
