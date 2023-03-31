import React, { useState } from 'react';
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
  MDBBtn,
  MDBIcon,
  MDBNavbarNav,
  MDBInputGroup,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem
} from 'mdb-react-ui-kit';

export default function App() {
  const [showNavNoTogglerSecond, setShowNavNoTogglerSecond] = useState(false);
  let login = localStorage.getItem('token') ? true : false;
  console.log(login)

  let username = "";
  return (
    <>
      <MDBNavbar expand='lg' light bgColor='light'>
        <MDBContainer>
          <MDBNavbarBrand href='/'>Sci-commons</MDBNavbarBrand>
          <MDBNavbarToggler
            type='button'
            data-target='#navbarTogglerDemo02'
            aria-controls='navbarTogglerDemo02'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={() => setShowNavNoTogglerSecond(!showNavNoTogglerSecond)}
          >
            <MDBIcon icon='bars' fas />
          </MDBNavbarToggler>

          <MDBCollapse style={{marginLeft:"20rem"}} className='d-flex justify-content-between' navbar show={showNavNoTogglerSecond}>
            <MDBInputGroup tag="form" className='pt-3 d-flex w-auto mb-3'>
              <input className='form-control' placeholder="Type query" aria-label="Search" type='Search' />
              <MDBBtn outline>Search</MDBBtn>
            </MDBInputGroup>
            <div className='w-10'>
            <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
              <MDBNavbarItem>
                <MDBNavbarLink active aria-current='page' href='/notifications'>
                  Notifications
                </MDBNavbarLink>
              </MDBNavbarItem>

              <MDBNavbarItem>
                { localStorage.getItem('token') ?
                <MDBNavbarLink active href='/logout'>Logout</MDBNavbarLink>
                : <MDBNavbarLink active href='/login'>Login</MDBNavbarLink>}
              </MDBNavbarItem>

              <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag='a' className='nav-link' role='button'>
                  Profile
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem href={`/profile/${username}`} link>view</MDBDropdownItem>
                  <MDBDropdownItem link>Another action</MDBDropdownItem>
                  <MDBDropdownItem link>Something else here</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>
            </MDBNavbarNav>

            
            </div>
            
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>
    </>
  );
}