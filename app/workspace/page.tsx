"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WorkspaceIndexPage() {
  const router = useRouter();

  useEffect(() => {
    async function redirectWorkspace() {
      try {
        const res = await fetch("/api/agent");
        if (res.ok) {
          const data = await res.json();
          if (data.agents && data.agents.length > 0) {
            router.replace(`/workspace/${data.agents[0].agentId}`);
            return;
          }
        }
      } catch (err) {
        console.error("Workspace redirect check failed:", err);
      }
      router.replace("/workspace/create-agent");
    }

    redirectWorkspace();
  }, [router]);

  return (
    <div className="flex-1 flex items-center justify-center text-xs text-[#777169]">
      Loading agent workspace...
    </div>
  );
}
