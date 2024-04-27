import Image from "next/image";
import { useState } from "react";

interface Props {
  src: string;
  fallbackSrc: string;
  alt?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  priority?: boolean;
  className?: string;
}

export const ImageWithFallback = ({
  fallbackSrc,
  src,
  alt = "image",
  height,
  width,
  style,
  priority = false,
  className,
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
        priority={priority}
        className={className}
      />
    </div>
  );
};
