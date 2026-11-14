"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/sign-in");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#08090a] flex items-center justify-center text-xs text-white/40 font-mono">
      Redirecting to secure gateway...
    </div>
  );
}
