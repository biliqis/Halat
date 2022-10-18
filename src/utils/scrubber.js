module.exports = (data) => {
    // These are the items we don't want it to be logged. If you want it to be replaced
    // with '****', just set the value as 1 or set the value with a function that can perform
    // an action on that particular key
    const keysToEliminate = {
      password: 1,
      confirm_password: 1,
      temp_token: 1,
      token: 1,
      // Example of function based result
      authorization: (d) => {
        const dt = d.split(' ');
        return `${dt[0]} *******`;
      },
    };
    const defaultScrubbingReplacement = '********';
    // Do nothing for non object data for now
    if (typeof data !== 'object') {
      return data;
    }
    // FIXME: This function assumes the key we want to scrub out is not nested, hence it doesn't
    // cater for nested secret cases. Replace with Pino's redact funvtion
    // (https://github.com/pinojs/pino/blob/master/docs/api.md#redact-array--object)
    const newObject = {};
    Object.keys(data).forEach((key) => {
      newObject[key] = data[key];
      const doesKeyExist = keysToEliminate[key];
      if (doesKeyExist) {
        newObject[key] = typeof doesKeyExist === 'function' ? doesKeyExist(key) : defaultScrubbingReplacement;
      }
    });
    return newObject;
  };