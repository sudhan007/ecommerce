"use client";
import { CircularProgress } from "@nextui-org/progress";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Navbar } from "../ui/components/navbar";
import Sidebar from "../ui/components/sidebar";

function layout({ children }: { children: React.ReactNode }) {
  let [readyToShowUi, setReadyToShowUi] = useState(false);

  useEffect(() => {
    let isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      toast.error("Please login first", { duration: 3000 });
      window.location.href = "/";
    } else {
      setReadyToShowUi(true);
    }
  }, []);

  return (
    <>
      {readyToShowUi ? (
        <>
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1 }}>
              <Sidebar />
            </div>
            <div style={{ flex: 4 }}>
              <Navbar />
              <div className="overflow-y-hidden">{children}</div>
            </div>
          </div>
        </>
      ) : (
        <div className="h-screen w-screen bg-white flex justify-center items-center">
          <CircularProgress label="Hang on..." />
        </div>
      )}
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default layout;
