import { useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Container } from "@mui/material";
import SearchBar from "../../components/Input/SearchBar";
import usePublicFetchData from "../../hooks/usePublicFetchData";
import PostCard from "./PostCard";
import { IPost, ICategory } from "../../types/Post";

interface IFetchData {
  category: ICategory;
  posts: IPost[];
}

export default function CategoryPage() {
  const { id } = useParams(); // category ID
  const { data, error, fetchData } = usePublicFetchData<IFetchData>(
    `/categories/${id}/posts/published`
  );

  const [title, setTitle] = useState("");

  const handleSearchPosts = async () => {
    const endPoint = `/categories/${id}/posts/published`;

    /*
    - Fetch new posts for said category, include the title

    NOTE: If title is an empty string, the backend will act accordingly and 
    not filter the posts by title. As a result, we'd get all posts for that 
    category.
    */
    await fetchData(endPoint, {
      params: {
        title: title,
      },
    });
  };

  return (
    <div className="tw-flex-1 tw-flex-col tw-flex">
      <main className="tw-p-8 tw-overflow-y-auto">
        <Container maxWidth="md" className="tw-text-center">
          {data && (
            <>
              <Typography className="tw-mb-2" variant="h4">
                Category: {data.category.title}
              </Typography>
              <Typography>{data.category.description}</Typography>
            </>
          )}
          <SearchBar
            className="tw-mt-4"
            onSubmit={handleSearchPosts}
            placeholder="Search Post By Title!"
            name="search"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Container>

        <Box className="tw-flex tw-w-full tw-flex-wrap tw-justify-evenly tw-gap-4 tw-p-5">
          {data && data.posts ? (
            data.posts.length > 0 ? (
              data.posts.map((post, index) => (
                <PostCard key={index} postObj={post} />
              ))
            ) : (
              <Typography>
                No posts found! Maybe try another title or category?
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
