import React, {Component} from 'react';
import axios from 'axios'

class SignUpForm extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
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
    })
    .catch( (err) => {
      console.log(err);
    })
  }

  render() {

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