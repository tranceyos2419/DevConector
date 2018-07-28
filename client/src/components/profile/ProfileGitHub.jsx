import React, { Component } from "react";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


export class ProfileGitHub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientID: 'c4f0c7d5f4c4fbf5bbc0',
      clientSecret: '9c6c00e819582476f55cda6b02f9bb8fd683e52e',
      count: 5,
      sort: 'created: asc',
      repos: []
    }
  }
  componentDidMount() {
    const { username } = this.props;
    const { count, sort, clientId, clientSecret } = this.state;

    fetch(`https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`)
      .then(res => res.json())
      .then(data => {
        if (this.refs.myRef) {
          this.setState({ repos: data });
        }
      })
      .catch(err => console.log(err))
  }
  render() {
    const { repos } = this.state;

    const repoItems = repos.map(repo => (
      <div className="card card-body mb-2" key={repo.id}>
        <div className="row">
          <div className="col-md-6">
            <h4>
              <Link to={repo.html_url} className="text-info" target="_blank">
                {repo.name}
              </Link>
            </h4>
            <p>{repo.description}</p>
          </div>
          <div className="col-md-6">
            <h5 className="badge badge-info mr-1">
              Starts: {repo.stargazers_count}
            </h5>
            <h5 className="badge badge-secondary mr-1">
              Watchers: {repo.watchers_count}
            </h5>
            <h5 className="badge badge-success">
              Forks: {repo.forks_count}
            </h5>
          </div>
        </div>
      </div>
    ))
    return (
      <div ref="myRef">
        <hr />
        <h3 className="mb-4">
          Latest Github Repos
        </h3>
        {repoItems}
      </div>
    );
  }
}

ProfileGitHub.propTypes = {
  username: PropTypes.string.isRequired
}

export default ProfileGitHub;
