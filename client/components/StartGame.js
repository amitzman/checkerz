/* eslint-disable */
import React from 'react';

class StartGame extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        <h1>Start Game</h1>
        <form method='post' action='/games'>
          <div className='form-group'>
            <label>Player 1:</label>
            <select name='player1' className='form-control' ref='user'>
              {this.props.users.map((user, index) => <option value={user._id} key={index}>{user.name}</option>)}
            </select>
          </div>
          <div className='form-group'>
            <label>Player 2:</label>
            <select name='player2' className='form-control' ref='user'>
              {this.props.users.map((user, index) => <option value={user._id} key={index}>{user.name}</option>)}
            </select>
          </div>
          <button type='submit' className='btn btn-primary'>Start Game</button>
        </form>
      </div>
    );
  }
}

export default StartGame;
