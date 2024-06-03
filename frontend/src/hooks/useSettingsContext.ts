import { useContext } from "react";
import { SettingsContext } from "../contexts/SettingsProvider";

export default function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw Error("useSettingsContext must be used inside a settings provider!");
  }
  return context;
}
