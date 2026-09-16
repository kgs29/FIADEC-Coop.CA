import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppConfigInterface } from "@/types/configuration.types";

interface ConfigState {
  config: AppConfigInterface | null;
}

const initialState: ConfigState = { config: null };

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setConfig(state, action: PayloadAction<AppConfigInterface>) {
      state.config = action.payload;
    },
  },
});

export const { setConfig } = configSlice.actions;
export default configSlice;
