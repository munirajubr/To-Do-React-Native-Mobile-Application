export const BASE_URL = "https://to-do-react-native-mobile-application.onrender.com/api";

export const endpoints = {
  register: `${BASE_URL}/auth/register`,
  login: `${BASE_URL}/auth/login`,
  tasksByUser: (username) => `${BASE_URL}/tasks/${username}`,
  addTask: `${BASE_URL}/tasks`,
  completeTask: (username, id) =>
    `${BASE_URL}/tasks/${username}/${id}/complete`,
  deleteTask: (username, id) =>
    `${BASE_URL}/tasks/${username}/${id}`,
};