"use client";

import { Card, CardBody } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import { CircularProgress } from "@nextui-org/progress";
import React, { useEffect, useState } from "react";
import { config } from "@/lib/config";
import CategoryCard from "./CategoryCard";
import { axios } from "@/lib/axios";
import { useRouter } from "next/navigation";

function Categorycard() {
  const [categoriesLoaded, setCategoryLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const fetchData = async () => {
    try {
      const response = axios
        .get(`${config.baseUrl}category/all`)
        .then((res) => {
          return res;
        });

      let data = await response;

      if (data.status == 200) {
        setCategories(data.data.data);
        setCategoryLoading(true);
      }
    } catch (error) {
      console.log(error);
      setCategoryLoading(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleClick = (categoryId: any) => {
    router.push(`/categoryfilter/${categoryId}`);
    console.log("Category ID:", categoryId);
  };
  return (
    <>
      {categoriesLoaded ? (
        <section className=' minustop overflow-hidden px-3 md:px-8 lg:px-15 xl:px-20  mt-5 lg:mt-10 xl:mt-20 mb-10  '>
          <h1 className=' text-2xl text-[#253D4E] lg:text-4xl font-duplet-semi '>
            Explore Categories
          </h1>
          <div className='mt-10 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5'>
            {categories.length > 0 ? (
              categories.map((item: any) => (
                <CategoryCard
                  key={item._id}
                  categoriesLoaded={categoriesLoaded}
                  item={item}
                  onClick={() => handleClick(item._id)}
                />
              ))
            ) : (
              <section className='w-screen flex justify-center items-center'>
                <h1 className='text-2xl text-gray-500'>No Categories found</h1>
              </section>
            )}
          </div>
        </section>
      ) : (
        <section className='w-screen h-[300px] flex justify-center items-center'>
          <CircularProgress aria-labelledby='loading' color='primary' />
        </section>
      )}
    </>
  );
}

export default Categorycard;
