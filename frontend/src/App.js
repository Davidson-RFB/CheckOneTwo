import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import WithLoader from "./Loady.js"
import { GroupAdd, GroupsList, GroupView } from "./Groups.js"
import { LoginForm } from "./Login.js"
import './App.css';
import { postData } from './util.js';

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
          <li>
            <Link to="/add-group">Add Group</Link>
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
        <Route
          path={`/add-group`}
          render={(props) => <GroupAdder {...passProps} {...props} />}
        />
        <Route
          path={`/login/:userId/:token`}
          render={(props) => <LoginSender {...passProps} {...props} />}
        />
        <Route
          path={`/login`}
          render={(props) => <Login {...passProps} {...props} />}
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

class GroupAdder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(group) {
    postData(`groups`, group)
      .then(data => console.log(JSON.stringify(data)))
      .catch(error => console.error(error));
  }

  render() {
    const GroupAddWithLoader = WithLoader(GroupAdd)
    return (
      <GroupAddWithLoader isLoading={this.state.loading} handleSubmit={this.handleSubmit} {...this.props} />
    );
  }
}

class LoginSender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      token: null,
    };
  }

  async componentDidMount() {
    const user = await getData('token', '/v1/users/'+this.props.match.params.userId+'/login?token='+this.props.match.params.token, this)

    window.localStorage.token = this.state.token;
    window.location = '/';
  }

  render() {
    const LoginFormWithLoader = WithLoader(LoginForm)
    return (
      <LoginFormWithLoader isLoading={this.state.loading} handleSubmit={this.handleSubmit} {...this.props} />
    );
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(payload) {
    postData(`users/${payload.email}/send-login-token`, {})
      .then(data => console.log(JSON.stringify(data)))
      .catch(error => console.error(error)); // FIXME handle 404
  }

  render() {
    const LoginFormWithLoader = WithLoader(LoginForm)
    return (
      <LoginFormWithLoader isLoading={this.state.loading} handleSubmit={this.handleSubmit} {...this.props} />
    );
  }
}

export default App;
