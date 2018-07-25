import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const selectListGroup = ({
    name,
    value,
    error,
    info,
    onChange,
    options
}) => {
    const selectOptions = options.map(option => (
        <option value={option.value} key={option.label} >
            {option.label}
        </option>
    ));
    return (
        <div className="form-group">
            <select
                className={classnames('form-control form-control-lg', {
                    'is-invalid': error
                })}
                name={name}
                value={value}
                onChange={onChange}
            >
                {selectOptions}
            </select>
            {info && <h6 className="form-text text-muted">{info}</h6>}
            {error && <h6 className="isValid-feedback text-danger">{error}</h6>}
        </div >
    );
};

selectListGroup.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    info: PropTypes.string,
    error: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired
};

export default selectListGroup;
