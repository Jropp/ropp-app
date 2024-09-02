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

export async function getAllBlogs() {
  return appFetch("/v1/blogs", { method: "GET" }).then((r) => r.json());
}

// New function to update a blog post
export async function updateBlog(blogData) {
  return appFetch("/v1/blogs/update", {
    method: "PUT",
    body: blogData, // Stringify the entire blogData object
    headers: {
      "Content-Type": "application/json",
    },
  }).then((r) => r.json());
}

// New function to delete a blog post
export async function deleteBlog(id) {
  return appFetch(`/v1/blogs/delete?id=${id}`, {
    method: "DELETE",
  }).then((r) => r.json());
}
