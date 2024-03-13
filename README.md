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
Finished functionality for categories and tags. Now we need to add functionality to posts.
For managing tags, we'll create a dedicated tag section for editors/admins where they 
can add, delete, or edit tags. This section will be in the editor tab, and it will show 
a shared table of all tags in the database, which will help editors know which tags are 
available. Then they can use those tags in a post. So in this case, if an editor wants to 
have a tag on a post, but that tag doesn't exist yet, they can just go to the editor page 
and add that tag. Finally they'll be able to go back to the editor suite and add that tag 
to the post.








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