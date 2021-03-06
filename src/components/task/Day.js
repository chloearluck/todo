import React, {Component} from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';
import axios from 'axios';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

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
          this.props.getTasks();
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
    if (!this.props.day) return null;
    return (
    <Col lg={3} md={6}> {/*on large viewports, each column takes up 3/12=1/4 of the screen, on medium 6/12=1/2*/}
      <h4>{this.props.day.dateString}</h4>
      <Droppable droppableId={this.props.day.day_id}>
      {(provided) => (
        <ListGroup {...provided.droppableProps} ref={provided.innerRef}>
          {this.props.day.tasks.map( (task, index) => { if (task) return <Task task={task} key={task._id} day_id={this.props.day.day_id} getTasks={this.props.getTasks} updateModal={this.props.updateModal} index={index}/>; else return null; })}
          {provided.placeholder}
        </ListGroup>
      )}
      </Droppable>
      <Form onSubmit={this.handleSubmit}>
        <Form.Control type="text" value={this.state.newTaskName} name="newTaskName" onChange={this.handleChange} autoComplete="off" />
        <Button variant="primary" type="sumbit">Add</Button>
      </Form>
    </Col>
    );

  }
}

export default Day;