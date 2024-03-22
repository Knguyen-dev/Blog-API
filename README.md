# Blog-API

- Create a blog fullstack blog application. Have a front end application for viewing and
  editing posts. Let people read and comment on posts. Basically the blog should make it 
  so only you, imagine like the 'guardian' or 'the atlantic'. So I guess there should 
  be a section that allows users. Some inspirations to take from that are similar 
  are reddit, dogonews, ign, or something similar. It just has to involve posts, authors, comments,
  etcetera. Just takes things one at a time.

# Models:
- Posts should have an author, title, description, content. Also 
  each post should have the comments associated with that post.
  A timestamp as well to when it was first published.
  Finally we should be able to toggle in our database whether or 
  not a post is designated as published (visible) or unpublished.

# Credits:

1. Odin: https://www.theodinproject.com/lessons/nodejs-blog-api
2. Learn text editor: https://www.tiny.cloud/docs/tinymce/6/cloud-quick-start/
3. Additional resources: https://github.com/gitdagray/mern_stack_course/blob/main/lesson_08-backend/config/allowedOrigins.js


# Inspiration:
1. Site: https://dezien-blog.vercel.app/
- This is a good site to take design inspiration off of, but it's quite complex.
2. Site 2: https://blog-client-dovimaj.vercel.app/
- Here's an easy site to copy off of.
3. https://www.mohammadfaisal.dev/blog; this one would be difficult, but I think I like their simplified blog page a lot better than my youtube-esque one. I guess it's 
probably better if I personalize my website a bit.

# How can we do image storage:
1. File system: Store images on web server file system. Downsides are 
  storage limitations and if server goes down, then iamges could be lost.
2. Cloud Storage: Store them to a cloud storage service such as Amazon S3, Google Cloud Storage, or Azure Blob Storage. When a user uploads an image through the React front end, it can be sent to the Node.js back end, which then handles the process of storing the image in the cloud storage. The image's URL or key can then be saved in the MongoDB database so that it can be retrieved and displayed when needed. This approach ensures efficient storage and retrieval of images while keeping the application responsive. This is one of the best ways as it involves horizontal scaling (adding more servers to handle load), instead of vertical scaling (upgrading hardware).
3. Base64 encoding: Encode images as base64 string and store them directly in the database.
4. CDN: A content delivery network can be used to store image. Images are stored on multiple
  servers around the world.


# Mui and Tailwind Integration tutorial
- https://kir4n.hashnode.dev/mui-with-tailwind-css
- NOTE: Though a popular and useful library, you can also use flowbite 
  which is a lot more easy to integrate since that is based on tailwind styles.

# Rate Limiting:
- For personal projects, express-rate-limiter gets the job done and can is a good 
  fit for your application. However, for larger scale applications it's common practice
  to have an nginx server running in front of your node server. This nginx server 
  acts as a 'reverse proxy'


# BOOK MARK:
I think our folder structure change is nearing its end. In the end, I think we did pretty good. It's a lot better than what we started out with that's for sure. Now the hooks and components are put in their separate pages which is good. After this you may be tempted to start building the ManagePost page, but no, we must add tests first. Though do the react-folder-structure commit first, and then start adding tests to the backend.

# Commit

Improved Frontend folder structure
- Frontend:
Major changes to the react folder structure. Components, files, and constants that are specific to a certain
page will be stored in a folder for that page. While general components, hooks, and other items will be stored 
in their respective root folders in the src directory.

- Backend:
1. Fixed an error with verifyJWT and how it threw errors back
2. Simplified error handling by removing 'ValidationError'. After some deliberation we realized that it was adding unnecessary complexity to the application, and it wasn't really used all that much.



# BOOK MARK:
- Finished functionality for categories and tags. Now we need to add functionality to posts.For managing tags, we'll create a dedicated tag section for editors/admins where they can add, delete, or edit tags. This section will be in the editor tab, and it will show a shared table of all tags in the database, which will help editors know which tags are available. Then they can use those tags in a post. So in this case, if an editor wants to have a tag on a post, but that tag doesn't exist yet, they can just go to the editor page and add that tag. Finally they'll be able to go back to the editor suite and add that tag to the post.



- Note that if a user logs out, we should probably clear the postData in their
  local storage. You should probably need to save their postData to the database 
  as a post that's a draft. I see that makes more sense 


### Planned
- Now: Uniformalize our error handling so all of the appropriate controllers and 
  all of the frontend hooks accept this new error system. For the front-end portion,
  it's probably a good idea to create some kind of facade pattern or something like
  'getErrorDetails' or 'getErrorMessage', when given the 'err' object from axios.
  Or you could combine it into one function separate things with a boolean flag, but 
  we want to make it so we don't have to do 'err.response.data.error.details' everytime
  or 'err.response.data.error.message'.

  
- One good idea would be having your database errors raise
a field, such as 'username' or 'title'. Then when they're 
sent down the error pipeline, you can create the 'details'
property, so {username: "Username was already taken!"}. Of course 
will happen when err.field is defined. Anyways this can give us 
leeway on how the frontend can use these error messages. Let's imagine
this with our 'signupUser' controller. If the database error had 'Username already taken!',
then our error object we send back will be {error: {..., details: {username: "Username already taken!"}}}.
So this pattern would be good for database errors. But also for validation errors, we would still have
{errors: {..., details: {username: "Some username rule", email: "Some email rule", etc.}}}. In either case,
this allows the front-end to do 'err.response.data.error.details' to render error messages for each respective
field. As well as this, it laso gives the frontend the flexibility to simply do 'err.response.data.error.message' if they prefer to render one big error message. Yes, as long as we differentiate validation errors
 with status code 400, this could be a good plan. As well as this, as long as we have those front-end 
 helper functions 'getErrorMessage' or 'getErrorDetails', we would be able to flexibly switch.





1. Changing up the react folder structure. Decide between 'intermediate' and 'advanced'.
2. Add markup and functionality for showing 'published on' and last edited
  on dates.
3. Adding tests and practicing making tests for existing things ('probably with the help of tabnine').
  Get some practice with TDD and thinking like TDD
4. Adding certain permissions for posts, maybe an admin can only update the status. Who can
  delete the post, etc.
5. Switch to using JSDocs convention for commenting functions. Learn more about that
6. Adding markup and logic for managing tags and categories
7. Probably switching to TypeScript.


# Commit 

## Frontend
- Added pages for creating new post and saving changes to existing posts.
- Removed PrismJS code highlighting for PostPreview at the moment since it only highlights JS code, and can't detect other code.
- Updated most of the hooks so that they accomodate the new way that we handle errors. 

## Backend
- Add routes for CRUD operations with Posts.
- Partially updated the way we handle validation errors and database errors.
  The changes have been applied in our new controllers 'Post' 'Tags' and 
  'Category'. But we will still need to migrate these changes over to the 
  other controllers.








2. You likely want to get looking into api caching when getting data 
  such as Employees, Posts for hte posts grid, but also posts and comments.
  For now basic caching for express should do the job nicely. In the future 
  though, try to look into things such as Redis. 





# Hosting 
- Definitely not hosting on Netlify considering that you can get 
  charged even if you're a free tier user. Probably best if we deploy 
  on render or cloudflare pages
- 

# Credits:
1. https://stackoverflow.com/questions/57650692/where-to-store-the-refresh-token-on-the-client
2. https://medium.com/@sadnub/simple-and-secure-api-authentication-for-spas-e46bcea592ad
3. How to create youtube layout (tailwind typescript): https://youtu.be/ymGB1lqP1CM?si=BZv6QUEFMrVKE5Qf
4. TinyMCE V6 Docs: https://www.tiny.cloud/docs/tinymce/6/
5. React forms and jwt: https://www.youtube.com/watch?v=brcHK3P6ChQ&list=PL0Zuz27SZ-6PRCpm9clX0WiBEMB70FWwd
6. https://deadsimplechat.com/blog/how-to-safely-use-dangerouslysetinnerhtml-in-react/