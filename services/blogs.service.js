import { appFetch } from "./app-fetch.js";

export async function createBlog(blogData) {
  console.log(blogData);
  return appFetch("/v1/blogs/create", {
    method: "POST",
    body: blogData,
  }).then((r) => r.json());
}

export async function getPost(id) {
  return appFetch(`/v1/blogs?id=${id}`, { method: "GET" }).then((r) => r.json());
}

// Adding the function from blogs.service.js
export async function getAllBlogs() {
  return appFetch("/v1/blogs", { method: "GET" }).then((r) => r.json());
}
