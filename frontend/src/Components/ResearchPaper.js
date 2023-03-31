import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  MDBContainer,
  MDBBtn,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';
import Comments from './Comments';
import Navbar from './Navbar';
import './ResearchPaper.css'

function ResearchPaper() {
    const { Venue_name, Paper } = useParams();

    const [paper, setPaper] = useState([]);


  useEffect(() => {
    const fetchVenues = async () => {
      const response = await fetch(`http://127.0.0.1:8000/venues/${Venue_name}/${Paper}`, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      });
      let data = await response.json();
      setPaper(data);
    };
    fetchVenues();
  }, []);

  
  return (
    <div>
    <Navbar />
    <div className='container-fluid' style={{padding: 0, margin: 0}}>
      <div id="intro" className="bg-image h-50 shadow-1-strong">

      <div className="mask"  style=
      {{background: "linear-gradient(45deg, rgba(29, 236, 197, 0.7), rgba(91, 14, 214, 0.7) 100%)"}}>
        <div className="container d-flex align-items-center justify-content-center text-center h-100">
          <div className="text-white">
            <h1 className='mb-3 fw-bold'>{paper.Research_Paper_name}</h1>
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
                        <span className='fw-bold'>Abstract: </span>{paper.Abstract}
                      </p>
                      <p className='text-muted'>
                        <span className='fw-bold'>Github: </span><a href={paper.Code}>{paper.Code}</a>
                      </p>
                      <p className='text-muted'>
                        <span className='fw-bold'>Visibility: </span>{paper.Visibility}
                      </p>
                      <p className='text-muted'>
                        <span className='fw-bold'>Authors: </span>{paper.Authors}
                      </p>
                      <p className='text-muted'>
                        <span className='fw-bold'>Public Data: </span>{paper.Public_date}
                      </p>
                      <div class="rate">
                        <input type="radio" id="star5" name="rate" value="5" />
                        <label for="star5" title="text">5 stars</label>
                        <input type="radio" id="star4" name="rate" value="4" />
                        <label for="star4" title="text">4 stars</label>
                        <input type="radio" id="star3" name="rate" value="3" />
                        <label for="star3" title="text">3 stars</label>
                        <input type="radio" id="star2" name="rate" value="2" />
                        <label for="star2" title="text">2 stars</label>
                        <input type="radio" id="star1" name="rate" value="1" />
                        <label for="star1" title="text">1 star</label>
                      </div>
                      <a style={{color: "white"}} href={paper.Research_Paper_file}><MDBBtn className='w-100 mb-3' size='md'>Download Paper PDF</MDBBtn></a>
                      <a style={{color: "white"}} href={"/chat/"+paper.Research_Paper_name}><MDBBtn className='w-100 mb-3' size='md'>Community Talk</MDBBtn></a>
                  </MDBRow>
                </MDBContainer>
              </div>
            </section>
          </header>
        </MDBCol>
      </MDBRow>
    </MDBContainer>

    <Comments paper={Paper} />
    </div>
    </div>
  );
}

export default ResearchPaper;
