"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Navebar } from "../../components/Home/Navbar/Navebar";
import { Card } from "@nextui-org/card";
import { Icon } from "@iconify/react";
import { Spinner } from "@nextui-org/spinner";
import user from "@/public/images/user.jpg";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Button } from "@nextui-org/button";
import useSWR, { mutate } from "swr";
import { Pagination } from "@nextui-org/pagination";
import moment from "moment";
import { useRouter } from "next/navigation";
import axios from "axios";
import { config, formatePhone, statusEnums } from "@/lib/config";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { useUserStore } from "@/stores/UserStore";
import { ZLoading } from "@/app/components/zloading";

export default function UserAccount() {
  let [datas, setDatas] = useState<any>();
  let [isDataLoading, setDataLoading] = useState<boolean>(true);

  const {
    user: { _id, phone },
  } = useUserStore();
  function formatDate(time: any) {
    if (time !== null) {
      let formatedtime = moment(time).format("MMM Do YY hh:mm a");
      return formatedtime;
    }

    return "";
  }
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();

  const [isMobileView, setIsMobileView] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 800 : false
  );

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobileView(window.innerWidth <= 768);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isMobileView]);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    try {
      const response = await axios.get(
        `${config.baseUrl}user/minimal?userId=${_id}`
      );
      if (response.data.ok === true) {
        setDatas(response?.data?.data);
        setDataLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const rowsPerPage = 10;
  const fetcher = (...args: any) =>
    fetch(args).then((res) => {
      return res.json();
    });
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSWR(
    `${config.baseUrl}order/getorder?userId=${_id}&page=${page}&limit=${rowsPerPage}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const pages = useMemo(() => {
    return data?.count ? Math.ceil(data.count / rowsPerPage) : 0;
  }, [data?.count, rowsPerPage]);

  const loadingState =
    isLoading || data?.data?.length === 0 ? "loading" : "idle";
  const noData = data?.data?.length === 0 ? false : true;

  let Logout = () => {
    localStorage.clear();
    router.push("/");
  };

  console.log(data?.data?.[0]?.status);

  const quickLinks = [
    {
      title: "Profile Settings",
      link: "/edit",
    },

    {
      title: "Address Management",
      link: "/address",
    },
    {
      title: "Terms & Conditions",
      link: "/profile",
    },

    {
      title: "Privacy Policy",
      link: "/profile",
    },
    {
      title: "FAQ's",
      link: "/profile",
    },
  ];

  return (
    <>
      <section className='bg-[#1A3824]'>
        {isDataLoading ? <ZLoading /> : <></>}
        <Navebar />
      </section>
      <main className='  px-2 md:px-10 container mx-auto mt-10 mb-10'>
        <div className=' shadow-lg md:shadow-none border rounded-lg'>
          <div className=' font-duplet-semi  px-2  md:px-10 py-4 '>
            <div className='text-base md:text-2xl '>Account Settings</div>
          </div>

          <div className='font-duplet-semi gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3   px-2 g md:px-10 py-4'>
            <Card shadow='sm' radius='sm' className='border border-[#E6E6E6]'>
              <div className='mt-10 mb-10'>
                <div className='rounded-full flex justify-center '>
                  <img
                    style={{ objectFit: "cover" }}
                    src={datas?.image ? datas?.image : user}
                    alt=''
                    className='rounded-full h-40 w-40  lg:h-36 lg:w-36'
                  />
                </div>
                <div className='flex justify-center mt-4 font-duplet-semi text-[#1A1A1A] text-xl md:text-2xl'>
                  <h1>{datas?.firstName}</h1>
                </div>
              </div>
            </Card>
            <Card shadow='sm' radius='sm' className='border border-[#E6E6E6]'>
              <div className='mt-8 mb-8 px-3  md:px-10'>
                <div className=' font-duplet-semi text-[#999999] text-base md:text-lg uppercase  '>
                  <h1>Personal Info</h1>
                </div>
                <div className='flex gap-2 items-center mt-4 font-duplet-semi text-gray-500 text-md  md:text-lg'>
                  <Icon icon='line-md:phone-call-loop' />
                  <h1>+91 {phone}</h1>
                </div>
                <div className='flex gap-2 items-center mt-4 font-duplet-semi text-gray-500 text-md  md:text-lg'>
                  <Icon icon='line-md:email' />
                  <h1>{datas?.email}</h1>
                </div>
              </div>
            </Card>
            <Card className='py-6'>
              {quickLinks.map((item: any, idx: any) => (
                <div
                  key={idx}
                  className='px-3 md:px-10 font-duplet-reg text-[#6B6B6B] text-lg'
                  onClick={() => router.push(item.link)}>
                  <section className='flex justify-between items-center cursor-pointer hover:bg-[#E6E6E6] p-2 rounded-md'>
                    <div>{item.title}</div>
                    <div>
                      <Icon
                        className='text-3xl'
                        icon={"lets-icons:arrow-drop-right"}
                      />
                    </div>
                  </section>
                </div>
              ))}
            </Card>
          </div>

          <div className='px-2 g md:px-10 py-8'>
            <Card shadow='sm' radius='sm' className='border border-[#E6E6E6] '>
              <div className=' font-duplet-semi  px-2 g md:px-10 py-4 '>
                <div className='text-base md:text-2xl '>
                  Recent Order History
                </div>
              </div>

              {isMobileView ? (
                <>
                  <div className='px-2 mb-3'>
                    {noData ? (
                      data?.data?.map((item: any) => (
                        <Card
                          key={item?.trackingNumber}
                          shadow='md'
                          className='p-2 mt-3'
                          radius='sm'>
                          <div className='flex justify-between font-duplet-reg  items-center'>
                            <h3
                              className={` text-base capitalize ${
                                item?.status === "delivered"
                                  ? "text-[#00B207] "
                                  : ""
                              }  ${
                                item?.status === "cancelled"
                                  ? "text-red-600 "
                                  : ""
                              } ${
                                item?.status === "confirmed"
                                  ? "text-[#FB8C00] "
                                  : ""
                              } `}>
                              {item?.status}
                            </h3>
                            <h6 className='text-[#939393] text-xs capitalize'>
                              Track ID # {item?.trackingNumber}
                            </h6>
                          </div>
                          <div className='flex justify-between mt-3 font-duplet-reg items-center'>
                            <h3 className='text-[#9F9F9F] text-sm '>
                              ({item.orderSummary.length}
                              &nbsp;{" "}
                              {item.orderSummary.length > 1
                                ? "Products"
                                : "Product"}
                              ) &nbsp; | &nbsp;{" "}
                              {formatDate(item?.orderSummary?.createdAt)}
                            </h3>
                            <h6 className='text-[#424242] text-base  font-bold'>
                              ₹{item?.totalAmount?.toFixed(0)}
                            </h6>
                          </div>
                          <div className='mt-1'>
                            <div className='text-[#00B207] text-xl flex justify-center'>
                              {item?.status == "cancelled" ? null : (
                                <Button
                                  isIconOnly
                                  size='sm'
                                  radius='sm'
                                  className='bg-[#E6E6E6]'>
                                  <Icon
                                    onClick={() =>
                                      item?.status == "delivered"
                                        ? router.push(
                                            `/orderdetails/${item?.trackingNumber}`
                                          )
                                        : router.push(
                                            `/ordertracking/${item?.trackingNumber}`
                                          )
                                    }
                                    className={`
                                  ${
                                    item?.status === "delivered"
                                      ? "text-[#00B207] cursor-pointer"
                                      : "text-[#b74a4a] cursor-pointer"
                                  } text-3xl
                                
                                `}
                                    icon='line-md:map-marker-filled'
                                  />
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <h1 className='text-lg text-center text-gray-500'>
                        No Orders found
                      </h1>
                    )}
                    <div className='mt-3'>
                      {pages > 0 ? (
                        <div className='flex p-0  w-full justify-center'>
                          <Pagination
                            isCompact
                            showControls
                            showShadow
                            page={page}
                            total={pages}
                            onChange={(page: any) => setPage(page)}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Table
                    radius='none'
                    shadow='lg'
                    isHeaderSticky
                    className=' foldable stickytable'
                    bottomContentPlacement='outside'
                    aria-label='Example table with client async pagination'
                    bottomContent={
                      pages > 0 ? (
                        <div className='flex p-0  w-full justify-end'>
                          <Pagination
                            isCompact
                            showControls
                            showShadow
                            page={page}
                            total={pages}
                            onChange={(page: any) => setPage(page)}
                          />
                        </div>
                      ) : null
                    }>
                    <TableHeader>
                      <TableColumn
                        style={{ letterSpacing: "1px" }}
                        className='uppercase text-sm  font-duplet-reg text-[#4D4D4D]'
                        width={100}
                        key='trackingNumber'>
                        Order ID
                      </TableColumn>
                      <TableColumn
                        style={{ letterSpacing: "1px" }}
                        className='uppercase text-sm  font-duplet-reg text-[#4D4D4D]'
                        width={100}
                        key='createdAt'>
                        Date
                      </TableColumn>

                      <TableColumn
                        style={{ letterSpacing: "1px" }}
                        className='uppercase text-sm  font-duplet-reg text-[#4D4D4D]'
                        width={100}
                        key='totalAmount'>
                        Total
                      </TableColumn>
                      <TableColumn
                        style={{ letterSpacing: "1px" }}
                        className='uppercase text-sm  font-duplet-reg text-[#4D4D4D]'
                        width={100}
                        key='status'>
                        Status
                      </TableColumn>
                      <TableColumn
                        style={{ letterSpacing: "1px" }}
                        className='uppercase text-sm  font-duplet-reg text-[#4D4D4D]'
                        width={100}
                        key='actions'>
                        Actions
                      </TableColumn>
                    </TableHeader>

                    {noData ? (
                      <TableBody
                        items={data?.data ?? []}
                        loadingContent={<Spinner />}
                        loadingState={loadingState}>
                        {(item: any) => (
                          <TableRow key={item?.trackingNumber}>
                            <TableCell className='font-duplet-reg text-[#333333] text-base'>
                              {item?.trackingNumber}
                            </TableCell>
                            <TableCell className='font-duplet-reg text-[#333333] text-base'>
                              {formatDate(item?.orderSummary?.createdAt)}
                            </TableCell>
                            <TableCell className='font-duplet-reg text-[#333333] text-base'>
                              ₹{item?.totalAmount?.toFixed(0)} (
                              {item.orderSummary.length}
                              &nbsp;{" "}
                              {item.orderSummary.length > 1
                                ? "Products"
                                : "Product"}
                              )
                            </TableCell>
                            <TableCell
                              className={`font-duplet-reg text-[#333333] text-base capitalize ${
                                item?.status === "delivered"
                                  ? "text-[#00B207] "
                                  : ""
                              }  ${
                                item?.status === "cancelled"
                                  ? "text-red-600 "
                                  : ""
                              } `}>
                              {statusEnums[
                                item?.status as keyof typeof statusEnums
                              ] || "N/A"}
                            </TableCell>
                            <TableCell className='text-[#00B207] text-xl flex justify-start'>
                              {item?.status == "cancelled" ? (
                                <Icon
                                  className='text-[#b74a4a] text-3xl'
                                  icon={"line-md:close"}
                                />
                              ) : (
                                <Icon
                                  onClick={() =>
                                    item?.status == "delivered"
                                      ? router.push(
                                          `/orderdetails/${item?.trackingNumber}`
                                        )
                                      : router.push(
                                          `/ordertracking/${item?.trackingNumber}`
                                        )
                                  }
                                  className={`
                                  ${
                                    item?.status === "delivered"
                                      ? "text-[#00B207] cursor-pointer"
                                      : "text-[#b74a4a] cursor-pointer"
                                  } text-3xl
                                
                                `}
                                  icon='line-md:map-marker-filled'
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    ) : (
                      <TableBody emptyContent={"No rows to display."}>
                        {[]}
                      </TableBody>
                    )}
                  </Table>
                </>
              )}
            </Card>
          </div>
        </div>
      </main>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Are you Sure?
              </ModalHeader>
              <ModalBody></ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    Logout();
                  }}
                  color='primary'
                  onPress={onClose}>
                  Logout
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
