const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://vdomim:${password}@project0.6oarids.mongodb.net/phonebook-app?retryWrites=true&w=majority`
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', noteSchema)

if(process.argv.length == 3){
    console.log("Devolvemos todos los registros")
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(person => {
            console.log(person.name, person.number)
            
        });
        mongoose.connection.close()
    })
}else if(process.argv.length > 5){
    console.log("Numero de parametros incorrecto: Debe de ser node mongo.js <password> <name>* <number>*. *Optional")
}else{
    console.log("Insertamos nuevo registro telefonico")
    const name = process.argv[3]
    const number = process.argv[4]
    console.log(number)
    const person = new Person({
        name: name,
        number: number
    })
    person.save().then(result => {
        console.log("Registro insertado")
        mongoose.connection.close()
    })
}