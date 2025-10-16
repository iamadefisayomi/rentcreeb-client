"use client";

import { useState, useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Mic, Paperclip, Send, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { Input } from "@/components/ui/input";
import debounce from "lodash/debounce";
import { Button } from "@/components/ui/button";

const MessageInput = ({
  onSend,
  text,
  setText,
  onTyping,
}: {
  onSend: () => void;
  text: string;
  setText: any;
  onTyping: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSend();
  };

  // Debounced typing callback (300ms)
  const debouncedTyping = useMemo(() => debounce(onTyping, 300), [onTyping]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    debouncedTyping();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full p-4 bg-slate-100 rounded-br-[4px] flex flex-col md:flex-row items-center gap-3"
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="hidden md:flex">
          <button type="button">
            <Smile className="w-4 text-gray-600" />
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <EmojiPicker
            open={open}
            onEmojiClick={(e) =>
              setText((prev: string) => prev + e.emoji)
            }
          />
        </PopoverContent>
      </Popover>

      <Input
        value={text}
        onChange={handleChange}
        placeholder="Type message..."
        className="bg-background text-[11px] h-11 border-none rounded-3xl"
      />

      <span className="flex justify-evenly gap-3 w-full md:w-fit">
        {/* <button type="button">
          <Paperclip className="w-4 text-gray-600" />
        </button>
        <button type="button">
          <Mic className="w-4 text-gray-600" />
        </button> */}
        <Button size='icon' className="aspect-square rounded-full" type="submit">
          <Send className="w-4" /> 
        </Button>
      </span>
    </form>
  );
};

export default MessageInput;
