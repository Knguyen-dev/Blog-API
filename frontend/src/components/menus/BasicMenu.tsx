import { Menu, MenuItem } from "@mui/material";
const ITEM_HEIGHT = 48;

export interface MenuItemProps {
  label: string;
  onClick: () => void;
  ariaLabel?: string;
}

interface BasicMenuProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  items: MenuItemProps[];
  handleClose: () => void;
}

export default function BasicMenu({
  open,
  anchorEl,
  items,
  handleClose,
}: BasicMenuProps) {
  return (
    <Menu
      id="long-menu"
      MenuListProps={{
        "aria-labelledby": "long-button",
      }}
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      // slotProps.paper doesn't seem to work with TypeScript, so we'll keep this for nwo
      PaperProps={{
        style: {
          maxHeight: ITEM_HEIGHT * 4.5,
          width: "20ch",
        },
      }}>
      {items.map((item, index) => (
        <MenuItem
          key={index}
          onClick={item.onClick}
          aria-label={item.ariaLabel}>
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  );
}
