# Blog-API
Create a blog fullstack blog application. Have a front end application for viewing and editing posts. Let people read and comment on posts. Basically the blog should make it so only you, imagine like the 'guardian' or 'the atlantic'. So I guess there should be a section that allows users. Some inspirations to take from that are similar are reddit, dogonews, ign, or something similar. It just has to involve posts, authors, comments, etcetera. Just takes things one at a time.


## Scripts
```
npm run test:file -- path/to/your/test/file.test.js; runs individual test file
```


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

4. Code Design AI Site: https://dev.codedesign.ai/app/builder?project=blogsphere-website-contentc32bt7aqdw#home
5. SitesGpt AI Site: https://dev.codedesign.ai/app/builder?project=blogsphere-website-contentc32bt7aqdw#home

# How can we do image storage:
1. File system: Store images on web server file system. Downsides are 
  storage limitations and if server goes down, then images could be lost.
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



## BOOK MARK:
1. This would also be a good time to actually research line 
  clamping, and how to cut off lines in css, so you actually know what line-clamp is doing.
5. Work on home page, project page, work on about page, work on contact page. I think for these, you may keep them as static. Work on the footer, so that 
it contains a little more information stuff like contact info, address, name and logo, etc.

- Make sure to add 'id' attributes to each section on the home page, and then integrating that with react router navigation functionality. 

- Learn about aria and accessibility. Freecodecamp has a course on it, and also I think the Odin Project did have a lesson on aria and accessibility.

- Work on colors. For dark theme, I think we should probably put a little more effort into it. Code Design has a yellow and black design that it cooked up.
I'll call that 'CodeDesignTheme' for the name. There's also the theme created
by sitesgpt, it's like a blue thing, you may want to tweak this.

- Let's engineer the styling. Let's make it so we use a sticky header and times where we don't. May have to do some research on sticky and some tutorials on how to make it happen. Probably going to use a state, and pass down a state with outlet context called 'isStickyHeader',  which will in turn mess with css classes. Of course, there's no guarantee that our old example will work and allow us to easily 'plug in stuff', but it's worth a try. 



6. Navlinks, at least underline what navlink that the user is currently on

6. Uniformalize your business rules for the permissions. Will editors be able to 
  see the posts of other editors, or is it only admins, then check out our 
  backend to make sure we're doing that stuff. 
7. Rate limiting on searches would be nice. Maybe it's time for a global rate limiter? 
8. I don't think we've handled user deletion functionality yet. At least not how
  it relates to posts, so double check if that's still a thing.
9. Practice optimizations. Stuff like lazy loading, reading the react profiler, etc. I think lazy loading can definitely help since there are a lot of pages that aren't available to the average user. As well as this let's do some query optimizations. Ensure that server-side queries that we're making are good

10. Apparently there's also the idea of image optimization. I don't think we've optimize or handle images the proper way at all.
11. Images themselves for our posts. May be deleted due to the internet. So instead. Maybe for images, we could have two options, upload an image or just enter a url. If image does not exist for some reason, we will have a default image. Let's handle this on the front end, since on the backend it's a little more involved to check if an image works (making a request), let's just keep that on the front.

12. Api Pagination? Of course we don't want to fetch everything from the database. And then update the front-end accordingly?

13. Have a redis cache? Well in order for this to happen, it needs to work, even if the redis cache doesn't exist. So in case we don't use the website for awhile and the redis cache has been disabled, then our website still needs to work as normal.




16. Our colors suck, and that's probably because of our theming. Maybe we should change to tailwind for dark and light them stuff.

### Additional stuff you'd put in another branch
14. Start a conversion over to typescript since we want to practice typescript.
15. User comments and user likes?
16. For user account creation, how about an email confirmation and whatnot. 
17. Letting users send emails to our company's email address. 
18. 'Continue using google' or logging in with google could be a good challenge.


## Commit 

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
7. https://wix.com/blog/beautiful-contact-pages