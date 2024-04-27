"use client";
import { config } from "@/lib/config";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
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
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import * as yup from "yup";

import { axios } from "@/lib/axios";
import toast from "react-hot-toast";

function page() {
  const deliveryPersonschma = yup.object().shape({
    name: yup.string().required("Name is required"),
    phoneNumber: yup
      .string()
      .min(10)
      .max(10)
      .required("Phone number is required"),
    password: yup
      .string()
      .min(8)
      .max(8)
      .required("password must be at least 8 characters"),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      phoneNumber: "",
      password: "",
    },
    resolver: yupResolver(deliveryPersonschma),
  });

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

  const [isediting, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");

  const handleEdit = (data: any) => {
    console.log(data, "data");
    setValue("name", data.name);
    setValue("phoneNumber", data.phoneNumber);
    setValue("password", data.password);
    setEditId(data._id);
    setIsEditing(true);
    onOpen();
  };

  const handleDelete = async (id: any) => {
    console.log(id);
    try {
      const response = await axios.delete(
        `${config.baseUrl}deliveryperson?id=${id}`
      );
      if (response.data.ok === true) {
        toast.success(response.data.message);
        mutate(`${config.baseUrl}deliveryperson/all?page=${1}&limit=10`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      isediting
        ? await axios
            .put(`${config.baseUrl}deliveryperson?id=${editId}`, data)
            .then((res) => {
              if (res.data.ok === true) {
                toast.success(res.data.message);
                mutate(
                  `${config.baseUrl}deliveryperson/all?page=${1}&limit=${10}`
                );
              } else {
                toast.error(res.data.message);
              }
            })
        : await axios
            .post(`${config.baseUrl}deliveryperson/add`, data, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((res) => {
              if (res.data.ok === true) {
                toast.success(res.data.message);
                mutate(
                  `${config.baseUrl}deliveryperson/all?page=${1}&limit=${10}`
                );
              } else {
                toast.error(res.data.message);
              }
            });
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
    reset();
    handleModalClose();
    setIsEditing(false);
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
      ? `${config.baseUrl}deliveryperson/all?&search=${search}`
      : `${config.baseUrl}deliveryperson/all?page=${page}&limit=${rowsPerPage}`,
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
      <div className=" w-full p-5 ">
        <div className="flex items-center justify-between mb-4 gap-10">
          <div>
            <h1 className="text-3xl flex justify-center mb-2">
              Delivery Persons
            </h1>
          </div>
          <div className="flex items-center gap-5 ">
            <Input
              aria-label="Search"
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
                <div className="text-end">
                  <Button isIconOnly className="  ml-2" aria-label="Like">
                    <Icon
                      className="text-2xl text-[#6366f1]"
                      icon="mdi:magnify"
                    />
                  </Button>
                </div>
              }
              placeholder="Search..."
              type="text"
            />
            <Button
              startContent={
                <Icon style={{ fontSize: "30px" }} icon="mdi:plus" />
              }
              onPress={handleModalOpen}
              className="bg-[#6366f1] text-white "
            >
              Add
            </Button>
          </div>
        </div>
        <Table
          radius="lg"
          shadow="lg"
          isHeaderSticky
          className="h-[75vh] foldable stickytable"
          bottomContentPlacement="outside"
          aria-label="Example table with client async pagination"
          bottomContent={
            pages > 0 ? (
              <div className="flex p-0  w-full justify-end">
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
              className=" text-white text-[15px] bg-[#6366f1]"
              style={{ fontWeight: "500" }}
              width={100}
              key="name"
            >
              Name
            </TableColumn>
            <TableColumn
              className="text-[17px] text-white bg-[#6366f1]"
              style={{ fontWeight: "500" }}
              width={100}
              key="phoneNumber"
            >
              Mobile
            </TableColumn>

            <TableColumn
              className="text-[17px] text-white bg-[#6366f1]"
              style={{ fontWeight: "500" }}
              width={100}
              key="actions"
            >
              Actions
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
                  <TableCell className="text-base capitalize">
                    {item?.name}
                  </TableCell>
                  <TableCell className="text-base capitalize">
                    {item?.phoneNumber}
                  </TableCell>

                  <TableCell className="flex gap-5 mt-7  items-center">
                    <Button
                      className="bg-[#6366f1]"
                      onClick={() => handleEdit(item)}
                      isIconOnly
                    >
                      <Icon className="text-2xl text-white" icon="mdi:pencil" />
                    </Button>
                    <Button
                      className="bg-red-700"
                      onClick={() => handleDelete(item?._id)}
                      isIconOnly
                    >
                      <Icon
                        className="text-2xl text-white"
                        icon="mdi:trash-can-outline"
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
        placement="top-center"
        className="pb-3"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Delivery Person
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="space-y-4"
                >
                  <div>
                    <Controller
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <Input
                          {...field}
                          errorMessage={errors.name?.message}
                          type="text"
                          label="Name"
                          className="mb-8"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Controller
                      control={control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <Input
                          {...field}
                          errorMessage={errors.phoneNumber?.message}
                          type="number"
                          label="Mobile Number"
                          className="mb-8"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Controller
                      control={control}
                      name="password"
                      render={({ field }) => (
                        <Input
                          {...field}
                          errorMessage={errors.password?.message}
                          type="text"
                          label="Password"
                          className="mb-8"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Button
                      size="lg"
                      type="submit"
                      className="bg-[#6366f1] w-full py-3 rounded-lg mt-1  text-white"
                    >
                      {isediting ? "Update" : "Add"}
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
