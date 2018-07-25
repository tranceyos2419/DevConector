import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const TextFieldGroup = ({
    name,
    placeholder,
    value,
    label,
    error,
    info,
    type,
    onChange,
    disabled
}) => {
    return (
        <div class="form-group">
            <input
                type={type}
                className={classnames('form-control form-control-lg', { 'is-invalid': error })} placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled} />
            {info && <h6 className='form-text text-muted'>{info}</h6>}
            {error && <h6 className='isValid-feedback text-danger'>{error}</h6>}
        </div>
    )
}

TextFieldGroup.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    info: PropTypes.string,
    error: PropTypes.string,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.string
}

TextFieldGroup.defaultProps = {
    type: 'text'
}

export default TextFieldGroup;
