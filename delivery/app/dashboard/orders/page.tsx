"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReceiptText } from "lucide-react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import Loading from "../loading";
import { formateDateandTime } from "@/lib/config";
import { useRouter } from "next/navigation";
const Orders = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : {};

  const { _id } = user;
  const router = useRouter();
  const {
    data: orders,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      let res = await axios.get(`deliveryperson/completedorders?id=${_id}`);
      console.log(res?.data?.data?.orderHistory, "data");
      return res?.data?.data?.orderHistory;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className='text-red-600 flex h-[75vh] justify-center items-center'>
        Something went wrong
      </div>
    );
  }

  if (orders?.length === 0) {
    return (
      <div className='text-red-600 flex h-[75vh] justify-center items-center'>
        No Orders Found
      </div>
    );
  }

  return (
    <>
      <div className='px-2 my-2 pb-4'>
        <div className='text-lg flex justify-center'>
          <h1 className='capitalize text-gray-800'>Order History</h1>
        </div>
        <div className='px-2 my-7 min-h-[80vh]'>
          {orders?.map((item: any) => (
            <Card key={item?._id} className='p-2 mt-2'>
              <div className='flex justify-between   items-center'>
                <Badge className='bg-[#0EA829] hover:bg-[#0EA829] font-normal text-white'>
                  {item?.trackingNumber}
                </Badge>
                <h6 className=' text-base  '>₹{item?.total?.toFixed(0)}</h6>
              </div>
              <div className='flex justify-between mt-3  items-center'>
                <h3 className='text-gray-800 text-sm '>
                  ({item.orderSummary.length}
                  &nbsp; {item.orderSummary.length > 1 ? "Products" : "Product"}
                  ) &nbsp; | &nbsp;
                  {formateDateandTime(item?.createdAt)}
                </h3>
              </div>
              <div className='mt-2 flex justify-center '>
                <Button
                  className='text-xs text-[#00B207] hover:text-[#00B207]  outline-none'
                  variant={"outline"}
                  size={"icon"}
                  onClick={() => router.push(`/dashboard/orders/${item?._id}`)}
                >
                  <ReceiptText />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Orders;
