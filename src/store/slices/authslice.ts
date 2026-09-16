import { User } from "@/types/auth.types";
import { createSlice } from "@reduxjs/toolkit";

const initialState2: User = {
  id: "",
  is_superuser: false,
  username: "",
  is_staff: false,
  is_active: false,
  last_name: "",
  email: "",
  groups: [],

  otp: "",
  phone_number: "",
  level: "",
  user_permissions: [],
  last_login: null,
  date_joined: "2024-12-06T12:00:00Z" as unknown as Date,
  first_name: "",
  is_editor: false,
  roles: [],
  two_factor_enabled: false,
  captcha_enabled: false,
};

interface State {
  user: User;
  isLoggedIn: boolean;
}

const initialState: State = {
  user: initialState2,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state = { ...action.payload, isLoggedIn: true };
      return state;
    },
    logout: (state) => {
      state = { ...initialState, isLoggedIn: false };
      return state;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
