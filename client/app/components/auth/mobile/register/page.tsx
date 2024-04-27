"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import baseicon from "@/public/icons/baseicon.png";
import { Input } from "@nextui-org/input";
import { Checkbox } from "@nextui-org/checkbox";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import hero from "@/public/images/mobhero.png";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { axios } from "@/lib/axios";
import { config } from "@/lib/config";
import toast, { Toaster } from "react-hot-toast";
function Register() {
  const router = useRouter();

  const registrationSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match"),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(registrationSchema),
  });

  const handleFormSubmit = async (data: any) => {
    console.log(data);
    try {
      const response = await axios.post(`${config.baseUrl}user/signup`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      if (response.data.ok === true) {
        toast.success(response.data.message);
        reset();
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else if (response.data.ok === false) {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      if (error) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const [reisVisible, resetIsVisible] = useState(false);

  const retoggleVisibility = () => resetIsVisible(!reisVisible);
  return (
    <>
      <div>
        <section>
          <div className=' w-full font-duplet-semi'>
            <Image priority={true} placeholder='blur' src={hero} alt='hero' />
          </div>
        </section>
        <main className='p-3'>
          <div className='flex gap-4 items-center '>
            <div>
              <Image className='w-[30px] h-[35px]' src={baseicon} alt='' />
            </div>
            <h1 className='text-3xl  text-authmaintext font-duplet-semi'>
              Starex
            </h1>
          </div>
          <div className='mt-5'>
            <h2 className='text-2xl font-duplet-semi text-authmaintext'>
              Sign up
            </h2>
          </div>
          <div className='mt-3'>
            <form onSubmit={handleSubmit(handleFormSubmit)} action=''>
              <div className='mb-3'>
                <label className='text-authmaintext font-duplet-semi '>
                  Email
                </label>
                <Controller
                  control={control}
                  name='email'
                  render={({ field }) => (
                    <Input
                      {...field}
                      type='email'
                      variant='bordered'
                      errorMessage={errors.email?.message}
                      style={{
                        width: "100%",
                        outline: "none",
                        backgroundColor: "white !important",
                        fontSize: "16px",
                        color: "#1D772D",
                        fontFamily: "duplet-semibold",
                      }}
                    />
                  )}
                />
              </div>
              <div>
                <label className='text-authmaintext font-duplet-semi '>
                  Password
                </label>
                <Controller
                  control={control}
                  name='password'
                  render={({ field }) => (
                    <Input
                      type={isVisible ? "text" : "password"}
                      {...field}
                      variant='bordered'
                      autoComplete='off'
                      errorMessage={errors.password?.message}
                      style={{
                        width: "100%",
                        outline: "none",
                        backgroundColor: "white !important",
                        fontSize: "18px",
                        color: "#1D772D",
                      }}
                      endContent={
                        <button type='button' onClick={toggleVisibility}>
                          {isVisible ? (
                            <Icon
                              className='text-2xl text-inputborder pointer-events-none'
                              icon='mdi:eye'
                            />
                          ) : (
                            <Icon
                              className='text-2xl text-inputborder pointer-events-none'
                              icon='mdi:eye-off'
                            />
                          )}
                        </button>
                      }
                    />
                  )}
                />
              </div>

              <div className='mt-3'>
                <label className='text-authmaintext font-duplet-semi '>
                  Re- Enter Password
                </label>
                <Controller
                  control={control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={reisVisible ? "text" : "password"}
                      variant='bordered'
                      autoComplete='off'
                      errorMessage={errors.confirmPassword?.message}
                      style={{
                        width: "100%",
                        outline: "none",
                        backgroundColor: "white !important",
                        fontSize: "18px",
                        color: "#1D772D",
                      }}
                      endContent={
                        <button type='button' onClick={retoggleVisibility}>
                          {reisVisible ? (
                            <Icon
                              className='text-2xl text-inputborder pointer-events-none'
                              icon='mdi:eye'
                            />
                          ) : (
                            <Icon
                              className='text-2xl text-inputborder pointer-events-none'
                              icon='mdi:eye-off'
                            />
                          )}
                        </button>
                      }
                    />
                  )}
                />
              </div>

              <div
                className='mt-3 underline font-duplet-semi text-authmaintext'
                onClick={() => router.push("/login")}
              >
                <h4>Already have an account?</h4>
              </div>

              <div className='mt-5 flex-wrap sm:flex-nowrap font-duplet-semi font-[600] flex justify-between gap-3'>
                <Button
                  radius='sm'
                  className='w-full bg-btncolor text-fff'
                  size='lg'
                  type='submit'
                >
                  Sign up
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Toaster
        position='top-center'
        toastOptions={{ duration: 3000 }}
        reverseOrder={false}
      />
    </>
  );
}

export default Register;
