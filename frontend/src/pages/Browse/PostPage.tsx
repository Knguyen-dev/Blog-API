import { useParams } from "react-router-dom";
import { Typography, Container } from "@mui/material";
import NewPostPreview from "./NewPostPreview";
import usePublicFetchData from "../../hooks/usePublicFetchData";
import { IPost } from "../../types/Post";

/**
 * Component for viewing a certain post in detail. Here we fetch the data for the
 * post from the backend, and use the `NewPostPreview` component to render the
 * post in a human-readable format for our users to read.
 */
export default function PostPage() {
  const { slug } = useParams(); // slug for a given post
  const { data: post, error } = usePublicFetchData<IPost>(
    `/posts/published/slug/${slug}`
  );

  return (
    <div className="tw-flex-1 tw-overflow-y-auto">
      <Container>
        {/* If post data was successfully gotten (defined) */}
        {post ? (
          <NewPostPreview
            title={post.title}
            category={post.category}
            body={post.body}
            dateStr={post.createdAt}
            authorName={post.user.fullName}
            imgSrc={post.imgSrc}
            imgCredits={post.imgCredits}
            // pass an array of strings to make it less complicated/coupled
            tags={post.tags}
          />
        ) : error ? (
          <Typography className="tw-text-center tw-py-4" variant="h3">
            Error: {error}
          </Typography>
        ) : (
          <Typography>Loading in the post!</Typography>
        )}
      </Container>
    </div>
  );
}
