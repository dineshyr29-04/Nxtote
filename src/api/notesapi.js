import api from './axios';

export const getNotes = async () => {
  const response = await api.get("/notes");
  return response.data;
}
