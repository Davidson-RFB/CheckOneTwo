import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import WithLoader from "./Loady.js"
import { GroupAdd, GroupsList, GroupView } from "./Groups.js"
import { NomineesList, NomineeAdd } from "./Nominees.js"
import { ChecksList, CheckView } from "./Checks.js"
import { SiteView, SiteAdd, ItemAdd, ItemHistoryView } from "./Sites.js"
import { LoginForm } from "./Login.js"
import './App.css';
import { postData, deleteData } from './util.js';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Grid from '@material-ui/core/Grid';

if (!window.localStorage.email) {
  const email = prompt("Oh hi! What's your email address?");
  window.localStorage.email = email;
  window.location.reload();
}

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

  return response.data;
};

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuLink: {
    color: 'white',
    'text-decoration': 'none',
  },
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

    const { classes } = this.props;

    return (<Router>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.flex}>
              <Link className={classes.menuLink} to="/">Home</Link>
            </Typography>
            <Typography variant="title" color="inherit" className={classes.flex}>
              <Link className={classes.menuLink} to="/groups">Groups</Link>
            </Typography>
            <Typography variant="title" color="inherit" className={classes.flex}>
              <Link className={classes.menuLink} to="/nominees">Nominees</Link>
            </Typography>
          </Toolbar>
        </AppBar>

        <hr />

        <Grid
          container
          direction="row"
          justify="space-evenly"
          alignItems="flex-start"
        >

        <Route
          exact
          path="/"
          render={(props) => <Welcome {...passProps} {...props} />}
        />
        <Route 
          exact
          path="/groups"
          render={(props) => <Groups {...passProps} {...props} />}
        />
        <Route 
          exact
          path="/nominees"
          render={(props) => <Nominees {...passProps} {...props} />}
        />
        <Route 
          exact
          path="/add-nominee"
          render={(props) => <NomineeAdder {...passProps} {...props} />}
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
          path={`/checks-by-site/:siteId`}
          render={(props) => <Checks {...passProps} {...props} />}
        />
        <Route
          path={`/checks/:checkId`}
          render={(props) => <Check {...passProps} {...props} />}
        />
        <Route
          path={`/sites/:siteId`}
          render={(props) => <Site {...passProps} {...props} />}
        />
        <Route
          path={`/add-site/:groupId`}
          render={(props) => <SiteAdder {...passProps} {...props} />}
        />
        <Route
          path={`/add-item/:siteId`}
          render={(props) => <ItemAdder {...passProps} {...props} />}
        />
        <Route
          path={`/item-history/:siteId/:itemId`}
          render={(props) => <ItemHistory {...passProps} {...props} />}
        />
        <Route
          path={`/login/:userId/:token`}
          render={(props) => <LoginSender {...passProps} {...props} />}
        />
        <Route
          path={`/login`}
          render={(props) => <Login {...passProps} {...props} />}
        />
      </Grid>
      </div>
    </Router>
    )
  }
};

class Welcome extends Component {
  render() {
    return <div>
      <h2>Check One Two</h2>
      <p>Hi! Welcome to Davidson RFB's checklist application.</p>
      <p>This has been built to make running the weekly duty crew checklists faster and more efficient for everyone.</p>
      <p>It should mean you spend less time in the shed and more time in the field with complete, working equipment.</p>
      <Link to="/groups">
        <Button
          variant="contained"
          color="primary"
        >
          Get Started
        </Button>
      </Link>
    </div>
  }
}

class Nominees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nominees: [],
      loading: true,
    };
  }

  async componentDidMount() {
    await getData('nominees', '/v1/nominees', this);
  }

  render() {
    const ListWithLoader = WithLoader(NomineesList)
    return (
      <ListWithLoader isLoading={this.state.loading} nominees={this.state.nominees} {...this.props} />
    );
  }
};

class NomineeAdder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(nominee) {
    postData(`nominees`, nominee)
      .then(data => {
        this.props.history.push(`/nominees`);
        if (data.error) this.props.errorHandler(data.error);
      })
      .catch(error => {
        console.error(error)
        this.props.errorHandler(error.toString());
      });
  }

  render() {
    const AddWithLoader = WithLoader(NomineeAdd)
    return (
      <AddWithLoader isLoading={this.state.loading} handleSubmit={this.handleSubmit} {...this.props} />
    );
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
      group: {},
      sites: [],
      markers: [],
    };
  }

  async componentDidMount() {
    await getData('group', '/v1/groups/'+this.props.match.params.groupId, this)
    await getData('sites', '/v1/sites?by_group='+this.props.match.params.groupId, this)
    await getData('markers', '/v1/markers?by_group='+this.props.match.params.groupId, this)
  }

  render() {
    const GroupWithLoader = WithLoader(GroupView)
    return (
      <GroupWithLoader
        isLoading={this.state.loading}
        group={this.state.group}
        sites={this.state.sites}
        markers={this.state.markers}
        {...this.props} />
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
      .then(data => {
        this.props.history.push(`/groups/${data.id}`);
      })
      .catch(error => console.error(error));
  }

  render() {
    const GroupAddWithLoader = WithLoader(GroupAdd)
    return (
      <GroupAddWithLoader isLoading={this.state.loading} handleSubmit={this.handleSubmit} {...this.props} />
    );
  }
}

class Checks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checks: [],
      loading: true,
    };
  }

  async componentDidMount() {
    await getData('checks', `/v1/checks?per_page=100&page=1&by_site=${this.props.match.params.siteId}`, this);
  }

  render() {
    const ListWithLoader = WithLoader(ChecksList)
    return (
      <ListWithLoader isLoading={this.state.loading} checks={this.state.checks} {...this.props} />
    );
  }
};

class Check extends Component {
  constructor(props) {
    super(props);
    this.state = {
      check: {},
      site: {},
      group: {},
      loading: true,
    };
  }

  async componentDidMount() {
    const check = await getData('check', `/v1/checks/${this.props.match.params.checkId}`, this);
    const site = await getData('site', `/v1/sites/${check.site_id}`, this);
    await getData('group', `/v1/groups/${site.group_id}`, this);
  }

  render() {
    const ComponentWithLoader = WithLoader(CheckView)
    return (
      <ComponentWithLoader
        isLoading={this.state.loading}
        check={this.state.check}
        site={this.state.site}
        group={this.state.group}
        {...this.props} />
    );
  }
}

class Site extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      group: {},
      site: {},
    };
  }

  async componentDidMount() {
    const site = await getData('site', '/v1/sites/'+this.props.match.params.siteId, this)
    await getData('group', '/v1/groups/'+site.group_id, this)
  }

  async submitCheck(final, check) {
    this.state.loading = true;

    await postData('checks', check)
    this.props.history.push(`/groups/${this.state.site.group_id}`);
  }

  async startCheck() {
    this.state.loading = true;

    try {
      const marker = await postData('markers', {
        site_id: this.props.match.params.siteId,
        submitted_by: window.localStorage.email,
      });

      return marker;

    } catch (e) {
      this.props.errorHandler(e.toString());
    }
  }

  async abandonCheck(marker) {
    this.state.loading = true;

    try {
      await deleteData(`markers/${marker.id}`);
      this.props.history.push(`/groups/${this.state.site.group_id}`);
    } catch (e) {
      this.props.errorHandler(e.toString());
    }
  }

  async deleteItem(targetItem) {
    this.state.loading = true;

    try {
      const site = this.state.site;
      site.items = site.items.filter(item => item.uuid !== targetItem.uuid);
      const newSite = await postData(`sites/${site.id}`, site);
      if (newSite.error) this.props.errorHandler(newSite.error);
      this.setState({
        loading: false,
        site: newSite,
      });
    } catch (error) {
      console.error(error)
      this.props.errorHandler(error.toString());
    }
  }

  render() {
    const SiteWithLoader = WithLoader(SiteView)
    return (
      <SiteWithLoader
        isLoading={this.state.loading}
        group={this.state.group}
        site={this.state.site}
        submitCheck={this.submitCheck.bind(this)}
        startCheck={this.startCheck.bind(this)}
        abandonCheck={this.abandonCheck.bind(this)}
        deleteItem={this.deleteItem.bind(this)}
        {...this.props} />
    );
  }
};

class SiteAdder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(site) {
    postData(`sites`, site)
      .then(data => {
        this.props.history.push(`/groups/${this.props.match.params.groupId}`);
      })
      .catch(error => console.error(error));
  }

  render() {
    const SiteAddWithLoader = WithLoader(SiteAdd)
    return (
      <SiteAddWithLoader groupId={this.props.match.params.groupId} isLoading={this.state.loading} handleSubmit={this.handleSubmit} {...this.props} />
    );
  }
}

class ItemAdder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      site: {},
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    await getData('site', '/v1/sites/'+this.props.match.params.siteId, this)
  }

  handleSubmit(item) {
    const site = this.state.site;
    site.items.push(item);
    postData(`sites/${this.state.site.id}`, site)
      .then(data => {
        this.props.history.push(`/sites/${this.props.match.params.siteId}`);
      })
      .catch(error => console.error(error));
  }

  render() {
    const ItemAddWithLoader = WithLoader(ItemAdd)
    return (
      <ItemAddWithLoader site={this.state.site} isLoading={this.state.loading} handleSubmit={this.handleSubmit} {...this.props} />
    );
  }
}

class ItemHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      history: {
        site: {},
        checks: [],
      },
      group: {},
      itemName: '',
    };
  }

  async componentDidMount() {
    const history = await getData('history', `/v1/sites/${this.props.match.params.siteId}/item-history/${this.props.match.params.itemId}?per_page=100&page=1`, this);
    this.setState({
      itemName: history.checks[0].items[0].name,
    });
    await getData('group', '/v1/groups/'+history.site.group_id, this);
  }

  render() {
    const WithLoaderComponent = WithLoader(ItemHistoryView)
    return (
      <WithLoaderComponent
        site={this.state.history.site}
        checks={this.state.history.checks}
        group={this.state.group}
        itemName={this.state.itemName}
        isLoading={this.state.loading}
      {...this.props} />
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
    await getData('token', '/v1/users/'+this.props.match.params.userId+'/login?token='+this.props.match.params.token, this)

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
      .then(data => {
        console.log(JSON.stringify(data))
        if (data.error) this.props.errorHandler(data.error);
      })
      .catch(error => {
        console.error(error)
        this.props.errorHandler(error.toString());
      });
  }

  render() {
    const LoginFormWithLoader = WithLoader(LoginForm)
    return (
      <LoginFormWithLoader isLoading={this.state.loading} handleSubmit={this.handleSubmit} {...this.props} />
    );
  }
}

export default withStyles(styles)(App);
