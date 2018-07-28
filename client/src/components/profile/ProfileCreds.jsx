import React, { Component } from "react";
import Moment from "react-moment";

export class ProfileCreds extends Component {
  render() {
    const { experience, education } = this.props;
    const timeFormat = "YYYY/MM/DD";

    const expItems = experience.map(exp => (
      <li className="list-group-item" key={exp._id}>
        <h4>{exp.company}</h4>
        <p>
          <Moment format={timeFormat}>{exp.from}</Moment> -
          {exp.to === null ? (' Now') : (<Moment format={timeFormat}>{exp.to}</Moment>)}
        </p>
        <p><strong>Position:</strong>{exp.title}</p>
        <p>
          {exp.location === '' ? null : (<h5><strong>Location: </strong>{exp.location}</h5>)}
        </p>
        <p>
          {exp.description === '' ? null : (<h5><strong>Description: </strong>{exp.description}</h5>)}
        </p>
      </li>
    ))

    const eduItems = education.map(edu => (
      <li className="list-group-item" key={edu._id}>
        <h4>{edu.school}</h4>
        <p>
          <Moment format={timeFormat}>{edu.from}</Moment> -
          {edu.to === null ? (' Now') : (<Moment format={timeFormat}>{edu.to}</Moment>)}
        </p>
        <p><strong>Degree:</strong>{edu.degree}</p>
        <p><strong>Field Of Study:</strong>{edu.fieldofstudy}</p>
        <p>
          {edu.description === '' ? null : (<h5><strong>Description: </strong>{edu.description}</h5>)}
        </p>
      </li>
    ))
    return (
      <div className="row">
        <div className="col-md-6">
          <h3 className="text-center text-info">
            Experience
      </h3>
          {expItems.length > 0 ? (
            <ul className="list-group">{expItems}</ul>
          ) : (
              <p className="text-center">No Experience Listed</p>
            )}
        </div>
        <div className="col-md-6">
          <h3 className="text-center text-info">
            Education</h3>
          {eduItems.length > 0 ? (
            <ul className="list-group">{eduItems}</ul>
          ) : (
              <p className="text-center">No Education Listed</p>
            )}
        </div>
      </div>
    );
  }
}

export default ProfileCreds;
