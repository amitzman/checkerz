/* eslint-disable */

import React from 'react';
import Nav from './Nav';
import StartGame from './StartGame';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: undefined, users: [] };
  }

  componentDidMount() {
    fetch('/users')
    .then(r => r.json())
    .then(j => {
      this.setState({ users: j.users });
    });
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <Nav />

        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <StartGame users={this.state.users} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
