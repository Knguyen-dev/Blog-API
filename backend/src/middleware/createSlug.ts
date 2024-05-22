import slugify from "slugify";

/**
 * Returns a url slug, when given a string
 * 
 * @param {string} string - String that we are going to turn into a URL slug
 * @returns Slug for the string
 */
export default function createSlug(string: string): string {
  // Create slug from the title
  const slug = slugify(string, {
    lower: true, // lowercases the string 
    replacement: "-", // replaces spaces with '-'
    strict: true, // removes all other special characters apart from replacement
    trim: true , // trims leading and trailing replacement characters
  })
  return slug;
}