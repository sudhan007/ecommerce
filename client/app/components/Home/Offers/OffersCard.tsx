// import { Icon } from "@iconify/react";
// import { Button } from "@nextui-org/button";
// import React, { useEffect } from "react";
// import Image from "next/image";
// import { useQuery } from "@tanstack/react-query";
// import { axios } from "@/lib/axios";
// import { Skeleton } from "@nextui-org/skeleton";
// import { config } from "@/lib/config";
// import { ImageWithFallback } from "../../ImageWithFallback";

// function Offercard() {
//   const {
//     data: offers,
//     isLoading: offersLoaded,
//     error: offersError,
//   } = useQuery<any>({
//     queryKey: ["Offers"],
//     queryFn: () => axios.get<any>(`/offer/all`),
//   });

//   return (
//     <div>
//       <div className='mt-5 md:mt-10 grid grid-cols-1 lg:grid-cols-2  md:px-12 md:gap-x-10 '>
//         {offers?.data?.data.map((offer: any) => (
//           <div key={offer?._id} className=' bg-offercardbg1 rounded-sm '>
//             <div className='mt-5 md:mt-10 px-3 md:px-16 mb-5 '>
//               <Button
//                 size='sm'
//                 disabled
//                 className='text-[#FFFFFF] text-lg  bg-freedelivery1 font-duplet-semi '
//                 radius='sm'
//               >
//                 Free delivery
//               </Button>

//               <div className='flex mt-5  items-center  justify-between'>
//                 <div>
//                   <h1 className=' text-3xl sm:text-5xl font-[700]    text-offerheading1 font-duplet-semi    '>
//                     {offer?.name}
//                   </h1>
//                   <h2 className='mt-5 font-duplet-semi text-offerdescription1 text-base md:text-xl'>
//                     {offer?.description}
//                   </h2>
//                   <div className='mt-10'>
//                     <Button
//                       className='text-[#FFFFFF] text-lg font-duplet-semi  bg-shopnow1
//                  py-6    '
//                       radius='sm'
//                       endContent={
//                         <Icon
//                           icon={"akar-icons:arrow-right"}
//                           width={20}
//                           height={20}
//                         />
//                       }
//                     >
//                       Shop Now
//                     </Button>
//                   </div>
//                 </div>
//                 <div className='items-center'>
//                   <Image
//                     alt='offers'
//                     src={`${config.baseUrl}files/view?image=${offer?.image}`}
//                     width={300}
//                     height={300}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Offercard;

import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { config } from "@/lib/config";
import { ImageWithFallback } from "../../ImageWithFallback";
import { axios } from "@/lib/axios";

function Offercard() {
  const [offer, setOffer] = useState<any>([]);
  const fetchData = async () => {
    try {
      const response = await axios.get(`/offer/all`);
      console.log(response.data.data);
      setOffer(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className='mt-5 md:mt-10 grid grid-cols-1 lg:grid-cols-2  md:px-12 md:gap-x-10 '>
        {offer.length > 0 ? (
          offer?.map((offer: any) => (
            <div key={offer?._id} className=' bg-offercardbg1 rounded-sm '>
              <div className='mt-5 md:mt-10 px-3 md:px-16 mb-5 '>
                <Button
                  size='sm'
                  disabled
                  className='text-[#FFFFFF] text-lg  bg-freedelivery1 font-duplet-semi '
                  radius='sm'
                >
                  Free delivery
                </Button>

                <div className='flex mt-5  items-center  justify-between'>
                  <div>
                    <h1 className=' text-3xl sm:text-5xl font-[700]    text-offerheading1 font-duplet-semi    '>
                      {offer?.name}
                    </h1>
                    <h2 className='mt-5 font-duplet-semi text-offerdescription1 text-base md:text-xl'>
                      {offer?.description}
                    </h2>
                    <div className='mt-10'>
                      <Button
                        className='text-[#FFFFFF] text-lg font-duplet-semi  bg-shopnow1
               py-6    '
                        radius='sm'
                        endContent={
                          <Icon
                            icon={"akar-icons:arrow-right"}
                            width={20}
                            height={20}
                          />
                        }
                      >
                        Shop Now
                      </Button>
                    </div>
                  </div>
                  <div className='items-center'>
                    <Image
                      alt='offers'
                      src={`${config.baseUrl}files/view?image=${offer?.image}`}
                      width={300}
                      height={300}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1 className='text-2xl text-gray-500'>No offers found</h1>
        )}
      </div>
    </div>
  );
}

export default Offercard;
