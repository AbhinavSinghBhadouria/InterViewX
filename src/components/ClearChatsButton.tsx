"use client";

import { Button } from "@/src/components/ui/button";
import { useFormStatus } from "react-dom";


function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button variant="destructive" type="submit" disabled={pending} className="cursor-pointer">
      {pending ? "Clearing..." : "Clear Chats"}
    </Button>
  );
}

export default function ClearChatsButton() {
  return (
    <SubmitButton />
  );
}
