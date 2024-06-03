/*
- Making a global snackbar. Essentially we want a snackbar can persist across 
  pages at times.
*/

import { createContext, useState, useEffect, SyntheticEvent } from "react";
import AlertToast from "../components/notifications/AlertToast";
import { SnackbarOrigin, AlertColor, SnackbarCloseReason } from "@mui/material";

interface Message {
  message: string;
  anchorOrigin?: SnackbarOrigin;
  autoHideDuration?: number;
  severity?: AlertColor;
  key?: number;
}

interface ToastContextType {
  showToast: (messageObj: Message) => void;
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

// Default snackbar settings if said settings aren't passed through our messageObj
const DEFAULTS = {
  message: "Default Snackbar Message",
  anchorOrigin: { vertical: "bottom", horizontal: "left" },
  autoHideDuration: 5000,
  severity: "info",
};

export default function ToastProvider({ children }: ToastProviderProps) {
  /*
  + States:
  - snackPack: A queue of snack our snackbar messages. Each element will be a message
    object contains information on how we will show that message with the snackbar.
  - open: Boolean that indicates whether the snackbar is currently being displayed or not.
  - messageInfo: Represents the current message object that is being displayed via our snackbar.

  - NOTE: 
  1. It should be noted this is the implementation for a consecutive snackbar, where
    multiple notifications can appear in quick succession. We used this over a regular 
    snackbar because it fixed an issue, where when rendering multiple messages in succession, 
    the timers on the messages were being shared rather than separate.

  2. Why implement a global snackbar like this? Well for our use-cases, we wanted to display 
    a snackbar for when the user changed their password or deleted their account. Both involved 
    us running the code to logout the user from one component "ChangePasswordForm" or "DeleteAccountForm"
    and then the user would be redirected to the login page. In this case, it'd be easier if our snackbar
    was able to persist across our pages, so that even when the user redirects our snackbar is still there.
    With the HOC solution we were researching at the time, it was more suitable for local snackbars that 
    existed as long as the page component was still mounted, and this wasn't the tool we were looking for.
    Of course, this snackbar is able to satisfy the use-cases we needed and others if they pop up.
  */
  const [snackPack, setSnackPack] = useState<Message[]>([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState<Message | undefined>(
    undefined
  );

  /*
  + Effect: Manages the Snackbar queue
  - If there are pending messages in the queue and no message is currently being displayed,
    set the current message to the first one in the queue, then remove it from the queue.
  
  - Otherwise, if there are pending messages in the queue, and there is an active message being displayed,
    close the active Snackbar. This triggers the 'handleExited' callback, clearing the 'messageInfo'.
    Subsequently, the effect runs again, entering the first condition and setting the new message
    from the queue to be displayed on the Snackbar.
*/
  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Display a new snack when there's no active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  // Enqueues a new message object on the end of our snackbar queue state
  const showToast = (messageObj: Message) => {
    setSnackPack((prev) => [
      ...prev,
      { ...messageObj, key: new Date().getTime() },
    ]);
  };

  // Hides the snackbar, so it hides the current message
  const handleClose = (
    _event?: SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      // if we click the background, it doesn't close snackbar.
      return;
    }
    setOpen(false);
  };

  // Clears current message on the snackbar; runs when snackbar component unmounts
  const handleExited = () => {
    setMessageInfo(undefined);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <AlertToast
        key={messageInfo?.key}
        open={open}
        message={messageInfo?.message || DEFAULTS.message}
        severity={messageInfo?.severity}
        handleClose={handleClose}
        handleExited={handleExited}
        anchorOrigin={messageInfo?.anchorOrigin}
        autoHideDuration={
          messageInfo?.autoHideDuration || DEFAULTS.autoHideDuration
        }
      />
    </ToastContext.Provider>
  );
}
