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


# BOOK MARK:
- Currently working on how to refresh our access token. More particularly when to run our effect, how to detect when our jwt 
has expired, and how to run it again. My idea is that on success of 
getting an access token, we set a timer based on how long that access token is supposed to last.  Then after that timer we try for another access token. If the request fails, we don't set up that timer, and at that we should wait for the user to login.

- Access Token: send them as json and store them in a react state so they're autolost 
  when the user refreshes the page or leaves the site. So store them in a state
  rather than localstorage or cookie
- Refresh token: Send as an httpOnly cookie, which can't be accessed with javascript.

- Test user: kbizzzyy 'P$ss0Ward0'

  1. Dave Gray's jwt with cookies and axios: https://www.youtube.com/watch?v=nI8PYZNFtac&t=134s


  1. https://stackoverflow.com/questions/57650692/where-to-store-the-refresh-token-on-the-client
  2. https://medium.com/@sadnub/simple-and-secure-api-authentication-for-spas-e46bcea592ad


