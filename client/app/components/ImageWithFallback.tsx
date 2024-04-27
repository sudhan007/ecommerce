import Image from "next/image";
import { useState } from "react";

interface Props {
  src: string;
  fallbackSrc: string;
  alt?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
  onclick?: () => void;
  title?: string;
}

export const ImageWithFallback = ({
  fallbackSrc,
  src,
  alt = "image",
  height,
  width,
  style,
  className,
  onclick,
  title,
}: Props) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <div>
      <Image
        src={imgSrc}
        alt={alt}
        onError={(e) => {
          setImgSrc(fallbackSrc);
        }}
        width={width}
        height={height}
        style={style}
        className={className}
        onClick={onclick}
        title={title}
      />
    </div>
  );
};
