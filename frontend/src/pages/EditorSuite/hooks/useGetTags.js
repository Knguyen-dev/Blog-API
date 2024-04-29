import usePublicFetchData from "../../../hooks/usePublicFetchData";
export default function useGetTags() {
	const {
		data: tags,
		setData: setTags,
		isLoading,
		error,
	} = usePublicFetchData("/tags");
	return { tags, setTags, isLoading, error };
}
