module.exports = {
  ifEquals: function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  },
  times: function (n, options) {
    var accum = "";
    for (var i = 0; i < n; ++i)
      accum += options.fn(i + 1);
    return accum;
  },
  ifBig: function (arg1, arg2, options) {
    arg1 = parseFloat(arg1.replace(/,/g, ''));
    return arg1 >= arg2 ? options.fn(this) : options.inverse(this);
  },
};