import React, { useState } from 'react';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
} from 'mdb-react-ui-kit';

export default function Navbar() {
  const [showBasic, setShowBasic] = useState(false);
  const [search, setSearch] = useState("");

  let login = localStorage.getItem('token') ? true : false;
  console.log(login)

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/search/${search}`;
  }

  const handlelogout = (e) => {
    e.preventDefault();
    
    fetch(`http://127.0.0.1:8000/logout`, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        });
        localStorage.removeItem('token');
        window.location.href = '/login';
      };
  

  let username = "";

  return (
    <MDBNavbar expand='lg' light bgColor='light'>
      <MDBContainer fluid>
        <MDBNavbarBrand href='/'>Sci-commons</MDBNavbarBrand>

        <MDBNavbarToggler
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setShowBasic(!showBasic)}
        >
          <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar show={showBasic}>
          <div className='d-flex input-group w-auto'>
            <input onChange={e => setSearch(e.target.value)} type='search' className='form-control' placeholder='Type query' aria-label='Search' />
            <MDBBtn onClick={handleSearch} color='primary'>Search</MDBBtn>
          </div>
          <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
              <MDBNavbarItem>
                <MDBNavbarLink active aria-current='page' href='/notifications'>
                  Notifications
                </MDBNavbarLink>
              </MDBNavbarItem>

              <MDBNavbarItem>
                { localStorage.getItem('token') ?
                <MDBNavbarLink active onClick={handlelogout}>Logout</MDBNavbarLink>
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

          
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}