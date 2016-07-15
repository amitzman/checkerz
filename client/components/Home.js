/* eslint-disable */
import React from 'react';
import Register from './Register';
import StartGame from './StartGame';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: undefined, users: [] };
    this.register = this.register.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    fetch('/users')
    .then(r => r.json())
    .then(j => {
      this.setState({ users: j.users });
    });
}

  register(e) {
    const name = this.refs.register.refs.name.value;
    const that = this;
    const body = JSON.stringify({ name });

    fetch('/users', { method: 'post', body, headers: { 'Content-Type': 'application/json' } })
    .then(function(r) {return r.json(); })
    .then(function(data) {
      if (data.messages) {
        that.setState({ user: undefined });
      }
      else {
        const newUsers = that.state.users;
        newUsers.push(data.user);
        that.setState({ user: data.user, users: newUsers })
      }
    });
    e.preventDefault();
  }

  render() {
    return (
      <div className="row">
        <h1>Checkerz</h1>
        <div className="col-xs-6">
          <Register ref="register" user={this.state.user} register={this.register} />
        </div>
        <div className="col-xs-6">
          <StartGame users={this.state.users} refresh={this.refresh}/>
        </div>
      </div>
    );
  }
}

export default Home;
