"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import useSWR, { mutate } from "swr";
import { Pagination } from "@nextui-org/pagination";
import { Spinner } from "@nextui-org/spinner";
import { config } from "@/lib/config";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";
import { Icon } from "@iconify/react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Controller, Form, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { ImageWithFallback } from "@/app/ui/components/imagefallback/ImageWithFallback";
import { axios } from "@/lib/axios";

function page() {
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

  const deleteCategory = async (id: any) => {
    try {
      const response = await axios.delete(`category?id=${id}`);
      if (response.data.ok === true) {
        toast.success(response.data.message);
        mutate(`${config.baseUrl}category/all?page=${page}&limit=10`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const [isediting, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");

  const handleEdit = async (data: any) => {
    setValue("categoryName", data.categoryName);
    setValue("image", data.image);
    setEditId(data._id);
    setIsEditing(true);
    onOpen();
  };

  const handleFormSubmit = async (data: any) => {
    try {
      isediting
        ? await axios
            .put(`category?id=${editId}`, data, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              if (res.data.ok === true) {
                toast.success(res.data.message);
                mutate(`${config.baseUrl}category/all?page=${1}&limit=${10}`);
              } else {
                toast.error(res.data.message);
              }
            })
        : await axios
            .post(`category/add`, data, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              if (res.data.ok === true) {
                toast.success(res.data.message);
                mutate(`${config.baseUrl}category/all?page=${1}&limit=${10}`);
              } else {
                toast.error(res.data.message);
              }
            });
    } catch (error) {
      toast.error("Something went wrong");
    }
    reset();
    handleModalClose();
    mutate(`${config.baseUrl}category/all?page=${page}&limit=10`);
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleModalOpen = () => {
    onOpen();
    setIsEditing(false);
    reset();
  };

  const handleModalClose = () => {
    onOpenChange();
    setIsEditing(false);
    reset();
  };

  const rowsPerPage = 10;
  const fetcher = (...args: any) =>
    fetch(args).then((res) => {
      return res.json();
    });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);

  const handleSearch = () => {
    setIsSearchEnabled(true);
  };

  const { data, isLoading } = useSWR(
    isSearchEnabled
      ? `${config.baseUrl}category/all?&search=${search}`
      : `${config.baseUrl}category/all?page=${page}&limit=${rowsPerPage}`,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnMount: true,
    }
  );

  const pages = useMemo(() => {
    return data?.count ? Math.ceil(data.count / rowsPerPage) : 0;
  }, [data?.count, rowsPerPage]);

  const loadingState =
    isLoading || data?.data.length === 0 ? "loading" : "idle";

  const noData = data?.data.length === 0 ? false : true;

  return (
    <>
      <div className=' w-full p-5 '>
        <div className='flex items-center justify-between mb-4 gap-10'>
          <div>
            <h1 className='text-3xl flex justify-center mb-2'>Category</h1>
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
            <Button
              startContent={
                <Icon style={{ fontSize: "30px" }} icon='mdi:plus' />
              }
              onPress={handleModalOpen}
              className='bg-[#6366f1] text-white '>
              Add
            </Button>
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
              key='categoryName'>
              Category
            </TableColumn>
            <TableColumn
              className='text-[17px] text-white bg-[#6366f1]'
              style={{ fontWeight: "500" }}
              width={100}
              key='productCount'>
              Total Products
            </TableColumn>
            <TableColumn
              className='text-[17px] text-white bg-[#6366f1]'
              style={{ fontWeight: "500" }}
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
                <TableRow key={item?._id}>
                  <TableCell>
                    <Image
                      alt='dd'
                      src={`${config.baseUrl}files/view?image=${item?.image}`}
                      width={100}
                      height={100}
                      style={{
                        objectFit: "contain",
                        height: "100px",
                        width: "100px",
                      }}
                    />
                  </TableCell>
                  <TableCell className='text-base capitalize'>
                    {item?.categoryName}
                  </TableCell>
                  <TableCell className='text-base capitalize'>
                    {item?.productCount}
                  </TableCell>

                  <TableCell className='flex gap-5 mt-7  items-center'>
                    <Button
                      className='bg-[#6366f1]'
                      onClick={() => handleEdit(item)}
                      isIconOnly>
                      <Icon className='text-2xl text-white' icon='mdi:pencil' />
                    </Button>
                    <Button
                      className='bg-red-700'
                      onClick={() => deleteCategory(item._id)}
                      isIconOnly>
                      <Icon
                        className='text-2xl text-white'
                        icon='mdi:trash-can-outline'
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

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement='top-center'
        className='pb-3'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Add Category
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className='space-y-4'>
                  <div>
                    <Controller
                      control={control}
                      name='categoryName'
                      render={({ field }) => (
                        <Input
                          {...field}
                          errorMessage={errors.categoryName?.message}
                          type='text'
                          label='Category Name'
                          className='mb-8'
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label htmlFor='image'>Upload Image</label>
                    <Controller
                      control={control}
                      name='image'
                      render={({ field }) => (
                        <input
                          // {...field}
                          required={!isediting}
                          type='file'
                          className='mb-5 p-3 w-full rounded-xl bg-default-100'
                          onChange={(e: any) => {
                            field.onChange(e.target.files[0]);
                          }}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Button
                      size='lg'
                      type='submit'
                      className='bg-[#6366f1] w-full py-3 rounded-lg mt-1  text-white'>
                      {isediting ? "Update Category" : "Add Category"}
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default page;
