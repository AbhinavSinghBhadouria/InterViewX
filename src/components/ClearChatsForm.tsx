"use client";


import ClearChatsButton from "./ClearChatsButton";
import { toast } from "sonner";
import { deleteAllChats } from "@/src/actions/ai-chat";


export default function ClearChatsForm() {
  async function action() {
    const res = await deleteAllChats();
    if (res?.success) {
      toast.success("All chats cleared successfully.");
    }
  }

  return (
    <form action={action}>
      <ClearChatsButton />
    </form>
  );
}
