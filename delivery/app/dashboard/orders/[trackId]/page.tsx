"use client";
import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import Loading from "../../loading";
import {
  TableCell,
  Table,
  TableBody,
  TableCaption,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formateDateandTime, formatePhone } from "@/lib/config";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const page = ({ params }: { params: { trackId: string } }) => {
  const router = useRouter();
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["orderDetails"],
    queryFn: async () => {
      const res = await axios.get(`order?orderId=${params.trackId}`);
      console.log(res.data.data, "res");
      return res?.data?.data;
    },
  });

  // if (isLoading) {
  //   return <Loading />;
  // }

  if (isError) {
    return (
      <div className='text-red-600 flex h-[75vh] justify-center items-center'>
        Something went wrong
      </div>
    );
  }

  return (
    <>
      <div>
        <div className='px-2  py-2'>
          <Button
            className='text-xs text-[#00B207] hover:text-[#00B207]  outline-none'
            variant={"outline"}
            size={"icon"}
            onClick={() => router.back()}
          >
            <ArrowLeft />
          </Button>
        </div>
        <div className='px-2 '>
          <Card>
            <div className='p-2 text-xl text-center'>Order Details</div>

            <div className='px-2'>
              <div className='flex justify-between items-center flex-wrap-reverse'>
                <div className='text-lg  flex-wrap'>
                  {data?.userId?.firstName}
                </div>
                <Badge
                  className='bg-gray-800 hover:bg-gray-800 font-normal'
                  variant='destructive'
                >
                  {data?.trackingNumber}
                </Badge>
              </div>
              <div>
                <address className='text-sm mt-2'>
                  {data?.address?.mapAddress}
                </address>
              </div>
              <div className='mt-1 flex items-center justify-between pb-1'>
                <div>
                  <p className='text-lg'>
                    {formatePhone(data?.userId?.phoneNumber)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
          <Card className='mt-2'>
            <div>
              <Table>
                <TableCaption className='uppercase'>Order Summary</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[100px]'>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className='text-right'>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.orderSummary?.map((item: any, index: any) => (
                    <TableRow key={index}>
                      <TableCell className='font-medium'>
                        {item?._id?.productName}
                      </TableCell>
                      <TableCell> {item?.price?.toFixed(0) + " ₹"}</TableCell>
                      <TableCell> {item?.quantity + " kg"}</TableCell>
                      <TableCell className='text-right'>
                        {item?.price?.toFixed(0) * item?.quantity + " ₹"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className='text-right'>
                      ₹{data?.total?.toFixed(0)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default page;
