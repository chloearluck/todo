import React, {Component} from 'react';
import Day from './Day.js';
import TaskModal from './TaskModal';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

class TaskDisplay extends Component {
  constructor() {
    super();

    this.state = {
      tasks: null,
      modalTask: null,
    }

    this.componentDidMount = this.componentDidMount.bind(this)
    this.getTasks = this.getTasks.bind(this)
    this.updateModal = this.updateModal.bind(this);

    this.taskModalElement = React.createRef();
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

  updateModal(taskId) {
    console.log('updateModal: '+ taskId);

    if (taskId) {
      axios.get('/task/'+taskId)
        .then( (res) => {
          console.log(res);
          this.setState({modalTask: res.data});
          this.taskModalElement.current.updateForm();
        })
        .catch( (err) => {
          console.log(err);
        });
    } else {
      this.setState({modalTask: null});
    }
  }

  render() {
    if (!this.state.tasks) return (<div> Loading... </div>)

    return (
      <Container>
        <Row>
          {this.state.tasks.map( (day) => { return <Day day={day} key={day.day_id} getTasks={this.getTasks} updateModal={this.updateModal} />; })}
        </Row>
      <TaskModal ref={this.taskModalElement} task={this.state.modalTask} updateModal={this.updateModal}/>
      </Container>
    );
  }
};

export default TaskDisplay;