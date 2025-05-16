import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import transactionService from './transactionService'

const initialState = {
  transaction: null,
  transactions: [],
  send: [],
  received: [],
  moneyAdded: '',
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Helper to extract error message
const getErrorMessage = (error) =>
  (error.response?.data?.message) || error.message || error.toString()

// Helper for thunks with token
const withToken = (asyncFunc) =>
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await asyncFunc(data, token)
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error))
    }
  }

// Async thunks
export const sendMoney = createAsyncThunk(
  'transaction/send',
  withToken(transactionService.sendMoney)
)

export const addBalance = createAsyncThunk(
  'transaction/addMoney',
  withToken(transactionService.addMoney)
)

export const getTransactions = createAsyncThunk(
  'transaction/getTransactions',
  withToken(transactionService.getTransactions)
)

export const getSendTransactions = createAsyncThunk(
  'transaction/moneySend',
  withToken((_, token) => transactionService.getMoneySend(token))
)

export const getReceivedTransactions = createAsyncThunk(
  'transaction/moneyReceived',
  withToken((_, token) => transactionService.getMoneyReceive(token))
)

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.isLoading = true
      state.isError = false
      state.message = ''
    }

    const handleRejected = (state, action) => {
      state.isLoading = false
      state.isError = true
      state.message = action.payload
    }

    builder
      // Send money
      .addCase(sendMoney.pending, handlePending)
      .addCase(sendMoney.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.transaction = action.payload
      })
      .addCase(sendMoney.rejected, handleRejected)

      // Add money
      .addCase(addBalance.pending, handlePending)
      .addCase(addBalance.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.moneyAdded = action.payload
      })
      .addCase(addBalance.rejected, handleRejected)

      // Get transactions
      .addCase(getTransactions.pending, handlePending)
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.transactions = action.payload
      })
      .addCase(getTransactions.rejected, handleRejected)

      // Get send transactions
      .addCase(getSendTransactions.pending, handlePending)
      .addCase(getSendTransactions.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.send = action.payload
      })
      .addCase(getSendTransactions.rejected, handleRejected)

      // Get received transactions
      .addCase(getReceivedTransactions.pending, handlePending)
      .addCase(getReceivedTransactions.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.received = action.payload
      })
      .addCase(getReceivedTransactions.rejected, handleRejected)
  },
})

export const { reset } = transactionSlice.actions
export default transactionSlice.reducer
