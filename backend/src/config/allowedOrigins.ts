/**
 * Defines the origins that are allowed to make requests to this express server
 */
const allowedOrigins: string[] = [
  process.env.CLIENT_URL as string,
]

export default allowedOrigins;
