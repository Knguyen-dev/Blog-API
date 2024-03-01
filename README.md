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

1. Found out the real. Issue apparently axios changed the content type 
  of prevRequest, but now that we changed it back, it works. 

2. Now we need need rate limiters for our requests. How many times can a user 
  change their avatar. How many times can a user change their username. So
  yes rate limits on the modification of users and other things.

  
  


3. Now we should get started on working with TinyMCE, which is the rich text
  editor we're trying to use. Here we'll start designing the page for 
  creating posts. We'll probably just get started on the 'design and appearance'
  rather than actually working with posts.


# Commit Changes
+ Frontend:
- Implemented a simple hook to help us deal with disabling submit buttons in
  forms for client side rate limiting.

+ Backend:
- Implemented logic for limiting and tracking username changes.

- Should probably talk about 

# More progress Commit Description:

+ Front End
- Added package to disable react-dev-tools in production.
- Fixed issue with axios that would lose image data when trying to 
  refresh an expired access token.
- Updated theming, so now our theme function accepts an object of 'preferences'. 
  ColorProvider now controls these preferences.
- Changed ResponsiveDrawer, so now it works when animations/transitions are disabled.

- Avatar form is now updated and now initially displays the user's current avatar, but
  also displays the image of the currently selected image file. For the login and 
  signup form, we're experimenting how we can disable submit buttons when we get
  a status code 429.


+ Backend: 
- Added rate limiters for our auth, employee and user controller
- Added role middleware that helps us verify permissions for the user controlller
- Added route and function for signing up users that are employees.







# Credits:
1. https://stackoverflow.com/questions/57650692/where-to-store-the-refresh-token-on-the-client
2. https://medium.com/@sadnub/simple-and-secure-api-authentication-for-spas-e46bcea592ad
3. How to create youtube layout (tailwind typescript): https://youtu.be/ymGB1lqP1CM?si=BZv6QUEFMrVKE5Qf
4. TinyMCE V6 Docs: https://www.tiny.cloud/docs/tinymce/6/
5. React forms and jwt: https://www.youtube.com/watch?v=brcHK3P6ChQ&list=PL0Zuz27SZ-6PRCpm9clX0WiBEMB70FWwd
