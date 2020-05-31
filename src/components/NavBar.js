import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

class NavBar extends Component {
  constructor() {
    super()

    this.logout = this.logout.bind(this)
  }

  logout() {
    axios.get('/logout')
      .then((res) => {
        console.log(res);
        this.props.updateUser(null);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  render() {
    return (
      <Navbar bg="light" fixed="top" expand="sm">
        <Navbar.Brand as={Link} to="/">My Planner</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link as={Link} to="/">Home</Nav.Link>
          </Nav>
          { this.props.isAuthenticated &&
            <Nav className="ml-auto">
              <Nav.Link disabled>{this.props.email}</Nav.Link>
              <Nav.Link as={Link} to="/account">Account</Nav.Link>
              <Nav.Link as={Link} to="/" onClick={this.logout}>Logout</Nav.Link>
            </Nav>
          }
          { !this.props.isAuthenticated &&
            <Nav className="ml-auto">
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
            </Nav>
          }
        </Navbar.Collapse>
      </Navbar>
      );
  }
}

export default NavBar;
