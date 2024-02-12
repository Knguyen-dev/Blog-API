import useAuthContext from "./useAuthContext";

export default function useRefreshToken() {
	const { setAuth } = useAuthContext();

	const refresh = async () => {
		const response = await fetch("http://localhost:3000/auth/refresh", {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});
	};
}
