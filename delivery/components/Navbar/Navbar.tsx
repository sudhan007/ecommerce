import React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@iconify/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { navbarMenu } from "@/lib/links";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { toast } from "sonner";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isactivePath = "border-b-2 transition-all border-[#6366f1]";
  const handleLogout = () => {
    localStorage.clear();
    toast("Logout successfully", {
      position: "top-center",
      closeButton: true,
      duration: 3000,
      icon: "👏",
    });
    router.push("/");
  };
  return (
    <>
      <div className=' bg-[#1A3824] sticky top-0 z-10'>
        <div className='py-3 px-3 flex justify-between items-center'>
          <div className=' cursor-pointer flex items-center gap-1 '>
            <Image
              src='/bagicon.png'
              alt='topicon'
              width={20}
              height={20}
              style={{ objectFit: "contain" }}
            />
            <span className='text-xl   font-duplet-semi text-white'>
              Starex
            </span>
          </div>

          <div className='flex gap-3  items-center'>
            {/* <div>
              <Icon
                icon='line-md:bell-loop'
                className='text-4xl cursor-pointer d text-white'
              />
            </div> */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className='cursor-pointer'>
                    <AvatarImage src='https://github.com/shadcn.png' />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-60'>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <div className='text-sm px-2'>Log Out</div>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to log out ?
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleLogout()}
                            className='bg-red-500 hover:bg-red-500'
                          >
                            Log Out
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      <div className='py-3 px-3 transition-all duration-300 text-black  bg-gray-100 shadow-md fixed bottom-0 w-full z-20 '>
        <ul className='flex justify-evenly items-center flex-row '>
          {navbarMenu.map((item, index) => {
            return (
              <li
                key={index}
                onClick={() => router.push(item.path)}
                className={`text-2xl font-duplet-semi text-black ${
                  pathname === item.path && isactivePath
                }`}
              >
                <Icon icon={item.title} />
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
