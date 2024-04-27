"use client";
import Login from "@/app/components/auth/mobile/login/Login";
import { Card } from "@nextui-org/card";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { axios } from "@/lib/axios";
import * as axiosBase from "axios";
import { useUserStore } from "@/stores/UserStore";
import { get, save } from "@/lib/storage";
import { stringify } from "querystring";
import { config } from "@/lib/config";

export default function LoginScreen() {
  const router = useRouter();
  // useEffect(() => {
  //   if (get("user_id") && get("email")) {
  //     router.push("/");
  //   }
  // }, []);

  const handleFormSubmit = async (token: any) => {
    console.log(token, "token");

    try {
      fetch("https://auth.otpless.app/auth/userInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          token,
          client_id: "I28KG9G1D52ZBXQMNK57HTJRTG579HRJ",
          client_secret: "vydxtqrujycus5khgfnoikeonxx4njrs",
        }),
      })
        .then((res) => {
          if (!res.ok) {
            toast.error("Something went wrong");
          }
          return res.json();
        })
        .then((data) => {
          const phone = data.national_phone_number;
          console.log(data.national_phone_number, "data");
          if (phone != null) {
            fetch(`${config.baseUrl}user/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                phone: phone,
              }),
            })
              .then((res) => {
                if (!res.ok) {
                  toast.error("Something went wrong");
                }
                return res.json();
              })
              .then((data) => {
                console.log(data, "data");
                console.log(data.data.id, "idddddddddddd");
                if (data.ok === true) {
                  useUserStore.setState({
                    isLoggedIn: true,
                    token: data?.data?.token,
                    user: {
                      phone: data?.data?.phoneNumber || "",
                      _id: data?.data?.id || "",
                    },
                  });
                  toast.success(data?.message);
                  router.push("/");
                } else {
                  toast.error("Something went wrong");
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }

    // try {
    //   let tokenResponse = await axiosBase.default.post("/api/login", {
    //     token: token,
    //   });
    //   console.log(tokenResponse, "tokenResponse");
    // } catch (error) {
    //   console.log(error);
    // }
    // try {
    //   let tokenResponse = await axiosBase.default.post("/api/login", {
    //     token: token,
    //   });
    //   if (tokenResponse != null) {
    //     let loginResponse = tokenResponse.data;
    //     console.log(loginResponse, "loginResponse");
    //     let res = await axios.post("/user/login", {
    //       phone: loginResponse.phone_number,
    //     });
    //     if (res.status == 200) {
    //       useUserStore.setState({
    //         isLoggedIn: true,
    //         token: res.data.data.token,
    //         user: {
    //           phone: res.data.data.phoneNumber || "",
    //           _id: res.data.data.id || "",
    //         },
    //       });
    //       window.location.href = "/";
    //     } else {
    //       toast.error(res.data.message);
    //       window.location.href = "/";
    //     }
    //   }
    // } catch (e) {
    //   console.log(e);
    // }
  };

  // const [isMobileView, setIsMobileView] = useState(false);
  // const [isVisible, setIsVisible] = useState(false);

  // useEffect(() => {
  //   (window as any).otpless = (otplessUser: any) => {
  //     // handleFormSubmit(otplessUser.token);
  //     console.log(otplessUser, "otplessUser");
  //   };
  // }, []);

  // const fetchData = async (token: any) => {
  //   try {
  //     let data = {
  //       name: "User",
  //       email: "loremipsum@gmail.com",
  //       first_name: "Lorem",
  //       last_name: "Ipsum",
  //       family_name: "Ipsum",
  //       phone_number: "+917202897611",
  //       national_phone_number: "7202897611",
  //       country_code: "+91",
  //       email_verified: true,
  //       auth_time: "1700753415",
  //       authentication_details: {
  //         phone: {
  //           mode: "WHATSAPP",
  //           phone_number: "7202897611",
  //           country_code: "+91",
  //           auth_state: "verified",
  //         },
  //         email: {
  //           email: "loremipsum@gmail.com",
  //           mode: "GMAIL",
  //           auth_state: "verified",
  //         },
  //       },
  //     };
  //     handleFormSubmit(data, token);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     // Handle error here
  //   }
  // };

  useEffect(() => {
    (window as any).otpless = (otplessUser: any) => {
      console.log(otplessUser, "otplessUser");
      handleFormSubmit(otplessUser.token);
    };
  }, []);

  return (
    <>
      {/* <div className='login w-screen h-screen'>
        <section
          style={{ marginBottom: 50 }}
          className=' px-20 lg:px-40 flex justify-center lg:justify-end  gap-3'
        >
          <Card className='w-[80%] xl:w-[35%] mt-[8%] bg-transparent font-duplet-semi shadow-none'>
            <div className='mt-[15%] mb-[15%]'>
              <div style={{ marginTop: 20 }} id='otpless-login-page'></div>
            </div>
          </Card>
        </section>
      </div> */}
      {/* <div className='login w-screen h-screen'>
        <section
          style={{ marginBottom: 50 }}
          className=' px-20 lg:px-40 flex justify-center lg:justify-end  gap-3'
        >
          <Card className='w-[80%] xl:w-[35%] mt-[8%] bg-transparent font-duplet-semi shadow-none'>
            <div className='mt-[15%] mb-[15%]'>
              <div style={{ marginTop: 20 }} id='otpless-login-page'></div>
            </div>
          </Card>
        </section>
      </div> */}

      <div className='login flex min-h-screen bg-cover bg-center'>
        <section className='flex items-center justify-center w-full  md:px-8 lg:px-12'>
          <div className=''>
            <div id='otpless-login-page'></div>
          </div>
        </section>
      </div>

      <Toaster
        position='top-center'
        toastOptions={{ duration: 3000 }}
        reverseOrder={false}
      />
    </>
  );
}
