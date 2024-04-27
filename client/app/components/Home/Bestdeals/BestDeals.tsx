import React from "react";
import Bestdealcard from "./Bestdealcard";

function BestDeals() {
  return (
    <>
      <main className='  md:px-3 lg:px-6 xl:px-8  mt-5 lg:mt-10  mb-10  '>
        <div className=' px-5 md:px-12 '>
          <h1 className='text-2xl text-[#253D4E] text-center md:text-left lg:text-4xl text-offerheading font-duplet-semi'>
            Best Deals
          </h1>
        </div>
        <Bestdealcard />
      </main>
    </>
  );
}

export default BestDeals;
