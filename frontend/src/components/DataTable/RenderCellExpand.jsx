/*
+ RenderCellExpand: Component that we can use with columns on our data grid.
  As a result if, some content overflows on the datagrid, we can hover 
  over it to see the full content inside a little container.

*/

/* eslint-disable react-refresh/only-export-components */
import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import PropTypes from "prop-types";

function isOverflown(element) {
	return (
		element.scrollHeight > element.clientHeight ||
		element.scrollWidth > element.clientWidth
	);
}

const GridCellExpand = React.memo(function GridCellExpand(props) {
	const { width, value } = props;
	const wrapper = useRef(null);
	const cellDiv = useRef(null);
	const cellValue = useRef(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const [showFullCell, setShowFullCell] = useState(false);
	const [showPopper, setShowPopper] = useState(false);

	const handleMouseEnter = () => {
		const isCurrentlyOverflown = isOverflown(cellValue.current);
		setShowPopper(isCurrentlyOverflown);
		setAnchorEl(cellDiv.current);
		setShowFullCell(true);
	};

	const handleMouseLeave = () => {
		setShowFullCell(false);
	};

	useEffect(() => {
		if (!showFullCell) {
			return () => {};
		}

		function handleKeyDown(nativeEvent) {
			// IE11, Edge (prior to using Bink?) use 'Esc'
			if (nativeEvent.key === "Escape" || nativeEvent.key === "Esc") {
				setShowFullCell(false);
			}
		}

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [setShowFullCell, showFullCell]);

	return (
		<Box
			ref={wrapper}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			sx={{
				alignItems: "center",
				lineHeight: "24px",
				width: "100%",
				height: "100%",
				position: "relative",
				display: "flex",
			}}>
			<Box
				ref={cellDiv}
				sx={{
					height: "100%",
					width,
					display: "block",
					position: "absolute",
					top: 0,
				}}
			/>
			<Box
				ref={cellValue}
				sx={{
					whiteSpace: "nowrap",
					overflow: "hidden",
					textOverflow: "ellipsis",
				}}>
				{value}
			</Box>
			{showPopper && (
				<Popper
					open={showFullCell && anchorEl !== null}
					anchorEl={anchorEl}
					style={{ width, marginLeft: -17 }}>
					<Paper
						elevation={1}
						style={{ minHeight: wrapper.current.offsetHeight - 3 }}>
						<Typography variant="body2" style={{ padding: 8 }}>
							{value}
						</Typography>
					</Paper>
				</Popper>
			)}
		</Box>
	);
});

GridCellExpand.propTypes = {
	width: PropTypes.number,
	value: PropTypes.string,
};

export default function RenderCellExpand(params) {
	return (
		<GridCellExpand
			value={params.value || ""}
			width={params.colDef.computedWidth}
		/>
	);
}
