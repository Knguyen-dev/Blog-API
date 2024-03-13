/*
+ useLocalStorage: A react hook that makes it easier to work 
  with local storage. 

- NOTE: This hook is made to be flexible and used with future projects, so 
  there will be complex stuff and mentions. But we will clear that up when
  we get to them
*/

import { useState, useEffect } from "react";

const getLocalValue = (key, initValue) => {
	try {
		// If using hook in SSR (server-side-rendering or server-side-react such as Next.js)
		if (typeof window === "undefined") return initValue;

		const localValue = JSON.parse(localStorage.getItem(key));

		// If stored value existed, return it to be the state
		if (localValue) return localValue;

		// No stored value, but if default value was a function return it's result
		if (initValue instanceof Function) return initValue();

		// No stored value and default value wasn't a fucntion so simply return it.
		return initValue;
	} catch (err) {
		/*
    - If any errors happened, then return 'initValue'. Mainly errors would happen 
      due to issues relating to JSON.parse.
    
    */
		return initValue;
	}
};

export default function useLocalStorage(key, initValue) {
	const [value, setValue] = useState(() => getLocalValue(key, initValue));
	useEffect(() => {
		if (typeof window === "undefined") return; // Don't execute in SSR
		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return { value, setValue };
}
