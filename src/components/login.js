import React, {Component} from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios'

class LoginForm extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
      redirect: null,
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

    axios.post('/login', {email: this.state.email, 
                     password: this.state.password})
    .then( (res) => {
      console.log(res);
      if (res.status === 200) {
        this.setState( { redirect: '/'} );
        this.props.updateUser(this.state.email);
      }
      else {
        //to do: handle failed login (display error)?
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
      <div className="container-sm">
      <form onSubmit={this.handleSubmit}>
      <div className="mx-auto" style={{width: "400px"}}>

        <div className="form-group">
          <label htmlFor="emailInput">Email:</label>
          <input className="form-control" type="email" value={this.state.email} name="email" id="emailInput" onChange={this.handleChange}/>
        </div>

        <div className="form-group">
          <label htmlFor="passwordInput">Password:</label>
          <input className="form-control" type="password" value={this.state.password} name="password" id="passwordInput" onChange={this.handleChange}/>
        </div>

        <div className="form-group">
          <button className="btn btn-primary" type="submit" value="Submit">Log in</button>
        </div>

      </div>
      </form>
      </div>
    );
  }
}

export default LoginForm