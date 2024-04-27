"use client";
import React, { useState, useEffect } from "react";
import { Navebar } from "../../components/Home/Navbar/Navebar";
import Image from "next/image";
import oredaccepted from "@/public/images/paymentsuccess.png";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { useRouter } from "next/navigation";
import { useOrderTrackStore } from "@/stores/OrderTrackStore";

export default function Orderaccept() {
  const router = useRouter();
  const trackingId = useOrderTrackStore((state: any) => state.orderTracking);
  const [showUI, setShowUI] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const tracking = useEffect(() => {
    const timer = setTimeout(() => {
      setShowUI(true);
      setIsLoading(false);
    }, 1500);
    console.log(trackingId, "tracking objext");
    console.log(trackingId.trackingNumber);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <section className='min-h-screen flex flex-col'>
        <div className='hidden md:block bg-none md:bg-[#1A3824]'>
          <Navebar />
        </div>
        <div className='flex-grow flex flex-col items-center justify-center'>
          {isLoading ? (
            <div className='flex justify-center items-center h-screen'>
              <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
            </div>
          ) : (
            showUI && (
              <div className='flex flex-col items-center text-center'>
                <div className='mb-4'>
                  <Image src={oredaccepted} alt='' width={200} height={200} />
                </div>
                <div className='mb-4'>
                  <h1 className='text-xl md:text-3xl'>
                    Your Order has been accepted
                  </h1>
                  <p className='font-duplet-reg text-[#7C7C7C]'>
                    Your items have been placed and are on their way to being
                    processed
                  </p>
                </div>
                <div className='flex flex-col items-center'>
                  <div className='mb-4'>
                    <Button
                      radius='sm'
                      size='lg'
                      className='text-[#FFFFFF] text-lg font-duplet-semi md:w-[400px] w-full bg-shopnow1 mt-10 md:mt-20 py-3 md:py-5'
                      onClick={() =>
                        router.push(
                          `/ordertracking/${trackingId.trackingNumber}`
                        )
                      }
                    >
                      Track Order
                    </Button>
                  </div>

                  <div>
                    <Button
                      radius='sm'
                      size='lg'
                      className='text-[#0EA829] text-lg font-duplet-semi md:w-[400px] w-full bg-green-100 py-3 md:py-5'
                      onClick={() => router.push("/")}
                    >
                      Back To Home
                    </Button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </>
  );
}
