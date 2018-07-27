import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { deleteExperience } from "../../actions/profileActions";

class Experience extends Component {
  // _renderObj() {
  //   return this.props.experience.map(exp => {
  //     return (
  //       <tr key={exp._id}>
  //         <td>{exp.company}</td>
  //         <td>{exp.title}</td>
  //         <td>
  //           {exp.from} - {exp.to}{" "}
  //         </td>
  //         <td>
  //           <button className="btn btn-danger">Delete</button>
  //         </td>
  //       </tr>
  //     );
  //   });
  // }

  onDeleteClick(id) {
    this.props.deleteExperience(id);
  }

  render() {
    //* Original code
    const experience = this.props.experience.map(exp => {
      <tr key={exp._id}>
        <td>{exp.company}</td>
        <td>{exp.title}</td>
        <td>
          <Moment format="YYYY/MM/DD">{exp.from}</Moment> -
          {exp.to === null ? (
            " Now"
          ) : (
            <Moment format="YYYY/MM/DD">{exp.from}</Moment>
          )}
        </td>
        <td>
          <button
            className="btn btn-danger"
            onClick={this.onDeleteClick.bind(this, exp._id)}
          >
            Delete
          </button>
        </td>
      </tr>;
    });

    const test = (
      <tr>
        <td>Test</td>
        <td>test 2</td>
        <td>test 3</td>
      </tr>
    );

    // carray1.forEach(function(element) {
    //   console.log(element);
    // });

    return (
      <div>
        <h4 className="mb-4">Experience Credentials</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Title</th>
              <th>Years</th>
              <th />
            </tr>
            {test}
          </thead>
        </table>
      </div>
    );
  }
}

Experience.propTypes = {
  deleteExperience: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteExperience }
)(Experience);
