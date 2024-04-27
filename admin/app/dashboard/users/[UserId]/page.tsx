"use client";
import { axios } from "@/lib/axios";
import { Card } from "@nextui-org/card";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { useEffect, useState } from "react";

import { config } from "@/lib/config";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";
import { CircularProgress } from "@nextui-org/progress";

export default function Orderdetails({ params }: any) {
  const [data, setData] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${config.baseUrl}order/getorder?userId=${params.UserId}`
      );
      if (response.data.ok === true) {
        setData(response.data.data);
        setGrandTotal(response.data.grandTotal);
      }
    } catch (error) {
      console.log(error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="p-5">
        <div className="flex items-center mb-5">
          <Button
            color="primary"
            isIconOnly
            onClick={() => window.history.back()}
          >
            <Icon icon="ic:round-arrow-back" className="cursor-pointer " />
          </Button>
          <h1 className="text-3xl px-5 mb-2">Order Details</h1>
        </div>
        <Card className="bg-[#FFF5E1] text-black w-full md:w-[300px] p-5 border rounded-xl shadow-md hover:shadow-lg">
          <div className="flex gap-3 items-center">
            <Icon className="text-3xl" icon={"raphael:dollar"} />
            <h1 className="text-xl">Total Amount </h1>
          </div>
          <span className="capitalize text-xs mt-0.5">
            total purchase of the user
          </span>
          <div className="mt-5">
            <div className="text-4xl text-center">{grandTotal}.00</div>
          </div>
        </Card>
        <div className="mt-10">
          {data ? (
            data.length > 0 ? (
              <Table
                isHeaderSticky
                className="stickytable"
                aria-label="products table"
                isStriped
              >
                <TableHeader>
                  <TableColumn className="bg-[#6366f1] uppercase text-[15px] text-white">
                    Name
                  </TableColumn>
                  <TableColumn className="bg-[#6366f1] uppercase  text-[15px] text-white">
                    Mobile
                  </TableColumn>
                  <TableColumn className="bg-[#6366f1] uppercase text-[15px] text-white">
                    Status
                  </TableColumn>
                  <TableColumn className="bg-[#6366f1] uppercase text-[15px] text-white">
                    Amount
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {data.map((item: any) => {
                    return (
                      <TableRow key={item?.orderId}>
                        <TableCell className="capitalize">
                          {item?.firstName}
                        </TableCell>
                        <TableCell>{item?.phoneNumber}</TableCell>
                        <TableCell
                          className={`${
                            item?.status === "delivered" ? "text-green-500" : ""
                          } ${
                            item?.status === "cancelled" ? "text-red-500" : ""
                          } capitalize`}
                        >
                          {item?.status}
                        </TableCell>
                        <TableCell className="text-black">
                          {item?.totalAmount}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="flex justify-center  text-red-600 text-2xl ">
                No data
              </div>
            )
          ) : (
            <div className="flex justify-center  ">
              <CircularProgress size="lg" color="success" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
