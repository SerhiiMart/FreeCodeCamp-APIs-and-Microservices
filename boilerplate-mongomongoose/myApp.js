require('dotenv').config();

//First
const mongoose = require('mongoose');
let uri = process.env.MONGO_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//Second
const { Schema } = mongoose;
let personSchema = new Schema({
    name: { type: String, required: true },
    age :  Number,
    favoriteFoods: [String]
  });
let Person = mongoose.model('Person', personSchema);

//third
const createAndSavePerson = (done) => {
  let John = new Person({ name : "John Doe", age: 42, favoriteFoods: ["pizza", "cheezburger", "potatoe"]});
  John.save( ( err, data) => {
     (err) ? console.log(err) : done(null, data);
  });
};

//forth
let arrayOfPeople = [
  { name : "Bob Smith", age: 33, favoriteFoods: ["rice", "hot-dog"]},
  { name : "Sabrina Summers", age: 25, favoriteFoods: ["mango", "salat"]},
  { name : "Erica Underleaf", age: 21, favoriteFoods: ["chips", "apple"]},
];
const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, createdPeople) => {
     (err) ? console.log(err) : done(null, createdPeople);
  })
};

//fifth
const findPeopleByName = (personName, done) => {
  Person.find({name : personName}, (err, data) =>{
    (err) ? console.log(err) : done(null, data);
  })
};

//sixth
const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods :{ $all: [food]}}, (err, data) =>{
   (err) ? console.log(err) : done(null, data);
 });
};

//seventh
const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data) =>{
  (err) ? console.log(err) : done(null, data);
});
};

//eight
const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById(personId, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      result.favoriteFoods.push(foodToAdd);
      result.save((err, updatedResult) => {
        (err) ? console.log(err) : done(null, updatedResult);
      })
    };
  });
  // done(null /*, data*/);
};

////nineth
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({name : personName}, {age : ageToSet}, { new: true }, (err, updatedRecord) => {
    (err) ? console.log(err) : done(null, updatedRecord);
  })
  //done(null /*, data*/);
};

///tenth
const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, data) =>{
    (err) ? console.log(err) : done(null, data);
  });
};

//eleventh
const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  Person.remove({name : nameToRemove }, (err, data) => {
    (err) ? console.log(err) : done(null, data);
  })
};

//finished tvelve
const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({favoriteFoods : {$all : foodToSearch}})
  .sort({name : 'asc'}) //way to sorting by name
  .limit(2)
  .select('-age')
  .exec((err, filterData) =>{
    (err) ? console.log(err) : done(null, filterData);
  });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
