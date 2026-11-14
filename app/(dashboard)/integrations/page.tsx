"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IntegrationsRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/automation");
  }, [router]);

  return (
    <div className="min-h-[400px] flex items-center justify-center text-xs text-white/40 font-mono">
      Redirecting to Web Automation Studio...
    </div>
  );
}
