import React, {Component} from 'react';
import Task from './Task';
import axios from 'axios';

class Day extends Component {
  constructor(props) {
    super();

    this.state = {
      newTaskName: '',
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    axios.post('/task', {name: this.state.newTaskName, date: this.props.day.date, dayId: this.props.day.day_id})
      .then((res) => {
        if (res.status === 201) {
          //trigger refresh of tasks
          this.props.getTasks();
          //clear textbox
          this.setState({ newTaskName: ''});
        } else {
          //flash an error?
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
    <div className="col-sm" key={this.props.day.day_id}>
      <h4>{this.props.day.dateString}</h4>
      <ul className="list-group">
        {this.props.day.tasks.map( (task) => { return <Task task={task} key={task._id} day_id={this.props.day.day_id} getTasks={this.props.getTasks}/>; })}
      </ul>
      <form onSubmit={this.handleSubmit}>
      <div className="form-group">
        <input className="form-control" type="text" value={this.state.newTaskName} name="newTaskName" onChange={this.handleChange}/>
      </div>
      <button className="btn btn-primary" type="submit" value="Submit">Add</button>
      </form>
    </div>
    );

  }
}

export default Day;