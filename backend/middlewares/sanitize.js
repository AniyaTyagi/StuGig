const sanitizeInput = (req, res, next) => {
  const clean = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    
    for (const key in obj) {
      // 1. Prevent NoSQL Injection (remove keys starting with $)
      if (key.startsWith('$')) {
        delete obj[key];
        continue;
      }
      
      // 2. Prevent XSS (strip HTML tags from strings)
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key]
          .trim()
          .replace(/<[^>]*>/g, '') // Strip HTML tags
          .replace(/javascript:/gi, ''); // Block inline script calls
      } else if (typeof obj[key] === 'object') {
        clean(obj[key]);
      }
    }
  };

  if (req.body) clean(req.body);
  if (req.query) clean(req.query);
  if (req.params) clean(req.params);
  
  next();
};

module.exports = { sanitizeInput };
