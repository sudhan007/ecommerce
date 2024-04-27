"use client";
import { axios } from "@/lib/axios";
import { config } from "@/lib/config";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Input } from "@nextui-org/input";

import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

function page() {
  const settingsSchema = yup.object().shape({
    email: yup.string().email(),
    password: yup.string(),
    image: yup.mixed(),
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
      image: "",
    },
    resolver: yupResolver(settingsSchema),
  });

  const handleFormSubmit = async (data: any) => {
    console.log(data);
    console.log(localStorage.getItem("userid"));
    const userid = localStorage.getItem("userid");
    const response = await axios.put(
      `${config.baseUrl}user/editlogin?userId=${userid}`,
      data
    );
    console.log(response);
  };

  return (
    <>
      <div>
        <div className="w-full px-40 py-16">
          <Card className="p-5 " shadow="lg" radius="lg">
            <CardBody className="pb-10">
              <div className="">
                <h1 className="text-2xl">Admin Settings</h1>
              </div>
              <div className="flex justify-center mt-5">
                <Image
                  className="w-48 h-48"
                  src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                />
              </div>

              <div className="flex justify-center items-center mt-16 w-full flex-wrap md:flex-nowrap gap-12">
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        autoComplete="off"
                        errorMessage={errors.email?.message}
                        label="Email"
                        className="mb-8"
                        startContent={<Icon icon="mdi:email" />}
                      />
                    )}
                  />
                  <div>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="password"
                          autoComplete="off"
                          errorMessage={errors.password?.message}
                          label="password"
                          className="mb-8"
                          startContent={<Icon icon="mdi:lock" />}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      control={control}
                      name="image"
                      render={({ field }) => (
                        <input
                          type="file"
                          className="mb-5 p-3 w-full rounded-xl bg-default-100"
                          onChange={(e: any) => {
                            field.onChange(e.target.files[0]);
                            console.log(e.target.files[0]);
                          }}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Button
                      size="lg"
                      type="submit"
                      className="bg-[#6366f1] w-full py-3 rounded-lg mt-5 text-white"
                    >
                      save changes
                    </Button>
                  </div>
                </form>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

export default page;
