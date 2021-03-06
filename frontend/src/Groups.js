import React, { Component } from "react";
import { BrowserRouter as Route, Link } from "react-router-dom";
import moment from "moment"

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Grid from '@material-ui/core/Grid';

class GroupsList extends Component {
  render() {
    this.props.groups.sort((a, b) => a.last_checked_at > b.last_checked_at);
    return <div>
      <h2>Groups</h2>

      <List>
        {this.props.groups.map(group => {
          return <Link key={group.id} to={`${this.props.match.url}/${group.id}`}>
            <ListItem>
              <ListItemText primary={group.name} secondary={"Last Checked: "+moment(group.last_checked_at).fromNow()} />
              <Button
                variant="contained"
                color="primary"
              >
                  Check Now
              </Button>
            </ListItem>
          </Link>
        })}
      </List>

      <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="flex-start"
      >
        <Link to={"/add-group"}>
          <Button
            variant="contained"
            color="primary"
          >
            Add Group
          </Button>
        </Link>
      </Grid>

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
    this.props.sites.sort((a, b) => a.last_checked_at > b.last_checked_at);
    const markersBySite = this.props.markers.reduce((ret, marker) => {
      ret[marker.site_id] = marker;
      return ret;
    }, {});

    const isInProg = site => !!markersBySite[site.id];

    return (
      <div>
        <h3>{this.props.group.name}</h3>
        <h2>Sites:</h2>

        <List>
          { this.props.sites.map(site => {
            const statusElems = [];

            if (isInProg(site)) {
              statusElems.push(`${markersBySite[site.id].submitted_by} is checking now, started ${moment(markersBySite[site.id].created_at).fromNow()}`);
            }

            statusElems.push(`Last Checked: ${moment(site.last_checked_at).fromNow()}`);
            statusElems.push(`By ${site.last_checked_by}`);

            const secondary = <div>
              {statusElems.map(line => <p>{line}</p>)}
            </div>

              return <div>
                <Link key={site.id} to={`/sites/${site.id}`}>
                  <ListItem>
                    <ListItemText primary={site.name} secondary={secondary} />
                    <ListItemSecondaryAction>
                      <Link to={`/checks-by-site/${site.id}`}>
                        <Icon>history</Icon>
                      </Link>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Link>

              </div>
          }) }
        </List>

        <Link to={"/add-site/"+this.props.group.id}>
          <Button variant="contained" color="primary">
            Add Site
          </Button>
        </Link>
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
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
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
