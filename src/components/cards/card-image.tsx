import Image from "next/image";

type CardImageProps = {
  src?: string | null;
  name: string;
};

export default function CardImage({ src, name }: CardImageProps) {
  if (!src) {
    return null;
  }

  return (
    <Image
      src={src}
      alt={`${name} card image`}
      width={320}
      height={448}
      style={{
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
      }}
    />
  );
}
