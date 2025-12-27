export const BASE_URL = "https://to-do-react-native-mobile-application.onrender.com/api";

export const endpoints = {
  tasksByUser: (username) => `${BASE_URL}/tasks/${username}`,
  addTask: `${BASE_URL}/tasks`,
  completeTask: (username, id) =>
    `${BASE_URL}/tasks/${username}/${id}/complete`,
  deleteTask: (username, id) =>
    `${BASE_URL}/tasks/${username}/${id}`,
};
