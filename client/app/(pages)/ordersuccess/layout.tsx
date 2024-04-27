"use client";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { CircularProgress } from "@nextui-org/progress";
import { useOrderTrackStore } from "@/stores/OrderTrackStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const trackingId = useOrderTrackStore((state: any) => state.orderTracking);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    if (
      trackingId.trackingNumber === "" ||
      trackingId.trackingNumber === undefined ||
      trackingId.trackingNumber === null
    ) {
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
