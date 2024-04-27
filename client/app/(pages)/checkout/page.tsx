"use client";
import Image from "next/image";
import offer from "@/public/images/bestdeals.png";
import { Card } from "@nextui-org/card";
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { Navebar } from "@/app/components/Home/Navbar/Navebar";
import { useCartStore } from "@/stores/CartStore";
import onion from "@/public/images/Maps.png";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { config } from "@/lib/config";
import Address from "@/app/components/Address/Address";
import { useAddressStore } from "@/stores/AddressStore";
import toast, { Toaster } from "react-hot-toast";
import { axios } from "@/lib/axios";
import { useUserStore } from "@/stores/UserStore";
import { useOrderTrackStore } from "@/stores/OrderTrackStore";
import { useRouter } from "next/navigation";
import { ImageWithFallback } from "@/app/components/ImageWithFallback";
export default function Checkout() {
  const { products, totalPrice } = useCartStore();

  const router = useRouter();

  const address = useAddressStore((state: any) => state.address);
  const [selectpayment, setselectpayment] = useState("");
  const userid = useUserStore((state: any) => state.user._id);

  const handleCheckout = async () => {
    try {
      if (Object.keys(address).length === 0) {
        toast.error("Please select address");
        console.log("Please select address");
      } else if (selectpayment === "") {
        toast.error("Please select payment");
        console.log("Please select payment");
      } else {
        const response = await axios.post(`${config.baseUrl}order/add`, {
          userId: userid,
          address: address._id,
          paymentMethod: selectpayment,
        });
        if (response.data.ok === true) {
          console.log(response.data.data, "tracking Id");
          useAddressStore.setState({ address: {} });
          useOrderTrackStore.setState({ orderTracking: response.data.data });
          toast.success("Order placed successfully");
          router.push("/ordersuccess");
        }
      }
    } catch (error) {
      console.log(error);
    }
    console.log(address._id);
  };

  return (
    <>
      <section className='bg-[#1A3824]'>
        <Navebar />
      </section>

      <div className=' hidden md:block px-20 bg-black '>
        <div className='flex justify-between py-2 items-center'>
          <div>
            <h1 className='text-3xl font-duplet-semi text-[#FFFFFF]'>
              Fruits Combo
            </h1>
            <h1 className='text-[#838383] text-lg font-duplet-semi '>
              Only Fruits and Vegetables
            </h1>
          </div>
          <h1>
            <Image
              src={offer}
              className='w-44'
              style={{ objectFit: "contain" }}
              alt=''
            />
          </h1>
        </div>
      </div>

      <div className=' px-4 md:px-10  md:mt-8 mb-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1 md:gap-8'>
          <div className='col-span-2 mt-10'>
            <Address />
            <Card shadow='sm' radius='sm' className='mt-5'>
              <div className=' px-4 md:px-10 mt-5'>
                <h2 className='text-xl text-[#1A202C] font-duplet-reg  '>
                  Additonal Info
                </h2>
                <p className='text-sm text-[#90A3BF] font-duplet-semi '>
                  Please enter your billing info
                </p>
              </div>

              <div className='mt-3 mb-8'>
                <form action=''>
                  <div className='w-full px-3 md:px-10'>
                    <h2 className='text-xl text-[#1A202C] mb-3 font-duplet-reg  '>
                      Order Notes ( Optional)
                    </h2>
                    <Textarea
                      placeholder='Enter your Address'
                      maxRows={10}
                      style={{
                        width: "100%",
                        outline: "none",
                        fontSize: "20px",
                        fontFamily: "duplet-semibold",
                        borderColor: "#E6E6E6",
                        padding: "2px",
                      }}
                    />
                  </div>
                </form>
              </div>
            </Card>
          </div>

          <Card shadow='sm' radius='sm' className=' mt-10 px-0 md:px-5 py-5'>
            <h2 className='text-xl text-[#1A202C] font-duplet-semi  '>
              Order Summary
            </h2>
            <div className='py-3 h-72 overflow-scroll'>
              {products.map((product: any) => {
                return (
                  <div
                    key={product?._id}
                    className='px-6 items-center  justify-between flex  py-2'>
                    <div>
                      {/* <Image
                        alt=''
                        src={onion}
                        className='w-[70px] h-[70px] md:w-[100px] md:h-[100px] object-cover'
                      /> */}
                      <ImageWithFallback
                        alt='product image'
                        fallbackSrc='/images/vegetables.png'
                        style={{
                          objectFit: "contain",
                          width: "100px",
                          height: "100px",
                        }}
                        className='w-[70px] h-[70px] md:w-[100px] md:h-[100px] object-cover'
                        src={
                          config.baseUrl + `files/view?image=${product?.image}`
                        }
                        // src='/images/vegetables.png'
                        width={200}
                        height={200}
                      />
                    </div>
                    <div>
                      <div className='font-duplet-reg capitalize text-header text-lg  '>
                        {product?.productName}
                        <span className='lowercase'> x</span>{" "}
                        {product?.quantity} Kg
                      </div>
                    </div>
                    <div className='font-duplet-semi text-lg'>
                      ₹{product?.price?.toFixed(0)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* <div className="py-3 px-2 md:px-10 ">
              <div className="flex gap-2 justify-between px-3 items-center bg-[#313131] ">
                <div>
                  <Input
                    placeholder="Enter promo code"
                    className="w-full p-0 text-white"
                    variant="underlined"
                    style={{ color: "white" }}
                  />
                </div>
                <div>
                  <span className="text-base text-white font-duplet-semi">
                    Apply now
                  </span>
                </div>
              </div>
            </div> */}

            <div className='py-3 px-2 md:px-10'>
              <div className='flex justify-between mb-5'>
                <div className='font-duplet-reg text-base'>
                  Delivery Charges
                </div>
                <div className='font-duplet-semi text-lg'>Free</div>
              </div>
              <div className='flex justify-between mb-5'>
                <div className='font-duplet-reg text-base'>Total</div>
                <div className='font-duplet-semi text-lg'>
                  ₹ {totalPrice?.toFixed(0)}{" "}
                </div>
              </div>
            </div>

            <div className='mt-6 px-3 md:px-10'>
              <h2 className='text-xl text-[#1A1A1A] font-duplet-reg  '>
                Payment Method
              </h2>
              <div className='mt-4'>
                <RadioGroup onValueChange={setselectpayment} color='success'>
                  <Radio
                    defaultChecked={true}
                    value='Cash on Delivery'
                    className='font-duplet-semi'>
                    Cash on Delivery
                  </Radio>
                </RadioGroup>
              </div>
            </div>

            <div className='px-3 md:px-10 py-3'>
              <div className='w-full'>
                <div className='mt-5 text-lg '>
                  <Button
                    size='lg'
                    onClick={() => handleCheckout()}
                    radius='sm'
                    className='mb-2 font-poppins  font-bold bg-checkbtn text-[#FFFFFF] w-full'>
                    Checkout
                  </Button>
                </div>
              </div>
              <div className='w-full'>
                <div className='mt-1 text-lg '>
                  <Button
                    size='lg'
                    radius='sm'
                    className='mb-2 font-poppins  font-bold bg-green-100 text-checkbtn w-full'>
                    Go To Cart
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Toaster
        position='top-center'
        toastOptions={{ duration: 3000 }}
        reverseOrder={false}
      />
    </>
  );
}
