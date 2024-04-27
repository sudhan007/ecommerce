"use client";

import Footer from "@/app/components/Home/Footer";
import { Navebar } from "@/app/components/Home/Navbar/Navebar";
import { ProductsCard } from "@/app/components/Home/Products/ProductCard";
import { axios } from "@/lib/axios";
import { Icon } from "@iconify/react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { useEffect, useRef, useState } from "react";
import { CircularProgress } from "@nextui-org/progress";
import { Button } from "@nextui-org/button";

export default function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const limit = 10;
  console.log(query);
  const {
    data: products,
    fetchNextPage,
    hasNextPage,
    isLoading: productsLoading,
    isFetchingNextPage,
    refetch,
    error: productsError,
  } = useInfiniteQuery<any>({
    queryKey: ["search"],
    queryFn: async ({ pageParam = 1 }) => {
      let res = await axios.get<any>(
        // `/product/search?query=${query}&page=${pageParam}&limit=${limit}`
        `/product/all?search=${query}&page=${pageParam}&limit=${limit}`
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

  const [selectedKeys, setSelectedKeys] = useState(new Set(["1"]));

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

  return (
    <div className=''>
      <section className='bg-[#1A3824]'>
        <Navebar />
      </section>
      <div className='overflow-x-hidden'>
        <div className=' overflow-x-hidden px-2 md:px-3 lg:px-6 xl:px-8 mt-5  lg:mt-10 '>
          <div className='p-2'>
            <Button
              onClick={() => router.back()}
              className='bg-[#00B207]'
              isIconOnly
            >
              <Icon className='text-xl text-white' icon='ic:round-arrow-back' />
            </Button>
          </div>
          <div className=' px-4'>
            {!query ? (
              <div className='flex flex-col items-center justify-center  py-6 space-y-4 md:py-12 lg:space-y-6'>
                <div className='flex flex-col items-center justify-center space-y-2'>
                  <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
                    No results found
                  </h1>
                  <p className='text-gray-500'>
                    Your search returned no results. Please try again with a
                    different search term.
                  </p>
                </div>
              </div>
            ) : (
              <div className='min-h-[400px]'>
                {!productsLoading && _products?.length > 0 && (
                  <>
                    <div className='p-2 flex items-center gap-2 justify-between'>
                      <h1 className='text-lg font-bold tracking-tighter sm:text-3xl text-gray-500'>
                        Search Results for "{query}"
                      </h1>

                      {/* <span
                        className='flex text-gray-500 items-center gap-2 cursor-pointer'
                        onClick={() => {
                          if (selectedKeys.has("1")) {
                            setSelectedKeys(new Set());
                          } else {
                            setSelectedKeys(new Set(["1"]));
                          }
                        }}
                      >
                        Filter
                        <Icon icon='mage:filter' className=' text-2xl' />
                      </span> */}
                    </div>

                    <Accordion
                      selectedKeys={selectedKeys}
                      onSelectionChange={(e: any): any => {
                        setSelectedKeys(e);
                      }}
                      hideIndicator
                    >
                      <AccordionItem
                        key='1'
                        aria-label='Hidden'
                        title=''
                      ></AccordionItem>
                    </Accordion>
                  </>
                )}
                <div className='grid items-center gap-2 gap-y-4 justify-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-5'>
                  {!productsLoading && _products?.length > 0 ? (
                    _products?.map((product: any, idx: number) => {
                      return (
                        <ProductsCard
                          key={product._id}
                          {...product}
                          isLoading={!productsLoading}
                        />
                      );
                    })
                  ) : (
                    <div className='w-full text-center'>
                      <h1 className='text-2xl font-bold text-slate-500'>
                        No results found for "{query}"
                      </h1>
                      <p>Please try again with a different search term.</p>
                    </div>
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
                      className='w-full flex justify-center items-center py-4'
                    >
                      <CircularProgress label='Loading...' />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
