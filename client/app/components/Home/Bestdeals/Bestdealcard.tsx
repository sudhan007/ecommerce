import React from "react";
import Image from "next/image";
import bestdeal from "@/public/images/bestdeals.png";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";

export default function Bestdealcard() {
  return (
    <>
      <div className='mt-5 md:mt-10 grid grid-cols-1 md:grid-cols-2 bg-[#1A3824]  px-2 md:px-12 md:gap-x-10  font-duplet-semi'>
        <div className='px-4 text-center md:text-justify py-6 md:px-10 md:py-16'>
          <div className=' text-3xl md:text-4xl font-bold text-[#FFFFFF]'>
            <h1>Sale of the Month</h1>
          </div>
          <div className='mt-8 '>
            <div className='flex justify-center md:justify-normal flex-wrap gap-1 md:gap-4  text-[#F5F5F5] py-2  rounded-md'>
              <div className='flex flex-col items-center'>
                <span className='text-2xl md:text-3xl font-semibold'>00</span>
                <span className='uppercase mt-3 text-sm md:text-base tracking-widest'>
                  Days
                </span>
              </div>
              <span className='text-2xl font-light'>:</span>
              <div className='flex flex-col items-center'>
                <span className='text-2xl md:text-3xl font-semibold'>02</span>
                <span className='uppercase mt-3 text-sm md:text-base tracking-widest'>
                  Hours
                </span>
              </div>
              <span className='text-2xl font-light'>:</span>
              <div className='flex flex-col items-center'>
                <span className=' text-2xl md:text-3xl font-semibold'>18</span>
                <span className='uppercase mt-3 text-sm md:text-base tracking-widest'>
                  Mins
                </span>
              </div>
              <span className='text-2xl font-light'>:</span>
              <div className='flex flex-col items-center'>
                <span className='text-2xl md:text-3xl font-semibold'>46</span>
                <span className='uppercase mt-3 text-sm md:text-base tracking-widest'>
                  Secs
                </span>
              </div>
            </div>
          </div>
          <div className='mt-10 text-xl font-duplet-semi text-[#F5F5F5]'>
            <div>
              Save up to 60% off on <br /> your first order
            </div>
          </div>
          <div className='mt-10'>
            <Button
              className='text-shopbtn2 text-sm md:text-lg font-duplet-semi  bg-shopnow2 
                 py-6    '
              radius='sm'
              endContent={
                <Icon icon={"akar-icons:arrow-right"} width={20} height={20} />
              }
            >
              Shop Now
            </Button>
          </div>
        </div>
        <div>
          <Image src={bestdeal} alt='bestdeal' />
        </div>
      </div>
    </>
  );
}
