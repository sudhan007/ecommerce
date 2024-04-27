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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { axios } from "@/lib/axios";
import { BotIcon, MapPinIcon, MapPin, Phone } from "lucide-react";
import React, { useEffect, useState } from "react";
import Loading from "./loading";
import { formateDateandTime, formatePhone } from "@/lib/config";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : {};
  const { _id } = user;

  const [data, setData] = useState<any>();
  const router = useRouter();
  const fetchData = async () => {
    try {
      const response = await axios.get(`deliveryperson/getorder?id=${_id}`);
      console.log(response.data.data, "data");
      setData(response.data.data);
    } catch (error) {
      console.log(error);
      setData({});
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [currLocation, setCurrLocation] = useState<any>([]);
  const ordersToDeliver = [
    {
      id: 1,
      name: "John",
      phone: "1234567890",
      address: "123 Main St",
      status: "Pending",
      desc: "Card Description",
      location: [10.018883703140164, 77.84653439075116],
    },
    {
      id: 2,
      name: "Jane",
      phone: "1234567890",
      address: "Kattayan Vilailai,",
      status: "Pending",
      desc: "Card Description",
      location: [8.189375353546309, 77.41052308301421],
    },
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            window.location.href = "chrome://settings/content/location";
          } else {
            alert("Error fetching location: " + error.message);
          }
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  const openMap = (destinationLocation: any) => {
    if (!destinationLocation) return;

    const destLat = destinationLocation[0];
    const destLng = destinationLocation[1];

    let url;
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      url = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;
    }

    window.open(url, "_blank");
  };

  const handleComplete = async () => {
    console.log("complete");
    console.log(_id, "wduiwugd", data?.[0]?._id);
    try {
      const response = await axios.post(
        `deliveryperson/finish?id=${_id}&orderId=${data?.[0]?._id}`
      );
      console.log(response);
      if (response?.data?.ok === true) {
        console.log(response?.data?.data);
        toast(`${response?.data?.message}`, {
          closeButton: true,
          duration: 3000,
          icon: "👏",
          position: "top-center",
        });
        fetchData();
      }
    } catch (error: any) {
      toast(`${error?.response?.data?.message}`, {
        closeButton: true,
        duration: 3000,
        position: "top-center",
      });
      console.log(error);
    }
  };

  return (
    <div>
      {!data ? (
        <Loading />
      ) : data?.length > 0 ? (
        <div className='px-2 my-4 min-h-screen pb-12'>
          <Card>
            <div className='p-2 text-xl text-center'>Delivery Details</div>

            <div className='px-2'>
              <div className='flex justify-between items-center flex-wrap-reverse'>
                <div className='text-lg  flex-wrap'>
                  {data?.[0]?.userId?.firstName}
                </div>
                <Badge
                  className='bg-gray-800 hover:bg-gray-800 font-normal'
                  variant='destructive'
                >
                  {data?.[0]?.trackingNumber}
                </Badge>
              </div>
              <div>
                <address className='text-sm mt-2'>
                  {data?.[0]?.address?.mapAddress}
                </address>
              </div>
              <div className='mt-1 flex items-center justify-between pb-1'>
                <div>
                  <p className='text-lg'>
                    {formatePhone(data?.[0]?.userId?.phoneNumber)}
                  </p>
                </div>

                <Button
                  variant='outline'
                  className='bg-[#0EA829] text-white rounded-full hover:bg-[#0EA829] hover:text-white'
                  size='icon'
                >
                  <a href={`tel:+${data?.[0]?.userId?.phoneNumber}`}>
                    <Phone />
                  </a>
                </Button>
              </div>
              <div className='text-sm'>
                <div>{formateDateandTime(data?.[0]?.createdAt)}</div>
              </div>
              <div className='flex justify-center mt-2 mb-2'>
                <Button
                  variant='outline'
                  className='bg-[#FB8C00] hover:bg-[#FB8C00] text-white rounded-full  hover:text-white'
                  size='default'
                  onClick={() => {
                    const latitude = data?.[0]?.address?.latitude;
                    const longitude = data?.[0]?.address?.longitude;
                    if (latitude !== undefined && longitude !== undefined) {
                      openMap([latitude, longitude]);
                    } else {
                      console.error("Latitude or longitude is undefined.");
                    }
                  }}
                >
                  Location
                </Button>
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
                    <TableHead>Price₹</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className='text-right'>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.[0]?.orderSummary?.map((item: any, index: any) => (
                    <TableRow key={index}>
                      <TableCell className='font-medium'>
                        {item?._id?.productName}
                      </TableCell>
                      <TableCell> {item?.price?.toFixed(0)}</TableCell>
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
                      ₹{data?.[0]?.total?.toFixed(0)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </Card>
          <div className='mt-3'>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className='w-full bg-[#0EA829] text-white hover:bg-[#0EA829] '>
                  Order Completed
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Order Completion</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to mark this order as completed? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className='bg-[#0EA829] text-white hover:bg-[#0EA829]'
                    onClick={() => handleComplete()}
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ) : (
        <>
          <div className='h-[72vh] flex flex-col justify-center items-center'>
            <h1 className='text-center'>You don't have any order</h1>
            <Button
              onClick={() => window.location.reload()}
              variant='outline'
              className='mt-4 bg-[#0EA829] text-white rounded-full hover:bg-[#0EA829] hover:text-white'
            >
              Reload
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
