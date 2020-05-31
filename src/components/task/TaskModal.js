import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class TaskModal extends Component {
  constructor() {
    super();

    this.state = {
      name: null,
    }

    this.updateForm = this.updateForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  updateForm() {
    console.log('updateForm');
    this.setState({ name: this.props.task.name });
    console.log(this.state.name);
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
    console.log('send post with new name: '+this.state.name);
    //TO DO: send axios.post with new name
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