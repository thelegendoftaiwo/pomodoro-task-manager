import React, { Component} from 'react';
import TodoList from './components/todocomponents/TodoList';
import TodoForm from './components/todocomponents/TodoForm';
import Pomodoro from './components/timer-components/pomodoro';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      todos: [{
        //tasks: "",
        //id: "",
        //completed: false
      }],
      todo: '', 
      restMinutes: 5,
      workMinutes: 25,
      seconds: 0,
      break: false,
      start: false,
      interval:''
    }
  }

  componentDidMount() {
    this.addLocalStorage();
    window.addEventListener(
      "beforeunload",
      this.saveLocalStorage.bind(this)
    )
  }

  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.saveLocalStorage.bind(this)
    )
  }

  addLocalStorage(){
    for (let key in this.state){
      if (localStorage.hasOwnProperty(key)){
        let value = localStorage.getItem(key);
        try {
          value = JSON.parse(value);
          this.setState({[key]: value})
        }
        catch(event) {
          this.setState({[key]: value})
        }
      }
    }
  }

  saveLocalStorage (){
    for (let key in this.state) {
      localStorage.setItem(key, JSON.stringify(this.state[key]))
    }
  }

  toggleComplete = itemId => {
    const todos  = this.state.todos.map(todo => {
      if (todo.id === itemId) {
        todo.completed =!todo.completed
      }
      return todo
    });
    this.setState({todos, todo:""})
  }


  inputChangeHandler = event => {
    this.setState({[event.target.name]: event.target.value})
  }


  addTask = event => {
    event.preventDefault();
    let newTask = {
      task: this.state.todo,
      id: Date.now(),
      completed: false
    };
    this.setState({
      todos: [...this.state.todos, newTask],
      todo: ""
    })
  }

  removeItems = event => {
    event.preventDefault();
    this.setState(prevState => {
      return {
        todos: prevState.todos.filter(todo => {
          return !todo.completed;
        })
      }
    })
  }

  timer = () => {
    this.setState({
      seconds: this.state.seconds === 0 ? 59 : this.state.seconds - 1
    })

    if (this.state.break) {
      this.setState ({restMinutes: this.state.seconds === 0 ?
      this.state.restMinutes-1: this.state.restMinutes === 5 ? 4:
      this.state.restMinutes})
    }

    if (this.state.restMinutes === -1 ) {
      this.setState({restMinutes: 5, break: false})
    }

    else {
      this.setState({workMinutes: this.state.seconds === 0 ?
      this.state.workMinutes - 1 : this.state.workMinutes === 25 ? 24 :
      this.state.workMinutes})

      if (this.state.workMinutes === -1) {
        this.setState({workMinutes: 25, break: true})
      }
    }
  }

  startTimer = () => {
    this.setState({interval: setInterval(this.timer, 1000), start:
    !this.state.start});
  }

  pauseTimer = () => {
    this.setState(prevState => {
      return {
        restMinutes: prevState.restMinutes,
        workMinutes: prevState.workMinutes,
        seconds: prevState.seconds,
        break: prevState.break,
        start: false,
        interval: clearInterval(prevState.interval)
      };
    })
  }

  render (){
    return (
      <Container maxWidth="sm">
        <Typography component="div">
          <Box textAlign='center' fontSize="h3.fontSize" m={1} >Pomodoro Tasker</Box>
          <TodoList
            todos={this.state.todos}
            toggleComplete={this.toggleComplete} />
          <TodoForm
            todos={this.state.todos}
            value={this.state.todo}
            inputChangeHandler={this.inputChangeHandler}
            addTask={this.addTask} 
            removeItems={this.removeItems} />
          <Box textAlign='center'>
          <Pomodoro 
            timer = {this.timer}
            workMinutes = {this.state.workMinutes}
            restMinutes = {this.state.restMinutes}
            seconds = {this.state.seconds}
            start = {this.state.start}
            break = {this.state.break}
            startTimer = {this.startTimer}
            pauseTimer = {this.pauseTimer}/>
          </Box>  
        </Typography>
      </Container>
    );
  }
}

export default App;
