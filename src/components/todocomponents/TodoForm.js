import React from 'react';
import Button from '@material-ui/core/Button'
import ButtonGroup  from '@material-ui/core/ButtonGroup';

const TodoForm = props => {
    return (
        <form>
            <input
                name= 'todo'
                value={props.value}
                type='text'
                onChange={props.inputChangeHandler}
                placeholder='enter a task' />
            <ButtonGroup disableElevation variant="contained" colour="primary">
                <Button onClick={props.addTask}>Add a task</Button>
            <Button
                onClick={props.removeItems}>Remove Completed</Button>
            </ButtonGroup>
        </form>
    )
}

export default TodoForm;