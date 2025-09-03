import { getCurrentUser } from "@/actions/auth";
import ChatWindow from "../ChatWindow";
import { getMessages } from '@/actions/chat';

type Props = {
    params: Promise<{ id: string }>;
  };


export default async function ChatPage({ params }: Props) {
  const user = await (await getCurrentUser()).data
  const {id} = await params
  const messages = await getMessages(id)

  return <ChatWindow chatId={id} user={user} messages={messages} />
}
