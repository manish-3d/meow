"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function Provider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      createNewUser();
    }
  }, [session]);

  const createNewUser = async () => {
    try {
      const result = await axios.post("/api/user", {});
      console.log("User sync result:", result.data);
    } catch (error) {
      console.error("Error creating user in DB:", error);
    }
  };

  return <>{children}</>;
}
