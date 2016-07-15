/* eslint-disable */
import React from 'react';

class Signup extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.user) return <h3>Thanks for registering, {this.props.user.name}!</h3>
        return (
            <div>
                <h3>Checkerz Register Form</h3>
                <form>
                    <div className='form-group'>
                        <label>Name</label>
                        <input className='form-control' ref='name' type='text' />
                    </div>
                    <button className='btn btn-primary' onClick={this.props.register}>Register</button>
                </form>
            </div>
        );
    };
}

export default Signup;
