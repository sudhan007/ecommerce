"use client";

import { axios } from "@/lib/axios";
import { config } from "@/lib/config";
import { Icon } from "@iconify/react";
import { Card } from "@nextui-org/card";
import { CircularProgress } from "@nextui-org/progress";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function Dashboard() {
  const [data, setData] = useState<any>([]);
  const [isloading, setIsloading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.baseUrl}user/getallcounts`, {
        withCredentials: true,
      });
      console.log(response.data);
      setData(response.data);
      setIsloading(true);
    } catch (error: any) {
      if (error.message === "Network Error") {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
      setData({});
      setIsloading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className='p-5'>
        {isloading ? (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center py-5'>
              <Card className='bg-[#FFF5E1] text-black w-full md:w-[300px] p-5 border rounded-md shadow-md hover:shadow-lg'>
                <div className='flex gap-3 items-center'>
                  <Icon className='text-3xl' icon={"raphael:users"} />
                  <h1 className='text-xl'>Customers</h1>
                </div>
                <div className='mt-5'>
                  <div className='text-4xl text-center'>{data?.userCount}</div>
                </div>
              </Card>
              <Card className='bg-[#FFF5E1] text-black w-full md:w-[300px] p-5 border rounded-md shadow-md hover:shadow-lg'>
                <div className='flex gap-3 items-center'>
                  <Icon
                    className='text-3xl'
                    icon={"carbon:ibm-data-product-exchange"}
                  />
                  <h1 className='text-xl'>Products</h1>
                </div>
                <div className='mt-5'>
                  <div className='text-4xl text-center'>
                    {data?.productCount}
                  </div>
                </div>
              </Card>
              <Card className='bg-[#FFF5E1] text-black w-full md:w-[300px] p-5 border rounded-md shadow-md hover:shadow-lg'>
                <div className='flex gap-3 items-center'>
                  <Icon className='text-3xl' icon={"bxs:category-alt"} />
                  <h1 className='text-xl'>Category</h1>
                </div>
                <div className='mt-5'>
                  <div className='text-4xl text-center'>
                    {data?.categoryCount}
                  </div>
                </div>
              </Card>
              <Card className='bg-[#FFF5E1] text-black w-full md:w-[300px] p-5 border rounded-md shadow-md hover:shadow-lg'>
                <div className='flex gap-3 items-center'>
                  <Icon
                    className='text-3xl'
                    icon={"pepicons-pop:cart-circle-filled"}
                  />
                  <h1 className='text-xl'>Orders</h1>
                </div>
                <div className='mt-5'>
                  <div className='text-4xl text-center'>{data?.orderCount}</div>
                </div>
              </Card>
            </div>

            {/* <div className='mt-5 grid grid-cols-1 md:grid-cols-2 items-center px-5'>
              <div>
                <UserChart />
              </div>
              <div>wd</div>
            </div> */}
          </>
        ) : (
          <div className=' bg-white flex justify-center'>
            <CircularProgress label='Hang on...' />
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
