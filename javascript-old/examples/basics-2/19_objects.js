// Dynamically add, modify and delete object properties
// Getters and Setters
const person = {
  get id() {
    return this._id;
  },

  set id(value) {
    this._id = value;
  },

  firstName: "John",
  lastName: "Doe",
};

person.id = 1337;
console.log(person.id);

person.firstName;
person.lastName;

// add property
person.age = 32;
person["age"] = 32;

// modify property
person.age = 32;
person["age"] = 23;

// delete property
delete person.age;
delete person["age"];
person.age = null;
person["age"] = null;

// add special keys for properties using bracket notation
person["person's age"] = 32;
console.log(person["person's age"]);

// Copy object
const book1 = { title: "Lord of the Rings" };
const book2 = Object.assign({}, book1);
console.log(book1);
console.log(book2);

// Object Destructuring
const { firstName, ...rest } = person;

// Check for Property Existence
console.log(Object.hasOwn(person, "age"));
console.log(person.hasOwnProperty("age"));

// Check for Property Existence
if ("age" in person) {
  console.log("Present");
}

// Check for Property Existence
for (const key in person) {
  if (Object.hasOwnProperty.call(person, key)) {
    const element = person[key];
    console.log(element);
  }
}

function getStudents(classroom) {
  let { hasTeachingAssistant, classlist } = classroom;
  let teacher, teachingAssistant, students;

  if (hasTeachingAssistant) {
    [teacher, teachingAssistant, ...students] = classlist;
  } else {
    [teacher, ...students] = classlist;
  }

  return students;
}

console.log(
  getStudents({
    hasTeachingAssistant: false,
    classlist: ["John", "Jane", "Tom", "Jerry"],
  })
);

console.log(
  getStudents({
    hasTeachingAssistant: true,
    classlist: ["John", "Jane", "Tom", "Jerry"],
  })
);

const username = Symbol("username");
const password = Symbol("password");

const user = {
  [username]: "user123",
  [password]: "pass123",
};

console.log(user);
console.log(user.username);
console.log(user.password);
console.log(user[username]);
console.log(user[password]);
