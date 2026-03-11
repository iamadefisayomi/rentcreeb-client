'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCirclePlus, NotebookText } from "lucide-react";
import { useState, ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getRandomSingleStarterMessage } from "./_starterMessage";
import useAlert from "@/hooks/useAlert";
import { sendMessage } from "@/actions/chat";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { initInspectionPayment } from "@/actions/subscription"; // server action to initialize payment

export default function StartMessageAndBookInspection({
  propertyId,
  agentEmail,
}: {
  propertyId: string;
  agentEmail: string;
}) {
  const [startMessage, setStartMessage] = useState(true);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [message, setMessage] = useState<string>(getRandomSingleStarterMessage() || "");
  const [isSending, setIsSending] = useState(false);
  const [inspection, setInspection] = useState<{message: string, time: string, date: string}>({message: '', time: '', date: ''})
  const { user } = useAuth();
  const router = useRouter();
  const { setAlert } = useAlert();

  const handleChangeMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    try {
      setIsSending(true);
      if (!message || message.length < 10) throw new Error('At least 10 characters are required');
      if (!user) return setAlert("Login to send message", "info");

      const res = await sendMessage({ chatId: propertyId, content: message });
      router.push(`/messages/${res.chatId}`);
    } catch (err: any) {
      setAlert(err.message, "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleBookInspection = async () => {
    try {
      if (!inspection.date || !inspection.time) throw new Error("Please select a date and time");
      if (!user) return setAlert("Login to book inspection", "info");

      setIsSending(true);

      // Initialize Paystack payment
      const { success, data, message } = await initInspectionPayment({
        propertyId,
        renterEmail: user.email,
        message: inspection.message,
        inspectionDate: inspection.date,
        inspectionTime: inspection.time
      });

      if (!success) throw new Error(message);

      // Redirect user to Paystack payment page
      window.location.href = data.authorization_url;

      // Payment callback will handle sending chat/email and redirecting user
    } catch (err: any) {
      setAlert(err.message, "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
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

        <Button
          size="lg"
          onClick={() => setBookModalOpen(true)}
          className="flex items-center gap-2 h-12 border-2"
        >
          <NotebookText className="w-6" /> Book Inspection
        </Button>
      </div>

      {/* Start Message */}
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
            <Button
              loading={isSending}
              size="sm"
              onClick={handleSendMessage}
              className="absolute right-2 bottom-2 px-4"
            >
              Send message
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Book Inspection Modal */}
      <Dialog open={bookModalOpen} onOpenChange={setBookModalOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Book Inspection</DialogTitle>
            <p className="text-xs text-gray-600">Secure your inspection slot with OTP verification</p>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-4 text-gray-600">
            <div className="flex flex-col items-start gap-1">
              <label htmlFor="inspection_date" className="text-xs font-medium capitalize text-slate-600 ml-2">inspection date</label>
              <Input
                type="date"
                id="inspection_date"
                value={inspection.date}
                onChange={(e) => setInspection({...inspection, date: e.target.value})}
                className="bg-muted"
                required
                placeholder="Select Date"
              />
            </div>
            <div className="flex flex-col items-start gap-1">
              <label htmlFor="inspection_time" className="text-xs font-medium capitalize text-slate-600 ml-2">inspection time</label>
              <Input
              type="time"
              id="inspection_time"
              value={inspection.time}
              onChange={(e) => setInspection({...inspection, time: e.target.value})}
              className="bg-muted"
              required
              placeholder="Select Time"
            />
            </div>

            <div className="flex flex-col items-start gap-1">
              <label htmlFor="inspection_time" className="text-xs font-medium capitalize text-slate-600 ml-2">Additional message</label>
              <Textarea
                value={inspection.message}
                rows={4}
                onChange={(e) => setInspection({...inspection, message: e.target.value})}
                className="bg-muted"
                placeholder="Your message..."
              />
            </div>
            
          </div>

          <div className="text-[11px] bg-blue-100 text-slate-600 p-5 rounded-xl">
            A ₦20,000 inspection fee is required to book this slot. This fee will be deducted from your first rent payment if you proceed with this property.
          </div>

          <div className="mt-4 w-full flex items-center justify-center">
            <Button
              className="flex items-center gap-2 w-full h-12"
              onClick={handleBookInspection}
              loading={isSending}
            >
              Proceed to Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}