import { useState } from "react";

export default function useSignup() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(null);

	const signup = async (username, password) => {
		setIsLoading(true);
		setError(null);
	};
}
