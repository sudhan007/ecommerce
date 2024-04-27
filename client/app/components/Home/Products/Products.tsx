"use client";
import React, { useState, useEffect, useRef } from "react";
import { Tabs, Tab } from "@nextui-org/tabs";
import { config } from "@/lib/config";
import { ProductsCard } from "./ProductCard";
import { CircularProgress } from "@nextui-org/progress";
import { axios } from "@/lib/axios";
import { makeFirstLetterCapital } from "@/app/components/Makecapitalize";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Button } from "@nextui-org/button";
import { useScrollIntoView } from "@mantine/hooks";
import { useRouter } from "next/navigation";

function Productcard() {
  const router = useRouter();
  const [key, setKey] = useState<string>("");
  const limit = 16;

  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLButtonElement>({
    offset: 10,
  });

  const {
    data: category,
    isLoading: categoriesLoaded,
    error: categoryError,
  } = useQuery<any>({
    queryKey: ["category"],
    queryFn: () => axios.get<any>(`/category/all?limit=${6}`),
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
    queryKey: ["products", key],
    queryFn: async ({ pageParam = 1 }) => {
      let res = await axios.get<any>(
        `/product/filter?category=${key}&page=${pageParam}&limit=${30}`
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

  console.log(products, "dwe");

  return (
    <>
      <main className=' overflow-x-hidden px-2 md:px-3 lg:px-6 xl:px-8  lg:mt-10  '>
        <div className='flex flex-col w-[95%] m-auto'>
          <h1 className='text-2xl md:text-3xl lg:text-4xl text-prodheading font-duplet-semi'>
            Popular Products
          </h1>
          {!categoriesLoaded ? (
            <Tabs
              className='justify-end mt-3'
              aria-label='Options'
              variant='underlined'
              color='success'
              onSelectionChange={(key) => {
                setKey(key.toString());
              }}>
              <Tab
                className='font-duplet-reg text-[#253D4E] text-lg font-normal'
                key={"all"}
                title={"All"}>
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
                      <h1 className='text-xl text-gray-500'>
                        No products found
                      </h1>
                    </section>
                  ) : (
                    <>
                      {[1, 2, 3].map((item, idx) => (
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
                </div>

                {hasNextPage && (
                  <div
                    ref={lastRef}
                    className='w-full flex justify-center items-center py-4'>
                    <CircularProgress label='Loading...' />
                  </div>
                )}
              </Tab>
              {category.data.data.map((category: any) => (
                <Tab
                  className='font-duplet-reg text-[#253D4E]   text-lg  font-normal '
                  key={category._id}
                  title={makeFirstLetterCapital(category.categoryName)}>
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
                        <h1 className='text-xl text-gray-500'>
                          No products found
                        </h1>
                      </section>
                    ) : (
                      <>
                        {[1, 2, 3].map((item, idx) => (
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
                  </div>

                  {hasNextPage && (
                    <div
                      ref={lastRef}
                      className='w-full flex justify-center items-center py-4'>
                      <CircularProgress label='hang on' />
                    </div>
                  )}
                </Tab>
              ))}
            </Tabs>
          ) : (
            <div className='w-screen h-[300px] flex justify-center items-center'>
              <CircularProgress aria-labelledby='loading' color='primary' />
            </div>
          )}
        </div>
        <div className='flex justify-center'>
          <Button
            className='bg-[#00B207] text-white'
            onClick={() => router.push("/products")}>
            All Products
          </Button>
        </div>
      </main>
    </>
  );
}

export default Productcard;
