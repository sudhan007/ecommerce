"use client";

import { useCartStore } from "@/stores/CartStore";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { CircularProgress } from "@nextui-org/progress";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { products } = useCartStore();
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    if (products.length === 0) {
      redirect("/");
    }
    setisLoading(true);
  }, []);

  if (!isLoading) {
    return (
      <div className='h-[75vh] w-full bg-white flex justify-center items-center'>
        <CircularProgress label='Hang on...' />
      </div>
    );
  }

  return <section>{children}</section>;
}
