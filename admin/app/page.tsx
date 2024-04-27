"use client";

import { useEffect } from "react";
import LoginPage from "./ui/components/loginpage";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    let isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, []);

  return <LoginPage />;
}
