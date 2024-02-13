const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(
    fn((req, res, next)).catch((error) =>
      res.status(500).json({ message: error.message })
    )
  );
};

export default asyncHandler;

/* NOTES:
- Why are there two fat arrows (=>) in the code?
When asyncHandler is called with a function fn, it returns another function 
that accepts req, res, and next parameters. This inner function wraps the 
execution of fn inside a Promise.resolve(). If fn (which is expected to be 
an asynchronous function) throws an error, it catches the error using .catch() 
and sends a 500 status response with the error message. The asyncHandler 
function essentially acts as middleware that wraps asynchronous route handlers, 
ensuring that any errors thrown by those handlers are properly handled and do 
not crash the server.
*/
