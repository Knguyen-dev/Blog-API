/*
+ useLocalStorage: A react hook that makes it easier to work 
  with local storage. 

- NOTE: This hook is made to be flexible and used with future projects, so 
  there will be complex stuff and mentions. But we will clear that up when
  we get to them
*/

import { useState, useEffect } from "react";

const getLocalValue = <T>(key: string, initValue: T) => {
  try {
    // If using hook in SSR (server-side-rendering or server-side-react such as Next.js)
    if (typeof window === "undefined")
      return initValue instanceof Function ? initValue() : initValue;

    const localValue = localStorage.getItem(key);
    if (localValue) return JSON.parse(localValue) as T;

    // No stored value, but if default value was a function return it's result
    if (initValue instanceof Function) return initValue();

    // No stored value and default value wasn't a fucntion so simply return it.
    return initValue;
  } catch (err) {
    /*
    - If any errors happened getting data, then default to the initial value 'initValue'. Mainly errors would happen 
      due to issues relating to JSON.parse.
    */
    return initValue instanceof Function ? initValue() : initValue;
  }
};

export default function useLocalStorage<T>(
  key: string,
  initValue: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate: (value: any) => boolean
) {
  const [value, setValue] = useState<T>(() => {
    const localValue = getLocalValue<T>(key, initValue);

    // Ensure that the local value is valid, else return initial value
    return validate(localValue) ? localValue : initValue; // Validate the local value
  });

  useEffect(() => {
    if (typeof window === "undefined") return; // Don't execute in SSR
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return { value, setValue };
}
