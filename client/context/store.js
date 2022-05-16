import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducer'

export default configureStore({
  reducer: {
    user: userReducer,
  },
})
