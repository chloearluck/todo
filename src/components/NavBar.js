import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

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
      <nav className="navbar navbar-dark bg-primary fixed-top">
        <Link className="navbar-brand" to="/">
          To Do App
        </Link>
        {
          !this.props.isAuthenticated && 
          <Link to='/login'>
          <button className="btn btn-dark">Log in</button>
          </Link>
        }
        {
          !this.props.isAuthenticated && 
          <Link to='/signup'>
          <button className="btn btn-dark">Sign up</button>
          </Link>
        }
        {
          this.props.isAuthenticated &&
          <div> Hello, {this.props.email} </div>
        }
        {
          this.props.isAuthenticated &&
          <button className='btn btn-dark' onClick={this.logout}>Logout</button>
        }
      </nav>
    );

  }

}
export default NavBar;
