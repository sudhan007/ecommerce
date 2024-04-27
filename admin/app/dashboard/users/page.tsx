"use client";
import { config, formatePhone } from "@/lib/config";
import { Pagination } from "@nextui-org/pagination";
import { Spinner } from "@nextui-org/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { useMemo, useState } from "react";
import useSWR, { mutate } from "swr";

import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { ImageWithFallback } from "@/app/ui/components/imagefallback/ImageWithFallback";
import { useRouter } from "next/navigation";

function page() {
  const router = useRouter();
  const categorySchema = yup.object().shape({
    categoryName: yup.string().required("Product Name  is required"),
    image: yup.mixed().required("Image is required"),
  });
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      categoryName: "",
      image: "",
    },
    resolver: yupResolver(categorySchema),
  });

  const rowsPerPage = 10;
  const fetcher = (...args: any) =>
    fetch(args).then((res) => {
      return res.json();
    });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  console.log(search);
  const handleSearch = () => {
    setIsSearchEnabled(true);
  };

  const { data, isLoading } = useSWR(
    isSearchEnabled
      ? `${config.baseUrl}user/all?&search=${search}`
      : `${config.baseUrl}user/all?page=${page}&limit=${rowsPerPage}`,
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

  return (
    <>
      <div className=' w-full p-5 '>
        <div className='flex items-center justify-between mb-4 gap-10'>
          <div>
            <h1 className='text-3xl flex justify-center mb-2'>Users</h1>
          </div>
          <div className='flex items-center gap-5 '>
            <Input
              aria-label='Search'
              classNames={{
                inputWrapper: "bg-default-200",
                input: "text-sm",
              }}
              onChange={(e) => {
                if (isSearchEnabled && e.target.value === "") {
                  setIsSearchEnabled(false);
                  mutate(`${config.baseUrl}category/all?page=${page}&limit=10`);
                } else {
                  setIsSearchEnabled(true);
                }
                setSearch(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (search !== "") handleSearch();
                }
              }}
              endContent={
                <div className='text-end'>
                  <Button isIconOnly className='  ml-2' aria-label='Like'>
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
          }>
          <TableHeader>
            <TableColumn
              className=' text-white text-[15px] bg-[#6366f1]'
              style={{ fontWeight: "500" }}
              width={100}
              key='image'>
              Image
            </TableColumn>

            <TableColumn
              className='text-[17px] text-white bg-[#6366f1]'
              style={{ fontWeight: "500" }}
              width={100}
              key='phoneNumber'>
              Mobile
            </TableColumn>
            <TableColumn
              className='text-[17px] text-white bg-[#6366f1]'
              style={{ fontWeight: "500" }}
              width={100}
              key='name'>
              Name
            </TableColumn>
            <TableColumn
              className='text-[17px] text-white bg-[#6366f1]'
              style={{ fontWeight: "500" }}
              width={100}
              key='email'>
              Email
            </TableColumn>
            {/* <TableColumn
              className='text-[17px] text-white bg-[#6366f1]'
              style={{ fontWeight: "500" }}
              width={100}
              key='action'
            >
              Action
            </TableColumn> */}
          </TableHeader>

          {noData ? (
            <TableBody
              items={data?.data ?? []}
              loadingContent={<Spinner />}
              loadingState={loadingState}>
              {(item: any) => (
                <TableRow key={item?._id}>
                  <TableCell>
                    {/* <Image
                      className=' rounded-full w-[80px] h-[80px] object-cover'
                      radius='lg'
                      loading='lazy'
                      // crossOrigin='anonymous'
                      alt='NextUI hero Image'
                      // src={BASE_URL_IMAGE + item?.image}
                      src='https://i.pravatar.cc/150?u=a04258114e29026708c'
                    /> */}
                    <ImageWithFallback
                      fallbackSrc='/user.jpg'
                      alt='category'
                      className='rounded-full '
                      src={item?.image}
                      height={100}
                      width={100}
                      priority={true}
                      style={{
                        objectFit: "contain",
                        height: "100px",
                        width: "100px",
                      }}
                    />
                    {/* <Avatar
                      className='h-20 w-20'
                      // src='/user.jpg'
                      src={`${config.baseUrl}files/view?image=${item?.image}`}
                      size='lg'
                      radius='full'
                    /> */}
                  </TableCell>
                  <TableCell className='text-base capitalize'>
                    +91 {item?.phoneNumber}
                  </TableCell>
                  <TableCell className='text-base capitalize'>
                    {item?.firstName}
                  </TableCell>
                  <TableCell className='text-base '>{item?.email}</TableCell>

                  {/* <TableCell>
                    <Button
                      onClick={() =>
                        router.push(`/dashboard/users/${item?._id}`)
                      }
                      className='bg-red-700'
                      isIconOnly
                      aria-label='Like'
                    >
                      <Icon
                        className='text-2xl text-white'
                        icon='ph:eye-bold'
                      />
                    </Button>
                  </TableCell> */}
                </TableRow>
              )}
            </TableBody>
          ) : (
            <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
          )}
        </Table>
      </div>
    </>
  );
}

export default page;
