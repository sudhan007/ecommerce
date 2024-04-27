import { Card, CardBody } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import Image from "next/image";
import { ImageWithFallback } from "../../ImageWithFallback";
import { config } from "@/lib/config";

const randomColors = ["FFF3FF", "F2FCE4", "FEEFEA", "ECFFEC", "FFFCEB"];

interface Props {
  categoriesLoaded: boolean;
  item: IItem;
  onClick: () => void;
}

interface IItem {
  categoryName: string;
  productCount: number;
  _id: string;
  image: string;
}

export default function CategoryCard(Props: Props) {
  const handleClick = () => {
    Props.onClick();
  };
  return (
    <div onClick={handleClick} key={Props.item._id}>
      <Skeleton
        aria-label='Skeleton with text'
        className='w-full h-full m-auto rounded-lg'
        isLoaded={Props.categoriesLoaded}
      >
        <Card
          isBlurred
          className={`shadow-none bg-black rounded-lg pb-5 cursor-pointer  hover:shadow-lg hover:-translate-y-1 transition duration-700 ease-in `}
          style={{
            background: `#${
              randomColors[Math.floor(Math.random() * randomColors.length)]
            }`,
          }}
        >
          <CardBody>
            <div className='flex justify-center'>
              {/* <Image
                alt=''
                src='/images/vegetables.png'
                width={100}
                height={100}
                style={{
                  objectFit: "contain",
                  width: "100px",
                  height: "100px",
                }}
              /> */}
              <ImageWithFallback
                alt='product image'
                fallbackSrc='/images/vegetables.png'
                style={{
                  objectFit: "contain",
                  width: "100px",
                  height: "100px",
                }}
                className='w-[70px] h-[70px] md:w-[100px] md:h-[100px] object-cover'
                src={config.baseUrl + `files/view?image=${Props.item.image}`}
                // src='/images/vegetables.png'
                width={200}
                height={200}
              />
            </div>
          </CardBody>
          <div className='text-center'>
            {/* <Skeleton isLoaded={Props.categoriesLoaded} className='w-3/4'> */}
            <h2 className='text-lg capitalize text-center font-duplet-semi text-heading'>
              {Props.item.categoryName}
            </h2>
            {/* </Skeleton> */}
            <Skeleton isLoaded={Props.categoriesLoaded} className='w-3/2'>
              <p className='text-sm c font-duplet-semi text-count'>
                {Props.item.productCount} Items
              </p>
            </Skeleton>
          </div>
        </Card>
      </Skeleton>
    </div>
  );
}
