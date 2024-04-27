"use client";
import { ImageWithFallback } from "@/app/components/ImageWithFallback";
import { axios } from "@/lib/axios";
import { config } from "@/lib/config";
import { get } from "@/lib/storage";
import { useCartStore } from "@/stores/CartStore";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";
import React, { useEffect, useState } from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/stores/UserStore";
import { CircularProgress } from "@nextui-org/progress";
export default function Shoppingcart() {
  const router = useRouter();

  const iscartOpen = useCartStore((state) => state.iscartOpen);
  const toggleDrawer = () => {
    useCartStore.setState({ iscartOpen: !true });
  };

  const [isMobileView, setIsMobileView] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobileView(window.innerWidth <= 768);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { products, totalPrice } = useCartStore();

  const handleDeleteCart = async (id: any) => {
    const newCart = products.filter((cart: any) => cart._id !== id);
    let newPrice = 0;

    for (let i = 0; i < newCart.length; i++) {
      newPrice += newCart[i].price;
    }
    useCartStore.setState({
      products: newCart,
      cartCount: newCart.length,
      totalPrice: newPrice,
    });
    let res = await axios.post("/cart/add ", {
      userId: useUserStore.getState().user._id,
      products: newCart,
      totalPrice: newPrice,
    });

    if (res.status === 200) {
      toast.success("Product removed from cart");
    } else {
      // remove it from cart
      let newUpdatedProducts = useCartStore
        .getState()
        .products.filter((product: any) => product._id !== id._id);

      useCartStore.setState({
        products: newUpdatedProducts,
        iscartOpen: true,
        totalPrice: totalPrice,
        cartCount: newUpdatedProducts.length,
      });
      toast.error("Some thing went wrong");
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cart"],
    retry: 1,
    queryFn: async () => {
      const { data } = await axios.get(
        "/cart?userId=" + useUserStore.getState().user._id
      );
      return data;
    },
  });

  useEffect(() => {
    if (isLoading === false && data.data) {
      useCartStore.setState({
        products: data.data.products,
        cartCount: data.data.products.length,
        totalPrice: data.data.totalPrice,
      });
    }
    console.log(data, "ba");
  }, [data]);

  return (
    <>
      <Drawer
        open={iscartOpen}
        onClose={toggleDrawer}
        direction='right'
        style={{ overflowY: "scroll", overflowX: "hidden" }}
        size={isMobileView ? 300 : 700}
        lockBackgroundScroll={true}
      >
        {isLoading && (
          <div className='flex justify-center items-center h-screen'>
            <CircularProgress label='Hang On...' />
          </div>
        )}

        {products.length > 0 && !isLoading ? (
          <section>
            <div className='  flex px-10 mt-10 items-center justify-between'>
              <h1 className='text-xl md:text-3xl font-duplet-semi'>
                Shopping Cart ({products.length})
              </h1>
              <Icon
                className='text-xl cursor-pointer md:text-2xl text-closeicon'
                icon={"mdi:close"}
                onClick={toggleDrawer}
              />
            </div>
            <header>
              {products.map((product: any, index: any) => (
                <div
                  key={index}
                  className='border-b border-[#E6E6E6] pb-4 px-4 md:px-9 mt-5 flex justify-between items-center hover:shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)] cursor-pointer'
                >
                  <div className='flex items-center gap-5 md:gap-10'>
                    <div>
                      <ImageWithFallback
                        alt='product image'
                        fallbackSrc='/images/vegetables.png'
                        style={{
                          objectFit: "contain",
                          width: "100px",
                          height: "100px",
                        }}
                        src={
                          config.baseUrl + `files/view?image=${product?.image}`
                        }
                        // src='/images/vegetables.png'
                        width={200}
                        height={200}
                      />
                    </div>
                    <div>
                      <h3
                        style={{
                          textTransform: "capitalize",
                        }}
                        className=' text-base md:text-xl font-duplet-semi text-[#1A1A1A]'
                      >
                        {product?.name || product?.productName}
                      </h3>
                      <p className='text-base font-bold text-[#1A1A1A] font-duplet-semi'>
                        <span className='text-productquantiy'>
                          {product?.quantity} kg X
                        </span>{" "}
                        &nbsp; {product?.price?.toFixed(0)} ₹
                      </p>
                    </div>
                  </div>
                  <div>
                    <Icon
                      onClick={() => handleDeleteCart(product?._id)}
                      className='text-base cursor-pointer md:text-3xl text-prodcloseicon hover:text-red-500 transition-all duration-300'
                      icon={"simple-line-icons:close"}
                    />
                  </div>
                </div>
              ))}

              <footer className='px-6 md:px-16 mt-5 mb-5  w-full'>
                <div className='flex justify-between font-duplet-semi text-lg'>
                  <div>
                    {products.length} item{products.length > 1 ? "s" : ""}{" "}
                  </div>
                  <div>{totalPrice?.toFixed(0)} ₹ </div>
                </div>
                <div className='mt-5 text-lg '>
                  <Button
                    onClick={() => {
                      toggleDrawer();
                      router.push("/checkout");
                    }}
                    size='lg'
                    className='mb-2 font-poppins  font-bold bg-checkbtn text-[#FFFFFF] w-full'
                  >
                    Checkout
                  </Button>
                </div>
              </footer>
            </header>
          </section>
        ) : (
          <div className='overflow-y-hidden'>
            <div className='flex justify-end px-4 mt-4'>
              <Icon
                className='text-xl cursor-pointer md:text-2xl text-closeicon'
                icon={"mdi:close"}
                onClick={toggleDrawer}
              />
            </div>
            <div className='text-xl font-duplet-semi h-screen flex items-center justify-center '>
              Your cart is empty!
            </div>
          </div>
        )}
      </Drawer>
      <Toaster
        position='top-center'
        toastOptions={{ duration: 3000 }}
        reverseOrder={false}
      />
    </>
  );
}
