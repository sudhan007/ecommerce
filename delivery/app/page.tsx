"use client";
import Loginpage from "@/components/Login/Loginpage";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    let isLogin = localStorage.getItem("isLogin");
    let user = localStorage.getItem("user");

    if (isLogin && user) {
      window.location.href = "/dashboard";
    }
  }, []);

  return <Loginpage />;
}
