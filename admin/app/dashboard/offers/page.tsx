"use client";
import { axios } from "@/lib/axios";
import { config } from "@/lib/config";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Select, SelectItem } from "@nextui-org/select";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

import { ImageWithFallback } from "@/app/ui/components/imagefallback/ImageWithFallback";
import { CircularProgress } from "@nextui-org/progress";

function Offers() {
  const offerSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    image: yup.mixed().required("Image is required"),
    category: yup.string().required("Category is required"),
  });

  const [data, setData] = useState([]);
  const [isediting, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      image: "",
      category: "",
    },
    resolver: yupResolver(offerSchema),
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.baseUrl}offer/all`, {
        withCredentials: true,
      });
      if (response.data.ok === true) {
        setData(response.data.data);
      } else {
        setData([]);
      }
    } catch (error) {
      setData([]);
    }
  };

  const deleteOffer = async (id: any) => {
    try {
      const response = await axios.delete(`${config.baseUrl}offer?id=${id}`);
      if (response.data.ok === true) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
    fetchData();
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

  const [category, setCategory] = useState([]);

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

  const handleFormSubmit = async (data: any) => {
    try {
      isediting
        ? await axios
            .put(`${config.baseUrl}offer?id=${editId}`, data, {})
            .then((res) => {
              if (res.data.ok === true) {
                toast.success(res.data.message);
                fetchData();
              } else {
                toast.error(res.data.message);
              }
            })
        : await axios
            .post(`${config.baseUrl}offer/add`, data, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              if (res.data.ok === true) {
                toast.success(res.data.message);
                fetchData();
              } else {
                toast.error(res.data.message);
              }
            });
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
    fetchData();
    handleModalClose();
    reset();
  };

  const handleEdit = async (data: any) => {
    setValue("name", data.name);
    setValue("description", data.description);
    setValue("image", data.image);
    setValue("category", data.category._id);
    setEditId(data._id);
    setIsEditing(true);
    onOpen();
  };

  useEffect(() => {
    fetchData();
    fetchCategory();
  }, []);

  return (
    <>
      <div className=" w-full p-5 ">
        <div className="flex items-center justify-between mb-4 px-10">
          <div>
            <h1 className="text-3xl flex justify-center mb-2">Offers</h1>
          </div>
          <div className="">
            <Button
              startContent={
                <Icon style={{ fontSize: "20px" }} icon="mdi:plus" />
              }
              onClick={handleModalOpen}
              className="bg-[#6366f1] text-white w-10 h-10"
            ></Button>
          </div>
        </div>
        {data.length > 0 ? (
          <div className="mt-5 grid gap-3 grid-cols-1  md:grid-cols-3">
            {data.length > 0 ? (
              data?.map((item: any) => (
                <Card key={item._id} className="max-w-[400px]">
                  <CardHeader className="flex justify-center mt-4">
                    <ImageWithFallback
                      alt="offer image"
                      fallbackSrc="/bagvegetables.png"
                      style={{
                        width: "250px",
                        height: "250px",
                        objectFit: "contain",
                      }}
                      src={`${config.baseUrl}files/view?image=${item?.image}`}
                      width={250}
                      height={250}
                      priority={true}
                    />
                  </CardHeader>
                  <CardBody>
                    <div className="px-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold ">Title:</h3>
                        <p className="text-base capitalize">{item?.name}</p>
                      </div>
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold">Description:</h3>
                        <p className="text-base capitalize">
                          {item?.description}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Category:</h3>
                        <p className="text-base capitalize">
                          {item?.category?.categoryName}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                  <div className="flex justify-end px-10 gap-6 mb-4">
                    {/* <Button
              onClick={() => handleEdit(item)}
              className='bg-[#6366f1]'
              isIconOnly
            >
              <Icon className='text-2xl text-white' icon='mdi:pencil' />
            </Button> */}
                    <Button
                      onClick={() => deleteOffer(item?._id)}
                      className="bg-red-700"
                      isIconOnly
                    >
                      <Icon
                        className="text-2xl text-white"
                        icon="mdi:trash-can-outline"
                      />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="flex justify-center  items-center h-[75vh] ">
                <CircularProgress
                  aria-label="Loading"
                  size="lg"
                  color="success"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center text-2xl text-red-500 ">
            No offers
          </div>
        )}
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
                Add Offer
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
                          label="Title"
                          className="mb-8"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Controller
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <Input
                          {...field}
                          errorMessage={errors.description?.message}
                          type="text"
                          label="Description"
                          className="mb-8"
                        />
                      )}
                    />
                  </div>

                  <div className="flex w-full flex-col ">
                    <Controller
                      control={control}
                      name="category"
                      render={({ field }) => (
                        <Select
                          {...field}
                          label="Category"
                          errorMessage={errors.category?.message}
                          variant="bordered"
                          placeholder="Select an item"
                          onChange={(e: any) => {
                            field.onChange(e.target.value);
                          }}
                        >
                          {category.map((item: any) => (
                            <SelectItem
                              key={item._id}
                              value={item.categoryName}
                            >
                              {item.categoryName}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    />
                  </div>

                  <div>
                    <label htmlFor="image">Upload Image</label>
                    <Controller
                      control={control}
                      name="image"
                      render={({ field }) => (
                        <input
                          type="file"
                          required
                          className="mb-5 p-3 w-full rounded-xl bg-default-100"
                          onChange={(e: any) => {
                            field.onChange(e.target.files[0]);
                          }}
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
                      Add
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

export default Offers;
