import usePublicFetchData from "../../../hooks/usePublicFetchData";
import { ITag } from "../../../types/Post";

export default function useGetTags() {
	const {
		data: tags,
		setData: setTags,
		isLoading,
		error,
	} = usePublicFetchData<ITag[]>("/tags");
	return { tags, setTags, isLoading, error };
}
