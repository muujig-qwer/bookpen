import axios from "axios";
import { BookType } from "../types/book";

const API = "http://localhost:3000/books";

export const getBooks = (page: number, limit: number) =>
  axios.get(API, { params: { page, limit } });

export const createBook = (book: BookType) => axios.post("/api/books", book);

export const updateBook = (id: string, book: BookType) =>
  axios.put(`/api/books/${id}`, book);

export const deleteBook = (id: string) => axios.delete(`${API}/${id}`);
