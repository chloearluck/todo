import React, {Component} from 'react';
import axios from 'axios';

class Task extends Component {
  constructor(props) {
    super();

    this.state = {
      checked: false,
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
  }

  componentDidMount() {
    this.setState({ checked: this.props.task.completed });
  }

  handleDelete() {
    console.log('delete task');
    console.log('task id: ' + this.props.task._id);
    console.log('day id: ' + this.props.day_id);

    axios.post('/task/delete', { taskId: this.props.task._id, dayId: this.props.day_id })
      .then((res) => {
        if (res.status === 202) {
          this.props.getTasks();
        } else {
          //flash error?
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  handleCheckChange(event) {
    this.setState({ checked: !this.state.checked });

    axios.post('/task/completion', { taskId: this.props.task._id, completed: !this.state.checked })
      .then((res) => {
        console.log(res);
        if (!res.status === 202) {
          this.props.getTasks();
        }
      })
      .catch((err) => {
        console.log(err);
        this.props.getTasks();
      })
  }

  render() {
    return (
    <li className="list-group-item d-flex justify-content-between align-items-center" key={this.props.task._id}>
      <div className="form-check disabled">
        <label className="form-check-label">
          <input className="form-check-input" type="checkbox" checked={this.state.checked} disabled="" onChange={this.handleCheckChange}/>
          {!this.state.checked && this.props.task.name}
          {this.state.checked && <strike>{this.props.task.name}</strike>}
        </label>
      </div>
      <span><button type="button" className="btn btn-sm remove-item" onClick={this.handleDelete}>x</button></span>
    </li>);
  }
}

export default Task;