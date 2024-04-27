"use client";
import { Toaster } from "@/components/ui/sonner";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "./loading";
import Navbar from "@/components/Navbar/Navbar";
import { Providers } from "../providers";

function layout({ children }: { children: React.ReactNode }) {
  const [showui, setShowUi] = useState(false);
  useEffect(() => {
    let isLoggedIn = localStorage.getItem("isLogin");
    if (!isLoggedIn) {
      toast.error("Please login first", { duration: 3000 });
      window.location.href = "/";
    } else {
      setShowUi(true);
    }
  }, []);

  return (
    <>
      {showui ? (
        <Providers>
          <div>
            <Navbar />
            <div className='overflow-y-hidden'>{children}</div>
          </div>
        </Providers>
      ) : (
        <Loading />
      )}
      <Toaster />
    </>
  );
}

export default layout;
