const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/new");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const kittySchema = new Schema({
  name: String,
  age: Number,
  color: String,
});

kittySchema.methods.speak = function speak() {
  const greeting = this.name
    ? "Meow name is " +
      this.name +
      " age: " +
      this.age +
      " color: " +
      this.color
    : "I don't have a name";
  console.log(greeting);
};

const Kitten = mongoose.model("Kitten", kittySchema);

async function xys() {
  const fluffy = new Kitten({ name: "grumpy", age: 5, color: "black" });
  fluffy.speak();
  await fluffy.save();
  let ans = await Kitten.find({}).exec();
  console.log(ans);
}

xys();
