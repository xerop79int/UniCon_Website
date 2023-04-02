import { useState, useEffect } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody, MDBContainer } from 'mdb-react-ui-kit';
import Navbar from './Navbar';
import { useParams } from 'react-router-dom';

export default function Search() {
    const [papers, setPapers] = useState([]);
    const { Paper } = useParams();

    useEffect(() => {
      const fetchVenues = async () => {
        const response = await fetch(`http://127.0.0.1:8000/search?s=${Paper}`, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        });
        const data = await response.json();
        setPapers(data.papers);
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
          <th scope='col fw-bold'>Paper Title</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {papers.map((paper) => (
            <tr key={paper.id} className="hover">
          <td>
            <div className='d-flex align-items-center'>
              <div className='ms-3'>
                <a href={`/venues/${paper.venue}/${paper.name}`}>
                <p className='fw-bold mb-1'>{paper.name}</p>
                </a>
              </div>
            </div>
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