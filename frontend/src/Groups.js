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
      </div>
    );
  }
}

export {
  GroupView,
  GroupsList,
};
