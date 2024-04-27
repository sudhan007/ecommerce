import { Button } from "@nextui-org/button";
import React from "react";
import Image from "next/image";
import bag from "../../../../../public/images/bagvegetables.png";
import logo from "../../../../../public/images/webhero.png";
import mob from "../../../../../public/images/mobhero.png";
import { Icon } from "@iconify/react";
import Offercard from "./OffersCard";

export default function Offers() {
  return (
    <>
      <main className='  md:px-3 lg:px-6 xl:px-8  mt-5 lg:mt-10 xl:mt-24 mb-10  '>
        <div className=' px-5 md:px-12 '>
          <h1 className='text-3xl text-[#253D4E] text-center md:text-left lg:text-4xl text-offerheading font-duplet-semi'>
            Offers
          </h1>
        </div>
        <Offercard />
      </main>
    </>
  );
}
