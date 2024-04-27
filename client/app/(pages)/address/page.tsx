"use client";
import { Navebar } from "@/app/components/Home/Navbar/Navebar";
import { axios } from "@/lib/axios";
import { useUserStore } from "@/stores/UserStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { CircularProgress } from "@nextui-org/progress";
import { Select, SelectItem } from "@nextui-org/select";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useMapEvents } from "react-leaflet";
import * as yup from "yup";

const MapContainer = dynamic(
  () => import("react-leaflet").then((module) => module.MapContainer),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((module) => module.TileLayer),
  {
    ssr: false,
  }
);
const Marker = dynamic(
  () => import("react-leaflet").then((module) => module.Marker),
  {
    ssr: false,
  }
);
const Popup = dynamic(
  () => import("react-leaflet").then((module) => module.Popup),
  {
    ssr: false,
  }
);

export default function Address() {
  const addressSchema = yup.object({
    name: yup.string().required("Name is required"),
    phoneNumber: yup
      .string()
      .min(10)
      .max(10)
      .required("Phone number is required"),
    houseNo: yup.string().required("House number is required"),
    street: yup.string().required("Street is required"),
    landmark: yup.string().required("Landmark is required"),
    city: yup.string().required("City is required"),
    pincode: yup.string().min(6).max(6).required("Pincode is required"),
    addressType: yup.string().required("Address type is required"),
  });

  const {
    user: { phone },
  } = useUserStore();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      phoneNumber: "",
      houseNo: "",
      street: "",
      landmark: "",
      city: "",
      pincode: "",
      addressType: "",
    },
    resolver: yupResolver(addressSchema),
  });
  const {
    user: { _id: userId },
  } = useUserStore();

  const [addresses, setAddresses] = useState<any>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showList, setShowList] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [editId, setEditId] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [mapAddress, setMapAddress] = useState<any>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const editAddress = (data: any) => {
    onOpenChange();
    console.log(data, "data");
    setEditId(data._id);
    setIsEditing(true);
    setValue("name", data.name);
    setValue("phoneNumber", data.phoneNumber);
    setValue("houseNo", data.houseNo);
    setValue("street", data.street);
    setValue("landmark", data.landmark);
    setValue("city", data.city);
    setValue("pincode", data.pincode);
    setValue("addressType", data.addressType);
    setMapAddress(data);
    setShowForm(false);
    setShowList(false);
    console.log(editId, "editId");
    console.log(isEditing, "isEditing");
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`/address/all?userId=${userId}`);
      if (response?.data?.ok === true) {
        setAddresses(response?.data?.data?.addresses);
        setLoading(false);
      }
      console.log(response, "response");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      setLoading(false);
      setAddresses([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleForm = () => {
    setShowForm(!showForm);
    setShowList(!showList);
    reset();
    setIsEditing(false);
  };

  const billingFormSubmit = async (data: any) => {
    try {
      isEditing
        ? axios.put(`/address?addressId=${editId}`, data).then((res) => {
            if (res.data.ok === true) {
              toast.success(res.data.message);
              fetchData();
              setIsEditing(false);
            }
          })
        : axios.post(`/address/add?userId=${_id}`, data).then((res) => {
            if (res.data.ok === true) {
              toast.success(res.data.message);
              fetchData();
            }
          });
    } catch (error: any) {
      toast.error(error.response.data.message);
    }

    reset();
    setShowForm(false);
    setShowList(true);
  };

  const deleteAddress = async (id: any) => {
    try {
      const response = await axios.delete(`/address?addressId=${id}`);
      if (response.data.ok === true) {
        toast.success(response.data.message);
        fetchData();
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const { _id } = useUserStore((state) => state.user);

  const addressType = [
    { value: "Home", label: "Home" },
    { value: "Office", label: "Office" },
    { value: "Other", label: "Other" },
  ];
  const [lati, setLati] = useState<any>("");
  const [longi, setLongi] = useState<any>("");
  const [position, setPosition] = useState([
    5.449392912326595, 116.31567712699723,
  ]);
  const [mapLoading, setMapLoading] = useState(true);

  // useEffect(() => {
  //   if (isOpen) {
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition((position) => {
  //         setPosition([position.coords.latitude, position.coords.longitude]);

  //         fetch(
  //           // `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlon[0]}&lon=${latlon[1]}`
  //           `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
  //           // `https://nominatim.openstreetmap.org/reverse?format=json&lat=8.1832&lon=77.4277`
  //         )
  //           .then((response) => response.json())
  //           .then((data) => {
  //             const address = data.display_name;
  //             console.log(address, "address");
  //             setMapAddress(address);
  //           })
  //           .catch((error) => {
  //             console.error("Error fetching address:", error);
  //             console.log("Address not available");
  //           });
  //       });
  //     }
  //   }
  // }, [isOpen]);

  // useEffect(() => {
  //   if (isOpen && lati !== "" && longi !== "") {
  //     fetch(
  //       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lati}&lon=${longi}`
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         const address = data.display_name;
  //         console.log(address, "kwdw");
  //         setMapAddress(address);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching address:", error);
  //         console.log("Address not available");
  //       });
  //   }
  // }, [isOpen, lati, longi]);

  useEffect(() => {
    console.log(position);
    setLati(position[0]);
    setLongi(position[1]);
  }, [position]);

  function LocationMarker() {
    const map = useMapEvents({
      click: (e) => {
        setPosition([e.latlng.lat, e.latlng.lng]);
        // setLati(e.latlng.lat);
        // setLongi(e.latlng.lng);

        map.flyTo(e.latlng, map.getZoom());
        setMapLoading(true);

        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
        )
          .then((response) => response.json())
          .then((data) => {
            const address = data.display_name;
            console.log(address, "address");
            setMapAddress(address);
            setMapLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching address:", error);
            console.log("Address not available");
            setMapLoading(false);
          });
      },

      locationfound(e: any) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return position === null ? null : (
      <Marker position={[position[0], position[1]]}></Marker>
    );
  }

  const handleSave = () => {
    if (mapAddress !== "" && mapAddress !== undefined && mapAddress !== null) {
      console.log(mapAddress, "mapAddress");
      console.log(lati, "lati");
      console.log(longi, "longi");
      billingFormSubmit({
        mapAddress,
        latitude: lati,
        longitude: longi,
      });
      onOpenChange();
    } else {
      toast.error("Please choose the address on the map");
    }
  };

  return (
    <>
      <section className='bg-[#1A3824]'>
        <Navebar />
      </section>

      <main className=' px-2 md:px-10 container mx-auto mt-10 mb-10'>
        <div className='mt-2 md:mt-6 flex justify-end'>
          <Button
            size='md'
            type='submit'
            radius='sm'
            className='bg-bacto font-poppins font-bold text-[#FFFFFF]'
            startContent={
              <Icon icon='carbon:location-filled' className='text-red-700' />
            }
            onPress={onOpen}>
            Use Map
          </Button>
        </div>

        {showForm && (
          <section className='md:mt-10'>
            <div className=' shadow-lg md:shadow-none border rounded-lg'>
              <div className=' font-duplet-semi border-b px-2 gap-1 md:px-10 py-4 flex justify-between'>
                <div className='text-base md:text-xl '>Add Billing Address</div>
                <Button
                  onPress={onOpen}
                  onClick={() => {
                    setLati(""), setLongi("");
                  }}
                  startContent={
                    <Icon
                      icon='carbon:location-filled'
                      className='text-red-700'
                    />
                  }>
                  Use Map
                </Button>
              </div>

              <form onSubmit={handleSubmit(billingFormSubmit)}>
                <div className='grid px-2 md:px-10 md:gap-4 grid-cols-1 items-center md:grid-cols-3 justify-evenly  p-4'>
                  <div className='mt-3  mb-2'>
                    <label className='text-label  text-base md:text-lg  font-duplet-reg '>
                      Name
                    </label>
                    <Controller
                      control={control}
                      name='name'
                      render={({ field }) => (
                        <Input
                          type='text'
                          {...field}
                          variant='bordered'
                          radius='sm'
                          errorMessage={errors.name?.message}
                          className='text-formtext'
                          style={{
                            width: "100%",
                            outline: "none",
                            backgroundColor: "white !important",
                            fontSize: "20px",
                            fontFamily: "duplet-semibold",
                            borderColor: "#E6E6E6",
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className='mt-3 mb-2'>
                    <label className='text-label   text-base md:text-lg  font-duplet-reg '>
                      Phone Number
                    </label>

                    <Controller
                      control={control}
                      name='phoneNumber'
                      render={({ field }) => (
                        <Input
                          type='number'
                          {...field}
                          errorMessage={errors.phoneNumber?.message}
                          variant='bordered'
                          radius='sm'
                          className='text-formtext'
                          style={{
                            width: "100%",
                            outline: "none",
                            backgroundColor: "white !important",
                            fontSize: "20px",
                            fontFamily: "duplet-semibold",
                            borderColor: "#E6E6E6",
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className='mt-3 mb-2'>
                    <label className='text-label   text-base md:text-lg font-duplet-reg '>
                      Address Type
                    </label>

                    <Controller
                      control={control}
                      name='addressType'
                      render={({ field }) => (
                        <Select
                          {...field}
                          variant='bordered'
                          errorMessage={errors.addressType?.message}
                          aria-label='Select an item'
                          placeholder='Select an item'
                          onChange={(e: any) => {
                            field.onChange(e.target.value);
                          }}>
                          {addressType.map((item: any) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className='grid px-2 md:px-10 md:gap-4 grid-cols-1 items-center md:grid-cols-3 justify-evenly  p-4'>
                  <div className='mt-3  mb-2'>
                    <label className='text-label  text-base md:text-lg  font-duplet-reg '>
                      House No
                    </label>

                    <Controller
                      control={control}
                      name='houseNo'
                      render={({ field }) => (
                        <Input
                          type='text'
                          {...field}
                          variant='bordered'
                          errorMessage={errors.houseNo?.message}
                          radius='sm'
                          className='text-formtext'
                          style={{
                            width: "100%",
                            outline: "none",
                            backgroundColor: "white !important",
                            fontSize: "20px",
                            fontFamily: "duplet-semibold",
                            borderColor: "#E6E6E6",
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className='mt-3 mb-2'>
                    <label className='text-label   text-base md:text-lg  font-duplet-reg '>
                      Street
                    </label>

                    <Controller
                      name='street'
                      control={control}
                      render={({ field }) => (
                        <Input
                          type='text'
                          {...field}
                          variant='bordered'
                          errorMessage={errors.street?.message}
                          radius='sm'
                          className='text-formtext'
                          style={{
                            width: "100%",
                            outline: "none",
                            backgroundColor: "white !important",
                            fontSize: "20px",
                            fontFamily: "duplet-semibold",
                            borderColor: "#E6E6E6",
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className='mt-3 mb-2'>
                    <label className='text-label   text-base md:text-lg font-duplet-reg '>
                      Land Mark
                    </label>

                    <Controller
                      name='landmark'
                      control={control}
                      render={({ field }) => (
                        <Input
                          type='text'
                          {...field}
                          errorMessage={errors.landmark?.message}
                          variant='bordered'
                          radius='sm'
                          className='text-formtext'
                          style={{
                            width: "100%",
                            outline: "none",
                            backgroundColor: "white !important",
                            fontSize: "20px",
                            fontFamily: "duplet-semibold",
                            borderColor: "#E6E6E6",
                          }}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className='grid px-2 md:px-10 md:gap-4 grid-cols-1 items-center md:grid-cols-2 justify-evenly  p-4'>
                  <div className='mt-3  mb-2'>
                    <label className='text-label  text-base md:text-lg  font-duplet-reg '>
                      City
                    </label>
                    <Controller
                      name='city'
                      control={control}
                      render={({ field }) => (
                        <Input
                          type='text'
                          {...field}
                          variant='bordered'
                          errorMessage={errors.city?.message}
                          radius='sm'
                          className='text-formtext'
                          style={{
                            width: "100%",
                            outline: "none",
                            backgroundColor: "white !important",
                            fontSize: "20px",
                            fontFamily: "duplet-semibold",
                            borderColor: "#E6E6E6",
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className='mt-3 mb-2'>
                    <label className='text-label   text-base md:text-lg  font-duplet-reg '>
                      Pin Code
                    </label>
                    <Controller
                      name='pincode'
                      control={control}
                      render={({ field }) => (
                        <Input
                          type='number'
                          {...field}
                          errorMessage={errors.pincode?.message}
                          variant='bordered'
                          radius='sm'
                          className='text-formtext'
                          style={{
                            width: "100%",
                            outline: "none",
                            backgroundColor: "white !important",
                            fontSize: "20px",
                            fontFamily: "duplet-semibold",
                            borderColor: "#E6E6E6",
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className='mt-2 flex justify-center md:flex-none md:justify-end md:px-10 mb-3 '>
                  <Button
                    size='lg'
                    radius='sm'
                    type='submit'
                    className='bg-bacto font-poppins font-bold text-[#FFFFFF]'>
                    Save
                  </Button>
                </div>
              </form>
            </div>
          </section>
        )}
      </main>
      {loading ? (
        <div className='h-[70vh] w-screen bg-white flex justify-center items-center'>
          <CircularProgress label='Hang on...' />
        </div>
      ) : (
        showList && (
          <main className='px-2 md:px-10 container mx-auto mt-10 mb-10'>
            <div className='grid gap-4 md:grid-cols-3 '>
              {addresses?.length > 0 ? (
                addresses?.map((address: any) => (
                  <Card key={address?._id} className='w-full p-5'>
                    {address?.mapAddress !== "" ? (
                      <div>
                        <address>{address?.mapAddress}</address>
                      </div>
                    ) : (
                      <div className='capitalize font-duplet-reg'>
                        <div className='flex items-center text-2xl flex-wrap justify-between'>
                          <div className='flex gap-2 items-center flex-wrap'>
                            <span className='text-lg md:text-2xl font-duplet-semi capitalize'>
                              {address?.name}
                            </span>
                          </div>
                          <Chip
                            radius='sm'
                            className='bg-[#0EA829] capitalize text-white'>
                            {address?.addressType}
                          </Chip>
                        </div>
                        <div className='mt-2 flex flex-wrap text-base md:text-lg'>
                          {address?.houseNo}, {address?.street} <br />,
                          {address?.landmark},{address?.city},{address?.pincode}
                        </div>
                        <div>{address?.phoneNumber}</div>
                      </div>
                    )}

                    <div className='flex items-center gap-2 justify-center mt-2 md:mt-8 md:gap-4'>
                      {/* <Button
                        onClick={() => editAddress(address)}
                        size='sm'
                        className='bg-[#6366f1]'
                        isIconOnly
                      >
                        <Icon
                          className='text-xl text-white'
                          icon='mdi:pencil'
                        />
                      </Button> */}
                      <Button
                        onClick={() => deleteAddress(address?._id)}
                        size='sm'
                        className='bg-red-700'
                        isIconOnly>
                        <Icon
                          className='text-xl text-white'
                          icon='mdi:trash-can-outline'
                        />
                      </Button>
                    </div>
                  </Card>
                ))
              ) : addresses?.length === 0 ? (
                <section className='w-screen flex  items-center'>
                  <h1 className='text-xl text-gray-500'>No address found</h1>
                </section>
              ) : (
                <div className=' w-screen bg-white flex justify-center '>
                  <h1 className='text-xl text-gray-500'>Loading...</h1>
                </div>
              )}
            </div>
          </main>
        )
      )}

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size='3xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Choose Location
              </ModalHeader>
              <ModalBody className='overflow-x-hidden'>
                <MapContainer
                  center={[8.184792661742318, 77.41422179761393]}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{ height: "500px" }}
                  zoomControl={false}>
                  <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                  <LocationMarker />
                </MapContainer>
              </ModalBody>
              <ModalFooter>
                <Button
                  disabled={mapLoading}
                  color='danger'
                  variant='light'
                  onPress={onClose}>
                  Close
                </Button>
                <Button
                  disabled={mapLoading}
                  color='primary'
                  onClick={handleSave}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Toaster
        position='top-center'
        toastOptions={{ duration: 4000 }}
        reverseOrder={false}
      />
    </>
  );
}
