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
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUserStore } from "@/stores/UserStore";
import { get, save } from "@/lib/storage";
import { axios } from "@/lib/axios";
import { config } from "@/lib/config";

function Login() {
  const router = useRouter();
  const LoginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
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
    },
    resolver: yupResolver(LoginSchema),
  });

  const handleFormSubmit = async (data: any) => {
    try {
      const response = await axios.post(`${config.baseUrl}user/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.ok === true) {
        useUserStore.setState({ user: response.data.data, isLoggedIn: true });
        toast.success(response.data.message);
        save("user", response.data.data);
        if (get("user")) {
          setTimeout(() => {
            router.push("/");
          }, 500);
        } else {
          router.push("/login");
        }
        reset();
      } else if (response.data.ok === false) {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      if (error) {
        toast.error(error.response.data);
      } else {
        toast.error("Something went wrong");
      }
      console.log(error);
    }
  };

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
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
              Login
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
                      {...field}
                      type={isVisible ? "text" : "password"}
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
              <div className='mt-3 flex flex-wrap justify-between gap-1 font-duplet-reg font-medium'>
                <Checkbox size='sm' color='success'>
                  <span className='text-authmaintext cursor-pointer'>
                    Remember me
                  </span>
                </Checkbox>

                <span className='text-authmaintext underline cursor-pointer'>
                  Forgot password?
                </span>
              </div>
              <div className='mt-3 flex-wrap sm:flex-nowrap font-duplet-semi font-[600] flex justify-between gap-3'>
                <Button
                  className='w-full border border-authmaintext text-authmaintext'
                  size='lg'
                  radius='sm'
                  variant='bordered'
                  type='submit'
                >
                  Login
                </Button>
                <Button
                  radius='sm'
                  className='w-full bg-btncolor text-fff'
                  size='lg'
                  onClick={() => router.push("/register")}
                >
                  Sign up
                </Button>
              </div>
              <div className='mt-4 text-[14px] text-authsubtext text-center font-inter'>
                Or, login with
              </div>
              <div className='mt-3 font-inter'>
                <Button
                  className='w-full border  rounded-md border-[#AFA2C3] text-authsubtext'
                  size='md'
                  variant='bordered'
                >
                  <Icon className='text-xl' icon={"flat-color-icons:google"} />
                  Google
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Toaster
        position='top-center'
        toastOptions={{ duration: 2000 }}
        reverseOrder={false}
      />
    </>
  );
}

export default Login;
