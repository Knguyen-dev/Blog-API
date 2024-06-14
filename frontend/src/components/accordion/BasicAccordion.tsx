/*
+ BasicAccordion: Simple accordion component that allows us to create one accordion.
*/
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ReactNode } from "react";

interface BasicAccordionProps {
  expanded: boolean;
  handleChange: () => void;
  headerTitle: string;
  children: ReactNode;
  id?: string;
}

/**
 * Simple accordion component that allows us to create one accordion
 */
export default function BasicAccordion({
  expanded,
  handleChange,
  headerTitle,
  children,
  id,
}: BasicAccordionProps) {
  const theme = useTheme();

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      sx={{
        backgroundColor: theme.palette.background.paper,
      }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${id}-content`}
        id={`${id}-header`}>
        <Typography sx={{ width: "40%", flexShrink: 0 }}>
          {headerTitle}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
