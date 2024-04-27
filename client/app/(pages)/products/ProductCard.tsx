import { Icon } from "@iconify/react";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import Image from "next/image";
import { config } from "@/lib/config";
import { ImageWithFallback } from "@/app/components/ImageWithFallback";
import { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { get } from "@/lib/storage";
import { useCartStore } from "@/stores/CartStore";
import { axios } from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@nextui-org/button";
import { Skeleton } from "@nextui-org/skeleton";
import { useUserStore } from "@/stores/UserStore";

interface Props {
  image: string;
  _id: string;
  productName: string;
  price: number;
  originalPrice: number;
  discount: number;
  isLoading: boolean;
  ref?: any;
}

export function ProductsCard({
  _id,
  discount,
  image,
  isLoading,
  originalPrice,
  price,
  productName,
}: Props) {
  const {
    user: { _id: userId },
  } = useUserStore();

  const [selectedKg, setSelectedKg] = useState<string>("1");
  const [totalPrice, setTotalPrice] = useState<number>(price - discount);
  const [cartIsAdding, setCartIsAdding] = useState<boolean>(false);

  const cartAdder = async (item: any) => {
    if (item == selectedKg || selectedKg == "") return;
    const totalAmount = parseFloat(item) * price;
    setSelectedKg(item);
    setTotalPrice(totalAmount);
  };
  const {
    isLoggedIn,
    user: { phone },
  } = useUserStore();
  let addProducttoCart = async () => {
    if (selectedKg == "") return;

    if (!isLoggedIn) {
      toast.error("please login");
      return;
    }
    try {
      let products = useCartStore.getState().products;
      let productExists = products.filter(
        (product: any) => product._id === _id
      );
      if (productExists.length > 0) {
        toast.error("Product already exists in cart");
        return;
      }

      let newProducts = [
        ...useCartStore.getState().products,
        {
          _id: _id,
          quantity: parseFloat(selectedKg),
          price: totalPrice,
          name: productName,
        },
      ];

      let _totalPrice = 0;

      newProducts.forEach((product) => {
        _totalPrice += +product.price;
      });

      useCartStore.setState({
        products: newProducts,
        iscartOpen: true,
        totalPrice: _totalPrice,
        cartCount: newProducts.length,
      });

      let res = await axios.post("/cart/add ", {
        userId: userId,
        products: newProducts,
        totalPrice: _totalPrice,
      });

      setCartIsAdding(true);

      if (res.status === 200) {
        toast.success("Product added to cart");
        setCartIsAdding(false);
      } else {
        // remove it from cart
        let newUpdatedProducts = useCartStore
          .getState()
          .products.filter((product: any) => product._id !== _id);

        useCartStore.setState({
          products: newUpdatedProducts,
          iscartOpen: true,
          totalPrice: _totalPrice,
          cartCount: newUpdatedProducts.length,
        });
        toast.error("Some thing went wrong");
      }
    } catch (e: any) {
      let newUpdatedProducts = useCartStore
        .getState()
        .products.filter((product: any) => product._id !== _id);
      let _totalPrice = 0;

      newUpdatedProducts.forEach((product) => {
        _totalPrice += +product.price;
      });
      useCartStore.setState({
        products: newUpdatedProducts,
        iscartOpen: true,
        totalPrice: _totalPrice,
        cartCount: newUpdatedProducts.length,
      });
      toast.error("Some thing went wrong");
    }
  };
  const handleQuantityChange = (newValue: string) => {
    const validFormatRegex = /^\d*\.?\d*$/;

    if (!validFormatRegex.test(newValue)) return;
    setSelectedKg(newValue);
    const enteredValue = evaluateFraction(newValue); // Convert fraction to decimal if applicable
    const totalAmount = enteredValue * (price - discount);
    setTotalPrice(isNaN(totalAmount) ? 0 : totalAmount);
  };

  const handleShortcutClick = (value: string) => {
    setSelectedKg(value);
    const enteredValue = evaluateFraction(value); // Convert fraction to decimal if applicable
    const totalAmount = enteredValue * (price - discount);
    setTotalPrice(isNaN(totalAmount) ? 0 : totalAmount);
  };

  // Function to evaluate fraction and return decimal value
  const evaluateFraction = (value: string): number => {
    if (value.includes("/")) {
      const [numerator, denominator] = value.split("/").map(Number);
      return numerator / denominator;
    }
    return parseFloat(value);
  };

  return (
    <>
      <Card className='max-w-[500px] p-2 font-duplet-semi transition-all duration-75 ease-in bg-prodback shadow-md '>
        <CardHeader className='flex gap-3 items-center p-1 md:p-3'>
          <Skeleton isLoaded={isLoading}>
            <ImageWithFallback
              alt='product image'
              fallbackSrc='/images/vegetables.png'
              style={{
                objectFit: "contain",
                width: "100px",
                height: "100px",
              }}
              src={config.baseUrl + `files/view?image=${image}`}
              width={200}
              height={200}
            />
          </Skeleton>

          <div style={{ width: "100%" }} className='flex flex-col line-clamp-3'>
            <div style={{ width: "100%" }} className='flex justify-between'>
              <Skeleton isLoaded={isLoading}>
                <p className='text-sm capitalize  font-duplet-semi  md:text-xl  text-prodname'>
                  {productName}
                </p>
              </Skeleton>
              <Skeleton isLoaded={isLoading} className='rounded-lg'>
                <div
                  onClick={cartIsAdding ? () => {} : addProducttoCart}
                  className='bg-slate-200 p-2 rounded-full hover:bg-slate-300 hover:transition-colors cursor-pointer'
                >
                  <Icon
                    className={`text-2xl text-gray-600`}
                    icon='f7:cart-fill-badge-plus'
                  />
                </div>
              </Skeleton>
            </div>
            <Skeleton isLoaded={isLoading}>
              <p className='text-lg mt-2 text-prodkg'>
                ₹{totalPrice.toFixed(0) === "NaN" ? 0 : totalPrice.toFixed(0)}
                &nbsp; &nbsp;
                <span className='text-prodorginalprice line-through'>
                  ₹{price?.toFixed(0)} &nbsp;
                </span>
                &nbsp; / kg
              </p>
            </Skeleton>
          </div>
        </CardHeader>
        <Skeleton isLoaded={isLoading}>
          <div className='px-2'>
            <div className='flex items-center justify-between font-duplet-semi text-prodkg'>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className=' flex justify-between gap-3 items-center p-2'
              >
                <Input
                  size='sm'
                  type='text'
                  value={selectedKg}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  style={{ textAlign: "center" }}
                  className='w-[70px] text-[12px]'
                  classNames={{
                    inputWrapper: ["h-[10px] bg-gray-200 shadow-none"],
                    input: ["bg-transparent"],
                    innerWrapper: ["bg-none"],
                  }}
                />
              </form>
              <div className='flex flex-wrap items-center gap-1 px-0 md:px-2 text'>
                {["0.25", "0.50", "0.75", "1"].map((item) => (
                  <span
                    key={item}
                    className={`transition-colors duration-100 ease-in shadow-sm rounded-full cursor-pointer p-2 text-sm  ${
                      selectedKg === item ? "bg-[#025029] text-white" : ""
                    }`}
                    onClick={() => handleShortcutClick(item)}
                  >
                    {item} kg
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Skeleton>
      </Card>
    </>
  );
}
