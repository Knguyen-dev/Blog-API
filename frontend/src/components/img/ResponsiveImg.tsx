interface ResponsiveImgProps {
	src: string;
	alt: string;
	maxWidth?: string;
	maxHeight?: string;
	rounded?: "none" | "sm" | "md" | "lg" | "xl";
	objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down";
	className?: string;
	restProps?: React.HTMLProps<HTMLImageElement>;
}

export default function ResponsiveImg({
	src,
	alt,
	maxWidth = "100%",
	maxHeight = "100%",
	rounded = "md",
	objectFit = "cover",
	className,
	...restProps
}: ResponsiveImgProps) {
	return (
		<img
			src={src}
			alt={alt}
			style={{ maxWidth, maxHeight, objectFit }}
			className={`tw-overflow-hidden tw-rounded-${rounded} ${className}`}
			{...restProps}
		/>
	);
}
