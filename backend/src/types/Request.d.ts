/*
- Situation: In our application we apply the '.user' property on our request object after 
  we verify the user's JWT. Express doesn't havea .user property, so to handle this in TypeScript 
  we can do 'TypeScript declaration merging', which just allows us to extend Express's Request
  interface to include a user property.

- How to do:
1. If not already create a 'types' directory in your root project dir. A place where you can store your 
  custom type definitions and interfaces.
2. Create a file such as 'Request.d.ts'. A '.d.ts' file is just the file naming convention
  for files you use to extend or modify types. They are just for typechecking.
3. Create your custom type, and here we're adding an optional attribute 'user'. Express should
  understand this since we have express types installed.
4. In our tsconfig.json, include our 'types' directory in the typeRoots or your types array. As a result
  TypeScript will use the types from this directory when resolving types.
*/
// Interface for the payload of the jwt
export interface RequestUser {
  id: string,
  role: number
}

export interface EmailTokenPayload {
  email: string; // the email being verified
}


/*
+ What is declare module:
Used to augment/extend existing modules. So wehn you do this, you're telling TypeScript that 
you are adding new declarations to an existing module, in this case Express.

Useful wehn you want to add properties to existing types or interfaces that are a part 
of a module that you don't control, such as Express.


+ declare namespace:
Used for merging declarations into existing objects, which can sometimes work, but 
is less straight forward.

+ Extending the Request object to include a 'user':

1. declare module 'express-serve-static-core': This is the module that contains the 
  Request interface, and we want to extend/modify the interfaces here.
2. We'll add an optional property 'user' to the Request interface. So it may 
  or maynot be present on the request object.

  So before a request goes into the verifyJWT middleware, the user property won't
  be there, but after a successful JWT verification, it will be present.

*/
declare module "express-serve-static-core" {
  interface Request {
    user?: RequestUser;
  }
}
