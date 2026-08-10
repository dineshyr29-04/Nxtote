import api from './axios';

export const getNotes = async () => {
  const response = await api.get("/");
  return response.data;
}

export const createNote = async (note) => {
  const response = await api.post("/notes",note); // note contains text,category,completed,priority
  return response.data;
}