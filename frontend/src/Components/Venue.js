import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  MDBContainer,
  MDBBtn,
  MDBRow,
  MDBCol,
} from 'mdb-react-ui-kit';
import { MDBBadge, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import Navbar from './Navbar';
import axios from 'axios';

function Venue() {
    const { Venue_name } = useParams();

    const [venue, setVenue] = useState([]);
    const [papers, setPapers] = useState([]);

  useEffect(() => {
    const fetchVenues = async () => {
      const response = await fetch('http://127.0.0.1:8000/venues/' + Venue_name, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        });
      let data = await response.json();
      setVenue(data);
    };
    fetchVenues();
  }, []);

  useEffect(() => {
    const fetchVenues = async () => {
      const response = await fetch(`http://127.0.0.1:8000/venues/${Venue_name}/papers/all`,{
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        });
      let data = await response.json();
      console.log(data);
      setPapers(data.papers);
    };
    fetchVenues();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:8000/subscribe/${Venue_name}`,{
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        }).then((response) => {
            console.log(response);
        })
        .catch((error)=>{
            console.error(error);
        })
  };



  
  return (
    <div>
      <Navbar />
    <div className='container-fluid' style={{padding: 0, margin: 0}}>
      <div id="intro" class="bg-image h-50 shadow-1-strong">

      <div class="mask"  style=
      {{background: "linear-gradient(45deg, rgba(29, 236, 197, 0.7), rgba(91, 14, 214, 0.7) 100%)"}}>
        <div class="container d-flex align-items-center justify-content-center text-center h-100">
          <div class="text-white">
            <h1 class="mb-3">{venue.Venue_name}</h1>
            <hr/>
          </div>
        </div>
      </div>
      </div>
    <MDBContainer>
            
      <MDBRow className='justify-content-center'>
        <MDBCol md='12'>
          <header style={{ position: 'relative', overflow: 'hidden' }}>
            <section className='text-center text-md-start'>

              <div className='pb-2' style={{ backgroundColor: 'background-color: hsl(0, 0%, 98%)' }}>
                <MDBContainer>
                  <MDBRow className='mb-4 mt-4 mb-md-0 pt-0 d-flex  flex-wrap align-items-center'>
                      <p className='text-muted'>
                        <span className='fw-bold'>Subtitle: </span>{venue.subtitle}
                      </p>
                      <p className='text-muted'>
                        <span className='fw-bold'>Description: </span>{venue.description}
                      </p>
                      <p className='text-muted'>
                        <span className='fw-bold'>Location: </span>{venue.location}
                      </p>
                      <p className='text-muted'>
                        <span className='fw-bold'>Website: </span><a href={venue.website} >{venue.website}</a>
                      </p>
                      <p className='text-muted'>
                        <span className='fw-bold'>Date: </span>{venue.date}
                      </p>
                      <p className='text-muted'>
                        <span className='fw-bold'>Contact: </span>{venue.email}
                      </p>
                      <MDBBtn style={{backgroundColor: "#40e0d0", marginLeft: "1rem", width: "20rem"}} onClick={handleSubscribe} className='ml-2 mb-3' size='lg'>Subscribe To This Venue</MDBBtn>
                      <a style={{color: "white"}} href={"/venues/" + venue.Venue_name + "/submit"}><MDBBtn className='w-100 mb-3' size='lg'>Submit a Paper</MDBBtn></a>
                  </MDBRow>
                </MDBContainer>
              </div>
            </section>
          </header>
        </MDBCol>
      </MDBRow>
      <MDBRow className='justify-content-center'>
      <MDBTable align='middle'>
      <MDBTableHead>
        <tr>
          <th scope='col'>Paper Title</th>
          <th scope='col'>Visibility</th>

        </tr>
      </MDBTableHead>
      <MDBTableBody>
      {papers.map((paper) => (
            <tr key={paper.id} className="hover">
          <td>
            <div className='d-flex align-items-center'>
              <div className='ms-3'>
                <a href={/venues/ + venue.Venue_name + "/" + paper.Research_Paper_name}>
                <p className='fw-bold mb-1'>{paper.Research_Paper_name}</p>
                <p className='text-muted mb-0'>{paper.visibility}</p>
                </a>
              </div>
            </div>
          </td>
          <td>
            <p className='fw-normal mb-1'>{venue.location}</p>
          </td>
          <td>
            <MDBBadge color='success' pill>
              Active
            </MDBBadge>
          </td>
        </tr>
        ))}
      </MDBTableBody>

      <style>
        {`
        .hover:hover{
            background-color: #f5f5f5;
        }
        `}
        </style>
    </MDBTable>
      </MDBRow>
    </MDBContainer>
    </div>
    </div>
  );
}

export default Venue;
