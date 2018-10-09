import React, { Component } from "react";
import { BrowserRouter as Route, Link } from "react-router-dom";

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';

class SiteView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checking: false,
      marks: {},
      check: {},
    }
  }

  mark(status, item) {
    const marks = Object.assign({}, this.state.marks);
    marks[item.uuid] = {status: status};

    const check = Object.assign({}, this.state.check);
    check.items = Object.keys(marks).map(k => {
      const mark = marks[k];
      const item = this.props.site.items.reduce((r, i) => {
        if (i.uuid === k) return i;
        return r;
      }, {});
      item.status = mark.status;
      return item;
    });

    this.setState({
      marks,
      check,
    });
  }

  isGood(id) {
    if (!this.state.marks[id]) return false;
    return this.state.marks[id].status === 'pass';
  }

  isMarked(id) {
    return this.state.marks[id];
  }

  async startCheck() {
    const checkMarker = await this.props.startCheck();

    this.setState({
      checking: true,
      checkMarker,
      check: {
        site_id: this.props.site.id,
        submitted_by: window.localStorage.email,
        items: [],
      },
    });
  }

  async abandonCheck() {
    await this.props.abandonCheck(this.state.checkMarker);
  }

  handleNote(item) {
    return (event) => {
      const existingItem = this.state.check.items.reduce((ret, i) => {
        if (i.uuid === item.uuid) {
          return i;
        }
        return ret;
      }, {});
      existingItem.notes = event.target.value;
      const items = this.state.check.items.map(i => {
        if (i.uuid === existingItem.uuid) return existingItem;
        return i;
      });

      const check = this.state.check;
      check.items = items;

      this.setState({
        check,
      });
    }
  }

  render() {
    return (
      <div>
        <h3>{this.props.group.name} - {this.props.site.name}</h3>

        { this.state.checking ?
            null :
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                this.startCheck()
              }}
            >
              Start Check
            </Button>
        }

        <h2>Items:</h2>
        <List>
          { (this.props.site.items || []).map(item => {
            const secondary = <div>
              { this.state.checking ?
                  <div>
                    <Button 
                      variant={
                        this.isMarked(item.uuid) && !this.isGood(item.uuid) ?
                          'contained' : 'text'
                      }
                      color="secondary"
                      size="large"
                      onClick={() => {
                        this.mark('fail', item)
                      }}><Icon>report</Icon></Button>
                    <Button
                      variant={
                        this.isMarked(item.uuid) && this.isGood(item.uuid) ?
                          'contained' : 'text'
                      }
                      color="primary"
                      size="large"
                      onClick={() => {
                        this.mark('pass', item)
                      }}><Icon>check</Icon></Button>

                    <br />
                    {
                      this.isMarked(item.uuid) && !this.isGood(item.uuid) ?
                        <TextField
                          id={`${item.uuid}-notes`}
                          label="What's wrong?"
                          value={item.notes}
                          onChange={this.handleNote(item, 'name')}
                          margin="normal"
                        /> : null
                    }
                  </div>
                  : null }
                </div>
              return <ListItem>
                <ListItemText primary={item.name} secondary={secondary}/>
              </ListItem>
          }) }
        </List>
        { this.state.checking ?
            null :
            <Link to={"/add-item/"+this.props.site.id}>
              <Button
                variant="contained"
                color="primary"
              >
                Add Item
              </Button>
            </Link>
        }
        { this.state.checking ?
            <Button 
              variant="contained"
              color="primary"
              onClick={() => {
                const complete = this.props.site.items.reduce((ret, item) => {
                  if (!ret) return ret;
                  if (!this.state.marks[item.uuid]) return false;

                  return ret;
                }, true);
                if (!complete) {
                  alert('You must mark all items as pass or fail before submitting the check');
                } else {
                  this.props.submitCheck(true, this.state.check);
                }
              }}>Finish Check</Button>
            : null
        }
        { this.state.checking ?
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                this.abandonCheck();
              }}>Abandon Check</Button>
            : null
        }
      </div>
    );
  }
}

class SiteAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      site: {
        group_id: props.groupId,
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.handleSubmit(this.state.site);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    const site = this.state.site;
    site[name] = value

    this.setState({
      site,
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
              value={this.state.site.name}
              onChange={this.handleChange}>
            </input>
          </label>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={() => {
              this.startCheck()
            }}
          >
            Submit
          </Button>
        </form>
      </div>
    )
  }
}

class ItemAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      site: props.site,
      item: {},
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.handleSubmit(this.state.item);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    const item = this.state.item;
    item[name] = value

    this.setState({
      item,
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
              value={this.state.item.name}
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
  SiteAdd,
  SiteView,
  ItemAdd,
};
