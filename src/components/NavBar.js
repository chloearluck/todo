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
      <div className="navbar navbar-light fixed-top navbar-expand-sm bg-light">
        <div className="container"><a className="navbar-brand" href="/"><i className="fas fa-cube"></i>To Do App</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbar-collapse"><span className="sr-only">Toggle navigation</span><span className="navbar-toggler-icon"></span></button>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <Link to='/'>
                <li className="nav-item"><p className="nav-link">Home</p></li>
              </Link>
              <Link to='/about'>
                <li className="nav-item"><p className="nav-link">About</p></li>
              </Link>
            </ul>

            <ul className="nav navbar-nav ml-auto">
            { !this.props.isAuthenticated &&
              <React.Fragment>
              <Link to='/login'>
                <li className="nav-item"><p className="nav-link">Login</p></li>
              </Link>
              <Link to='/signup'>
                <li className="nav-item"><p className="nav-link">Signup</p></li>
              </Link>
              </React.Fragment>
            }

            { this.props.isAuthenticated &&
              <React.Fragment>
              <li className="nav-item"><p className="nav-link disabled">Hello, {this.props.email}</p></li>
              <Link to='/account'>
                <li className="nav-item"><p className="nav-link">Account</p></li>
              </Link>
              <Link to='/'>
                <li className="nav-item"><p className="nav-link" onClick={this.logout}>Logout</p></li>
              </Link>
              </React.Fragment>
            }

            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default NavBar;
