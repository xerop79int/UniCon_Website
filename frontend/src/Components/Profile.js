import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Profile.css";
import { MDBCol, MDBContainer, MDBBtn, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import Navbar from './Navbar';
import DesktopNavbar from './Desktop_Navbar';

export default function PersonalProfile() {
  const { username } = useParams();
  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('http://127.0.0.1:8000/profile/' + username, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        });
      let data = await response.json();
      console.log(data.user);
      setUser(data.user[0]);
    };
    fetchUser();
  }, []);



  return (
    <div>
      {window.innerWidth > 768 ? (
        <DesktopNavbar />
        ) : (
    <Navbar />
    )}
    <section className="vh-100" style={{ backgroundColor: '#f4f5f7' }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="6" className="mb-4 mb-lg-0">
            <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
              <MDBRow className="g-0">
                <MDBCol md="4" className="gradient-custom text-center text-white"
                  style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                  <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                    alt="Avatar" className="my-5" style={{ width: '80px' }} fluid />
                  <MDBTypography tag="h5">{user.first_name + " "  + user.last_name}</MDBTypography>
                  <MDBCardText>Researcher</MDBCardText>
                  <MDBIcon far icon="edit mb-5" />
                </MDBCol>
                <MDBCol md="8">
                  <MDBCardBody className="p-4">
                    <MDBTypography tag="h6">Information</MDBTypography>
                    <hr className="mt-0 mb-4" />
                    <MDBRow className="pt-1">
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Email</MDBTypography>
                        <MDBCardText className="text-muted">{user.email}</MDBCardText>
                      </MDBCol>
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Phone</MDBTypography>
                        <MDBCardText className="text-muted">*** *** ***</MDBCardText>
                      </MDBCol>
                    </MDBRow>

                    <MDBTypography tag="h6">Ranking</MDBTypography>
                    <hr className="mt-0 mb-4" />
                    <MDBRow className="pt-1">
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Ranking</MDBTypography>
                        <MDBCardText className="text-muted"><span style={{fontWeight: "500", color: "red"}}>{user.ranking}</span></MDBCardText>
                      </MDBCol>
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Points</MDBTypography>
                        <MDBCardText className="text-muted"><span style={{fontWeight: "500",color: "red"}}>{user.points}</span></MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <div className="d-flex pt-1">
                      <MDBBtn onClick={() => window.location.href = '/chat/' + username} className="flex-grow-1">Chat</MDBBtn>
                    </div>
                  </MDBCardBody>
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
    </div>
  );
}