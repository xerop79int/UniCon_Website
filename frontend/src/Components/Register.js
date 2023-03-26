import React, { useRef } from 'react';
import './Register.css'
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput
}
from 'mdb-react-ui-kit';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


function Register() {
    const navigate = useNavigate();

    const first_name = useRef(null)
    const last_name = useRef(null)
    const username = useRef(null)
    const email = useRef(null)
    const password = useRef(null)
    const password2 = useRef(null)
    
    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            'first_name': first_name.current.value,
            'last_name': last_name.current.value,
            'username': username.current.value,
            'email': email.current.value,
            'password': password.current.value,
            'password2': password2.current.value
        }

        axios.post('http://127.0.0.1:8000/register', data,{
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            console.log(response);
            if (response.status === 200){
                navigate('/login');
            }
        })
        .catch((error)=>{
            console.error(error);
        })

        
    }


  return (
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

              <MDBRow>
                <MDBCol col='6'>
                  <MDBInput wrapperClass='mb-4' ref={first_name} name='first_name' label='First name' id='form1' type='text'/>
                </MDBCol>

                <MDBCol col='6'>
                  <MDBInput wrapperClass='mb-4' ref={last_name} name='last_name' label='Last name' id='form2' type='text'/>
                </MDBCol>
              </MDBRow>

              <MDBInput wrapperClass='mb-4' ref={username} name='username' label='Username' type='text'/>
              <MDBInput wrapperClass='mb-4' ref={email} name='email' label='Email' id='form3' type='email'/>
              <MDBInput wrapperClass='mb-4' ref={password} name='password' label='Password' id='form4' type='password'/>
              <MDBInput wrapperClass='mb-4' ref={password2} name='password2' label='Confirm Password' id='form4' type='password'/>


              <MDBBtn className='w-100 mb-4' size='md' onClick={handleSubmit}>sign up</MDBBtn>


            </MDBCardBody>
          </MDBCard>

        </MDBCol>

      </MDBRow>

    </MDBContainer>
    </div>
  );
}

export default Register;