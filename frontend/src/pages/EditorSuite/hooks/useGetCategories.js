import usePublicFetchData from "../../../hooks/usePublicFetchData";

export default function useGetCategories() {
	const {
		data: categories,
		setData: setCategories,
		isLoading,
		error,
	} = usePublicFetchData("/categories");
	return { categories, setCategories, isLoading, error };
}
