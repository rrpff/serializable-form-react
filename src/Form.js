const React = require('react')

const formValues = fields =>
  Object.keys(fields).reduce((acc, key) =>
    Object.assign(acc, { [key]: fields[key].value })
  , {})

class Form extends React.Component {
  constructor (...args) {
    super(...args)

    this.state = {
      entry: this.props.entry,
      values: formValues(this.props.entry.fields)
    }
  }

  getChildContext () {
    const blankField = { value: '', valid: null, errors: [] }
    const getField = field => this.state.entry.fields[field] || blankField
    const setField = async (field, value) => {
      const fields = Object.assign({}, this.state.entry.fields)
      fields[field].value = value

      const values = formValues(fields)
      const entry = await this.props.form(values)
      this.setState({ entry, values })

      return entry.fields[field]
    }

    return { form: { getField, setField } }
  }

  async handleSubmit (e) {
    e.preventDefault()
    this.props.onSubmit(e, this.state.values)
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        {this.props.children}
      </form>
    )
  }
}

Form.propTypes = {
  form: React.PropTypes.func.isRequired,
  entry: React.PropTypes.object.isRequired,
  children: React.PropTypes.node,
  onSubmit: React.PropTypes.func
}

Form.defaultProps = {
  onSubmit: () => {}
}

Form.childContextTypes = {
  form: React.PropTypes.object
}

module.exports = Form
