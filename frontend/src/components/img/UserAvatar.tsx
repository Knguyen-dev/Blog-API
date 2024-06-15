import { Avatar, AvatarProps } from "@mui/material";

interface IUserAvatarProps extends AvatarProps {
  fullName: string;
}

/**
 * Takes the full name of a user, and calculates/returns the initials of said user
 *
 * @param fullName - Full name of a user
 * @returns The initials of that full name
 */
const getInitialsFromName = (fullName: string) => {
  // Split the name into an array based on spaces, which represent sections of the name
  const nameArr = fullName.split(" ");
  let initials = "";

  // Get the first letter of the first section of the name, represents our starting initial.
  initials += nameArr[0][0];

  // If they have more than one part to their name, then we can get
  // a second letter for their initials. We do nameArr.length - 1 to target the last section of
  // their name. As a result we aim to get their first and last initials.
  if (nameArr.length > 1) {
    initials += nameArr[nameArr.length - 1][0];
  }

  // Return the uppercased version of the initials.
  return initials.toUpperCase();
};

/**
 * Custom component used to render a user's avatar. Here you can not only provide
 * the regular props for Mui's `Avatar` component, but you can pass the 'fullName' prop
 * so that even if the user doesn't have an avatar, we can use their initials.
 *
 * NOTE: As well, this component has uniform styles, which can ensure color accessibility.
 *
 * @param fullname - Full name of a user
 */
export default function UserAvatar({ fullName, ...props }: IUserAvatarProps) {
  return (
    <Avatar alt={fullName} sx={{ color: "black" }} {...props}>
      {getInitialsFromName(fullName)}
    </Avatar>
  );
}
