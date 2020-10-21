const BASE_URL = 'https://thinkful-list-api.herokuapp.com/mismyl123/bookmarks';
	
function listApiFetch(...args) {
     // setup var in scope outside of promise chain
  let error;
  return fetch(...args)
    .then(res => {
      if (!res.ok) {
          // if response is not 2xx, start building error object
        error = { code: res.status };
      }
      // otherwise, return parsed JSON
      return res.json();
    })
    .then(data => {
        // if error exists, place the JSON message into the error object and 
      // reject the Promise with your error object so it lands in the next 
      // catch.  IMPORTANT: Check how the API sends errors -- not all APIs
      // will respond with a JSON object containing message key
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }
      // otherwise, return the json as normal resolved Promise
      return data;
    });
}

const getBookmarks = function () {
  return listApiFetch(BASE_URL, {});
};

const createBookmark = function (bookmark) {
  let newBookmark = JSON.stringify(bookmark);

  return listApiFetch(BASE_URL, {
    method : 'POST',
    headers : {'Content-Type' : 'application/json'},
    body : newBookmark
  });
};

const updateBookmark = function (id, updateData) {
  return listApiFetch(`${BASE_URL}/${id}`, {
    method : 'PATCH',
    headers : {'Content-Type' : 'application/json'},
    body : JSON.stringify(updateData)
  });
};

const deleteBookmark = function (id) {
  return listApiFetch(`${BASE_URL}/${id}`, {
    method : 'DELETE'
  });
};

export default {
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark
};