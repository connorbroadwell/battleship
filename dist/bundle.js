/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/common-tags/es/TemplateTag/TemplateTag.js":
/*!****************************************************************!*\
  !*** ./node_modules/common-tags/es/TemplateTag/TemplateTag.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['', ''], ['', '']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class TemplateTag
 * @classdesc Consumes a pipeline of composable transformer plugins and produces a template tag.
 */
var TemplateTag = function () {
  /**
   * constructs a template tag
   * @constructs TemplateTag
   * @param  {...Object} [...transformers] - an array or arguments list of transformers
   * @return {Function}                    - a template tag
   */
  function TemplateTag() {
    var _this = this;

    for (var _len = arguments.length, transformers = Array(_len), _key = 0; _key < _len; _key++) {
      transformers[_key] = arguments[_key];
    }

    _classCallCheck(this, TemplateTag);

    this.tag = function (strings) {
      for (var _len2 = arguments.length, expressions = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        expressions[_key2 - 1] = arguments[_key2];
      }

      if (typeof strings === 'function') {
        // if the first argument passed is a function, assume it is a template tag and return
        // an intermediary tag that processes the template using the aforementioned tag, passing the
        // result to our tag
        return _this.interimTag.bind(_this, strings);
      }

      if (typeof strings === 'string') {
        // if the first argument passed is a string, just transform it
        return _this.transformEndResult(strings);
      }

      // else, return a transformed end result of processing the template with our tag
      strings = strings.map(_this.transformString.bind(_this));
      return _this.transformEndResult(strings.reduce(_this.processSubstitutions.bind(_this, expressions)));
    };

    // if first argument is an array, extrude it as a list of transformers
    if (transformers.length > 0 && Array.isArray(transformers[0])) {
      transformers = transformers[0];
    }

    // if any transformers are functions, this means they are not initiated - automatically initiate them
    this.transformers = transformers.map(function (transformer) {
      return typeof transformer === 'function' ? transformer() : transformer;
    });

    // return an ES2015 template tag
    return this.tag;
  }

  /**
   * Applies all transformers to a template literal tagged with this method.
   * If a function is passed as the first argument, assumes the function is a template tag
   * and applies it to the template, returning a template tag.
   * @param  {(Function|String|Array<String>)} strings        - Either a template tag or an array containing template strings separated by identifier
   * @param  {...*}                            ...expressions - Optional list of substitution values.
   * @return {(String|Function)}                              - Either an intermediary tag function or the results of processing the template.
   */


  _createClass(TemplateTag, [{
    key: 'interimTag',


    /**
     * An intermediary template tag that receives a template tag and passes the result of calling the template with the received
     * template tag to our own template tag.
     * @param  {Function}        nextTag          - the received template tag
     * @param  {Array<String>}   template         - the template to process
     * @param  {...*}            ...substitutions - `substitutions` is an array of all substitutions in the template
     * @return {*}                                - the final processed value
     */
    value: function interimTag(previousTag, template) {
      for (var _len3 = arguments.length, substitutions = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        substitutions[_key3 - 2] = arguments[_key3];
      }

      return this.tag(_templateObject, previousTag.apply(undefined, [template].concat(substitutions)));
    }

    /**
     * Performs bulk processing on the tagged template, transforming each substitution and then
     * concatenating the resulting values into a string.
     * @param  {Array<*>} substitutions - an array of all remaining substitutions present in this template
     * @param  {String}   resultSoFar   - this iteration's result string so far
     * @param  {String}   remainingPart - the template chunk after the current substitution
     * @return {String}                 - the result of joining this iteration's processed substitution with the result
     */

  }, {
    key: 'processSubstitutions',
    value: function processSubstitutions(substitutions, resultSoFar, remainingPart) {
      var substitution = this.transformSubstitution(substitutions.shift(), resultSoFar);
      return ''.concat(resultSoFar, substitution, remainingPart);
    }

    /**
     * Iterate through each transformer, applying the transformer's `onString` method to the template
     * strings before all substitutions are processed.
     * @param {String}  str - The input string
     * @return {String}     - The final results of processing each transformer
     */

  }, {
    key: 'transformString',
    value: function transformString(str) {
      var cb = function cb(res, transform) {
        return transform.onString ? transform.onString(res) : res;
      };
      return this.transformers.reduce(cb, str);
    }

    /**
     * When a substitution is encountered, iterates through each transformer and applies the transformer's
     * `onSubstitution` method to the substitution.
     * @param  {*}      substitution - The current substitution
     * @param  {String} resultSoFar  - The result up to and excluding this substitution.
     * @return {*}                   - The final result of applying all substitution transformations.
     */

  }, {
    key: 'transformSubstitution',
    value: function transformSubstitution(substitution, resultSoFar) {
      var cb = function cb(res, transform) {
        return transform.onSubstitution ? transform.onSubstitution(res, resultSoFar) : res;
      };
      return this.transformers.reduce(cb, substitution);
    }

    /**
     * Iterates through each transformer, applying the transformer's `onEndResult` method to the
     * template literal after all substitutions have finished processing.
     * @param  {String} endResult - The processed template, just before it is returned from the tag
     * @return {String}           - The final results of processing each transformer
     */

  }, {
    key: 'transformEndResult',
    value: function transformEndResult(endResult) {
      var cb = function cb(res, transform) {
        return transform.onEndResult ? transform.onEndResult(res) : res;
      };
      return this.transformers.reduce(cb, endResult);
    }
  }]);

  return TemplateTag;
}();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TemplateTag);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9UZW1wbGF0ZVRhZy9UZW1wbGF0ZVRhZy5qcyJdLCJuYW1lcyI6WyJUZW1wbGF0ZVRhZyIsInRyYW5zZm9ybWVycyIsInRhZyIsInN0cmluZ3MiLCJleHByZXNzaW9ucyIsImludGVyaW1UYWciLCJiaW5kIiwidHJhbnNmb3JtRW5kUmVzdWx0IiwibWFwIiwidHJhbnNmb3JtU3RyaW5nIiwicmVkdWNlIiwicHJvY2Vzc1N1YnN0aXR1dGlvbnMiLCJsZW5ndGgiLCJBcnJheSIsImlzQXJyYXkiLCJ0cmFuc2Zvcm1lciIsInByZXZpb3VzVGFnIiwidGVtcGxhdGUiLCJzdWJzdGl0dXRpb25zIiwicmVzdWx0U29GYXIiLCJyZW1haW5pbmdQYXJ0Iiwic3Vic3RpdHV0aW9uIiwidHJhbnNmb3JtU3Vic3RpdHV0aW9uIiwic2hpZnQiLCJjb25jYXQiLCJzdHIiLCJjYiIsInJlcyIsInRyYW5zZm9ybSIsIm9uU3RyaW5nIiwib25TdWJzdGl0dXRpb24iLCJlbmRSZXN1bHQiLCJvbkVuZFJlc3VsdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztJQUlxQkEsVztBQUNuQjs7Ozs7O0FBTUEseUJBQTZCO0FBQUE7O0FBQUEsc0NBQWRDLFlBQWM7QUFBZEEsa0JBQWM7QUFBQTs7QUFBQTs7QUFBQSxTQXVCN0JDLEdBdkI2QixHQXVCdkIsVUFBQ0MsT0FBRCxFQUE2QjtBQUFBLHlDQUFoQkMsV0FBZ0I7QUFBaEJBLG1CQUFnQjtBQUFBOztBQUNqQyxVQUFJLE9BQU9ELE9BQVAsS0FBbUIsVUFBdkIsRUFBbUM7QUFDakM7QUFDQTtBQUNBO0FBQ0EsZUFBTyxNQUFLRSxVQUFMLENBQWdCQyxJQUFoQixDQUFxQixLQUFyQixFQUEyQkgsT0FBM0IsQ0FBUDtBQUNEOztBQUVELFVBQUksT0FBT0EsT0FBUCxLQUFtQixRQUF2QixFQUFpQztBQUMvQjtBQUNBLGVBQU8sTUFBS0ksa0JBQUwsQ0FBd0JKLE9BQXhCLENBQVA7QUFDRDs7QUFFRDtBQUNBQSxnQkFBVUEsUUFBUUssR0FBUixDQUFZLE1BQUtDLGVBQUwsQ0FBcUJILElBQXJCLENBQTBCLEtBQTFCLENBQVosQ0FBVjtBQUNBLGFBQU8sTUFBS0Msa0JBQUwsQ0FDTEosUUFBUU8sTUFBUixDQUFlLE1BQUtDLG9CQUFMLENBQTBCTCxJQUExQixDQUErQixLQUEvQixFQUFxQ0YsV0FBckMsQ0FBZixDQURLLENBQVA7QUFHRCxLQXpDNEI7O0FBQzNCO0FBQ0EsUUFBSUgsYUFBYVcsTUFBYixHQUFzQixDQUF0QixJQUEyQkMsTUFBTUMsT0FBTixDQUFjYixhQUFhLENBQWIsQ0FBZCxDQUEvQixFQUErRDtBQUM3REEscUJBQWVBLGFBQWEsQ0FBYixDQUFmO0FBQ0Q7O0FBRUQ7QUFDQSxTQUFLQSxZQUFMLEdBQW9CQSxhQUFhTyxHQUFiLENBQWlCLHVCQUFlO0FBQ2xELGFBQU8sT0FBT08sV0FBUCxLQUF1QixVQUF2QixHQUFvQ0EsYUFBcEMsR0FBb0RBLFdBQTNEO0FBQ0QsS0FGbUIsQ0FBcEI7O0FBSUE7QUFDQSxXQUFPLEtBQUtiLEdBQVo7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7QUE0QkE7Ozs7Ozs7OytCQVFXYyxXLEVBQWFDLFEsRUFBNEI7QUFBQSx5Q0FBZkMsYUFBZTtBQUFmQSxxQkFBZTtBQUFBOztBQUNsRCxhQUFPLEtBQUtoQixHQUFaLGtCQUFrQmMsOEJBQVlDLFFBQVosU0FBeUJDLGFBQXpCLEVBQWxCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7O3lDQVFxQkEsYSxFQUFlQyxXLEVBQWFDLGEsRUFBZTtBQUM5RCxVQUFNQyxlQUFlLEtBQUtDLHFCQUFMLENBQ25CSixjQUFjSyxLQUFkLEVBRG1CLEVBRW5CSixXQUZtQixDQUFyQjtBQUlBLGFBQU8sR0FBR0ssTUFBSCxDQUFVTCxXQUFWLEVBQXVCRSxZQUF2QixFQUFxQ0QsYUFBckMsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7b0NBTWdCSyxHLEVBQUs7QUFDbkIsVUFBTUMsS0FBSyxTQUFMQSxFQUFLLENBQUNDLEdBQUQsRUFBTUMsU0FBTjtBQUFBLGVBQ1RBLFVBQVVDLFFBQVYsR0FBcUJELFVBQVVDLFFBQVYsQ0FBbUJGLEdBQW5CLENBQXJCLEdBQStDQSxHQUR0QztBQUFBLE9BQVg7QUFFQSxhQUFPLEtBQUsxQixZQUFMLENBQWtCUyxNQUFsQixDQUF5QmdCLEVBQXpCLEVBQTZCRCxHQUE3QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7MENBT3NCSixZLEVBQWNGLFcsRUFBYTtBQUMvQyxVQUFNTyxLQUFLLFNBQUxBLEVBQUssQ0FBQ0MsR0FBRCxFQUFNQyxTQUFOO0FBQUEsZUFDVEEsVUFBVUUsY0FBVixHQUNJRixVQUFVRSxjQUFWLENBQXlCSCxHQUF6QixFQUE4QlIsV0FBOUIsQ0FESixHQUVJUSxHQUhLO0FBQUEsT0FBWDtBQUlBLGFBQU8sS0FBSzFCLFlBQUwsQ0FBa0JTLE1BQWxCLENBQXlCZ0IsRUFBekIsRUFBNkJMLFlBQTdCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7O3VDQU1tQlUsUyxFQUFXO0FBQzVCLFVBQU1MLEtBQUssU0FBTEEsRUFBSyxDQUFDQyxHQUFELEVBQU1DLFNBQU47QUFBQSxlQUNUQSxVQUFVSSxXQUFWLEdBQXdCSixVQUFVSSxXQUFWLENBQXNCTCxHQUF0QixDQUF4QixHQUFxREEsR0FENUM7QUFBQSxPQUFYO0FBRUEsYUFBTyxLQUFLMUIsWUFBTCxDQUFrQlMsTUFBbEIsQ0FBeUJnQixFQUF6QixFQUE2QkssU0FBN0IsQ0FBUDtBQUNEOzs7Ozs7ZUFuSGtCL0IsVyIsImZpbGUiOiJUZW1wbGF0ZVRhZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGNsYXNzIFRlbXBsYXRlVGFnXG4gKiBAY2xhc3NkZXNjIENvbnN1bWVzIGEgcGlwZWxpbmUgb2YgY29tcG9zYWJsZSB0cmFuc2Zvcm1lciBwbHVnaW5zIGFuZCBwcm9kdWNlcyBhIHRlbXBsYXRlIHRhZy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVtcGxhdGVUYWcge1xuICAvKipcbiAgICogY29uc3RydWN0cyBhIHRlbXBsYXRlIHRhZ1xuICAgKiBAY29uc3RydWN0cyBUZW1wbGF0ZVRhZ1xuICAgKiBAcGFyYW0gIHsuLi5PYmplY3R9IFsuLi50cmFuc2Zvcm1lcnNdIC0gYW4gYXJyYXkgb3IgYXJndW1lbnRzIGxpc3Qgb2YgdHJhbnNmb3JtZXJzXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSAgICAgICAgICAgICAgICAgICAgLSBhIHRlbXBsYXRlIHRhZ1xuICAgKi9cbiAgY29uc3RydWN0b3IoLi4udHJhbnNmb3JtZXJzKSB7XG4gICAgLy8gaWYgZmlyc3QgYXJndW1lbnQgaXMgYW4gYXJyYXksIGV4dHJ1ZGUgaXQgYXMgYSBsaXN0IG9mIHRyYW5zZm9ybWVyc1xuICAgIGlmICh0cmFuc2Zvcm1lcnMubGVuZ3RoID4gMCAmJiBBcnJheS5pc0FycmF5KHRyYW5zZm9ybWVyc1swXSkpIHtcbiAgICAgIHRyYW5zZm9ybWVycyA9IHRyYW5zZm9ybWVyc1swXTtcbiAgICB9XG5cbiAgICAvLyBpZiBhbnkgdHJhbnNmb3JtZXJzIGFyZSBmdW5jdGlvbnMsIHRoaXMgbWVhbnMgdGhleSBhcmUgbm90IGluaXRpYXRlZCAtIGF1dG9tYXRpY2FsbHkgaW5pdGlhdGUgdGhlbVxuICAgIHRoaXMudHJhbnNmb3JtZXJzID0gdHJhbnNmb3JtZXJzLm1hcCh0cmFuc2Zvcm1lciA9PiB7XG4gICAgICByZXR1cm4gdHlwZW9mIHRyYW5zZm9ybWVyID09PSAnZnVuY3Rpb24nID8gdHJhbnNmb3JtZXIoKSA6IHRyYW5zZm9ybWVyO1xuICAgIH0pO1xuXG4gICAgLy8gcmV0dXJuIGFuIEVTMjAxNSB0ZW1wbGF0ZSB0YWdcbiAgICByZXR1cm4gdGhpcy50YWc7XG4gIH1cblxuICAvKipcbiAgICogQXBwbGllcyBhbGwgdHJhbnNmb3JtZXJzIHRvIGEgdGVtcGxhdGUgbGl0ZXJhbCB0YWdnZWQgd2l0aCB0aGlzIG1ldGhvZC5cbiAgICogSWYgYSBmdW5jdGlvbiBpcyBwYXNzZWQgYXMgdGhlIGZpcnN0IGFyZ3VtZW50LCBhc3N1bWVzIHRoZSBmdW5jdGlvbiBpcyBhIHRlbXBsYXRlIHRhZ1xuICAgKiBhbmQgYXBwbGllcyBpdCB0byB0aGUgdGVtcGxhdGUsIHJldHVybmluZyBhIHRlbXBsYXRlIHRhZy5cbiAgICogQHBhcmFtICB7KEZ1bmN0aW9ufFN0cmluZ3xBcnJheTxTdHJpbmc+KX0gc3RyaW5ncyAgICAgICAgLSBFaXRoZXIgYSB0ZW1wbGF0ZSB0YWcgb3IgYW4gYXJyYXkgY29udGFpbmluZyB0ZW1wbGF0ZSBzdHJpbmdzIHNlcGFyYXRlZCBieSBpZGVudGlmaWVyXG4gICAqIEBwYXJhbSAgey4uLip9ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmV4cHJlc3Npb25zIC0gT3B0aW9uYWwgbGlzdCBvZiBzdWJzdGl0dXRpb24gdmFsdWVzLlxuICAgKiBAcmV0dXJuIHsoU3RyaW5nfEZ1bmN0aW9uKX0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIEVpdGhlciBhbiBpbnRlcm1lZGlhcnkgdGFnIGZ1bmN0aW9uIG9yIHRoZSByZXN1bHRzIG9mIHByb2Nlc3NpbmcgdGhlIHRlbXBsYXRlLlxuICAgKi9cbiAgdGFnID0gKHN0cmluZ3MsIC4uLmV4cHJlc3Npb25zKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBzdHJpbmdzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBpZiB0aGUgZmlyc3QgYXJndW1lbnQgcGFzc2VkIGlzIGEgZnVuY3Rpb24sIGFzc3VtZSBpdCBpcyBhIHRlbXBsYXRlIHRhZyBhbmQgcmV0dXJuXG4gICAgICAvLyBhbiBpbnRlcm1lZGlhcnkgdGFnIHRoYXQgcHJvY2Vzc2VzIHRoZSB0ZW1wbGF0ZSB1c2luZyB0aGUgYWZvcmVtZW50aW9uZWQgdGFnLCBwYXNzaW5nIHRoZVxuICAgICAgLy8gcmVzdWx0IHRvIG91ciB0YWdcbiAgICAgIHJldHVybiB0aGlzLmludGVyaW1UYWcuYmluZCh0aGlzLCBzdHJpbmdzKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHN0cmluZ3MgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBpZiB0aGUgZmlyc3QgYXJndW1lbnQgcGFzc2VkIGlzIGEgc3RyaW5nLCBqdXN0IHRyYW5zZm9ybSBpdFxuICAgICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtRW5kUmVzdWx0KHN0cmluZ3MpO1xuICAgIH1cblxuICAgIC8vIGVsc2UsIHJldHVybiBhIHRyYW5zZm9ybWVkIGVuZCByZXN1bHQgb2YgcHJvY2Vzc2luZyB0aGUgdGVtcGxhdGUgd2l0aCBvdXIgdGFnXG4gICAgc3RyaW5ncyA9IHN0cmluZ3MubWFwKHRoaXMudHJhbnNmb3JtU3RyaW5nLmJpbmQodGhpcykpO1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUVuZFJlc3VsdChcbiAgICAgIHN0cmluZ3MucmVkdWNlKHRoaXMucHJvY2Vzc1N1YnN0aXR1dGlvbnMuYmluZCh0aGlzLCBleHByZXNzaW9ucykpLFxuICAgICk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFuIGludGVybWVkaWFyeSB0ZW1wbGF0ZSB0YWcgdGhhdCByZWNlaXZlcyBhIHRlbXBsYXRlIHRhZyBhbmQgcGFzc2VzIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgdGVtcGxhdGUgd2l0aCB0aGUgcmVjZWl2ZWRcbiAgICogdGVtcGxhdGUgdGFnIHRvIG91ciBvd24gdGVtcGxhdGUgdGFnLlxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gICAgICAgIG5leHRUYWcgICAgICAgICAgLSB0aGUgcmVjZWl2ZWQgdGVtcGxhdGUgdGFnXG4gICAqIEBwYXJhbSAge0FycmF5PFN0cmluZz59ICAgdGVtcGxhdGUgICAgICAgICAtIHRoZSB0ZW1wbGF0ZSB0byBwcm9jZXNzXG4gICAqIEBwYXJhbSAgey4uLip9ICAgICAgICAgICAgLi4uc3Vic3RpdHV0aW9ucyAtIGBzdWJzdGl0dXRpb25zYCBpcyBhbiBhcnJheSBvZiBhbGwgc3Vic3RpdHV0aW9ucyBpbiB0aGUgdGVtcGxhdGVcbiAgICogQHJldHVybiB7Kn0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gdGhlIGZpbmFsIHByb2Nlc3NlZCB2YWx1ZVxuICAgKi9cbiAgaW50ZXJpbVRhZyhwcmV2aW91c1RhZywgdGVtcGxhdGUsIC4uLnN1YnN0aXR1dGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy50YWdgJHtwcmV2aW91c1RhZyh0ZW1wbGF0ZSwgLi4uc3Vic3RpdHV0aW9ucyl9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBidWxrIHByb2Nlc3Npbmcgb24gdGhlIHRhZ2dlZCB0ZW1wbGF0ZSwgdHJhbnNmb3JtaW5nIGVhY2ggc3Vic3RpdHV0aW9uIGFuZCB0aGVuXG4gICAqIGNvbmNhdGVuYXRpbmcgdGhlIHJlc3VsdGluZyB2YWx1ZXMgaW50byBhIHN0cmluZy5cbiAgICogQHBhcmFtICB7QXJyYXk8Kj59IHN1YnN0aXR1dGlvbnMgLSBhbiBhcnJheSBvZiBhbGwgcmVtYWluaW5nIHN1YnN0aXR1dGlvbnMgcHJlc2VudCBpbiB0aGlzIHRlbXBsYXRlXG4gICAqIEBwYXJhbSAge1N0cmluZ30gICByZXN1bHRTb0ZhciAgIC0gdGhpcyBpdGVyYXRpb24ncyByZXN1bHQgc3RyaW5nIHNvIGZhclxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgcmVtYWluaW5nUGFydCAtIHRoZSB0ZW1wbGF0ZSBjaHVuayBhZnRlciB0aGUgY3VycmVudCBzdWJzdGl0dXRpb25cbiAgICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAgICAgICAgLSB0aGUgcmVzdWx0IG9mIGpvaW5pbmcgdGhpcyBpdGVyYXRpb24ncyBwcm9jZXNzZWQgc3Vic3RpdHV0aW9uIHdpdGggdGhlIHJlc3VsdFxuICAgKi9cbiAgcHJvY2Vzc1N1YnN0aXR1dGlvbnMoc3Vic3RpdHV0aW9ucywgcmVzdWx0U29GYXIsIHJlbWFpbmluZ1BhcnQpIHtcbiAgICBjb25zdCBzdWJzdGl0dXRpb24gPSB0aGlzLnRyYW5zZm9ybVN1YnN0aXR1dGlvbihcbiAgICAgIHN1YnN0aXR1dGlvbnMuc2hpZnQoKSxcbiAgICAgIHJlc3VsdFNvRmFyLFxuICAgICk7XG4gICAgcmV0dXJuICcnLmNvbmNhdChyZXN1bHRTb0Zhciwgc3Vic3RpdHV0aW9uLCByZW1haW5pbmdQYXJ0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIHRocm91Z2ggZWFjaCB0cmFuc2Zvcm1lciwgYXBwbHlpbmcgdGhlIHRyYW5zZm9ybWVyJ3MgYG9uU3RyaW5nYCBtZXRob2QgdG8gdGhlIHRlbXBsYXRlXG4gICAqIHN0cmluZ3MgYmVmb3JlIGFsbCBzdWJzdGl0dXRpb25zIGFyZSBwcm9jZXNzZWQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgc3RyIC0gVGhlIGlucHV0IHN0cmluZ1xuICAgKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAtIFRoZSBmaW5hbCByZXN1bHRzIG9mIHByb2Nlc3NpbmcgZWFjaCB0cmFuc2Zvcm1lclxuICAgKi9cbiAgdHJhbnNmb3JtU3RyaW5nKHN0cikge1xuICAgIGNvbnN0IGNiID0gKHJlcywgdHJhbnNmb3JtKSA9PlxuICAgICAgdHJhbnNmb3JtLm9uU3RyaW5nID8gdHJhbnNmb3JtLm9uU3RyaW5nKHJlcykgOiByZXM7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtZXJzLnJlZHVjZShjYiwgc3RyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIGEgc3Vic3RpdHV0aW9uIGlzIGVuY291bnRlcmVkLCBpdGVyYXRlcyB0aHJvdWdoIGVhY2ggdHJhbnNmb3JtZXIgYW5kIGFwcGxpZXMgdGhlIHRyYW5zZm9ybWVyJ3NcbiAgICogYG9uU3Vic3RpdHV0aW9uYCBtZXRob2QgdG8gdGhlIHN1YnN0aXR1dGlvbi5cbiAgICogQHBhcmFtICB7Kn0gICAgICBzdWJzdGl0dXRpb24gLSBUaGUgY3VycmVudCBzdWJzdGl0dXRpb25cbiAgICogQHBhcmFtICB7U3RyaW5nfSByZXN1bHRTb0ZhciAgLSBUaGUgcmVzdWx0IHVwIHRvIGFuZCBleGNsdWRpbmcgdGhpcyBzdWJzdGl0dXRpb24uXG4gICAqIEByZXR1cm4geyp9ICAgICAgICAgICAgICAgICAgIC0gVGhlIGZpbmFsIHJlc3VsdCBvZiBhcHBseWluZyBhbGwgc3Vic3RpdHV0aW9uIHRyYW5zZm9ybWF0aW9ucy5cbiAgICovXG4gIHRyYW5zZm9ybVN1YnN0aXR1dGlvbihzdWJzdGl0dXRpb24sIHJlc3VsdFNvRmFyKSB7XG4gICAgY29uc3QgY2IgPSAocmVzLCB0cmFuc2Zvcm0pID0+XG4gICAgICB0cmFuc2Zvcm0ub25TdWJzdGl0dXRpb25cbiAgICAgICAgPyB0cmFuc2Zvcm0ub25TdWJzdGl0dXRpb24ocmVzLCByZXN1bHRTb0ZhcilcbiAgICAgICAgOiByZXM7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtZXJzLnJlZHVjZShjYiwgc3Vic3RpdHV0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlcyB0aHJvdWdoIGVhY2ggdHJhbnNmb3JtZXIsIGFwcGx5aW5nIHRoZSB0cmFuc2Zvcm1lcidzIGBvbkVuZFJlc3VsdGAgbWV0aG9kIHRvIHRoZVxuICAgKiB0ZW1wbGF0ZSBsaXRlcmFsIGFmdGVyIGFsbCBzdWJzdGl0dXRpb25zIGhhdmUgZmluaXNoZWQgcHJvY2Vzc2luZy5cbiAgICogQHBhcmFtICB7U3RyaW5nfSBlbmRSZXN1bHQgLSBUaGUgcHJvY2Vzc2VkIHRlbXBsYXRlLCBqdXN0IGJlZm9yZSBpdCBpcyByZXR1cm5lZCBmcm9tIHRoZSB0YWdcbiAgICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAgLSBUaGUgZmluYWwgcmVzdWx0cyBvZiBwcm9jZXNzaW5nIGVhY2ggdHJhbnNmb3JtZXJcbiAgICovXG4gIHRyYW5zZm9ybUVuZFJlc3VsdChlbmRSZXN1bHQpIHtcbiAgICBjb25zdCBjYiA9IChyZXMsIHRyYW5zZm9ybSkgPT5cbiAgICAgIHRyYW5zZm9ybS5vbkVuZFJlc3VsdCA/IHRyYW5zZm9ybS5vbkVuZFJlc3VsdChyZXMpIDogcmVzO1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybWVycy5yZWR1Y2UoY2IsIGVuZFJlc3VsdCk7XG4gIH1cbn1cbiJdfQ==

/***/ }),

/***/ "./node_modules/common-tags/es/TemplateTag/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/common-tags/es/TemplateTag/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _TemplateTag__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _TemplateTag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TemplateTag */ "./node_modules/common-tags/es/TemplateTag/TemplateTag.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9UZW1wbGF0ZVRhZy9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Il0sIm1hcHBpbmdzIjoicUJBQW9CLGU7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL1RlbXBsYXRlVGFnJztcbiJdfQ==

/***/ }),

/***/ "./node_modules/common-tags/es/codeBlock/index.js":
/*!********************************************************!*\
  !*** ./node_modules/common-tags/es/codeBlock/index.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _html__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../html */ "./node_modules/common-tags/es/html/index.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb2RlQmxvY2svaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdCJdLCJtYXBwaW5ncyI6InFCQUFvQixTO3FCQUFiQSxPIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnJvbSAnLi4vaHRtbCc7XG4iXX0=

/***/ }),

/***/ "./node_modules/common-tags/es/commaLists/commaLists.js":
/*!**************************************************************!*\
  !*** ./node_modules/common-tags/es/commaLists/commaLists.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TemplateTag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../TemplateTag */ "./node_modules/common-tags/es/TemplateTag/index.js");
/* harmony import */ var _stripIndentTransformer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../stripIndentTransformer */ "./node_modules/common-tags/es/stripIndentTransformer/index.js");
/* harmony import */ var _inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../inlineArrayTransformer */ "./node_modules/common-tags/es/inlineArrayTransformer/index.js");
/* harmony import */ var _trimResultTransformer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../trimResultTransformer */ "./node_modules/common-tags/es/trimResultTransformer/index.js");





var commaLists = new _TemplateTag__WEBPACK_IMPORTED_MODULE_0__["default"]((0,_inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_2__["default"])({ separator: ',' }), _stripIndentTransformer__WEBPACK_IMPORTED_MODULE_1__["default"], _trimResultTransformer__WEBPACK_IMPORTED_MODULE_3__["default"]);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (commaLists);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYUxpc3RzL2NvbW1hTGlzdHMuanMiXSwibmFtZXMiOlsiVGVtcGxhdGVUYWciLCJzdHJpcEluZGVudFRyYW5zZm9ybWVyIiwiaW5saW5lQXJyYXlUcmFuc2Zvcm1lciIsInRyaW1SZXN1bHRUcmFuc2Zvcm1lciIsImNvbW1hTGlzdHMiLCJzZXBhcmF0b3IiXSwibWFwcGluZ3MiOiJBQUFBLE9BQU9BLFdBQVAsTUFBd0IsZ0JBQXhCO0FBQ0EsT0FBT0Msc0JBQVAsTUFBbUMsMkJBQW5DO0FBQ0EsT0FBT0Msc0JBQVAsTUFBbUMsMkJBQW5DO0FBQ0EsT0FBT0MscUJBQVAsTUFBa0MsMEJBQWxDOztBQUVBLElBQU1DLGFBQWEsSUFBSUosV0FBSixDQUNqQkUsdUJBQXVCLEVBQUVHLFdBQVcsR0FBYixFQUF2QixDQURpQixFQUVqQkosc0JBRmlCLEVBR2pCRSxxQkFIaUIsQ0FBbkI7O0FBTUEsZUFBZUMsVUFBZiIsImZpbGUiOiJjb21tYUxpc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBzdHJpcEluZGVudFRyYW5zZm9ybWVyIGZyb20gJy4uL3N0cmlwSW5kZW50VHJhbnNmb3JtZXInO1xuaW1wb3J0IGlubGluZUFycmF5VHJhbnNmb3JtZXIgZnJvbSAnLi4vaW5saW5lQXJyYXlUcmFuc2Zvcm1lcic7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5cbmNvbnN0IGNvbW1hTGlzdHMgPSBuZXcgVGVtcGxhdGVUYWcoXG4gIGlubGluZUFycmF5VHJhbnNmb3JtZXIoeyBzZXBhcmF0b3I6ICcsJyB9KSxcbiAgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcixcbiAgdHJpbVJlc3VsdFRyYW5zZm9ybWVyLFxuKTtcblxuZXhwb3J0IGRlZmF1bHQgY29tbWFMaXN0cztcbiJdfQ==

/***/ }),

/***/ "./node_modules/common-tags/es/commaLists/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/common-tags/es/commaLists/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _commaLists__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _commaLists__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./commaLists */ "./node_modules/common-tags/es/commaLists/commaLists.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYUxpc3RzL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiXSwibWFwcGluZ3MiOiJxQkFBb0IsYztxQkFBYkEsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZyb20gJy4vY29tbWFMaXN0cyc7XG4iXX0=

/***/ }),

/***/ "./node_modules/common-tags/es/commaListsAnd/commaListsAnd.js":
/*!********************************************************************!*\
  !*** ./node_modules/common-tags/es/commaListsAnd/commaListsAnd.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TemplateTag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../TemplateTag */ "./node_modules/common-tags/es/TemplateTag/index.js");
/* harmony import */ var _stripIndentTransformer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../stripIndentTransformer */ "./node_modules/common-tags/es/stripIndentTransformer/index.js");
/* harmony import */ var _inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../inlineArrayTransformer */ "./node_modules/common-tags/es/inlineArrayTransformer/index.js");
/* harmony import */ var _trimResultTransformer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../trimResultTransformer */ "./node_modules/common-tags/es/trimResultTransformer/index.js");





var commaListsAnd = new _TemplateTag__WEBPACK_IMPORTED_MODULE_0__["default"]((0,_inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_2__["default"])({ separator: ',', conjunction: 'and' }), _stripIndentTransformer__WEBPACK_IMPORTED_MODULE_1__["default"], _trimResultTransformer__WEBPACK_IMPORTED_MODULE_3__["default"]);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (commaListsAnd);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYUxpc3RzQW5kL2NvbW1hTGlzdHNBbmQuanMiXSwibmFtZXMiOlsiVGVtcGxhdGVUYWciLCJzdHJpcEluZGVudFRyYW5zZm9ybWVyIiwiaW5saW5lQXJyYXlUcmFuc2Zvcm1lciIsInRyaW1SZXN1bHRUcmFuc2Zvcm1lciIsImNvbW1hTGlzdHNBbmQiLCJzZXBhcmF0b3IiLCJjb25qdW5jdGlvbiJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsV0FBUCxNQUF3QixnQkFBeEI7QUFDQSxPQUFPQyxzQkFBUCxNQUFtQywyQkFBbkM7QUFDQSxPQUFPQyxzQkFBUCxNQUFtQywyQkFBbkM7QUFDQSxPQUFPQyxxQkFBUCxNQUFrQywwQkFBbEM7O0FBRUEsSUFBTUMsZ0JBQWdCLElBQUlKLFdBQUosQ0FDcEJFLHVCQUF1QixFQUFFRyxXQUFXLEdBQWIsRUFBa0JDLGFBQWEsS0FBL0IsRUFBdkIsQ0FEb0IsRUFFcEJMLHNCQUZvQixFQUdwQkUscUJBSG9CLENBQXRCOztBQU1BLGVBQWVDLGFBQWYiLCJmaWxlIjoiY29tbWFMaXN0c0FuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciBmcm9tICcuLi9zdHJpcEluZGVudFRyYW5zZm9ybWVyJztcbmltcG9ydCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyIGZyb20gJy4uL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuXG5jb25zdCBjb21tYUxpc3RzQW5kID0gbmV3IFRlbXBsYXRlVGFnKFxuICBpbmxpbmVBcnJheVRyYW5zZm9ybWVyKHsgc2VwYXJhdG9yOiAnLCcsIGNvbmp1bmN0aW9uOiAnYW5kJyB9KSxcbiAgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcixcbiAgdHJpbVJlc3VsdFRyYW5zZm9ybWVyLFxuKTtcblxuZXhwb3J0IGRlZmF1bHQgY29tbWFMaXN0c0FuZDtcbiJdfQ==

/***/ }),

/***/ "./node_modules/common-tags/es/commaListsAnd/index.js":
/*!************************************************************!*\
  !*** ./node_modules/common-tags/es/commaListsAnd/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _commaListsAnd__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _commaListsAnd__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./commaListsAnd */ "./node_modules/common-tags/es/commaListsAnd/commaListsAnd.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYUxpc3RzQW5kL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiXSwibWFwcGluZ3MiOiJxQkFBb0IsaUI7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL2NvbW1hTGlzdHNBbmQnO1xuIl19

/***/ }),

/***/ "./node_modules/common-tags/es/commaListsOr/commaListsOr.js":
/*!******************************************************************!*\
  !*** ./node_modules/common-tags/es/commaListsOr/commaListsOr.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TemplateTag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../TemplateTag */ "./node_modules/common-tags/es/TemplateTag/index.js");
/* harmony import */ var _stripIndentTransformer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../stripIndentTransformer */ "./node_modules/common-tags/es/stripIndentTransformer/index.js");
/* harmony import */ var _inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../inlineArrayTransformer */ "./node_modules/common-tags/es/inlineArrayTransformer/index.js");
/* harmony import */ var _trimResultTransformer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../trimResultTransformer */ "./node_modules/common-tags/es/trimResultTransformer/index.js");





var commaListsOr = new _TemplateTag__WEBPACK_IMPORTED_MODULE_0__["default"]((0,_inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_2__["default"])({ separator: ',', conjunction: 'or' }), _stripIndentTransformer__WEBPACK_IMPORTED_MODULE_1__["default"], _trimResultTransformer__WEBPACK_IMPORTED_MODULE_3__["default"]);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (commaListsOr);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYUxpc3RzT3IvY29tbWFMaXN0c09yLmpzIl0sIm5hbWVzIjpbIlRlbXBsYXRlVGFnIiwic3RyaXBJbmRlbnRUcmFuc2Zvcm1lciIsImlubGluZUFycmF5VHJhbnNmb3JtZXIiLCJ0cmltUmVzdWx0VHJhbnNmb3JtZXIiLCJjb21tYUxpc3RzT3IiLCJzZXBhcmF0b3IiLCJjb25qdW5jdGlvbiJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsV0FBUCxNQUF3QixnQkFBeEI7QUFDQSxPQUFPQyxzQkFBUCxNQUFtQywyQkFBbkM7QUFDQSxPQUFPQyxzQkFBUCxNQUFtQywyQkFBbkM7QUFDQSxPQUFPQyxxQkFBUCxNQUFrQywwQkFBbEM7O0FBRUEsSUFBTUMsZUFBZSxJQUFJSixXQUFKLENBQ25CRSx1QkFBdUIsRUFBRUcsV0FBVyxHQUFiLEVBQWtCQyxhQUFhLElBQS9CLEVBQXZCLENBRG1CLEVBRW5CTCxzQkFGbUIsRUFHbkJFLHFCQUhtQixDQUFyQjs7QUFNQSxlQUFlQyxZQUFmIiwiZmlsZSI6ImNvbW1hTGlzdHNPci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciBmcm9tICcuLi9zdHJpcEluZGVudFRyYW5zZm9ybWVyJztcbmltcG9ydCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyIGZyb20gJy4uL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuXG5jb25zdCBjb21tYUxpc3RzT3IgPSBuZXcgVGVtcGxhdGVUYWcoXG4gIGlubGluZUFycmF5VHJhbnNmb3JtZXIoeyBzZXBhcmF0b3I6ICcsJywgY29uanVuY3Rpb246ICdvcicgfSksXG4gIHN0cmlwSW5kZW50VHJhbnNmb3JtZXIsXG4gIHRyaW1SZXN1bHRUcmFuc2Zvcm1lcixcbik7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbW1hTGlzdHNPcjtcbiJdfQ==

/***/ }),

/***/ "./node_modules/common-tags/es/commaListsOr/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/common-tags/es/commaListsOr/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _commaListsOr__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _commaListsOr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./commaListsOr */ "./node_modules/common-tags/es/commaListsOr/commaListsOr.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYUxpc3RzT3IvaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdCJdLCJtYXBwaW5ncyI6InFCQUFvQixnQjtxQkFBYkEsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZyb20gJy4vY29tbWFMaXN0c09yJztcbiJdfQ==

/***/ }),

/***/ "./node_modules/common-tags/es/html/html.js":
/*!**************************************************!*\
  !*** ./node_modules/common-tags/es/html/html.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TemplateTag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../TemplateTag */ "./node_modules/common-tags/es/TemplateTag/index.js");
/* harmony import */ var _stripIndentTransformer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../stripIndentTransformer */ "./node_modules/common-tags/es/stripIndentTransformer/index.js");
/* harmony import */ var _inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../inlineArrayTransformer */ "./node_modules/common-tags/es/inlineArrayTransformer/index.js");
/* harmony import */ var _trimResultTransformer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../trimResultTransformer */ "./node_modules/common-tags/es/trimResultTransformer/index.js");
/* harmony import */ var _splitStringTransformer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../splitStringTransformer */ "./node_modules/common-tags/es/splitStringTransformer/index.js");
/* harmony import */ var _removeNonPrintingValuesTransformer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../removeNonPrintingValuesTransformer */ "./node_modules/common-tags/es/removeNonPrintingValuesTransformer/index.js");







var html = new _TemplateTag__WEBPACK_IMPORTED_MODULE_0__["default"]((0,_splitStringTransformer__WEBPACK_IMPORTED_MODULE_4__["default"])('\n'), _removeNonPrintingValuesTransformer__WEBPACK_IMPORTED_MODULE_5__["default"], _inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_2__["default"], _stripIndentTransformer__WEBPACK_IMPORTED_MODULE_1__["default"], _trimResultTransformer__WEBPACK_IMPORTED_MODULE_3__["default"]);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (html);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9odG1sL2h0bWwuanMiXSwibmFtZXMiOlsiVGVtcGxhdGVUYWciLCJzdHJpcEluZGVudFRyYW5zZm9ybWVyIiwiaW5saW5lQXJyYXlUcmFuc2Zvcm1lciIsInRyaW1SZXN1bHRUcmFuc2Zvcm1lciIsInNwbGl0U3RyaW5nVHJhbnNmb3JtZXIiLCJyZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyIiwiaHRtbCJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsV0FBUCxNQUF3QixnQkFBeEI7QUFDQSxPQUFPQyxzQkFBUCxNQUFtQywyQkFBbkM7QUFDQSxPQUFPQyxzQkFBUCxNQUFtQywyQkFBbkM7QUFDQSxPQUFPQyxxQkFBUCxNQUFrQywwQkFBbEM7QUFDQSxPQUFPQyxzQkFBUCxNQUFtQywyQkFBbkM7QUFDQSxPQUFPQyxrQ0FBUCxNQUErQyx1Q0FBL0M7O0FBRUEsSUFBTUMsT0FBTyxJQUFJTixXQUFKLENBQ1hJLHVCQUF1QixJQUF2QixDQURXLEVBRVhDLGtDQUZXLEVBR1hILHNCQUhXLEVBSVhELHNCQUpXLEVBS1hFLHFCQUxXLENBQWI7O0FBUUEsZUFBZUcsSUFBZiIsImZpbGUiOiJodG1sLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBzdHJpcEluZGVudFRyYW5zZm9ybWVyIGZyb20gJy4uL3N0cmlwSW5kZW50VHJhbnNmb3JtZXInO1xuaW1wb3J0IGlubGluZUFycmF5VHJhbnNmb3JtZXIgZnJvbSAnLi4vaW5saW5lQXJyYXlUcmFuc2Zvcm1lcic7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5pbXBvcnQgc3BsaXRTdHJpbmdUcmFuc2Zvcm1lciBmcm9tICcuLi9zcGxpdFN0cmluZ1RyYW5zZm9ybWVyJztcbmltcG9ydCByZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyIGZyb20gJy4uL3JlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXInO1xuXG5jb25zdCBodG1sID0gbmV3IFRlbXBsYXRlVGFnKFxuICBzcGxpdFN0cmluZ1RyYW5zZm9ybWVyKCdcXG4nKSxcbiAgcmVtb3ZlTm9uUHJpbnRpbmdWYWx1ZXNUcmFuc2Zvcm1lcixcbiAgaW5saW5lQXJyYXlUcmFuc2Zvcm1lcixcbiAgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcixcbiAgdHJpbVJlc3VsdFRyYW5zZm9ybWVyLFxuKTtcblxuZXhwb3J0IGRlZmF1bHQgaHRtbDtcbiJdfQ==

/***/ }),

/***/ "./node_modules/common-tags/es/html/index.js":
/*!***************************************************!*\
  !*** ./node_modules/common-tags/es/html/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _html__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./html */ "./node_modules/common-tags/es/html/html.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9odG1sL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiXSwibWFwcGluZ3MiOiJxQkFBb0IsUTtxQkFBYkEsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZyb20gJy4vaHRtbCc7XG4iXX0=

/***/ }),

/***/ "./node_modules/common-tags/es/index.js":
/*!**********************************************!*\
  !*** ./node_modules/common-tags/es/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TemplateTag: () => (/* reexport safe */ _TemplateTag__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   codeBlock: () => (/* reexport safe */ _codeBlock__WEBPACK_IMPORTED_MODULE_13__["default"]),
/* harmony export */   commaLists: () => (/* reexport safe */ _commaLists__WEBPACK_IMPORTED_MODULE_9__["default"]),
/* harmony export */   commaListsAnd: () => (/* reexport safe */ _commaListsAnd__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   commaListsOr: () => (/* reexport safe */ _commaListsOr__WEBPACK_IMPORTED_MODULE_11__["default"]),
/* harmony export */   html: () => (/* reexport safe */ _html__WEBPACK_IMPORTED_MODULE_12__["default"]),
/* harmony export */   inlineArrayTransformer: () => (/* reexport safe */ _inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   inlineLists: () => (/* reexport safe */ _inlineLists__WEBPACK_IMPORTED_MODULE_21__["default"]),
/* harmony export */   oneLine: () => (/* reexport safe */ _oneLine__WEBPACK_IMPORTED_MODULE_16__["default"]),
/* harmony export */   oneLineCommaLists: () => (/* reexport safe */ _oneLineCommaLists__WEBPACK_IMPORTED_MODULE_18__["default"]),
/* harmony export */   oneLineCommaListsAnd: () => (/* reexport safe */ _oneLineCommaListsAnd__WEBPACK_IMPORTED_MODULE_20__["default"]),
/* harmony export */   oneLineCommaListsOr: () => (/* reexport safe */ _oneLineCommaListsOr__WEBPACK_IMPORTED_MODULE_19__["default"]),
/* harmony export */   oneLineInlineLists: () => (/* reexport safe */ _oneLineInlineLists__WEBPACK_IMPORTED_MODULE_22__["default"]),
/* harmony export */   oneLineTrim: () => (/* reexport safe */ _oneLineTrim__WEBPACK_IMPORTED_MODULE_17__["default"]),
/* harmony export */   removeNonPrintingValuesTransformer: () => (/* reexport safe */ _removeNonPrintingValuesTransformer__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   replaceResultTransformer: () => (/* reexport safe */ _replaceResultTransformer__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   replaceStringTransformer: () => (/* reexport safe */ _replaceStringTransformer__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   replaceSubstitutionTransformer: () => (/* reexport safe */ _replaceSubstitutionTransformer__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   safeHtml: () => (/* reexport safe */ _safeHtml__WEBPACK_IMPORTED_MODULE_15__["default"]),
/* harmony export */   source: () => (/* reexport safe */ _source__WEBPACK_IMPORTED_MODULE_14__["default"]),
/* harmony export */   splitStringTransformer: () => (/* reexport safe */ _splitStringTransformer__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   stripIndent: () => (/* reexport safe */ _stripIndent__WEBPACK_IMPORTED_MODULE_23__["default"]),
/* harmony export */   stripIndentTransformer: () => (/* reexport safe */ _stripIndentTransformer__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   stripIndents: () => (/* reexport safe */ _stripIndents__WEBPACK_IMPORTED_MODULE_24__["default"]),
/* harmony export */   trimResultTransformer: () => (/* reexport safe */ _trimResultTransformer__WEBPACK_IMPORTED_MODULE_1__["default"])
/* harmony export */ });
/* harmony import */ var _TemplateTag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TemplateTag */ "./node_modules/common-tags/es/TemplateTag/index.js");
/* harmony import */ var _trimResultTransformer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./trimResultTransformer */ "./node_modules/common-tags/es/trimResultTransformer/index.js");
/* harmony import */ var _stripIndentTransformer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./stripIndentTransformer */ "./node_modules/common-tags/es/stripIndentTransformer/index.js");
/* harmony import */ var _replaceResultTransformer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./replaceResultTransformer */ "./node_modules/common-tags/es/replaceResultTransformer/index.js");
/* harmony import */ var _replaceSubstitutionTransformer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./replaceSubstitutionTransformer */ "./node_modules/common-tags/es/replaceSubstitutionTransformer/index.js");
/* harmony import */ var _replaceStringTransformer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./replaceStringTransformer */ "./node_modules/common-tags/es/replaceStringTransformer/index.js");
/* harmony import */ var _inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./inlineArrayTransformer */ "./node_modules/common-tags/es/inlineArrayTransformer/index.js");
/* harmony import */ var _splitStringTransformer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./splitStringTransformer */ "./node_modules/common-tags/es/splitStringTransformer/index.js");
/* harmony import */ var _removeNonPrintingValuesTransformer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./removeNonPrintingValuesTransformer */ "./node_modules/common-tags/es/removeNonPrintingValuesTransformer/index.js");
/* harmony import */ var _commaLists__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./commaLists */ "./node_modules/common-tags/es/commaLists/index.js");
/* harmony import */ var _commaListsAnd__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./commaListsAnd */ "./node_modules/common-tags/es/commaListsAnd/index.js");
/* harmony import */ var _commaListsOr__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./commaListsOr */ "./node_modules/common-tags/es/commaListsOr/index.js");
/* harmony import */ var _html__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./html */ "./node_modules/common-tags/es/html/index.js");
/* harmony import */ var _codeBlock__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./codeBlock */ "./node_modules/common-tags/es/codeBlock/index.js");
/* harmony import */ var _source__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./source */ "./node_modules/common-tags/es/source/index.js");
/* harmony import */ var _safeHtml__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./safeHtml */ "./node_modules/common-tags/es/safeHtml/index.js");
/* harmony import */ var _oneLine__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./oneLine */ "./node_modules/common-tags/es/oneLine/index.js");
/* harmony import */ var _oneLineTrim__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./oneLineTrim */ "./node_modules/common-tags/es/oneLineTrim/index.js");
/* harmony import */ var _oneLineCommaLists__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./oneLineCommaLists */ "./node_modules/common-tags/es/oneLineCommaLists/index.js");
/* harmony import */ var _oneLineCommaListsOr__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./oneLineCommaListsOr */ "./node_modules/common-tags/es/oneLineCommaListsOr/index.js");
/* harmony import */ var _oneLineCommaListsAnd__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./oneLineCommaListsAnd */ "./node_modules/common-tags/es/oneLineCommaListsAnd/index.js");
/* harmony import */ var _inlineLists__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./inlineLists */ "./node_modules/common-tags/es/inlineLists/index.js");
/* harmony import */ var _oneLineInlineLists__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./oneLineInlineLists */ "./node_modules/common-tags/es/oneLineInlineLists/index.js");
/* harmony import */ var _stripIndent__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./stripIndent */ "./node_modules/common-tags/es/stripIndent/index.js");
/* harmony import */ var _stripIndents__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./stripIndents */ "./node_modules/common-tags/es/stripIndents/index.js");
// core



// transformers


















// tags

































//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJUZW1wbGF0ZVRhZyIsInRyaW1SZXN1bHRUcmFuc2Zvcm1lciIsInN0cmlwSW5kZW50VHJhbnNmb3JtZXIiLCJyZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIiLCJyZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIiLCJyZXBsYWNlU3RyaW5nVHJhbnNmb3JtZXIiLCJpbmxpbmVBcnJheVRyYW5zZm9ybWVyIiwic3BsaXRTdHJpbmdUcmFuc2Zvcm1lciIsInJlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXIiLCJjb21tYUxpc3RzIiwiY29tbWFMaXN0c0FuZCIsImNvbW1hTGlzdHNPciIsImh0bWwiLCJjb2RlQmxvY2siLCJzb3VyY2UiLCJzYWZlSHRtbCIsIm9uZUxpbmUiLCJvbmVMaW5lVHJpbSIsIm9uZUxpbmVDb21tYUxpc3RzIiwib25lTGluZUNvbW1hTGlzdHNPciIsIm9uZUxpbmVDb21tYUxpc3RzQW5kIiwiaW5saW5lTGlzdHMiLCJvbmVMaW5lSW5saW5lTGlzdHMiLCJzdHJpcEluZGVudCIsInN0cmlwSW5kZW50cyJdLCJtYXBwaW5ncyI6IkFBQUE7eUJBQ3dCLGU7eUJBQWpCQSxXOztBQUVQOzttQ0FDa0MseUI7bUNBQTNCQyxxQjtvQ0FDNEIsMEI7b0NBQTVCQyxzQjtzQ0FDOEIsNEI7c0NBQTlCQyx3Qjs0Q0FDb0Msa0M7NENBQXBDQyw4QjtzQ0FDOEIsNEI7c0NBQTlCQyx3QjtvQ0FDNEIsMEI7b0NBQTVCQyxzQjtvQ0FDNEIsMEI7b0NBQTVCQyxzQjtnREFDd0Msc0M7Z0RBQXhDQyxrQzs7QUFFUDs7d0JBQ3VCLGM7d0JBQWhCQyxVOzJCQUNtQixpQjsyQkFBbkJDLGE7MEJBQ2tCLGdCOzBCQUFsQkMsWTtrQkFDVSxRO2tCQUFWQyxJO3VCQUNlLGE7dUJBQWZDLFM7b0JBQ1ksVTtvQkFBWkMsTTtzQkFDYyxZO3NCQUFkQyxRO3FCQUNhLFc7cUJBQWJDLE87eUJBQ2lCLGU7eUJBQWpCQyxXOytCQUN1QixxQjsrQkFBdkJDLGlCO2lDQUN5Qix1QjtpQ0FBekJDLG1CO2tDQUMwQix3QjtrQ0FBMUJDLG9CO3lCQUNpQixlO3lCQUFqQkMsVztnQ0FDd0Isc0I7Z0NBQXhCQyxrQjt5QkFDaUIsZTt5QkFBakJDLFc7MEJBQ2tCLGdCOzBCQUFsQkMsWSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGNvcmVcbmV4cG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuL1RlbXBsYXRlVGFnJztcblxuLy8gdHJhbnNmb3JtZXJzXG5leHBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcbmV4cG9ydCBzdHJpcEluZGVudFRyYW5zZm9ybWVyIGZyb20gJy4vc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcic7XG5leHBvcnQgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4vcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyJztcbmV4cG9ydCByZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIgZnJvbSAnLi9yZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXInO1xuZXhwb3J0IHJlcGxhY2VTdHJpbmdUcmFuc2Zvcm1lciBmcm9tICcuL3JlcGxhY2VTdHJpbmdUcmFuc2Zvcm1lcic7XG5leHBvcnQgaW5saW5lQXJyYXlUcmFuc2Zvcm1lciBmcm9tICcuL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuZXhwb3J0IHNwbGl0U3RyaW5nVHJhbnNmb3JtZXIgZnJvbSAnLi9zcGxpdFN0cmluZ1RyYW5zZm9ybWVyJztcbmV4cG9ydCByZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyIGZyb20gJy4vcmVtb3ZlTm9uUHJpbnRpbmdWYWx1ZXNUcmFuc2Zvcm1lcic7XG5cbi8vIHRhZ3NcbmV4cG9ydCBjb21tYUxpc3RzIGZyb20gJy4vY29tbWFMaXN0cyc7XG5leHBvcnQgY29tbWFMaXN0c0FuZCBmcm9tICcuL2NvbW1hTGlzdHNBbmQnO1xuZXhwb3J0IGNvbW1hTGlzdHNPciBmcm9tICcuL2NvbW1hTGlzdHNPcic7XG5leHBvcnQgaHRtbCBmcm9tICcuL2h0bWwnO1xuZXhwb3J0IGNvZGVCbG9jayBmcm9tICcuL2NvZGVCbG9jayc7XG5leHBvcnQgc291cmNlIGZyb20gJy4vc291cmNlJztcbmV4cG9ydCBzYWZlSHRtbCBmcm9tICcuL3NhZmVIdG1sJztcbmV4cG9ydCBvbmVMaW5lIGZyb20gJy4vb25lTGluZSc7XG5leHBvcnQgb25lTGluZVRyaW0gZnJvbSAnLi9vbmVMaW5lVHJpbSc7XG5leHBvcnQgb25lTGluZUNvbW1hTGlzdHMgZnJvbSAnLi9vbmVMaW5lQ29tbWFMaXN0cyc7XG5leHBvcnQgb25lTGluZUNvbW1hTGlzdHNPciBmcm9tICcuL29uZUxpbmVDb21tYUxpc3RzT3InO1xuZXhwb3J0IG9uZUxpbmVDb21tYUxpc3RzQW5kIGZyb20gJy4vb25lTGluZUNvbW1hTGlzdHNBbmQnO1xuZXhwb3J0IGlubGluZUxpc3RzIGZyb20gJy4vaW5saW5lTGlzdHMnO1xuZXhwb3J0IG9uZUxpbmVJbmxpbmVMaXN0cyBmcm9tICcuL29uZUxpbmVJbmxpbmVMaXN0cyc7XG5leHBvcnQgc3RyaXBJbmRlbnQgZnJvbSAnLi9zdHJpcEluZGVudCc7XG5leHBvcnQgc3RyaXBJbmRlbnRzIGZyb20gJy4vc3RyaXBJbmRlbnRzJztcbiJdfQ==

/***/ }),

/***/ "./node_modules/common-tags/es/inlineArrayTransformer/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/common-tags/es/inlineArrayTransformer/index.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./inlineArrayTransformer */ "./node_modules/common-tags/es/inlineArrayTransformer/inlineArrayTransformer.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmxpbmVBcnJheVRyYW5zZm9ybWVyL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiXSwibWFwcGluZ3MiOiJxQkFBb0IsMEI7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuIl19

/***/ }),

/***/ "./node_modules/common-tags/es/inlineArrayTransformer/inlineArrayTransformer.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/common-tags/es/inlineArrayTransformer/inlineArrayTransformer.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var defaults = {
  separator: '',
  conjunction: '',
  serial: false
};

/**
 * Converts an array substitution to a string containing a list
 * @param  {String} [opts.separator = ''] - the character that separates each item
 * @param  {String} [opts.conjunction = '']  - replace the last separator with this
 * @param  {Boolean} [opts.serial = false] - include the separator before the conjunction? (Oxford comma use-case)
 *
 * @return {Object}                     - a TemplateTag transformer
 */
var inlineArrayTransformer = function inlineArrayTransformer() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaults;
  return {
    onSubstitution: function onSubstitution(substitution, resultSoFar) {
      // only operate on arrays
      if (Array.isArray(substitution)) {
        var arrayLength = substitution.length;
        var separator = opts.separator;
        var conjunction = opts.conjunction;
        var serial = opts.serial;
        // join each item in the array into a string where each item is separated by separator
        // be sure to maintain indentation
        var indent = resultSoFar.match(/(\n?[^\S\n]+)$/);
        if (indent) {
          substitution = substitution.join(separator + indent[1]);
        } else {
          substitution = substitution.join(separator + ' ');
        }
        // if conjunction is set, replace the last separator with conjunction, but only if there is more than one substitution
        if (conjunction && arrayLength > 1) {
          var separatorIndex = substitution.lastIndexOf(separator);
          substitution = substitution.slice(0, separatorIndex) + (serial ? separator : '') + ' ' + conjunction + substitution.slice(separatorIndex + 1);
        }
      }
      return substitution;
    }
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (inlineArrayTransformer);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmxpbmVBcnJheVRyYW5zZm9ybWVyL2lubGluZUFycmF5VHJhbnNmb3JtZXIuanMiXSwibmFtZXMiOlsiZGVmYXVsdHMiLCJzZXBhcmF0b3IiLCJjb25qdW5jdGlvbiIsInNlcmlhbCIsImlubGluZUFycmF5VHJhbnNmb3JtZXIiLCJvcHRzIiwib25TdWJzdGl0dXRpb24iLCJzdWJzdGl0dXRpb24iLCJyZXN1bHRTb0ZhciIsIkFycmF5IiwiaXNBcnJheSIsImFycmF5TGVuZ3RoIiwibGVuZ3RoIiwiaW5kZW50IiwibWF0Y2giLCJqb2luIiwic2VwYXJhdG9ySW5kZXgiLCJsYXN0SW5kZXhPZiIsInNsaWNlIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFNQSxXQUFXO0FBQ2ZDLGFBQVcsRUFESTtBQUVmQyxlQUFhLEVBRkU7QUFHZkMsVUFBUTtBQUhPLENBQWpCOztBQU1BOzs7Ozs7OztBQVFBLElBQU1DLHlCQUF5QixTQUF6QkEsc0JBQXlCO0FBQUEsTUFBQ0MsSUFBRCx1RUFBUUwsUUFBUjtBQUFBLFNBQXNCO0FBQ25ETSxrQkFEbUQsMEJBQ3BDQyxZQURvQyxFQUN0QkMsV0FEc0IsRUFDVDtBQUN4QztBQUNBLFVBQUlDLE1BQU1DLE9BQU4sQ0FBY0gsWUFBZCxDQUFKLEVBQWlDO0FBQy9CLFlBQU1JLGNBQWNKLGFBQWFLLE1BQWpDO0FBQ0EsWUFBTVgsWUFBWUksS0FBS0osU0FBdkI7QUFDQSxZQUFNQyxjQUFjRyxLQUFLSCxXQUF6QjtBQUNBLFlBQU1DLFNBQVNFLEtBQUtGLE1BQXBCO0FBQ0E7QUFDQTtBQUNBLFlBQU1VLFNBQVNMLFlBQVlNLEtBQVosQ0FBa0IsZ0JBQWxCLENBQWY7QUFDQSxZQUFJRCxNQUFKLEVBQVk7QUFDVk4seUJBQWVBLGFBQWFRLElBQWIsQ0FBa0JkLFlBQVlZLE9BQU8sQ0FBUCxDQUE5QixDQUFmO0FBQ0QsU0FGRCxNQUVPO0FBQ0xOLHlCQUFlQSxhQUFhUSxJQUFiLENBQWtCZCxZQUFZLEdBQTlCLENBQWY7QUFDRDtBQUNEO0FBQ0EsWUFBSUMsZUFBZVMsY0FBYyxDQUFqQyxFQUFvQztBQUNsQyxjQUFNSyxpQkFBaUJULGFBQWFVLFdBQWIsQ0FBeUJoQixTQUF6QixDQUF2QjtBQUNBTSx5QkFDRUEsYUFBYVcsS0FBYixDQUFtQixDQUFuQixFQUFzQkYsY0FBdEIsS0FDQ2IsU0FBU0YsU0FBVCxHQUFxQixFQUR0QixJQUVBLEdBRkEsR0FHQUMsV0FIQSxHQUlBSyxhQUFhVyxLQUFiLENBQW1CRixpQkFBaUIsQ0FBcEMsQ0FMRjtBQU1EO0FBQ0Y7QUFDRCxhQUFPVCxZQUFQO0FBQ0Q7QUE1QmtELEdBQXRCO0FBQUEsQ0FBL0I7O0FBK0JBLGVBQWVILHNCQUFmIiwiZmlsZSI6ImlubGluZUFycmF5VHJhbnNmb3JtZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBkZWZhdWx0cyA9IHtcbiAgc2VwYXJhdG9yOiAnJyxcbiAgY29uanVuY3Rpb246ICcnLFxuICBzZXJpYWw6IGZhbHNlLFxufTtcblxuLyoqXG4gKiBDb252ZXJ0cyBhbiBhcnJheSBzdWJzdGl0dXRpb24gdG8gYSBzdHJpbmcgY29udGFpbmluZyBhIGxpc3RcbiAqIEBwYXJhbSAge1N0cmluZ30gW29wdHMuc2VwYXJhdG9yID0gJyddIC0gdGhlIGNoYXJhY3RlciB0aGF0IHNlcGFyYXRlcyBlYWNoIGl0ZW1cbiAqIEBwYXJhbSAge1N0cmluZ30gW29wdHMuY29uanVuY3Rpb24gPSAnJ10gIC0gcmVwbGFjZSB0aGUgbGFzdCBzZXBhcmF0b3Igd2l0aCB0aGlzXG4gKiBAcGFyYW0gIHtCb29sZWFufSBbb3B0cy5zZXJpYWwgPSBmYWxzZV0gLSBpbmNsdWRlIHRoZSBzZXBhcmF0b3IgYmVmb3JlIHRoZSBjb25qdW5jdGlvbj8gKE94Zm9yZCBjb21tYSB1c2UtY2FzZSlcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgLSBhIFRlbXBsYXRlVGFnIHRyYW5zZm9ybWVyXG4gKi9cbmNvbnN0IGlubGluZUFycmF5VHJhbnNmb3JtZXIgPSAob3B0cyA9IGRlZmF1bHRzKSA9PiAoe1xuICBvblN1YnN0aXR1dGlvbihzdWJzdGl0dXRpb24sIHJlc3VsdFNvRmFyKSB7XG4gICAgLy8gb25seSBvcGVyYXRlIG9uIGFycmF5c1xuICAgIGlmIChBcnJheS5pc0FycmF5KHN1YnN0aXR1dGlvbikpIHtcbiAgICAgIGNvbnN0IGFycmF5TGVuZ3RoID0gc3Vic3RpdHV0aW9uLmxlbmd0aDtcbiAgICAgIGNvbnN0IHNlcGFyYXRvciA9IG9wdHMuc2VwYXJhdG9yO1xuICAgICAgY29uc3QgY29uanVuY3Rpb24gPSBvcHRzLmNvbmp1bmN0aW9uO1xuICAgICAgY29uc3Qgc2VyaWFsID0gb3B0cy5zZXJpYWw7XG4gICAgICAvLyBqb2luIGVhY2ggaXRlbSBpbiB0aGUgYXJyYXkgaW50byBhIHN0cmluZyB3aGVyZSBlYWNoIGl0ZW0gaXMgc2VwYXJhdGVkIGJ5IHNlcGFyYXRvclxuICAgICAgLy8gYmUgc3VyZSB0byBtYWludGFpbiBpbmRlbnRhdGlvblxuICAgICAgY29uc3QgaW5kZW50ID0gcmVzdWx0U29GYXIubWF0Y2goLyhcXG4/W15cXFNcXG5dKykkLyk7XG4gICAgICBpZiAoaW5kZW50KSB7XG4gICAgICAgIHN1YnN0aXR1dGlvbiA9IHN1YnN0aXR1dGlvbi5qb2luKHNlcGFyYXRvciArIGluZGVudFsxXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdWJzdGl0dXRpb24gPSBzdWJzdGl0dXRpb24uam9pbihzZXBhcmF0b3IgKyAnICcpO1xuICAgICAgfVxuICAgICAgLy8gaWYgY29uanVuY3Rpb24gaXMgc2V0LCByZXBsYWNlIHRoZSBsYXN0IHNlcGFyYXRvciB3aXRoIGNvbmp1bmN0aW9uLCBidXQgb25seSBpZiB0aGVyZSBpcyBtb3JlIHRoYW4gb25lIHN1YnN0aXR1dGlvblxuICAgICAgaWYgKGNvbmp1bmN0aW9uICYmIGFycmF5TGVuZ3RoID4gMSkge1xuICAgICAgICBjb25zdCBzZXBhcmF0b3JJbmRleCA9IHN1YnN0aXR1dGlvbi5sYXN0SW5kZXhPZihzZXBhcmF0b3IpO1xuICAgICAgICBzdWJzdGl0dXRpb24gPVxuICAgICAgICAgIHN1YnN0aXR1dGlvbi5zbGljZSgwLCBzZXBhcmF0b3JJbmRleCkgK1xuICAgICAgICAgIChzZXJpYWwgPyBzZXBhcmF0b3IgOiAnJykgK1xuICAgICAgICAgICcgJyArXG4gICAgICAgICAgY29uanVuY3Rpb24gK1xuICAgICAgICAgIHN1YnN0aXR1dGlvbi5zbGljZShzZXBhcmF0b3JJbmRleCArIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3Vic3RpdHV0aW9uO1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGlubGluZUFycmF5VHJhbnNmb3JtZXI7XG4iXX0=

/***/ }),

/***/ "./node_modules/common-tags/es/inlineLists/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/common-tags/es/inlineLists/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _inlineLists__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _inlineLists__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./inlineLists */ "./node_modules/common-tags/es/inlineLists/inlineLists.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmxpbmVMaXN0cy9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Il0sIm1hcHBpbmdzIjoicUJBQW9CLGU7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL2lubGluZUxpc3RzJztcbiJdfQ==

/***/ }),

/***/ "./node_modules/common-tags/es/inlineLists/inlineLists.js":
/*!****************************************************************!*\
  !*** ./node_modules/common-tags/es/inlineLists/inlineLists.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TemplateTag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../TemplateTag */ "./node_modules/common-tags/es/TemplateTag/index.js");
/* harmony import */ var _stripIndentTransformer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../stripIndentTransformer */ "./node_modules/common-tags/es/stripIndentTransformer/index.js");
/* harmony import */ var _inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../inlineArrayTransformer */ "./node_modules/common-tags/es/inlineArrayTransformer/index.js");
/* harmony import */ var _trimResultTransformer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../trimResultTransformer */ "./node_modules/common-tags/es/trimResultTransformer/index.js");





var inlineLists = new _TemplateTag__WEBPACK_IMPORTED_MODULE_0__["default"](_inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_2__["default"], _stripIndentTransformer__WEBPACK_IMPORTED_MODULE_1__["default"], _trimResultTransformer__WEBPACK_IMPORTED_MODULE_3__["default"]);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (inlineLists);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmxpbmVMaXN0cy9pbmxpbmVMaXN0cy5qcyJdLCJuYW1lcyI6WyJUZW1wbGF0ZVRhZyIsInN0cmlwSW5kZW50VHJhbnNmb3JtZXIiLCJpbmxpbmVBcnJheVRyYW5zZm9ybWVyIiwidHJpbVJlc3VsdFRyYW5zZm9ybWVyIiwiaW5saW5lTGlzdHMiXSwibWFwcGluZ3MiOiJBQUFBLE9BQU9BLFdBQVAsTUFBd0IsZ0JBQXhCO0FBQ0EsT0FBT0Msc0JBQVAsTUFBbUMsMkJBQW5DO0FBQ0EsT0FBT0Msc0JBQVAsTUFBbUMsMkJBQW5DO0FBQ0EsT0FBT0MscUJBQVAsTUFBa0MsMEJBQWxDOztBQUVBLElBQU1DLGNBQWMsSUFBSUosV0FBSixDQUNsQkUsc0JBRGtCLEVBRWxCRCxzQkFGa0IsRUFHbEJFLHFCQUhrQixDQUFwQjs7QUFNQSxlQUFlQyxXQUFmIiwiZmlsZSI6ImlubGluZUxpc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBzdHJpcEluZGVudFRyYW5zZm9ybWVyIGZyb20gJy4uL3N0cmlwSW5kZW50VHJhbnNmb3JtZXInO1xuaW1wb3J0IGlubGluZUFycmF5VHJhbnNmb3JtZXIgZnJvbSAnLi4vaW5saW5lQXJyYXlUcmFuc2Zvcm1lcic7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5cbmNvbnN0IGlubGluZUxpc3RzID0gbmV3IFRlbXBsYXRlVGFnKFxuICBpbmxpbmVBcnJheVRyYW5zZm9ybWVyLFxuICBzdHJpcEluZGVudFRyYW5zZm9ybWVyLFxuICB0cmltUmVzdWx0VHJhbnNmb3JtZXIsXG4pO1xuXG5leHBvcnQgZGVmYXVsdCBpbmxpbmVMaXN0cztcbiJdfQ==

/***/ }),

/***/ "./node_modules/common-tags/es/oneLine/index.js":
/*!******************************************************!*\
  !*** ./node_modules/common-tags/es/oneLine/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _oneLine__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _oneLine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./oneLine */ "./node_modules/common-tags/es/oneLine/oneLine.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiXSwibWFwcGluZ3MiOiJxQkFBb0IsVztxQkFBYkEsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZyb20gJy4vb25lTGluZSc7XG4iXX0=

/***/ }),

/***/ "./node_modules/common-tags/es/oneLine/oneLine.js":
/*!********************************************************!*\
  !*** ./node_modules/common-tags/es/oneLine/oneLine.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TemplateTag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../TemplateTag */ "./node_modules/common-tags/es/TemplateTag/index.js");
/* harmony import */ var _trimResultTransformer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../trimResultTransformer */ "./node_modules/common-tags/es/trimResultTransformer/index.js");
/* harmony import */ var _replaceResultTransformer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../replaceResultTransformer */ "./node_modules/common-tags/es/replaceResultTransformer/index.js");




var oneLine = new _TemplateTag__WEBPACK_IMPORTED_MODULE_0__["default"]((0,_replaceResultTransformer__WEBPACK_IMPORTED_MODULE_2__["default"])(/(?:\n(?:\s*))+/g, ' '), _trimResultTransformer__WEBPACK_IMPORTED_MODULE_1__["default"]);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (oneLine);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lL29uZUxpbmUuanMiXSwibmFtZXMiOlsiVGVtcGxhdGVUYWciLCJ0cmltUmVzdWx0VHJhbnNmb3JtZXIiLCJyZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIiLCJvbmVMaW5lIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxXQUFQLE1BQXdCLGdCQUF4QjtBQUNBLE9BQU9DLHFCQUFQLE1BQWtDLDBCQUFsQztBQUNBLE9BQU9DLHdCQUFQLE1BQXFDLDZCQUFyQzs7QUFFQSxJQUFNQyxVQUFVLElBQUlILFdBQUosQ0FDZEUseUJBQXlCLGlCQUF6QixFQUE0QyxHQUE1QyxDQURjLEVBRWRELHFCQUZjLENBQWhCOztBQUtBLGVBQWVFLE9BQWYiLCJmaWxlIjoib25lTGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5pbXBvcnQgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3JlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcic7XG5cbmNvbnN0IG9uZUxpbmUgPSBuZXcgVGVtcGxhdGVUYWcoXG4gIHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcigvKD86XFxuKD86XFxzKikpKy9nLCAnICcpLFxuICB0cmltUmVzdWx0VHJhbnNmb3JtZXIsXG4pO1xuXG5leHBvcnQgZGVmYXVsdCBvbmVMaW5lO1xuIl19

/***/ }),

/***/ "./node_modules/common-tags/es/oneLineCommaLists/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/common-tags/es/oneLineCommaLists/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _oneLineCommaLists__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _oneLineCommaLists__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./oneLineCommaLists */ "./node_modules/common-tags/es/oneLineCommaLists/oneLineCommaLists.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lQ29tbWFMaXN0cy9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Il0sIm1hcHBpbmdzIjoicUJBQW9CLHFCO3FCQUFiQSxPIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnJvbSAnLi9vbmVMaW5lQ29tbWFMaXN0cyc7XG4iXX0=

/***/ }),

/***/ "./node_modules/common-tags/es/oneLineCommaLists/oneLineCommaLists.js":
/*!****************************************************************************!*\
  !*** ./node_modules/common-tags/es/oneLineCommaLists/oneLineCommaLists.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TemplateTag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../TemplateTag */ "./node_modules/common-tags/es/TemplateTag/index.js");
/* harmony import */ var _inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../inlineArrayTransformer */ "./node_modules/common-tags/es/inlineArrayTransformer/index.js");
/* harmony import */ var _trimResultTransformer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../trimResultTransformer */ "./node_modules/common-tags/es/trimResultTransformer/index.js");
/* harmony import */ var _replaceResultTransformer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../replaceResultTransformer */ "./node_modules/common-tags/es/replaceResultTransformer/index.js");





var oneLineCommaLists = new _TemplateTag__WEBPACK_IMPORTED_MODULE_0__["default"]((0,_inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_1__["default"])({ separator: ',' }), (0,_replaceResultTransformer__WEBPACK_IMPORTED_MODULE_3__["default"])(/(?:\s+)/g, ' '), _trimResultTransformer__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (oneLineCommaLists);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lQ29tbWFMaXN0cy9vbmVMaW5lQ29tbWFMaXN0cy5qcyJdLCJuYW1lcyI6WyJUZW1wbGF0ZVRhZyIsImlubGluZUFycmF5VHJhbnNmb3JtZXIiLCJ0cmltUmVzdWx0VHJhbnNmb3JtZXIiLCJyZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIiLCJvbmVMaW5lQ29tbWFMaXN0cyIsInNlcGFyYXRvciJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsV0FBUCxNQUF3QixnQkFBeEI7QUFDQSxPQUFPQyxzQkFBUCxNQUFtQywyQkFBbkM7QUFDQSxPQUFPQyxxQkFBUCxNQUFrQywwQkFBbEM7QUFDQSxPQUFPQyx3QkFBUCxNQUFxQyw2QkFBckM7O0FBRUEsSUFBTUMsb0JBQW9CLElBQUlKLFdBQUosQ0FDeEJDLHVCQUF1QixFQUFFSSxXQUFXLEdBQWIsRUFBdkIsQ0FEd0IsRUFFeEJGLHlCQUF5QixVQUF6QixFQUFxQyxHQUFyQyxDQUZ3QixFQUd4QkQscUJBSHdCLENBQTFCOztBQU1BLGVBQWVFLGlCQUFmIiwiZmlsZSI6Im9uZUxpbmVDb21tYUxpc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyIGZyb20gJy4uL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuaW1wb3J0IHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXInO1xuXG5jb25zdCBvbmVMaW5lQ29tbWFMaXN0cyA9IG5ldyBUZW1wbGF0ZVRhZyhcbiAgaW5saW5lQXJyYXlUcmFuc2Zvcm1lcih7IHNlcGFyYXRvcjogJywnIH0pLFxuICByZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIoLyg/OlxccyspL2csICcgJyksXG4gIHRyaW1SZXN1bHRUcmFuc2Zvcm1lcixcbik7XG5cbmV4cG9ydCBkZWZhdWx0IG9uZUxpbmVDb21tYUxpc3RzO1xuIl19

/***/ }),

/***/ "./node_modules/common-tags/es/oneLineCommaListsAnd/index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/common-tags/es/oneLineCommaListsAnd/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _oneLineCommaListsAnd__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _oneLineCommaListsAnd__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./oneLineCommaListsAnd */ "./node_modules/common-tags/es/oneLineCommaListsAnd/oneLineCommaListsAnd.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lQ29tbWFMaXN0c0FuZC9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Il0sIm1hcHBpbmdzIjoicUJBQW9CLHdCO3FCQUFiQSxPIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnJvbSAnLi9vbmVMaW5lQ29tbWFMaXN0c0FuZCc7XG4iXX0=

/***/ }),

/***/ "./node_modules/common-tags/es/oneLineCommaListsAnd/oneLineCommaListsAnd.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/common-tags/es/oneLineCommaListsAnd/oneLineCommaListsAnd.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TemplateTag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../TemplateTag */ "./node_modules/common-tags/es/TemplateTag/index.js");
/* harmony import */ var _inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../inlineArrayTransformer */ "./node_modules/common-tags/es/inlineArrayTransformer/index.js");
/* harmony import */ var _trimResultTransformer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../trimResultTransformer */ "./node_modules/common-tags/es/trimResultTransformer/index.js");
/* harmony import */ var _replaceResultTransformer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../replaceResultTransformer */ "./node_modules/common-tags/es/replaceResultTransformer/index.js");





var oneLineCommaListsAnd = new _TemplateTag__WEBPACK_IMPORTED_MODULE_0__["default"]((0,_inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_1__["default"])({ separator: ',', conjunction: 'and' }), (0,_replaceResultTransformer__WEBPACK_IMPORTED_MODULE_3__["default"])(/(?:\s+)/g, ' '), _trimResultTransformer__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (oneLineCommaListsAnd);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lQ29tbWFMaXN0c0FuZC9vbmVMaW5lQ29tbWFMaXN0c0FuZC5qcyJdLCJuYW1lcyI6WyJUZW1wbGF0ZVRhZyIsImlubGluZUFycmF5VHJhbnNmb3JtZXIiLCJ0cmltUmVzdWx0VHJhbnNmb3JtZXIiLCJyZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIiLCJvbmVMaW5lQ29tbWFMaXN0c0FuZCIsInNlcGFyYXRvciIsImNvbmp1bmN0aW9uIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxXQUFQLE1BQXdCLGdCQUF4QjtBQUNBLE9BQU9DLHNCQUFQLE1BQW1DLDJCQUFuQztBQUNBLE9BQU9DLHFCQUFQLE1BQWtDLDBCQUFsQztBQUNBLE9BQU9DLHdCQUFQLE1BQXFDLDZCQUFyQzs7QUFFQSxJQUFNQyx1QkFBdUIsSUFBSUosV0FBSixDQUMzQkMsdUJBQXVCLEVBQUVJLFdBQVcsR0FBYixFQUFrQkMsYUFBYSxLQUEvQixFQUF2QixDQUQyQixFQUUzQkgseUJBQXlCLFVBQXpCLEVBQXFDLEdBQXJDLENBRjJCLEVBRzNCRCxxQkFIMkIsQ0FBN0I7O0FBTUEsZUFBZUUsb0JBQWYiLCJmaWxlIjoib25lTGluZUNvbW1hTGlzdHNBbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGVtcGxhdGVUYWcgZnJvbSAnLi4vVGVtcGxhdGVUYWcnO1xuaW1wb3J0IGlubGluZUFycmF5VHJhbnNmb3JtZXIgZnJvbSAnLi4vaW5saW5lQXJyYXlUcmFuc2Zvcm1lcic7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5pbXBvcnQgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3JlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcic7XG5cbmNvbnN0IG9uZUxpbmVDb21tYUxpc3RzQW5kID0gbmV3IFRlbXBsYXRlVGFnKFxuICBpbmxpbmVBcnJheVRyYW5zZm9ybWVyKHsgc2VwYXJhdG9yOiAnLCcsIGNvbmp1bmN0aW9uOiAnYW5kJyB9KSxcbiAgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyKC8oPzpcXHMrKS9nLCAnICcpLFxuICB0cmltUmVzdWx0VHJhbnNmb3JtZXIsXG4pO1xuXG5leHBvcnQgZGVmYXVsdCBvbmVMaW5lQ29tbWFMaXN0c0FuZDtcbiJdfQ==

/***/ }),

/***/ "./node_modules/common-tags/es/oneLineCommaListsOr/index.js":
/*!******************************************************************!*\
  !*** ./node_modules/common-tags/es/oneLineCommaListsOr/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _oneLineCommaListsOr__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _oneLineCommaListsOr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./oneLineCommaListsOr */ "./node_modules/common-tags/es/oneLineCommaListsOr/oneLineCommaListsOr.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lQ29tbWFMaXN0c09yL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiXSwibWFwcGluZ3MiOiJxQkFBb0IsdUI7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL29uZUxpbmVDb21tYUxpc3RzT3InO1xuIl19

/***/ }),

/***/ "./node_modules/common-tags/es/oneLineCommaListsOr/oneLineCommaListsOr.js":
/*!********************************************************************************!*\
  !*** ./node_modules/common-tags/es/oneLineCommaListsOr/oneLineCommaListsOr.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TemplateTag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../TemplateTag */ "./node_modules/common-tags/es/TemplateTag/index.js");
/* harmony import */ var _inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../inlineArrayTransformer */ "./node_modules/common-tags/es/inlineArrayTransformer/index.js");
/* harmony import */ var _trimResultTransformer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../trimResultTransformer */ "./node_modules/common-tags/es/trimResultTransformer/index.js");
/* harmony import */ var _replaceResultTransformer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../replaceResultTransformer */ "./node_modules/common-tags/es/replaceResultTransformer/index.js");





var oneLineCommaListsOr = new _TemplateTag__WEBPACK_IMPORTED_MODULE_0__["default"]((0,_inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_1__["default"])({ separator: ',', conjunction: 'or' }), (0,_replaceResultTransformer__WEBPACK_IMPORTED_MODULE_3__["default"])(/(?:\s+)/g, ' '), _trimResultTransformer__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (oneLineCommaListsOr);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lQ29tbWFMaXN0c09yL29uZUxpbmVDb21tYUxpc3RzT3IuanMiXSwibmFtZXMiOlsiVGVtcGxhdGVUYWciLCJpbmxpbmVBcnJheVRyYW5zZm9ybWVyIiwidHJpbVJlc3VsdFRyYW5zZm9ybWVyIiwicmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyIiwib25lTGluZUNvbW1hTGlzdHNPciIsInNlcGFyYXRvciIsImNvbmp1bmN0aW9uIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxXQUFQLE1BQXdCLGdCQUF4QjtBQUNBLE9BQU9DLHNCQUFQLE1BQW1DLDJCQUFuQztBQUNBLE9BQU9DLHFCQUFQLE1BQWtDLDBCQUFsQztBQUNBLE9BQU9DLHdCQUFQLE1BQXFDLDZCQUFyQzs7QUFFQSxJQUFNQyxzQkFBc0IsSUFBSUosV0FBSixDQUMxQkMsdUJBQXVCLEVBQUVJLFdBQVcsR0FBYixFQUFrQkMsYUFBYSxJQUEvQixFQUF2QixDQUQwQixFQUUxQkgseUJBQXlCLFVBQXpCLEVBQXFDLEdBQXJDLENBRjBCLEVBRzFCRCxxQkFIMEIsQ0FBNUI7O0FBTUEsZUFBZUUsbUJBQWYiLCJmaWxlIjoib25lTGluZUNvbW1hTGlzdHNPci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgaW5saW5lQXJyYXlUcmFuc2Zvcm1lciBmcm9tICcuLi9pbmxpbmVBcnJheVRyYW5zZm9ybWVyJztcbmltcG9ydCB0cmltUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcbmltcG9ydCByZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyJztcblxuY29uc3Qgb25lTGluZUNvbW1hTGlzdHNPciA9IG5ldyBUZW1wbGF0ZVRhZyhcbiAgaW5saW5lQXJyYXlUcmFuc2Zvcm1lcih7IHNlcGFyYXRvcjogJywnLCBjb25qdW5jdGlvbjogJ29yJyB9KSxcbiAgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyKC8oPzpcXHMrKS9nLCAnICcpLFxuICB0cmltUmVzdWx0VHJhbnNmb3JtZXIsXG4pO1xuXG5leHBvcnQgZGVmYXVsdCBvbmVMaW5lQ29tbWFMaXN0c09yO1xuIl19

/***/ }),

/***/ "./node_modules/common-tags/es/oneLineInlineLists/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/common-tags/es/oneLineInlineLists/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _oneLineInlineLists__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _oneLineInlineLists__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./oneLineInlineLists */ "./node_modules/common-tags/es/oneLineInlineLists/oneLineInlineLists.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lSW5saW5lTGlzdHMvaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdCJdLCJtYXBwaW5ncyI6InFCQUFvQixzQjtxQkFBYkEsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZyb20gJy4vb25lTGluZUlubGluZUxpc3RzJztcbiJdfQ==

/***/ }),

/***/ "./node_modules/common-tags/es/oneLineInlineLists/oneLineInlineLists.js":
/*!******************************************************************************!*\
  !*** ./node_modules/common-tags/es/oneLineInlineLists/oneLineInlineLists.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TemplateTag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../TemplateTag */ "./node_modules/common-tags/es/TemplateTag/index.js");
/* harmony import */ var _inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../inlineArrayTransformer */ "./node_modules/common-tags/es/inlineArrayTransformer/index.js");
/* harmony import */ var _trimResultTransformer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../trimResultTransformer */ "./node_modules/common-tags/es/trimResultTransformer/index.js");
/* harmony import */ var _replaceResultTransformer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../replaceResultTransformer */ "./node_modules/common-tags/es/replaceResultTransformer/index.js");





var oneLineInlineLists = new _TemplateTag__WEBPACK_IMPORTED_MODULE_0__["default"](_inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_1__["default"], (0,_replaceResultTransformer__WEBPACK_IMPORTED_MODULE_3__["default"])(/(?:\s+)/g, ' '), _trimResultTransformer__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (oneLineInlineLists);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lSW5saW5lTGlzdHMvb25lTGluZUlubGluZUxpc3RzLmpzIl0sIm5hbWVzIjpbIlRlbXBsYXRlVGFnIiwiaW5saW5lQXJyYXlUcmFuc2Zvcm1lciIsInRyaW1SZXN1bHRUcmFuc2Zvcm1lciIsInJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciIsIm9uZUxpbmVJbmxpbmVMaXN0cyJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsV0FBUCxNQUF3QixnQkFBeEI7QUFDQSxPQUFPQyxzQkFBUCxNQUFtQywyQkFBbkM7QUFDQSxPQUFPQyxxQkFBUCxNQUFrQywwQkFBbEM7QUFDQSxPQUFPQyx3QkFBUCxNQUFxQyw2QkFBckM7O0FBRUEsSUFBTUMscUJBQXFCLElBQUlKLFdBQUosQ0FDekJDLHNCQUR5QixFQUV6QkUseUJBQXlCLFVBQXpCLEVBQXFDLEdBQXJDLENBRnlCLEVBR3pCRCxxQkFIeUIsQ0FBM0I7O0FBTUEsZUFBZUUsa0JBQWYiLCJmaWxlIjoib25lTGluZUlubGluZUxpc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyIGZyb20gJy4uL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuaW1wb3J0IHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXInO1xuXG5jb25zdCBvbmVMaW5lSW5saW5lTGlzdHMgPSBuZXcgVGVtcGxhdGVUYWcoXG4gIGlubGluZUFycmF5VHJhbnNmb3JtZXIsXG4gIHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcigvKD86XFxzKykvZywgJyAnKSxcbiAgdHJpbVJlc3VsdFRyYW5zZm9ybWVyLFxuKTtcblxuZXhwb3J0IGRlZmF1bHQgb25lTGluZUlubGluZUxpc3RzO1xuIl19

/***/ }),

/***/ "./node_modules/common-tags/es/oneLineTrim/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/common-tags/es/oneLineTrim/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _oneLineTrim__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _oneLineTrim__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./oneLineTrim */ "./node_modules/common-tags/es/oneLineTrim/oneLineTrim.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lVHJpbS9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Il0sIm1hcHBpbmdzIjoicUJBQW9CLGU7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL29uZUxpbmVUcmltJztcbiJdfQ==

/***/ }),

/***/ "./node_modules/common-tags/es/oneLineTrim/oneLineTrim.js":
/*!****************************************************************!*\
  !*** ./node_modules/common-tags/es/oneLineTrim/oneLineTrim.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TemplateTag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../TemplateTag */ "./node_modules/common-tags/es/TemplateTag/index.js");
/* harmony import */ var _trimResultTransformer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../trimResultTransformer */ "./node_modules/common-tags/es/trimResultTransformer/index.js");
/* harmony import */ var _replaceResultTransformer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../replaceResultTransformer */ "./node_modules/common-tags/es/replaceResultTransformer/index.js");




var oneLineTrim = new _TemplateTag__WEBPACK_IMPORTED_MODULE_0__["default"]((0,_replaceResultTransformer__WEBPACK_IMPORTED_MODULE_2__["default"])(/(?:\n\s*)/g, ''), _trimResultTransformer__WEBPACK_IMPORTED_MODULE_1__["default"]);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (oneLineTrim);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbmVMaW5lVHJpbS9vbmVMaW5lVHJpbS5qcyJdLCJuYW1lcyI6WyJUZW1wbGF0ZVRhZyIsInRyaW1SZXN1bHRUcmFuc2Zvcm1lciIsInJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciIsIm9uZUxpbmVUcmltIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxXQUFQLE1BQXdCLGdCQUF4QjtBQUNBLE9BQU9DLHFCQUFQLE1BQWtDLDBCQUFsQztBQUNBLE9BQU9DLHdCQUFQLE1BQXFDLDZCQUFyQzs7QUFFQSxJQUFNQyxjQUFjLElBQUlILFdBQUosQ0FDbEJFLHlCQUF5QixZQUF6QixFQUF1QyxFQUF2QyxDQURrQixFQUVsQkQscUJBRmtCLENBQXBCOztBQUtBLGVBQWVFLFdBQWYiLCJmaWxlIjoib25lTGluZVRyaW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGVtcGxhdGVUYWcgZnJvbSAnLi4vVGVtcGxhdGVUYWcnO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuaW1wb3J0IHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXInO1xuXG5jb25zdCBvbmVMaW5lVHJpbSA9IG5ldyBUZW1wbGF0ZVRhZyhcbiAgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyKC8oPzpcXG5cXHMqKS9nLCAnJyksXG4gIHRyaW1SZXN1bHRUcmFuc2Zvcm1lcixcbik7XG5cbmV4cG9ydCBkZWZhdWx0IG9uZUxpbmVUcmltO1xuIl19

/***/ }),

/***/ "./node_modules/common-tags/es/removeNonPrintingValuesTransformer/index.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/common-tags/es/removeNonPrintingValuesTransformer/index.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _removeNonPrintingValuesTransformer__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _removeNonPrintingValuesTransformer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./removeNonPrintingValuesTransformer */ "./node_modules/common-tags/es/removeNonPrintingValuesTransformer/removeNonPrintingValuesTransformer.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiXSwibWFwcGluZ3MiOiJxQkFBb0Isc0M7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL3JlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXInO1xuIl19

/***/ }),

/***/ "./node_modules/common-tags/es/removeNonPrintingValuesTransformer/removeNonPrintingValuesTransformer.js":
/*!**************************************************************************************************************!*\
  !*** ./node_modules/common-tags/es/removeNonPrintingValuesTransformer/removeNonPrintingValuesTransformer.js ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var isValidValue = function isValidValue(x) {
  return x != null && !Number.isNaN(x) && typeof x !== 'boolean';
};

var removeNonPrintingValuesTransformer = function removeNonPrintingValuesTransformer() {
  return {
    onSubstitution: function onSubstitution(substitution) {
      if (Array.isArray(substitution)) {
        return substitution.filter(isValidValue);
      }
      if (isValidValue(substitution)) {
        return substitution;
      }
      return '';
    }
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (removeNonPrintingValuesTransformer);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyL3JlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXIuanMiXSwibmFtZXMiOlsiaXNWYWxpZFZhbHVlIiwieCIsIk51bWJlciIsImlzTmFOIiwicmVtb3ZlTm9uUHJpbnRpbmdWYWx1ZXNUcmFuc2Zvcm1lciIsIm9uU3Vic3RpdHV0aW9uIiwic3Vic3RpdHV0aW9uIiwiQXJyYXkiLCJpc0FycmF5IiwiZmlsdGVyIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFNQSxlQUFlLFNBQWZBLFlBQWU7QUFBQSxTQUNuQkMsS0FBSyxJQUFMLElBQWEsQ0FBQ0MsT0FBT0MsS0FBUCxDQUFhRixDQUFiLENBQWQsSUFBaUMsT0FBT0EsQ0FBUCxLQUFhLFNBRDNCO0FBQUEsQ0FBckI7O0FBR0EsSUFBTUcscUNBQXFDLFNBQXJDQSxrQ0FBcUM7QUFBQSxTQUFPO0FBQ2hEQyxrQkFEZ0QsMEJBQ2pDQyxZQURpQyxFQUNuQjtBQUMzQixVQUFJQyxNQUFNQyxPQUFOLENBQWNGLFlBQWQsQ0FBSixFQUFpQztBQUMvQixlQUFPQSxhQUFhRyxNQUFiLENBQW9CVCxZQUFwQixDQUFQO0FBQ0Q7QUFDRCxVQUFJQSxhQUFhTSxZQUFiLENBQUosRUFBZ0M7QUFDOUIsZUFBT0EsWUFBUDtBQUNEO0FBQ0QsYUFBTyxFQUFQO0FBQ0Q7QUFUK0MsR0FBUDtBQUFBLENBQTNDOztBQVlBLGVBQWVGLGtDQUFmIiwiZmlsZSI6InJlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBpc1ZhbGlkVmFsdWUgPSB4ID0+XG4gIHggIT0gbnVsbCAmJiAhTnVtYmVyLmlzTmFOKHgpICYmIHR5cGVvZiB4ICE9PSAnYm9vbGVhbic7XG5cbmNvbnN0IHJlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXIgPSAoKSA9PiAoe1xuICBvblN1YnN0aXR1dGlvbihzdWJzdGl0dXRpb24pIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzdWJzdGl0dXRpb24pKSB7XG4gICAgICByZXR1cm4gc3Vic3RpdHV0aW9uLmZpbHRlcihpc1ZhbGlkVmFsdWUpO1xuICAgIH1cbiAgICBpZiAoaXNWYWxpZFZhbHVlKHN1YnN0aXR1dGlvbikpIHtcbiAgICAgIHJldHVybiBzdWJzdGl0dXRpb247XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCByZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyO1xuIl19

/***/ }),

/***/ "./node_modules/common-tags/es/replaceResultTransformer/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/common-tags/es/replaceResultTransformer/index.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _replaceResultTransformer__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _replaceResultTransformer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./replaceResultTransformer */ "./node_modules/common-tags/es/replaceResultTransformer/replaceResultTransformer.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIvaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdCJdLCJtYXBwaW5ncyI6InFCQUFvQiw0QjtxQkFBYkEsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZyb20gJy4vcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyJztcbiJdfQ==

/***/ }),

/***/ "./node_modules/common-tags/es/replaceResultTransformer/replaceResultTransformer.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/common-tags/es/replaceResultTransformer/replaceResultTransformer.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Replaces tabs, newlines and spaces with the chosen value when they occur in sequences
 * @param  {(String|RegExp)} replaceWhat - the value or pattern that should be replaced
 * @param  {*}               replaceWith - the replacement value
 * @return {Object}                      - a TemplateTag transformer
 */
var replaceResultTransformer = function replaceResultTransformer(replaceWhat, replaceWith) {
  return {
    onEndResult: function onEndResult(endResult) {
      if (replaceWhat == null || replaceWith == null) {
        throw new Error('replaceResultTransformer requires at least 2 arguments.');
      }
      return endResult.replace(replaceWhat, replaceWith);
    }
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (replaceResultTransformer);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIvcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyLmpzIl0sIm5hbWVzIjpbInJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciIsInJlcGxhY2VXaGF0IiwicmVwbGFjZVdpdGgiLCJvbkVuZFJlc3VsdCIsImVuZFJlc3VsdCIsIkVycm9yIiwicmVwbGFjZSJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQU1BLElBQU1BLDJCQUEyQixTQUEzQkEsd0JBQTJCLENBQUNDLFdBQUQsRUFBY0MsV0FBZDtBQUFBLFNBQStCO0FBQzlEQyxlQUQ4RCx1QkFDbERDLFNBRGtELEVBQ3ZDO0FBQ3JCLFVBQUlILGVBQWUsSUFBZixJQUF1QkMsZUFBZSxJQUExQyxFQUFnRDtBQUM5QyxjQUFNLElBQUlHLEtBQUosQ0FDSix5REFESSxDQUFOO0FBR0Q7QUFDRCxhQUFPRCxVQUFVRSxPQUFWLENBQWtCTCxXQUFsQixFQUErQkMsV0FBL0IsQ0FBUDtBQUNEO0FBUjZELEdBQS9CO0FBQUEsQ0FBakM7O0FBV0EsZUFBZUYsd0JBQWYiLCJmaWxlIjoicmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBSZXBsYWNlcyB0YWJzLCBuZXdsaW5lcyBhbmQgc3BhY2VzIHdpdGggdGhlIGNob3NlbiB2YWx1ZSB3aGVuIHRoZXkgb2NjdXIgaW4gc2VxdWVuY2VzXG4gKiBAcGFyYW0gIHsoU3RyaW5nfFJlZ0V4cCl9IHJlcGxhY2VXaGF0IC0gdGhlIHZhbHVlIG9yIHBhdHRlcm4gdGhhdCBzaG91bGQgYmUgcmVwbGFjZWRcbiAqIEBwYXJhbSAgeyp9ICAgICAgICAgICAgICAgcmVwbGFjZVdpdGggLSB0aGUgcmVwbGFjZW1lbnQgdmFsdWVcbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAgLSBhIFRlbXBsYXRlVGFnIHRyYW5zZm9ybWVyXG4gKi9cbmNvbnN0IHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciA9IChyZXBsYWNlV2hhdCwgcmVwbGFjZVdpdGgpID0+ICh7XG4gIG9uRW5kUmVzdWx0KGVuZFJlc3VsdCkge1xuICAgIGlmIChyZXBsYWNlV2hhdCA9PSBudWxsIHx8IHJlcGxhY2VXaXRoID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ3JlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciByZXF1aXJlcyBhdCBsZWFzdCAyIGFyZ3VtZW50cy4nLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIGVuZFJlc3VsdC5yZXBsYWNlKHJlcGxhY2VXaGF0LCByZXBsYWNlV2l0aCk7XG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyO1xuIl19

/***/ }),

/***/ "./node_modules/common-tags/es/replaceStringTransformer/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/common-tags/es/replaceStringTransformer/index.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _replaceStringTransformer__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _replaceStringTransformer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./replaceStringTransformer */ "./node_modules/common-tags/es/replaceStringTransformer/replaceStringTransformer.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBsYWNlU3RyaW5nVHJhbnNmb3JtZXIvaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdCJdLCJtYXBwaW5ncyI6InFCQUFvQiw0QjtxQkFBYkEsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZyb20gJy4vcmVwbGFjZVN0cmluZ1RyYW5zZm9ybWVyJztcbiJdfQ==

/***/ }),

/***/ "./node_modules/common-tags/es/replaceStringTransformer/replaceStringTransformer.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/common-tags/es/replaceStringTransformer/replaceStringTransformer.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var replaceStringTransformer = function replaceStringTransformer(replaceWhat, replaceWith) {
  return {
    onString: function onString(str) {
      if (replaceWhat == null || replaceWith == null) {
        throw new Error('replaceStringTransformer requires at least 2 arguments.');
      }

      return str.replace(replaceWhat, replaceWith);
    }
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (replaceStringTransformer);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBsYWNlU3RyaW5nVHJhbnNmb3JtZXIvcmVwbGFjZVN0cmluZ1RyYW5zZm9ybWVyLmpzIl0sIm5hbWVzIjpbInJlcGxhY2VTdHJpbmdUcmFuc2Zvcm1lciIsInJlcGxhY2VXaGF0IiwicmVwbGFjZVdpdGgiLCJvblN0cmluZyIsInN0ciIsIkVycm9yIiwicmVwbGFjZSJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTUEsMkJBQTJCLFNBQTNCQSx3QkFBMkIsQ0FBQ0MsV0FBRCxFQUFjQyxXQUFkO0FBQUEsU0FBK0I7QUFDOURDLFlBRDhELG9CQUNyREMsR0FEcUQsRUFDaEQ7QUFDWixVQUFJSCxlQUFlLElBQWYsSUFBdUJDLGVBQWUsSUFBMUMsRUFBZ0Q7QUFDOUMsY0FBTSxJQUFJRyxLQUFKLENBQ0oseURBREksQ0FBTjtBQUdEOztBQUVELGFBQU9ELElBQUlFLE9BQUosQ0FBWUwsV0FBWixFQUF5QkMsV0FBekIsQ0FBUDtBQUNEO0FBVDZELEdBQS9CO0FBQUEsQ0FBakM7O0FBWUEsZUFBZUYsd0JBQWYiLCJmaWxlIjoicmVwbGFjZVN0cmluZ1RyYW5zZm9ybWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcmVwbGFjZVN0cmluZ1RyYW5zZm9ybWVyID0gKHJlcGxhY2VXaGF0LCByZXBsYWNlV2l0aCkgPT4gKHtcbiAgb25TdHJpbmcoc3RyKSB7XG4gICAgaWYgKHJlcGxhY2VXaGF0ID09IG51bGwgfHwgcmVwbGFjZVdpdGggPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAncmVwbGFjZVN0cmluZ1RyYW5zZm9ybWVyIHJlcXVpcmVzIGF0IGxlYXN0IDIgYXJndW1lbnRzLicsXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBzdHIucmVwbGFjZShyZXBsYWNlV2hhdCwgcmVwbGFjZVdpdGgpO1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHJlcGxhY2VTdHJpbmdUcmFuc2Zvcm1lcjtcbiJdfQ==

/***/ }),

/***/ "./node_modules/common-tags/es/replaceSubstitutionTransformer/index.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/common-tags/es/replaceSubstitutionTransformer/index.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _replaceSubstitutionTransformer__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _replaceSubstitutionTransformer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./replaceSubstitutionTransformer */ "./node_modules/common-tags/es/replaceSubstitutionTransformer/replaceSubstitutionTransformer.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIvaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdCJdLCJtYXBwaW5ncyI6InFCQUFvQixrQztxQkFBYkEsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZyb20gJy4vcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyJztcbiJdfQ==

/***/ }),

/***/ "./node_modules/common-tags/es/replaceSubstitutionTransformer/replaceSubstitutionTransformer.js":
/*!******************************************************************************************************!*\
  !*** ./node_modules/common-tags/es/replaceSubstitutionTransformer/replaceSubstitutionTransformer.js ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var replaceSubstitutionTransformer = function replaceSubstitutionTransformer(replaceWhat, replaceWith) {
  return {
    onSubstitution: function onSubstitution(substitution, resultSoFar) {
      if (replaceWhat == null || replaceWith == null) {
        throw new Error('replaceSubstitutionTransformer requires at least 2 arguments.');
      }

      // Do not touch if null or undefined
      if (substitution == null) {
        return substitution;
      } else {
        return substitution.toString().replace(replaceWhat, replaceWith);
      }
    }
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (replaceSubstitutionTransformer);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIvcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyLmpzIl0sIm5hbWVzIjpbInJlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lciIsInJlcGxhY2VXaGF0IiwicmVwbGFjZVdpdGgiLCJvblN1YnN0aXR1dGlvbiIsInN1YnN0aXR1dGlvbiIsInJlc3VsdFNvRmFyIiwiRXJyb3IiLCJ0b1N0cmluZyIsInJlcGxhY2UiXSwibWFwcGluZ3MiOiJBQUFBLElBQU1BLGlDQUFpQyxTQUFqQ0EsOEJBQWlDLENBQUNDLFdBQUQsRUFBY0MsV0FBZDtBQUFBLFNBQStCO0FBQ3BFQyxrQkFEb0UsMEJBQ3JEQyxZQURxRCxFQUN2Q0MsV0FEdUMsRUFDMUI7QUFDeEMsVUFBSUosZUFBZSxJQUFmLElBQXVCQyxlQUFlLElBQTFDLEVBQWdEO0FBQzlDLGNBQU0sSUFBSUksS0FBSixDQUNKLCtEQURJLENBQU47QUFHRDs7QUFFRDtBQUNBLFVBQUlGLGdCQUFnQixJQUFwQixFQUEwQjtBQUN4QixlQUFPQSxZQUFQO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZUFBT0EsYUFBYUcsUUFBYixHQUF3QkMsT0FBeEIsQ0FBZ0NQLFdBQWhDLEVBQTZDQyxXQUE3QyxDQUFQO0FBQ0Q7QUFDRjtBQWRtRSxHQUEvQjtBQUFBLENBQXZDOztBQWlCQSxlQUFlRiw4QkFBZiIsImZpbGUiOiJyZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCByZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIgPSAocmVwbGFjZVdoYXQsIHJlcGxhY2VXaXRoKSA9PiAoe1xuICBvblN1YnN0aXR1dGlvbihzdWJzdGl0dXRpb24sIHJlc3VsdFNvRmFyKSB7XG4gICAgaWYgKHJlcGxhY2VXaGF0ID09IG51bGwgfHwgcmVwbGFjZVdpdGggPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAncmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyIHJlcXVpcmVzIGF0IGxlYXN0IDIgYXJndW1lbnRzLicsXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIERvIG5vdCB0b3VjaCBpZiBudWxsIG9yIHVuZGVmaW5lZFxuICAgIGlmIChzdWJzdGl0dXRpb24gPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHN1YnN0aXR1dGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN1YnN0aXR1dGlvbi50b1N0cmluZygpLnJlcGxhY2UocmVwbGFjZVdoYXQsIHJlcGxhY2VXaXRoKTtcbiAgICB9XG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyO1xuIl19

/***/ }),

/***/ "./node_modules/common-tags/es/safeHtml/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/common-tags/es/safeHtml/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _safeHtml__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _safeHtml__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./safeHtml */ "./node_modules/common-tags/es/safeHtml/safeHtml.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zYWZlSHRtbC9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Il0sIm1hcHBpbmdzIjoicUJBQW9CLFk7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL3NhZmVIdG1sJztcbiJdfQ==

/***/ }),

/***/ "./node_modules/common-tags/es/safeHtml/safeHtml.js":
/*!**********************************************************!*\
  !*** ./node_modules/common-tags/es/safeHtml/safeHtml.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TemplateTag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../TemplateTag */ "./node_modules/common-tags/es/TemplateTag/index.js");
/* harmony import */ var _stripIndentTransformer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../stripIndentTransformer */ "./node_modules/common-tags/es/stripIndentTransformer/index.js");
/* harmony import */ var _inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../inlineArrayTransformer */ "./node_modules/common-tags/es/inlineArrayTransformer/index.js");
/* harmony import */ var _trimResultTransformer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../trimResultTransformer */ "./node_modules/common-tags/es/trimResultTransformer/index.js");
/* harmony import */ var _splitStringTransformer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../splitStringTransformer */ "./node_modules/common-tags/es/splitStringTransformer/index.js");
/* harmony import */ var _replaceSubstitutionTransformer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../replaceSubstitutionTransformer */ "./node_modules/common-tags/es/replaceSubstitutionTransformer/index.js");







var safeHtml = new _TemplateTag__WEBPACK_IMPORTED_MODULE_0__["default"]((0,_splitStringTransformer__WEBPACK_IMPORTED_MODULE_4__["default"])('\n'), _inlineArrayTransformer__WEBPACK_IMPORTED_MODULE_2__["default"], _stripIndentTransformer__WEBPACK_IMPORTED_MODULE_1__["default"], _trimResultTransformer__WEBPACK_IMPORTED_MODULE_3__["default"], (0,_replaceSubstitutionTransformer__WEBPACK_IMPORTED_MODULE_5__["default"])(/&/g, '&amp;'), (0,_replaceSubstitutionTransformer__WEBPACK_IMPORTED_MODULE_5__["default"])(/</g, '&lt;'), (0,_replaceSubstitutionTransformer__WEBPACK_IMPORTED_MODULE_5__["default"])(/>/g, '&gt;'), (0,_replaceSubstitutionTransformer__WEBPACK_IMPORTED_MODULE_5__["default"])(/"/g, '&quot;'), (0,_replaceSubstitutionTransformer__WEBPACK_IMPORTED_MODULE_5__["default"])(/'/g, '&#x27;'), (0,_replaceSubstitutionTransformer__WEBPACK_IMPORTED_MODULE_5__["default"])(/`/g, '&#x60;'));

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (safeHtml);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zYWZlSHRtbC9zYWZlSHRtbC5qcyJdLCJuYW1lcyI6WyJUZW1wbGF0ZVRhZyIsInN0cmlwSW5kZW50VHJhbnNmb3JtZXIiLCJpbmxpbmVBcnJheVRyYW5zZm9ybWVyIiwidHJpbVJlc3VsdFRyYW5zZm9ybWVyIiwic3BsaXRTdHJpbmdUcmFuc2Zvcm1lciIsInJlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lciIsInNhZmVIdG1sIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxXQUFQLE1BQXdCLGdCQUF4QjtBQUNBLE9BQU9DLHNCQUFQLE1BQW1DLDJCQUFuQztBQUNBLE9BQU9DLHNCQUFQLE1BQW1DLDJCQUFuQztBQUNBLE9BQU9DLHFCQUFQLE1BQWtDLDBCQUFsQztBQUNBLE9BQU9DLHNCQUFQLE1BQW1DLDJCQUFuQztBQUNBLE9BQU9DLDhCQUFQLE1BQTJDLG1DQUEzQzs7QUFFQSxJQUFNQyxXQUFXLElBQUlOLFdBQUosQ0FDZkksdUJBQXVCLElBQXZCLENBRGUsRUFFZkYsc0JBRmUsRUFHZkQsc0JBSGUsRUFJZkUscUJBSmUsRUFLZkUsK0JBQStCLElBQS9CLEVBQXFDLE9BQXJDLENBTGUsRUFNZkEsK0JBQStCLElBQS9CLEVBQXFDLE1BQXJDLENBTmUsRUFPZkEsK0JBQStCLElBQS9CLEVBQXFDLE1BQXJDLENBUGUsRUFRZkEsK0JBQStCLElBQS9CLEVBQXFDLFFBQXJDLENBUmUsRUFTZkEsK0JBQStCLElBQS9CLEVBQXFDLFFBQXJDLENBVGUsRUFVZkEsK0JBQStCLElBQS9CLEVBQXFDLFFBQXJDLENBVmUsQ0FBakI7O0FBYUEsZUFBZUMsUUFBZiIsImZpbGUiOiJzYWZlSHRtbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciBmcm9tICcuLi9zdHJpcEluZGVudFRyYW5zZm9ybWVyJztcbmltcG9ydCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyIGZyb20gJy4uL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuaW1wb3J0IHNwbGl0U3RyaW5nVHJhbnNmb3JtZXIgZnJvbSAnLi4vc3BsaXRTdHJpbmdUcmFuc2Zvcm1lcic7XG5pbXBvcnQgcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyIGZyb20gJy4uL3JlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lcic7XG5cbmNvbnN0IHNhZmVIdG1sID0gbmV3IFRlbXBsYXRlVGFnKFxuICBzcGxpdFN0cmluZ1RyYW5zZm9ybWVyKCdcXG4nKSxcbiAgaW5saW5lQXJyYXlUcmFuc2Zvcm1lcixcbiAgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcixcbiAgdHJpbVJlc3VsdFRyYW5zZm9ybWVyLFxuICByZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIoLyYvZywgJyZhbXA7JyksXG4gIHJlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lcigvPC9nLCAnJmx0OycpLFxuICByZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIoLz4vZywgJyZndDsnKSxcbiAgcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyKC9cIi9nLCAnJnF1b3Q7JyksXG4gIHJlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lcigvJy9nLCAnJiN4Mjc7JyksXG4gIHJlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lcigvYC9nLCAnJiN4NjA7JyksXG4pO1xuXG5leHBvcnQgZGVmYXVsdCBzYWZlSHRtbDtcbiJdfQ==

/***/ }),

/***/ "./node_modules/common-tags/es/source/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/common-tags/es/source/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _html__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../html */ "./node_modules/common-tags/es/html/index.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zb3VyY2UvaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdCJdLCJtYXBwaW5ncyI6InFCQUFvQixTO3FCQUFiQSxPIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnJvbSAnLi4vaHRtbCc7XG4iXX0=

/***/ }),

/***/ "./node_modules/common-tags/es/splitStringTransformer/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/common-tags/es/splitStringTransformer/index.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _splitStringTransformer__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _splitStringTransformer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./splitStringTransformer */ "./node_modules/common-tags/es/splitStringTransformer/splitStringTransformer.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zcGxpdFN0cmluZ1RyYW5zZm9ybWVyL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiXSwibWFwcGluZ3MiOiJxQkFBb0IsMEI7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL3NwbGl0U3RyaW5nVHJhbnNmb3JtZXInO1xuIl19

/***/ }),

/***/ "./node_modules/common-tags/es/splitStringTransformer/splitStringTransformer.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/common-tags/es/splitStringTransformer/splitStringTransformer.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var splitStringTransformer = function splitStringTransformer(splitBy) {
  return {
    onSubstitution: function onSubstitution(substitution, resultSoFar) {
      if (splitBy != null && typeof splitBy === 'string') {
        if (typeof substitution === 'string' && substitution.includes(splitBy)) {
          substitution = substitution.split(splitBy);
        }
      } else {
        throw new Error('You need to specify a string character to split by.');
      }
      return substitution;
    }
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (splitStringTransformer);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zcGxpdFN0cmluZ1RyYW5zZm9ybWVyL3NwbGl0U3RyaW5nVHJhbnNmb3JtZXIuanMiXSwibmFtZXMiOlsic3BsaXRTdHJpbmdUcmFuc2Zvcm1lciIsIm9uU3Vic3RpdHV0aW9uIiwic3Vic3RpdHV0aW9uIiwicmVzdWx0U29GYXIiLCJzcGxpdEJ5IiwiaW5jbHVkZXMiLCJzcGxpdCIsIkVycm9yIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFNQSx5QkFBeUIsU0FBekJBLHNCQUF5QjtBQUFBLFNBQVk7QUFDekNDLGtCQUR5QywwQkFDMUJDLFlBRDBCLEVBQ1pDLFdBRFksRUFDQztBQUN4QyxVQUFJQyxXQUFXLElBQVgsSUFBbUIsT0FBT0EsT0FBUCxLQUFtQixRQUExQyxFQUFvRDtBQUNsRCxZQUFJLE9BQU9GLFlBQVAsS0FBd0IsUUFBeEIsSUFBb0NBLGFBQWFHLFFBQWIsQ0FBc0JELE9BQXRCLENBQXhDLEVBQXdFO0FBQ3RFRix5QkFBZUEsYUFBYUksS0FBYixDQUFtQkYsT0FBbkIsQ0FBZjtBQUNEO0FBQ0YsT0FKRCxNQUlPO0FBQ0wsY0FBTSxJQUFJRyxLQUFKLENBQVUscURBQVYsQ0FBTjtBQUNEO0FBQ0QsYUFBT0wsWUFBUDtBQUNEO0FBVndDLEdBQVo7QUFBQSxDQUEvQjs7QUFhQSxlQUFlRixzQkFBZiIsImZpbGUiOiJzcGxpdFN0cmluZ1RyYW5zZm9ybWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgc3BsaXRTdHJpbmdUcmFuc2Zvcm1lciA9IHNwbGl0QnkgPT4gKHtcbiAgb25TdWJzdGl0dXRpb24oc3Vic3RpdHV0aW9uLCByZXN1bHRTb0Zhcikge1xuICAgIGlmIChzcGxpdEJ5ICE9IG51bGwgJiYgdHlwZW9mIHNwbGl0QnkgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAodHlwZW9mIHN1YnN0aXR1dGlvbiA9PT0gJ3N0cmluZycgJiYgc3Vic3RpdHV0aW9uLmluY2x1ZGVzKHNwbGl0QnkpKSB7XG4gICAgICAgIHN1YnN0aXR1dGlvbiA9IHN1YnN0aXR1dGlvbi5zcGxpdChzcGxpdEJ5KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbmVlZCB0byBzcGVjaWZ5IGEgc3RyaW5nIGNoYXJhY3RlciB0byBzcGxpdCBieS4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHN1YnN0aXR1dGlvbjtcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBzcGxpdFN0cmluZ1RyYW5zZm9ybWVyO1xuIl19

/***/ }),

/***/ "./node_modules/common-tags/es/stripIndent/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/common-tags/es/stripIndent/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _stripIndent__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _stripIndent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stripIndent */ "./node_modules/common-tags/es/stripIndent/stripIndent.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJpcEluZGVudC9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Il0sIm1hcHBpbmdzIjoicUJBQW9CLGU7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL3N0cmlwSW5kZW50JztcbiJdfQ==

/***/ }),

/***/ "./node_modules/common-tags/es/stripIndent/stripIndent.js":
/*!****************************************************************!*\
  !*** ./node_modules/common-tags/es/stripIndent/stripIndent.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TemplateTag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../TemplateTag */ "./node_modules/common-tags/es/TemplateTag/index.js");
/* harmony import */ var _stripIndentTransformer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../stripIndentTransformer */ "./node_modules/common-tags/es/stripIndentTransformer/index.js");
/* harmony import */ var _trimResultTransformer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../trimResultTransformer */ "./node_modules/common-tags/es/trimResultTransformer/index.js");




var stripIndent = new _TemplateTag__WEBPACK_IMPORTED_MODULE_0__["default"](_stripIndentTransformer__WEBPACK_IMPORTED_MODULE_1__["default"], _trimResultTransformer__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stripIndent);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJpcEluZGVudC9zdHJpcEluZGVudC5qcyJdLCJuYW1lcyI6WyJUZW1wbGF0ZVRhZyIsInN0cmlwSW5kZW50VHJhbnNmb3JtZXIiLCJ0cmltUmVzdWx0VHJhbnNmb3JtZXIiLCJzdHJpcEluZGVudCJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsV0FBUCxNQUF3QixnQkFBeEI7QUFDQSxPQUFPQyxzQkFBUCxNQUFtQywyQkFBbkM7QUFDQSxPQUFPQyxxQkFBUCxNQUFrQywwQkFBbEM7O0FBRUEsSUFBTUMsY0FBYyxJQUFJSCxXQUFKLENBQ2xCQyxzQkFEa0IsRUFFbEJDLHFCQUZrQixDQUFwQjs7QUFLQSxlQUFlQyxXQUFmIiwiZmlsZSI6InN0cmlwSW5kZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBzdHJpcEluZGVudFRyYW5zZm9ybWVyIGZyb20gJy4uL3N0cmlwSW5kZW50VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuXG5jb25zdCBzdHJpcEluZGVudCA9IG5ldyBUZW1wbGF0ZVRhZyhcbiAgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcixcbiAgdHJpbVJlc3VsdFRyYW5zZm9ybWVyLFxuKTtcblxuZXhwb3J0IGRlZmF1bHQgc3RyaXBJbmRlbnQ7XG4iXX0=

/***/ }),

/***/ "./node_modules/common-tags/es/stripIndentTransformer/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/common-tags/es/stripIndentTransformer/index.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _stripIndentTransformer__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _stripIndentTransformer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stripIndentTransformer */ "./node_modules/common-tags/es/stripIndentTransformer/stripIndentTransformer.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJpcEluZGVudFRyYW5zZm9ybWVyL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiXSwibWFwcGluZ3MiOiJxQkFBb0IsMEI7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL3N0cmlwSW5kZW50VHJhbnNmb3JtZXInO1xuIl19

/***/ }),

/***/ "./node_modules/common-tags/es/stripIndentTransformer/stripIndentTransformer.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/common-tags/es/stripIndentTransformer/stripIndentTransformer.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * strips indentation from a template literal
 * @param  {String} type = 'initial' - whether to remove all indentation or just leading indentation. can be 'all' or 'initial'
 * @return {Object}                  - a TemplateTag transformer
 */
var stripIndentTransformer = function stripIndentTransformer() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'initial';
  return {
    onEndResult: function onEndResult(endResult) {
      if (type === 'initial') {
        // remove the shortest leading indentation from each line
        var match = endResult.match(/^[^\S\n]*(?=\S)/gm);
        var indent = match && Math.min.apply(Math, _toConsumableArray(match.map(function (el) {
          return el.length;
        })));
        if (indent) {
          var regexp = new RegExp('^.{' + indent + '}', 'gm');
          return endResult.replace(regexp, '');
        }
        return endResult;
      }
      if (type === 'all') {
        // remove all indentation from each line
        return endResult.replace(/^[^\S\n]+/gm, '');
      }
      throw new Error('Unknown type: ' + type);
    }
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stripIndentTransformer);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJpcEluZGVudFRyYW5zZm9ybWVyL3N0cmlwSW5kZW50VHJhbnNmb3JtZXIuanMiXSwibmFtZXMiOlsic3RyaXBJbmRlbnRUcmFuc2Zvcm1lciIsInR5cGUiLCJvbkVuZFJlc3VsdCIsImVuZFJlc3VsdCIsIm1hdGNoIiwiaW5kZW50IiwiTWF0aCIsIm1pbiIsIm1hcCIsImVsIiwibGVuZ3RoIiwicmVnZXhwIiwiUmVnRXhwIiwicmVwbGFjZSIsIkVycm9yIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7OztBQUtBLElBQU1BLHlCQUF5QixTQUF6QkEsc0JBQXlCO0FBQUEsTUFBQ0MsSUFBRCx1RUFBUSxTQUFSO0FBQUEsU0FBdUI7QUFDcERDLGVBRG9ELHVCQUN4Q0MsU0FEd0MsRUFDN0I7QUFDckIsVUFBSUYsU0FBUyxTQUFiLEVBQXdCO0FBQ3RCO0FBQ0EsWUFBTUcsUUFBUUQsVUFBVUMsS0FBVixDQUFnQixtQkFBaEIsQ0FBZDtBQUNBLFlBQU1DLFNBQVNELFNBQVNFLEtBQUtDLEdBQUwsZ0NBQVlILE1BQU1JLEdBQU4sQ0FBVTtBQUFBLGlCQUFNQyxHQUFHQyxNQUFUO0FBQUEsU0FBVixDQUFaLEVBQXhCO0FBQ0EsWUFBSUwsTUFBSixFQUFZO0FBQ1YsY0FBTU0sU0FBUyxJQUFJQyxNQUFKLFNBQWlCUCxNQUFqQixRQUE0QixJQUE1QixDQUFmO0FBQ0EsaUJBQU9GLFVBQVVVLE9BQVYsQ0FBa0JGLE1BQWxCLEVBQTBCLEVBQTFCLENBQVA7QUFDRDtBQUNELGVBQU9SLFNBQVA7QUFDRDtBQUNELFVBQUlGLFNBQVMsS0FBYixFQUFvQjtBQUNsQjtBQUNBLGVBQU9FLFVBQVVVLE9BQVYsQ0FBa0IsYUFBbEIsRUFBaUMsRUFBakMsQ0FBUDtBQUNEO0FBQ0QsWUFBTSxJQUFJQyxLQUFKLG9CQUEyQmIsSUFBM0IsQ0FBTjtBQUNEO0FBakJtRCxHQUF2QjtBQUFBLENBQS9COztBQW9CQSxlQUFlRCxzQkFBZiIsImZpbGUiOiJzdHJpcEluZGVudFRyYW5zZm9ybWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBzdHJpcHMgaW5kZW50YXRpb24gZnJvbSBhIHRlbXBsYXRlIGxpdGVyYWxcbiAqIEBwYXJhbSAge1N0cmluZ30gdHlwZSA9ICdpbml0aWFsJyAtIHdoZXRoZXIgdG8gcmVtb3ZlIGFsbCBpbmRlbnRhdGlvbiBvciBqdXN0IGxlYWRpbmcgaW5kZW50YXRpb24uIGNhbiBiZSAnYWxsJyBvciAnaW5pdGlhbCdcbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgICAgICAgICAtIGEgVGVtcGxhdGVUYWcgdHJhbnNmb3JtZXJcbiAqL1xuY29uc3Qgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciA9ICh0eXBlID0gJ2luaXRpYWwnKSA9PiAoe1xuICBvbkVuZFJlc3VsdChlbmRSZXN1bHQpIHtcbiAgICBpZiAodHlwZSA9PT0gJ2luaXRpYWwnKSB7XG4gICAgICAvLyByZW1vdmUgdGhlIHNob3J0ZXN0IGxlYWRpbmcgaW5kZW50YXRpb24gZnJvbSBlYWNoIGxpbmVcbiAgICAgIGNvbnN0IG1hdGNoID0gZW5kUmVzdWx0Lm1hdGNoKC9eW15cXFNcXG5dKig/PVxcUykvZ20pO1xuICAgICAgY29uc3QgaW5kZW50ID0gbWF0Y2ggJiYgTWF0aC5taW4oLi4ubWF0Y2gubWFwKGVsID0+IGVsLmxlbmd0aCkpO1xuICAgICAgaWYgKGluZGVudCkge1xuICAgICAgICBjb25zdCByZWdleHAgPSBuZXcgUmVnRXhwKGBeLnske2luZGVudH19YCwgJ2dtJyk7XG4gICAgICAgIHJldHVybiBlbmRSZXN1bHQucmVwbGFjZShyZWdleHAsICcnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbmRSZXN1bHQ7XG4gICAgfVxuICAgIGlmICh0eXBlID09PSAnYWxsJykge1xuICAgICAgLy8gcmVtb3ZlIGFsbCBpbmRlbnRhdGlvbiBmcm9tIGVhY2ggbGluZVxuICAgICAgcmV0dXJuIGVuZFJlc3VsdC5yZXBsYWNlKC9eW15cXFNcXG5dKy9nbSwgJycpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gdHlwZTogJHt0eXBlfWApO1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHN0cmlwSW5kZW50VHJhbnNmb3JtZXI7XG4iXX0=

/***/ }),

/***/ "./node_modules/common-tags/es/stripIndents/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/common-tags/es/stripIndents/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _stripIndents__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _stripIndents__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stripIndents */ "./node_modules/common-tags/es/stripIndents/stripIndents.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJpcEluZGVudHMvaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdCJdLCJtYXBwaW5ncyI6InFCQUFvQixnQjtxQkFBYkEsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZyb20gJy4vc3RyaXBJbmRlbnRzJztcbiJdfQ==

/***/ }),

/***/ "./node_modules/common-tags/es/stripIndents/stripIndents.js":
/*!******************************************************************!*\
  !*** ./node_modules/common-tags/es/stripIndents/stripIndents.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TemplateTag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../TemplateTag */ "./node_modules/common-tags/es/TemplateTag/index.js");
/* harmony import */ var _stripIndentTransformer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../stripIndentTransformer */ "./node_modules/common-tags/es/stripIndentTransformer/index.js");
/* harmony import */ var _trimResultTransformer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../trimResultTransformer */ "./node_modules/common-tags/es/trimResultTransformer/index.js");




var stripIndents = new _TemplateTag__WEBPACK_IMPORTED_MODULE_0__["default"]((0,_stripIndentTransformer__WEBPACK_IMPORTED_MODULE_1__["default"])('all'), _trimResultTransformer__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stripIndents);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJpcEluZGVudHMvc3RyaXBJbmRlbnRzLmpzIl0sIm5hbWVzIjpbIlRlbXBsYXRlVGFnIiwic3RyaXBJbmRlbnRUcmFuc2Zvcm1lciIsInRyaW1SZXN1bHRUcmFuc2Zvcm1lciIsInN0cmlwSW5kZW50cyJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsV0FBUCxNQUF3QixnQkFBeEI7QUFDQSxPQUFPQyxzQkFBUCxNQUFtQywyQkFBbkM7QUFDQSxPQUFPQyxxQkFBUCxNQUFrQywwQkFBbEM7O0FBRUEsSUFBTUMsZUFBZSxJQUFJSCxXQUFKLENBQ25CQyx1QkFBdUIsS0FBdkIsQ0FEbUIsRUFFbkJDLHFCQUZtQixDQUFyQjs7QUFLQSxlQUFlQyxZQUFmIiwiZmlsZSI6InN0cmlwSW5kZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciBmcm9tICcuLi9zdHJpcEluZGVudFRyYW5zZm9ybWVyJztcbmltcG9ydCB0cmltUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcblxuY29uc3Qgc3RyaXBJbmRlbnRzID0gbmV3IFRlbXBsYXRlVGFnKFxuICBzdHJpcEluZGVudFRyYW5zZm9ybWVyKCdhbGwnKSxcbiAgdHJpbVJlc3VsdFRyYW5zZm9ybWVyLFxuKTtcblxuZXhwb3J0IGRlZmF1bHQgc3RyaXBJbmRlbnRzO1xuIl19

/***/ }),

/***/ "./node_modules/common-tags/es/trimResultTransformer/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/common-tags/es/trimResultTransformer/index.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _trimResultTransformer__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _trimResultTransformer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./trimResultTransformer */ "./node_modules/common-tags/es/trimResultTransformer/trimResultTransformer.js");


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cmltUmVzdWx0VHJhbnNmb3JtZXIvaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdCJdLCJtYXBwaW5ncyI6InFCQUFvQix5QjtxQkFBYkEsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZyb20gJy4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcbiJdfQ==

/***/ }),

/***/ "./node_modules/common-tags/es/trimResultTransformer/trimResultTransformer.js":
/*!************************************************************************************!*\
  !*** ./node_modules/common-tags/es/trimResultTransformer/trimResultTransformer.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * TemplateTag transformer that trims whitespace on the end result of a tagged template
 * @param  {String} side = '' - The side of the string to trim. Can be 'start' or 'end' (alternatively 'left' or 'right')
 * @return {Object}           - a TemplateTag transformer
 */
var trimResultTransformer = function trimResultTransformer() {
  var side = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return {
    onEndResult: function onEndResult(endResult) {
      if (side === '') {
        return endResult.trim();
      }

      side = side.toLowerCase();

      if (side === 'start' || side === 'left') {
        return endResult.replace(/^\s*/, '');
      }

      if (side === 'end' || side === 'right') {
        return endResult.replace(/\s*$/, '');
      }

      throw new Error('Side not supported: ' + side);
    }
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (trimResultTransformer);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cmltUmVzdWx0VHJhbnNmb3JtZXIvdHJpbVJlc3VsdFRyYW5zZm9ybWVyLmpzIl0sIm5hbWVzIjpbInRyaW1SZXN1bHRUcmFuc2Zvcm1lciIsInNpZGUiLCJvbkVuZFJlc3VsdCIsImVuZFJlc3VsdCIsInRyaW0iLCJ0b0xvd2VyQ2FzZSIsInJlcGxhY2UiLCJFcnJvciJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FBS0EsSUFBTUEsd0JBQXdCLFNBQXhCQSxxQkFBd0I7QUFBQSxNQUFDQyxJQUFELHVFQUFRLEVBQVI7QUFBQSxTQUFnQjtBQUM1Q0MsZUFENEMsdUJBQ2hDQyxTQURnQyxFQUNyQjtBQUNyQixVQUFJRixTQUFTLEVBQWIsRUFBaUI7QUFDZixlQUFPRSxVQUFVQyxJQUFWLEVBQVA7QUFDRDs7QUFFREgsYUFBT0EsS0FBS0ksV0FBTCxFQUFQOztBQUVBLFVBQUlKLFNBQVMsT0FBVCxJQUFvQkEsU0FBUyxNQUFqQyxFQUF5QztBQUN2QyxlQUFPRSxVQUFVRyxPQUFWLENBQWtCLE1BQWxCLEVBQTBCLEVBQTFCLENBQVA7QUFDRDs7QUFFRCxVQUFJTCxTQUFTLEtBQVQsSUFBa0JBLFNBQVMsT0FBL0IsRUFBd0M7QUFDdEMsZUFBT0UsVUFBVUcsT0FBVixDQUFrQixNQUFsQixFQUEwQixFQUExQixDQUFQO0FBQ0Q7O0FBRUQsWUFBTSxJQUFJQyxLQUFKLDBCQUFpQ04sSUFBakMsQ0FBTjtBQUNEO0FBakIyQyxHQUFoQjtBQUFBLENBQTlCOztBQW9CQSxlQUFlRCxxQkFBZiIsImZpbGUiOiJ0cmltUmVzdWx0VHJhbnNmb3JtZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlbXBsYXRlVGFnIHRyYW5zZm9ybWVyIHRoYXQgdHJpbXMgd2hpdGVzcGFjZSBvbiB0aGUgZW5kIHJlc3VsdCBvZiBhIHRhZ2dlZCB0ZW1wbGF0ZVxuICogQHBhcmFtICB7U3RyaW5nfSBzaWRlID0gJycgLSBUaGUgc2lkZSBvZiB0aGUgc3RyaW5nIHRvIHRyaW0uIENhbiBiZSAnc3RhcnQnIG9yICdlbmQnIChhbHRlcm5hdGl2ZWx5ICdsZWZ0JyBvciAncmlnaHQnKVxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgLSBhIFRlbXBsYXRlVGFnIHRyYW5zZm9ybWVyXG4gKi9cbmNvbnN0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciA9IChzaWRlID0gJycpID0+ICh7XG4gIG9uRW5kUmVzdWx0KGVuZFJlc3VsdCkge1xuICAgIGlmIChzaWRlID09PSAnJykge1xuICAgICAgcmV0dXJuIGVuZFJlc3VsdC50cmltKCk7XG4gICAgfVxuXG4gICAgc2lkZSA9IHNpZGUudG9Mb3dlckNhc2UoKTtcblxuICAgIGlmIChzaWRlID09PSAnc3RhcnQnIHx8IHNpZGUgPT09ICdsZWZ0Jykge1xuICAgICAgcmV0dXJuIGVuZFJlc3VsdC5yZXBsYWNlKC9eXFxzKi8sICcnKTtcbiAgICB9XG5cbiAgICBpZiAoc2lkZSA9PT0gJ2VuZCcgfHwgc2lkZSA9PT0gJ3JpZ2h0Jykge1xuICAgICAgcmV0dXJuIGVuZFJlc3VsdC5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYFNpZGUgbm90IHN1cHBvcnRlZDogJHtzaWRlfWApO1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lcjtcbiJdfQ==

/***/ }),

/***/ "./src/modules/DOM.js":
/*!****************************!*\
  !*** ./src/modules/DOM.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Table: () => (/* binding */ Table),
/* harmony export */   getBodyInnerHTML: () => (/* binding */ getBodyInnerHTML),
/* harmony export */   renderNotification: () => (/* binding */ renderNotification),
/* harmony export */   renderPassScreen: () => (/* binding */ renderPassScreen),
/* harmony export */   renderVictoryScreen: () => (/* binding */ renderVictoryScreen),
/* harmony export */   setBodyInnerHTML: () => (/* binding */ setBodyInnerHTML)
/* harmony export */ });
const Table = (tableSize, parentQuery) => {
  const args = { tableSize, parentQuery };
  const self = document.querySelector(`${parentQuery} .battlefield-table`);
  let xray = false;

  function getNewTableElement() {
    function getColMarker(datasetYPos) {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const arr = alphabet.split("");
      return arr[datasetYPos];
    }

    const tableEl = document.createElement("table");
    tableEl.classList = "battlefield-table";
    const tableBody = document.createElement("tbody");
    tableEl.appendChild(tableBody);

    for (let i = 0; i < tableSize; i += 1) {
      const tableRow = document.createElement("tr");
      tableRow.classList = "battlefield-row";
      tableBody.appendChild(tableRow);

      for (let j = 0; j < tableSize; j += 1) {
        const tableDataCell = document.createElement("td");
        tableDataCell.classList = "battlefield-cell";
        tableRow.appendChild(tableDataCell);

        const battlefieldCellContent = document.createElement("div");
        battlefieldCellContent.classList = "battlefield-cell-content";
        battlefieldCellContent.dataset.x = j;
        battlefieldCellContent.dataset.y = i;
        tableDataCell.appendChild(battlefieldCellContent);

        if (battlefieldCellContent.dataset.x === 0) {
          const markerRow = document.createElement("div");
          markerRow.classList = "marker marker-row";
          markerRow.textContent = battlefieldCellContent.dataset.x + 1;
          battlefieldCellContent.appendChild(markerRow);
        }

        if (battlefieldCellContent.dataset.y === 0) {
          const markerCol = document.createElement("div");
          markerCol.classList = "marker marker-col";
          markerCol.textContent = getColMarker(
            battlefieldCellContent.dataset.y
          );
          battlefieldCellContent.appendChild(markerCol);
        }
      }
    }

    return tableEl;
  }

  const tableEl = getNewTableElement();

  const label = document.querySelector(`${parentQuery}-label`);
  if (parentQuery === ".battlefield-self") {
    label.textContent = "You";
  } else {
    label.textContent = "Rival";
  }

  function toggleDisabled() {
    document.querySelector(parentQuery).classList.toggle("disabled");
  }

  function toggleAttackCursor() {
    document
      .querySelectorAll(`${parentQuery} .battlefield-cell-content`)
      .forEach((value) =>
        value.classList.contains("miss") || value.classList.contains("hit")
          ? null
          : value.classList.toggle("attack-cursor")
      );
  }

  function renderSunk(cell) {
    cell.classList.add("sunk");
  }

  function xrayEnabled() {
    return xray;
  }

  function toggleXray() {
    // eslint-disable-next-line no-unused-expressions
    xray ? (xray = false) : (xray = true);
  }

  function renderMiss(cell) {
    cell.classList.add("miss");
    const missIcon = document.createElement("span");
    missIcon.classList = "miss-icon";
    cell.appendChild(missIcon);
  }

  function renderHit(cell) {
    cell.classList.add("hit");
    const hitIcon = document.createElement("span");
    hitIcon.classList = "hit-icon";
    cell.appendChild(hitIcon);
  }

  function renderShip(cell) {
    cell.classList.add("ship");
  }

  function update(player) {
    const { gameBrd } = player;
    const map = gameBrd.getMapData().getMap();
    for (let i = 0; i < map.length; i += 1) {
      const shipCell = document.querySelector(
        `${parentQuery} .battlefield-cell-content[data-x="${map[i].x}"][data-y="${map[i].y}"]`
      );
      const mapSpace = gameBrd.getMapData().space([map[i].x, map[i].y]);
      if (mapSpace.hasShip()) {
        if (xrayEnabled() || player.getTurn()) {
          renderShip(shipCell);
        }
        if (mapSpace.ship().getShip().isSunk()) renderSunk(shipCell);
      }
      if (mapSpace.hasMissed()) renderMiss(shipCell);
      if (mapSpace.isHit()) renderHit(shipCell);
    }
  }

  function renderInvalidSpace(invalidSpaceArr) {
    const arr = invalidSpaceArr;
    for (let i = 0; i < arr.length; i += 1) {
      const cell = document.querySelector(
        `${parentQuery} .battlefield-cell-content[data-x="${arr[i][0]}"][data-y="${arr[i][1]}"]`
      );
      cell.classList.add("invalid");
    }
  }

  function renderClassname(className, array) {
    const arr = array;
    for (let i = 0; i < arr.length; i += 1) {
      const cell = document.querySelector(
        `${parentQuery} .battlefield-cell-content[data-x="${arr[i].x}"][data-y="${arr[i].y}"]`
      );
      cell.classList.add(className);
    }
  }

  function render() {
    // eslint-disable-next-line no-param-reassign
    self.innerHTML = tableEl.innerHTML;
  }

  function addAttackEventListener(attackEvent) {
    document
      .querySelectorAll(
        `${parentQuery} .battlefield-cell-content.attack-cursor`
      )
      .forEach((value) => value.addEventListener("click", attackEvent));
  }

  function renderAttackResult(attack, coords) {
    const cell = document.querySelector(
      `${parentQuery} .battlefield-cell-content[data-x="${coords[0]}"][data-y="${coords[1]}"]`
    );
    if (attack.miss) {
      renderMiss(cell);
    }
    if (attack.hit || attack.sunk) {
      renderHit(cell);
    }
    if (attack.sunk) {
      attack.shipCords.forEach((value) => {
        document
          .querySelector(
            `${parentQuery} .battlefield-cell-content[data-x="${value.x}"][data-y="${value.y}"]`
          )
          .classList.add("sunk");
      });
    }
  }

  return {
    render,
    update,
    renderInvalidSpace,
    renderClassname,
    toggleDisabled,
    toggleAttackCursor,
    addAttackEventListener,
    renderAttackResult,
    args,
  };
};

function renderNotification(msg) {
  document.querySelector(".notification-message").innerHTML = msg;
}

function renderVictoryScreen(championName, championId, loserId) {
  document.querySelector(".battlefields").remove();
  document.querySelector(".notification-wrap").remove();

  const victoryScreen = document.createElement("div");
  victoryScreen.classList.add("game-over");

  victoryScreen.innerHTML = `
    <div class="game-over-message-container">
      <div class="game-over-message">
        <div class="game-over-text">Game Over</div>
        <div class="congrats"><span class="${championId}-victory">${championName}</span> <span class="${loserId}-victory">Wins!</div>
    </div>
  `;
  document.querySelector("main").appendChild(victoryScreen);
}

function getPlayerColorSpan(id, insertedText) {
  return `<span class="${id}-victory">${insertedText}</span>`;
}

function renderPassScreen(curName, curId, nextName, nextId) {
  document.querySelector(".battlefields").remove();
  document.querySelector(".notification-wrap").remove();

  const passScreen = document.createElement("div");
  passScreen.classList.add("pass-screen");

  passScreen.innerHTML = `
      <div class="pass-screen-message">
        <div class="pass-screen-message-text head">${getPlayerColorSpan(
          curId,
          curName
        )}, Pass your screen to your opponent ${getPlayerColorSpan(
    nextId,
    nextName
  )}</div>
        <div class="pass-screen-message-text body">It is your turn, ${getPlayerColorSpan(
          nextId,
          nextName
        )}. Are you ready?</div>
        <div class="pass-btn-container">
          <button type="button" class="pass-btn ${nextId}-victory-bg">Ready</button>
        </div>
  `;
  document.querySelector("main").appendChild(passScreen);
}

function getBodyInnerHTML() {
  return document.querySelector("body").innerHTML;
}

function setBodyInnerHTML(innerHTML) {
  document.querySelector("body").innerHTML = innerHTML;
}




/***/ }),

/***/ "./src/modules/battleship.js":
/*!***********************************!*\
  !*** ./src/modules/battleship.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Game: () => (/* binding */ Game),
/* harmony export */   Ship: () => (/* binding */ Ship)
/* harmony export */ });
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DOM */ "./src/modules/DOM.js");
/* harmony import */ var _utility__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utility */ "./src/modules/utility.js");


const { stripIndents } = __webpack_require__(/*! common-tags */ "./node_modules/common-tags/es/index.js");

const Ship = (size, axis) => {
  const shipSize = size;
  let timesHit = 0;
  let sunk = false;
  let coordinates = [];

  function getSize() {
    return shipSize;
  }

  function getAxis() {
    return axis;
  }

  function hit() {
    timesHit += 1;
  }

  function isSunk() {
    if (timesHit === shipSize) {
      sunk = true;
    }
    return sunk;
  }

  function getCoordinates() {
    return coordinates;
  }

  function setCoordinates(cords) {
    coordinates = cords;
  }

  return { getSize, isSunk, hit, getCoordinates, setCoordinates, getAxis };
};

const Gameboard = () => {
  const size = 10;

  function getColMarker(yPos) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const arr = alphabet.split("");
    return arr[yPos];
  }

  function init() {
    const arr = [];
    for (let i = 0; i < size; i += 1) {
      for (let j = 0; j < size; j += 1) {
        arr.push({ x: j, y: i, row: i + 1, col: getColMarker(j) });
      }
    }
    return arr;
  }

  const map = init();

  function getMapData() {
    function getDictionary(mapArr = map.slice()) {
      const dictionary = {
        columns: [],
        rows: [],
      };
      for (let i = 0; i < size; i += 1) {
        const arrColumns = mapArr.filter(
          (value) => value.col === getColMarker(i)
        );
        dictionary.columns.push(arrColumns);

        const arrRows = mapArr.filter((value) => value.row === i + 1);
        dictionary.rows.push(arrRows);
      }

      return dictionary;
    }

    function getIndexByCoordinate(coords) {
      const result = map.findIndex(
        (value) => value.x === coords[0] && value.y === coords[1]
      );
      return result;
    }

    function getCoordinateByIndex(index) {
      return map.slice()[index];
    }

    function getRandomAttackableCoordinate() {
      const filteredMap = map.filter((value) => !value.hit && !value.miss);
      const index = Math.floor(Math.random() * filteredMap.length);
      return filteredMap[index];
    }

    function space(coord) {
      const index = getIndexByCoordinate(coord);
      function get() {
        return getCoordinateByIndex(index);
      }

      function hasShip() {
        if (map.slice()[index].ship) return true;
        return false;
      }

      function isHit() {
        if (map.slice()[index].hit) return true;
        return false;
      }

      function setHit() {
        map[index].hit = true;
      }

      function hasMissed() {
        if (map.slice()[index].miss) return true;
        return false;
      }

      function setMissed() {
        map[index].miss = true;
      }

      function setOccupied(bool) {
        map[index].occupied = bool;
      }

      function isOccupied() {
        if (map.slice()[index].occupied) return true;
        return false;
      }

      function setShip(shp) {
        if (hasShip() || isOccupied()) return;
        map[index].ship = shp;
      }

      function ship() {
        if (!hasShip()) throw new Error("There is not a ship on this tile");
        const shp = map.slice()[index].ship;
        function getShip() {
          return shp;
        }
        function getLog() {
          return stripIndents`
          There is a ship at ${shp.getCoordinates()}
          Row: ${shp.row}
          Column: ${shp.col}
          Size: ${shp.getSize()}
          Axis: ${shp.getAxis()}
          Alive: ${!shp.isSunk()}
          `;
        }
        return { getShip, getLog };
      }

      return {
        get,
        setOccupied,
        setShip,
        hasShip,
        ship,
        isHit,
        setHit,
        hasMissed,
        setMissed,
      };
    }

    function getMap() {
      return map.slice();
    }

    function getFreeSpaces() {
      return map.slice().filter((value) => !value.ship && !value.occupied);
    }

    function allShips() {
      const arr = map.slice().filter((value) => value.ship);

      const getAll = () => arr;
      const log = () => (0,_utility__WEBPACK_IMPORTED_MODULE_1__.logArrays)(arr);
      const sunk = () =>
        arr.filter((value) => !value.ship.isSunk()).length === 0;

      return { getAll, log, sunk };
    }

    return {
      space,
      getDictionary,
      getFreeSpaces,
      allShips,
      getMap,
      getRandomAttackableCoordinate,
    };
  }

  function getSize() {
    return size;
  }

  function getValidCoords(shipSize) {
    function vertical() {
      const mapData = getMapData();
      const freeSpaceArr = mapData.getFreeSpaces();
      const verticalFreeSpaceArr = mapData.getDictionary(freeSpaceArr).columns;
      const startingYPosArr = [];

      function getVerticalDiff(column, j, k) {
        if (j + k >= column.length) return false;
        const diff = (0,_utility__WEBPACK_IMPORTED_MODULE_1__.difference)(column[j].y, column[j + k].y);
        const log = {
          shipStart: column[j],
          shipEnd: column[j + k],
          diff,
        };
        if (diff === shipSize - 1) return { valid: true, log };
        return { valid: false };
      }

      for (let i = 0; i < verticalFreeSpaceArr.length; i += 1) {
        const column = verticalFreeSpaceArr[i];
        for (let j = 0; j < column.length; j += 1) {
          for (let k = 0; k < shipSize; k += 1) {
            if (getVerticalDiff(column, j, k).valid) {
              startingYPosArr.push(column[j]);
            }
          }
        }
      }
      return startingYPosArr;
    }

    function horizontal() {
      const mapData = getMapData();
      const freeSpaceArr = mapData.getFreeSpaces();
      const startingXPosArr = [];
      function getHorizontalDiff(i, k) {
        if (i + k >= freeSpaceArr.length) return false;
        const diff = (0,_utility__WEBPACK_IMPORTED_MODULE_1__.difference)(freeSpaceArr[i].x, freeSpaceArr[i + k].x);
        const log = {
          shipStart: freeSpaceArr[i],
          shipEnd: freeSpaceArr[i + k],
          diff,
        };
        if (diff === shipSize - 1) return { valid: true, log };
        return { valid: false };
      }

      for (let i = 0; i < freeSpaceArr.length; i += 1) {
        for (let k = 0; k < shipSize; k += 1) {
          if (getHorizontalDiff(i, k).valid) {
            startingXPosArr.push(freeSpaceArr[i]);
          }
        }
      }

      return startingXPosArr;
    }

    // console.log({ startingXPosArr, startingYPosArr });

    return { vertical, horizontal };
  }

  function setOccupiedSpace(ship) {
    const mapData = getMapData();
    const coords = ship.getCoordinates();
    const start = coords[0];
    const end = coords[coords.length - 1];

    function getVertical() {
      let adjacentOccupiedSpaceVertical = [
        [start.x, start.y - 1],
        [start.x + 1, start.y - 1],
        [start.x - 1, start.y - 1],

        [end.x, end.y + 1],
        [end.x - 1, end.y + 1],
        [end.x + 1, end.y + 1],
      ];

      for (let j = 0; j < coords.length; j += 1) {
        adjacentOccupiedSpaceVertical.push([coords[j].x + 1, coords[j].y]);
        adjacentOccupiedSpaceVertical.push([coords[j].x - 1, coords[j].y]);
      }

      adjacentOccupiedSpaceVertical = adjacentOccupiedSpaceVertical.filter(
        (value) =>
          !(value[0] > size - 1) &&
          !(value[1] > size - 1) &&
          !(value[0] < 0) &&
          !(value[1] < 0)
      );

      for (let i = 0; i < adjacentOccupiedSpaceVertical.length; i += 1) {
        mapData.space(adjacentOccupiedSpaceVertical[i]).setOccupied(true);
      }
      return adjacentOccupiedSpaceVertical;
    }

    function getHorizontal() {
      let adjacentOccupiedSpaceHorizontal = [
        [start.x - 1, start.y],
        [start.x - 1, start.y + 1],
        [start.x - 1, start.y - 1],

        [end.x + 1, end.y],
        [end.x + 1, end.y + 1],
        [end.x + 1, end.y - 1],
      ];

      for (let j = 0; j < coords.length; j += 1) {
        adjacentOccupiedSpaceHorizontal.push([coords[j].x, coords[j].y + 1]);
        adjacentOccupiedSpaceHorizontal.push([coords[j].x, coords[j].y - 1]);
      }

      adjacentOccupiedSpaceHorizontal = adjacentOccupiedSpaceHorizontal.filter(
        (value) =>
          !(value[0] > size - 1) &&
          !(value[1] > size - 1) &&
          !(value[0] < 0) &&
          !(value[1] < 0)
      );

      for (let i = 0; i < adjacentOccupiedSpaceHorizontal.length; i += 1) {
        mapData.space(adjacentOccupiedSpaceHorizontal[i]).setOccupied(true);
      }
      return adjacentOccupiedSpaceHorizontal;
    }

    if (ship.getAxis() === "x") {
      return getHorizontal();
    }
    if (ship.getAxis() === "y") {
      return getVertical();
    }
  }

  function placeShipPart(coords, ship) {
    getMapData().space(coords).setShip(ship);
  }

  function placeShip(coords, shipSize, axis) {
    if (axis !== "x" && axis !== "y")
      throw new Error("Ship must have a valid direction");
    if (axis === "x") {
      if (shipSize + coords[0] > size) return;
    }
    if (axis === "y") {
      if (shipSize + coords[1] > size) return;
    }

    const ship = Ship(shipSize, axis);

    const arrayCords = [];
    const mapData = getMapData();
    let cordData;

    function pushCoordDataIntoShip(data) {
      const mapCoordsClone = JSON.parse(
        JSON.stringify(mapData.space(data).get())
      );
      delete mapCoordsClone.ship;
      arrayCords.push(mapCoordsClone);
    }

    const shpSize = ship.getSize();

    for (let i = 0; i < shpSize; i += 1) {
      if (ship.getAxis() === "x") {
        if (coords[0] + shpSize <= size) {
          cordData = [coords[0] + i, coords[1]];
        }
      } else if (ship.getAxis() === "y") {
        if (coords[1] + shpSize <= size) {
          cordData = [coords[0], coords[1] + i];
        }
      }

      if (typeof cordData === "undefined" || cordData === null) {
        console.log({ coords, axis, shipSize });
        throw new Error("Coordinates must not be null or undefined");
      }

      placeShipPart(cordData, ship);
      pushCoordDataIntoShip(cordData);
    }

    ship.setCoordinates(arrayCords);
    setOccupiedSpace(ship);
  }

  function receiveAttack(coords) {
    const mapData = getMapData();
    if (mapData.space(coords).hasMissed() || mapData.space(coords).isHit())
      return null;
    if (mapData.space(coords).hasShip()) {
      const shp = mapData.space(coords).ship().getShip();
      shp.hit();
      mapData.space(coords).setHit();
      if (shp.isSunk() && !mapData.allShips().sunk()) {
        return { sunk: shp.isSunk(), shipCords: shp.getCoordinates() };
      }
      if (mapData.allShips().sunk())
        return {
          sunk: shp.isSunk(),
          gameover: true,
          shipCords: shp.getCoordinates(),
        };
      return { hit: mapData.space(coords).isHit() };
    }
    mapData.space(coords).setMissed();
    return { miss: mapData.space(coords).hasMissed() };
  }

  return {
    getSize,
    placeShip,
    placeShipPart,
    receiveAttack,
    getMapData,
    getValidCoords,
  };
};

const Player = (name, tableQuerySelector) => {
  const gameBrd = Gameboard();
  const playableShips = [
    { size: 1, howMany: 4 },
    { size: 2, howMany: 3 },
    { size: 3, howMany: 2 },
    { size: 4, howMany: 1 },
  ];
  const table = (0,_DOM__WEBPACK_IMPORTED_MODULE_0__.Table)(10, tableQuerySelector);
  let turn = false;
  let id;

  function setTurn(bool) {
    turn = bool;
  }

  function getTurn() {
    return turn;
  }

  function getName() {
    return name;
  }

  function setId(str) {
    id = str;
  }

  function getId() {
    return id;
  }

  // TODO write test that multiples the size by howMany and expect with the default board size
  // and playable ships
  // it will equal 20

  return {
    gameBrd,
    playableShips,
    table,
    setTurn,
    getTurn,
    getName,
    setId,
    getId,
  };
};

// by default the game will have 10 ships on a grid with a size of 10
const Game = () => {
  const self = Player("You", ".battlefield-self");
  const rival = Player("Rival", ".battlefield-rival");
  const players = [self, rival];

  self.setId("self");
  self.setTurn(true);

  rival.setId("rival");

  function getTurn() {
    let currentTurn;
    let nextTurn;
    players.forEach((player) => {
      if (player.getTurn()) {
        currentTurn = player;
      } else {
        nextTurn = player;
      }
    });
    return { currentTurn, nextTurn };
  }

  function getRemainingShipsToPlace(player) {
    let count = 0;
    for (let i = 0; i < player.playableShips.length; i += 1) {
      count += player.playableShips[i].howMany;
    }
    return count;
  }

  function random(player) {
    while (getRemainingShipsToPlace(player) > 0) {
      const playableShips = player.playableShips.filter(
        (value) => value.howMany > 0
      );
      const playableShipIndex = Math.floor(
        Math.random() * playableShips.length
      );
      const shipSize = playableShips[playableShipIndex].size;

      const randAxis = Math.floor(Math.random() * 2);

      let axis;
      let validStartingPositions;

      if (randAxis === 0) {
        axis = "x";
        validStartingPositions = player.gameBrd
          .getValidCoords(shipSize)
          .horizontal();
      }
      if (randAxis === 1) {
        axis = "y";
        validStartingPositions = player.gameBrd
          .getValidCoords(shipSize)
          .vertical();
      }

      const coordIndex = Math.floor(
        Math.random() * validStartingPositions.length
      );

      const getTarget = () => validStartingPositions[coordIndex];

      let target = getTarget();
      while (target === undefined || target === null) {
        target = getTarget();
      }

      const log = {
        playableShips: player.playableShips,
        target,
        axis,
        shipSize,
        remainingShips: getRemainingShipsToPlace(player),
        validStartingPositions,
        coordIndex,
      };

      console.log(log);
      player.gameBrd.placeShip([target.x, target.y], shipSize, axis);

      playableShips[playableShipIndex].howMany -= 1;
    }
    if (getRemainingShipsToPlace(player) === 0) {
      console.log("success");
    }
  }

  random(self);
  random(rival);

  return { self, rival, getTurn };
};




/***/ }),

/***/ "./src/modules/main.js":
/*!*****************************!*\
  !*** ./src/modules/main.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _battleship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./battleship */ "./src/modules/battleship.js");
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DOM */ "./src/modules/DOM.js");



const initHTML = (0,_DOM__WEBPACK_IMPORTED_MODULE_1__.getBodyInnerHTML)();

const game = (0,_battleship__WEBPACK_IMPORTED_MODULE_0__.Game)();

const { self } = game;
const { rival } = game;

function gameLoop({ aiEnabled = false }) {
  let { currentTurn } = game.getTurn();
  let { nextTurn } = game.getTurn();
  if (aiEnabled) {
    currentTurn = self;
    nextTurn = rival;
  }

  const selfArgs = self.table.args;
  self.table = (0,_DOM__WEBPACK_IMPORTED_MODULE_1__.Table)(selfArgs.tableSize, selfArgs.parentQuery);

  const rivalArgs = rival.table.args;
  rival.table = (0,_DOM__WEBPACK_IMPORTED_MODULE_1__.Table)(rivalArgs.tableSize, rivalArgs.parentQuery);

  self.table.render();
  rival.table.render();

  self.table.update(self);
  rival.table.update(rival);

  nextTurn.table.toggleAttackCursor();

  (0,_DOM__WEBPACK_IMPORTED_MODULE_1__.renderNotification)(
    `It is <span class="${currentTurn.getId()}-victory">${currentTurn.getName()}'s</span> turn, click on <span class="${nextTurn.getId()}-victory">${nextTurn.getName()}'s</span> board to attack`
  );

  currentTurn.table.toggleDisabled();

  nextTurn.table.addAttackEventListener((e) => {
    const x = Number(e.currentTarget.dataset.x);
    const y = Number(e.currentTarget.dataset.y);
    const attack = nextTurn.gameBrd.receiveAttack([x, y]);
    console.log(attack);
    if (attack !== null) {
      nextTurn.table.renderAttackResult(attack, [x, y]);
      if (attack.gameover)
        return (0,_DOM__WEBPACK_IMPORTED_MODULE_1__.renderVictoryScreen)(
          currentTurn.getName(),
          currentTurn.getId(),
          nextTurn.getId()
        );
    } else {
      return null;
    }
    if (!aiEnabled) {
      (0,_DOM__WEBPACK_IMPORTED_MODULE_1__.renderPassScreen)(
        currentTurn.getName(),
        currentTurn.getId(),
        nextTurn.getName(),
        nextTurn.getId()
      );

      document.querySelector(".pass-btn").addEventListener("click", (e) => {
        nextTurn.setTurn(true);
        currentTurn.setTurn(false);
        (0,_DOM__WEBPACK_IMPORTED_MODULE_1__.setBodyInnerHTML)(initHTML);
        gameLoop(aiEnabled);
      });
    } else {
      const attackableCoordinate = self.gameBrd
        .getMapData()
        .getRandomAttackableCoordinate();
      const aiAttack = self.gameBrd.receiveAttack([
        attackableCoordinate.x,
        attackableCoordinate.y,
      ]);
      console.log({ aiAttack });
      if (aiAttack !== null) {
        self.table.renderAttackResult(aiAttack, [
          attackableCoordinate.x,
          attackableCoordinate.y,
        ]);
        if (aiAttack.gameover)
          return (0,_DOM__WEBPACK_IMPORTED_MODULE_1__.renderVictoryScreen)(
            rival.getName(),
            rival.getId(),
            self.getId()
          );
      } else {
        return null;
      }
    }
  });
}

gameLoop({ aiEnabled: true });


/***/ }),

/***/ "./src/modules/utility.js":
/*!********************************!*\
  !*** ./src/modules/utility.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   difference: () => (/* binding */ difference),
/* harmony export */   logArrays: () => (/* binding */ logArrays)
/* harmony export */ });
function logArrays(...arr) {
  for (let i = 0; i < arr.length; i += 1) {
    for (let j = 0; j < arr[i].length; j += 1) {
      console.log(arr[i][j]);
    }
  }
}

// use my utility function! :D

function difference(num1, num2) {
  return Math.abs(num1 - num2);
}




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__("./src/modules/DOM.js");
/******/ 	__webpack_require__("./src/modules/battleship.js");
/******/ 	__webpack_require__("./src/modules/utility.js");
/******/ 	var __webpack_exports__ = __webpack_require__("./src/modules/main.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxvQkFBb0IsbUJBQW1CO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFaUM7Ozs7Ozs7VUNkakM7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL1RlbXBsYXRlVGFnL1RlbXBsYXRlVGFnLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvVGVtcGxhdGVUYWcvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9jb2RlQmxvY2svaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9jb21tYUxpc3RzL2NvbW1hTGlzdHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9jb21tYUxpc3RzL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvY29tbWFMaXN0c0FuZC9jb21tYUxpc3RzQW5kLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvY29tbWFMaXN0c0FuZC9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL2NvbW1hTGlzdHNPci9jb21tYUxpc3RzT3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9jb21tYUxpc3RzT3IvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9odG1sL2h0bWwuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9odG1sL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9pbmxpbmVBcnJheVRyYW5zZm9ybWVyL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvaW5saW5lQXJyYXlUcmFuc2Zvcm1lci9pbmxpbmVBcnJheVRyYW5zZm9ybWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvaW5saW5lTGlzdHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9pbmxpbmVMaXN0cy9pbmxpbmVMaXN0cy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL29uZUxpbmUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9vbmVMaW5lL29uZUxpbmUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9vbmVMaW5lQ29tbWFMaXN0cy9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL29uZUxpbmVDb21tYUxpc3RzL29uZUxpbmVDb21tYUxpc3RzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvb25lTGluZUNvbW1hTGlzdHNBbmQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9vbmVMaW5lQ29tbWFMaXN0c0FuZC9vbmVMaW5lQ29tbWFMaXN0c0FuZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL29uZUxpbmVDb21tYUxpc3RzT3IvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9vbmVMaW5lQ29tbWFMaXN0c09yL29uZUxpbmVDb21tYUxpc3RzT3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9vbmVMaW5lSW5saW5lTGlzdHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9vbmVMaW5lSW5saW5lTGlzdHMvb25lTGluZUlubGluZUxpc3RzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvb25lTGluZVRyaW0vaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9vbmVMaW5lVHJpbS9vbmVMaW5lVHJpbS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL3JlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9yZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyL3JlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIvcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvcmVwbGFjZVN0cmluZ1RyYW5zZm9ybWVyL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvcmVwbGFjZVN0cmluZ1RyYW5zZm9ybWVyL3JlcGxhY2VTdHJpbmdUcmFuc2Zvcm1lci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL3JlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lci9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL3JlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lci9yZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9zYWZlSHRtbC9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL3NhZmVIdG1sL3NhZmVIdG1sLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvc291cmNlL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvc3BsaXRTdHJpbmdUcmFuc2Zvcm1lci9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL3NwbGl0U3RyaW5nVHJhbnNmb3JtZXIvc3BsaXRTdHJpbmdUcmFuc2Zvcm1lci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL3N0cmlwSW5kZW50L2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvc3RyaXBJbmRlbnQvc3RyaXBJbmRlbnQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9zdHJpcEluZGVudFRyYW5zZm9ybWVyL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvc3RyaXBJbmRlbnRUcmFuc2Zvcm1lci9zdHJpcEluZGVudFRyYW5zZm9ybWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvc3RyaXBJbmRlbnRzL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvc3RyaXBJbmRlbnRzL3N0cmlwSW5kZW50cy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL3RyaW1SZXN1bHRUcmFuc2Zvcm1lci9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL3RyaW1SZXN1bHRUcmFuc2Zvcm1lci90cmltUmVzdWx0VHJhbnNmb3JtZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL0RPTS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvYmF0dGxlc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvbWFpbi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvdXRpbGl0eS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfdGVtcGxhdGVPYmplY3QgPSBfdGFnZ2VkVGVtcGxhdGVMaXRlcmFsKFsnJywgJyddLCBbJycsICcnXSk7XG5cbmZ1bmN0aW9uIF90YWdnZWRUZW1wbGF0ZUxpdGVyYWwoc3RyaW5ncywgcmF3KSB7IHJldHVybiBPYmplY3QuZnJlZXplKE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHN0cmluZ3MsIHsgcmF3OiB7IHZhbHVlOiBPYmplY3QuZnJlZXplKHJhdykgfSB9KSk7IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuLyoqXG4gKiBAY2xhc3MgVGVtcGxhdGVUYWdcbiAqIEBjbGFzc2Rlc2MgQ29uc3VtZXMgYSBwaXBlbGluZSBvZiBjb21wb3NhYmxlIHRyYW5zZm9ybWVyIHBsdWdpbnMgYW5kIHByb2R1Y2VzIGEgdGVtcGxhdGUgdGFnLlxuICovXG52YXIgVGVtcGxhdGVUYWcgPSBmdW5jdGlvbiAoKSB7XG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RzIGEgdGVtcGxhdGUgdGFnXG4gICAqIEBjb25zdHJ1Y3RzIFRlbXBsYXRlVGFnXG4gICAqIEBwYXJhbSAgey4uLk9iamVjdH0gWy4uLnRyYW5zZm9ybWVyc10gLSBhbiBhcnJheSBvciBhcmd1bWVudHMgbGlzdCBvZiB0cmFuc2Zvcm1lcnNcbiAgICogQHJldHVybiB7RnVuY3Rpb259ICAgICAgICAgICAgICAgICAgICAtIGEgdGVtcGxhdGUgdGFnXG4gICAqL1xuICBmdW5jdGlvbiBUZW1wbGF0ZVRhZygpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHRyYW5zZm9ybWVycyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgdHJhbnNmb3JtZXJzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBUZW1wbGF0ZVRhZyk7XG5cbiAgICB0aGlzLnRhZyA9IGZ1bmN0aW9uIChzdHJpbmdzKSB7XG4gICAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGV4cHJlc3Npb25zID0gQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICBleHByZXNzaW9uc1tfa2V5MiAtIDFdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBzdHJpbmdzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIGlmIHRoZSBmaXJzdCBhcmd1bWVudCBwYXNzZWQgaXMgYSBmdW5jdGlvbiwgYXNzdW1lIGl0IGlzIGEgdGVtcGxhdGUgdGFnIGFuZCByZXR1cm5cbiAgICAgICAgLy8gYW4gaW50ZXJtZWRpYXJ5IHRhZyB0aGF0IHByb2Nlc3NlcyB0aGUgdGVtcGxhdGUgdXNpbmcgdGhlIGFmb3JlbWVudGlvbmVkIHRhZywgcGFzc2luZyB0aGVcbiAgICAgICAgLy8gcmVzdWx0IHRvIG91ciB0YWdcbiAgICAgICAgcmV0dXJuIF90aGlzLmludGVyaW1UYWcuYmluZChfdGhpcywgc3RyaW5ncyk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygc3RyaW5ncyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgLy8gaWYgdGhlIGZpcnN0IGFyZ3VtZW50IHBhc3NlZCBpcyBhIHN0cmluZywganVzdCB0cmFuc2Zvcm0gaXRcbiAgICAgICAgcmV0dXJuIF90aGlzLnRyYW5zZm9ybUVuZFJlc3VsdChzdHJpbmdzKTtcbiAgICAgIH1cblxuICAgICAgLy8gZWxzZSwgcmV0dXJuIGEgdHJhbnNmb3JtZWQgZW5kIHJlc3VsdCBvZiBwcm9jZXNzaW5nIHRoZSB0ZW1wbGF0ZSB3aXRoIG91ciB0YWdcbiAgICAgIHN0cmluZ3MgPSBzdHJpbmdzLm1hcChfdGhpcy50cmFuc2Zvcm1TdHJpbmcuYmluZChfdGhpcykpO1xuICAgICAgcmV0dXJuIF90aGlzLnRyYW5zZm9ybUVuZFJlc3VsdChzdHJpbmdzLnJlZHVjZShfdGhpcy5wcm9jZXNzU3Vic3RpdHV0aW9ucy5iaW5kKF90aGlzLCBleHByZXNzaW9ucykpKTtcbiAgICB9O1xuXG4gICAgLy8gaWYgZmlyc3QgYXJndW1lbnQgaXMgYW4gYXJyYXksIGV4dHJ1ZGUgaXQgYXMgYSBsaXN0IG9mIHRyYW5zZm9ybWVyc1xuICAgIGlmICh0cmFuc2Zvcm1lcnMubGVuZ3RoID4gMCAmJiBBcnJheS5pc0FycmF5KHRyYW5zZm9ybWVyc1swXSkpIHtcbiAgICAgIHRyYW5zZm9ybWVycyA9IHRyYW5zZm9ybWVyc1swXTtcbiAgICB9XG5cbiAgICAvLyBpZiBhbnkgdHJhbnNmb3JtZXJzIGFyZSBmdW5jdGlvbnMsIHRoaXMgbWVhbnMgdGhleSBhcmUgbm90IGluaXRpYXRlZCAtIGF1dG9tYXRpY2FsbHkgaW5pdGlhdGUgdGhlbVxuICAgIHRoaXMudHJhbnNmb3JtZXJzID0gdHJhbnNmb3JtZXJzLm1hcChmdW5jdGlvbiAodHJhbnNmb3JtZXIpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdHJhbnNmb3JtZXIgPT09ICdmdW5jdGlvbicgPyB0cmFuc2Zvcm1lcigpIDogdHJhbnNmb3JtZXI7XG4gICAgfSk7XG5cbiAgICAvLyByZXR1cm4gYW4gRVMyMDE1IHRlbXBsYXRlIHRhZ1xuICAgIHJldHVybiB0aGlzLnRhZztcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIGFsbCB0cmFuc2Zvcm1lcnMgdG8gYSB0ZW1wbGF0ZSBsaXRlcmFsIHRhZ2dlZCB3aXRoIHRoaXMgbWV0aG9kLlxuICAgKiBJZiBhIGZ1bmN0aW9uIGlzIHBhc3NlZCBhcyB0aGUgZmlyc3QgYXJndW1lbnQsIGFzc3VtZXMgdGhlIGZ1bmN0aW9uIGlzIGEgdGVtcGxhdGUgdGFnXG4gICAqIGFuZCBhcHBsaWVzIGl0IHRvIHRoZSB0ZW1wbGF0ZSwgcmV0dXJuaW5nIGEgdGVtcGxhdGUgdGFnLlxuICAgKiBAcGFyYW0gIHsoRnVuY3Rpb258U3RyaW5nfEFycmF5PFN0cmluZz4pfSBzdHJpbmdzICAgICAgICAtIEVpdGhlciBhIHRlbXBsYXRlIHRhZyBvciBhbiBhcnJheSBjb250YWluaW5nIHRlbXBsYXRlIHN0cmluZ3Mgc2VwYXJhdGVkIGJ5IGlkZW50aWZpZXJcbiAgICogQHBhcmFtICB7Li4uKn0gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uZXhwcmVzc2lvbnMgLSBPcHRpb25hbCBsaXN0IG9mIHN1YnN0aXR1dGlvbiB2YWx1ZXMuXG4gICAqIEByZXR1cm4geyhTdHJpbmd8RnVuY3Rpb24pfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gRWl0aGVyIGFuIGludGVybWVkaWFyeSB0YWcgZnVuY3Rpb24gb3IgdGhlIHJlc3VsdHMgb2YgcHJvY2Vzc2luZyB0aGUgdGVtcGxhdGUuXG4gICAqL1xuXG5cbiAgX2NyZWF0ZUNsYXNzKFRlbXBsYXRlVGFnLCBbe1xuICAgIGtleTogJ2ludGVyaW1UYWcnLFxuXG5cbiAgICAvKipcbiAgICAgKiBBbiBpbnRlcm1lZGlhcnkgdGVtcGxhdGUgdGFnIHRoYXQgcmVjZWl2ZXMgYSB0ZW1wbGF0ZSB0YWcgYW5kIHBhc3NlcyB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIHRlbXBsYXRlIHdpdGggdGhlIHJlY2VpdmVkXG4gICAgICogdGVtcGxhdGUgdGFnIHRvIG91ciBvd24gdGVtcGxhdGUgdGFnLlxuICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgICAgICAgbmV4dFRhZyAgICAgICAgICAtIHRoZSByZWNlaXZlZCB0ZW1wbGF0ZSB0YWdcbiAgICAgKiBAcGFyYW0gIHtBcnJheTxTdHJpbmc+fSAgIHRlbXBsYXRlICAgICAgICAgLSB0aGUgdGVtcGxhdGUgdG8gcHJvY2Vzc1xuICAgICAqIEBwYXJhbSAgey4uLip9ICAgICAgICAgICAgLi4uc3Vic3RpdHV0aW9ucyAtIGBzdWJzdGl0dXRpb25zYCBpcyBhbiBhcnJheSBvZiBhbGwgc3Vic3RpdHV0aW9ucyBpbiB0aGUgdGVtcGxhdGVcbiAgICAgKiBAcmV0dXJuIHsqfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSB0aGUgZmluYWwgcHJvY2Vzc2VkIHZhbHVlXG4gICAgICovXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGludGVyaW1UYWcocHJldmlvdXNUYWcsIHRlbXBsYXRlKSB7XG4gICAgICBmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIHN1YnN0aXR1dGlvbnMgPSBBcnJheShfbGVuMyA+IDIgPyBfbGVuMyAtIDIgOiAwKSwgX2tleTMgPSAyOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG4gICAgICAgIHN1YnN0aXR1dGlvbnNbX2tleTMgLSAyXSA9IGFyZ3VtZW50c1tfa2V5M107XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnRhZyhfdGVtcGxhdGVPYmplY3QsIHByZXZpb3VzVGFnLmFwcGx5KHVuZGVmaW5lZCwgW3RlbXBsYXRlXS5jb25jYXQoc3Vic3RpdHV0aW9ucykpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtcyBidWxrIHByb2Nlc3Npbmcgb24gdGhlIHRhZ2dlZCB0ZW1wbGF0ZSwgdHJhbnNmb3JtaW5nIGVhY2ggc3Vic3RpdHV0aW9uIGFuZCB0aGVuXG4gICAgICogY29uY2F0ZW5hdGluZyB0aGUgcmVzdWx0aW5nIHZhbHVlcyBpbnRvIGEgc3RyaW5nLlxuICAgICAqIEBwYXJhbSAge0FycmF5PCo+fSBzdWJzdGl0dXRpb25zIC0gYW4gYXJyYXkgb2YgYWxsIHJlbWFpbmluZyBzdWJzdGl0dXRpb25zIHByZXNlbnQgaW4gdGhpcyB0ZW1wbGF0ZVxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gICByZXN1bHRTb0ZhciAgIC0gdGhpcyBpdGVyYXRpb24ncyByZXN1bHQgc3RyaW5nIHNvIGZhclxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gICByZW1haW5pbmdQYXJ0IC0gdGhlIHRlbXBsYXRlIGNodW5rIGFmdGVyIHRoZSBjdXJyZW50IHN1YnN0aXR1dGlvblxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgICAgICAgIC0gdGhlIHJlc3VsdCBvZiBqb2luaW5nIHRoaXMgaXRlcmF0aW9uJ3MgcHJvY2Vzc2VkIHN1YnN0aXR1dGlvbiB3aXRoIHRoZSByZXN1bHRcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAncHJvY2Vzc1N1YnN0aXR1dGlvbnMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwcm9jZXNzU3Vic3RpdHV0aW9ucyhzdWJzdGl0dXRpb25zLCByZXN1bHRTb0ZhciwgcmVtYWluaW5nUGFydCkge1xuICAgICAgdmFyIHN1YnN0aXR1dGlvbiA9IHRoaXMudHJhbnNmb3JtU3Vic3RpdHV0aW9uKHN1YnN0aXR1dGlvbnMuc2hpZnQoKSwgcmVzdWx0U29GYXIpO1xuICAgICAgcmV0dXJuICcnLmNvbmNhdChyZXN1bHRTb0Zhciwgc3Vic3RpdHV0aW9uLCByZW1haW5pbmdQYXJ0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJdGVyYXRlIHRocm91Z2ggZWFjaCB0cmFuc2Zvcm1lciwgYXBwbHlpbmcgdGhlIHRyYW5zZm9ybWVyJ3MgYG9uU3RyaW5nYCBtZXRob2QgdG8gdGhlIHRlbXBsYXRlXG4gICAgICogc3RyaW5ncyBiZWZvcmUgYWxsIHN1YnN0aXR1dGlvbnMgYXJlIHByb2Nlc3NlZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gIHN0ciAtIFRoZSBpbnB1dCBzdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAtIFRoZSBmaW5hbCByZXN1bHRzIG9mIHByb2Nlc3NpbmcgZWFjaCB0cmFuc2Zvcm1lclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICd0cmFuc2Zvcm1TdHJpbmcnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0cmFuc2Zvcm1TdHJpbmcoc3RyKSB7XG4gICAgICB2YXIgY2IgPSBmdW5jdGlvbiBjYihyZXMsIHRyYW5zZm9ybSkge1xuICAgICAgICByZXR1cm4gdHJhbnNmb3JtLm9uU3RyaW5nID8gdHJhbnNmb3JtLm9uU3RyaW5nKHJlcykgOiByZXM7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtZXJzLnJlZHVjZShjYiwgc3RyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXaGVuIGEgc3Vic3RpdHV0aW9uIGlzIGVuY291bnRlcmVkLCBpdGVyYXRlcyB0aHJvdWdoIGVhY2ggdHJhbnNmb3JtZXIgYW5kIGFwcGxpZXMgdGhlIHRyYW5zZm9ybWVyJ3NcbiAgICAgKiBgb25TdWJzdGl0dXRpb25gIG1ldGhvZCB0byB0aGUgc3Vic3RpdHV0aW9uLlxuICAgICAqIEBwYXJhbSAgeyp9ICAgICAgc3Vic3RpdHV0aW9uIC0gVGhlIGN1cnJlbnQgc3Vic3RpdHV0aW9uXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSByZXN1bHRTb0ZhciAgLSBUaGUgcmVzdWx0IHVwIHRvIGFuZCBleGNsdWRpbmcgdGhpcyBzdWJzdGl0dXRpb24uXG4gICAgICogQHJldHVybiB7Kn0gICAgICAgICAgICAgICAgICAgLSBUaGUgZmluYWwgcmVzdWx0IG9mIGFwcGx5aW5nIGFsbCBzdWJzdGl0dXRpb24gdHJhbnNmb3JtYXRpb25zLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICd0cmFuc2Zvcm1TdWJzdGl0dXRpb24nLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0cmFuc2Zvcm1TdWJzdGl0dXRpb24oc3Vic3RpdHV0aW9uLCByZXN1bHRTb0Zhcikge1xuICAgICAgdmFyIGNiID0gZnVuY3Rpb24gY2IocmVzLCB0cmFuc2Zvcm0pIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybS5vblN1YnN0aXR1dGlvbiA/IHRyYW5zZm9ybS5vblN1YnN0aXR1dGlvbihyZXMsIHJlc3VsdFNvRmFyKSA6IHJlcztcbiAgICAgIH07XG4gICAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1lcnMucmVkdWNlKGNiLCBzdWJzdGl0dXRpb24pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEl0ZXJhdGVzIHRocm91Z2ggZWFjaCB0cmFuc2Zvcm1lciwgYXBwbHlpbmcgdGhlIHRyYW5zZm9ybWVyJ3MgYG9uRW5kUmVzdWx0YCBtZXRob2QgdG8gdGhlXG4gICAgICogdGVtcGxhdGUgbGl0ZXJhbCBhZnRlciBhbGwgc3Vic3RpdHV0aW9ucyBoYXZlIGZpbmlzaGVkIHByb2Nlc3NpbmcuXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBlbmRSZXN1bHQgLSBUaGUgcHJvY2Vzc2VkIHRlbXBsYXRlLCBqdXN0IGJlZm9yZSBpdCBpcyByZXR1cm5lZCBmcm9tIHRoZSB0YWdcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAgICAtIFRoZSBmaW5hbCByZXN1bHRzIG9mIHByb2Nlc3NpbmcgZWFjaCB0cmFuc2Zvcm1lclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICd0cmFuc2Zvcm1FbmRSZXN1bHQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0cmFuc2Zvcm1FbmRSZXN1bHQoZW5kUmVzdWx0KSB7XG4gICAgICB2YXIgY2IgPSBmdW5jdGlvbiBjYihyZXMsIHRyYW5zZm9ybSkge1xuICAgICAgICByZXR1cm4gdHJhbnNmb3JtLm9uRW5kUmVzdWx0ID8gdHJhbnNmb3JtLm9uRW5kUmVzdWx0KHJlcykgOiByZXM7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtZXJzLnJlZHVjZShjYiwgZW5kUmVzdWx0KTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gVGVtcGxhdGVUYWc7XG59KCk7XG5cbmV4cG9ydCBkZWZhdWx0IFRlbXBsYXRlVGFnO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5VVpXMXdiR0YwWlZSaFp5OVVaVzF3YkdGMFpWUmhaeTVxY3lKZExDSnVZVzFsY3lJNld5SlVaVzF3YkdGMFpWUmhaeUlzSW5SeVlXNXpabTl5YldWeWN5SXNJblJoWnlJc0luTjBjbWx1WjNNaUxDSmxlSEJ5WlhOemFXOXVjeUlzSW1sdWRHVnlhVzFVWVdjaUxDSmlhVzVrSWl3aWRISmhibk5tYjNKdFJXNWtVbVZ6ZFd4MElpd2liV0Z3SWl3aWRISmhibk5tYjNKdFUzUnlhVzVuSWl3aWNtVmtkV05sSWl3aWNISnZZMlZ6YzFOMVluTjBhWFIxZEdsdmJuTWlMQ0pzWlc1bmRHZ2lMQ0pCY25KaGVTSXNJbWx6UVhKeVlYa2lMQ0owY21GdWMyWnZjbTFsY2lJc0luQnlaWFpwYjNWelZHRm5JaXdpZEdWdGNHeGhkR1VpTENKemRXSnpkR2wwZFhScGIyNXpJaXdpY21WemRXeDBVMjlHWVhJaUxDSnlaVzFoYVc1cGJtZFFZWEowSWl3aWMzVmljM1JwZEhWMGFXOXVJaXdpZEhKaGJuTm1iM0p0VTNWaWMzUnBkSFYwYVc5dUlpd2ljMmhwWm5RaUxDSmpiMjVqWVhRaUxDSnpkSElpTENKallpSXNJbkpsY3lJc0luUnlZVzV6Wm05eWJTSXNJbTl1VTNSeWFXNW5JaXdpYjI1VGRXSnpkR2wwZFhScGIyNGlMQ0psYm1SU1pYTjFiSFFpTENKdmJrVnVaRkpsYzNWc2RDSmRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPenM3UVVGQlFUczdPenRKUVVseFFrRXNWenRCUVVOdVFqczdPenM3TzBGQlRVRXNlVUpCUVRaQ08wRkJRVUU3TzBGQlFVRXNjME5CUVdSRExGbEJRV003UVVGQlpFRXNhMEpCUVdNN1FVRkJRVHM3UVVGQlFUczdRVUZCUVN4VFFYVkNOMEpETEVkQmRrSTJRaXhIUVhWQ2RrSXNWVUZCUTBNc1QwRkJSQ3hGUVVFMlFqdEJRVUZCTEhsRFFVRm9Ra01zVjBGQlowSTdRVUZCYUVKQkxHMUNRVUZuUWp0QlFVRkJPenRCUVVOcVF5eFZRVUZKTEU5QlFVOUVMRTlCUVZBc1MwRkJiVUlzVlVGQmRrSXNSVUZCYlVNN1FVRkRha003UVVGRFFUdEJRVU5CTzBGQlEwRXNaVUZCVHl4TlFVRkxSU3hWUVVGTUxFTkJRV2RDUXl4SlFVRm9RaXhEUVVGeFFpeExRVUZ5UWl4RlFVRXlRa2dzVDBGQk0wSXNRMEZCVUR0QlFVTkVPenRCUVVWRUxGVkJRVWtzVDBGQlQwRXNUMEZCVUN4TFFVRnRRaXhSUVVGMlFpeEZRVUZwUXp0QlFVTXZRanRCUVVOQkxHVkJRVThzVFVGQlMwa3NhMEpCUVV3c1EwRkJkMEpLTEU5QlFYaENMRU5CUVZBN1FVRkRSRHM3UVVGRlJEdEJRVU5CUVN4blFrRkJWVUVzVVVGQlVVc3NSMEZCVWl4RFFVRlpMRTFCUVV0RExHVkJRVXdzUTBGQmNVSklMRWxCUVhKQ0xFTkJRVEJDTEV0QlFURkNMRU5CUVZvc1EwRkJWanRCUVVOQkxHRkJRVThzVFVGQlMwTXNhMEpCUVV3c1EwRkRURW9zVVVGQlVVOHNUVUZCVWl4RFFVRmxMRTFCUVV0RExHOUNRVUZNTEVOQlFUQkNUQ3hKUVVFeFFpeERRVUVyUWl4TFFVRXZRaXhGUVVGeFEwWXNWMEZCY2tNc1EwRkJaaXhEUVVSTExFTkJRVkE3UVVGSFJDeExRWHBETkVJN08wRkJRek5DTzBGQlEwRXNVVUZCU1Vnc1lVRkJZVmNzVFVGQllpeEhRVUZ6UWl4RFFVRjBRaXhKUVVFeVFrTXNUVUZCVFVNc1QwRkJUaXhEUVVGallpeGhRVUZoTEVOQlFXSXNRMEZCWkN4RFFVRXZRaXhGUVVFclJEdEJRVU0zUkVFc2NVSkJRV1ZCTEdGQlFXRXNRMEZCWWl4RFFVRm1PMEZCUTBRN08wRkJSVVE3UVVGRFFTeFRRVUZMUVN4WlFVRk1MRWRCUVc5Q1FTeGhRVUZoVHl4SFFVRmlMRU5CUVdsQ0xIVkNRVUZsTzBGQlEyeEVMR0ZCUVU4c1QwRkJUMDhzVjBGQlVDeExRVUYxUWl4VlFVRjJRaXhIUVVGdlEwRXNZVUZCY0VNc1IwRkJiMFJCTEZkQlFUTkVPMEZCUTBRc1MwRkdiVUlzUTBGQmNFSTdPMEZCU1VFN1FVRkRRU3hYUVVGUExFdEJRVXRpTEVkQlFWbzdRVUZEUkRzN1FVRkZSRHM3T3pzN096czdPenM3T3pzN1FVRTBRa0U3T3pzN096czdPeXRDUVZGWFl5eFhMRVZCUVdGRExGRXNSVUZCTkVJN1FVRkJRU3g1UTBGQlprTXNZVUZCWlR0QlFVRm1RU3h4UWtGQlpUdEJRVUZCT3p0QlFVTnNSQ3hoUVVGUExFdEJRVXRvUWl4SFFVRmFMR3RDUVVGclFtTXNPRUpCUVZsRExGRkJRVm9zVTBGQmVVSkRMR0ZCUVhwQ0xFVkJRV3hDTzBGQlEwUTdPMEZCUlVRN096czdPenM3T3pzN08zbERRVkZ4UWtFc1lTeEZRVUZsUXl4WExFVkJRV0ZETEdFc1JVRkJaVHRCUVVNNVJDeFZRVUZOUXl4bFFVRmxMRXRCUVV0RExIRkNRVUZNTEVOQlEyNUNTaXhqUVVGalN5eExRVUZrTEVWQlJHMUNMRVZCUlc1Q1NpeFhRVVp0UWl4RFFVRnlRanRCUVVsQkxHRkJRVThzUjBGQlIwc3NUVUZCU0N4RFFVRlZUQ3hYUVVGV0xFVkJRWFZDUlN4WlFVRjJRaXhGUVVGeFEwUXNZVUZCY2tNc1EwRkJVRHRCUVVORU96dEJRVVZFT3pzN096czdPenM3YjBOQlRXZENTeXhITEVWQlFVczdRVUZEYmtJc1ZVRkJUVU1zUzBGQlN5eFRRVUZNUVN4RlFVRkxMRU5CUVVORExFZEJRVVFzUlVGQlRVTXNVMEZCVGp0QlFVRkJMR1ZCUTFSQkxGVkJRVlZETEZGQlFWWXNSMEZCY1VKRUxGVkJRVlZETEZGQlFWWXNRMEZCYlVKR0xFZEJRVzVDTEVOQlFYSkNMRWRCUVN0RFFTeEhRVVIwUXp0QlFVRkJMRTlCUVZnN1FVRkZRU3hoUVVGUExFdEJRVXN4UWl4WlFVRk1MRU5CUVd0Q1V5eE5RVUZzUWl4RFFVRjVRbWRDTEVWQlFYcENMRVZCUVRaQ1JDeEhRVUUzUWl4RFFVRlFPMEZCUTBRN08wRkJSVVE3T3pzN096czdPenM3TUVOQlQzTkNTaXhaTEVWQlFXTkdMRmNzUlVGQllUdEJRVU12UXl4VlFVRk5UeXhMUVVGTExGTkJRVXhCTEVWQlFVc3NRMEZCUTBNc1IwRkJSQ3hGUVVGTlF5eFRRVUZPTzBGQlFVRXNaVUZEVkVFc1ZVRkJWVVVzWTBGQlZpeEhRVU5KUml4VlFVRlZSU3hqUVVGV0xFTkJRWGxDU0N4SFFVRjZRaXhGUVVFNFFsSXNWMEZCT1VJc1EwRkVTaXhIUVVWSlVTeEhRVWhMTzBGQlFVRXNUMEZCV0R0QlFVbEJMR0ZCUVU4c1MwRkJTekZDTEZsQlFVd3NRMEZCYTBKVExFMUJRV3hDTEVOQlFYbENaMElzUlVGQmVrSXNSVUZCTmtKTUxGbEJRVGRDTEVOQlFWQTdRVUZEUkRzN1FVRkZSRHM3T3pzN096czdPM1ZEUVUxdFFsVXNVeXhGUVVGWE8wRkJRelZDTEZWQlFVMU1MRXRCUVVzc1UwRkJURUVzUlVGQlN5eERRVUZEUXl4SFFVRkVMRVZCUVUxRExGTkJRVTQ3UVVGQlFTeGxRVU5VUVN4VlFVRlZTU3hYUVVGV0xFZEJRWGRDU2l4VlFVRlZTU3hYUVVGV0xFTkJRWE5DVEN4SFFVRjBRaXhEUVVGNFFpeEhRVUZ4UkVFc1IwRkVOVU03UVVGQlFTeFBRVUZZTzBGQlJVRXNZVUZCVHl4TFFVRkxNVUlzV1VGQlRDeERRVUZyUWxNc1RVRkJiRUlzUTBGQmVVSm5RaXhGUVVGNlFpeEZRVUUyUWtzc1UwRkJOMElzUTBGQlVEdEJRVU5FT3pzN096czdaVUZ1U0d0Q0wwSXNWeUlzSW1acGJHVWlPaUpVWlcxd2JHRjBaVlJoWnk1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxS2x4dUlDb2dRR05zWVhOeklGUmxiWEJzWVhSbFZHRm5YRzRnS2lCQVkyeGhjM05rWlhOaklFTnZibk4xYldWeklHRWdjR2x3Wld4cGJtVWdiMllnWTI5dGNHOXpZV0pzWlNCMGNtRnVjMlp2Y20xbGNpQndiSFZuYVc1eklHRnVaQ0J3Y205a2RXTmxjeUJoSUhSbGJYQnNZWFJsSUhSaFp5NWNiaUFxTDF4dVpYaHdiM0owSUdSbFptRjFiSFFnWTJ4aGMzTWdWR1Z0Y0d4aGRHVlVZV2NnZTF4dUlDQXZLaXBjYmlBZ0lDb2dZMjl1YzNSeWRXTjBjeUJoSUhSbGJYQnNZWFJsSUhSaFoxeHVJQ0FnS2lCQVkyOXVjM1J5ZFdOMGN5QlVaVzF3YkdGMFpWUmhaMXh1SUNBZ0tpQkFjR0Z5WVcwZ0lIc3VMaTVQWW1wbFkzUjlJRnN1TGk1MGNtRnVjMlp2Y20xbGNuTmRJQzBnWVc0Z1lYSnlZWGtnYjNJZ1lYSm5kVzFsYm5SeklHeHBjM1FnYjJZZ2RISmhibk5tYjNKdFpYSnpYRzRnSUNBcUlFQnlaWFIxY200Z2UwWjFibU4wYVc5dWZTQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMU0JoSUhSbGJYQnNZWFJsSUhSaFoxeHVJQ0FnS2k5Y2JpQWdZMjl1YzNSeWRXTjBiM0lvTGk0dWRISmhibk5tYjNKdFpYSnpLU0I3WEc0Z0lDQWdMeThnYVdZZ1ptbHljM1FnWVhKbmRXMWxiblFnYVhNZ1lXNGdZWEp5WVhrc0lHVjRkSEoxWkdVZ2FYUWdZWE1nWVNCc2FYTjBJRzltSUhSeVlXNXpabTl5YldWeWMxeHVJQ0FnSUdsbUlDaDBjbUZ1YzJadmNtMWxjbk11YkdWdVozUm9JRDRnTUNBbUppQkJjbkpoZVM1cGMwRnljbUY1S0hSeVlXNXpabTl5YldWeWMxc3dYU2twSUh0Y2JpQWdJQ0FnSUhSeVlXNXpabTl5YldWeWN5QTlJSFJ5WVc1elptOXliV1Z5YzFzd1hUdGNiaUFnSUNCOVhHNWNiaUFnSUNBdkx5QnBaaUJoYm5rZ2RISmhibk5tYjNKdFpYSnpJR0Z5WlNCbWRXNWpkR2x2Ym5Nc0lIUm9hWE1nYldWaGJuTWdkR2hsZVNCaGNtVWdibTkwSUdsdWFYUnBZWFJsWkNBdElHRjFkRzl0WVhScFkyRnNiSGtnYVc1cGRHbGhkR1VnZEdobGJWeHVJQ0FnSUhSb2FYTXVkSEpoYm5ObWIzSnRaWEp6SUQwZ2RISmhibk5tYjNKdFpYSnpMbTFoY0NoMGNtRnVjMlp2Y20xbGNpQTlQaUI3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkSGx3Wlc5bUlIUnlZVzV6Wm05eWJXVnlJRDA5UFNBblpuVnVZM1JwYjI0bklEOGdkSEpoYm5ObWIzSnRaWElvS1NBNklIUnlZVzV6Wm05eWJXVnlPMXh1SUNBZ0lIMHBPMXh1WEc0Z0lDQWdMeThnY21WMGRYSnVJR0Z1SUVWVE1qQXhOU0IwWlcxd2JHRjBaU0IwWVdkY2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1MFlXYzdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUVhCd2JHbGxjeUJoYkd3Z2RISmhibk5tYjNKdFpYSnpJSFJ2SUdFZ2RHVnRjR3hoZEdVZ2JHbDBaWEpoYkNCMFlXZG5aV1FnZDJsMGFDQjBhR2x6SUcxbGRHaHZaQzVjYmlBZ0lDb2dTV1lnWVNCbWRXNWpkR2x2YmlCcGN5QndZWE56WldRZ1lYTWdkR2hsSUdacGNuTjBJR0Z5WjNWdFpXNTBMQ0JoYzNOMWJXVnpJSFJvWlNCbWRXNWpkR2x2YmlCcGN5QmhJSFJsYlhCc1lYUmxJSFJoWjF4dUlDQWdLaUJoYm1RZ1lYQndiR2xsY3lCcGRDQjBieUIwYUdVZ2RHVnRjR3hoZEdVc0lISmxkSFZ5Ym1sdVp5QmhJSFJsYlhCc1lYUmxJSFJoWnk1Y2JpQWdJQ29nUUhCaGNtRnRJQ0I3S0VaMWJtTjBhVzl1ZkZOMGNtbHVaM3hCY25KaGVUeFRkSEpwYm1jK0tYMGdjM1J5YVc1bmN5QWdJQ0FnSUNBZ0xTQkZhWFJvWlhJZ1lTQjBaVzF3YkdGMFpTQjBZV2NnYjNJZ1lXNGdZWEp5WVhrZ1kyOXVkR0ZwYm1sdVp5QjBaVzF3YkdGMFpTQnpkSEpwYm1keklITmxjR0Z5WVhSbFpDQmllU0JwWkdWdWRHbG1hV1Z5WEc0Z0lDQXFJRUJ3WVhKaGJTQWdleTR1TGlwOUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDNHVMbVY0Y0hKbGMzTnBiMjV6SUMwZ1QzQjBhVzl1WVd3Z2JHbHpkQ0J2WmlCemRXSnpkR2wwZFhScGIyNGdkbUZzZFdWekxseHVJQ0FnS2lCQWNtVjBkWEp1SUhzb1UzUnlhVzVuZkVaMWJtTjBhVzl1S1gwZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQXRJRVZwZEdobGNpQmhiaUJwYm5SbGNtMWxaR2xoY25rZ2RHRm5JR1oxYm1OMGFXOXVJRzl5SUhSb1pTQnlaWE4xYkhSeklHOW1JSEJ5YjJObGMzTnBibWNnZEdobElIUmxiWEJzWVhSbExseHVJQ0FnS2k5Y2JpQWdkR0ZuSUQwZ0tITjBjbWx1WjNNc0lDNHVMbVY0Y0hKbGMzTnBiMjV6S1NBOVBpQjdYRzRnSUNBZ2FXWWdLSFI1Y0dWdlppQnpkSEpwYm1keklEMDlQU0FuWm5WdVkzUnBiMjRuS1NCN1hHNGdJQ0FnSUNBdkx5QnBaaUIwYUdVZ1ptbHljM1FnWVhKbmRXMWxiblFnY0dGemMyVmtJR2x6SUdFZ1puVnVZM1JwYjI0c0lHRnpjM1Z0WlNCcGRDQnBjeUJoSUhSbGJYQnNZWFJsSUhSaFp5QmhibVFnY21WMGRYSnVYRzRnSUNBZ0lDQXZMeUJoYmlCcGJuUmxjbTFsWkdsaGNua2dkR0ZuSUhSb1lYUWdjSEp2WTJWemMyVnpJSFJvWlNCMFpXMXdiR0YwWlNCMWMybHVaeUIwYUdVZ1lXWnZjbVZ0Wlc1MGFXOXVaV1FnZEdGbkxDQndZWE56YVc1bklIUm9aVnh1SUNBZ0lDQWdMeThnY21WemRXeDBJSFJ2SUc5MWNpQjBZV2RjYmlBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG1sdWRHVnlhVzFVWVdjdVltbHVaQ2gwYUdsekxDQnpkSEpwYm1kektUdGNiaUFnSUNCOVhHNWNiaUFnSUNCcFppQW9kSGx3Wlc5bUlITjBjbWx1WjNNZ1BUMDlJQ2R6ZEhKcGJtY25LU0I3WEc0Z0lDQWdJQ0F2THlCcFppQjBhR1VnWm1seWMzUWdZWEpuZFcxbGJuUWdjR0Z6YzJWa0lHbHpJR0VnYzNSeWFXNW5MQ0JxZFhOMElIUnlZVzV6Wm05eWJTQnBkRnh1SUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11ZEhKaGJuTm1iM0p0Ulc1a1VtVnpkV3gwS0hOMGNtbHVaM01wTzF4dUlDQWdJSDFjYmx4dUlDQWdJQzh2SUdWc2MyVXNJSEpsZEhWeWJpQmhJSFJ5WVc1elptOXliV1ZrSUdWdVpDQnlaWE4xYkhRZ2IyWWdjSEp2WTJWemMybHVaeUIwYUdVZ2RHVnRjR3hoZEdVZ2QybDBhQ0J2ZFhJZ2RHRm5YRzRnSUNBZ2MzUnlhVzVuY3lBOUlITjBjbWx1WjNNdWJXRndLSFJvYVhNdWRISmhibk5tYjNKdFUzUnlhVzVuTG1KcGJtUW9kR2hwY3lrcE8xeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxuUnlZVzV6Wm05eWJVVnVaRkpsYzNWc2RDaGNiaUFnSUNBZ0lITjBjbWx1WjNNdWNtVmtkV05sS0hSb2FYTXVjSEp2WTJWemMxTjFZbk4wYVhSMWRHbHZibk11WW1sdVpDaDBhR2x6TENCbGVIQnlaWE56YVc5dWN5a3BMRnh1SUNBZ0lDazdYRzRnSUgwN1hHNWNiaUFnTHlvcVhHNGdJQ0FxSUVGdUlHbHVkR1Z5YldWa2FXRnllU0IwWlcxd2JHRjBaU0IwWVdjZ2RHaGhkQ0J5WldObGFYWmxjeUJoSUhSbGJYQnNZWFJsSUhSaFp5QmhibVFnY0dGemMyVnpJSFJvWlNCeVpYTjFiSFFnYjJZZ1kyRnNiR2x1WnlCMGFHVWdkR1Z0Y0d4aGRHVWdkMmwwYUNCMGFHVWdjbVZqWldsMlpXUmNiaUFnSUNvZ2RHVnRjR3hoZEdVZ2RHRm5JSFJ2SUc5MWNpQnZkMjRnZEdWdGNHeGhkR1VnZEdGbkxseHVJQ0FnS2lCQWNHRnlZVzBnSUh0R2RXNWpkR2x2Ym4wZ0lDQWdJQ0FnSUc1bGVIUlVZV2NnSUNBZ0lDQWdJQ0FnTFNCMGFHVWdjbVZqWldsMlpXUWdkR1Z0Y0d4aGRHVWdkR0ZuWEc0Z0lDQXFJRUJ3WVhKaGJTQWdlMEZ5Y21GNVBGTjBjbWx1Wno1OUlDQWdkR1Z0Y0d4aGRHVWdJQ0FnSUNBZ0lDQXRJSFJvWlNCMFpXMXdiR0YwWlNCMGJ5QndjbTlqWlhOelhHNGdJQ0FxSUVCd1lYSmhiU0FnZXk0dUxpcDlJQ0FnSUNBZ0lDQWdJQ0FnTGk0dWMzVmljM1JwZEhWMGFXOXVjeUF0SUdCemRXSnpkR2wwZFhScGIyNXpZQ0JwY3lCaGJpQmhjbkpoZVNCdlppQmhiR3dnYzNWaWMzUnBkSFYwYVc5dWN5QnBiaUIwYUdVZ2RHVnRjR3hoZEdWY2JpQWdJQ29nUUhKbGRIVnliaUI3S24wZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQzBnZEdobElHWnBibUZzSUhCeWIyTmxjM05sWkNCMllXeDFaVnh1SUNBZ0tpOWNiaUFnYVc1MFpYSnBiVlJoWnlod2NtVjJhVzkxYzFSaFp5d2dkR1Z0Y0d4aGRHVXNJQzR1TG5OMVluTjBhWFIxZEdsdmJuTXBJSHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTUwWVdkZ0pIdHdjbVYyYVc5MWMxUmhaeWgwWlcxd2JHRjBaU3dnTGk0dWMzVmljM1JwZEhWMGFXOXVjeWw5WUR0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQlFaWEptYjNKdGN5QmlkV3hySUhCeWIyTmxjM05wYm1jZ2IyNGdkR2hsSUhSaFoyZGxaQ0IwWlcxd2JHRjBaU3dnZEhKaGJuTm1iM0p0YVc1bklHVmhZMmdnYzNWaWMzUnBkSFYwYVc5dUlHRnVaQ0IwYUdWdVhHNGdJQ0FxSUdOdmJtTmhkR1Z1WVhScGJtY2dkR2hsSUhKbGMzVnNkR2x1WnlCMllXeDFaWE1nYVc1MGJ5QmhJSE4wY21sdVp5NWNiaUFnSUNvZ1FIQmhjbUZ0SUNCN1FYSnlZWGs4S2o1OUlITjFZbk4wYVhSMWRHbHZibk1nTFNCaGJpQmhjbkpoZVNCdlppQmhiR3dnY21WdFlXbHVhVzVuSUhOMVluTjBhWFIxZEdsdmJuTWdjSEpsYzJWdWRDQnBiaUIwYUdseklIUmxiWEJzWVhSbFhHNGdJQ0FxSUVCd1lYSmhiU0FnZTFOMGNtbHVaMzBnSUNCeVpYTjFiSFJUYjBaaGNpQWdJQzBnZEdocGN5QnBkR1Z5WVhScGIyNG5jeUJ5WlhOMWJIUWdjM1J5YVc1bklITnZJR1poY2x4dUlDQWdLaUJBY0dGeVlXMGdJSHRUZEhKcGJtZDlJQ0FnY21WdFlXbHVhVzVuVUdGeWRDQXRJSFJvWlNCMFpXMXdiR0YwWlNCamFIVnVheUJoWm5SbGNpQjBhR1VnWTNWeWNtVnVkQ0J6ZFdKemRHbDBkWFJwYjI1Y2JpQWdJQ29nUUhKbGRIVnliaUI3VTNSeWFXNW5mU0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMU0IwYUdVZ2NtVnpkV3gwSUc5bUlHcHZhVzVwYm1jZ2RHaHBjeUJwZEdWeVlYUnBiMjRuY3lCd2NtOWpaWE56WldRZ2MzVmljM1JwZEhWMGFXOXVJSGRwZEdnZ2RHaGxJSEpsYzNWc2RGeHVJQ0FnS2k5Y2JpQWdjSEp2WTJWemMxTjFZbk4wYVhSMWRHbHZibk1vYzNWaWMzUnBkSFYwYVc5dWN5d2djbVZ6ZFd4MFUyOUdZWElzSUhKbGJXRnBibWx1WjFCaGNuUXBJSHRjYmlBZ0lDQmpiMjV6ZENCemRXSnpkR2wwZFhScGIyNGdQU0IwYUdsekxuUnlZVzV6Wm05eWJWTjFZbk4wYVhSMWRHbHZiaWhjYmlBZ0lDQWdJSE4xWW5OMGFYUjFkR2x2Ym5NdWMyaHBablFvS1N4Y2JpQWdJQ0FnSUhKbGMzVnNkRk52Um1GeUxGeHVJQ0FnSUNrN1hHNGdJQ0FnY21WMGRYSnVJQ2NuTG1OdmJtTmhkQ2h5WlhOMWJIUlRiMFpoY2l3Z2MzVmljM1JwZEhWMGFXOXVMQ0J5WlcxaGFXNXBibWRRWVhKMEtUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJKZEdWeVlYUmxJSFJvY205MVoyZ2daV0ZqYUNCMGNtRnVjMlp2Y20xbGNpd2dZWEJ3YkhscGJtY2dkR2hsSUhSeVlXNXpabTl5YldWeUozTWdZRzl1VTNSeWFXNW5ZQ0J0WlhSb2IyUWdkRzhnZEdobElIUmxiWEJzWVhSbFhHNGdJQ0FxSUhOMGNtbHVaM01nWW1WbWIzSmxJR0ZzYkNCemRXSnpkR2wwZFhScGIyNXpJR0Z5WlNCd2NtOWpaWE56WldRdVhHNGdJQ0FxSUVCd1lYSmhiU0I3VTNSeWFXNW5mU0FnYzNSeUlDMGdWR2hsSUdsdWNIVjBJSE4wY21sdVoxeHVJQ0FnS2lCQWNtVjBkWEp1SUh0VGRISnBibWQ5SUNBZ0lDQXRJRlJvWlNCbWFXNWhiQ0J5WlhOMWJIUnpJRzltSUhCeWIyTmxjM05wYm1jZ1pXRmphQ0IwY21GdWMyWnZjbTFsY2x4dUlDQWdLaTljYmlBZ2RISmhibk5tYjNKdFUzUnlhVzVuS0hOMGNpa2dlMXh1SUNBZ0lHTnZibk4wSUdOaUlEMGdLSEpsY3l3Z2RISmhibk5tYjNKdEtTQTlQbHh1SUNBZ0lDQWdkSEpoYm5ObWIzSnRMbTl1VTNSeWFXNW5JRDhnZEhKaGJuTm1iM0p0TG05dVUzUnlhVzVuS0hKbGN5a2dPaUJ5WlhNN1hHNGdJQ0FnY21WMGRYSnVJSFJvYVhNdWRISmhibk5tYjNKdFpYSnpMbkpsWkhWalpTaGpZaXdnYzNSeUtUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJYYUdWdUlHRWdjM1ZpYzNScGRIVjBhVzl1SUdseklHVnVZMjkxYm5SbGNtVmtMQ0JwZEdWeVlYUmxjeUIwYUhKdmRXZG9JR1ZoWTJnZ2RISmhibk5tYjNKdFpYSWdZVzVrSUdGd2NHeHBaWE1nZEdobElIUnlZVzV6Wm05eWJXVnlKM05jYmlBZ0lDb2dZRzl1VTNWaWMzUnBkSFYwYVc5dVlDQnRaWFJvYjJRZ2RHOGdkR2hsSUhOMVluTjBhWFIxZEdsdmJpNWNiaUFnSUNvZ1FIQmhjbUZ0SUNCN0tuMGdJQ0FnSUNCemRXSnpkR2wwZFhScGIyNGdMU0JVYUdVZ1kzVnljbVZ1ZENCemRXSnpkR2wwZFhScGIyNWNiaUFnSUNvZ1FIQmhjbUZ0SUNCN1UzUnlhVzVuZlNCeVpYTjFiSFJUYjBaaGNpQWdMU0JVYUdVZ2NtVnpkV3gwSUhWd0lIUnZJR0Z1WkNCbGVHTnNkV1JwYm1jZ2RHaHBjeUJ6ZFdKemRHbDBkWFJwYjI0dVhHNGdJQ0FxSUVCeVpYUjFjbTRnZXlwOUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDMGdWR2hsSUdacGJtRnNJSEpsYzNWc2RDQnZaaUJoY0hCc2VXbHVaeUJoYkd3Z2MzVmljM1JwZEhWMGFXOXVJSFJ5WVc1elptOXliV0YwYVc5dWN5NWNiaUFnSUNvdlhHNGdJSFJ5WVc1elptOXliVk4xWW5OMGFYUjFkR2x2YmloemRXSnpkR2wwZFhScGIyNHNJSEpsYzNWc2RGTnZSbUZ5S1NCN1hHNGdJQ0FnWTI5dWMzUWdZMklnUFNBb2NtVnpMQ0IwY21GdWMyWnZjbTBwSUQwK1hHNGdJQ0FnSUNCMGNtRnVjMlp2Y20wdWIyNVRkV0p6ZEdsMGRYUnBiMjVjYmlBZ0lDQWdJQ0FnUHlCMGNtRnVjMlp2Y20wdWIyNVRkV0p6ZEdsMGRYUnBiMjRvY21WekxDQnlaWE4xYkhSVGIwWmhjaWxjYmlBZ0lDQWdJQ0FnT2lCeVpYTTdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVkSEpoYm5ObWIzSnRaWEp6TG5KbFpIVmpaU2hqWWl3Z2MzVmljM1JwZEhWMGFXOXVLVHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCSmRHVnlZWFJsY3lCMGFISnZkV2RvSUdWaFkyZ2dkSEpoYm5ObWIzSnRaWElzSUdGd2NHeDVhVzVuSUhSb1pTQjBjbUZ1YzJadmNtMWxjaWR6SUdCdmJrVnVaRkpsYzNWc2RHQWdiV1YwYUc5a0lIUnZJSFJvWlZ4dUlDQWdLaUIwWlcxd2JHRjBaU0JzYVhSbGNtRnNJR0ZtZEdWeUlHRnNiQ0J6ZFdKemRHbDBkWFJwYjI1eklHaGhkbVVnWm1sdWFYTm9aV1FnY0hKdlkyVnpjMmx1Wnk1Y2JpQWdJQ29nUUhCaGNtRnRJQ0I3VTNSeWFXNW5mU0JsYm1SU1pYTjFiSFFnTFNCVWFHVWdjSEp2WTJWemMyVmtJSFJsYlhCc1lYUmxMQ0JxZFhOMElHSmxabTl5WlNCcGRDQnBjeUJ5WlhSMWNtNWxaQ0JtY205dElIUm9aU0IwWVdkY2JpQWdJQ29nUUhKbGRIVnliaUI3VTNSeWFXNW5mU0FnSUNBZ0lDQWdJQ0FnTFNCVWFHVWdabWx1WVd3Z2NtVnpkV3gwY3lCdlppQndjbTlqWlhOemFXNW5JR1ZoWTJnZ2RISmhibk5tYjNKdFpYSmNiaUFnSUNvdlhHNGdJSFJ5WVc1elptOXliVVZ1WkZKbGMzVnNkQ2hsYm1SU1pYTjFiSFFwSUh0Y2JpQWdJQ0JqYjI1emRDQmpZaUE5SUNoeVpYTXNJSFJ5WVc1elptOXliU2tnUFQ1Y2JpQWdJQ0FnSUhSeVlXNXpabTl5YlM1dmJrVnVaRkpsYzNWc2RDQS9JSFJ5WVc1elptOXliUzV2YmtWdVpGSmxjM1ZzZENoeVpYTXBJRG9nY21Wek8xeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxuUnlZVzV6Wm05eWJXVnljeTV5WldSMVkyVW9ZMklzSUdWdVpGSmxjM1ZzZENrN1hHNGdJSDFjYm4xY2JpSmRmUT09IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vVGVtcGxhdGVUYWcnO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5VVpXMXdiR0YwWlZSaFp5OXBibVJsZUM1cWN5SmRMQ0p1WVcxbGN5STZXeUprWldaaGRXeDBJbDBzSW0xaGNIQnBibWR6SWpvaWNVSkJRVzlDTEdVN2NVSkJRV0pCTEU4aUxDSm1hV3hsSWpvaWFXNWtaWGd1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmxlSEJ2Y25RZ1pHVm1ZWFZzZENCbWNtOXRJQ2N1TDFSbGJYQnNZWFJsVkdGbkp6dGNiaUpkZlE9PSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuLi9odG1sJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OWpiMlJsUW14dlkyc3ZhVzVrWlhndWFuTWlYU3dpYm1GdFpYTWlPbHNpWkdWbVlYVnNkQ0pkTENKdFlYQndhVzVuY3lJNkluRkNRVUZ2UWl4VE8zRkNRVUZpUVN4UElpd2labWxzWlNJNkltbHVaR1Y0TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2laWGh3YjNKMElHUmxabUYxYkhRZ1puSnZiU0FuTGk0dmFIUnRiQ2M3WEc0aVhYMD0iLCJpbXBvcnQgVGVtcGxhdGVUYWcgZnJvbSAnLi4vVGVtcGxhdGVUYWcnO1xuaW1wb3J0IHN0cmlwSW5kZW50VHJhbnNmb3JtZXIgZnJvbSAnLi4vc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcic7XG5pbXBvcnQgaW5saW5lQXJyYXlUcmFuc2Zvcm1lciBmcm9tICcuLi9pbmxpbmVBcnJheVRyYW5zZm9ybWVyJztcbmltcG9ydCB0cmltUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcblxudmFyIGNvbW1hTGlzdHMgPSBuZXcgVGVtcGxhdGVUYWcoaW5saW5lQXJyYXlUcmFuc2Zvcm1lcih7IHNlcGFyYXRvcjogJywnIH0pLCBzdHJpcEluZGVudFRyYW5zZm9ybWVyLCB0cmltUmVzdWx0VHJhbnNmb3JtZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBjb21tYUxpc3RzO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5amIyMXRZVXhwYzNSekwyTnZiVzFoVEdsemRITXVhbk1pWFN3aWJtRnRaWE1pT2xzaVZHVnRjR3hoZEdWVVlXY2lMQ0p6ZEhKcGNFbHVaR1Z1ZEZSeVlXNXpabTl5YldWeUlpd2lhVzVzYVc1bFFYSnlZWGxVY21GdWMyWnZjbTFsY2lJc0luUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUlzSW1OdmJXMWhUR2x6ZEhNaUxDSnpaWEJoY21GMGIzSWlYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRTlCUVU5QkxGZEJRVkFzVFVGQmQwSXNaMEpCUVhoQ08wRkJRMEVzVDBGQlQwTXNjMEpCUVZBc1RVRkJiVU1zTWtKQlFXNURPMEZCUTBFc1QwRkJUME1zYzBKQlFWQXNUVUZCYlVNc01rSkJRVzVETzBGQlEwRXNUMEZCVDBNc2NVSkJRVkFzVFVGQmEwTXNNRUpCUVd4RE96dEJRVVZCTEVsQlFVMURMR0ZCUVdFc1NVRkJTVW9zVjBGQlNpeERRVU5xUWtVc2RVSkJRWFZDTEVWQlFVVkhMRmRCUVZjc1IwRkJZaXhGUVVGMlFpeERRVVJwUWl4RlFVVnFRa29zYzBKQlJtbENMRVZCUjJwQ1JTeHhRa0ZJYVVJc1EwRkJia0k3TzBGQlRVRXNaVUZCWlVNc1ZVRkJaaUlzSW1acGJHVWlPaUpqYjIxdFlVeHBjM1J6TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lhVzF3YjNKMElGUmxiWEJzWVhSbFZHRm5JR1p5YjIwZ0p5NHVMMVJsYlhCc1lYUmxWR0ZuSnp0Y2JtbHRjRzl5ZENCemRISnBjRWx1WkdWdWRGUnlZVzV6Wm05eWJXVnlJR1p5YjIwZ0p5NHVMM04wY21sd1NXNWtaVzUwVkhKaGJuTm1iM0p0WlhJbk8xeHVhVzF3YjNKMElHbHViR2x1WlVGeWNtRjVWSEpoYm5ObWIzSnRaWElnWm5KdmJTQW5MaTR2YVc1c2FXNWxRWEp5WVhsVWNtRnVjMlp2Y20xbGNpYzdYRzVwYlhCdmNuUWdkSEpwYlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5SUdaeWIyMGdKeTR1TDNSeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpYzdYRzVjYm1OdmJuTjBJR052YlcxaFRHbHpkSE1nUFNCdVpYY2dWR1Z0Y0d4aGRHVlVZV2NvWEc0Z0lHbHViR2x1WlVGeWNtRjVWSEpoYm5ObWIzSnRaWElvZXlCelpYQmhjbUYwYjNJNklDY3NKeUI5S1N4Y2JpQWdjM1J5YVhCSmJtUmxiblJVY21GdWMyWnZjbTFsY2l4Y2JpQWdkSEpwYlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5TEZ4dUtUdGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdZMjl0YldGTWFYTjBjenRjYmlKZGZRPT0iLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi9jb21tYUxpc3RzJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OWpiMjF0WVV4cGMzUnpMMmx1WkdWNExtcHpJbDBzSW01aGJXVnpJanBiSW1SbFptRjFiSFFpWFN3aWJXRndjR2x1WjNNaU9pSnhRa0ZCYjBJc1l6dHhRa0ZCWWtFc1R5SXNJbVpwYkdVaU9pSnBibVJsZUM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbVY0Y0c5eWRDQmtaV1poZFd4MElHWnliMjBnSnk0dlkyOXRiV0ZNYVhOMGN5YzdYRzRpWFgwPSIsImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciBmcm9tICcuLi9zdHJpcEluZGVudFRyYW5zZm9ybWVyJztcbmltcG9ydCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyIGZyb20gJy4uL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuXG52YXIgY29tbWFMaXN0c0FuZCA9IG5ldyBUZW1wbGF0ZVRhZyhpbmxpbmVBcnJheVRyYW5zZm9ybWVyKHsgc2VwYXJhdG9yOiAnLCcsIGNvbmp1bmN0aW9uOiAnYW5kJyB9KSwgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciwgdHJpbVJlc3VsdFRyYW5zZm9ybWVyKTtcblxuZXhwb3J0IGRlZmF1bHQgY29tbWFMaXN0c0FuZDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OWpiMjF0WVV4cGMzUnpRVzVrTDJOdmJXMWhUR2x6ZEhOQmJtUXVhbk1pWFN3aWJtRnRaWE1pT2xzaVZHVnRjR3hoZEdWVVlXY2lMQ0p6ZEhKcGNFbHVaR1Z1ZEZSeVlXNXpabTl5YldWeUlpd2lhVzVzYVc1bFFYSnlZWGxVY21GdWMyWnZjbTFsY2lJc0luUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUlzSW1OdmJXMWhUR2x6ZEhOQmJtUWlMQ0p6WlhCaGNtRjBiM0lpTENKamIyNXFkVzVqZEdsdmJpSmRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNUMEZCVDBFc1YwRkJVQ3hOUVVGM1FpeG5Ra0ZCZUVJN1FVRkRRU3hQUVVGUFF5eHpRa0ZCVUN4TlFVRnRReXd5UWtGQmJrTTdRVUZEUVN4UFFVRlBReXh6UWtGQlVDeE5RVUZ0UXl3eVFrRkJia003UVVGRFFTeFBRVUZQUXl4eFFrRkJVQ3hOUVVGclF5d3dRa0ZCYkVNN08wRkJSVUVzU1VGQlRVTXNaMEpCUVdkQ0xFbEJRVWxLTEZkQlFVb3NRMEZEY0VKRkxIVkNRVUYxUWl4RlFVRkZSeXhYUVVGWExFZEJRV0lzUlVGQmEwSkRMR0ZCUVdFc1MwRkJMMElzUlVGQmRrSXNRMEZFYjBJc1JVRkZjRUpNTEhOQ1FVWnZRaXhGUVVkd1FrVXNjVUpCU0c5Q0xFTkJRWFJDT3p0QlFVMUJMR1ZCUVdWRExHRkJRV1lpTENKbWFXeGxJam9pWTI5dGJXRk1hWE4wYzBGdVpDNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0JVWlcxd2JHRjBaVlJoWnlCbWNtOXRJQ2N1TGk5VVpXMXdiR0YwWlZSaFp5YzdYRzVwYlhCdmNuUWdjM1J5YVhCSmJtUmxiblJVY21GdWMyWnZjbTFsY2lCbWNtOXRJQ2N1TGk5emRISnBjRWx1WkdWdWRGUnlZVzV6Wm05eWJXVnlKenRjYm1sdGNHOXlkQ0JwYm14cGJtVkJjbkpoZVZSeVlXNXpabTl5YldWeUlHWnliMjBnSnk0dUwybHViR2x1WlVGeWNtRjVWSEpoYm5ObWIzSnRaWEluTzF4dWFXMXdiM0owSUhSeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpQm1jbTl0SUNjdUxpOTBjbWx0VW1WemRXeDBWSEpoYm5ObWIzSnRaWEluTzF4dVhHNWpiMjV6ZENCamIyMXRZVXhwYzNSelFXNWtJRDBnYm1WM0lGUmxiWEJzWVhSbFZHRm5LRnh1SUNCcGJteHBibVZCY25KaGVWUnlZVzV6Wm05eWJXVnlLSHNnYzJWd1lYSmhkRzl5T2lBbkxDY3NJR052Ym1wMWJtTjBhVzl1T2lBbllXNWtKeUI5S1N4Y2JpQWdjM1J5YVhCSmJtUmxiblJVY21GdWMyWnZjbTFsY2l4Y2JpQWdkSEpwYlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5TEZ4dUtUdGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdZMjl0YldGTWFYTjBjMEZ1WkR0Y2JpSmRmUT09IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vY29tbWFMaXN0c0FuZCc7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTlqYjIxdFlVeHBjM1J6UVc1a0wybHVaR1Y0TG1weklsMHNJbTVoYldWeklqcGJJbVJsWm1GMWJIUWlYU3dpYldGd2NHbHVaM01pT2lKeFFrRkJiMElzYVVJN2NVSkJRV0pCTEU4aUxDSm1hV3hsSWpvaWFXNWtaWGd1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmxlSEJ2Y25RZ1pHVm1ZWFZzZENCbWNtOXRJQ2N1TDJOdmJXMWhUR2x6ZEhOQmJtUW5PMXh1SWwxOSIsImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciBmcm9tICcuLi9zdHJpcEluZGVudFRyYW5zZm9ybWVyJztcbmltcG9ydCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyIGZyb20gJy4uL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuXG52YXIgY29tbWFMaXN0c09yID0gbmV3IFRlbXBsYXRlVGFnKGlubGluZUFycmF5VHJhbnNmb3JtZXIoeyBzZXBhcmF0b3I6ICcsJywgY29uanVuY3Rpb246ICdvcicgfSksIHN0cmlwSW5kZW50VHJhbnNmb3JtZXIsIHRyaW1SZXN1bHRUcmFuc2Zvcm1lcik7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbW1hTGlzdHNPcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OWpiMjF0WVV4cGMzUnpUM0l2WTI5dGJXRk1hWE4wYzA5eUxtcHpJbDBzSW01aGJXVnpJanBiSWxSbGJYQnNZWFJsVkdGbklpd2ljM1J5YVhCSmJtUmxiblJVY21GdWMyWnZjbTFsY2lJc0ltbHViR2x1WlVGeWNtRjVWSEpoYm5ObWIzSnRaWElpTENKMGNtbHRVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSWlMQ0pqYjIxdFlVeHBjM1J6VDNJaUxDSnpaWEJoY21GMGIzSWlMQ0pqYjI1cWRXNWpkR2x2YmlKZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1QwRkJUMEVzVjBGQlVDeE5RVUYzUWl4blFrRkJlRUk3UVVGRFFTeFBRVUZQUXl4elFrRkJVQ3hOUVVGdFF5d3lRa0ZCYmtNN1FVRkRRU3hQUVVGUFF5eHpRa0ZCVUN4TlFVRnRReXd5UWtGQmJrTTdRVUZEUVN4UFFVRlBReXh4UWtGQlVDeE5RVUZyUXl3d1FrRkJiRU03TzBGQlJVRXNTVUZCVFVNc1pVRkJaU3hKUVVGSlNpeFhRVUZLTEVOQlEyNUNSU3gxUWtGQmRVSXNSVUZCUlVjc1YwRkJWeXhIUVVGaUxFVkJRV3RDUXl4aFFVRmhMRWxCUVM5Q0xFVkJRWFpDTEVOQlJHMUNMRVZCUlc1Q1RDeHpRa0ZHYlVJc1JVRkhia0pGTEhGQ1FVaHRRaXhEUVVGeVFqczdRVUZOUVN4bFFVRmxReXhaUVVGbUlpd2labWxzWlNJNkltTnZiVzFoVEdsemRITlBjaTVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltbHRjRzl5ZENCVVpXMXdiR0YwWlZSaFp5Qm1jbTl0SUNjdUxpOVVaVzF3YkdGMFpWUmhaeWM3WEc1cGJYQnZjblFnYzNSeWFYQkpibVJsYm5SVWNtRnVjMlp2Y20xbGNpQm1jbTl0SUNjdUxpOXpkSEpwY0VsdVpHVnVkRlJ5WVc1elptOXliV1Z5Snp0Y2JtbHRjRzl5ZENCcGJteHBibVZCY25KaGVWUnlZVzV6Wm05eWJXVnlJR1p5YjIwZ0p5NHVMMmx1YkdsdVpVRnljbUY1VkhKaGJuTm1iM0p0WlhJbk8xeHVhVzF3YjNKMElIUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUJtY205dElDY3VMaTkwY21sdFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJbk8xeHVYRzVqYjI1emRDQmpiMjF0WVV4cGMzUnpUM0lnUFNCdVpYY2dWR1Z0Y0d4aGRHVlVZV2NvWEc0Z0lHbHViR2x1WlVGeWNtRjVWSEpoYm5ObWIzSnRaWElvZXlCelpYQmhjbUYwYjNJNklDY3NKeXdnWTI5dWFuVnVZM1JwYjI0NklDZHZjaWNnZlNrc1hHNGdJSE4wY21sd1NXNWtaVzUwVkhKaGJuTm1iM0p0WlhJc1hHNGdJSFJ5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2l4Y2JpazdYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJR052YlcxaFRHbHpkSE5QY2p0Y2JpSmRmUT09IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vY29tbWFMaXN0c09yJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OWpiMjF0WVV4cGMzUnpUM0l2YVc1a1pYZ3Vhbk1pWFN3aWJtRnRaWE1pT2xzaVpHVm1ZWFZzZENKZExDSnRZWEJ3YVc1bmN5STZJbkZDUVVGdlFpeG5RanR4UWtGQllrRXNUeUlzSW1acGJHVWlPaUpwYm1SbGVDNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1WNGNHOXlkQ0JrWldaaGRXeDBJR1p5YjIwZ0p5NHZZMjl0YldGTWFYTjBjMDl5Snp0Y2JpSmRmUT09IiwiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBzdHJpcEluZGVudFRyYW5zZm9ybWVyIGZyb20gJy4uL3N0cmlwSW5kZW50VHJhbnNmb3JtZXInO1xuaW1wb3J0IGlubGluZUFycmF5VHJhbnNmb3JtZXIgZnJvbSAnLi4vaW5saW5lQXJyYXlUcmFuc2Zvcm1lcic7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5pbXBvcnQgc3BsaXRTdHJpbmdUcmFuc2Zvcm1lciBmcm9tICcuLi9zcGxpdFN0cmluZ1RyYW5zZm9ybWVyJztcbmltcG9ydCByZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyIGZyb20gJy4uL3JlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXInO1xuXG52YXIgaHRtbCA9IG5ldyBUZW1wbGF0ZVRhZyhzcGxpdFN0cmluZ1RyYW5zZm9ybWVyKCdcXG4nKSwgcmVtb3ZlTm9uUHJpbnRpbmdWYWx1ZXNUcmFuc2Zvcm1lciwgaW5saW5lQXJyYXlUcmFuc2Zvcm1lciwgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciwgdHJpbVJlc3VsdFRyYW5zZm9ybWVyKTtcblxuZXhwb3J0IGRlZmF1bHQgaHRtbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OW9kRzFzTDJoMGJXd3Vhbk1pWFN3aWJtRnRaWE1pT2xzaVZHVnRjR3hoZEdWVVlXY2lMQ0p6ZEhKcGNFbHVaR1Z1ZEZSeVlXNXpabTl5YldWeUlpd2lhVzVzYVc1bFFYSnlZWGxVY21GdWMyWnZjbTFsY2lJc0luUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUlzSW5Od2JHbDBVM1J5YVc1blZISmhibk5tYjNKdFpYSWlMQ0p5WlcxdmRtVk9iMjVRY21sdWRHbHVaMVpoYkhWbGMxUnlZVzV6Wm05eWJXVnlJaXdpYUhSdGJDSmRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNUMEZCVDBFc1YwRkJVQ3hOUVVGM1FpeG5Ra0ZCZUVJN1FVRkRRU3hQUVVGUFF5eHpRa0ZCVUN4TlFVRnRReXd5UWtGQmJrTTdRVUZEUVN4UFFVRlBReXh6UWtGQlVDeE5RVUZ0UXl3eVFrRkJia003UVVGRFFTeFBRVUZQUXl4eFFrRkJVQ3hOUVVGclF5d3dRa0ZCYkVNN1FVRkRRU3hQUVVGUFF5eHpRa0ZCVUN4TlFVRnRReXd5UWtGQmJrTTdRVUZEUVN4UFFVRlBReXhyUTBGQlVDeE5RVUVyUXl4MVEwRkJMME03TzBGQlJVRXNTVUZCVFVNc1QwRkJUeXhKUVVGSlRpeFhRVUZLTEVOQlExaEpMSFZDUVVGMVFpeEpRVUYyUWl4RFFVUlhMRVZCUlZoRExHdERRVVpYTEVWQlIxaElMSE5DUVVoWExFVkJTVmhFTEhOQ1FVcFhMRVZCUzFoRkxIRkNRVXhYTEVOQlFXSTdPMEZCVVVFc1pVRkJaVWNzU1VGQlppSXNJbVpwYkdVaU9pSm9kRzFzTG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lhVzF3YjNKMElGUmxiWEJzWVhSbFZHRm5JR1p5YjIwZ0p5NHVMMVJsYlhCc1lYUmxWR0ZuSnp0Y2JtbHRjRzl5ZENCemRISnBjRWx1WkdWdWRGUnlZVzV6Wm05eWJXVnlJR1p5YjIwZ0p5NHVMM04wY21sd1NXNWtaVzUwVkhKaGJuTm1iM0p0WlhJbk8xeHVhVzF3YjNKMElHbHViR2x1WlVGeWNtRjVWSEpoYm5ObWIzSnRaWElnWm5KdmJTQW5MaTR2YVc1c2FXNWxRWEp5WVhsVWNtRnVjMlp2Y20xbGNpYzdYRzVwYlhCdmNuUWdkSEpwYlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5SUdaeWIyMGdKeTR1TDNSeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpYzdYRzVwYlhCdmNuUWdjM0JzYVhSVGRISnBibWRVY21GdWMyWnZjbTFsY2lCbWNtOXRJQ2N1TGk5emNHeHBkRk4wY21sdVoxUnlZVzV6Wm05eWJXVnlKenRjYm1sdGNHOXlkQ0J5WlcxdmRtVk9iMjVRY21sdWRHbHVaMVpoYkhWbGMxUnlZVzV6Wm05eWJXVnlJR1p5YjIwZ0p5NHVMM0psYlc5MlpVNXZibEJ5YVc1MGFXNW5WbUZzZFdWelZISmhibk5tYjNKdFpYSW5PMXh1WEc1amIyNXpkQ0JvZEcxc0lEMGdibVYzSUZSbGJYQnNZWFJsVkdGbktGeHVJQ0J6Y0d4cGRGTjBjbWx1WjFSeVlXNXpabTl5YldWeUtDZGNYRzRuS1N4Y2JpQWdjbVZ0YjNabFRtOXVVSEpwYm5ScGJtZFdZV3gxWlhOVWNtRnVjMlp2Y20xbGNpeGNiaUFnYVc1c2FXNWxRWEp5WVhsVWNtRnVjMlp2Y20xbGNpeGNiaUFnYzNSeWFYQkpibVJsYm5SVWNtRnVjMlp2Y20xbGNpeGNiaUFnZEhKcGJWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUxGeHVLVHRjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnYUhSdGJEdGNiaUpkZlE9PSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL2h0bWwnO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5b2RHMXNMMmx1WkdWNExtcHpJbDBzSW01aGJXVnpJanBiSW1SbFptRjFiSFFpWFN3aWJXRndjR2x1WjNNaU9pSnhRa0ZCYjBJc1VUdHhRa0ZCWWtFc1R5SXNJbVpwYkdVaU9pSnBibVJsZUM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbVY0Y0c5eWRDQmtaV1poZFd4MElHWnliMjBnSnk0dmFIUnRiQ2M3WEc0aVhYMD0iLCIvLyBjb3JlXG5pbXBvcnQgX1RlbXBsYXRlVGFnIGZyb20gJy4vVGVtcGxhdGVUYWcnO1xuZXhwb3J0IHsgX1RlbXBsYXRlVGFnIGFzIFRlbXBsYXRlVGFnIH07XG5cbi8vIHRyYW5zZm9ybWVyc1xuXG5pbXBvcnQgX3RyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5leHBvcnQgeyBfdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGFzIHRyaW1SZXN1bHRUcmFuc2Zvcm1lciB9O1xuaW1wb3J0IF9zdHJpcEluZGVudFRyYW5zZm9ybWVyIGZyb20gJy4vc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcic7XG5leHBvcnQgeyBfc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciBhcyBzdHJpcEluZGVudFRyYW5zZm9ybWVyIH07XG5pbXBvcnQgX3JlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuL3JlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcic7XG5leHBvcnQgeyBfcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyIGFzIHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciB9O1xuaW1wb3J0IF9yZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIgZnJvbSAnLi9yZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXInO1xuZXhwb3J0IHsgX3JlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lciBhcyByZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIgfTtcbmltcG9ydCBfcmVwbGFjZVN0cmluZ1RyYW5zZm9ybWVyIGZyb20gJy4vcmVwbGFjZVN0cmluZ1RyYW5zZm9ybWVyJztcbmV4cG9ydCB7IF9yZXBsYWNlU3RyaW5nVHJhbnNmb3JtZXIgYXMgcmVwbGFjZVN0cmluZ1RyYW5zZm9ybWVyIH07XG5pbXBvcnQgX2lubGluZUFycmF5VHJhbnNmb3JtZXIgZnJvbSAnLi9pbmxpbmVBcnJheVRyYW5zZm9ybWVyJztcbmV4cG9ydCB7IF9pbmxpbmVBcnJheVRyYW5zZm9ybWVyIGFzIGlubGluZUFycmF5VHJhbnNmb3JtZXIgfTtcbmltcG9ydCBfc3BsaXRTdHJpbmdUcmFuc2Zvcm1lciBmcm9tICcuL3NwbGl0U3RyaW5nVHJhbnNmb3JtZXInO1xuZXhwb3J0IHsgX3NwbGl0U3RyaW5nVHJhbnNmb3JtZXIgYXMgc3BsaXRTdHJpbmdUcmFuc2Zvcm1lciB9O1xuaW1wb3J0IF9yZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyIGZyb20gJy4vcmVtb3ZlTm9uUHJpbnRpbmdWYWx1ZXNUcmFuc2Zvcm1lcic7XG5leHBvcnQgeyBfcmVtb3ZlTm9uUHJpbnRpbmdWYWx1ZXNUcmFuc2Zvcm1lciBhcyByZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyIH07XG5cbi8vIHRhZ3NcblxuaW1wb3J0IF9jb21tYUxpc3RzIGZyb20gJy4vY29tbWFMaXN0cyc7XG5leHBvcnQgeyBfY29tbWFMaXN0cyBhcyBjb21tYUxpc3RzIH07XG5pbXBvcnQgX2NvbW1hTGlzdHNBbmQgZnJvbSAnLi9jb21tYUxpc3RzQW5kJztcbmV4cG9ydCB7IF9jb21tYUxpc3RzQW5kIGFzIGNvbW1hTGlzdHNBbmQgfTtcbmltcG9ydCBfY29tbWFMaXN0c09yIGZyb20gJy4vY29tbWFMaXN0c09yJztcbmV4cG9ydCB7IF9jb21tYUxpc3RzT3IgYXMgY29tbWFMaXN0c09yIH07XG5pbXBvcnQgX2h0bWwgZnJvbSAnLi9odG1sJztcbmV4cG9ydCB7IF9odG1sIGFzIGh0bWwgfTtcbmltcG9ydCBfY29kZUJsb2NrIGZyb20gJy4vY29kZUJsb2NrJztcbmV4cG9ydCB7IF9jb2RlQmxvY2sgYXMgY29kZUJsb2NrIH07XG5pbXBvcnQgX3NvdXJjZSBmcm9tICcuL3NvdXJjZSc7XG5leHBvcnQgeyBfc291cmNlIGFzIHNvdXJjZSB9O1xuaW1wb3J0IF9zYWZlSHRtbCBmcm9tICcuL3NhZmVIdG1sJztcbmV4cG9ydCB7IF9zYWZlSHRtbCBhcyBzYWZlSHRtbCB9O1xuaW1wb3J0IF9vbmVMaW5lIGZyb20gJy4vb25lTGluZSc7XG5leHBvcnQgeyBfb25lTGluZSBhcyBvbmVMaW5lIH07XG5pbXBvcnQgX29uZUxpbmVUcmltIGZyb20gJy4vb25lTGluZVRyaW0nO1xuZXhwb3J0IHsgX29uZUxpbmVUcmltIGFzIG9uZUxpbmVUcmltIH07XG5pbXBvcnQgX29uZUxpbmVDb21tYUxpc3RzIGZyb20gJy4vb25lTGluZUNvbW1hTGlzdHMnO1xuZXhwb3J0IHsgX29uZUxpbmVDb21tYUxpc3RzIGFzIG9uZUxpbmVDb21tYUxpc3RzIH07XG5pbXBvcnQgX29uZUxpbmVDb21tYUxpc3RzT3IgZnJvbSAnLi9vbmVMaW5lQ29tbWFMaXN0c09yJztcbmV4cG9ydCB7IF9vbmVMaW5lQ29tbWFMaXN0c09yIGFzIG9uZUxpbmVDb21tYUxpc3RzT3IgfTtcbmltcG9ydCBfb25lTGluZUNvbW1hTGlzdHNBbmQgZnJvbSAnLi9vbmVMaW5lQ29tbWFMaXN0c0FuZCc7XG5leHBvcnQgeyBfb25lTGluZUNvbW1hTGlzdHNBbmQgYXMgb25lTGluZUNvbW1hTGlzdHNBbmQgfTtcbmltcG9ydCBfaW5saW5lTGlzdHMgZnJvbSAnLi9pbmxpbmVMaXN0cyc7XG5leHBvcnQgeyBfaW5saW5lTGlzdHMgYXMgaW5saW5lTGlzdHMgfTtcbmltcG9ydCBfb25lTGluZUlubGluZUxpc3RzIGZyb20gJy4vb25lTGluZUlubGluZUxpc3RzJztcbmV4cG9ydCB7IF9vbmVMaW5lSW5saW5lTGlzdHMgYXMgb25lTGluZUlubGluZUxpc3RzIH07XG5pbXBvcnQgX3N0cmlwSW5kZW50IGZyb20gJy4vc3RyaXBJbmRlbnQnO1xuZXhwb3J0IHsgX3N0cmlwSW5kZW50IGFzIHN0cmlwSW5kZW50IH07XG5pbXBvcnQgX3N0cmlwSW5kZW50cyBmcm9tICcuL3N0cmlwSW5kZW50cyc7XG5leHBvcnQgeyBfc3RyaXBJbmRlbnRzIGFzIHN0cmlwSW5kZW50cyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUwzTnlZeTlwYm1SbGVDNXFjeUpkTENKdVlXMWxjeUk2V3lKVVpXMXdiR0YwWlZSaFp5SXNJblJ5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lJc0luTjBjbWx3U1c1a1pXNTBWSEpoYm5ObWIzSnRaWElpTENKeVpYQnNZV05sVW1WemRXeDBWSEpoYm5ObWIzSnRaWElpTENKeVpYQnNZV05sVTNWaWMzUnBkSFYwYVc5dVZISmhibk5tYjNKdFpYSWlMQ0p5WlhCc1lXTmxVM1J5YVc1blZISmhibk5tYjNKdFpYSWlMQ0pwYm14cGJtVkJjbkpoZVZSeVlXNXpabTl5YldWeUlpd2ljM0JzYVhSVGRISnBibWRVY21GdWMyWnZjbTFsY2lJc0luSmxiVzkyWlU1dmJsQnlhVzUwYVc1blZtRnNkV1Z6VkhKaGJuTm1iM0p0WlhJaUxDSmpiMjF0WVV4cGMzUnpJaXdpWTI5dGJXRk1hWE4wYzBGdVpDSXNJbU52YlcxaFRHbHpkSE5QY2lJc0ltaDBiV3dpTENKamIyUmxRbXh2WTJzaUxDSnpiM1Z5WTJVaUxDSnpZV1psU0hSdGJDSXNJbTl1WlV4cGJtVWlMQ0p2Ym1WTWFXNWxWSEpwYlNJc0ltOXVaVXhwYm1WRGIyMXRZVXhwYzNSeklpd2liMjVsVEdsdVpVTnZiVzFoVEdsemRITlBjaUlzSW05dVpVeHBibVZEYjIxdFlVeHBjM1J6UVc1a0lpd2lhVzVzYVc1bFRHbHpkSE1pTENKdmJtVk1hVzVsU1c1c2FXNWxUR2x6ZEhNaUxDSnpkSEpwY0VsdVpHVnVkQ0lzSW5OMGNtbHdTVzVrWlc1MGN5SmRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRTdlVUpCUTNkQ0xHVTdlVUpCUVdwQ1FTeFhPenRCUVVWUU96dHRRMEZEYTBNc2VVSTdiVU5CUVROQ1F5eHhRanR2UTBGRE5FSXNNRUk3YjBOQlFUVkNReXh6UWp0elEwRkRPRUlzTkVJN2MwTkJRVGxDUXl4M1FqczBRMEZEYjBNc2EwTTdORU5CUVhCRFF5dzRRanR6UTBGRE9FSXNORUk3YzBOQlFUbENReXgzUWp0dlEwRkRORUlzTUVJN2IwTkJRVFZDUXl4elFqdHZRMEZETkVJc01FSTdiME5CUVRWQ1F5eHpRanRuUkVGRGQwTXNjME03WjBSQlFYaERReXhyUXpzN1FVRkZVRHM3ZDBKQlEzVkNMR003ZDBKQlFXaENReXhWT3pKQ1FVTnRRaXhwUWpzeVFrRkJia0pETEdFN01FSkJRMnRDTEdkQ096QkNRVUZzUWtNc1dUdHJRa0ZEVlN4Uk8ydENRVUZXUXl4Sk8zVkNRVU5sTEdFN2RVSkJRV1pETEZNN2IwSkJRMWtzVlR0dlFrRkJXa01zVFR0elFrRkRZeXhaTzNOQ1FVRmtReXhSTzNGQ1FVTmhMRmM3Y1VKQlFXSkRMRTg3ZVVKQlEybENMR1U3ZVVKQlFXcENReXhYT3l0Q1FVTjFRaXh4UWpzclFrRkJka0pETEdsQ08ybERRVU41UWl4MVFqdHBRMEZCZWtKRExHMUNPMnREUVVNd1FpeDNRanRyUTBGQk1VSkRMRzlDTzNsQ1FVTnBRaXhsTzNsQ1FVRnFRa01zVnp0blEwRkRkMElzYzBJN1owTkJRWGhDUXl4clFqdDVRa0ZEYVVJc1pUdDVRa0ZCYWtKRExGYzdNRUpCUTJ0Q0xHZENPekJDUVVGc1FrTXNXU0lzSW1acGJHVWlPaUpwYm1SbGVDNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4dklHTnZjbVZjYm1WNGNHOXlkQ0JVWlcxd2JHRjBaVlJoWnlCbWNtOXRJQ2N1TDFSbGJYQnNZWFJsVkdGbkp6dGNibHh1THk4Z2RISmhibk5tYjNKdFpYSnpYRzVsZUhCdmNuUWdkSEpwYlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5SUdaeWIyMGdKeTR2ZEhKcGJWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUp6dGNibVY0Y0c5eWRDQnpkSEpwY0VsdVpHVnVkRlJ5WVc1elptOXliV1Z5SUdaeWIyMGdKeTR2YzNSeWFYQkpibVJsYm5SVWNtRnVjMlp2Y20xbGNpYzdYRzVsZUhCdmNuUWdjbVZ3YkdGalpWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUlHWnliMjBnSnk0dmNtVndiR0ZqWlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5Snp0Y2JtVjRjRzl5ZENCeVpYQnNZV05sVTNWaWMzUnBkSFYwYVc5dVZISmhibk5tYjNKdFpYSWdabkp2YlNBbkxpOXlaWEJzWVdObFUzVmljM1JwZEhWMGFXOXVWSEpoYm5ObWIzSnRaWEluTzF4dVpYaHdiM0owSUhKbGNHeGhZMlZUZEhKcGJtZFVjbUZ1YzJadmNtMWxjaUJtY205dElDY3VMM0psY0d4aFkyVlRkSEpwYm1kVWNtRnVjMlp2Y20xbGNpYzdYRzVsZUhCdmNuUWdhVzVzYVc1bFFYSnlZWGxVY21GdWMyWnZjbTFsY2lCbWNtOXRJQ2N1TDJsdWJHbHVaVUZ5Y21GNVZISmhibk5tYjNKdFpYSW5PMXh1Wlhod2IzSjBJSE53YkdsMFUzUnlhVzVuVkhKaGJuTm1iM0p0WlhJZ1puSnZiU0FuTGk5emNHeHBkRk4wY21sdVoxUnlZVzV6Wm05eWJXVnlKenRjYm1WNGNHOXlkQ0J5WlcxdmRtVk9iMjVRY21sdWRHbHVaMVpoYkhWbGMxUnlZVzV6Wm05eWJXVnlJR1p5YjIwZ0p5NHZjbVZ0YjNabFRtOXVVSEpwYm5ScGJtZFdZV3gxWlhOVWNtRnVjMlp2Y20xbGNpYzdYRzVjYmk4dklIUmhaM05jYm1WNGNHOXlkQ0JqYjIxdFlVeHBjM1J6SUdaeWIyMGdKeTR2WTI5dGJXRk1hWE4wY3ljN1hHNWxlSEJ2Y25RZ1kyOXRiV0ZNYVhOMGMwRnVaQ0JtY205dElDY3VMMk52YlcxaFRHbHpkSE5CYm1Rbk8xeHVaWGh3YjNKMElHTnZiVzFoVEdsemRITlBjaUJtY205dElDY3VMMk52YlcxaFRHbHpkSE5QY2ljN1hHNWxlSEJ2Y25RZ2FIUnRiQ0JtY205dElDY3VMMmgwYld3bk8xeHVaWGh3YjNKMElHTnZaR1ZDYkc5amF5Qm1jbTl0SUNjdUwyTnZaR1ZDYkc5amF5YzdYRzVsZUhCdmNuUWdjMjkxY21ObElHWnliMjBnSnk0dmMyOTFjbU5sSnp0Y2JtVjRjRzl5ZENCellXWmxTSFJ0YkNCbWNtOXRJQ2N1TDNOaFptVklkRzFzSnp0Y2JtVjRjRzl5ZENCdmJtVk1hVzVsSUdaeWIyMGdKeTR2YjI1bFRHbHVaU2M3WEc1bGVIQnZjblFnYjI1bFRHbHVaVlJ5YVcwZ1puSnZiU0FuTGk5dmJtVk1hVzVsVkhKcGJTYzdYRzVsZUhCdmNuUWdiMjVsVEdsdVpVTnZiVzFoVEdsemRITWdabkp2YlNBbkxpOXZibVZNYVc1bFEyOXRiV0ZNYVhOMGN5YzdYRzVsZUhCdmNuUWdiMjVsVEdsdVpVTnZiVzFoVEdsemRITlBjaUJtY205dElDY3VMMjl1WlV4cGJtVkRiMjF0WVV4cGMzUnpUM0luTzF4dVpYaHdiM0owSUc5dVpVeHBibVZEYjIxdFlVeHBjM1J6UVc1a0lHWnliMjBnSnk0dmIyNWxUR2x1WlVOdmJXMWhUR2x6ZEhOQmJtUW5PMXh1Wlhod2IzSjBJR2x1YkdsdVpVeHBjM1J6SUdaeWIyMGdKeTR2YVc1c2FXNWxUR2x6ZEhNbk8xeHVaWGh3YjNKMElHOXVaVXhwYm1WSmJteHBibVZNYVhOMGN5Qm1jbTl0SUNjdUwyOXVaVXhwYm1WSmJteHBibVZNYVhOMGN5YzdYRzVsZUhCdmNuUWdjM1J5YVhCSmJtUmxiblFnWm5KdmJTQW5MaTl6ZEhKcGNFbHVaR1Z1ZENjN1hHNWxlSEJ2Y25RZ2MzUnlhWEJKYm1SbGJuUnpJR1p5YjIwZ0p5NHZjM1J5YVhCSmJtUmxiblJ6Snp0Y2JpSmRmUT09IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vaW5saW5lQXJyYXlUcmFuc2Zvcm1lcic7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTlwYm14cGJtVkJjbkpoZVZSeVlXNXpabTl5YldWeUwybHVaR1Y0TG1weklsMHNJbTVoYldWeklqcGJJbVJsWm1GMWJIUWlYU3dpYldGd2NHbHVaM01pT2lKeFFrRkJiMElzTUVJN2NVSkJRV0pCTEU4aUxDSm1hV3hsSWpvaWFXNWtaWGd1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmxlSEJ2Y25RZ1pHVm1ZWFZzZENCbWNtOXRJQ2N1TDJsdWJHbHVaVUZ5Y21GNVZISmhibk5tYjNKdFpYSW5PMXh1SWwxOSIsInZhciBkZWZhdWx0cyA9IHtcbiAgc2VwYXJhdG9yOiAnJyxcbiAgY29uanVuY3Rpb246ICcnLFxuICBzZXJpYWw6IGZhbHNlXG59O1xuXG4vKipcbiAqIENvbnZlcnRzIGFuIGFycmF5IHN1YnN0aXR1dGlvbiB0byBhIHN0cmluZyBjb250YWluaW5nIGEgbGlzdFxuICogQHBhcmFtICB7U3RyaW5nfSBbb3B0cy5zZXBhcmF0b3IgPSAnJ10gLSB0aGUgY2hhcmFjdGVyIHRoYXQgc2VwYXJhdGVzIGVhY2ggaXRlbVxuICogQHBhcmFtICB7U3RyaW5nfSBbb3B0cy5jb25qdW5jdGlvbiA9ICcnXSAgLSByZXBsYWNlIHRoZSBsYXN0IHNlcGFyYXRvciB3aXRoIHRoaXNcbiAqIEBwYXJhbSAge0Jvb2xlYW59IFtvcHRzLnNlcmlhbCA9IGZhbHNlXSAtIGluY2x1ZGUgdGhlIHNlcGFyYXRvciBiZWZvcmUgdGhlIGNvbmp1bmN0aW9uPyAoT3hmb3JkIGNvbW1hIHVzZS1jYXNlKVxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAtIGEgVGVtcGxhdGVUYWcgdHJhbnNmb3JtZXJcbiAqL1xudmFyIGlubGluZUFycmF5VHJhbnNmb3JtZXIgPSBmdW5jdGlvbiBpbmxpbmVBcnJheVRyYW5zZm9ybWVyKCkge1xuICB2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogZGVmYXVsdHM7XG4gIHJldHVybiB7XG4gICAgb25TdWJzdGl0dXRpb246IGZ1bmN0aW9uIG9uU3Vic3RpdHV0aW9uKHN1YnN0aXR1dGlvbiwgcmVzdWx0U29GYXIpIHtcbiAgICAgIC8vIG9ubHkgb3BlcmF0ZSBvbiBhcnJheXNcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHN1YnN0aXR1dGlvbikpIHtcbiAgICAgICAgdmFyIGFycmF5TGVuZ3RoID0gc3Vic3RpdHV0aW9uLmxlbmd0aDtcbiAgICAgICAgdmFyIHNlcGFyYXRvciA9IG9wdHMuc2VwYXJhdG9yO1xuICAgICAgICB2YXIgY29uanVuY3Rpb24gPSBvcHRzLmNvbmp1bmN0aW9uO1xuICAgICAgICB2YXIgc2VyaWFsID0gb3B0cy5zZXJpYWw7XG4gICAgICAgIC8vIGpvaW4gZWFjaCBpdGVtIGluIHRoZSBhcnJheSBpbnRvIGEgc3RyaW5nIHdoZXJlIGVhY2ggaXRlbSBpcyBzZXBhcmF0ZWQgYnkgc2VwYXJhdG9yXG4gICAgICAgIC8vIGJlIHN1cmUgdG8gbWFpbnRhaW4gaW5kZW50YXRpb25cbiAgICAgICAgdmFyIGluZGVudCA9IHJlc3VsdFNvRmFyLm1hdGNoKC8oXFxuP1teXFxTXFxuXSspJC8pO1xuICAgICAgICBpZiAoaW5kZW50KSB7XG4gICAgICAgICAgc3Vic3RpdHV0aW9uID0gc3Vic3RpdHV0aW9uLmpvaW4oc2VwYXJhdG9yICsgaW5kZW50WzFdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdWJzdGl0dXRpb24gPSBzdWJzdGl0dXRpb24uam9pbihzZXBhcmF0b3IgKyAnICcpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmIGNvbmp1bmN0aW9uIGlzIHNldCwgcmVwbGFjZSB0aGUgbGFzdCBzZXBhcmF0b3Igd2l0aCBjb25qdW5jdGlvbiwgYnV0IG9ubHkgaWYgdGhlcmUgaXMgbW9yZSB0aGFuIG9uZSBzdWJzdGl0dXRpb25cbiAgICAgICAgaWYgKGNvbmp1bmN0aW9uICYmIGFycmF5TGVuZ3RoID4gMSkge1xuICAgICAgICAgIHZhciBzZXBhcmF0b3JJbmRleCA9IHN1YnN0aXR1dGlvbi5sYXN0SW5kZXhPZihzZXBhcmF0b3IpO1xuICAgICAgICAgIHN1YnN0aXR1dGlvbiA9IHN1YnN0aXR1dGlvbi5zbGljZSgwLCBzZXBhcmF0b3JJbmRleCkgKyAoc2VyaWFsID8gc2VwYXJhdG9yIDogJycpICsgJyAnICsgY29uanVuY3Rpb24gKyBzdWJzdGl0dXRpb24uc2xpY2Uoc2VwYXJhdG9ySW5kZXggKyAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHN1YnN0aXR1dGlvbjtcbiAgICB9XG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5cGJteHBibVZCY25KaGVWUnlZVzV6Wm05eWJXVnlMMmx1YkdsdVpVRnljbUY1VkhKaGJuTm1iM0p0WlhJdWFuTWlYU3dpYm1GdFpYTWlPbHNpWkdWbVlYVnNkSE1pTENKelpYQmhjbUYwYjNJaUxDSmpiMjVxZFc1amRHbHZiaUlzSW5ObGNtbGhiQ0lzSW1sdWJHbHVaVUZ5Y21GNVZISmhibk5tYjNKdFpYSWlMQ0p2Y0hSeklpd2liMjVUZFdKemRHbDBkWFJwYjI0aUxDSnpkV0p6ZEdsMGRYUnBiMjRpTENKeVpYTjFiSFJUYjBaaGNpSXNJa0Z5Y21GNUlpd2lhWE5CY25KaGVTSXNJbUZ5Y21GNVRHVnVaM1JvSWl3aWJHVnVaM1JvSWl3aWFXNWtaVzUwSWl3aWJXRjBZMmdpTENKcWIybHVJaXdpYzJWd1lYSmhkRzl5U1c1a1pYZ2lMQ0pzWVhOMFNXNWtaWGhQWmlJc0luTnNhV05sSWwwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4SlFVRk5RU3hYUVVGWE8wRkJRMlpETEdGQlFWY3NSVUZFU1R0QlFVVm1ReXhsUVVGaExFVkJSa1U3UVVGSFprTXNWVUZCVVR0QlFVaFBMRU5CUVdwQ096dEJRVTFCT3pzN096czdPenRCUVZGQkxFbEJRVTFETEhsQ1FVRjVRaXhUUVVGNlFrRXNjMEpCUVhsQ08wRkJRVUVzVFVGQlEwTXNTVUZCUkN4MVJVRkJVVXdzVVVGQlVqdEJRVUZCTEZOQlFYTkNPMEZCUTI1RVRTeHJRa0ZFYlVRc01FSkJRM0JEUXl4WlFVUnZReXhGUVVOMFFrTXNWMEZFYzBJc1JVRkRWRHRCUVVONFF6dEJRVU5CTEZWQlFVbERMRTFCUVUxRExFOUJRVTRzUTBGQlkwZ3NXVUZCWkN4RFFVRktMRVZCUVdsRE8wRkJReTlDTEZsQlFVMUpMR05CUVdOS0xHRkJRV0ZMTEUxQlFXcERPMEZCUTBFc1dVRkJUVmdzV1VGQldVa3NTMEZCUzBvc1UwRkJka0k3UVVGRFFTeFpRVUZOUXl4alFVRmpSeXhMUVVGTFNDeFhRVUY2UWp0QlFVTkJMRmxCUVUxRExGTkJRVk5GTEV0QlFVdEdMRTFCUVhCQ08wRkJRMEU3UVVGRFFUdEJRVU5CTEZsQlFVMVZMRk5CUVZOTUxGbEJRVmxOTEV0QlFWb3NRMEZCYTBJc1owSkJRV3hDTEVOQlFXWTdRVUZEUVN4WlFVRkpSQ3hOUVVGS0xFVkJRVms3UVVGRFZrNHNlVUpCUVdWQkxHRkJRV0ZSTEVsQlFXSXNRMEZCYTBKa0xGbEJRVmxaTEU5QlFVOHNRMEZCVUN4RFFVRTVRaXhEUVVGbU8wRkJRMFFzVTBGR1JDeE5RVVZQTzBGQlEweE9MSGxDUVVGbFFTeGhRVUZoVVN4SlFVRmlMRU5CUVd0Q1pDeFpRVUZaTEVkQlFUbENMRU5CUVdZN1FVRkRSRHRCUVVORU8wRkJRMEVzV1VGQlNVTXNaVUZCWlZNc1kwRkJZeXhEUVVGcVF5eEZRVUZ2UXp0QlFVTnNReXhqUVVGTlN5eHBRa0ZCYVVKVUxHRkJRV0ZWTEZkQlFXSXNRMEZCZVVKb1FpeFRRVUY2UWl4RFFVRjJRanRCUVVOQlRTeDVRa0ZEUlVFc1lVRkJZVmNzUzBGQllpeERRVUZ0UWl4RFFVRnVRaXhGUVVGelFrWXNZMEZCZEVJc1MwRkRRMklzVTBGQlUwWXNVMEZCVkN4SFFVRnhRaXhGUVVSMFFpeEpRVVZCTEVkQlJrRXNSMEZIUVVNc1YwRklRU3hIUVVsQlN5eGhRVUZoVnl4TFFVRmlMRU5CUVcxQ1JpeHBRa0ZCYVVJc1EwRkJjRU1zUTBGTVJqdEJRVTFFTzBGQlEwWTdRVUZEUkN4aFFVRlBWQ3haUVVGUU8wRkJRMFE3UVVFMVFtdEVMRWRCUVhSQ08wRkJRVUVzUTBGQkwwSTdPMEZCSzBKQkxHVkJRV1ZJTEhOQ1FVRm1JaXdpWm1sc1pTSTZJbWx1YkdsdVpVRnljbUY1VkhKaGJuTm1iM0p0WlhJdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpqYjI1emRDQmtaV1poZFd4MGN5QTlJSHRjYmlBZ2MyVndZWEpoZEc5eU9pQW5KeXhjYmlBZ1kyOXVhblZ1WTNScGIyNDZJQ2NuTEZ4dUlDQnpaWEpwWVd3NklHWmhiSE5sTEZ4dWZUdGNibHh1THlvcVhHNGdLaUJEYjI1MlpYSjBjeUJoYmlCaGNuSmhlU0J6ZFdKemRHbDBkWFJwYjI0Z2RHOGdZU0J6ZEhKcGJtY2dZMjl1ZEdGcGJtbHVaeUJoSUd4cGMzUmNiaUFxSUVCd1lYSmhiU0FnZTFOMGNtbHVaMzBnVzI5d2RITXVjMlZ3WVhKaGRHOXlJRDBnSnlkZElDMGdkR2hsSUdOb1lYSmhZM1JsY2lCMGFHRjBJSE5sY0dGeVlYUmxjeUJsWVdOb0lHbDBaVzFjYmlBcUlFQndZWEpoYlNBZ2UxTjBjbWx1WjMwZ1cyOXdkSE11WTI5dWFuVnVZM1JwYjI0Z1BTQW5KMTBnSUMwZ2NtVndiR0ZqWlNCMGFHVWdiR0Z6ZENCelpYQmhjbUYwYjNJZ2QybDBhQ0IwYUdselhHNGdLaUJBY0dGeVlXMGdJSHRDYjI5c1pXRnVmU0JiYjNCMGN5NXpaWEpwWVd3Z1BTQm1ZV3h6WlYwZ0xTQnBibU5zZFdSbElIUm9aU0J6WlhCaGNtRjBiM0lnWW1WbWIzSmxJSFJvWlNCamIyNXFkVzVqZEdsdmJqOGdLRTk0Wm05eVpDQmpiMjF0WVNCMWMyVXRZMkZ6WlNsY2JpQXFYRzRnS2lCQWNtVjBkWEp1SUh0UFltcGxZM1I5SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0xTQmhJRlJsYlhCc1lYUmxWR0ZuSUhSeVlXNXpabTl5YldWeVhHNGdLaTljYm1OdmJuTjBJR2x1YkdsdVpVRnljbUY1VkhKaGJuTm1iM0p0WlhJZ1BTQW9iM0IwY3lBOUlHUmxabUYxYkhSektTQTlQaUFvZTF4dUlDQnZibE4xWW5OMGFYUjFkR2x2YmloemRXSnpkR2wwZFhScGIyNHNJSEpsYzNWc2RGTnZSbUZ5S1NCN1hHNGdJQ0FnTHk4Z2IyNXNlU0J2Y0dWeVlYUmxJRzl1SUdGeWNtRjVjMXh1SUNBZ0lHbG1JQ2hCY25KaGVTNXBjMEZ5Y21GNUtITjFZbk4wYVhSMWRHbHZiaWtwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR0Z5Y21GNVRHVnVaM1JvSUQwZ2MzVmljM1JwZEhWMGFXOXVMbXhsYm1kMGFEdGNiaUFnSUNBZ0lHTnZibk4wSUhObGNHRnlZWFJ2Y2lBOUlHOXdkSE11YzJWd1lYSmhkRzl5TzF4dUlDQWdJQ0FnWTI5dWMzUWdZMjl1YW5WdVkzUnBiMjRnUFNCdmNIUnpMbU52Ym1wMWJtTjBhVzl1TzF4dUlDQWdJQ0FnWTI5dWMzUWdjMlZ5YVdGc0lEMGdiM0IwY3k1elpYSnBZV3c3WEc0Z0lDQWdJQ0F2THlCcWIybHVJR1ZoWTJnZ2FYUmxiU0JwYmlCMGFHVWdZWEp5WVhrZ2FXNTBieUJoSUhOMGNtbHVaeUIzYUdWeVpTQmxZV05vSUdsMFpXMGdhWE1nYzJWd1lYSmhkR1ZrSUdKNUlITmxjR0Z5WVhSdmNseHVJQ0FnSUNBZ0x5OGdZbVVnYzNWeVpTQjBieUJ0WVdsdWRHRnBiaUJwYm1SbGJuUmhkR2x2Ymx4dUlDQWdJQ0FnWTI5dWMzUWdhVzVrWlc1MElEMGdjbVZ6ZFd4MFUyOUdZWEl1YldGMFkyZ29MeWhjWEc0L1cxNWNYRk5jWEc1ZEt5a2tMeWs3WEc0Z0lDQWdJQ0JwWmlBb2FXNWtaVzUwS1NCN1hHNGdJQ0FnSUNBZ0lITjFZbk4wYVhSMWRHbHZiaUE5SUhOMVluTjBhWFIxZEdsdmJpNXFiMmx1S0hObGNHRnlZWFJ2Y2lBcklHbHVaR1Z1ZEZzeFhTazdYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQnpkV0p6ZEdsMGRYUnBiMjRnUFNCemRXSnpkR2wwZFhScGIyNHVhbTlwYmloelpYQmhjbUYwYjNJZ0t5QW5JQ2NwTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJQ0FnTHk4Z2FXWWdZMjl1YW5WdVkzUnBiMjRnYVhNZ2MyVjBMQ0J5WlhCc1lXTmxJSFJvWlNCc1lYTjBJSE5sY0dGeVlYUnZjaUIzYVhSb0lHTnZibXAxYm1OMGFXOXVMQ0JpZFhRZ2IyNXNlU0JwWmlCMGFHVnlaU0JwY3lCdGIzSmxJSFJvWVc0Z2IyNWxJSE4xWW5OMGFYUjFkR2x2Ymx4dUlDQWdJQ0FnYVdZZ0tHTnZibXAxYm1OMGFXOXVJQ1ltSUdGeWNtRjVUR1Z1WjNSb0lENGdNU2tnZTF4dUlDQWdJQ0FnSUNCamIyNXpkQ0J6WlhCaGNtRjBiM0pKYm1SbGVDQTlJSE4xWW5OMGFYUjFkR2x2Ymk1c1lYTjBTVzVrWlhoUFppaHpaWEJoY21GMGIzSXBPMXh1SUNBZ0lDQWdJQ0J6ZFdKemRHbDBkWFJwYjI0Z1BWeHVJQ0FnSUNBZ0lDQWdJSE4xWW5OMGFYUjFkR2x2Ymk1emJHbGpaU2d3TENCelpYQmhjbUYwYjNKSmJtUmxlQ2tnSzF4dUlDQWdJQ0FnSUNBZ0lDaHpaWEpwWVd3Z1B5QnpaWEJoY21GMGIzSWdPaUFuSnlrZ0sxeHVJQ0FnSUNBZ0lDQWdJQ2NnSnlBclhHNGdJQ0FnSUNBZ0lDQWdZMjl1YW5WdVkzUnBiMjRnSzF4dUlDQWdJQ0FnSUNBZ0lITjFZbk4wYVhSMWRHbHZiaTV6YkdsalpTaHpaWEJoY21GMGIzSkpibVJsZUNBcklERXBPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNiaUFnSUNCeVpYUjFjbTRnYzNWaWMzUnBkSFYwYVc5dU8xeHVJQ0I5TEZ4dWZTazdYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJR2x1YkdsdVpVRnljbUY1VkhKaGJuTm1iM0p0WlhJN1hHNGlYWDA9IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vaW5saW5lTGlzdHMnO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5cGJteHBibVZNYVhOMGN5OXBibVJsZUM1cWN5SmRMQ0p1WVcxbGN5STZXeUprWldaaGRXeDBJbDBzSW0xaGNIQnBibWR6SWpvaWNVSkJRVzlDTEdVN2NVSkJRV0pCTEU4aUxDSm1hV3hsSWpvaWFXNWtaWGd1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmxlSEJ2Y25RZ1pHVm1ZWFZzZENCbWNtOXRJQ2N1TDJsdWJHbHVaVXhwYzNSekp6dGNiaUpkZlE9PSIsImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciBmcm9tICcuLi9zdHJpcEluZGVudFRyYW5zZm9ybWVyJztcbmltcG9ydCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyIGZyb20gJy4uL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuXG52YXIgaW5saW5lTGlzdHMgPSBuZXcgVGVtcGxhdGVUYWcoaW5saW5lQXJyYXlUcmFuc2Zvcm1lciwgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciwgdHJpbVJlc3VsdFRyYW5zZm9ybWVyKTtcblxuZXhwb3J0IGRlZmF1bHQgaW5saW5lTGlzdHM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTlwYm14cGJtVk1hWE4wY3k5cGJteHBibVZNYVhOMGN5NXFjeUpkTENKdVlXMWxjeUk2V3lKVVpXMXdiR0YwWlZSaFp5SXNJbk4wY21sd1NXNWtaVzUwVkhKaGJuTm1iM0p0WlhJaUxDSnBibXhwYm1WQmNuSmhlVlJ5WVc1elptOXliV1Z5SWl3aWRISnBiVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlJaXdpYVc1c2FXNWxUR2x6ZEhNaVhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxFOUJRVTlCTEZkQlFWQXNUVUZCZDBJc1owSkJRWGhDTzBGQlEwRXNUMEZCVDBNc2MwSkJRVkFzVFVGQmJVTXNNa0pCUVc1RE8wRkJRMEVzVDBGQlQwTXNjMEpCUVZBc1RVRkJiVU1zTWtKQlFXNURPMEZCUTBFc1QwRkJUME1zY1VKQlFWQXNUVUZCYTBNc01FSkJRV3hET3p0QlFVVkJMRWxCUVUxRExHTkJRV01zU1VGQlNVb3NWMEZCU2l4RFFVTnNRa1VzYzBKQlJHdENMRVZCUld4Q1JDeHpRa0ZHYTBJc1JVRkhiRUpGTEhGQ1FVaHJRaXhEUVVGd1FqczdRVUZOUVN4bFFVRmxReXhYUVVGbUlpd2labWxzWlNJNkltbHViR2x1WlV4cGMzUnpMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUZSbGJYQnNZWFJsVkdGbklHWnliMjBnSnk0dUwxUmxiWEJzWVhSbFZHRm5KenRjYm1sdGNHOXlkQ0J6ZEhKcGNFbHVaR1Z1ZEZSeVlXNXpabTl5YldWeUlHWnliMjBnSnk0dUwzTjBjbWx3U1c1a1pXNTBWSEpoYm5ObWIzSnRaWEluTzF4dWFXMXdiM0owSUdsdWJHbHVaVUZ5Y21GNVZISmhibk5tYjNKdFpYSWdabkp2YlNBbkxpNHZhVzVzYVc1bFFYSnlZWGxVY21GdWMyWnZjbTFsY2ljN1hHNXBiWEJ2Y25RZ2RISnBiVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlJR1p5YjIwZ0p5NHVMM1J5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2ljN1hHNWNibU52Ym5OMElHbHViR2x1WlV4cGMzUnpJRDBnYm1WM0lGUmxiWEJzWVhSbFZHRm5LRnh1SUNCcGJteHBibVZCY25KaGVWUnlZVzV6Wm05eWJXVnlMRnh1SUNCemRISnBjRWx1WkdWdWRGUnlZVzV6Wm05eWJXVnlMRnh1SUNCMGNtbHRVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSXNYRzRwTzF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCcGJteHBibVZNYVhOMGN6dGNiaUpkZlE9PSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL29uZUxpbmUnO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5dmJtVk1hVzVsTDJsdVpHVjRMbXB6SWwwc0ltNWhiV1Z6SWpwYkltUmxabUYxYkhRaVhTd2liV0Z3Y0dsdVozTWlPaUp4UWtGQmIwSXNWenR4UWtGQllrRXNUeUlzSW1acGJHVWlPaUpwYm1SbGVDNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1WNGNHOXlkQ0JrWldaaGRXeDBJR1p5YjIwZ0p5NHZiMjVsVEdsdVpTYzdYRzRpWFgwPSIsImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5pbXBvcnQgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3JlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcic7XG5cbnZhciBvbmVMaW5lID0gbmV3IFRlbXBsYXRlVGFnKHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcigvKD86XFxuKD86XFxzKikpKy9nLCAnICcpLCB0cmltUmVzdWx0VHJhbnNmb3JtZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBvbmVMaW5lO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5dmJtVk1hVzVsTDI5dVpVeHBibVV1YW5NaVhTd2libUZ0WlhNaU9sc2lWR1Z0Y0d4aGRHVlVZV2NpTENKMGNtbHRVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSWlMQ0p5WlhCc1lXTmxVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSWlMQ0p2Ym1WTWFXNWxJbDBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hQUVVGUFFTeFhRVUZRTEUxQlFYZENMR2RDUVVGNFFqdEJRVU5CTEU5QlFVOURMSEZDUVVGUUxFMUJRV3RETERCQ1FVRnNRenRCUVVOQkxFOUJRVTlETEhkQ1FVRlFMRTFCUVhGRExEWkNRVUZ5UXpzN1FVRkZRU3hKUVVGTlF5eFZRVUZWTEVsQlFVbElMRmRCUVVvc1EwRkRaRVVzZVVKQlFYbENMR2xDUVVGNlFpeEZRVUUwUXl4SFFVRTFReXhEUVVSakxFVkJSV1JFTEhGQ1FVWmpMRU5CUVdoQ096dEJRVXRCTEdWQlFXVkZMRTlCUVdZaUxDSm1hV3hsSWpvaWIyNWxUR2x1WlM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbWx0Y0c5eWRDQlVaVzF3YkdGMFpWUmhaeUJtY205dElDY3VMaTlVWlcxd2JHRjBaVlJoWnljN1hHNXBiWEJ2Y25RZ2RISnBiVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlJR1p5YjIwZ0p5NHVMM1J5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2ljN1hHNXBiWEJ2Y25RZ2NtVndiR0ZqWlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5SUdaeWIyMGdKeTR1TDNKbGNHeGhZMlZTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaWM3WEc1Y2JtTnZibk4wSUc5dVpVeHBibVVnUFNCdVpYY2dWR1Z0Y0d4aGRHVlVZV2NvWEc0Z0lISmxjR3hoWTJWU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lndktEODZYRnh1S0Q4NlhGeHpLaWtwS3k5bkxDQW5JQ2NwTEZ4dUlDQjBjbWx0VW1WemRXeDBWSEpoYm5ObWIzSnRaWElzWEc0cE8xeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQnZibVZNYVc1bE8xeHVJbDE5IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vb25lTGluZUNvbW1hTGlzdHMnO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5dmJtVk1hVzVsUTI5dGJXRk1hWE4wY3k5cGJtUmxlQzVxY3lKZExDSnVZVzFsY3lJNld5SmtaV1poZFd4MElsMHNJbTFoY0hCcGJtZHpJam9pY1VKQlFXOUNMSEZDTzNGQ1FVRmlRU3hQSWl3aVptbHNaU0k2SW1sdVpHVjRMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaVpYaHdiM0owSUdSbFptRjFiSFFnWm5KdmJTQW5MaTl2Ym1WTWFXNWxRMjl0YldGTWFYTjBjeWM3WEc0aVhYMD0iLCJpbXBvcnQgVGVtcGxhdGVUYWcgZnJvbSAnLi4vVGVtcGxhdGVUYWcnO1xuaW1wb3J0IGlubGluZUFycmF5VHJhbnNmb3JtZXIgZnJvbSAnLi4vaW5saW5lQXJyYXlUcmFuc2Zvcm1lcic7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5pbXBvcnQgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3JlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcic7XG5cbnZhciBvbmVMaW5lQ29tbWFMaXN0cyA9IG5ldyBUZW1wbGF0ZVRhZyhpbmxpbmVBcnJheVRyYW5zZm9ybWVyKHsgc2VwYXJhdG9yOiAnLCcgfSksIHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcigvKD86XFxzKykvZywgJyAnKSwgdHJpbVJlc3VsdFRyYW5zZm9ybWVyKTtcblxuZXhwb3J0IGRlZmF1bHQgb25lTGluZUNvbW1hTGlzdHM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl2Ym1WTWFXNWxRMjl0YldGTWFYTjBjeTl2Ym1WTWFXNWxRMjl0YldGTWFYTjBjeTVxY3lKZExDSnVZVzFsY3lJNld5SlVaVzF3YkdGMFpWUmhaeUlzSW1sdWJHbHVaVUZ5Y21GNVZISmhibk5tYjNKdFpYSWlMQ0owY21sdFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJaUxDSnlaWEJzWVdObFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJaUxDSnZibVZNYVc1bFEyOXRiV0ZNYVhOMGN5SXNJbk5sY0dGeVlYUnZjaUpkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzVDBGQlQwRXNWMEZCVUN4TlFVRjNRaXhuUWtGQmVFSTdRVUZEUVN4UFFVRlBReXh6UWtGQlVDeE5RVUZ0UXl3eVFrRkJia003UVVGRFFTeFBRVUZQUXl4eFFrRkJVQ3hOUVVGclF5d3dRa0ZCYkVNN1FVRkRRU3hQUVVGUFF5eDNRa0ZCVUN4TlFVRnhReXcyUWtGQmNrTTdPMEZCUlVFc1NVRkJUVU1zYjBKQlFXOUNMRWxCUVVsS0xGZEJRVW9zUTBGRGVFSkRMSFZDUVVGMVFpeEZRVUZGU1N4WFFVRlhMRWRCUVdJc1JVRkJka0lzUTBGRWQwSXNSVUZGZUVKR0xIbENRVUY1UWl4VlFVRjZRaXhGUVVGeFF5eEhRVUZ5UXl4RFFVWjNRaXhGUVVkNFFrUXNjVUpCU0hkQ0xFTkJRVEZDT3p0QlFVMUJMR1ZCUVdWRkxHbENRVUZtSWl3aVptbHNaU0k2SW05dVpVeHBibVZEYjIxdFlVeHBjM1J6TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lhVzF3YjNKMElGUmxiWEJzWVhSbFZHRm5JR1p5YjIwZ0p5NHVMMVJsYlhCc1lYUmxWR0ZuSnp0Y2JtbHRjRzl5ZENCcGJteHBibVZCY25KaGVWUnlZVzV6Wm05eWJXVnlJR1p5YjIwZ0p5NHVMMmx1YkdsdVpVRnljbUY1VkhKaGJuTm1iM0p0WlhJbk8xeHVhVzF3YjNKMElIUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUJtY205dElDY3VMaTkwY21sdFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJbk8xeHVhVzF3YjNKMElISmxjR3hoWTJWU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lCbWNtOXRJQ2N1TGk5eVpYQnNZV05sVW1WemRXeDBWSEpoYm5ObWIzSnRaWEluTzF4dVhHNWpiMjV6ZENCdmJtVk1hVzVsUTI5dGJXRk1hWE4wY3lBOUlHNWxkeUJVWlcxd2JHRjBaVlJoWnloY2JpQWdhVzVzYVc1bFFYSnlZWGxVY21GdWMyWnZjbTFsY2loN0lITmxjR0Z5WVhSdmNqb2dKeXduSUgwcExGeHVJQ0J5WlhCc1lXTmxVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSW9MeWcvT2x4Y2N5c3BMMmNzSUNjZ0p5a3NYRzRnSUhSeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpeGNiaWs3WEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUc5dVpVeHBibVZEYjIxdFlVeHBjM1J6TzF4dUlsMTkiLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi9vbmVMaW5lQ29tbWFMaXN0c0FuZCc7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl2Ym1WTWFXNWxRMjl0YldGTWFYTjBjMEZ1WkM5cGJtUmxlQzVxY3lKZExDSnVZVzFsY3lJNld5SmtaV1poZFd4MElsMHNJbTFoY0hCcGJtZHpJam9pY1VKQlFXOUNMSGRDTzNGQ1FVRmlRU3hQSWl3aVptbHNaU0k2SW1sdVpHVjRMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaVpYaHdiM0owSUdSbFptRjFiSFFnWm5KdmJTQW5MaTl2Ym1WTWFXNWxRMjl0YldGTWFYTjBjMEZ1WkNjN1hHNGlYWDA9IiwiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyIGZyb20gJy4uL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuaW1wb3J0IHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXInO1xuXG52YXIgb25lTGluZUNvbW1hTGlzdHNBbmQgPSBuZXcgVGVtcGxhdGVUYWcoaW5saW5lQXJyYXlUcmFuc2Zvcm1lcih7IHNlcGFyYXRvcjogJywnLCBjb25qdW5jdGlvbjogJ2FuZCcgfSksIHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcigvKD86XFxzKykvZywgJyAnKSwgdHJpbVJlc3VsdFRyYW5zZm9ybWVyKTtcblxuZXhwb3J0IGRlZmF1bHQgb25lTGluZUNvbW1hTGlzdHNBbmQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl2Ym1WTWFXNWxRMjl0YldGTWFYTjBjMEZ1WkM5dmJtVk1hVzVsUTI5dGJXRk1hWE4wYzBGdVpDNXFjeUpkTENKdVlXMWxjeUk2V3lKVVpXMXdiR0YwWlZSaFp5SXNJbWx1YkdsdVpVRnljbUY1VkhKaGJuTm1iM0p0WlhJaUxDSjBjbWx0VW1WemRXeDBWSEpoYm5ObWIzSnRaWElpTENKeVpYQnNZV05sVW1WemRXeDBWSEpoYm5ObWIzSnRaWElpTENKdmJtVk1hVzVsUTI5dGJXRk1hWE4wYzBGdVpDSXNJbk5sY0dGeVlYUnZjaUlzSW1OdmJtcDFibU4wYVc5dUlsMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeFBRVUZQUVN4WFFVRlFMRTFCUVhkQ0xHZENRVUY0UWp0QlFVTkJMRTlCUVU5RExITkNRVUZRTEUxQlFXMURMREpDUVVGdVF6dEJRVU5CTEU5QlFVOURMSEZDUVVGUUxFMUJRV3RETERCQ1FVRnNRenRCUVVOQkxFOUJRVTlETEhkQ1FVRlFMRTFCUVhGRExEWkNRVUZ5UXpzN1FVRkZRU3hKUVVGTlF5eDFRa0ZCZFVJc1NVRkJTVW9zVjBGQlNpeERRVU16UWtNc2RVSkJRWFZDTEVWQlFVVkpMRmRCUVZjc1IwRkJZaXhGUVVGclFrTXNZVUZCWVN4TFFVRXZRaXhGUVVGMlFpeERRVVF5UWl4RlFVVXpRa2dzZVVKQlFYbENMRlZCUVhwQ0xFVkJRWEZETEVkQlFYSkRMRU5CUmpKQ0xFVkJSek5DUkN4eFFrRklNa0lzUTBGQk4wSTdPMEZCVFVFc1pVRkJaVVVzYjBKQlFXWWlMQ0ptYVd4bElqb2liMjVsVEdsdVpVTnZiVzFoVEdsemRITkJibVF1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SnBiWEJ2Y25RZ1ZHVnRjR3hoZEdWVVlXY2dabkp2YlNBbkxpNHZWR1Z0Y0d4aGRHVlVZV2NuTzF4dWFXMXdiM0owSUdsdWJHbHVaVUZ5Y21GNVZISmhibk5tYjNKdFpYSWdabkp2YlNBbkxpNHZhVzVzYVc1bFFYSnlZWGxVY21GdWMyWnZjbTFsY2ljN1hHNXBiWEJ2Y25RZ2RISnBiVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlJR1p5YjIwZ0p5NHVMM1J5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2ljN1hHNXBiWEJ2Y25RZ2NtVndiR0ZqWlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5SUdaeWIyMGdKeTR1TDNKbGNHeGhZMlZTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaWM3WEc1Y2JtTnZibk4wSUc5dVpVeHBibVZEYjIxdFlVeHBjM1J6UVc1a0lEMGdibVYzSUZSbGJYQnNZWFJsVkdGbktGeHVJQ0JwYm14cGJtVkJjbkpoZVZSeVlXNXpabTl5YldWeUtIc2djMlZ3WVhKaGRHOXlPaUFuTENjc0lHTnZibXAxYm1OMGFXOXVPaUFuWVc1a0p5QjlLU3hjYmlBZ2NtVndiR0ZqWlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5S0M4b1B6cGNYSE1yS1M5bkxDQW5JQ2NwTEZ4dUlDQjBjbWx0VW1WemRXeDBWSEpoYm5ObWIzSnRaWElzWEc0cE8xeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQnZibVZNYVc1bFEyOXRiV0ZNYVhOMGMwRnVaRHRjYmlKZGZRPT0iLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi9vbmVMaW5lQ29tbWFMaXN0c09yJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXZibVZNYVc1bFEyOXRiV0ZNYVhOMGMwOXlMMmx1WkdWNExtcHpJbDBzSW01aGJXVnpJanBiSW1SbFptRjFiSFFpWFN3aWJXRndjR2x1WjNNaU9pSnhRa0ZCYjBJc2RVSTdjVUpCUVdKQkxFOGlMQ0ptYVd4bElqb2lhVzVrWlhndWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpsZUhCdmNuUWdaR1ZtWVhWc2RDQm1jbTl0SUNjdUwyOXVaVXhwYm1WRGIyMXRZVXhwYzNSelQzSW5PMXh1SWwxOSIsImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgaW5saW5lQXJyYXlUcmFuc2Zvcm1lciBmcm9tICcuLi9pbmxpbmVBcnJheVRyYW5zZm9ybWVyJztcbmltcG9ydCB0cmltUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcbmltcG9ydCByZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyJztcblxudmFyIG9uZUxpbmVDb21tYUxpc3RzT3IgPSBuZXcgVGVtcGxhdGVUYWcoaW5saW5lQXJyYXlUcmFuc2Zvcm1lcih7IHNlcGFyYXRvcjogJywnLCBjb25qdW5jdGlvbjogJ29yJyB9KSwgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyKC8oPzpcXHMrKS9nLCAnICcpLCB0cmltUmVzdWx0VHJhbnNmb3JtZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBvbmVMaW5lQ29tbWFMaXN0c09yO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5dmJtVk1hVzVsUTI5dGJXRk1hWE4wYzA5eUwyOXVaVXhwYm1WRGIyMXRZVXhwYzNSelQzSXVhbk1pWFN3aWJtRnRaWE1pT2xzaVZHVnRjR3hoZEdWVVlXY2lMQ0pwYm14cGJtVkJjbkpoZVZSeVlXNXpabTl5YldWeUlpd2lkSEpwYlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5SWl3aWNtVndiR0ZqWlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5SWl3aWIyNWxUR2x1WlVOdmJXMWhUR2x6ZEhOUGNpSXNJbk5sY0dGeVlYUnZjaUlzSW1OdmJtcDFibU4wYVc5dUlsMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeFBRVUZQUVN4WFFVRlFMRTFCUVhkQ0xHZENRVUY0UWp0QlFVTkJMRTlCUVU5RExITkNRVUZRTEUxQlFXMURMREpDUVVGdVF6dEJRVU5CTEU5QlFVOURMSEZDUVVGUUxFMUJRV3RETERCQ1FVRnNRenRCUVVOQkxFOUJRVTlETEhkQ1FVRlFMRTFCUVhGRExEWkNRVUZ5UXpzN1FVRkZRU3hKUVVGTlF5eHpRa0ZCYzBJc1NVRkJTVW9zVjBGQlNpeERRVU14UWtNc2RVSkJRWFZDTEVWQlFVVkpMRmRCUVZjc1IwRkJZaXhGUVVGclFrTXNZVUZCWVN4SlFVRXZRaXhGUVVGMlFpeERRVVF3UWl4RlFVVXhRa2dzZVVKQlFYbENMRlZCUVhwQ0xFVkJRWEZETEVkQlFYSkRMRU5CUmpCQ0xFVkJSekZDUkN4eFFrRklNRUlzUTBGQk5VSTdPMEZCVFVFc1pVRkJaVVVzYlVKQlFXWWlMQ0ptYVd4bElqb2liMjVsVEdsdVpVTnZiVzFoVEdsemRITlBjaTVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltbHRjRzl5ZENCVVpXMXdiR0YwWlZSaFp5Qm1jbTl0SUNjdUxpOVVaVzF3YkdGMFpWUmhaeWM3WEc1cGJYQnZjblFnYVc1c2FXNWxRWEp5WVhsVWNtRnVjMlp2Y20xbGNpQm1jbTl0SUNjdUxpOXBibXhwYm1WQmNuSmhlVlJ5WVc1elptOXliV1Z5Snp0Y2JtbHRjRzl5ZENCMGNtbHRVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSWdabkp2YlNBbkxpNHZkSEpwYlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5Snp0Y2JtbHRjRzl5ZENCeVpYQnNZV05sVW1WemRXeDBWSEpoYm5ObWIzSnRaWElnWm5KdmJTQW5MaTR2Y21Wd2JHRmpaVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlKenRjYmx4dVkyOXVjM1FnYjI1bFRHbHVaVU52YlcxaFRHbHpkSE5QY2lBOUlHNWxkeUJVWlcxd2JHRjBaVlJoWnloY2JpQWdhVzVzYVc1bFFYSnlZWGxVY21GdWMyWnZjbTFsY2loN0lITmxjR0Z5WVhSdmNqb2dKeXduTENCamIyNXFkVzVqZEdsdmJqb2dKMjl5SnlCOUtTeGNiaUFnY21Wd2JHRmpaVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlLQzhvUHpwY1hITXJLUzluTENBbklDY3BMRnh1SUNCMGNtbHRVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSXNYRzRwTzF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCdmJtVk1hVzVsUTI5dGJXRk1hWE4wYzA5eU8xeHVJbDE5IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vb25lTGluZUlubGluZUxpc3RzJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXZibVZNYVc1bFNXNXNhVzVsVEdsemRITXZhVzVrWlhndWFuTWlYU3dpYm1GdFpYTWlPbHNpWkdWbVlYVnNkQ0pkTENKdFlYQndhVzVuY3lJNkluRkNRVUZ2UWl4elFqdHhRa0ZCWWtFc1R5SXNJbVpwYkdVaU9pSnBibVJsZUM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbVY0Y0c5eWRDQmtaV1poZFd4MElHWnliMjBnSnk0dmIyNWxUR2x1WlVsdWJHbHVaVXhwYzNSekp6dGNiaUpkZlE9PSIsImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgaW5saW5lQXJyYXlUcmFuc2Zvcm1lciBmcm9tICcuLi9pbmxpbmVBcnJheVRyYW5zZm9ybWVyJztcbmltcG9ydCB0cmltUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcbmltcG9ydCByZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyJztcblxudmFyIG9uZUxpbmVJbmxpbmVMaXN0cyA9IG5ldyBUZW1wbGF0ZVRhZyhpbmxpbmVBcnJheVRyYW5zZm9ybWVyLCByZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIoLyg/OlxccyspL2csICcgJyksIHRyaW1SZXN1bHRUcmFuc2Zvcm1lcik7XG5cbmV4cG9ydCBkZWZhdWx0IG9uZUxpbmVJbmxpbmVMaXN0cztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXZibVZNYVc1bFNXNXNhVzVsVEdsemRITXZiMjVsVEdsdVpVbHViR2x1WlV4cGMzUnpMbXB6SWwwc0ltNWhiV1Z6SWpwYklsUmxiWEJzWVhSbFZHRm5JaXdpYVc1c2FXNWxRWEp5WVhsVWNtRnVjMlp2Y20xbGNpSXNJblJ5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lJc0luSmxjR3hoWTJWU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lJc0ltOXVaVXhwYm1WSmJteHBibVZNYVhOMGN5SmRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNUMEZCVDBFc1YwRkJVQ3hOUVVGM1FpeG5Ra0ZCZUVJN1FVRkRRU3hQUVVGUFF5eHpRa0ZCVUN4TlFVRnRReXd5UWtGQmJrTTdRVUZEUVN4UFFVRlBReXh4UWtGQlVDeE5RVUZyUXl3d1FrRkJiRU03UVVGRFFTeFBRVUZQUXl4M1FrRkJVQ3hOUVVGeFF5dzJRa0ZCY2tNN08wRkJSVUVzU1VGQlRVTXNjVUpCUVhGQ0xFbEJRVWxLTEZkQlFVb3NRMEZEZWtKRExITkNRVVI1UWl4RlFVVjZRa1VzZVVKQlFYbENMRlZCUVhwQ0xFVkJRWEZETEVkQlFYSkRMRU5CUm5sQ0xFVkJSM3BDUkN4eFFrRkllVUlzUTBGQk0wSTdPMEZCVFVFc1pVRkJaVVVzYTBKQlFXWWlMQ0ptYVd4bElqb2liMjVsVEdsdVpVbHViR2x1WlV4cGMzUnpMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUZSbGJYQnNZWFJsVkdGbklHWnliMjBnSnk0dUwxUmxiWEJzWVhSbFZHRm5KenRjYm1sdGNHOXlkQ0JwYm14cGJtVkJjbkpoZVZSeVlXNXpabTl5YldWeUlHWnliMjBnSnk0dUwybHViR2x1WlVGeWNtRjVWSEpoYm5ObWIzSnRaWEluTzF4dWFXMXdiM0owSUhSeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpQm1jbTl0SUNjdUxpOTBjbWx0VW1WemRXeDBWSEpoYm5ObWIzSnRaWEluTzF4dWFXMXdiM0owSUhKbGNHeGhZMlZTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUJtY205dElDY3VMaTl5WlhCc1lXTmxVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSW5PMXh1WEc1amIyNXpkQ0J2Ym1WTWFXNWxTVzVzYVc1bFRHbHpkSE1nUFNCdVpYY2dWR1Z0Y0d4aGRHVlVZV2NvWEc0Z0lHbHViR2x1WlVGeWNtRjVWSEpoYm5ObWIzSnRaWElzWEc0Z0lISmxjR3hoWTJWU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lndktEODZYRnh6S3lrdlp5d2dKeUFuS1N4Y2JpQWdkSEpwYlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5TEZ4dUtUdGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdiMjVsVEdsdVpVbHViR2x1WlV4cGMzUnpPMXh1SWwxOSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL29uZUxpbmVUcmltJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXZibVZNYVc1bFZISnBiUzlwYm1SbGVDNXFjeUpkTENKdVlXMWxjeUk2V3lKa1pXWmhkV3gwSWwwc0ltMWhjSEJwYm1keklqb2ljVUpCUVc5Q0xHVTdjVUpCUVdKQkxFOGlMQ0ptYVd4bElqb2lhVzVrWlhndWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpsZUhCdmNuUWdaR1ZtWVhWc2RDQm1jbTl0SUNjdUwyOXVaVXhwYm1WVWNtbHRKenRjYmlKZGZRPT0iLCJpbXBvcnQgVGVtcGxhdGVUYWcgZnJvbSAnLi4vVGVtcGxhdGVUYWcnO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuaW1wb3J0IHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXInO1xuXG52YXIgb25lTGluZVRyaW0gPSBuZXcgVGVtcGxhdGVUYWcocmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyKC8oPzpcXG5cXHMqKS9nLCAnJyksIHRyaW1SZXN1bHRUcmFuc2Zvcm1lcik7XG5cbmV4cG9ydCBkZWZhdWx0IG9uZUxpbmVUcmltO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5dmJtVk1hVzVsVkhKcGJTOXZibVZNYVc1bFZISnBiUzVxY3lKZExDSnVZVzFsY3lJNld5SlVaVzF3YkdGMFpWUmhaeUlzSW5SeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpSXNJbkpsY0d4aFkyVlNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpSXNJbTl1WlV4cGJtVlVjbWx0SWwwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4UFFVRlBRU3hYUVVGUUxFMUJRWGRDTEdkQ1FVRjRRanRCUVVOQkxFOUJRVTlETEhGQ1FVRlFMRTFCUVd0RExEQkNRVUZzUXp0QlFVTkJMRTlCUVU5RExIZENRVUZRTEUxQlFYRkRMRFpDUVVGeVF6czdRVUZGUVN4SlFVRk5ReXhqUVVGakxFbEJRVWxJTEZkQlFVb3NRMEZEYkVKRkxIbENRVUY1UWl4WlFVRjZRaXhGUVVGMVF5eEZRVUYyUXl4RFFVUnJRaXhGUVVWc1FrUXNjVUpCUm10Q0xFTkJRWEJDT3p0QlFVdEJMR1ZCUVdWRkxGZEJRV1lpTENKbWFXeGxJam9pYjI1bFRHbHVaVlJ5YVcwdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpwYlhCdmNuUWdWR1Z0Y0d4aGRHVlVZV2NnWm5KdmJTQW5MaTR2VkdWdGNHeGhkR1ZVWVdjbk8xeHVhVzF3YjNKMElIUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUJtY205dElDY3VMaTkwY21sdFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJbk8xeHVhVzF3YjNKMElISmxjR3hoWTJWU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lCbWNtOXRJQ2N1TGk5eVpYQnNZV05sVW1WemRXeDBWSEpoYm5ObWIzSnRaWEluTzF4dVhHNWpiMjV6ZENCdmJtVk1hVzVsVkhKcGJTQTlJRzVsZHlCVVpXMXdiR0YwWlZSaFp5aGNiaUFnY21Wd2JHRmpaVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlLQzhvUHpwY1hHNWNYSE1xS1M5bkxDQW5KeWtzWEc0Z0lIUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaXhjYmlrN1hHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElHOXVaVXhwYm1WVWNtbHRPMXh1SWwxOSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL3JlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXInO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5eVpXMXZkbVZPYjI1UWNtbHVkR2x1WjFaaGJIVmxjMVJ5WVc1elptOXliV1Z5TDJsdVpHVjRMbXB6SWwwc0ltNWhiV1Z6SWpwYkltUmxabUYxYkhRaVhTd2liV0Z3Y0dsdVozTWlPaUp4UWtGQmIwSXNjME03Y1VKQlFXSkJMRThpTENKbWFXeGxJam9pYVc1a1pYZ3Vhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKbGVIQnZjblFnWkdWbVlYVnNkQ0JtY205dElDY3VMM0psYlc5MlpVNXZibEJ5YVc1MGFXNW5WbUZzZFdWelZISmhibk5tYjNKdFpYSW5PMXh1SWwxOSIsInZhciBpc1ZhbGlkVmFsdWUgPSBmdW5jdGlvbiBpc1ZhbGlkVmFsdWUoeCkge1xuICByZXR1cm4geCAhPSBudWxsICYmICFOdW1iZXIuaXNOYU4oeCkgJiYgdHlwZW9mIHggIT09ICdib29sZWFuJztcbn07XG5cbnZhciByZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyID0gZnVuY3Rpb24gcmVtb3ZlTm9uUHJpbnRpbmdWYWx1ZXNUcmFuc2Zvcm1lcigpIHtcbiAgcmV0dXJuIHtcbiAgICBvblN1YnN0aXR1dGlvbjogZnVuY3Rpb24gb25TdWJzdGl0dXRpb24oc3Vic3RpdHV0aW9uKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShzdWJzdGl0dXRpb24pKSB7XG4gICAgICAgIHJldHVybiBzdWJzdGl0dXRpb24uZmlsdGVyKGlzVmFsaWRWYWx1ZSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNWYWxpZFZhbHVlKHN1YnN0aXR1dGlvbikpIHtcbiAgICAgICAgcmV0dXJuIHN1YnN0aXR1dGlvbjtcbiAgICAgIH1cbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCByZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5eVpXMXZkbVZPYjI1UWNtbHVkR2x1WjFaaGJIVmxjMVJ5WVc1elptOXliV1Z5TDNKbGJXOTJaVTV2YmxCeWFXNTBhVzVuVm1Gc2RXVnpWSEpoYm5ObWIzSnRaWEl1YW5NaVhTd2libUZ0WlhNaU9sc2lhWE5XWVd4cFpGWmhiSFZsSWl3aWVDSXNJazUxYldKbGNpSXNJbWx6VG1GT0lpd2ljbVZ0YjNabFRtOXVVSEpwYm5ScGJtZFdZV3gxWlhOVWNtRnVjMlp2Y20xbGNpSXNJbTl1VTNWaWMzUnBkSFYwYVc5dUlpd2ljM1ZpYzNScGRIVjBhVzl1SWl3aVFYSnlZWGtpTENKcGMwRnljbUY1SWl3aVptbHNkR1Z5SWwwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4SlFVRk5RU3hsUVVGbExGTkJRV1pCTEZsQlFXVTdRVUZCUVN4VFFVTnVRa01zUzBGQlN5eEpRVUZNTEVsQlFXRXNRMEZCUTBNc1QwRkJUME1zUzBGQlVDeERRVUZoUml4RFFVRmlMRU5CUVdRc1NVRkJhVU1zVDBGQlQwRXNRMEZCVUN4TFFVRmhMRk5CUkROQ08wRkJRVUVzUTBGQmNrSTdPMEZCUjBFc1NVRkJUVWNzY1VOQlFYRkRMRk5CUVhKRFFTeHJRMEZCY1VNN1FVRkJRU3hUUVVGUE8wRkJRMmhFUXl4clFrRkVaMFFzTUVKQlEycERReXhaUVVScFF5eEZRVU51UWp0QlFVTXpRaXhWUVVGSlF5eE5RVUZOUXl4UFFVRk9MRU5CUVdOR0xGbEJRV1FzUTBGQlNpeEZRVUZwUXp0QlFVTXZRaXhsUVVGUFFTeGhRVUZoUnl4TlFVRmlMRU5CUVc5Q1ZDeFpRVUZ3UWl4RFFVRlFPMEZCUTBRN1FVRkRSQ3hWUVVGSlFTeGhRVUZoVFN4WlFVRmlMRU5CUVVvc1JVRkJaME03UVVGRE9VSXNaVUZCVDBFc1dVRkJVRHRCUVVORU8wRkJRMFFzWVVGQlR5eEZRVUZRTzBGQlEwUTdRVUZVSzBNc1IwRkJVRHRCUVVGQkxFTkJRVE5ET3p0QlFWbEJMR1ZCUVdWR0xHdERRVUZtSWl3aVptbHNaU0k2SW5KbGJXOTJaVTV2YmxCeWFXNTBhVzVuVm1Gc2RXVnpWSEpoYm5ObWIzSnRaWEl1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmpiMjV6ZENCcGMxWmhiR2xrVm1Gc2RXVWdQU0I0SUQwK1hHNGdJSGdnSVQwZ2JuVnNiQ0FtSmlBaFRuVnRZbVZ5TG1selRtRk9LSGdwSUNZbUlIUjVjR1Z2WmlCNElDRTlQU0FuWW05dmJHVmhiaWM3WEc1Y2JtTnZibk4wSUhKbGJXOTJaVTV2YmxCeWFXNTBhVzVuVm1Gc2RXVnpWSEpoYm5ObWIzSnRaWElnUFNBb0tTQTlQaUFvZTF4dUlDQnZibE4xWW5OMGFYUjFkR2x2YmloemRXSnpkR2wwZFhScGIyNHBJSHRjYmlBZ0lDQnBaaUFvUVhKeVlYa3VhWE5CY25KaGVTaHpkV0p6ZEdsMGRYUnBiMjRwS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYzNWaWMzUnBkSFYwYVc5dUxtWnBiSFJsY2locGMxWmhiR2xrVm1Gc2RXVXBPMXh1SUNBZ0lIMWNiaUFnSUNCcFppQW9hWE5XWVd4cFpGWmhiSFZsS0hOMVluTjBhWFIxZEdsdmJpa3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnpkV0p6ZEdsMGRYUnBiMjQ3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlBbkp6dGNiaUFnZlN4Y2JuMHBPMXh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0J5WlcxdmRtVk9iMjVRY21sdWRHbHVaMVpoYkhWbGMxUnlZVzV6Wm05eWJXVnlPMXh1SWwxOSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL3JlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcic7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl5WlhCc1lXTmxVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSXZhVzVrWlhndWFuTWlYU3dpYm1GdFpYTWlPbHNpWkdWbVlYVnNkQ0pkTENKdFlYQndhVzVuY3lJNkluRkNRVUZ2UWl3MFFqdHhRa0ZCWWtFc1R5SXNJbVpwYkdVaU9pSnBibVJsZUM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbVY0Y0c5eWRDQmtaV1poZFd4MElHWnliMjBnSnk0dmNtVndiR0ZqWlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5Snp0Y2JpSmRmUT09IiwiLyoqXG4gKiBSZXBsYWNlcyB0YWJzLCBuZXdsaW5lcyBhbmQgc3BhY2VzIHdpdGggdGhlIGNob3NlbiB2YWx1ZSB3aGVuIHRoZXkgb2NjdXIgaW4gc2VxdWVuY2VzXG4gKiBAcGFyYW0gIHsoU3RyaW5nfFJlZ0V4cCl9IHJlcGxhY2VXaGF0IC0gdGhlIHZhbHVlIG9yIHBhdHRlcm4gdGhhdCBzaG91bGQgYmUgcmVwbGFjZWRcbiAqIEBwYXJhbSAgeyp9ICAgICAgICAgICAgICAgcmVwbGFjZVdpdGggLSB0aGUgcmVwbGFjZW1lbnQgdmFsdWVcbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAgLSBhIFRlbXBsYXRlVGFnIHRyYW5zZm9ybWVyXG4gKi9cbnZhciByZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIgPSBmdW5jdGlvbiByZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIocmVwbGFjZVdoYXQsIHJlcGxhY2VXaXRoKSB7XG4gIHJldHVybiB7XG4gICAgb25FbmRSZXN1bHQ6IGZ1bmN0aW9uIG9uRW5kUmVzdWx0KGVuZFJlc3VsdCkge1xuICAgICAgaWYgKHJlcGxhY2VXaGF0ID09IG51bGwgfHwgcmVwbGFjZVdpdGggPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciByZXF1aXJlcyBhdCBsZWFzdCAyIGFyZ3VtZW50cy4nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbmRSZXN1bHQucmVwbGFjZShyZXBsYWNlV2hhdCwgcmVwbGFjZVdpdGgpO1xuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXlaWEJzWVdObFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJdmNtVndiR0ZqWlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5TG1weklsMHNJbTVoYldWeklqcGJJbkpsY0d4aFkyVlNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpSXNJbkpsY0d4aFkyVlhhR0YwSWl3aWNtVndiR0ZqWlZkcGRHZ2lMQ0p2YmtWdVpGSmxjM1ZzZENJc0ltVnVaRkpsYzNWc2RDSXNJa1Z5Y205eUlpd2ljbVZ3YkdGalpTSmRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRTdPenM3T3p0QlFVMUJMRWxCUVUxQkxESkNRVUV5UWl4VFFVRXpRa0VzZDBKQlFUSkNMRU5CUVVORExGZEJRVVFzUlVGQlkwTXNWMEZCWkR0QlFVRkJMRk5CUVN0Q08wRkJRemxFUXl4bFFVUTRSQ3gxUWtGRGJFUkRMRk5CUkd0RUxFVkJRM1pETzBGQlEzSkNMRlZCUVVsSUxHVkJRV1VzU1VGQlppeEpRVUYxUWtNc1pVRkJaU3hKUVVFeFF5eEZRVUZuUkR0QlFVTTVReXhqUVVGTkxFbEJRVWxITEV0QlFVb3NRMEZEU2l4NVJFRkVTU3hEUVVGT08wRkJSMFE3UVVGRFJDeGhRVUZQUkN4VlFVRlZSU3hQUVVGV0xFTkJRV3RDVEN4WFFVRnNRaXhGUVVFclFrTXNWMEZCTDBJc1EwRkJVRHRCUVVORU8wRkJValpFTEVkQlFTOUNPMEZCUVVFc1EwRkJha003TzBGQlYwRXNaVUZCWlVZc2QwSkJRV1lpTENKbWFXeGxJam9pY21Wd2JHRmpaVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUx5b3FYRzRnS2lCU1pYQnNZV05sY3lCMFlXSnpMQ0J1Wlhkc2FXNWxjeUJoYm1RZ2MzQmhZMlZ6SUhkcGRHZ2dkR2hsSUdOb2IzTmxiaUIyWVd4MVpTQjNhR1Z1SUhSb1pYa2diMk5qZFhJZ2FXNGdjMlZ4ZFdWdVkyVnpYRzRnS2lCQWNHRnlZVzBnSUhzb1UzUnlhVzVuZkZKbFowVjRjQ2w5SUhKbGNHeGhZMlZYYUdGMElDMGdkR2hsSUhaaGJIVmxJRzl5SUhCaGRIUmxjbTRnZEdoaGRDQnphRzkxYkdRZ1ltVWdjbVZ3YkdGalpXUmNiaUFxSUVCd1lYSmhiU0FnZXlwOUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21Wd2JHRmpaVmRwZEdnZ0xTQjBhR1VnY21Wd2JHRmpaVzFsYm5RZ2RtRnNkV1ZjYmlBcUlFQnlaWFIxY200Z2UwOWlhbVZqZEgwZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMU0JoSUZSbGJYQnNZWFJsVkdGbklIUnlZVzV6Wm05eWJXVnlYRzRnS2k5Y2JtTnZibk4wSUhKbGNHeGhZMlZTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUE5SUNoeVpYQnNZV05sVjJoaGRDd2djbVZ3YkdGalpWZHBkR2dwSUQwK0lDaDdYRzRnSUc5dVJXNWtVbVZ6ZFd4MEtHVnVaRkpsYzNWc2RDa2dlMXh1SUNBZ0lHbG1JQ2h5WlhCc1lXTmxWMmhoZENBOVBTQnVkV3hzSUh4OElISmxjR3hoWTJWWGFYUm9JRDA5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGNiaUFnSUNBZ0lDQWdKM0psY0d4aFkyVlNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpQnlaWEYxYVhKbGN5QmhkQ0JzWldGemRDQXlJR0Z5WjNWdFpXNTBjeTRuTEZ4dUlDQWdJQ0FnS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdjbVYwZFhKdUlHVnVaRkpsYzNWc2RDNXlaWEJzWVdObEtISmxjR3hoWTJWWGFHRjBMQ0J5WlhCc1lXTmxWMmwwYUNrN1hHNGdJSDBzWEc1OUtUdGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdjbVZ3YkdGalpWSmxjM1ZzZEZSeVlXNXpabTl5YldWeU8xeHVJbDE5IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vcmVwbGFjZVN0cmluZ1RyYW5zZm9ybWVyJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXlaWEJzWVdObFUzUnlhVzVuVkhKaGJuTm1iM0p0WlhJdmFXNWtaWGd1YW5NaVhTd2libUZ0WlhNaU9sc2laR1ZtWVhWc2RDSmRMQ0p0WVhCd2FXNW5jeUk2SW5GQ1FVRnZRaXcwUWp0eFFrRkJZa0VzVHlJc0ltWnBiR1VpT2lKcGJtUmxlQzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltVjRjRzl5ZENCa1pXWmhkV3gwSUdaeWIyMGdKeTR2Y21Wd2JHRmpaVk4wY21sdVoxUnlZVzV6Wm05eWJXVnlKenRjYmlKZGZRPT0iLCJ2YXIgcmVwbGFjZVN0cmluZ1RyYW5zZm9ybWVyID0gZnVuY3Rpb24gcmVwbGFjZVN0cmluZ1RyYW5zZm9ybWVyKHJlcGxhY2VXaGF0LCByZXBsYWNlV2l0aCkge1xuICByZXR1cm4ge1xuICAgIG9uU3RyaW5nOiBmdW5jdGlvbiBvblN0cmluZyhzdHIpIHtcbiAgICAgIGlmIChyZXBsYWNlV2hhdCA9PSBudWxsIHx8IHJlcGxhY2VXaXRoID09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdyZXBsYWNlU3RyaW5nVHJhbnNmb3JtZXIgcmVxdWlyZXMgYXQgbGVhc3QgMiBhcmd1bWVudHMuJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHIucmVwbGFjZShyZXBsYWNlV2hhdCwgcmVwbGFjZVdpdGgpO1xuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHJlcGxhY2VTdHJpbmdUcmFuc2Zvcm1lcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXlaWEJzWVdObFUzUnlhVzVuVkhKaGJuTm1iM0p0WlhJdmNtVndiR0ZqWlZOMGNtbHVaMVJ5WVc1elptOXliV1Z5TG1weklsMHNJbTVoYldWeklqcGJJbkpsY0d4aFkyVlRkSEpwYm1kVWNtRnVjMlp2Y20xbGNpSXNJbkpsY0d4aFkyVlhhR0YwSWl3aWNtVndiR0ZqWlZkcGRHZ2lMQ0p2YmxOMGNtbHVaeUlzSW5OMGNpSXNJa1Z5Y205eUlpd2ljbVZ3YkdGalpTSmRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNTVUZCVFVFc01rSkJRVEpDTEZOQlFUTkNRU3gzUWtGQk1rSXNRMEZCUTBNc1YwRkJSQ3hGUVVGalF5eFhRVUZrTzBGQlFVRXNVMEZCSzBJN1FVRkRPVVJETEZsQlJEaEVMRzlDUVVOeVJFTXNSMEZFY1VRc1JVRkRhRVE3UVVGRFdpeFZRVUZKU0N4bFFVRmxMRWxCUVdZc1NVRkJkVUpETEdWQlFXVXNTVUZCTVVNc1JVRkJaMFE3UVVGRE9VTXNZMEZCVFN4SlFVRkpSeXhMUVVGS0xFTkJRMG9zZVVSQlJFa3NRMEZCVGp0QlFVZEVPenRCUVVWRUxHRkJRVTlFTEVsQlFVbEZMRTlCUVVvc1EwRkJXVXdzVjBGQldpeEZRVUY1UWtNc1YwRkJla0lzUTBGQlVEdEJRVU5FTzBGQlZEWkVMRWRCUVM5Q08wRkJRVUVzUTBGQmFrTTdPMEZCV1VFc1pVRkJaVVlzZDBKQlFXWWlMQ0ptYVd4bElqb2ljbVZ3YkdGalpWTjBjbWx1WjFSeVlXNXpabTl5YldWeUxtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpWTI5dWMzUWdjbVZ3YkdGalpWTjBjbWx1WjFSeVlXNXpabTl5YldWeUlEMGdLSEpsY0d4aFkyVlhhR0YwTENCeVpYQnNZV05sVjJsMGFDa2dQVDRnS0h0Y2JpQWdiMjVUZEhKcGJtY29jM1J5S1NCN1hHNGdJQ0FnYVdZZ0tISmxjR3hoWTJWWGFHRjBJRDA5SUc1MWJHd2dmSHdnY21Wd2JHRmpaVmRwZEdnZ1BUMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0Z4dUlDQWdJQ0FnSUNBbmNtVndiR0ZqWlZOMGNtbHVaMVJ5WVc1elptOXliV1Z5SUhKbGNYVnBjbVZ6SUdGMElHeGxZWE4wSURJZ1lYSm5kVzFsYm5SekxpY3NYRzRnSUNBZ0lDQXBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lISmxkSFZ5YmlCemRISXVjbVZ3YkdGalpTaHlaWEJzWVdObFYyaGhkQ3dnY21Wd2JHRmpaVmRwZEdncE8xeHVJQ0I5TEZ4dWZTazdYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJSEpsY0d4aFkyVlRkSEpwYm1kVWNtRnVjMlp2Y20xbGNqdGNiaUpkZlE9PSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL3JlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lcic7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl5WlhCc1lXTmxVM1ZpYzNScGRIVjBhVzl1VkhKaGJuTm1iM0p0WlhJdmFXNWtaWGd1YW5NaVhTd2libUZ0WlhNaU9sc2laR1ZtWVhWc2RDSmRMQ0p0WVhCd2FXNW5jeUk2SW5GQ1FVRnZRaXhyUXp0eFFrRkJZa0VzVHlJc0ltWnBiR1VpT2lKcGJtUmxlQzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltVjRjRzl5ZENCa1pXWmhkV3gwSUdaeWIyMGdKeTR2Y21Wd2JHRmpaVk4xWW5OMGFYUjFkR2x2YmxSeVlXNXpabTl5YldWeUp6dGNiaUpkZlE9PSIsInZhciByZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIgPSBmdW5jdGlvbiByZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIocmVwbGFjZVdoYXQsIHJlcGxhY2VXaXRoKSB7XG4gIHJldHVybiB7XG4gICAgb25TdWJzdGl0dXRpb246IGZ1bmN0aW9uIG9uU3Vic3RpdHV0aW9uKHN1YnN0aXR1dGlvbiwgcmVzdWx0U29GYXIpIHtcbiAgICAgIGlmIChyZXBsYWNlV2hhdCA9PSBudWxsIHx8IHJlcGxhY2VXaXRoID09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdyZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIgcmVxdWlyZXMgYXQgbGVhc3QgMiBhcmd1bWVudHMuJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIERvIG5vdCB0b3VjaCBpZiBudWxsIG9yIHVuZGVmaW5lZFxuICAgICAgaWYgKHN1YnN0aXR1dGlvbiA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBzdWJzdGl0dXRpb247XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc3Vic3RpdHV0aW9uLnRvU3RyaW5nKCkucmVwbGFjZShyZXBsYWNlV2hhdCwgcmVwbGFjZVdpdGgpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHJlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXlaWEJzWVdObFUzVmljM1JwZEhWMGFXOXVWSEpoYm5ObWIzSnRaWEl2Y21Wd2JHRmpaVk4xWW5OMGFYUjFkR2x2YmxSeVlXNXpabTl5YldWeUxtcHpJbDBzSW01aGJXVnpJanBiSW5KbGNHeGhZMlZUZFdKemRHbDBkWFJwYjI1VWNtRnVjMlp2Y20xbGNpSXNJbkpsY0d4aFkyVlhhR0YwSWl3aWNtVndiR0ZqWlZkcGRHZ2lMQ0p2YmxOMVluTjBhWFIxZEdsdmJpSXNJbk4xWW5OMGFYUjFkR2x2YmlJc0luSmxjM1ZzZEZOdlJtRnlJaXdpUlhKeWIzSWlMQ0owYjFOMGNtbHVaeUlzSW5KbGNHeGhZMlVpWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEVsQlFVMUJMR2xEUVVGcFF5eFRRVUZxUTBFc09FSkJRV2xETEVOQlFVTkRMRmRCUVVRc1JVRkJZME1zVjBGQlpEdEJRVUZCTEZOQlFTdENPMEZCUTNCRlF5eHJRa0ZFYjBVc01FSkJRM0pFUXl4WlFVUnhSQ3hGUVVOMlEwTXNWMEZFZFVNc1JVRkRNVUk3UVVGRGVFTXNWVUZCU1Vvc1pVRkJaU3hKUVVGbUxFbEJRWFZDUXl4bFFVRmxMRWxCUVRGRExFVkJRV2RFTzBGQlF6bERMR05CUVUwc1NVRkJTVWtzUzBGQlNpeERRVU5LTEN0RVFVUkpMRU5CUVU0N1FVRkhSRHM3UVVGRlJEdEJRVU5CTEZWQlFVbEdMR2RDUVVGblFpeEpRVUZ3UWl4RlFVRXdRanRCUVVONFFpeGxRVUZQUVN4WlFVRlFPMEZCUTBRc1QwRkdSQ3hOUVVWUE8wRkJRMHdzWlVGQlQwRXNZVUZCWVVjc1VVRkJZaXhIUVVGM1FrTXNUMEZCZUVJc1EwRkJaME5RTEZkQlFXaERMRVZCUVRaRFF5eFhRVUUzUXl4RFFVRlFPMEZCUTBRN1FVRkRSanRCUVdSdFJTeEhRVUV2UWp0QlFVRkJMRU5CUVhaRE96dEJRV2xDUVN4bFFVRmxSaXc0UWtGQlppSXNJbVpwYkdVaU9pSnlaWEJzWVdObFUzVmljM1JwZEhWMGFXOXVWSEpoYm5ObWIzSnRaWEl1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmpiMjV6ZENCeVpYQnNZV05sVTNWaWMzUnBkSFYwYVc5dVZISmhibk5tYjNKdFpYSWdQU0FvY21Wd2JHRmpaVmRvWVhRc0lISmxjR3hoWTJWWGFYUm9LU0E5UGlBb2UxeHVJQ0J2YmxOMVluTjBhWFIxZEdsdmJpaHpkV0p6ZEdsMGRYUnBiMjRzSUhKbGMzVnNkRk52Um1GeUtTQjdYRzRnSUNBZ2FXWWdLSEpsY0d4aFkyVlhhR0YwSUQwOUlHNTFiR3dnZkh3Z2NtVndiR0ZqWlZkcGRHZ2dQVDBnYm5Wc2JDa2dlMXh1SUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtGeHVJQ0FnSUNBZ0lDQW5jbVZ3YkdGalpWTjFZbk4wYVhSMWRHbHZibFJ5WVc1elptOXliV1Z5SUhKbGNYVnBjbVZ6SUdGMElHeGxZWE4wSURJZ1lYSm5kVzFsYm5SekxpY3NYRzRnSUNBZ0lDQXBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZJRVJ2SUc1dmRDQjBiM1ZqYUNCcFppQnVkV3hzSUc5eUlIVnVaR1ZtYVc1bFpGeHVJQ0FnSUdsbUlDaHpkV0p6ZEdsMGRYUnBiMjRnUFQwZ2JuVnNiQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSE4xWW5OMGFYUjFkR2x2Ymp0Y2JpQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdjbVYwZFhKdUlITjFZbk4wYVhSMWRHbHZiaTUwYjFOMGNtbHVaeWdwTG5KbGNHeGhZMlVvY21Wd2JHRmpaVmRvWVhRc0lISmxjR3hoWTJWWGFYUm9LVHRjYmlBZ0lDQjlYRzRnSUgwc1hHNTlLVHRjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnY21Wd2JHRmpaVk4xWW5OMGFYUjFkR2x2YmxSeVlXNXpabTl5YldWeU8xeHVJbDE5IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vc2FmZUh0bWwnO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5ellXWmxTSFJ0YkM5cGJtUmxlQzVxY3lKZExDSnVZVzFsY3lJNld5SmtaV1poZFd4MElsMHNJbTFoY0hCcGJtZHpJam9pY1VKQlFXOUNMRms3Y1VKQlFXSkJMRThpTENKbWFXeGxJam9pYVc1a1pYZ3Vhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKbGVIQnZjblFnWkdWbVlYVnNkQ0JtY205dElDY3VMM05oWm1WSWRHMXNKenRjYmlKZGZRPT0iLCJpbXBvcnQgVGVtcGxhdGVUYWcgZnJvbSAnLi4vVGVtcGxhdGVUYWcnO1xuaW1wb3J0IHN0cmlwSW5kZW50VHJhbnNmb3JtZXIgZnJvbSAnLi4vc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcic7XG5pbXBvcnQgaW5saW5lQXJyYXlUcmFuc2Zvcm1lciBmcm9tICcuLi9pbmxpbmVBcnJheVRyYW5zZm9ybWVyJztcbmltcG9ydCB0cmltUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcbmltcG9ydCBzcGxpdFN0cmluZ1RyYW5zZm9ybWVyIGZyb20gJy4uL3NwbGl0U3RyaW5nVHJhbnNmb3JtZXInO1xuaW1wb3J0IHJlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lciBmcm9tICcuLi9yZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXInO1xuXG52YXIgc2FmZUh0bWwgPSBuZXcgVGVtcGxhdGVUYWcoc3BsaXRTdHJpbmdUcmFuc2Zvcm1lcignXFxuJyksIGlubGluZUFycmF5VHJhbnNmb3JtZXIsIHN0cmlwSW5kZW50VHJhbnNmb3JtZXIsIHRyaW1SZXN1bHRUcmFuc2Zvcm1lciwgcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyKC8mL2csICcmYW1wOycpLCByZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIoLzwvZywgJyZsdDsnKSwgcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyKC8+L2csICcmZ3Q7JyksIHJlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lcigvXCIvZywgJyZxdW90OycpLCByZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIoLycvZywgJyYjeDI3OycpLCByZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIoL2AvZywgJyYjeDYwOycpKTtcblxuZXhwb3J0IGRlZmF1bHQgc2FmZUh0bWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl6WVdabFNIUnRiQzl6WVdabFNIUnRiQzVxY3lKZExDSnVZVzFsY3lJNld5SlVaVzF3YkdGMFpWUmhaeUlzSW5OMGNtbHdTVzVrWlc1MFZISmhibk5tYjNKdFpYSWlMQ0pwYm14cGJtVkJjbkpoZVZSeVlXNXpabTl5YldWeUlpd2lkSEpwYlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5SWl3aWMzQnNhWFJUZEhKcGJtZFVjbUZ1YzJadmNtMWxjaUlzSW5KbGNHeGhZMlZUZFdKemRHbDBkWFJwYjI1VWNtRnVjMlp2Y20xbGNpSXNJbk5oWm1WSWRHMXNJbDBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hQUVVGUFFTeFhRVUZRTEUxQlFYZENMR2RDUVVGNFFqdEJRVU5CTEU5QlFVOURMSE5DUVVGUUxFMUJRVzFETERKQ1FVRnVRenRCUVVOQkxFOUJRVTlETEhOQ1FVRlFMRTFCUVcxRExESkNRVUZ1UXp0QlFVTkJMRTlCUVU5RExIRkNRVUZRTEUxQlFXdERMREJDUVVGc1F6dEJRVU5CTEU5QlFVOURMSE5DUVVGUUxFMUJRVzFETERKQ1FVRnVRenRCUVVOQkxFOUJRVTlETERoQ1FVRlFMRTFCUVRKRExHMURRVUV6UXpzN1FVRkZRU3hKUVVGTlF5eFhRVUZYTEVsQlFVbE9MRmRCUVVvc1EwRkRaa2tzZFVKQlFYVkNMRWxCUVhaQ0xFTkJSR1VzUlVGRlprWXNjMEpCUm1Vc1JVRkhaa1FzYzBKQlNHVXNSVUZKWmtVc2NVSkJTbVVzUlVGTFprVXNLMEpCUVN0Q0xFbEJRUzlDTEVWQlFYRkRMRTlCUVhKRExFTkJUR1VzUlVGTlprRXNLMEpCUVN0Q0xFbEJRUzlDTEVWQlFYRkRMRTFCUVhKRExFTkJUbVVzUlVGUFprRXNLMEpCUVN0Q0xFbEJRUzlDTEVWQlFYRkRMRTFCUVhKRExFTkJVR1VzUlVGUlprRXNLMEpCUVN0Q0xFbEJRUzlDTEVWQlFYRkRMRkZCUVhKRExFTkJVbVVzUlVGVFprRXNLMEpCUVN0Q0xFbEJRUzlDTEVWQlFYRkRMRkZCUVhKRExFTkJWR1VzUlVGVlprRXNLMEpCUVN0Q0xFbEJRUzlDTEVWQlFYRkRMRkZCUVhKRExFTkJWbVVzUTBGQmFrSTdPMEZCWVVFc1pVRkJaVU1zVVVGQlppSXNJbVpwYkdVaU9pSnpZV1psU0hSdGJDNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0JVWlcxd2JHRjBaVlJoWnlCbWNtOXRJQ2N1TGk5VVpXMXdiR0YwWlZSaFp5YzdYRzVwYlhCdmNuUWdjM1J5YVhCSmJtUmxiblJVY21GdWMyWnZjbTFsY2lCbWNtOXRJQ2N1TGk5emRISnBjRWx1WkdWdWRGUnlZVzV6Wm05eWJXVnlKenRjYm1sdGNHOXlkQ0JwYm14cGJtVkJjbkpoZVZSeVlXNXpabTl5YldWeUlHWnliMjBnSnk0dUwybHViR2x1WlVGeWNtRjVWSEpoYm5ObWIzSnRaWEluTzF4dWFXMXdiM0owSUhSeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpQm1jbTl0SUNjdUxpOTBjbWx0VW1WemRXeDBWSEpoYm5ObWIzSnRaWEluTzF4dWFXMXdiM0owSUhOd2JHbDBVM1J5YVc1blZISmhibk5tYjNKdFpYSWdabkp2YlNBbkxpNHZjM0JzYVhSVGRISnBibWRVY21GdWMyWnZjbTFsY2ljN1hHNXBiWEJ2Y25RZ2NtVndiR0ZqWlZOMVluTjBhWFIxZEdsdmJsUnlZVzV6Wm05eWJXVnlJR1p5YjIwZ0p5NHVMM0psY0d4aFkyVlRkV0p6ZEdsMGRYUnBiMjVVY21GdWMyWnZjbTFsY2ljN1hHNWNibU52Ym5OMElITmhabVZJZEcxc0lEMGdibVYzSUZSbGJYQnNZWFJsVkdGbktGeHVJQ0J6Y0d4cGRGTjBjbWx1WjFSeVlXNXpabTl5YldWeUtDZGNYRzRuS1N4Y2JpQWdhVzVzYVc1bFFYSnlZWGxVY21GdWMyWnZjbTFsY2l4Y2JpQWdjM1J5YVhCSmJtUmxiblJVY21GdWMyWnZjbTFsY2l4Y2JpQWdkSEpwYlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5TEZ4dUlDQnlaWEJzWVdObFUzVmljM1JwZEhWMGFXOXVWSEpoYm5ObWIzSnRaWElvTHlZdlp5d2dKeVpoYlhBN0p5a3NYRzRnSUhKbGNHeGhZMlZUZFdKemRHbDBkWFJwYjI1VWNtRnVjMlp2Y20xbGNpZ3ZQQzluTENBbkpteDBPeWNwTEZ4dUlDQnlaWEJzWVdObFUzVmljM1JwZEhWMGFXOXVWSEpoYm5ObWIzSnRaWElvTHo0dlp5d2dKeVpuZERzbktTeGNiaUFnY21Wd2JHRmpaVk4xWW5OMGFYUjFkR2x2YmxSeVlXNXpabTl5YldWeUtDOWNJaTluTENBbkpuRjFiM1E3Snlrc1hHNGdJSEpsY0d4aFkyVlRkV0p6ZEdsMGRYUnBiMjVVY21GdWMyWnZjbTFsY2lndkp5OW5MQ0FuSmlONE1qYzdKeWtzWEc0Z0lISmxjR3hoWTJWVGRXSnpkR2wwZFhScGIyNVVjbUZ1YzJadmNtMWxjaWd2WUM5bkxDQW5KaU40TmpBN0p5a3NYRzRwTzF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCellXWmxTSFJ0YkR0Y2JpSmRmUT09IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4uL2h0bWwnO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5emIzVnlZMlV2YVc1a1pYZ3Vhbk1pWFN3aWJtRnRaWE1pT2xzaVpHVm1ZWFZzZENKZExDSnRZWEJ3YVc1bmN5STZJbkZDUVVGdlFpeFRPM0ZDUVVGaVFTeFBJaXdpWm1sc1pTSTZJbWx1WkdWNExtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpWlhod2IzSjBJR1JsWm1GMWJIUWdabkp2YlNBbkxpNHZhSFJ0YkNjN1hHNGlYWDA9IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vc3BsaXRTdHJpbmdUcmFuc2Zvcm1lcic7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl6Y0d4cGRGTjBjbWx1WjFSeVlXNXpabTl5YldWeUwybHVaR1Y0TG1weklsMHNJbTVoYldWeklqcGJJbVJsWm1GMWJIUWlYU3dpYldGd2NHbHVaM01pT2lKeFFrRkJiMElzTUVJN2NVSkJRV0pCTEU4aUxDSm1hV3hsSWpvaWFXNWtaWGd1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmxlSEJ2Y25RZ1pHVm1ZWFZzZENCbWNtOXRJQ2N1TDNOd2JHbDBVM1J5YVc1blZISmhibk5tYjNKdFpYSW5PMXh1SWwxOSIsInZhciBzcGxpdFN0cmluZ1RyYW5zZm9ybWVyID0gZnVuY3Rpb24gc3BsaXRTdHJpbmdUcmFuc2Zvcm1lcihzcGxpdEJ5KSB7XG4gIHJldHVybiB7XG4gICAgb25TdWJzdGl0dXRpb246IGZ1bmN0aW9uIG9uU3Vic3RpdHV0aW9uKHN1YnN0aXR1dGlvbiwgcmVzdWx0U29GYXIpIHtcbiAgICAgIGlmIChzcGxpdEJ5ICE9IG51bGwgJiYgdHlwZW9mIHNwbGl0QnkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3Vic3RpdHV0aW9uID09PSAnc3RyaW5nJyAmJiBzdWJzdGl0dXRpb24uaW5jbHVkZXMoc3BsaXRCeSkpIHtcbiAgICAgICAgICBzdWJzdGl0dXRpb24gPSBzdWJzdGl0dXRpb24uc3BsaXQoc3BsaXRCeSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IG5lZWQgdG8gc3BlY2lmeSBhIHN0cmluZyBjaGFyYWN0ZXIgdG8gc3BsaXQgYnkuJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3Vic3RpdHV0aW9uO1xuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNwbGl0U3RyaW5nVHJhbnNmb3JtZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl6Y0d4cGRGTjBjbWx1WjFSeVlXNXpabTl5YldWeUwzTndiR2wwVTNSeWFXNW5WSEpoYm5ObWIzSnRaWEl1YW5NaVhTd2libUZ0WlhNaU9sc2ljM0JzYVhSVGRISnBibWRVY21GdWMyWnZjbTFsY2lJc0ltOXVVM1ZpYzNScGRIVjBhVzl1SWl3aWMzVmljM1JwZEhWMGFXOXVJaXdpY21WemRXeDBVMjlHWVhJaUxDSnpjR3hwZEVKNUlpd2lhVzVqYkhWa1pYTWlMQ0p6Y0d4cGRDSXNJa1Z5Y205eUlsMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeEpRVUZOUVN4NVFrRkJlVUlzVTBGQmVrSkJMSE5DUVVGNVFqdEJRVUZCTEZOQlFWazdRVUZEZWtORExHdENRVVI1UXl3d1FrRkRNVUpETEZsQlJEQkNMRVZCUTFwRExGZEJSRmtzUlVGRFF6dEJRVU40UXl4VlFVRkpReXhYUVVGWExFbEJRVmdzU1VGQmJVSXNUMEZCVDBFc1QwRkJVQ3hMUVVGdFFpeFJRVUV4UXl4RlFVRnZSRHRCUVVOc1JDeFpRVUZKTEU5QlFVOUdMRmxCUVZBc1MwRkJkMElzVVVGQmVFSXNTVUZCYjBOQkxHRkJRV0ZITEZGQlFXSXNRMEZCYzBKRUxFOUJRWFJDTEVOQlFYaERMRVZCUVhkRk8wRkJRM1JGUml4NVFrRkJaVUVzWVVGQllVa3NTMEZCWWl4RFFVRnRRa1lzVDBGQmJrSXNRMEZCWmp0QlFVTkVPMEZCUTBZc1QwRktSQ3hOUVVsUE8wRkJRMHdzWTBGQlRTeEpRVUZKUnl4TFFVRktMRU5CUVZVc2NVUkJRVllzUTBGQlRqdEJRVU5FTzBGQlEwUXNZVUZCVDB3c1dVRkJVRHRCUVVORU8wRkJWbmRETEVkQlFWbzdRVUZCUVN4RFFVRXZRanM3UVVGaFFTeGxRVUZsUml4elFrRkJaaUlzSW1acGJHVWlPaUp6Y0d4cGRGTjBjbWx1WjFSeVlXNXpabTl5YldWeUxtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpWTI5dWMzUWdjM0JzYVhSVGRISnBibWRVY21GdWMyWnZjbTFsY2lBOUlITndiR2wwUW5rZ1BUNGdLSHRjYmlBZ2IyNVRkV0p6ZEdsMGRYUnBiMjRvYzNWaWMzUnBkSFYwYVc5dUxDQnlaWE4xYkhSVGIwWmhjaWtnZTF4dUlDQWdJR2xtSUNoemNHeHBkRUo1SUNFOUlHNTFiR3dnSmlZZ2RIbHdaVzltSUhOd2JHbDBRbmtnUFQwOUlDZHpkSEpwYm1jbktTQjdYRzRnSUNBZ0lDQnBaaUFvZEhsd1pXOW1JSE4xWW5OMGFYUjFkR2x2YmlBOVBUMGdKM04wY21sdVp5Y2dKaVlnYzNWaWMzUnBkSFYwYVc5dUxtbHVZMngxWkdWektITndiR2wwUW5rcEtTQjdYRzRnSUNBZ0lDQWdJSE4xWW5OMGFYUjFkR2x2YmlBOUlITjFZbk4wYVhSMWRHbHZiaTV6Y0d4cGRDaHpjR3hwZEVKNUtUdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLQ2RaYjNVZ2JtVmxaQ0IwYnlCemNHVmphV1o1SUdFZ2MzUnlhVzVuSUdOb1lYSmhZM1JsY2lCMGJ5QnpjR3hwZENCaWVTNG5LVHRjYmlBZ0lDQjlYRzRnSUNBZ2NtVjBkWEp1SUhOMVluTjBhWFIxZEdsdmJqdGNiaUFnZlN4Y2JuMHBPMXh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0J6Y0d4cGRGTjBjbWx1WjFSeVlXNXpabTl5YldWeU8xeHVJbDE5IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vc3RyaXBJbmRlbnQnO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5emRISnBjRWx1WkdWdWRDOXBibVJsZUM1cWN5SmRMQ0p1WVcxbGN5STZXeUprWldaaGRXeDBJbDBzSW0xaGNIQnBibWR6SWpvaWNVSkJRVzlDTEdVN2NVSkJRV0pCTEU4aUxDSm1hV3hsSWpvaWFXNWtaWGd1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmxlSEJ2Y25RZ1pHVm1ZWFZzZENCbWNtOXRJQ2N1TDNOMGNtbHdTVzVrWlc1MEp6dGNiaUpkZlE9PSIsImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciBmcm9tICcuLi9zdHJpcEluZGVudFRyYW5zZm9ybWVyJztcbmltcG9ydCB0cmltUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcblxudmFyIHN0cmlwSW5kZW50ID0gbmV3IFRlbXBsYXRlVGFnKHN0cmlwSW5kZW50VHJhbnNmb3JtZXIsIHRyaW1SZXN1bHRUcmFuc2Zvcm1lcik7XG5cbmV4cG9ydCBkZWZhdWx0IHN0cmlwSW5kZW50O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5emRISnBjRWx1WkdWdWRDOXpkSEpwY0VsdVpHVnVkQzVxY3lKZExDSnVZVzFsY3lJNld5SlVaVzF3YkdGMFpWUmhaeUlzSW5OMGNtbHdTVzVrWlc1MFZISmhibk5tYjNKdFpYSWlMQ0owY21sdFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJaUxDSnpkSEpwY0VsdVpHVnVkQ0pkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzVDBGQlQwRXNWMEZCVUN4TlFVRjNRaXhuUWtGQmVFSTdRVUZEUVN4UFFVRlBReXh6UWtGQlVDeE5RVUZ0UXl3eVFrRkJia003UVVGRFFTeFBRVUZQUXl4eFFrRkJVQ3hOUVVGclF5d3dRa0ZCYkVNN08wRkJSVUVzU1VGQlRVTXNZMEZCWXl4SlFVRkpTQ3hYUVVGS0xFTkJRMnhDUXl4elFrRkVhMElzUlVGRmJFSkRMSEZDUVVaclFpeERRVUZ3UWpzN1FVRkxRU3hsUVVGbFF5eFhRVUZtSWl3aVptbHNaU0k2SW5OMGNtbHdTVzVrWlc1MExtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJRlJsYlhCc1lYUmxWR0ZuSUdaeWIyMGdKeTR1TDFSbGJYQnNZWFJsVkdGbkp6dGNibWx0Y0c5eWRDQnpkSEpwY0VsdVpHVnVkRlJ5WVc1elptOXliV1Z5SUdaeWIyMGdKeTR1TDNOMGNtbHdTVzVrWlc1MFZISmhibk5tYjNKdFpYSW5PMXh1YVcxd2IzSjBJSFJ5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lCbWNtOXRJQ2N1TGk5MGNtbHRVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSW5PMXh1WEc1amIyNXpkQ0J6ZEhKcGNFbHVaR1Z1ZENBOUlHNWxkeUJVWlcxd2JHRjBaVlJoWnloY2JpQWdjM1J5YVhCSmJtUmxiblJVY21GdWMyWnZjbTFsY2l4Y2JpQWdkSEpwYlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5TEZ4dUtUdGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdjM1J5YVhCSmJtUmxiblE3WEc0aVhYMD0iLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi9zdHJpcEluZGVudFRyYW5zZm9ybWVyJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXpkSEpwY0VsdVpHVnVkRlJ5WVc1elptOXliV1Z5TDJsdVpHVjRMbXB6SWwwc0ltNWhiV1Z6SWpwYkltUmxabUYxYkhRaVhTd2liV0Z3Y0dsdVozTWlPaUp4UWtGQmIwSXNNRUk3Y1VKQlFXSkJMRThpTENKbWFXeGxJam9pYVc1a1pYZ3Vhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKbGVIQnZjblFnWkdWbVlYVnNkQ0JtY205dElDY3VMM04wY21sd1NXNWtaVzUwVkhKaGJuTm1iM0p0WlhJbk8xeHVJbDE5IiwiZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfSBlbHNlIHsgcmV0dXJuIEFycmF5LmZyb20oYXJyKTsgfSB9XG5cbi8qKlxuICogc3RyaXBzIGluZGVudGF0aW9uIGZyb20gYSB0ZW1wbGF0ZSBsaXRlcmFsXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHR5cGUgPSAnaW5pdGlhbCcgLSB3aGV0aGVyIHRvIHJlbW92ZSBhbGwgaW5kZW50YXRpb24gb3IganVzdCBsZWFkaW5nIGluZGVudGF0aW9uLiBjYW4gYmUgJ2FsbCcgb3IgJ2luaXRpYWwnXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgLSBhIFRlbXBsYXRlVGFnIHRyYW5zZm9ybWVyXG4gKi9cbnZhciBzdHJpcEluZGVudFRyYW5zZm9ybWVyID0gZnVuY3Rpb24gc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcigpIHtcbiAgdmFyIHR5cGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICdpbml0aWFsJztcbiAgcmV0dXJuIHtcbiAgICBvbkVuZFJlc3VsdDogZnVuY3Rpb24gb25FbmRSZXN1bHQoZW5kUmVzdWx0KSB7XG4gICAgICBpZiAodHlwZSA9PT0gJ2luaXRpYWwnKSB7XG4gICAgICAgIC8vIHJlbW92ZSB0aGUgc2hvcnRlc3QgbGVhZGluZyBpbmRlbnRhdGlvbiBmcm9tIGVhY2ggbGluZVxuICAgICAgICB2YXIgbWF0Y2ggPSBlbmRSZXN1bHQubWF0Y2goL15bXlxcU1xcbl0qKD89XFxTKS9nbSk7XG4gICAgICAgIHZhciBpbmRlbnQgPSBtYXRjaCAmJiBNYXRoLm1pbi5hcHBseShNYXRoLCBfdG9Db25zdW1hYmxlQXJyYXkobWF0Y2gubWFwKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIHJldHVybiBlbC5sZW5ndGg7XG4gICAgICAgIH0pKSk7XG4gICAgICAgIGlmIChpbmRlbnQpIHtcbiAgICAgICAgICB2YXIgcmVnZXhwID0gbmV3IFJlZ0V4cCgnXi57JyArIGluZGVudCArICd9JywgJ2dtJyk7XG4gICAgICAgICAgcmV0dXJuIGVuZFJlc3VsdC5yZXBsYWNlKHJlZ2V4cCwgJycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbmRSZXN1bHQ7XG4gICAgICB9XG4gICAgICBpZiAodHlwZSA9PT0gJ2FsbCcpIHtcbiAgICAgICAgLy8gcmVtb3ZlIGFsbCBpbmRlbnRhdGlvbiBmcm9tIGVhY2ggbGluZVxuICAgICAgICByZXR1cm4gZW5kUmVzdWx0LnJlcGxhY2UoL15bXlxcU1xcbl0rL2dtLCAnJyk7XG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gdHlwZTogJyArIHR5cGUpO1xuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHN0cmlwSW5kZW50VHJhbnNmb3JtZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl6ZEhKcGNFbHVaR1Z1ZEZSeVlXNXpabTl5YldWeUwzTjBjbWx3U1c1a1pXNTBWSEpoYm5ObWIzSnRaWEl1YW5NaVhTd2libUZ0WlhNaU9sc2ljM1J5YVhCSmJtUmxiblJVY21GdWMyWnZjbTFsY2lJc0luUjVjR1VpTENKdmJrVnVaRkpsYzNWc2RDSXNJbVZ1WkZKbGMzVnNkQ0lzSW0xaGRHTm9JaXdpYVc1a1pXNTBJaXdpVFdGMGFDSXNJbTFwYmlJc0ltMWhjQ0lzSW1Wc0lpd2liR1Z1WjNSb0lpd2ljbVZuWlhod0lpd2lVbVZuUlhod0lpd2ljbVZ3YkdGalpTSXNJa1Z5Y205eUlsMHNJbTFoY0hCcGJtZHpJam9pT3p0QlFVRkJPenM3T3p0QlFVdEJMRWxCUVUxQkxIbENRVUY1UWl4VFFVRjZRa0VzYzBKQlFYbENPMEZCUVVFc1RVRkJRME1zU1VGQlJDeDFSVUZCVVN4VFFVRlNPMEZCUVVFc1UwRkJkVUk3UVVGRGNFUkRMR1ZCUkc5RUxIVkNRVU40UTBNc1UwRkVkME1zUlVGRE4wSTdRVUZEY2tJc1ZVRkJTVVlzVTBGQlV5eFRRVUZpTEVWQlFYZENPMEZCUTNSQ08wRkJRMEVzV1VGQlRVY3NVVUZCVVVRc1ZVRkJWVU1zUzBGQlZpeERRVUZuUWl4dFFrRkJhRUlzUTBGQlpEdEJRVU5CTEZsQlFVMURMRk5CUVZORUxGTkJRVk5GTEV0QlFVdERMRWRCUVV3c1owTkJRVmxJTEUxQlFVMUpMRWRCUVU0c1EwRkJWVHRCUVVGQkxHbENRVUZOUXl4SFFVRkhReXhOUVVGVU8wRkJRVUVzVTBGQlZpeERRVUZhTEVWQlFYaENPMEZCUTBFc1dVRkJTVXdzVFVGQlNpeEZRVUZaTzBGQlExWXNZMEZCVFUwc1UwRkJVeXhKUVVGSlF5eE5RVUZLTEZOQlFXbENVQ3hOUVVGcVFpeFJRVUUwUWl4SlFVRTFRaXhEUVVGbU8wRkJRMEVzYVVKQlFVOUdMRlZCUVZWVkxFOUJRVllzUTBGQmEwSkdMRTFCUVd4Q0xFVkJRVEJDTEVWQlFURkNMRU5CUVZBN1FVRkRSRHRCUVVORUxHVkJRVTlTTEZOQlFWQTdRVUZEUkR0QlFVTkVMRlZCUVVsR0xGTkJRVk1zUzBGQllpeEZRVUZ2UWp0QlFVTnNRanRCUVVOQkxHVkJRVTlGTEZWQlFWVlZMRTlCUVZZc1EwRkJhMElzWVVGQmJFSXNSVUZCYVVNc1JVRkJha01zUTBGQlVEdEJRVU5FTzBGQlEwUXNXVUZCVFN4SlFVRkpReXhMUVVGS0xHOUNRVUV5UW1Jc1NVRkJNMElzUTBGQlRqdEJRVU5FTzBGQmFrSnRSQ3hIUVVGMlFqdEJRVUZCTEVOQlFTOUNPenRCUVc5Q1FTeGxRVUZsUkN4elFrRkJaaUlzSW1acGJHVWlPaUp6ZEhKcGNFbHVaR1Z1ZEZSeVlXNXpabTl5YldWeUxtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlvcVhHNGdLaUJ6ZEhKcGNITWdhVzVrWlc1MFlYUnBiMjRnWm5KdmJTQmhJSFJsYlhCc1lYUmxJR3hwZEdWeVlXeGNiaUFxSUVCd1lYSmhiU0FnZTFOMGNtbHVaMzBnZEhsd1pTQTlJQ2RwYm1sMGFXRnNKeUF0SUhkb1pYUm9aWElnZEc4Z2NtVnRiM1psSUdGc2JDQnBibVJsYm5SaGRHbHZiaUJ2Y2lCcWRYTjBJR3hsWVdScGJtY2dhVzVrWlc1MFlYUnBiMjR1SUdOaGJpQmlaU0FuWVd4c0p5QnZjaUFuYVc1cGRHbGhiQ2RjYmlBcUlFQnlaWFIxY200Z2UwOWlhbVZqZEgwZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBdElHRWdWR1Z0Y0d4aGRHVlVZV2NnZEhKaGJuTm1iM0p0WlhKY2JpQXFMMXh1WTI5dWMzUWdjM1J5YVhCSmJtUmxiblJVY21GdWMyWnZjbTFsY2lBOUlDaDBlWEJsSUQwZ0oybHVhWFJwWVd3bktTQTlQaUFvZTF4dUlDQnZia1Z1WkZKbGMzVnNkQ2hsYm1SU1pYTjFiSFFwSUh0Y2JpQWdJQ0JwWmlBb2RIbHdaU0E5UFQwZ0oybHVhWFJwWVd3bktTQjdYRzRnSUNBZ0lDQXZMeUJ5WlcxdmRtVWdkR2hsSUhOb2IzSjBaWE4wSUd4bFlXUnBibWNnYVc1a1pXNTBZWFJwYjI0Z1puSnZiU0JsWVdOb0lHeHBibVZjYmlBZ0lDQWdJR052Ym5OMElHMWhkR05vSUQwZ1pXNWtVbVZ6ZFd4MExtMWhkR05vS0M5ZVcxNWNYRk5jWEc1ZEtpZy9QVnhjVXlrdloyMHBPMXh1SUNBZ0lDQWdZMjl1YzNRZ2FXNWtaVzUwSUQwZ2JXRjBZMmdnSmlZZ1RXRjBhQzV0YVc0b0xpNHViV0YwWTJndWJXRndLR1ZzSUQwK0lHVnNMbXhsYm1kMGFDa3BPMXh1SUNBZ0lDQWdhV1lnS0dsdVpHVnVkQ2tnZTF4dUlDQWdJQ0FnSUNCamIyNXpkQ0J5WldkbGVIQWdQU0J1WlhjZ1VtVm5SWGh3S0dCZUxuc2tlMmx1WkdWdWRIMTlZQ3dnSjJkdEp5azdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQmxibVJTWlhOMWJIUXVjbVZ3YkdGalpTaHlaV2RsZUhBc0lDY25LVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQWdJSEpsZEhWeWJpQmxibVJTWlhOMWJIUTdYRzRnSUNBZ2ZWeHVJQ0FnSUdsbUlDaDBlWEJsSUQwOVBTQW5ZV3hzSnlrZ2UxeHVJQ0FnSUNBZ0x5OGdjbVZ0YjNabElHRnNiQ0JwYm1SbGJuUmhkR2x2YmlCbWNtOXRJR1ZoWTJnZ2JHbHVaVnh1SUNBZ0lDQWdjbVYwZFhKdUlHVnVaRkpsYzNWc2RDNXlaWEJzWVdObEtDOWVXMTVjWEZOY1hHNWRLeTluYlN3Z0p5Y3BPMXh1SUNBZ0lIMWNiaUFnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvWUZWdWEyNXZkMjRnZEhsd1pUb2dKSHQwZVhCbGZXQXBPMXh1SUNCOUxGeHVmU2s3WEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUhOMGNtbHdTVzVrWlc1MFZISmhibk5tYjNKdFpYSTdYRzRpWFgwPSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL3N0cmlwSW5kZW50cyc7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl6ZEhKcGNFbHVaR1Z1ZEhNdmFXNWtaWGd1YW5NaVhTd2libUZ0WlhNaU9sc2laR1ZtWVhWc2RDSmRMQ0p0WVhCd2FXNW5jeUk2SW5GQ1FVRnZRaXhuUWp0eFFrRkJZa0VzVHlJc0ltWnBiR1VpT2lKcGJtUmxlQzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltVjRjRzl5ZENCa1pXWmhkV3gwSUdaeWIyMGdKeTR2YzNSeWFYQkpibVJsYm5Sekp6dGNiaUpkZlE9PSIsImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciBmcm9tICcuLi9zdHJpcEluZGVudFRyYW5zZm9ybWVyJztcbmltcG9ydCB0cmltUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcblxudmFyIHN0cmlwSW5kZW50cyA9IG5ldyBUZW1wbGF0ZVRhZyhzdHJpcEluZGVudFRyYW5zZm9ybWVyKCdhbGwnKSwgdHJpbVJlc3VsdFRyYW5zZm9ybWVyKTtcblxuZXhwb3J0IGRlZmF1bHQgc3RyaXBJbmRlbnRzO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5emRISnBjRWx1WkdWdWRITXZjM1J5YVhCSmJtUmxiblJ6TG1weklsMHNJbTVoYldWeklqcGJJbFJsYlhCc1lYUmxWR0ZuSWl3aWMzUnlhWEJKYm1SbGJuUlVjbUZ1YzJadmNtMWxjaUlzSW5SeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpSXNJbk4wY21sd1NXNWtaVzUwY3lKZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1QwRkJUMEVzVjBGQlVDeE5RVUYzUWl4blFrRkJlRUk3UVVGRFFTeFBRVUZQUXl4elFrRkJVQ3hOUVVGdFF5d3lRa0ZCYmtNN1FVRkRRU3hQUVVGUFF5eHhRa0ZCVUN4TlFVRnJReXd3UWtGQmJFTTdPMEZCUlVFc1NVRkJUVU1zWlVGQlpTeEpRVUZKU0N4WFFVRktMRU5CUTI1Q1F5eDFRa0ZCZFVJc1MwRkJka0lzUTBGRWJVSXNSVUZGYmtKRExIRkNRVVp0UWl4RFFVRnlRanM3UVVGTFFTeGxRVUZsUXl4WlFVRm1JaXdpWm1sc1pTSTZJbk4wY21sd1NXNWtaVzUwY3k1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbWx0Y0c5eWRDQlVaVzF3YkdGMFpWUmhaeUJtY205dElDY3VMaTlVWlcxd2JHRjBaVlJoWnljN1hHNXBiWEJ2Y25RZ2MzUnlhWEJKYm1SbGJuUlVjbUZ1YzJadmNtMWxjaUJtY205dElDY3VMaTl6ZEhKcGNFbHVaR1Z1ZEZSeVlXNXpabTl5YldWeUp6dGNibWx0Y0c5eWRDQjBjbWx0VW1WemRXeDBWSEpoYm5ObWIzSnRaWElnWm5KdmJTQW5MaTR2ZEhKcGJWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUp6dGNibHh1WTI5dWMzUWdjM1J5YVhCSmJtUmxiblJ6SUQwZ2JtVjNJRlJsYlhCc1lYUmxWR0ZuS0Z4dUlDQnpkSEpwY0VsdVpHVnVkRlJ5WVc1elptOXliV1Z5S0NkaGJHd25LU3hjYmlBZ2RISnBiVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlMRnh1S1R0Y2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ2MzUnlhWEJKYm1SbGJuUnpPMXh1SWwxOSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTkwY21sdFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJdmFXNWtaWGd1YW5NaVhTd2libUZ0WlhNaU9sc2laR1ZtWVhWc2RDSmRMQ0p0WVhCd2FXNW5jeUk2SW5GQ1FVRnZRaXg1UWp0eFFrRkJZa0VzVHlJc0ltWnBiR1VpT2lKcGJtUmxlQzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltVjRjRzl5ZENCa1pXWmhkV3gwSUdaeWIyMGdKeTR2ZEhKcGJWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUp6dGNiaUpkZlE9PSIsIi8qKlxuICogVGVtcGxhdGVUYWcgdHJhbnNmb3JtZXIgdGhhdCB0cmltcyB3aGl0ZXNwYWNlIG9uIHRoZSBlbmQgcmVzdWx0IG9mIGEgdGFnZ2VkIHRlbXBsYXRlXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHNpZGUgPSAnJyAtIFRoZSBzaWRlIG9mIHRoZSBzdHJpbmcgdG8gdHJpbS4gQ2FuIGJlICdzdGFydCcgb3IgJ2VuZCcgKGFsdGVybmF0aXZlbHkgJ2xlZnQnIG9yICdyaWdodCcpXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAtIGEgVGVtcGxhdGVUYWcgdHJhbnNmb3JtZXJcbiAqL1xudmFyIHRyaW1SZXN1bHRUcmFuc2Zvcm1lciA9IGZ1bmN0aW9uIHRyaW1SZXN1bHRUcmFuc2Zvcm1lcigpIHtcbiAgdmFyIHNpZGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICcnO1xuICByZXR1cm4ge1xuICAgIG9uRW5kUmVzdWx0OiBmdW5jdGlvbiBvbkVuZFJlc3VsdChlbmRSZXN1bHQpIHtcbiAgICAgIGlmIChzaWRlID09PSAnJykge1xuICAgICAgICByZXR1cm4gZW5kUmVzdWx0LnRyaW0oKTtcbiAgICAgIH1cblxuICAgICAgc2lkZSA9IHNpZGUudG9Mb3dlckNhc2UoKTtcblxuICAgICAgaWYgKHNpZGUgPT09ICdzdGFydCcgfHwgc2lkZSA9PT0gJ2xlZnQnKSB7XG4gICAgICAgIHJldHVybiBlbmRSZXN1bHQucmVwbGFjZSgvXlxccyovLCAnJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzaWRlID09PSAnZW5kJyB8fCBzaWRlID09PSAncmlnaHQnKSB7XG4gICAgICAgIHJldHVybiBlbmRSZXN1bHQucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG4gICAgICB9XG5cbiAgICAgIHRocm93IG5ldyBFcnJvcignU2lkZSBub3Qgc3VwcG9ydGVkOiAnICsgc2lkZSk7XG4gICAgfVxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5MGNtbHRVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSXZkSEpwYlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5TG1weklsMHNJbTVoYldWeklqcGJJblJ5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lJc0luTnBaR1VpTENKdmJrVnVaRkpsYzNWc2RDSXNJbVZ1WkZKbGMzVnNkQ0lzSW5SeWFXMGlMQ0owYjB4dmQyVnlRMkZ6WlNJc0luSmxjR3hoWTJVaUxDSkZjbkp2Y2lKZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFN096czdPMEZCUzBFc1NVRkJUVUVzZDBKQlFYZENMRk5CUVhoQ1FTeHhRa0ZCZDBJN1FVRkJRU3hOUVVGRFF5eEpRVUZFTEhWRlFVRlJMRVZCUVZJN1FVRkJRU3hUUVVGblFqdEJRVU0xUTBNc1pVRkVORU1zZFVKQlEyaERReXhUUVVSblF5eEZRVU55UWp0QlFVTnlRaXhWUVVGSlJpeFRRVUZUTEVWQlFXSXNSVUZCYVVJN1FVRkRaaXhsUVVGUFJTeFZRVUZWUXl4SlFVRldMRVZCUVZBN1FVRkRSRHM3UVVGRlJFZ3NZVUZCVDBFc1MwRkJTMGtzVjBGQlRDeEZRVUZRT3p0QlFVVkJMRlZCUVVsS0xGTkJRVk1zVDBGQlZDeEpRVUZ2UWtFc1UwRkJVeXhOUVVGcVF5eEZRVUY1UXp0QlFVTjJReXhsUVVGUFJTeFZRVUZWUnl4UFFVRldMRU5CUVd0Q0xFMUJRV3hDTEVWQlFUQkNMRVZCUVRGQ0xFTkJRVkE3UVVGRFJEczdRVUZGUkN4VlFVRkpUQ3hUUVVGVExFdEJRVlFzU1VGQmEwSkJMRk5CUVZNc1QwRkJMMElzUlVGQmQwTTdRVUZEZEVNc1pVRkJUMFVzVlVGQlZVY3NUMEZCVml4RFFVRnJRaXhOUVVGc1FpeEZRVUV3UWl4RlFVRXhRaXhEUVVGUU8wRkJRMFE3TzBGQlJVUXNXVUZCVFN4SlFVRkpReXhMUVVGS0xEQkNRVUZwUTA0c1NVRkJha01zUTBGQlRqdEJRVU5FTzBGQmFrSXlReXhIUVVGb1FqdEJRVUZCTEVOQlFUbENPenRCUVc5Q1FTeGxRVUZsUkN4eFFrRkJaaUlzSW1acGJHVWlPaUowY21sdFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRlJsYlhCc1lYUmxWR0ZuSUhSeVlXNXpabTl5YldWeUlIUm9ZWFFnZEhKcGJYTWdkMmhwZEdWemNHRmpaU0J2YmlCMGFHVWdaVzVrSUhKbGMzVnNkQ0J2WmlCaElIUmhaMmRsWkNCMFpXMXdiR0YwWlZ4dUlDb2dRSEJoY21GdElDQjdVM1J5YVc1bmZTQnphV1JsSUQwZ0p5Y2dMU0JVYUdVZ2MybGtaU0J2WmlCMGFHVWdjM1J5YVc1bklIUnZJSFJ5YVcwdUlFTmhiaUJpWlNBbmMzUmhjblFuSUc5eUlDZGxibVFuSUNoaGJIUmxjbTVoZEdsMlpXeDVJQ2RzWldaMEp5QnZjaUFuY21sbmFIUW5LVnh1SUNvZ1FISmxkSFZ5YmlCN1QySnFaV04wZlNBZ0lDQWdJQ0FnSUNBZ0xTQmhJRlJsYlhCc1lYUmxWR0ZuSUhSeVlXNXpabTl5YldWeVhHNGdLaTljYm1OdmJuTjBJSFJ5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lBOUlDaHphV1JsSUQwZ0p5Y3BJRDArSUNoN1hHNGdJRzl1Ulc1a1VtVnpkV3gwS0dWdVpGSmxjM1ZzZENrZ2UxeHVJQ0FnSUdsbUlDaHphV1JsSUQwOVBTQW5KeWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR1Z1WkZKbGMzVnNkQzUwY21sdEtDazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MybGtaU0E5SUhOcFpHVXVkRzlNYjNkbGNrTmhjMlVvS1R0Y2JseHVJQ0FnSUdsbUlDaHphV1JsSUQwOVBTQW5jM1JoY25RbklIeDhJSE5wWkdVZ1BUMDlJQ2RzWldaMEp5a2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHVnVaRkpsYzNWc2RDNXlaWEJzWVdObEtDOWVYRnh6S2k4c0lDY25LVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnBaaUFvYzJsa1pTQTlQVDBnSjJWdVpDY2dmSHdnYzJsa1pTQTlQVDBnSjNKcFoyaDBKeWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR1Z1WkZKbGMzVnNkQzV5WlhCc1lXTmxLQzljWEhNcUpDOHNJQ2NuS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9ZRk5wWkdVZ2JtOTBJSE4xY0hCdmNuUmxaRG9nSkh0emFXUmxmV0FwTzF4dUlDQjlMRnh1ZlNrN1hHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElIUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjanRjYmlKZGZRPT0iLCJjb25zdCBUYWJsZSA9ICh0YWJsZVNpemUsIHBhcmVudFF1ZXJ5KSA9PiB7XG4gIGNvbnN0IGFyZ3MgPSB7IHRhYmxlU2l6ZSwgcGFyZW50UXVlcnkgfTtcbiAgY29uc3Qgc2VsZiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7cGFyZW50UXVlcnl9IC5iYXR0bGVmaWVsZC10YWJsZWApO1xuICBsZXQgeHJheSA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGdldE5ld1RhYmxlRWxlbWVudCgpIHtcbiAgICBmdW5jdGlvbiBnZXRDb2xNYXJrZXIoZGF0YXNldFlQb3MpIHtcbiAgICAgIGNvbnN0IGFscGhhYmV0ID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWlwiO1xuICAgICAgY29uc3QgYXJyID0gYWxwaGFiZXQuc3BsaXQoXCJcIik7XG4gICAgICByZXR1cm4gYXJyW2RhdGFzZXRZUG9zXTtcbiAgICB9XG5cbiAgICBjb25zdCB0YWJsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRhYmxlXCIpO1xuICAgIHRhYmxlRWwuY2xhc3NMaXN0ID0gXCJiYXR0bGVmaWVsZC10YWJsZVwiO1xuICAgIGNvbnN0IHRhYmxlQm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiKTtcbiAgICB0YWJsZUVsLmFwcGVuZENoaWxkKHRhYmxlQm9keSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhYmxlU2l6ZTsgaSArPSAxKSB7XG4gICAgICBjb25zdCB0YWJsZVJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0clwiKTtcbiAgICAgIHRhYmxlUm93LmNsYXNzTGlzdCA9IFwiYmF0dGxlZmllbGQtcm93XCI7XG4gICAgICB0YWJsZUJvZHkuYXBwZW5kQ2hpbGQodGFibGVSb3cpO1xuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRhYmxlU2l6ZTsgaiArPSAxKSB7XG4gICAgICAgIGNvbnN0IHRhYmxlRGF0YUNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XG4gICAgICAgIHRhYmxlRGF0YUNlbGwuY2xhc3NMaXN0ID0gXCJiYXR0bGVmaWVsZC1jZWxsXCI7XG4gICAgICAgIHRhYmxlUm93LmFwcGVuZENoaWxkKHRhYmxlRGF0YUNlbGwpO1xuXG4gICAgICAgIGNvbnN0IGJhdHRsZWZpZWxkQ2VsbENvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBiYXR0bGVmaWVsZENlbGxDb250ZW50LmNsYXNzTGlzdCA9IFwiYmF0dGxlZmllbGQtY2VsbC1jb250ZW50XCI7XG4gICAgICAgIGJhdHRsZWZpZWxkQ2VsbENvbnRlbnQuZGF0YXNldC54ID0gajtcbiAgICAgICAgYmF0dGxlZmllbGRDZWxsQ29udGVudC5kYXRhc2V0LnkgPSBpO1xuICAgICAgICB0YWJsZURhdGFDZWxsLmFwcGVuZENoaWxkKGJhdHRsZWZpZWxkQ2VsbENvbnRlbnQpO1xuXG4gICAgICAgIGlmIChiYXR0bGVmaWVsZENlbGxDb250ZW50LmRhdGFzZXQueCA9PT0gMCkge1xuICAgICAgICAgIGNvbnN0IG1hcmtlclJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgbWFya2VyUm93LmNsYXNzTGlzdCA9IFwibWFya2VyIG1hcmtlci1yb3dcIjtcbiAgICAgICAgICBtYXJrZXJSb3cudGV4dENvbnRlbnQgPSBiYXR0bGVmaWVsZENlbGxDb250ZW50LmRhdGFzZXQueCArIDE7XG4gICAgICAgICAgYmF0dGxlZmllbGRDZWxsQ29udGVudC5hcHBlbmRDaGlsZChtYXJrZXJSb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJhdHRsZWZpZWxkQ2VsbENvbnRlbnQuZGF0YXNldC55ID09PSAwKSB7XG4gICAgICAgICAgY29uc3QgbWFya2VyQ29sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICBtYXJrZXJDb2wuY2xhc3NMaXN0ID0gXCJtYXJrZXIgbWFya2VyLWNvbFwiO1xuICAgICAgICAgIG1hcmtlckNvbC50ZXh0Q29udGVudCA9IGdldENvbE1hcmtlcihcbiAgICAgICAgICAgIGJhdHRsZWZpZWxkQ2VsbENvbnRlbnQuZGF0YXNldC55XG4gICAgICAgICAgKTtcbiAgICAgICAgICBiYXR0bGVmaWVsZENlbGxDb250ZW50LmFwcGVuZENoaWxkKG1hcmtlckNvbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFibGVFbDtcbiAgfVxuXG4gIGNvbnN0IHRhYmxlRWwgPSBnZXROZXdUYWJsZUVsZW1lbnQoKTtcblxuICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7cGFyZW50UXVlcnl9LWxhYmVsYCk7XG4gIGlmIChwYXJlbnRRdWVyeSA9PT0gXCIuYmF0dGxlZmllbGQtc2VsZlwiKSB7XG4gICAgbGFiZWwudGV4dENvbnRlbnQgPSBcIllvdVwiO1xuICB9IGVsc2Uge1xuICAgIGxhYmVsLnRleHRDb250ZW50ID0gXCJSaXZhbFwiO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9nZ2xlRGlzYWJsZWQoKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihwYXJlbnRRdWVyeSkuY2xhc3NMaXN0LnRvZ2dsZShcImRpc2FibGVkXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9nZ2xlQXR0YWNrQ3Vyc29yKCkge1xuICAgIGRvY3VtZW50XG4gICAgICAucXVlcnlTZWxlY3RvckFsbChgJHtwYXJlbnRRdWVyeX0gLmJhdHRsZWZpZWxkLWNlbGwtY29udGVudGApXG4gICAgICAuZm9yRWFjaCgodmFsdWUpID0+XG4gICAgICAgIHZhbHVlLmNsYXNzTGlzdC5jb250YWlucyhcIm1pc3NcIikgfHwgdmFsdWUuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpXG4gICAgICAgICAgPyBudWxsXG4gICAgICAgICAgOiB2YWx1ZS5jbGFzc0xpc3QudG9nZ2xlKFwiYXR0YWNrLWN1cnNvclwiKVxuICAgICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlclN1bmsoY2VsbCkge1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcInN1bmtcIik7XG4gIH1cblxuICBmdW5jdGlvbiB4cmF5RW5hYmxlZCgpIHtcbiAgICByZXR1cm4geHJheTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvZ2dsZVhyYXkoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xuICAgIHhyYXkgPyAoeHJheSA9IGZhbHNlKSA6ICh4cmF5ID0gdHJ1ZSk7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJNaXNzKGNlbGwpIHtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xuICAgIGNvbnN0IG1pc3NJY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgbWlzc0ljb24uY2xhc3NMaXN0ID0gXCJtaXNzLWljb25cIjtcbiAgICBjZWxsLmFwcGVuZENoaWxkKG1pc3NJY29uKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlckhpdChjZWxsKSB7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xuICAgIGNvbnN0IGhpdEljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICBoaXRJY29uLmNsYXNzTGlzdCA9IFwiaGl0LWljb25cIjtcbiAgICBjZWxsLmFwcGVuZENoaWxkKGhpdEljb24pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyU2hpcChjZWxsKSB7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZShwbGF5ZXIpIHtcbiAgICBjb25zdCB7IGdhbWVCcmQgfSA9IHBsYXllcjtcbiAgICBjb25zdCBtYXAgPSBnYW1lQnJkLmdldE1hcERhdGEoKS5nZXRNYXAoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hcC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3Qgc2hpcENlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgJHtwYXJlbnRRdWVyeX0gLmJhdHRsZWZpZWxkLWNlbGwtY29udGVudFtkYXRhLXg9XCIke21hcFtpXS54fVwiXVtkYXRhLXk9XCIke21hcFtpXS55fVwiXWBcbiAgICAgICk7XG4gICAgICBjb25zdCBtYXBTcGFjZSA9IGdhbWVCcmQuZ2V0TWFwRGF0YSgpLnNwYWNlKFttYXBbaV0ueCwgbWFwW2ldLnldKTtcbiAgICAgIGlmIChtYXBTcGFjZS5oYXNTaGlwKCkpIHtcbiAgICAgICAgaWYgKHhyYXlFbmFibGVkKCkgfHwgcGxheWVyLmdldFR1cm4oKSkge1xuICAgICAgICAgIHJlbmRlclNoaXAoc2hpcENlbGwpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXBTcGFjZS5zaGlwKCkuZ2V0U2hpcCgpLmlzU3VuaygpKSByZW5kZXJTdW5rKHNoaXBDZWxsKTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXBTcGFjZS5oYXNNaXNzZWQoKSkgcmVuZGVyTWlzcyhzaGlwQ2VsbCk7XG4gICAgICBpZiAobWFwU3BhY2UuaXNIaXQoKSkgcmVuZGVySGl0KHNoaXBDZWxsKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJJbnZhbGlkU3BhY2UoaW52YWxpZFNwYWNlQXJyKSB7XG4gICAgY29uc3QgYXJyID0gaW52YWxpZFNwYWNlQXJyO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYCR7cGFyZW50UXVlcnl9IC5iYXR0bGVmaWVsZC1jZWxsLWNvbnRlbnRbZGF0YS14PVwiJHthcnJbaV1bMF19XCJdW2RhdGEteT1cIiR7YXJyW2ldWzFdfVwiXWBcbiAgICAgICk7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJpbnZhbGlkXCIpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlckNsYXNzbmFtZShjbGFzc05hbWUsIGFycmF5KSB7XG4gICAgY29uc3QgYXJyID0gYXJyYXk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgJHtwYXJlbnRRdWVyeX0gLmJhdHRsZWZpZWxkLWNlbGwtY29udGVudFtkYXRhLXg9XCIke2FycltpXS54fVwiXVtkYXRhLXk9XCIke2FycltpXS55fVwiXWBcbiAgICAgICk7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgc2VsZi5pbm5lckhUTUwgPSB0YWJsZUVsLmlubmVySFRNTDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZEF0dGFja0V2ZW50TGlzdGVuZXIoYXR0YWNrRXZlbnQpIHtcbiAgICBkb2N1bWVudFxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgIGAke3BhcmVudFF1ZXJ5fSAuYmF0dGxlZmllbGQtY2VsbC1jb250ZW50LmF0dGFjay1jdXJzb3JgXG4gICAgICApXG4gICAgICAuZm9yRWFjaCgodmFsdWUpID0+IHZhbHVlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhdHRhY2tFdmVudCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyQXR0YWNrUmVzdWx0KGF0dGFjaywgY29vcmRzKSB7XG4gICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBgJHtwYXJlbnRRdWVyeX0gLmJhdHRsZWZpZWxkLWNlbGwtY29udGVudFtkYXRhLXg9XCIke2Nvb3Jkc1swXX1cIl1bZGF0YS15PVwiJHtjb29yZHNbMV19XCJdYFxuICAgICk7XG4gICAgaWYgKGF0dGFjay5taXNzKSB7XG4gICAgICByZW5kZXJNaXNzKGNlbGwpO1xuICAgIH1cbiAgICBpZiAoYXR0YWNrLmhpdCB8fCBhdHRhY2suc3Vuaykge1xuICAgICAgcmVuZGVySGl0KGNlbGwpO1xuICAgIH1cbiAgICBpZiAoYXR0YWNrLnN1bmspIHtcbiAgICAgIGF0dGFjay5zaGlwQ29yZHMuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgICAgZG9jdW1lbnRcbiAgICAgICAgICAucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgIGAke3BhcmVudFF1ZXJ5fSAuYmF0dGxlZmllbGQtY2VsbC1jb250ZW50W2RhdGEteD1cIiR7dmFsdWUueH1cIl1bZGF0YS15PVwiJHt2YWx1ZS55fVwiXWBcbiAgICAgICAgICApXG4gICAgICAgICAgLmNsYXNzTGlzdC5hZGQoXCJzdW5rXCIpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICByZW5kZXIsXG4gICAgdXBkYXRlLFxuICAgIHJlbmRlckludmFsaWRTcGFjZSxcbiAgICByZW5kZXJDbGFzc25hbWUsXG4gICAgdG9nZ2xlRGlzYWJsZWQsXG4gICAgdG9nZ2xlQXR0YWNrQ3Vyc29yLFxuICAgIGFkZEF0dGFja0V2ZW50TGlzdGVuZXIsXG4gICAgcmVuZGVyQXR0YWNrUmVzdWx0LFxuICAgIGFyZ3MsXG4gIH07XG59O1xuXG5mdW5jdGlvbiByZW5kZXJOb3RpZmljYXRpb24obXNnKSB7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubm90aWZpY2F0aW9uLW1lc3NhZ2VcIikuaW5uZXJIVE1MID0gbXNnO1xufVxuXG5mdW5jdGlvbiByZW5kZXJWaWN0b3J5U2NyZWVuKGNoYW1waW9uTmFtZSwgY2hhbXBpb25JZCwgbG9zZXJJZCkge1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJhdHRsZWZpZWxkc1wiKS5yZW1vdmUoKTtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ub3RpZmljYXRpb24td3JhcFwiKS5yZW1vdmUoKTtcblxuICBjb25zdCB2aWN0b3J5U2NyZWVuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgdmljdG9yeVNjcmVlbi5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1vdmVyXCIpO1xuXG4gIHZpY3RvcnlTY3JlZW4uaW5uZXJIVE1MID0gYFxuICAgIDxkaXYgY2xhc3M9XCJnYW1lLW92ZXItbWVzc2FnZS1jb250YWluZXJcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLW92ZXItbWVzc2FnZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1vdmVyLXRleHRcIj5HYW1lIE92ZXI8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbmdyYXRzXCI+PHNwYW4gY2xhc3M9XCIke2NoYW1waW9uSWR9LXZpY3RvcnlcIj4ke2NoYW1waW9uTmFtZX08L3NwYW4+IDxzcGFuIGNsYXNzPVwiJHtsb3NlcklkfS12aWN0b3J5XCI+V2lucyE8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYDtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1haW5cIikuYXBwZW5kQ2hpbGQodmljdG9yeVNjcmVlbik7XG59XG5cbmZ1bmN0aW9uIGdldFBsYXllckNvbG9yU3BhbihpZCwgaW5zZXJ0ZWRUZXh0KSB7XG4gIHJldHVybiBgPHNwYW4gY2xhc3M9XCIke2lkfS12aWN0b3J5XCI+JHtpbnNlcnRlZFRleHR9PC9zcGFuPmA7XG59XG5cbmZ1bmN0aW9uIHJlbmRlclBhc3NTY3JlZW4oY3VyTmFtZSwgY3VySWQsIG5leHROYW1lLCBuZXh0SWQpIHtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5iYXR0bGVmaWVsZHNcIikucmVtb3ZlKCk7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubm90aWZpY2F0aW9uLXdyYXBcIikucmVtb3ZlKCk7XG5cbiAgY29uc3QgcGFzc1NjcmVlbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIHBhc3NTY3JlZW4uY2xhc3NMaXN0LmFkZChcInBhc3Mtc2NyZWVuXCIpO1xuXG4gIHBhc3NTY3JlZW4uaW5uZXJIVE1MID0gYFxuICAgICAgPGRpdiBjbGFzcz1cInBhc3Mtc2NyZWVuLW1lc3NhZ2VcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInBhc3Mtc2NyZWVuLW1lc3NhZ2UtdGV4dCBoZWFkXCI+JHtnZXRQbGF5ZXJDb2xvclNwYW4oXG4gICAgICAgICAgY3VySWQsXG4gICAgICAgICAgY3VyTmFtZVxuICAgICAgICApfSwgUGFzcyB5b3VyIHNjcmVlbiB0byB5b3VyIG9wcG9uZW50ICR7Z2V0UGxheWVyQ29sb3JTcGFuKFxuICAgIG5leHRJZCxcbiAgICBuZXh0TmFtZVxuICApfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwicGFzcy1zY3JlZW4tbWVzc2FnZS10ZXh0IGJvZHlcIj5JdCBpcyB5b3VyIHR1cm4sICR7Z2V0UGxheWVyQ29sb3JTcGFuKFxuICAgICAgICAgIG5leHRJZCxcbiAgICAgICAgICBuZXh0TmFtZVxuICAgICAgICApfS4gQXJlIHlvdSByZWFkeT88L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInBhc3MtYnRuLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicGFzcy1idG4gJHtuZXh0SWR9LXZpY3RvcnktYmdcIj5SZWFkeTwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgYDtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1haW5cIikuYXBwZW5kQ2hpbGQocGFzc1NjcmVlbik7XG59XG5cbmZ1bmN0aW9uIGdldEJvZHlJbm5lckhUTUwoKSB7XG4gIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5pbm5lckhUTUw7XG59XG5cbmZ1bmN0aW9uIHNldEJvZHlJbm5lckhUTUwoaW5uZXJIVE1MKSB7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpLmlubmVySFRNTCA9IGlubmVySFRNTDtcbn1cblxuZXhwb3J0IHtcbiAgVGFibGUsXG4gIHJlbmRlck5vdGlmaWNhdGlvbixcbiAgcmVuZGVyVmljdG9yeVNjcmVlbixcbiAgcmVuZGVyUGFzc1NjcmVlbixcbiAgZ2V0Qm9keUlubmVySFRNTCxcbiAgc2V0Qm9keUlubmVySFRNTCxcbn07XG4iLCJpbXBvcnQgeyBUYWJsZSwgcmVuZGVyTm90aWZpY2F0aW9uIH0gZnJvbSBcIi4vRE9NXCI7XG5pbXBvcnQgeyBsb2dBcnJheXMsIGRpZmZlcmVuY2UgfSBmcm9tIFwiLi91dGlsaXR5XCI7XG5jb25zdCB7IHN0cmlwSW5kZW50cyB9ID0gcmVxdWlyZShcImNvbW1vbi10YWdzXCIpO1xuXG5jb25zdCBTaGlwID0gKHNpemUsIGF4aXMpID0+IHtcbiAgY29uc3Qgc2hpcFNpemUgPSBzaXplO1xuICBsZXQgdGltZXNIaXQgPSAwO1xuICBsZXQgc3VuayA9IGZhbHNlO1xuICBsZXQgY29vcmRpbmF0ZXMgPSBbXTtcblxuICBmdW5jdGlvbiBnZXRTaXplKCkge1xuICAgIHJldHVybiBzaGlwU2l6ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEF4aXMoKSB7XG4gICAgcmV0dXJuIGF4aXM7XG4gIH1cblxuICBmdW5jdGlvbiBoaXQoKSB7XG4gICAgdGltZXNIaXQgKz0gMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzU3VuaygpIHtcbiAgICBpZiAodGltZXNIaXQgPT09IHNoaXBTaXplKSB7XG4gICAgICBzdW5rID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHN1bms7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDb29yZGluYXRlcygpIHtcbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRDb29yZGluYXRlcyhjb3Jkcykge1xuICAgIGNvb3JkaW5hdGVzID0gY29yZHM7XG4gIH1cblxuICByZXR1cm4geyBnZXRTaXplLCBpc1N1bmssIGhpdCwgZ2V0Q29vcmRpbmF0ZXMsIHNldENvb3JkaW5hdGVzLCBnZXRBeGlzIH07XG59O1xuXG5jb25zdCBHYW1lYm9hcmQgPSAoKSA9PiB7XG4gIGNvbnN0IHNpemUgPSAxMDtcblxuICBmdW5jdGlvbiBnZXRDb2xNYXJrZXIoeVBvcykge1xuICAgIGNvbnN0IGFscGhhYmV0ID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWlwiO1xuICAgIGNvbnN0IGFyciA9IGFscGhhYmV0LnNwbGl0KFwiXCIpO1xuICAgIHJldHVybiBhcnJbeVBvc107XG4gIH1cblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIGNvbnN0IGFyciA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSArPSAxKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNpemU7IGogKz0gMSkge1xuICAgICAgICBhcnIucHVzaCh7IHg6IGosIHk6IGksIHJvdzogaSArIDEsIGNvbDogZ2V0Q29sTWFya2VyKGopIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyO1xuICB9XG5cbiAgY29uc3QgbWFwID0gaW5pdCgpO1xuXG4gIGZ1bmN0aW9uIGdldE1hcERhdGEoKSB7XG4gICAgZnVuY3Rpb24gZ2V0RGljdGlvbmFyeShtYXBBcnIgPSBtYXAuc2xpY2UoKSkge1xuICAgICAgY29uc3QgZGljdGlvbmFyeSA9IHtcbiAgICAgICAgY29sdW1uczogW10sXG4gICAgICAgIHJvd3M6IFtdLFxuICAgICAgfTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IGFyckNvbHVtbnMgPSBtYXBBcnIuZmlsdGVyKFxuICAgICAgICAgICh2YWx1ZSkgPT4gdmFsdWUuY29sID09PSBnZXRDb2xNYXJrZXIoaSlcbiAgICAgICAgKTtcbiAgICAgICAgZGljdGlvbmFyeS5jb2x1bW5zLnB1c2goYXJyQ29sdW1ucyk7XG5cbiAgICAgICAgY29uc3QgYXJyUm93cyA9IG1hcEFyci5maWx0ZXIoKHZhbHVlKSA9PiB2YWx1ZS5yb3cgPT09IGkgKyAxKTtcbiAgICAgICAgZGljdGlvbmFyeS5yb3dzLnB1c2goYXJyUm93cyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkaWN0aW9uYXJ5O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEluZGV4QnlDb29yZGluYXRlKGNvb3Jkcykge1xuICAgICAgY29uc3QgcmVzdWx0ID0gbWFwLmZpbmRJbmRleChcbiAgICAgICAgKHZhbHVlKSA9PiB2YWx1ZS54ID09PSBjb29yZHNbMF0gJiYgdmFsdWUueSA9PT0gY29vcmRzWzFdXG4gICAgICApO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRDb29yZGluYXRlQnlJbmRleChpbmRleCkge1xuICAgICAgcmV0dXJuIG1hcC5zbGljZSgpW2luZGV4XTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSYW5kb21BdHRhY2thYmxlQ29vcmRpbmF0ZSgpIHtcbiAgICAgIGNvbnN0IGZpbHRlcmVkTWFwID0gbWFwLmZpbHRlcigodmFsdWUpID0+ICF2YWx1ZS5oaXQgJiYgIXZhbHVlLm1pc3MpO1xuICAgICAgY29uc3QgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBmaWx0ZXJlZE1hcC5sZW5ndGgpO1xuICAgICAgcmV0dXJuIGZpbHRlcmVkTWFwW2luZGV4XTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzcGFjZShjb29yZCkge1xuICAgICAgY29uc3QgaW5kZXggPSBnZXRJbmRleEJ5Q29vcmRpbmF0ZShjb29yZCk7XG4gICAgICBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgIHJldHVybiBnZXRDb29yZGluYXRlQnlJbmRleChpbmRleCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGhhc1NoaXAoKSB7XG4gICAgICAgIGlmIChtYXAuc2xpY2UoKVtpbmRleF0uc2hpcCkgcmV0dXJuIHRydWU7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaXNIaXQoKSB7XG4gICAgICAgIGlmIChtYXAuc2xpY2UoKVtpbmRleF0uaGl0KSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzZXRIaXQoKSB7XG4gICAgICAgIG1hcFtpbmRleF0uaGl0ID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaGFzTWlzc2VkKCkge1xuICAgICAgICBpZiAobWFwLnNsaWNlKClbaW5kZXhdLm1pc3MpIHJldHVybiB0cnVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNldE1pc3NlZCgpIHtcbiAgICAgICAgbWFwW2luZGV4XS5taXNzID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2V0T2NjdXBpZWQoYm9vbCkge1xuICAgICAgICBtYXBbaW5kZXhdLm9jY3VwaWVkID0gYm9vbDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaXNPY2N1cGllZCgpIHtcbiAgICAgICAgaWYgKG1hcC5zbGljZSgpW2luZGV4XS5vY2N1cGllZCkgcmV0dXJuIHRydWU7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2V0U2hpcChzaHApIHtcbiAgICAgICAgaWYgKGhhc1NoaXAoKSB8fCBpc09jY3VwaWVkKCkpIHJldHVybjtcbiAgICAgICAgbWFwW2luZGV4XS5zaGlwID0gc2hwO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaGlwKCkge1xuICAgICAgICBpZiAoIWhhc1NoaXAoKSkgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgaXMgbm90IGEgc2hpcCBvbiB0aGlzIHRpbGVcIik7XG4gICAgICAgIGNvbnN0IHNocCA9IG1hcC5zbGljZSgpW2luZGV4XS5zaGlwO1xuICAgICAgICBmdW5jdGlvbiBnZXRTaGlwKCkge1xuICAgICAgICAgIHJldHVybiBzaHA7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0TG9nKCkge1xuICAgICAgICAgIHJldHVybiBzdHJpcEluZGVudHNgXG4gICAgICAgICAgVGhlcmUgaXMgYSBzaGlwIGF0ICR7c2hwLmdldENvb3JkaW5hdGVzKCl9XG4gICAgICAgICAgUm93OiAke3NocC5yb3d9XG4gICAgICAgICAgQ29sdW1uOiAke3NocC5jb2x9XG4gICAgICAgICAgU2l6ZTogJHtzaHAuZ2V0U2l6ZSgpfVxuICAgICAgICAgIEF4aXM6ICR7c2hwLmdldEF4aXMoKX1cbiAgICAgICAgICBBbGl2ZTogJHshc2hwLmlzU3VuaygpfVxuICAgICAgICAgIGA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgZ2V0U2hpcCwgZ2V0TG9nIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldCxcbiAgICAgICAgc2V0T2NjdXBpZWQsXG4gICAgICAgIHNldFNoaXAsXG4gICAgICAgIGhhc1NoaXAsXG4gICAgICAgIHNoaXAsXG4gICAgICAgIGlzSGl0LFxuICAgICAgICBzZXRIaXQsXG4gICAgICAgIGhhc01pc3NlZCxcbiAgICAgICAgc2V0TWlzc2VkLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRNYXAoKSB7XG4gICAgICByZXR1cm4gbWFwLnNsaWNlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RnJlZVNwYWNlcygpIHtcbiAgICAgIHJldHVybiBtYXAuc2xpY2UoKS5maWx0ZXIoKHZhbHVlKSA9PiAhdmFsdWUuc2hpcCAmJiAhdmFsdWUub2NjdXBpZWQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFsbFNoaXBzKCkge1xuICAgICAgY29uc3QgYXJyID0gbWFwLnNsaWNlKCkuZmlsdGVyKCh2YWx1ZSkgPT4gdmFsdWUuc2hpcCk7XG5cbiAgICAgIGNvbnN0IGdldEFsbCA9ICgpID0+IGFycjtcbiAgICAgIGNvbnN0IGxvZyA9ICgpID0+IGxvZ0FycmF5cyhhcnIpO1xuICAgICAgY29uc3Qgc3VuayA9ICgpID0+XG4gICAgICAgIGFyci5maWx0ZXIoKHZhbHVlKSA9PiAhdmFsdWUuc2hpcC5pc1N1bmsoKSkubGVuZ3RoID09PSAwO1xuXG4gICAgICByZXR1cm4geyBnZXRBbGwsIGxvZywgc3VuayB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzcGFjZSxcbiAgICAgIGdldERpY3Rpb25hcnksXG4gICAgICBnZXRGcmVlU3BhY2VzLFxuICAgICAgYWxsU2hpcHMsXG4gICAgICBnZXRNYXAsXG4gICAgICBnZXRSYW5kb21BdHRhY2thYmxlQ29vcmRpbmF0ZSxcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U2l6ZSgpIHtcbiAgICByZXR1cm4gc2l6ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFZhbGlkQ29vcmRzKHNoaXBTaXplKSB7XG4gICAgZnVuY3Rpb24gdmVydGljYWwoKSB7XG4gICAgICBjb25zdCBtYXBEYXRhID0gZ2V0TWFwRGF0YSgpO1xuICAgICAgY29uc3QgZnJlZVNwYWNlQXJyID0gbWFwRGF0YS5nZXRGcmVlU3BhY2VzKCk7XG4gICAgICBjb25zdCB2ZXJ0aWNhbEZyZWVTcGFjZUFyciA9IG1hcERhdGEuZ2V0RGljdGlvbmFyeShmcmVlU3BhY2VBcnIpLmNvbHVtbnM7XG4gICAgICBjb25zdCBzdGFydGluZ1lQb3NBcnIgPSBbXTtcblxuICAgICAgZnVuY3Rpb24gZ2V0VmVydGljYWxEaWZmKGNvbHVtbiwgaiwgaykge1xuICAgICAgICBpZiAoaiArIGsgPj0gY29sdW1uLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBjb25zdCBkaWZmID0gZGlmZmVyZW5jZShjb2x1bW5bal0ueSwgY29sdW1uW2ogKyBrXS55KTtcbiAgICAgICAgY29uc3QgbG9nID0ge1xuICAgICAgICAgIHNoaXBTdGFydDogY29sdW1uW2pdLFxuICAgICAgICAgIHNoaXBFbmQ6IGNvbHVtbltqICsga10sXG4gICAgICAgICAgZGlmZixcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGRpZmYgPT09IHNoaXBTaXplIC0gMSkgcmV0dXJuIHsgdmFsaWQ6IHRydWUsIGxvZyB9O1xuICAgICAgICByZXR1cm4geyB2YWxpZDogZmFsc2UgfTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0aWNhbEZyZWVTcGFjZUFyci5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBjb2x1bW4gPSB2ZXJ0aWNhbEZyZWVTcGFjZUFycltpXTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2x1bW4ubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHNoaXBTaXplOyBrICs9IDEpIHtcbiAgICAgICAgICAgIGlmIChnZXRWZXJ0aWNhbERpZmYoY29sdW1uLCBqLCBrKS52YWxpZCkge1xuICAgICAgICAgICAgICBzdGFydGluZ1lQb3NBcnIucHVzaChjb2x1bW5bal0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHN0YXJ0aW5nWVBvc0FycjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBob3Jpem9udGFsKCkge1xuICAgICAgY29uc3QgbWFwRGF0YSA9IGdldE1hcERhdGEoKTtcbiAgICAgIGNvbnN0IGZyZWVTcGFjZUFyciA9IG1hcERhdGEuZ2V0RnJlZVNwYWNlcygpO1xuICAgICAgY29uc3Qgc3RhcnRpbmdYUG9zQXJyID0gW107XG4gICAgICBmdW5jdGlvbiBnZXRIb3Jpem9udGFsRGlmZihpLCBrKSB7XG4gICAgICAgIGlmIChpICsgayA+PSBmcmVlU3BhY2VBcnIubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGNvbnN0IGRpZmYgPSBkaWZmZXJlbmNlKGZyZWVTcGFjZUFycltpXS54LCBmcmVlU3BhY2VBcnJbaSArIGtdLngpO1xuICAgICAgICBjb25zdCBsb2cgPSB7XG4gICAgICAgICAgc2hpcFN0YXJ0OiBmcmVlU3BhY2VBcnJbaV0sXG4gICAgICAgICAgc2hpcEVuZDogZnJlZVNwYWNlQXJyW2kgKyBrXSxcbiAgICAgICAgICBkaWZmLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoZGlmZiA9PT0gc2hpcFNpemUgLSAxKSByZXR1cm4geyB2YWxpZDogdHJ1ZSwgbG9nIH07XG4gICAgICAgIHJldHVybiB7IHZhbGlkOiBmYWxzZSB9O1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyZWVTcGFjZUFyci5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHNoaXBTaXplOyBrICs9IDEpIHtcbiAgICAgICAgICBpZiAoZ2V0SG9yaXpvbnRhbERpZmYoaSwgaykudmFsaWQpIHtcbiAgICAgICAgICAgIHN0YXJ0aW5nWFBvc0Fyci5wdXNoKGZyZWVTcGFjZUFycltpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdGFydGluZ1hQb3NBcnI7XG4gICAgfVxuXG4gICAgLy8gY29uc29sZS5sb2coeyBzdGFydGluZ1hQb3NBcnIsIHN0YXJ0aW5nWVBvc0FyciB9KTtcblxuICAgIHJldHVybiB7IHZlcnRpY2FsLCBob3Jpem9udGFsIH07XG4gIH1cblxuICBmdW5jdGlvbiBzZXRPY2N1cGllZFNwYWNlKHNoaXApIHtcbiAgICBjb25zdCBtYXBEYXRhID0gZ2V0TWFwRGF0YSgpO1xuICAgIGNvbnN0IGNvb3JkcyA9IHNoaXAuZ2V0Q29vcmRpbmF0ZXMoKTtcbiAgICBjb25zdCBzdGFydCA9IGNvb3Jkc1swXTtcbiAgICBjb25zdCBlbmQgPSBjb29yZHNbY29vcmRzLmxlbmd0aCAtIDFdO1xuXG4gICAgZnVuY3Rpb24gZ2V0VmVydGljYWwoKSB7XG4gICAgICBsZXQgYWRqYWNlbnRPY2N1cGllZFNwYWNlVmVydGljYWwgPSBbXG4gICAgICAgIFtzdGFydC54LCBzdGFydC55IC0gMV0sXG4gICAgICAgIFtzdGFydC54ICsgMSwgc3RhcnQueSAtIDFdLFxuICAgICAgICBbc3RhcnQueCAtIDEsIHN0YXJ0LnkgLSAxXSxcblxuICAgICAgICBbZW5kLngsIGVuZC55ICsgMV0sXG4gICAgICAgIFtlbmQueCAtIDEsIGVuZC55ICsgMV0sXG4gICAgICAgIFtlbmQueCArIDEsIGVuZC55ICsgMV0sXG4gICAgICBdO1xuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvb3Jkcy5sZW5ndGg7IGogKz0gMSkge1xuICAgICAgICBhZGphY2VudE9jY3VwaWVkU3BhY2VWZXJ0aWNhbC5wdXNoKFtjb29yZHNbal0ueCArIDEsIGNvb3Jkc1tqXS55XSk7XG4gICAgICAgIGFkamFjZW50T2NjdXBpZWRTcGFjZVZlcnRpY2FsLnB1c2goW2Nvb3Jkc1tqXS54IC0gMSwgY29vcmRzW2pdLnldKTtcbiAgICAgIH1cblxuICAgICAgYWRqYWNlbnRPY2N1cGllZFNwYWNlVmVydGljYWwgPSBhZGphY2VudE9jY3VwaWVkU3BhY2VWZXJ0aWNhbC5maWx0ZXIoXG4gICAgICAgICh2YWx1ZSkgPT5cbiAgICAgICAgICAhKHZhbHVlWzBdID4gc2l6ZSAtIDEpICYmXG4gICAgICAgICAgISh2YWx1ZVsxXSA+IHNpemUgLSAxKSAmJlxuICAgICAgICAgICEodmFsdWVbMF0gPCAwKSAmJlxuICAgICAgICAgICEodmFsdWVbMV0gPCAwKVxuICAgICAgKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhZGphY2VudE9jY3VwaWVkU3BhY2VWZXJ0aWNhbC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBtYXBEYXRhLnNwYWNlKGFkamFjZW50T2NjdXBpZWRTcGFjZVZlcnRpY2FsW2ldKS5zZXRPY2N1cGllZCh0cnVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhZGphY2VudE9jY3VwaWVkU3BhY2VWZXJ0aWNhbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRIb3Jpem9udGFsKCkge1xuICAgICAgbGV0IGFkamFjZW50T2NjdXBpZWRTcGFjZUhvcml6b250YWwgPSBbXG4gICAgICAgIFtzdGFydC54IC0gMSwgc3RhcnQueV0sXG4gICAgICAgIFtzdGFydC54IC0gMSwgc3RhcnQueSArIDFdLFxuICAgICAgICBbc3RhcnQueCAtIDEsIHN0YXJ0LnkgLSAxXSxcblxuICAgICAgICBbZW5kLnggKyAxLCBlbmQueV0sXG4gICAgICAgIFtlbmQueCArIDEsIGVuZC55ICsgMV0sXG4gICAgICAgIFtlbmQueCArIDEsIGVuZC55IC0gMV0sXG4gICAgICBdO1xuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvb3Jkcy5sZW5ndGg7IGogKz0gMSkge1xuICAgICAgICBhZGphY2VudE9jY3VwaWVkU3BhY2VIb3Jpem9udGFsLnB1c2goW2Nvb3Jkc1tqXS54LCBjb29yZHNbal0ueSArIDFdKTtcbiAgICAgICAgYWRqYWNlbnRPY2N1cGllZFNwYWNlSG9yaXpvbnRhbC5wdXNoKFtjb29yZHNbal0ueCwgY29vcmRzW2pdLnkgLSAxXSk7XG4gICAgICB9XG5cbiAgICAgIGFkamFjZW50T2NjdXBpZWRTcGFjZUhvcml6b250YWwgPSBhZGphY2VudE9jY3VwaWVkU3BhY2VIb3Jpem9udGFsLmZpbHRlcihcbiAgICAgICAgKHZhbHVlKSA9PlxuICAgICAgICAgICEodmFsdWVbMF0gPiBzaXplIC0gMSkgJiZcbiAgICAgICAgICAhKHZhbHVlWzFdID4gc2l6ZSAtIDEpICYmXG4gICAgICAgICAgISh2YWx1ZVswXSA8IDApICYmXG4gICAgICAgICAgISh2YWx1ZVsxXSA8IDApXG4gICAgICApO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFkamFjZW50T2NjdXBpZWRTcGFjZUhvcml6b250YWwubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgbWFwRGF0YS5zcGFjZShhZGphY2VudE9jY3VwaWVkU3BhY2VIb3Jpem9udGFsW2ldKS5zZXRPY2N1cGllZCh0cnVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhZGphY2VudE9jY3VwaWVkU3BhY2VIb3Jpem9udGFsO1xuICAgIH1cblxuICAgIGlmIChzaGlwLmdldEF4aXMoKSA9PT0gXCJ4XCIpIHtcbiAgICAgIHJldHVybiBnZXRIb3Jpem9udGFsKCk7XG4gICAgfVxuICAgIGlmIChzaGlwLmdldEF4aXMoKSA9PT0gXCJ5XCIpIHtcbiAgICAgIHJldHVybiBnZXRWZXJ0aWNhbCgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBsYWNlU2hpcFBhcnQoY29vcmRzLCBzaGlwKSB7XG4gICAgZ2V0TWFwRGF0YSgpLnNwYWNlKGNvb3Jkcykuc2V0U2hpcChzaGlwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBsYWNlU2hpcChjb29yZHMsIHNoaXBTaXplLCBheGlzKSB7XG4gICAgaWYgKGF4aXMgIT09IFwieFwiICYmIGF4aXMgIT09IFwieVwiKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2hpcCBtdXN0IGhhdmUgYSB2YWxpZCBkaXJlY3Rpb25cIik7XG4gICAgaWYgKGF4aXMgPT09IFwieFwiKSB7XG4gICAgICBpZiAoc2hpcFNpemUgKyBjb29yZHNbMF0gPiBzaXplKSByZXR1cm47XG4gICAgfVxuICAgIGlmIChheGlzID09PSBcInlcIikge1xuICAgICAgaWYgKHNoaXBTaXplICsgY29vcmRzWzFdID4gc2l6ZSkgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNoaXAgPSBTaGlwKHNoaXBTaXplLCBheGlzKTtcblxuICAgIGNvbnN0IGFycmF5Q29yZHMgPSBbXTtcbiAgICBjb25zdCBtYXBEYXRhID0gZ2V0TWFwRGF0YSgpO1xuICAgIGxldCBjb3JkRGF0YTtcblxuICAgIGZ1bmN0aW9uIHB1c2hDb29yZERhdGFJbnRvU2hpcChkYXRhKSB7XG4gICAgICBjb25zdCBtYXBDb29yZHNDbG9uZSA9IEpTT04ucGFyc2UoXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KG1hcERhdGEuc3BhY2UoZGF0YSkuZ2V0KCkpXG4gICAgICApO1xuICAgICAgZGVsZXRlIG1hcENvb3Jkc0Nsb25lLnNoaXA7XG4gICAgICBhcnJheUNvcmRzLnB1c2gobWFwQ29vcmRzQ2xvbmUpO1xuICAgIH1cblxuICAgIGNvbnN0IHNocFNpemUgPSBzaGlwLmdldFNpemUoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hwU2l6ZTsgaSArPSAxKSB7XG4gICAgICBpZiAoc2hpcC5nZXRBeGlzKCkgPT09IFwieFwiKSB7XG4gICAgICAgIGlmIChjb29yZHNbMF0gKyBzaHBTaXplIDw9IHNpemUpIHtcbiAgICAgICAgICBjb3JkRGF0YSA9IFtjb29yZHNbMF0gKyBpLCBjb29yZHNbMV1dO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHNoaXAuZ2V0QXhpcygpID09PSBcInlcIikge1xuICAgICAgICBpZiAoY29vcmRzWzFdICsgc2hwU2l6ZSA8PSBzaXplKSB7XG4gICAgICAgICAgY29yZERhdGEgPSBbY29vcmRzWzBdLCBjb29yZHNbMV0gKyBpXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGNvcmREYXRhID09PSBcInVuZGVmaW5lZFwiIHx8IGNvcmREYXRhID09PSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHsgY29vcmRzLCBheGlzLCBzaGlwU2l6ZSB9KTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ29vcmRpbmF0ZXMgbXVzdCBub3QgYmUgbnVsbCBvciB1bmRlZmluZWRcIik7XG4gICAgICB9XG5cbiAgICAgIHBsYWNlU2hpcFBhcnQoY29yZERhdGEsIHNoaXApO1xuICAgICAgcHVzaENvb3JkRGF0YUludG9TaGlwKGNvcmREYXRhKTtcbiAgICB9XG5cbiAgICBzaGlwLnNldENvb3JkaW5hdGVzKGFycmF5Q29yZHMpO1xuICAgIHNldE9jY3VwaWVkU3BhY2Uoc2hpcCk7XG4gIH1cblxuICBmdW5jdGlvbiByZWNlaXZlQXR0YWNrKGNvb3Jkcykge1xuICAgIGNvbnN0IG1hcERhdGEgPSBnZXRNYXBEYXRhKCk7XG4gICAgaWYgKG1hcERhdGEuc3BhY2UoY29vcmRzKS5oYXNNaXNzZWQoKSB8fCBtYXBEYXRhLnNwYWNlKGNvb3JkcykuaXNIaXQoKSlcbiAgICAgIHJldHVybiBudWxsO1xuICAgIGlmIChtYXBEYXRhLnNwYWNlKGNvb3JkcykuaGFzU2hpcCgpKSB7XG4gICAgICBjb25zdCBzaHAgPSBtYXBEYXRhLnNwYWNlKGNvb3Jkcykuc2hpcCgpLmdldFNoaXAoKTtcbiAgICAgIHNocC5oaXQoKTtcbiAgICAgIG1hcERhdGEuc3BhY2UoY29vcmRzKS5zZXRIaXQoKTtcbiAgICAgIGlmIChzaHAuaXNTdW5rKCkgJiYgIW1hcERhdGEuYWxsU2hpcHMoKS5zdW5rKCkpIHtcbiAgICAgICAgcmV0dXJuIHsgc3Vuazogc2hwLmlzU3VuaygpLCBzaGlwQ29yZHM6IHNocC5nZXRDb29yZGluYXRlcygpIH07XG4gICAgICB9XG4gICAgICBpZiAobWFwRGF0YS5hbGxTaGlwcygpLnN1bmsoKSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdW5rOiBzaHAuaXNTdW5rKCksXG4gICAgICAgICAgZ2FtZW92ZXI6IHRydWUsXG4gICAgICAgICAgc2hpcENvcmRzOiBzaHAuZ2V0Q29vcmRpbmF0ZXMoKSxcbiAgICAgICAgfTtcbiAgICAgIHJldHVybiB7IGhpdDogbWFwRGF0YS5zcGFjZShjb29yZHMpLmlzSGl0KCkgfTtcbiAgICB9XG4gICAgbWFwRGF0YS5zcGFjZShjb29yZHMpLnNldE1pc3NlZCgpO1xuICAgIHJldHVybiB7IG1pc3M6IG1hcERhdGEuc3BhY2UoY29vcmRzKS5oYXNNaXNzZWQoKSB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXRTaXplLFxuICAgIHBsYWNlU2hpcCxcbiAgICBwbGFjZVNoaXBQYXJ0LFxuICAgIHJlY2VpdmVBdHRhY2ssXG4gICAgZ2V0TWFwRGF0YSxcbiAgICBnZXRWYWxpZENvb3JkcyxcbiAgfTtcbn07XG5cbmNvbnN0IFBsYXllciA9IChuYW1lLCB0YWJsZVF1ZXJ5U2VsZWN0b3IpID0+IHtcbiAgY29uc3QgZ2FtZUJyZCA9IEdhbWVib2FyZCgpO1xuICBjb25zdCBwbGF5YWJsZVNoaXBzID0gW1xuICAgIHsgc2l6ZTogMSwgaG93TWFueTogNCB9LFxuICAgIHsgc2l6ZTogMiwgaG93TWFueTogMyB9LFxuICAgIHsgc2l6ZTogMywgaG93TWFueTogMiB9LFxuICAgIHsgc2l6ZTogNCwgaG93TWFueTogMSB9LFxuICBdO1xuICBjb25zdCB0YWJsZSA9IFRhYmxlKDEwLCB0YWJsZVF1ZXJ5U2VsZWN0b3IpO1xuICBsZXQgdHVybiA9IGZhbHNlO1xuICBsZXQgaWQ7XG5cbiAgZnVuY3Rpb24gc2V0VHVybihib29sKSB7XG4gICAgdHVybiA9IGJvb2w7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUdXJuKCkge1xuICAgIHJldHVybiB0dXJuO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TmFtZSgpIHtcbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldElkKHN0cikge1xuICAgIGlkID0gc3RyO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SWQoKSB7XG4gICAgcmV0dXJuIGlkO1xuICB9XG5cbiAgLy8gVE9ETyB3cml0ZSB0ZXN0IHRoYXQgbXVsdGlwbGVzIHRoZSBzaXplIGJ5IGhvd01hbnkgYW5kIGV4cGVjdCB3aXRoIHRoZSBkZWZhdWx0IGJvYXJkIHNpemVcbiAgLy8gYW5kIHBsYXlhYmxlIHNoaXBzXG4gIC8vIGl0IHdpbGwgZXF1YWwgMjBcblxuICByZXR1cm4ge1xuICAgIGdhbWVCcmQsXG4gICAgcGxheWFibGVTaGlwcyxcbiAgICB0YWJsZSxcbiAgICBzZXRUdXJuLFxuICAgIGdldFR1cm4sXG4gICAgZ2V0TmFtZSxcbiAgICBzZXRJZCxcbiAgICBnZXRJZCxcbiAgfTtcbn07XG5cbi8vIGJ5IGRlZmF1bHQgdGhlIGdhbWUgd2lsbCBoYXZlIDEwIHNoaXBzIG9uIGEgZ3JpZCB3aXRoIGEgc2l6ZSBvZiAxMFxuY29uc3QgR2FtZSA9ICgpID0+IHtcbiAgY29uc3Qgc2VsZiA9IFBsYXllcihcIllvdVwiLCBcIi5iYXR0bGVmaWVsZC1zZWxmXCIpO1xuICBjb25zdCByaXZhbCA9IFBsYXllcihcIlJpdmFsXCIsIFwiLmJhdHRsZWZpZWxkLXJpdmFsXCIpO1xuICBjb25zdCBwbGF5ZXJzID0gW3NlbGYsIHJpdmFsXTtcblxuICBzZWxmLnNldElkKFwic2VsZlwiKTtcbiAgc2VsZi5zZXRUdXJuKHRydWUpO1xuXG4gIHJpdmFsLnNldElkKFwicml2YWxcIik7XG5cbiAgZnVuY3Rpb24gZ2V0VHVybigpIHtcbiAgICBsZXQgY3VycmVudFR1cm47XG4gICAgbGV0IG5leHRUdXJuO1xuICAgIHBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmdldFR1cm4oKSkge1xuICAgICAgICBjdXJyZW50VHVybiA9IHBsYXllcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5leHRUdXJuID0gcGxheWVyO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB7IGN1cnJlbnRUdXJuLCBuZXh0VHVybiB9O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UmVtYWluaW5nU2hpcHNUb1BsYWNlKHBsYXllcikge1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXIucGxheWFibGVTaGlwcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY291bnQgKz0gcGxheWVyLnBsYXlhYmxlU2hpcHNbaV0uaG93TWFueTtcbiAgICB9XG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG5cbiAgZnVuY3Rpb24gcmFuZG9tKHBsYXllcikge1xuICAgIHdoaWxlIChnZXRSZW1haW5pbmdTaGlwc1RvUGxhY2UocGxheWVyKSA+IDApIHtcbiAgICAgIGNvbnN0IHBsYXlhYmxlU2hpcHMgPSBwbGF5ZXIucGxheWFibGVTaGlwcy5maWx0ZXIoXG4gICAgICAgICh2YWx1ZSkgPT4gdmFsdWUuaG93TWFueSA+IDBcbiAgICAgICk7XG4gICAgICBjb25zdCBwbGF5YWJsZVNoaXBJbmRleCA9IE1hdGguZmxvb3IoXG4gICAgICAgIE1hdGgucmFuZG9tKCkgKiBwbGF5YWJsZVNoaXBzLmxlbmd0aFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHNoaXBTaXplID0gcGxheWFibGVTaGlwc1twbGF5YWJsZVNoaXBJbmRleF0uc2l6ZTtcblxuICAgICAgY29uc3QgcmFuZEF4aXMgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcblxuICAgICAgbGV0IGF4aXM7XG4gICAgICBsZXQgdmFsaWRTdGFydGluZ1Bvc2l0aW9ucztcblxuICAgICAgaWYgKHJhbmRBeGlzID09PSAwKSB7XG4gICAgICAgIGF4aXMgPSBcInhcIjtcbiAgICAgICAgdmFsaWRTdGFydGluZ1Bvc2l0aW9ucyA9IHBsYXllci5nYW1lQnJkXG4gICAgICAgICAgLmdldFZhbGlkQ29vcmRzKHNoaXBTaXplKVxuICAgICAgICAgIC5ob3Jpem9udGFsKCk7XG4gICAgICB9XG4gICAgICBpZiAocmFuZEF4aXMgPT09IDEpIHtcbiAgICAgICAgYXhpcyA9IFwieVwiO1xuICAgICAgICB2YWxpZFN0YXJ0aW5nUG9zaXRpb25zID0gcGxheWVyLmdhbWVCcmRcbiAgICAgICAgICAuZ2V0VmFsaWRDb29yZHMoc2hpcFNpemUpXG4gICAgICAgICAgLnZlcnRpY2FsKCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvb3JkSW5kZXggPSBNYXRoLmZsb29yKFxuICAgICAgICBNYXRoLnJhbmRvbSgpICogdmFsaWRTdGFydGluZ1Bvc2l0aW9ucy5sZW5ndGhcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IGdldFRhcmdldCA9ICgpID0+IHZhbGlkU3RhcnRpbmdQb3NpdGlvbnNbY29vcmRJbmRleF07XG5cbiAgICAgIGxldCB0YXJnZXQgPSBnZXRUYXJnZXQoKTtcbiAgICAgIHdoaWxlICh0YXJnZXQgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT09IG51bGwpIHtcbiAgICAgICAgdGFyZ2V0ID0gZ2V0VGFyZ2V0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxvZyA9IHtcbiAgICAgICAgcGxheWFibGVTaGlwczogcGxheWVyLnBsYXlhYmxlU2hpcHMsXG4gICAgICAgIHRhcmdldCxcbiAgICAgICAgYXhpcyxcbiAgICAgICAgc2hpcFNpemUsXG4gICAgICAgIHJlbWFpbmluZ1NoaXBzOiBnZXRSZW1haW5pbmdTaGlwc1RvUGxhY2UocGxheWVyKSxcbiAgICAgICAgdmFsaWRTdGFydGluZ1Bvc2l0aW9ucyxcbiAgICAgICAgY29vcmRJbmRleCxcbiAgICAgIH07XG5cbiAgICAgIGNvbnNvbGUubG9nKGxvZyk7XG4gICAgICBwbGF5ZXIuZ2FtZUJyZC5wbGFjZVNoaXAoW3RhcmdldC54LCB0YXJnZXQueV0sIHNoaXBTaXplLCBheGlzKTtcblxuICAgICAgcGxheWFibGVTaGlwc1twbGF5YWJsZVNoaXBJbmRleF0uaG93TWFueSAtPSAxO1xuICAgIH1cbiAgICBpZiAoZ2V0UmVtYWluaW5nU2hpcHNUb1BsYWNlKHBsYXllcikgPT09IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKFwic3VjY2Vzc1wiKTtcbiAgICB9XG4gIH1cblxuICByYW5kb20oc2VsZik7XG4gIHJhbmRvbShyaXZhbCk7XG5cbiAgcmV0dXJuIHsgc2VsZiwgcml2YWwsIGdldFR1cm4gfTtcbn07XG5cbmV4cG9ydCB7IEdhbWUsIFNoaXAgfTtcbiIsImltcG9ydCB7IEdhbWUsIEdhbWVib2FyZCB9IGZyb20gXCIuL2JhdHRsZXNoaXBcIjtcbmltcG9ydCB7XG4gIGdldEJvZHlJbm5lckhUTUwsXG4gIHJlbmRlck5vdGlmaWNhdGlvbixcbiAgcmVuZGVyUGFzc1NjcmVlbixcbiAgcmVuZGVyVmljdG9yeVNjcmVlbixcbiAgc2V0Qm9keUlubmVySFRNTCxcbiAgVGFibGUsXG59IGZyb20gXCIuL0RPTVwiO1xuXG5jb25zdCBpbml0SFRNTCA9IGdldEJvZHlJbm5lckhUTUwoKTtcblxuY29uc3QgZ2FtZSA9IEdhbWUoKTtcblxuY29uc3QgeyBzZWxmIH0gPSBnYW1lO1xuY29uc3QgeyByaXZhbCB9ID0gZ2FtZTtcblxuZnVuY3Rpb24gZ2FtZUxvb3AoeyBhaUVuYWJsZWQgPSBmYWxzZSB9KSB7XG4gIGxldCB7IGN1cnJlbnRUdXJuIH0gPSBnYW1lLmdldFR1cm4oKTtcbiAgbGV0IHsgbmV4dFR1cm4gfSA9IGdhbWUuZ2V0VHVybigpO1xuICBpZiAoYWlFbmFibGVkKSB7XG4gICAgY3VycmVudFR1cm4gPSBzZWxmO1xuICAgIG5leHRUdXJuID0gcml2YWw7XG4gIH1cblxuICBjb25zdCBzZWxmQXJncyA9IHNlbGYudGFibGUuYXJncztcbiAgc2VsZi50YWJsZSA9IFRhYmxlKHNlbGZBcmdzLnRhYmxlU2l6ZSwgc2VsZkFyZ3MucGFyZW50UXVlcnkpO1xuXG4gIGNvbnN0IHJpdmFsQXJncyA9IHJpdmFsLnRhYmxlLmFyZ3M7XG4gIHJpdmFsLnRhYmxlID0gVGFibGUocml2YWxBcmdzLnRhYmxlU2l6ZSwgcml2YWxBcmdzLnBhcmVudFF1ZXJ5KTtcblxuICBzZWxmLnRhYmxlLnJlbmRlcigpO1xuICByaXZhbC50YWJsZS5yZW5kZXIoKTtcblxuICBzZWxmLnRhYmxlLnVwZGF0ZShzZWxmKTtcbiAgcml2YWwudGFibGUudXBkYXRlKHJpdmFsKTtcblxuICBuZXh0VHVybi50YWJsZS50b2dnbGVBdHRhY2tDdXJzb3IoKTtcblxuICByZW5kZXJOb3RpZmljYXRpb24oXG4gICAgYEl0IGlzIDxzcGFuIGNsYXNzPVwiJHtjdXJyZW50VHVybi5nZXRJZCgpfS12aWN0b3J5XCI+JHtjdXJyZW50VHVybi5nZXROYW1lKCl9J3M8L3NwYW4+IHR1cm4sIGNsaWNrIG9uIDxzcGFuIGNsYXNzPVwiJHtuZXh0VHVybi5nZXRJZCgpfS12aWN0b3J5XCI+JHtuZXh0VHVybi5nZXROYW1lKCl9J3M8L3NwYW4+IGJvYXJkIHRvIGF0dGFja2BcbiAgKTtcblxuICBjdXJyZW50VHVybi50YWJsZS50b2dnbGVEaXNhYmxlZCgpO1xuXG4gIG5leHRUdXJuLnRhYmxlLmFkZEF0dGFja0V2ZW50TGlzdGVuZXIoKGUpID0+IHtcbiAgICBjb25zdCB4ID0gTnVtYmVyKGUuY3VycmVudFRhcmdldC5kYXRhc2V0LngpO1xuICAgIGNvbnN0IHkgPSBOdW1iZXIoZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQueSk7XG4gICAgY29uc3QgYXR0YWNrID0gbmV4dFR1cm4uZ2FtZUJyZC5yZWNlaXZlQXR0YWNrKFt4LCB5XSk7XG4gICAgY29uc29sZS5sb2coYXR0YWNrKTtcbiAgICBpZiAoYXR0YWNrICE9PSBudWxsKSB7XG4gICAgICBuZXh0VHVybi50YWJsZS5yZW5kZXJBdHRhY2tSZXN1bHQoYXR0YWNrLCBbeCwgeV0pO1xuICAgICAgaWYgKGF0dGFjay5nYW1lb3ZlcilcbiAgICAgICAgcmV0dXJuIHJlbmRlclZpY3RvcnlTY3JlZW4oXG4gICAgICAgICAgY3VycmVudFR1cm4uZ2V0TmFtZSgpLFxuICAgICAgICAgIGN1cnJlbnRUdXJuLmdldElkKCksXG4gICAgICAgICAgbmV4dFR1cm4uZ2V0SWQoKVxuICAgICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKCFhaUVuYWJsZWQpIHtcbiAgICAgIHJlbmRlclBhc3NTY3JlZW4oXG4gICAgICAgIGN1cnJlbnRUdXJuLmdldE5hbWUoKSxcbiAgICAgICAgY3VycmVudFR1cm4uZ2V0SWQoKSxcbiAgICAgICAgbmV4dFR1cm4uZ2V0TmFtZSgpLFxuICAgICAgICBuZXh0VHVybi5nZXRJZCgpXG4gICAgICApO1xuXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhc3MtYnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICBuZXh0VHVybi5zZXRUdXJuKHRydWUpO1xuICAgICAgICBjdXJyZW50VHVybi5zZXRUdXJuKGZhbHNlKTtcbiAgICAgICAgc2V0Qm9keUlubmVySFRNTChpbml0SFRNTCk7XG4gICAgICAgIGdhbWVMb29wKGFpRW5hYmxlZCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYXR0YWNrYWJsZUNvb3JkaW5hdGUgPSBzZWxmLmdhbWVCcmRcbiAgICAgICAgLmdldE1hcERhdGEoKVxuICAgICAgICAuZ2V0UmFuZG9tQXR0YWNrYWJsZUNvb3JkaW5hdGUoKTtcbiAgICAgIGNvbnN0IGFpQXR0YWNrID0gc2VsZi5nYW1lQnJkLnJlY2VpdmVBdHRhY2soW1xuICAgICAgICBhdHRhY2thYmxlQ29vcmRpbmF0ZS54LFxuICAgICAgICBhdHRhY2thYmxlQ29vcmRpbmF0ZS55LFxuICAgICAgXSk7XG4gICAgICBjb25zb2xlLmxvZyh7IGFpQXR0YWNrIH0pO1xuICAgICAgaWYgKGFpQXR0YWNrICE9PSBudWxsKSB7XG4gICAgICAgIHNlbGYudGFibGUucmVuZGVyQXR0YWNrUmVzdWx0KGFpQXR0YWNrLCBbXG4gICAgICAgICAgYXR0YWNrYWJsZUNvb3JkaW5hdGUueCxcbiAgICAgICAgICBhdHRhY2thYmxlQ29vcmRpbmF0ZS55LFxuICAgICAgICBdKTtcbiAgICAgICAgaWYgKGFpQXR0YWNrLmdhbWVvdmVyKVxuICAgICAgICAgIHJldHVybiByZW5kZXJWaWN0b3J5U2NyZWVuKFxuICAgICAgICAgICAgcml2YWwuZ2V0TmFtZSgpLFxuICAgICAgICAgICAgcml2YWwuZ2V0SWQoKSxcbiAgICAgICAgICAgIHNlbGYuZ2V0SWQoKVxuICAgICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5nYW1lTG9vcCh7IGFpRW5hYmxlZDogdHJ1ZSB9KTtcbiIsImZ1bmN0aW9uIGxvZ0FycmF5cyguLi5hcnIpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGFycltpXS5sZW5ndGg7IGogKz0gMSkge1xuICAgICAgY29uc29sZS5sb2coYXJyW2ldW2pdKTtcbiAgICB9XG4gIH1cbn1cblxuLy8gdXNlIG15IHV0aWxpdHkgZnVuY3Rpb24hIDpEXG5cbmZ1bmN0aW9uIGRpZmZlcmVuY2UobnVtMSwgbnVtMikge1xuICByZXR1cm4gTWF0aC5hYnMobnVtMSAtIG51bTIpO1xufVxuXG5leHBvcnQgeyBsb2dBcnJheXMsIGRpZmZlcmVuY2UgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL21vZHVsZXMvRE9NLmpzXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL21vZHVsZXMvYmF0dGxlc2hpcC5qc1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9tb2R1bGVzL3V0aWxpdHkuanNcIik7XG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9tb2R1bGVzL21haW4uanNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=