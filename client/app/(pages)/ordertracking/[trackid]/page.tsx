"use client";
import React, { useEffect, useState } from "react";
import { Navebar } from "@/app/components/Home/Navbar/Navebar";
import { Card } from "@nextui-org/card";
import { Icon } from "@iconify/react";
import { useParams, useRouter } from "next/navigation";
import Footer from "@/app/components/Home/Footer";
import { axios } from "@/lib/axios";
import { CircularProgress } from "@nextui-org/progress";
import toast, { Toaster } from "react-hot-toast";
import { useUserStore } from "@/stores/UserStore";
import { Chip } from "@nextui-org/chip";
import { statusEnums } from "@/lib/config";
import { Button } from "@nextui-org/button";

interface type {
  title: string;
  key: string;
  desc: string;
}

function OrderTracking({ params }: any) {
  const router = useRouter();
  let { trackid } = useParams();
  const [orderData, setOrderData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);

  const {
    user: { phone },
  } = useUserStore();

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `/order/trackorder?trackingNumber=${trackid}`
      );

      if (response.data.ok === true) {
        setOrderData(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };
  const formatePhone = (phone: string) => {
    if (!phone) return "";
    let formatedtime = phone
      .toString()
      .replace(/(\d{2})(\d{4})(\d{4})/, "+$1 $2$3");
    return formatedtime;
  };

  const orderTracks: type[] = [
    {
      title: "Confirmed",
      key: "confirmed",
      desc: "Your order has been confirmed and is now being processed.",
    },
    {
      title: "Pickedup",
      key: "pickedup",
      desc: "Your order is ready to be picked up at the specified location.",
    },
    {
      key: "ontheWay",
      title: "On the Way",
      desc: "Your order is currently on its way to the delivery location.",
    },
    {
      title: "Delivered",
      key: "delivered",
      desc: "Your order has been successfully delivered to the specified location.",
    },
  ];
  return (
    <>
      <section className='bg-[#1A3824]'>
        <Navebar />
      </section>
      {loading ? (
        <>
          <div className='h-screen w-screen bg-white flex justify-center items-center'>
            <CircularProgress label='Hang on...' />
          </div>
        </>
      ) : (
        <main className=' mt-0 md:mt-14 container mx-auto mb-0 md:mb-14'>
          <div className=' shadow-lg md:shadow-none  rounded-lg'>
            <div className='font-duplet-semi gap-4 grid grid-cols-1 lg:grid-cols-2   '>
              <Card
                shadow='sm'
                radius='sm'
                className='md:border md:border-[#E6E6E6]  px-3 md:px-6 pb-5  '>
                <div className=' font-duplet-semi  py-2 flex gap-2 items-center'>
                  <div className='p-2'>
                    <Button
                      onClick={() => router.push(`/`)}
                      className='bg-[#00B207]'
                      isIconOnly>
                      <Icon
                        className='text-xl text-white'
                        icon='ic:round-arrow-back'
                      />
                    </Button>
                  </div>
                  <div className='text-base md:text-xl text-[#1A202C]'>
                    Tracking Details
                  </div>
                </div>

                <div className='mt-3 md:mt-6'>
                  <div className='flex gap-2 items-center'>
                    <Icon icon='ion:location-outline' />
                    <h1 className='text-lg md:text-xl font-duplet-semi'>
                      From
                    </h1>
                  </div>

                  <div className='flex justify-between items-center mt-4 md:mt-8 px-2 md:px-6'>
                    <div>
                      <h3 className='text-xl font-medium'>Location</h3>
                      <div className='text-base capitalize text-[#666666]'>
                        Starex
                      </div>
                    </div>
                    <div>
                      <h3 className='text-xl font-medium'>Date</h3>
                      <div className='text-base text-[#666666]'>Today</div>
                    </div>
                  </div>
                </div>

                <div className='mt-5'>
                  <div className='flex gap-2 items-center'>
                    <Icon icon='ion:location-outline' />
                    <h1 className='text-xl font-duplet-semi'>
                      Billing Address
                    </h1>
                  </div>

                  <div className='flex flex-wrap justify-between items-center mt-2 md:mt-4 px-2 md:px-6'>
                    <div>
                      <div className='text-base capitalize text-[#666666]'>
                        <div className='font-duplet-reg w-full'>
                          {orderData?.address?.mapAddress ? (
                            <div>
                              <address>
                                {orderData?.address?.mapAddress}
                              </address>
                            </div>
                          ) : (
                            <>
                              <div className='flex gap-2'>
                                <span className='text-lg font-duplet-semi capitalize'>
                                  {orderData?.address?.name}
                                </span>
                                <Chip
                                  radius='sm'
                                  className='bg-[#0EA829] capitalize text-white'>
                                  {orderData?.address?.addressType}
                                </Chip>
                              </div>
                              {orderData?.address?.houseNo},
                              {orderData?.address?.street},
                              {orderData?.address?.landmark},
                              {orderData?.address?.city},
                              {orderData?.address?.pincode}
                              <div>{orderData?.address?.phoneNumber}</div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className='mt-8 text-[#C3D4E9]' />
                </div>

                <div className='mt-8 px-5 flex justify-between gap-4 items-center'>
                  <div className='text-lg md:text-xl text-[#1A202C]'>
                    Delivery Charges
                    <p className='text-sm md:text-base text-[#666666]'>
                      Charges for delivery
                    </p>
                  </div>
                  <div className='text-lg md:text-2xl font-bold text-[#666] line-through'>
                    ₹ 10
                  </div>
                </div>

                <div className='mt-8 px-5 flex justify-between gap-4 items-center'>
                  <div className='text-lg md:text-xl text-[#1A202C]'>
                    Discount
                    <p className='text-sm md:text-base text-[#666666]'>
                      Discount on coupon
                    </p>
                  </div>
                  <div className='text-lg md:text-2xl font-bold text-[#666]'>
                    ₹ 0
                  </div>
                </div>

                <hr className='mt-8 text-[#C3D4E9]' />

                <div className='mt-8 px-5 flex justify-between gap-4 items-center'>
                  <div className='text-lg md:text-xl text-[#1A202C]'>
                    Total Price
                    <p className='text-sm md:text-base text-[#666666]'>
                      Overall price and includes Coupon Code offer
                    </p>
                  </div>
                  <div className='text-lg md:text-2xl font-bold text-[#1A202C]'>
                    ₹{orderData?.total?.toFixed(0)}
                  </div>
                </div>
              </Card>

              <Card
                shadow='sm'
                radius='sm'
                className='md:border md:border-[#E6E6E6] mt-5 md:mt-0 px-3 md:px-6 pb-5  '>
                <div className=' font-duplet-semi  py-2 '>
                  <div className='text-base md:text-xl text-[#1A202C] '>
                    Product Tracking
                  </div>
                </div>

                <div className=' flex items-center font-duplet-semi justify-between px-5 py-3'>
                  <div className='text-base md:text-xl text-[#70737B] '>
                    Recipient
                  </div>
                  <div className='text-base md:text-xl text-[#70737B] '>
                    {phone}
                  </div>
                </div>

                <div className=' flex items-center font-duplet-semi justify-between px-5 py-3'>
                  <div className='text-base md:text-xl text-[#70737B] '>
                    Order Status:
                  </div>
                  <div className='text-base flex gap-2 items-center md:text-xl text-[#70737B] '>
                    <span>{statusEnums[orderData.status]}</span>
                    <span></span>
                  </div>
                </div>

                <div className=' flex items-center font-duplet-semi justify-between px-5 py-3'>
                  <div className='text-base md:text-xl text-[#70737B] '>
                    Tracking ID:
                  </div>
                  <div className='text-base flex gap-2 items-center md:text-xl text-[#70737B] '>
                    <span>{orderData?.trackingNumber}</span>
                    <span>
                      <Icon
                        icon={"fa-regular:copy"}
                        className='cursor-pointer text-2xl'
                        onClick={() => copy(trackid.toString())}
                      />
                    </span>
                  </div>
                </div>

                {/* <div className=" flex flex-wrap items-center   justify-between gap-3 px-5 py-3 md:py-8 ">
                  <div>
                    <h1 className="text-base md:text-xl font-duplet-reg text-[#454545]">
                      From
                    </h1>
                    <div className="mt-3  text-lgfont-duplet-reg text-[#666666]">
                      Starex market Nagercoil
                    </div>
                  </div>

                  <div>
                    <h1 className="text-base md:text-xl font-duplet-reg text-[#BABFC5]">
                      To
                    </h1>
                    <div className="mt-3   font-duplet-reg text-[#666666]">
                      <div className="capitalize font-duplet-reg">
                        <div className="flex gap-2 flex-wrap">
                          <span className="text-lg font-duplet-semi capitalize">
                            {orderData?.address?.name}
                          </span>
                          <Chip
                            radius="sm"
                            className="bg-[#0EA829] capitalize text-white"
                          >
                            {orderData?.address?.addressType}
                          </Chip>
                        </div>
                        {orderData?.address?.houseNo},
                        {orderData?.address?.street}
                        , <br />
                        {orderData?.address?.landmark},
                        {orderData?.address?.city},{orderData?.address?.pincode}
                        <div>{orderData?.address?.phoneNumber}</div>
                      </div>
                    </div>
                  </div>
                </div> */}

                <div className=' flex items-center font-duplet-semi justify-between px-5 py-3 md:py-8 '>
                  <div className='text-base md:text-xl text-[#BABFC5] '>
                    Est. Delivery
                  </div>
                  <div className='text-base md:text-xl font-duplet-reg text-[#70737B] '>
                    Today
                  </div>
                </div>

                <div className=' mt-4 px-10'>
                  {orderTracks.map((track: type) => (
                    <div key={track.key} className='flex gap-4 items-center'>
                      <div className='text-[#666666] text-center text-lg  font-duplet-semi'>
                        20
                        <p>Sept</p>
                      </div>
                      <div>
                        <Icon
                          icon={"mdi:tick-circle"}
                          className={`text-2xl md:text-3xl ${
                            track.key === orderData.status ||
                            orderTracks.findIndex(
                              (t) => t.key === orderData.status
                            ) >
                              orderTracks.findIndex((t) => t.key === track.key)
                              ? "text-[#29BE10]"
                              : "text-[#BABFC5]"
                          }`}
                        />
                      </div>
                      <div>
                        <h1
                          className={`font-duplet-semi ${
                            track.key === orderData.status ||
                            orderTracks.findIndex(
                              (t) => t.key === orderData.status
                            ) >
                              orderTracks.findIndex((t) => t.key === track.key)
                              ? "text-[#29BE10]"
                              : "text-[#BABFC5]"
                          } text-xl md:text-2xl`}>
                          {track.title}
                        </h1>
                        <p className='flex flex-wrap font-duplet-reg text-sm md:text-xl text-[#666666]'>
                          {track.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>
      )}

      <div className='hidden md:block'>
        <Footer />
      </div>
    </>
  );
}

export default OrderTracking;
