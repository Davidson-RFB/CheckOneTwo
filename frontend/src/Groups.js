import React, { Component } from "react";
import { BrowserRouter as Route, Link } from "react-router-dom";
import moment from "moment"

class GroupsList extends Component {
  render() {
    return <div>
      <h2>Groups</h2>

      <ul>
        {this.props.groups.map(group => {
        return <li key={group.id}>
          <Link to={`${this.props.match.url}/${group.id}`}>{group.name}</Link> - Last Checked: {moment(group.last_checked_at).fromNow()}
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
    const markersBySite = this.props.markers.reduce((ret, marker) => {
      ret[marker.site_id] = marker;
      return ret;
    }, {});

    const isInProg = site => !!markersBySite[site.id];

    return (
      <div>
        <h3>{this.props.group.name}</h3>
        <h2>Sites:</h2>
        { this.props.sites.map(site => {
          return <div>
            <Link to={"/sites/"+site.id}>{site.name}
            </Link>{isInProg(site) ? <span> {markersBySite[site.id].submitted_by} is checking now, started {moment(markersBySite[site.id].created_at).fromNow()} -</span> : null} Last Checked: {moment(site.last_checked_at).fromNow()} - By {site.last_checked_by}
          </div>
        }) }
        <Link to={"/add-site/"+this.props.group.id}>Add Site</Link>
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

    const group = this.state.group;
    group[name] = value

    this.setState({
      group,
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
