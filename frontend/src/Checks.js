import React, { Component } from "react";
import { BrowserRouter as Route, Link } from "react-router-dom";
import moment from "moment"

import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class ChecksList extends Component {
  render() {
    return <div>
      <h2>Checks</h2>

      <List>
        {this.props.checks.map(check => {
          return <Link key={check.id} to={`/checks/${check.id}`}>
            <ListItem>
              <ListItemText primary={moment(check.created_at).fromNow()} secondary={check.submitted_by} />
            </ListItem>
          </Link>
        })}
      </List>

      <Route
        exact
        path={this.props.match.url}
        render={() => <h3>Please select a check.</h3>}
      />
    </div>
  }
}

class CheckView extends Component {
  render() {
    this.props.check.items.sort((a, b) => {
      if (a.status === 'fail' && b.status === 'fail') return 0;
      if (a.status === 'fail') return -1;
      if (a.status === 'pass') return 1;

    });
    return <div>
      <h2>Check on {this.props.site.name} in {this.props.group.name}</h2>
      <h3>{moment(this.props.check.created_at).fromNow()}</h3>
      <h3>By: {this.props.check.submitted_by}</h3>

      <List>
        { (this.props.check.items || []).map(item => {
          return <ListItem>
            <Avatar>
              { item.status === 'fail' ?
                  <Icon color="secondary">report</Icon> :
                  <Icon color="primary">check</Icon>
              }
            </Avatar>
            <ListItemText primary={item.name} secondary={item.notes}/>
          </ListItem>
        })}
      </List>

      <Route
        exact
        path={this.props.match.url}
        render={() => <h3>Please select a check.</h3>}
      />
    </div>
  }
}

export {
  ChecksList,
  CheckView,
};
