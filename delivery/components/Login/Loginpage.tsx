"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "../ui/card";
import hero from "@/public/mobhero.png";
import baseicon from "@/public/baseicon.png";
import Image from "next/image";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormLabel,
  FormField,
  FormItem,
  useFormField,
  FormMessage,
} from "../ui/form";
import { axios } from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, {
      message: "Phone number must be 10 digits",
    })
    .max(10, {
      message: "Phone number must be 10 digits",
    }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters",
    })
    .max(8, {
      message: "Password must be at least 8 characters",
    }),
});

const LoginPage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    try {
      const response = await axios.post(`deliveryperson/login`, data);
      console.log(response);
      if (response?.data?.ok === true) {
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("user", JSON.stringify(response?.data?.data));
        toast(`${response?.data?.message}`, {
          closeButton: true,
          duration: 3000,
          icon: "👏",
          position: "top-center",
        });
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.log(error);
      toast(`${error?.response?.data?.message}`, {
        closeButton: true,
        duration: 3000,
        position: "top-center",
      });
    }
  }

  return (
    <div>
      <section>
        <div className=' w-full '>
          <Image priority={true} placeholder='blur' src={hero} alt='hero' />
        </div>
      </section>
      <main className='p-3'>
        <div className='flex gap-4 items-center '>
          <div>
            <Image className='w-[30px] h-[35px]' src={baseicon} alt='' />
          </div>
          <h1 className='text-3xl  text-[#1D772D]'>Starex</h1>
        </div>
        <div className='mt-5'>
          <h2 className='text-2xl text-[#1D772D]'>Login</h2>
        </div>
        <div className='mt-3'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-[#1D772D]'>Mobile </FormLabel>
                    <FormControl>
                      <Input placeholder='9999999999' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-[#1D772D]'>Password</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete='off'
                        type='password'
                        placeholder='********'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='mt-6'>
                <Button className='w-full bg-[#1D772D] hover:bg-[#1D772D]'>
                  Sign in
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
