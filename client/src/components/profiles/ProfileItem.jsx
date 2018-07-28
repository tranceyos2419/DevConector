import React, { Component } from "react";
import PropTypes from "prop-types";
import isEmpty from "../../validation/is-empty";
import { Link } from "react-router-dom";

export class ProfileItem extends Component {
  render() {
    const profile = this.props.profile;
    return (
      <div className="card card-body bg-light mb-3">
        <div className="row">
          <div className="col-2">
            <img src={profile.user.avatar} className="rounded-circle" />
          </div>
          <div className="col-lg-6 col-md-4 col-8">
            <h3>{profile.user.name}</h3>
            <h5>
              {profile.status}{" "}
              {isEmpty(profile.company) ? null : <h5>at {profile.company} </h5>}
            </h5>
            <p>
              {isEmpty(profile.location) ? null : <h5>{profile.location}</h5>}
            </p>
            <Link to={`/profile/${profile.handle}`} className="btn btn-info">
              {" "}
              View Profile
            </Link>
          </div>
          <div className="col-md-4 d-none d-md-block">
            <h4>Skill Set</h4>
            <ul className="list-group">
              {profile.skills.slice(0, 4).map((skill, index) => (
                <li key={index} className="list-group-item">
                  <h5>
                    <i className="fa fa-check pr-1" />
                    {skill}
                  </h5>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;
