# Blog-API
## Introduction
This is a full-stack blog application that has been created under the assumption that a company or selected team of people/users would manaage and make posts on it. Unauthenticated users are able to search for and view published posts. Then authenticated users, that have roles of an editor or admin, can create posts. These posts can have varying categories, and various tags displayed on them. Think of a site such as IGN, The Atlantic, or The Guardian, where it's a team of employees from a company are making posts for everyone to see.

## Technologies
#### Frontend
- ReactJS
- Material UI
- TailWindCSS
#### Backend
- NodeJS
- ExpressJS 
- Redis 
- MongoDB
- SendGrid
#### MISC
- TypeScript
- Vite
- Npm

## Features
- Viewing blog posts, and filtering blog posts based on their categories, tags, and titles (For all users).
- CRUD operations for blog posts, categories, and tags (Editors and Admins only).
- Editors and Admins are considered employees. Ability to add existing accounts as editors or admins (marking them as employees). Employees are organized in a data-table, allowing for creating, updating (only some properties can be updated), and deleting employees (Admins only).
- User authentication and api authorization with JWT. When users log in they're given an access token (stored in-memory in a state), and a refresh token in an secure http cookie. Access tokens are used for making requests, and when access token expire, the refresh token gets the client a new access token. On page, refresh, if user has a refresh token, then they are re-authenticated without having to enter credentials again.
- Email verfication: Users have the option to verify their emails, and the app sends an email verification link to them. Once an account's email is verified, then a user is able to update their password. When updating an account's email, the email must be verified first, before the new email is set on the account. 
- Password Reset: Users can enter the email associated with their account. This would send a password reset email to said email, only when an account exists with that email.
- Username recovery: Users can enter the email associated with their account. If that email is associated with a user, we would send an email to their email which would reveal to them their username.
- User profile: 
  1. username: Username of a user.
  2. email: Email of a user.
  3. fullName: Name of the user.
  4. avatar: Users can upload an image file from their computer to have an avatar/pfp associated with their account.
  5. password: Password hash of a user.
  6. role: Role of a user. Could be 'user', 'editor', or 'admin'.
  7. isVerified: Whether or not a user's email is verified.
- Responsive Design: Each page of the front-end supports mobile to desktop screens.

## Project Structure
### Backend
- **controllers/**: Top level  logic for handling incoming requests and sending responses. So most of the time, here you'd call a function (a 'service' function) to do the database related operations. Then you'll put the logic here for handling request and response related stuff.
- **models/**: Defines the data models and schemas for the application.
- **routes/**: Handles the routing of requests to the appropriate controllers.
- **middleware/**: Contains middleware functions for tasks like authentication, input validation, permissions middleware, role verification, password, tokens, and other utilities.
- **services/**: Mostly database related functions that abstract the database and backend logic. For example, the getPostByID(id) service function, and you'd plug it into your getPost controller function so the service function handled the database operations. Then the controller itself would send the response. Then you have the 'caches' and 'email' directories, which are more so for 'caching' services or 'email' sending services.
- **.env**: Environment variables for backend configuration.
- **templates/**: Html template files that we'll send in email for stuff such as password reset, email verification, etc.
- **tests/**: Contains all tests created for the backend application.
- **app.ts**: Create the app, routes, and error handling middleware
- **server.ts**: The main entry point for the backend server. Here you start the MongoDB, Express, and Redis servers.
### Frontend
- **public/**: Static files such as images, fonts, and the favicon.
- **src/**: The main source code for the frontend application.
  - **api/**: Contains base code for managing some apis. For example, we export axios instances for handling making API requests to our backend express server. Another is 'intl', which just export functions for managing and formatting dates using the INTL API.
  - **components/**: Reusable React components that we use across the applicaton
  - **hooks/**: Custom React hooks that we use across the application
  - **pages/**: Directories that contain the components, hooks, constants (data) that are used in the page. However there can be some exceptions. For example '/dashboard/profile' has mostly hooks for updating/changing the attributes of a user. However some schemas in the userSchema, such as a signupSchema are used in the SignupForm in the Auth directory. Or how the 'useVerifyEmail.ts' hook is there, but used only on the VerifyEmailPage.tsx. In those cases, we tried to keep things in logical sense since useRequestEmailVerification was there as well.
  - **utils/**: Utility functions and helpers for the frontend.
  - **index.tsx**: The entry point for the React application.
- **.env**: Environment variables for frontend configuration.
- **index.html**: The main HTML file for the frontend application.
- **vite.config.ts**: Configuration file for Vite, the build tool used for the frontend.


## Getting started

#### Preqequisites
- Node.js installed on your machine. You can download it from nodejs.org.
- npm package manager, which comes bundled with Node.js.
#### Installation
1. Clone the github repository into your local machine
```
https://github.com/Knguyen-dev/Blog-API.git
```
2. Then navigate into the project directory, you could keep the name 'Blog-API' or change it if you wish. Install dependencies in the root project, `frontend`, and `backend` directories.

#### Setting up Environment variables 
1. Create a `.env` file in the `frontend` directory and add the following environment variables should look like this:
```
<!-- These are the default numerical role values. I don't recommend changing these until you've understood the user registration controller, the model, and then the employeeService functions. Then once you understnad those, you'll only need to understand the 'Team' page on the frontend alongside the role utilities. -->
VITE_ROLE_ADMIN=5150
VITE_ROLE_EDITOR=1984
VITE_ROLE_USER=2001

<!-- Api key you get from TinyMCE -->
VITE_TINYMCE_API_KEY = <your_tinymce_api_key>
```
2. Add a `.env` file to the `backend` directory.
```
<!-- Port the express server is going to run on, but you may change it -->
PORT=3000

<!-- A MongoDB URI that you can from MongoDB Atlas -->
MONGO_URI=<your-mongodb-uri>

<!-- Just generate these with the built-in Crypto library -->
ACCESS_TOKEN_SECRET=<your-access-token-secret>
REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
EMAIL_TOKEN_SECRET=<your-email-token-secret>

<!-- Default client and server urls, but you may change these if you want -->
CLIENT_URL = "http://localhost:5173"
SERVER_URL = "http://localhost:3000"

# Api key for send-grid
SEND_GRID_API_KEY = <your-sendgrid-api-key>
```

#### Starting servers
In the root directory start the development server with:
```
npm run appDev
```



## Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## Future considerations and improvements
- Add a reason for common users (users with role 'user') to sign up and login. Right now you can log in, which allows you to create your own profile. However, since they aren't an editor or admin, they can't create posts, categories, tags, etc. Maybe for people of role 'user', allow them to make comments. This or you create another client site just for editors and admins!
- Tailoring it to be more of a personal website or portfolio?
- Online image hosting with Amazon S3?

## License
Distributed under the MIT License

## Acknowledgements
#### Jwt and authentication:
- [Intro to JWT and Authentication - Net Ninja](https://youtu.be/muhJTRQ7WMk?si=bbS7IGveaimpGpNt)
- [Managing role permissions and authorization - Web Dev Simplified](https://youtu.be/jI4K7L-LI58?si=X2Xiqmj4zAZ3z5Tn)
- [What is JWT and why should you use it](https://youtu.be/7Q17ubqLfaM?si=ljXE4YCmTf3SfFML)
- [Simple and Secure authentication for SPAs](https://medium.com/@sadnub/simple-and-secure-api-authentication-for-spas-e46bcea592ad)
- [Intermediate jwt authentication and role-based authorization - Dave Gray](https://www.youtube.com/watch?v=brcHK3P6ChQ&list=PL0Zuz27SZ-6PRCpm9clX0WiBEMB70FWwd)

#### Email-related functionality:
- [Implementing email verification](https://youtu.be/T6rElSLldyc?si=QxCcr5wOVI1fp1wV)
- [Implementing password reset (spans over 3 videos)](https://youtu.be/4ML_j17jsVg?si=jn9XXPn_5jiW-cKV)

#### Implementing an WYSIWYG Editor:
- [Cross site scripting explained](https://youtu.be/EoaDgUgS6QA?si=pWsgoUszv1Dd4RcB)
- [Integrating TinyMCE with React - TinyMCE Docs](https://www.tiny.cloud/docs/tinymce/latest/react-ref/)
- [How to safely use dangerously set inner html](https://deadsimplechat.com/blog/how-to-safely-use-dangerouslysetinnerhtml-in-react/)

#### Client and server-side input validation and uploads
- [React Hook Form Tutorial](https://youtu.be/wlltgs5jmZw?si=0IJ2aCA6YyGudIqq)
- [File uploads with Node, Express, and Multer](https://youtu.be/i8yxx6V9UdM?si=RlvFww6LOcItUn0r)

#### MISC
- [Caching with Redis](https://youtu.be/jgpVdJB2sKQ?si=IIzot2SFTOLbS91d)
- [Jest with TypeScript; here we did ts-jest and jest globals](https://jestjs.io/docs/getting-started#using-babel)
- [Mohammad Faisal's Blog, our design inspiration](https://www.mdfaisal.com/projects)
- ['Denizen' an additional design inspiration](https://dezien-blog.vercel.app/)

