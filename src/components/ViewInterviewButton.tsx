"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export default function ViewInterviewButtonClient({
  interviewId,
  isOwner,
}: {
  interviewId?: string;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);

    if (isOwner) {
      router.push(`/interview/${interviewId}/feedback`);
    } else {
      router.push(`/interview/${interviewId}`);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className="btn-primary max-sm:w-full flex items-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {isOwner ? "Feedback ...." : "Interview ..."}
        </>
      ) : (
        <>{isOwner ? "Check Feedback" : "View Interview"}</>
      )}
    </Button>
  );
}
