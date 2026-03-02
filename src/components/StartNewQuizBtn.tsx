"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export default function StartNewQuizBtn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    router.push("/tools/interview-prep/mock")
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className="btn-primary cursor-pointer"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
             Starting Your Quiz....
        </>
      ) : (
        "Start New Quiz"
      )}
    </Button>
  );
}
