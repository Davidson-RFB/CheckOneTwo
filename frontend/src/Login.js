import React, { Component } from "react";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loginPayload: {
        email: '',
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.handleSubmit(this.state.loginPayload);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      loginPayload: {
        [name]: value,
      }
    });
  }

  render() {
    return (
      <div>
        <p>You must log in to access this portion of the application.</p>
        <p>Enter your email address below and you will be sent a login URL.</p>
        <form onSubmit={this.handleSubmit}>
          <label>
            Email Address:
            <input
              name="email"
              type="text"
              value={this.state.loginPayload.email}
              onChange={this.handleChange}>
            </input>
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

export {
  LoginForm,
};
