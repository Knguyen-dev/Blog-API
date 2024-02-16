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

# BOOK MARK:
- Work on useAxiosPrivate, ProtectedRoute, role-based route protection likely.
  I don't think we need 'useReducer' as we're not performing any complex operations
  on the auth state, though I think the auth state should have username, email, and 
  fullName as well. Maybe make auth state {accessToken, user: {...allUserProperties}}.

- Then next it would probably be designing the pages, which will probably be the 
  hardest parts. For layouts I think taking inspiration from youtube or ign would 
  be nice as they have the sidebar with topics, then the main content. But more realistically this is straight forward design: https://blog.100jsprojects.com/search?searchTerm=React.


  I think we should go for that sidebar and main-content, which we can use for search results and whatnot. Just try 
  it out with the responsive drawer. If you do, put it in the BrowsePage. For the sidebar you can do general
  topics. Don't worry about creating a 'specified blog' for a single topic

  However, next I think creating a profile page, where you just see your account. You'd have a main 
  content and then some tabs. It could be your home tab, just updating user stuff, editor tab where you create.


- Still need to wokr out the kinks of logging in and signing out

  1. https://stackoverflow.com/questions/57650692/where-to-store-the-refresh-token-on-the-client
  2. https://medium.com/@sadnub/simple-and-secure-api-authentication-for-spas-e46bcea592ad


