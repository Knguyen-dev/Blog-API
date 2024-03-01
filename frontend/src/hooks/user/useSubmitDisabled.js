import { useState, useEffect } from "react";

/*
 + Hook used for disabling the 'submit' button on forms when server-side rate limiting has been activated.
 
@param {number} timeoutDuration - The duration in milliseconds for which the submit button will remain disabled (default: 30000ms).
@returns {object} An object containing the 'submitDisabled' state and the 'setSubmitDisabled' function to update the state.

- Note: This hook has a limitation where if the user activates the rate limiting near the end of the window
  (30 seconds on the server-side), then the submit button will be disabled for another 30 seconds.
 

 
 */
export default function useSubmitDisabled(timeoutDuration = 30000) {
	const [submitDisabled, setSubmitDisabled] = useState(false);

	// Effect that sets submitDisabled to true after time duration, essentially enabling the
	// submit button some time after they were hit by the '429' status code.
	useEffect(() => {
		let timer;
		if (submitDisabled) {
			timer = setTimeout(() => {
				setSubmitDisabled(false);
			}, timeoutDuration);
		}

		// Clear timer
		return () => clearInterval(timer);
	}, [submitDisabled, timeoutDuration]);

	return { submitDisabled, setSubmitDisabled };
}
