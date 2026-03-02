"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export default function StartInterviewButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    router.push("/interview");
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className="btn-primary max-sm:w-full flex items-center gap-2 cursor-pointer"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating the Interview...
        </>
      ) : (
        "Generate an Interview"
      )}
    </Button>
  );
}
