import { useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import PostCard from "./PostCard";
import SearchBar from "../../components/Input/SearchBar";
import usePublicFetchData from "../../hooks/usePublicFetchData";
import { IPost, ITag } from "../../types/Post";

interface IFetchData {
  tag: ITag;
  posts: IPost[];
}

export default function TagPage() {
  const { id } = useParams(); // tag ID

  const { data, error, fetchData } = usePublicFetchData<IFetchData>(
    `/tags/${id}/posts/published`
  );

  const [title, setTitle] = useState("");

  const handleSearchPosts = async () => {
    const endPoint = `/tags/${id}/posts/published`;

    // Fetch data for new endpoint; updates the states from custom hook
    await fetchData(endPoint, {
      params: {
        title: title,
      },
    });
  };

  return (
    <div className="tw-flex-1 tw-flex-col tw-flex">
      <main className="tw-p-8 tw-overflow-y-auto">
        <Box className="tw-w-1/2 tw-mx-auto tw-mt-3">
          {data && (
            <Typography className="tw-text-center tw-mb-2" variant="h4">
              Tag: {data.tag.title}
            </Typography>
          )}
          <SearchBar
            onSubmit={handleSearchPosts}
            placeholder="Search Post By Title!"
            name="search"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>
        <Box className="tw-flex tw-w-full tw-flex-wrap tw-justify-evenly tw-gap-4 tw-p-5">
          {data && data.posts ? (
            data.posts.length > 0 ? (
              data.posts.map((post, index) => (
                <PostCard key={index} postObj={post} />
              ))
            ) : (
              <Typography>
                No posts found! Maybe try another title or tag?
              </Typography>
            )
          ) : error ? (
            <Typography>{error}</Typography>
          ) : (
            <Typography variant="h4">Loading in posts...</Typography>
          )}
        </Box>
      </main>
    </div>
  );
}
