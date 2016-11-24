const React = require('react')
const form = require('serializable-form')
const { spy } = require('sinon')
const { render, mount } = require('enzyme')
const { Form, FormInput, FormSubmit } = require('../src')

const sleep = () => new Promise(process.nextTick)

describe('Form', function () {
  const bookForm = form({
    fields: {
      title: [
        form.validator(value => value.length > 1, 'too short')
      ],
      author: [
        form.validator(value => value !== undefined, 'missing')
      ]
    }
  })

  const validEntry = () => ({
    valid: true,
    fields: {
      title: { value: 'The Stand', valid: true, errors: [] },
      author: { value: 'Stephen King', valid: true, errors: [] }
    }
  })

  const invalidEntry = () => ({
    valid: false,
    fields: {
      title: { value: 'T', valid: false, errors: ['too short'] },
      author: { value: 'Stephen King', valid: true, errors: [] }
    }
  })

  const createFormElement = (entry, props = {}) => (
    <Form form={bookForm} entry={entry} {...props}>
      <FormInput field="title" type="text" />
      <FormInput field="author" type="text" />
      <FormSubmit>Submit</FormSubmit>
    </Form>
  )

  it('should not render any validation messages when the form is valid', function () {
    const wrapper = render(createFormElement(validEntry()))

    expect(wrapper.html()).to.eq('<form>'
      + '<div><input type="text" class="valid" value="The Stand"></div>'
      + '<div><input type="text" class="valid" value="Stephen King"></div>'
      + '<div><button type="submit">Submit</button></div>'
      + '</form>'
    )
  })

  it('should render all validation messages when the form is invalid', function () {
    const wrapper = render(createFormElement({
      valid: true,
      fields: {
        title: { value: 'T', valid: false, errors: ['too short'] }
      }
    }))

    expect(wrapper.html()).to.eq('<form>'
      + '<div><input type="text" class="invalid" value="T"><span>too short</span></div>'
      + '<div><input type="text" class="invalid" value=""></div>'
      + '<div><button type="submit">Submit</button></div>'
      + '</form>'
    )
  })

  it('should update validation content when the form is changed', async function () {
    const wrapper = mount(createFormElement(validEntry()))

    const titleInput = wrapper.find('input').first()
    titleInput.simulate('change', { target: { value: 'T' } })

    await sleep()

    expect(wrapper.html()).to.eq('<form>'
      + '<div><input type="text" class="invalid" value="T"><span>too short</span></div>'
      + '<div><input type="text" class="valid" value="Stephen King"></div>'
      + '<div><button type="submit">Submit</button></div>'
      + '</form>'
    )
  })

  it('should update the state of the form when the form is changed', async function () {
    const wrapper = mount(createFormElement(validEntry()))
    expect(wrapper.state()).to.deep.equal({
      entry: validEntry(),
      values: { title: 'The Stand', author: 'Stephen King' }
    })

    const titleInput = wrapper.find('input').first()
    titleInput.simulate('change', { target: { value: 'T' } })
    await sleep()

    expect(wrapper.state()).to.deep.equal({
      entry: invalidEntry(),
      values: {
        title: 'T',
        author: 'Stephen King'
      }
    })
  })

  describe('when submitting the form', function () {
    it('should include the form contents as a serialized form', async function () {
      const onSubmit = spy()
      const props = { onSubmit }
      const wrapper = mount(createFormElement(validEntry(), props))

      const titleInput = wrapper.find('button').first()
      titleInput.simulate('submit', { whatever: 'data' })
      await sleep()

      const [syntheticEvent, submittedEntry] = onSubmit.firstCall.args
      expect(syntheticEvent.whatever).to.eq('data')
      expect(submittedEntry).to.deep.equal({ author: 'Stephen King', title: 'The Stand' })
    })
  })
})
