const APIURL = '/api/todos/';

export async function getTodos () {
  // Fetch json data from the url
  return fetch (APIURL)
    .then (resp => {
      // Check if there was anything wrong with the response before json parsing it
      if (!resp.ok) {
        // At this point it has been identified that there is an issue.
        // Check if the response status code is betweek 400 and 500.
        if (resp.status >= 400 && resp.status < 500) {
          // It it is, then stop execution of all the code and throw an error with message that comes from the server
          return resp.json ().then (data => {
            let err = {errorMessage: data.message};
            throw err;
          });
          // If the code is not between 400 and 500, then you won't really know what went wrong
          // In that case, stop everything and throw an error with some generic message
        } else {
          let err = {
            errorMessage: 'Please try again later, server is not responding',
          };
          throw err;
        }
      }
      // If everything is ok with the response, then go ahead and return parsed json to the next .then() block
      return resp.json ();
    })
}
