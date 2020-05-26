import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import SignUpForm from './components/sign-up.js'
import LoginForm from './components/login.js'
import NavBar from './components/NavBar.js'
import TaskDisplay from './components/task/TaskDisplay.js'
import {BrowserRouter} from 'react-router-dom';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();

    this.state = {
      isAuthenticated: false,
      email: null,
    };

    this.getUser = this.getUser.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  componentDidMount() {
    this.getUser();
  }

  updateUser(email) {
    if (email) {
      this.setState({isAuthenticated: true, email: email});
    } else {
      this.setState({isAuthenticated: false, email: null});
    }
  }

  getUser() {
    axios.get('/user')
      .then((res) => {
        if (res.data && res.data.email) {
          console.log('email: ' + res.data.email);
          this.setState({isAuthenticated: true, email: res.data.email});
        } else {
          console.log('not signed in');
          this.setState({isAuthenticated: false, email: ''});
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({isAuthenticated: false, email: ''});
      });
  }

  render() {
    return (
      <div className="App">

        <BrowserRouter>
        <NavBar isAuthenticated={this.state.isAuthenticated} email={this.state.email} updateUser={this.updateUser}/>

        <Route
          exact path="/"
          render={() =>
            <React.Fragment>
            {
              !this.state.isAuthenticated &&
              <div> Welcome to my app. Please <Link to='/login'>Login</Link> or <Link to='/signup'>Signup</Link> to continue. </div>
            }
            {
              this.state.isAuthenticated &&
              <TaskDisplay/>
            }
            </React.Fragment>
          }
        />
        <Route
          exact path="/login"
          render={() =>
            <LoginForm
              updateUser={this.updateUser}
            />}
        />
        <Route
          exact path="/signup"
          render={() =>
            <SignUpForm
              updateUser={this.updateUser}
            />}
        />
        </BrowserRouter>

      </div>
    );
  }
};

export default App;
