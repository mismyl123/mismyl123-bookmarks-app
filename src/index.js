
//saveBookmark function:This function will check whether there are any existing bookmarks. If there arn
//imports always at top

import {generateMainView, bindEventListeners, render, showError, clearError} from './bookmark.js';
import './style.css';
import $ from 'jquery';
import api from './api.js';
import store from './store.js';


//Main function to call all functions and generate to DOM

const main = function() {
  render(generateMainView);
  clearError();
  let bkm = api.getBookmarks()
    .then(response => {
      response.forEach(bookmark => {
        bookmark.expanded = false;
        store.addBookmark(bookmark);
        render(generateMainView);
      })
      render(generateMainView);
      bindEventListeners();
    }).catch((err) => {
      showError(err.message);
    });
};

$(main);