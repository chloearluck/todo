import React, {Component} from 'react';
import { Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';

class Task extends Component {
  constructor(props) {
    super();

    this.state = {
      checked: false,
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
  }

  componentDidMount() {
    this.setState({ checked: this.props.task.completed });
  }

  handleDelete(event) {
    event.stopPropagation();

    axios.post('/task/'+this.props.task._id+'/delete', { dayId: this.props.day_id })
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

    axios.post('/task/'+this.props.task._id+'/completion', { completed: !this.state.checked })
      .then((res) => {
        if (!res.status === 202) {
          this.props.getTasks();
        }
      })
      .catch((err) => {
        console.log(err);
        this.props.getTasks();
      })
  }

  handleEdit(event) {
    this.props.updateModal(this.props.task._id);
  }

  render() {
    const label = (this.state.checked? <strike>{this.props.task.name}</strike> : this.props.task.name);

    return (
      <Draggable draggableId={this.props.task._id} index={this.props.index}>
      { (provided) => (
        <ListGroup.Item bsPrefix="list-group-item d-flex justify-content-between" onClick={this.handleEdit} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <Form.Check type="checkbox" checked={this.state.checked} onChange={this.handleCheckChange} onClick={(e) => e.stopPropagation()} label={label}/>
          <span>
            <Badge variant="secondary" onClick={this.handleDelete}>x</Badge>
          </span>
        </ListGroup.Item>
      )}
      </Draggable>
    );
  }
}

export default Task;