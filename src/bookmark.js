import $ from 'jquery';
import store from './store.js';

//this manipulates data from the server through a request
import api from './api.js';



//RENDER
const render = function (generatingFunction) {
  $('main').html(generatingFunction);
};

const showError = function(message){
  let err = `
  <div>
  <p>${message}</p>
  </div>`;
  $('#errors-div').html(err);
};

function clearError(){
  $('#errors-div').html('');
}

const generateBookmarkElement = function (bookmark) {
  let bookmarkElementString = `
    <div class="bookmark-element" data-id="${bookmark.id}" tabindex="0">
      <div class="bookmark-section">
        <div>Title:</div>
        <div>${bookmark.title}</div>
      </div>  
      <div class="bookmark-rating bookmark-section">
        <div class="flex-item">Rating:</div>
      <div>${bookmark.rating}</div>
      </div>
  `;

  if(bookmark.expanded) {
    bookmarkElementString += `
      <div class="bookmark-section">
        <div>Description:</div>
        <div>${bookmark.desc}</div>
      </div>
      <div class="bookmark-section">
      <label for="bookmark-link"></label>
      
     <div class="bookmark-link" onclick="event.stopPropagation()"><a href="${bookmark.url}" target="_blank">Visit Site</a></div>
      </div>
      <div class="bookmark-buttons bookmark-section">
      <button class="flex-item delete-button">DELETE</button>
      </div>
    `;
  }

  else {
    bookmarkElementString += `
      <span class="expand-prompt">CLICK HERE FOR DETAILS</span></button>`;
  }

  bookmarkElementString += `
    </div>
  `;
  return bookmarkElementString;
};


//take bookmarks from the store and make list items
//create bookmarks container in html form above

const generateBookmarkListString = function (bookmarkList) {
  let list = bookmarkList.filter(bookmark => bookmark.rating >= store.state.filter);
  list = list.map(bookmark => generateBookmarkElement(bookmark));
  return list.join('');
};

const generateMainView = function () {
  return `
  <div id="main-wrapper" class='main-wrapper'>
    <button id="create-button" name="create-button">ADD NEW</button>
    <div class="filter-results">
      <label for="filter-results">Filter results:</label>
      <select name="filter-results" id="filter-results">
        <option selected value="0 star">Select Rating...</option>
        <option value="1 star">✭✰✰✰✰</option>
        <option value="2 stars">✭✭✰✰✰</option>
        <option value="3 stars">✭✭✭✰✰</option>
        <option value="4 stars">✭✭✭✭✰</option>
        <option value="5 stars">✭✭✭✭✭</option>
      </select>
    </div>
    <div class='bkm-list'>
    ${generateBookmarkListString(store.bookmarks)}
    </div>
  </div>
  `;
};

const generateCreateView = function () {
  return `
  <legend>
    <div id="create-view" class="create-view">
      <h2>CREATE YOUR BOOKMARK</h2>
      <form id="create-form" action="" method="post">
        <div class="form-field">
          <label for="title">Title:</label>
          <input type="text" name="title" id="title">
        </div>      
        <div class="form-field">
          <label for="url">URL:</label>
          <input type="text" name="url" id="url" value="https://">
        </div>
        <div class="form-field">
          <label for="description">Description:</label>
          <textarea name="description" id="description" placeholder="(optional)"></textarea>
        </div>
        <div class="form-field">
          <label for="rating">Rating:</label>
          <select name="rating" id="rating">
            <option selected value="0 star">Select Rating...</option>
            <option value="1 star">✭✰✰✰✰</option>
            <option value="2 stars">✮✮✰✰✰</option>
            <option value="3 stars">✮✮✮✰✰</option>
            <option value="4 stars">✮✮✮✮✰</option>
            <option value="5 stars">✮✮✮✮✮</option>
          </select>
        </div>
        <div class="form-field">
          <button class="cancel-button" type="button" id="cancel-button">CANCEL</button>
          <button class="save-button" type="submit" id="save-button">CREATE</button>
        </div>
      </form>
    </div>
    </legend>
  `;
};

const getBookmarkIdFromElement = function (element) {
  return $(element)
    .closest('.bookmark-element')
    .data('id');
};


//EVENT LISTENERS

const handleRatingFilterChange = function () {
  $('main').on('change', '#filter-results', event => {
    let filterSelection = parseInt($(event.target).val());
    store.state.filter = filterSelection;
    render(generateMainView);
  });
};

//This function handles the action of the bookmark expand field

const handleExpandToggleClick = function () {
  $('main').on('click', '.bookmark-element', event => {
    let id = getBookmarkIdFromElement($(event.target));
    let currentBookmark = store.bookmarks.find(bookmark => bookmark.id === id);
    currentBookmark.expanded = !currentBookmark.expanded;
    render(generateMainView);
  });


  $('main').on('keypress', '.bookmark-element', event => {
    let id = getBookmarkIdFromElement($(event.target));
    let currentBookmark = store.bookmarks.find(bookmark => bookmark.id === id);
    currentBookmark.expanded = !currentBookmark.expanded;
    render(generateMainView);
  });
};

const handleEditButtonClick = function () {
  $('.bookmark-element').on('click', '.edit-button', event => {
    store.state.editing = true;
    const id = $(event.currentTarget).closest('.bookmark-element').data('id');
    render(generateEditView);
  });
};

const handleDeleteButtonClick = function () {
  $('main').on('click', '.delete-button', event => {
    const id = getBookmarkIdFromElement(event.target);
    
    clearError();
    
    api.deleteBookmark(id)
      .then(() => {
        store.findAndDelete(id);
        render(generateMainView);
      }).catch((err) => {
        showError(err.message);
      });
  });
  
  
  $('main').on('keypress', '.delete-button', event => {
    const id = getBookmarkIdFromElement(event.target);
    
    clearError();
    
    api.deleteBookmark(id)
      .then( () => {
        store.findAndDelete(id);
        render(generateMainView);
      }).catch((err) => {
        showError(err.message);
      });
  });
};


const handleCancelButtonClick = function () {
  $('main').on('click', '#cancel-button', event => {
    clearError();
    store.state.creating = false;
    store.state.editing = false;
    render(generateMainView);
  });
};

const handleSaveButtonClick = function () {

  $('main').on('submit', '#create-form', event => {
    event.preventDefault();
    let title = $('#title').val();
    let url = $('#url').val();
    let desc = $('#description').val();
    let rating = parseInt($('#rating').val());
    let expanded = false;

    let newBookmark = {title, url, desc, rating, expanded};

    clearError();

    api.createBookmark(newBookmark)
      .then( (data) => {
        store.addBookmark(data);
        render(generateMainView);
      }).catch((err) => {
        showError(err.message);
      });
  });

};

const handleCreateButtonClick = function () {
  $('main').on('click', '#create-button', event => {
    store.state.creating = true;
    render(generateCreateView);
  });
};

const bindEventListeners = function () {
  handleRatingFilterChange();
  handleExpandToggleClick();
  handleCreateButtonClick();
  handleEditButtonClick();
  handleDeleteButtonClick();
  handleCancelButtonClick();
  handleSaveButtonClick();
  
  
  
  showError();
  clearError();
};

//export functions to index.js

export {
  generateMainView,
  bindEventListeners,
  render,
  showError,
  clearError,
};