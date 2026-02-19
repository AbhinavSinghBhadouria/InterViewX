"use client";

import { useState } from "react";

type PriceId = "monthly" | "yearly";

export default function CheckoutButton({
  priceId,
  buttonText,
  className,
}: {
  priceId: PriceId;
  buttonText: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      if (data.url) window.location.href = data.url;
      else throw new Error("No checkout URL returned");
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading}
      className={className}
    >
      {loading ? "Redirecting…" : buttonText}
    </button>
  );
}
