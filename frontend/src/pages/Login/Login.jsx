import './Login.scss'
import Spinner from '../../components/Spinner/Spinner'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { login, reset } from '../../features/auth/authSlice'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  )
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const { email, password } = formData

  useEffect(() => {
    if (isError) {
      alert(message)
    }
    if (isSuccess || user) {
      navigate('/home')
    }
    dispatch(reset())
  }, [dispatch, navigate, isError, isSuccess, user, message])

  const onSubmit = (e) => {
    e.preventDefault()
    const userData = {
      email,
      password,
    }
    dispatch(login(userData))
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }
  if (isLoading) {
    return <Spinner />
  }
  return (
    <div className='login'>
      <div className='login__container'>
        <div className='login__header'>
          <h1>HELLO!</h1>
          <p>WELCOME BACK!</p>
        </div>
        <section className='login__form'>
          <form onSubmit={onSubmit}>
            <div className='form__control'>
              <input
                type='email'
                name='email'
                id='email'
                value={email}
                onChange={onChange}
                placeholder='ENTER EMAIL'
                required
              />
            </div>
            <div className='form__control'>
              <input
                type='password'
                name='password'
                id='password'
                value={password}
                onChange={onChange}
                placeholder='ENTER PASSWORD'
                required
              />
            </div>
            <button className='btn'>LOGIN</button>
            <p className='small__text'>
              NOT REGISTERED YET?<Link to='/register'> CREATE AN ACCOUNT</Link>{' '}
            </p>
          </form>
        </section>
      </div>
    </div>
  )
}

export default Login
