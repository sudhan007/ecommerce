"use client";
import { axios } from "@/lib/axios";
import { config } from "@/lib/config";
import { Button } from "@nextui-org/button";
import { CircularProgress } from "@nextui-org/progress";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

function Terms() {
  const [isloading, setIsloading] = useState(false);
  const fetchData = async (setValue: any, setIsloading: any) => {
    try {
      const response = await axios.get(
        `${config.baseUrl}policy/getpolicy?type=terms`
      );
      setValue("content", response.data.data.content);
      setIsloading(true);
    } catch (error) {
      setIsloading(false);
    }
  };

  useEffect(() => {
    fetchData(setValue, setIsloading);
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      content: "",
      type: "terms",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post(
        `${config.baseUrl}policy/add?type=terms`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.ok === true) {
        toast.success(" terms Policy updated");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className='p-5'>
        <div className='px-6'>
          <h1 className='text-3xl  mb-2'>Terms & Conditions</h1>
        </div>
        <div className='mt-7'>
          {isloading ? (
            <form onSubmit={handleSubmit(onSubmit)} action=''>
              <Controller
                name='content'
                control={control}
                render={({ field }) => (
                  <ReactQuill
                    theme={"snow"}
                    id={field.name}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <div className='flex justify-end px-10 gap-3 mt-5'>
                <Button
                  radius='sm'
                  size='lg'
                  color={isDirty ? "success" : "default"}
                  className='text-[#FFFFFF]'
                  disabled={!isDirty}
                  type='submit'>
                  Save
                </Button>
              </div>
            </form>
          ) : (
            <div className='h-[75vh] w-full bg-white flex justify-center items-center'>
              <CircularProgress label='Hang on...' />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Terms;
