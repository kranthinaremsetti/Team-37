import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const instance = axios.create({
  baseURL: "https://api.github.com",
  timeout: 10000,
  headers: {
    Accept: "application/vnd.github.v3+json"
  }
});

if (process.env.GITHUB_TOKEN) {
  instance.defaults.headers.common["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
}

export default instance;
