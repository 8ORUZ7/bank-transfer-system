import React from 'react'
import './NotFound.scss'
import { Link } from 'react-router-dom'
const NotFound = () => {
  return (
    <div className='notFound'>
      <h1>404 - NOT FOUND</h1>
      <p>THE REQUESTED PAGE COULD NOT BE FOUND.</p>
      <Link to='/home' className='notFoundLink'>
        <p>GO TO HOME</p>
      </Link>
    </div>
  )
}
export default NotFound
