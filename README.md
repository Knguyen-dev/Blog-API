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

### Posts
- Posts should be visible to users that aren't even logged in. Allowing for unauthenticated users to read posts on the website. Users should only be able to see the posts where isPublished is true. This should stay true for people with role "user" and "editor", meaning others can only see published posts. Administrators should be able to get all posts regardless of whether they are published or not, however this should be done in a different area, such as a dashboard rather than the BlogPage.
- When creating a brand new post, the post's data should be saved even if the user refreshes their page. 

### Roles
- There are three roles: admin, editor, and user. 
- User: Isn't allowed to create or modify posts.
- Editor: Allowed to create posts and modify any existing posts that they've created. 
- Admin: Allowed to create posts and modify their own posts. They should be able to delete anyone's post. However, admins are limited when it comes to editing another user's post, as they're only allowed to edit the status of another user's post.

### Setting up TypeScript for frontend
So we created a react project using vite's react template. Now we want to be able to use typescript. Here are the steps you need to take to convert your vite react-javascript project to a typescript one.

#### Step 1/6: Install base packages
```
npm install -D typescript @types/react @types/react-dom ts-node
```
#### Step 2/6: Modify package.json
In `package.json`, replace:
```
"build": "vite build"
```
with this:
```
"build": "tsc && vite build"
```
#### Step 3/6: 
Rename `vite.config.js` and `main.jsx` to `vite.config.ts` and `main.tsx`

#### Step 4/6:
Configure TypeScript by creating these two files in the root of your project.
`tsconfig.json`
```
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```
`tsconfig.node.json`
```
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```
#### Step 5/6
Create a file named `vite-env.d.ts` inside the `src` folder and give it these contents (include 3 slashes in the beginning):
```
/// <reference types="vite/client" />
```

#### Step 6/6
In your index.html, change the name of your script from `main.jsx` to `main.tsx` like this:
```
<script type="module" src="/src/main.tsx"></script>
```
That should be it. Obviously this is just for the base conversion, of course if you have other packages and files, you'll have to accomodate for that.


```
npm create vite@latest
```






### Setting up TypeScript for the backend:
Install packages. We install typescript, a thing for running typescript, and then types for express
```
npm i -D typescript ts-node @types/express 
```
Then create a tsconfig.json file
```
npx tsc --init
```
I'll explain some of the configurations and rules:
1. target: The target JavaScript version that hte compiler will output.
2. module: The module manager being used. Usually stick to CommonJS
3. strict: Toggles strict type checking rules.
4. esModuleInterop: Enables compilation of ES6 modules to CommonJS modules, so this let's you use ES6 syntax.
5. skipLibCheck: Skips TypeScript for libraries nad third party packages I believe.
6. outDir: Determines the destination directory for your compiled output. You'll need to uncomment this rule and change it to ./dist'.

Now we need to update our script commands. So we expect our script commands to be running TypeScript files:
```
{
  "scripts": {
    "build": "npx tsc",
    "start": "node dist/index.js",
    "dev": "nodemon index.ts"
  }
}
```

You would do `npm run build` to convert/compile your TypeScript code into valid JavaScript, and this valid JavaScript is what's used in production. Remember for improvement use strict type checking, setting up configurations to your needs, improve performance with code splitting if needed, shrink file sizes with tools like server, and streamline the workflow from development to production with CI/CD pipelines!




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

## BOOK MARK:
It seems password reset logic is working good. We've just added the validation, so make sure the passwords follow the validation.

It seems when the client fetches images we got stuff like 'Request not allowed by CORS'. Look for a potential fix? Or maybe get
images online? 

1. Email verification, and handle email changing, if we want to allow that.

  [Email verifictaion flow forum](https://security.stackexchange.com/questions/234060/what-is-the-suggested-best-practice-for-changing-a-users-email-address)

2. Finally switch over stuff to SendGrid since we want to be a professional app.


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
