const React = require('react')

class Form extends React.Component {
  getChildContext () {
    const getField = fieldName => this.props.entry.fields[fieldName]
    const validate = (field, value) => this.props.form.validate(field, value)

    return { form: { getField, validate } }
  }

  render () {
    return (
      <form>
        {this.props.children}
      </form>
    )
  }
}

Form.propTypes = {
  form: React.PropTypes.func.isRequired,
  entry: React.PropTypes.object.isRequired,
  children: React.PropTypes.node
}

Form.childContextTypes = {
  form: React.PropTypes.object
}

module.exports = Form
