import React, { Component } from 'react';
import axios from 'axios';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class TaskModal extends Component {
  constructor() {
    super();

    this.state = {
      name: null,
      date: null,
    }

    this.updateForm = this.updateForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  updateForm() {
    this.setState({ name: this.props.task.name , date: this.props.task.date.split('T')[0]});
  }

  handleCloseModal() {
    this.props.updateModal(null);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    axios.post('/task/'+this.props.task._id, { name: this.state.name, date: this.state.date+'T00:00:00.000Z' })
      .then((res) => {
        this.props.getTasks();
        this.handleCloseModal();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  render() {
    return (
      <Modal show={this.props.task !== null} onHide={this.handleCloseModal} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form>
            <Form.Label>Task Name</Form.Label>
            <Form.Control type="text" name="name" value={this.state.name || ''} onChange={this.handleChange} autoComplete="off" />

            <Form.Label>Date</Form.Label>
            <Form.Control type="date" name="date" value={this.state.date || ''} onChange={this.handleChange}/>
          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={this.handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      );
  }
}

export default TaskModal;