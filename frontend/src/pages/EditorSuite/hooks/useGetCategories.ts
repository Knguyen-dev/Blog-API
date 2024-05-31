import usePublicFetchData from "../../../hooks/usePublicFetchData";
import { ICategory } from "../../../types/Post";

export default function useGetCategories() {
	const {
		data: categories,
		setData: setCategories,
		isLoading,
		error,
	} = usePublicFetchData<ICategory[]>("/categories");
	return { categories, setCategories, isLoading, error };
}
