// export const setToken = (token) =>{
//     localStorage.setItem('token', token);
// }

// export const getToken = () =>{
//     return localStorage.getItem('token');
// }

// export const removeToken = () =>{
//     localStorage.removeItem('token')
// }


// src/lib/utils.js
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
