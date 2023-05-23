const loggingMiddleware = (req, res, next) => {
  const { method, url, params, query, body, headers } = req;

  // Log request details
  console.log('Request Details:');

  if (method) {
    console.log('Method:', method);
  }

  if (url) {
    console.log('URL:', url);
  }

  if (params && Object.keys(params).length > 0) {
    console.log('Params:', params);
  }

  if (query && Object.keys(query).length > 0) {
    console.log('Query:', query);
  }

  if (body && Object.keys(body).length > 0) {
    console.log('Body:', body);
  }

  if (headers && Object.keys(headers).length > 0) {
    console.log('Headers:', headers);
  }

  // Proceed to the next middleware/route handler
  next();
};

module.exports = loggingMiddleware;
