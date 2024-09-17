import { createSlice } from '@reduxjs/toolkit';

const tokenFromStorage = localStorage.getItem("token") || "";
const userFromStorage = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : "";

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: tokenFromStorage, 
    user: userFromStorage,   
  },
  reducers: {
    userRegistration: (state, action) => {
      state.token = action.payload.token;
      console.log(state.token);
      
      localStorage.setItem("token", action.payload.token);
    },
    userLoggedIn: (state, action) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      
      localStorage.setItem("token", action.payload.accessToken);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    userLoggedOut: (state) => {
      state.token = "";
      state.user = "";

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
});

export const { userRegistration, userLoggedIn, userLoggedOut } = userSlice.actions;
export default userSlice.reducer;
