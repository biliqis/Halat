// const isNumber = require('is-number');

exports.getPaginationData = (query, count) => {
    if (!query) {
      return {
        records_per_page: null,
        offset: null,
        totalPages: null,
      };
    }

    const skip = query.page ?? 1;
    const records_per_page = query.limit ?? 10;
    const offset = (skip - 1) * records_per_page;
    const totalPages = Math.ceil(count / records_per_page);

    return {
      records_per_page,
      offset,
      totalPages,
    };
  }
