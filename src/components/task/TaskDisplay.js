import React, {Component} from 'react';
import Day from './Day.js';
import TaskModal from './TaskModal';
import axios from 'axios';
import {DragDropContext} from 'react-beautiful-dnd';

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
    this.onDragEnd = this.onDragEnd.bind(this);

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

  onDragEnd(result) {
    console.log(result);

    if (!result.destination || (result.source.droppableId === result.destination.droppableId &&
                                      result.source.index === result.destination.index) )
      return;

    const task = result.draggableId;
    const day_ids = this.state.tasks.map( (day) => (day.day_id));
    const col1 = day_ids.findIndex((id) => id === result.source.droppableId);
    const col2 = day_ids.findIndex((id) => id === result.destination.droppableId);

    if (result.source.droppableId === result.destination.droppableId) {
      const task_ids = this.state.tasks[col1].task_ids;
      task_ids.splice(result.source.index, 1);
      task_ids.splice(result.destination.index, 0, task);

      //optimistic update
      const tasks = this.state.tasks[col1].tasks;
      const toCopy = tasks[result.source.index];
      tasks.splice(result.source.index, 1);
      tasks.splice(result.destination.index, 0, toCopy);
      const taskDays = this.state.tasks;
      taskDays[col1].tasks = tasks;
      taskDays[col1].task_ids = task_ids;
      this.setState({ tasks: taskDays});

      axios.post('/day/'+result.source.droppableId, { task_ids: task_ids })
        .then( (res) => {
          this.getTasks();
        })
        .catch( (err) => {
          console.log(err);
        })
    } else {
      const task_ids1 = Array.from(this.state.tasks[col1].task_ids);
      const task_ids2 = Array.from(this.state.tasks[col2].task_ids);

      task_ids1.splice(result.source.index, 1); //delete 1 element starting at index
      task_ids2.splice(result.destination.index, 0, task);

      //optimistic update
      const tasks1 = Array.from(this.state.tasks[col1].tasks);
      const tasks2 = Array.from(this.state.tasks[col2].tasks);

      const toCopy = tasks1[result.source.index];
      tasks1.splice(result.source.index, 1); //delete 1 element starting at index
      tasks2.splice(result.destination.index, 0, toCopy);

      const taskDays = this.state.tasks;
      taskDays[col1].tasks = tasks1;
      taskDays[col2].tasks = tasks2;
      this.setState({ tasks: taskDays});

      axios.post('/day/'+result.source.droppableId, { task_ids: task_ids1 })
        .then( (res) => {
          axios.post('/day/'+result.destination.droppableId, { task_ids: task_ids2 })
            .then( (res) => {
              this.getTasks();
            })
            .catch( (err) => {
              console.log(err);
            })
        })
        .catch( (err) => {
          console.log(err);
        })
    }
  }

  render() {
    if (!this.state.tasks) return (<div> Loading... </div>)

    return (
      <Container fluid>
        <Row>
          <DragDropContext onDragEnd={this.onDragEnd}>
            {this.state.tasks.map( (day, index) => { return <Day day={day} key={day.day_id} getTasks={this.getTasks} updateModal={this.updateModal} />; })}
          </DragDropContext>
        </Row>
      <TaskModal ref={this.taskModalElement} task={this.state.modalTask} updateModal={this.updateModal} getTasks={this.getTasks}/>
      </Container>
    );
  }
};

export default TaskDisplay;