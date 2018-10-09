import React, { Component } from "react";
import { BrowserRouter as Route, Link } from "react-router-dom";

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

class NomineesList extends Component {
  render() {
    return <div>
      <h2>Nominees</h2>

      <List>
        {this.props.nominees.map(nominee => {
          return <Link key={nominee.id} to={`nominees/${nominee.id}`}>
            <ListItem>
              <ListItemText primary={nominee.email} />
            </ListItem>
          </Link>
        })}
      </List>

      <Link to={"/add-nominee"}>
        <Button variant="contained" color="primary">
          Add Nominee
        </Button>
      </Link>

      <Route
        exact
        path={this.props.match.url}
        render={() => <h3>Please select a group.</h3>}
      />
    </div>
  }
}

class NomineeAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      nominee: {
        email: '',
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.handleSubmit(this.state.nominee);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    const nominee = this.state.nominee;
    nominee[name] = value

    this.setState({
      nominee,
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Email:
            <input
              name="email"
              type="text"
              value={this.state.nominee.email}
              onChange={this.handleChange}>
            </input>
          </label>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </div>
    )
  }
}

export {
  NomineesList,
  NomineeAdd,
};
