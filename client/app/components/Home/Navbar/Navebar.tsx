"use client";
import { useUserStore } from "@/stores/UserStore";
import { Icon } from "@iconify/react";
import { Avatar } from "@nextui-org/avatar";
import { Badge } from "@nextui-org/badge";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

import { axios } from "@/lib/axios";
import { formatePhone } from "@/lib/config";
import { useCartStore } from "@/stores/CartStore";
import toast from "react-hot-toast";
export const Navebar = ({ transparentBg }: { transparentBg?: boolean }) => {
  const router = useRouter();
  const [drawerisOpen, setIsOpen] = useState(false);
  const [searchKey, setSearchKey] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleModalOpen = () => {
    onOpen();
  };

  const handleOpen = () => {
    toggleDrawer();
    onOpen();
  };

  const handleClose = () => {
    onOpenChange();
  };

  const {
    isLoggedIn,
    user: { _id, phone },
  } = useUserStore();

  const { products, totalPrice } = useCartStore();

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const myCart = () => {
    useCartStore.setState({ iscartOpen: true });
  };

  const prettyPhoneNumber = (number: string) => {
    if (!number) return "";
    return number
      .toString()
      .slice(2)
      .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
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
    if (isLoading === false && data?.data) {
      useCartStore.setState({
        products: data?.data?.products,
        cartCount: data?.data?.products?.length,
        totalPrice: data?.data?.totalPrice,
      });
    }
  }, [data, isLoading]);

  const logout = () => {
    localStorage.clear();
    useUserStore.setState({
      isLoggedIn: false,
      token: "",
      user: {
        _id: "",
        phone: "",
      },
    });
    toast.success("Logged out successfully");
    router.push("/");
    handleClose();
  };

  function handleSearchClick() {
    if (!searchKey) return;
    router.push(`/search?q=${searchKey}`);
  }

  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <>
      <header
        className={`sticky top-0 z-50  w-full  hidden md:flex items-center ${
          transparentBg ? "bg-transparent" : "bg-[#134700]"
        }  justify-between gap-3  xl:gap-5   px-4 xl:px-16 md:py-6  lg:py-8 `}>
        <div className=' flex md:flex-row items-center gap-4 xl:gap-16'>
          <div
            onClick={() => {
              router.push("/");
            }}
            className=' cursor-pointer flex items-center gap-2 xl:gap-3'>
            <Image
              src='/icons/bagicon.png'
              alt='topicon'
              width={20}
              height={20}
              style={{ objectFit: "contain" }}
            />
            <span className='text-xl  lg:text-4xl  font-duplet-semi text-navlogo'>
              Starex
            </span>
          </div>
          {isHomePage ? (
            <div>
              <div className='flex items-center'>
                <input
                  className=' indent-3  py-2 rounded-l-sm focus:outline-none sm:w-[160px] md:w-[200px] lg:w-[280px] xl:w-[400px]'
                  placeholder='Search for items...'
                  type='search'
                  onChange={(e) => {
                    setSearchKey(e.target.value);
                  }}
                  value={searchKey}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchClick();
                    }
                  }}
                />

                <Button
                  className='bg-navsearch'
                  isIconOnly
                  radius='none'
                  aria-label='Like'
                  onClick={handleSearchClick}>
                  <Icon className='text-2xl' icon='mdi:magnify' />
                </Button>
              </div>
            </div>
          ) : null}

          {/* {isLoggedIn ? (
            <div>
              <div className="cursor-pointer flex items-center md:flex-nowrap gap-2">
                <div>
                  <Image
                    src="/icons/location-icon.png"
                    alt="mycart"
                    width={20}
                    height={20}
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="text-navlogo font-duplet-semi text-base xl:text-lg">
                  Tracking
                </div>
              </div>
            </div>
          ) : (
            ""
          )} */}
        </div>
        <div>
          <div className='flex items-center justify-center'>
            {isLoggedIn ? (
              <div className='flex items-center gap-4'>
                <div>
                  <div
                    onClick={() => isLoggedIn && myCart()}
                    className={`cursor-pointer text-[#ffffff] flex md:flex-nowrap items-center md:gap-1 lg:gap-2 ${
                      isLoggedIn ? "" : "hidden"
                    }`}>
                    <div className='px-4'>
                      <Badge
                        content={products.length || 0}
                        className='bg-navsearch border-none'>
                        <Image
                          src='/icons/cart-icon.png'
                          alt='my cart'
                          width={20}
                          height={20}
                          style={{ objectFit: "contain" }}
                        />
                      </Badge>
                    </div>
                  </div>
                </div>
                <Dropdown>
                  <DropdownTrigger>
                    <div className='flex justify-center items-center gap-2'>
                      <Avatar
                        style={{ cursor: "pointer" }}
                        src='https://i.pravatar.cc/150?u=a04258114e29026302d'
                        size='md'
                      />
                      <span
                        style={{ cursor: "pointer" }}
                        className='text-navlogo font-duplet-semi text-base lg:text-lg flex items-center gap-1  '>
                        +91 {phone}
                        <Icon icon={"mdi:chevron-down"} />
                      </span>
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu aria-label='gg' variant='faded'>
                    <DropdownItem
                      key='profile'
                      startContent={<Icon icon={"mdi:account"} />}
                      onClick={() => router.push("/profile")}>
                      Profile
                    </DropdownItem>
                    <DropdownItem
                      key='logout'
                      startContent={<Icon icon={"mdi:logout"} />}
                      onClick={() => handleModalOpen()}>
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            ) : (
              <Button
                onClick={() => {
                  if (window !== undefined) {
                    window.location.href = "/login";
                  }
                }}
                className='bg-navsearch'>
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* nav mobile */}

      <nav className='w-full bg-[#1A3824] flex items-center justify-between md:hidden py-4 px-5'>
        <div
          onClick={() => router.push("/")}
          className=' cursor-pointer flex items-center gap-1 '>
          <Image
            src='/icons/bagicon.png'
            alt='topicon'
            width={20}
            height={20}
            style={{ objectFit: "contain" }}
          />
          <span className='text-xl   font-duplet-semi text-navlogo'>
            Starex
          </span>
        </div>
        <div className='flex h-5 items-center space-x-2 text-small'>
          {isLoggedIn ? (
            <>
              <div onClick={() => router.push("/profile")}>
                <Icon
                  icon={"ri:user-fill"}
                  className=' text-[#FFFFFF] text-2xl'
                />
              </div>
              <Divider className='bg-[#696969]' orientation='vertical' />
              <div onClick={() => myCart()}>
                <Icon
                  icon={"lets-icons:bag"}
                  className=' text-[#FFFFFF] text-2xl'
                />
              </div>
              <Divider className=' bg-[#696969]' orientation='vertical' />
            </>
          ) : (
            <></>
          )}
          <div>
            <Icon
              icon={"bx:menu-alt-right"}
              className=' text-[#FFFFFF] text-2xl'
              onClick={toggleDrawer}
            />
          </div>
        </div>
      </nav>
      <Drawer
        duration={500}
        open={drawerisOpen}
        size={280}
        onClose={toggleDrawer}
        direction='right'
        lockBackgroundScroll={true}>
        <div className='px-5 py-5 tett-[#253D4E]'>
          <div className='flex items-center justify-between'>
            <div
              onClick={() => router.push("/")}
              className=' cursor-pointer flex items-center gap-1 '>
              <Image
                src='/icons/bagicon.png'
                alt='topicon'
                width={20}
                height={20}
                style={{ objectFit: "contain" }}
              />
              <span className='text-2xl  text-[#253D4E]  font-duplet-semi '>
                Starex
              </span>
            </div>
            <div>
              <Icon
                icon={"zondicons:close-solid"}
                className=' text-[#2D2D2D] text-2xl'
                onClick={toggleDrawer}
              />
            </div>
          </div>
          <div className='mt-8'>
            <div className=''>
              {isLoggedIn ? (
                <div>
                  <div className='flex justify-center'>
                    <Avatar
                      src='https://i.pravatar.cc/150?u=a04258114e29026302d'
                      size='lg'
                    />
                  </div>
                  <div className='text-[#253D4E] text-center mt-3 font-duplet-semi text-base '>
                    +91 {phone}
                  </div>
                </div>
              ) : (
                <div className='flex justify-center'>
                  <Button
                    onClick={() => {
                      if (window !== undefined) {
                        window.location.href = "/login";
                      }
                    }}
                    className='bg-navsearch'>
                    Login
                  </Button>
                </div>
              )}
              <div className='mt-5 '>
                <ul>
                  {isLoggedIn ? (
                    <>
                      <li
                        onClick={() => router.push("/profile")}
                        className='flex mb-3 items-center justify-between mt-2'>
                        <span className='text-lg'>Orders</span>
                        <Icon className='text-2xl' icon={"octicon:package"} />
                      </li>
                      <li
                        onClick={() => router.push("/edit")}
                        className='flex mb-3 items-center justify-between mt-2'>
                        <span className='text-lg'>My Account</span>
                        <Icon className='text-2xl' icon={"mdi:account-cog"} />
                      </li>

                      <li
                        onClick={() => handleOpen()}
                        className='flex mb-3 items-center justify-between mt-2'>
                        <span className='text-lg'>Log Out</span>
                        <Icon
                          className='text-2xl text-red-600'
                          icon={"mdi:logout"}
                        />
                      </li>
                    </>
                  ) : (
                    <>
                      <li className='flex mb-3 items-center justify-between mt-2'>
                        <span className='text-lg'>Help</span>
                        <Icon className='text-2xl' icon={"mdi:account-cog"} />
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      <Modal placement='center' isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Log Out</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to log out?</p>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Cancel
                </Button>
                <Button color='primary' onPress={() => logout()}>
                  Log Out
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
