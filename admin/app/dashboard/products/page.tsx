"use client";
import { axios } from "@/lib/axios";
import { config } from "@/lib/config";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
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
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import * as yup from "yup";

import { ImageWithFallback } from "@/app/ui/components/imagefallback/ImageWithFallback";
import { Select, SelectItem } from "@nextui-org/select";
import { Switch } from "@nextui-org/switch";
import toast from "react-hot-toast";
import Image from "next/image";

function page() {
  const productSchema = yup.object().shape({
    productName: yup.string().required(),
    price: yup.string().required(),
    discount: yup.string().min(0).max(100).required(),
    // availableQuantity: yup.string().required(),
    // description: yup.string().required(),
    unit: yup.string().required().oneOf(["kg", "ltr"]),
    image: yup.mixed().required(),
    category: yup.string().required(),
  });

  const handleHotdeal = async (item: any) => {
    try {
      const respone = await axios.put(
        `${config.baseUrl}product/sethotdeal?productId=${
          item._id
        }&toggle=${!item.isHotDeal}`
      );
      if (respone.data.ok === true) {
        toast.success(respone.data.message);
        mutate(`${config.baseUrl}product/all?page=${1}&limit=${10}`);
      }
    } catch (error: any) {
      toast.error("some thing went wrong");
    }
  };
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productName: "",
      price: "",
      discount: "",
      // availableQuantity: "",
      unit: "",
      image: "",
      category: "",
      // description: "",
    },
    resolver: yupResolver(productSchema),
  });

  const [category, setCategory] = useState([]);

  const [isediting, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");

  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        `${config.baseUrl}category/all?page=1&limit=2000`
      );
      setCategory(response.data.data);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleEdit = async (data: any) => {
    setValue("productName", data.productName);
    setValue("price", data.price);
    setValue("discount", data.discount);
    // setValue("availableQuantity", data.availableQuantity);
    setValue("image", data.image);
    setValue("category", data.category._id);
    // setValue("description", data.description);
    setEditId(data._id);
    setIsEditing(true);
    onOpen();
  };

  const handleFormSubmit = async (data: any) => {
    try {
      isediting
        ? await axios
            .put(`${config.baseUrl}product?id=${editId}`, data, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              if (res.data.ok === true) {
                console.log(res.data);
                toast.success(res.data.message);
                mutate(`${config.baseUrl}product/all?page=${1}&limit=${10}`);
              } else {
                toast.error(res.data.message);
              }
            })
        : await axios
            .post(`${config.baseUrl}product/add`, data, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              if (res.data.ok === true) {
                toast.success(res.data.message);
                mutate(`${config.baseUrl}product/all?page=${1}&limit=${10}`);
              } else {
                toast.error(res.data.message);
              }
            });
    } catch (error) {
      toast.error("Something went wrong");
    }

    handleModalClose();
    reset();
    mutate(`${config.baseUrl}product/all?page=${1}&limit=${10}`);
  };
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

  const handleDelete = async (id: any) => {
    try {
      const response = await axios.delete(`${config.baseUrl}product?id=${id}`);
      if (response.data.ok === true) {
        toast.success(response.data.message);
        mutate(`${config.baseUrl}product/all?page=${1}&limit=${10}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const rowsPerPage = 10;
  const fetcher = (...args: any) =>
    fetch(args).then((res) => {
      return res.json();
    });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSearch = () => {
    setIsSearchEnabled(true);
  };

  const { data, isLoading } = useSWR(
    isSearchEnabled
      ? `${config.baseUrl}product/all?&search=${search}`
      : `${config.baseUrl}product/all?page=${page}&limit=${rowsPerPage}`,
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
            <h1 className='text-3xl flex justify-center mb-2'>Products</h1>
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
                  mutate(`${config.baseUrl}product/all?page=${page}&limit=10`);
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
            <Button
              startContent={
                <Icon style={{ fontSize: "30px" }} icon='mdi:plus' />
              }
              onClick={handleModalOpen}
              className='bg-[#6366f1] text-white '>
              Add
            </Button>
          </div>
        </div>
        <Table
          radius='lg'
          shadow='lg'
          isHeaderSticky
          className='h-[75vh] stickytable'
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
              className='text-[17px] text-white bg-[#6366f1]'
              style={{ fontWeight: "500" }}
              width={100}
              key='productName'>
              Product
            </TableColumn>
            <TableColumn
              className='text-[17px] text-white bg-[#6366f1]'
              style={{ fontWeight: "500" }}
              width={100}
              key='price'>
              Price
            </TableColumn>

            <TableColumn
              className='text-[17px] text-white bg-[#6366f1]'
              style={{ fontWeight: "500" }}
              width={100}
              key='discount'>
              Discount(Rs)
            </TableColumn>

            <TableColumn
              className='text-[17px] text-white bg-[#6366f1]'
              style={{ fontWeight: "500" }}
              width={100}
              key='discountedPrice'>
              Discounted Price
            </TableColumn>

            <TableColumn
              className='text-[17px] text-white bg-[#6366f1]'
              style={{ fontWeight: "500" }}
              width={100}
              key='unit'>
              Units
            </TableColumn>

            <TableColumn
              className='text-[17px] text-white bg-[#6366f1]'
              style={{ fontWeight: "500" }}
              width={100}
              key='category.name'>
              category
            </TableColumn>
            <TableColumn
              className=' text-white text-[15px] bg-[#6366f1]'
              style={{ fontWeight: "500" }}
              width={100}
              key='image'>
              Image
            </TableColumn>
            <TableColumn
              className=' text-white text-[15px] bg-[#6366f1]'
              style={{ fontWeight: "500" }}
              width={100}
              key='isHotDeal'>
              Hot Deal
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
                  <TableCell className='text-base capitalize'>
                    {item?.productName}
                  </TableCell>
                  <TableCell className='text-base capitalize'>
                    {item?.price?.toFixed(0)}
                  </TableCell>
                  <TableCell className='text-base capitalize'>
                    {item?.discount?.toFixed(0)}
                  </TableCell>
                  <TableCell className='text-base capitalize'>
                    {item?.discountedPrice}
                  </TableCell>

                  <TableCell className='text-base capitalize'>
                    {item?.unit}
                  </TableCell>
                  <TableCell className='text-base capitalize'>
                    {item?.category?.categoryName}
                  </TableCell>
                  <TableCell>
                    <Image
                      alt='offer image'
                      src={`${config.baseUrl}files/view?image=${item?.image}`}
                      height={100}
                      width={100}
                      priority={true}
                      style={{
                        objectFit: "contain",
                        height: "100px",
                        width: "100px",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col gap-2'>
                      <Switch
                        color='secondary'
                        defaultSelected={item?.isHotDeal}
                        onChange={() => handleHotdeal(item)}></Switch>
                    </div>
                  </TableCell>
                  <TableCell className='flex gap-5  items-center mt-7'>
                    <Button
                      onClick={() => handleEdit(item)}
                      className='bg-[#6366f1]'
                      isIconOnly>
                      <Icon className='text-2xl text-white' icon='mdi:pencil' />
                    </Button>
                    <Button
                      onClick={() => handleDelete(item._id)}
                      className='bg-red-700'
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
        size='2xl'
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement='top-center'
        className='pb-3'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Add Product
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className='space-y-4'>
                  <div className='grid grid-cols-2 gap-6'>
                    <div>
                      <Controller
                        control={control}
                        name='productName'
                        render={({ field }) => (
                          <Input
                            {...field}
                            errorMessage={errors.productName?.message}
                            type='text'
                            label='Product Name'
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Controller
                        control={control}
                        name='price'
                        render={({ field }) => (
                          <Input
                            {...field}
                            errorMessage={errors.price?.message}
                            type='number'
                            label='Price'
                          />
                        )}
                      />
                    </div>

                    <div>
                      <Controller
                        control={control}
                        name='discount'
                        render={({ field }) => (
                          <Input
                            {...field}
                            errorMessage={errors.discount?.message}
                            type='number'
                            label='Discount(Rs)'
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Controller
                        control={control}
                        name='unit'
                        render={({ field }) => (
                          <Select
                            {...field}
                            label='Unit'
                            variant='bordered'
                            placeholder='Select an Unit'
                            onChange={(e: any) => {
                              field.onChange(e.target.value);
                            }}>
                            <SelectItem key={"kg"} value={"kg"}>
                              kg
                            </SelectItem>
                            <SelectItem key={"ltr"} value={"ltr"}>
                              ltr
                            </SelectItem>
                          </Select>
                        )}
                      />
                    </div>

                    <div>
                      <Controller
                        control={control}
                        name='category'
                        render={({ field }) => (
                          <Select
                            {...field}
                            label='Category'
                            variant='bordered'
                            placeholder='Select an item'
                            onChange={(e: any) => {
                              field.onChange(e.target.value);
                            }}>
                            {category.map((item: any) => (
                              <SelectItem
                                key={item?._id}
                                value={item?.categoryName}>
                                {item?.categoryName}
                              </SelectItem>
                            ))}
                          </Select>
                        )}
                      />
                    </div>

                    {/* <div>
                      <Controller
                        control={control}
                        name='description'
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            errorMessage={errors.description?.message}
                            type='number'
                            label='Description'
                          />
                        )}
                      />
                    </div> */}
                  </div>

                  <div>
                    <label htmlFor='image'>Upload Image</label>
                    <Controller
                      control={control}
                      name='image'
                      render={({ field }) => (
                        <input
                          // {...field}
                          // required={!isediting}
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
                      {isediting ? "Update Product" : "Add Product"}
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
