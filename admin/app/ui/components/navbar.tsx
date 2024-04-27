"use client";

import { ThemeSwitch } from "@/app/ui/components/theme-switch";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

import { Avatar } from "@nextui-org/avatar";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
export const Navbar = () => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const logout = () => {
    localStorage.removeItem("isLoggedIn");

    router.push("/");
  };

  return (
    <>
      <div className='flex py-4 px-3 border items-center justify-end'>
        <div className='flex items-center gap-6'>
          <ThemeSwitch className='text-2xl text-slate-700' />
          <Icon
            icon='line-md:bell-loop'
            className='text-3xl cursor-pointer dark:text-gray-400 text-slate-600'
          />
          <div>
            <Avatar
              src='https://i.pravatar.cc/150?u=a04258114e29026708c'
              size='sm'
            />
          </div>
          <Icon
            icon='solar:logout-outline'
            className='text-3xl cursor-pointer text-red-500'
            onClick={onOpen}
          />
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose: any) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Log Out</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to log out?</p>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Close
                </Button>
                <Button onClick={logout} color='primary'>
                  Yes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
