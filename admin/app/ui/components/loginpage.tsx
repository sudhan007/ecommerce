"use client";
import { config } from "@/lib/config";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";

function LoginPage() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const loginSchema = yup.object().shape({
    email: yup.string().email().required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(loginSchema),
  });
  const submitData = (data: any) => {
    try {
      // fetch("/api/auth/login", {
      //   method: "POST",
      //   credentials: "include",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // })
      //   .then((res) => res.json())
      //   .then((data) => {
      //     if (data.ok) {
      //       toast.success("Login successful");
      //       localStorage.setItem("isLoggedIn", "true");
      //       router.push("/dashboard");
      //     } else {
      //       toast.error("Invalid email or password");
      //     }
      //   });
      if (data.email === "admin@gmail.com" && data.password === "admin") {
        toast.success("Login successful");
        localStorage.setItem("isLoggedIn", "true");
        router.push("/dashboard");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className='flex justify-center items-center min-h-screen bg-default-100'>
        <Card className='flex flex-col-reverse md:flex-row shadow-lg rounded-3xl p-10 max-w-4xl gap-10'>
          <div className='flex-1 mt-5 md:mt-0'>
            <Image
              className='object-cover w-full h-full rounded-2xl'
              src='/loginimage.jpg'
              alt=''
              width={500}
              height={500}
            />
          </div>
          <div className='flex-1 space-y-12'>
            <h1 className='text-4xl font-bold text-center mb-8'>Login</h1>
            <form onSubmit={handleSubmit(submitData)} className='space-y-4'>
              <div>
                <Controller
                  control={control}
                  name='email'
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.email?.message}
                      type='email'
                      label='Email'
                      className='mb-8'
                      startContent={<Icon icon='mdi:email' />}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name='password'
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.password?.message}
                      label='Password'
                      autoComplete='off'
                      type={isVisible ? "text" : "password"}
                      className='mb-8'
                      startContent={<Icon icon='mdi:lock' />}
                      endContent={
                        <button
                          className='focus:outline-none'
                          type='button'
                          onClick={toggleVisibility}>
                          {isVisible ? (
                            <Icon
                              icon='mdi:eye'
                              className='text-2xl text-default-400 pointer-events-none'
                            />
                          ) : (
                            <Icon
                              icon='mdi:eye-off'
                              className='text-2xl text-default-400 pointer-events-none'
                            />
                          )}
                        </button>
                      }
                    />
                  )}
                />
              </div>
              <div>
                <Button
                  size='lg'
                  type='submit'
                  className='bg-[#6366f1] w-full py-3 rounded-lg mt-5 text-white'>
                  Login
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
      <Toaster position='top-center' reverseOrder={false} />
    </>
  );
}

export default LoginPage;

console.log(config.baseUrl);
