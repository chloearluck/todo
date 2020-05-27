import React, {Component} from 'react';
import axios from 'axios';
import * as moment from 'moment-timezone';

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
      <div className="container-sm">
      <form onSubmit={this.handleSubmit}>
      <div className="mx-auto" style={{width: "400px"}}>

        <div className="form-group">
          <label htmlFor="emailInput">Email:</label>
          <input className="form-control" type="email" value={this.state.email} name="email" id="emailInput" onChange={this.handleChange}/>
        </div>

        <div className="form-group">
          <label htmlFor="timezoneInput">Time Zone:</label>
          <select className="form-control" name="timezone" id="timezoneInput" value={this.state.timezone} onChange={this.handleChange}>
          { this.state.tznames.map( (tz) => {  return (<option key={tz}>{tz}</option>); } )}
          </select>
        </div>

        <div className="form-group">
          <button className="btn btn-primary" type="submit" value="Submit">Update</button>
        </div>

      </div>
      </form>

      <div className="mx-auto" style={{width: "400px"}}>
      <label htmlFor="deleteAccountButton">Delete Account (WARNING: cannot undo): </label>
      <div className="form-group">
        <button className="btn btn-primary" type="submit" value="Submit" id="deleteAccountButton" onClick={this.handleDelete}>Delete Account</button>
      </div>
      </div>

      </div>
    );
  }
}

export default Account;