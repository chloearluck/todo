import React, {Component} from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios'

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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
        this.props.updateUser(this.state.email);
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
      <Container>
        <div className="mx-auto" style={{width: "400px"}}>
          <Form onSubmit={this.handleSubmit}>

            <Form.Label>Email: </Form.Label>
            <Form.Control type="email" name="email" value={this.state.email} onChange={this.handleChange} />

            <Form.Label>Password: </Form.Label>
            <Form.Control type="password" name="password" value={this.state.password} onChange={this.handleChange} />

            <Form.Label>Confirm Password: </Form.Label>
            <Form.Control type="password" name="confirmPassword" value={this.state.confirmPassword} onChange={this.handleChange} />

            <Button variant="primary" style={{marginTop: "10px"}} type="sumbit">Sign up</Button>
          </Form>
        </div>
      </Container>
    );
  }
}

export default SignUpForm