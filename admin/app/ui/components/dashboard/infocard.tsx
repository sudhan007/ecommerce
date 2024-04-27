import { axios } from "@/lib/axios";
import { config } from "@/lib/config";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@nextui-org/button";
import { Card, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

const StarexDetailsSchema = yup.object({
  email: yup.string().email().required("Email is required"),
  phoneNumber: yup.string().required("Phone number is required"),
});

const InfoCard = () => {
  const [details, setDetails] = useState<any>({});

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${config.baseUrl}starexdetails/details`,
        {
          withCredentials: true,
        }
      );
      console.log(response?.data?.data, "res");
      if (response?.data?.ok === true) {
        setDetails(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (details?.email) {
      setValue("email", details.email);
    }
    if (details?.phoneNumber) {
      setValue("phoneNumber", details.phoneNumber);
    }
  }, [details]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    setValue,
  } = useForm({
    defaultValues: {
      email: "",
      phoneNumber: "",
    },
    resolver: yupResolver(StarexDetailsSchema),
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      const response = await axios.post(
        `${config.baseUrl}starexdetails/add`,
        data
      );
      if (response?.data?.ok === true) {
        toast.success(response?.data?.message);
        fetchData();
        reset();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className='w-full flex justify-center'>
        <Card shadow='sm' radius='sm' className='px-4 py-5 w-[500px]'>
          <CardHeader className='text-xl flex justify-center '>
            Shop Details
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className=' mb-2'>
              <label className='text-label  text-lg   '>Email</label>

              <Controller
                control={control}
                name='email'
                render={({ field }) => (
                  <Input
                    type='text'
                    {...field}
                    variant='bordered'
                    radius='sm'
                    errorMessage={errors.email?.message}
                    className='text-formtext'
                    style={{
                      width: "100%",
                      outline: "none",
                      backgroundColor: "white !important",
                      fontSize: "20px",
                      borderColor: "#E6E6E6",
                    }}
                  />
                )}
              />
            </div>
            <div className='mt-3 mb-2'>
              <label className='text-label   text-base md:text-lg   '>
                Mobile
              </label>

              <Controller
                control={control}
                name='phoneNumber'
                render={({ field }) => (
                  <Input
                    type='text'
                    {...field}
                    variant='bordered'
                    radius='sm'
                    errorMessage={errors.phoneNumber?.message}
                    className='text-formtext'
                    style={{
                      width: "100%",
                      outline: "none",
                      backgroundColor: "white !important",
                      fontSize: "20px",
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
                disabled={!isDirty}
                radius='sm'
                className={`${
                  !isDirty ? "opacity-50" : "bg-[#6366f1]"
                } text-white`}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};

export default InfoCard;
