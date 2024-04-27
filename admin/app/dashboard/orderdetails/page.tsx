"use client";
import React, { useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import useSWR from "swr";
import { Pagination } from "@nextui-org/pagination";
import { Spinner } from "@nextui-org/spinner";
import { config, formatePhone } from "@/lib/config";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import moment from "moment";
import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@nextui-org/input";

function OrderList() {
  const router = useRouter();
  const rowsPerPage = 10;
  const fetcher = (...args: any) =>
    fetch(args).then((res) => {
      return res.json();
    });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [isStatusEnabled, setStatusEnabled] = useState(false);
  const [status, setStatus] = useState("");
  const updateStatus = async (newValue: string) => {
    console.log(newValue);
    setStatus(newValue);
    setStatusEnabled(true);
  };
  const handleSearch = () => {
    setIsSearchEnabled(true);
  };

  const { data, isLoading, mutate } = useSWR(
    () => {
      if (isSearchEnabled && search !== "") {
        return `${config.baseUrl}order/all?search=${search}`;
      } else if (isStatusEnabled) {
        if (status == "All") {
          console.log(status);
          return `${config.baseUrl}order/all?page=${page}&limit=${rowsPerPage}`;
        } else {
          return `${config.baseUrl}order/all?status=${status}`;
        }
      } else {
        return `${config.baseUrl}order/all?page=${page}&limit=${rowsPerPage}`;
      }
    },
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

  function formatDate(time: any) {
    if (time !== null) {
      let formatedtime = moment(time).format("MMM Do YY hh:mm a");
      return formatedtime;
    }

    return "";
  }

  return (
    <>
      <div className=' w-full p-5 '>
        <div className='py-2 flex justify-between items-center px-10'>
          <div>
            <h1 className='text-3xl px-5 mb-2'>Order Details</h1>
          </div>
          <div className='flex items-center gap-5'>
            <Select
              color='primary'
              selectedKeys={[status]}
              label='Filter By Status'
              onChange={(keys: any) => {
                updateStatus(keys["target"]["value"]);
              }}
            >
              <SelectItem key='' value=''>
                Select Status
              </SelectItem>

              <SelectItem key='All' value='All'>
                All
              </SelectItem>
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
            <Input
              aria-label='Search'
              classNames={{
                inputWrapper: "bg-default-200",
                input: "text-sm",
              }}
              onChange={(e: any) => {
                if (isSearchEnabled && e.target.value === "") {
                  setIsSearchEnabled(false);
                  mutate(`${config.baseUrl}order/all?page=${page}&limit=10`);
                } else {
                  setIsSearchEnabled(true);
                }
                setSearch(e.target.value);
              }}
              onKeyDown={(e: any) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (search !== "") handleSearch();
                }
              }}
              endContent={
                <div className='text-end'>
                  <Button isIconOnly className='ml-2' aria-label='Like'>
                    <Icon
                      className='text-2xl text-[#6366f1]'
                      icon='mdi:magnify'
                    />
                  </Button>
                </div>
              }
              placeholder='Search...'
              type='text'
            />
          </div>
        </div>

        <Table
          radius='lg'
          shadow='lg'
          isHeaderSticky
          className='h-[75vh] foldable stickytable'
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
          }
        >
          <TableHeader>
            <TableColumn
              className='text-[16px] text-white bg-[#6366f1]'
              style={{ fontWeight: "500" }}
              key='phoneNumber'
            >
              Mobile
            </TableColumn>
            <TableColumn
              className='text-[16px] text-white bg-[#6366f1]'
              style={{ fontWeight: "500" }}
              key='status'
            >
              Status
            </TableColumn>
            <TableColumn
              className='text-[16px] text-white bg-[#6366f1]'
              style={{ fontWeight: "500" }}
              key='trackingNumber'
            >
              Tracking Id
            </TableColumn>
            <TableColumn
              className='text-[16px] text-white bg-[#6366f1]'
              style={{ fontWeight: "500" }}
              key='createdAt'
            >
              Date
            </TableColumn>

            <TableColumn
              className='text-[16px] text-white bg-[#6366f1]'
              style={{ fontWeight: "500" }}
              key='actions'
            >
              Action
            </TableColumn>
          </TableHeader>

          {noData ? (
            <TableBody
              items={data?.data ?? []}
              loadingContent={<Spinner />}
              loadingState={loadingState}
            >
              {(item: any) => (
                <TableRow key={item?._id}>
                  <TableCell className='text-base '>
                    {formatePhone(item?.userId?.phoneNumber)}
                  </TableCell>

                  <TableCell
                    className={`text-base capitalize ${
                      item?.status === "delivered" ? "text-green-500" : ""
                    } ${item?.status === "cancelled" ? "text-red-600" : ""}`}
                  >
                    {item?.status}
                  </TableCell>
                  <TableCell className='text-base '>
                    {item?.trackingNumber}
                  </TableCell>
                  <TableCell className='text-base capitalize'>
                    {formatDate(item?.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button
                      className='bg-red-600'
                      onClick={() =>
                        router.push(`/dashboard/orderdetails/${item?._id}`)
                      }
                      isIconOnly
                    >
                      <Icon
                        className='text-2xl text-white'
                        icon='lets-icons:view'
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          ) : (
            <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
          )}
        </Table>
      </div>

      <Toaster
        position='top-center'
        toastOptions={{ duration: 5000 }}
        reverseOrder={false}
      />
    </>
  );
}

export default OrderList;
