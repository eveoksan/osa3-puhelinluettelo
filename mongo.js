/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://eveliinaoksanen:${password}@cluster0.hve5rwd.mongodb.net/phoneBookApp?retryWrites=true&w=majority`

console.log('connecting to', url)

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number
})

if (process.argv.length === 3) {
  console.log('Phonebook: ')
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
    process.exit(1)
  })
} else {
  person.save().then(_result => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}
