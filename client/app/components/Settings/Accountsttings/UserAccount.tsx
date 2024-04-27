import React from "react";
import { Navebar } from "../../Home/Navbar/Navebar";
import { Card, CardBody } from "@nextui-org/card";
import Image from "next/image";
import user from "@/public/images/user.png";
import { Icon } from "@iconify/react";

export default function UserAccount() {
  return (
    <>
      <section className="bg-green-500">
        {/* <div className='h-20 bg-blue-600'>
          <p>s</p>
        </div> */}
        <Navebar />
      </section>
      <main className="  px-2 md:px-10 container mx-auto mt-10 mb-10">
        <div className=" shadow-lg md:shadow-none border rounded-lg">
          <div className=" font-duplet-semi  px-2 g md:px-10 py-4 ">
            <div className="text-base md:text-2xl ">My Acdcount</div>
          </div>

          <div className="font-duplet-semi gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3   px-2 g md:px-10 py-4">
            <Card shadow="sm" radius="sm" className="border border-[#E6E6E6]">
              <div className="mt-10 mb-10">
                <div className="rounded-full flex justify-center ">
                  <Image
                    style={{ objectFit: "cover" }}
                    src={user}
                    alt=""
                    className="rounded-full h-40 w-40  lg:h-36 lg:w-36"
                  />
                </div>
                <div className="flex justify-center mt-4 font-duplet-semi text-[#1A1A1A] text-2xl">
                  <h1> Ansel Joseva </h1>
                </div>
                <div className="flex justify-center mt-4 font-duplet-semi cursor-pointer text-bacto text-xl">
                  <h1> Edit Profile </h1>
                </div>
              </div>
            </Card>
            <Card shadow="sm" radius="sm" className="border border-[#E6E6E6]">
              <div className="mt-8 mb-8 px-10">
                <div className=" font-duplet-semi text-[#999999] text-lg uppercase  ">
                  <h1>Billing Address</h1>
                </div>
                <div className=" mt-4 font-duplet-semi text-[#1A1A1A] text-2xl">
                  <h1> Ansel Joseva </h1>
                </div>
                <div className=" mt-3 font-duplet-reg cursor-pointer text-[#666666] text-lg">
                  <h1> 56/8, Krishnan Kovil Street, Nagercoil </h1>
                </div>
                <div className="mt-7 font-duplet-reg text-[#1A1A1A] text-xl">
                  <h1>ajaykumar58@gmail.com</h1>
                  <h3 className="mt-2">+91 8870635766</h3>
                </div>
                <div className=" mt-4 font-duplet-semi cursor-pointer text-bacto text-xl">
                  <h1> Edit Profile </h1>
                </div>
              </div>
            </Card>
            <Card>
              <div className="mt-10 mb-6 px-10 font-duplet-semi text-[#6B6B6B] text-xl">
                <section className="flex justify-between items-center ">
                  <div>Orders</div>
                  <div>
                    <Icon
                      className="text-3xl"
                      icon={"lets-icons:arrow-drop-right"}
                    />
                  </div>
                </section>
                <section className="flex mt-8 justify-between items-center ">
                  <div>Orders</div>
                  <div>
                    <Icon
                      className="text-3xl"
                      icon={"lets-icons:arrow-drop-right"}
                    />
                  </div>
                </section>
                <section className="flex mt-8 justify-between items-center ">
                  <div>Orders</div>
                  <div>
                    <Icon
                      className="text-3xl"
                      icon={"lets-icons:arrow-drop-right"}
                    />
                  </div>
                </section>
                <section className="flex mt-8 justify-between items-center ">
                  <div>Orders</div>
                  <div>
                    <Icon
                      className="text-3xl"
                      icon={"lets-icons:arrow-drop-right"}
                    />
                  </div>
                </section>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
