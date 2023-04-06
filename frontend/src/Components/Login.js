import React, { useRef } from 'react';
import './Login.css'
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
}
from 'mdb-react-ui-kit';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import DesktopNavbar from './Desktop_Navbar';

function Login() {
    
    const navigate = useNavigate();
    const username = useRef(null)
    const password = useRef(null)

    
    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            'username': username.current.value,
            'password': password.current.value,
        }

        axios.post('http://127.0.0.1:8000/login', data,{
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
              localStorage.setItem('token', response.data.token);
              navigate('/');
        })
        .catch((error)=>{
            console.error(error);
        })

        
    }

  return (
    <div>
      {window.innerWidth > 768 ? (
        <DesktopNavbar />
        ) : (
    <Navbar />
    )}
    <div className="LoginContainer">
    <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden'>

      <MDBRow className='ContentDiv'>

        <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>

          <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{color: 'hsl(218, 81%, 95%)'}}>
            The best offer <br />
            <span style={{color: 'hsl(218, 81%, 75%)'}}>for your business</span>
          </h1>

          <p className='px-3' style={{color: 'hsl(218, 81%, 85%)'}}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Eveniet, itaque accusantium odio, soluta, corrupti aliquam
            quibusdam tempora at cupiditate quis eum maiores libero
            veritatis? Dicta facilis sint aliquid ipsum atque?
          </p>

        </MDBCol>

        <MDBCol md='6' className='position-relative'>

          <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
          <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

          <MDBCard className='my-5 bg-glass'>
            <MDBCardBody className='p-5'>

              <MDBInput wrapperClass='mb-4' ref={username} name='username' label='Username' id='form2' type='text'/>
              <MDBInput wrapperClass='mb-4' ref={password} name='password' label='Password' id='form4' type='password'/>

              <div className="d-flex mb-4">
            <a href="/forgetPassword">Forgot password?</a>
            </div>

              <MDBBtn className='w-100 mb-3' onClick={handleSubmit} size='md'>Login</MDBBtn>

            <div className="divider d-flex align-items-center my-2">
            <p className="text-center fw-bold mx-3 mb-4">OR</p>
            </div>

            <MDBBtn className='w-100 mb-2' size='md' onClick={()=> navigate('/register')}>Register</MDBBtn>


            </MDBCardBody>
          </MDBCard>

        </MDBCol>

      </MDBRow>

    </MDBContainer>
    </div>
    </div>
  );
}

export default Login;