"use client";
import { axios } from "@/lib/axios";
import { useUserStore } from "@/stores/UserStore";
import { Card } from "@nextui-org/card";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { useAddressStore } from "@/stores/AddressStore";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
export default function Address({ address }: any) {
  const router = useRouter();

  const {
    user: { _id: userId },
  } = useUserStore();
  const [data, SetData] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState<any>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handlemodelclose = () => {
    onOpenChange();
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`address/all?userId=${userId}`);
      console.log(response?.data?.data?.addresses, "response");
      SetData(response?.data?.data?.addresses);
      // console.log(response?.data?.data?.addresses[0].addressType, "response");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      SetData([]);
    }
  };

  const handleSelect = (data: any) => {
    setSelectedAddress(data);
    console.log(data);
    useAddressStore.setState({ address: data });
    handlemodelclose();
  };

  const handleDelete = async (id: any) => {
    console.log(id);
    try {
      const response = await axios.delete(`/address?addressId=${id}`);
      console.log(response);
      if (response.data.ok === true) {
        toast.success(response.data.message);
        fetchData();
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Card shadow='sm' radius='sm' className=''>
        <div className=' px-5 md:px-10 my-5'>
          <div className='flex justify-between'>
            <div>
              <h2 className='text-xl text-[#1A202C] font-duplet-reg  '>
                Select Address
              </h2>

              <p className='text-sm text-[#90A3BF] font-duplet-semi '>
                Please select your preferred delivery address
              </p>
            </div>
            <div>
              <Button
                className='bg-[#0EA829] text-white font-duplet-semi'
                onClick={onOpen}
                radius='sm'
              >
                Choose Address
              </Button>
            </div>
          </div>

          <div className='mt-2 grid grid-cols-1 md:grid-cols-3'>
            {selectedAddress ? (
              <Card className='p-3 '>
                {selectedAddress?.mapAddress !== "" ? (
                  <div>
                    <address>{selectedAddress?.mapAddress}</address>
                  </div>
                ) : (
                  <div className='capitalize font-duplet-reg'>
                    <div className='flex gap-2 flex-wrap'>
                      <span className='text-lg font-duplet-semi capitalize'>
                        {selectedAddress?.name}
                      </span>
                      <Chip
                        radius='sm'
                        className='bg-[#0EA829] capitalize text-white'
                      >
                        {selectedAddress?.addressType}
                      </Chip>
                    </div>
                    {selectedAddress?.houseNo}, {selectedAddress?.street},
                    {selectedAddress?.landmark},{selectedAddress?.city},
                    {selectedAddress?.pincode}
                    <div>{selectedAddress?.phoneNumber}</div>
                  </div>
                )}
              </Card>
            ) : null}
          </div>

          <Modal isOpen={isOpen} placement='center' onOpenChange={onOpenChange}>
            <ModalContent className='pb-3 '>
              {(onClose) => (
                <>
                  <ModalHeader className='flex pt-2 pb-2 justify-evenly gap-1 font-duplet-semi text-lg'>
                    <div> Select Address</div>
                    <div>
                      <Button
                        radius='sm'
                        size='sm'
                        className='bg-[#0EA829] text-white'
                        onClick={() => {
                          router.push("/address");
                          useAddressStore.setState({ address: {} });
                        }}
                      >
                        Add New
                      </Button>
                    </div>
                  </ModalHeader>
                  <ModalBody>
                    {data.length > 0 ? (
                      <div className='h-[350px] overflow-y-scroll p-3'>
                        {data?.map((address: any) => (
                          <div
                            onClick={() => {
                              handleSelect(address);
                            }}
                            key={address?._id}
                            className='mt-3'
                          >
                            <Card className='p-3 cursor-pointer'>
                              {address?.mapAddress ? (
                                <div>
                                  <address>{address?.mapAddress}</address>
                                </div>
                              ) : (
                                <div className='capitalize font-duplet-reg'>
                                  <div className='flex justify-between'>
                                    <div className='flex gap-2 flex-wrap'>
                                      <span className='text-lg font-duplet-semi capitalize'>
                                        {address?.name}
                                      </span>
                                      <Chip
                                        radius='sm'
                                        className='bg-[#0EA829] capitalize text-white'
                                      >
                                        {address?.addressType}
                                      </Chip>
                                    </div>
                                  </div>
                                  {address?.houseNo}, {address?.street},
                                  {address?.landmark},{address?.city},
                                  {address?.pincode}
                                  <div>{address?.phoneNumber}</div>
                                </div>
                              )}
                            </Card>
                          </div>
                        ))}
                      </div>
                    ) : data?.length === 0 ? (
                      <div className='flex font-duplet-semi justify-center h-20 items-center'>
                        <Button
                          radius='sm'
                          size='lg'
                          className='bg-[#0EA829] text-white'
                          onClick={() => router.push("/address")}
                        >
                          Add Address
                        </Button>
                      </div>
                    ) : (
                      <div className='flex font-duplet-semi justify-center h-20 items-center'>
                        loading..
                      </div>
                    )}
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </Card>
    </>
  );
}
