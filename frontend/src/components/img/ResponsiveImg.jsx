import PropTypes from "prop-types";

ResponsiveImg.propTypes = {
	src: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
	maxWidth: PropTypes.string,
	maxHeight: PropTypes.string,
	rounded: PropTypes.oneOf(["none", "sm", "md", "lg", "xl"]),
	objectFit: PropTypes.oneOf([
		"fill",
		"contain",
		"cover",
		"none",
		"scale-down",
	]),
	className: PropTypes.string,
	restProps: PropTypes.object,
};

export default function ResponsiveImg({
	src,
	alt,
	maxWidth = "100%",
	maxHeight = "100%",
	rounded = "md",
	objectFit = "cover",
	className,
	...restProps
}) {
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
