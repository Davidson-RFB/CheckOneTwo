import React, { Component } from "react";
import { BrowserRouter as Route, Link } from "react-router-dom";

class GroupsList extends Component {
  render() {
    return <div>
      <h2>Groups</h2>

      <ul>
        {this.props.groups.map(group => {
        return <li key={group.id}>
          <Link to={`${this.props.match.url}/${group.id}`}>{group.name}</Link>
        </li>
        })}
      </ul>

      <Route
        exact
        path={this.props.match.url}
        render={() => <h3>Please select a group.</h3>}
      />
    </div>
  }
}

class GroupView extends Component {
  render() {
    return (
      <div>
        <h3>{this.props.group.name}</h3>
        <textarea>{JSON.stringify(this.props.group, null, 2)}</textarea>
      </div>
    );
  }
}

class GroupAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      group: {
        name: '',
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.handleSubmit(this.state.group);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      group: {
        [name]: value,
      }
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input
              name="name"
              type="text"
              value={this.state.group.name}
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
  GroupAdd,
  GroupView,
  GroupsList,
};
