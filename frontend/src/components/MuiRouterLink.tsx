import { LinkProps as MuiLinkProps, Link as MuiLink } from "@mui/material";
import {
  LinkProps as ReactRouterLinkProps,
  Link as ReactRouterLink,
} from "react-router-dom";

/**
 * For the props it accepts all of Mui's link props, but it also accepts
 * react-router's 'to' property that they normally have on their router links.
 *
 */
interface IMuiRouterLinkProps extends MuiLinkProps {
  to?: ReactRouterLinkProps["to"];
}

/**
 * MUI styled link that has react-router's client side routing behavior.
 */
export default function MuiRouterLink({
  to = "/",
  ...rest
}: IMuiRouterLinkProps) {
  return <MuiLink {...rest} component={ReactRouterLink} to={to} />;
}
