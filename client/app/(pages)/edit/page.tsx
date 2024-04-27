"use client";
import React, { useEffect, useReducer, useState } from "react";
import { Navebar } from "@/app/components/Home/Navbar/Navebar";

// import user from "@/public/images/photo-1494790108377-be9c29b29330.jpg";
import user from "@/public/images/user.jpg";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useUserStore } from "@/stores/UserStore";
import * as yup from "yup";
import { Select, SelectItem } from "@nextui-org/select";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { axios } from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatePhone } from "@/lib/config";
import { useRouter } from "next/navigation";
import { ZLoading } from "@/app/components/zloading";
import { Icon } from "@iconify/react";
import { CircularProgress } from "@nextui-org/progress";
import { ImageWithFallback } from "@/app/components/ImageWithFallback";
import Image from "next/image";

type formStateType = {
  name: string;
  phoneNumber: string;
  email: string;
};

export default function ProfileSettings() {
  const personalInfoSchema = yup.object({
    name: yup.string().required("Name is required"),
    phoneNumber: yup.string().required("Phone number is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
  });

  const {
    user: { phone },
  } = useUserStore();

  const router = useRouter();

  const {
    data,
    isLoading,
    isError,
    refetch: refetchPersonalDetails,
  } = useQuery({
    queryKey: ["personaldetails"],
    queryFn: async () => {
      const { data } = await axios.get(`user/minimal?userId=${_id}`);
      return data;
    },
  });

  const { _id } = useUserStore((state) => state.user);

  const addressType = [
    { value: "Home", label: "Home" },
    { value: "Office", label: "Office" },
    { value: "Other", label: "Other" },
  ];

  const {
    control: personalInfoController,
    handleSubmit: personalInfoHandleSubmit,
    setValue: personalInfoSetValue,
    formState: { errors: personalInfoErrors, isDirty, touchedFields },
  } = useForm({
    defaultValues: {
      name: "",
      phoneNumber: phone ? `+91 ${phone}` : "",
      email: "",
    },
    resolver: yupResolver(personalInfoSchema),
  });

  useEffect(() => {
    if (data?.data) {
      personalInfoSetValue("name", data?.data?.firstName, {
        shouldDirty: false,
      });
      personalInfoSetValue("email", data?.data?.email, {
        shouldDirty: false,
      });
    }
  }, [data && data?.data]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["personalInfo"],
    mutationFn: async (data: any) => {
      const response = await axios.put(`/user?userId=${_id}`, data);
      console.log(response);
      if (response.data.ok) {
        toast.success(response.data.message);
        router.refresh();
        refetchPersonalDetails();
      } else {
        toast.error(response.data.message);
      }
    },
  });

  const { mutate: imageUpdateMutation, isPending: imageUpdatePending } =
    useMutation({
      mutationKey: ["personalInfo"],
      mutationFn: async (data: any) => {
        const response = await axios.put(`/user?userId=${_id}`, data);
        console.log(response);
        if (response.data.ok === true) {
          toast.success(response.data.message);
          refetchPersonalDetails();
        } else {
          toast.error(response.data.message);
        }
      },
    });

  const handlePersonalFormSubmition = async (data: any) => {
    mutate(data);
  };

  const onImageChange = (event: any) => {
    const file = event.target.files[0];

    if (file) {
      console.log(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      console.log(reader);
      reader.onload = () => {
        const base64 = reader.result;
        console.log(base64);
        if (typeof base64 === "string") {
          const fileSize = file.size;
          console.log(fileSize, "fileSize");
          if (fileSize > 10000000) {
            toast.error(
              "Image size is too large. Please choose an image under 1MB"
            );
            return;
          }
          imageUpdateMutation({ image: base64 });
        }
      };
      reader.onerror = (error) => {
        console.log(error);
        toast.error("Error uploading image");
      };
    }
  };

  return (
    <>
      <section className='bg-[#1A3824]'>
        <Navebar />
      </section>

      {isLoading ? <ZLoading /> : <></>}

      <main className=' px-2 md:px-10 container mx-auto mt-10 mb-10'>
        <div className=' shadow-lg md:shadow-none border rounded-lg'>
          <div className=' font-duplet-semi border-b px-2 gap-3 md:px-10 py-4 flex justify-start items-center'>
            <Button
              className='bg-[#0EA829] text-white'
              isIconOnly
              variant='solid'
              onClick={() => router.push("/profile")}>
              <Icon icon='ic:round-arrow-back' className='cursor-pointer ' />
            </Button>
            <div className='text-base md:text-xl '>Account Settings</div>
          </div>

          <input
            type='file'
            name='image'
            id='image'
            hidden
            onChange={(e) => onImageChange(e)}
          />
          <div className='grid px-2 md:px-10 grid-cols-1 lg:grid-cols-4 justify-evenly p-4'>
            <div className='col-span-1 flex justify-center items-center'>
              {imageUpdatePending ? (
                <CircularProgress label='Hang on...' />
              ) : (
                <img
                  style={{ objectFit: "cover" }}
                  src={data?.data?.image ? data?.data?.image : user}
                  alt='user profile'
                  title='change Profile picture'
                  className='rounded-full cursor-pointer h-40 w-40 lg:h-64 lg:w-64'
                  onClick={() => {
                    document.getElementById("image")?.click();
                  }}
                />
                // <ImageWithFallback
                //   src={data?.data?.image}
                //   alt='user profile'
                //   className='rounded-full cursor-pointer h-40 w-40 lg:h-64 lg:w-64'
                //   onclick={() => {
                //     document.getElementById("image")?.click();
                //   }}
                //   title='change Profile picture'
                //   style={{ objectFit: "cover" }}
                //   width={100}
                //   height={100}
                //   fallbackSrc='https://t3.ftcdn.net/jpg/06/33/54/78/360_F_633547842_AugYzexTpMJ9z1YcpTKUBoqBF0CUCk10.jpg'
                // />
                // <Image
                //   // src={data?.data?.image ? data?.data?.images : user}
                //   src={data?.data?.image ? data?.data?.imagae : user}
                //   alt='user profile'
                //   title='change Profile picture'
                //   className='rounded-full cursor-pointer h-40 w-40 lg:h-64 lg:w-64'
                //   onClick={() => {
                //     document.getElementById("image")?.click();
                //   }}
                //   style={{ objectFit: "cover" }}
                //   width={100}
                //   height={100}
                // />
              )}
            </div>
            <div className='col-span-3'>
              <form
                onSubmit={personalInfoHandleSubmit(
                  handlePersonalFormSubmition
                )}>
                <div className='mt-7 md:mt-5 mb-2'>
                  <label className='text-label  text-lg  font-duplet-reg '>
                    Name
                  </label>

                  <Controller
                    control={personalInfoController}
                    name='name'
                    render={({ field }) => (
                      <Input
                        type='text'
                        {...field}
                        variant='bordered'
                        radius='sm'
                        errorMessage={personalInfoErrors.name?.message}
                        className='text-formtext'
                        style={{
                          width: "100%",
                          outline: "none",
                          backgroundColor: "white !important",
                          fontSize: "20px",
                          fontFamily: "duplet-semibold",
                          borderColor: "#E6E6E6",
                        }}
                      />
                    )}
                  />
                </div>
                <div className='mt-3 mb-2'>
                  <label className='text-label   text-base md:text-lg  font-duplet-reg '>
                    Email
                  </label>

                  <Controller
                    control={personalInfoController}
                    name='email'
                    render={({ field }) => (
                      <Input
                        type='text'
                        {...field}
                        variant='bordered'
                        radius='sm'
                        errorMessage={personalInfoErrors.email?.message}
                        className='text-formtext'
                        style={{
                          width: "100%",
                          outline: "none",
                          backgroundColor: "white !important",
                          fontSize: "20px",
                          fontFamily: "duplet-semibold",
                          borderColor: "#E6E6E6",
                        }}
                      />
                    )}
                  />
                </div>
                <div className='mt-3 mb-2'>
                  <label className='text-label  text-base md:text-lg font-duplet-reg '>
                    Phone Number
                  </label>

                  <Controller
                    control={personalInfoController}
                    name='phoneNumber'
                    render={({ field }) => (
                      <Input
                        type='text'
                        {...field}
                        variant='bordered'
                        readOnly
                        radius='sm'
                        errorMessage={personalInfoErrors.phoneNumber?.message}
                        className='text-formtext'
                        style={{
                          width: "100%",
                          outline: "none",
                          backgroundColor: "white !important",
                          fontSize: "20px",
                          fontFamily: "duplet-semibold",
                          borderColor: "#E6E6E6",
                        }}
                      />
                    )}
                  />
                </div>

                <div className='mt-7 flex justify-start'>
                  <Button
                    size='lg'
                    type='submit'
                    disabled={isPending || isDirty === false}
                    isLoading={isPending}
                    radius='sm'
                    className={`${
                      isDirty != false ? "bg-[#1A3824] " : "bg-[#E6E6E6]"
                    } font-poppins font-bold text-[#FFFFFF]`}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Toaster
        position='top-center'
        toastOptions={{ duration: 4000 }}
        reverseOrder={false}
      />
    </>
  );
}
