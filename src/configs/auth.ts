export const AuthConfig = {
  tokenLifetime: process.env.JWT_LIFETIME
    ? parseInt(process.env.JWT_LIFETIME)
    : 900,
  tokenSecret: process.env.JWT_SECRET as string | undefined,
  saltRounds: 10,
};
