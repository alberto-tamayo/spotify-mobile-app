import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: '',
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

export const { setAccessToken } = searchSlice.actions;
export default searchSlice.reducer;
