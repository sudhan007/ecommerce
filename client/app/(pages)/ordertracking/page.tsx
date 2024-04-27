"use client";
import React, { useEffect, useState } from "react";
import { Navebar } from "@/app/components/Home/Navbar/Navebar";
import { Card } from "@nextui-org/card";
import { Icon } from "@iconify/react";
import { useParams } from "next/navigation";
import Footer from "@/app/components/Home/Footer";
import { axios } from "@/lib/axios";
import { CircularProgress } from "@nextui-org/progress";
import toast, { Toaster } from "react-hot-toast";
import { useUserStore } from "@/stores/UserStore";
import { Chip } from "@nextui-org/chip";

function OrderTracking({ params }: any) {
  let { trackid } = useParams();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>({});

  const {
    user: { phone },
  } = useUserStore();

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }

  useEffect(() => {
    fetchData();
    console.log(orderData, "orderdata");
    console.log(params.trackId, "3d4332");
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `/order/trackorder?trackingNumber=${params.trackId}`
      );
      console.log(response.data.data);
      if (response.data.ok === true) {
        setOrderData(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  function formatPhone(phone: string) {
    if (!phone) return "";
    return phone
      .toString()
      .slice(2)
      .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }
  return (
    <>
      <section className="bg-[#1A3824]">
        <Navebar />
      </section>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32">
            <CircularProgress label="Hang On..." />
          </div>
        </div>
      ) : (
        <main className=" mt-0 md:mt-14 container mx-auto mb-0 md:mb-14">
          <div className=" shadow-lg md:shadow-none  rounded-lg">
            <div className="font-duplet-semi gap-4 grid grid-cols-1 lg:grid-cols-2   ">
              <Card
                shadow="sm"
                radius="sm"
                className="md:border md:border-[#E6E6E6]  px-3 md:px-6 pb-5  "
              >
                <div className=" font-duplet-semi  py-2 ">
                  <div className="text-base md:text-xl text-[#1A202C]">
                    Tracking Details
                  </div>
                </div>

                <div className="mt-3 md:mt-6">
                  <div className="flex gap-2 items-center">
                    <Icon
                      className="text-[#00B207] text-xl shadow-xl"
                      icon={"tabler:point-filled"}
                    />
                    <h1 className="text-lg md:text-xl font-duplet-semi">
                      Shipping
                    </h1>
                  </div>

                  <div className="flex justify-between items-center mt-4 md:mt-8 px-2 md:px-6">
                    <div>
                      <h3 className="text-xl font-medium">Location</h3>
                      <div className="text-base capitalize text-[#666666]">
                        Starex Supermarket
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">Date</h3>
                      <div className="text-base text-[#666666]">
                        20 July 2022
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">Time</h3>
                      <div className="text-base text-[#666666]">07.00 am</div>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex gap-2 items-center">
                    <Icon
                      className="text-[#00B207] text-xl shadow-xl"
                      icon={"tabler:point-filled"}
                    />
                    <h1 className="text-xl font-duplet-semi">
                      Billing Address
                    </h1>
                  </div>

                  <div className="flex flex-wrap justify-between items-center mt-4 md:mt-8 px-2 md:px-6">
                    <div>
                      <h3 className="text-xl font-medium">Location</h3>
                      <div className="text-base capitalize text-[#666666]">
                        <div className="font-duplet-reg">
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
                          {orderData?.address?.street}, <br />
                          {orderData?.address?.landmark},
                          {orderData?.address?.city},
                          {orderData?.address?.pincode}
                          <div>{orderData?.address?.phoneNumber}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">Date</h3>
                      <div className="text-base text-[#666666]">
                        20 July 2022
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">Time</h3>
                      <div className="text-base text-[#666666]">07.00 am</div>
                    </div>
                  </div>
                  <hr className="mt-8 text-[#C3D4E9]" />
                </div>

                <div className="mt-8 px-5 flex justify-between gap-4 items-center">
                  <div className="text-lg md:text-xl text-[#1A202C]">
                    Total Shopping Price
                    <p className="text-sm md:text-base text-[#666666]">
                      Overall price and includes Coupon Code offer
                    </p>
                  </div>
                  <div className="text-lg md:text-2xl font-bold text-[#1A202C]">
                    ₹{orderData?.total}
                  </div>
                </div>
              </Card>

              <Card
                shadow="sm"
                radius="sm"
                className="md:border md:border-[#E6E6E6] mt-5 md:mt-0 px-3 md:px-6 pb-5  "
              >
                <div className=" font-duplet-semi  py-2 ">
                  <div className="text-base md:text-xl text-[#1A202C] ">
                    Product Tracking
                  </div>
                </div>

                <div className=" flex items-center font-duplet-semi justify-between px-5 py-3 md:py-8 ">
                  <div className="text-base md:text-xl text-[#70737B] ">
                    Recipient
                  </div>
                  <div className="text-base md:text-xl text-[#70737B] ">
                    {formatPhone(phone)}
                  </div>
                </div>

                <div className=" flex items-center font-duplet-semi justify-between px-5 py-3 md:py-8 ">
                  <div className="text-base md:text-xl text-[#70737B] ">
                    Tracking ID:
                  </div>
                  <div className="text-base flex gap-2 items-center md:text-xl text-[#70737B] ">
                    <span>{orderData?.trackingNumber}</span>
                    <span>
                      <Icon
                        icon={"fa-regular:copy"}
                        className="cursor-pointer text-2xl"
                        onClick={() => copy(trackid.toString())}
                      />
                    </span>
                  </div>
                </div>

                <div className=" flex flex-wrap items-center   justify-between gap-3 px-5 py-3 md:py-8 ">
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
                      <div className="font-duplet-reg">
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
                        {orderData?.address?.street}, <br />
                        {orderData?.address?.landmark},
                        {orderData?.address?.city},{orderData?.address?.pincode}
                        <div>{orderData?.address?.phoneNumber}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" flex items-center font-duplet-semi justify-between px-5 py-3 md:py-8 ">
                  <div className="text-base md:text-xl text-[#BABFC5] ">
                    Est. Delivery
                  </div>
                  <div className="text-base md:text-xl font-duplet-reg text-[#70737B] ">
                    20 Jan 2024
                  </div>
                </div>

                <div className=" mt-4 px-10">
                  <div className="flex gap-4 items-center">
                    <div className="text-[#666666] text-center text-lg  font-duplet-semi">
                      20
                      <p>Sept</p>
                    </div>
                    <div>
                      <Icon
                        icon={"mdi:tick-circle"}
                        className="text-2xl md:text-3xl text-[#29BE10]"
                      />
                    </div>
                    <div>
                      <h1 className="font-duplet-semi text-[#29BE10] text-xl md:text-2xl">
                        Successfully Delivered
                      </h1>
                      <p className="flex flex-wrap font-duplet-reg text-sm md:text-xl text-[#666666]">
                        You parcel was delivered successfully by the delivery
                        man
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center mt-5">
                    <div className="text-[#666666] text-center text-lg  font-duplet-semi">
                      29
                      <p>Sept</p>
                    </div>
                    <div>
                      <Icon
                        icon={"mdi:tick-circle"}
                        className="text-2xl md:text-3xl text-[#454545]"
                      />
                    </div>
                    <div>
                      <h1 className="font-duplet-semi text-[#454545] text-xl md:text-2xl">
                        In-Transit
                      </h1>
                      <p className="flex flex-wrap font-duplet-reg text-sm md:text-xl text-[#666666]">
                        The package is now in transit. You will receive the
                        parcel shortly
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center mt-5">
                    <div className="text-[#666666] text-center text-lg  font-duplet-semi">
                      18
                      <p>Sept</p>
                    </div>
                    <div>
                      <Icon
                        icon={"mdi:tick-circle"}
                        className="text-2xl md:text-3xl text-[#454545]"
                      />
                    </div>
                    <div>
                      <h1 className="font-duplet-semi text-[#454545] text-xl md:text-2xl">
                        Pickup Confirmation
                      </h1>
                      <p className="flex flex-wrap font-duplet-reg text-sm md:text-xl text-[#666666]">
                        Our delivery man picked up the parcel from us
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center mt-5">
                    <div className="text-[#666666] text-center text-lg  font-duplet-semi">
                      17
                      <p>Sept</p>
                    </div>
                    <div>
                      <Icon
                        icon={"mdi:tick-circle"}
                        className="text-2xl md:text-3xl text-[#454545]"
                      />
                    </div>
                    <div>
                      <h1 className="font-duplet-semi text-[#454545] text-xl md:text-2xl">
                        Parcel Preparation
                      </h1>
                      <p className="flex flex-wrap font-duplet-reg text-sm md:text-xl text-[#666666]">
                        You parcel has been prepared and ready for pickup
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center mt-5">
                    <div className="text-[#666666] text-center text-lg  font-duplet-semi">
                      16
                      <p>Sept</p>
                    </div>
                    <div>
                      <Icon
                        icon={"mdi:tick-circle"}
                        className="text-2xl md:text-3xl text-[#454545]"
                      />
                    </div>
                    <div>
                      <h1 className="font-duplet-semi text-[#454545]  text-xl md:text-2xl">
                        Parcel Received
                      </h1>
                      <p className="flex flex-wrap font-duplet-reg text-sm md:text-xl text-[#666666]">
                        Your parcel has been received and in process of
                        preparing
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      )}
      <div className="hidden md:block">
        <Footer />
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </>
  );
}

export default OrderTracking;
