import api from './axios';

export const getNotes = async () => {
  const response = await api.get("/notes");
  return response.data;
}

export const createNote = async (note) => {
  const response = await api.post("/notes",note); // note contains text,category,completed,priority
  return response.data;
}

export const updateNote = async (id, updates) => {
    const response = await api.patch(`/notes/${id}`,updates);
    return response.data;
}

export const deleteNote = async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
}