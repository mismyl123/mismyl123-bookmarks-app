//store.js is used to render and manipulate data that is utilized in bookmarkapp.js locally 
//create store to connect to the api
let bookmarks = [];

let state = {
  creating : false,
  editing : false,
  filter : 0,
  error : null
};

//create functions to manipulate the data of the api

const findById = function (id) {
  return this.bookmarks.find(currentBookmark => currentBookmark.id === id);
};

const addBookmark = function (bookmark) {
  this.bookmarks.push(bookmark);
};

const findAndUpdate = function (id, newData) {
  let myBookmark = this.findById(id);
  Object.assign(myBookmark, newData);
};

const findAndDelete = function (id) {
  this.bookmarks = this.bookmarks.filter(currentBookmark => currentBookmark.id.toString() !== id.toString());
};

//export functions to index.js

export default {
  bookmarks,
  state,
  findById,
  addBookmark,
  findAndUpdate,
  findAndDelete
};