const allowedOrigins: string[] = [

  // Defined when the server starts and environment variables are available
  process.env.CLIENT_URL as string,
]

export default allowedOrigins;
