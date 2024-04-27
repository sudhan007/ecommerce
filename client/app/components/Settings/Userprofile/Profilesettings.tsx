import React from "react";
import { Navebar } from "../../Home/Navbar/Navebar";
import Image from "next/image";
// import user from "@/public/images/photo-1494790108377-be9c29b29330.jpg";
import user from "@/public/images/user.png";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";

export default function ProfileSettings() {
  return (
    <>
      <section className='bg-green-500'>
        {/* <div className='h-20 bg-blue-600'>
          <p>s</p>
        </div> */}
        <Navebar />
      </section>

      <main className=' px-2 md:px-10 container mx-auto mt-10 mb-10'>
        <div className=' shadow-lg md:shadow-none border rounded-lg'>
          <div className=' font-duplet-semi border-b px-2 gap-1 md:px-10 py-4 flex justify-between'>
            <div className='text-base md:text-xl '>Account Settings</div>
            <div className='text-base md:text-xl text-bacto'>Back to List</div>
          </div>
          <div className='grid px-2 md:px-10 grid-cols-1 md:grid-cols-2 justify-evenly  p-4'>
            <div className=''>
              <div className='rounded-full flex justify-center md:flex-none md:justify-normal'>
                <Image
                  style={{ objectFit: "cover" }}
                  src={user}
                  alt=''
                  className='rounded-full h-40 w-40  lg:h-96 lg:w-96'
                />
              </div>
              <div className='mt-7 flex font-poppins justify-center md:flex-none md:justify-normal md:ml-6 lg:ml-28'>
                <Button
                  className='text-bacto font-poppins font-bold border-bacto'
                  size='lg'
                  radius='sm'
                  variant='bordered'
                >
                  Choose Image
                </Button>
              </div>
            </div>
            <div>
              <form action=''>
                <div className='mt-7 md:mt-5 mb-2'>
                  <label className='text-label  text-lg  font-duplet-reg '>
                    First Name
                  </label>

                  <Input
                    type='email'
                    variant='bordered'
                    radius='sm'
                    className='text-formtext'
                    style={{
                      width: "100%",
                      outline: "none",
                      backgroundColor: "white !important",
                      fontSize: "20px",
                      fontFamily: "duplet-semibold",
                      borderColor: "#E6E6E6",
                    }}
                  />
                </div>
                <div className='mt-3 mb-2'>
                  <label className='text-label  text-base md:text-lg font-duplet-reg '>
                    Last Name
                  </label>

                  <Input
                    type='email'
                    variant='bordered'
                    radius='sm'
                    className='text-formtext'
                    style={{
                      width: "100%",
                      outline: "none",
                      backgroundColor: "white !important",
                      fontSize: "20px",
                      fontFamily: "duplet-semibold",
                      borderColor: "#E6E6E6",
                    }}
                  />
                </div>
                <div className='mt-3 mb-2'>
                  <label className='text-label   text-base md:text-lg  font-duplet-reg '>
                    Email
                  </label>

                  <Input
                    type='email'
                    variant='bordered'
                    radius='sm'
                    className='text-formtext'
                    style={{
                      width: "100%",
                      outline: "none",
                      backgroundColor: "white !important",
                      fontSize: "20px",
                      fontFamily: "duplet-semibold",
                      borderColor: "#E6E6E6",
                    }}
                  />
                </div>
                <div className='mt-3 mb-2'>
                  <label className='text-label  text-base md:text-lg font-duplet-reg '>
                    Phone Number
                  </label>

                  <Input
                    type='email'
                    variant='bordered'
                    radius='sm'
                    className='text-formtext'
                    style={{
                      width: "100%",
                      outline: "none",
                      backgroundColor: "white !important",
                      fontSize: "20px",
                      fontFamily: "duplet-semibold",
                      borderColor: "#E6E6E6",
                    }}
                  />
                </div>

                <div className='mt-7 flex justify-center'>
                  <Button
                    size='lg'
                    radius='sm'
                    className='bg-bacto font-poppins font-bold text-[#FFFFFF]'
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <section className='mt-10'>
          <div className=' shadow-lg md:shadow-none border rounded-lg'>
            <div className=' font-duplet-semi border-b px-2 gap-1 md:px-10 py-4 '>
              <div className='text-base md:text-xl '>Account Settings</div>
            </div>

            <form action=''>
              <div className='grid px-2 md:px-10 md:gap-4 grid-cols-1 items-center md:grid-cols-3 justify-evenly  p-4'>
                <div className='mt-3  mb-2'>
                  <label className='text-label  text-base md:text-lg  font-duplet-reg '>
                    First Name
                  </label>

                  <Input
                    type='email'
                    variant='bordered'
                    radius='sm'
                    className='text-formtext'
                    style={{
                      width: "100%",
                      outline: "none",
                      backgroundColor: "white !important",
                      fontSize: "20px",
                      fontFamily: "duplet-semibold",
                      borderColor: "#E6E6E6",
                    }}
                  />
                </div>
                <div className='mt-3 mb-2'>
                  <label className='text-label   text-base md:text-lg  font-duplet-reg '>
                    Last Name
                  </label>

                  <Input
                    type='email'
                    variant='bordered'
                    radius='sm'
                    className='text-formtext'
                    style={{
                      width: "100%",
                      outline: "none",
                      backgroundColor: "white !important",
                      fontSize: "20px",
                      fontFamily: "duplet-semibold",
                      borderColor: "#E6E6E6",
                    }}
                  />
                </div>
                <div className='mt-3 mb-2'>
                  <label className='text-label   text-base md:text-lg font-duplet-reg '>
                    Company Name
                  </label>

                  <Input
                    type='email'
                    variant='bordered'
                    radius='sm'
                    className='text-formtext'
                    style={{
                      width: "100%",
                      outline: "none",
                      backgroundColor: "white !important",
                      fontSize: "20px",
                      fontFamily: "duplet-semibold",
                      borderColor: "#E6E6E6",
                    }}
                  />
                </div>
              </div>
              <div className='px-2 md:px-10'>
                <div className='mt-3 mb-2'>
                  <label className='text-label   text-base md:text-lg  font-duplet-reg '>
                    Street Address
                  </label>
                  <Textarea
                    variant='bordered'
                    className='text-formtext w-full'
                    style={{
                      width: "100%",
                      outline: "none",
                      backgroundColor: "white !important",
                      fontSize: "18px",
                      fontFamily: "duplet-semibold",
                      borderColor: "#E6E6E6",
                    }}
                  />
                </div>
              </div>
              <div className='grid px-2 md:px-10 md:gap-4 grid-cols-1 items-center md:grid-cols-3 justify-evenly  p-4'>
                <div className='mt-3  mb-2'>
                  <label className='text-label  text-base md:text-lg  font-duplet-reg '>
                    First Name
                  </label>

                  <Input
                    type='email'
                    variant='bordered'
                    radius='sm'
                    className='text-formtext'
                    style={{
                      width: "100%",
                      outline: "none",
                      backgroundColor: "white !important",
                      fontSize: "20px",
                      fontFamily: "duplet-semibold",
                      borderColor: "#E6E6E6",
                    }}
                  />
                </div>
                <div className='mt-3 mb-2'>
                  <label className='text-label   text-base md:text-lg  font-duplet-reg '>
                    Last Name
                  </label>

                  <Input
                    type='email'
                    variant='bordered'
                    radius='sm'
                    className='text-formtext'
                    style={{
                      width: "100%",
                      outline: "none",
                      backgroundColor: "white !important",
                      fontSize: "20px",
                      fontFamily: "duplet-semibold",
                      borderColor: "#E6E6E6",
                    }}
                  />
                </div>
                <div className='mt-3 mb-2'>
                  <label className='text-label   text-base md:text-lg font-duplet-reg '>
                    Company Name
                  </label>

                  <Input
                    type='email'
                    variant='bordered'
                    radius='sm'
                    className='text-formtext'
                    style={{
                      width: "100%",
                      outline: "none",
                      backgroundColor: "white !important",
                      fontSize: "20px",
                      fontFamily: "duplet-semibold",
                      borderColor: "#E6E6E6",
                    }}
                  />
                </div>
              </div>

              <div className='grid px-2 md:px-10 md:gap-4 grid-cols-1 items-center md:grid-cols-2 justify-evenly  p-4'>
                <div className='mt-3  mb-2'>
                  <label className='text-label  text-base md:text-lg  font-duplet-reg '>
                    First Name
                  </label>

                  <Input
                    type='email'
                    variant='bordered'
                    radius='sm'
                    className='text-formtext'
                    style={{
                      width: "100%",
                      outline: "none",
                      backgroundColor: "white !important",
                      fontSize: "20px",
                      fontFamily: "duplet-semibold",
                      borderColor: "#E6E6E6",
                    }}
                  />
                </div>
                <div className='mt-3 mb-2'>
                  <label className='text-label   text-base md:text-lg  font-duplet-reg '>
                    Last Name
                  </label>

                  <Input
                    type='email'
                    variant='bordered'
                    radius='sm'
                    className='text-formtext'
                    style={{
                      width: "100%",
                      outline: "none",
                      backgroundColor: "white !important",
                      fontSize: "20px",
                      fontFamily: "duplet-semibold",
                      borderColor: "#E6E6E6",
                    }}
                  />
                </div>
              </div>
              <div className='mt-2 flex justify-center md:flex-none md:justify-normal md:px-10 mb-3 px-'>
                <Button
                  size='lg'
                  radius='sm'
                  className='bg-bacto font-poppins font-bold text-[#FFFFFF]'
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </section>

        <aside className='mt-10'>
          <div className=' shadow-lg md:shadow-none border rounded-lg'>
            <div className=' font-duplet-semi border-b px-2 gap-1 md:px-10 py-4 '>
              <div className='text-base md:text-xl '>Change Password</div>
            </div>

            <form action=''>
              <div className='grid px-2 md:px-10   p-4'>
                <div className='mt-3  mb-2'>
                  <label className='text-label  text-base md:text-lg  font-duplet-reg '>
                    First Name
                  </label>

                  <Input
                    type='email'
                    variant='bordered'
                    radius='sm'
                    className='text-formtext'
                    style={{
                      width: "100%",
                      outline: "none",
                      backgroundColor: "white !important",
                      fontSize: "20px",
                      fontFamily: "duplet-semibold",
                      borderColor: "#E6E6E6",
                    }}
                  />
                </div>
              </div>

              <div className='grid px-2 md:px-10 md:gap-4 grid-cols-1 items-center md:grid-cols-2 justify-evenly  '>
                <div className='mt-3  mb-2'>
                  <label className='text-label  text-base md:text-lg  font-duplet-reg '>
                    First Name
                  </label>

                  <Input
                    type='email'
                    variant='bordered'
                    radius='sm'
                    className='text-formtext'
                    style={{
                      width: "100%",
                      outline: "none",
                      backgroundColor: "white !important",
                      fontSize: "20px",
                      fontFamily: "duplet-semibold",
                      borderColor: "#E6E6E6",
                    }}
                  />
                </div>
                <div className='mt-3 mb-2'>
                  <label className='text-label   text-base md:text-lg  font-duplet-reg '>
                    Last Name
                  </label>

                  <Input
                    type='email'
                    variant='bordered'
                    radius='sm'
                    className='text-formtext'
                    style={{
                      width: "100%",
                      outline: "none",
                      backgroundColor: "white !important",
                      fontSize: "20px",
                      fontFamily: "duplet-semibold",
                      borderColor: "#E6E6E6",
                    }}
                  />
                </div>
              </div>

              <div className='mt-2 flex justify-center md:flex-none md:justify-normal md:px-10 mb-3 px-'>
                <Button
                  size='lg'
                  radius='sm'
                  className='bg-bacto font-poppins font-bold text-[#FFFFFF]'
                >
                  Change Password
                </Button>
              </div>
            </form>
          </div>
        </aside>
      </main>
    </>
  );
}
