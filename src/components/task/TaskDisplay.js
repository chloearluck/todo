import React, {Component} from 'react';
import Day from './Day.js';
import axios from 'axios';

class TaskDisplay extends Component {
  constructor() {
    super();

    this.state = {
      tasks: null,
    }

    this.componentDidMount = this.componentDidMount.bind(this)
    this.getTasks = this.getTasks.bind(this)
  }

  componentDidMount() {
    this.getTasks();
  }

  getTasks() {
    axios.get('/task')
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          this.setState({tasks: res.data});
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  render() {
    if (!this.state.tasks) return (<div> Loading... </div>)

    return (
      <div className="container">
        <div className="row">
          {this.state.tasks.map( (day) => { return <Day day={day} key={day.day_id} getTasks={this.getTasks}/>; })}
        </div>
      </div>

    );
  }
};

export default TaskDisplay;