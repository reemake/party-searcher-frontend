export interface Jwt {
  id: {
    jwt: string,
    username?: string
  },
  refreshToken: string
}
