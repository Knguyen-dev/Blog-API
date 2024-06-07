import { Box, Typography, useTheme } from "@mui/material";
interface IFormErrorProps {
  message: string;
  className?: string;
  sx?: object;
}

export default function FormError({ message, className, sx }: IFormErrorProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.neutral,
        textAlign: "center",
        padding: "0.75rem",
        borderRadius: "0.5rem",
        color: theme.palette.error.main,
        fontSize: "0.8rem",
        fontWeight: "bold",
        ...sx,
      }}
      className={className}>
      <Typography fontWeight="700">{message}</Typography>
    </Box>
  );
}
