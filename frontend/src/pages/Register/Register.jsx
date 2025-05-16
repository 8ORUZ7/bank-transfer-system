import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Spinner from '../../components/Spinner/Spinner'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { register, reset } from '../../features/auth/authSlice'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    identificationType: '',
  })

  const { name, email, password, phone, address, identificationType } = formData

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      alert(message)
    }
    if (isSuccess || user) {
      navigate('/home')
    }
    dispatch(reset())
  }, [dispatch, navigate, isError, isSuccess, user, message])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }
  const onSubmit = (e) => {
    e.preventDefault()

    const userData = {
      name,
      email,
      password,
      phone,
      address,
      identificationType,
    }
    dispatch(register(userData))
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className='login'>
      <div className='login__container'>
        <div className='login__header'>
          <h1>CREATE AN ACCOUNT</h1>
          <p>GET STARTED BY CREATED YOUR ACCOUNT.</p>
        </div>
        <section className='login__form'>
          <form onSubmit={onSubmit}>
            <div className='form__control'>
              <input
                type='text'
                name='name'
                id='name'
                value={name}
                onChange={onChange}
                placeholder='ENTER YOUR NAME'
                required
              />
            </div>
            <div className='form__control'>
              <input
                type='email'
                name='email'
                id='email'
                value={email}
                onChange={onChange}
                placeholder='ENTER YOUR EMAIL'
                required
              />
            </div>
            <div className='form__control'>
              <input
                type='text'
                name='phone'
                id='phone'
                value={phone}
                onChange={onChange}
                placeholder='ENTER PHONE NUMBER'
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
            <div className='form__control'>
              <select
                name='identificationType'
                id='identificationType'
                value={identificationType}
                onChange={onChange}>
                <option value='driver license'>DRIVER LICENSE</option>
                <option value='passport'>PASSPORT</option>
                <option value='national ID'>NATIONAL ID</option>
              </select>
            </div>
            <div className='form__control'>
              <input
                type='text'
                name='address'
                id='address'
                value={address}
                onChange={onChange}
                placeholder='TYPE ADDRESS'
                required
              />
            </div>
            <button className='btn' type='submit'>
             REGISTER
            </button>
            <p className='small__text'>
              ALREADY HAVE ACCOUNT?<Link to='/login'> LOGIN</Link>{' '}
            </p>
          </form>
        </section>
      </div>
    </div>
  )
}

export default Register
