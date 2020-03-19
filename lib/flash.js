/**
 * Expose `flash()` function on requests.
 *
 * @return {Function}
 * @api public
 */
module.exports = function flash(options) {
  options = options || {};
  var safe = options.unsafe === undefined ? true : !options.unsafe;

  return function(req, res, next) {
    if (req.flash && safe) {
      return next();
    }
    req.flash = _flash;
    next();
  };
};

/**
 * Queue flash `msg` of the given `type`.
 *
 * Examples:
 *
 *      req.flash('info', 'email sent');
 *      req.flash('error', 'email delivery failed');
 *      req.flash('info', 'email re-sent');
 *      // => 2
 *
 *      req.flash('info');
 *      // => ['email sent', 'email re-sent']
 *
 *      req.flash('info');
 *      // => []
 *
 *      req.flash();
 *      // => { error: ['email delivery failed'], info: [] }
 *
 * Formatting:
 *
 * Flash notifications also support arbitrary formatting support.
 * For example you may pass variable arguments to `req.flash()`
 * and use the %s specifier to be replaced by the associated argument:
 *
 *     req.flash('info', 'email has been sent to %s.', userName);
 *
 * Formatting uses `util.format()`, which is available on Node 0.6+.
 *
 * @param {String} type
 * @param {String} msg
 * @return {Array|Object|Number}
 * @api public
 */
function _flash(type, msg) {
  const getSession = () => {
    return this.session.flash || {};
  };
  const setSession = v => {
    this.session.flash = v;
  };
  const clearSession = () => {
    this.session.flash = undefined;
  };

  if (type && msg) {
    const flashes = getSession();

    (flashes[type] = flashes[type] || []).push(msg);

    setSession(flashes);
  } else {
    const flashes = getSession();

    clearSession();

    return flashes;
  }
}
