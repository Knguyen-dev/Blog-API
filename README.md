# Blog-API
Create a blog fullstack blog application. Have a front end application for viewing and editing posts. Let people read and comment on posts. Basically the blog should make it so only you, imagine like the 'guardian' or 'the atlantic'. So I guess there should be a section that allows users. Some inspirations to take from that are similar are reddit, dogonews, ign, or something similar. It just has to involve posts, authors, comments, etcetera. Just takes things one at a time.

Moving everything to 



### Client packages
Set up a new project with framework 'React' and variant 'TypeScript' using `npm create vite@latest`
```
npm i @emotion/react @emotion/styled @hookform/resolvers @mui/icons-material @mui/material @mui/x-data-grid axios dompurify react-hook-form react-router-dom yup

npm i -D @testing-library/jest-dom @testing-library/react @testing-library/user-event @tinymce/tinymce-react @types/dompurify autoprefixer jsdom postcss prettier prettier-plugin-tailwindcss tailwindcss vitest
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

# TypeScript and Jest
Install your packages:
```
npm i -D jest typescript
npm i -D ts-jest @types/test
```
Create a 'jest.config.js' in the same directory as package.json. Then run this command:
```
npx ts-jest config:init
```
Which should populate your jest.config.js file with this:
```
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node"
};
```
Create a folder named 'tests' at the same level as package.json and place your test files in this folder. The file naming should be file_name.test.ts

### Jest Globals
These are variables or functions such as 'describe', 'expect', 'test', etc. that jest provides. Now there are two ways to use these.
```
<!-- Install jest globals and then import them into each testing file. -->
npm i -D @jest/globals


<!-- 2. Install the @types/jest package and include this in your tsconfig.json for types. Now you don't have to import those globals every time -->
npm i -D @types/jest
```



# Rate Limiting:
- For personal projects, express-rate-limiter gets the job done and can is a good 
  fit for your application. However, for larger scale applications it's common practice
  to have an nginx server running in front of your node server. This nginx server 
  acts as a 'reverse proxy'






## Business Rules:

### Authentication
- JWT authentication, with access and refresh tokens. Refresh tokens should be handled securely, using an https secure cookie. As well as this, we won't allow a way to refresh a refresh token. As a result after the refresh token expires, the user needs to enter their credentials again.
- If the user logged in, they should be able to refresh their page, and still be logged in. If the user closes the site, and launches it again, if they still have a valid refresh token cookie, they should be logged in again. 

### Account/Email Verification
1. Your User model should have an 'active' or 'isVerified' boolean attribute that's false by default. This attribute indicates whether or not a user's email has been verified.
2. You should have a 'Token' model that contains the userId, unique string, createdAt and expiration. So when the user registers a user successfully, create a new user and ensure 
isVerified is false, because they haven't verified their emails yet.
3. You should create a long random string with osme kind of cryptography library, create your token instance, and put it in the database.
4. Send an email to the supplied email address with a link that would somehow point back to your server, at an endpoint for verifying emails.
5. If the string (unique value) exists in the database, attempt to get the related user ,adn set their isVerified property t0 true. Then delete the used token from the database to ensure it can't be used again, a one time use token.

You could also use JWT tokens, for a stateless approach, but it's recommended you have a way to invalidate the tokens after they're used to activate the account. Even if the user hasn't verified their email yet, we should stil allow them to log in. Though the common thing is to restrict some higher level functionalities such as creating and editing content such as comments, posts, etc. The importance of a verified email definitely depends on the website. Sometimes it's for just company newsletter or subscription purposes, which may not be as important. 

However, most importantly, telling the user to verify the email, for their sake, helps avoid the 'forgot password' scenario. If you forgot your password, and you entered an email you don't have access to, you don't have access to that account anymore. However, if you remind the user that 'hey, verify your email so that you're protected in case you forget your password', then that would be good for their sake. Things such as preventing the user from changing their password until they verify their email is a good choice, in case they forget their new password.

For the routes, an important one would be a GET '/resend-verify-email' that accepts 'email' in the request body, so that you can send an email to a particular user with that account. So ideally a user should be able to ask to verify their email, regardless of whether or not they're logged in which is a common practice. So we won't put this behind a jwt wall. For a route like '/send-verify-email/:id', you'd have to watch out for users abusing this and sending spam emails to other users, and the solution for that would be checking who sent the request. However this also requires jwt, that doesn't work. As a result our best, or optimal solution would be the initial one as it allows for logged in users to simply click a button to resend the link, and unauthenticated users to enter in an email associated with their account. Of course unauthenticated users can potentially spam another person, but that requires knowing the email of another person on the site, which is a tall order, and also many websites already know this is a possibility and put things such as 'Hey if you didn't initiate this change, ignore this email'.

 So maybe for a logged in user, they'll see on their account page a 'resend email' button that will probably handle inserting the currently authenticated user's email into the request. For a non-logged in user, the site doesn't know their email, so instead, they'll probably just need to enter their email in a form, and submit it for sending.

Let's talk about handling updating a user's email. Let's talk about a common process and best practices that many websites use:
1. User input: Allow the user to enter the new email, optionally let them confirm it. Remember that a user has to be logged in to make this request.

2. Check for differences, ensure the new email is different from the current one. If it's the same you can send back an error saying so. Here you'd do a check to see if the email is available in the database as we wouldn't want to send an email and give the user a bunch of work if the email is already taken.

3. Now before updating the user's email address in the database, we'll send a verification link to that email. This is to ensure the user has access to the new email address. The token in this case would need to contain data, so store the id of the user and the new email they want to switch to. Since we're creating a new email verification token here, any previous email verification tokens (created for verifying the current email, or verifying an email update) will be eliminated. This prevents the situation described below:


#### Unexpected email changes
Scenario Description
- Current Email: <current-email>
- New Email Change Request: <new-email>
- Verification Tokens:
- Token1 to verify <new-email>
- Token2 (old token) to verify <current-email> or another email
Potential Issue: If a user has both tokens and uses them out of order, it could lead to confusion

1. User requests to change <current-email> to <new-email> and receives Token1.
2. User then uses Token1, changing their email to <new-email>.
3. If the user still has Token2 (which was issued for <current-email> or another email), using Token2 could revert their email to <current-email> or cause other issues.

Solution: Clear Existing Tokens. To avoid such confusion and potential security issues, it's a good practice to clear all existing email verification tokens whenever a new email change request is initiated. This ensures that only the most recent token is valid, and any old tokens are invalidated.




4. If the user successfully verifies the new email by clicking the link, we'd attempt find the user via their ID. Then update the email address in the database using the email in the token, which is again the email we sent the link to and so the email they want to switch to. Of course in this final step, you want to ensure that the email isn't a duplicate, I mean during the time it took the user verify their email, it could have already be taken by someone else! Finally you'd update the isVerified to true, if it isn't already. 

- NOTE: Notice that with this implementation, isVerified would never reset to false, it is only false when account is first created. This is because when the user wants to update their email, we don't immediately switch to the new email, we stick with our current one (which could be verified or not), and only switch to the new one when its been verified. Also this implementation would need a jwt token as we need it to carry data. 

In our application, we will create email verification tokens in two situations:
1. Verify the initial email: When the user signs up, they sign up with an initial email address that they may verify. The user can send ask for new links in order to verify their current email address. 
2. Updating an email: When the user wants to update an email, we ask them to verify that updated email first, before we actually make any changes to their account. As a result, they are stuck with their current email. 

This creates a situation where, initially, when you create an account, it's going to be marked as unverified. But once you verify your email once, your account will always be verified. Because if let's say you have a verified email, and you want to update it, you need to verify that new email before any changes are applied. If you don't, then you're stuck with your old email, which is still a verified email.



### Posts
- Posts should be visible to users that aren't even logged in. Allowing for unauthenticated users to read posts on the website. Users should only be able to see the posts where isPublished is true. This should stay true for people with role "user" and "editor", meaning others can only see published posts. Administrators should be able to get all posts regardless of whether they are published or not, however this should be done in a different area, such as a dashboard rather than the BlogPage.
- When creating a brand new post, the post's data should be saved even if the user refreshes their page. 

### Roles
- There are three roles: admin, editor, and user. 
- User: Isn't allowed to create or modify posts.
- Editor: Allowed to create posts and modify any existing posts that they've created. 
- Admin: Allowed to create posts and modify their own posts. They should be able to delete anyone's post. However, admins are limited when it comes to editing another user's post, as they're only allowed to edit the status of another user's post.




# Setting up Redis
1. [Install Redis on your local machine](https://replit.com/@knguyensky/redis-tutorial#README.md)
2. Install npm packages
```
<!-- Install redis package: So this is also known as a 'client' library. It just gives us the redis  -->
npm i redis; no need to instal @types/redis, since redis provides its own type definitions

<!-- Install popular Redis client for Node.js -->
npm i ioredis 
npm i -D @types/ioredis
```
Both redis and ioredis are 'client' libraries for using redis in node. They expose functions and classes that allow us to do caching and important things with redis. The former is the basic package, it's easy to use, and is good for most use cass. However it may lack support for advanced features. The latter 
is a more feature-rich and robust Redis client. Does everything the original does, but has support for more advanced cases. Here are some of the extra things it has
1. Cluster Support: Has built in support for Redis Cluster, whic his the idea where data in your redis caches are separating horizontally. Some rows belonging in one cache whilst others belong in another cache, in hopes for better horizontal scaling.
2. Sentinel Support: Supports 'Redis Sentinal'
3. Better Performance: Optimized for high performance and can handle a larger number of concurrent connections.
4. Advanced Features: Such as Lua scripting, transaction support, and more.

Now let's start redis our redis server via ubuntu
```
sudo service redis-server start
redis-cli.
```






# Commit
+ Front end: 
- Improved theming and our color system
- Created 'App settings' section in profile page, where user could toggle theme and animations on and off.
- Removed card skeletons from ManagePostsPage. Also, when a post is unpublished, the user now won't be able to click to view it and it doesn't have any visual indicators of it being clickable anymore.
- Edit post status form will have its status value match the selected post's status value, instead of just defaulting to 'draft' everytime.
- Improved and simplified the picking and rendering of roles in the employee grid. 
- Fixed issue in EditorProvider, as when we tried to update a post, we made a request to create one. Updated the EditPostAccordion, so now we're able to have category as a category object, and the logic is still simple.
- Added our public images to version history.

+ Back end: 
- Changed update post from a patch to a put request, becasue that endpoint is essentially updating the entire resource.


## BOOK MARK:
- Work on restricting password change until email is verified.
- Work on resendVerifyLink route;

- Work on logic and flow for updating an email.  eed to reset isVerified when user updates their email.


blue-dream-sea-city







11. Images themselves for our posts. May be deleted due to the internet. So instead. Maybe for images, we could have two options, upload an image or just enter a url. If image does not exist for some reason, we will have a default image. Let's handle this on the front end, since on the backend it's a little more involved to check if an image works (making a request), let's just keep that on the front.

12. Api Pagination? Of course we don't want to fetch everything from the database. And then update the front-end accordingly?

13. Have a redis cache? Well in order for this to happen, it needs to work, even if the redis cache doesn't exist. So in case we don't use the website for awhile and the redis cache has been disabled, then our website still needs to work as normal.

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


# Credits:
## Resources
1. https://stackoverflow.com/questions/57650692/where-to-store-the-refresh-token-on-the-client
2. https://medium.com/@sadnub/simple-and-secure-api-authentication-for-spas-e46bcea592ad
3. How to create youtube layout (tailwind typescript): https://youtu.be/ymGB1lqP1CM?si=BZv6QUEFMrVKE5Qf
4. TinyMCE V6 Docs: https://www.tiny.cloud/docs/tinymce/6/
5. React forms and jwt: https://www.youtube.com/watch?v=brcHK3P6ChQ&list=PL0Zuz27SZ-6PRCpm9clX0WiBEMB70FWwd
6. https://deadsimplechat.com/blog/how-to-safely-use-dangerouslysetinnerhtml-in-react/
7. https://wix.com/blog/beautiful-contact-pages
8. https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually
9. [Jest With TypeScript](https://jestjs.io/docs/getting-started#using-babel)

## Inspiration
1. Site: https://dezien-blog.vercel.app/
- This is a good site to take design inspiration off of, but it's quite complex.
2. Site 2: https://blog-client-dovimaj.vercel.app/
- Here's an easy site to copy off of.
3. https://www.mohammadfaisal.dev/blog; this one would be difficult, but I think I like their simplified blog page a lot better than my youtube-esque one. I guess it's 
probably better if I personalize my website a bit.

4. Code Design AI Site: https://dev.codedesign.ai/app/builder?project=blogsphere-website-contentc32bt7aqdw#home
5. SitesGpt AI Site: https://dev.codedesign.ai/app/builder?project=blogsphere-website-contentc32bt7aqdw#home
