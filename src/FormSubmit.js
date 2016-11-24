const React = require('react')

class FormSubmit extends React.Component {
  render () {
    return (
      <div>
        <button type="submit">
          {this.props.children}
        </button>
      </div>
    )
  }
}

FormSubmit.propTypes = {
  children: React.PropTypes.node
}

module.exports = FormSubmit
