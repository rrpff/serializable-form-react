# serializable-form-react

## install

```sh
$ npm install serializable-form --save-dev
```

## why?

Make building forms easier!

## examples

First define a form creator.

```js
// forms/bookCreateForm.js
const form = require('serializable-form')

const isPresent = value => value && value.length > 0

const bookCreateForm = form({
  fields: {
    title: [form.validator(isPresent, 'title is missing')],
    author: [form.validator(isPresent, 'author is missing')]
  }
})

module.exports = bookCreateForm
```

Then define the form.

```js
const { Form, FormInput } = require('serializable-form-react')
const bookForm = require('../forms/bookCreateForm')

const BookCreateForm = props => {
  return (
    <Form form={bookForm} entry={props.entry} onSubmit={props.submit}>
      <FormInput field="title" type="text" />
      <FormInput field="author" type="text" />
    </Form>
  )
}

module.exports = BookCreateForm
```

Then call it somewhere:

```js
const BookCreateForm = require('../components/BookCreateForm')

const BookCreatePage = props => {
  return (
    <BookCreateForm
      entry={props.entry} // entry is a serializable-form entry which serves as the initial value
      onSubmit={...}
    />
  )
}
```
