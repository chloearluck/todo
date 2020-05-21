import React, {Component} from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios'

class SignUpForm extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      redirect : null,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault()

    axios.post('/signup', {email: this.state.email, 
                     password: this.state.password, 
                     confirmPassword: this.state.confirmPassword})
    .then( (res) => {
      console.log(res);
      if (res.status === 200) {
        this.setState({ redirect: '/'});
        this.updateUser(this.state.email);
      }
    })
    .catch( (err) => {
      console.log(err);
    })
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return (
      <div className="SignupForm">
        <h1>Signup form</h1>
        <label htmlFor="email">Email: </label>
        <input
          type="text"
          name="email"
          value={this.state.email}
          onChange={this.handleChange}
        />
        <br/>
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          name="password"
          value={this.state.password}
          onChange={this.handleChange}
        />
        <br/>
        <label htmlFor="confirmPassword"> Confirm Password: </label>
        <input
          type="password"
          name="confirmPassword"
          value={this.state.confirmPassword}
          onChange={this.handleChange}
        />
        <br/>
        <button onClick={this.handleSubmit}>Sign up</button>
      </div>
    )
  }
}

export default SignUpForm