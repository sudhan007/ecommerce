"use client";
import { Navebar } from "@/app/components/Home/Navbar/Navebar";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { axios } from "@/lib/axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ProductsCard } from "@/app/components/Home/Products/ProductCard";
import { CircularProgress } from "@nextui-org/progress";
import { Button } from "@nextui-org/button";
import { Icon } from "@iconify/react";
import { useScrollIntoView } from "@mantine/hooks";

const CategoryFilter = ({ params }: any) => {
  const router = useRouter();
  const limit = 16;

  const {
    data: products,
    fetchNextPage,
    hasNextPage,
    isLoading: productsLoaded,
    isFetchingNextPage,
    refetch,
    error: productsError,
  } = useInfiniteQuery<any>({
    queryKey: ["products"],
    queryFn: async ({ pageParam = 1 }) => {
      let res = await axios.get<any>(
        `/product/filter?category=${params.categoryid}&page=${pageParam}&limit=${limit}`
      );

      return res.data?.data;
    },
    getNextPageParam: (_, pages) => {
      if (pages[pages.length - 1].length < limit) {
        return undefined;
      }
      return pages.length + 1;
    },
    initialPageParam: 1,
  });

  const _products: any = products?.pages.flatMap((page) => page);

  const lastRef = useRef<HTMLDivElement>(null);

  const interSectionCallback = (entries: any) => {
    const [entry] = entries;

    console.log(entry.isIntersecting);

    if (entry.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  };

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(interSectionCallback, options);
    const lastElement = lastRef.current;
    if (lastElement) {
      observer.observe(lastElement);
    }
    return () => {
      if (lastElement) {
        observer.unobserve(lastElement);
      }
    };
  }, [lastRef, hasNextPage]);

  return (
    <>
      <section className='bg-[#1A3824]'>
        <Navebar />
      </section>

      <main className='pb-3 overflow-x-hidden px-2 md:px-3 lg:px-6 xl:px-8  lg:mt-10  '>
        <div className='flex flex-col w-[95%] m-auto'>
          <Button
            className='bg-[#0EA829] mt-3'
            isIconOnly
            onClick={() => router.back()}
          >
            <Icon
              icon='ic:round-arrow-back'
              className='cursor-pointer text-white'
            />
          </Button>
          <div className='grid items-center gap-2 gap-y-4 justify-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 '>
            {!productsLoaded && _products?.length > 0 ? (
              _products?.map((product: any, idx: number) => {
                return (
                  <ProductsCard
                    key={product._id}
                    {...product}
                    isLoading={!productsLoaded}
                  />
                );
              })
            ) : !productsLoaded && _products?.length === 0 ? (
              <section className='w-screen flex justify-center items-center'>
                <h1 className='text-xl text-gray-500'>No products found</h1>
              </section>
            ) : (
              <>
                {[Array.from({ length: limit })].map((item, idx) => (
                  <ProductsCard
                    productName='Loading...'
                    discount={0}
                    isLoading={false}
                    image=''
                    originalPrice={1}
                    price={2}
                    _id=''
                    key={idx}
                  />
                ))}
              </>
            )}

            {isFetchingNextPage && (
              <>
                {Array.from({ length: limit }).map((item, idx) => (
                  <ProductsCard
                    productName='Loading...'
                    discount={0}
                    isLoading={false}
                    image=''
                    originalPrice={1}
                    price={2}
                    _id=''
                    key={idx}
                  />
                ))}
              </>
            )}

            {hasNextPage && (
              <div
                ref={lastRef}
                className='w-full flex justify-center items-center'
              >
                <CircularProgress label='hang on' />
              </div>
            )}
          </div>
          {isFetchingNextPage && (
            <div className='flex justify-center items-center h-10'>
              <CircularProgress label='hang on' />
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default CategoryFilter;
