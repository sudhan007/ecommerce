"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { axios } from "@/lib/axios";

function Footer() {
  const [details, setDetails] = useState<any>({});

  const fetchData = async () => {
    try {
      const response = await axios.get(`starexdetails/details`);
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
  const year = new Date().getFullYear();
  return (
    <>
      <div className='bg-footbg'>
        <footer className='container mx-auto pt-10 md:pt-20 pb-6 px-4 md:px-8 lg:px-8'>
          <div className='grid gap-13 md:grid-cols-2  lg:grid-cols-5 items-center'>
            <div className='mb-5 md:mb-0'>
              <div className='flex items-center'>
                <Image src='/icons/topicon.png' alt='' width={30} height={30} />
                <span className='ml-2 text-3xl font-duplet-semi text-footlogo'>
                  Starex
                </span>
              </div>
              <div className='flex  flex-wrap  md:flex-col items-start gap-2  mt-3'>
                <div className='text-xs md:text-lg pb-1 border-b font-duplet-semi text-footheading border-footborder'>
                  +91 &nbsp; {details?.phoneNumber}
                </div>
                <span className='text-lg text-foottext'>or</span>
                <div className='text-xs md:text-lg pb-1 border-b font-duplet-semi text-footheading border-footborder'>
                  {details?.email}
                </div>
              </div>
            </div>
            <nav className='mb-5 md:mb-0 mt-3 mb:mt-0  '>
              <h4 className='font-poppins font-medium text-xl text-footheading mb-4'>
                My Account
              </h4>
              <ul className='space-y-3 text-lg text-foottext font-duplet-reg'>
                <li>
                  <Link className='text-whitetext ' href='#'>
                    My Account
                  </Link>
                </li>
                <li>
                  <Link className='' href='#'>
                    Order History
                  </Link>
                </li>
                <li>
                  <Link className='' href='#'>
                    Shoping Cart
                  </Link>
                </li>
                <li>
                  <Link className='' href='#'>
                    Wishlist
                  </Link>
                </li>
              </ul>
            </nav>

            <nav className='mb-5 md:mb-0 mt-3 mb:mt-0 '>
              <h4 className='font-poppins font-medium text-xl text-footheading mb-4'>
                Helps
              </h4>
              <ul className='space-y-3 text-lg text-foottext font-duplet-reg'>
                <li>
                  <Link className='text-whitetext ' href='#'>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link className='' href='#'>
                    Faqs
                  </Link>
                </li>
                <li>
                  <Link className='' href='#'>
                    Terms & Condition
                  </Link>
                </li>
                <li>
                  <Link className='' href='#'>
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </nav>
            <nav className='mb-5 md:mb-0 mt-3 mb:mt-0 '>
              <h4 className='font-poppins font-medium text-xl text-footheading mb-4'>
                Proxy
              </h4>
              <ul className='space-y-3 text-lg text-foottext font-duplet-reg'>
                <li>
                  <Link className='text-whitetext ' href='#'>
                    About
                  </Link>
                </li>
                <li>
                  <Link className=' ' href='#'>
                    Shop
                  </Link>
                </li>
                <li>
                  <Link className=' ' href='#'>
                    Product
                  </Link>
                </li>
                <li>
                  <Link className=' ' href='#'>
                    Track Order
                  </Link>
                </li>
              </ul>
            </nav>
            <nav className='mb-5 md:mb-0 mt-3 mb:mt-0 '>
              <h4 className='font-poppins font-medium text-xl text-footheading mb-4'>
                Categories
              </h4>
              <ul className='space-y-3 text-lg text-foottext font-duplet-reg'>
                <li>
                  <Link className='text-whitetext ' href='#'>
                    Fruit & Vegetables
                  </Link>
                </li>
                <li>
                  <Link className=' ' href='#'>
                    Meat & Fish
                  </Link>
                </li>
                <li>
                  <Link className=' ' href='#'>
                    Bread & Bakery
                  </Link>
                </li>
                <li>
                  <Link className=' ' href='#'>
                    Beauty & Health
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className='mt-4 md:mt-14 border-t border-[#333333] pt-8 '>
            <div className='flex flex-col md:flex-row justify-between'>
              <div className='font-duplet-reg text-lg items-center text-foottext mb-3 md:mb-0'>
                Starex &copy; {year}. All Rights Reserved
              </div>
              <div className='grid md:grid-cols-5 items-center gap-2 md:gap-5'>
                <Image
                  className='p-1 border-2 border-[#333333]'
                  src='/icons/ApplePay.png'
                  width={50}
                  height={50}
                  alt=''
                />
                <Image
                  className='p-1 border-2 border-[#333333]'
                  src='/icons/visa-logo.png'
                  width={50}
                  height={50}
                  alt=''
                />
                <Image
                  className='p-1 border-2 border-[#333333]'
                  src='/icons/Discover.png'
                  width={50}
                  height={50}
                  alt=''
                />
                <Image
                  className='p-1 border-2 border-[#333333]'
                  src='/icons/Mastercard.png'
                  width={50}
                  height={50}
                  alt=''
                />
                <Image
                  className='p-1 border-2 border-[#333333]'
                  src='/icons/secure.png'
                  width={50}
                  height={50}
                  alt=''
                />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Footer;
