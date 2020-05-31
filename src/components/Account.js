import React, {Component} from 'react';
import axios from 'axios';
import * as moment from 'moment-timezone';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class Account extends Component {
  constructor() {
    super();

    this.state = {
      email: null,
      timezone: null,
      tznames: null,
      redirect : null,
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.getAccount = this.getAccount.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.getAccount();
    this.setState({ tznames: moment.tz.names() })
  }

  getAccount() {
    axios.get('/account')
      .then((res) => {
        if (res.data) {
          this.setState({ email: res.data.email, timezone: res.data.timezone });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange(event) {
    console.log(event.target.name);
    console.log(event.target.value);
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('submitted');

    axios.post('/account/profile', { email: this.state.email, timezone: this.state.timezone })
      .then((res) => {
        if (res.status === 200) {
          console.log('account updated');
        } else {
          //handle error
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  handleDelete(event) {
    event.preventDefault();
    this.props.updateUser(null);

    axios.post('account/delete')
      .then((res) => {
        console.log('account deleted');
      })
      .catch((err) => {
        console.log(err);
      })
  }

  render() {
    if (!this.state.email) return null;

    return (
      <Container>
        <div className="mx-auto" style={{width: "400px"}}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="name" value={this.state.email} onChange={this.handleChange} autoComplete="off" />

            <Form.Label>Time Zone:</Form.Label>
            <Form.Control as="select" name="timezone" value={this.state.timezone} onChange={this.handleChange}>
              { this.state.tznames.map( (tz) => {  return (<option key={tz}>{tz}</option>); } )}
            </Form.Control>

            <Button variant="primary" style={{marginTop: "10px"}} type="sumbit">Update</Button>
          </Form>

          <hr/>

          <Form.Label>Delete Account (WARNING: cannot undo): </Form.Label>
          <Button variant="primary" onClick={this.handleDelete}>Delete Account</Button>
        </div>
      </Container>
    );
  }
}

export default Account;