import axios from "axios";

// Kreiramo axios instance
const api = axios.create({
  baseURL: "/api", // ide kroz vite.config.js proxy na backend http://localhost:5000
  headers: {
    "Content-Type": "application/json",
  },
});

// ========== AUTH ==========
export const login = (credentials) => api.post("/auth/login", credentials);
export const register = (data) => api.post("/auth/register", data);
export const getProfile = (token) =>
  api.get("/auth/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

// ========== AUTHORS ==========
export const getAuthors = () => api.get("/authors");
export const getAuthorById = (id) => api.get(`/authors/${id}`);
export const addAuthor = (author, token) =>
  api.post("/authors", author, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const updateAuthor = (id, author, token) =>
  api.put(`/authors/${id}`, author, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const deleteAuthor = (id, token) =>
  api.delete(`/authors/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// ========== BOOKS ==========
export const getBooks = () => api.get("/books");
export const getBookById = (id) => api.get(`/books/${id}`);
export const addBook = (book, token) =>
  api.post("/books", book, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const updateBook = (id, book, token) =>
  api.put(`/books/${id}`, book, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const deleteBook = (id, token) =>
  api.delete(`/books/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
