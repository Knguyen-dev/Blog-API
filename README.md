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
- Work on fleshing out and commenting the forms. We have three forms one for changing avatar, which we 
  don't even know how to store images yet, one for changing 'profile' information, and one for 
  changing the password. These forms are more specialized for the account page as we have added
  the ability to close these forms. So next we'll definitely be working on commenting, but also be working on both 
  front end backend development. Also maybe we should also look into how to structure our project in regards to 
  our '.env' file, and whether we should be having one or two. It makes sense to have one, for that 'role based authentication'
  we do though. Also working on the responsiveness would likely be a good idea as well, in regards to our forms and layout



# Avatar Stuff:
1. If we fail in deleting the old one, we should probably cancel the operations.
  Should probably have the option of using an avatar or just using initials.
  Should handle the case of showing a default image of avatar wasn't found.



  1. https://stackoverflow.com/questions/57650692/where-to-store-the-refresh-token-on-the-client
  2. https://medium.com/@sadnub/simple-and-secure-api-authentication-for-spas-e46bcea592ad
  3. How to create youtube layout (tailwind typescript): https://youtu.be/ymGB1lqP1CM?si=BZv6QUEFMrVKE5Qf
  4. TinyMCE V6 Docs: https://www.tiny.cloud/docs/tinymce/6/

