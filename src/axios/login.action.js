import { authInstance } from "./axios.config"

export const getAuthDetails = (data) => {
  const { email, password } = data;
  return authInstance({
    method: "POST",
    url: "/login",
    data: {
      email: email,
      password: password
    }
  })
}