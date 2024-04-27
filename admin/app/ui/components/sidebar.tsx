"use client";
import React from "react";
import { Avatar } from "@nextui-org/avatar";
import { sideBarMenu } from "../../../utils/links";
import { Icon } from "@iconify/react";
import { usePathname, useRouter } from "next/navigation";
function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const isActivePath =
    "bg-[#6366f1] text-white transition-all translate-x-3 translate-y-1";

  return (
    <>
      <div className='p-6 h-screen border-r sticky top-0 '>
        <div className='flex gap-4 items-center justify-center mb-6'>
          <Avatar
            src='https://i.pravatar.cc/150?u=a04258114e29026708c'
            size='lg'
          />
          <h1 className='text-2xl'>Admin</h1>
          
        </div>
        <ul>
          {sideBarMenu.map((menu: any, index: any) => (
            <li key={index} className='cursor-pointer'>
              <span className='my-4'>{menu.title}</span>
              {menu.list.map((item: any, index: any) => (
                <div
                  key={index}
                  className={`flex gap-8 p-3 mt-3 mb-3 rounded-xl hover:bg-[#6366f1] hover:translate-x-3  transition-all hover:text-white ${
                    pathname === item.path && isActivePath
                  }`}
                  onClick={() => router.push(item.path)}
                >
                  <Icon icon={item.icon} className='text-3xl' />
                  <span className='text-xl'>{item.title}</span>
                </div>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
