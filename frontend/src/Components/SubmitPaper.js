import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MDBInput,
  MDBFile,
  MDBBtn,
  MDBContainer,
  MDBTextArea
} from 'mdb-react-ui-kit';
import axios from 'axios';

export default function SubmitPaper() {
    const { Venue_name } = useParams();

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [code, setCode] = useState("");
    const [authors, setAuthors] = useState("");
    const [abstract, setAbstract] = useState("");
    const [pdf, setPdf] = useState();


    const handleSubmit = (e) => {
        e.preventDefault();
        
        let form_data = new FormData();
        form_data.append('venue', Venue_name);
        form_data.append('title', title);
        form_data.append('code', code);
        form_data.append('authors', authors);
        form_data.append('abstract', abstract);
        form_data.append('pdf', pdf);

        let URL = `http://127.0.0.1:8000/venues/${Venue_name}/paper`;
        axios.post(URL, form_data, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
            .then(res => {
              console.log(res.data);
              navigate('/')
            })
            .catch(err => console.log(err))
        };
    
  return (

        <MDBContainer breakpoint="sm" style={{marginTop: '5rem', border: '1px solid #000', padding: "1.5rem", borderRadius: '0.5rem'}}>
        <h1 className='h3 text-center mb-4'>Submit Paper</h1>
      <MDBInput type='text' id='form4Example2' required onChange={e => setTitle(e.target.value)} wrapperClass=' mb-4' label='Paper Title' />
      <MDBInput type='text' id='form4Example2' onChange={e => setCode(e.target.value)} wrapperClass='mt-4 mb-4' label='Github URL' />
      <MDBInput type='text' id='form4Example2' onChange={e => setAuthors(e.target.value)} name='authors' wrapperClass='mb-4' label='Enter other Author(s) Email for Contribution (Use ", " to separate multiple emails):' />
      <MDBTextArea label='Abstract' onChange={e => setAbstract(e.target.value)}id='textAreaExample' rows={4} wrapperClass='mb-4' />
      <MDBFile accept='pdf' label='Paper PDF' required onChange={e => setPdf(e.target.files[0])} type='file' size='lg' className='mb-4' id='formFileLg' />
      <MDBBtn onClick={handleSubmit} className='mb-4' block>
        Submit
      </MDBBtn>
      </MDBContainer>
  );
}