"use client";
import { Navebar } from "@/app/components/Home/Navbar/Navebar";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/Home/Footer";
import { axios } from "@/lib/axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useUserStore } from "@/stores/UserStore";
import { ProductsCard } from "@/app/components/Home/Products/ProductCard";
import { CircularProgress } from "@nextui-org/progress";
import { Tabs, Tab } from "@nextui-org/tabs";
import { get, save } from "@/lib/storage";
import { Button } from "@nextui-org/button";
import { makeFirstLetterCapital } from "@/app/components/Makecapitalize";
import { Icon } from "@iconify/react";
import { useIntersection, useScrollIntoView } from "@mantine/hooks";
import { Card, CardFooter, CardHeader } from "@nextui-org/card";
import Image from "next/image";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
export default function Hotdeals() {
  const [page, setPage] = useState<number>(1);
  const router = useRouter();
  const limit = 16;

  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLButtonElement>({
    offset: 10,
  });

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
        `/product/hotdeal/all?page=${pageParam}&limit=${limit}`
      );
      return res?.data?.deals;
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
      <main className=' px-2 md:px-3 lg:px-6 xl:px-8  mt-5 lg:mt-10 xl:mt-24 mb-10  '>
        <div className=' px-5 md:px-12 '>
          <h1 className='text-2xl md:text-3xl lg:text-4xl text-prodheading font-duplet-semi'>
            Hot Deals
          </h1>
        </div>
        <div className='grid mt-4 items-center gap-2 gap-y-4 justify-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 '>
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
      </main>
    </>
  );
}
