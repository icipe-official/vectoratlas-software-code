import { useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from "next/router";

export default function NavLink({url, text}: {url: string, text: string}) {
  const router = useRouter();
  const theme = useTheme();
  const baseStyle = { padding: '8px', '&:hover': { backgroundColor: theme.palette.primary.light, borderRadius: "40%" } };
  const sx = router.pathname == url
    ? { ...baseStyle,
      a: {textDecoration: 'underline',
        textDecorationColor: theme.palette.secondary.main,
        textUnderlineOffset: '4px',
        textDecorationThickness: '3px' } }
    : baseStyle;

  return (
    <Typography
      data-testid={"navlink " + text}
      variant="h5"
      component="div"
      color="primary"
      sx={sx}>
      <Link href={url}>{text}</Link>
    </Typography>
  );
}
