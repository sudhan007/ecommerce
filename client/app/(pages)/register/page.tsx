"use client";
import Register from "@/app/components/auth/mobile/register/page";
import { axios } from "@/lib/axios";
import { config } from "@/lib/config";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";

export default function RegisterScreen() {
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

  const [isMobileView, setIsMobileView] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [reisVisible, resetIsVisible] = useState(false);
  const retoggleVisibility = () => resetIsVisible(!reisVisible);

  useEffect(() => {
    setIsMobileView(window.innerWidth <= 800);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 800);
      console.log(isMobileView);
      console.log(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileView]);

  return (
    <>
      {isMobileView ? (
        <Register />
      ) : (
        <div className="login w-screen h-screen">
          <section className=" px-20 lg:px-40 flex justify-center lg:justify-end  gap-3">
            <Card className="w-[80%] xl:w-[35%] mt-[6%] font-duplet-semi">
              <div className="mt-[10%] mb-[10%]">
                <div className="text-center ">
                  <h1 className="text-authmaintext text-4xl">Register</h1>
                </div>

                <div className="mt-6 px-5 lg:px-10">
                  <div>
                    <h3 className="text-authmaintext text-2xl">Sign up</h3>
                  </div>
                  <form onSubmit={handleSubmit(handleFormSubmit)} action="">
                    <div className="mt-7 mb-3">
                      <label className="text-authmaintext text-2xl font-duplet-semi ">
                        Email
                      </label>
                      <Controller
                        control={control}
                        name="email"
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="email"
                            variant="bordered"
                            errorMessage={errors.email?.message}
                            style={{
                              width: "100%",
                              outline: "none",
                              backgroundColor: "white !important",
                              fontSize: "22px",
                              color: "#1D772D",
                              fontFamily: "duplet-semibold",
                              borderColor: "#9FC2B1",
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="mt-8">
                      <label className="text-authmaintext text-2xl font-duplet-semi ">
                        Password
                      </label>

                      <Controller
                        control={control}
                        name="password"
                        render={({ field }) => (
                          <Input
                            {...field}
                            type={isVisible ? "text" : "password"}
                            variant="bordered"
                            autoComplete="off"
                            errorMessage={errors.password?.message}
                            style={{
                              width: "100%",
                              outline: "none",
                              backgroundColor: "white !important",
                              fontSize: "22px",
                              color: "#1D772D",
                            }}
                            endContent={
                              <button type="button" onClick={toggleVisibility}>
                                {isVisible ? (
                                  <Icon
                                    className="text-3xl text-inputborder pointer-events-none"
                                    icon="mdi:eye"
                                  />
                                ) : (
                                  <Icon
                                    className="text-3xl text-inputborder pointer-events-none"
                                    icon="mdi:eye-off"
                                  />
                                )}
                              </button>
                            }
                          />
                        )}
                      />
                    </div>

                    <div className="mt-8">
                      <label className="text-authmaintext text-2xl font-duplet-semi ">
                        Re-Enter Password
                      </label>
                      <Controller
                        control={control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <Input
                            {...field}
                            type={reisVisible ? "text" : "password"}
                            variant="bordered"
                            autoComplete="off"
                            errorMessage={errors.confirmPassword?.message}
                            style={{
                              width: "100%",
                              outline: "none",
                              backgroundColor: "white !important",
                              fontSize: "22px",
                              color: "#1D772D",
                            }}
                            endContent={
                              <button
                                type="button"
                                onClick={retoggleVisibility}
                              >
                                {reisVisible ? (
                                  <Icon
                                    className="text-3xl text-inputborder pointer-events-none"
                                    icon="mdi:eye"
                                  />
                                ) : (
                                  <Icon
                                    className="text-3xl text-inputborder pointer-events-none"
                                    icon="mdi:eye-off"
                                  />
                                )}
                              </button>
                            }
                          />
                        )}
                      />
                    </div>

                    <div className="mt-10  font-duplet-semi font-[600] flex justify-between gap-5">
                      <Button
                        radius="sm"
                        type="submit"
                        className="w-full text-xl bg-btncolor text-fff"
                        size="lg"
                      >
                        Sign up
                      </Button>
                    </div>
                    <Button
                      onClick={() => {
                        router.push("/login");
                      }}
                      type="submit"
                      className="w-full mt-4 border border-authmaintext text-xl text-authmaintext"
                      size="lg"
                      radius="sm"
                      variant="bordered"
                    >
                      Login
                    </Button>
                    <div className="mt-8   text-[18px] text-authsubtext text-center font-inter">
                      Or, login with
                    </div>
                    <div className="mt-6 font-inter">
                      <Button
                        className="w-full border text-xl  rounded-md border-[#AFA2C3] text-authsubtext"
                        size="lg"
                        variant="bordered"
                      >
                        <Icon
                          className="text-2xl"
                          icon={"flat-color-icons:google"}
                        />
                        Google
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </Card>
          </section>
        </div>
      )}
      <Toaster
        position="top-center"
        toastOptions={{ duration: 3000 }}
        reverseOrder={false}
      />
    </>
  );
}
