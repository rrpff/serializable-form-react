const React = require('react')
const form = require('serializable-form')
const { render, mount } = require('enzyme')
const { Form, FormInput } = require('../src')

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

  const createFormElement = entry => (
    <Form form={bookForm} entry={entry}>
      <FormInput field="title" type="text" />
      <FormInput field="author" type="text" />
    </Form>
  )

  it('should not render any validation messages when the form is valid', function () {
    const wrapper = render(createFormElement({
      valid: true,
      fields: {
        title: { value: 'The Stand', valid: true, errors: [] },
        author: { value: 'Stephen King', valid: true, errors: [] }
      }
    }))

    expect(wrapper.html()).to.eq('<form>'
      + '<div><input type="text" class="valid" value="The Stand"></div>'
      + '<div><input type="text" class="valid" value="Stephen King"></div>'
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
      + '<div><input type="text" value=""></div>'
      + '</form>'
    )
  })

  it('should update validation content when the form is changed', function () {
    const wrapper = mount(createFormElement({
      valid: true,
      fields: {
        title: { value: 'The Stand', valid: true, errors: [] },
        author: { value: 'Stephen King', valid: true, errors: [] }
      }
    }))

    const titleInput = wrapper.find('input').first()
    titleInput.simulate('change', { target: { value: 'T' } })

    process.nextTick(function () {
      expect(wrapper.html()).to.eq('<form>'
        + '<div><input type="text" class="invalid" value="T"><span>too short</span></div>'
        + '<div><input type="text" class="valid" value="Stephen King"></div>'
        + '</form>'
      )
    })
  })
})
