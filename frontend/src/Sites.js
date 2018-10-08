import React, { Component } from "react";
import { BrowserRouter as Route, Link } from "react-router-dom";

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
    console.log('DEBUG this.state', this.state);
    await this.props.abandonCheck(this.state.checkMarker);
  }

  render() {
    return (
      <div>
        <h3>{this.props.group.name} - {this.props.site.name}</h3>

        { this.state.checking ?
            null :
            <button 
              onClick={() => {
                this.startCheck()
              }}>Start Check</button>
        }

        <h2>Items:</h2>
        { (this.props.site.items || []).map(item => {
          return <div>
            <p>{item.name}</p>
            { this.state.checking ?
                <div>
                  <button 
                    style={{
                      'border-style': 
                      this.isMarked(item.uuid) && this.isGood(item.uuid) ?
                      "inset" : ""
                    }}
                    onClick={() => {
                      this.mark('pass', item)
                    }}>Good</button>
                  <button 
                    style={{
                      'border-style': 
                      this.isMarked(item.uuid) && !this.isGood(item.uuid) ?
                      "inset" : ""
                    }}
                    onClick={() => {
                      this.mark('fail', item)
                    }}>Bad</button>
                </div>
                : null }
          </div>
        }) }
        { this.state.checking ?
            null :
            <Link to={"/add-item/"+this.props.site.id}>Add Item</Link>
        }
        { this.state.checking ?
            <button 
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
              }}>Finish Check</button>
            : null
        }
        { this.state.checking ?
            <button 
              onClick={() => {
                this.abandonCheck();
              }}>Abandon Check</button>
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
          <input type="submit" value="Submit" />
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
