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
        <form>
          <div className='form-group'>
            <label>Player 1:</label>
            <select className='form-control' ref='user'>
              {this.props.users.map((user, index) => <option key={index}>{user.name}</option>)}
            </select>
          </div>
          <div className='form-group'>
            <label>Player 2:</label>
            <select className='form-control' ref='user'>
              {this.props.users.map((user, index) => <option key={index}>{user.name}</option>)}
            </select>
          </div>
          <button className='btn btn-primary'>Start Game</button>
        </form>
      </div>
    );
  }
}

export default StartGame;
