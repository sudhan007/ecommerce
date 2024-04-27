"use client";
import Categories from "@/app/components/Home/Categories/Categories";
import Footer from "@/app/components/Home/Footer";
import Products from "@/app/components/Home/Products/Products";
import Offers from "@/app/components/Home/Offers/Offers";
import { Navebar } from "@/app/components/Home/Navbar/Navebar";
import BestDeals from "@/app/components/Home/Bestdeals/BestDeals";
import Shoppingcart from "@/app/components/Home/Cart/Shoppingcart";
import Hotdeals from "@/app/components/Home/HotDeals/HotDeals";
import { useScrollIntoView } from "@mantine/hooks";
import { useEffect } from "react";
function Homepage() {
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 0,
  });

  useEffect(() => {
    scrollIntoView();
  }, []);

  return (
    <div>
      <div className='w-full navhero overflow-y-hidden' ref={targetRef}>
        <Navebar transparentBg={true} />
        <div className='flex  md:justify-center items-center'>
          <div className='ml-5 mt-5 lg:mt-16 lg:mr-16 xl:mt-32 xl:mr-52'>
            <span className=' text-3xl md:text-3xl lg:text-3xl xl:text-6xl font-duplet-semi text-[#FFFFFF] '>
              Grocery
            </span>
            <div className='mt-3 py-2 p-1  rounded-lg text-center bg-[#134700] text-xl lg:text-3xl  xl:text-5xl text-offer font-duplet-semi text-[700]'>
              30% OFF
            </div>
          </div>
        </div>
      </div>

      <Categories />
      <Products />
      <Hotdeals />
      {/* <Offers /> */}
      {/* <BestDeals /> */}
      <Footer />
    </div>
  );
}

export default Homepage;
