import { getCurrentUser } from "@/actions/auth";
import { getMessages } from '@/actions/chat';
import ChatIdWindow from "@/sections/messages/ChatIdWindow";

type Props = {
    params: Promise<{ id: string }>;
  };


export default async function ChatPage({ params }: Props) {
  const user = await (await getCurrentUser()).data
  const {id} = await params
  const messages = await getMessages(id)

  return <ChatIdWindow chatId={id} user={user} messages={messages} />
}
