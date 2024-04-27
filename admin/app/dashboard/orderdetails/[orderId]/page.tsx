"use client";
import { axios } from "@/lib/axios";
import { config, formatePhone } from "@/lib/config";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";
import { CircularProgress } from "@nextui-org/progress";
import { Select, SelectItem } from "@nextui-org/select";
import moment from "moment";
import toast from "react-hot-toast";

export default function Orderdetails({ params }: any) {
  const [data, setData] = useState<any>([]);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [person, setPerson] = useState<string>("");
  const [persons, setPersons] = useState<any>([]);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${config.baseUrl}order?orderId=${params.orderId}`
      );
      console.log(response.data.data);

      setData(response.data.data);
      setStatus((response.data.data.status as string) || "");
    } catch (error) {
      console.log(error);
      setData({});
    } finally {
      setLoading(false);
    }
  };

  let statusEnums: any = {
    confirmed: "Confirmed",
    pickedup: "Picked Up",
    ontheWay: "On the Way",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  const updateStatus = async (newValue: string) => {
    console.log(newValue);
    console.log(data?.deliveryPerson === null && newValue !== "cancelled");
    if (data?.deliveryPerson === null && newValue !== "cancelled") {
      return toast.error("Please select delivery person");
    }
    try {
      if (status == newValue) return;

      const response = (await axios.put(
        `${config.baseUrl}order/trackorder?orderId=${params.orderId}&newStatus=${newValue}`
      )) as any;
      if (response.data.ok === true) {
        toast.success(response.data.message);
        setStatus(newValue);
      } else {
        console.log("error");
        setStatus(status);
      }
    } catch (error) {
      console.log(error);
    }
    fetchData();
  };

  const deliveryPerson = async () => {
    try {
      const response = await axios.get(
        `${config.baseUrl}deliveryperson/active`
      );
      if (response?.data?.ok === true) {
        setPersons(response?.data?.data);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const updateDeliveryPerson = async (newValue: string) => {
    console.log(newValue);
    try {
      const response = await axios.post(
        `${config.baseUrl}order/deliveryman?orderId=${params.orderId}&personId=${newValue}`
      );
      if (response.data.ok === true) {
        console.log("success", response);
        setPerson(response?.data?.data?.deliveryPerson?.name);
        toast.success(response.data.message);
        deliveryPerson();
        fetchData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
    deliveryPerson();
  }, []);

  function formatDate(time: any) {
    if (time !== null) {
      let formatedtime = moment(time).format("MMM Do YY hh:mm a");
      return formatedtime;
    }

    return "";
  }

  if (data?.status === "cancelled") {
    return (
      <div className='px-10 py-6'>
        <Button
          color='primary'
          isIconOnly
          onClick={() => window.history.back()}>
          <Icon icon='ic:round-arrow-back' className='cursor-pointer' />
        </Button>
        <div className='h-[70vh] w-full flex flex-col items-center justify-center space-y-4'>
          <h1 className='text-2xl text-red-600 font-bold'>Order Cancelled</h1>
          <p className=''>This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <div>
          <div className='h-[75vh] w-full bg-white flex justify-center items-center'>
            <CircularProgress label='Hang on...' />
          </div>
        </div>
      ) : (
        <>
          <div className='py-2 flex justify-between px-10'>
            <div className='flex items-center'>
              <Button
                color='primary'
                isIconOnly
                onClick={() => window.history.back()}>
                <Icon icon='ic:round-arrow-back' className='cursor-pointer ' />
              </Button>
              <h1 className='text-3xl px-5 mb-2'>Order Details</h1>
            </div>
            {data?.status === "delivered" ? null : (
              <>
                <div className='w-1/6'>
                  <Select
                    color='primary'
                    placeholder=' Delivery Person'
                    aria-label='Change Status'
                    label=' Delivery Person'
                    selectedKeys={[person]}
                    onChange={(keys: any) => {
                      updateDeliveryPerson(keys["target"]["value"]);
                    }}>
                    <SelectItem key=''>Select Status</SelectItem>
                    {persons?.map((person: any) => (
                      <SelectItem key={person?._id} value={person?._id}>
                        {person?.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className='w-1/6'>
                  <Select
                    color='primary'
                    placeholder='Change Status'
                    aria-label='Change Status'
                    selectedKeys={[status]}
                    label='Update Status'
                    onChange={(keys: any) => {
                      if (status == keys["target"]["value"]) return;

                      setStatus(keys["target"]["value"]);
                      updateStatus(keys["target"]["value"]);
                    }}>
                    <SelectItem key=''>Select Status</SelectItem>
                    <SelectItem key='confirmed' value='confirmed'>
                      Confirmed
                    </SelectItem>
                    <SelectItem key='pickedup' value='pickedup'>
                      Picked Up
                    </SelectItem>
                    <SelectItem key='ontheWay' value='ontheWay'>
                      On the Way
                    </SelectItem>
                    <SelectItem key='delivered' value='delivered'>
                      Delivered
                    </SelectItem>
                    <SelectItem key='cancelled' value='cancelled'>
                      Cancelled
                    </SelectItem>
                  </Select>
                </div>
              </>
            )}
          </div>

          {data?.status === "delivered" ? (
            <div className='flex justify-center'>
              <div className=''>
                <h1 className='text-2xl text-[#0EA829] font-bold text-center mb-4'>
                  This Order Delivered Successfully!
                </h1>
              </div>
            </div>
          ) : null}

          <div className='px-10 py-5'>
            <Card className='p-4'>
              <CardBody className='flex flex-col gap-3'>
                <div className='grid grid-cols-2 gap-2'>
                  <div className='flex items-center gap-2 text-lg'>
                    <div className='font-medium'>Order ID:</div>
                    <div className='text-gray-500 dark:text-gray-400'>
                      {data?.trackingNumber}
                    </div>
                  </div>
                  <div className='flex items-center gap-2 text-lg'>
                    <div className='font-medium'>Order Date:</div>
                    <div className='text-gray-500 dark:text-gray-400'>
                      {formatDate(data?.createdAt)}
                    </div>
                  </div>
                  <div className='flex items-center gap-2 text-lg'>
                    <div className='font-medium'>Name:</div>
                    <div className='text-gray-500 dark:text-gray-400'>
                      {data?.userId?.firstName}
                    </div>
                  </div>
                  <div className='flex items-center gap-2 text-lg'>
                    <div className='font-medium'>Total Price:</div>
                    <div className='text-gray-500 dark:text-gray-400'>
                      ₹ {data?.total?.toFixed(0) || "N/A"}
                    </div>
                  </div>

                  <div className='flex items-center gap-2 text-lg'>
                    <div className='font-medium'>Phone:</div>
                    <div className='text-gray-500 dark:text-gray-400'>
                      +91 {data?.userId?.phoneNumber || "N/A"}
                    </div>
                  </div>
                  <div className='flex items-center gap-2 text-lg'>
                    <div className='font-medium'>Email:</div>
                    <div className='text-gray-500 dark:text-gray-400'>
                      {data?.userId?.email || "N/A"}
                    </div>
                  </div>
                  <div className='flex items-center gap-2 text-lg'>
                    <div className='font-medium'>Order Status:</div>
                    <div className='text-gray-500 capitalize dark:text-gray-400'>
                      {/* {statusEnums[status] || "N/A"} */}
                      {data?.status || "N/A"}
                    </div>
                  </div>
                  <div className='flex items-center gap-2 text-lg'>
                    <div className='font-medium'>Delivery Person:</div>
                    <div className='text-gray-500 dark:text-gray-400'>
                      {data?.deliveryPerson?.name || "N/A"}
                    </div>
                  </div>
                </div>
              </CardBody>
              <CardFooter className='flex flex-col'>
                <span className='text-lg'> Billing Address</span>
                <address>{data?.address?.mapAddress}</address>
              </CardFooter>
            </Card>

            <div className='mt-10'>
              <Table
                isHeaderSticky
                className='stickytable'
                aria-label='products table'
                isStriped>
                <TableHeader>
                  <TableColumn className='bg-[#6366f1] uppercase text-[15px] text-white'>
                    PRODUCT
                  </TableColumn>
                  <TableColumn className='bg-[#6366f1] uppercase  text-[15px] text-white'>
                    price (per kg)
                  </TableColumn>
                  <TableColumn className='bg-[#6366f1] uppercase text-[15px] text-white'>
                    quantity
                  </TableColumn>
                  <TableColumn className='bg-[#6366f1] uppercase text-[15px] text-white'>
                    total
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {data &&
                    data?.orderSummary &&
                    data?.orderSummary.map((product: any) => {
                      return (
                        <TableRow key={product._id?._id}>
                          <TableCell
                            className='text-base'
                            style={{
                              textTransform: "capitalize",
                            }}>
                            {product?._id?.productName}
                          </TableCell>
                          <TableCell className='text-base'>
                            {product?.price?.toFixed(0) + " ₹"}
                          </TableCell>
                          <TableCell className='text-base'>
                            {product?.quantity + " kg"}
                          </TableCell>
                          <TableCell className='text-base'>
                            {product?.price?.toFixed(0) + " ₹"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>

              <div className='w-[95%] m-auto overflow-hidden'>
                <div className='flex text-xl justify-end mx-[14%] mt-8'>
                  Total Price : {data?.total?.toFixed(0)} ₹
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
