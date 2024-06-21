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
/* harmony export */   addGameInitBtnEventListener: () => (/* binding */ addGameInitBtnEventListener),
/* harmony export */   getBodyInnerHTML: () => (/* binding */ getBodyInnerHTML),
/* harmony export */   renderGameStart: () => (/* binding */ renderGameStart),
/* harmony export */   renderNotification: () => (/* binding */ renderNotification),
/* harmony export */   renderPassScreen: () => (/* binding */ renderPassScreen),
/* harmony export */   renderPlayerLabels: () => (/* binding */ renderPlayerLabels),
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
    renderPlayerLabels,
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

function renderGameStart() {
  const startingHTML = `
    <div class="body-wrap">
      <header class="flex-col">
        <div class="title-wrap">
          <div class="title">
            <span class="self-victory">Jellyship</span>
            <span class="rival-victory">Battle</span>
          </div>
        </div>
        <div class="notification-wrap">
          <div class="notification">
            <div class="notification-message">Place your/yalls ships</div>
          </div>
        </div>
      </header>
      <main>
        <div class="battlefields">
          <div class="battlefield-self-label self-victory"></div>
          <div class="battlefield battlefield-self">
            <div id="battlefield-table-self" class="battlefield-table"></div>
          </div>
          <div class="battlefield battlefield-rival">
            <div id="battlefield-table-rival" class="battlefield-table"></div>
          </div>
          <div class="battlefield-rival-label rival-victory"></div>
        </div>
      </main>
      <footer>
        © now-forever snowjellyIndustries <span class="heart"><3</span>
      </footer>
    </div>
  `;
  return startingHTML;
}

function addGameInitBtnEventListener(gameInitEvent) {
  document
    .querySelector("#init-form-btn")
    .addEventListener("click", gameInitEvent);
}

function renderPlayerLabels(selfName, rivalName) {
  const selfLabel = document.querySelector(`.battlefield-self-label`);
  const rivalLabel = document.querySelector(`.battlefield-rival-label`);
  selfLabel.textContent = selfName;
  rivalLabel.textContent = rivalName;
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
  let pName = name;

  function setTurn(bool) {
    turn = bool;
  }

  function getTurn() {
    return turn;
  }

  function getName() {
    return pName;
  }

  function setName(str) {
    pName = str;
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
    setName,
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



const game = (0,_battleship__WEBPACK_IMPORTED_MODULE_0__.Game)();

const { self } = game;
const { rival } = game;

function gameLoop({ aiEnabled = false }) {
  const initHTML = (0,_DOM__WEBPACK_IMPORTED_MODULE_1__.getBodyInnerHTML)();
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

  if (!aiEnabled) {
    (0,_DOM__WEBPACK_IMPORTED_MODULE_1__.renderNotification)(
      `It is <span class="${currentTurn.getId()}-victory">${currentTurn.getName()}'s</span> turn, click on <span class="${nextTurn.getId()}-victory">${nextTurn.getName()}'s</span> board to attack`
    );
  } else {
    (0,_DOM__WEBPACK_IMPORTED_MODULE_1__.renderNotification)(
      `<span class="${currentTurn.getId()}-victory">${currentTurn.getName()}</span> Is facing the A.I <span class="${nextTurn.getId()}-victory">${nextTurn.getName()}</span> Good luck!`
    );
  }

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

(0,_DOM__WEBPACK_IMPORTED_MODULE_1__.addGameInitBtnEventListener)((e) => {
  let ai = { aiEnabled: false };
  for (let i = 0; i < e.currentTarget.form.children.length; i += 1) {
    const formItem = e.currentTarget.form[i];
    if (formItem.id === "self") {
      if (formItem.value !== "" && !(formItem.value.length >= 20)) {
        self.setName(formItem.value);
      } else {
        self.setName("John Battlefield");
      }
    }
    if (formItem.id === "rival") {
      if (formItem.value !== "" && !(formItem.value.length >= 20)) {
        rival.setName(formItem.value);
      } else {
        rival.setName("Rival");
      }
    }
    if (formItem.id === "ai-checkbox") {
      if (formItem.validity.valid) {
        ai = { aiEnabled: true };
        rival.setName(`${rival.getName()}.AI`);
      }
    }
    console.log(e.currentTarget.form[i]);

    (0,_DOM__WEBPACK_IMPORTED_MODULE_1__.setBodyInnerHTML)((0,_DOM__WEBPACK_IMPORTED_MODULE_1__.renderGameStart)());
    (0,_DOM__WEBPACK_IMPORTED_MODULE_1__.renderPlayerLabels)(self.getName(), rival.getName());
    gameLoop(ai);
  }
});


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Iiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9UZW1wbGF0ZVRhZy9UZW1wbGF0ZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL1RlbXBsYXRlVGFnL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvY29kZUJsb2NrL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvY29tbWFMaXN0cy9jb21tYUxpc3RzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvY29tbWFMaXN0cy9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL2NvbW1hTGlzdHNBbmQvY29tbWFMaXN0c0FuZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL2NvbW1hTGlzdHNBbmQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9jb21tYUxpc3RzT3IvY29tbWFMaXN0c09yLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvY29tbWFMaXN0c09yL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvaHRtbC9odG1sLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvaHRtbC9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvaW5saW5lQXJyYXlUcmFuc2Zvcm1lci9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL2lubGluZUFycmF5VHJhbnNmb3JtZXIvaW5saW5lQXJyYXlUcmFuc2Zvcm1lci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL2lubGluZUxpc3RzL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvaW5saW5lTGlzdHMvaW5saW5lTGlzdHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9vbmVMaW5lL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvb25lTGluZS9vbmVMaW5lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvb25lTGluZUNvbW1hTGlzdHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9vbmVMaW5lQ29tbWFMaXN0cy9vbmVMaW5lQ29tbWFMaXN0cy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL29uZUxpbmVDb21tYUxpc3RzQW5kL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvb25lTGluZUNvbW1hTGlzdHNBbmQvb25lTGluZUNvbW1hTGlzdHNBbmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9vbmVMaW5lQ29tbWFMaXN0c09yL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvb25lTGluZUNvbW1hTGlzdHNPci9vbmVMaW5lQ29tbWFMaXN0c09yLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvb25lTGluZUlubGluZUxpc3RzL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvb25lTGluZUlubGluZUxpc3RzL29uZUxpbmVJbmxpbmVMaXN0cy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL29uZUxpbmVUcmltL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvb25lTGluZVRyaW0vb25lTGluZVRyaW0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9yZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvcmVtb3ZlTm9uUHJpbnRpbmdWYWx1ZXNUcmFuc2Zvcm1lci9yZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyL3JlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL3JlcGxhY2VTdHJpbmdUcmFuc2Zvcm1lci9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL3JlcGxhY2VTdHJpbmdUcmFuc2Zvcm1lci9yZXBsYWNlU3RyaW5nVHJhbnNmb3JtZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9yZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9yZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIvcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvc2FmZUh0bWwvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9zYWZlSHRtbC9zYWZlSHRtbC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL3NvdXJjZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL3NwbGl0U3RyaW5nVHJhbnNmb3JtZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9zcGxpdFN0cmluZ1RyYW5zZm9ybWVyL3NwbGl0U3RyaW5nVHJhbnNmb3JtZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9zdHJpcEluZGVudC9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL3N0cmlwSW5kZW50L3N0cmlwSW5kZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvc3RyaXBJbmRlbnRUcmFuc2Zvcm1lci9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL3N0cmlwSW5kZW50VHJhbnNmb3JtZXIvc3RyaXBJbmRlbnRUcmFuc2Zvcm1lci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL3N0cmlwSW5kZW50cy9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL3N0cmlwSW5kZW50cy9zdHJpcEluZGVudHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy90cmltUmVzdWx0VHJhbnNmb3JtZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy90cmltUmVzdWx0VHJhbnNmb3JtZXIvdHJpbVJlc3VsdFRyYW5zZm9ybWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9ET00uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2JhdHRsZXNoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL21haW4uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX3RlbXBsYXRlT2JqZWN0ID0gX3RhZ2dlZFRlbXBsYXRlTGl0ZXJhbChbJycsICcnXSwgWycnLCAnJ10pO1xuXG5mdW5jdGlvbiBfdGFnZ2VkVGVtcGxhdGVMaXRlcmFsKHN0cmluZ3MsIHJhdykgeyByZXR1cm4gT2JqZWN0LmZyZWV6ZShPYmplY3QuZGVmaW5lUHJvcGVydGllcyhzdHJpbmdzLCB7IHJhdzogeyB2YWx1ZTogT2JqZWN0LmZyZWV6ZShyYXcpIH0gfSkpOyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbi8qKlxuICogQGNsYXNzIFRlbXBsYXRlVGFnXG4gKiBAY2xhc3NkZXNjIENvbnN1bWVzIGEgcGlwZWxpbmUgb2YgY29tcG9zYWJsZSB0cmFuc2Zvcm1lciBwbHVnaW5zIGFuZCBwcm9kdWNlcyBhIHRlbXBsYXRlIHRhZy5cbiAqL1xudmFyIFRlbXBsYXRlVGFnID0gZnVuY3Rpb24gKCkge1xuICAvKipcbiAgICogY29uc3RydWN0cyBhIHRlbXBsYXRlIHRhZ1xuICAgKiBAY29uc3RydWN0cyBUZW1wbGF0ZVRhZ1xuICAgKiBAcGFyYW0gIHsuLi5PYmplY3R9IFsuLi50cmFuc2Zvcm1lcnNdIC0gYW4gYXJyYXkgb3IgYXJndW1lbnRzIGxpc3Qgb2YgdHJhbnNmb3JtZXJzXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSAgICAgICAgICAgICAgICAgICAgLSBhIHRlbXBsYXRlIHRhZ1xuICAgKi9cbiAgZnVuY3Rpb24gVGVtcGxhdGVUYWcoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCB0cmFuc2Zvcm1lcnMgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIHRyYW5zZm9ybWVyc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgVGVtcGxhdGVUYWcpO1xuXG4gICAgdGhpcy50YWcgPSBmdW5jdGlvbiAoc3RyaW5ncykge1xuICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBleHByZXNzaW9ucyA9IEFycmF5KF9sZW4yID4gMSA/IF9sZW4yIC0gMSA6IDApLCBfa2V5MiA9IDE7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgZXhwcmVzc2lvbnNbX2tleTIgLSAxXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygc3RyaW5ncyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBpZiB0aGUgZmlyc3QgYXJndW1lbnQgcGFzc2VkIGlzIGEgZnVuY3Rpb24sIGFzc3VtZSBpdCBpcyBhIHRlbXBsYXRlIHRhZyBhbmQgcmV0dXJuXG4gICAgICAgIC8vIGFuIGludGVybWVkaWFyeSB0YWcgdGhhdCBwcm9jZXNzZXMgdGhlIHRlbXBsYXRlIHVzaW5nIHRoZSBhZm9yZW1lbnRpb25lZCB0YWcsIHBhc3NpbmcgdGhlXG4gICAgICAgIC8vIHJlc3VsdCB0byBvdXIgdGFnXG4gICAgICAgIHJldHVybiBfdGhpcy5pbnRlcmltVGFnLmJpbmQoX3RoaXMsIHN0cmluZ3MpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHN0cmluZ3MgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIGlmIHRoZSBmaXJzdCBhcmd1bWVudCBwYXNzZWQgaXMgYSBzdHJpbmcsIGp1c3QgdHJhbnNmb3JtIGl0XG4gICAgICAgIHJldHVybiBfdGhpcy50cmFuc2Zvcm1FbmRSZXN1bHQoc3RyaW5ncyk7XG4gICAgICB9XG5cbiAgICAgIC8vIGVsc2UsIHJldHVybiBhIHRyYW5zZm9ybWVkIGVuZCByZXN1bHQgb2YgcHJvY2Vzc2luZyB0aGUgdGVtcGxhdGUgd2l0aCBvdXIgdGFnXG4gICAgICBzdHJpbmdzID0gc3RyaW5ncy5tYXAoX3RoaXMudHJhbnNmb3JtU3RyaW5nLmJpbmQoX3RoaXMpKTtcbiAgICAgIHJldHVybiBfdGhpcy50cmFuc2Zvcm1FbmRSZXN1bHQoc3RyaW5ncy5yZWR1Y2UoX3RoaXMucHJvY2Vzc1N1YnN0aXR1dGlvbnMuYmluZChfdGhpcywgZXhwcmVzc2lvbnMpKSk7XG4gICAgfTtcblxuICAgIC8vIGlmIGZpcnN0IGFyZ3VtZW50IGlzIGFuIGFycmF5LCBleHRydWRlIGl0IGFzIGEgbGlzdCBvZiB0cmFuc2Zvcm1lcnNcbiAgICBpZiAodHJhbnNmb3JtZXJzLmxlbmd0aCA+IDAgJiYgQXJyYXkuaXNBcnJheSh0cmFuc2Zvcm1lcnNbMF0pKSB7XG4gICAgICB0cmFuc2Zvcm1lcnMgPSB0cmFuc2Zvcm1lcnNbMF07XG4gICAgfVxuXG4gICAgLy8gaWYgYW55IHRyYW5zZm9ybWVycyBhcmUgZnVuY3Rpb25zLCB0aGlzIG1lYW5zIHRoZXkgYXJlIG5vdCBpbml0aWF0ZWQgLSBhdXRvbWF0aWNhbGx5IGluaXRpYXRlIHRoZW1cbiAgICB0aGlzLnRyYW5zZm9ybWVycyA9IHRyYW5zZm9ybWVycy5tYXAoZnVuY3Rpb24gKHRyYW5zZm9ybWVyKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHRyYW5zZm9ybWVyID09PSAnZnVuY3Rpb24nID8gdHJhbnNmb3JtZXIoKSA6IHRyYW5zZm9ybWVyO1xuICAgIH0pO1xuXG4gICAgLy8gcmV0dXJuIGFuIEVTMjAxNSB0ZW1wbGF0ZSB0YWdcbiAgICByZXR1cm4gdGhpcy50YWc7XG4gIH1cblxuICAvKipcbiAgICogQXBwbGllcyBhbGwgdHJhbnNmb3JtZXJzIHRvIGEgdGVtcGxhdGUgbGl0ZXJhbCB0YWdnZWQgd2l0aCB0aGlzIG1ldGhvZC5cbiAgICogSWYgYSBmdW5jdGlvbiBpcyBwYXNzZWQgYXMgdGhlIGZpcnN0IGFyZ3VtZW50LCBhc3N1bWVzIHRoZSBmdW5jdGlvbiBpcyBhIHRlbXBsYXRlIHRhZ1xuICAgKiBhbmQgYXBwbGllcyBpdCB0byB0aGUgdGVtcGxhdGUsIHJldHVybmluZyBhIHRlbXBsYXRlIHRhZy5cbiAgICogQHBhcmFtICB7KEZ1bmN0aW9ufFN0cmluZ3xBcnJheTxTdHJpbmc+KX0gc3RyaW5ncyAgICAgICAgLSBFaXRoZXIgYSB0ZW1wbGF0ZSB0YWcgb3IgYW4gYXJyYXkgY29udGFpbmluZyB0ZW1wbGF0ZSBzdHJpbmdzIHNlcGFyYXRlZCBieSBpZGVudGlmaWVyXG4gICAqIEBwYXJhbSAgey4uLip9ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmV4cHJlc3Npb25zIC0gT3B0aW9uYWwgbGlzdCBvZiBzdWJzdGl0dXRpb24gdmFsdWVzLlxuICAgKiBAcmV0dXJuIHsoU3RyaW5nfEZ1bmN0aW9uKX0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIEVpdGhlciBhbiBpbnRlcm1lZGlhcnkgdGFnIGZ1bmN0aW9uIG9yIHRoZSByZXN1bHRzIG9mIHByb2Nlc3NpbmcgdGhlIHRlbXBsYXRlLlxuICAgKi9cblxuXG4gIF9jcmVhdGVDbGFzcyhUZW1wbGF0ZVRhZywgW3tcbiAgICBrZXk6ICdpbnRlcmltVGFnJyxcblxuXG4gICAgLyoqXG4gICAgICogQW4gaW50ZXJtZWRpYXJ5IHRlbXBsYXRlIHRhZyB0aGF0IHJlY2VpdmVzIGEgdGVtcGxhdGUgdGFnIGFuZCBwYXNzZXMgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSB0ZW1wbGF0ZSB3aXRoIHRoZSByZWNlaXZlZFxuICAgICAqIHRlbXBsYXRlIHRhZyB0byBvdXIgb3duIHRlbXBsYXRlIHRhZy5cbiAgICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gICAgICAgIG5leHRUYWcgICAgICAgICAgLSB0aGUgcmVjZWl2ZWQgdGVtcGxhdGUgdGFnXG4gICAgICogQHBhcmFtICB7QXJyYXk8U3RyaW5nPn0gICB0ZW1wbGF0ZSAgICAgICAgIC0gdGhlIHRlbXBsYXRlIHRvIHByb2Nlc3NcbiAgICAgKiBAcGFyYW0gIHsuLi4qfSAgICAgICAgICAgIC4uLnN1YnN0aXR1dGlvbnMgLSBgc3Vic3RpdHV0aW9uc2AgaXMgYW4gYXJyYXkgb2YgYWxsIHN1YnN0aXR1dGlvbnMgaW4gdGhlIHRlbXBsYXRlXG4gICAgICogQHJldHVybiB7Kn0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gdGhlIGZpbmFsIHByb2Nlc3NlZCB2YWx1ZVxuICAgICAqL1xuICAgIHZhbHVlOiBmdW5jdGlvbiBpbnRlcmltVGFnKHByZXZpb3VzVGFnLCB0ZW1wbGF0ZSkge1xuICAgICAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBzdWJzdGl0dXRpb25zID0gQXJyYXkoX2xlbjMgPiAyID8gX2xlbjMgLSAyIDogMCksIF9rZXkzID0gMjsgX2tleTMgPCBfbGVuMzsgX2tleTMrKykge1xuICAgICAgICBzdWJzdGl0dXRpb25zW19rZXkzIC0gMl0gPSBhcmd1bWVudHNbX2tleTNdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy50YWcoX3RlbXBsYXRlT2JqZWN0LCBwcmV2aW91c1RhZy5hcHBseSh1bmRlZmluZWQsIFt0ZW1wbGF0ZV0uY29uY2F0KHN1YnN0aXR1dGlvbnMpKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGVyZm9ybXMgYnVsayBwcm9jZXNzaW5nIG9uIHRoZSB0YWdnZWQgdGVtcGxhdGUsIHRyYW5zZm9ybWluZyBlYWNoIHN1YnN0aXR1dGlvbiBhbmQgdGhlblxuICAgICAqIGNvbmNhdGVuYXRpbmcgdGhlIHJlc3VsdGluZyB2YWx1ZXMgaW50byBhIHN0cmluZy5cbiAgICAgKiBAcGFyYW0gIHtBcnJheTwqPn0gc3Vic3RpdHV0aW9ucyAtIGFuIGFycmF5IG9mIGFsbCByZW1haW5pbmcgc3Vic3RpdHV0aW9ucyBwcmVzZW50IGluIHRoaXMgdGVtcGxhdGVcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgcmVzdWx0U29GYXIgICAtIHRoaXMgaXRlcmF0aW9uJ3MgcmVzdWx0IHN0cmluZyBzbyBmYXJcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgcmVtYWluaW5nUGFydCAtIHRoZSB0ZW1wbGF0ZSBjaHVuayBhZnRlciB0aGUgY3VycmVudCBzdWJzdGl0dXRpb25cbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAtIHRoZSByZXN1bHQgb2Ygam9pbmluZyB0aGlzIGl0ZXJhdGlvbidzIHByb2Nlc3NlZCBzdWJzdGl0dXRpb24gd2l0aCB0aGUgcmVzdWx0XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ3Byb2Nlc3NTdWJzdGl0dXRpb25zJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcHJvY2Vzc1N1YnN0aXR1dGlvbnMoc3Vic3RpdHV0aW9ucywgcmVzdWx0U29GYXIsIHJlbWFpbmluZ1BhcnQpIHtcbiAgICAgIHZhciBzdWJzdGl0dXRpb24gPSB0aGlzLnRyYW5zZm9ybVN1YnN0aXR1dGlvbihzdWJzdGl0dXRpb25zLnNoaWZ0KCksIHJlc3VsdFNvRmFyKTtcbiAgICAgIHJldHVybiAnJy5jb25jYXQocmVzdWx0U29GYXIsIHN1YnN0aXR1dGlvbiwgcmVtYWluaW5nUGFydCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSXRlcmF0ZSB0aHJvdWdoIGVhY2ggdHJhbnNmb3JtZXIsIGFwcGx5aW5nIHRoZSB0cmFuc2Zvcm1lcidzIGBvblN0cmluZ2AgbWV0aG9kIHRvIHRoZSB0ZW1wbGF0ZVxuICAgICAqIHN0cmluZ3MgYmVmb3JlIGFsbCBzdWJzdGl0dXRpb25zIGFyZSBwcm9jZXNzZWQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9ICBzdHIgLSBUaGUgaW5wdXQgc3RyaW5nXG4gICAgICogQHJldHVybiB7U3RyaW5nfSAgICAgLSBUaGUgZmluYWwgcmVzdWx0cyBvZiBwcm9jZXNzaW5nIGVhY2ggdHJhbnNmb3JtZXJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAndHJhbnNmb3JtU3RyaW5nJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdHJhbnNmb3JtU3RyaW5nKHN0cikge1xuICAgICAgdmFyIGNiID0gZnVuY3Rpb24gY2IocmVzLCB0cmFuc2Zvcm0pIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybS5vblN0cmluZyA/IHRyYW5zZm9ybS5vblN0cmluZyhyZXMpIDogcmVzO1xuICAgICAgfTtcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybWVycy5yZWR1Y2UoY2IsIHN0cik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2hlbiBhIHN1YnN0aXR1dGlvbiBpcyBlbmNvdW50ZXJlZCwgaXRlcmF0ZXMgdGhyb3VnaCBlYWNoIHRyYW5zZm9ybWVyIGFuZCBhcHBsaWVzIHRoZSB0cmFuc2Zvcm1lcidzXG4gICAgICogYG9uU3Vic3RpdHV0aW9uYCBtZXRob2QgdG8gdGhlIHN1YnN0aXR1dGlvbi5cbiAgICAgKiBAcGFyYW0gIHsqfSAgICAgIHN1YnN0aXR1dGlvbiAtIFRoZSBjdXJyZW50IHN1YnN0aXR1dGlvblxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gcmVzdWx0U29GYXIgIC0gVGhlIHJlc3VsdCB1cCB0byBhbmQgZXhjbHVkaW5nIHRoaXMgc3Vic3RpdHV0aW9uLlxuICAgICAqIEByZXR1cm4geyp9ICAgICAgICAgICAgICAgICAgIC0gVGhlIGZpbmFsIHJlc3VsdCBvZiBhcHBseWluZyBhbGwgc3Vic3RpdHV0aW9uIHRyYW5zZm9ybWF0aW9ucy5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAndHJhbnNmb3JtU3Vic3RpdHV0aW9uJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdHJhbnNmb3JtU3Vic3RpdHV0aW9uKHN1YnN0aXR1dGlvbiwgcmVzdWx0U29GYXIpIHtcbiAgICAgIHZhciBjYiA9IGZ1bmN0aW9uIGNiKHJlcywgdHJhbnNmb3JtKSB7XG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm0ub25TdWJzdGl0dXRpb24gPyB0cmFuc2Zvcm0ub25TdWJzdGl0dXRpb24ocmVzLCByZXN1bHRTb0ZhcikgOiByZXM7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtZXJzLnJlZHVjZShjYiwgc3Vic3RpdHV0aW9uKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJdGVyYXRlcyB0aHJvdWdoIGVhY2ggdHJhbnNmb3JtZXIsIGFwcGx5aW5nIHRoZSB0cmFuc2Zvcm1lcidzIGBvbkVuZFJlc3VsdGAgbWV0aG9kIHRvIHRoZVxuICAgICAqIHRlbXBsYXRlIGxpdGVyYWwgYWZ0ZXIgYWxsIHN1YnN0aXR1dGlvbnMgaGF2ZSBmaW5pc2hlZCBwcm9jZXNzaW5nLlxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gZW5kUmVzdWx0IC0gVGhlIHByb2Nlc3NlZCB0ZW1wbGF0ZSwganVzdCBiZWZvcmUgaXQgaXMgcmV0dXJuZWQgZnJvbSB0aGUgdGFnXG4gICAgICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAgLSBUaGUgZmluYWwgcmVzdWx0cyBvZiBwcm9jZXNzaW5nIGVhY2ggdHJhbnNmb3JtZXJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAndHJhbnNmb3JtRW5kUmVzdWx0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdHJhbnNmb3JtRW5kUmVzdWx0KGVuZFJlc3VsdCkge1xuICAgICAgdmFyIGNiID0gZnVuY3Rpb24gY2IocmVzLCB0cmFuc2Zvcm0pIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybS5vbkVuZFJlc3VsdCA/IHRyYW5zZm9ybS5vbkVuZFJlc3VsdChyZXMpIDogcmVzO1xuICAgICAgfTtcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybWVycy5yZWR1Y2UoY2IsIGVuZFJlc3VsdCk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFRlbXBsYXRlVGFnO1xufSgpO1xuXG5leHBvcnQgZGVmYXVsdCBUZW1wbGF0ZVRhZztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OVVaVzF3YkdGMFpWUmhaeTlVWlcxd2JHRjBaVlJoWnk1cWN5SmRMQ0p1WVcxbGN5STZXeUpVWlcxd2JHRjBaVlJoWnlJc0luUnlZVzV6Wm05eWJXVnljeUlzSW5SaFp5SXNJbk4wY21sdVozTWlMQ0psZUhCeVpYTnphVzl1Y3lJc0ltbHVkR1Z5YVcxVVlXY2lMQ0ppYVc1a0lpd2lkSEpoYm5ObWIzSnRSVzVrVW1WemRXeDBJaXdpYldGd0lpd2lkSEpoYm5ObWIzSnRVM1J5YVc1bklpd2ljbVZrZFdObElpd2ljSEp2WTJWemMxTjFZbk4wYVhSMWRHbHZibk1pTENKc1pXNW5kR2dpTENKQmNuSmhlU0lzSW1selFYSnlZWGtpTENKMGNtRnVjMlp2Y20xbGNpSXNJbkJ5WlhacGIzVnpWR0ZuSWl3aWRHVnRjR3hoZEdVaUxDSnpkV0p6ZEdsMGRYUnBiMjV6SWl3aWNtVnpkV3gwVTI5R1lYSWlMQ0p5WlcxaGFXNXBibWRRWVhKMElpd2ljM1ZpYzNScGRIVjBhVzl1SWl3aWRISmhibk5tYjNKdFUzVmljM1JwZEhWMGFXOXVJaXdpYzJocFpuUWlMQ0pqYjI1allYUWlMQ0p6ZEhJaUxDSmpZaUlzSW5KbGN5SXNJblJ5WVc1elptOXliU0lzSW05dVUzUnlhVzVuSWl3aWIyNVRkV0p6ZEdsMGRYUnBiMjRpTENKbGJtUlNaWE4xYkhRaUxDSnZia1Z1WkZKbGMzVnNkQ0pkTENKdFlYQndhVzVuY3lJNklqczdPenM3T3pzN1FVRkJRVHM3T3p0SlFVbHhRa0VzVnp0QlFVTnVRanM3T3pzN08wRkJUVUVzZVVKQlFUWkNPMEZCUVVFN08wRkJRVUVzYzBOQlFXUkRMRmxCUVdNN1FVRkJaRUVzYTBKQlFXTTdRVUZCUVRzN1FVRkJRVHM3UVVGQlFTeFRRWFZDTjBKRExFZEJka0kyUWl4SFFYVkNka0lzVlVGQlEwTXNUMEZCUkN4RlFVRTJRanRCUVVGQkxIbERRVUZvUWtNc1YwRkJaMEk3UVVGQmFFSkJMRzFDUVVGblFqdEJRVUZCT3p0QlFVTnFReXhWUVVGSkxFOUJRVTlFTEU5QlFWQXNTMEZCYlVJc1ZVRkJka0lzUlVGQmJVTTdRVUZEYWtNN1FVRkRRVHRCUVVOQk8wRkJRMEVzWlVGQlR5eE5RVUZMUlN4VlFVRk1MRU5CUVdkQ1F5eEpRVUZvUWl4RFFVRnhRaXhMUVVGeVFpeEZRVUV5UWtnc1QwRkJNMElzUTBGQlVEdEJRVU5FT3p0QlFVVkVMRlZCUVVrc1QwRkJUMEVzVDBGQlVDeExRVUZ0UWl4UlFVRjJRaXhGUVVGcFF6dEJRVU12UWp0QlFVTkJMR1ZCUVU4c1RVRkJTMGtzYTBKQlFVd3NRMEZCZDBKS0xFOUJRWGhDTEVOQlFWQTdRVUZEUkRzN1FVRkZSRHRCUVVOQlFTeG5Ra0ZCVlVFc1VVRkJVVXNzUjBGQlVpeERRVUZaTEUxQlFVdERMR1ZCUVV3c1EwRkJjVUpJTEVsQlFYSkNMRU5CUVRCQ0xFdEJRVEZDTEVOQlFWb3NRMEZCVmp0QlFVTkJMR0ZCUVU4c1RVRkJTME1zYTBKQlFVd3NRMEZEVEVvc1VVRkJVVThzVFVGQlVpeERRVUZsTEUxQlFVdERMRzlDUVVGTUxFTkJRVEJDVEN4SlFVRXhRaXhEUVVFclFpeExRVUV2UWl4RlFVRnhRMFlzVjBGQmNrTXNRMEZCWml4RFFVUkxMRU5CUVZBN1FVRkhSQ3hMUVhwRE5FSTdPMEZCUXpOQ08wRkJRMEVzVVVGQlNVZ3NZVUZCWVZjc1RVRkJZaXhIUVVGelFpeERRVUYwUWl4SlFVRXlRa01zVFVGQlRVTXNUMEZCVGl4RFFVRmpZaXhoUVVGaExFTkJRV0lzUTBGQlpDeERRVUV2UWl4RlFVRXJSRHRCUVVNM1JFRXNjVUpCUVdWQkxHRkJRV0VzUTBGQllpeERRVUZtTzBGQlEwUTdPMEZCUlVRN1FVRkRRU3hUUVVGTFFTeFpRVUZNTEVkQlFXOUNRU3hoUVVGaFR5eEhRVUZpTEVOQlFXbENMSFZDUVVGbE8wRkJRMnhFTEdGQlFVOHNUMEZCVDA4c1YwRkJVQ3hMUVVGMVFpeFZRVUYyUWl4SFFVRnZRMEVzWVVGQmNFTXNSMEZCYjBSQkxGZEJRVE5FTzBGQlEwUXNTMEZHYlVJc1EwRkJjRUk3TzBGQlNVRTdRVUZEUVN4WFFVRlBMRXRCUVV0aUxFZEJRVm83UVVGRFJEczdRVUZGUkRzN096czdPenM3T3pzN096czdRVUUwUWtFN096czdPenM3T3l0Q1FWRlhZeXhYTEVWQlFXRkRMRkVzUlVGQk5FSTdRVUZCUVN4NVEwRkJaa01zWVVGQlpUdEJRVUZtUVN4eFFrRkJaVHRCUVVGQk96dEJRVU5zUkN4aFFVRlBMRXRCUVV0b1FpeEhRVUZhTEd0Q1FVRnJRbU1zT0VKQlFWbERMRkZCUVZvc1UwRkJlVUpETEdGQlFYcENMRVZCUVd4Q08wRkJRMFE3TzBGQlJVUTdPenM3T3pzN096czdPM2xEUVZGeFFrRXNZU3hGUVVGbFF5eFhMRVZCUVdGRExHRXNSVUZCWlR0QlFVTTVSQ3hWUVVGTlF5eGxRVUZsTEV0QlFVdERMSEZDUVVGTUxFTkJRMjVDU2l4alFVRmpTeXhMUVVGa0xFVkJSRzFDTEVWQlJXNUNTaXhYUVVadFFpeERRVUZ5UWp0QlFVbEJMR0ZCUVU4c1IwRkJSMHNzVFVGQlNDeERRVUZWVEN4WFFVRldMRVZCUVhWQ1JTeFpRVUYyUWl4RlFVRnhRMFFzWVVGQmNrTXNRMEZCVUR0QlFVTkVPenRCUVVWRU96czdPenM3T3pzN2IwTkJUV2RDU3l4SExFVkJRVXM3UVVGRGJrSXNWVUZCVFVNc1MwRkJTeXhUUVVGTVFTeEZRVUZMTEVOQlFVTkRMRWRCUVVRc1JVRkJUVU1zVTBGQlRqdEJRVUZCTEdWQlExUkJMRlZCUVZWRExGRkJRVllzUjBGQmNVSkVMRlZCUVZWRExGRkJRVllzUTBGQmJVSkdMRWRCUVc1Q0xFTkJRWEpDTEVkQlFTdERRU3hIUVVSMFF6dEJRVUZCTEU5QlFWZzdRVUZGUVN4aFFVRlBMRXRCUVVzeFFpeFpRVUZNTEVOQlFXdENVeXhOUVVGc1FpeERRVUY1UW1kQ0xFVkJRWHBDTEVWQlFUWkNSQ3hIUVVFM1FpeERRVUZRTzBGQlEwUTdPMEZCUlVRN096czdPenM3T3pzN01FTkJUM05DU2l4WkxFVkJRV05HTEZjc1JVRkJZVHRCUVVNdlF5eFZRVUZOVHl4TFFVRkxMRk5CUVV4QkxFVkJRVXNzUTBGQlEwTXNSMEZCUkN4RlFVRk5ReXhUUVVGT08wRkJRVUVzWlVGRFZFRXNWVUZCVlVVc1kwRkJWaXhIUVVOSlJpeFZRVUZWUlN4alFVRldMRU5CUVhsQ1NDeEhRVUY2UWl4RlFVRTRRbElzVjBGQk9VSXNRMEZFU2l4SFFVVkpVU3hIUVVoTE8wRkJRVUVzVDBGQldEdEJRVWxCTEdGQlFVOHNTMEZCU3pGQ0xGbEJRVXdzUTBGQmEwSlRMRTFCUVd4Q0xFTkJRWGxDWjBJc1JVRkJla0lzUlVGQk5rSk1MRmxCUVRkQ0xFTkJRVkE3UVVGRFJEczdRVUZGUkRzN096czdPenM3TzNWRFFVMXRRbFVzVXl4RlFVRlhPMEZCUXpWQ0xGVkJRVTFNTEV0QlFVc3NVMEZCVEVFc1JVRkJTeXhEUVVGRFF5eEhRVUZFTEVWQlFVMURMRk5CUVU0N1FVRkJRU3hsUVVOVVFTeFZRVUZWU1N4WFFVRldMRWRCUVhkQ1NpeFZRVUZWU1N4WFFVRldMRU5CUVhOQ1RDeEhRVUYwUWl4RFFVRjRRaXhIUVVGeFJFRXNSMEZFTlVNN1FVRkJRU3hQUVVGWU8wRkJSVUVzWVVGQlR5eExRVUZMTVVJc1dVRkJUQ3hEUVVGclFsTXNUVUZCYkVJc1EwRkJlVUpuUWl4RlFVRjZRaXhGUVVFMlFrc3NVMEZCTjBJc1EwRkJVRHRCUVVORU96czdPenM3WlVGdVNHdENMMElzVnlJc0ltWnBiR1VpT2lKVVpXMXdiR0YwWlZSaFp5NXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4cUtseHVJQ29nUUdOc1lYTnpJRlJsYlhCc1lYUmxWR0ZuWEc0Z0tpQkFZMnhoYzNOa1pYTmpJRU52Ym5OMWJXVnpJR0VnY0dsd1pXeHBibVVnYjJZZ1kyOXRjRzl6WVdKc1pTQjBjbUZ1YzJadmNtMWxjaUJ3YkhWbmFXNXpJR0Z1WkNCd2NtOWtkV05sY3lCaElIUmxiWEJzWVhSbElIUmhaeTVjYmlBcUwxeHVaWGh3YjNKMElHUmxabUYxYkhRZ1kyeGhjM01nVkdWdGNHeGhkR1ZVWVdjZ2UxeHVJQ0F2S2lwY2JpQWdJQ29nWTI5dWMzUnlkV04wY3lCaElIUmxiWEJzWVhSbElIUmhaMXh1SUNBZ0tpQkFZMjl1YzNSeWRXTjBjeUJVWlcxd2JHRjBaVlJoWjF4dUlDQWdLaUJBY0dGeVlXMGdJSHN1TGk1UFltcGxZM1I5SUZzdUxpNTBjbUZ1YzJadmNtMWxjbk5kSUMwZ1lXNGdZWEp5WVhrZ2IzSWdZWEpuZFcxbGJuUnpJR3hwYzNRZ2IyWWdkSEpoYm5ObWIzSnRaWEp6WEc0Z0lDQXFJRUJ5WlhSMWNtNGdlMFoxYm1OMGFXOXVmU0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnTFNCaElIUmxiWEJzWVhSbElIUmhaMXh1SUNBZ0tpOWNiaUFnWTI5dWMzUnlkV04wYjNJb0xpNHVkSEpoYm5ObWIzSnRaWEp6S1NCN1hHNGdJQ0FnTHk4Z2FXWWdabWx5YzNRZ1lYSm5kVzFsYm5RZ2FYTWdZVzRnWVhKeVlYa3NJR1Y0ZEhKMVpHVWdhWFFnWVhNZ1lTQnNhWE4wSUc5bUlIUnlZVzV6Wm05eWJXVnljMXh1SUNBZ0lHbG1JQ2gwY21GdWMyWnZjbTFsY25NdWJHVnVaM1JvSUQ0Z01DQW1KaUJCY25KaGVTNXBjMEZ5Y21GNUtIUnlZVzV6Wm05eWJXVnljMXN3WFNrcElIdGNiaUFnSUNBZ0lIUnlZVzV6Wm05eWJXVnljeUE5SUhSeVlXNXpabTl5YldWeWMxc3dYVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJwWmlCaGJua2dkSEpoYm5ObWIzSnRaWEp6SUdGeVpTQm1kVzVqZEdsdmJuTXNJSFJvYVhNZ2JXVmhibk1nZEdobGVTQmhjbVVnYm05MElHbHVhWFJwWVhSbFpDQXRJR0YxZEc5dFlYUnBZMkZzYkhrZ2FXNXBkR2xoZEdVZ2RHaGxiVnh1SUNBZ0lIUm9hWE11ZEhKaGJuTm1iM0p0WlhKeklEMGdkSEpoYm5ObWIzSnRaWEp6TG0xaGNDaDBjbUZ1YzJadmNtMWxjaUE5UGlCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnZEhsd1pXOW1JSFJ5WVc1elptOXliV1Z5SUQwOVBTQW5ablZ1WTNScGIyNG5JRDhnZEhKaGJuTm1iM0p0WlhJb0tTQTZJSFJ5WVc1elptOXliV1Z5TzF4dUlDQWdJSDBwTzF4dVhHNGdJQ0FnTHk4Z2NtVjBkWEp1SUdGdUlFVlRNakF4TlNCMFpXMXdiR0YwWlNCMFlXZGNiaUFnSUNCeVpYUjFjbTRnZEdocGN5NTBZV2M3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1FYQndiR2xsY3lCaGJHd2dkSEpoYm5ObWIzSnRaWEp6SUhSdklHRWdkR1Z0Y0d4aGRHVWdiR2wwWlhKaGJDQjBZV2RuWldRZ2QybDBhQ0IwYUdseklHMWxkR2h2WkM1Y2JpQWdJQ29nU1dZZ1lTQm1kVzVqZEdsdmJpQnBjeUJ3WVhOelpXUWdZWE1nZEdobElHWnBjbk4wSUdGeVozVnRaVzUwTENCaGMzTjFiV1Z6SUhSb1pTQm1kVzVqZEdsdmJpQnBjeUJoSUhSbGJYQnNZWFJsSUhSaFoxeHVJQ0FnS2lCaGJtUWdZWEJ3YkdsbGN5QnBkQ0IwYnlCMGFHVWdkR1Z0Y0d4aGRHVXNJSEpsZEhWeWJtbHVaeUJoSUhSbGJYQnNZWFJsSUhSaFp5NWNiaUFnSUNvZ1FIQmhjbUZ0SUNCN0tFWjFibU4wYVc5dWZGTjBjbWx1WjN4QmNuSmhlVHhUZEhKcGJtYytLWDBnYzNSeWFXNW5jeUFnSUNBZ0lDQWdMU0JGYVhSb1pYSWdZU0IwWlcxd2JHRjBaU0IwWVdjZ2IzSWdZVzRnWVhKeVlYa2dZMjl1ZEdGcGJtbHVaeUIwWlcxd2JHRjBaU0J6ZEhKcGJtZHpJSE5sY0dGeVlYUmxaQ0JpZVNCcFpHVnVkR2xtYVdWeVhHNGdJQ0FxSUVCd1lYSmhiU0FnZXk0dUxpcDlJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQzR1TG1WNGNISmxjM05wYjI1eklDMGdUM0IwYVc5dVlXd2diR2x6ZENCdlppQnpkV0p6ZEdsMGRYUnBiMjRnZG1Gc2RXVnpMbHh1SUNBZ0tpQkFjbVYwZFhKdUlIc29VM1J5YVc1bmZFWjFibU4wYVc5dUtYMGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F0SUVWcGRHaGxjaUJoYmlCcGJuUmxjbTFsWkdsaGNua2dkR0ZuSUdaMWJtTjBhVzl1SUc5eUlIUm9aU0J5WlhOMWJIUnpJRzltSUhCeWIyTmxjM05wYm1jZ2RHaGxJSFJsYlhCc1lYUmxMbHh1SUNBZ0tpOWNiaUFnZEdGbklEMGdLSE4wY21sdVozTXNJQzR1TG1WNGNISmxjM05wYjI1ektTQTlQaUI3WEc0Z0lDQWdhV1lnS0hSNWNHVnZaaUJ6ZEhKcGJtZHpJRDA5UFNBblpuVnVZM1JwYjI0bktTQjdYRzRnSUNBZ0lDQXZMeUJwWmlCMGFHVWdabWx5YzNRZ1lYSm5kVzFsYm5RZ2NHRnpjMlZrSUdseklHRWdablZ1WTNScGIyNHNJR0Z6YzNWdFpTQnBkQ0JwY3lCaElIUmxiWEJzWVhSbElIUmhaeUJoYm1RZ2NtVjBkWEp1WEc0Z0lDQWdJQ0F2THlCaGJpQnBiblJsY20xbFpHbGhjbmtnZEdGbklIUm9ZWFFnY0hKdlkyVnpjMlZ6SUhSb1pTQjBaVzF3YkdGMFpTQjFjMmx1WnlCMGFHVWdZV1p2Y21WdFpXNTBhVzl1WldRZ2RHRm5MQ0J3WVhOemFXNW5JSFJvWlZ4dUlDQWdJQ0FnTHk4Z2NtVnpkV3gwSUhSdklHOTFjaUIwWVdkY2JpQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxtbHVkR1Z5YVcxVVlXY3VZbWx1WkNoMGFHbHpMQ0J6ZEhKcGJtZHpLVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnBaaUFvZEhsd1pXOW1JSE4wY21sdVozTWdQVDA5SUNkemRISnBibWNuS1NCN1hHNGdJQ0FnSUNBdkx5QnBaaUIwYUdVZ1ptbHljM1FnWVhKbmRXMWxiblFnY0dGemMyVmtJR2x6SUdFZ2MzUnlhVzVuTENCcWRYTjBJSFJ5WVc1elptOXliU0JwZEZ4dUlDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdWRISmhibk5tYjNKdFJXNWtVbVZ6ZFd4MEtITjBjbWx1WjNNcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUM4dklHVnNjMlVzSUhKbGRIVnliaUJoSUhSeVlXNXpabTl5YldWa0lHVnVaQ0J5WlhOMWJIUWdiMllnY0hKdlkyVnpjMmx1WnlCMGFHVWdkR1Z0Y0d4aGRHVWdkMmwwYUNCdmRYSWdkR0ZuWEc0Z0lDQWdjM1J5YVc1bmN5QTlJSE4wY21sdVozTXViV0Z3S0hSb2FYTXVkSEpoYm5ObWIzSnRVM1J5YVc1bkxtSnBibVFvZEdocGN5a3BPMXh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMblJ5WVc1elptOXliVVZ1WkZKbGMzVnNkQ2hjYmlBZ0lDQWdJSE4wY21sdVozTXVjbVZrZFdObEtIUm9hWE11Y0hKdlkyVnpjMU4xWW5OMGFYUjFkR2x2Ym5NdVltbHVaQ2gwYUdsekxDQmxlSEJ5WlhOemFXOXVjeWtwTEZ4dUlDQWdJQ2s3WEc0Z0lIMDdYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFRnVJR2x1ZEdWeWJXVmthV0Z5ZVNCMFpXMXdiR0YwWlNCMFlXY2dkR2hoZENCeVpXTmxhWFpsY3lCaElIUmxiWEJzWVhSbElIUmhaeUJoYm1RZ2NHRnpjMlZ6SUhSb1pTQnlaWE4xYkhRZ2IyWWdZMkZzYkdsdVp5QjBhR1VnZEdWdGNHeGhkR1VnZDJsMGFDQjBhR1VnY21WalpXbDJaV1JjYmlBZ0lDb2dkR1Z0Y0d4aGRHVWdkR0ZuSUhSdklHOTFjaUJ2ZDI0Z2RHVnRjR3hoZEdVZ2RHRm5MbHh1SUNBZ0tpQkFjR0Z5WVcwZ0lIdEdkVzVqZEdsdmJuMGdJQ0FnSUNBZ0lHNWxlSFJVWVdjZ0lDQWdJQ0FnSUNBZ0xTQjBhR1VnY21WalpXbDJaV1FnZEdWdGNHeGhkR1VnZEdGblhHNGdJQ0FxSUVCd1lYSmhiU0FnZTBGeWNtRjVQRk4wY21sdVp6NTlJQ0FnZEdWdGNHeGhkR1VnSUNBZ0lDQWdJQ0F0SUhSb1pTQjBaVzF3YkdGMFpTQjBieUJ3Y205alpYTnpYRzRnSUNBcUlFQndZWEpoYlNBZ2V5NHVMaXA5SUNBZ0lDQWdJQ0FnSUNBZ0xpNHVjM1ZpYzNScGRIVjBhVzl1Y3lBdElHQnpkV0p6ZEdsMGRYUnBiMjV6WUNCcGN5QmhiaUJoY25KaGVTQnZaaUJoYkd3Z2MzVmljM1JwZEhWMGFXOXVjeUJwYmlCMGFHVWdkR1Z0Y0d4aGRHVmNiaUFnSUNvZ1FISmxkSFZ5YmlCN0tuMGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUMwZ2RHaGxJR1pwYm1Gc0lIQnliMk5sYzNObFpDQjJZV3gxWlZ4dUlDQWdLaTljYmlBZ2FXNTBaWEpwYlZSaFp5aHdjbVYyYVc5MWMxUmhaeXdnZEdWdGNHeGhkR1VzSUM0dUxuTjFZbk4wYVhSMWRHbHZibk1wSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1MFlXZGdKSHR3Y21WMmFXOTFjMVJoWnloMFpXMXdiR0YwWlN3Z0xpNHVjM1ZpYzNScGRIVjBhVzl1Y3lsOVlEdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJRWlhKbWIzSnRjeUJpZFd4cklIQnliMk5sYzNOcGJtY2diMjRnZEdobElIUmhaMmRsWkNCMFpXMXdiR0YwWlN3Z2RISmhibk5tYjNKdGFXNW5JR1ZoWTJnZ2MzVmljM1JwZEhWMGFXOXVJR0Z1WkNCMGFHVnVYRzRnSUNBcUlHTnZibU5oZEdWdVlYUnBibWNnZEdobElISmxjM1ZzZEdsdVp5QjJZV3gxWlhNZ2FXNTBieUJoSUhOMGNtbHVaeTVjYmlBZ0lDb2dRSEJoY21GdElDQjdRWEp5WVhrOEtqNTlJSE4xWW5OMGFYUjFkR2x2Ym5NZ0xTQmhiaUJoY25KaGVTQnZaaUJoYkd3Z2NtVnRZV2x1YVc1bklITjFZbk4wYVhSMWRHbHZibk1nY0hKbGMyVnVkQ0JwYmlCMGFHbHpJSFJsYlhCc1lYUmxYRzRnSUNBcUlFQndZWEpoYlNBZ2UxTjBjbWx1WjMwZ0lDQnlaWE4xYkhSVGIwWmhjaUFnSUMwZ2RHaHBjeUJwZEdWeVlYUnBiMjRuY3lCeVpYTjFiSFFnYzNSeWFXNW5JSE52SUdaaGNseHVJQ0FnS2lCQWNHRnlZVzBnSUh0VGRISnBibWQ5SUNBZ2NtVnRZV2x1YVc1blVHRnlkQ0F0SUhSb1pTQjBaVzF3YkdGMFpTQmphSFZ1YXlCaFpuUmxjaUIwYUdVZ1kzVnljbVZ1ZENCemRXSnpkR2wwZFhScGIyNWNiaUFnSUNvZ1FISmxkSFZ5YmlCN1UzUnlhVzVuZlNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnTFNCMGFHVWdjbVZ6ZFd4MElHOW1JR3B2YVc1cGJtY2dkR2hwY3lCcGRHVnlZWFJwYjI0bmN5QndjbTlqWlhOelpXUWdjM1ZpYzNScGRIVjBhVzl1SUhkcGRHZ2dkR2hsSUhKbGMzVnNkRnh1SUNBZ0tpOWNiaUFnY0hKdlkyVnpjMU4xWW5OMGFYUjFkR2x2Ym5Nb2MzVmljM1JwZEhWMGFXOXVjeXdnY21WemRXeDBVMjlHWVhJc0lISmxiV0ZwYm1sdVoxQmhjblFwSUh0Y2JpQWdJQ0JqYjI1emRDQnpkV0p6ZEdsMGRYUnBiMjRnUFNCMGFHbHpMblJ5WVc1elptOXliVk4xWW5OMGFYUjFkR2x2YmloY2JpQWdJQ0FnSUhOMVluTjBhWFIxZEdsdmJuTXVjMmhwWm5Rb0tTeGNiaUFnSUNBZ0lISmxjM1ZzZEZOdlJtRnlMRnh1SUNBZ0lDazdYRzRnSUNBZ2NtVjBkWEp1SUNjbkxtTnZibU5oZENoeVpYTjFiSFJUYjBaaGNpd2djM1ZpYzNScGRIVjBhVzl1TENCeVpXMWhhVzVwYm1kUVlYSjBLVHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCSmRHVnlZWFJsSUhSb2NtOTFaMmdnWldGamFDQjBjbUZ1YzJadmNtMWxjaXdnWVhCd2JIbHBibWNnZEdobElIUnlZVzV6Wm05eWJXVnlKM01nWUc5dVUzUnlhVzVuWUNCdFpYUm9iMlFnZEc4Z2RHaGxJSFJsYlhCc1lYUmxYRzRnSUNBcUlITjBjbWx1WjNNZ1ltVm1iM0psSUdGc2JDQnpkV0p6ZEdsMGRYUnBiMjV6SUdGeVpTQndjbTlqWlhOelpXUXVYRzRnSUNBcUlFQndZWEpoYlNCN1UzUnlhVzVuZlNBZ2MzUnlJQzBnVkdobElHbHVjSFYwSUhOMGNtbHVaMXh1SUNBZ0tpQkFjbVYwZFhKdUlIdFRkSEpwYm1kOUlDQWdJQ0F0SUZSb1pTQm1hVzVoYkNCeVpYTjFiSFJ6SUc5bUlIQnliMk5sYzNOcGJtY2daV0ZqYUNCMGNtRnVjMlp2Y20xbGNseHVJQ0FnS2k5Y2JpQWdkSEpoYm5ObWIzSnRVM1J5YVc1bktITjBjaWtnZTF4dUlDQWdJR052Ym5OMElHTmlJRDBnS0hKbGN5d2dkSEpoYm5ObWIzSnRLU0E5UGx4dUlDQWdJQ0FnZEhKaGJuTm1iM0p0TG05dVUzUnlhVzVuSUQ4Z2RISmhibk5tYjNKdExtOXVVM1J5YVc1bktISmxjeWtnT2lCeVpYTTdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVkSEpoYm5ObWIzSnRaWEp6TG5KbFpIVmpaU2hqWWl3Z2MzUnlLVHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCWGFHVnVJR0VnYzNWaWMzUnBkSFYwYVc5dUlHbHpJR1Z1WTI5MWJuUmxjbVZrTENCcGRHVnlZWFJsY3lCMGFISnZkV2RvSUdWaFkyZ2dkSEpoYm5ObWIzSnRaWElnWVc1a0lHRndjR3hwWlhNZ2RHaGxJSFJ5WVc1elptOXliV1Z5SjNOY2JpQWdJQ29nWUc5dVUzVmljM1JwZEhWMGFXOXVZQ0J0WlhSb2IyUWdkRzhnZEdobElITjFZbk4wYVhSMWRHbHZiaTVjYmlBZ0lDb2dRSEJoY21GdElDQjdLbjBnSUNBZ0lDQnpkV0p6ZEdsMGRYUnBiMjRnTFNCVWFHVWdZM1Z5Y21WdWRDQnpkV0p6ZEdsMGRYUnBiMjVjYmlBZ0lDb2dRSEJoY21GdElDQjdVM1J5YVc1bmZTQnlaWE4xYkhSVGIwWmhjaUFnTFNCVWFHVWdjbVZ6ZFd4MElIVndJSFJ2SUdGdVpDQmxlR05zZFdScGJtY2dkR2hwY3lCemRXSnpkR2wwZFhScGIyNHVYRzRnSUNBcUlFQnlaWFIxY200Z2V5cDlJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQzBnVkdobElHWnBibUZzSUhKbGMzVnNkQ0J2WmlCaGNIQnNlV2x1WnlCaGJHd2djM1ZpYzNScGRIVjBhVzl1SUhSeVlXNXpabTl5YldGMGFXOXVjeTVjYmlBZ0lDb3ZYRzRnSUhSeVlXNXpabTl5YlZOMVluTjBhWFIxZEdsdmJpaHpkV0p6ZEdsMGRYUnBiMjRzSUhKbGMzVnNkRk52Um1GeUtTQjdYRzRnSUNBZ1kyOXVjM1FnWTJJZ1BTQW9jbVZ6TENCMGNtRnVjMlp2Y20wcElEMCtYRzRnSUNBZ0lDQjBjbUZ1YzJadmNtMHViMjVUZFdKemRHbDBkWFJwYjI1Y2JpQWdJQ0FnSUNBZ1B5QjBjbUZ1YzJadmNtMHViMjVUZFdKemRHbDBkWFJwYjI0b2NtVnpMQ0J5WlhOMWJIUlRiMFpoY2lsY2JpQWdJQ0FnSUNBZ09pQnlaWE03WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11ZEhKaGJuTm1iM0p0WlhKekxuSmxaSFZqWlNoallpd2djM1ZpYzNScGRIVjBhVzl1S1R0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkpkR1Z5WVhSbGN5QjBhSEp2ZFdkb0lHVmhZMmdnZEhKaGJuTm1iM0p0WlhJc0lHRndjR3g1YVc1bklIUm9aU0IwY21GdWMyWnZjbTFsY2lkeklHQnZia1Z1WkZKbGMzVnNkR0FnYldWMGFHOWtJSFJ2SUhSb1pWeHVJQ0FnS2lCMFpXMXdiR0YwWlNCc2FYUmxjbUZzSUdGbWRHVnlJR0ZzYkNCemRXSnpkR2wwZFhScGIyNXpJR2hoZG1VZ1ptbHVhWE5vWldRZ2NISnZZMlZ6YzJsdVp5NWNiaUFnSUNvZ1FIQmhjbUZ0SUNCN1UzUnlhVzVuZlNCbGJtUlNaWE4xYkhRZ0xTQlVhR1VnY0hKdlkyVnpjMlZrSUhSbGJYQnNZWFJsTENCcWRYTjBJR0psWm05eVpTQnBkQ0JwY3lCeVpYUjFjbTVsWkNCbWNtOXRJSFJvWlNCMFlXZGNiaUFnSUNvZ1FISmxkSFZ5YmlCN1UzUnlhVzVuZlNBZ0lDQWdJQ0FnSUNBZ0xTQlVhR1VnWm1sdVlXd2djbVZ6ZFd4MGN5QnZaaUJ3Y205alpYTnphVzVuSUdWaFkyZ2dkSEpoYm5ObWIzSnRaWEpjYmlBZ0lDb3ZYRzRnSUhSeVlXNXpabTl5YlVWdVpGSmxjM1ZzZENobGJtUlNaWE4xYkhRcElIdGNiaUFnSUNCamIyNXpkQ0JqWWlBOUlDaHlaWE1zSUhSeVlXNXpabTl5YlNrZ1BUNWNiaUFnSUNBZ0lIUnlZVzV6Wm05eWJTNXZia1Z1WkZKbGMzVnNkQ0EvSUhSeVlXNXpabTl5YlM1dmJrVnVaRkpsYzNWc2RDaHlaWE1wSURvZ2NtVnpPMXh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMblJ5WVc1elptOXliV1Z5Y3k1eVpXUjFZMlVvWTJJc0lHVnVaRkpsYzNWc2RDazdYRzRnSUgxY2JuMWNiaUpkZlE9PSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL1RlbXBsYXRlVGFnJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OVVaVzF3YkdGMFpWUmhaeTlwYm1SbGVDNXFjeUpkTENKdVlXMWxjeUk2V3lKa1pXWmhkV3gwSWwwc0ltMWhjSEJwYm1keklqb2ljVUpCUVc5Q0xHVTdjVUpCUVdKQkxFOGlMQ0ptYVd4bElqb2lhVzVrWlhndWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpsZUhCdmNuUWdaR1ZtWVhWc2RDQm1jbTl0SUNjdUwxUmxiWEJzWVhSbFZHRm5KenRjYmlKZGZRPT0iLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi4vaHRtbCc7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTlqYjJSbFFteHZZMnN2YVc1a1pYZ3Vhbk1pWFN3aWJtRnRaWE1pT2xzaVpHVm1ZWFZzZENKZExDSnRZWEJ3YVc1bmN5STZJbkZDUVVGdlFpeFRPM0ZDUVVGaVFTeFBJaXdpWm1sc1pTSTZJbWx1WkdWNExtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpWlhod2IzSjBJR1JsWm1GMWJIUWdabkp2YlNBbkxpNHZhSFJ0YkNjN1hHNGlYWDA9IiwiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBzdHJpcEluZGVudFRyYW5zZm9ybWVyIGZyb20gJy4uL3N0cmlwSW5kZW50VHJhbnNmb3JtZXInO1xuaW1wb3J0IGlubGluZUFycmF5VHJhbnNmb3JtZXIgZnJvbSAnLi4vaW5saW5lQXJyYXlUcmFuc2Zvcm1lcic7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5cbnZhciBjb21tYUxpc3RzID0gbmV3IFRlbXBsYXRlVGFnKGlubGluZUFycmF5VHJhbnNmb3JtZXIoeyBzZXBhcmF0b3I6ICcsJyB9KSwgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciwgdHJpbVJlc3VsdFRyYW5zZm9ybWVyKTtcblxuZXhwb3J0IGRlZmF1bHQgY29tbWFMaXN0cztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OWpiMjF0WVV4cGMzUnpMMk52YlcxaFRHbHpkSE11YW5NaVhTd2libUZ0WlhNaU9sc2lWR1Z0Y0d4aGRHVlVZV2NpTENKemRISnBjRWx1WkdWdWRGUnlZVzV6Wm05eWJXVnlJaXdpYVc1c2FXNWxRWEp5WVhsVWNtRnVjMlp2Y20xbGNpSXNJblJ5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lJc0ltTnZiVzFoVEdsemRITWlMQ0p6WlhCaGNtRjBiM0lpWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEU5QlFVOUJMRmRCUVZBc1RVRkJkMElzWjBKQlFYaENPMEZCUTBFc1QwRkJUME1zYzBKQlFWQXNUVUZCYlVNc01rSkJRVzVETzBGQlEwRXNUMEZCVDBNc2MwSkJRVkFzVFVGQmJVTXNNa0pCUVc1RE8wRkJRMEVzVDBGQlQwTXNjVUpCUVZBc1RVRkJhME1zTUVKQlFXeERPenRCUVVWQkxFbEJRVTFETEdGQlFXRXNTVUZCU1Vvc1YwRkJTaXhEUVVOcVFrVXNkVUpCUVhWQ0xFVkJRVVZITEZkQlFWY3NSMEZCWWl4RlFVRjJRaXhEUVVScFFpeEZRVVZxUWtvc2MwSkJSbWxDTEVWQlIycENSU3h4UWtGSWFVSXNRMEZCYmtJN08wRkJUVUVzWlVGQlpVTXNWVUZCWmlJc0ltWnBiR1VpT2lKamIyMXRZVXhwYzNSekxtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJRlJsYlhCc1lYUmxWR0ZuSUdaeWIyMGdKeTR1TDFSbGJYQnNZWFJsVkdGbkp6dGNibWx0Y0c5eWRDQnpkSEpwY0VsdVpHVnVkRlJ5WVc1elptOXliV1Z5SUdaeWIyMGdKeTR1TDNOMGNtbHdTVzVrWlc1MFZISmhibk5tYjNKdFpYSW5PMXh1YVcxd2IzSjBJR2x1YkdsdVpVRnljbUY1VkhKaGJuTm1iM0p0WlhJZ1puSnZiU0FuTGk0dmFXNXNhVzVsUVhKeVlYbFVjbUZ1YzJadmNtMWxjaWM3WEc1cGJYQnZjblFnZEhKcGJWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUlHWnliMjBnSnk0dUwzUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaWM3WEc1Y2JtTnZibk4wSUdOdmJXMWhUR2x6ZEhNZ1BTQnVaWGNnVkdWdGNHeGhkR1ZVWVdjb1hHNGdJR2x1YkdsdVpVRnljbUY1VkhKaGJuTm1iM0p0WlhJb2V5QnpaWEJoY21GMGIzSTZJQ2NzSnlCOUtTeGNiaUFnYzNSeWFYQkpibVJsYm5SVWNtRnVjMlp2Y20xbGNpeGNiaUFnZEhKcGJWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUxGeHVLVHRjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnWTI5dGJXRk1hWE4wY3p0Y2JpSmRmUT09IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vY29tbWFMaXN0cyc7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTlqYjIxdFlVeHBjM1J6TDJsdVpHVjRMbXB6SWwwc0ltNWhiV1Z6SWpwYkltUmxabUYxYkhRaVhTd2liV0Z3Y0dsdVozTWlPaUp4UWtGQmIwSXNZenR4UWtGQllrRXNUeUlzSW1acGJHVWlPaUpwYm1SbGVDNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1WNGNHOXlkQ0JrWldaaGRXeDBJR1p5YjIwZ0p5NHZZMjl0YldGTWFYTjBjeWM3WEc0aVhYMD0iLCJpbXBvcnQgVGVtcGxhdGVUYWcgZnJvbSAnLi4vVGVtcGxhdGVUYWcnO1xuaW1wb3J0IHN0cmlwSW5kZW50VHJhbnNmb3JtZXIgZnJvbSAnLi4vc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcic7XG5pbXBvcnQgaW5saW5lQXJyYXlUcmFuc2Zvcm1lciBmcm9tICcuLi9pbmxpbmVBcnJheVRyYW5zZm9ybWVyJztcbmltcG9ydCB0cmltUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcblxudmFyIGNvbW1hTGlzdHNBbmQgPSBuZXcgVGVtcGxhdGVUYWcoaW5saW5lQXJyYXlUcmFuc2Zvcm1lcih7IHNlcGFyYXRvcjogJywnLCBjb25qdW5jdGlvbjogJ2FuZCcgfSksIHN0cmlwSW5kZW50VHJhbnNmb3JtZXIsIHRyaW1SZXN1bHRUcmFuc2Zvcm1lcik7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbW1hTGlzdHNBbmQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTlqYjIxdFlVeHBjM1J6UVc1a0wyTnZiVzFoVEdsemRITkJibVF1YW5NaVhTd2libUZ0WlhNaU9sc2lWR1Z0Y0d4aGRHVlVZV2NpTENKemRISnBjRWx1WkdWdWRGUnlZVzV6Wm05eWJXVnlJaXdpYVc1c2FXNWxRWEp5WVhsVWNtRnVjMlp2Y20xbGNpSXNJblJ5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lJc0ltTnZiVzFoVEdsemRITkJibVFpTENKelpYQmhjbUYwYjNJaUxDSmpiMjVxZFc1amRHbHZiaUpkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzVDBGQlQwRXNWMEZCVUN4TlFVRjNRaXhuUWtGQmVFSTdRVUZEUVN4UFFVRlBReXh6UWtGQlVDeE5RVUZ0UXl3eVFrRkJia003UVVGRFFTeFBRVUZQUXl4elFrRkJVQ3hOUVVGdFF5d3lRa0ZCYmtNN1FVRkRRU3hQUVVGUFF5eHhRa0ZCVUN4TlFVRnJReXd3UWtGQmJFTTdPMEZCUlVFc1NVRkJUVU1zWjBKQlFXZENMRWxCUVVsS0xGZEJRVW9zUTBGRGNFSkZMSFZDUVVGMVFpeEZRVUZGUnl4WFFVRlhMRWRCUVdJc1JVRkJhMEpETEdGQlFXRXNTMEZCTDBJc1JVRkJka0lzUTBGRWIwSXNSVUZGY0VKTUxITkNRVVp2UWl4RlFVZHdRa1VzY1VKQlNHOUNMRU5CUVhSQ096dEJRVTFCTEdWQlFXVkRMR0ZCUVdZaUxDSm1hV3hsSWpvaVkyOXRiV0ZNYVhOMGMwRnVaQzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltbHRjRzl5ZENCVVpXMXdiR0YwWlZSaFp5Qm1jbTl0SUNjdUxpOVVaVzF3YkdGMFpWUmhaeWM3WEc1cGJYQnZjblFnYzNSeWFYQkpibVJsYm5SVWNtRnVjMlp2Y20xbGNpQm1jbTl0SUNjdUxpOXpkSEpwY0VsdVpHVnVkRlJ5WVc1elptOXliV1Z5Snp0Y2JtbHRjRzl5ZENCcGJteHBibVZCY25KaGVWUnlZVzV6Wm05eWJXVnlJR1p5YjIwZ0p5NHVMMmx1YkdsdVpVRnljbUY1VkhKaGJuTm1iM0p0WlhJbk8xeHVhVzF3YjNKMElIUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUJtY205dElDY3VMaTkwY21sdFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJbk8xeHVYRzVqYjI1emRDQmpiMjF0WVV4cGMzUnpRVzVrSUQwZ2JtVjNJRlJsYlhCc1lYUmxWR0ZuS0Z4dUlDQnBibXhwYm1WQmNuSmhlVlJ5WVc1elptOXliV1Z5S0hzZ2MyVndZWEpoZEc5eU9pQW5MQ2NzSUdOdmJtcDFibU4wYVc5dU9pQW5ZVzVrSnlCOUtTeGNiaUFnYzNSeWFYQkpibVJsYm5SVWNtRnVjMlp2Y20xbGNpeGNiaUFnZEhKcGJWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUxGeHVLVHRjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnWTI5dGJXRk1hWE4wYzBGdVpEdGNiaUpkZlE9PSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL2NvbW1hTGlzdHNBbmQnO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5amIyMXRZVXhwYzNSelFXNWtMMmx1WkdWNExtcHpJbDBzSW01aGJXVnpJanBiSW1SbFptRjFiSFFpWFN3aWJXRndjR2x1WjNNaU9pSnhRa0ZCYjBJc2FVSTdjVUpCUVdKQkxFOGlMQ0ptYVd4bElqb2lhVzVrWlhndWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpsZUhCdmNuUWdaR1ZtWVhWc2RDQm1jbTl0SUNjdUwyTnZiVzFoVEdsemRITkJibVFuTzF4dUlsMTkiLCJpbXBvcnQgVGVtcGxhdGVUYWcgZnJvbSAnLi4vVGVtcGxhdGVUYWcnO1xuaW1wb3J0IHN0cmlwSW5kZW50VHJhbnNmb3JtZXIgZnJvbSAnLi4vc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcic7XG5pbXBvcnQgaW5saW5lQXJyYXlUcmFuc2Zvcm1lciBmcm9tICcuLi9pbmxpbmVBcnJheVRyYW5zZm9ybWVyJztcbmltcG9ydCB0cmltUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcblxudmFyIGNvbW1hTGlzdHNPciA9IG5ldyBUZW1wbGF0ZVRhZyhpbmxpbmVBcnJheVRyYW5zZm9ybWVyKHsgc2VwYXJhdG9yOiAnLCcsIGNvbmp1bmN0aW9uOiAnb3InIH0pLCBzdHJpcEluZGVudFRyYW5zZm9ybWVyLCB0cmltUmVzdWx0VHJhbnNmb3JtZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBjb21tYUxpc3RzT3I7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTlqYjIxdFlVeHBjM1J6VDNJdlkyOXRiV0ZNYVhOMGMwOXlMbXB6SWwwc0ltNWhiV1Z6SWpwYklsUmxiWEJzWVhSbFZHRm5JaXdpYzNSeWFYQkpibVJsYm5SVWNtRnVjMlp2Y20xbGNpSXNJbWx1YkdsdVpVRnljbUY1VkhKaGJuTm1iM0p0WlhJaUxDSjBjbWx0VW1WemRXeDBWSEpoYm5ObWIzSnRaWElpTENKamIyMXRZVXhwYzNSelQzSWlMQ0p6WlhCaGNtRjBiM0lpTENKamIyNXFkVzVqZEdsdmJpSmRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNUMEZCVDBFc1YwRkJVQ3hOUVVGM1FpeG5Ra0ZCZUVJN1FVRkRRU3hQUVVGUFF5eHpRa0ZCVUN4TlFVRnRReXd5UWtGQmJrTTdRVUZEUVN4UFFVRlBReXh6UWtGQlVDeE5RVUZ0UXl3eVFrRkJia003UVVGRFFTeFBRVUZQUXl4eFFrRkJVQ3hOUVVGclF5d3dRa0ZCYkVNN08wRkJSVUVzU1VGQlRVTXNaVUZCWlN4SlFVRkpTaXhYUVVGS0xFTkJRMjVDUlN4MVFrRkJkVUlzUlVGQlJVY3NWMEZCVnl4SFFVRmlMRVZCUVd0Q1F5eGhRVUZoTEVsQlFTOUNMRVZCUVhaQ0xFTkJSRzFDTEVWQlJXNUNUQ3h6UWtGR2JVSXNSVUZIYmtKRkxIRkNRVWh0UWl4RFFVRnlRanM3UVVGTlFTeGxRVUZsUXl4WlFVRm1JaXdpWm1sc1pTSTZJbU52YlcxaFRHbHpkSE5QY2k1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbWx0Y0c5eWRDQlVaVzF3YkdGMFpWUmhaeUJtY205dElDY3VMaTlVWlcxd2JHRjBaVlJoWnljN1hHNXBiWEJ2Y25RZ2MzUnlhWEJKYm1SbGJuUlVjbUZ1YzJadmNtMWxjaUJtY205dElDY3VMaTl6ZEhKcGNFbHVaR1Z1ZEZSeVlXNXpabTl5YldWeUp6dGNibWx0Y0c5eWRDQnBibXhwYm1WQmNuSmhlVlJ5WVc1elptOXliV1Z5SUdaeWIyMGdKeTR1TDJsdWJHbHVaVUZ5Y21GNVZISmhibk5tYjNKdFpYSW5PMXh1YVcxd2IzSjBJSFJ5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lCbWNtOXRJQ2N1TGk5MGNtbHRVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSW5PMXh1WEc1amIyNXpkQ0JqYjIxdFlVeHBjM1J6VDNJZ1BTQnVaWGNnVkdWdGNHeGhkR1ZVWVdjb1hHNGdJR2x1YkdsdVpVRnljbUY1VkhKaGJuTm1iM0p0WlhJb2V5QnpaWEJoY21GMGIzSTZJQ2NzSnl3Z1kyOXVhblZ1WTNScGIyNDZJQ2R2Y2ljZ2ZTa3NYRzRnSUhOMGNtbHdTVzVrWlc1MFZISmhibk5tYjNKdFpYSXNYRzRnSUhSeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpeGNiaWs3WEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUdOdmJXMWhUR2x6ZEhOUGNqdGNiaUpkZlE9PSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL2NvbW1hTGlzdHNPcic7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTlqYjIxdFlVeHBjM1J6VDNJdmFXNWtaWGd1YW5NaVhTd2libUZ0WlhNaU9sc2laR1ZtWVhWc2RDSmRMQ0p0WVhCd2FXNW5jeUk2SW5GQ1FVRnZRaXhuUWp0eFFrRkJZa0VzVHlJc0ltWnBiR1VpT2lKcGJtUmxlQzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltVjRjRzl5ZENCa1pXWmhkV3gwSUdaeWIyMGdKeTR2WTI5dGJXRk1hWE4wYzA5eUp6dGNiaUpkZlE9PSIsImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciBmcm9tICcuLi9zdHJpcEluZGVudFRyYW5zZm9ybWVyJztcbmltcG9ydCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyIGZyb20gJy4uL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuaW1wb3J0IHNwbGl0U3RyaW5nVHJhbnNmb3JtZXIgZnJvbSAnLi4vc3BsaXRTdHJpbmdUcmFuc2Zvcm1lcic7XG5pbXBvcnQgcmVtb3ZlTm9uUHJpbnRpbmdWYWx1ZXNUcmFuc2Zvcm1lciBmcm9tICcuLi9yZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyJztcblxudmFyIGh0bWwgPSBuZXcgVGVtcGxhdGVUYWcoc3BsaXRTdHJpbmdUcmFuc2Zvcm1lcignXFxuJyksIHJlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXIsIGlubGluZUFycmF5VHJhbnNmb3JtZXIsIHN0cmlwSW5kZW50VHJhbnNmb3JtZXIsIHRyaW1SZXN1bHRUcmFuc2Zvcm1lcik7XG5cbmV4cG9ydCBkZWZhdWx0IGh0bWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTlvZEcxc0wyaDBiV3d1YW5NaVhTd2libUZ0WlhNaU9sc2lWR1Z0Y0d4aGRHVlVZV2NpTENKemRISnBjRWx1WkdWdWRGUnlZVzV6Wm05eWJXVnlJaXdpYVc1c2FXNWxRWEp5WVhsVWNtRnVjMlp2Y20xbGNpSXNJblJ5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lJc0luTndiR2wwVTNSeWFXNW5WSEpoYm5ObWIzSnRaWElpTENKeVpXMXZkbVZPYjI1UWNtbHVkR2x1WjFaaGJIVmxjMVJ5WVc1elptOXliV1Z5SWl3aWFIUnRiQ0pkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzVDBGQlQwRXNWMEZCVUN4TlFVRjNRaXhuUWtGQmVFSTdRVUZEUVN4UFFVRlBReXh6UWtGQlVDeE5RVUZ0UXl3eVFrRkJia003UVVGRFFTeFBRVUZQUXl4elFrRkJVQ3hOUVVGdFF5d3lRa0ZCYmtNN1FVRkRRU3hQUVVGUFF5eHhRa0ZCVUN4TlFVRnJReXd3UWtGQmJFTTdRVUZEUVN4UFFVRlBReXh6UWtGQlVDeE5RVUZ0UXl3eVFrRkJia003UVVGRFFTeFBRVUZQUXl4clEwRkJVQ3hOUVVFclF5eDFRMEZCTDBNN08wRkJSVUVzU1VGQlRVTXNUMEZCVHl4SlFVRkpUaXhYUVVGS0xFTkJRMWhKTEhWQ1FVRjFRaXhKUVVGMlFpeERRVVJYTEVWQlJWaERMR3REUVVaWExFVkJSMWhJTEhOQ1FVaFhMRVZCU1ZoRUxITkNRVXBYTEVWQlMxaEZMSEZDUVV4WExFTkJRV0k3TzBGQlVVRXNaVUZCWlVjc1NVRkJaaUlzSW1acGJHVWlPaUpvZEcxc0xtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJRlJsYlhCc1lYUmxWR0ZuSUdaeWIyMGdKeTR1TDFSbGJYQnNZWFJsVkdGbkp6dGNibWx0Y0c5eWRDQnpkSEpwY0VsdVpHVnVkRlJ5WVc1elptOXliV1Z5SUdaeWIyMGdKeTR1TDNOMGNtbHdTVzVrWlc1MFZISmhibk5tYjNKdFpYSW5PMXh1YVcxd2IzSjBJR2x1YkdsdVpVRnljbUY1VkhKaGJuTm1iM0p0WlhJZ1puSnZiU0FuTGk0dmFXNXNhVzVsUVhKeVlYbFVjbUZ1YzJadmNtMWxjaWM3WEc1cGJYQnZjblFnZEhKcGJWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUlHWnliMjBnSnk0dUwzUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaWM3WEc1cGJYQnZjblFnYzNCc2FYUlRkSEpwYm1kVWNtRnVjMlp2Y20xbGNpQm1jbTl0SUNjdUxpOXpjR3hwZEZOMGNtbHVaMVJ5WVc1elptOXliV1Z5Snp0Y2JtbHRjRzl5ZENCeVpXMXZkbVZPYjI1UWNtbHVkR2x1WjFaaGJIVmxjMVJ5WVc1elptOXliV1Z5SUdaeWIyMGdKeTR1TDNKbGJXOTJaVTV2YmxCeWFXNTBhVzVuVm1Gc2RXVnpWSEpoYm5ObWIzSnRaWEluTzF4dVhHNWpiMjV6ZENCb2RHMXNJRDBnYm1WM0lGUmxiWEJzWVhSbFZHRm5LRnh1SUNCemNHeHBkRk4wY21sdVoxUnlZVzV6Wm05eWJXVnlLQ2RjWEc0bktTeGNiaUFnY21WdGIzWmxUbTl1VUhKcGJuUnBibWRXWVd4MVpYTlVjbUZ1YzJadmNtMWxjaXhjYmlBZ2FXNXNhVzVsUVhKeVlYbFVjbUZ1YzJadmNtMWxjaXhjYmlBZ2MzUnlhWEJKYm1SbGJuUlVjbUZ1YzJadmNtMWxjaXhjYmlBZ2RISnBiVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlMRnh1S1R0Y2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ2FIUnRiRHRjYmlKZGZRPT0iLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi9odG1sJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OW9kRzFzTDJsdVpHVjRMbXB6SWwwc0ltNWhiV1Z6SWpwYkltUmxabUYxYkhRaVhTd2liV0Z3Y0dsdVozTWlPaUp4UWtGQmIwSXNVVHR4UWtGQllrRXNUeUlzSW1acGJHVWlPaUpwYm1SbGVDNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1WNGNHOXlkQ0JrWldaaGRXeDBJR1p5YjIwZ0p5NHZhSFJ0YkNjN1hHNGlYWDA9IiwiLy8gY29yZVxuaW1wb3J0IF9UZW1wbGF0ZVRhZyBmcm9tICcuL1RlbXBsYXRlVGFnJztcbmV4cG9ydCB7IF9UZW1wbGF0ZVRhZyBhcyBUZW1wbGF0ZVRhZyB9O1xuXG4vLyB0cmFuc2Zvcm1lcnNcblxuaW1wb3J0IF90cmltUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuZXhwb3J0IHsgX3RyaW1SZXN1bHRUcmFuc2Zvcm1lciBhcyB0cmltUmVzdWx0VHJhbnNmb3JtZXIgfTtcbmltcG9ydCBfc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciBmcm9tICcuL3N0cmlwSW5kZW50VHJhbnNmb3JtZXInO1xuZXhwb3J0IHsgX3N0cmlwSW5kZW50VHJhbnNmb3JtZXIgYXMgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciB9O1xuaW1wb3J0IF9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXInO1xuZXhwb3J0IHsgX3JlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciBhcyByZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIgfTtcbmltcG9ydCBfcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyIGZyb20gJy4vcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyJztcbmV4cG9ydCB7IF9yZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIgYXMgcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyIH07XG5pbXBvcnQgX3JlcGxhY2VTdHJpbmdUcmFuc2Zvcm1lciBmcm9tICcuL3JlcGxhY2VTdHJpbmdUcmFuc2Zvcm1lcic7XG5leHBvcnQgeyBfcmVwbGFjZVN0cmluZ1RyYW5zZm9ybWVyIGFzIHJlcGxhY2VTdHJpbmdUcmFuc2Zvcm1lciB9O1xuaW1wb3J0IF9pbmxpbmVBcnJheVRyYW5zZm9ybWVyIGZyb20gJy4vaW5saW5lQXJyYXlUcmFuc2Zvcm1lcic7XG5leHBvcnQgeyBfaW5saW5lQXJyYXlUcmFuc2Zvcm1lciBhcyBpbmxpbmVBcnJheVRyYW5zZm9ybWVyIH07XG5pbXBvcnQgX3NwbGl0U3RyaW5nVHJhbnNmb3JtZXIgZnJvbSAnLi9zcGxpdFN0cmluZ1RyYW5zZm9ybWVyJztcbmV4cG9ydCB7IF9zcGxpdFN0cmluZ1RyYW5zZm9ybWVyIGFzIHNwbGl0U3RyaW5nVHJhbnNmb3JtZXIgfTtcbmltcG9ydCBfcmVtb3ZlTm9uUHJpbnRpbmdWYWx1ZXNUcmFuc2Zvcm1lciBmcm9tICcuL3JlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXInO1xuZXhwb3J0IHsgX3JlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXIgYXMgcmVtb3ZlTm9uUHJpbnRpbmdWYWx1ZXNUcmFuc2Zvcm1lciB9O1xuXG4vLyB0YWdzXG5cbmltcG9ydCBfY29tbWFMaXN0cyBmcm9tICcuL2NvbW1hTGlzdHMnO1xuZXhwb3J0IHsgX2NvbW1hTGlzdHMgYXMgY29tbWFMaXN0cyB9O1xuaW1wb3J0IF9jb21tYUxpc3RzQW5kIGZyb20gJy4vY29tbWFMaXN0c0FuZCc7XG5leHBvcnQgeyBfY29tbWFMaXN0c0FuZCBhcyBjb21tYUxpc3RzQW5kIH07XG5pbXBvcnQgX2NvbW1hTGlzdHNPciBmcm9tICcuL2NvbW1hTGlzdHNPcic7XG5leHBvcnQgeyBfY29tbWFMaXN0c09yIGFzIGNvbW1hTGlzdHNPciB9O1xuaW1wb3J0IF9odG1sIGZyb20gJy4vaHRtbCc7XG5leHBvcnQgeyBfaHRtbCBhcyBodG1sIH07XG5pbXBvcnQgX2NvZGVCbG9jayBmcm9tICcuL2NvZGVCbG9jayc7XG5leHBvcnQgeyBfY29kZUJsb2NrIGFzIGNvZGVCbG9jayB9O1xuaW1wb3J0IF9zb3VyY2UgZnJvbSAnLi9zb3VyY2UnO1xuZXhwb3J0IHsgX3NvdXJjZSBhcyBzb3VyY2UgfTtcbmltcG9ydCBfc2FmZUh0bWwgZnJvbSAnLi9zYWZlSHRtbCc7XG5leHBvcnQgeyBfc2FmZUh0bWwgYXMgc2FmZUh0bWwgfTtcbmltcG9ydCBfb25lTGluZSBmcm9tICcuL29uZUxpbmUnO1xuZXhwb3J0IHsgX29uZUxpbmUgYXMgb25lTGluZSB9O1xuaW1wb3J0IF9vbmVMaW5lVHJpbSBmcm9tICcuL29uZUxpbmVUcmltJztcbmV4cG9ydCB7IF9vbmVMaW5lVHJpbSBhcyBvbmVMaW5lVHJpbSB9O1xuaW1wb3J0IF9vbmVMaW5lQ29tbWFMaXN0cyBmcm9tICcuL29uZUxpbmVDb21tYUxpc3RzJztcbmV4cG9ydCB7IF9vbmVMaW5lQ29tbWFMaXN0cyBhcyBvbmVMaW5lQ29tbWFMaXN0cyB9O1xuaW1wb3J0IF9vbmVMaW5lQ29tbWFMaXN0c09yIGZyb20gJy4vb25lTGluZUNvbW1hTGlzdHNPcic7XG5leHBvcnQgeyBfb25lTGluZUNvbW1hTGlzdHNPciBhcyBvbmVMaW5lQ29tbWFMaXN0c09yIH07XG5pbXBvcnQgX29uZUxpbmVDb21tYUxpc3RzQW5kIGZyb20gJy4vb25lTGluZUNvbW1hTGlzdHNBbmQnO1xuZXhwb3J0IHsgX29uZUxpbmVDb21tYUxpc3RzQW5kIGFzIG9uZUxpbmVDb21tYUxpc3RzQW5kIH07XG5pbXBvcnQgX2lubGluZUxpc3RzIGZyb20gJy4vaW5saW5lTGlzdHMnO1xuZXhwb3J0IHsgX2lubGluZUxpc3RzIGFzIGlubGluZUxpc3RzIH07XG5pbXBvcnQgX29uZUxpbmVJbmxpbmVMaXN0cyBmcm9tICcuL29uZUxpbmVJbmxpbmVMaXN0cyc7XG5leHBvcnQgeyBfb25lTGluZUlubGluZUxpc3RzIGFzIG9uZUxpbmVJbmxpbmVMaXN0cyB9O1xuaW1wb3J0IF9zdHJpcEluZGVudCBmcm9tICcuL3N0cmlwSW5kZW50JztcbmV4cG9ydCB7IF9zdHJpcEluZGVudCBhcyBzdHJpcEluZGVudCB9O1xuaW1wb3J0IF9zdHJpcEluZGVudHMgZnJvbSAnLi9zdHJpcEluZGVudHMnO1xuZXhwb3J0IHsgX3N0cmlwSW5kZW50cyBhcyBzdHJpcEluZGVudHMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMM055WXk5cGJtUmxlQzVxY3lKZExDSnVZVzFsY3lJNld5SlVaVzF3YkdGMFpWUmhaeUlzSW5SeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpSXNJbk4wY21sd1NXNWtaVzUwVkhKaGJuTm1iM0p0WlhJaUxDSnlaWEJzWVdObFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJaUxDSnlaWEJzWVdObFUzVmljM1JwZEhWMGFXOXVWSEpoYm5ObWIzSnRaWElpTENKeVpYQnNZV05sVTNSeWFXNW5WSEpoYm5ObWIzSnRaWElpTENKcGJteHBibVZCY25KaGVWUnlZVzV6Wm05eWJXVnlJaXdpYzNCc2FYUlRkSEpwYm1kVWNtRnVjMlp2Y20xbGNpSXNJbkpsYlc5MlpVNXZibEJ5YVc1MGFXNW5WbUZzZFdWelZISmhibk5tYjNKdFpYSWlMQ0pqYjIxdFlVeHBjM1J6SWl3aVkyOXRiV0ZNYVhOMGMwRnVaQ0lzSW1OdmJXMWhUR2x6ZEhOUGNpSXNJbWgwYld3aUxDSmpiMlJsUW14dlkyc2lMQ0p6YjNWeVkyVWlMQ0p6WVdabFNIUnRiQ0lzSW05dVpVeHBibVVpTENKdmJtVk1hVzVsVkhKcGJTSXNJbTl1WlV4cGJtVkRiMjF0WVV4cGMzUnpJaXdpYjI1bFRHbHVaVU52YlcxaFRHbHpkSE5QY2lJc0ltOXVaVXhwYm1WRGIyMXRZVXhwYzNSelFXNWtJaXdpYVc1c2FXNWxUR2x6ZEhNaUxDSnZibVZNYVc1bFNXNXNhVzVsVEdsemRITWlMQ0p6ZEhKcGNFbHVaR1Z1ZENJc0luTjBjbWx3U1c1a1pXNTBjeUpkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3ZVVKQlEzZENMR1U3ZVVKQlFXcENRU3hYT3p0QlFVVlFPenR0UTBGRGEwTXNlVUk3YlVOQlFUTkNReXh4UWp0dlEwRkRORUlzTUVJN2IwTkJRVFZDUXl4elFqdHpRMEZET0VJc05FSTdjME5CUVRsQ1F5eDNRanMwUTBGRGIwTXNhME03TkVOQlFYQkRReXc0UWp0elEwRkRPRUlzTkVJN2MwTkJRVGxDUXl4M1FqdHZRMEZETkVJc01FSTdiME5CUVRWQ1F5eHpRanR2UTBGRE5FSXNNRUk3YjBOQlFUVkNReXh6UWp0blJFRkRkME1zYzBNN1owUkJRWGhEUXl4clF6czdRVUZGVURzN2QwSkJRM1ZDTEdNN2QwSkJRV2hDUXl4Vk96SkNRVU50UWl4cFFqc3lRa0ZCYmtKRExHRTdNRUpCUTJ0Q0xHZENPekJDUVVGc1FrTXNXVHRyUWtGRFZTeFJPMnRDUVVGV1F5eEpPM1ZDUVVObExHRTdkVUpCUVdaRExGTTdiMEpCUTFrc1ZUdHZRa0ZCV2tNc1RUdHpRa0ZEWXl4Wk8zTkNRVUZrUXl4Uk8zRkNRVU5oTEZjN2NVSkJRV0pETEU4N2VVSkJRMmxDTEdVN2VVSkJRV3BDUXl4WE95dENRVU4xUWl4eFFqc3JRa0ZCZGtKRExHbENPMmxEUVVONVFpeDFRanRwUTBGQmVrSkRMRzFDTzJ0RFFVTXdRaXgzUWp0clEwRkJNVUpETEc5Q08zbENRVU5wUWl4bE8zbENRVUZxUWtNc1Z6dG5RMEZEZDBJc2MwSTdaME5CUVhoQ1F5eHJRanQ1UWtGRGFVSXNaVHQ1UWtGQmFrSkRMRmM3TUVKQlEydENMR2RDT3pCQ1FVRnNRa01zV1NJc0ltWnBiR1VpT2lKcGJtUmxlQzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHZJR052Y21WY2JtVjRjRzl5ZENCVVpXMXdiR0YwWlZSaFp5Qm1jbTl0SUNjdUwxUmxiWEJzWVhSbFZHRm5KenRjYmx4dUx5OGdkSEpoYm5ObWIzSnRaWEp6WEc1bGVIQnZjblFnZEhKcGJWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUlHWnliMjBnSnk0dmRISnBiVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlKenRjYm1WNGNHOXlkQ0J6ZEhKcGNFbHVaR1Z1ZEZSeVlXNXpabTl5YldWeUlHWnliMjBnSnk0dmMzUnlhWEJKYm1SbGJuUlVjbUZ1YzJadmNtMWxjaWM3WEc1bGVIQnZjblFnY21Wd2JHRmpaVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlJR1p5YjIwZ0p5NHZjbVZ3YkdGalpWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUp6dGNibVY0Y0c5eWRDQnlaWEJzWVdObFUzVmljM1JwZEhWMGFXOXVWSEpoYm5ObWIzSnRaWElnWm5KdmJTQW5MaTl5WlhCc1lXTmxVM1ZpYzNScGRIVjBhVzl1VkhKaGJuTm1iM0p0WlhJbk8xeHVaWGh3YjNKMElISmxjR3hoWTJWVGRISnBibWRVY21GdWMyWnZjbTFsY2lCbWNtOXRJQ2N1TDNKbGNHeGhZMlZUZEhKcGJtZFVjbUZ1YzJadmNtMWxjaWM3WEc1bGVIQnZjblFnYVc1c2FXNWxRWEp5WVhsVWNtRnVjMlp2Y20xbGNpQm1jbTl0SUNjdUwybHViR2x1WlVGeWNtRjVWSEpoYm5ObWIzSnRaWEluTzF4dVpYaHdiM0owSUhOd2JHbDBVM1J5YVc1blZISmhibk5tYjNKdFpYSWdabkp2YlNBbkxpOXpjR3hwZEZOMGNtbHVaMVJ5WVc1elptOXliV1Z5Snp0Y2JtVjRjRzl5ZENCeVpXMXZkbVZPYjI1UWNtbHVkR2x1WjFaaGJIVmxjMVJ5WVc1elptOXliV1Z5SUdaeWIyMGdKeTR2Y21WdGIzWmxUbTl1VUhKcGJuUnBibWRXWVd4MVpYTlVjbUZ1YzJadmNtMWxjaWM3WEc1Y2JpOHZJSFJoWjNOY2JtVjRjRzl5ZENCamIyMXRZVXhwYzNSeklHWnliMjBnSnk0dlkyOXRiV0ZNYVhOMGN5YzdYRzVsZUhCdmNuUWdZMjl0YldGTWFYTjBjMEZ1WkNCbWNtOXRJQ2N1TDJOdmJXMWhUR2x6ZEhOQmJtUW5PMXh1Wlhod2IzSjBJR052YlcxaFRHbHpkSE5QY2lCbWNtOXRJQ2N1TDJOdmJXMWhUR2x6ZEhOUGNpYzdYRzVsZUhCdmNuUWdhSFJ0YkNCbWNtOXRJQ2N1TDJoMGJXd25PMXh1Wlhod2IzSjBJR052WkdWQ2JHOWpheUJtY205dElDY3VMMk52WkdWQ2JHOWpheWM3WEc1bGVIQnZjblFnYzI5MWNtTmxJR1p5YjIwZ0p5NHZjMjkxY21ObEp6dGNibVY0Y0c5eWRDQnpZV1psU0hSdGJDQm1jbTl0SUNjdUwzTmhabVZJZEcxc0p6dGNibVY0Y0c5eWRDQnZibVZNYVc1bElHWnliMjBnSnk0dmIyNWxUR2x1WlNjN1hHNWxlSEJ2Y25RZ2IyNWxUR2x1WlZSeWFXMGdabkp2YlNBbkxpOXZibVZNYVc1bFZISnBiU2M3WEc1bGVIQnZjblFnYjI1bFRHbHVaVU52YlcxaFRHbHpkSE1nWm5KdmJTQW5MaTl2Ym1WTWFXNWxRMjl0YldGTWFYTjBjeWM3WEc1bGVIQnZjblFnYjI1bFRHbHVaVU52YlcxaFRHbHpkSE5QY2lCbWNtOXRJQ2N1TDI5dVpVeHBibVZEYjIxdFlVeHBjM1J6VDNJbk8xeHVaWGh3YjNKMElHOXVaVXhwYm1WRGIyMXRZVXhwYzNSelFXNWtJR1p5YjIwZ0p5NHZiMjVsVEdsdVpVTnZiVzFoVEdsemRITkJibVFuTzF4dVpYaHdiM0owSUdsdWJHbHVaVXhwYzNSeklHWnliMjBnSnk0dmFXNXNhVzVsVEdsemRITW5PMXh1Wlhod2IzSjBJRzl1WlV4cGJtVkpibXhwYm1WTWFYTjBjeUJtY205dElDY3VMMjl1WlV4cGJtVkpibXhwYm1WTWFYTjBjeWM3WEc1bGVIQnZjblFnYzNSeWFYQkpibVJsYm5RZ1puSnZiU0FuTGk5emRISnBjRWx1WkdWdWRDYzdYRzVsZUhCdmNuUWdjM1J5YVhCSmJtUmxiblJ6SUdaeWIyMGdKeTR2YzNSeWFYQkpibVJsYm5Sekp6dGNiaUpkZlE9PSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5cGJteHBibVZCY25KaGVWUnlZVzV6Wm05eWJXVnlMMmx1WkdWNExtcHpJbDBzSW01aGJXVnpJanBiSW1SbFptRjFiSFFpWFN3aWJXRndjR2x1WjNNaU9pSnhRa0ZCYjBJc01FSTdjVUpCUVdKQkxFOGlMQ0ptYVd4bElqb2lhVzVrWlhndWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpsZUhCdmNuUWdaR1ZtWVhWc2RDQm1jbTl0SUNjdUwybHViR2x1WlVGeWNtRjVWSEpoYm5ObWIzSnRaWEluTzF4dUlsMTkiLCJ2YXIgZGVmYXVsdHMgPSB7XG4gIHNlcGFyYXRvcjogJycsXG4gIGNvbmp1bmN0aW9uOiAnJyxcbiAgc2VyaWFsOiBmYWxzZVxufTtcblxuLyoqXG4gKiBDb252ZXJ0cyBhbiBhcnJheSBzdWJzdGl0dXRpb24gdG8gYSBzdHJpbmcgY29udGFpbmluZyBhIGxpc3RcbiAqIEBwYXJhbSAge1N0cmluZ30gW29wdHMuc2VwYXJhdG9yID0gJyddIC0gdGhlIGNoYXJhY3RlciB0aGF0IHNlcGFyYXRlcyBlYWNoIGl0ZW1cbiAqIEBwYXJhbSAge1N0cmluZ30gW29wdHMuY29uanVuY3Rpb24gPSAnJ10gIC0gcmVwbGFjZSB0aGUgbGFzdCBzZXBhcmF0b3Igd2l0aCB0aGlzXG4gKiBAcGFyYW0gIHtCb29sZWFufSBbb3B0cy5zZXJpYWwgPSBmYWxzZV0gLSBpbmNsdWRlIHRoZSBzZXBhcmF0b3IgYmVmb3JlIHRoZSBjb25qdW5jdGlvbj8gKE94Zm9yZCBjb21tYSB1c2UtY2FzZSlcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgLSBhIFRlbXBsYXRlVGFnIHRyYW5zZm9ybWVyXG4gKi9cbnZhciBpbmxpbmVBcnJheVRyYW5zZm9ybWVyID0gZnVuY3Rpb24gaW5saW5lQXJyYXlUcmFuc2Zvcm1lcigpIHtcbiAgdmFyIG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IGRlZmF1bHRzO1xuICByZXR1cm4ge1xuICAgIG9uU3Vic3RpdHV0aW9uOiBmdW5jdGlvbiBvblN1YnN0aXR1dGlvbihzdWJzdGl0dXRpb24sIHJlc3VsdFNvRmFyKSB7XG4gICAgICAvLyBvbmx5IG9wZXJhdGUgb24gYXJyYXlzXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShzdWJzdGl0dXRpb24pKSB7XG4gICAgICAgIHZhciBhcnJheUxlbmd0aCA9IHN1YnN0aXR1dGlvbi5sZW5ndGg7XG4gICAgICAgIHZhciBzZXBhcmF0b3IgPSBvcHRzLnNlcGFyYXRvcjtcbiAgICAgICAgdmFyIGNvbmp1bmN0aW9uID0gb3B0cy5jb25qdW5jdGlvbjtcbiAgICAgICAgdmFyIHNlcmlhbCA9IG9wdHMuc2VyaWFsO1xuICAgICAgICAvLyBqb2luIGVhY2ggaXRlbSBpbiB0aGUgYXJyYXkgaW50byBhIHN0cmluZyB3aGVyZSBlYWNoIGl0ZW0gaXMgc2VwYXJhdGVkIGJ5IHNlcGFyYXRvclxuICAgICAgICAvLyBiZSBzdXJlIHRvIG1haW50YWluIGluZGVudGF0aW9uXG4gICAgICAgIHZhciBpbmRlbnQgPSByZXN1bHRTb0Zhci5tYXRjaCgvKFxcbj9bXlxcU1xcbl0rKSQvKTtcbiAgICAgICAgaWYgKGluZGVudCkge1xuICAgICAgICAgIHN1YnN0aXR1dGlvbiA9IHN1YnN0aXR1dGlvbi5qb2luKHNlcGFyYXRvciArIGluZGVudFsxXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3Vic3RpdHV0aW9uID0gc3Vic3RpdHV0aW9uLmpvaW4oc2VwYXJhdG9yICsgJyAnKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiBjb25qdW5jdGlvbiBpcyBzZXQsIHJlcGxhY2UgdGhlIGxhc3Qgc2VwYXJhdG9yIHdpdGggY29uanVuY3Rpb24sIGJ1dCBvbmx5IGlmIHRoZXJlIGlzIG1vcmUgdGhhbiBvbmUgc3Vic3RpdHV0aW9uXG4gICAgICAgIGlmIChjb25qdW5jdGlvbiAmJiBhcnJheUxlbmd0aCA+IDEpIHtcbiAgICAgICAgICB2YXIgc2VwYXJhdG9ySW5kZXggPSBzdWJzdGl0dXRpb24ubGFzdEluZGV4T2Yoc2VwYXJhdG9yKTtcbiAgICAgICAgICBzdWJzdGl0dXRpb24gPSBzdWJzdGl0dXRpb24uc2xpY2UoMCwgc2VwYXJhdG9ySW5kZXgpICsgKHNlcmlhbCA/IHNlcGFyYXRvciA6ICcnKSArICcgJyArIGNvbmp1bmN0aW9uICsgc3Vic3RpdHV0aW9uLnNsaWNlKHNlcGFyYXRvckluZGV4ICsgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBzdWJzdGl0dXRpb247XG4gICAgfVxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgaW5saW5lQXJyYXlUcmFuc2Zvcm1lcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXBibXhwYm1WQmNuSmhlVlJ5WVc1elptOXliV1Z5TDJsdWJHbHVaVUZ5Y21GNVZISmhibk5tYjNKdFpYSXVhbk1pWFN3aWJtRnRaWE1pT2xzaVpHVm1ZWFZzZEhNaUxDSnpaWEJoY21GMGIzSWlMQ0pqYjI1cWRXNWpkR2x2YmlJc0luTmxjbWxoYkNJc0ltbHViR2x1WlVGeWNtRjVWSEpoYm5ObWIzSnRaWElpTENKdmNIUnpJaXdpYjI1VGRXSnpkR2wwZFhScGIyNGlMQ0p6ZFdKemRHbDBkWFJwYjI0aUxDSnlaWE4xYkhSVGIwWmhjaUlzSWtGeWNtRjVJaXdpYVhOQmNuSmhlU0lzSW1GeWNtRjVUR1Z1WjNSb0lpd2liR1Z1WjNSb0lpd2lhVzVrWlc1MElpd2liV0YwWTJnaUxDSnFiMmx1SWl3aWMyVndZWEpoZEc5eVNXNWtaWGdpTENKc1lYTjBTVzVrWlhoUFppSXNJbk5zYVdObElsMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeEpRVUZOUVN4WFFVRlhPMEZCUTJaRExHRkJRVmNzUlVGRVNUdEJRVVZtUXl4bFFVRmhMRVZCUmtVN1FVRkhaa01zVlVGQlVUdEJRVWhQTEVOQlFXcENPenRCUVUxQk96czdPenM3T3p0QlFWRkJMRWxCUVUxRExIbENRVUY1UWl4VFFVRjZRa0VzYzBKQlFYbENPMEZCUVVFc1RVRkJRME1zU1VGQlJDeDFSVUZCVVV3c1VVRkJVanRCUVVGQkxGTkJRWE5DTzBGQlEyNUVUU3hyUWtGRWJVUXNNRUpCUTNCRFF5eFpRVVJ2UXl4RlFVTjBRa01zVjBGRWMwSXNSVUZEVkR0QlFVTjRRenRCUVVOQkxGVkJRVWxETEUxQlFVMURMRTlCUVU0c1EwRkJZMGdzV1VGQlpDeERRVUZLTEVWQlFXbERPMEZCUXk5Q0xGbEJRVTFKTEdOQlFXTktMR0ZCUVdGTExFMUJRV3BETzBGQlEwRXNXVUZCVFZnc1dVRkJXVWtzUzBGQlMwb3NVMEZCZGtJN1FVRkRRU3haUVVGTlF5eGpRVUZqUnl4TFFVRkxTQ3hYUVVGNlFqdEJRVU5CTEZsQlFVMURMRk5CUVZORkxFdEJRVXRHTEUxQlFYQkNPMEZCUTBFN1FVRkRRVHRCUVVOQkxGbEJRVTFWTEZOQlFWTk1MRmxCUVZsTkxFdEJRVm9zUTBGQmEwSXNaMEpCUVd4Q0xFTkJRV1k3UVVGRFFTeFpRVUZKUkN4TlFVRktMRVZCUVZrN1FVRkRWazRzZVVKQlFXVkJMR0ZCUVdGUkxFbEJRV0lzUTBGQmEwSmtMRmxCUVZsWkxFOUJRVThzUTBGQlVDeERRVUU1UWl4RFFVRm1PMEZCUTBRc1UwRkdSQ3hOUVVWUE8wRkJRMHhPTEhsQ1FVRmxRU3hoUVVGaFVTeEpRVUZpTEVOQlFXdENaQ3haUVVGWkxFZEJRVGxDTEVOQlFXWTdRVUZEUkR0QlFVTkVPMEZCUTBFc1dVRkJTVU1zWlVGQlpWTXNZMEZCWXl4RFFVRnFReXhGUVVGdlF6dEJRVU5zUXl4alFVRk5TeXhwUWtGQmFVSlVMR0ZCUVdGVkxGZEJRV0lzUTBGQmVVSm9RaXhUUVVGNlFpeERRVUYyUWp0QlFVTkJUU3g1UWtGRFJVRXNZVUZCWVZjc1MwRkJZaXhEUVVGdFFpeERRVUZ1UWl4RlFVRnpRa1lzWTBGQmRFSXNTMEZEUTJJc1UwRkJVMFlzVTBGQlZDeEhRVUZ4UWl4RlFVUjBRaXhKUVVWQkxFZEJSa0VzUjBGSFFVTXNWMEZJUVN4SFFVbEJTeXhoUVVGaFZ5eExRVUZpTEVOQlFXMUNSaXhwUWtGQmFVSXNRMEZCY0VNc1EwRk1SanRCUVUxRU8wRkJRMFk3UVVGRFJDeGhRVUZQVkN4WlFVRlFPMEZCUTBRN1FVRTFRbXRFTEVkQlFYUkNPMEZCUVVFc1EwRkJMMEk3TzBGQkswSkJMR1ZCUVdWSUxITkNRVUZtSWl3aVptbHNaU0k2SW1sdWJHbHVaVUZ5Y21GNVZISmhibk5tYjNKdFpYSXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKamIyNXpkQ0JrWldaaGRXeDBjeUE5SUh0Y2JpQWdjMlZ3WVhKaGRHOXlPaUFuSnl4Y2JpQWdZMjl1YW5WdVkzUnBiMjQ2SUNjbkxGeHVJQ0J6WlhKcFlXdzZJR1poYkhObExGeHVmVHRjYmx4dUx5b3FYRzRnS2lCRGIyNTJaWEowY3lCaGJpQmhjbkpoZVNCemRXSnpkR2wwZFhScGIyNGdkRzhnWVNCemRISnBibWNnWTI5dWRHRnBibWx1WnlCaElHeHBjM1JjYmlBcUlFQndZWEpoYlNBZ2UxTjBjbWx1WjMwZ1cyOXdkSE11YzJWd1lYSmhkRzl5SUQwZ0p5ZGRJQzBnZEdobElHTm9ZWEpoWTNSbGNpQjBhR0YwSUhObGNHRnlZWFJsY3lCbFlXTm9JR2wwWlcxY2JpQXFJRUJ3WVhKaGJTQWdlMU4wY21sdVozMGdXMjl3ZEhNdVkyOXVhblZ1WTNScGIyNGdQU0FuSjEwZ0lDMGdjbVZ3YkdGalpTQjBhR1VnYkdGemRDQnpaWEJoY21GMGIzSWdkMmwwYUNCMGFHbHpYRzRnS2lCQWNHRnlZVzBnSUh0Q2IyOXNaV0Z1ZlNCYmIzQjBjeTV6WlhKcFlXd2dQU0JtWVd4elpWMGdMU0JwYm1Oc2RXUmxJSFJvWlNCelpYQmhjbUYwYjNJZ1ltVm1iM0psSUhSb1pTQmpiMjVxZFc1amRHbHZiajhnS0U5NFptOXlaQ0JqYjIxdFlTQjFjMlV0WTJGelpTbGNiaUFxWEc0Z0tpQkFjbVYwZFhKdUlIdFBZbXBsWTNSOUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMU0JoSUZSbGJYQnNZWFJsVkdGbklIUnlZVzV6Wm05eWJXVnlYRzRnS2k5Y2JtTnZibk4wSUdsdWJHbHVaVUZ5Y21GNVZISmhibk5tYjNKdFpYSWdQU0FvYjNCMGN5QTlJR1JsWm1GMWJIUnpLU0E5UGlBb2UxeHVJQ0J2YmxOMVluTjBhWFIxZEdsdmJpaHpkV0p6ZEdsMGRYUnBiMjRzSUhKbGMzVnNkRk52Um1GeUtTQjdYRzRnSUNBZ0x5OGdiMjVzZVNCdmNHVnlZWFJsSUc5dUlHRnljbUY1YzF4dUlDQWdJR2xtSUNoQmNuSmhlUzVwYzBGeWNtRjVLSE4xWW5OMGFYUjFkR2x2YmlrcElIdGNiaUFnSUNBZ0lHTnZibk4wSUdGeWNtRjVUR1Z1WjNSb0lEMGdjM1ZpYzNScGRIVjBhVzl1TG14bGJtZDBhRHRjYmlBZ0lDQWdJR052Ym5OMElITmxjR0Z5WVhSdmNpQTlJRzl3ZEhNdWMyVndZWEpoZEc5eU8xeHVJQ0FnSUNBZ1kyOXVjM1FnWTI5dWFuVnVZM1JwYjI0Z1BTQnZjSFJ6TG1OdmJtcDFibU4wYVc5dU8xeHVJQ0FnSUNBZ1kyOXVjM1FnYzJWeWFXRnNJRDBnYjNCMGN5NXpaWEpwWVd3N1hHNGdJQ0FnSUNBdkx5QnFiMmx1SUdWaFkyZ2dhWFJsYlNCcGJpQjBhR1VnWVhKeVlYa2dhVzUwYnlCaElITjBjbWx1WnlCM2FHVnlaU0JsWVdOb0lHbDBaVzBnYVhNZ2MyVndZWEpoZEdWa0lHSjVJSE5sY0dGeVlYUnZjbHh1SUNBZ0lDQWdMeThnWW1VZ2MzVnlaU0IwYnlCdFlXbHVkR0ZwYmlCcGJtUmxiblJoZEdsdmJseHVJQ0FnSUNBZ1kyOXVjM1FnYVc1a1pXNTBJRDBnY21WemRXeDBVMjlHWVhJdWJXRjBZMmdvTHloY1hHNC9XMTVjWEZOY1hHNWRLeWtrTHlrN1hHNGdJQ0FnSUNCcFppQW9hVzVrWlc1MEtTQjdYRzRnSUNBZ0lDQWdJSE4xWW5OMGFYUjFkR2x2YmlBOUlITjFZbk4wYVhSMWRHbHZiaTVxYjJsdUtITmxjR0Z5WVhSdmNpQXJJR2x1WkdWdWRGc3hYU2s3WEc0Z0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0J6ZFdKemRHbDBkWFJwYjI0Z1BTQnpkV0p6ZEdsMGRYUnBiMjR1YW05cGJpaHpaWEJoY21GMGIzSWdLeUFuSUNjcE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0x5OGdhV1lnWTI5dWFuVnVZM1JwYjI0Z2FYTWdjMlYwTENCeVpYQnNZV05sSUhSb1pTQnNZWE4wSUhObGNHRnlZWFJ2Y2lCM2FYUm9JR052Ym1wMWJtTjBhVzl1TENCaWRYUWdiMjVzZVNCcFppQjBhR1Z5WlNCcGN5QnRiM0psSUhSb1lXNGdiMjVsSUhOMVluTjBhWFIxZEdsdmJseHVJQ0FnSUNBZ2FXWWdLR052Ym1wMWJtTjBhVzl1SUNZbUlHRnljbUY1VEdWdVozUm9JRDRnTVNrZ2UxeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCelpYQmhjbUYwYjNKSmJtUmxlQ0E5SUhOMVluTjBhWFIxZEdsdmJpNXNZWE4wU1c1a1pYaFBaaWh6WlhCaGNtRjBiM0lwTzF4dUlDQWdJQ0FnSUNCemRXSnpkR2wwZFhScGIyNGdQVnh1SUNBZ0lDQWdJQ0FnSUhOMVluTjBhWFIxZEdsdmJpNXpiR2xqWlNnd0xDQnpaWEJoY21GMGIzSkpibVJsZUNrZ0sxeHVJQ0FnSUNBZ0lDQWdJQ2h6WlhKcFlXd2dQeUJ6WlhCaGNtRjBiM0lnT2lBbkp5a2dLMXh1SUNBZ0lDQWdJQ0FnSUNjZ0p5QXJYRzRnSUNBZ0lDQWdJQ0FnWTI5dWFuVnVZM1JwYjI0Z0sxeHVJQ0FnSUNBZ0lDQWdJSE4xWW5OMGFYUjFkR2x2Ymk1emJHbGpaU2h6WlhCaGNtRjBiM0pKYm1SbGVDQXJJREVwTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmlBZ0lDQnlaWFIxY200Z2MzVmljM1JwZEhWMGFXOXVPMXh1SUNCOUxGeHVmU2s3WEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUdsdWJHbHVaVUZ5Y21GNVZISmhibk5tYjNKdFpYSTdYRzRpWFgwPSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL2lubGluZUxpc3RzJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXBibXhwYm1WTWFYTjBjeTlwYm1SbGVDNXFjeUpkTENKdVlXMWxjeUk2V3lKa1pXWmhkV3gwSWwwc0ltMWhjSEJwYm1keklqb2ljVUpCUVc5Q0xHVTdjVUpCUVdKQkxFOGlMQ0ptYVd4bElqb2lhVzVrWlhndWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpsZUhCdmNuUWdaR1ZtWVhWc2RDQm1jbTl0SUNjdUwybHViR2x1WlV4cGMzUnpKenRjYmlKZGZRPT0iLCJpbXBvcnQgVGVtcGxhdGVUYWcgZnJvbSAnLi4vVGVtcGxhdGVUYWcnO1xuaW1wb3J0IHN0cmlwSW5kZW50VHJhbnNmb3JtZXIgZnJvbSAnLi4vc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcic7XG5pbXBvcnQgaW5saW5lQXJyYXlUcmFuc2Zvcm1lciBmcm9tICcuLi9pbmxpbmVBcnJheVRyYW5zZm9ybWVyJztcbmltcG9ydCB0cmltUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcblxudmFyIGlubGluZUxpc3RzID0gbmV3IFRlbXBsYXRlVGFnKGlubGluZUFycmF5VHJhbnNmb3JtZXIsIHN0cmlwSW5kZW50VHJhbnNmb3JtZXIsIHRyaW1SZXN1bHRUcmFuc2Zvcm1lcik7XG5cbmV4cG9ydCBkZWZhdWx0IGlubGluZUxpc3RzO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5cGJteHBibVZNYVhOMGN5OXBibXhwYm1WTWFYTjBjeTVxY3lKZExDSnVZVzFsY3lJNld5SlVaVzF3YkdGMFpWUmhaeUlzSW5OMGNtbHdTVzVrWlc1MFZISmhibk5tYjNKdFpYSWlMQ0pwYm14cGJtVkJjbkpoZVZSeVlXNXpabTl5YldWeUlpd2lkSEpwYlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5SWl3aWFXNXNhVzVsVEdsemRITWlYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRTlCUVU5QkxGZEJRVkFzVFVGQmQwSXNaMEpCUVhoQ08wRkJRMEVzVDBGQlQwTXNjMEpCUVZBc1RVRkJiVU1zTWtKQlFXNURPMEZCUTBFc1QwRkJUME1zYzBKQlFWQXNUVUZCYlVNc01rSkJRVzVETzBGQlEwRXNUMEZCVDBNc2NVSkJRVkFzVFVGQmEwTXNNRUpCUVd4RE96dEJRVVZCTEVsQlFVMURMR05CUVdNc1NVRkJTVW9zVjBGQlNpeERRVU5zUWtVc2MwSkJSR3RDTEVWQlJXeENSQ3h6UWtGR2EwSXNSVUZIYkVKRkxIRkNRVWhyUWl4RFFVRndRanM3UVVGTlFTeGxRVUZsUXl4WFFVRm1JaXdpWm1sc1pTSTZJbWx1YkdsdVpVeHBjM1J6TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lhVzF3YjNKMElGUmxiWEJzWVhSbFZHRm5JR1p5YjIwZ0p5NHVMMVJsYlhCc1lYUmxWR0ZuSnp0Y2JtbHRjRzl5ZENCemRISnBjRWx1WkdWdWRGUnlZVzV6Wm05eWJXVnlJR1p5YjIwZ0p5NHVMM04wY21sd1NXNWtaVzUwVkhKaGJuTm1iM0p0WlhJbk8xeHVhVzF3YjNKMElHbHViR2x1WlVGeWNtRjVWSEpoYm5ObWIzSnRaWElnWm5KdmJTQW5MaTR2YVc1c2FXNWxRWEp5WVhsVWNtRnVjMlp2Y20xbGNpYzdYRzVwYlhCdmNuUWdkSEpwYlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5SUdaeWIyMGdKeTR1TDNSeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpYzdYRzVjYm1OdmJuTjBJR2x1YkdsdVpVeHBjM1J6SUQwZ2JtVjNJRlJsYlhCc1lYUmxWR0ZuS0Z4dUlDQnBibXhwYm1WQmNuSmhlVlJ5WVc1elptOXliV1Z5TEZ4dUlDQnpkSEpwY0VsdVpHVnVkRlJ5WVc1elptOXliV1Z5TEZ4dUlDQjBjbWx0VW1WemRXeDBWSEpoYm5ObWIzSnRaWElzWEc0cE8xeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQnBibXhwYm1WTWFYTjBjenRjYmlKZGZRPT0iLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi9vbmVMaW5lJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXZibVZNYVc1bEwybHVaR1Y0TG1weklsMHNJbTVoYldWeklqcGJJbVJsWm1GMWJIUWlYU3dpYldGd2NHbHVaM01pT2lKeFFrRkJiMElzVnp0eFFrRkJZa0VzVHlJc0ltWnBiR1VpT2lKcGJtUmxlQzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltVjRjRzl5ZENCa1pXWmhkV3gwSUdaeWIyMGdKeTR2YjI1bFRHbHVaU2M3WEc0aVhYMD0iLCJpbXBvcnQgVGVtcGxhdGVUYWcgZnJvbSAnLi4vVGVtcGxhdGVUYWcnO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuaW1wb3J0IHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXInO1xuXG52YXIgb25lTGluZSA9IG5ldyBUZW1wbGF0ZVRhZyhyZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIoLyg/Olxcbig/OlxccyopKSsvZywgJyAnKSwgdHJpbVJlc3VsdFRyYW5zZm9ybWVyKTtcblxuZXhwb3J0IGRlZmF1bHQgb25lTGluZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXZibVZNYVc1bEwyOXVaVXhwYm1VdWFuTWlYU3dpYm1GdFpYTWlPbHNpVkdWdGNHeGhkR1ZVWVdjaUxDSjBjbWx0VW1WemRXeDBWSEpoYm5ObWIzSnRaWElpTENKeVpYQnNZV05sVW1WemRXeDBWSEpoYm5ObWIzSnRaWElpTENKdmJtVk1hVzVsSWwwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4UFFVRlBRU3hYUVVGUUxFMUJRWGRDTEdkQ1FVRjRRanRCUVVOQkxFOUJRVTlETEhGQ1FVRlFMRTFCUVd0RExEQkNRVUZzUXp0QlFVTkJMRTlCUVU5RExIZENRVUZRTEUxQlFYRkRMRFpDUVVGeVF6czdRVUZGUVN4SlFVRk5ReXhWUVVGVkxFbEJRVWxJTEZkQlFVb3NRMEZEWkVVc2VVSkJRWGxDTEdsQ1FVRjZRaXhGUVVFMFF5eEhRVUUxUXl4RFFVUmpMRVZCUldSRUxIRkNRVVpqTEVOQlFXaENPenRCUVV0QkxHVkJRV1ZGTEU5QlFXWWlMQ0ptYVd4bElqb2liMjVsVEdsdVpTNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0JVWlcxd2JHRjBaVlJoWnlCbWNtOXRJQ2N1TGk5VVpXMXdiR0YwWlZSaFp5YzdYRzVwYlhCdmNuUWdkSEpwYlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5SUdaeWIyMGdKeTR1TDNSeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpYzdYRzVwYlhCdmNuUWdjbVZ3YkdGalpWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUlHWnliMjBnSnk0dUwzSmxjR3hoWTJWU1pYTjFiSFJVY21GdWMyWnZjbTFsY2ljN1hHNWNibU52Ym5OMElHOXVaVXhwYm1VZ1BTQnVaWGNnVkdWdGNHeGhkR1ZVWVdjb1hHNGdJSEpsY0d4aFkyVlNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpZ3ZLRDg2WEZ4dUtEODZYRnh6S2lrcEt5OW5MQ0FuSUNjcExGeHVJQ0IwY21sdFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJc1hHNHBPMXh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0J2Ym1WTWFXNWxPMXh1SWwxOSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL29uZUxpbmVDb21tYUxpc3RzJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXZibVZNYVc1bFEyOXRiV0ZNYVhOMGN5OXBibVJsZUM1cWN5SmRMQ0p1WVcxbGN5STZXeUprWldaaGRXeDBJbDBzSW0xaGNIQnBibWR6SWpvaWNVSkJRVzlDTEhGQ08zRkNRVUZpUVN4UElpd2labWxzWlNJNkltbHVaR1Y0TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2laWGh3YjNKMElHUmxabUYxYkhRZ1puSnZiU0FuTGk5dmJtVk1hVzVsUTI5dGJXRk1hWE4wY3ljN1hHNGlYWDA9IiwiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyIGZyb20gJy4uL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuaW1wb3J0IHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXInO1xuXG52YXIgb25lTGluZUNvbW1hTGlzdHMgPSBuZXcgVGVtcGxhdGVUYWcoaW5saW5lQXJyYXlUcmFuc2Zvcm1lcih7IHNlcGFyYXRvcjogJywnIH0pLCByZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIoLyg/OlxccyspL2csICcgJyksIHRyaW1SZXN1bHRUcmFuc2Zvcm1lcik7XG5cbmV4cG9ydCBkZWZhdWx0IG9uZUxpbmVDb21tYUxpc3RzO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5dmJtVk1hVzVsUTI5dGJXRk1hWE4wY3k5dmJtVk1hVzVsUTI5dGJXRk1hWE4wY3k1cWN5SmRMQ0p1WVcxbGN5STZXeUpVWlcxd2JHRjBaVlJoWnlJc0ltbHViR2x1WlVGeWNtRjVWSEpoYm5ObWIzSnRaWElpTENKMGNtbHRVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSWlMQ0p5WlhCc1lXTmxVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSWlMQ0p2Ym1WTWFXNWxRMjl0YldGTWFYTjBjeUlzSW5ObGNHRnlZWFJ2Y2lKZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1QwRkJUMEVzVjBGQlVDeE5RVUYzUWl4blFrRkJlRUk3UVVGRFFTeFBRVUZQUXl4elFrRkJVQ3hOUVVGdFF5d3lRa0ZCYmtNN1FVRkRRU3hQUVVGUFF5eHhRa0ZCVUN4TlFVRnJReXd3UWtGQmJFTTdRVUZEUVN4UFFVRlBReXgzUWtGQlVDeE5RVUZ4UXl3MlFrRkJja003TzBGQlJVRXNTVUZCVFVNc2IwSkJRVzlDTEVsQlFVbEtMRmRCUVVvc1EwRkRlRUpETEhWQ1FVRjFRaXhGUVVGRlNTeFhRVUZYTEVkQlFXSXNSVUZCZGtJc1EwRkVkMElzUlVGRmVFSkdMSGxDUVVGNVFpeFZRVUY2UWl4RlFVRnhReXhIUVVGeVF5eERRVVozUWl4RlFVZDRRa1FzY1VKQlNIZENMRU5CUVRGQ096dEJRVTFCTEdWQlFXVkZMR2xDUVVGbUlpd2labWxzWlNJNkltOXVaVXhwYm1WRGIyMXRZVXhwYzNSekxtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJRlJsYlhCc1lYUmxWR0ZuSUdaeWIyMGdKeTR1TDFSbGJYQnNZWFJsVkdGbkp6dGNibWx0Y0c5eWRDQnBibXhwYm1WQmNuSmhlVlJ5WVc1elptOXliV1Z5SUdaeWIyMGdKeTR1TDJsdWJHbHVaVUZ5Y21GNVZISmhibk5tYjNKdFpYSW5PMXh1YVcxd2IzSjBJSFJ5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lCbWNtOXRJQ2N1TGk5MGNtbHRVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSW5PMXh1YVcxd2IzSjBJSEpsY0d4aFkyVlNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpQm1jbTl0SUNjdUxpOXlaWEJzWVdObFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJbk8xeHVYRzVqYjI1emRDQnZibVZNYVc1bFEyOXRiV0ZNYVhOMGN5QTlJRzVsZHlCVVpXMXdiR0YwWlZSaFp5aGNiaUFnYVc1c2FXNWxRWEp5WVhsVWNtRnVjMlp2Y20xbGNpaDdJSE5sY0dGeVlYUnZjam9nSnl3bklIMHBMRnh1SUNCeVpYQnNZV05sVW1WemRXeDBWSEpoYm5ObWIzSnRaWElvTHlnL09seGNjeXNwTDJjc0lDY2dKeWtzWEc0Z0lIUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaXhjYmlrN1hHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElHOXVaVXhwYm1WRGIyMXRZVXhwYzNSek8xeHVJbDE5IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vb25lTGluZUNvbW1hTGlzdHNBbmQnO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5dmJtVk1hVzVsUTI5dGJXRk1hWE4wYzBGdVpDOXBibVJsZUM1cWN5SmRMQ0p1WVcxbGN5STZXeUprWldaaGRXeDBJbDBzSW0xaGNIQnBibWR6SWpvaWNVSkJRVzlDTEhkQ08zRkNRVUZpUVN4UElpd2labWxzWlNJNkltbHVaR1Y0TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2laWGh3YjNKMElHUmxabUYxYkhRZ1puSnZiU0FuTGk5dmJtVk1hVzVsUTI5dGJXRk1hWE4wYzBGdVpDYzdYRzRpWFgwPSIsImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgaW5saW5lQXJyYXlUcmFuc2Zvcm1lciBmcm9tICcuLi9pbmxpbmVBcnJheVRyYW5zZm9ybWVyJztcbmltcG9ydCB0cmltUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcbmltcG9ydCByZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyJztcblxudmFyIG9uZUxpbmVDb21tYUxpc3RzQW5kID0gbmV3IFRlbXBsYXRlVGFnKGlubGluZUFycmF5VHJhbnNmb3JtZXIoeyBzZXBhcmF0b3I6ICcsJywgY29uanVuY3Rpb246ICdhbmQnIH0pLCByZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIoLyg/OlxccyspL2csICcgJyksIHRyaW1SZXN1bHRUcmFuc2Zvcm1lcik7XG5cbmV4cG9ydCBkZWZhdWx0IG9uZUxpbmVDb21tYUxpc3RzQW5kO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5dmJtVk1hVzVsUTI5dGJXRk1hWE4wYzBGdVpDOXZibVZNYVc1bFEyOXRiV0ZNYVhOMGMwRnVaQzVxY3lKZExDSnVZVzFsY3lJNld5SlVaVzF3YkdGMFpWUmhaeUlzSW1sdWJHbHVaVUZ5Y21GNVZISmhibk5tYjNKdFpYSWlMQ0owY21sdFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJaUxDSnlaWEJzWVdObFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJaUxDSnZibVZNYVc1bFEyOXRiV0ZNYVhOMGMwRnVaQ0lzSW5ObGNHRnlZWFJ2Y2lJc0ltTnZibXAxYm1OMGFXOXVJbDBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hQUVVGUFFTeFhRVUZRTEUxQlFYZENMR2RDUVVGNFFqdEJRVU5CTEU5QlFVOURMSE5DUVVGUUxFMUJRVzFETERKQ1FVRnVRenRCUVVOQkxFOUJRVTlETEhGQ1FVRlFMRTFCUVd0RExEQkNRVUZzUXp0QlFVTkJMRTlCUVU5RExIZENRVUZRTEUxQlFYRkRMRFpDUVVGeVF6czdRVUZGUVN4SlFVRk5ReXgxUWtGQmRVSXNTVUZCU1Vvc1YwRkJTaXhEUVVNelFrTXNkVUpCUVhWQ0xFVkJRVVZKTEZkQlFWY3NSMEZCWWl4RlFVRnJRa01zWVVGQllTeExRVUV2UWl4RlFVRjJRaXhEUVVReVFpeEZRVVV6UWtnc2VVSkJRWGxDTEZWQlFYcENMRVZCUVhGRExFZEJRWEpETEVOQlJqSkNMRVZCUnpOQ1JDeHhRa0ZJTWtJc1EwRkJOMEk3TzBGQlRVRXNaVUZCWlVVc2IwSkJRV1lpTENKbWFXeGxJam9pYjI1bFRHbHVaVU52YlcxaFRHbHpkSE5CYm1RdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpwYlhCdmNuUWdWR1Z0Y0d4aGRHVlVZV2NnWm5KdmJTQW5MaTR2VkdWdGNHeGhkR1ZVWVdjbk8xeHVhVzF3YjNKMElHbHViR2x1WlVGeWNtRjVWSEpoYm5ObWIzSnRaWElnWm5KdmJTQW5MaTR2YVc1c2FXNWxRWEp5WVhsVWNtRnVjMlp2Y20xbGNpYzdYRzVwYlhCdmNuUWdkSEpwYlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5SUdaeWIyMGdKeTR1TDNSeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpYzdYRzVwYlhCdmNuUWdjbVZ3YkdGalpWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUlHWnliMjBnSnk0dUwzSmxjR3hoWTJWU1pYTjFiSFJVY21GdWMyWnZjbTFsY2ljN1hHNWNibU52Ym5OMElHOXVaVXhwYm1WRGIyMXRZVXhwYzNSelFXNWtJRDBnYm1WM0lGUmxiWEJzWVhSbFZHRm5LRnh1SUNCcGJteHBibVZCY25KaGVWUnlZVzV6Wm05eWJXVnlLSHNnYzJWd1lYSmhkRzl5T2lBbkxDY3NJR052Ym1wMWJtTjBhVzl1T2lBbllXNWtKeUI5S1N4Y2JpQWdjbVZ3YkdGalpWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUtDOG9QenBjWEhNcktTOW5MQ0FuSUNjcExGeHVJQ0IwY21sdFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJc1hHNHBPMXh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0J2Ym1WTWFXNWxRMjl0YldGTWFYTjBjMEZ1WkR0Y2JpSmRmUT09IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vb25lTGluZUNvbW1hTGlzdHNPcic7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl2Ym1WTWFXNWxRMjl0YldGTWFYTjBjMDl5TDJsdVpHVjRMbXB6SWwwc0ltNWhiV1Z6SWpwYkltUmxabUYxYkhRaVhTd2liV0Z3Y0dsdVozTWlPaUp4UWtGQmIwSXNkVUk3Y1VKQlFXSkJMRThpTENKbWFXeGxJam9pYVc1a1pYZ3Vhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKbGVIQnZjblFnWkdWbVlYVnNkQ0JtY205dElDY3VMMjl1WlV4cGJtVkRiMjF0WVV4cGMzUnpUM0luTzF4dUlsMTkiLCJpbXBvcnQgVGVtcGxhdGVUYWcgZnJvbSAnLi4vVGVtcGxhdGVUYWcnO1xuaW1wb3J0IGlubGluZUFycmF5VHJhbnNmb3JtZXIgZnJvbSAnLi4vaW5saW5lQXJyYXlUcmFuc2Zvcm1lcic7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5pbXBvcnQgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3JlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcic7XG5cbnZhciBvbmVMaW5lQ29tbWFMaXN0c09yID0gbmV3IFRlbXBsYXRlVGFnKGlubGluZUFycmF5VHJhbnNmb3JtZXIoeyBzZXBhcmF0b3I6ICcsJywgY29uanVuY3Rpb246ICdvcicgfSksIHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcigvKD86XFxzKykvZywgJyAnKSwgdHJpbVJlc3VsdFRyYW5zZm9ybWVyKTtcblxuZXhwb3J0IGRlZmF1bHQgb25lTGluZUNvbW1hTGlzdHNPcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXZibVZNYVc1bFEyOXRiV0ZNYVhOMGMwOXlMMjl1WlV4cGJtVkRiMjF0WVV4cGMzUnpUM0l1YW5NaVhTd2libUZ0WlhNaU9sc2lWR1Z0Y0d4aGRHVlVZV2NpTENKcGJteHBibVZCY25KaGVWUnlZVzV6Wm05eWJXVnlJaXdpZEhKcGJWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUlpd2ljbVZ3YkdGalpWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUlpd2liMjVsVEdsdVpVTnZiVzFoVEdsemRITlBjaUlzSW5ObGNHRnlZWFJ2Y2lJc0ltTnZibXAxYm1OMGFXOXVJbDBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hQUVVGUFFTeFhRVUZRTEUxQlFYZENMR2RDUVVGNFFqdEJRVU5CTEU5QlFVOURMSE5DUVVGUUxFMUJRVzFETERKQ1FVRnVRenRCUVVOQkxFOUJRVTlETEhGQ1FVRlFMRTFCUVd0RExEQkNRVUZzUXp0QlFVTkJMRTlCUVU5RExIZENRVUZRTEUxQlFYRkRMRFpDUVVGeVF6czdRVUZGUVN4SlFVRk5ReXh6UWtGQmMwSXNTVUZCU1Vvc1YwRkJTaXhEUVVNeFFrTXNkVUpCUVhWQ0xFVkJRVVZKTEZkQlFWY3NSMEZCWWl4RlFVRnJRa01zWVVGQllTeEpRVUV2UWl4RlFVRjJRaXhEUVVRd1FpeEZRVVV4UWtnc2VVSkJRWGxDTEZWQlFYcENMRVZCUVhGRExFZEJRWEpETEVOQlJqQkNMRVZCUnpGQ1JDeHhRa0ZJTUVJc1EwRkJOVUk3TzBGQlRVRXNaVUZCWlVVc2JVSkJRV1lpTENKbWFXeGxJam9pYjI1bFRHbHVaVU52YlcxaFRHbHpkSE5QY2k1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbWx0Y0c5eWRDQlVaVzF3YkdGMFpWUmhaeUJtY205dElDY3VMaTlVWlcxd2JHRjBaVlJoWnljN1hHNXBiWEJ2Y25RZ2FXNXNhVzVsUVhKeVlYbFVjbUZ1YzJadmNtMWxjaUJtY205dElDY3VMaTlwYm14cGJtVkJjbkpoZVZSeVlXNXpabTl5YldWeUp6dGNibWx0Y0c5eWRDQjBjbWx0VW1WemRXeDBWSEpoYm5ObWIzSnRaWElnWm5KdmJTQW5MaTR2ZEhKcGJWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUp6dGNibWx0Y0c5eWRDQnlaWEJzWVdObFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJZ1puSnZiU0FuTGk0dmNtVndiR0ZqWlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5Snp0Y2JseHVZMjl1YzNRZ2IyNWxUR2x1WlVOdmJXMWhUR2x6ZEhOUGNpQTlJRzVsZHlCVVpXMXdiR0YwWlZSaFp5aGNiaUFnYVc1c2FXNWxRWEp5WVhsVWNtRnVjMlp2Y20xbGNpaDdJSE5sY0dGeVlYUnZjam9nSnl3bkxDQmpiMjVxZFc1amRHbHZiam9nSjI5eUp5QjlLU3hjYmlBZ2NtVndiR0ZqWlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5S0M4b1B6cGNYSE1yS1M5bkxDQW5JQ2NwTEZ4dUlDQjBjbWx0VW1WemRXeDBWSEpoYm5ObWIzSnRaWElzWEc0cE8xeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQnZibVZNYVc1bFEyOXRiV0ZNYVhOMGMwOXlPMXh1SWwxOSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL29uZUxpbmVJbmxpbmVMaXN0cyc7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl2Ym1WTWFXNWxTVzVzYVc1bFRHbHpkSE12YVc1a1pYZ3Vhbk1pWFN3aWJtRnRaWE1pT2xzaVpHVm1ZWFZzZENKZExDSnRZWEJ3YVc1bmN5STZJbkZDUVVGdlFpeHpRanR4UWtGQllrRXNUeUlzSW1acGJHVWlPaUpwYm1SbGVDNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1WNGNHOXlkQ0JrWldaaGRXeDBJR1p5YjIwZ0p5NHZiMjVsVEdsdVpVbHViR2x1WlV4cGMzUnpKenRjYmlKZGZRPT0iLCJpbXBvcnQgVGVtcGxhdGVUYWcgZnJvbSAnLi4vVGVtcGxhdGVUYWcnO1xuaW1wb3J0IGlubGluZUFycmF5VHJhbnNmb3JtZXIgZnJvbSAnLi4vaW5saW5lQXJyYXlUcmFuc2Zvcm1lcic7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5pbXBvcnQgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3JlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcic7XG5cbnZhciBvbmVMaW5lSW5saW5lTGlzdHMgPSBuZXcgVGVtcGxhdGVUYWcoaW5saW5lQXJyYXlUcmFuc2Zvcm1lciwgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyKC8oPzpcXHMrKS9nLCAnICcpLCB0cmltUmVzdWx0VHJhbnNmb3JtZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBvbmVMaW5lSW5saW5lTGlzdHM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl2Ym1WTWFXNWxTVzVzYVc1bFRHbHpkSE12YjI1bFRHbHVaVWx1YkdsdVpVeHBjM1J6TG1weklsMHNJbTVoYldWeklqcGJJbFJsYlhCc1lYUmxWR0ZuSWl3aWFXNXNhVzVsUVhKeVlYbFVjbUZ1YzJadmNtMWxjaUlzSW5SeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpSXNJbkpsY0d4aFkyVlNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpSXNJbTl1WlV4cGJtVkpibXhwYm1WTWFYTjBjeUpkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzVDBGQlQwRXNWMEZCVUN4TlFVRjNRaXhuUWtGQmVFSTdRVUZEUVN4UFFVRlBReXh6UWtGQlVDeE5RVUZ0UXl3eVFrRkJia003UVVGRFFTeFBRVUZQUXl4eFFrRkJVQ3hOUVVGclF5d3dRa0ZCYkVNN1FVRkRRU3hQUVVGUFF5eDNRa0ZCVUN4TlFVRnhReXcyUWtGQmNrTTdPMEZCUlVFc1NVRkJUVU1zY1VKQlFYRkNMRWxCUVVsS0xGZEJRVW9zUTBGRGVrSkRMSE5DUVVSNVFpeEZRVVY2UWtVc2VVSkJRWGxDTEZWQlFYcENMRVZCUVhGRExFZEJRWEpETEVOQlJubENMRVZCUjNwQ1JDeHhRa0ZJZVVJc1EwRkJNMEk3TzBGQlRVRXNaVUZCWlVVc2EwSkJRV1lpTENKbWFXeGxJam9pYjI1bFRHbHVaVWx1YkdsdVpVeHBjM1J6TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lhVzF3YjNKMElGUmxiWEJzWVhSbFZHRm5JR1p5YjIwZ0p5NHVMMVJsYlhCc1lYUmxWR0ZuSnp0Y2JtbHRjRzl5ZENCcGJteHBibVZCY25KaGVWUnlZVzV6Wm05eWJXVnlJR1p5YjIwZ0p5NHVMMmx1YkdsdVpVRnljbUY1VkhKaGJuTm1iM0p0WlhJbk8xeHVhVzF3YjNKMElIUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUJtY205dElDY3VMaTkwY21sdFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJbk8xeHVhVzF3YjNKMElISmxjR3hoWTJWU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lCbWNtOXRJQ2N1TGk5eVpYQnNZV05sVW1WemRXeDBWSEpoYm5ObWIzSnRaWEluTzF4dVhHNWpiMjV6ZENCdmJtVk1hVzVsU1c1c2FXNWxUR2x6ZEhNZ1BTQnVaWGNnVkdWdGNHeGhkR1ZVWVdjb1hHNGdJR2x1YkdsdVpVRnljbUY1VkhKaGJuTm1iM0p0WlhJc1hHNGdJSEpsY0d4aFkyVlNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpZ3ZLRDg2WEZ4ekt5a3ZaeXdnSnlBbktTeGNiaUFnZEhKcGJWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUxGeHVLVHRjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnYjI1bFRHbHVaVWx1YkdsdVpVeHBjM1J6TzF4dUlsMTkiLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi9vbmVMaW5lVHJpbSc7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl2Ym1WTWFXNWxWSEpwYlM5cGJtUmxlQzVxY3lKZExDSnVZVzFsY3lJNld5SmtaV1poZFd4MElsMHNJbTFoY0hCcGJtZHpJam9pY1VKQlFXOUNMR1U3Y1VKQlFXSkJMRThpTENKbWFXeGxJam9pYVc1a1pYZ3Vhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKbGVIQnZjblFnWkdWbVlYVnNkQ0JtY205dElDY3VMMjl1WlV4cGJtVlVjbWx0Snp0Y2JpSmRmUT09IiwiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCB0cmltUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcbmltcG9ydCByZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyJztcblxudmFyIG9uZUxpbmVUcmltID0gbmV3IFRlbXBsYXRlVGFnKHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcigvKD86XFxuXFxzKikvZywgJycpLCB0cmltUmVzdWx0VHJhbnNmb3JtZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBvbmVMaW5lVHJpbTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXZibVZNYVc1bFZISnBiUzl2Ym1WTWFXNWxWSEpwYlM1cWN5SmRMQ0p1WVcxbGN5STZXeUpVWlcxd2JHRjBaVlJoWnlJc0luUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUlzSW5KbGNHeGhZMlZTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUlzSW05dVpVeHBibVZVY21sdElsMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeFBRVUZQUVN4WFFVRlFMRTFCUVhkQ0xHZENRVUY0UWp0QlFVTkJMRTlCUVU5RExIRkNRVUZRTEUxQlFXdERMREJDUVVGc1F6dEJRVU5CTEU5QlFVOURMSGRDUVVGUUxFMUJRWEZETERaQ1FVRnlRenM3UVVGRlFTeEpRVUZOUXl4alFVRmpMRWxCUVVsSUxGZEJRVW9zUTBGRGJFSkZMSGxDUVVGNVFpeFpRVUY2UWl4RlFVRjFReXhGUVVGMlF5eERRVVJyUWl4RlFVVnNRa1FzY1VKQlJtdENMRU5CUVhCQ096dEJRVXRCTEdWQlFXVkZMRmRCUVdZaUxDSm1hV3hsSWpvaWIyNWxUR2x1WlZSeWFXMHVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKcGJYQnZjblFnVkdWdGNHeGhkR1ZVWVdjZ1puSnZiU0FuTGk0dlZHVnRjR3hoZEdWVVlXY25PMXh1YVcxd2IzSjBJSFJ5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lCbWNtOXRJQ2N1TGk5MGNtbHRVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSW5PMXh1YVcxd2IzSjBJSEpsY0d4aFkyVlNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpQm1jbTl0SUNjdUxpOXlaWEJzWVdObFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJbk8xeHVYRzVqYjI1emRDQnZibVZNYVc1bFZISnBiU0E5SUc1bGR5QlVaVzF3YkdGMFpWUmhaeWhjYmlBZ2NtVndiR0ZqWlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5S0M4b1B6cGNYRzVjWEhNcUtTOW5MQ0FuSnlrc1hHNGdJSFJ5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2l4Y2JpazdYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRzl1WlV4cGJtVlVjbWx0TzF4dUlsMTkiLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi9yZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXlaVzF2ZG1WT2IyNVFjbWx1ZEdsdVoxWmhiSFZsYzFSeVlXNXpabTl5YldWeUwybHVaR1Y0TG1weklsMHNJbTVoYldWeklqcGJJbVJsWm1GMWJIUWlYU3dpYldGd2NHbHVaM01pT2lKeFFrRkJiMElzYzBNN2NVSkJRV0pCTEU4aUxDSm1hV3hsSWpvaWFXNWtaWGd1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmxlSEJ2Y25RZ1pHVm1ZWFZzZENCbWNtOXRJQ2N1TDNKbGJXOTJaVTV2YmxCeWFXNTBhVzVuVm1Gc2RXVnpWSEpoYm5ObWIzSnRaWEluTzF4dUlsMTkiLCJ2YXIgaXNWYWxpZFZhbHVlID0gZnVuY3Rpb24gaXNWYWxpZFZhbHVlKHgpIHtcbiAgcmV0dXJuIHggIT0gbnVsbCAmJiAhTnVtYmVyLmlzTmFOKHgpICYmIHR5cGVvZiB4ICE9PSAnYm9vbGVhbic7XG59O1xuXG52YXIgcmVtb3ZlTm9uUHJpbnRpbmdWYWx1ZXNUcmFuc2Zvcm1lciA9IGZ1bmN0aW9uIHJlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXIoKSB7XG4gIHJldHVybiB7XG4gICAgb25TdWJzdGl0dXRpb246IGZ1bmN0aW9uIG9uU3Vic3RpdHV0aW9uKHN1YnN0aXR1dGlvbikge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc3Vic3RpdHV0aW9uKSkge1xuICAgICAgICByZXR1cm4gc3Vic3RpdHV0aW9uLmZpbHRlcihpc1ZhbGlkVmFsdWUpO1xuICAgICAgfVxuICAgICAgaWYgKGlzVmFsaWRWYWx1ZShzdWJzdGl0dXRpb24pKSB7XG4gICAgICAgIHJldHVybiBzdWJzdGl0dXRpb247XG4gICAgICB9XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgcmVtb3ZlTm9uUHJpbnRpbmdWYWx1ZXNUcmFuc2Zvcm1lcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXlaVzF2ZG1WT2IyNVFjbWx1ZEdsdVoxWmhiSFZsYzFSeVlXNXpabTl5YldWeUwzSmxiVzkyWlU1dmJsQnlhVzUwYVc1blZtRnNkV1Z6VkhKaGJuTm1iM0p0WlhJdWFuTWlYU3dpYm1GdFpYTWlPbHNpYVhOV1lXeHBaRlpoYkhWbElpd2llQ0lzSWs1MWJXSmxjaUlzSW1selRtRk9JaXdpY21WdGIzWmxUbTl1VUhKcGJuUnBibWRXWVd4MVpYTlVjbUZ1YzJadmNtMWxjaUlzSW05dVUzVmljM1JwZEhWMGFXOXVJaXdpYzNWaWMzUnBkSFYwYVc5dUlpd2lRWEp5WVhraUxDSnBjMEZ5Y21GNUlpd2labWxzZEdWeUlsMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeEpRVUZOUVN4bFFVRmxMRk5CUVdaQkxGbEJRV1U3UVVGQlFTeFRRVU51UWtNc1MwRkJTeXhKUVVGTUxFbEJRV0VzUTBGQlEwTXNUMEZCVDBNc1MwRkJVQ3hEUVVGaFJpeERRVUZpTEVOQlFXUXNTVUZCYVVNc1QwRkJUMEVzUTBGQlVDeExRVUZoTEZOQlJETkNPMEZCUVVFc1EwRkJja0k3TzBGQlIwRXNTVUZCVFVjc2NVTkJRWEZETEZOQlFYSkRRU3hyUTBGQmNVTTdRVUZCUVN4VFFVRlBPMEZCUTJoRVF5eHJRa0ZFWjBRc01FSkJRMnBEUXl4WlFVUnBReXhGUVVOdVFqdEJRVU16UWl4VlFVRkpReXhOUVVGTlF5eFBRVUZPTEVOQlFXTkdMRmxCUVdRc1EwRkJTaXhGUVVGcFF6dEJRVU12UWl4bFFVRlBRU3hoUVVGaFJ5eE5RVUZpTEVOQlFXOUNWQ3haUVVGd1FpeERRVUZRTzBGQlEwUTdRVUZEUkN4VlFVRkpRU3hoUVVGaFRTeFpRVUZpTEVOQlFVb3NSVUZCWjBNN1FVRkRPVUlzWlVGQlQwRXNXVUZCVUR0QlFVTkVPMEZCUTBRc1lVRkJUeXhGUVVGUU8wRkJRMFE3UVVGVUswTXNSMEZCVUR0QlFVRkJMRU5CUVRORE96dEJRVmxCTEdWQlFXVkdMR3REUVVGbUlpd2labWxzWlNJNkluSmxiVzkyWlU1dmJsQnlhVzUwYVc1blZtRnNkV1Z6VkhKaGJuTm1iM0p0WlhJdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpqYjI1emRDQnBjMVpoYkdsa1ZtRnNkV1VnUFNCNElEMCtYRzRnSUhnZ0lUMGdiblZzYkNBbUppQWhUblZ0WW1WeUxtbHpUbUZPS0hncElDWW1JSFI1Y0dWdlppQjRJQ0U5UFNBblltOXZiR1ZoYmljN1hHNWNibU52Ym5OMElISmxiVzkyWlU1dmJsQnlhVzUwYVc1blZtRnNkV1Z6VkhKaGJuTm1iM0p0WlhJZ1BTQW9LU0E5UGlBb2UxeHVJQ0J2YmxOMVluTjBhWFIxZEdsdmJpaHpkV0p6ZEdsMGRYUnBiMjRwSUh0Y2JpQWdJQ0JwWmlBb1FYSnlZWGt1YVhOQmNuSmhlU2h6ZFdKemRHbDBkWFJwYjI0cEtTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2MzVmljM1JwZEhWMGFXOXVMbVpwYkhSbGNpaHBjMVpoYkdsa1ZtRnNkV1VwTzF4dUlDQWdJSDFjYmlBZ0lDQnBaaUFvYVhOV1lXeHBaRlpoYkhWbEtITjFZbk4wYVhSMWRHbHZiaWtwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ6ZFdKemRHbDBkWFJwYjI0N1hHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQW5KenRjYmlBZ2ZTeGNibjBwTzF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCeVpXMXZkbVZPYjI1UWNtbHVkR2x1WjFaaGJIVmxjMVJ5WVc1elptOXliV1Z5TzF4dUlsMTkiLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXInO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5eVpYQnNZV05sVW1WemRXeDBWSEpoYm5ObWIzSnRaWEl2YVc1a1pYZ3Vhbk1pWFN3aWJtRnRaWE1pT2xzaVpHVm1ZWFZzZENKZExDSnRZWEJ3YVc1bmN5STZJbkZDUVVGdlFpdzBRanR4UWtGQllrRXNUeUlzSW1acGJHVWlPaUpwYm1SbGVDNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1WNGNHOXlkQ0JrWldaaGRXeDBJR1p5YjIwZ0p5NHZjbVZ3YkdGalpWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUp6dGNiaUpkZlE9PSIsIi8qKlxuICogUmVwbGFjZXMgdGFicywgbmV3bGluZXMgYW5kIHNwYWNlcyB3aXRoIHRoZSBjaG9zZW4gdmFsdWUgd2hlbiB0aGV5IG9jY3VyIGluIHNlcXVlbmNlc1xuICogQHBhcmFtICB7KFN0cmluZ3xSZWdFeHApfSByZXBsYWNlV2hhdCAtIHRoZSB2YWx1ZSBvciBwYXR0ZXJuIHRoYXQgc2hvdWxkIGJlIHJlcGxhY2VkXG4gKiBAcGFyYW0gIHsqfSAgICAgICAgICAgICAgIHJlcGxhY2VXaXRoIC0gdGhlIHJlcGxhY2VtZW50IHZhbHVlXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgIC0gYSBUZW1wbGF0ZVRhZyB0cmFuc2Zvcm1lclxuICovXG52YXIgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyID0gZnVuY3Rpb24gcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyKHJlcGxhY2VXaGF0LCByZXBsYWNlV2l0aCkge1xuICByZXR1cm4ge1xuICAgIG9uRW5kUmVzdWx0OiBmdW5jdGlvbiBvbkVuZFJlc3VsdChlbmRSZXN1bHQpIHtcbiAgICAgIGlmIChyZXBsYWNlV2hhdCA9PSBudWxsIHx8IHJlcGxhY2VXaXRoID09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdyZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIgcmVxdWlyZXMgYXQgbGVhc3QgMiBhcmd1bWVudHMuJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZW5kUmVzdWx0LnJlcGxhY2UocmVwbGFjZVdoYXQsIHJlcGxhY2VXaXRoKTtcbiAgICB9XG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCByZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl5WlhCc1lXTmxVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSXZjbVZ3YkdGalpWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUxtcHpJbDBzSW01aGJXVnpJanBiSW5KbGNHeGhZMlZTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUlzSW5KbGNHeGhZMlZYYUdGMElpd2ljbVZ3YkdGalpWZHBkR2dpTENKdmJrVnVaRkpsYzNWc2RDSXNJbVZ1WkZKbGMzVnNkQ0lzSWtWeWNtOXlJaXdpY21Wd2JHRmpaU0pkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3T3pzN096dEJRVTFCTEVsQlFVMUJMREpDUVVFeVFpeFRRVUV6UWtFc2QwSkJRVEpDTEVOQlFVTkRMRmRCUVVRc1JVRkJZME1zVjBGQlpEdEJRVUZCTEZOQlFTdENPMEZCUXpsRVF5eGxRVVE0UkN4MVFrRkRiRVJETEZOQlJHdEVMRVZCUTNaRE8wRkJRM0pDTEZWQlFVbElMR1ZCUVdVc1NVRkJaaXhKUVVGMVFrTXNaVUZCWlN4SlFVRXhReXhGUVVGblJEdEJRVU01UXl4alFVRk5MRWxCUVVsSExFdEJRVW9zUTBGRFNpeDVSRUZFU1N4RFFVRk9PMEZCUjBRN1FVRkRSQ3hoUVVGUFJDeFZRVUZWUlN4UFFVRldMRU5CUVd0Q1RDeFhRVUZzUWl4RlFVRXJRa01zVjBGQkwwSXNRMEZCVUR0QlFVTkVPMEZCVWpaRUxFZEJRUzlDTzBGQlFVRXNRMEZCYWtNN08wRkJWMEVzWlVGQlpVWXNkMEpCUVdZaUxDSm1hV3hsSWpvaWNtVndiR0ZqWlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeW9xWEc0Z0tpQlNaWEJzWVdObGN5QjBZV0p6TENCdVpYZHNhVzVsY3lCaGJtUWdjM0JoWTJWeklIZHBkR2dnZEdobElHTm9iM05sYmlCMllXeDFaU0IzYUdWdUlIUm9aWGtnYjJOamRYSWdhVzRnYzJWeGRXVnVZMlZ6WEc0Z0tpQkFjR0Z5WVcwZ0lIc29VM1J5YVc1bmZGSmxaMFY0Y0NsOUlISmxjR3hoWTJWWGFHRjBJQzBnZEdobElIWmhiSFZsSUc5eUlIQmhkSFJsY200Z2RHaGhkQ0J6YUc5MWJHUWdZbVVnY21Wd2JHRmpaV1JjYmlBcUlFQndZWEpoYlNBZ2V5cDlJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2NtVndiR0ZqWlZkcGRHZ2dMU0IwYUdVZ2NtVndiR0ZqWlcxbGJuUWdkbUZzZFdWY2JpQXFJRUJ5WlhSMWNtNGdlMDlpYW1WamRIMGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnTFNCaElGUmxiWEJzWVhSbFZHRm5JSFJ5WVc1elptOXliV1Z5WEc0Z0tpOWNibU52Ym5OMElISmxjR3hoWTJWU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lBOUlDaHlaWEJzWVdObFYyaGhkQ3dnY21Wd2JHRmpaVmRwZEdncElEMCtJQ2g3WEc0Z0lHOXVSVzVrVW1WemRXeDBLR1Z1WkZKbGMzVnNkQ2tnZTF4dUlDQWdJR2xtSUNoeVpYQnNZV05sVjJoaGRDQTlQU0J1ZFd4c0lIeDhJSEpsY0d4aFkyVlhhWFJvSUQwOUlHNTFiR3dwSUh0Y2JpQWdJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWhjYmlBZ0lDQWdJQ0FnSjNKbGNHeGhZMlZTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUJ5WlhGMWFYSmxjeUJoZENCc1pXRnpkQ0F5SUdGeVozVnRaVzUwY3k0bkxGeHVJQ0FnSUNBZ0tUdGNiaUFnSUNCOVhHNGdJQ0FnY21WMGRYSnVJR1Z1WkZKbGMzVnNkQzV5WlhCc1lXTmxLSEpsY0d4aFkyVlhhR0YwTENCeVpYQnNZV05sVjJsMGFDazdYRzRnSUgwc1hHNTlLVHRjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnY21Wd2JHRmpaVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlPMXh1SWwxOSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL3JlcGxhY2VTdHJpbmdUcmFuc2Zvcm1lcic7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl5WlhCc1lXTmxVM1J5YVc1blZISmhibk5tYjNKdFpYSXZhVzVrWlhndWFuTWlYU3dpYm1GdFpYTWlPbHNpWkdWbVlYVnNkQ0pkTENKdFlYQndhVzVuY3lJNkluRkNRVUZ2UWl3MFFqdHhRa0ZCWWtFc1R5SXNJbVpwYkdVaU9pSnBibVJsZUM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbVY0Y0c5eWRDQmtaV1poZFd4MElHWnliMjBnSnk0dmNtVndiR0ZqWlZOMGNtbHVaMVJ5WVc1elptOXliV1Z5Snp0Y2JpSmRmUT09IiwidmFyIHJlcGxhY2VTdHJpbmdUcmFuc2Zvcm1lciA9IGZ1bmN0aW9uIHJlcGxhY2VTdHJpbmdUcmFuc2Zvcm1lcihyZXBsYWNlV2hhdCwgcmVwbGFjZVdpdGgpIHtcbiAgcmV0dXJuIHtcbiAgICBvblN0cmluZzogZnVuY3Rpb24gb25TdHJpbmcoc3RyKSB7XG4gICAgICBpZiAocmVwbGFjZVdoYXQgPT0gbnVsbCB8fCByZXBsYWNlV2l0aCA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncmVwbGFjZVN0cmluZ1RyYW5zZm9ybWVyIHJlcXVpcmVzIGF0IGxlYXN0IDIgYXJndW1lbnRzLicpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UocmVwbGFjZVdoYXQsIHJlcGxhY2VXaXRoKTtcbiAgICB9XG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCByZXBsYWNlU3RyaW5nVHJhbnNmb3JtZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl5WlhCc1lXTmxVM1J5YVc1blZISmhibk5tYjNKdFpYSXZjbVZ3YkdGalpWTjBjbWx1WjFSeVlXNXpabTl5YldWeUxtcHpJbDBzSW01aGJXVnpJanBiSW5KbGNHeGhZMlZUZEhKcGJtZFVjbUZ1YzJadmNtMWxjaUlzSW5KbGNHeGhZMlZYYUdGMElpd2ljbVZ3YkdGalpWZHBkR2dpTENKdmJsTjBjbWx1WnlJc0luTjBjaUlzSWtWeWNtOXlJaXdpY21Wd2JHRmpaU0pkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzU1VGQlRVRXNNa0pCUVRKQ0xGTkJRVE5DUVN4M1FrRkJNa0lzUTBGQlEwTXNWMEZCUkN4RlFVRmpReXhYUVVGa08wRkJRVUVzVTBGQkswSTdRVUZET1VSRExGbEJSRGhFTEc5Q1FVTnlSRU1zUjBGRWNVUXNSVUZEYUVRN1FVRkRXaXhWUVVGSlNDeGxRVUZsTEVsQlFXWXNTVUZCZFVKRExHVkJRV1VzU1VGQk1VTXNSVUZCWjBRN1FVRkRPVU1zWTBGQlRTeEpRVUZKUnl4TFFVRktMRU5CUTBvc2VVUkJSRWtzUTBGQlRqdEJRVWRFT3p0QlFVVkVMR0ZCUVU5RUxFbEJRVWxGTEU5QlFVb3NRMEZCV1V3c1YwRkJXaXhGUVVGNVFrTXNWMEZCZWtJc1EwRkJVRHRCUVVORU8wRkJWRFpFTEVkQlFTOUNPMEZCUVVFc1EwRkJha003TzBGQldVRXNaVUZCWlVZc2QwSkJRV1lpTENKbWFXeGxJam9pY21Wd2JHRmpaVk4wY21sdVoxUnlZVzV6Wm05eWJXVnlMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaVkyOXVjM1FnY21Wd2JHRmpaVk4wY21sdVoxUnlZVzV6Wm05eWJXVnlJRDBnS0hKbGNHeGhZMlZYYUdGMExDQnlaWEJzWVdObFYybDBhQ2tnUFQ0Z0tIdGNiaUFnYjI1VGRISnBibWNvYzNSeUtTQjdYRzRnSUNBZ2FXWWdLSEpsY0d4aFkyVlhhR0YwSUQwOUlHNTFiR3dnZkh3Z2NtVndiR0ZqWlZkcGRHZ2dQVDBnYm5Wc2JDa2dlMXh1SUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtGeHVJQ0FnSUNBZ0lDQW5jbVZ3YkdGalpWTjBjbWx1WjFSeVlXNXpabTl5YldWeUlISmxjWFZwY21WeklHRjBJR3hsWVhOMElESWdZWEpuZFcxbGJuUnpMaWNzWEc0Z0lDQWdJQ0FwTzF4dUlDQWdJSDFjYmx4dUlDQWdJSEpsZEhWeWJpQnpkSEl1Y21Wd2JHRmpaU2h5WlhCc1lXTmxWMmhoZEN3Z2NtVndiR0ZqWlZkcGRHZ3BPMXh1SUNCOUxGeHVmU2s3WEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUhKbGNHeGhZMlZUZEhKcGJtZFVjbUZ1YzJadmNtMWxjanRjYmlKZGZRPT0iLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi9yZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXInO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5eVpYQnNZV05sVTNWaWMzUnBkSFYwYVc5dVZISmhibk5tYjNKdFpYSXZhVzVrWlhndWFuTWlYU3dpYm1GdFpYTWlPbHNpWkdWbVlYVnNkQ0pkTENKdFlYQndhVzVuY3lJNkluRkNRVUZ2UWl4clF6dHhRa0ZCWWtFc1R5SXNJbVpwYkdVaU9pSnBibVJsZUM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbVY0Y0c5eWRDQmtaV1poZFd4MElHWnliMjBnSnk0dmNtVndiR0ZqWlZOMVluTjBhWFIxZEdsdmJsUnlZVzV6Wm05eWJXVnlKenRjYmlKZGZRPT0iLCJ2YXIgcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyID0gZnVuY3Rpb24gcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyKHJlcGxhY2VXaGF0LCByZXBsYWNlV2l0aCkge1xuICByZXR1cm4ge1xuICAgIG9uU3Vic3RpdHV0aW9uOiBmdW5jdGlvbiBvblN1YnN0aXR1dGlvbihzdWJzdGl0dXRpb24sIHJlc3VsdFNvRmFyKSB7XG4gICAgICBpZiAocmVwbGFjZVdoYXQgPT0gbnVsbCB8fCByZXBsYWNlV2l0aCA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyIHJlcXVpcmVzIGF0IGxlYXN0IDIgYXJndW1lbnRzLicpO1xuICAgICAgfVxuXG4gICAgICAvLyBEbyBub3QgdG91Y2ggaWYgbnVsbCBvciB1bmRlZmluZWRcbiAgICAgIGlmIChzdWJzdGl0dXRpb24gPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gc3Vic3RpdHV0aW9uO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN1YnN0aXR1dGlvbi50b1N0cmluZygpLnJlcGxhY2UocmVwbGFjZVdoYXQsIHJlcGxhY2VXaXRoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCByZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl5WlhCc1lXTmxVM1ZpYzNScGRIVjBhVzl1VkhKaGJuTm1iM0p0WlhJdmNtVndiR0ZqWlZOMVluTjBhWFIxZEdsdmJsUnlZVzV6Wm05eWJXVnlMbXB6SWwwc0ltNWhiV1Z6SWpwYkluSmxjR3hoWTJWVGRXSnpkR2wwZFhScGIyNVVjbUZ1YzJadmNtMWxjaUlzSW5KbGNHeGhZMlZYYUdGMElpd2ljbVZ3YkdGalpWZHBkR2dpTENKdmJsTjFZbk4wYVhSMWRHbHZiaUlzSW5OMVluTjBhWFIxZEdsdmJpSXNJbkpsYzNWc2RGTnZSbUZ5SWl3aVJYSnliM0lpTENKMGIxTjBjbWx1WnlJc0luSmxjR3hoWTJVaVhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxFbEJRVTFCTEdsRFFVRnBReXhUUVVGcVEwRXNPRUpCUVdsRExFTkJRVU5ETEZkQlFVUXNSVUZCWTBNc1YwRkJaRHRCUVVGQkxGTkJRU3RDTzBGQlEzQkZReXhyUWtGRWIwVXNNRUpCUTNKRVF5eFpRVVJ4UkN4RlFVTjJRME1zVjBGRWRVTXNSVUZETVVJN1FVRkRlRU1zVlVGQlNVb3NaVUZCWlN4SlFVRm1MRWxCUVhWQ1F5eGxRVUZsTEVsQlFURkRMRVZCUVdkRU8wRkJRemxETEdOQlFVMHNTVUZCU1Vrc1MwRkJTaXhEUVVOS0xDdEVRVVJKTEVOQlFVNDdRVUZIUkRzN1FVRkZSRHRCUVVOQkxGVkJRVWxHTEdkQ1FVRm5RaXhKUVVGd1FpeEZRVUV3UWp0QlFVTjRRaXhsUVVGUFFTeFpRVUZRTzBGQlEwUXNUMEZHUkN4TlFVVlBPMEZCUTB3c1pVRkJUMEVzWVVGQllVY3NVVUZCWWl4SFFVRjNRa01zVDBGQmVFSXNRMEZCWjBOUUxGZEJRV2hETEVWQlFUWkRReXhYUVVFM1F5eERRVUZRTzBGQlEwUTdRVUZEUmp0QlFXUnRSU3hIUVVFdlFqdEJRVUZCTEVOQlFYWkRPenRCUVdsQ1FTeGxRVUZsUml3NFFrRkJaaUlzSW1acGJHVWlPaUp5WlhCc1lXTmxVM1ZpYzNScGRIVjBhVzl1VkhKaGJuTm1iM0p0WlhJdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpqYjI1emRDQnlaWEJzWVdObFUzVmljM1JwZEhWMGFXOXVWSEpoYm5ObWIzSnRaWElnUFNBb2NtVndiR0ZqWlZkb1lYUXNJSEpsY0d4aFkyVlhhWFJvS1NBOVBpQW9lMXh1SUNCdmJsTjFZbk4wYVhSMWRHbHZiaWh6ZFdKemRHbDBkWFJwYjI0c0lISmxjM1ZzZEZOdlJtRnlLU0I3WEc0Z0lDQWdhV1lnS0hKbGNHeGhZMlZYYUdGMElEMDlJRzUxYkd3Z2ZId2djbVZ3YkdGalpWZHBkR2dnUFQwZ2JuVnNiQ2tnZTF4dUlDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLRnh1SUNBZ0lDQWdJQ0FuY21Wd2JHRmpaVk4xWW5OMGFYUjFkR2x2YmxSeVlXNXpabTl5YldWeUlISmxjWFZwY21WeklHRjBJR3hsWVhOMElESWdZWEpuZFcxbGJuUnpMaWNzWEc0Z0lDQWdJQ0FwTzF4dUlDQWdJSDFjYmx4dUlDQWdJQzh2SUVSdklHNXZkQ0IwYjNWamFDQnBaaUJ1ZFd4c0lHOXlJSFZ1WkdWbWFXNWxaRnh1SUNBZ0lHbG1JQ2h6ZFdKemRHbDBkWFJwYjI0Z1BUMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhOMVluTjBhWFIxZEdsdmJqdGNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSE4xWW5OMGFYUjFkR2x2Ymk1MGIxTjBjbWx1WnlncExuSmxjR3hoWTJVb2NtVndiR0ZqWlZkb1lYUXNJSEpsY0d4aFkyVlhhWFJvS1R0Y2JpQWdJQ0I5WEc0Z0lIMHNYRzU5S1R0Y2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ2NtVndiR0ZqWlZOMVluTjBhWFIxZEdsdmJsUnlZVzV6Wm05eWJXVnlPMXh1SWwxOSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL3NhZmVIdG1sJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXpZV1psU0hSdGJDOXBibVJsZUM1cWN5SmRMQ0p1WVcxbGN5STZXeUprWldaaGRXeDBJbDBzSW0xaGNIQnBibWR6SWpvaWNVSkJRVzlDTEZrN2NVSkJRV0pCTEU4aUxDSm1hV3hsSWpvaWFXNWtaWGd1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmxlSEJ2Y25RZ1pHVm1ZWFZzZENCbWNtOXRJQ2N1TDNOaFptVklkRzFzSnp0Y2JpSmRmUT09IiwiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBzdHJpcEluZGVudFRyYW5zZm9ybWVyIGZyb20gJy4uL3N0cmlwSW5kZW50VHJhbnNmb3JtZXInO1xuaW1wb3J0IGlubGluZUFycmF5VHJhbnNmb3JtZXIgZnJvbSAnLi4vaW5saW5lQXJyYXlUcmFuc2Zvcm1lcic7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5pbXBvcnQgc3BsaXRTdHJpbmdUcmFuc2Zvcm1lciBmcm9tICcuLi9zcGxpdFN0cmluZ1RyYW5zZm9ybWVyJztcbmltcG9ydCByZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIgZnJvbSAnLi4vcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyJztcblxudmFyIHNhZmVIdG1sID0gbmV3IFRlbXBsYXRlVGFnKHNwbGl0U3RyaW5nVHJhbnNmb3JtZXIoJ1xcbicpLCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyLCBzdHJpcEluZGVudFRyYW5zZm9ybWVyLCB0cmltUmVzdWx0VHJhbnNmb3JtZXIsIHJlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lcigvJi9nLCAnJmFtcDsnKSwgcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyKC88L2csICcmbHQ7JyksIHJlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lcigvPi9nLCAnJmd0OycpLCByZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIoL1wiL2csICcmcXVvdDsnKSwgcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyKC8nL2csICcmI3gyNzsnKSwgcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyKC9gL2csICcmI3g2MDsnKSk7XG5cbmV4cG9ydCBkZWZhdWx0IHNhZmVIdG1sO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5ellXWmxTSFJ0YkM5ellXWmxTSFJ0YkM1cWN5SmRMQ0p1WVcxbGN5STZXeUpVWlcxd2JHRjBaVlJoWnlJc0luTjBjbWx3U1c1a1pXNTBWSEpoYm5ObWIzSnRaWElpTENKcGJteHBibVZCY25KaGVWUnlZVzV6Wm05eWJXVnlJaXdpZEhKcGJWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUlpd2ljM0JzYVhSVGRISnBibWRVY21GdWMyWnZjbTFsY2lJc0luSmxjR3hoWTJWVGRXSnpkR2wwZFhScGIyNVVjbUZ1YzJadmNtMWxjaUlzSW5OaFptVklkRzFzSWwwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4UFFVRlBRU3hYUVVGUUxFMUJRWGRDTEdkQ1FVRjRRanRCUVVOQkxFOUJRVTlETEhOQ1FVRlFMRTFCUVcxRExESkNRVUZ1UXp0QlFVTkJMRTlCUVU5RExITkNRVUZRTEUxQlFXMURMREpDUVVGdVF6dEJRVU5CTEU5QlFVOURMSEZDUVVGUUxFMUJRV3RETERCQ1FVRnNRenRCUVVOQkxFOUJRVTlETEhOQ1FVRlFMRTFCUVcxRExESkNRVUZ1UXp0QlFVTkJMRTlCUVU5RExEaENRVUZRTEUxQlFUSkRMRzFEUVVFelF6czdRVUZGUVN4SlFVRk5ReXhYUVVGWExFbEJRVWxPTEZkQlFVb3NRMEZEWmtrc2RVSkJRWFZDTEVsQlFYWkNMRU5CUkdVc1JVRkZaa1lzYzBKQlJtVXNSVUZIWmtRc2MwSkJTR1VzUlVGSlprVXNjVUpCU21Vc1JVRkxaa1VzSzBKQlFTdENMRWxCUVM5Q0xFVkJRWEZETEU5QlFYSkRMRU5CVEdVc1JVRk5aa0VzSzBKQlFTdENMRWxCUVM5Q0xFVkJRWEZETEUxQlFYSkRMRU5CVG1Vc1JVRlBaa0VzSzBKQlFTdENMRWxCUVM5Q0xFVkJRWEZETEUxQlFYSkRMRU5CVUdVc1JVRlJaa0VzSzBKQlFTdENMRWxCUVM5Q0xFVkJRWEZETEZGQlFYSkRMRU5CVW1Vc1JVRlRaa0VzSzBKQlFTdENMRWxCUVM5Q0xFVkJRWEZETEZGQlFYSkRMRU5CVkdVc1JVRlZaa0VzSzBKQlFTdENMRWxCUVM5Q0xFVkJRWEZETEZGQlFYSkRMRU5CVm1Vc1EwRkJha0k3TzBGQllVRXNaVUZCWlVNc1VVRkJaaUlzSW1acGJHVWlPaUp6WVdabFNIUnRiQzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltbHRjRzl5ZENCVVpXMXdiR0YwWlZSaFp5Qm1jbTl0SUNjdUxpOVVaVzF3YkdGMFpWUmhaeWM3WEc1cGJYQnZjblFnYzNSeWFYQkpibVJsYm5SVWNtRnVjMlp2Y20xbGNpQm1jbTl0SUNjdUxpOXpkSEpwY0VsdVpHVnVkRlJ5WVc1elptOXliV1Z5Snp0Y2JtbHRjRzl5ZENCcGJteHBibVZCY25KaGVWUnlZVzV6Wm05eWJXVnlJR1p5YjIwZ0p5NHVMMmx1YkdsdVpVRnljbUY1VkhKaGJuTm1iM0p0WlhJbk8xeHVhVzF3YjNKMElIUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUJtY205dElDY3VMaTkwY21sdFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJbk8xeHVhVzF3YjNKMElITndiR2wwVTNSeWFXNW5WSEpoYm5ObWIzSnRaWElnWm5KdmJTQW5MaTR2YzNCc2FYUlRkSEpwYm1kVWNtRnVjMlp2Y20xbGNpYzdYRzVwYlhCdmNuUWdjbVZ3YkdGalpWTjFZbk4wYVhSMWRHbHZibFJ5WVc1elptOXliV1Z5SUdaeWIyMGdKeTR1TDNKbGNHeGhZMlZUZFdKemRHbDBkWFJwYjI1VWNtRnVjMlp2Y20xbGNpYzdYRzVjYm1OdmJuTjBJSE5oWm1WSWRHMXNJRDBnYm1WM0lGUmxiWEJzWVhSbFZHRm5LRnh1SUNCemNHeHBkRk4wY21sdVoxUnlZVzV6Wm05eWJXVnlLQ2RjWEc0bktTeGNiaUFnYVc1c2FXNWxRWEp5WVhsVWNtRnVjMlp2Y20xbGNpeGNiaUFnYzNSeWFYQkpibVJsYm5SVWNtRnVjMlp2Y20xbGNpeGNiaUFnZEhKcGJWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUxGeHVJQ0J5WlhCc1lXTmxVM1ZpYzNScGRIVjBhVzl1VkhKaGJuTm1iM0p0WlhJb0x5WXZaeXdnSnlaaGJYQTdKeWtzWEc0Z0lISmxjR3hoWTJWVGRXSnpkR2wwZFhScGIyNVVjbUZ1YzJadmNtMWxjaWd2UEM5bkxDQW5KbXgwT3ljcExGeHVJQ0J5WlhCc1lXTmxVM1ZpYzNScGRIVjBhVzl1VkhKaGJuTm1iM0p0WlhJb0x6NHZaeXdnSnlabmREc25LU3hjYmlBZ2NtVndiR0ZqWlZOMVluTjBhWFIxZEdsdmJsUnlZVzV6Wm05eWJXVnlLQzljSWk5bkxDQW5KbkYxYjNRN0p5a3NYRzRnSUhKbGNHeGhZMlZUZFdKemRHbDBkWFJwYjI1VWNtRnVjMlp2Y20xbGNpZ3ZKeTluTENBbkppTjRNamM3Snlrc1hHNGdJSEpsY0d4aFkyVlRkV0p6ZEdsMGRYUnBiMjVVY21GdWMyWnZjbTFsY2lndllDOW5MQ0FuSmlONE5qQTdKeWtzWEc0cE8xeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQnpZV1psU0hSdGJEdGNiaUpkZlE9PSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuLi9odG1sJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXpiM1Z5WTJVdmFXNWtaWGd1YW5NaVhTd2libUZ0WlhNaU9sc2laR1ZtWVhWc2RDSmRMQ0p0WVhCd2FXNW5jeUk2SW5GQ1FVRnZRaXhUTzNGQ1FVRmlRU3hQSWl3aVptbHNaU0k2SW1sdVpHVjRMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaVpYaHdiM0owSUdSbFptRjFiSFFnWm5KdmJTQW5MaTR2YUhSdGJDYzdYRzRpWFgwPSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL3NwbGl0U3RyaW5nVHJhbnNmb3JtZXInO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5emNHeHBkRk4wY21sdVoxUnlZVzV6Wm05eWJXVnlMMmx1WkdWNExtcHpJbDBzSW01aGJXVnpJanBiSW1SbFptRjFiSFFpWFN3aWJXRndjR2x1WjNNaU9pSnhRa0ZCYjBJc01FSTdjVUpCUVdKQkxFOGlMQ0ptYVd4bElqb2lhVzVrWlhndWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpsZUhCdmNuUWdaR1ZtWVhWc2RDQm1jbTl0SUNjdUwzTndiR2wwVTNSeWFXNW5WSEpoYm5ObWIzSnRaWEluTzF4dUlsMTkiLCJ2YXIgc3BsaXRTdHJpbmdUcmFuc2Zvcm1lciA9IGZ1bmN0aW9uIHNwbGl0U3RyaW5nVHJhbnNmb3JtZXIoc3BsaXRCeSkge1xuICByZXR1cm4ge1xuICAgIG9uU3Vic3RpdHV0aW9uOiBmdW5jdGlvbiBvblN1YnN0aXR1dGlvbihzdWJzdGl0dXRpb24sIHJlc3VsdFNvRmFyKSB7XG4gICAgICBpZiAoc3BsaXRCeSAhPSBudWxsICYmIHR5cGVvZiBzcGxpdEJ5ID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAodHlwZW9mIHN1YnN0aXR1dGlvbiA9PT0gJ3N0cmluZycgJiYgc3Vic3RpdHV0aW9uLmluY2x1ZGVzKHNwbGl0QnkpKSB7XG4gICAgICAgICAgc3Vic3RpdHV0aW9uID0gc3Vic3RpdHV0aW9uLnNwbGl0KHNwbGl0QnkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBuZWVkIHRvIHNwZWNpZnkgYSBzdHJpbmcgY2hhcmFjdGVyIHRvIHNwbGl0IGJ5LicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN1YnN0aXR1dGlvbjtcbiAgICB9XG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzcGxpdFN0cmluZ1RyYW5zZm9ybWVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5emNHeHBkRk4wY21sdVoxUnlZVzV6Wm05eWJXVnlMM053YkdsMFUzUnlhVzVuVkhKaGJuTm1iM0p0WlhJdWFuTWlYU3dpYm1GdFpYTWlPbHNpYzNCc2FYUlRkSEpwYm1kVWNtRnVjMlp2Y20xbGNpSXNJbTl1VTNWaWMzUnBkSFYwYVc5dUlpd2ljM1ZpYzNScGRIVjBhVzl1SWl3aWNtVnpkV3gwVTI5R1lYSWlMQ0p6Y0d4cGRFSjVJaXdpYVc1amJIVmtaWE1pTENKemNHeHBkQ0lzSWtWeWNtOXlJbDBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hKUVVGTlFTeDVRa0ZCZVVJc1UwRkJla0pCTEhOQ1FVRjVRanRCUVVGQkxGTkJRVms3UVVGRGVrTkRMR3RDUVVSNVF5d3dRa0ZETVVKRExGbEJSREJDTEVWQlExcERMRmRCUkZrc1JVRkRRenRCUVVONFF5eFZRVUZKUXl4WFFVRlhMRWxCUVZnc1NVRkJiVUlzVDBGQlQwRXNUMEZCVUN4TFFVRnRRaXhSUVVFeFF5eEZRVUZ2UkR0QlFVTnNSQ3haUVVGSkxFOUJRVTlHTEZsQlFWQXNTMEZCZDBJc1VVRkJlRUlzU1VGQmIwTkJMR0ZCUVdGSExGRkJRV0lzUTBGQmMwSkVMRTlCUVhSQ0xFTkJRWGhETEVWQlFYZEZPMEZCUTNSRlJpeDVRa0ZCWlVFc1lVRkJZVWtzUzBGQllpeERRVUZ0UWtZc1QwRkJia0lzUTBGQlpqdEJRVU5FTzBGQlEwWXNUMEZLUkN4TlFVbFBPMEZCUTB3c1kwRkJUU3hKUVVGSlJ5eExRVUZLTEVOQlFWVXNjVVJCUVZZc1EwRkJUanRCUVVORU8wRkJRMFFzWVVGQlQwd3NXVUZCVUR0QlFVTkVPMEZCVm5kRExFZEJRVm83UVVGQlFTeERRVUV2UWpzN1FVRmhRU3hsUVVGbFJpeHpRa0ZCWmlJc0ltWnBiR1VpT2lKemNHeHBkRk4wY21sdVoxUnlZVzV6Wm05eWJXVnlMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaVkyOXVjM1FnYzNCc2FYUlRkSEpwYm1kVWNtRnVjMlp2Y20xbGNpQTlJSE53YkdsMFFua2dQVDRnS0h0Y2JpQWdiMjVUZFdKemRHbDBkWFJwYjI0b2MzVmljM1JwZEhWMGFXOXVMQ0J5WlhOMWJIUlRiMFpoY2lrZ2UxeHVJQ0FnSUdsbUlDaHpjR3hwZEVKNUlDRTlJRzUxYkd3Z0ppWWdkSGx3Wlc5bUlITndiR2wwUW5rZ1BUMDlJQ2R6ZEhKcGJtY25LU0I3WEc0Z0lDQWdJQ0JwWmlBb2RIbHdaVzltSUhOMVluTjBhWFIxZEdsdmJpQTlQVDBnSjNOMGNtbHVaeWNnSmlZZ2MzVmljM1JwZEhWMGFXOXVMbWx1WTJ4MVpHVnpLSE53YkdsMFFua3BLU0I3WEc0Z0lDQWdJQ0FnSUhOMVluTjBhWFIxZEdsdmJpQTlJSE4xWW5OMGFYUjFkR2x2Ymk1emNHeHBkQ2h6Y0d4cGRFSjVLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0NkWmIzVWdibVZsWkNCMGJ5QnpjR1ZqYVdaNUlHRWdjM1J5YVc1bklHTm9ZWEpoWTNSbGNpQjBieUJ6Y0d4cGRDQmllUzRuS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdjbVYwZFhKdUlITjFZbk4wYVhSMWRHbHZianRjYmlBZ2ZTeGNibjBwTzF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCemNHeHBkRk4wY21sdVoxUnlZVzV6Wm05eWJXVnlPMXh1SWwxOSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL3N0cmlwSW5kZW50JztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXpkSEpwY0VsdVpHVnVkQzlwYm1SbGVDNXFjeUpkTENKdVlXMWxjeUk2V3lKa1pXWmhkV3gwSWwwc0ltMWhjSEJwYm1keklqb2ljVUpCUVc5Q0xHVTdjVUpCUVdKQkxFOGlMQ0ptYVd4bElqb2lhVzVrWlhndWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpsZUhCdmNuUWdaR1ZtWVhWc2RDQm1jbTl0SUNjdUwzTjBjbWx3U1c1a1pXNTBKenRjYmlKZGZRPT0iLCJpbXBvcnQgVGVtcGxhdGVUYWcgZnJvbSAnLi4vVGVtcGxhdGVUYWcnO1xuaW1wb3J0IHN0cmlwSW5kZW50VHJhbnNmb3JtZXIgZnJvbSAnLi4vc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcic7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5cbnZhciBzdHJpcEluZGVudCA9IG5ldyBUZW1wbGF0ZVRhZyhzdHJpcEluZGVudFRyYW5zZm9ybWVyLCB0cmltUmVzdWx0VHJhbnNmb3JtZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBzdHJpcEluZGVudDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXpkSEpwY0VsdVpHVnVkQzl6ZEhKcGNFbHVaR1Z1ZEM1cWN5SmRMQ0p1WVcxbGN5STZXeUpVWlcxd2JHRjBaVlJoWnlJc0luTjBjbWx3U1c1a1pXNTBWSEpoYm5ObWIzSnRaWElpTENKMGNtbHRVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSWlMQ0p6ZEhKcGNFbHVaR1Z1ZENKZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1QwRkJUMEVzVjBGQlVDeE5RVUYzUWl4blFrRkJlRUk3UVVGRFFTeFBRVUZQUXl4elFrRkJVQ3hOUVVGdFF5d3lRa0ZCYmtNN1FVRkRRU3hQUVVGUFF5eHhRa0ZCVUN4TlFVRnJReXd3UWtGQmJFTTdPMEZCUlVFc1NVRkJUVU1zWTBGQll5eEpRVUZKU0N4WFFVRktMRU5CUTJ4Q1F5eHpRa0ZFYTBJc1JVRkZiRUpETEhGQ1FVWnJRaXhEUVVGd1FqczdRVUZMUVN4bFFVRmxReXhYUVVGbUlpd2labWxzWlNJNkluTjBjbWx3U1c1a1pXNTBMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUZSbGJYQnNZWFJsVkdGbklHWnliMjBnSnk0dUwxUmxiWEJzWVhSbFZHRm5KenRjYm1sdGNHOXlkQ0J6ZEhKcGNFbHVaR1Z1ZEZSeVlXNXpabTl5YldWeUlHWnliMjBnSnk0dUwzTjBjbWx3U1c1a1pXNTBWSEpoYm5ObWIzSnRaWEluTzF4dWFXMXdiM0owSUhSeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpQm1jbTl0SUNjdUxpOTBjbWx0VW1WemRXeDBWSEpoYm5ObWIzSnRaWEluTzF4dVhHNWpiMjV6ZENCemRISnBjRWx1WkdWdWRDQTlJRzVsZHlCVVpXMXdiR0YwWlZSaFp5aGNiaUFnYzNSeWFYQkpibVJsYm5SVWNtRnVjMlp2Y20xbGNpeGNiaUFnZEhKcGJWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUxGeHVLVHRjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnYzNSeWFYQkpibVJsYm5RN1hHNGlYWDA9IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcic7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl6ZEhKcGNFbHVaR1Z1ZEZSeVlXNXpabTl5YldWeUwybHVaR1Y0TG1weklsMHNJbTVoYldWeklqcGJJbVJsWm1GMWJIUWlYU3dpYldGd2NHbHVaM01pT2lKeFFrRkJiMElzTUVJN2NVSkJRV0pCTEU4aUxDSm1hV3hsSWpvaWFXNWtaWGd1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmxlSEJ2Y25RZ1pHVm1ZWFZzZENCbWNtOXRJQ2N1TDNOMGNtbHdTVzVrWlc1MFZISmhibk5tYjNKdFpYSW5PMXh1SWwxOSIsImZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXG4vKipcbiAqIHN0cmlwcyBpbmRlbnRhdGlvbiBmcm9tIGEgdGVtcGxhdGUgbGl0ZXJhbFxuICogQHBhcmFtICB7U3RyaW5nfSB0eXBlID0gJ2luaXRpYWwnIC0gd2hldGhlciB0byByZW1vdmUgYWxsIGluZGVudGF0aW9uIG9yIGp1c3QgbGVhZGluZyBpbmRlbnRhdGlvbi4gY2FuIGJlICdhbGwnIG9yICdpbml0aWFsJ1xuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgICAgIC0gYSBUZW1wbGF0ZVRhZyB0cmFuc2Zvcm1lclxuICovXG52YXIgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciA9IGZ1bmN0aW9uIHN0cmlwSW5kZW50VHJhbnNmb3JtZXIoKSB7XG4gIHZhciB0eXBlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAnaW5pdGlhbCc7XG4gIHJldHVybiB7XG4gICAgb25FbmRSZXN1bHQ6IGZ1bmN0aW9uIG9uRW5kUmVzdWx0KGVuZFJlc3VsdCkge1xuICAgICAgaWYgKHR5cGUgPT09ICdpbml0aWFsJykge1xuICAgICAgICAvLyByZW1vdmUgdGhlIHNob3J0ZXN0IGxlYWRpbmcgaW5kZW50YXRpb24gZnJvbSBlYWNoIGxpbmVcbiAgICAgICAgdmFyIG1hdGNoID0gZW5kUmVzdWx0Lm1hdGNoKC9eW15cXFNcXG5dKig/PVxcUykvZ20pO1xuICAgICAgICB2YXIgaW5kZW50ID0gbWF0Y2ggJiYgTWF0aC5taW4uYXBwbHkoTWF0aCwgX3RvQ29uc3VtYWJsZUFycmF5KG1hdGNoLm1hcChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICByZXR1cm4gZWwubGVuZ3RoO1xuICAgICAgICB9KSkpO1xuICAgICAgICBpZiAoaW5kZW50KSB7XG4gICAgICAgICAgdmFyIHJlZ2V4cCA9IG5ldyBSZWdFeHAoJ14ueycgKyBpbmRlbnQgKyAnfScsICdnbScpO1xuICAgICAgICAgIHJldHVybiBlbmRSZXN1bHQucmVwbGFjZShyZWdleHAsICcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZW5kUmVzdWx0O1xuICAgICAgfVxuICAgICAgaWYgKHR5cGUgPT09ICdhbGwnKSB7XG4gICAgICAgIC8vIHJlbW92ZSBhbGwgaW5kZW50YXRpb24gZnJvbSBlYWNoIGxpbmVcbiAgICAgICAgcmV0dXJuIGVuZFJlc3VsdC5yZXBsYWNlKC9eW15cXFNcXG5dKy9nbSwgJycpO1xuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHR5cGU6ICcgKyB0eXBlKTtcbiAgICB9XG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzdHJpcEluZGVudFRyYW5zZm9ybWVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5emRISnBjRWx1WkdWdWRGUnlZVzV6Wm05eWJXVnlMM04wY21sd1NXNWtaVzUwVkhKaGJuTm1iM0p0WlhJdWFuTWlYU3dpYm1GdFpYTWlPbHNpYzNSeWFYQkpibVJsYm5SVWNtRnVjMlp2Y20xbGNpSXNJblI1Y0dVaUxDSnZia1Z1WkZKbGMzVnNkQ0lzSW1WdVpGSmxjM1ZzZENJc0ltMWhkR05vSWl3aWFXNWtaVzUwSWl3aVRXRjBhQ0lzSW0xcGJpSXNJbTFoY0NJc0ltVnNJaXdpYkdWdVozUm9JaXdpY21WblpYaHdJaXdpVW1WblJYaHdJaXdpY21Wd2JHRmpaU0lzSWtWeWNtOXlJbDBzSW0xaGNIQnBibWR6SWpvaU96dEJRVUZCT3pzN096dEJRVXRCTEVsQlFVMUJMSGxDUVVGNVFpeFRRVUY2UWtFc2MwSkJRWGxDTzBGQlFVRXNUVUZCUTBNc1NVRkJSQ3gxUlVGQlVTeFRRVUZTTzBGQlFVRXNVMEZCZFVJN1FVRkRjRVJETEdWQlJHOUVMSFZDUVVONFEwTXNVMEZFZDBNc1JVRkROMEk3UVVGRGNrSXNWVUZCU1VZc1UwRkJVeXhUUVVGaUxFVkJRWGRDTzBGQlEzUkNPMEZCUTBFc1dVRkJUVWNzVVVGQlVVUXNWVUZCVlVNc1MwRkJWaXhEUVVGblFpeHRRa0ZCYUVJc1EwRkJaRHRCUVVOQkxGbEJRVTFETEZOQlFWTkVMRk5CUVZORkxFdEJRVXRETEVkQlFVd3NaME5CUVZsSUxFMUJRVTFKTEVkQlFVNHNRMEZCVlR0QlFVRkJMR2xDUVVGTlF5eEhRVUZIUXl4TlFVRlVPMEZCUVVFc1UwRkJWaXhEUVVGYUxFVkJRWGhDTzBGQlEwRXNXVUZCU1V3c1RVRkJTaXhGUVVGWk8wRkJRMVlzWTBGQlRVMHNVMEZCVXl4SlFVRkpReXhOUVVGS0xGTkJRV2xDVUN4TlFVRnFRaXhSUVVFMFFpeEpRVUUxUWl4RFFVRm1PMEZCUTBFc2FVSkJRVTlHTEZWQlFWVlZMRTlCUVZZc1EwRkJhMEpHTEUxQlFXeENMRVZCUVRCQ0xFVkJRVEZDTEVOQlFWQTdRVUZEUkR0QlFVTkVMR1ZCUVU5U0xGTkJRVkE3UVVGRFJEdEJRVU5FTEZWQlFVbEdMRk5CUVZNc1MwRkJZaXhGUVVGdlFqdEJRVU5zUWp0QlFVTkJMR1ZCUVU5RkxGVkJRVlZWTEU5QlFWWXNRMEZCYTBJc1lVRkJiRUlzUlVGQmFVTXNSVUZCYWtNc1EwRkJVRHRCUVVORU8wRkJRMFFzV1VGQlRTeEpRVUZKUXl4TFFVRktMRzlDUVVFeVFtSXNTVUZCTTBJc1EwRkJUanRCUVVORU8wRkJha0p0UkN4SFFVRjJRanRCUVVGQkxFTkJRUzlDT3p0QlFXOUNRU3hsUVVGbFJDeHpRa0ZCWmlJc0ltWnBiR1VpT2lKemRISnBjRWx1WkdWdWRGUnlZVzV6Wm05eWJXVnlMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUx5b3FYRzRnS2lCemRISnBjSE1nYVc1a1pXNTBZWFJwYjI0Z1puSnZiU0JoSUhSbGJYQnNZWFJsSUd4cGRHVnlZV3hjYmlBcUlFQndZWEpoYlNBZ2UxTjBjbWx1WjMwZ2RIbHdaU0E5SUNkcGJtbDBhV0ZzSnlBdElIZG9aWFJvWlhJZ2RHOGdjbVZ0YjNabElHRnNiQ0JwYm1SbGJuUmhkR2x2YmlCdmNpQnFkWE4wSUd4bFlXUnBibWNnYVc1a1pXNTBZWFJwYjI0dUlHTmhiaUJpWlNBbllXeHNKeUJ2Y2lBbmFXNXBkR2xoYkNkY2JpQXFJRUJ5WlhSMWNtNGdlMDlpYW1WamRIMGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQXRJR0VnVkdWdGNHeGhkR1ZVWVdjZ2RISmhibk5tYjNKdFpYSmNiaUFxTDF4dVkyOXVjM1FnYzNSeWFYQkpibVJsYm5SVWNtRnVjMlp2Y20xbGNpQTlJQ2gwZVhCbElEMGdKMmx1YVhScFlXd25LU0E5UGlBb2UxeHVJQ0J2YmtWdVpGSmxjM1ZzZENobGJtUlNaWE4xYkhRcElIdGNiaUFnSUNCcFppQW9kSGx3WlNBOVBUMGdKMmx1YVhScFlXd25LU0I3WEc0Z0lDQWdJQ0F2THlCeVpXMXZkbVVnZEdobElITm9iM0owWlhOMElHeGxZV1JwYm1jZ2FXNWtaVzUwWVhScGIyNGdabkp2YlNCbFlXTm9JR3hwYm1WY2JpQWdJQ0FnSUdOdmJuTjBJRzFoZEdOb0lEMGdaVzVrVW1WemRXeDBMbTFoZEdOb0tDOWVXMTVjWEZOY1hHNWRLaWcvUFZ4Y1V5a3ZaMjBwTzF4dUlDQWdJQ0FnWTI5dWMzUWdhVzVrWlc1MElEMGdiV0YwWTJnZ0ppWWdUV0YwYUM1dGFXNG9MaTR1YldGMFkyZ3ViV0Z3S0dWc0lEMCtJR1ZzTG14bGJtZDBhQ2twTzF4dUlDQWdJQ0FnYVdZZ0tHbHVaR1Z1ZENrZ2UxeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCeVpXZGxlSEFnUFNCdVpYY2dVbVZuUlhod0tHQmVMbnNrZTJsdVpHVnVkSDE5WUN3Z0oyZHRKeWs3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJsYm1SU1pYTjFiSFF1Y21Wd2JHRmpaU2h5WldkbGVIQXNJQ2NuS1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUhKbGRIVnliaUJsYm1SU1pYTjFiSFE3WEc0Z0lDQWdmVnh1SUNBZ0lHbG1JQ2gwZVhCbElEMDlQU0FuWVd4c0p5a2dlMXh1SUNBZ0lDQWdMeThnY21WdGIzWmxJR0ZzYkNCcGJtUmxiblJoZEdsdmJpQm1jbTl0SUdWaFkyZ2diR2x1WlZ4dUlDQWdJQ0FnY21WMGRYSnVJR1Z1WkZKbGMzVnNkQzV5WlhCc1lXTmxLQzllVzE1Y1hGTmNYRzVkS3k5bmJTd2dKeWNwTzF4dUlDQWdJSDFjYmlBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb1lGVnVhMjV2ZDI0Z2RIbHdaVG9nSkh0MGVYQmxmV0FwTzF4dUlDQjlMRnh1ZlNrN1hHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElITjBjbWx3U1c1a1pXNTBWSEpoYm5ObWIzSnRaWEk3WEc0aVhYMD0iLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi9zdHJpcEluZGVudHMnO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5emRISnBjRWx1WkdWdWRITXZhVzVrWlhndWFuTWlYU3dpYm1GdFpYTWlPbHNpWkdWbVlYVnNkQ0pkTENKdFlYQndhVzVuY3lJNkluRkNRVUZ2UWl4blFqdHhRa0ZCWWtFc1R5SXNJbVpwYkdVaU9pSnBibVJsZUM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbVY0Y0c5eWRDQmtaV1poZFd4MElHWnliMjBnSnk0dmMzUnlhWEJKYm1SbGJuUnpKenRjYmlKZGZRPT0iLCJpbXBvcnQgVGVtcGxhdGVUYWcgZnJvbSAnLi4vVGVtcGxhdGVUYWcnO1xuaW1wb3J0IHN0cmlwSW5kZW50VHJhbnNmb3JtZXIgZnJvbSAnLi4vc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcic7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5cbnZhciBzdHJpcEluZGVudHMgPSBuZXcgVGVtcGxhdGVUYWcoc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcignYWxsJyksIHRyaW1SZXN1bHRUcmFuc2Zvcm1lcik7XG5cbmV4cG9ydCBkZWZhdWx0IHN0cmlwSW5kZW50cztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXpkSEpwY0VsdVpHVnVkSE12YzNSeWFYQkpibVJsYm5SekxtcHpJbDBzSW01aGJXVnpJanBiSWxSbGJYQnNZWFJsVkdGbklpd2ljM1J5YVhCSmJtUmxiblJVY21GdWMyWnZjbTFsY2lJc0luUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUlzSW5OMGNtbHdTVzVrWlc1MGN5SmRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNUMEZCVDBFc1YwRkJVQ3hOUVVGM1FpeG5Ra0ZCZUVJN1FVRkRRU3hQUVVGUFF5eHpRa0ZCVUN4TlFVRnRReXd5UWtGQmJrTTdRVUZEUVN4UFFVRlBReXh4UWtGQlVDeE5RVUZyUXl3d1FrRkJiRU03TzBGQlJVRXNTVUZCVFVNc1pVRkJaU3hKUVVGSlNDeFhRVUZLTEVOQlEyNUNReXgxUWtGQmRVSXNTMEZCZGtJc1EwRkViVUlzUlVGRmJrSkRMSEZDUVVadFFpeERRVUZ5UWpzN1FVRkxRU3hsUVVGbFF5eFpRVUZtSWl3aVptbHNaU0k2SW5OMGNtbHdTVzVrWlc1MGN5NXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0JVWlcxd2JHRjBaVlJoWnlCbWNtOXRJQ2N1TGk5VVpXMXdiR0YwWlZSaFp5YzdYRzVwYlhCdmNuUWdjM1J5YVhCSmJtUmxiblJVY21GdWMyWnZjbTFsY2lCbWNtOXRJQ2N1TGk5emRISnBjRWx1WkdWdWRGUnlZVzV6Wm05eWJXVnlKenRjYm1sdGNHOXlkQ0IwY21sdFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJZ1puSnZiU0FuTGk0dmRISnBiVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlKenRjYmx4dVkyOXVjM1FnYzNSeWFYQkpibVJsYm5SeklEMGdibVYzSUZSbGJYQnNZWFJsVkdGbktGeHVJQ0J6ZEhKcGNFbHVaR1Z1ZEZSeVlXNXpabTl5YldWeUtDZGhiR3duS1N4Y2JpQWdkSEpwYlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5TEZ4dUtUdGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdjM1J5YVhCSmJtUmxiblJ6TzF4dUlsMTkiLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5MGNtbHRVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSXZhVzVrWlhndWFuTWlYU3dpYm1GdFpYTWlPbHNpWkdWbVlYVnNkQ0pkTENKdFlYQndhVzVuY3lJNkluRkNRVUZ2UWl4NVFqdHhRa0ZCWWtFc1R5SXNJbVpwYkdVaU9pSnBibVJsZUM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbVY0Y0c5eWRDQmtaV1poZFd4MElHWnliMjBnSnk0dmRISnBiVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlKenRjYmlKZGZRPT0iLCIvKipcbiAqIFRlbXBsYXRlVGFnIHRyYW5zZm9ybWVyIHRoYXQgdHJpbXMgd2hpdGVzcGFjZSBvbiB0aGUgZW5kIHJlc3VsdCBvZiBhIHRhZ2dlZCB0ZW1wbGF0ZVxuICogQHBhcmFtICB7U3RyaW5nfSBzaWRlID0gJycgLSBUaGUgc2lkZSBvZiB0aGUgc3RyaW5nIHRvIHRyaW0uIENhbiBiZSAnc3RhcnQnIG9yICdlbmQnIChhbHRlcm5hdGl2ZWx5ICdsZWZ0JyBvciAncmlnaHQnKVxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgLSBhIFRlbXBsYXRlVGFnIHRyYW5zZm9ybWVyXG4gKi9cbnZhciB0cmltUmVzdWx0VHJhbnNmb3JtZXIgPSBmdW5jdGlvbiB0cmltUmVzdWx0VHJhbnNmb3JtZXIoKSB7XG4gIHZhciBzaWRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAnJztcbiAgcmV0dXJuIHtcbiAgICBvbkVuZFJlc3VsdDogZnVuY3Rpb24gb25FbmRSZXN1bHQoZW5kUmVzdWx0KSB7XG4gICAgICBpZiAoc2lkZSA9PT0gJycpIHtcbiAgICAgICAgcmV0dXJuIGVuZFJlc3VsdC50cmltKCk7XG4gICAgICB9XG5cbiAgICAgIHNpZGUgPSBzaWRlLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgIGlmIChzaWRlID09PSAnc3RhcnQnIHx8IHNpZGUgPT09ICdsZWZ0Jykge1xuICAgICAgICByZXR1cm4gZW5kUmVzdWx0LnJlcGxhY2UoL15cXHMqLywgJycpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2lkZSA9PT0gJ2VuZCcgfHwgc2lkZSA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICByZXR1cm4gZW5kUmVzdWx0LnJlcGxhY2UoL1xccyokLywgJycpO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NpZGUgbm90IHN1cHBvcnRlZDogJyArIHNpZGUpO1xuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OTBjbWx0VW1WemRXeDBWSEpoYm5ObWIzSnRaWEl2ZEhKcGJWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUxtcHpJbDBzSW01aGJXVnpJanBiSW5SeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpSXNJbk5wWkdVaUxDSnZia1Z1WkZKbGMzVnNkQ0lzSW1WdVpGSmxjM1ZzZENJc0luUnlhVzBpTENKMGIweHZkMlZ5UTJGelpTSXNJbkpsY0d4aFkyVWlMQ0pGY25KdmNpSmRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRTdPenM3TzBGQlMwRXNTVUZCVFVFc2QwSkJRWGRDTEZOQlFYaENRU3h4UWtGQmQwSTdRVUZCUVN4TlFVRkRReXhKUVVGRUxIVkZRVUZSTEVWQlFWSTdRVUZCUVN4VFFVRm5RanRCUVVNMVEwTXNaVUZFTkVNc2RVSkJRMmhEUXl4VFFVUm5ReXhGUVVOeVFqdEJRVU55UWl4VlFVRkpSaXhUUVVGVExFVkJRV0lzUlVGQmFVSTdRVUZEWml4bFFVRlBSU3hWUVVGVlF5eEpRVUZXTEVWQlFWQTdRVUZEUkRzN1FVRkZSRWdzWVVGQlQwRXNTMEZCUzBrc1YwRkJUQ3hGUVVGUU96dEJRVVZCTEZWQlFVbEtMRk5CUVZNc1QwRkJWQ3hKUVVGdlFrRXNVMEZCVXl4TlFVRnFReXhGUVVGNVF6dEJRVU4yUXl4bFFVRlBSU3hWUVVGVlJ5eFBRVUZXTEVOQlFXdENMRTFCUVd4Q0xFVkJRVEJDTEVWQlFURkNMRU5CUVZBN1FVRkRSRHM3UVVGRlJDeFZRVUZKVEN4VFFVRlRMRXRCUVZRc1NVRkJhMEpCTEZOQlFWTXNUMEZCTDBJc1JVRkJkME03UVVGRGRFTXNaVUZCVDBVc1ZVRkJWVWNzVDBGQlZpeERRVUZyUWl4TlFVRnNRaXhGUVVFd1FpeEZRVUV4UWl4RFFVRlFPMEZCUTBRN08wRkJSVVFzV1VGQlRTeEpRVUZKUXl4TFFVRktMREJDUVVGcFEwNHNTVUZCYWtNc1EwRkJUanRCUVVORU8wRkJha0l5UXl4SFFVRm9RanRCUVVGQkxFTkJRVGxDT3p0QlFXOUNRU3hsUVVGbFJDeHhRa0ZCWmlJc0ltWnBiR1VpT2lKMGNtbHRVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUZSbGJYQnNZWFJsVkdGbklIUnlZVzV6Wm05eWJXVnlJSFJvWVhRZ2RISnBiWE1nZDJocGRHVnpjR0ZqWlNCdmJpQjBhR1VnWlc1a0lISmxjM1ZzZENCdlppQmhJSFJoWjJkbFpDQjBaVzF3YkdGMFpWeHVJQ29nUUhCaGNtRnRJQ0I3VTNSeWFXNW5mU0J6YVdSbElEMGdKeWNnTFNCVWFHVWdjMmxrWlNCdlppQjBhR1VnYzNSeWFXNW5JSFJ2SUhSeWFXMHVJRU5oYmlCaVpTQW5jM1JoY25RbklHOXlJQ2RsYm1RbklDaGhiSFJsY201aGRHbDJaV3g1SUNkc1pXWjBKeUJ2Y2lBbmNtbG5hSFFuS1Z4dUlDb2dRSEpsZEhWeWJpQjdUMkpxWldOMGZTQWdJQ0FnSUNBZ0lDQWdMU0JoSUZSbGJYQnNZWFJsVkdGbklIUnlZVzV6Wm05eWJXVnlYRzRnS2k5Y2JtTnZibk4wSUhSeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpQTlJQ2h6YVdSbElEMGdKeWNwSUQwK0lDaDdYRzRnSUc5dVJXNWtVbVZ6ZFd4MEtHVnVaRkpsYzNWc2RDa2dlMXh1SUNBZ0lHbG1JQ2h6YVdSbElEMDlQU0FuSnlrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUdWdVpGSmxjM1ZzZEM1MGNtbHRLQ2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdjMmxrWlNBOUlITnBaR1V1ZEc5TWIzZGxja05oYzJVb0tUdGNibHh1SUNBZ0lHbG1JQ2h6YVdSbElEMDlQU0FuYzNSaGNuUW5JSHg4SUhOcFpHVWdQVDA5SUNkc1pXWjBKeWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR1Z1WkZKbGMzVnNkQzV5WlhCc1lXTmxLQzllWEZ4ektpOHNJQ2NuS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb2MybGtaU0E5UFQwZ0oyVnVaQ2NnZkh3Z2MybGtaU0E5UFQwZ0ozSnBaMmgwSnlrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUdWdVpGSmxjM1ZzZEM1eVpYQnNZV05sS0M5Y1hITXFKQzhzSUNjbktUdGNiaUFnSUNCOVhHNWNiaUFnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvWUZOcFpHVWdibTkwSUhOMWNIQnZjblJsWkRvZ0pIdHphV1JsZldBcE8xeHVJQ0I5TEZ4dWZTazdYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJSFJ5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2p0Y2JpSmRmUT09IiwiY29uc3QgVGFibGUgPSAodGFibGVTaXplLCBwYXJlbnRRdWVyeSkgPT4ge1xuICBjb25zdCBhcmdzID0geyB0YWJsZVNpemUsIHBhcmVudFF1ZXJ5IH07XG4gIGNvbnN0IHNlbGYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke3BhcmVudFF1ZXJ5fSAuYmF0dGxlZmllbGQtdGFibGVgKTtcbiAgbGV0IHhyYXkgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnZXROZXdUYWJsZUVsZW1lbnQoKSB7XG4gICAgZnVuY3Rpb24gZ2V0Q29sTWFya2VyKGRhdGFzZXRZUG9zKSB7XG4gICAgICBjb25zdCBhbHBoYWJldCA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpcIjtcbiAgICAgIGNvbnN0IGFyciA9IGFscGhhYmV0LnNwbGl0KFwiXCIpO1xuICAgICAgcmV0dXJuIGFycltkYXRhc2V0WVBvc107XG4gICAgfVxuXG4gICAgY29uc3QgdGFibGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0YWJsZVwiKTtcbiAgICB0YWJsZUVsLmNsYXNzTGlzdCA9IFwiYmF0dGxlZmllbGQtdGFibGVcIjtcbiAgICBjb25zdCB0YWJsZUJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGJvZHlcIik7XG4gICAgdGFibGVFbC5hcHBlbmRDaGlsZCh0YWJsZUJvZHkpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWJsZVNpemU7IGkgKz0gMSkge1xuICAgICAgY29uc3QgdGFibGVSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidHJcIik7XG4gICAgICB0YWJsZVJvdy5jbGFzc0xpc3QgPSBcImJhdHRsZWZpZWxkLXJvd1wiO1xuICAgICAgdGFibGVCb2R5LmFwcGVuZENoaWxkKHRhYmxlUm93KTtcblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0YWJsZVNpemU7IGogKz0gMSkge1xuICAgICAgICBjb25zdCB0YWJsZURhdGFDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpO1xuICAgICAgICB0YWJsZURhdGFDZWxsLmNsYXNzTGlzdCA9IFwiYmF0dGxlZmllbGQtY2VsbFwiO1xuICAgICAgICB0YWJsZVJvdy5hcHBlbmRDaGlsZCh0YWJsZURhdGFDZWxsKTtcblxuICAgICAgICBjb25zdCBiYXR0bGVmaWVsZENlbGxDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgYmF0dGxlZmllbGRDZWxsQ29udGVudC5jbGFzc0xpc3QgPSBcImJhdHRsZWZpZWxkLWNlbGwtY29udGVudFwiO1xuICAgICAgICBiYXR0bGVmaWVsZENlbGxDb250ZW50LmRhdGFzZXQueCA9IGo7XG4gICAgICAgIGJhdHRsZWZpZWxkQ2VsbENvbnRlbnQuZGF0YXNldC55ID0gaTtcbiAgICAgICAgdGFibGVEYXRhQ2VsbC5hcHBlbmRDaGlsZChiYXR0bGVmaWVsZENlbGxDb250ZW50KTtcblxuICAgICAgICBpZiAoYmF0dGxlZmllbGRDZWxsQ29udGVudC5kYXRhc2V0LnggPT09IDApIHtcbiAgICAgICAgICBjb25zdCBtYXJrZXJSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgIG1hcmtlclJvdy5jbGFzc0xpc3QgPSBcIm1hcmtlciBtYXJrZXItcm93XCI7XG4gICAgICAgICAgbWFya2VyUm93LnRleHRDb250ZW50ID0gYmF0dGxlZmllbGRDZWxsQ29udGVudC5kYXRhc2V0LnggKyAxO1xuICAgICAgICAgIGJhdHRsZWZpZWxkQ2VsbENvbnRlbnQuYXBwZW5kQ2hpbGQobWFya2VyUm93KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChiYXR0bGVmaWVsZENlbGxDb250ZW50LmRhdGFzZXQueSA9PT0gMCkge1xuICAgICAgICAgIGNvbnN0IG1hcmtlckNvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgbWFya2VyQ29sLmNsYXNzTGlzdCA9IFwibWFya2VyIG1hcmtlci1jb2xcIjtcbiAgICAgICAgICBtYXJrZXJDb2wudGV4dENvbnRlbnQgPSBnZXRDb2xNYXJrZXIoXG4gICAgICAgICAgICBiYXR0bGVmaWVsZENlbGxDb250ZW50LmRhdGFzZXQueVxuICAgICAgICAgICk7XG4gICAgICAgICAgYmF0dGxlZmllbGRDZWxsQ29udGVudC5hcHBlbmRDaGlsZChtYXJrZXJDb2wpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhYmxlRWw7XG4gIH1cblxuICBjb25zdCB0YWJsZUVsID0gZ2V0TmV3VGFibGVFbGVtZW50KCk7XG5cbiAgZnVuY3Rpb24gdG9nZ2xlRGlzYWJsZWQoKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihwYXJlbnRRdWVyeSkuY2xhc3NMaXN0LnRvZ2dsZShcImRpc2FibGVkXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9nZ2xlQXR0YWNrQ3Vyc29yKCkge1xuICAgIGRvY3VtZW50XG4gICAgICAucXVlcnlTZWxlY3RvckFsbChgJHtwYXJlbnRRdWVyeX0gLmJhdHRsZWZpZWxkLWNlbGwtY29udGVudGApXG4gICAgICAuZm9yRWFjaCgodmFsdWUpID0+XG4gICAgICAgIHZhbHVlLmNsYXNzTGlzdC5jb250YWlucyhcIm1pc3NcIikgfHwgdmFsdWUuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpXG4gICAgICAgICAgPyBudWxsXG4gICAgICAgICAgOiB2YWx1ZS5jbGFzc0xpc3QudG9nZ2xlKFwiYXR0YWNrLWN1cnNvclwiKVxuICAgICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlclN1bmsoY2VsbCkge1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcInN1bmtcIik7XG4gIH1cblxuICBmdW5jdGlvbiB4cmF5RW5hYmxlZCgpIHtcbiAgICByZXR1cm4geHJheTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvZ2dsZVhyYXkoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xuICAgIHhyYXkgPyAoeHJheSA9IGZhbHNlKSA6ICh4cmF5ID0gdHJ1ZSk7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJNaXNzKGNlbGwpIHtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xuICAgIGNvbnN0IG1pc3NJY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgbWlzc0ljb24uY2xhc3NMaXN0ID0gXCJtaXNzLWljb25cIjtcbiAgICBjZWxsLmFwcGVuZENoaWxkKG1pc3NJY29uKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlckhpdChjZWxsKSB7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xuICAgIGNvbnN0IGhpdEljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICBoaXRJY29uLmNsYXNzTGlzdCA9IFwiaGl0LWljb25cIjtcbiAgICBjZWxsLmFwcGVuZENoaWxkKGhpdEljb24pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyU2hpcChjZWxsKSB7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZShwbGF5ZXIpIHtcbiAgICBjb25zdCB7IGdhbWVCcmQgfSA9IHBsYXllcjtcbiAgICBjb25zdCBtYXAgPSBnYW1lQnJkLmdldE1hcERhdGEoKS5nZXRNYXAoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hcC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3Qgc2hpcENlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgJHtwYXJlbnRRdWVyeX0gLmJhdHRsZWZpZWxkLWNlbGwtY29udGVudFtkYXRhLXg9XCIke21hcFtpXS54fVwiXVtkYXRhLXk9XCIke21hcFtpXS55fVwiXWBcbiAgICAgICk7XG4gICAgICBjb25zdCBtYXBTcGFjZSA9IGdhbWVCcmQuZ2V0TWFwRGF0YSgpLnNwYWNlKFttYXBbaV0ueCwgbWFwW2ldLnldKTtcbiAgICAgIGlmIChtYXBTcGFjZS5oYXNTaGlwKCkpIHtcbiAgICAgICAgaWYgKHhyYXlFbmFibGVkKCkgfHwgcGxheWVyLmdldFR1cm4oKSkge1xuICAgICAgICAgIHJlbmRlclNoaXAoc2hpcENlbGwpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXBTcGFjZS5zaGlwKCkuZ2V0U2hpcCgpLmlzU3VuaygpKSByZW5kZXJTdW5rKHNoaXBDZWxsKTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXBTcGFjZS5oYXNNaXNzZWQoKSkgcmVuZGVyTWlzcyhzaGlwQ2VsbCk7XG4gICAgICBpZiAobWFwU3BhY2UuaXNIaXQoKSkgcmVuZGVySGl0KHNoaXBDZWxsKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJJbnZhbGlkU3BhY2UoaW52YWxpZFNwYWNlQXJyKSB7XG4gICAgY29uc3QgYXJyID0gaW52YWxpZFNwYWNlQXJyO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYCR7cGFyZW50UXVlcnl9IC5iYXR0bGVmaWVsZC1jZWxsLWNvbnRlbnRbZGF0YS14PVwiJHthcnJbaV1bMF19XCJdW2RhdGEteT1cIiR7YXJyW2ldWzFdfVwiXWBcbiAgICAgICk7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJpbnZhbGlkXCIpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlckNsYXNzbmFtZShjbGFzc05hbWUsIGFycmF5KSB7XG4gICAgY29uc3QgYXJyID0gYXJyYXk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgJHtwYXJlbnRRdWVyeX0gLmJhdHRsZWZpZWxkLWNlbGwtY29udGVudFtkYXRhLXg9XCIke2FycltpXS54fVwiXVtkYXRhLXk9XCIke2FycltpXS55fVwiXWBcbiAgICAgICk7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgc2VsZi5pbm5lckhUTUwgPSB0YWJsZUVsLmlubmVySFRNTDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZEF0dGFja0V2ZW50TGlzdGVuZXIoYXR0YWNrRXZlbnQpIHtcbiAgICBkb2N1bWVudFxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgIGAke3BhcmVudFF1ZXJ5fSAuYmF0dGxlZmllbGQtY2VsbC1jb250ZW50LmF0dGFjay1jdXJzb3JgXG4gICAgICApXG4gICAgICAuZm9yRWFjaCgodmFsdWUpID0+IHZhbHVlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhdHRhY2tFdmVudCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyQXR0YWNrUmVzdWx0KGF0dGFjaywgY29vcmRzKSB7XG4gICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBgJHtwYXJlbnRRdWVyeX0gLmJhdHRsZWZpZWxkLWNlbGwtY29udGVudFtkYXRhLXg9XCIke2Nvb3Jkc1swXX1cIl1bZGF0YS15PVwiJHtjb29yZHNbMV19XCJdYFxuICAgICk7XG4gICAgaWYgKGF0dGFjay5taXNzKSB7XG4gICAgICByZW5kZXJNaXNzKGNlbGwpO1xuICAgIH1cbiAgICBpZiAoYXR0YWNrLmhpdCB8fCBhdHRhY2suc3Vuaykge1xuICAgICAgcmVuZGVySGl0KGNlbGwpO1xuICAgIH1cbiAgICBpZiAoYXR0YWNrLnN1bmspIHtcbiAgICAgIGF0dGFjay5zaGlwQ29yZHMuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgICAgZG9jdW1lbnRcbiAgICAgICAgICAucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgIGAke3BhcmVudFF1ZXJ5fSAuYmF0dGxlZmllbGQtY2VsbC1jb250ZW50W2RhdGEteD1cIiR7dmFsdWUueH1cIl1bZGF0YS15PVwiJHt2YWx1ZS55fVwiXWBcbiAgICAgICAgICApXG4gICAgICAgICAgLmNsYXNzTGlzdC5hZGQoXCJzdW5rXCIpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICByZW5kZXIsXG4gICAgdXBkYXRlLFxuICAgIHJlbmRlckludmFsaWRTcGFjZSxcbiAgICByZW5kZXJDbGFzc25hbWUsXG4gICAgdG9nZ2xlRGlzYWJsZWQsXG4gICAgdG9nZ2xlQXR0YWNrQ3Vyc29yLFxuICAgIGFkZEF0dGFja0V2ZW50TGlzdGVuZXIsXG4gICAgcmVuZGVyQXR0YWNrUmVzdWx0LFxuICAgIGFyZ3MsXG4gICAgcmVuZGVyUGxheWVyTGFiZWxzLFxuICB9O1xufTtcblxuZnVuY3Rpb24gcmVuZGVyTm90aWZpY2F0aW9uKG1zZykge1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm5vdGlmaWNhdGlvbi1tZXNzYWdlXCIpLmlubmVySFRNTCA9IG1zZztcbn1cblxuZnVuY3Rpb24gcmVuZGVyVmljdG9yeVNjcmVlbihjaGFtcGlvbk5hbWUsIGNoYW1waW9uSWQsIGxvc2VySWQpIHtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5iYXR0bGVmaWVsZHNcIikucmVtb3ZlKCk7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubm90aWZpY2F0aW9uLXdyYXBcIikucmVtb3ZlKCk7XG5cbiAgY29uc3QgdmljdG9yeVNjcmVlbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIHZpY3RvcnlTY3JlZW4uY2xhc3NMaXN0LmFkZChcImdhbWUtb3ZlclwiKTtcblxuICB2aWN0b3J5U2NyZWVuLmlubmVySFRNTCA9IGBcbiAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1vdmVyLW1lc3NhZ2UtY29udGFpbmVyXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1vdmVyLW1lc3NhZ2VcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImdhbWUtb3Zlci10ZXh0XCI+R2FtZSBPdmVyPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb25ncmF0c1wiPjxzcGFuIGNsYXNzPVwiJHtjaGFtcGlvbklkfS12aWN0b3J5XCI+JHtjaGFtcGlvbk5hbWV9PC9zcGFuPiA8c3BhbiBjbGFzcz1cIiR7bG9zZXJJZH0tdmljdG9yeVwiPldpbnMhPC9kaXY+XG4gICAgPC9kaXY+XG4gIGA7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtYWluXCIpLmFwcGVuZENoaWxkKHZpY3RvcnlTY3JlZW4pO1xufVxuXG5mdW5jdGlvbiBnZXRQbGF5ZXJDb2xvclNwYW4oaWQsIGluc2VydGVkVGV4dCkge1xuICByZXR1cm4gYDxzcGFuIGNsYXNzPVwiJHtpZH0tdmljdG9yeVwiPiR7aW5zZXJ0ZWRUZXh0fTwvc3Bhbj5gO1xufVxuXG5mdW5jdGlvbiByZW5kZXJQYXNzU2NyZWVuKGN1ck5hbWUsIGN1cklkLCBuZXh0TmFtZSwgbmV4dElkKSB7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmF0dGxlZmllbGRzXCIpLnJlbW92ZSgpO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm5vdGlmaWNhdGlvbi13cmFwXCIpLnJlbW92ZSgpO1xuXG4gIGNvbnN0IHBhc3NTY3JlZW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBwYXNzU2NyZWVuLmNsYXNzTGlzdC5hZGQoXCJwYXNzLXNjcmVlblwiKTtcblxuICBwYXNzU2NyZWVuLmlubmVySFRNTCA9IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJwYXNzLXNjcmVlbi1tZXNzYWdlXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJwYXNzLXNjcmVlbi1tZXNzYWdlLXRleHQgaGVhZFwiPiR7Z2V0UGxheWVyQ29sb3JTcGFuKFxuICAgICAgICAgIGN1cklkLFxuICAgICAgICAgIGN1ck5hbWVcbiAgICAgICAgKX0sIFBhc3MgeW91ciBzY3JlZW4gdG8geW91ciBvcHBvbmVudCAke2dldFBsYXllckNvbG9yU3BhbihcbiAgICBuZXh0SWQsXG4gICAgbmV4dE5hbWVcbiAgKX08L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInBhc3Mtc2NyZWVuLW1lc3NhZ2UtdGV4dCBib2R5XCI+SXQgaXMgeW91ciB0dXJuLCAke2dldFBsYXllckNvbG9yU3BhbihcbiAgICAgICAgICBuZXh0SWQsXG4gICAgICAgICAgbmV4dE5hbWVcbiAgICAgICAgKX0uIEFyZSB5b3UgcmVhZHk/PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJwYXNzLWJ0bi1jb250YWluZXJcIj5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInBhc3MtYnRuICR7bmV4dElkfS12aWN0b3J5LWJnXCI+UmVhZHk8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gIGA7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtYWluXCIpLmFwcGVuZENoaWxkKHBhc3NTY3JlZW4pO1xufVxuXG5mdW5jdGlvbiBnZXRCb2R5SW5uZXJIVE1MKCkge1xuICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuaW5uZXJIVE1MO1xufVxuXG5mdW5jdGlvbiBzZXRCb2R5SW5uZXJIVE1MKGlubmVySFRNTCkge1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5pbm5lckhUTUwgPSBpbm5lckhUTUw7XG59XG5cbmZ1bmN0aW9uIHJlbmRlckdhbWVTdGFydCgpIHtcbiAgY29uc3Qgc3RhcnRpbmdIVE1MID0gYFxuICAgIDxkaXYgY2xhc3M9XCJib2R5LXdyYXBcIj5cbiAgICAgIDxoZWFkZXIgY2xhc3M9XCJmbGV4LWNvbFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwidGl0bGUtd3JhcFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aXRsZVwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzZWxmLXZpY3RvcnlcIj5KZWxseXNoaXA8L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInJpdmFsLXZpY3RvcnlcIj5CYXR0bGU8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWZpY2F0aW9uLXdyYXBcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWZpY2F0aW9uXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWZpY2F0aW9uLW1lc3NhZ2VcIj5QbGFjZSB5b3VyL3lhbGxzIHNoaXBzPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9oZWFkZXI+XG4gICAgICA8bWFpbj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImJhdHRsZWZpZWxkc1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJiYXR0bGVmaWVsZC1zZWxmLWxhYmVsIHNlbGYtdmljdG9yeVwiPjwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJiYXR0bGVmaWVsZCBiYXR0bGVmaWVsZC1zZWxmXCI+XG4gICAgICAgICAgICA8ZGl2IGlkPVwiYmF0dGxlZmllbGQtdGFibGUtc2VsZlwiIGNsYXNzPVwiYmF0dGxlZmllbGQtdGFibGVcIj48L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmF0dGxlZmllbGQgYmF0dGxlZmllbGQtcml2YWxcIj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJiYXR0bGVmaWVsZC10YWJsZS1yaXZhbFwiIGNsYXNzPVwiYmF0dGxlZmllbGQtdGFibGVcIj48L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmF0dGxlZmllbGQtcml2YWwtbGFiZWwgcml2YWwtdmljdG9yeVwiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvbWFpbj5cbiAgICAgIDxmb290ZXI+XG4gICAgICAgIMKpIG5vdy1mb3JldmVyIHNub3dqZWxseUluZHVzdHJpZXMgPHNwYW4gY2xhc3M9XCJoZWFydFwiPjwzPC9zcGFuPlxuICAgICAgPC9mb290ZXI+XG4gICAgPC9kaXY+XG4gIGA7XG4gIHJldHVybiBzdGFydGluZ0hUTUw7XG59XG5cbmZ1bmN0aW9uIGFkZEdhbWVJbml0QnRuRXZlbnRMaXN0ZW5lcihnYW1lSW5pdEV2ZW50KSB7XG4gIGRvY3VtZW50XG4gICAgLnF1ZXJ5U2VsZWN0b3IoXCIjaW5pdC1mb3JtLWJ0blwiKVxuICAgIC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZ2FtZUluaXRFdmVudCk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlclBsYXllckxhYmVscyhzZWxmTmFtZSwgcml2YWxOYW1lKSB7XG4gIGNvbnN0IHNlbGZMYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5iYXR0bGVmaWVsZC1zZWxmLWxhYmVsYCk7XG4gIGNvbnN0IHJpdmFsTGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuYmF0dGxlZmllbGQtcml2YWwtbGFiZWxgKTtcbiAgc2VsZkxhYmVsLnRleHRDb250ZW50ID0gc2VsZk5hbWU7XG4gIHJpdmFsTGFiZWwudGV4dENvbnRlbnQgPSByaXZhbE5hbWU7XG59XG5cbmV4cG9ydCB7XG4gIFRhYmxlLFxuICByZW5kZXJOb3RpZmljYXRpb24sXG4gIHJlbmRlclZpY3RvcnlTY3JlZW4sXG4gIHJlbmRlclBhc3NTY3JlZW4sXG4gIGdldEJvZHlJbm5lckhUTUwsXG4gIHNldEJvZHlJbm5lckhUTUwsXG4gIHJlbmRlckdhbWVTdGFydCxcbiAgYWRkR2FtZUluaXRCdG5FdmVudExpc3RlbmVyLFxuICByZW5kZXJQbGF5ZXJMYWJlbHMsXG59O1xuIiwiaW1wb3J0IHsgVGFibGUsIHJlbmRlck5vdGlmaWNhdGlvbiB9IGZyb20gXCIuL0RPTVwiO1xuaW1wb3J0IHsgbG9nQXJyYXlzLCBkaWZmZXJlbmNlIH0gZnJvbSBcIi4vdXRpbGl0eVwiO1xuY29uc3QgeyBzdHJpcEluZGVudHMgfSA9IHJlcXVpcmUoXCJjb21tb24tdGFnc1wiKTtcblxuY29uc3QgU2hpcCA9IChzaXplLCBheGlzKSA9PiB7XG4gIGNvbnN0IHNoaXBTaXplID0gc2l6ZTtcbiAgbGV0IHRpbWVzSGl0ID0gMDtcbiAgbGV0IHN1bmsgPSBmYWxzZTtcbiAgbGV0IGNvb3JkaW5hdGVzID0gW107XG5cbiAgZnVuY3Rpb24gZ2V0U2l6ZSgpIHtcbiAgICByZXR1cm4gc2hpcFNpemU7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRBeGlzKCkge1xuICAgIHJldHVybiBheGlzO1xuICB9XG5cbiAgZnVuY3Rpb24gaGl0KCkge1xuICAgIHRpbWVzSGl0ICs9IDE7XG4gIH1cblxuICBmdW5jdGlvbiBpc1N1bmsoKSB7XG4gICAgaWYgKHRpbWVzSGl0ID09PSBzaGlwU2l6ZSkge1xuICAgICAgc3VuayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBzdW5rO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q29vcmRpbmF0ZXMoKSB7XG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0Q29vcmRpbmF0ZXMoY29yZHMpIHtcbiAgICBjb29yZGluYXRlcyA9IGNvcmRzO1xuICB9XG5cbiAgcmV0dXJuIHsgZ2V0U2l6ZSwgaXNTdW5rLCBoaXQsIGdldENvb3JkaW5hdGVzLCBzZXRDb29yZGluYXRlcywgZ2V0QXhpcyB9O1xufTtcblxuY29uc3QgR2FtZWJvYXJkID0gKCkgPT4ge1xuICBjb25zdCBzaXplID0gMTA7XG5cbiAgZnVuY3Rpb24gZ2V0Q29sTWFya2VyKHlQb3MpIHtcbiAgICBjb25zdCBhbHBoYWJldCA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpcIjtcbiAgICBjb25zdCBhcnIgPSBhbHBoYWJldC5zcGxpdChcIlwiKTtcbiAgICByZXR1cm4gYXJyW3lQb3NdO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBjb25zdCBhcnIgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkgKz0gMSkge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaXplOyBqICs9IDEpIHtcbiAgICAgICAgYXJyLnB1c2goeyB4OiBqLCB5OiBpLCByb3c6IGkgKyAxLCBjb2w6IGdldENvbE1hcmtlcihqKSB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuXG4gIGNvbnN0IG1hcCA9IGluaXQoKTtcblxuICBmdW5jdGlvbiBnZXRNYXBEYXRhKCkge1xuICAgIGZ1bmN0aW9uIGdldERpY3Rpb25hcnkobWFwQXJyID0gbWFwLnNsaWNlKCkpIHtcbiAgICAgIGNvbnN0IGRpY3Rpb25hcnkgPSB7XG4gICAgICAgIGNvbHVtbnM6IFtdLFxuICAgICAgICByb3dzOiBbXSxcbiAgICAgIH07XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBhcnJDb2x1bW5zID0gbWFwQXJyLmZpbHRlcihcbiAgICAgICAgICAodmFsdWUpID0+IHZhbHVlLmNvbCA9PT0gZ2V0Q29sTWFya2VyKGkpXG4gICAgICAgICk7XG4gICAgICAgIGRpY3Rpb25hcnkuY29sdW1ucy5wdXNoKGFyckNvbHVtbnMpO1xuXG4gICAgICAgIGNvbnN0IGFyclJvd3MgPSBtYXBBcnIuZmlsdGVyKCh2YWx1ZSkgPT4gdmFsdWUucm93ID09PSBpICsgMSk7XG4gICAgICAgIGRpY3Rpb25hcnkucm93cy5wdXNoKGFyclJvd3MpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZGljdGlvbmFyeTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRJbmRleEJ5Q29vcmRpbmF0ZShjb29yZHMpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IG1hcC5maW5kSW5kZXgoXG4gICAgICAgICh2YWx1ZSkgPT4gdmFsdWUueCA9PT0gY29vcmRzWzBdICYmIHZhbHVlLnkgPT09IGNvb3Jkc1sxXVxuICAgICAgKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Q29vcmRpbmF0ZUJ5SW5kZXgoaW5kZXgpIHtcbiAgICAgIHJldHVybiBtYXAuc2xpY2UoKVtpbmRleF07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UmFuZG9tQXR0YWNrYWJsZUNvb3JkaW5hdGUoKSB7XG4gICAgICBjb25zdCBmaWx0ZXJlZE1hcCA9IG1hcC5maWx0ZXIoKHZhbHVlKSA9PiAhdmFsdWUuaGl0ICYmICF2YWx1ZS5taXNzKTtcbiAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZmlsdGVyZWRNYXAubGVuZ3RoKTtcbiAgICAgIHJldHVybiBmaWx0ZXJlZE1hcFtpbmRleF07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3BhY2UoY29vcmQpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gZ2V0SW5kZXhCeUNvb3JkaW5hdGUoY29vcmQpO1xuICAgICAgZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICByZXR1cm4gZ2V0Q29vcmRpbmF0ZUJ5SW5kZXgoaW5kZXgpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBoYXNTaGlwKCkge1xuICAgICAgICBpZiAobWFwLnNsaWNlKClbaW5kZXhdLnNoaXApIHJldHVybiB0cnVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGlzSGl0KCkge1xuICAgICAgICBpZiAobWFwLnNsaWNlKClbaW5kZXhdLmhpdCkgcmV0dXJuIHRydWU7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2V0SGl0KCkge1xuICAgICAgICBtYXBbaW5kZXhdLmhpdCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGhhc01pc3NlZCgpIHtcbiAgICAgICAgaWYgKG1hcC5zbGljZSgpW2luZGV4XS5taXNzKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzZXRNaXNzZWQoKSB7XG4gICAgICAgIG1hcFtpbmRleF0ubWlzcyA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNldE9jY3VwaWVkKGJvb2wpIHtcbiAgICAgICAgbWFwW2luZGV4XS5vY2N1cGllZCA9IGJvb2w7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGlzT2NjdXBpZWQoKSB7XG4gICAgICAgIGlmIChtYXAuc2xpY2UoKVtpbmRleF0ub2NjdXBpZWQpIHJldHVybiB0cnVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNldFNoaXAoc2hwKSB7XG4gICAgICAgIGlmIChoYXNTaGlwKCkgfHwgaXNPY2N1cGllZCgpKSByZXR1cm47XG4gICAgICAgIG1hcFtpbmRleF0uc2hpcCA9IHNocDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hpcCgpIHtcbiAgICAgICAgaWYgKCFoYXNTaGlwKCkpIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGlzIG5vdCBhIHNoaXAgb24gdGhpcyB0aWxlXCIpO1xuICAgICAgICBjb25zdCBzaHAgPSBtYXAuc2xpY2UoKVtpbmRleF0uc2hpcDtcbiAgICAgICAgZnVuY3Rpb24gZ2V0U2hpcCgpIHtcbiAgICAgICAgICByZXR1cm4gc2hwO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldExvZygpIHtcbiAgICAgICAgICByZXR1cm4gc3RyaXBJbmRlbnRzYFxuICAgICAgICAgIFRoZXJlIGlzIGEgc2hpcCBhdCAke3NocC5nZXRDb29yZGluYXRlcygpfVxuICAgICAgICAgIFJvdzogJHtzaHAucm93fVxuICAgICAgICAgIENvbHVtbjogJHtzaHAuY29sfVxuICAgICAgICAgIFNpemU6ICR7c2hwLmdldFNpemUoKX1cbiAgICAgICAgICBBeGlzOiAke3NocC5nZXRBeGlzKCl9XG4gICAgICAgICAgQWxpdmU6ICR7IXNocC5pc1N1bmsoKX1cbiAgICAgICAgICBgO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGdldFNoaXAsIGdldExvZyB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQsXG4gICAgICAgIHNldE9jY3VwaWVkLFxuICAgICAgICBzZXRTaGlwLFxuICAgICAgICBoYXNTaGlwLFxuICAgICAgICBzaGlwLFxuICAgICAgICBpc0hpdCxcbiAgICAgICAgc2V0SGl0LFxuICAgICAgICBoYXNNaXNzZWQsXG4gICAgICAgIHNldE1pc3NlZCxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TWFwKCkge1xuICAgICAgcmV0dXJuIG1hcC5zbGljZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEZyZWVTcGFjZXMoKSB7XG4gICAgICByZXR1cm4gbWFwLnNsaWNlKCkuZmlsdGVyKCh2YWx1ZSkgPT4gIXZhbHVlLnNoaXAgJiYgIXZhbHVlLm9jY3VwaWVkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhbGxTaGlwcygpIHtcbiAgICAgIGNvbnN0IGFyciA9IG1hcC5zbGljZSgpLmZpbHRlcigodmFsdWUpID0+IHZhbHVlLnNoaXApO1xuXG4gICAgICBjb25zdCBnZXRBbGwgPSAoKSA9PiBhcnI7XG4gICAgICBjb25zdCBsb2cgPSAoKSA9PiBsb2dBcnJheXMoYXJyKTtcbiAgICAgIGNvbnN0IHN1bmsgPSAoKSA9PlxuICAgICAgICBhcnIuZmlsdGVyKCh2YWx1ZSkgPT4gIXZhbHVlLnNoaXAuaXNTdW5rKCkpLmxlbmd0aCA9PT0gMDtcblxuICAgICAgcmV0dXJuIHsgZ2V0QWxsLCBsb2csIHN1bmsgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc3BhY2UsXG4gICAgICBnZXREaWN0aW9uYXJ5LFxuICAgICAgZ2V0RnJlZVNwYWNlcyxcbiAgICAgIGFsbFNoaXBzLFxuICAgICAgZ2V0TWFwLFxuICAgICAgZ2V0UmFuZG9tQXR0YWNrYWJsZUNvb3JkaW5hdGUsXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFNpemUoKSB7XG4gICAgcmV0dXJuIHNpemU7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRWYWxpZENvb3JkcyhzaGlwU2l6ZSkge1xuICAgIGZ1bmN0aW9uIHZlcnRpY2FsKCkge1xuICAgICAgY29uc3QgbWFwRGF0YSA9IGdldE1hcERhdGEoKTtcbiAgICAgIGNvbnN0IGZyZWVTcGFjZUFyciA9IG1hcERhdGEuZ2V0RnJlZVNwYWNlcygpO1xuICAgICAgY29uc3QgdmVydGljYWxGcmVlU3BhY2VBcnIgPSBtYXBEYXRhLmdldERpY3Rpb25hcnkoZnJlZVNwYWNlQXJyKS5jb2x1bW5zO1xuICAgICAgY29uc3Qgc3RhcnRpbmdZUG9zQXJyID0gW107XG5cbiAgICAgIGZ1bmN0aW9uIGdldFZlcnRpY2FsRGlmZihjb2x1bW4sIGosIGspIHtcbiAgICAgICAgaWYgKGogKyBrID49IGNvbHVtbi5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAgICAgY29uc3QgZGlmZiA9IGRpZmZlcmVuY2UoY29sdW1uW2pdLnksIGNvbHVtbltqICsga10ueSk7XG4gICAgICAgIGNvbnN0IGxvZyA9IHtcbiAgICAgICAgICBzaGlwU3RhcnQ6IGNvbHVtbltqXSxcbiAgICAgICAgICBzaGlwRW5kOiBjb2x1bW5baiArIGtdLFxuICAgICAgICAgIGRpZmYsXG4gICAgICAgIH07XG4gICAgICAgIGlmIChkaWZmID09PSBzaGlwU2l6ZSAtIDEpIHJldHVybiB7IHZhbGlkOiB0cnVlLCBsb2cgfTtcbiAgICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlIH07XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVydGljYWxGcmVlU3BhY2VBcnIubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3QgY29sdW1uID0gdmVydGljYWxGcmVlU3BhY2VBcnJbaV07XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sdW1uLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBzaGlwU2l6ZTsgayArPSAxKSB7XG4gICAgICAgICAgICBpZiAoZ2V0VmVydGljYWxEaWZmKGNvbHVtbiwgaiwgaykudmFsaWQpIHtcbiAgICAgICAgICAgICAgc3RhcnRpbmdZUG9zQXJyLnB1c2goY29sdW1uW2pdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBzdGFydGluZ1lQb3NBcnI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaG9yaXpvbnRhbCgpIHtcbiAgICAgIGNvbnN0IG1hcERhdGEgPSBnZXRNYXBEYXRhKCk7XG4gICAgICBjb25zdCBmcmVlU3BhY2VBcnIgPSBtYXBEYXRhLmdldEZyZWVTcGFjZXMoKTtcbiAgICAgIGNvbnN0IHN0YXJ0aW5nWFBvc0FyciA9IFtdO1xuICAgICAgZnVuY3Rpb24gZ2V0SG9yaXpvbnRhbERpZmYoaSwgaykge1xuICAgICAgICBpZiAoaSArIGsgPj0gZnJlZVNwYWNlQXJyLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBjb25zdCBkaWZmID0gZGlmZmVyZW5jZShmcmVlU3BhY2VBcnJbaV0ueCwgZnJlZVNwYWNlQXJyW2kgKyBrXS54KTtcbiAgICAgICAgY29uc3QgbG9nID0ge1xuICAgICAgICAgIHNoaXBTdGFydDogZnJlZVNwYWNlQXJyW2ldLFxuICAgICAgICAgIHNoaXBFbmQ6IGZyZWVTcGFjZUFycltpICsga10sXG4gICAgICAgICAgZGlmZixcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGRpZmYgPT09IHNoaXBTaXplIC0gMSkgcmV0dXJuIHsgdmFsaWQ6IHRydWUsIGxvZyB9O1xuICAgICAgICByZXR1cm4geyB2YWxpZDogZmFsc2UgfTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmVlU3BhY2VBcnIubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBzaGlwU2l6ZTsgayArPSAxKSB7XG4gICAgICAgICAgaWYgKGdldEhvcml6b250YWxEaWZmKGksIGspLnZhbGlkKSB7XG4gICAgICAgICAgICBzdGFydGluZ1hQb3NBcnIucHVzaChmcmVlU3BhY2VBcnJbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RhcnRpbmdYUG9zQXJyO1xuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKHsgc3RhcnRpbmdYUG9zQXJyLCBzdGFydGluZ1lQb3NBcnIgfSk7XG5cbiAgICByZXR1cm4geyB2ZXJ0aWNhbCwgaG9yaXpvbnRhbCB9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0T2NjdXBpZWRTcGFjZShzaGlwKSB7XG4gICAgY29uc3QgbWFwRGF0YSA9IGdldE1hcERhdGEoKTtcbiAgICBjb25zdCBjb29yZHMgPSBzaGlwLmdldENvb3JkaW5hdGVzKCk7XG4gICAgY29uc3Qgc3RhcnQgPSBjb29yZHNbMF07XG4gICAgY29uc3QgZW5kID0gY29vcmRzW2Nvb3Jkcy5sZW5ndGggLSAxXTtcblxuICAgIGZ1bmN0aW9uIGdldFZlcnRpY2FsKCkge1xuICAgICAgbGV0IGFkamFjZW50T2NjdXBpZWRTcGFjZVZlcnRpY2FsID0gW1xuICAgICAgICBbc3RhcnQueCwgc3RhcnQueSAtIDFdLFxuICAgICAgICBbc3RhcnQueCArIDEsIHN0YXJ0LnkgLSAxXSxcbiAgICAgICAgW3N0YXJ0LnggLSAxLCBzdGFydC55IC0gMV0sXG5cbiAgICAgICAgW2VuZC54LCBlbmQueSArIDFdLFxuICAgICAgICBbZW5kLnggLSAxLCBlbmQueSArIDFdLFxuICAgICAgICBbZW5kLnggKyAxLCBlbmQueSArIDFdLFxuICAgICAgXTtcblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb29yZHMubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgYWRqYWNlbnRPY2N1cGllZFNwYWNlVmVydGljYWwucHVzaChbY29vcmRzW2pdLnggKyAxLCBjb29yZHNbal0ueV0pO1xuICAgICAgICBhZGphY2VudE9jY3VwaWVkU3BhY2VWZXJ0aWNhbC5wdXNoKFtjb29yZHNbal0ueCAtIDEsIGNvb3Jkc1tqXS55XSk7XG4gICAgICB9XG5cbiAgICAgIGFkamFjZW50T2NjdXBpZWRTcGFjZVZlcnRpY2FsID0gYWRqYWNlbnRPY2N1cGllZFNwYWNlVmVydGljYWwuZmlsdGVyKFxuICAgICAgICAodmFsdWUpID0+XG4gICAgICAgICAgISh2YWx1ZVswXSA+IHNpemUgLSAxKSAmJlxuICAgICAgICAgICEodmFsdWVbMV0gPiBzaXplIC0gMSkgJiZcbiAgICAgICAgICAhKHZhbHVlWzBdIDwgMCkgJiZcbiAgICAgICAgICAhKHZhbHVlWzFdIDwgMClcbiAgICAgICk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWRqYWNlbnRPY2N1cGllZFNwYWNlVmVydGljYWwubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgbWFwRGF0YS5zcGFjZShhZGphY2VudE9jY3VwaWVkU3BhY2VWZXJ0aWNhbFtpXSkuc2V0T2NjdXBpZWQodHJ1ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYWRqYWNlbnRPY2N1cGllZFNwYWNlVmVydGljYWw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0SG9yaXpvbnRhbCgpIHtcbiAgICAgIGxldCBhZGphY2VudE9jY3VwaWVkU3BhY2VIb3Jpem9udGFsID0gW1xuICAgICAgICBbc3RhcnQueCAtIDEsIHN0YXJ0LnldLFxuICAgICAgICBbc3RhcnQueCAtIDEsIHN0YXJ0LnkgKyAxXSxcbiAgICAgICAgW3N0YXJ0LnggLSAxLCBzdGFydC55IC0gMV0sXG5cbiAgICAgICAgW2VuZC54ICsgMSwgZW5kLnldLFxuICAgICAgICBbZW5kLnggKyAxLCBlbmQueSArIDFdLFxuICAgICAgICBbZW5kLnggKyAxLCBlbmQueSAtIDFdLFxuICAgICAgXTtcblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb29yZHMubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgYWRqYWNlbnRPY2N1cGllZFNwYWNlSG9yaXpvbnRhbC5wdXNoKFtjb29yZHNbal0ueCwgY29vcmRzW2pdLnkgKyAxXSk7XG4gICAgICAgIGFkamFjZW50T2NjdXBpZWRTcGFjZUhvcml6b250YWwucHVzaChbY29vcmRzW2pdLngsIGNvb3Jkc1tqXS55IC0gMV0pO1xuICAgICAgfVxuXG4gICAgICBhZGphY2VudE9jY3VwaWVkU3BhY2VIb3Jpem9udGFsID0gYWRqYWNlbnRPY2N1cGllZFNwYWNlSG9yaXpvbnRhbC5maWx0ZXIoXG4gICAgICAgICh2YWx1ZSkgPT5cbiAgICAgICAgICAhKHZhbHVlWzBdID4gc2l6ZSAtIDEpICYmXG4gICAgICAgICAgISh2YWx1ZVsxXSA+IHNpemUgLSAxKSAmJlxuICAgICAgICAgICEodmFsdWVbMF0gPCAwKSAmJlxuICAgICAgICAgICEodmFsdWVbMV0gPCAwKVxuICAgICAgKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhZGphY2VudE9jY3VwaWVkU3BhY2VIb3Jpem9udGFsLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIG1hcERhdGEuc3BhY2UoYWRqYWNlbnRPY2N1cGllZFNwYWNlSG9yaXpvbnRhbFtpXSkuc2V0T2NjdXBpZWQodHJ1ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYWRqYWNlbnRPY2N1cGllZFNwYWNlSG9yaXpvbnRhbDtcbiAgICB9XG5cbiAgICBpZiAoc2hpcC5nZXRBeGlzKCkgPT09IFwieFwiKSB7XG4gICAgICByZXR1cm4gZ2V0SG9yaXpvbnRhbCgpO1xuICAgIH1cbiAgICBpZiAoc2hpcC5nZXRBeGlzKCkgPT09IFwieVwiKSB7XG4gICAgICByZXR1cm4gZ2V0VmVydGljYWwoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwbGFjZVNoaXBQYXJ0KGNvb3Jkcywgc2hpcCkge1xuICAgIGdldE1hcERhdGEoKS5zcGFjZShjb29yZHMpLnNldFNoaXAoc2hpcCk7XG4gIH1cblxuICBmdW5jdGlvbiBwbGFjZVNoaXAoY29vcmRzLCBzaGlwU2l6ZSwgYXhpcykge1xuICAgIGlmIChheGlzICE9PSBcInhcIiAmJiBheGlzICE9PSBcInlcIilcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlNoaXAgbXVzdCBoYXZlIGEgdmFsaWQgZGlyZWN0aW9uXCIpO1xuICAgIGlmIChheGlzID09PSBcInhcIikge1xuICAgICAgaWYgKHNoaXBTaXplICsgY29vcmRzWzBdID4gc2l6ZSkgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoYXhpcyA9PT0gXCJ5XCIpIHtcbiAgICAgIGlmIChzaGlwU2l6ZSArIGNvb3Jkc1sxXSA+IHNpemUpIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzaGlwID0gU2hpcChzaGlwU2l6ZSwgYXhpcyk7XG5cbiAgICBjb25zdCBhcnJheUNvcmRzID0gW107XG4gICAgY29uc3QgbWFwRGF0YSA9IGdldE1hcERhdGEoKTtcbiAgICBsZXQgY29yZERhdGE7XG5cbiAgICBmdW5jdGlvbiBwdXNoQ29vcmREYXRhSW50b1NoaXAoZGF0YSkge1xuICAgICAgY29uc3QgbWFwQ29vcmRzQ2xvbmUgPSBKU09OLnBhcnNlKFxuICAgICAgICBKU09OLnN0cmluZ2lmeShtYXBEYXRhLnNwYWNlKGRhdGEpLmdldCgpKVxuICAgICAgKTtcbiAgICAgIGRlbGV0ZSBtYXBDb29yZHNDbG9uZS5zaGlwO1xuICAgICAgYXJyYXlDb3Jkcy5wdXNoKG1hcENvb3Jkc0Nsb25lKTtcbiAgICB9XG5cbiAgICBjb25zdCBzaHBTaXplID0gc2hpcC5nZXRTaXplKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNocFNpemU7IGkgKz0gMSkge1xuICAgICAgaWYgKHNoaXAuZ2V0QXhpcygpID09PSBcInhcIikge1xuICAgICAgICBpZiAoY29vcmRzWzBdICsgc2hwU2l6ZSA8PSBzaXplKSB7XG4gICAgICAgICAgY29yZERhdGEgPSBbY29vcmRzWzBdICsgaSwgY29vcmRzWzFdXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzaGlwLmdldEF4aXMoKSA9PT0gXCJ5XCIpIHtcbiAgICAgICAgaWYgKGNvb3Jkc1sxXSArIHNocFNpemUgPD0gc2l6ZSkge1xuICAgICAgICAgIGNvcmREYXRhID0gW2Nvb3Jkc1swXSwgY29vcmRzWzFdICsgaV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBjb3JkRGF0YSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBjb3JkRGF0YSA9PT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmxvZyh7IGNvb3JkcywgYXhpcywgc2hpcFNpemUgfSk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvb3JkaW5hdGVzIG11c3Qgbm90IGJlIG51bGwgb3IgdW5kZWZpbmVkXCIpO1xuICAgICAgfVxuXG4gICAgICBwbGFjZVNoaXBQYXJ0KGNvcmREYXRhLCBzaGlwKTtcbiAgICAgIHB1c2hDb29yZERhdGFJbnRvU2hpcChjb3JkRGF0YSk7XG4gICAgfVxuXG4gICAgc2hpcC5zZXRDb29yZGluYXRlcyhhcnJheUNvcmRzKTtcbiAgICBzZXRPY2N1cGllZFNwYWNlKHNoaXApO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVjZWl2ZUF0dGFjayhjb29yZHMpIHtcbiAgICBjb25zdCBtYXBEYXRhID0gZ2V0TWFwRGF0YSgpO1xuICAgIGlmIChtYXBEYXRhLnNwYWNlKGNvb3JkcykuaGFzTWlzc2VkKCkgfHwgbWFwRGF0YS5zcGFjZShjb29yZHMpLmlzSGl0KCkpXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICBpZiAobWFwRGF0YS5zcGFjZShjb29yZHMpLmhhc1NoaXAoKSkge1xuICAgICAgY29uc3Qgc2hwID0gbWFwRGF0YS5zcGFjZShjb29yZHMpLnNoaXAoKS5nZXRTaGlwKCk7XG4gICAgICBzaHAuaGl0KCk7XG4gICAgICBtYXBEYXRhLnNwYWNlKGNvb3Jkcykuc2V0SGl0KCk7XG4gICAgICBpZiAoc2hwLmlzU3VuaygpICYmICFtYXBEYXRhLmFsbFNoaXBzKCkuc3VuaygpKSB7XG4gICAgICAgIHJldHVybiB7IHN1bms6IHNocC5pc1N1bmsoKSwgc2hpcENvcmRzOiBzaHAuZ2V0Q29vcmRpbmF0ZXMoKSB9O1xuICAgICAgfVxuICAgICAgaWYgKG1hcERhdGEuYWxsU2hpcHMoKS5zdW5rKCkpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3Vuazogc2hwLmlzU3VuaygpLFxuICAgICAgICAgIGdhbWVvdmVyOiB0cnVlLFxuICAgICAgICAgIHNoaXBDb3Jkczogc2hwLmdldENvb3JkaW5hdGVzKCksXG4gICAgICAgIH07XG4gICAgICByZXR1cm4geyBoaXQ6IG1hcERhdGEuc3BhY2UoY29vcmRzKS5pc0hpdCgpIH07XG4gICAgfVxuICAgIG1hcERhdGEuc3BhY2UoY29vcmRzKS5zZXRNaXNzZWQoKTtcbiAgICByZXR1cm4geyBtaXNzOiBtYXBEYXRhLnNwYWNlKGNvb3JkcykuaGFzTWlzc2VkKCkgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0U2l6ZSxcbiAgICBwbGFjZVNoaXAsXG4gICAgcGxhY2VTaGlwUGFydCxcbiAgICByZWNlaXZlQXR0YWNrLFxuICAgIGdldE1hcERhdGEsXG4gICAgZ2V0VmFsaWRDb29yZHMsXG4gIH07XG59O1xuXG5jb25zdCBQbGF5ZXIgPSAobmFtZSwgdGFibGVRdWVyeVNlbGVjdG9yKSA9PiB7XG4gIGNvbnN0IGdhbWVCcmQgPSBHYW1lYm9hcmQoKTtcbiAgY29uc3QgcGxheWFibGVTaGlwcyA9IFtcbiAgICB7IHNpemU6IDEsIGhvd01hbnk6IDQgfSxcbiAgICB7IHNpemU6IDIsIGhvd01hbnk6IDMgfSxcbiAgICB7IHNpemU6IDMsIGhvd01hbnk6IDIgfSxcbiAgICB7IHNpemU6IDQsIGhvd01hbnk6IDEgfSxcbiAgXTtcbiAgY29uc3QgdGFibGUgPSBUYWJsZSgxMCwgdGFibGVRdWVyeVNlbGVjdG9yKTtcbiAgbGV0IHR1cm4gPSBmYWxzZTtcbiAgbGV0IGlkO1xuICBsZXQgcE5hbWUgPSBuYW1lO1xuXG4gIGZ1bmN0aW9uIHNldFR1cm4oYm9vbCkge1xuICAgIHR1cm4gPSBib29sO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VHVybigpIHtcbiAgICByZXR1cm4gdHVybjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE5hbWUoKSB7XG4gICAgcmV0dXJuIHBOYW1lO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0TmFtZShzdHIpIHtcbiAgICBwTmFtZSA9IHN0cjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldElkKHN0cikge1xuICAgIGlkID0gc3RyO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SWQoKSB7XG4gICAgcmV0dXJuIGlkO1xuICB9XG5cbiAgLy8gVE9ETyB3cml0ZSB0ZXN0IHRoYXQgbXVsdGlwbGVzIHRoZSBzaXplIGJ5IGhvd01hbnkgYW5kIGV4cGVjdCB3aXRoIHRoZSBkZWZhdWx0IGJvYXJkIHNpemVcbiAgLy8gYW5kIHBsYXlhYmxlIHNoaXBzXG4gIC8vIGl0IHdpbGwgZXF1YWwgMjBcblxuICByZXR1cm4ge1xuICAgIGdhbWVCcmQsXG4gICAgcGxheWFibGVTaGlwcyxcbiAgICB0YWJsZSxcbiAgICBzZXRUdXJuLFxuICAgIGdldFR1cm4sXG4gICAgZ2V0TmFtZSxcbiAgICBzZXRJZCxcbiAgICBnZXRJZCxcbiAgICBzZXROYW1lLFxuICB9O1xufTtcblxuLy8gYnkgZGVmYXVsdCB0aGUgZ2FtZSB3aWxsIGhhdmUgMTAgc2hpcHMgb24gYSBncmlkIHdpdGggYSBzaXplIG9mIDEwXG5jb25zdCBHYW1lID0gKCkgPT4ge1xuICBjb25zdCBzZWxmID0gUGxheWVyKFwiWW91XCIsIFwiLmJhdHRsZWZpZWxkLXNlbGZcIik7XG4gIGNvbnN0IHJpdmFsID0gUGxheWVyKFwiUml2YWxcIiwgXCIuYmF0dGxlZmllbGQtcml2YWxcIik7XG4gIGNvbnN0IHBsYXllcnMgPSBbc2VsZiwgcml2YWxdO1xuXG4gIHNlbGYuc2V0SWQoXCJzZWxmXCIpO1xuICBzZWxmLnNldFR1cm4odHJ1ZSk7XG5cbiAgcml2YWwuc2V0SWQoXCJyaXZhbFwiKTtcblxuICBmdW5jdGlvbiBnZXRUdXJuKCkge1xuICAgIGxldCBjdXJyZW50VHVybjtcbiAgICBsZXQgbmV4dFR1cm47XG4gICAgcGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuZ2V0VHVybigpKSB7XG4gICAgICAgIGN1cnJlbnRUdXJuID0gcGxheWVyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dFR1cm4gPSBwbGF5ZXI7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHsgY3VycmVudFR1cm4sIG5leHRUdXJuIH07XG4gIH1cblxuICBmdW5jdGlvbiBnZXRSZW1haW5pbmdTaGlwc1RvUGxhY2UocGxheWVyKSB7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllci5wbGF5YWJsZVNoaXBzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb3VudCArPSBwbGF5ZXIucGxheWFibGVTaGlwc1tpXS5ob3dNYW55O1xuICAgIH1cbiAgICByZXR1cm4gY291bnQ7XG4gIH1cblxuICBmdW5jdGlvbiByYW5kb20ocGxheWVyKSB7XG4gICAgd2hpbGUgKGdldFJlbWFpbmluZ1NoaXBzVG9QbGFjZShwbGF5ZXIpID4gMCkge1xuICAgICAgY29uc3QgcGxheWFibGVTaGlwcyA9IHBsYXllci5wbGF5YWJsZVNoaXBzLmZpbHRlcihcbiAgICAgICAgKHZhbHVlKSA9PiB2YWx1ZS5ob3dNYW55ID4gMFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHBsYXlhYmxlU2hpcEluZGV4ID0gTWF0aC5mbG9vcihcbiAgICAgICAgTWF0aC5yYW5kb20oKSAqIHBsYXlhYmxlU2hpcHMubGVuZ3RoXG4gICAgICApO1xuICAgICAgY29uc3Qgc2hpcFNpemUgPSBwbGF5YWJsZVNoaXBzW3BsYXlhYmxlU2hpcEluZGV4XS5zaXplO1xuXG4gICAgICBjb25zdCByYW5kQXhpcyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpO1xuXG4gICAgICBsZXQgYXhpcztcbiAgICAgIGxldCB2YWxpZFN0YXJ0aW5nUG9zaXRpb25zO1xuXG4gICAgICBpZiAocmFuZEF4aXMgPT09IDApIHtcbiAgICAgICAgYXhpcyA9IFwieFwiO1xuICAgICAgICB2YWxpZFN0YXJ0aW5nUG9zaXRpb25zID0gcGxheWVyLmdhbWVCcmRcbiAgICAgICAgICAuZ2V0VmFsaWRDb29yZHMoc2hpcFNpemUpXG4gICAgICAgICAgLmhvcml6b250YWwoKTtcbiAgICAgIH1cbiAgICAgIGlmIChyYW5kQXhpcyA9PT0gMSkge1xuICAgICAgICBheGlzID0gXCJ5XCI7XG4gICAgICAgIHZhbGlkU3RhcnRpbmdQb3NpdGlvbnMgPSBwbGF5ZXIuZ2FtZUJyZFxuICAgICAgICAgIC5nZXRWYWxpZENvb3JkcyhzaGlwU2l6ZSlcbiAgICAgICAgICAudmVydGljYWwoKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29vcmRJbmRleCA9IE1hdGguZmxvb3IoXG4gICAgICAgIE1hdGgucmFuZG9tKCkgKiB2YWxpZFN0YXJ0aW5nUG9zaXRpb25zLmxlbmd0aFxuICAgICAgKTtcblxuICAgICAgY29uc3QgZ2V0VGFyZ2V0ID0gKCkgPT4gdmFsaWRTdGFydGluZ1Bvc2l0aW9uc1tjb29yZEluZGV4XTtcblxuICAgICAgbGV0IHRhcmdldCA9IGdldFRhcmdldCgpO1xuICAgICAgd2hpbGUgKHRhcmdldCA9PT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PT0gbnVsbCkge1xuICAgICAgICB0YXJnZXQgPSBnZXRUYXJnZXQoKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbG9nID0ge1xuICAgICAgICBwbGF5YWJsZVNoaXBzOiBwbGF5ZXIucGxheWFibGVTaGlwcyxcbiAgICAgICAgdGFyZ2V0LFxuICAgICAgICBheGlzLFxuICAgICAgICBzaGlwU2l6ZSxcbiAgICAgICAgcmVtYWluaW5nU2hpcHM6IGdldFJlbWFpbmluZ1NoaXBzVG9QbGFjZShwbGF5ZXIpLFxuICAgICAgICB2YWxpZFN0YXJ0aW5nUG9zaXRpb25zLFxuICAgICAgICBjb29yZEluZGV4LFxuICAgICAgfTtcblxuICAgICAgY29uc29sZS5sb2cobG9nKTtcbiAgICAgIHBsYXllci5nYW1lQnJkLnBsYWNlU2hpcChbdGFyZ2V0LngsIHRhcmdldC55XSwgc2hpcFNpemUsIGF4aXMpO1xuXG4gICAgICBwbGF5YWJsZVNoaXBzW3BsYXlhYmxlU2hpcEluZGV4XS5ob3dNYW55IC09IDE7XG4gICAgfVxuICAgIGlmIChnZXRSZW1haW5pbmdTaGlwc1RvUGxhY2UocGxheWVyKSA9PT0gMCkge1xuICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzXCIpO1xuICAgIH1cbiAgfVxuXG4gIHJhbmRvbShzZWxmKTtcbiAgcmFuZG9tKHJpdmFsKTtcblxuICByZXR1cm4geyBzZWxmLCByaXZhbCwgZ2V0VHVybiB9O1xufTtcblxuZXhwb3J0IHsgR2FtZSwgU2hpcCB9O1xuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuL2JhdHRsZXNoaXBcIjtcbmltcG9ydCB7XG4gIGdldEJvZHlJbm5lckhUTUwsXG4gIHJlbmRlck5vdGlmaWNhdGlvbixcbiAgcmVuZGVyUGFzc1NjcmVlbixcbiAgcmVuZGVyVmljdG9yeVNjcmVlbixcbiAgc2V0Qm9keUlubmVySFRNTCxcbiAgVGFibGUsXG4gIHJlbmRlckdhbWVTdGFydCxcbiAgYWRkR2FtZUluaXRCdG5FdmVudExpc3RlbmVyLFxuICByZW5kZXJQbGF5ZXJMYWJlbHMsXG59IGZyb20gXCIuL0RPTVwiO1xuXG5jb25zdCBnYW1lID0gR2FtZSgpO1xuXG5jb25zdCB7IHNlbGYgfSA9IGdhbWU7XG5jb25zdCB7IHJpdmFsIH0gPSBnYW1lO1xuXG5mdW5jdGlvbiBnYW1lTG9vcCh7IGFpRW5hYmxlZCA9IGZhbHNlIH0pIHtcbiAgY29uc3QgaW5pdEhUTUwgPSBnZXRCb2R5SW5uZXJIVE1MKCk7XG4gIGxldCB7IGN1cnJlbnRUdXJuIH0gPSBnYW1lLmdldFR1cm4oKTtcbiAgbGV0IHsgbmV4dFR1cm4gfSA9IGdhbWUuZ2V0VHVybigpO1xuICBpZiAoYWlFbmFibGVkKSB7XG4gICAgY3VycmVudFR1cm4gPSBzZWxmO1xuICAgIG5leHRUdXJuID0gcml2YWw7XG4gIH1cblxuICBjb25zdCBzZWxmQXJncyA9IHNlbGYudGFibGUuYXJncztcbiAgc2VsZi50YWJsZSA9IFRhYmxlKHNlbGZBcmdzLnRhYmxlU2l6ZSwgc2VsZkFyZ3MucGFyZW50UXVlcnkpO1xuXG4gIGNvbnN0IHJpdmFsQXJncyA9IHJpdmFsLnRhYmxlLmFyZ3M7XG4gIHJpdmFsLnRhYmxlID0gVGFibGUocml2YWxBcmdzLnRhYmxlU2l6ZSwgcml2YWxBcmdzLnBhcmVudFF1ZXJ5KTtcblxuICBzZWxmLnRhYmxlLnJlbmRlcigpO1xuICByaXZhbC50YWJsZS5yZW5kZXIoKTtcblxuICBzZWxmLnRhYmxlLnVwZGF0ZShzZWxmKTtcbiAgcml2YWwudGFibGUudXBkYXRlKHJpdmFsKTtcblxuICBuZXh0VHVybi50YWJsZS50b2dnbGVBdHRhY2tDdXJzb3IoKTtcblxuICBpZiAoIWFpRW5hYmxlZCkge1xuICAgIHJlbmRlck5vdGlmaWNhdGlvbihcbiAgICAgIGBJdCBpcyA8c3BhbiBjbGFzcz1cIiR7Y3VycmVudFR1cm4uZ2V0SWQoKX0tdmljdG9yeVwiPiR7Y3VycmVudFR1cm4uZ2V0TmFtZSgpfSdzPC9zcGFuPiB0dXJuLCBjbGljayBvbiA8c3BhbiBjbGFzcz1cIiR7bmV4dFR1cm4uZ2V0SWQoKX0tdmljdG9yeVwiPiR7bmV4dFR1cm4uZ2V0TmFtZSgpfSdzPC9zcGFuPiBib2FyZCB0byBhdHRhY2tgXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICByZW5kZXJOb3RpZmljYXRpb24oXG4gICAgICBgPHNwYW4gY2xhc3M9XCIke2N1cnJlbnRUdXJuLmdldElkKCl9LXZpY3RvcnlcIj4ke2N1cnJlbnRUdXJuLmdldE5hbWUoKX08L3NwYW4+IElzIGZhY2luZyB0aGUgQS5JIDxzcGFuIGNsYXNzPVwiJHtuZXh0VHVybi5nZXRJZCgpfS12aWN0b3J5XCI+JHtuZXh0VHVybi5nZXROYW1lKCl9PC9zcGFuPiBHb29kIGx1Y2shYFxuICAgICk7XG4gIH1cblxuICBjdXJyZW50VHVybi50YWJsZS50b2dnbGVEaXNhYmxlZCgpO1xuXG4gIG5leHRUdXJuLnRhYmxlLmFkZEF0dGFja0V2ZW50TGlzdGVuZXIoKGUpID0+IHtcbiAgICBjb25zdCB4ID0gTnVtYmVyKGUuY3VycmVudFRhcmdldC5kYXRhc2V0LngpO1xuICAgIGNvbnN0IHkgPSBOdW1iZXIoZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQueSk7XG4gICAgY29uc3QgYXR0YWNrID0gbmV4dFR1cm4uZ2FtZUJyZC5yZWNlaXZlQXR0YWNrKFt4LCB5XSk7XG4gICAgY29uc29sZS5sb2coYXR0YWNrKTtcbiAgICBpZiAoYXR0YWNrICE9PSBudWxsKSB7XG4gICAgICBuZXh0VHVybi50YWJsZS5yZW5kZXJBdHRhY2tSZXN1bHQoYXR0YWNrLCBbeCwgeV0pO1xuICAgICAgaWYgKGF0dGFjay5nYW1lb3ZlcilcbiAgICAgICAgcmV0dXJuIHJlbmRlclZpY3RvcnlTY3JlZW4oXG4gICAgICAgICAgY3VycmVudFR1cm4uZ2V0TmFtZSgpLFxuICAgICAgICAgIGN1cnJlbnRUdXJuLmdldElkKCksXG4gICAgICAgICAgbmV4dFR1cm4uZ2V0SWQoKVxuICAgICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKCFhaUVuYWJsZWQpIHtcbiAgICAgIHJlbmRlclBhc3NTY3JlZW4oXG4gICAgICAgIGN1cnJlbnRUdXJuLmdldE5hbWUoKSxcbiAgICAgICAgY3VycmVudFR1cm4uZ2V0SWQoKSxcbiAgICAgICAgbmV4dFR1cm4uZ2V0TmFtZSgpLFxuICAgICAgICBuZXh0VHVybi5nZXRJZCgpXG4gICAgICApO1xuXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhc3MtYnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICBuZXh0VHVybi5zZXRUdXJuKHRydWUpO1xuICAgICAgICBjdXJyZW50VHVybi5zZXRUdXJuKGZhbHNlKTtcbiAgICAgICAgc2V0Qm9keUlubmVySFRNTChpbml0SFRNTCk7XG4gICAgICAgIGdhbWVMb29wKGFpRW5hYmxlZCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYXR0YWNrYWJsZUNvb3JkaW5hdGUgPSBzZWxmLmdhbWVCcmRcbiAgICAgICAgLmdldE1hcERhdGEoKVxuICAgICAgICAuZ2V0UmFuZG9tQXR0YWNrYWJsZUNvb3JkaW5hdGUoKTtcbiAgICAgIGNvbnN0IGFpQXR0YWNrID0gc2VsZi5nYW1lQnJkLnJlY2VpdmVBdHRhY2soW1xuICAgICAgICBhdHRhY2thYmxlQ29vcmRpbmF0ZS54LFxuICAgICAgICBhdHRhY2thYmxlQ29vcmRpbmF0ZS55LFxuICAgICAgXSk7XG4gICAgICBjb25zb2xlLmxvZyh7IGFpQXR0YWNrIH0pO1xuICAgICAgaWYgKGFpQXR0YWNrICE9PSBudWxsKSB7XG4gICAgICAgIHNlbGYudGFibGUucmVuZGVyQXR0YWNrUmVzdWx0KGFpQXR0YWNrLCBbXG4gICAgICAgICAgYXR0YWNrYWJsZUNvb3JkaW5hdGUueCxcbiAgICAgICAgICBhdHRhY2thYmxlQ29vcmRpbmF0ZS55LFxuICAgICAgICBdKTtcbiAgICAgICAgaWYgKGFpQXR0YWNrLmdhbWVvdmVyKVxuICAgICAgICAgIHJldHVybiByZW5kZXJWaWN0b3J5U2NyZWVuKFxuICAgICAgICAgICAgcml2YWwuZ2V0TmFtZSgpLFxuICAgICAgICAgICAgcml2YWwuZ2V0SWQoKSxcbiAgICAgICAgICAgIHNlbGYuZ2V0SWQoKVxuICAgICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5hZGRHYW1lSW5pdEJ0bkV2ZW50TGlzdGVuZXIoKGUpID0+IHtcbiAgbGV0IGFpID0geyBhaUVuYWJsZWQ6IGZhbHNlIH07XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZS5jdXJyZW50VGFyZ2V0LmZvcm0uY2hpbGRyZW4ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBjb25zdCBmb3JtSXRlbSA9IGUuY3VycmVudFRhcmdldC5mb3JtW2ldO1xuICAgIGlmIChmb3JtSXRlbS5pZCA9PT0gXCJzZWxmXCIpIHtcbiAgICAgIGlmIChmb3JtSXRlbS52YWx1ZSAhPT0gXCJcIiAmJiAhKGZvcm1JdGVtLnZhbHVlLmxlbmd0aCA+PSAyMCkpIHtcbiAgICAgICAgc2VsZi5zZXROYW1lKGZvcm1JdGVtLnZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuc2V0TmFtZShcIkpvaG4gQmF0dGxlZmllbGRcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmb3JtSXRlbS5pZCA9PT0gXCJyaXZhbFwiKSB7XG4gICAgICBpZiAoZm9ybUl0ZW0udmFsdWUgIT09IFwiXCIgJiYgIShmb3JtSXRlbS52YWx1ZS5sZW5ndGggPj0gMjApKSB7XG4gICAgICAgIHJpdmFsLnNldE5hbWUoZm9ybUl0ZW0udmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcml2YWwuc2V0TmFtZShcIlJpdmFsXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZm9ybUl0ZW0uaWQgPT09IFwiYWktY2hlY2tib3hcIikge1xuICAgICAgaWYgKGZvcm1JdGVtLnZhbGlkaXR5LnZhbGlkKSB7XG4gICAgICAgIGFpID0geyBhaUVuYWJsZWQ6IHRydWUgfTtcbiAgICAgICAgcml2YWwuc2V0TmFtZShgJHtyaXZhbC5nZXROYW1lKCl9LkFJYCk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKGUuY3VycmVudFRhcmdldC5mb3JtW2ldKTtcblxuICAgIHNldEJvZHlJbm5lckhUTUwocmVuZGVyR2FtZVN0YXJ0KCkpO1xuICAgIHJlbmRlclBsYXllckxhYmVscyhzZWxmLmdldE5hbWUoKSwgcml2YWwuZ2V0TmFtZSgpKTtcbiAgICBnYW1lTG9vcChhaSk7XG4gIH1cbn0pO1xuIiwiZnVuY3Rpb24gbG9nQXJyYXlzKC4uLmFycikge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgYXJyW2ldLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICBjb25zb2xlLmxvZyhhcnJbaV1bal0pO1xuICAgIH1cbiAgfVxufVxuXG4vLyB1c2UgbXkgdXRpbGl0eSBmdW5jdGlvbiEgOkRcblxuZnVuY3Rpb24gZGlmZmVyZW5jZShudW0xLCBudW0yKSB7XG4gIHJldHVybiBNYXRoLmFicyhudW0xIC0gbnVtMik7XG59XG5cbmV4cG9ydCB7IGxvZ0FycmF5cywgZGlmZmVyZW5jZSB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvbW9kdWxlcy9ET00uanNcIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvbW9kdWxlcy9iYXR0bGVzaGlwLmpzXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL21vZHVsZXMvdXRpbGl0eS5qc1wiKTtcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL21vZHVsZXMvbWFpbi5qc1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==