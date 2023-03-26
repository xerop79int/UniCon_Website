import { useState, useEffect } from 'react';
import { MDBBadge, MDBTable, MDBTableHead, MDBTableBody, MDBContainer } from 'mdb-react-ui-kit';
import Navbar from './Navbar';

export default function Venues() {
    const [venues, setVenues] = useState([]);

    useEffect(() => {
      if (!localStorage.getItem('token')) {
        window.location.href = '/login';
      }
      const fetchVenues = async () => {
        const response = await fetch('http://127.0.0.1:8000/venues', {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        });
        const data = await response.json();
        setVenues(data.venues);
      };
      fetchVenues();
    }, []);
    


  return (
    <div>
    <Navbar />
    <MDBContainer>
    <MDBTable align='middle'>
      <MDBTableHead>
        <tr>
          <th scope='col fw-bold'>Venue Title</th>
          <th scope='col fw-bold'>Location</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {venues.map((venue) => (
            <tr key={venue.id} className="hover">
          <td>
            <div className='d-flex align-items-center'>
              <div className='ms-3'>
                <a href={/venues/ + venue.Venue_name}>
                <p className='fw-bold mb-1'>{venue.Venue_name}</p>
                <p className='text-muted mb-0'>{venue.email}</p>
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
    </MDBContainer>
    </div>

  );
}