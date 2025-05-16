import './SendModal.scss'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { sendRequest, reset } from '../../features/request/requestSlice'
import Loader from '../Loader/Loader'

const RequestModal = ({ setRequestModalOpen, requestTo }) => {
  const dispatch = useDispatch()

  const { _id } = useSelector((state) => state.auth.user)
  const { isSuccess, isLoading, isError, message } = useSelector(
    (state) => state.request
  )

  const requestModalClose = () => {
    setRequestModalOpen(false)
  }

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }
    if (isSuccess) {
      toast.success('REQUEST SENT SUCCESSFULLY')
      setRequestModalOpen(false)
    }
    dispatch(reset())
  }, [isError, message, isSuccess])

  const [formData, setFormData] = useState({
    receiver: requestTo,
    amount: '',
    description: '',
  })

  const { receiver, amount, description } = formData

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const transactionData = {
      receiver,
      amount,
      description,
    }
    dispatch(sendRequest(transactionData))
  }

  return (
    <div className='sendmodal'>
      <div className='sendModalContainer'>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className='sendModalHeader'>
              <h1>REQUEST FUND</h1>
              <div className='closeIconContainer' onClick={requestModalClose}>
                <CloseRoundedIcon className='closeIcon' />
              </div>
            </div>
            <div className='sendModalContent'>
              <section className='sendForm'>
                <form onSubmit={onSubmit}>
                  <div className='formControl'>
                    <label htmlFor='senderId'>SENDER ACCOUNT NUMBER</label>
                    <input
                      type='text'
                      name='senderId'
                      id='senderId'
                      value={_id}
                      onChange={onChange}
                      placeholder='XXXXXXXXXXXXXXXXXXXXX'
                      required
                    />
                  </div>
                  <div className='formControl'>
                    <label htmlFor='receiverId'>RECEIVER ACCOUNT NUMBER</label>
                    <input
                      type='text'
                      name='receiverId'
                      id='receiverId'
                      value={requestTo}
                      onChange={onChange}
                      placeholder='XXXXXXXXXXXXXXXXXXXXX'
                      required
                    />
                  </div>
                  <div className='formControl'>
                    <label htmlFor='amount'>AMOUNT</label>
                    <input
                      type='number'
                      name='amount'
                      id='amount'
                      min='1'
                      max='100000'
                      value={amount}
                      onChange={onChange}
                      placeholder='$XXXX.XX'
                      required
                    />
                  </div>
                  <div className='formControl'>
                    <label htmlFor='description'>DESCRIPTION</label>
                    <textarea
                      name='description'
                      id='description'
                      cols='50'
                      value={description}
                      onChange={onChange}
                      rows='3'
                      maxLength={20}
                      required></textarea>
                  </div>
                  <button className='btn' type='submit'>
                    SEND
                  </button>
                </form>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default RequestModal
