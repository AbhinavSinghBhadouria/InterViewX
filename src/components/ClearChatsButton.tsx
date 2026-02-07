"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";


function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button variant="destructive" type="submit" disabled={pending}>
      {pending ? "Clearing..." : "Clear Chats"}
    </Button>
  );
}

export default function ClearChatsButton() {
  return (
    <SubmitButton />
  );
}
