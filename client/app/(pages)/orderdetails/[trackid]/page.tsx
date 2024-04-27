"use client";
import React, { useEffect, useState } from "react";
import { Navebar } from "@/app/components/Home/Navbar/Navebar";
import { Icon } from "@iconify/react";
import Image from "next/image";
import user from "@/public/images/user.png";
import { Card } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import onion from "@/public/images/flyingfruits.png";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { axios } from "@/lib/axios";
import { Chip } from "@nextui-org/chip";
import { config, formateDateandTime, formatePhone } from "@/lib/config";
import { ImageWithFallback } from "@/app/components/ImageWithFallback";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

export default function Orderdetails({ params }: any) {
  const [orderdetails, setOrderdetails] = useState<any>([]);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `order/getorderdetails?trackingNumber=${params.trackid}`
      );
      console.log(response.data.data, "edfefd3");
      if (response.data.ok === true) {
        setOrderdetails(response.data.data);
      } else {
        setOrderdetails([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const router = useRouter();
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <section className='bg-[#1A3824]'>
        <Navebar />
      </section>

      <main className=' px-2 md:px-10 container mx-auto mt-10 mb-10'>
        <div className='p-2'>
          <Button
            onClick={() => router.back()}
            className='bg-[#00B207]'
            isIconOnly
          >
            <Icon className='text-xl text-white' icon='ic:round-arrow-back' />
          </Button>
        </div>
        <div className=' shadow-lg md:shadow-none border rounded-lg'>
          <div className=' font-duplet-semi border-b px-2 gap-1 md:px-10 py-4 flex justify-between'>
            <div className='text-base md:text-xl '>
              Order Details &nbsp; &nbsp;
              <span className='text-base text-date font-duplet-reg'>
                {formateDateandTime(orderdetails?.order?.createdAt)}
              </span>
              &nbsp; &nbsp;
            </div>
            <div className='text-base md:text-xl text-bacto'>Back to List</div>
          </div>
          <div className='font-duplet-semi gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3   px-2 g md:px-10 py-8'>
            <Card shadow='sm' radius='sm' className='border border-[#E6E6E6]'>
              <div className=''>
                <div className=' py-5 px-5 font-poppins border-b text-cardhead font-medium text-base md:text-lg uppercase  '>
                  <h1>Shipping Address</h1>
                </div>
                <div className='px-6 pb-4'>
                  {/* <div className=' mt-4 font-duplet-reg font-normal text-header text-xl  md:text-2xl'>
                    <h1> Starex Supermarket </h1>
                  </div> */}
                  <div className=' mt-3 font-duplet-reg  text-subtext text-base md:text-lg'>
                    <h1>{orderdetails?.order?.from}</h1>
                  </div>
                  <div className='mt-11 '>
                    <h5 className='uppercase font-duplet-semi text-cardhead text-base md:text-lg'>
                      Email
                    </h5>
                    <h1 className='font-duplet-reg text-header text-base md:text-xl'>
                      {orderdetails?.details?.email}
                    </h1>
                  </div>
                  <div className='mt-3 '>
                    <h5 className='uppercase font-duplet-semi text-cardhead text-base md:text-lg'>
                      Phone
                    </h5>
                    <h1 className='font-duplet-reg text-header text-base md:text-xl'>
                      {orderdetails?.details?.phoneNumber}
                    </h1>
                  </div>
                </div>
              </div>
            </Card>
            <Card shadow='sm' radius='sm' className='border border-[#E6E6E6]'>
              <div className=''>
                <div className=' py-5 px-5 font-poppins border-b text-cardhead font-medium text-base md:text-lg uppercase  '>
                  <h1>Billing Address</h1>
                </div>
                <div className='px-6 pb-4'>
                  <div className=' mt-4 font-duplet-semi font-normal capitalize text-header text-xl  md:text-2xl'>
                    <h1> {orderdetails?.order?.address?.name} </h1>
                  </div>
                  <div className=' mt-3 font-duplet-reg  text-subtext text-base md:text-lg'>
                    <div className='capitalize font-duplet-reg'>
                      {orderdetails?.order?.address?.mapAddress !== "" ? (
                        <div>
                          <address>
                            {orderdetails?.order?.address?.mapAddress}
                          </address>
                        </div>
                      ) : (
                        <div>
                          <div className='flex gap-3 flex-wrap'>
                            <span className='text-lg font-duplet-reg capitalize'>
                              Address Type
                            </span>
                            <Chip
                              radius='sm'
                              className='bg-[#0EA829] capitalize text-white'
                            >
                              {orderdetails?.order?.address?.addressType}
                            </Chip>
                          </div>
                          {orderdetails?.order?.address?.houseNo},
                          {orderdetails?.order?.address?.street},
                          {orderdetails?.order?.address?.landmark},
                          {orderdetails?.order?.address?.city},
                          {orderdetails?.order?.address?.pincode}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='mt-11 '>
                    <h5 className='uppercase font-duplet-semi text-cardhead text-base md:text-lg'>
                      Email
                    </h5>
                    <h1 className='font-duplet-reg text-header text-base md:text-xl'>
                      {orderdetails?.order?.userId?.email}
                    </h1>
                  </div>
                  <div className='mt-3 '>
                    <h5 className='uppercase font-duplet-semi text-cardhead text-base md:text-lg'>
                      Phone
                    </h5>
                    <h1 className='font-duplet-reg text-header text-base md:text-xl'>
                      {orderdetails?.order?.userId?.phoneNumber}
                    </h1>
                  </div>
                </div>
              </div>
            </Card>
            <Card shadow='sm' radius='sm' className='border border-[#E6E6E6]'>
              <div className=''>
                <div className=' py-8 px-2 md:px-8 font-poppins border-b text-cardhead font-medium text-base    '>
                  <div className='flex h-5 justify-between items-center space-x-4 '>
                    <div>
                      <div className='font-duplet-reg text-cardhead uppercase text-base '>
                        Tracking ID :
                      </div>
                      <div className='text-header font-duplet-reg text-base '>
                        {orderdetails?.order?.trackingNumber}
                      </div>
                    </div>
                    <Divider orientation='vertical' />
                    <div>
                      <div className='font-duplet-reg text-cardhead uppercase text-base'>
                        Payment :
                      </div>
                      <div className='text-header font-duplet-reg text-base '>
                        {orderdetails?.order?.paymentMethod}
                      </div>
                    </div>
                  </div>
                </div>
                <div className=' px-2 md:px-6 pb-4'>
                  <div className=' mt-5 font-duplet-reg border-b border-[#E6E6E6] font-normal  '>
                    <div className='flex justify-between pb-4'>
                      <h1 className='text-subtext text-lg font-duplet-reg'>
                        Subtotal
                      </h1>
                      <h4 className='text-header font-duplet-semi text-lg'>
                        ₹ {orderdetails.order?.total?.toFixed(0)}.00
                      </h4>
                    </div>
                  </div>
                  <div className=' mt-5 font-duplet-reg border-b border-[#E6E6E6] font-normal  '>
                    <div className='flex justify-between pb-4'>
                      <h1 className='text-subtext text-lg font-duplet-reg'>
                        Discount
                      </h1>
                      <h4 className='text-header font-duplet-semi text-lg'>
                        0%
                      </h4>
                    </div>
                  </div>
                  <div className=' mt-5 font-duplet-reg border-b border-[#E6E6E6] font-normal  '>
                    <div className='flex justify-between pb-4'>
                      <h1 className='text-subtext text-lg font-duplet-reg'>
                        Shipping
                      </h1>
                      <h4 className='text-header font-duplet-semi text-lg'>
                        Free
                      </h4>
                    </div>
                  </div>
                  <div className=' mt-5 font-duplet-reg   font-normal  '>
                    <div className='flex justify-between pb-4'>
                      <h1 className='text-xl text-header font-duplet-semi'>
                        Total
                      </h1>
                      <h4 className='text-xl text-[#2C742F] font-duplet-semi'>
                        ₹ {orderdetails?.order?.total?.toFixed(0)}.00
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className=' px-2 g md:px-10 py-8'>
            <Table aria-label=' table'>
              <TableHeader>
                <TableColumn className='uppercase  font-duplet-reg text-date'>
                  Product
                </TableColumn>
                <TableColumn className='uppercase  font-duplet-reg text-date'>
                  Price
                </TableColumn>
                <TableColumn className='uppercase  font-duplet-reg text-date'>
                  Quantity
                </TableColumn>
                <TableColumn className='uppercase  font-duplet-reg text-date'>
                  Subtotal
                </TableColumn>
              </TableHeader>

              {orderdetails?.order?.orderSummary?.length > 0 ? (
                <TableBody key={orderdetails?.order?._id}>
                  {orderdetails?.order?.orderSummary?.map((product: any) =>
                    product && product._id ? (
                      <TableRow
                        key={product?._id._id}
                        className=' border-b capitalize text-header font-duplet-semi'
                      >
                        <TableCell
                          width={"100%"}
                          className='flex gap-2 flex-wrap items-center   text-sm md:text-lg '
                        >
                          <Image
                            alt=''
                            src={`${config.baseUrl}files/view?image=${product?._id?.image}`}
                            width={100}
                            height={100}
                            className='w-[70px] h-[70px] md:w-[100px] md:h-[100px] object-cover'
                          />
                          {product?._id?.productName}
                        </TableCell>
                        <TableCell className='text-sm md:text-lg'>
                          ₹ {product?.price?.toFixed(0)}.00
                        </TableCell>
                        <TableCell className=' text-sm md:text-lg'>
                          {product?.quantity}
                        </TableCell>
                        <TableCell className=' text-sm md:text-lg'>
                          ₹ {product?.price.toFixed(0)}.00
                        </TableCell>
                      </TableRow>
                    ) : (
                      <></>
                    )
                  )}
                </TableBody>
              ) : (
                <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
              )}
            </Table>
          </div>
        </div>
      </main>
    </>
  );
}
