import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface LoadingPayload {
  isLoading: boolean;
  text?: string;
}

export interface LoadingState {
  isLoading: boolean;
  text?: string;
}

const initialState: LoadingState = {
  isLoading: false,
  text: undefined,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (
      state,
      action: PayloadAction<boolean | LoadingPayload>
    ) => {
      if (typeof action.payload === "boolean") {
        state.isLoading = action.payload;
        if (!action.payload) {
          state.text = undefined;
        }
      } else {
        state.isLoading = action.payload.isLoading;
        state.text = action.payload.text;
      }
    },
    setLoadingText: (state, action: PayloadAction<string | undefined>) => {
      state.text = action.payload;
    },
    startLoading: (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = true;
      state.text = action.payload;
    },
    stopLoading: (state) => {
      state.isLoading = false;
      state.text = undefined;
    },
  },
});

export const { setLoading, setLoadingText, startLoading, stopLoading } =
  loadingSlice.actions;

export const selectIsLoading = (state: RootState) => state.loading.isLoading;
export const selectLoadingText = (state: RootState) => state.loading.text;

export default loadingSlice.reducer;
