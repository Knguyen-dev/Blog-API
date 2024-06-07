/*
+ EditPostAccordion: Acts as a control pnael for editing posts. Here 
  editors will be shown the various sections they can interact with to 
  edit the post that they're working on.
*/

import {
  ChangeEvent,
  SyntheticEvent,
  Dispatch,
  useState,
  SetStateAction,
} from "react";
import { SelectChangeEvent } from "@mui/material";
import { Editor as TinyMCEEditor } from "tinymce";
import NewBasicSelect from "../../../components/select/NewBasicSelect";
import FilteredAutoSelect from "../../../components/autocomplete/FilteredAutoSelect";
import BasicAccordion from "../../../components/accordion/BasicAccordion";
import { Box, TextField, Button } from "@mui/material";
import { postStatuses } from "../data/postConstants";
import PostEditor from "./PostEditor";
import FormError from "../../../components/Input/FormError";

import {
  ICategory,
  ITag,
  PostStatusType,
  IPostState,
} from "../../../types/Post";

interface IEditPostAccordion {
  // State and state setter for the postData
  postData: IPostState;

  setPostData: Dispatch<SetStateAction<IPostState>>;

  // Categories and tags that you can pick from
  categories: ICategory[];
  tags: ITag[];

  // Post submission function and states; will be different based on the EditPostPage and CreatePostPage
  onSubmitPost: () => void;
  submitError: string | null;
  submitLoading: boolean;
}

export default function EditPostAccordion({
  postData,
  setPostData,
  categories,
  tags,
  onSubmitPost,
  submitError,
  submitLoading,
}: IEditPostAccordion) {
  // State that indicates the current accordion that's expanded.
  const [activeIndex, setActiveIndex] = useState<number>(0);

  /*
  + Handles clicks on the accordion given the index position
    of said accordion
  - If clicked in an already expanded section, close the section. To
    close the section and leave all other sections closed, set index to 
    a value out of range, such as -1. Then stop function execution early.
  - Else, they are clicking on a section that is different from the opened 
    one, so just set the active index to the new index.
  */
  const handleAccordionChange = (index: number) => {
    if (index === activeIndex) {
      setActiveIndex(-1);
      return;
    }
    setActiveIndex(index);
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPostData: IPostState = {
      ...postData,
      title: e.target.value,
    };
    setPostData(newPostData);
  };

  const handleCategoryChange = (e: SelectChangeEvent) => {
    // Should be defined since they can't pick none by default
    const categoryID: string = e.target.value;
    const category = categories.find((c) => c._id === categoryID);
    const newPostData: IPostState = {
      ...postData,
      category: category,
    };
    setPostData(newPostData);
  };

  const handleBodyChange = (newValue: string, editor: TinyMCEEditor) => {
    const wordCount = editor.plugins.wordcount.body.getWordCount();
    const newPostData: IPostState = {
      ...postData,
      body: newValue,
      wordCount: wordCount,
    };
    setPostData(newPostData);
  };

  const handleTagChange = (_e: SyntheticEvent, newValues: ITag[] | null) => {
    const newPostData: IPostState = {
      ...postData,
      // If we have tags return them, else it's undefined set it to an empty array
      tags: newValues ? newValues : ([] as ITag[]),
    };
    setPostData(newPostData);
  };

  const handleImgSrcChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPostData: IPostState = {
      ...postData,
      imgSrc: e.target.value,
    };
    setPostData(newPostData);
  };

  const handleImgCreditsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPostData: IPostState = {
      ...postData,
      imgCredits: e.target.value,
    };
    setPostData(newPostData);
  };

  const handleStatusChange = (e: SelectChangeEvent) => {
    const newPostData: IPostState = {
      ...postData,
      status: e.target.value as PostStatusType,
    };
    setPostData(newPostData);
  };

  // Create sections for the accordion that we'll use to render
  const sections = [
    {
      title: "Title, Category, & Body",
      content: (
        <Box className="tw-flex tw-flex-col tw-gap-y-2">
          {/* Input fields for the form */}
          <TextField
            label="Title"
            id="title"
            name="title"
            value={postData.title}
            onChange={handleTitleChange}
            required
          />
          <NewBasicSelect
            value={postData.category?._id || ""}
            onChange={handleCategoryChange}
            label="Post Category"
            options={categories}
            getOptionLabel={(option) => option.title}
            getOptionValue={(option) => option._id}
            placeholder="Select a category for the post"
            required
          />
          <PostEditor value={postData.body} onChange={handleBodyChange} />
        </Box>
      ),
    },
    {
      title: "Tags",
      content: (
        <FilteredAutoSelect
          id="tags"
          label="Post Tags"
          placeholder="Select Tags"
          options={tags}
          selectedValues={postData.tags}
          onChange={handleTagChange}
          getOptionLabel={(option) => option.title}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          limitTags={3}
        />
      ),
    },
    {
      title: "Display Image",
      content: (
        <Box className="tw-flex tw-flex-col tw-gap-y-4">
          <TextField
            label="Post Image"
            helperText="The src link of the image will be the thunmbnail of the post"
            value={postData.imgSrc}
            onChange={handleImgSrcChange}
            required
          />

          <TextField
            label="Image Credits"
            name="imgCredits"
            helperText="Credits to the photographer of the image and platform it came from"
            value={postData.imgCredits}
            onChange={handleImgCreditsChange}
          />
        </Box>
      ),
    },
    {
      title: "Submission",
      content: (
        <Box className="tw-flex tw-flex-col tw-gap-y-2">
          <NewBasicSelect
            value={postData.status}
            onChange={handleStatusChange}
            label="Status"
            options={postStatuses}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            placeholder="Select a status for the post"
            required
          />

          {submitError && <FormError message={submitError} />}
          {/* Action Buttons for the form */}
          <Box className="tw-flex tw-justify-end tw-gap-x-4">
            <Button
              variant="contained"
              color="primary"
              onClick={onSubmitPost}
              disabled={submitLoading}>
              Submit
            </Button>
          </Box>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {sections.map((section, index) => (
        <BasicAccordion
          key={index}
          expanded={activeIndex === index}
          handleChange={() => handleAccordionChange(index)}
          headerTitle={section.title}
          id={`accordion-${index}`}>
          {section.content}
        </BasicAccordion>
      ))}
    </Box>
  );
}
