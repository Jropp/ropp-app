// @ts-nocheck
const currentEnv = "prod";
export const env = {
  dev: {
    API_URL: "http://localhost:9990",
  },
  prod: {
    API_URL: "https://app.jasonropp.com/api",
  },
}[currentEnv];
