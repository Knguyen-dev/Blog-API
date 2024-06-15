/**
 * Image component for showing responsive images.
 */
interface ResponsiveImgProps {
  src: string;
  alt: string;
  maxWidth?: string;
  maxHeight?: string;
  rounded?: "none" | "sm" | "md" | "lg" | "xl";
  objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down";
  className?: string;
  style?: object;
}

export default function ResponsiveImg({
  src,
  alt,
  maxWidth = "100%",
  maxHeight = "100%",
  rounded = "none",
  objectFit = "cover",
  className,
  ...style
}: ResponsiveImgProps) {
  return (
    <img
      src={src}
      alt={alt}
      style={{ maxWidth, maxHeight, objectFit, ...style }}
      className={`tw-overflow-hidden tw-rounded-${rounded} ${className}`}
    />
  );
}
