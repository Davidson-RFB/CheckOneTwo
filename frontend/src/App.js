import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import WithLoader from "./Loady.js"
import { GroupsList, GroupView } from "./Groups.js"
import './App.css';

const getData = async (key, path, _this) => {
  _this.setState({
    loading: true,
  });

  const response = await _this.props.fetch(path);

  if (response.error) {
    _this.props.errorHandler(response.error);
  };

  const newState = {
    loading: false,
  };

  if (response.data) {
    newState[key] = response.data;
  }

  _this.setState(newState);
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
    };
  }

  render() {
    const errorHandler = (message) => {
      const errors = this.state.errors || [];
      errors.push(message);
      this.setState({
        errors,
      });
    };

    const passProps = Object.assign(
      {
        errorHandler,
      },
      this.props,
    );

    if (this.state.errors.length > 0) {
      return (<div>
        {this.state.errors.map((error, i) => <div key={i}>Error!: {error}</div>)}
        <button onClick={() => window.location = window.location}>Reload</button>
      </div>)
    }

    return (<Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/groups">Groups</Link>
          </li>
        </ul>

        <hr />

        <Route 
          exact
          path="/groups"
          render={(props) => <Groups {...passProps} {...props} />}
        />
        <Route
          path={`/groups/:groupId`}
          render={(props) => <Group {...passProps} {...props} />}
        />
      </div>
    </Router>
    )
  }
};

class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      loading: true,
    };
  }

  async componentDidMount() {
    await getData('groups', '/v1/groups', this);
  }

  render() {
    const ListWithLoader = WithLoader(GroupsList)
    return (
      <ListWithLoader isLoading={this.state.loading} groups={this.state.groups} {...this.props} />
    );
  }
};

class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      groups: {},
    };
  }

  async componentDidMount() {
    await getData('group', '/v1/groups/'+this.props.match.params.groupId, this)
  }

  render() {
    const GroupWithLoader = WithLoader(GroupView)
    return (
      <GroupWithLoader isLoading={this.state.loading} group={this.state.group} {...this.props} />
    );
  }
};

export default App;
