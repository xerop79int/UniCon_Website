import { useState, useEffect } from 'react';
import { MDBBadge, MDBTable, MDBTableHead, MDBTableBody, MDBContainer } from 'mdb-react-ui-kit';
import Navbar from './Navbar';
import DesktopNavbar from './Desktop_Navbar';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
      if (!localStorage.getItem('token')) {
        window.location.href = '/login';
      }
      const fetchNotifications = async () => {
        const response = await fetch('http://127.0.0.1:8000/notifications', {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        });
        const data = await response.json();
        console.log(data.notifications);
        setNotifications(data.notifications);
      };
      fetchNotifications();
    }, []);
    


  return (
    <div>
    {window.innerWidth > 768 ? (
        <DesktopNavbar />
        ) : (
    <Navbar />
    )}
    <MDBContainer>
    <MDBTable align='middle'>
      <MDBTableHead>
        <tr>
          <th scope='col fw-bold'>Notifications</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {notifications.map((notification) => (
            <tr key={notification.id} className="hover">
          <td>
            <div className='d-flex align-items-center'>
              <div className='ms-3'>
                <a href={notification.link}>
                <p className='fw-bold mb-1'>{notification.message}</p>
                </a>
              </div>
            </div>
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