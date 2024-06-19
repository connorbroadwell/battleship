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
/* harmony export */   renderNotification: () => (/* binding */ renderNotification)
/* harmony export */ });
const Table = (tableSize, parentQuery) => {
  const self = document.querySelector(`${parentQuery} .battlefield-table`);

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
      .forEach((value) => value.classList.toggle("attack-cursor"));
  }

  function update(ships) {
    const arr = ships;
    for (let i = 0; i < arr.length; i += 1) {
      const shipCell = document.querySelector(
        `${parentQuery} .battlefield-cell-content[data-x="${arr[i].x}"][data-y="${arr[i].y}"]`
      );
      shipCell.classList.add("ship");
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
      `${parentQuery} .battlefield-cell-content.attack-cursor[data-x="${coords[0]}"][data-y="${coords[1]}"]`
    );
    if (attack.miss) {
      cell.classList.replace("attack-cursor", "miss");
      const missIcon = document.createElement("span");
      missIcon.classList = "miss-icon";
      cell.appendChild(missIcon);
    }
    if (attack.hit || attack.sunk) {
      cell.classList.replace("attack-cursor", "hit");
      const hitIcon = document.createElement("span");
      hitIcon.classList = "hit-icon";
      cell.appendChild(hitIcon);
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
  };
};

function renderNotification(msg) {
  document.querySelector(".notification-message").textContent = msg;
}

const tableSelf = Table(10, ".battlefield-self");
const tableRival = Table(10, ".battlefield-rival");

tableSelf.render();
tableRival.render();




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

const Player = (tableQuerySelector) => {
  const gameBrd = Gameboard();
  const playableShips = [
    { size: 1, howMany: 4 },
    { size: 2, howMany: 3 },
    { size: 3, howMany: 2 },
    { size: 4, howMany: 1 },
  ];
  const table = (0,_DOM__WEBPACK_IMPORTED_MODULE_0__.Table)(10, tableQuerySelector);
  let turn = false;

  function setTurn(bool) {
    turn = bool;
  }

  function getTurn() {
    return turn;
  }

  // TODO write test that multiples the size by howMany and expect with the default board size
  // and playable ships
  // it will equal 20

  return { gameBrd, playableShips, table, setTurn, getTurn };
};

// by default the game will have 10 ships on a grid with a size of 10
const Game = () => {
  const self = Player(".battlefield-self");
  const rival = Player(".battlefield-rival");
  const players = [self, rival];

  self.setTurn(true);

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
game.self.table.render();
game.rival.table.render();
game.self.table.update(game.self.gameBrd.getMapData().allShips().getAll());
game.rival.table.update(game.rival.gameBrd.getMapData().allShips().getAll());

game.getTurn().nextTurn.table.toggleAttackCursor();
(0,_DOM__WEBPACK_IMPORTED_MODULE_1__.renderNotification)("It is your turn, click on your Rivals board to attack");
game.getTurn().currentTurn.table.toggleDisabled();
game.getTurn().nextTurn.table.addAttackEventListener((e) => {
  const x = Number(e.currentTarget.dataset.x);
  const y = Number(e.currentTarget.dataset.y);
  const attack = game.getTurn().nextTurn.gameBrd.receiveAttack([x, y]);
  console.log(attack);
  if (attack !== null)
    game.getTurn().nextTurn.table.renderAttackResult(attack, [x, y]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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aXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvVGVtcGxhdGVUYWcvVGVtcGxhdGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9UZW1wbGF0ZVRhZy9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL2NvZGVCbG9jay9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL2NvbW1hTGlzdHMvY29tbWFMaXN0cy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL2NvbW1hTGlzdHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9jb21tYUxpc3RzQW5kL2NvbW1hTGlzdHNBbmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9jb21tYUxpc3RzQW5kL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvY29tbWFMaXN0c09yL2NvbW1hTGlzdHNPci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL2NvbW1hTGlzdHNPci9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL2h0bWwvaHRtbC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL2h0bWwvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL2lubGluZUFycmF5VHJhbnNmb3JtZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9pbmxpbmVBcnJheVRyYW5zZm9ybWVyL2lubGluZUFycmF5VHJhbnNmb3JtZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9pbmxpbmVMaXN0cy9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL2lubGluZUxpc3RzL2lubGluZUxpc3RzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvb25lTGluZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL29uZUxpbmUvb25lTGluZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL29uZUxpbmVDb21tYUxpc3RzL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvb25lTGluZUNvbW1hTGlzdHMvb25lTGluZUNvbW1hTGlzdHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9vbmVMaW5lQ29tbWFMaXN0c0FuZC9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL29uZUxpbmVDb21tYUxpc3RzQW5kL29uZUxpbmVDb21tYUxpc3RzQW5kLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvb25lTGluZUNvbW1hTGlzdHNPci9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL29uZUxpbmVDb21tYUxpc3RzT3Ivb25lTGluZUNvbW1hTGlzdHNPci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL29uZUxpbmVJbmxpbmVMaXN0cy9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL29uZUxpbmVJbmxpbmVMaXN0cy9vbmVMaW5lSW5saW5lTGlzdHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9vbmVMaW5lVHJpbS9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL29uZUxpbmVUcmltL29uZUxpbmVUcmltLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvcmVtb3ZlTm9uUHJpbnRpbmdWYWx1ZXNUcmFuc2Zvcm1lci9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL3JlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXIvcmVtb3ZlTm9uUHJpbnRpbmdWYWx1ZXNUcmFuc2Zvcm1lci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL3JlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lci9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL3JlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lci9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9yZXBsYWNlU3RyaW5nVHJhbnNmb3JtZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9yZXBsYWNlU3RyaW5nVHJhbnNmb3JtZXIvcmVwbGFjZVN0cmluZ1RyYW5zZm9ybWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyL3JlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL3NhZmVIdG1sL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvc2FmZUh0bWwvc2FmZUh0bWwuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9zb3VyY2UvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9zcGxpdFN0cmluZ1RyYW5zZm9ybWVyL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvc3BsaXRTdHJpbmdUcmFuc2Zvcm1lci9zcGxpdFN0cmluZ1RyYW5zZm9ybWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvc3RyaXBJbmRlbnQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9zdHJpcEluZGVudC9zdHJpcEluZGVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2NvbW1vbi10YWdzL2VzL3N0cmlwSW5kZW50VHJhbnNmb3JtZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9zdHJpcEluZGVudFRyYW5zZm9ybWVyL3N0cmlwSW5kZW50VHJhbnNmb3JtZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9zdHJpcEluZGVudHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jb21tb24tdGFncy9lcy9zdHJpcEluZGVudHMvc3RyaXBJbmRlbnRzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvdHJpbVJlc3VsdFRyYW5zZm9ybWVyL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY29tbW9uLXRhZ3MvZXMvdHJpbVJlc3VsdFRyYW5zZm9ybWVyL3RyaW1SZXN1bHRUcmFuc2Zvcm1lci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvRE9NLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9iYXR0bGVzaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9tYWluLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy91dGlsaXR5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxudmFyIF90ZW1wbGF0ZU9iamVjdCA9IF90YWdnZWRUZW1wbGF0ZUxpdGVyYWwoWycnLCAnJ10sIFsnJywgJyddKTtcblxuZnVuY3Rpb24gX3RhZ2dlZFRlbXBsYXRlTGl0ZXJhbChzdHJpbmdzLCByYXcpIHsgcmV0dXJuIE9iamVjdC5mcmVlemUoT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoc3RyaW5ncywgeyByYXc6IHsgdmFsdWU6IE9iamVjdC5mcmVlemUocmF3KSB9IH0pKTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG4vKipcbiAqIEBjbGFzcyBUZW1wbGF0ZVRhZ1xuICogQGNsYXNzZGVzYyBDb25zdW1lcyBhIHBpcGVsaW5lIG9mIGNvbXBvc2FibGUgdHJhbnNmb3JtZXIgcGx1Z2lucyBhbmQgcHJvZHVjZXMgYSB0ZW1wbGF0ZSB0YWcuXG4gKi9cbnZhciBUZW1wbGF0ZVRhZyA9IGZ1bmN0aW9uICgpIHtcbiAgLyoqXG4gICAqIGNvbnN0cnVjdHMgYSB0ZW1wbGF0ZSB0YWdcbiAgICogQGNvbnN0cnVjdHMgVGVtcGxhdGVUYWdcbiAgICogQHBhcmFtICB7Li4uT2JqZWN0fSBbLi4udHJhbnNmb3JtZXJzXSAtIGFuIGFycmF5IG9yIGFyZ3VtZW50cyBsaXN0IG9mIHRyYW5zZm9ybWVyc1xuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gICAgICAgICAgICAgICAgICAgIC0gYSB0ZW1wbGF0ZSB0YWdcbiAgICovXG4gIGZ1bmN0aW9uIFRlbXBsYXRlVGFnKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgdHJhbnNmb3JtZXJzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICB0cmFuc2Zvcm1lcnNbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFRlbXBsYXRlVGFnKTtcblxuICAgIHRoaXMudGFnID0gZnVuY3Rpb24gKHN0cmluZ3MpIHtcbiAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgZXhwcmVzc2lvbnMgPSBBcnJheShfbGVuMiA+IDEgPyBfbGVuMiAtIDEgOiAwKSwgX2tleTIgPSAxOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICAgIGV4cHJlc3Npb25zW19rZXkyIC0gMV0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHN0cmluZ3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gaWYgdGhlIGZpcnN0IGFyZ3VtZW50IHBhc3NlZCBpcyBhIGZ1bmN0aW9uLCBhc3N1bWUgaXQgaXMgYSB0ZW1wbGF0ZSB0YWcgYW5kIHJldHVyblxuICAgICAgICAvLyBhbiBpbnRlcm1lZGlhcnkgdGFnIHRoYXQgcHJvY2Vzc2VzIHRoZSB0ZW1wbGF0ZSB1c2luZyB0aGUgYWZvcmVtZW50aW9uZWQgdGFnLCBwYXNzaW5nIHRoZVxuICAgICAgICAvLyByZXN1bHQgdG8gb3VyIHRhZ1xuICAgICAgICByZXR1cm4gX3RoaXMuaW50ZXJpbVRhZy5iaW5kKF90aGlzLCBzdHJpbmdzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBzdHJpbmdzID09PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBpZiB0aGUgZmlyc3QgYXJndW1lbnQgcGFzc2VkIGlzIGEgc3RyaW5nLCBqdXN0IHRyYW5zZm9ybSBpdFxuICAgICAgICByZXR1cm4gX3RoaXMudHJhbnNmb3JtRW5kUmVzdWx0KHN0cmluZ3MpO1xuICAgICAgfVxuXG4gICAgICAvLyBlbHNlLCByZXR1cm4gYSB0cmFuc2Zvcm1lZCBlbmQgcmVzdWx0IG9mIHByb2Nlc3NpbmcgdGhlIHRlbXBsYXRlIHdpdGggb3VyIHRhZ1xuICAgICAgc3RyaW5ncyA9IHN0cmluZ3MubWFwKF90aGlzLnRyYW5zZm9ybVN0cmluZy5iaW5kKF90aGlzKSk7XG4gICAgICByZXR1cm4gX3RoaXMudHJhbnNmb3JtRW5kUmVzdWx0KHN0cmluZ3MucmVkdWNlKF90aGlzLnByb2Nlc3NTdWJzdGl0dXRpb25zLmJpbmQoX3RoaXMsIGV4cHJlc3Npb25zKSkpO1xuICAgIH07XG5cbiAgICAvLyBpZiBmaXJzdCBhcmd1bWVudCBpcyBhbiBhcnJheSwgZXh0cnVkZSBpdCBhcyBhIGxpc3Qgb2YgdHJhbnNmb3JtZXJzXG4gICAgaWYgKHRyYW5zZm9ybWVycy5sZW5ndGggPiAwICYmIEFycmF5LmlzQXJyYXkodHJhbnNmb3JtZXJzWzBdKSkge1xuICAgICAgdHJhbnNmb3JtZXJzID0gdHJhbnNmb3JtZXJzWzBdO1xuICAgIH1cblxuICAgIC8vIGlmIGFueSB0cmFuc2Zvcm1lcnMgYXJlIGZ1bmN0aW9ucywgdGhpcyBtZWFucyB0aGV5IGFyZSBub3QgaW5pdGlhdGVkIC0gYXV0b21hdGljYWxseSBpbml0aWF0ZSB0aGVtXG4gICAgdGhpcy50cmFuc2Zvcm1lcnMgPSB0cmFuc2Zvcm1lcnMubWFwKGZ1bmN0aW9uICh0cmFuc2Zvcm1lcikge1xuICAgICAgcmV0dXJuIHR5cGVvZiB0cmFuc2Zvcm1lciA9PT0gJ2Z1bmN0aW9uJyA/IHRyYW5zZm9ybWVyKCkgOiB0cmFuc2Zvcm1lcjtcbiAgICB9KTtcblxuICAgIC8vIHJldHVybiBhbiBFUzIwMTUgdGVtcGxhdGUgdGFnXG4gICAgcmV0dXJuIHRoaXMudGFnO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpZXMgYWxsIHRyYW5zZm9ybWVycyB0byBhIHRlbXBsYXRlIGxpdGVyYWwgdGFnZ2VkIHdpdGggdGhpcyBtZXRob2QuXG4gICAqIElmIGEgZnVuY3Rpb24gaXMgcGFzc2VkIGFzIHRoZSBmaXJzdCBhcmd1bWVudCwgYXNzdW1lcyB0aGUgZnVuY3Rpb24gaXMgYSB0ZW1wbGF0ZSB0YWdcbiAgICogYW5kIGFwcGxpZXMgaXQgdG8gdGhlIHRlbXBsYXRlLCByZXR1cm5pbmcgYSB0ZW1wbGF0ZSB0YWcuXG4gICAqIEBwYXJhbSAgeyhGdW5jdGlvbnxTdHJpbmd8QXJyYXk8U3RyaW5nPil9IHN0cmluZ3MgICAgICAgIC0gRWl0aGVyIGEgdGVtcGxhdGUgdGFnIG9yIGFuIGFycmF5IGNvbnRhaW5pbmcgdGVtcGxhdGUgc3RyaW5ncyBzZXBhcmF0ZWQgYnkgaWRlbnRpZmllclxuICAgKiBAcGFyYW0gIHsuLi4qfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5leHByZXNzaW9ucyAtIE9wdGlvbmFsIGxpc3Qgb2Ygc3Vic3RpdHV0aW9uIHZhbHVlcy5cbiAgICogQHJldHVybiB7KFN0cmluZ3xGdW5jdGlvbil9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBFaXRoZXIgYW4gaW50ZXJtZWRpYXJ5IHRhZyBmdW5jdGlvbiBvciB0aGUgcmVzdWx0cyBvZiBwcm9jZXNzaW5nIHRoZSB0ZW1wbGF0ZS5cbiAgICovXG5cblxuICBfY3JlYXRlQ2xhc3MoVGVtcGxhdGVUYWcsIFt7XG4gICAga2V5OiAnaW50ZXJpbVRhZycsXG5cblxuICAgIC8qKlxuICAgICAqIEFuIGludGVybWVkaWFyeSB0ZW1wbGF0ZSB0YWcgdGhhdCByZWNlaXZlcyBhIHRlbXBsYXRlIHRhZyBhbmQgcGFzc2VzIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgdGVtcGxhdGUgd2l0aCB0aGUgcmVjZWl2ZWRcbiAgICAgKiB0ZW1wbGF0ZSB0YWcgdG8gb3VyIG93biB0ZW1wbGF0ZSB0YWcuXG4gICAgICogQHBhcmFtICB7RnVuY3Rpb259ICAgICAgICBuZXh0VGFnICAgICAgICAgIC0gdGhlIHJlY2VpdmVkIHRlbXBsYXRlIHRhZ1xuICAgICAqIEBwYXJhbSAge0FycmF5PFN0cmluZz59ICAgdGVtcGxhdGUgICAgICAgICAtIHRoZSB0ZW1wbGF0ZSB0byBwcm9jZXNzXG4gICAgICogQHBhcmFtICB7Li4uKn0gICAgICAgICAgICAuLi5zdWJzdGl0dXRpb25zIC0gYHN1YnN0aXR1dGlvbnNgIGlzIGFuIGFycmF5IG9mIGFsbCBzdWJzdGl0dXRpb25zIGluIHRoZSB0ZW1wbGF0ZVxuICAgICAqIEByZXR1cm4geyp9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIHRoZSBmaW5hbCBwcm9jZXNzZWQgdmFsdWVcbiAgICAgKi9cbiAgICB2YWx1ZTogZnVuY3Rpb24gaW50ZXJpbVRhZyhwcmV2aW91c1RhZywgdGVtcGxhdGUpIHtcbiAgICAgIGZvciAodmFyIF9sZW4zID0gYXJndW1lbnRzLmxlbmd0aCwgc3Vic3RpdHV0aW9ucyA9IEFycmF5KF9sZW4zID4gMiA/IF9sZW4zIC0gMiA6IDApLCBfa2V5MyA9IDI7IF9rZXkzIDwgX2xlbjM7IF9rZXkzKyspIHtcbiAgICAgICAgc3Vic3RpdHV0aW9uc1tfa2V5MyAtIDJdID0gYXJndW1lbnRzW19rZXkzXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMudGFnKF90ZW1wbGF0ZU9iamVjdCwgcHJldmlvdXNUYWcuYXBwbHkodW5kZWZpbmVkLCBbdGVtcGxhdGVdLmNvbmNhdChzdWJzdGl0dXRpb25zKSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIGJ1bGsgcHJvY2Vzc2luZyBvbiB0aGUgdGFnZ2VkIHRlbXBsYXRlLCB0cmFuc2Zvcm1pbmcgZWFjaCBzdWJzdGl0dXRpb24gYW5kIHRoZW5cbiAgICAgKiBjb25jYXRlbmF0aW5nIHRoZSByZXN1bHRpbmcgdmFsdWVzIGludG8gYSBzdHJpbmcuXG4gICAgICogQHBhcmFtICB7QXJyYXk8Kj59IHN1YnN0aXR1dGlvbnMgLSBhbiBhcnJheSBvZiBhbGwgcmVtYWluaW5nIHN1YnN0aXR1dGlvbnMgcHJlc2VudCBpbiB0aGlzIHRlbXBsYXRlXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSAgIHJlc3VsdFNvRmFyICAgLSB0aGlzIGl0ZXJhdGlvbidzIHJlc3VsdCBzdHJpbmcgc28gZmFyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSAgIHJlbWFpbmluZ1BhcnQgLSB0aGUgdGVtcGxhdGUgY2h1bmsgYWZ0ZXIgdGhlIGN1cnJlbnQgc3Vic3RpdHV0aW9uXG4gICAgICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAgICAgICAgLSB0aGUgcmVzdWx0IG9mIGpvaW5pbmcgdGhpcyBpdGVyYXRpb24ncyBwcm9jZXNzZWQgc3Vic3RpdHV0aW9uIHdpdGggdGhlIHJlc3VsdFxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdwcm9jZXNzU3Vic3RpdHV0aW9ucycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHByb2Nlc3NTdWJzdGl0dXRpb25zKHN1YnN0aXR1dGlvbnMsIHJlc3VsdFNvRmFyLCByZW1haW5pbmdQYXJ0KSB7XG4gICAgICB2YXIgc3Vic3RpdHV0aW9uID0gdGhpcy50cmFuc2Zvcm1TdWJzdGl0dXRpb24oc3Vic3RpdHV0aW9ucy5zaGlmdCgpLCByZXN1bHRTb0Zhcik7XG4gICAgICByZXR1cm4gJycuY29uY2F0KHJlc3VsdFNvRmFyLCBzdWJzdGl0dXRpb24sIHJlbWFpbmluZ1BhcnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEl0ZXJhdGUgdGhyb3VnaCBlYWNoIHRyYW5zZm9ybWVyLCBhcHBseWluZyB0aGUgdHJhbnNmb3JtZXIncyBgb25TdHJpbmdgIG1ldGhvZCB0byB0aGUgdGVtcGxhdGVcbiAgICAgKiBzdHJpbmdzIGJlZm9yZSBhbGwgc3Vic3RpdHV0aW9ucyBhcmUgcHJvY2Vzc2VkLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgc3RyIC0gVGhlIGlucHV0IHN0cmluZ1xuICAgICAqIEByZXR1cm4ge1N0cmluZ30gICAgIC0gVGhlIGZpbmFsIHJlc3VsdHMgb2YgcHJvY2Vzc2luZyBlYWNoIHRyYW5zZm9ybWVyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ3RyYW5zZm9ybVN0cmluZycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRyYW5zZm9ybVN0cmluZyhzdHIpIHtcbiAgICAgIHZhciBjYiA9IGZ1bmN0aW9uIGNiKHJlcywgdHJhbnNmb3JtKSB7XG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm0ub25TdHJpbmcgPyB0cmFuc2Zvcm0ub25TdHJpbmcocmVzKSA6IHJlcztcbiAgICAgIH07XG4gICAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1lcnMucmVkdWNlKGNiLCBzdHIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdoZW4gYSBzdWJzdGl0dXRpb24gaXMgZW5jb3VudGVyZWQsIGl0ZXJhdGVzIHRocm91Z2ggZWFjaCB0cmFuc2Zvcm1lciBhbmQgYXBwbGllcyB0aGUgdHJhbnNmb3JtZXInc1xuICAgICAqIGBvblN1YnN0aXR1dGlvbmAgbWV0aG9kIHRvIHRoZSBzdWJzdGl0dXRpb24uXG4gICAgICogQHBhcmFtICB7Kn0gICAgICBzdWJzdGl0dXRpb24gLSBUaGUgY3VycmVudCBzdWJzdGl0dXRpb25cbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHJlc3VsdFNvRmFyICAtIFRoZSByZXN1bHQgdXAgdG8gYW5kIGV4Y2x1ZGluZyB0aGlzIHN1YnN0aXR1dGlvbi5cbiAgICAgKiBAcmV0dXJuIHsqfSAgICAgICAgICAgICAgICAgICAtIFRoZSBmaW5hbCByZXN1bHQgb2YgYXBwbHlpbmcgYWxsIHN1YnN0aXR1dGlvbiB0cmFuc2Zvcm1hdGlvbnMuXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ3RyYW5zZm9ybVN1YnN0aXR1dGlvbicsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRyYW5zZm9ybVN1YnN0aXR1dGlvbihzdWJzdGl0dXRpb24sIHJlc3VsdFNvRmFyKSB7XG4gICAgICB2YXIgY2IgPSBmdW5jdGlvbiBjYihyZXMsIHRyYW5zZm9ybSkge1xuICAgICAgICByZXR1cm4gdHJhbnNmb3JtLm9uU3Vic3RpdHV0aW9uID8gdHJhbnNmb3JtLm9uU3Vic3RpdHV0aW9uKHJlcywgcmVzdWx0U29GYXIpIDogcmVzO1xuICAgICAgfTtcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybWVycy5yZWR1Y2UoY2IsIHN1YnN0aXR1dGlvbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSXRlcmF0ZXMgdGhyb3VnaCBlYWNoIHRyYW5zZm9ybWVyLCBhcHBseWluZyB0aGUgdHJhbnNmb3JtZXIncyBgb25FbmRSZXN1bHRgIG1ldGhvZCB0byB0aGVcbiAgICAgKiB0ZW1wbGF0ZSBsaXRlcmFsIGFmdGVyIGFsbCBzdWJzdGl0dXRpb25zIGhhdmUgZmluaXNoZWQgcHJvY2Vzc2luZy5cbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGVuZFJlc3VsdCAtIFRoZSBwcm9jZXNzZWQgdGVtcGxhdGUsIGp1c3QgYmVmb3JlIGl0IGlzIHJldHVybmVkIGZyb20gdGhlIHRhZ1xuICAgICAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgIC0gVGhlIGZpbmFsIHJlc3VsdHMgb2YgcHJvY2Vzc2luZyBlYWNoIHRyYW5zZm9ybWVyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ3RyYW5zZm9ybUVuZFJlc3VsdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRyYW5zZm9ybUVuZFJlc3VsdChlbmRSZXN1bHQpIHtcbiAgICAgIHZhciBjYiA9IGZ1bmN0aW9uIGNiKHJlcywgdHJhbnNmb3JtKSB7XG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm0ub25FbmRSZXN1bHQgPyB0cmFuc2Zvcm0ub25FbmRSZXN1bHQocmVzKSA6IHJlcztcbiAgICAgIH07XG4gICAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1lcnMucmVkdWNlKGNiLCBlbmRSZXN1bHQpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBUZW1wbGF0ZVRhZztcbn0oKTtcblxuZXhwb3J0IGRlZmF1bHQgVGVtcGxhdGVUYWc7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTlVWlcxd2JHRjBaVlJoWnk5VVpXMXdiR0YwWlZSaFp5NXFjeUpkTENKdVlXMWxjeUk2V3lKVVpXMXdiR0YwWlZSaFp5SXNJblJ5WVc1elptOXliV1Z5Y3lJc0luUmhaeUlzSW5OMGNtbHVaM01pTENKbGVIQnlaWE56YVc5dWN5SXNJbWx1ZEdWeWFXMVVZV2NpTENKaWFXNWtJaXdpZEhKaGJuTm1iM0p0Ulc1a1VtVnpkV3gwSWl3aWJXRndJaXdpZEhKaGJuTm1iM0p0VTNSeWFXNW5JaXdpY21Wa2RXTmxJaXdpY0hKdlkyVnpjMU4xWW5OMGFYUjFkR2x2Ym5NaUxDSnNaVzVuZEdnaUxDSkJjbkpoZVNJc0ltbHpRWEp5WVhraUxDSjBjbUZ1YzJadmNtMWxjaUlzSW5CeVpYWnBiM1Z6VkdGbklpd2lkR1Z0Y0d4aGRHVWlMQ0p6ZFdKemRHbDBkWFJwYjI1eklpd2ljbVZ6ZFd4MFUyOUdZWElpTENKeVpXMWhhVzVwYm1kUVlYSjBJaXdpYzNWaWMzUnBkSFYwYVc5dUlpd2lkSEpoYm5ObWIzSnRVM1ZpYzNScGRIVjBhVzl1SWl3aWMyaHBablFpTENKamIyNWpZWFFpTENKemRISWlMQ0pqWWlJc0luSmxjeUlzSW5SeVlXNXpabTl5YlNJc0ltOXVVM1J5YVc1bklpd2liMjVUZFdKemRHbDBkWFJwYjI0aUxDSmxibVJTWlhOMWJIUWlMQ0p2YmtWdVpGSmxjM1ZzZENKZExDSnRZWEJ3YVc1bmN5STZJanM3T3pzN096czdRVUZCUVRzN096dEpRVWx4UWtFc1Z6dEJRVU51UWpzN096czdPMEZCVFVFc2VVSkJRVFpDTzBGQlFVRTdPMEZCUVVFc2MwTkJRV1JETEZsQlFXTTdRVUZCWkVFc2EwSkJRV003UVVGQlFUczdRVUZCUVRzN1FVRkJRU3hUUVhWQ04wSkRMRWRCZGtJMlFpeEhRWFZDZGtJc1ZVRkJRME1zVDBGQlJDeEZRVUUyUWp0QlFVRkJMSGxEUVVGb1FrTXNWMEZCWjBJN1FVRkJhRUpCTEcxQ1FVRm5RanRCUVVGQk96dEJRVU5xUXl4VlFVRkpMRTlCUVU5RUxFOUJRVkFzUzBGQmJVSXNWVUZCZGtJc1JVRkJiVU03UVVGRGFrTTdRVUZEUVR0QlFVTkJPMEZCUTBFc1pVRkJUeXhOUVVGTFJTeFZRVUZNTEVOQlFXZENReXhKUVVGb1FpeERRVUZ4UWl4TFFVRnlRaXhGUVVFeVFrZ3NUMEZCTTBJc1EwRkJVRHRCUVVORU96dEJRVVZFTEZWQlFVa3NUMEZCVDBFc1QwRkJVQ3hMUVVGdFFpeFJRVUYyUWl4RlFVRnBRenRCUVVNdlFqdEJRVU5CTEdWQlFVOHNUVUZCUzBrc2EwSkJRVXdzUTBGQmQwSktMRTlCUVhoQ0xFTkJRVkE3UVVGRFJEczdRVUZGUkR0QlFVTkJRU3huUWtGQlZVRXNVVUZCVVVzc1IwRkJVaXhEUVVGWkxFMUJRVXRETEdWQlFVd3NRMEZCY1VKSUxFbEJRWEpDTEVOQlFUQkNMRXRCUVRGQ0xFTkJRVm9zUTBGQlZqdEJRVU5CTEdGQlFVOHNUVUZCUzBNc2EwSkJRVXdzUTBGRFRFb3NVVUZCVVU4c1RVRkJVaXhEUVVGbExFMUJRVXRETEc5Q1FVRk1MRU5CUVRCQ1RDeEpRVUV4UWl4RFFVRXJRaXhMUVVFdlFpeEZRVUZ4UTBZc1YwRkJja01zUTBGQlppeERRVVJMTEVOQlFWQTdRVUZIUkN4TFFYcERORUk3TzBGQlF6TkNPMEZCUTBFc1VVRkJTVWdzWVVGQllWY3NUVUZCWWl4SFFVRnpRaXhEUVVGMFFpeEpRVUV5UWtNc1RVRkJUVU1zVDBGQlRpeERRVUZqWWl4aFFVRmhMRU5CUVdJc1EwRkJaQ3hEUVVFdlFpeEZRVUVyUkR0QlFVTTNSRUVzY1VKQlFXVkJMR0ZCUVdFc1EwRkJZaXhEUVVGbU8wRkJRMFE3TzBGQlJVUTdRVUZEUVN4VFFVRkxRU3haUVVGTUxFZEJRVzlDUVN4aFFVRmhUeXhIUVVGaUxFTkJRV2xDTEhWQ1FVRmxPMEZCUTJ4RUxHRkJRVThzVDBGQlQwOHNWMEZCVUN4TFFVRjFRaXhWUVVGMlFpeEhRVUZ2UTBFc1lVRkJjRU1zUjBGQmIwUkJMRmRCUVRORU8wRkJRMFFzUzBGR2JVSXNRMEZCY0VJN08wRkJTVUU3UVVGRFFTeFhRVUZQTEV0QlFVdGlMRWRCUVZvN1FVRkRSRHM3UVVGRlJEczdPenM3T3pzN096czdPenM3UVVFMFFrRTdPenM3T3pzN095dENRVkZYWXl4WExFVkJRV0ZETEZFc1JVRkJORUk3UVVGQlFTeDVRMEZCWmtNc1lVRkJaVHRCUVVGbVFTeHhRa0ZCWlR0QlFVRkJPenRCUVVOc1JDeGhRVUZQTEV0QlFVdG9RaXhIUVVGYUxHdENRVUZyUW1Nc09FSkJRVmxETEZGQlFWb3NVMEZCZVVKRExHRkJRWHBDTEVWQlFXeENPMEZCUTBRN08wRkJSVVE3T3pzN096czdPenM3TzNsRFFWRnhRa0VzWVN4RlFVRmxReXhYTEVWQlFXRkRMR0VzUlVGQlpUdEJRVU01UkN4VlFVRk5ReXhsUVVGbExFdEJRVXRETEhGQ1FVRk1MRU5CUTI1Q1NpeGpRVUZqU3l4TFFVRmtMRVZCUkcxQ0xFVkJSVzVDU2l4WFFVWnRRaXhEUVVGeVFqdEJRVWxCTEdGQlFVOHNSMEZCUjBzc1RVRkJTQ3hEUVVGVlRDeFhRVUZXTEVWQlFYVkNSU3haUVVGMlFpeEZRVUZ4UTBRc1lVRkJja01zUTBGQlVEdEJRVU5FT3p0QlFVVkVPenM3T3pzN096czdiME5CVFdkQ1N5eEhMRVZCUVVzN1FVRkRia0lzVlVGQlRVTXNTMEZCU3l4VFFVRk1RU3hGUVVGTExFTkJRVU5ETEVkQlFVUXNSVUZCVFVNc1UwRkJUanRCUVVGQkxHVkJRMVJCTEZWQlFWVkRMRkZCUVZZc1IwRkJjVUpFTEZWQlFWVkRMRkZCUVZZc1EwRkJiVUpHTEVkQlFXNUNMRU5CUVhKQ0xFZEJRU3REUVN4SFFVUjBRenRCUVVGQkxFOUJRVmc3UVVGRlFTeGhRVUZQTEV0QlFVc3hRaXhaUVVGTUxFTkJRV3RDVXl4TlFVRnNRaXhEUVVGNVFtZENMRVZCUVhwQ0xFVkJRVFpDUkN4SFFVRTNRaXhEUVVGUU8wRkJRMFE3TzBGQlJVUTdPenM3T3pzN096czdNRU5CVDNOQ1NpeFpMRVZCUVdOR0xGY3NSVUZCWVR0QlFVTXZReXhWUVVGTlR5eExRVUZMTEZOQlFVeEJMRVZCUVVzc1EwRkJRME1zUjBGQlJDeEZRVUZOUXl4VFFVRk9PMEZCUVVFc1pVRkRWRUVzVlVGQlZVVXNZMEZCVml4SFFVTkpSaXhWUVVGVlJTeGpRVUZXTEVOQlFYbENTQ3hIUVVGNlFpeEZRVUU0UWxJc1YwRkJPVUlzUTBGRVNpeEhRVVZKVVN4SFFVaExPMEZCUVVFc1QwRkJXRHRCUVVsQkxHRkJRVThzUzBGQlN6RkNMRmxCUVV3c1EwRkJhMEpUTEUxQlFXeENMRU5CUVhsQ1owSXNSVUZCZWtJc1JVRkJOa0pNTEZsQlFUZENMRU5CUVZBN1FVRkRSRHM3UVVGRlJEczdPenM3T3pzN08zVkRRVTF0UWxVc1V5eEZRVUZYTzBGQlF6VkNMRlZCUVUxTUxFdEJRVXNzVTBGQlRFRXNSVUZCU3l4RFFVRkRReXhIUVVGRUxFVkJRVTFETEZOQlFVNDdRVUZCUVN4bFFVTlVRU3hWUVVGVlNTeFhRVUZXTEVkQlFYZENTaXhWUVVGVlNTeFhRVUZXTEVOQlFYTkNUQ3hIUVVGMFFpeERRVUY0UWl4SFFVRnhSRUVzUjBGRU5VTTdRVUZCUVN4UFFVRllPMEZCUlVFc1lVRkJUeXhMUVVGTE1VSXNXVUZCVEN4RFFVRnJRbE1zVFVGQmJFSXNRMEZCZVVKblFpeEZRVUY2UWl4RlFVRTJRa3NzVTBGQk4wSXNRMEZCVUR0QlFVTkVPenM3T3pzN1pVRnVTR3RDTDBJc1Z5SXNJbVpwYkdVaU9pSlVaVzF3YkdGMFpWUmhaeTVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFLbHh1SUNvZ1FHTnNZWE56SUZSbGJYQnNZWFJsVkdGblhHNGdLaUJBWTJ4aGMzTmtaWE5qSUVOdmJuTjFiV1Z6SUdFZ2NHbHdaV3hwYm1VZ2IyWWdZMjl0Y0c5ellXSnNaU0IwY21GdWMyWnZjbTFsY2lCd2JIVm5hVzV6SUdGdVpDQndjbTlrZFdObGN5QmhJSFJsYlhCc1lYUmxJSFJoWnk1Y2JpQXFMMXh1Wlhod2IzSjBJR1JsWm1GMWJIUWdZMnhoYzNNZ1ZHVnRjR3hoZEdWVVlXY2dlMXh1SUNBdktpcGNiaUFnSUNvZ1kyOXVjM1J5ZFdOMGN5QmhJSFJsYlhCc1lYUmxJSFJoWjF4dUlDQWdLaUJBWTI5dWMzUnlkV04wY3lCVVpXMXdiR0YwWlZSaFoxeHVJQ0FnS2lCQWNHRnlZVzBnSUhzdUxpNVBZbXBsWTNSOUlGc3VMaTUwY21GdWMyWnZjbTFsY25OZElDMGdZVzRnWVhKeVlYa2diM0lnWVhKbmRXMWxiblJ6SUd4cGMzUWdiMllnZEhKaGJuTm1iM0p0WlhKelhHNGdJQ0FxSUVCeVpYUjFjbTRnZTBaMWJtTjBhVzl1ZlNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0xTQmhJSFJsYlhCc1lYUmxJSFJoWjF4dUlDQWdLaTljYmlBZ1kyOXVjM1J5ZFdOMGIzSW9MaTR1ZEhKaGJuTm1iM0p0WlhKektTQjdYRzRnSUNBZ0x5OGdhV1lnWm1seWMzUWdZWEpuZFcxbGJuUWdhWE1nWVc0Z1lYSnlZWGtzSUdWNGRISjFaR1VnYVhRZ1lYTWdZU0JzYVhOMElHOW1JSFJ5WVc1elptOXliV1Z5YzF4dUlDQWdJR2xtSUNoMGNtRnVjMlp2Y20xbGNuTXViR1Z1WjNSb0lENGdNQ0FtSmlCQmNuSmhlUzVwYzBGeWNtRjVLSFJ5WVc1elptOXliV1Z5YzFzd1hTa3BJSHRjYmlBZ0lDQWdJSFJ5WVc1elptOXliV1Z5Y3lBOUlIUnlZVzV6Wm05eWJXVnljMXN3WFR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCcFppQmhibmtnZEhKaGJuTm1iM0p0WlhKeklHRnlaU0JtZFc1amRHbHZibk1zSUhSb2FYTWdiV1ZoYm5NZ2RHaGxlU0JoY21VZ2JtOTBJR2x1YVhScFlYUmxaQ0F0SUdGMWRHOXRZWFJwWTJGc2JIa2dhVzVwZEdsaGRHVWdkR2hsYlZ4dUlDQWdJSFJvYVhNdWRISmhibk5tYjNKdFpYSnpJRDBnZEhKaGJuTm1iM0p0WlhKekxtMWhjQ2gwY21GdWMyWnZjbTFsY2lBOVBpQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2RIbHdaVzltSUhSeVlXNXpabTl5YldWeUlEMDlQU0FuWm5WdVkzUnBiMjRuSUQ4Z2RISmhibk5tYjNKdFpYSW9LU0E2SUhSeVlXNXpabTl5YldWeU8xeHVJQ0FnSUgwcE8xeHVYRzRnSUNBZ0x5OGdjbVYwZFhKdUlHRnVJRVZUTWpBeE5TQjBaVzF3YkdGMFpTQjBZV2RjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTUwWVdjN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRWEJ3YkdsbGN5QmhiR3dnZEhKaGJuTm1iM0p0WlhKeklIUnZJR0VnZEdWdGNHeGhkR1VnYkdsMFpYSmhiQ0IwWVdkblpXUWdkMmwwYUNCMGFHbHpJRzFsZEdodlpDNWNiaUFnSUNvZ1NXWWdZU0JtZFc1amRHbHZiaUJwY3lCd1lYTnpaV1FnWVhNZ2RHaGxJR1pwY25OMElHRnlaM1Z0Wlc1MExDQmhjM04xYldWeklIUm9aU0JtZFc1amRHbHZiaUJwY3lCaElIUmxiWEJzWVhSbElIUmhaMXh1SUNBZ0tpQmhibVFnWVhCd2JHbGxjeUJwZENCMGJ5QjBhR1VnZEdWdGNHeGhkR1VzSUhKbGRIVnlibWx1WnlCaElIUmxiWEJzWVhSbElIUmhaeTVjYmlBZ0lDb2dRSEJoY21GdElDQjdLRVoxYm1OMGFXOXVmRk4wY21sdVozeEJjbkpoZVR4VGRISnBibWMrS1gwZ2MzUnlhVzVuY3lBZ0lDQWdJQ0FnTFNCRmFYUm9aWElnWVNCMFpXMXdiR0YwWlNCMFlXY2diM0lnWVc0Z1lYSnlZWGtnWTI5dWRHRnBibWx1WnlCMFpXMXdiR0YwWlNCemRISnBibWR6SUhObGNHRnlZWFJsWkNCaWVTQnBaR1Z1ZEdsbWFXVnlYRzRnSUNBcUlFQndZWEpoYlNBZ2V5NHVMaXA5SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM0dUxtVjRjSEpsYzNOcGIyNXpJQzBnVDNCMGFXOXVZV3dnYkdsemRDQnZaaUJ6ZFdKemRHbDBkWFJwYjI0Z2RtRnNkV1Z6TGx4dUlDQWdLaUJBY21WMGRYSnVJSHNvVTNSeWFXNW5mRVoxYm1OMGFXOXVLWDBnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBdElFVnBkR2hsY2lCaGJpQnBiblJsY20xbFpHbGhjbmtnZEdGbklHWjFibU4wYVc5dUlHOXlJSFJvWlNCeVpYTjFiSFJ6SUc5bUlIQnliMk5sYzNOcGJtY2dkR2hsSUhSbGJYQnNZWFJsTGx4dUlDQWdLaTljYmlBZ2RHRm5JRDBnS0hOMGNtbHVaM01zSUM0dUxtVjRjSEpsYzNOcGIyNXpLU0E5UGlCN1hHNGdJQ0FnYVdZZ0tIUjVjR1Z2WmlCemRISnBibWR6SUQwOVBTQW5ablZ1WTNScGIyNG5LU0I3WEc0Z0lDQWdJQ0F2THlCcFppQjBhR1VnWm1seWMzUWdZWEpuZFcxbGJuUWdjR0Z6YzJWa0lHbHpJR0VnWm5WdVkzUnBiMjRzSUdGemMzVnRaU0JwZENCcGN5QmhJSFJsYlhCc1lYUmxJSFJoWnlCaGJtUWdjbVYwZFhKdVhHNGdJQ0FnSUNBdkx5QmhiaUJwYm5SbGNtMWxaR2xoY25rZ2RHRm5JSFJvWVhRZ2NISnZZMlZ6YzJWeklIUm9aU0IwWlcxd2JHRjBaU0IxYzJsdVp5QjBhR1VnWVdadmNtVnRaVzUwYVc5dVpXUWdkR0ZuTENCd1lYTnphVzVuSUhSb1pWeHVJQ0FnSUNBZ0x5OGdjbVZ6ZFd4MElIUnZJRzkxY2lCMFlXZGNiaUFnSUNBZ0lISmxkSFZ5YmlCMGFHbHpMbWx1ZEdWeWFXMVVZV2N1WW1sdVpDaDBhR2x6TENCemRISnBibWR6S1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb2RIbHdaVzltSUhOMGNtbHVaM01nUFQwOUlDZHpkSEpwYm1jbktTQjdYRzRnSUNBZ0lDQXZMeUJwWmlCMGFHVWdabWx5YzNRZ1lYSm5kVzFsYm5RZ2NHRnpjMlZrSUdseklHRWdjM1J5YVc1bkxDQnFkWE4wSUhSeVlXNXpabTl5YlNCcGRGeHVJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVkSEpoYm5ObWIzSnRSVzVrVW1WemRXeDBLSE4wY21sdVozTXBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZJR1ZzYzJVc0lISmxkSFZ5YmlCaElIUnlZVzV6Wm05eWJXVmtJR1Z1WkNCeVpYTjFiSFFnYjJZZ2NISnZZMlZ6YzJsdVp5QjBhR1VnZEdWdGNHeGhkR1VnZDJsMGFDQnZkWElnZEdGblhHNGdJQ0FnYzNSeWFXNW5jeUE5SUhOMGNtbHVaM011YldGd0tIUm9hWE11ZEhKaGJuTm1iM0p0VTNSeWFXNW5MbUpwYm1Rb2RHaHBjeWtwTzF4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TG5SeVlXNXpabTl5YlVWdVpGSmxjM1ZzZENoY2JpQWdJQ0FnSUhOMGNtbHVaM011Y21Wa2RXTmxLSFJvYVhNdWNISnZZMlZ6YzFOMVluTjBhWFIxZEdsdmJuTXVZbWx1WkNoMGFHbHpMQ0JsZUhCeVpYTnphVzl1Y3lrcExGeHVJQ0FnSUNrN1hHNGdJSDA3WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRUZ1SUdsdWRHVnliV1ZrYVdGeWVTQjBaVzF3YkdGMFpTQjBZV2NnZEdoaGRDQnlaV05sYVhabGN5QmhJSFJsYlhCc1lYUmxJSFJoWnlCaGJtUWdjR0Z6YzJWeklIUm9aU0J5WlhOMWJIUWdiMllnWTJGc2JHbHVaeUIwYUdVZ2RHVnRjR3hoZEdVZ2QybDBhQ0IwYUdVZ2NtVmpaV2wyWldSY2JpQWdJQ29nZEdWdGNHeGhkR1VnZEdGbklIUnZJRzkxY2lCdmQyNGdkR1Z0Y0d4aGRHVWdkR0ZuTGx4dUlDQWdLaUJBY0dGeVlXMGdJSHRHZFc1amRHbHZibjBnSUNBZ0lDQWdJRzVsZUhSVVlXY2dJQ0FnSUNBZ0lDQWdMU0IwYUdVZ2NtVmpaV2wyWldRZ2RHVnRjR3hoZEdVZ2RHRm5YRzRnSUNBcUlFQndZWEpoYlNBZ2UwRnljbUY1UEZOMGNtbHVaejU5SUNBZ2RHVnRjR3hoZEdVZ0lDQWdJQ0FnSUNBdElIUm9aU0IwWlcxd2JHRjBaU0IwYnlCd2NtOWpaWE56WEc0Z0lDQXFJRUJ3WVhKaGJTQWdleTR1TGlwOUlDQWdJQ0FnSUNBZ0lDQWdMaTR1YzNWaWMzUnBkSFYwYVc5dWN5QXRJR0J6ZFdKemRHbDBkWFJwYjI1ellDQnBjeUJoYmlCaGNuSmhlU0J2WmlCaGJHd2djM1ZpYzNScGRIVjBhVzl1Y3lCcGJpQjBhR1VnZEdWdGNHeGhkR1ZjYmlBZ0lDb2dRSEpsZEhWeWJpQjdLbjBnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDMGdkR2hsSUdacGJtRnNJSEJ5YjJObGMzTmxaQ0IyWVd4MVpWeHVJQ0FnS2k5Y2JpQWdhVzUwWlhKcGJWUmhaeWh3Y21WMmFXOTFjMVJoWnl3Z2RHVnRjR3hoZEdVc0lDNHVMbk4xWW5OMGFYUjFkR2x2Ym5NcElIdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN5NTBZV2RnSkh0d2NtVjJhVzkxYzFSaFp5aDBaVzF3YkdGMFpTd2dMaTR1YzNWaWMzUnBkSFYwYVc5dWN5bDlZRHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCUVpYSm1iM0p0Y3lCaWRXeHJJSEJ5YjJObGMzTnBibWNnYjI0Z2RHaGxJSFJoWjJkbFpDQjBaVzF3YkdGMFpTd2dkSEpoYm5ObWIzSnRhVzVuSUdWaFkyZ2djM1ZpYzNScGRIVjBhVzl1SUdGdVpDQjBhR1Z1WEc0Z0lDQXFJR052Ym1OaGRHVnVZWFJwYm1jZ2RHaGxJSEpsYzNWc2RHbHVaeUIyWVd4MVpYTWdhVzUwYnlCaElITjBjbWx1Wnk1Y2JpQWdJQ29nUUhCaGNtRnRJQ0I3UVhKeVlYazhLajU5SUhOMVluTjBhWFIxZEdsdmJuTWdMU0JoYmlCaGNuSmhlU0J2WmlCaGJHd2djbVZ0WVdsdWFXNW5JSE4xWW5OMGFYUjFkR2x2Ym5NZ2NISmxjMlZ1ZENCcGJpQjBhR2x6SUhSbGJYQnNZWFJsWEc0Z0lDQXFJRUJ3WVhKaGJTQWdlMU4wY21sdVozMGdJQ0J5WlhOMWJIUlRiMFpoY2lBZ0lDMGdkR2hwY3lCcGRHVnlZWFJwYjI0bmN5QnlaWE4xYkhRZ2MzUnlhVzVuSUhOdklHWmhjbHh1SUNBZ0tpQkFjR0Z5WVcwZ0lIdFRkSEpwYm1kOUlDQWdjbVZ0WVdsdWFXNW5VR0Z5ZENBdElIUm9aU0IwWlcxd2JHRjBaU0JqYUhWdWF5QmhablJsY2lCMGFHVWdZM1Z5Y21WdWRDQnpkV0p6ZEdsMGRYUnBiMjVjYmlBZ0lDb2dRSEpsZEhWeWJpQjdVM1J5YVc1bmZTQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0xTQjBhR1VnY21WemRXeDBJRzltSUdwdmFXNXBibWNnZEdocGN5QnBkR1Z5WVhScGIyNG5jeUJ3Y205alpYTnpaV1FnYzNWaWMzUnBkSFYwYVc5dUlIZHBkR2dnZEdobElISmxjM1ZzZEZ4dUlDQWdLaTljYmlBZ2NISnZZMlZ6YzFOMVluTjBhWFIxZEdsdmJuTW9jM1ZpYzNScGRIVjBhVzl1Y3l3Z2NtVnpkV3gwVTI5R1lYSXNJSEpsYldGcGJtbHVaMUJoY25RcElIdGNiaUFnSUNCamIyNXpkQ0J6ZFdKemRHbDBkWFJwYjI0Z1BTQjBhR2x6TG5SeVlXNXpabTl5YlZOMVluTjBhWFIxZEdsdmJpaGNiaUFnSUNBZ0lITjFZbk4wYVhSMWRHbHZibk11YzJocFpuUW9LU3hjYmlBZ0lDQWdJSEpsYzNWc2RGTnZSbUZ5TEZ4dUlDQWdJQ2s3WEc0Z0lDQWdjbVYwZFhKdUlDY25MbU52Ym1OaGRDaHlaWE4xYkhSVGIwWmhjaXdnYzNWaWMzUnBkSFYwYVc5dUxDQnlaVzFoYVc1cGJtZFFZWEowS1R0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkpkR1Z5WVhSbElIUm9jbTkxWjJnZ1pXRmphQ0IwY21GdWMyWnZjbTFsY2l3Z1lYQndiSGxwYm1jZ2RHaGxJSFJ5WVc1elptOXliV1Z5SjNNZ1lHOXVVM1J5YVc1bllDQnRaWFJvYjJRZ2RHOGdkR2hsSUhSbGJYQnNZWFJsWEc0Z0lDQXFJSE4wY21sdVozTWdZbVZtYjNKbElHRnNiQ0J6ZFdKemRHbDBkWFJwYjI1eklHRnlaU0J3Y205alpYTnpaV1F1WEc0Z0lDQXFJRUJ3WVhKaGJTQjdVM1J5YVc1bmZTQWdjM1J5SUMwZ1ZHaGxJR2x1Y0hWMElITjBjbWx1WjF4dUlDQWdLaUJBY21WMGRYSnVJSHRUZEhKcGJtZDlJQ0FnSUNBdElGUm9aU0JtYVc1aGJDQnlaWE4xYkhSeklHOW1JSEJ5YjJObGMzTnBibWNnWldGamFDQjBjbUZ1YzJadmNtMWxjbHh1SUNBZ0tpOWNiaUFnZEhKaGJuTm1iM0p0VTNSeWFXNW5LSE4wY2lrZ2UxeHVJQ0FnSUdOdmJuTjBJR05pSUQwZ0tISmxjeXdnZEhKaGJuTm1iM0p0S1NBOVBseHVJQ0FnSUNBZ2RISmhibk5tYjNKdExtOXVVM1J5YVc1bklEOGdkSEpoYm5ObWIzSnRMbTl1VTNSeWFXNW5LSEpsY3lrZ09pQnlaWE03WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11ZEhKaGJuTm1iM0p0WlhKekxuSmxaSFZqWlNoallpd2djM1J5S1R0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQlhhR1Z1SUdFZ2MzVmljM1JwZEhWMGFXOXVJR2x6SUdWdVkyOTFiblJsY21Wa0xDQnBkR1Z5WVhSbGN5QjBhSEp2ZFdkb0lHVmhZMmdnZEhKaGJuTm1iM0p0WlhJZ1lXNWtJR0Z3Y0d4cFpYTWdkR2hsSUhSeVlXNXpabTl5YldWeUozTmNiaUFnSUNvZ1lHOXVVM1ZpYzNScGRIVjBhVzl1WUNCdFpYUm9iMlFnZEc4Z2RHaGxJSE4xWW5OMGFYUjFkR2x2Ymk1Y2JpQWdJQ29nUUhCaGNtRnRJQ0I3S24wZ0lDQWdJQ0J6ZFdKemRHbDBkWFJwYjI0Z0xTQlVhR1VnWTNWeWNtVnVkQ0J6ZFdKemRHbDBkWFJwYjI1Y2JpQWdJQ29nUUhCaGNtRnRJQ0I3VTNSeWFXNW5mU0J5WlhOMWJIUlRiMFpoY2lBZ0xTQlVhR1VnY21WemRXeDBJSFZ3SUhSdklHRnVaQ0JsZUdOc2RXUnBibWNnZEdocGN5QnpkV0p6ZEdsMGRYUnBiMjR1WEc0Z0lDQXFJRUJ5WlhSMWNtNGdleXA5SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUMwZ1ZHaGxJR1pwYm1Gc0lISmxjM1ZzZENCdlppQmhjSEJzZVdsdVp5QmhiR3dnYzNWaWMzUnBkSFYwYVc5dUlIUnlZVzV6Wm05eWJXRjBhVzl1Y3k1Y2JpQWdJQ292WEc0Z0lIUnlZVzV6Wm05eWJWTjFZbk4wYVhSMWRHbHZiaWh6ZFdKemRHbDBkWFJwYjI0c0lISmxjM1ZzZEZOdlJtRnlLU0I3WEc0Z0lDQWdZMjl1YzNRZ1kySWdQU0FvY21WekxDQjBjbUZ1YzJadmNtMHBJRDArWEc0Z0lDQWdJQ0IwY21GdWMyWnZjbTB1YjI1VGRXSnpkR2wwZFhScGIyNWNiaUFnSUNBZ0lDQWdQeUIwY21GdWMyWnZjbTB1YjI1VGRXSnpkR2wwZFhScGIyNG9jbVZ6TENCeVpYTjFiSFJUYjBaaGNpbGNiaUFnSUNBZ0lDQWdPaUJ5WlhNN1hHNGdJQ0FnY21WMGRYSnVJSFJvYVhNdWRISmhibk5tYjNKdFpYSnpMbkpsWkhWalpTaGpZaXdnYzNWaWMzUnBkSFYwYVc5dUtUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJKZEdWeVlYUmxjeUIwYUhKdmRXZG9JR1ZoWTJnZ2RISmhibk5tYjNKdFpYSXNJR0Z3Y0d4NWFXNW5JSFJvWlNCMGNtRnVjMlp2Y20xbGNpZHpJR0J2YmtWdVpGSmxjM1ZzZEdBZ2JXVjBhRzlrSUhSdklIUm9aVnh1SUNBZ0tpQjBaVzF3YkdGMFpTQnNhWFJsY21Gc0lHRm1kR1Z5SUdGc2JDQnpkV0p6ZEdsMGRYUnBiMjV6SUdoaGRtVWdabWx1YVhOb1pXUWdjSEp2WTJWemMybHVaeTVjYmlBZ0lDb2dRSEJoY21GdElDQjdVM1J5YVc1bmZTQmxibVJTWlhOMWJIUWdMU0JVYUdVZ2NISnZZMlZ6YzJWa0lIUmxiWEJzWVhSbExDQnFkWE4wSUdKbFptOXlaU0JwZENCcGN5QnlaWFIxY201bFpDQm1jbTl0SUhSb1pTQjBZV2RjYmlBZ0lDb2dRSEpsZEhWeWJpQjdVM1J5YVc1bmZTQWdJQ0FnSUNBZ0lDQWdMU0JVYUdVZ1ptbHVZV3dnY21WemRXeDBjeUJ2WmlCd2NtOWpaWE56YVc1bklHVmhZMmdnZEhKaGJuTm1iM0p0WlhKY2JpQWdJQ292WEc0Z0lIUnlZVzV6Wm05eWJVVnVaRkpsYzNWc2RDaGxibVJTWlhOMWJIUXBJSHRjYmlBZ0lDQmpiMjV6ZENCallpQTlJQ2h5WlhNc0lIUnlZVzV6Wm05eWJTa2dQVDVjYmlBZ0lDQWdJSFJ5WVc1elptOXliUzV2YmtWdVpGSmxjM1ZzZENBL0lIUnlZVzV6Wm05eWJTNXZia1Z1WkZKbGMzVnNkQ2h5WlhNcElEb2djbVZ6TzF4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TG5SeVlXNXpabTl5YldWeWN5NXlaV1IxWTJVb1kySXNJR1Z1WkZKbGMzVnNkQ2s3WEc0Z0lIMWNibjFjYmlKZGZRPT0iLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi9UZW1wbGF0ZVRhZyc7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTlVWlcxd2JHRjBaVlJoWnk5cGJtUmxlQzVxY3lKZExDSnVZVzFsY3lJNld5SmtaV1poZFd4MElsMHNJbTFoY0hCcGJtZHpJam9pY1VKQlFXOUNMR1U3Y1VKQlFXSkJMRThpTENKbWFXeGxJam9pYVc1a1pYZ3Vhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKbGVIQnZjblFnWkdWbVlYVnNkQ0JtY205dElDY3VMMVJsYlhCc1lYUmxWR0ZuSnp0Y2JpSmRmUT09IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4uL2h0bWwnO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5amIyUmxRbXh2WTJzdmFXNWtaWGd1YW5NaVhTd2libUZ0WlhNaU9sc2laR1ZtWVhWc2RDSmRMQ0p0WVhCd2FXNW5jeUk2SW5GQ1FVRnZRaXhUTzNGQ1FVRmlRU3hQSWl3aVptbHNaU0k2SW1sdVpHVjRMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaVpYaHdiM0owSUdSbFptRjFiSFFnWm5KdmJTQW5MaTR2YUhSdGJDYzdYRzRpWFgwPSIsImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciBmcm9tICcuLi9zdHJpcEluZGVudFRyYW5zZm9ybWVyJztcbmltcG9ydCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyIGZyb20gJy4uL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuXG52YXIgY29tbWFMaXN0cyA9IG5ldyBUZW1wbGF0ZVRhZyhpbmxpbmVBcnJheVRyYW5zZm9ybWVyKHsgc2VwYXJhdG9yOiAnLCcgfSksIHN0cmlwSW5kZW50VHJhbnNmb3JtZXIsIHRyaW1SZXN1bHRUcmFuc2Zvcm1lcik7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbW1hTGlzdHM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTlqYjIxdFlVeHBjM1J6TDJOdmJXMWhUR2x6ZEhNdWFuTWlYU3dpYm1GdFpYTWlPbHNpVkdWdGNHeGhkR1ZVWVdjaUxDSnpkSEpwY0VsdVpHVnVkRlJ5WVc1elptOXliV1Z5SWl3aWFXNXNhVzVsUVhKeVlYbFVjbUZ1YzJadmNtMWxjaUlzSW5SeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpSXNJbU52YlcxaFRHbHpkSE1pTENKelpYQmhjbUYwYjNJaVhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxFOUJRVTlCTEZkQlFWQXNUVUZCZDBJc1owSkJRWGhDTzBGQlEwRXNUMEZCVDBNc2MwSkJRVkFzVFVGQmJVTXNNa0pCUVc1RE8wRkJRMEVzVDBGQlQwTXNjMEpCUVZBc1RVRkJiVU1zTWtKQlFXNURPMEZCUTBFc1QwRkJUME1zY1VKQlFWQXNUVUZCYTBNc01FSkJRV3hET3p0QlFVVkJMRWxCUVUxRExHRkJRV0VzU1VGQlNVb3NWMEZCU2l4RFFVTnFRa1VzZFVKQlFYVkNMRVZCUVVWSExGZEJRVmNzUjBGQllpeEZRVUYyUWl4RFFVUnBRaXhGUVVWcVFrb3NjMEpCUm1sQ0xFVkJSMnBDUlN4eFFrRklhVUlzUTBGQmJrSTdPMEZCVFVFc1pVRkJaVU1zVlVGQlppSXNJbVpwYkdVaU9pSmpiMjF0WVV4cGMzUnpMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUZSbGJYQnNZWFJsVkdGbklHWnliMjBnSnk0dUwxUmxiWEJzWVhSbFZHRm5KenRjYm1sdGNHOXlkQ0J6ZEhKcGNFbHVaR1Z1ZEZSeVlXNXpabTl5YldWeUlHWnliMjBnSnk0dUwzTjBjbWx3U1c1a1pXNTBWSEpoYm5ObWIzSnRaWEluTzF4dWFXMXdiM0owSUdsdWJHbHVaVUZ5Y21GNVZISmhibk5tYjNKdFpYSWdabkp2YlNBbkxpNHZhVzVzYVc1bFFYSnlZWGxVY21GdWMyWnZjbTFsY2ljN1hHNXBiWEJ2Y25RZ2RISnBiVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlJR1p5YjIwZ0p5NHVMM1J5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2ljN1hHNWNibU52Ym5OMElHTnZiVzFoVEdsemRITWdQU0J1WlhjZ1ZHVnRjR3hoZEdWVVlXY29YRzRnSUdsdWJHbHVaVUZ5Y21GNVZISmhibk5tYjNKdFpYSW9leUJ6WlhCaGNtRjBiM0k2SUNjc0p5QjlLU3hjYmlBZ2MzUnlhWEJKYm1SbGJuUlVjbUZ1YzJadmNtMWxjaXhjYmlBZ2RISnBiVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlMRnh1S1R0Y2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1kyOXRiV0ZNYVhOMGN6dGNiaUpkZlE9PSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL2NvbW1hTGlzdHMnO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5amIyMXRZVXhwYzNSekwybHVaR1Y0TG1weklsMHNJbTVoYldWeklqcGJJbVJsWm1GMWJIUWlYU3dpYldGd2NHbHVaM01pT2lKeFFrRkJiMElzWXp0eFFrRkJZa0VzVHlJc0ltWnBiR1VpT2lKcGJtUmxlQzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltVjRjRzl5ZENCa1pXWmhkV3gwSUdaeWIyMGdKeTR2WTI5dGJXRk1hWE4wY3ljN1hHNGlYWDA9IiwiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBzdHJpcEluZGVudFRyYW5zZm9ybWVyIGZyb20gJy4uL3N0cmlwSW5kZW50VHJhbnNmb3JtZXInO1xuaW1wb3J0IGlubGluZUFycmF5VHJhbnNmb3JtZXIgZnJvbSAnLi4vaW5saW5lQXJyYXlUcmFuc2Zvcm1lcic7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5cbnZhciBjb21tYUxpc3RzQW5kID0gbmV3IFRlbXBsYXRlVGFnKGlubGluZUFycmF5VHJhbnNmb3JtZXIoeyBzZXBhcmF0b3I6ICcsJywgY29uanVuY3Rpb246ICdhbmQnIH0pLCBzdHJpcEluZGVudFRyYW5zZm9ybWVyLCB0cmltUmVzdWx0VHJhbnNmb3JtZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBjb21tYUxpc3RzQW5kO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5amIyMXRZVXhwYzNSelFXNWtMMk52YlcxaFRHbHpkSE5CYm1RdWFuTWlYU3dpYm1GdFpYTWlPbHNpVkdWdGNHeGhkR1ZVWVdjaUxDSnpkSEpwY0VsdVpHVnVkRlJ5WVc1elptOXliV1Z5SWl3aWFXNXNhVzVsUVhKeVlYbFVjbUZ1YzJadmNtMWxjaUlzSW5SeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpSXNJbU52YlcxaFRHbHpkSE5CYm1RaUxDSnpaWEJoY21GMGIzSWlMQ0pqYjI1cWRXNWpkR2x2YmlKZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1QwRkJUMEVzVjBGQlVDeE5RVUYzUWl4blFrRkJlRUk3UVVGRFFTeFBRVUZQUXl4elFrRkJVQ3hOUVVGdFF5d3lRa0ZCYmtNN1FVRkRRU3hQUVVGUFF5eHpRa0ZCVUN4TlFVRnRReXd5UWtGQmJrTTdRVUZEUVN4UFFVRlBReXh4UWtGQlVDeE5RVUZyUXl3d1FrRkJiRU03TzBGQlJVRXNTVUZCVFVNc1owSkJRV2RDTEVsQlFVbEtMRmRCUVVvc1EwRkRjRUpGTEhWQ1FVRjFRaXhGUVVGRlJ5eFhRVUZYTEVkQlFXSXNSVUZCYTBKRExHRkJRV0VzUzBGQkwwSXNSVUZCZGtJc1EwRkViMElzUlVGRmNFSk1MSE5DUVVadlFpeEZRVWR3UWtVc2NVSkJTRzlDTEVOQlFYUkNPenRCUVUxQkxHVkJRV1ZETEdGQlFXWWlMQ0ptYVd4bElqb2lZMjl0YldGTWFYTjBjMEZ1WkM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbWx0Y0c5eWRDQlVaVzF3YkdGMFpWUmhaeUJtY205dElDY3VMaTlVWlcxd2JHRjBaVlJoWnljN1hHNXBiWEJ2Y25RZ2MzUnlhWEJKYm1SbGJuUlVjbUZ1YzJadmNtMWxjaUJtY205dElDY3VMaTl6ZEhKcGNFbHVaR1Z1ZEZSeVlXNXpabTl5YldWeUp6dGNibWx0Y0c5eWRDQnBibXhwYm1WQmNuSmhlVlJ5WVc1elptOXliV1Z5SUdaeWIyMGdKeTR1TDJsdWJHbHVaVUZ5Y21GNVZISmhibk5tYjNKdFpYSW5PMXh1YVcxd2IzSjBJSFJ5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lCbWNtOXRJQ2N1TGk5MGNtbHRVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSW5PMXh1WEc1amIyNXpkQ0JqYjIxdFlVeHBjM1J6UVc1a0lEMGdibVYzSUZSbGJYQnNZWFJsVkdGbktGeHVJQ0JwYm14cGJtVkJjbkpoZVZSeVlXNXpabTl5YldWeUtIc2djMlZ3WVhKaGRHOXlPaUFuTENjc0lHTnZibXAxYm1OMGFXOXVPaUFuWVc1a0p5QjlLU3hjYmlBZ2MzUnlhWEJKYm1SbGJuUlVjbUZ1YzJadmNtMWxjaXhjYmlBZ2RISnBiVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlMRnh1S1R0Y2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1kyOXRiV0ZNYVhOMGMwRnVaRHRjYmlKZGZRPT0iLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi9jb21tYUxpc3RzQW5kJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OWpiMjF0WVV4cGMzUnpRVzVrTDJsdVpHVjRMbXB6SWwwc0ltNWhiV1Z6SWpwYkltUmxabUYxYkhRaVhTd2liV0Z3Y0dsdVozTWlPaUp4UWtGQmIwSXNhVUk3Y1VKQlFXSkJMRThpTENKbWFXeGxJam9pYVc1a1pYZ3Vhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKbGVIQnZjblFnWkdWbVlYVnNkQ0JtY205dElDY3VMMk52YlcxaFRHbHpkSE5CYm1Rbk8xeHVJbDE5IiwiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBzdHJpcEluZGVudFRyYW5zZm9ybWVyIGZyb20gJy4uL3N0cmlwSW5kZW50VHJhbnNmb3JtZXInO1xuaW1wb3J0IGlubGluZUFycmF5VHJhbnNmb3JtZXIgZnJvbSAnLi4vaW5saW5lQXJyYXlUcmFuc2Zvcm1lcic7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5cbnZhciBjb21tYUxpc3RzT3IgPSBuZXcgVGVtcGxhdGVUYWcoaW5saW5lQXJyYXlUcmFuc2Zvcm1lcih7IHNlcGFyYXRvcjogJywnLCBjb25qdW5jdGlvbjogJ29yJyB9KSwgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciwgdHJpbVJlc3VsdFRyYW5zZm9ybWVyKTtcblxuZXhwb3J0IGRlZmF1bHQgY29tbWFMaXN0c09yO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5amIyMXRZVXhwYzNSelQzSXZZMjl0YldGTWFYTjBjMDl5TG1weklsMHNJbTVoYldWeklqcGJJbFJsYlhCc1lYUmxWR0ZuSWl3aWMzUnlhWEJKYm1SbGJuUlVjbUZ1YzJadmNtMWxjaUlzSW1sdWJHbHVaVUZ5Y21GNVZISmhibk5tYjNKdFpYSWlMQ0owY21sdFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJaUxDSmpiMjF0WVV4cGMzUnpUM0lpTENKelpYQmhjbUYwYjNJaUxDSmpiMjVxZFc1amRHbHZiaUpkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzVDBGQlQwRXNWMEZCVUN4TlFVRjNRaXhuUWtGQmVFSTdRVUZEUVN4UFFVRlBReXh6UWtGQlVDeE5RVUZ0UXl3eVFrRkJia003UVVGRFFTeFBRVUZQUXl4elFrRkJVQ3hOUVVGdFF5d3lRa0ZCYmtNN1FVRkRRU3hQUVVGUFF5eHhRa0ZCVUN4TlFVRnJReXd3UWtGQmJFTTdPMEZCUlVFc1NVRkJUVU1zWlVGQlpTeEpRVUZKU2l4WFFVRktMRU5CUTI1Q1JTeDFRa0ZCZFVJc1JVRkJSVWNzVjBGQlZ5eEhRVUZpTEVWQlFXdENReXhoUVVGaExFbEJRUzlDTEVWQlFYWkNMRU5CUkcxQ0xFVkJSVzVDVEN4elFrRkdiVUlzUlVGSGJrSkZMSEZDUVVodFFpeERRVUZ5UWpzN1FVRk5RU3hsUVVGbFF5eFpRVUZtSWl3aVptbHNaU0k2SW1OdmJXMWhUR2x6ZEhOUGNpNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0JVWlcxd2JHRjBaVlJoWnlCbWNtOXRJQ2N1TGk5VVpXMXdiR0YwWlZSaFp5YzdYRzVwYlhCdmNuUWdjM1J5YVhCSmJtUmxiblJVY21GdWMyWnZjbTFsY2lCbWNtOXRJQ2N1TGk5emRISnBjRWx1WkdWdWRGUnlZVzV6Wm05eWJXVnlKenRjYm1sdGNHOXlkQ0JwYm14cGJtVkJjbkpoZVZSeVlXNXpabTl5YldWeUlHWnliMjBnSnk0dUwybHViR2x1WlVGeWNtRjVWSEpoYm5ObWIzSnRaWEluTzF4dWFXMXdiM0owSUhSeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpQm1jbTl0SUNjdUxpOTBjbWx0VW1WemRXeDBWSEpoYm5ObWIzSnRaWEluTzF4dVhHNWpiMjV6ZENCamIyMXRZVXhwYzNSelQzSWdQU0J1WlhjZ1ZHVnRjR3hoZEdWVVlXY29YRzRnSUdsdWJHbHVaVUZ5Y21GNVZISmhibk5tYjNKdFpYSW9leUJ6WlhCaGNtRjBiM0k2SUNjc0p5d2dZMjl1YW5WdVkzUnBiMjQ2SUNkdmNpY2dmU2tzWEc0Z0lITjBjbWx3U1c1a1pXNTBWSEpoYm5ObWIzSnRaWElzWEc0Z0lIUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaXhjYmlrN1hHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElHTnZiVzFoVEdsemRITlBjanRjYmlKZGZRPT0iLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi9jb21tYUxpc3RzT3InO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5amIyMXRZVXhwYzNSelQzSXZhVzVrWlhndWFuTWlYU3dpYm1GdFpYTWlPbHNpWkdWbVlYVnNkQ0pkTENKdFlYQndhVzVuY3lJNkluRkNRVUZ2UWl4blFqdHhRa0ZCWWtFc1R5SXNJbVpwYkdVaU9pSnBibVJsZUM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbVY0Y0c5eWRDQmtaV1poZFd4MElHWnliMjBnSnk0dlkyOXRiV0ZNYVhOMGMwOXlKenRjYmlKZGZRPT0iLCJpbXBvcnQgVGVtcGxhdGVUYWcgZnJvbSAnLi4vVGVtcGxhdGVUYWcnO1xuaW1wb3J0IHN0cmlwSW5kZW50VHJhbnNmb3JtZXIgZnJvbSAnLi4vc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcic7XG5pbXBvcnQgaW5saW5lQXJyYXlUcmFuc2Zvcm1lciBmcm9tICcuLi9pbmxpbmVBcnJheVRyYW5zZm9ybWVyJztcbmltcG9ydCB0cmltUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcbmltcG9ydCBzcGxpdFN0cmluZ1RyYW5zZm9ybWVyIGZyb20gJy4uL3NwbGl0U3RyaW5nVHJhbnNmb3JtZXInO1xuaW1wb3J0IHJlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXIgZnJvbSAnLi4vcmVtb3ZlTm9uUHJpbnRpbmdWYWx1ZXNUcmFuc2Zvcm1lcic7XG5cbnZhciBodG1sID0gbmV3IFRlbXBsYXRlVGFnKHNwbGl0U3RyaW5nVHJhbnNmb3JtZXIoJ1xcbicpLCByZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyLCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyLCBzdHJpcEluZGVudFRyYW5zZm9ybWVyLCB0cmltUmVzdWx0VHJhbnNmb3JtZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBodG1sO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5b2RHMXNMMmgwYld3dWFuTWlYU3dpYm1GdFpYTWlPbHNpVkdWdGNHeGhkR1ZVWVdjaUxDSnpkSEpwY0VsdVpHVnVkRlJ5WVc1elptOXliV1Z5SWl3aWFXNXNhVzVsUVhKeVlYbFVjbUZ1YzJadmNtMWxjaUlzSW5SeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpSXNJbk53YkdsMFUzUnlhVzVuVkhKaGJuTm1iM0p0WlhJaUxDSnlaVzF2ZG1WT2IyNVFjbWx1ZEdsdVoxWmhiSFZsYzFSeVlXNXpabTl5YldWeUlpd2lhSFJ0YkNKZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1QwRkJUMEVzVjBGQlVDeE5RVUYzUWl4blFrRkJlRUk3UVVGRFFTeFBRVUZQUXl4elFrRkJVQ3hOUVVGdFF5d3lRa0ZCYmtNN1FVRkRRU3hQUVVGUFF5eHpRa0ZCVUN4TlFVRnRReXd5UWtGQmJrTTdRVUZEUVN4UFFVRlBReXh4UWtGQlVDeE5RVUZyUXl3d1FrRkJiRU03UVVGRFFTeFBRVUZQUXl4elFrRkJVQ3hOUVVGdFF5d3lRa0ZCYmtNN1FVRkRRU3hQUVVGUFF5eHJRMEZCVUN4TlFVRXJReXgxUTBGQkwwTTdPMEZCUlVFc1NVRkJUVU1zVDBGQlR5eEpRVUZKVGl4WFFVRktMRU5CUTFoSkxIVkNRVUYxUWl4SlFVRjJRaXhEUVVSWExFVkJSVmhETEd0RFFVWlhMRVZCUjFoSUxITkNRVWhYTEVWQlNWaEVMSE5DUVVwWExFVkJTMWhGTEhGQ1FVeFhMRU5CUVdJN08wRkJVVUVzWlVGQlpVY3NTVUZCWmlJc0ltWnBiR1VpT2lKb2RHMXNMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUZSbGJYQnNZWFJsVkdGbklHWnliMjBnSnk0dUwxUmxiWEJzWVhSbFZHRm5KenRjYm1sdGNHOXlkQ0J6ZEhKcGNFbHVaR1Z1ZEZSeVlXNXpabTl5YldWeUlHWnliMjBnSnk0dUwzTjBjbWx3U1c1a1pXNTBWSEpoYm5ObWIzSnRaWEluTzF4dWFXMXdiM0owSUdsdWJHbHVaVUZ5Y21GNVZISmhibk5tYjNKdFpYSWdabkp2YlNBbkxpNHZhVzVzYVc1bFFYSnlZWGxVY21GdWMyWnZjbTFsY2ljN1hHNXBiWEJ2Y25RZ2RISnBiVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlJR1p5YjIwZ0p5NHVMM1J5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2ljN1hHNXBiWEJ2Y25RZ2MzQnNhWFJUZEhKcGJtZFVjbUZ1YzJadmNtMWxjaUJtY205dElDY3VMaTl6Y0d4cGRGTjBjbWx1WjFSeVlXNXpabTl5YldWeUp6dGNibWx0Y0c5eWRDQnlaVzF2ZG1WT2IyNVFjbWx1ZEdsdVoxWmhiSFZsYzFSeVlXNXpabTl5YldWeUlHWnliMjBnSnk0dUwzSmxiVzkyWlU1dmJsQnlhVzUwYVc1blZtRnNkV1Z6VkhKaGJuTm1iM0p0WlhJbk8xeHVYRzVqYjI1emRDQm9kRzFzSUQwZ2JtVjNJRlJsYlhCc1lYUmxWR0ZuS0Z4dUlDQnpjR3hwZEZOMGNtbHVaMVJ5WVc1elptOXliV1Z5S0NkY1hHNG5LU3hjYmlBZ2NtVnRiM1psVG05dVVISnBiblJwYm1kV1lXeDFaWE5VY21GdWMyWnZjbTFsY2l4Y2JpQWdhVzVzYVc1bFFYSnlZWGxVY21GdWMyWnZjbTFsY2l4Y2JpQWdjM1J5YVhCSmJtUmxiblJVY21GdWMyWnZjbTFsY2l4Y2JpQWdkSEpwYlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5TEZ4dUtUdGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdhSFJ0YkR0Y2JpSmRmUT09IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vaHRtbCc7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTlvZEcxc0wybHVaR1Y0TG1weklsMHNJbTVoYldWeklqcGJJbVJsWm1GMWJIUWlYU3dpYldGd2NHbHVaM01pT2lKeFFrRkJiMElzVVR0eFFrRkJZa0VzVHlJc0ltWnBiR1VpT2lKcGJtUmxlQzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltVjRjRzl5ZENCa1pXWmhkV3gwSUdaeWIyMGdKeTR2YUhSdGJDYzdYRzRpWFgwPSIsIi8vIGNvcmVcbmltcG9ydCBfVGVtcGxhdGVUYWcgZnJvbSAnLi9UZW1wbGF0ZVRhZyc7XG5leHBvcnQgeyBfVGVtcGxhdGVUYWcgYXMgVGVtcGxhdGVUYWcgfTtcblxuLy8gdHJhbnNmb3JtZXJzXG5cbmltcG9ydCBfdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcbmV4cG9ydCB7IF90cmltUmVzdWx0VHJhbnNmb3JtZXIgYXMgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIH07XG5pbXBvcnQgX3N0cmlwSW5kZW50VHJhbnNmb3JtZXIgZnJvbSAnLi9zdHJpcEluZGVudFRyYW5zZm9ybWVyJztcbmV4cG9ydCB7IF9zdHJpcEluZGVudFRyYW5zZm9ybWVyIGFzIHN0cmlwSW5kZW50VHJhbnNmb3JtZXIgfTtcbmltcG9ydCBfcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4vcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyJztcbmV4cG9ydCB7IF9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIgYXMgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyIH07XG5pbXBvcnQgX3JlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lciBmcm9tICcuL3JlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lcic7XG5leHBvcnQgeyBfcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyIGFzIHJlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lciB9O1xuaW1wb3J0IF9yZXBsYWNlU3RyaW5nVHJhbnNmb3JtZXIgZnJvbSAnLi9yZXBsYWNlU3RyaW5nVHJhbnNmb3JtZXInO1xuZXhwb3J0IHsgX3JlcGxhY2VTdHJpbmdUcmFuc2Zvcm1lciBhcyByZXBsYWNlU3RyaW5nVHJhbnNmb3JtZXIgfTtcbmltcG9ydCBfaW5saW5lQXJyYXlUcmFuc2Zvcm1lciBmcm9tICcuL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuZXhwb3J0IHsgX2lubGluZUFycmF5VHJhbnNmb3JtZXIgYXMgaW5saW5lQXJyYXlUcmFuc2Zvcm1lciB9O1xuaW1wb3J0IF9zcGxpdFN0cmluZ1RyYW5zZm9ybWVyIGZyb20gJy4vc3BsaXRTdHJpbmdUcmFuc2Zvcm1lcic7XG5leHBvcnQgeyBfc3BsaXRTdHJpbmdUcmFuc2Zvcm1lciBhcyBzcGxpdFN0cmluZ1RyYW5zZm9ybWVyIH07XG5pbXBvcnQgX3JlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXIgZnJvbSAnLi9yZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyJztcbmV4cG9ydCB7IF9yZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyIGFzIHJlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXIgfTtcblxuLy8gdGFnc1xuXG5pbXBvcnQgX2NvbW1hTGlzdHMgZnJvbSAnLi9jb21tYUxpc3RzJztcbmV4cG9ydCB7IF9jb21tYUxpc3RzIGFzIGNvbW1hTGlzdHMgfTtcbmltcG9ydCBfY29tbWFMaXN0c0FuZCBmcm9tICcuL2NvbW1hTGlzdHNBbmQnO1xuZXhwb3J0IHsgX2NvbW1hTGlzdHNBbmQgYXMgY29tbWFMaXN0c0FuZCB9O1xuaW1wb3J0IF9jb21tYUxpc3RzT3IgZnJvbSAnLi9jb21tYUxpc3RzT3InO1xuZXhwb3J0IHsgX2NvbW1hTGlzdHNPciBhcyBjb21tYUxpc3RzT3IgfTtcbmltcG9ydCBfaHRtbCBmcm9tICcuL2h0bWwnO1xuZXhwb3J0IHsgX2h0bWwgYXMgaHRtbCB9O1xuaW1wb3J0IF9jb2RlQmxvY2sgZnJvbSAnLi9jb2RlQmxvY2snO1xuZXhwb3J0IHsgX2NvZGVCbG9jayBhcyBjb2RlQmxvY2sgfTtcbmltcG9ydCBfc291cmNlIGZyb20gJy4vc291cmNlJztcbmV4cG9ydCB7IF9zb3VyY2UgYXMgc291cmNlIH07XG5pbXBvcnQgX3NhZmVIdG1sIGZyb20gJy4vc2FmZUh0bWwnO1xuZXhwb3J0IHsgX3NhZmVIdG1sIGFzIHNhZmVIdG1sIH07XG5pbXBvcnQgX29uZUxpbmUgZnJvbSAnLi9vbmVMaW5lJztcbmV4cG9ydCB7IF9vbmVMaW5lIGFzIG9uZUxpbmUgfTtcbmltcG9ydCBfb25lTGluZVRyaW0gZnJvbSAnLi9vbmVMaW5lVHJpbSc7XG5leHBvcnQgeyBfb25lTGluZVRyaW0gYXMgb25lTGluZVRyaW0gfTtcbmltcG9ydCBfb25lTGluZUNvbW1hTGlzdHMgZnJvbSAnLi9vbmVMaW5lQ29tbWFMaXN0cyc7XG5leHBvcnQgeyBfb25lTGluZUNvbW1hTGlzdHMgYXMgb25lTGluZUNvbW1hTGlzdHMgfTtcbmltcG9ydCBfb25lTGluZUNvbW1hTGlzdHNPciBmcm9tICcuL29uZUxpbmVDb21tYUxpc3RzT3InO1xuZXhwb3J0IHsgX29uZUxpbmVDb21tYUxpc3RzT3IgYXMgb25lTGluZUNvbW1hTGlzdHNPciB9O1xuaW1wb3J0IF9vbmVMaW5lQ29tbWFMaXN0c0FuZCBmcm9tICcuL29uZUxpbmVDb21tYUxpc3RzQW5kJztcbmV4cG9ydCB7IF9vbmVMaW5lQ29tbWFMaXN0c0FuZCBhcyBvbmVMaW5lQ29tbWFMaXN0c0FuZCB9O1xuaW1wb3J0IF9pbmxpbmVMaXN0cyBmcm9tICcuL2lubGluZUxpc3RzJztcbmV4cG9ydCB7IF9pbmxpbmVMaXN0cyBhcyBpbmxpbmVMaXN0cyB9O1xuaW1wb3J0IF9vbmVMaW5lSW5saW5lTGlzdHMgZnJvbSAnLi9vbmVMaW5lSW5saW5lTGlzdHMnO1xuZXhwb3J0IHsgX29uZUxpbmVJbmxpbmVMaXN0cyBhcyBvbmVMaW5lSW5saW5lTGlzdHMgfTtcbmltcG9ydCBfc3RyaXBJbmRlbnQgZnJvbSAnLi9zdHJpcEluZGVudCc7XG5leHBvcnQgeyBfc3RyaXBJbmRlbnQgYXMgc3RyaXBJbmRlbnQgfTtcbmltcG9ydCBfc3RyaXBJbmRlbnRzIGZyb20gJy4vc3RyaXBJbmRlbnRzJztcbmV4cG9ydCB7IF9zdHJpcEluZGVudHMgYXMgc3RyaXBJbmRlbnRzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1TDNOeVl5OXBibVJsZUM1cWN5SmRMQ0p1WVcxbGN5STZXeUpVWlcxd2JHRjBaVlJoWnlJc0luUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUlzSW5OMGNtbHdTVzVrWlc1MFZISmhibk5tYjNKdFpYSWlMQ0p5WlhCc1lXTmxVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSWlMQ0p5WlhCc1lXTmxVM1ZpYzNScGRIVjBhVzl1VkhKaGJuTm1iM0p0WlhJaUxDSnlaWEJzWVdObFUzUnlhVzVuVkhKaGJuTm1iM0p0WlhJaUxDSnBibXhwYm1WQmNuSmhlVlJ5WVc1elptOXliV1Z5SWl3aWMzQnNhWFJUZEhKcGJtZFVjbUZ1YzJadmNtMWxjaUlzSW5KbGJXOTJaVTV2YmxCeWFXNTBhVzVuVm1Gc2RXVnpWSEpoYm5ObWIzSnRaWElpTENKamIyMXRZVXhwYzNSeklpd2lZMjl0YldGTWFYTjBjMEZ1WkNJc0ltTnZiVzFoVEdsemRITlBjaUlzSW1oMGJXd2lMQ0pqYjJSbFFteHZZMnNpTENKemIzVnlZMlVpTENKellXWmxTSFJ0YkNJc0ltOXVaVXhwYm1VaUxDSnZibVZNYVc1bFZISnBiU0lzSW05dVpVeHBibVZEYjIxdFlVeHBjM1J6SWl3aWIyNWxUR2x1WlVOdmJXMWhUR2x6ZEhOUGNpSXNJbTl1WlV4cGJtVkRiMjF0WVV4cGMzUnpRVzVrSWl3aWFXNXNhVzVsVEdsemRITWlMQ0p2Ym1WTWFXNWxTVzVzYVc1bFRHbHpkSE1pTENKemRISnBjRWx1WkdWdWRDSXNJbk4wY21sd1NXNWtaVzUwY3lKZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFN2VVSkJRM2RDTEdVN2VVSkJRV3BDUVN4WE96dEJRVVZRT3p0dFEwRkRhME1zZVVJN2JVTkJRVE5DUXl4eFFqdHZRMEZETkVJc01FSTdiME5CUVRWQ1F5eHpRanR6UTBGRE9FSXNORUk3YzBOQlFUbENReXgzUWpzMFEwRkRiME1zYTBNN05FTkJRWEJEUXl3NFFqdHpRMEZET0VJc05FSTdjME5CUVRsQ1F5eDNRanR2UTBGRE5FSXNNRUk3YjBOQlFUVkNReXh6UWp0dlEwRkRORUlzTUVJN2IwTkJRVFZDUXl4elFqdG5SRUZEZDBNc2MwTTdaMFJCUVhoRFF5eHJRenM3UVVGRlVEczdkMEpCUTNWQ0xHTTdkMEpCUVdoQ1F5eFZPekpDUVVOdFFpeHBRanN5UWtGQmJrSkRMR0U3TUVKQlEydENMR2RDT3pCQ1FVRnNRa01zV1R0clFrRkRWU3hSTzJ0Q1FVRldReXhKTzNWQ1FVTmxMR0U3ZFVKQlFXWkRMRk03YjBKQlExa3NWVHR2UWtGQldrTXNUVHR6UWtGRFl5eFpPM05DUVVGa1F5eFJPM0ZDUVVOaExGYzdjVUpCUVdKRExFODdlVUpCUTJsQ0xHVTdlVUpCUVdwQ1F5eFhPeXRDUVVOMVFpeHhRanNyUWtGQmRrSkRMR2xDTzJsRFFVTjVRaXgxUWp0cFEwRkJla0pETEcxQ08ydERRVU13UWl4M1FqdHJRMEZCTVVKRExHOUNPM2xDUVVOcFFpeGxPM2xDUVVGcVFrTXNWenRuUTBGRGQwSXNjMEk3WjBOQlFYaENReXhyUWp0NVFrRkRhVUlzWlR0NVFrRkJha0pETEZjN01FSkJRMnRDTEdkQ096QkNRVUZzUWtNc1dTSXNJbVpwYkdVaU9pSnBibVJsZUM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaTh2SUdOdmNtVmNibVY0Y0c5eWRDQlVaVzF3YkdGMFpWUmhaeUJtY205dElDY3VMMVJsYlhCc1lYUmxWR0ZuSnp0Y2JseHVMeThnZEhKaGJuTm1iM0p0WlhKelhHNWxlSEJ2Y25RZ2RISnBiVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlJR1p5YjIwZ0p5NHZkSEpwYlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5Snp0Y2JtVjRjRzl5ZENCemRISnBjRWx1WkdWdWRGUnlZVzV6Wm05eWJXVnlJR1p5YjIwZ0p5NHZjM1J5YVhCSmJtUmxiblJVY21GdWMyWnZjbTFsY2ljN1hHNWxlSEJ2Y25RZ2NtVndiR0ZqWlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5SUdaeWIyMGdKeTR2Y21Wd2JHRmpaVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlKenRjYm1WNGNHOXlkQ0J5WlhCc1lXTmxVM1ZpYzNScGRIVjBhVzl1VkhKaGJuTm1iM0p0WlhJZ1puSnZiU0FuTGk5eVpYQnNZV05sVTNWaWMzUnBkSFYwYVc5dVZISmhibk5tYjNKdFpYSW5PMXh1Wlhod2IzSjBJSEpsY0d4aFkyVlRkSEpwYm1kVWNtRnVjMlp2Y20xbGNpQm1jbTl0SUNjdUwzSmxjR3hoWTJWVGRISnBibWRVY21GdWMyWnZjbTFsY2ljN1hHNWxlSEJ2Y25RZ2FXNXNhVzVsUVhKeVlYbFVjbUZ1YzJadmNtMWxjaUJtY205dElDY3VMMmx1YkdsdVpVRnljbUY1VkhKaGJuTm1iM0p0WlhJbk8xeHVaWGh3YjNKMElITndiR2wwVTNSeWFXNW5WSEpoYm5ObWIzSnRaWElnWm5KdmJTQW5MaTl6Y0d4cGRGTjBjbWx1WjFSeVlXNXpabTl5YldWeUp6dGNibVY0Y0c5eWRDQnlaVzF2ZG1WT2IyNVFjbWx1ZEdsdVoxWmhiSFZsYzFSeVlXNXpabTl5YldWeUlHWnliMjBnSnk0dmNtVnRiM1psVG05dVVISnBiblJwYm1kV1lXeDFaWE5VY21GdWMyWnZjbTFsY2ljN1hHNWNiaTh2SUhSaFozTmNibVY0Y0c5eWRDQmpiMjF0WVV4cGMzUnpJR1p5YjIwZ0p5NHZZMjl0YldGTWFYTjBjeWM3WEc1bGVIQnZjblFnWTI5dGJXRk1hWE4wYzBGdVpDQm1jbTl0SUNjdUwyTnZiVzFoVEdsemRITkJibVFuTzF4dVpYaHdiM0owSUdOdmJXMWhUR2x6ZEhOUGNpQm1jbTl0SUNjdUwyTnZiVzFoVEdsemRITlBjaWM3WEc1bGVIQnZjblFnYUhSdGJDQm1jbTl0SUNjdUwyaDBiV3duTzF4dVpYaHdiM0owSUdOdlpHVkNiRzlqYXlCbWNtOXRJQ2N1TDJOdlpHVkNiRzlqYXljN1hHNWxlSEJ2Y25RZ2MyOTFjbU5sSUdaeWIyMGdKeTR2YzI5MWNtTmxKenRjYm1WNGNHOXlkQ0J6WVdabFNIUnRiQ0JtY205dElDY3VMM05oWm1WSWRHMXNKenRjYm1WNGNHOXlkQ0J2Ym1WTWFXNWxJR1p5YjIwZ0p5NHZiMjVsVEdsdVpTYzdYRzVsZUhCdmNuUWdiMjVsVEdsdVpWUnlhVzBnWm5KdmJTQW5MaTl2Ym1WTWFXNWxWSEpwYlNjN1hHNWxlSEJ2Y25RZ2IyNWxUR2x1WlVOdmJXMWhUR2x6ZEhNZ1puSnZiU0FuTGk5dmJtVk1hVzVsUTI5dGJXRk1hWE4wY3ljN1hHNWxlSEJ2Y25RZ2IyNWxUR2x1WlVOdmJXMWhUR2x6ZEhOUGNpQm1jbTl0SUNjdUwyOXVaVXhwYm1WRGIyMXRZVXhwYzNSelQzSW5PMXh1Wlhod2IzSjBJRzl1WlV4cGJtVkRiMjF0WVV4cGMzUnpRVzVrSUdaeWIyMGdKeTR2YjI1bFRHbHVaVU52YlcxaFRHbHpkSE5CYm1Rbk8xeHVaWGh3YjNKMElHbHViR2x1WlV4cGMzUnpJR1p5YjIwZ0p5NHZhVzVzYVc1bFRHbHpkSE1uTzF4dVpYaHdiM0owSUc5dVpVeHBibVZKYm14cGJtVk1hWE4wY3lCbWNtOXRJQ2N1TDI5dVpVeHBibVZKYm14cGJtVk1hWE4wY3ljN1hHNWxlSEJ2Y25RZ2MzUnlhWEJKYm1SbGJuUWdabkp2YlNBbkxpOXpkSEpwY0VsdVpHVnVkQ2M3WEc1bGVIQnZjblFnYzNSeWFYQkpibVJsYm5SeklHWnliMjBnSnk0dmMzUnlhWEJKYm1SbGJuUnpKenRjYmlKZGZRPT0iLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi9pbmxpbmVBcnJheVRyYW5zZm9ybWVyJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXBibXhwYm1WQmNuSmhlVlJ5WVc1elptOXliV1Z5TDJsdVpHVjRMbXB6SWwwc0ltNWhiV1Z6SWpwYkltUmxabUYxYkhRaVhTd2liV0Z3Y0dsdVozTWlPaUp4UWtGQmIwSXNNRUk3Y1VKQlFXSkJMRThpTENKbWFXeGxJam9pYVc1a1pYZ3Vhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKbGVIQnZjblFnWkdWbVlYVnNkQ0JtY205dElDY3VMMmx1YkdsdVpVRnljbUY1VkhKaGJuTm1iM0p0WlhJbk8xeHVJbDE5IiwidmFyIGRlZmF1bHRzID0ge1xuICBzZXBhcmF0b3I6ICcnLFxuICBjb25qdW5jdGlvbjogJycsXG4gIHNlcmlhbDogZmFsc2Vcbn07XG5cbi8qKlxuICogQ29udmVydHMgYW4gYXJyYXkgc3Vic3RpdHV0aW9uIHRvIGEgc3RyaW5nIGNvbnRhaW5pbmcgYSBsaXN0XG4gKiBAcGFyYW0gIHtTdHJpbmd9IFtvcHRzLnNlcGFyYXRvciA9ICcnXSAtIHRoZSBjaGFyYWN0ZXIgdGhhdCBzZXBhcmF0ZXMgZWFjaCBpdGVtXG4gKiBAcGFyYW0gIHtTdHJpbmd9IFtvcHRzLmNvbmp1bmN0aW9uID0gJyddICAtIHJlcGxhY2UgdGhlIGxhc3Qgc2VwYXJhdG9yIHdpdGggdGhpc1xuICogQHBhcmFtICB7Qm9vbGVhbn0gW29wdHMuc2VyaWFsID0gZmFsc2VdIC0gaW5jbHVkZSB0aGUgc2VwYXJhdG9yIGJlZm9yZSB0aGUgY29uanVuY3Rpb24/IChPeGZvcmQgY29tbWEgdXNlLWNhc2UpXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgIC0gYSBUZW1wbGF0ZVRhZyB0cmFuc2Zvcm1lclxuICovXG52YXIgaW5saW5lQXJyYXlUcmFuc2Zvcm1lciA9IGZ1bmN0aW9uIGlubGluZUFycmF5VHJhbnNmb3JtZXIoKSB7XG4gIHZhciBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBkZWZhdWx0cztcbiAgcmV0dXJuIHtcbiAgICBvblN1YnN0aXR1dGlvbjogZnVuY3Rpb24gb25TdWJzdGl0dXRpb24oc3Vic3RpdHV0aW9uLCByZXN1bHRTb0Zhcikge1xuICAgICAgLy8gb25seSBvcGVyYXRlIG9uIGFycmF5c1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc3Vic3RpdHV0aW9uKSkge1xuICAgICAgICB2YXIgYXJyYXlMZW5ndGggPSBzdWJzdGl0dXRpb24ubGVuZ3RoO1xuICAgICAgICB2YXIgc2VwYXJhdG9yID0gb3B0cy5zZXBhcmF0b3I7XG4gICAgICAgIHZhciBjb25qdW5jdGlvbiA9IG9wdHMuY29uanVuY3Rpb247XG4gICAgICAgIHZhciBzZXJpYWwgPSBvcHRzLnNlcmlhbDtcbiAgICAgICAgLy8gam9pbiBlYWNoIGl0ZW0gaW4gdGhlIGFycmF5IGludG8gYSBzdHJpbmcgd2hlcmUgZWFjaCBpdGVtIGlzIHNlcGFyYXRlZCBieSBzZXBhcmF0b3JcbiAgICAgICAgLy8gYmUgc3VyZSB0byBtYWludGFpbiBpbmRlbnRhdGlvblxuICAgICAgICB2YXIgaW5kZW50ID0gcmVzdWx0U29GYXIubWF0Y2goLyhcXG4/W15cXFNcXG5dKykkLyk7XG4gICAgICAgIGlmIChpbmRlbnQpIHtcbiAgICAgICAgICBzdWJzdGl0dXRpb24gPSBzdWJzdGl0dXRpb24uam9pbihzZXBhcmF0b3IgKyBpbmRlbnRbMV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN1YnN0aXR1dGlvbiA9IHN1YnN0aXR1dGlvbi5qb2luKHNlcGFyYXRvciArICcgJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgY29uanVuY3Rpb24gaXMgc2V0LCByZXBsYWNlIHRoZSBsYXN0IHNlcGFyYXRvciB3aXRoIGNvbmp1bmN0aW9uLCBidXQgb25seSBpZiB0aGVyZSBpcyBtb3JlIHRoYW4gb25lIHN1YnN0aXR1dGlvblxuICAgICAgICBpZiAoY29uanVuY3Rpb24gJiYgYXJyYXlMZW5ndGggPiAxKSB7XG4gICAgICAgICAgdmFyIHNlcGFyYXRvckluZGV4ID0gc3Vic3RpdHV0aW9uLmxhc3RJbmRleE9mKHNlcGFyYXRvcik7XG4gICAgICAgICAgc3Vic3RpdHV0aW9uID0gc3Vic3RpdHV0aW9uLnNsaWNlKDAsIHNlcGFyYXRvckluZGV4KSArIChzZXJpYWwgPyBzZXBhcmF0b3IgOiAnJykgKyAnICcgKyBjb25qdW5jdGlvbiArIHN1YnN0aXR1dGlvbi5zbGljZShzZXBhcmF0b3JJbmRleCArIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gc3Vic3RpdHV0aW9uO1xuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGlubGluZUFycmF5VHJhbnNmb3JtZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTlwYm14cGJtVkJjbkpoZVZSeVlXNXpabTl5YldWeUwybHViR2x1WlVGeWNtRjVWSEpoYm5ObWIzSnRaWEl1YW5NaVhTd2libUZ0WlhNaU9sc2laR1ZtWVhWc2RITWlMQ0p6WlhCaGNtRjBiM0lpTENKamIyNXFkVzVqZEdsdmJpSXNJbk5sY21saGJDSXNJbWx1YkdsdVpVRnljbUY1VkhKaGJuTm1iM0p0WlhJaUxDSnZjSFJ6SWl3aWIyNVRkV0p6ZEdsMGRYUnBiMjRpTENKemRXSnpkR2wwZFhScGIyNGlMQ0p5WlhOMWJIUlRiMFpoY2lJc0lrRnljbUY1SWl3aWFYTkJjbkpoZVNJc0ltRnljbUY1VEdWdVozUm9JaXdpYkdWdVozUm9JaXdpYVc1a1pXNTBJaXdpYldGMFkyZ2lMQ0pxYjJsdUlpd2ljMlZ3WVhKaGRHOXlTVzVrWlhnaUxDSnNZWE4wU1c1a1pYaFBaaUlzSW5Oc2FXTmxJbDBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hKUVVGTlFTeFhRVUZYTzBGQlEyWkRMR0ZCUVZjc1JVRkVTVHRCUVVWbVF5eGxRVUZoTEVWQlJrVTdRVUZIWmtNc1ZVRkJVVHRCUVVoUExFTkJRV3BDT3p0QlFVMUJPenM3T3pzN096dEJRVkZCTEVsQlFVMURMSGxDUVVGNVFpeFRRVUY2UWtFc2MwSkJRWGxDTzBGQlFVRXNUVUZCUTBNc1NVRkJSQ3gxUlVGQlVVd3NVVUZCVWp0QlFVRkJMRk5CUVhOQ08wRkJRMjVFVFN4clFrRkViVVFzTUVKQlEzQkRReXhaUVVSdlF5eEZRVU4wUWtNc1YwRkVjMElzUlVGRFZEdEJRVU40UXp0QlFVTkJMRlZCUVVsRExFMUJRVTFETEU5QlFVNHNRMEZCWTBnc1dVRkJaQ3hEUVVGS0xFVkJRV2xETzBGQlF5OUNMRmxCUVUxSkxHTkJRV05LTEdGQlFXRkxMRTFCUVdwRE8wRkJRMEVzV1VGQlRWZ3NXVUZCV1Vrc1MwRkJTMG9zVTBGQmRrSTdRVUZEUVN4WlFVRk5ReXhqUVVGalJ5eExRVUZMU0N4WFFVRjZRanRCUVVOQkxGbEJRVTFETEZOQlFWTkZMRXRCUVV0R0xFMUJRWEJDTzBGQlEwRTdRVUZEUVR0QlFVTkJMRmxCUVUxVkxGTkJRVk5NTEZsQlFWbE5MRXRCUVZvc1EwRkJhMElzWjBKQlFXeENMRU5CUVdZN1FVRkRRU3haUVVGSlJDeE5RVUZLTEVWQlFWazdRVUZEVms0c2VVSkJRV1ZCTEdGQlFXRlJMRWxCUVdJc1EwRkJhMEprTEZsQlFWbFpMRTlCUVU4c1EwRkJVQ3hEUVVFNVFpeERRVUZtTzBGQlEwUXNVMEZHUkN4TlFVVlBPMEZCUTB4T0xIbENRVUZsUVN4aFFVRmhVU3hKUVVGaUxFTkJRV3RDWkN4WlFVRlpMRWRCUVRsQ0xFTkJRV1k3UVVGRFJEdEJRVU5FTzBGQlEwRXNXVUZCU1VNc1pVRkJaVk1zWTBGQll5eERRVUZxUXl4RlFVRnZRenRCUVVOc1F5eGpRVUZOU3l4cFFrRkJhVUpVTEdGQlFXRlZMRmRCUVdJc1EwRkJlVUpvUWl4VFFVRjZRaXhEUVVGMlFqdEJRVU5CVFN4NVFrRkRSVUVzWVVGQllWY3NTMEZCWWl4RFFVRnRRaXhEUVVGdVFpeEZRVUZ6UWtZc1kwRkJkRUlzUzBGRFEySXNVMEZCVTBZc1UwRkJWQ3hIUVVGeFFpeEZRVVIwUWl4SlFVVkJMRWRCUmtFc1IwRkhRVU1zVjBGSVFTeEhRVWxCU3l4aFFVRmhWeXhMUVVGaUxFTkJRVzFDUml4cFFrRkJhVUlzUTBGQmNFTXNRMEZNUmp0QlFVMUVPMEZCUTBZN1FVRkRSQ3hoUVVGUFZDeFpRVUZRTzBGQlEwUTdRVUUxUW10RUxFZEJRWFJDTzBGQlFVRXNRMEZCTDBJN08wRkJLMEpCTEdWQlFXVklMSE5DUVVGbUlpd2labWxzWlNJNkltbHViR2x1WlVGeWNtRjVWSEpoYm5ObWIzSnRaWEl1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmpiMjV6ZENCa1pXWmhkV3gwY3lBOUlIdGNiaUFnYzJWd1lYSmhkRzl5T2lBbkp5eGNiaUFnWTI5dWFuVnVZM1JwYjI0NklDY25MRnh1SUNCelpYSnBZV3c2SUdaaGJITmxMRnh1ZlR0Y2JseHVMeW9xWEc0Z0tpQkRiMjUyWlhKMGN5QmhiaUJoY25KaGVTQnpkV0p6ZEdsMGRYUnBiMjRnZEc4Z1lTQnpkSEpwYm1jZ1kyOXVkR0ZwYm1sdVp5QmhJR3hwYzNSY2JpQXFJRUJ3WVhKaGJTQWdlMU4wY21sdVozMGdXMjl3ZEhNdWMyVndZWEpoZEc5eUlEMGdKeWRkSUMwZ2RHaGxJR05vWVhKaFkzUmxjaUIwYUdGMElITmxjR0Z5WVhSbGN5QmxZV05vSUdsMFpXMWNiaUFxSUVCd1lYSmhiU0FnZTFOMGNtbHVaMzBnVzI5d2RITXVZMjl1YW5WdVkzUnBiMjRnUFNBbkoxMGdJQzBnY21Wd2JHRmpaU0IwYUdVZ2JHRnpkQ0J6WlhCaGNtRjBiM0lnZDJsMGFDQjBhR2x6WEc0Z0tpQkFjR0Z5WVcwZ0lIdENiMjlzWldGdWZTQmJiM0IwY3k1elpYSnBZV3dnUFNCbVlXeHpaVjBnTFNCcGJtTnNkV1JsSUhSb1pTQnpaWEJoY21GMGIzSWdZbVZtYjNKbElIUm9aU0JqYjI1cWRXNWpkR2x2Ymo4Z0tFOTRabTl5WkNCamIyMXRZU0IxYzJVdFkyRnpaU2xjYmlBcVhHNGdLaUJBY21WMGRYSnVJSHRQWW1wbFkzUjlJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnTFNCaElGUmxiWEJzWVhSbFZHRm5JSFJ5WVc1elptOXliV1Z5WEc0Z0tpOWNibU52Ym5OMElHbHViR2x1WlVGeWNtRjVWSEpoYm5ObWIzSnRaWElnUFNBb2IzQjBjeUE5SUdSbFptRjFiSFJ6S1NBOVBpQW9lMXh1SUNCdmJsTjFZbk4wYVhSMWRHbHZiaWh6ZFdKemRHbDBkWFJwYjI0c0lISmxjM1ZzZEZOdlJtRnlLU0I3WEc0Z0lDQWdMeThnYjI1c2VTQnZjR1Z5WVhSbElHOXVJR0Z5Y21GNWMxeHVJQ0FnSUdsbUlDaEJjbkpoZVM1cGMwRnljbUY1S0hOMVluTjBhWFIxZEdsdmJpa3BJSHRjYmlBZ0lDQWdJR052Ym5OMElHRnljbUY1VEdWdVozUm9JRDBnYzNWaWMzUnBkSFYwYVc5dUxteGxibWQwYUR0Y2JpQWdJQ0FnSUdOdmJuTjBJSE5sY0dGeVlYUnZjaUE5SUc5d2RITXVjMlZ3WVhKaGRHOXlPMXh1SUNBZ0lDQWdZMjl1YzNRZ1kyOXVhblZ1WTNScGIyNGdQU0J2Y0hSekxtTnZibXAxYm1OMGFXOXVPMXh1SUNBZ0lDQWdZMjl1YzNRZ2MyVnlhV0ZzSUQwZ2IzQjBjeTV6WlhKcFlXdzdYRzRnSUNBZ0lDQXZMeUJxYjJsdUlHVmhZMmdnYVhSbGJTQnBiaUIwYUdVZ1lYSnlZWGtnYVc1MGJ5QmhJSE4wY21sdVp5QjNhR1Z5WlNCbFlXTm9JR2wwWlcwZ2FYTWdjMlZ3WVhKaGRHVmtJR0o1SUhObGNHRnlZWFJ2Y2x4dUlDQWdJQ0FnTHk4Z1ltVWdjM1Z5WlNCMGJ5QnRZV2x1ZEdGcGJpQnBibVJsYm5SaGRHbHZibHh1SUNBZ0lDQWdZMjl1YzNRZ2FXNWtaVzUwSUQwZ2NtVnpkV3gwVTI5R1lYSXViV0YwWTJnb0x5aGNYRzQvVzE1Y1hGTmNYRzVkS3lra0x5azdYRzRnSUNBZ0lDQnBaaUFvYVc1a1pXNTBLU0I3WEc0Z0lDQWdJQ0FnSUhOMVluTjBhWFIxZEdsdmJpQTlJSE4xWW5OMGFYUjFkR2x2Ymk1cWIybHVLSE5sY0dGeVlYUnZjaUFySUdsdVpHVnVkRnN4WFNrN1hHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCemRXSnpkR2wwZFhScGIyNGdQU0J6ZFdKemRHbDBkWFJwYjI0dWFtOXBiaWh6WlhCaGNtRjBiM0lnS3lBbklDY3BPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lDQWdMeThnYVdZZ1kyOXVhblZ1WTNScGIyNGdhWE1nYzJWMExDQnlaWEJzWVdObElIUm9aU0JzWVhOMElITmxjR0Z5WVhSdmNpQjNhWFJvSUdOdmJtcDFibU4wYVc5dUxDQmlkWFFnYjI1c2VTQnBaaUIwYUdWeVpTQnBjeUJ0YjNKbElIUm9ZVzRnYjI1bElITjFZbk4wYVhSMWRHbHZibHh1SUNBZ0lDQWdhV1lnS0dOdmJtcDFibU4wYVc5dUlDWW1JR0Z5Y21GNVRHVnVaM1JvSUQ0Z01Ta2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQnpaWEJoY21GMGIzSkpibVJsZUNBOUlITjFZbk4wYVhSMWRHbHZiaTVzWVhOMFNXNWtaWGhQWmloelpYQmhjbUYwYjNJcE8xeHVJQ0FnSUNBZ0lDQnpkV0p6ZEdsMGRYUnBiMjRnUFZ4dUlDQWdJQ0FnSUNBZ0lITjFZbk4wYVhSMWRHbHZiaTV6YkdsalpTZ3dMQ0J6WlhCaGNtRjBiM0pKYm1SbGVDa2dLMXh1SUNBZ0lDQWdJQ0FnSUNoelpYSnBZV3dnUHlCelpYQmhjbUYwYjNJZ09pQW5KeWtnSzF4dUlDQWdJQ0FnSUNBZ0lDY2dKeUFyWEc0Z0lDQWdJQ0FnSUNBZ1kyOXVhblZ1WTNScGIyNGdLMXh1SUNBZ0lDQWdJQ0FnSUhOMVluTjBhWFIxZEdsdmJpNXpiR2xqWlNoelpYQmhjbUYwYjNKSmJtUmxlQ0FySURFcE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JpQWdJQ0J5WlhSMWNtNGdjM1ZpYzNScGRIVjBhVzl1TzF4dUlDQjlMRnh1ZlNrN1hHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElHbHViR2x1WlVGeWNtRjVWSEpoYm5ObWIzSnRaWEk3WEc0aVhYMD0iLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi9pbmxpbmVMaXN0cyc7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTlwYm14cGJtVk1hWE4wY3k5cGJtUmxlQzVxY3lKZExDSnVZVzFsY3lJNld5SmtaV1poZFd4MElsMHNJbTFoY0hCcGJtZHpJam9pY1VKQlFXOUNMR1U3Y1VKQlFXSkJMRThpTENKbWFXeGxJam9pYVc1a1pYZ3Vhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKbGVIQnZjblFnWkdWbVlYVnNkQ0JtY205dElDY3VMMmx1YkdsdVpVeHBjM1J6Snp0Y2JpSmRmUT09IiwiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBzdHJpcEluZGVudFRyYW5zZm9ybWVyIGZyb20gJy4uL3N0cmlwSW5kZW50VHJhbnNmb3JtZXInO1xuaW1wb3J0IGlubGluZUFycmF5VHJhbnNmb3JtZXIgZnJvbSAnLi4vaW5saW5lQXJyYXlUcmFuc2Zvcm1lcic7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5cbnZhciBpbmxpbmVMaXN0cyA9IG5ldyBUZW1wbGF0ZVRhZyhpbmxpbmVBcnJheVRyYW5zZm9ybWVyLCBzdHJpcEluZGVudFRyYW5zZm9ybWVyLCB0cmltUmVzdWx0VHJhbnNmb3JtZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBpbmxpbmVMaXN0cztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXBibXhwYm1WTWFYTjBjeTlwYm14cGJtVk1hWE4wY3k1cWN5SmRMQ0p1WVcxbGN5STZXeUpVWlcxd2JHRjBaVlJoWnlJc0luTjBjbWx3U1c1a1pXNTBWSEpoYm5ObWIzSnRaWElpTENKcGJteHBibVZCY25KaGVWUnlZVzV6Wm05eWJXVnlJaXdpZEhKcGJWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUlpd2lhVzVzYVc1bFRHbHpkSE1pWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEU5QlFVOUJMRmRCUVZBc1RVRkJkMElzWjBKQlFYaENPMEZCUTBFc1QwRkJUME1zYzBKQlFWQXNUVUZCYlVNc01rSkJRVzVETzBGQlEwRXNUMEZCVDBNc2MwSkJRVkFzVFVGQmJVTXNNa0pCUVc1RE8wRkJRMEVzVDBGQlQwTXNjVUpCUVZBc1RVRkJhME1zTUVKQlFXeERPenRCUVVWQkxFbEJRVTFETEdOQlFXTXNTVUZCU1Vvc1YwRkJTaXhEUVVOc1FrVXNjMEpCUkd0Q0xFVkJSV3hDUkN4elFrRkdhMElzUlVGSGJFSkZMSEZDUVVoclFpeERRVUZ3UWpzN1FVRk5RU3hsUVVGbFF5eFhRVUZtSWl3aVptbHNaU0k2SW1sdWJHbHVaVXhwYzNSekxtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJRlJsYlhCc1lYUmxWR0ZuSUdaeWIyMGdKeTR1TDFSbGJYQnNZWFJsVkdGbkp6dGNibWx0Y0c5eWRDQnpkSEpwY0VsdVpHVnVkRlJ5WVc1elptOXliV1Z5SUdaeWIyMGdKeTR1TDNOMGNtbHdTVzVrWlc1MFZISmhibk5tYjNKdFpYSW5PMXh1YVcxd2IzSjBJR2x1YkdsdVpVRnljbUY1VkhKaGJuTm1iM0p0WlhJZ1puSnZiU0FuTGk0dmFXNXNhVzVsUVhKeVlYbFVjbUZ1YzJadmNtMWxjaWM3WEc1cGJYQnZjblFnZEhKcGJWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUlHWnliMjBnSnk0dUwzUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaWM3WEc1Y2JtTnZibk4wSUdsdWJHbHVaVXhwYzNSeklEMGdibVYzSUZSbGJYQnNZWFJsVkdGbktGeHVJQ0JwYm14cGJtVkJjbkpoZVZSeVlXNXpabTl5YldWeUxGeHVJQ0J6ZEhKcGNFbHVaR1Z1ZEZSeVlXNXpabTl5YldWeUxGeHVJQ0IwY21sdFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJc1hHNHBPMXh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JwYm14cGJtVk1hWE4wY3p0Y2JpSmRmUT09IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vb25lTGluZSc7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl2Ym1WTWFXNWxMMmx1WkdWNExtcHpJbDBzSW01aGJXVnpJanBiSW1SbFptRjFiSFFpWFN3aWJXRndjR2x1WjNNaU9pSnhRa0ZCYjBJc1Z6dHhRa0ZCWWtFc1R5SXNJbVpwYkdVaU9pSnBibVJsZUM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbVY0Y0c5eWRDQmtaV1poZFd4MElHWnliMjBnSnk0dmIyNWxUR2x1WlNjN1hHNGlYWDA9IiwiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCB0cmltUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcbmltcG9ydCByZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyJztcblxudmFyIG9uZUxpbmUgPSBuZXcgVGVtcGxhdGVUYWcocmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyKC8oPzpcXG4oPzpcXHMqKSkrL2csICcgJyksIHRyaW1SZXN1bHRUcmFuc2Zvcm1lcik7XG5cbmV4cG9ydCBkZWZhdWx0IG9uZUxpbmU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl2Ym1WTWFXNWxMMjl1WlV4cGJtVXVhbk1pWFN3aWJtRnRaWE1pT2xzaVZHVnRjR3hoZEdWVVlXY2lMQ0owY21sdFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJaUxDSnlaWEJzWVdObFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJaUxDSnZibVZNYVc1bElsMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeFBRVUZQUVN4WFFVRlFMRTFCUVhkQ0xHZENRVUY0UWp0QlFVTkJMRTlCUVU5RExIRkNRVUZRTEUxQlFXdERMREJDUVVGc1F6dEJRVU5CTEU5QlFVOURMSGRDUVVGUUxFMUJRWEZETERaQ1FVRnlRenM3UVVGRlFTeEpRVUZOUXl4VlFVRlZMRWxCUVVsSUxGZEJRVW9zUTBGRFpFVXNlVUpCUVhsQ0xHbENRVUY2UWl4RlFVRTBReXhIUVVFMVF5eERRVVJqTEVWQlJXUkVMSEZDUVVaakxFTkJRV2hDT3p0QlFVdEJMR1ZCUVdWRkxFOUJRV1lpTENKbWFXeGxJam9pYjI1bFRHbHVaUzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltbHRjRzl5ZENCVVpXMXdiR0YwWlZSaFp5Qm1jbTl0SUNjdUxpOVVaVzF3YkdGMFpWUmhaeWM3WEc1cGJYQnZjblFnZEhKcGJWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUlHWnliMjBnSnk0dUwzUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaWM3WEc1cGJYQnZjblFnY21Wd2JHRmpaVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlJR1p5YjIwZ0p5NHVMM0psY0d4aFkyVlNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpYzdYRzVjYm1OdmJuTjBJRzl1WlV4cGJtVWdQU0J1WlhjZ1ZHVnRjR3hoZEdWVVlXY29YRzRnSUhKbGNHeGhZMlZTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaWd2S0Q4NlhGeHVLRDg2WEZ4ektpa3BLeTluTENBbklDY3BMRnh1SUNCMGNtbHRVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSXNYRzRwTzF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCdmJtVk1hVzVsTzF4dUlsMTkiLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi9vbmVMaW5lQ29tbWFMaXN0cyc7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl2Ym1WTWFXNWxRMjl0YldGTWFYTjBjeTlwYm1SbGVDNXFjeUpkTENKdVlXMWxjeUk2V3lKa1pXWmhkV3gwSWwwc0ltMWhjSEJwYm1keklqb2ljVUpCUVc5Q0xIRkNPM0ZDUVVGaVFTeFBJaXdpWm1sc1pTSTZJbWx1WkdWNExtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpWlhod2IzSjBJR1JsWm1GMWJIUWdabkp2YlNBbkxpOXZibVZNYVc1bFEyOXRiV0ZNYVhOMGN5YzdYRzRpWFgwPSIsImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgaW5saW5lQXJyYXlUcmFuc2Zvcm1lciBmcm9tICcuLi9pbmxpbmVBcnJheVRyYW5zZm9ybWVyJztcbmltcG9ydCB0cmltUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcbmltcG9ydCByZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIgZnJvbSAnLi4vcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyJztcblxudmFyIG9uZUxpbmVDb21tYUxpc3RzID0gbmV3IFRlbXBsYXRlVGFnKGlubGluZUFycmF5VHJhbnNmb3JtZXIoeyBzZXBhcmF0b3I6ICcsJyB9KSwgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyKC8oPzpcXHMrKS9nLCAnICcpLCB0cmltUmVzdWx0VHJhbnNmb3JtZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBvbmVMaW5lQ29tbWFMaXN0cztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXZibVZNYVc1bFEyOXRiV0ZNYVhOMGN5OXZibVZNYVc1bFEyOXRiV0ZNYVhOMGN5NXFjeUpkTENKdVlXMWxjeUk2V3lKVVpXMXdiR0YwWlZSaFp5SXNJbWx1YkdsdVpVRnljbUY1VkhKaGJuTm1iM0p0WlhJaUxDSjBjbWx0VW1WemRXeDBWSEpoYm5ObWIzSnRaWElpTENKeVpYQnNZV05sVW1WemRXeDBWSEpoYm5ObWIzSnRaWElpTENKdmJtVk1hVzVsUTI5dGJXRk1hWE4wY3lJc0luTmxjR0Z5WVhSdmNpSmRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNUMEZCVDBFc1YwRkJVQ3hOUVVGM1FpeG5Ra0ZCZUVJN1FVRkRRU3hQUVVGUFF5eHpRa0ZCVUN4TlFVRnRReXd5UWtGQmJrTTdRVUZEUVN4UFFVRlBReXh4UWtGQlVDeE5RVUZyUXl3d1FrRkJiRU03UVVGRFFTeFBRVUZQUXl4M1FrRkJVQ3hOUVVGeFF5dzJRa0ZCY2tNN08wRkJSVUVzU1VGQlRVTXNiMEpCUVc5Q0xFbEJRVWxLTEZkQlFVb3NRMEZEZUVKRExIVkNRVUYxUWl4RlFVRkZTU3hYUVVGWExFZEJRV0lzUlVGQmRrSXNRMEZFZDBJc1JVRkZlRUpHTEhsQ1FVRjVRaXhWUVVGNlFpeEZRVUZ4UXl4SFFVRnlReXhEUVVaM1FpeEZRVWQ0UWtRc2NVSkJTSGRDTEVOQlFURkNPenRCUVUxQkxHVkJRV1ZGTEdsQ1FVRm1JaXdpWm1sc1pTSTZJbTl1WlV4cGJtVkRiMjF0WVV4cGMzUnpMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUZSbGJYQnNZWFJsVkdGbklHWnliMjBnSnk0dUwxUmxiWEJzWVhSbFZHRm5KenRjYm1sdGNHOXlkQ0JwYm14cGJtVkJjbkpoZVZSeVlXNXpabTl5YldWeUlHWnliMjBnSnk0dUwybHViR2x1WlVGeWNtRjVWSEpoYm5ObWIzSnRaWEluTzF4dWFXMXdiM0owSUhSeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpQm1jbTl0SUNjdUxpOTBjbWx0VW1WemRXeDBWSEpoYm5ObWIzSnRaWEluTzF4dWFXMXdiM0owSUhKbGNHeGhZMlZTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUJtY205dElDY3VMaTl5WlhCc1lXTmxVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSW5PMXh1WEc1amIyNXpkQ0J2Ym1WTWFXNWxRMjl0YldGTWFYTjBjeUE5SUc1bGR5QlVaVzF3YkdGMFpWUmhaeWhjYmlBZ2FXNXNhVzVsUVhKeVlYbFVjbUZ1YzJadmNtMWxjaWg3SUhObGNHRnlZWFJ2Y2pvZ0p5d25JSDBwTEZ4dUlDQnlaWEJzWVdObFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJb0x5Zy9PbHhjY3lzcEwyY3NJQ2NnSnlrc1hHNGdJSFJ5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2l4Y2JpazdYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRzl1WlV4cGJtVkRiMjF0WVV4cGMzUnpPMXh1SWwxOSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL29uZUxpbmVDb21tYUxpc3RzQW5kJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXZibVZNYVc1bFEyOXRiV0ZNYVhOMGMwRnVaQzlwYm1SbGVDNXFjeUpkTENKdVlXMWxjeUk2V3lKa1pXWmhkV3gwSWwwc0ltMWhjSEJwYm1keklqb2ljVUpCUVc5Q0xIZENPM0ZDUVVGaVFTeFBJaXdpWm1sc1pTSTZJbWx1WkdWNExtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpWlhod2IzSjBJR1JsWm1GMWJIUWdabkp2YlNBbkxpOXZibVZNYVc1bFEyOXRiV0ZNYVhOMGMwRnVaQ2M3WEc0aVhYMD0iLCJpbXBvcnQgVGVtcGxhdGVUYWcgZnJvbSAnLi4vVGVtcGxhdGVUYWcnO1xuaW1wb3J0IGlubGluZUFycmF5VHJhbnNmb3JtZXIgZnJvbSAnLi4vaW5saW5lQXJyYXlUcmFuc2Zvcm1lcic7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5pbXBvcnQgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3JlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcic7XG5cbnZhciBvbmVMaW5lQ29tbWFMaXN0c0FuZCA9IG5ldyBUZW1wbGF0ZVRhZyhpbmxpbmVBcnJheVRyYW5zZm9ybWVyKHsgc2VwYXJhdG9yOiAnLCcsIGNvbmp1bmN0aW9uOiAnYW5kJyB9KSwgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyKC8oPzpcXHMrKS9nLCAnICcpLCB0cmltUmVzdWx0VHJhbnNmb3JtZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBvbmVMaW5lQ29tbWFMaXN0c0FuZDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXZibVZNYVc1bFEyOXRiV0ZNYVhOMGMwRnVaQzl2Ym1WTWFXNWxRMjl0YldGTWFYTjBjMEZ1WkM1cWN5SmRMQ0p1WVcxbGN5STZXeUpVWlcxd2JHRjBaVlJoWnlJc0ltbHViR2x1WlVGeWNtRjVWSEpoYm5ObWIzSnRaWElpTENKMGNtbHRVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSWlMQ0p5WlhCc1lXTmxVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSWlMQ0p2Ym1WTWFXNWxRMjl0YldGTWFYTjBjMEZ1WkNJc0luTmxjR0Z5WVhSdmNpSXNJbU52Ym1wMWJtTjBhVzl1SWwwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4UFFVRlBRU3hYUVVGUUxFMUJRWGRDTEdkQ1FVRjRRanRCUVVOQkxFOUJRVTlETEhOQ1FVRlFMRTFCUVcxRExESkNRVUZ1UXp0QlFVTkJMRTlCUVU5RExIRkNRVUZRTEUxQlFXdERMREJDUVVGc1F6dEJRVU5CTEU5QlFVOURMSGRDUVVGUUxFMUJRWEZETERaQ1FVRnlRenM3UVVGRlFTeEpRVUZOUXl4MVFrRkJkVUlzU1VGQlNVb3NWMEZCU2l4RFFVTXpRa01zZFVKQlFYVkNMRVZCUVVWSkxGZEJRVmNzUjBGQllpeEZRVUZyUWtNc1lVRkJZU3hMUVVFdlFpeEZRVUYyUWl4RFFVUXlRaXhGUVVVelFrZ3NlVUpCUVhsQ0xGVkJRWHBDTEVWQlFYRkRMRWRCUVhKRExFTkJSakpDTEVWQlJ6TkNSQ3h4UWtGSU1rSXNRMEZCTjBJN08wRkJUVUVzWlVGQlpVVXNiMEpCUVdZaUxDSm1hV3hsSWpvaWIyNWxUR2x1WlVOdmJXMWhUR2x6ZEhOQmJtUXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKcGJYQnZjblFnVkdWdGNHeGhkR1ZVWVdjZ1puSnZiU0FuTGk0dlZHVnRjR3hoZEdWVVlXY25PMXh1YVcxd2IzSjBJR2x1YkdsdVpVRnljbUY1VkhKaGJuTm1iM0p0WlhJZ1puSnZiU0FuTGk0dmFXNXNhVzVsUVhKeVlYbFVjbUZ1YzJadmNtMWxjaWM3WEc1cGJYQnZjblFnZEhKcGJWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUlHWnliMjBnSnk0dUwzUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaWM3WEc1cGJYQnZjblFnY21Wd2JHRmpaVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlJR1p5YjIwZ0p5NHVMM0psY0d4aFkyVlNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpYzdYRzVjYm1OdmJuTjBJRzl1WlV4cGJtVkRiMjF0WVV4cGMzUnpRVzVrSUQwZ2JtVjNJRlJsYlhCc1lYUmxWR0ZuS0Z4dUlDQnBibXhwYm1WQmNuSmhlVlJ5WVc1elptOXliV1Z5S0hzZ2MyVndZWEpoZEc5eU9pQW5MQ2NzSUdOdmJtcDFibU4wYVc5dU9pQW5ZVzVrSnlCOUtTeGNiaUFnY21Wd2JHRmpaVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlLQzhvUHpwY1hITXJLUzluTENBbklDY3BMRnh1SUNCMGNtbHRVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSXNYRzRwTzF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCdmJtVk1hVzVsUTI5dGJXRk1hWE4wYzBGdVpEdGNiaUpkZlE9PSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL29uZUxpbmVDb21tYUxpc3RzT3InO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5dmJtVk1hVzVsUTI5dGJXRk1hWE4wYzA5eUwybHVaR1Y0TG1weklsMHNJbTVoYldWeklqcGJJbVJsWm1GMWJIUWlYU3dpYldGd2NHbHVaM01pT2lKeFFrRkJiMElzZFVJN2NVSkJRV0pCTEU4aUxDSm1hV3hsSWpvaWFXNWtaWGd1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmxlSEJ2Y25RZ1pHVm1ZWFZzZENCbWNtOXRJQ2N1TDI5dVpVeHBibVZEYjIxdFlVeHBjM1J6VDNJbk8xeHVJbDE5IiwiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyIGZyb20gJy4uL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuaW1wb3J0IHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXInO1xuXG52YXIgb25lTGluZUNvbW1hTGlzdHNPciA9IG5ldyBUZW1wbGF0ZVRhZyhpbmxpbmVBcnJheVRyYW5zZm9ybWVyKHsgc2VwYXJhdG9yOiAnLCcsIGNvbmp1bmN0aW9uOiAnb3InIH0pLCByZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIoLyg/OlxccyspL2csICcgJyksIHRyaW1SZXN1bHRUcmFuc2Zvcm1lcik7XG5cbmV4cG9ydCBkZWZhdWx0IG9uZUxpbmVDb21tYUxpc3RzT3I7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl2Ym1WTWFXNWxRMjl0YldGTWFYTjBjMDl5TDI5dVpVeHBibVZEYjIxdFlVeHBjM1J6VDNJdWFuTWlYU3dpYm1GdFpYTWlPbHNpVkdWdGNHeGhkR1ZVWVdjaUxDSnBibXhwYm1WQmNuSmhlVlJ5WVc1elptOXliV1Z5SWl3aWRISnBiVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlJaXdpY21Wd2JHRmpaVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlJaXdpYjI1bFRHbHVaVU52YlcxaFRHbHpkSE5QY2lJc0luTmxjR0Z5WVhSdmNpSXNJbU52Ym1wMWJtTjBhVzl1SWwwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4UFFVRlBRU3hYUVVGUUxFMUJRWGRDTEdkQ1FVRjRRanRCUVVOQkxFOUJRVTlETEhOQ1FVRlFMRTFCUVcxRExESkNRVUZ1UXp0QlFVTkJMRTlCUVU5RExIRkNRVUZRTEUxQlFXdERMREJDUVVGc1F6dEJRVU5CTEU5QlFVOURMSGRDUVVGUUxFMUJRWEZETERaQ1FVRnlRenM3UVVGRlFTeEpRVUZOUXl4elFrRkJjMElzU1VGQlNVb3NWMEZCU2l4RFFVTXhRa01zZFVKQlFYVkNMRVZCUVVWSkxGZEJRVmNzUjBGQllpeEZRVUZyUWtNc1lVRkJZU3hKUVVFdlFpeEZRVUYyUWl4RFFVUXdRaXhGUVVVeFFrZ3NlVUpCUVhsQ0xGVkJRWHBDTEVWQlFYRkRMRWRCUVhKRExFTkJSakJDTEVWQlJ6RkNSQ3h4UWtGSU1FSXNRMEZCTlVJN08wRkJUVUVzWlVGQlpVVXNiVUpCUVdZaUxDSm1hV3hsSWpvaWIyNWxUR2x1WlVOdmJXMWhUR2x6ZEhOUGNpNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0JVWlcxd2JHRjBaVlJoWnlCbWNtOXRJQ2N1TGk5VVpXMXdiR0YwWlZSaFp5YzdYRzVwYlhCdmNuUWdhVzVzYVc1bFFYSnlZWGxVY21GdWMyWnZjbTFsY2lCbWNtOXRJQ2N1TGk5cGJteHBibVZCY25KaGVWUnlZVzV6Wm05eWJXVnlKenRjYm1sdGNHOXlkQ0IwY21sdFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJZ1puSnZiU0FuTGk0dmRISnBiVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlKenRjYm1sdGNHOXlkQ0J5WlhCc1lXTmxVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSWdabkp2YlNBbkxpNHZjbVZ3YkdGalpWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUp6dGNibHh1WTI5dWMzUWdiMjVsVEdsdVpVTnZiVzFoVEdsemRITlBjaUE5SUc1bGR5QlVaVzF3YkdGMFpWUmhaeWhjYmlBZ2FXNXNhVzVsUVhKeVlYbFVjbUZ1YzJadmNtMWxjaWg3SUhObGNHRnlZWFJ2Y2pvZ0p5d25MQ0JqYjI1cWRXNWpkR2x2YmpvZ0oyOXlKeUI5S1N4Y2JpQWdjbVZ3YkdGalpWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUtDOG9QenBjWEhNcktTOW5MQ0FuSUNjcExGeHVJQ0IwY21sdFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJc1hHNHBPMXh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0J2Ym1WTWFXNWxRMjl0YldGTWFYTjBjMDl5TzF4dUlsMTkiLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi9vbmVMaW5lSW5saW5lTGlzdHMnO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5dmJtVk1hVzVsU1c1c2FXNWxUR2x6ZEhNdmFXNWtaWGd1YW5NaVhTd2libUZ0WlhNaU9sc2laR1ZtWVhWc2RDSmRMQ0p0WVhCd2FXNW5jeUk2SW5GQ1FVRnZRaXh6UWp0eFFrRkJZa0VzVHlJc0ltWnBiR1VpT2lKcGJtUmxlQzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltVjRjRzl5ZENCa1pXWmhkV3gwSUdaeWIyMGdKeTR2YjI1bFRHbHVaVWx1YkdsdVpVeHBjM1J6Snp0Y2JpSmRmUT09IiwiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyIGZyb20gJy4uL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuaW1wb3J0IHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi9yZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXInO1xuXG52YXIgb25lTGluZUlubGluZUxpc3RzID0gbmV3IFRlbXBsYXRlVGFnKGlubGluZUFycmF5VHJhbnNmb3JtZXIsIHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcigvKD86XFxzKykvZywgJyAnKSwgdHJpbVJlc3VsdFRyYW5zZm9ybWVyKTtcblxuZXhwb3J0IGRlZmF1bHQgb25lTGluZUlubGluZUxpc3RzO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5dmJtVk1hVzVsU1c1c2FXNWxUR2x6ZEhNdmIyNWxUR2x1WlVsdWJHbHVaVXhwYzNSekxtcHpJbDBzSW01aGJXVnpJanBiSWxSbGJYQnNZWFJsVkdGbklpd2lhVzVzYVc1bFFYSnlZWGxVY21GdWMyWnZjbTFsY2lJc0luUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUlzSW5KbGNHeGhZMlZTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUlzSW05dVpVeHBibVZKYm14cGJtVk1hWE4wY3lKZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1QwRkJUMEVzVjBGQlVDeE5RVUYzUWl4blFrRkJlRUk3UVVGRFFTeFBRVUZQUXl4elFrRkJVQ3hOUVVGdFF5d3lRa0ZCYmtNN1FVRkRRU3hQUVVGUFF5eHhRa0ZCVUN4TlFVRnJReXd3UWtGQmJFTTdRVUZEUVN4UFFVRlBReXgzUWtGQlVDeE5RVUZ4UXl3MlFrRkJja003TzBGQlJVRXNTVUZCVFVNc2NVSkJRWEZDTEVsQlFVbEtMRmRCUVVvc1EwRkRla0pETEhOQ1FVUjVRaXhGUVVWNlFrVXNlVUpCUVhsQ0xGVkJRWHBDTEVWQlFYRkRMRWRCUVhKRExFTkJSbmxDTEVWQlIzcENSQ3h4UWtGSWVVSXNRMEZCTTBJN08wRkJUVUVzWlVGQlpVVXNhMEpCUVdZaUxDSm1hV3hsSWpvaWIyNWxUR2x1WlVsdWJHbHVaVXhwYzNSekxtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJRlJsYlhCc1lYUmxWR0ZuSUdaeWIyMGdKeTR1TDFSbGJYQnNZWFJsVkdGbkp6dGNibWx0Y0c5eWRDQnBibXhwYm1WQmNuSmhlVlJ5WVc1elptOXliV1Z5SUdaeWIyMGdKeTR1TDJsdWJHbHVaVUZ5Y21GNVZISmhibk5tYjNKdFpYSW5PMXh1YVcxd2IzSjBJSFJ5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lCbWNtOXRJQ2N1TGk5MGNtbHRVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSW5PMXh1YVcxd2IzSjBJSEpsY0d4aFkyVlNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpQm1jbTl0SUNjdUxpOXlaWEJzWVdObFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJbk8xeHVYRzVqYjI1emRDQnZibVZNYVc1bFNXNXNhVzVsVEdsemRITWdQU0J1WlhjZ1ZHVnRjR3hoZEdWVVlXY29YRzRnSUdsdWJHbHVaVUZ5Y21GNVZISmhibk5tYjNKdFpYSXNYRzRnSUhKbGNHeGhZMlZTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaWd2S0Q4NlhGeHpLeWt2Wnl3Z0p5QW5LU3hjYmlBZ2RISnBiVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlMRnh1S1R0Y2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ2IyNWxUR2x1WlVsdWJHbHVaVXhwYzNSek8xeHVJbDE5IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vb25lTGluZVRyaW0nO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5dmJtVk1hVzVsVkhKcGJTOXBibVJsZUM1cWN5SmRMQ0p1WVcxbGN5STZXeUprWldaaGRXeDBJbDBzSW0xaGNIQnBibWR6SWpvaWNVSkJRVzlDTEdVN2NVSkJRV0pCTEU4aUxDSm1hV3hsSWpvaWFXNWtaWGd1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmxlSEJ2Y25RZ1pHVm1ZWFZzZENCbWNtOXRJQ2N1TDI5dVpVeHBibVZVY21sdEp6dGNiaUpkZlE9PSIsImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3RyaW1SZXN1bHRUcmFuc2Zvcm1lcic7XG5pbXBvcnQgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyIGZyb20gJy4uL3JlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcic7XG5cbnZhciBvbmVMaW5lVHJpbSA9IG5ldyBUZW1wbGF0ZVRhZyhyZXBsYWNlUmVzdWx0VHJhbnNmb3JtZXIoLyg/OlxcblxccyopL2csICcnKSwgdHJpbVJlc3VsdFRyYW5zZm9ybWVyKTtcblxuZXhwb3J0IGRlZmF1bHQgb25lTGluZVRyaW07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl2Ym1WTWFXNWxWSEpwYlM5dmJtVk1hVzVsVkhKcGJTNXFjeUpkTENKdVlXMWxjeUk2V3lKVVpXMXdiR0YwWlZSaFp5SXNJblJ5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lJc0luSmxjR3hoWTJWU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lJc0ltOXVaVXhwYm1WVWNtbHRJbDBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hQUVVGUFFTeFhRVUZRTEUxQlFYZENMR2RDUVVGNFFqdEJRVU5CTEU5QlFVOURMSEZDUVVGUUxFMUJRV3RETERCQ1FVRnNRenRCUVVOQkxFOUJRVTlETEhkQ1FVRlFMRTFCUVhGRExEWkNRVUZ5UXpzN1FVRkZRU3hKUVVGTlF5eGpRVUZqTEVsQlFVbElMRmRCUVVvc1EwRkRiRUpGTEhsQ1FVRjVRaXhaUVVGNlFpeEZRVUYxUXl4RlFVRjJReXhEUVVSclFpeEZRVVZzUWtRc2NVSkJSbXRDTEVOQlFYQkNPenRCUVV0QkxHVkJRV1ZGTEZkQlFXWWlMQ0ptYVd4bElqb2liMjVsVEdsdVpWUnlhVzB1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SnBiWEJ2Y25RZ1ZHVnRjR3hoZEdWVVlXY2dabkp2YlNBbkxpNHZWR1Z0Y0d4aGRHVlVZV2NuTzF4dWFXMXdiM0owSUhSeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpQm1jbTl0SUNjdUxpOTBjbWx0VW1WemRXeDBWSEpoYm5ObWIzSnRaWEluTzF4dWFXMXdiM0owSUhKbGNHeGhZMlZTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUJtY205dElDY3VMaTl5WlhCc1lXTmxVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSW5PMXh1WEc1amIyNXpkQ0J2Ym1WTWFXNWxWSEpwYlNBOUlHNWxkeUJVWlcxd2JHRjBaVlJoWnloY2JpQWdjbVZ3YkdGalpWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUtDOG9QenBjWEc1Y1hITXFLUzluTENBbkp5a3NYRzRnSUhSeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpeGNiaWs3WEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUc5dVpVeHBibVZVY21sdE8xeHVJbDE5IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vcmVtb3ZlTm9uUHJpbnRpbmdWYWx1ZXNUcmFuc2Zvcm1lcic7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl5WlcxdmRtVk9iMjVRY21sdWRHbHVaMVpoYkhWbGMxUnlZVzV6Wm05eWJXVnlMMmx1WkdWNExtcHpJbDBzSW01aGJXVnpJanBiSW1SbFptRjFiSFFpWFN3aWJXRndjR2x1WjNNaU9pSnhRa0ZCYjBJc2MwTTdjVUpCUVdKQkxFOGlMQ0ptYVd4bElqb2lhVzVrWlhndWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpsZUhCdmNuUWdaR1ZtWVhWc2RDQm1jbTl0SUNjdUwzSmxiVzkyWlU1dmJsQnlhVzUwYVc1blZtRnNkV1Z6VkhKaGJuTm1iM0p0WlhJbk8xeHVJbDE5IiwidmFyIGlzVmFsaWRWYWx1ZSA9IGZ1bmN0aW9uIGlzVmFsaWRWYWx1ZSh4KSB7XG4gIHJldHVybiB4ICE9IG51bGwgJiYgIU51bWJlci5pc05hTih4KSAmJiB0eXBlb2YgeCAhPT0gJ2Jvb2xlYW4nO1xufTtcblxudmFyIHJlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXIgPSBmdW5jdGlvbiByZW1vdmVOb25QcmludGluZ1ZhbHVlc1RyYW5zZm9ybWVyKCkge1xuICByZXR1cm4ge1xuICAgIG9uU3Vic3RpdHV0aW9uOiBmdW5jdGlvbiBvblN1YnN0aXR1dGlvbihzdWJzdGl0dXRpb24pIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHN1YnN0aXR1dGlvbikpIHtcbiAgICAgICAgcmV0dXJuIHN1YnN0aXR1dGlvbi5maWx0ZXIoaXNWYWxpZFZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc1ZhbGlkVmFsdWUoc3Vic3RpdHV0aW9uKSkge1xuICAgICAgICByZXR1cm4gc3Vic3RpdHV0aW9uO1xuICAgICAgfVxuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHJlbW92ZU5vblByaW50aW5nVmFsdWVzVHJhbnNmb3JtZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl5WlcxdmRtVk9iMjVRY21sdWRHbHVaMVpoYkhWbGMxUnlZVzV6Wm05eWJXVnlMM0psYlc5MlpVNXZibEJ5YVc1MGFXNW5WbUZzZFdWelZISmhibk5tYjNKdFpYSXVhbk1pWFN3aWJtRnRaWE1pT2xzaWFYTldZV3hwWkZaaGJIVmxJaXdpZUNJc0lrNTFiV0psY2lJc0ltbHpUbUZPSWl3aWNtVnRiM1psVG05dVVISnBiblJwYm1kV1lXeDFaWE5VY21GdWMyWnZjbTFsY2lJc0ltOXVVM1ZpYzNScGRIVjBhVzl1SWl3aWMzVmljM1JwZEhWMGFXOXVJaXdpUVhKeVlYa2lMQ0pwYzBGeWNtRjVJaXdpWm1sc2RHVnlJbDBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hKUVVGTlFTeGxRVUZsTEZOQlFXWkJMRmxCUVdVN1FVRkJRU3hUUVVOdVFrTXNTMEZCU3l4SlFVRk1MRWxCUVdFc1EwRkJRME1zVDBGQlQwTXNTMEZCVUN4RFFVRmhSaXhEUVVGaUxFTkJRV1FzU1VGQmFVTXNUMEZCVDBFc1EwRkJVQ3hMUVVGaExGTkJSRE5DTzBGQlFVRXNRMEZCY2tJN08wRkJSMEVzU1VGQlRVY3NjVU5CUVhGRExGTkJRWEpEUVN4clEwRkJjVU03UVVGQlFTeFRRVUZQTzBGQlEyaEVReXhyUWtGRVowUXNNRUpCUTJwRFF5eFpRVVJwUXl4RlFVTnVRanRCUVVNelFpeFZRVUZKUXl4TlFVRk5ReXhQUVVGT0xFTkJRV05HTEZsQlFXUXNRMEZCU2l4RlFVRnBRenRCUVVNdlFpeGxRVUZQUVN4aFFVRmhSeXhOUVVGaUxFTkJRVzlDVkN4WlFVRndRaXhEUVVGUU8wRkJRMFE3UVVGRFJDeFZRVUZKUVN4aFFVRmhUU3haUVVGaUxFTkJRVW9zUlVGQlowTTdRVUZET1VJc1pVRkJUMEVzV1VGQlVEdEJRVU5FTzBGQlEwUXNZVUZCVHl4RlFVRlFPMEZCUTBRN1FVRlVLME1zUjBGQlVEdEJRVUZCTEVOQlFUTkRPenRCUVZsQkxHVkJRV1ZHTEd0RFFVRm1JaXdpWm1sc1pTSTZJbkpsYlc5MlpVNXZibEJ5YVc1MGFXNW5WbUZzZFdWelZISmhibk5tYjNKdFpYSXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKamIyNXpkQ0JwYzFaaGJHbGtWbUZzZFdVZ1BTQjRJRDArWEc0Z0lIZ2dJVDBnYm5Wc2JDQW1KaUFoVG5WdFltVnlMbWx6VG1GT0tIZ3BJQ1ltSUhSNWNHVnZaaUI0SUNFOVBTQW5ZbTl2YkdWaGJpYzdYRzVjYm1OdmJuTjBJSEpsYlc5MlpVNXZibEJ5YVc1MGFXNW5WbUZzZFdWelZISmhibk5tYjNKdFpYSWdQU0FvS1NBOVBpQW9lMXh1SUNCdmJsTjFZbk4wYVhSMWRHbHZiaWh6ZFdKemRHbDBkWFJwYjI0cElIdGNiaUFnSUNCcFppQW9RWEp5WVhrdWFYTkJjbkpoZVNoemRXSnpkR2wwZFhScGIyNHBLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdjM1ZpYzNScGRIVjBhVzl1TG1acGJIUmxjaWhwYzFaaGJHbGtWbUZzZFdVcE8xeHVJQ0FnSUgxY2JpQWdJQ0JwWmlBb2FYTldZV3hwWkZaaGJIVmxLSE4xWW5OMGFYUjFkR2x2YmlrcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCemRXSnpkR2wwZFhScGIyNDdYRzRnSUNBZ2ZWeHVJQ0FnSUhKbGRIVnliaUFuSnp0Y2JpQWdmU3hjYm4wcE8xeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQnlaVzF2ZG1WT2IyNVFjbWx1ZEdsdVoxWmhiSFZsYzFSeVlXNXpabTl5YldWeU8xeHVJbDE5IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXlaWEJzWVdObFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJdmFXNWtaWGd1YW5NaVhTd2libUZ0WlhNaU9sc2laR1ZtWVhWc2RDSmRMQ0p0WVhCd2FXNW5jeUk2SW5GQ1FVRnZRaXcwUWp0eFFrRkJZa0VzVHlJc0ltWnBiR1VpT2lKcGJtUmxlQzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltVjRjRzl5ZENCa1pXWmhkV3gwSUdaeWIyMGdKeTR2Y21Wd2JHRmpaVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlKenRjYmlKZGZRPT0iLCIvKipcbiAqIFJlcGxhY2VzIHRhYnMsIG5ld2xpbmVzIGFuZCBzcGFjZXMgd2l0aCB0aGUgY2hvc2VuIHZhbHVlIHdoZW4gdGhleSBvY2N1ciBpbiBzZXF1ZW5jZXNcbiAqIEBwYXJhbSAgeyhTdHJpbmd8UmVnRXhwKX0gcmVwbGFjZVdoYXQgLSB0aGUgdmFsdWUgb3IgcGF0dGVybiB0aGF0IHNob3VsZCBiZSByZXBsYWNlZFxuICogQHBhcmFtICB7Kn0gICAgICAgICAgICAgICByZXBsYWNlV2l0aCAtIHRoZSByZXBsYWNlbWVudCB2YWx1ZVxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAtIGEgVGVtcGxhdGVUYWcgdHJhbnNmb3JtZXJcbiAqL1xudmFyIHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lciA9IGZ1bmN0aW9uIHJlcGxhY2VSZXN1bHRUcmFuc2Zvcm1lcihyZXBsYWNlV2hhdCwgcmVwbGFjZVdpdGgpIHtcbiAgcmV0dXJuIHtcbiAgICBvbkVuZFJlc3VsdDogZnVuY3Rpb24gb25FbmRSZXN1bHQoZW5kUmVzdWx0KSB7XG4gICAgICBpZiAocmVwbGFjZVdoYXQgPT0gbnVsbCB8fCByZXBsYWNlV2l0aCA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyIHJlcXVpcmVzIGF0IGxlYXN0IDIgYXJndW1lbnRzLicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVuZFJlc3VsdC5yZXBsYWNlKHJlcGxhY2VXaGF0LCByZXBsYWNlV2l0aCk7XG4gICAgfVxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgcmVwbGFjZVJlc3VsdFRyYW5zZm9ybWVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5eVpYQnNZV05sVW1WemRXeDBWSEpoYm5ObWIzSnRaWEl2Y21Wd2JHRmpaVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlMbXB6SWwwc0ltNWhiV1Z6SWpwYkluSmxjR3hoWTJWU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lJc0luSmxjR3hoWTJWWGFHRjBJaXdpY21Wd2JHRmpaVmRwZEdnaUxDSnZia1Z1WkZKbGMzVnNkQ0lzSW1WdVpGSmxjM1ZzZENJc0lrVnljbTl5SWl3aWNtVndiR0ZqWlNKZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFN096czdPenRCUVUxQkxFbEJRVTFCTERKQ1FVRXlRaXhUUVVFelFrRXNkMEpCUVRKQ0xFTkJRVU5ETEZkQlFVUXNSVUZCWTBNc1YwRkJaRHRCUVVGQkxGTkJRU3RDTzBGQlF6bEVReXhsUVVRNFJDeDFRa0ZEYkVSRExGTkJSR3RFTEVWQlEzWkRPMEZCUTNKQ0xGVkJRVWxJTEdWQlFXVXNTVUZCWml4SlFVRjFRa01zWlVGQlpTeEpRVUV4UXl4RlFVRm5SRHRCUVVNNVF5eGpRVUZOTEVsQlFVbEhMRXRCUVVvc1EwRkRTaXg1UkVGRVNTeERRVUZPTzBGQlIwUTdRVUZEUkN4aFFVRlBSQ3hWUVVGVlJTeFBRVUZXTEVOQlFXdENUQ3hYUVVGc1FpeEZRVUVyUWtNc1YwRkJMMElzUTBGQlVEdEJRVU5FTzBGQlVqWkVMRWRCUVM5Q08wRkJRVUVzUTBGQmFrTTdPMEZCVjBFc1pVRkJaVVlzZDBKQlFXWWlMQ0ptYVd4bElqb2ljbVZ3YkdGalpWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUxtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlvcVhHNGdLaUJTWlhCc1lXTmxjeUIwWVdKekxDQnVaWGRzYVc1bGN5QmhibVFnYzNCaFkyVnpJSGRwZEdnZ2RHaGxJR05vYjNObGJpQjJZV3gxWlNCM2FHVnVJSFJvWlhrZ2IyTmpkWElnYVc0Z2MyVnhkV1Z1WTJWelhHNGdLaUJBY0dGeVlXMGdJSHNvVTNSeWFXNW5mRkpsWjBWNGNDbDlJSEpsY0d4aFkyVlhhR0YwSUMwZ2RHaGxJSFpoYkhWbElHOXlJSEJoZEhSbGNtNGdkR2hoZENCemFHOTFiR1FnWW1VZ2NtVndiR0ZqWldSY2JpQXFJRUJ3WVhKaGJTQWdleXA5SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVZ3YkdGalpWZHBkR2dnTFNCMGFHVWdjbVZ3YkdGalpXMWxiblFnZG1Gc2RXVmNiaUFxSUVCeVpYUjFjbTRnZTA5aWFtVmpkSDBnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0xTQmhJRlJsYlhCc1lYUmxWR0ZuSUhSeVlXNXpabTl5YldWeVhHNGdLaTljYm1OdmJuTjBJSEpsY0d4aFkyVlNaWE4xYkhSVWNtRnVjMlp2Y20xbGNpQTlJQ2h5WlhCc1lXTmxWMmhoZEN3Z2NtVndiR0ZqWlZkcGRHZ3BJRDArSUNoN1hHNGdJRzl1Ulc1a1VtVnpkV3gwS0dWdVpGSmxjM1ZzZENrZ2UxeHVJQ0FnSUdsbUlDaHlaWEJzWVdObFYyaGhkQ0E5UFNCdWRXeHNJSHg4SUhKbGNHeGhZMlZYYVhSb0lEMDlJRzUxYkd3cElIdGNiaUFnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loY2JpQWdJQ0FnSUNBZ0ozSmxjR3hoWTJWU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lCeVpYRjFhWEpsY3lCaGRDQnNaV0Z6ZENBeUlHRnlaM1Z0Wlc1MGN5NG5MRnh1SUNBZ0lDQWdLVHRjYmlBZ0lDQjlYRzRnSUNBZ2NtVjBkWEp1SUdWdVpGSmxjM1ZzZEM1eVpYQnNZV05sS0hKbGNHeGhZMlZYYUdGMExDQnlaWEJzWVdObFYybDBhQ2s3WEc0Z0lIMHNYRzU5S1R0Y2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ2NtVndiR0ZqWlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5TzF4dUlsMTkiLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi9yZXBsYWNlU3RyaW5nVHJhbnNmb3JtZXInO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5eVpYQnNZV05sVTNSeWFXNW5WSEpoYm5ObWIzSnRaWEl2YVc1a1pYZ3Vhbk1pWFN3aWJtRnRaWE1pT2xzaVpHVm1ZWFZzZENKZExDSnRZWEJ3YVc1bmN5STZJbkZDUVVGdlFpdzBRanR4UWtGQllrRXNUeUlzSW1acGJHVWlPaUpwYm1SbGVDNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1WNGNHOXlkQ0JrWldaaGRXeDBJR1p5YjIwZ0p5NHZjbVZ3YkdGalpWTjBjbWx1WjFSeVlXNXpabTl5YldWeUp6dGNiaUpkZlE9PSIsInZhciByZXBsYWNlU3RyaW5nVHJhbnNmb3JtZXIgPSBmdW5jdGlvbiByZXBsYWNlU3RyaW5nVHJhbnNmb3JtZXIocmVwbGFjZVdoYXQsIHJlcGxhY2VXaXRoKSB7XG4gIHJldHVybiB7XG4gICAgb25TdHJpbmc6IGZ1bmN0aW9uIG9uU3RyaW5nKHN0cikge1xuICAgICAgaWYgKHJlcGxhY2VXaGF0ID09IG51bGwgfHwgcmVwbGFjZVdpdGggPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlcGxhY2VTdHJpbmdUcmFuc2Zvcm1lciByZXF1aXJlcyBhdCBsZWFzdCAyIGFyZ3VtZW50cy4nKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKHJlcGxhY2VXaGF0LCByZXBsYWNlV2l0aCk7XG4gICAgfVxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgcmVwbGFjZVN0cmluZ1RyYW5zZm9ybWVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5eVpYQnNZV05sVTNSeWFXNW5WSEpoYm5ObWIzSnRaWEl2Y21Wd2JHRmpaVk4wY21sdVoxUnlZVzV6Wm05eWJXVnlMbXB6SWwwc0ltNWhiV1Z6SWpwYkluSmxjR3hoWTJWVGRISnBibWRVY21GdWMyWnZjbTFsY2lJc0luSmxjR3hoWTJWWGFHRjBJaXdpY21Wd2JHRmpaVmRwZEdnaUxDSnZibE4wY21sdVp5SXNJbk4wY2lJc0lrVnljbTl5SWl3aWNtVndiR0ZqWlNKZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1NVRkJUVUVzTWtKQlFUSkNMRk5CUVROQ1FTeDNRa0ZCTWtJc1EwRkJRME1zVjBGQlJDeEZRVUZqUXl4WFFVRmtPMEZCUVVFc1UwRkJLMEk3UVVGRE9VUkRMRmxCUkRoRUxHOUNRVU55UkVNc1IwRkVjVVFzUlVGRGFFUTdRVUZEV2l4VlFVRkpTQ3hsUVVGbExFbEJRV1lzU1VGQmRVSkRMR1ZCUVdVc1NVRkJNVU1zUlVGQlowUTdRVUZET1VNc1kwRkJUU3hKUVVGSlJ5eExRVUZLTEVOQlEwb3NlVVJCUkVrc1EwRkJUanRCUVVkRU96dEJRVVZFTEdGQlFVOUVMRWxCUVVsRkxFOUJRVW9zUTBGQldVd3NWMEZCV2l4RlFVRjVRa01zVjBGQmVrSXNRMEZCVUR0QlFVTkVPMEZCVkRaRUxFZEJRUzlDTzBGQlFVRXNRMEZCYWtNN08wRkJXVUVzWlVGQlpVWXNkMEpCUVdZaUxDSm1hV3hsSWpvaWNtVndiR0ZqWlZOMGNtbHVaMVJ5WVc1elptOXliV1Z5TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lZMjl1YzNRZ2NtVndiR0ZqWlZOMGNtbHVaMVJ5WVc1elptOXliV1Z5SUQwZ0tISmxjR3hoWTJWWGFHRjBMQ0J5WlhCc1lXTmxWMmwwYUNrZ1BUNGdLSHRjYmlBZ2IyNVRkSEpwYm1jb2MzUnlLU0I3WEc0Z0lDQWdhV1lnS0hKbGNHeGhZMlZYYUdGMElEMDlJRzUxYkd3Z2ZId2djbVZ3YkdGalpWZHBkR2dnUFQwZ2JuVnNiQ2tnZTF4dUlDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLRnh1SUNBZ0lDQWdJQ0FuY21Wd2JHRmpaVk4wY21sdVoxUnlZVzV6Wm05eWJXVnlJSEpsY1hWcGNtVnpJR0YwSUd4bFlYTjBJRElnWVhKbmRXMWxiblJ6TGljc1hHNGdJQ0FnSUNBcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUhKbGRIVnliaUJ6ZEhJdWNtVndiR0ZqWlNoeVpYQnNZV05sVjJoaGRDd2djbVZ3YkdGalpWZHBkR2dwTzF4dUlDQjlMRnh1ZlNrN1hHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElISmxjR3hoWTJWVGRISnBibWRVY21GdWMyWnZjbTFsY2p0Y2JpSmRmUT09IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXlaWEJzWVdObFUzVmljM1JwZEhWMGFXOXVWSEpoYm5ObWIzSnRaWEl2YVc1a1pYZ3Vhbk1pWFN3aWJtRnRaWE1pT2xzaVpHVm1ZWFZzZENKZExDSnRZWEJ3YVc1bmN5STZJbkZDUVVGdlFpeHJRenR4UWtGQllrRXNUeUlzSW1acGJHVWlPaUpwYm1SbGVDNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1WNGNHOXlkQ0JrWldaaGRXeDBJR1p5YjIwZ0p5NHZjbVZ3YkdGalpWTjFZbk4wYVhSMWRHbHZibFJ5WVc1elptOXliV1Z5Snp0Y2JpSmRmUT09IiwidmFyIHJlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lciA9IGZ1bmN0aW9uIHJlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lcihyZXBsYWNlV2hhdCwgcmVwbGFjZVdpdGgpIHtcbiAgcmV0dXJuIHtcbiAgICBvblN1YnN0aXR1dGlvbjogZnVuY3Rpb24gb25TdWJzdGl0dXRpb24oc3Vic3RpdHV0aW9uLCByZXN1bHRTb0Zhcikge1xuICAgICAgaWYgKHJlcGxhY2VXaGF0ID09IG51bGwgfHwgcmVwbGFjZVdpdGggPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lciByZXF1aXJlcyBhdCBsZWFzdCAyIGFyZ3VtZW50cy4nKTtcbiAgICAgIH1cblxuICAgICAgLy8gRG8gbm90IHRvdWNoIGlmIG51bGwgb3IgdW5kZWZpbmVkXG4gICAgICBpZiAoc3Vic3RpdHV0aW9uID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHN1YnN0aXR1dGlvbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzdWJzdGl0dXRpb24udG9TdHJpbmcoKS5yZXBsYWNlKHJlcGxhY2VXaGF0LCByZXBsYWNlV2l0aCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5eVpYQnNZV05sVTNWaWMzUnBkSFYwYVc5dVZISmhibk5tYjNKdFpYSXZjbVZ3YkdGalpWTjFZbk4wYVhSMWRHbHZibFJ5WVc1elptOXliV1Z5TG1weklsMHNJbTVoYldWeklqcGJJbkpsY0d4aFkyVlRkV0p6ZEdsMGRYUnBiMjVVY21GdWMyWnZjbTFsY2lJc0luSmxjR3hoWTJWWGFHRjBJaXdpY21Wd2JHRmpaVmRwZEdnaUxDSnZibE4xWW5OMGFYUjFkR2x2YmlJc0luTjFZbk4wYVhSMWRHbHZiaUlzSW5KbGMzVnNkRk52Um1GeUlpd2lSWEp5YjNJaUxDSjBiMU4wY21sdVp5SXNJbkpsY0d4aFkyVWlYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRWxCUVUxQkxHbERRVUZwUXl4VFFVRnFRMEVzT0VKQlFXbERMRU5CUVVORExGZEJRVVFzUlVGQlkwTXNWMEZCWkR0QlFVRkJMRk5CUVN0Q08wRkJRM0JGUXl4clFrRkViMFVzTUVKQlEzSkVReXhaUVVSeFJDeEZRVU4yUTBNc1YwRkVkVU1zUlVGRE1VSTdRVUZEZUVNc1ZVRkJTVW9zWlVGQlpTeEpRVUZtTEVsQlFYVkNReXhsUVVGbExFbEJRVEZETEVWQlFXZEVPMEZCUXpsRExHTkJRVTBzU1VGQlNVa3NTMEZCU2l4RFFVTktMQ3RFUVVSSkxFTkJRVTQ3UVVGSFJEczdRVUZGUkR0QlFVTkJMRlZCUVVsR0xHZENRVUZuUWl4SlFVRndRaXhGUVVFd1FqdEJRVU40UWl4bFFVRlBRU3haUVVGUU8wRkJRMFFzVDBGR1JDeE5RVVZQTzBGQlEwd3NaVUZCVDBFc1lVRkJZVWNzVVVGQllpeEhRVUYzUWtNc1QwRkJlRUlzUTBGQlowTlFMRmRCUVdoRExFVkJRVFpEUXl4WFFVRTNReXhEUVVGUU8wRkJRMFE3UVVGRFJqdEJRV1J0UlN4SFFVRXZRanRCUVVGQkxFTkJRWFpET3p0QlFXbENRU3hsUVVGbFJpdzRRa0ZCWmlJc0ltWnBiR1VpT2lKeVpYQnNZV05sVTNWaWMzUnBkSFYwYVc5dVZISmhibk5tYjNKdFpYSXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKamIyNXpkQ0J5WlhCc1lXTmxVM1ZpYzNScGRIVjBhVzl1VkhKaGJuTm1iM0p0WlhJZ1BTQW9jbVZ3YkdGalpWZG9ZWFFzSUhKbGNHeGhZMlZYYVhSb0tTQTlQaUFvZTF4dUlDQnZibE4xWW5OMGFYUjFkR2x2YmloemRXSnpkR2wwZFhScGIyNHNJSEpsYzNWc2RGTnZSbUZ5S1NCN1hHNGdJQ0FnYVdZZ0tISmxjR3hoWTJWWGFHRjBJRDA5SUc1MWJHd2dmSHdnY21Wd2JHRmpaVmRwZEdnZ1BUMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0Z4dUlDQWdJQ0FnSUNBbmNtVndiR0ZqWlZOMVluTjBhWFIxZEdsdmJsUnlZVzV6Wm05eWJXVnlJSEpsY1hWcGNtVnpJR0YwSUd4bFlYTjBJRElnWVhKbmRXMWxiblJ6TGljc1hHNGdJQ0FnSUNBcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUM4dklFUnZJRzV2ZENCMGIzVmphQ0JwWmlCdWRXeHNJRzl5SUhWdVpHVm1hVzVsWkZ4dUlDQWdJR2xtSUNoemRXSnpkR2wwZFhScGIyNGdQVDBnYm5Wc2JDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlITjFZbk4wYVhSMWRHbHZianRjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhOMVluTjBhWFIxZEdsdmJpNTBiMU4wY21sdVp5Z3BMbkpsY0d4aFkyVW9jbVZ3YkdGalpWZG9ZWFFzSUhKbGNHeGhZMlZYYVhSb0tUdGNiaUFnSUNCOVhHNGdJSDBzWEc1OUtUdGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdjbVZ3YkdGalpWTjFZbk4wYVhSMWRHbHZibFJ5WVc1elptOXliV1Z5TzF4dUlsMTkiLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi9zYWZlSHRtbCc7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl6WVdabFNIUnRiQzlwYm1SbGVDNXFjeUpkTENKdVlXMWxjeUk2V3lKa1pXWmhkV3gwSWwwc0ltMWhjSEJwYm1keklqb2ljVUpCUVc5Q0xGazdjVUpCUVdKQkxFOGlMQ0ptYVd4bElqb2lhVzVrWlhndWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpsZUhCdmNuUWdaR1ZtWVhWc2RDQm1jbTl0SUNjdUwzTmhabVZJZEcxc0p6dGNiaUpkZlE9PSIsImltcG9ydCBUZW1wbGF0ZVRhZyBmcm9tICcuLi9UZW1wbGF0ZVRhZyc7XG5pbXBvcnQgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciBmcm9tICcuLi9zdHJpcEluZGVudFRyYW5zZm9ybWVyJztcbmltcG9ydCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyIGZyb20gJy4uL2lubGluZUFycmF5VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuaW1wb3J0IHNwbGl0U3RyaW5nVHJhbnNmb3JtZXIgZnJvbSAnLi4vc3BsaXRTdHJpbmdUcmFuc2Zvcm1lcic7XG5pbXBvcnQgcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyIGZyb20gJy4uL3JlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lcic7XG5cbnZhciBzYWZlSHRtbCA9IG5ldyBUZW1wbGF0ZVRhZyhzcGxpdFN0cmluZ1RyYW5zZm9ybWVyKCdcXG4nKSwgaW5saW5lQXJyYXlUcmFuc2Zvcm1lciwgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciwgdHJpbVJlc3VsdFRyYW5zZm9ybWVyLCByZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIoLyYvZywgJyZhbXA7JyksIHJlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lcigvPC9nLCAnJmx0OycpLCByZXBsYWNlU3Vic3RpdHV0aW9uVHJhbnNmb3JtZXIoLz4vZywgJyZndDsnKSwgcmVwbGFjZVN1YnN0aXR1dGlvblRyYW5zZm9ybWVyKC9cIi9nLCAnJnF1b3Q7JyksIHJlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lcigvJy9nLCAnJiN4Mjc7JyksIHJlcGxhY2VTdWJzdGl0dXRpb25UcmFuc2Zvcm1lcigvYC9nLCAnJiN4NjA7JykpO1xuXG5leHBvcnQgZGVmYXVsdCBzYWZlSHRtbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXpZV1psU0hSdGJDOXpZV1psU0hSdGJDNXFjeUpkTENKdVlXMWxjeUk2V3lKVVpXMXdiR0YwWlZSaFp5SXNJbk4wY21sd1NXNWtaVzUwVkhKaGJuTm1iM0p0WlhJaUxDSnBibXhwYm1WQmNuSmhlVlJ5WVc1elptOXliV1Z5SWl3aWRISnBiVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlJaXdpYzNCc2FYUlRkSEpwYm1kVWNtRnVjMlp2Y20xbGNpSXNJbkpsY0d4aFkyVlRkV0p6ZEdsMGRYUnBiMjVVY21GdWMyWnZjbTFsY2lJc0luTmhabVZJZEcxc0lsMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeFBRVUZQUVN4WFFVRlFMRTFCUVhkQ0xHZENRVUY0UWp0QlFVTkJMRTlCUVU5RExITkNRVUZRTEUxQlFXMURMREpDUVVGdVF6dEJRVU5CTEU5QlFVOURMSE5DUVVGUUxFMUJRVzFETERKQ1FVRnVRenRCUVVOQkxFOUJRVTlETEhGQ1FVRlFMRTFCUVd0RExEQkNRVUZzUXp0QlFVTkJMRTlCUVU5RExITkNRVUZRTEUxQlFXMURMREpDUVVGdVF6dEJRVU5CTEU5QlFVOURMRGhDUVVGUUxFMUJRVEpETEcxRFFVRXpRenM3UVVGRlFTeEpRVUZOUXl4WFFVRlhMRWxCUVVsT0xGZEJRVW9zUTBGRFpra3NkVUpCUVhWQ0xFbEJRWFpDTEVOQlJHVXNSVUZGWmtZc2MwSkJSbVVzUlVGSFprUXNjMEpCU0dVc1JVRkpaa1VzY1VKQlNtVXNSVUZMWmtVc0swSkJRU3RDTEVsQlFTOUNMRVZCUVhGRExFOUJRWEpETEVOQlRHVXNSVUZOWmtFc0swSkJRU3RDTEVsQlFTOUNMRVZCUVhGRExFMUJRWEpETEVOQlRtVXNSVUZQWmtFc0swSkJRU3RDTEVsQlFTOUNMRVZCUVhGRExFMUJRWEpETEVOQlVHVXNSVUZSWmtFc0swSkJRU3RDTEVsQlFTOUNMRVZCUVhGRExGRkJRWEpETEVOQlVtVXNSVUZUWmtFc0swSkJRU3RDTEVsQlFTOUNMRVZCUVhGRExGRkJRWEpETEVOQlZHVXNSVUZWWmtFc0swSkJRU3RDTEVsQlFTOUNMRVZCUVhGRExGRkJRWEpETEVOQlZtVXNRMEZCYWtJN08wRkJZVUVzWlVGQlpVTXNVVUZCWmlJc0ltWnBiR1VpT2lKellXWmxTSFJ0YkM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbWx0Y0c5eWRDQlVaVzF3YkdGMFpWUmhaeUJtY205dElDY3VMaTlVWlcxd2JHRjBaVlJoWnljN1hHNXBiWEJ2Y25RZ2MzUnlhWEJKYm1SbGJuUlVjbUZ1YzJadmNtMWxjaUJtY205dElDY3VMaTl6ZEhKcGNFbHVaR1Z1ZEZSeVlXNXpabTl5YldWeUp6dGNibWx0Y0c5eWRDQnBibXhwYm1WQmNuSmhlVlJ5WVc1elptOXliV1Z5SUdaeWIyMGdKeTR1TDJsdWJHbHVaVUZ5Y21GNVZISmhibk5tYjNKdFpYSW5PMXh1YVcxd2IzSjBJSFJ5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lCbWNtOXRJQ2N1TGk5MGNtbHRVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSW5PMXh1YVcxd2IzSjBJSE53YkdsMFUzUnlhVzVuVkhKaGJuTm1iM0p0WlhJZ1puSnZiU0FuTGk0dmMzQnNhWFJUZEhKcGJtZFVjbUZ1YzJadmNtMWxjaWM3WEc1cGJYQnZjblFnY21Wd2JHRmpaVk4xWW5OMGFYUjFkR2x2YmxSeVlXNXpabTl5YldWeUlHWnliMjBnSnk0dUwzSmxjR3hoWTJWVGRXSnpkR2wwZFhScGIyNVVjbUZ1YzJadmNtMWxjaWM3WEc1Y2JtTnZibk4wSUhOaFptVklkRzFzSUQwZ2JtVjNJRlJsYlhCc1lYUmxWR0ZuS0Z4dUlDQnpjR3hwZEZOMGNtbHVaMVJ5WVc1elptOXliV1Z5S0NkY1hHNG5LU3hjYmlBZ2FXNXNhVzVsUVhKeVlYbFVjbUZ1YzJadmNtMWxjaXhjYmlBZ2MzUnlhWEJKYm1SbGJuUlVjbUZ1YzJadmNtMWxjaXhjYmlBZ2RISnBiVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlMRnh1SUNCeVpYQnNZV05sVTNWaWMzUnBkSFYwYVc5dVZISmhibk5tYjNKdFpYSW9MeVl2Wnl3Z0p5WmhiWEE3Snlrc1hHNGdJSEpsY0d4aFkyVlRkV0p6ZEdsMGRYUnBiMjVVY21GdWMyWnZjbTFsY2lndlBDOW5MQ0FuSm14ME95Y3BMRnh1SUNCeVpYQnNZV05sVTNWaWMzUnBkSFYwYVc5dVZISmhibk5tYjNKdFpYSW9MejR2Wnl3Z0p5Wm5kRHNuS1N4Y2JpQWdjbVZ3YkdGalpWTjFZbk4wYVhSMWRHbHZibFJ5WVc1elptOXliV1Z5S0M5Y0lpOW5MQ0FuSm5GMWIzUTdKeWtzWEc0Z0lISmxjR3hoWTJWVGRXSnpkR2wwZFhScGIyNVVjbUZ1YzJadmNtMWxjaWd2Snk5bkxDQW5KaU40TWpjN0p5a3NYRzRnSUhKbGNHeGhZMlZUZFdKemRHbDBkWFJwYjI1VWNtRnVjMlp2Y20xbGNpZ3ZZQzluTENBbkppTjROakE3Snlrc1hHNHBPMXh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0J6WVdabFNIUnRiRHRjYmlKZGZRPT0iLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi4vaHRtbCc7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl6YjNWeVkyVXZhVzVrWlhndWFuTWlYU3dpYm1GdFpYTWlPbHNpWkdWbVlYVnNkQ0pkTENKdFlYQndhVzVuY3lJNkluRkNRVUZ2UWl4VE8zRkNRVUZpUVN4UElpd2labWxzWlNJNkltbHVaR1Y0TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2laWGh3YjNKMElHUmxabUYxYkhRZ1puSnZiU0FuTGk0dmFIUnRiQ2M3WEc0aVhYMD0iLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi9zcGxpdFN0cmluZ1RyYW5zZm9ybWVyJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXpjR3hwZEZOMGNtbHVaMVJ5WVc1elptOXliV1Z5TDJsdVpHVjRMbXB6SWwwc0ltNWhiV1Z6SWpwYkltUmxabUYxYkhRaVhTd2liV0Z3Y0dsdVozTWlPaUp4UWtGQmIwSXNNRUk3Y1VKQlFXSkJMRThpTENKbWFXeGxJam9pYVc1a1pYZ3Vhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKbGVIQnZjblFnWkdWbVlYVnNkQ0JtY205dElDY3VMM053YkdsMFUzUnlhVzVuVkhKaGJuTm1iM0p0WlhJbk8xeHVJbDE5IiwidmFyIHNwbGl0U3RyaW5nVHJhbnNmb3JtZXIgPSBmdW5jdGlvbiBzcGxpdFN0cmluZ1RyYW5zZm9ybWVyKHNwbGl0QnkpIHtcbiAgcmV0dXJuIHtcbiAgICBvblN1YnN0aXR1dGlvbjogZnVuY3Rpb24gb25TdWJzdGl0dXRpb24oc3Vic3RpdHV0aW9uLCByZXN1bHRTb0Zhcikge1xuICAgICAgaWYgKHNwbGl0QnkgIT0gbnVsbCAmJiB0eXBlb2Ygc3BsaXRCeSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzdWJzdGl0dXRpb24gPT09ICdzdHJpbmcnICYmIHN1YnN0aXR1dGlvbi5pbmNsdWRlcyhzcGxpdEJ5KSkge1xuICAgICAgICAgIHN1YnN0aXR1dGlvbiA9IHN1YnN0aXR1dGlvbi5zcGxpdChzcGxpdEJ5KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbmVlZCB0byBzcGVjaWZ5IGEgc3RyaW5nIGNoYXJhY3RlciB0byBzcGxpdCBieS4nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdWJzdGl0dXRpb247XG4gICAgfVxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgc3BsaXRTdHJpbmdUcmFuc2Zvcm1lcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXpjR3hwZEZOMGNtbHVaMVJ5WVc1elptOXliV1Z5TDNOd2JHbDBVM1J5YVc1blZISmhibk5tYjNKdFpYSXVhbk1pWFN3aWJtRnRaWE1pT2xzaWMzQnNhWFJUZEhKcGJtZFVjbUZ1YzJadmNtMWxjaUlzSW05dVUzVmljM1JwZEhWMGFXOXVJaXdpYzNWaWMzUnBkSFYwYVc5dUlpd2ljbVZ6ZFd4MFUyOUdZWElpTENKemNHeHBkRUo1SWl3aWFXNWpiSFZrWlhNaUxDSnpjR3hwZENJc0lrVnljbTl5SWwwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4SlFVRk5RU3g1UWtGQmVVSXNVMEZCZWtKQkxITkNRVUY1UWp0QlFVRkJMRk5CUVZrN1FVRkRla05ETEd0Q1FVUjVReXd3UWtGRE1VSkRMRmxCUkRCQ0xFVkJRMXBETEZkQlJGa3NSVUZEUXp0QlFVTjRReXhWUVVGSlF5eFhRVUZYTEVsQlFWZ3NTVUZCYlVJc1QwRkJUMEVzVDBGQlVDeExRVUZ0UWl4UlFVRXhReXhGUVVGdlJEdEJRVU5zUkN4WlFVRkpMRTlCUVU5R0xGbEJRVkFzUzBGQmQwSXNVVUZCZUVJc1NVRkJiME5CTEdGQlFXRkhMRkZCUVdJc1EwRkJjMEpFTEU5QlFYUkNMRU5CUVhoRExFVkJRWGRGTzBGQlEzUkZSaXg1UWtGQlpVRXNZVUZCWVVrc1MwRkJZaXhEUVVGdFFrWXNUMEZCYmtJc1EwRkJaanRCUVVORU8wRkJRMFlzVDBGS1JDeE5RVWxQTzBGQlEwd3NZMEZCVFN4SlFVRkpSeXhMUVVGS0xFTkJRVlVzY1VSQlFWWXNRMEZCVGp0QlFVTkVPMEZCUTBRc1lVRkJUMHdzV1VGQlVEdEJRVU5FTzBGQlZuZERMRWRCUVZvN1FVRkJRU3hEUVVFdlFqczdRVUZoUVN4bFFVRmxSaXh6UWtGQlppSXNJbVpwYkdVaU9pSnpjR3hwZEZOMGNtbHVaMVJ5WVc1elptOXliV1Z5TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lZMjl1YzNRZ2MzQnNhWFJUZEhKcGJtZFVjbUZ1YzJadmNtMWxjaUE5SUhOd2JHbDBRbmtnUFQ0Z0tIdGNiaUFnYjI1VGRXSnpkR2wwZFhScGIyNG9jM1ZpYzNScGRIVjBhVzl1TENCeVpYTjFiSFJUYjBaaGNpa2dlMXh1SUNBZ0lHbG1JQ2h6Y0d4cGRFSjVJQ0U5SUc1MWJHd2dKaVlnZEhsd1pXOW1JSE53YkdsMFFua2dQVDA5SUNkemRISnBibWNuS1NCN1hHNGdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlITjFZbk4wYVhSMWRHbHZiaUE5UFQwZ0ozTjBjbWx1WnljZ0ppWWdjM1ZpYzNScGRIVjBhVzl1TG1sdVkyeDFaR1Z6S0hOd2JHbDBRbmtwS1NCN1hHNGdJQ0FnSUNBZ0lITjFZbk4wYVhSMWRHbHZiaUE5SUhOMVluTjBhWFIxZEdsdmJpNXpjR3hwZENoemNHeHBkRUo1S1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtDZFpiM1VnYm1WbFpDQjBieUJ6Y0dWamFXWjVJR0VnYzNSeWFXNW5JR05vWVhKaFkzUmxjaUIwYnlCemNHeHBkQ0JpZVM0bktUdGNiaUFnSUNCOVhHNGdJQ0FnY21WMGRYSnVJSE4xWW5OMGFYUjFkR2x2Ymp0Y2JpQWdmU3hjYm4wcE8xeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQnpjR3hwZEZOMGNtbHVaMVJ5WVc1elptOXliV1Z5TzF4dUlsMTkiLCJpbXBvcnQgX2RlZmF1bHQgZnJvbSAnLi9zdHJpcEluZGVudCc7XG5leHBvcnQgeyBfZGVmYXVsdCBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl6ZEhKcGNFbHVaR1Z1ZEM5cGJtUmxlQzVxY3lKZExDSnVZVzFsY3lJNld5SmtaV1poZFd4MElsMHNJbTFoY0hCcGJtZHpJam9pY1VKQlFXOUNMR1U3Y1VKQlFXSkJMRThpTENKbWFXeGxJam9pYVc1a1pYZ3Vhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKbGVIQnZjblFnWkdWbVlYVnNkQ0JtY205dElDY3VMM04wY21sd1NXNWtaVzUwSnp0Y2JpSmRmUT09IiwiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBzdHJpcEluZGVudFRyYW5zZm9ybWVyIGZyb20gJy4uL3N0cmlwSW5kZW50VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuXG52YXIgc3RyaXBJbmRlbnQgPSBuZXcgVGVtcGxhdGVUYWcoc3RyaXBJbmRlbnRUcmFuc2Zvcm1lciwgdHJpbVJlc3VsdFRyYW5zZm9ybWVyKTtcblxuZXhwb3J0IGRlZmF1bHQgc3RyaXBJbmRlbnQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl6ZEhKcGNFbHVaR1Z1ZEM5emRISnBjRWx1WkdWdWRDNXFjeUpkTENKdVlXMWxjeUk2V3lKVVpXMXdiR0YwWlZSaFp5SXNJbk4wY21sd1NXNWtaVzUwVkhKaGJuTm1iM0p0WlhJaUxDSjBjbWx0VW1WemRXeDBWSEpoYm5ObWIzSnRaWElpTENKemRISnBjRWx1WkdWdWRDSmRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNUMEZCVDBFc1YwRkJVQ3hOUVVGM1FpeG5Ra0ZCZUVJN1FVRkRRU3hQUVVGUFF5eHpRa0ZCVUN4TlFVRnRReXd5UWtGQmJrTTdRVUZEUVN4UFFVRlBReXh4UWtGQlVDeE5RVUZyUXl3d1FrRkJiRU03TzBGQlJVRXNTVUZCVFVNc1kwRkJZeXhKUVVGSlNDeFhRVUZLTEVOQlEyeENReXh6UWtGRWEwSXNSVUZGYkVKRExIRkNRVVpyUWl4RFFVRndRanM3UVVGTFFTeGxRVUZsUXl4WFFVRm1JaXdpWm1sc1pTSTZJbk4wY21sd1NXNWtaVzUwTG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lhVzF3YjNKMElGUmxiWEJzWVhSbFZHRm5JR1p5YjIwZ0p5NHVMMVJsYlhCc1lYUmxWR0ZuSnp0Y2JtbHRjRzl5ZENCemRISnBjRWx1WkdWdWRGUnlZVzV6Wm05eWJXVnlJR1p5YjIwZ0p5NHVMM04wY21sd1NXNWtaVzUwVkhKaGJuTm1iM0p0WlhJbk8xeHVhVzF3YjNKMElIUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUJtY205dElDY3VMaTkwY21sdFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJbk8xeHVYRzVqYjI1emRDQnpkSEpwY0VsdVpHVnVkQ0E5SUc1bGR5QlVaVzF3YkdGMFpWUmhaeWhjYmlBZ2MzUnlhWEJKYm1SbGJuUlVjbUZ1YzJadmNtMWxjaXhjYmlBZ2RISnBiVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlMRnh1S1R0Y2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ2MzUnlhWEJKYm1SbGJuUTdYRzRpWFgwPSIsImltcG9ydCBfZGVmYXVsdCBmcm9tICcuL3N0cmlwSW5kZW50VHJhbnNmb3JtZXInO1xuZXhwb3J0IHsgX2RlZmF1bHQgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5emRISnBjRWx1WkdWdWRGUnlZVzV6Wm05eWJXVnlMMmx1WkdWNExtcHpJbDBzSW01aGJXVnpJanBiSW1SbFptRjFiSFFpWFN3aWJXRndjR2x1WjNNaU9pSnhRa0ZCYjBJc01FSTdjVUpCUVdKQkxFOGlMQ0ptYVd4bElqb2lhVzVrWlhndWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpsZUhCdmNuUWdaR1ZtWVhWc2RDQm1jbTl0SUNjdUwzTjBjbWx3U1c1a1pXNTBWSEpoYm5ObWIzSnRaWEluTzF4dUlsMTkiLCJmdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH1cblxuLyoqXG4gKiBzdHJpcHMgaW5kZW50YXRpb24gZnJvbSBhIHRlbXBsYXRlIGxpdGVyYWxcbiAqIEBwYXJhbSAge1N0cmluZ30gdHlwZSA9ICdpbml0aWFsJyAtIHdoZXRoZXIgdG8gcmVtb3ZlIGFsbCBpbmRlbnRhdGlvbiBvciBqdXN0IGxlYWRpbmcgaW5kZW50YXRpb24uIGNhbiBiZSAnYWxsJyBvciAnaW5pdGlhbCdcbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgICAgICAgICAtIGEgVGVtcGxhdGVUYWcgdHJhbnNmb3JtZXJcbiAqL1xudmFyIHN0cmlwSW5kZW50VHJhbnNmb3JtZXIgPSBmdW5jdGlvbiBzdHJpcEluZGVudFRyYW5zZm9ybWVyKCkge1xuICB2YXIgdHlwZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJ2luaXRpYWwnO1xuICByZXR1cm4ge1xuICAgIG9uRW5kUmVzdWx0OiBmdW5jdGlvbiBvbkVuZFJlc3VsdChlbmRSZXN1bHQpIHtcbiAgICAgIGlmICh0eXBlID09PSAnaW5pdGlhbCcpIHtcbiAgICAgICAgLy8gcmVtb3ZlIHRoZSBzaG9ydGVzdCBsZWFkaW5nIGluZGVudGF0aW9uIGZyb20gZWFjaCBsaW5lXG4gICAgICAgIHZhciBtYXRjaCA9IGVuZFJlc3VsdC5tYXRjaCgvXlteXFxTXFxuXSooPz1cXFMpL2dtKTtcbiAgICAgICAgdmFyIGluZGVudCA9IG1hdGNoICYmIE1hdGgubWluLmFwcGx5KE1hdGgsIF90b0NvbnN1bWFibGVBcnJheShtYXRjaC5tYXAoZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgcmV0dXJuIGVsLmxlbmd0aDtcbiAgICAgICAgfSkpKTtcbiAgICAgICAgaWYgKGluZGVudCkge1xuICAgICAgICAgIHZhciByZWdleHAgPSBuZXcgUmVnRXhwKCdeLnsnICsgaW5kZW50ICsgJ30nLCAnZ20nKTtcbiAgICAgICAgICByZXR1cm4gZW5kUmVzdWx0LnJlcGxhY2UocmVnZXhwLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVuZFJlc3VsdDtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlID09PSAnYWxsJykge1xuICAgICAgICAvLyByZW1vdmUgYWxsIGluZGVudGF0aW9uIGZyb20gZWFjaCBsaW5lXG4gICAgICAgIHJldHVybiBlbmRSZXN1bHQucmVwbGFjZSgvXlteXFxTXFxuXSsvZ20sICcnKTtcbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biB0eXBlOiAnICsgdHlwZSk7XG4gICAgfVxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXpkSEpwY0VsdVpHVnVkRlJ5WVc1elptOXliV1Z5TDNOMGNtbHdTVzVrWlc1MFZISmhibk5tYjNKdFpYSXVhbk1pWFN3aWJtRnRaWE1pT2xzaWMzUnlhWEJKYm1SbGJuUlVjbUZ1YzJadmNtMWxjaUlzSW5SNWNHVWlMQ0p2YmtWdVpGSmxjM1ZzZENJc0ltVnVaRkpsYzNWc2RDSXNJbTFoZEdOb0lpd2lhVzVrWlc1MElpd2lUV0YwYUNJc0ltMXBiaUlzSW0xaGNDSXNJbVZzSWl3aWJHVnVaM1JvSWl3aWNtVm5aWGh3SWl3aVVtVm5SWGh3SWl3aWNtVndiR0ZqWlNJc0lrVnljbTl5SWwwc0ltMWhjSEJwYm1keklqb2lPenRCUVVGQk96czdPenRCUVV0QkxFbEJRVTFCTEhsQ1FVRjVRaXhUUVVGNlFrRXNjMEpCUVhsQ08wRkJRVUVzVFVGQlEwTXNTVUZCUkN4MVJVRkJVU3hUUVVGU08wRkJRVUVzVTBGQmRVSTdRVUZEY0VSRExHVkJSRzlFTEhWQ1FVTjRRME1zVTBGRWQwTXNSVUZETjBJN1FVRkRja0lzVlVGQlNVWXNVMEZCVXl4VFFVRmlMRVZCUVhkQ08wRkJRM1JDTzBGQlEwRXNXVUZCVFVjc1VVRkJVVVFzVlVGQlZVTXNTMEZCVml4RFFVRm5RaXh0UWtGQmFFSXNRMEZCWkR0QlFVTkJMRmxCUVUxRExGTkJRVk5FTEZOQlFWTkZMRXRCUVV0RExFZEJRVXdzWjBOQlFWbElMRTFCUVUxSkxFZEJRVTRzUTBGQlZUdEJRVUZCTEdsQ1FVRk5ReXhIUVVGSFF5eE5RVUZVTzBGQlFVRXNVMEZCVml4RFFVRmFMRVZCUVhoQ08wRkJRMEVzV1VGQlNVd3NUVUZCU2l4RlFVRlpPMEZCUTFZc1kwRkJUVTBzVTBGQlV5eEpRVUZKUXl4TlFVRktMRk5CUVdsQ1VDeE5RVUZxUWl4UlFVRTBRaXhKUVVFMVFpeERRVUZtTzBGQlEwRXNhVUpCUVU5R0xGVkJRVlZWTEU5QlFWWXNRMEZCYTBKR0xFMUJRV3hDTEVWQlFUQkNMRVZCUVRGQ0xFTkJRVkE3UVVGRFJEdEJRVU5FTEdWQlFVOVNMRk5CUVZBN1FVRkRSRHRCUVVORUxGVkJRVWxHTEZOQlFWTXNTMEZCWWl4RlFVRnZRanRCUVVOc1FqdEJRVU5CTEdWQlFVOUZMRlZCUVZWVkxFOUJRVllzUTBGQmEwSXNZVUZCYkVJc1JVRkJhVU1zUlVGQmFrTXNRMEZCVUR0QlFVTkVPMEZCUTBRc1dVRkJUU3hKUVVGSlF5eExRVUZLTEc5Q1FVRXlRbUlzU1VGQk0wSXNRMEZCVGp0QlFVTkVPMEZCYWtKdFJDeEhRVUYyUWp0QlFVRkJMRU5CUVM5Q096dEJRVzlDUVN4bFFVRmxSQ3h6UWtGQlppSXNJbVpwYkdVaU9pSnpkSEpwY0VsdVpHVnVkRlJ5WVc1elptOXliV1Z5TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeW9xWEc0Z0tpQnpkSEpwY0hNZ2FXNWtaVzUwWVhScGIyNGdabkp2YlNCaElIUmxiWEJzWVhSbElHeHBkR1Z5WVd4Y2JpQXFJRUJ3WVhKaGJTQWdlMU4wY21sdVozMGdkSGx3WlNBOUlDZHBibWwwYVdGc0p5QXRJSGRvWlhSb1pYSWdkRzhnY21WdGIzWmxJR0ZzYkNCcGJtUmxiblJoZEdsdmJpQnZjaUJxZFhOMElHeGxZV1JwYm1jZ2FXNWtaVzUwWVhScGIyNHVJR05oYmlCaVpTQW5ZV3hzSnlCdmNpQW5hVzVwZEdsaGJDZGNiaUFxSUVCeVpYUjFjbTRnZTA5aWFtVmpkSDBnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F0SUdFZ1ZHVnRjR3hoZEdWVVlXY2dkSEpoYm5ObWIzSnRaWEpjYmlBcUwxeHVZMjl1YzNRZ2MzUnlhWEJKYm1SbGJuUlVjbUZ1YzJadmNtMWxjaUE5SUNoMGVYQmxJRDBnSjJsdWFYUnBZV3duS1NBOVBpQW9lMXh1SUNCdmJrVnVaRkpsYzNWc2RDaGxibVJTWlhOMWJIUXBJSHRjYmlBZ0lDQnBaaUFvZEhsd1pTQTlQVDBnSjJsdWFYUnBZV3duS1NCN1hHNGdJQ0FnSUNBdkx5QnlaVzF2ZG1VZ2RHaGxJSE5vYjNKMFpYTjBJR3hsWVdScGJtY2dhVzVrWlc1MFlYUnBiMjRnWm5KdmJTQmxZV05vSUd4cGJtVmNiaUFnSUNBZ0lHTnZibk4wSUcxaGRHTm9JRDBnWlc1a1VtVnpkV3gwTG0xaGRHTm9LQzllVzE1Y1hGTmNYRzVkS2lnL1BWeGNVeWt2WjIwcE8xeHVJQ0FnSUNBZ1kyOXVjM1FnYVc1a1pXNTBJRDBnYldGMFkyZ2dKaVlnVFdGMGFDNXRhVzRvTGk0dWJXRjBZMmd1YldGd0tHVnNJRDArSUdWc0xteGxibWQwYUNrcE8xeHVJQ0FnSUNBZ2FXWWdLR2x1WkdWdWRDa2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQnlaV2RsZUhBZ1BTQnVaWGNnVW1WblJYaHdLR0JlTG5za2UybHVaR1Z1ZEgxOVlDd2dKMmR0SnlrN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCbGJtUlNaWE4xYkhRdWNtVndiR0ZqWlNoeVpXZGxlSEFzSUNjbktUdGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lISmxkSFZ5YmlCbGJtUlNaWE4xYkhRN1hHNGdJQ0FnZlZ4dUlDQWdJR2xtSUNoMGVYQmxJRDA5UFNBbllXeHNKeWtnZTF4dUlDQWdJQ0FnTHk4Z2NtVnRiM1psSUdGc2JDQnBibVJsYm5SaGRHbHZiaUJtY205dElHVmhZMmdnYkdsdVpWeHVJQ0FnSUNBZ2NtVjBkWEp1SUdWdVpGSmxjM1ZzZEM1eVpYQnNZV05sS0M5ZVcxNWNYRk5jWEc1ZEt5OW5iU3dnSnljcE8xeHVJQ0FnSUgxY2JpQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9ZRlZ1YTI1dmQyNGdkSGx3WlRvZ0pIdDBlWEJsZldBcE8xeHVJQ0I5TEZ4dWZTazdYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJSE4wY21sd1NXNWtaVzUwVkhKaGJuTm1iM0p0WlhJN1hHNGlYWDA9IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vc3RyaXBJbmRlbnRzJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXpkSEpwY0VsdVpHVnVkSE12YVc1a1pYZ3Vhbk1pWFN3aWJtRnRaWE1pT2xzaVpHVm1ZWFZzZENKZExDSnRZWEJ3YVc1bmN5STZJbkZDUVVGdlFpeG5RanR4UWtGQllrRXNUeUlzSW1acGJHVWlPaUpwYm1SbGVDNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1WNGNHOXlkQ0JrWldaaGRXeDBJR1p5YjIwZ0p5NHZjM1J5YVhCSmJtUmxiblJ6Snp0Y2JpSmRmUT09IiwiaW1wb3J0IFRlbXBsYXRlVGFnIGZyb20gJy4uL1RlbXBsYXRlVGFnJztcbmltcG9ydCBzdHJpcEluZGVudFRyYW5zZm9ybWVyIGZyb20gJy4uL3N0cmlwSW5kZW50VHJhbnNmb3JtZXInO1xuaW1wb3J0IHRyaW1SZXN1bHRUcmFuc2Zvcm1lciBmcm9tICcuLi90cmltUmVzdWx0VHJhbnNmb3JtZXInO1xuXG52YXIgc3RyaXBJbmRlbnRzID0gbmV3IFRlbXBsYXRlVGFnKHN0cmlwSW5kZW50VHJhbnNmb3JtZXIoJ2FsbCcpLCB0cmltUmVzdWx0VHJhbnNmb3JtZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBzdHJpcEluZGVudHM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl6ZEhKcGNFbHVaR1Z1ZEhNdmMzUnlhWEJKYm1SbGJuUnpMbXB6SWwwc0ltNWhiV1Z6SWpwYklsUmxiWEJzWVhSbFZHRm5JaXdpYzNSeWFYQkpibVJsYm5SVWNtRnVjMlp2Y20xbGNpSXNJblJ5YVcxU1pYTjFiSFJVY21GdWMyWnZjbTFsY2lJc0luTjBjbWx3U1c1a1pXNTBjeUpkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzVDBGQlQwRXNWMEZCVUN4TlFVRjNRaXhuUWtGQmVFSTdRVUZEUVN4UFFVRlBReXh6UWtGQlVDeE5RVUZ0UXl3eVFrRkJia003UVVGRFFTeFBRVUZQUXl4eFFrRkJVQ3hOUVVGclF5d3dRa0ZCYkVNN08wRkJSVUVzU1VGQlRVTXNaVUZCWlN4SlFVRkpTQ3hYUVVGS0xFTkJRMjVDUXl4MVFrRkJkVUlzUzBGQmRrSXNRMEZFYlVJc1JVRkZia0pETEhGQ1FVWnRRaXhEUVVGeVFqczdRVUZMUVN4bFFVRmxReXhaUVVGbUlpd2labWxzWlNJNkluTjBjbWx3U1c1a1pXNTBjeTVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltbHRjRzl5ZENCVVpXMXdiR0YwWlZSaFp5Qm1jbTl0SUNjdUxpOVVaVzF3YkdGMFpWUmhaeWM3WEc1cGJYQnZjblFnYzNSeWFYQkpibVJsYm5SVWNtRnVjMlp2Y20xbGNpQm1jbTl0SUNjdUxpOXpkSEpwY0VsdVpHVnVkRlJ5WVc1elptOXliV1Z5Snp0Y2JtbHRjRzl5ZENCMGNtbHRVbVZ6ZFd4MFZISmhibk5tYjNKdFpYSWdabkp2YlNBbkxpNHZkSEpwYlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5Snp0Y2JseHVZMjl1YzNRZ2MzUnlhWEJKYm1SbGJuUnpJRDBnYm1WM0lGUmxiWEJzWVhSbFZHRm5LRnh1SUNCemRISnBjRWx1WkdWdWRGUnlZVzV6Wm05eWJXVnlLQ2RoYkd3bktTeGNiaUFnZEhKcGJWSmxjM1ZzZEZSeVlXNXpabTl5YldWeUxGeHVLVHRjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnYzNSeWFYQkpibVJsYm5Sek8xeHVJbDE5IiwiaW1wb3J0IF9kZWZhdWx0IGZyb20gJy4vdHJpbVJlc3VsdFRyYW5zZm9ybWVyJztcbmV4cG9ydCB7IF9kZWZhdWx0IGFzIGRlZmF1bHQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OTBjbWx0VW1WemRXeDBWSEpoYm5ObWIzSnRaWEl2YVc1a1pYZ3Vhbk1pWFN3aWJtRnRaWE1pT2xzaVpHVm1ZWFZzZENKZExDSnRZWEJ3YVc1bmN5STZJbkZDUVVGdlFpeDVRanR4UWtGQllrRXNUeUlzSW1acGJHVWlPaUpwYm1SbGVDNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1WNGNHOXlkQ0JrWldaaGRXeDBJR1p5YjIwZ0p5NHZkSEpwYlZKbGMzVnNkRlJ5WVc1elptOXliV1Z5Snp0Y2JpSmRmUT09IiwiLyoqXG4gKiBUZW1wbGF0ZVRhZyB0cmFuc2Zvcm1lciB0aGF0IHRyaW1zIHdoaXRlc3BhY2Ugb24gdGhlIGVuZCByZXN1bHQgb2YgYSB0YWdnZWQgdGVtcGxhdGVcbiAqIEBwYXJhbSAge1N0cmluZ30gc2lkZSA9ICcnIC0gVGhlIHNpZGUgb2YgdGhlIHN0cmluZyB0byB0cmltLiBDYW4gYmUgJ3N0YXJ0JyBvciAnZW5kJyAoYWx0ZXJuYXRpdmVseSAnbGVmdCcgb3IgJ3JpZ2h0JylcbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgIC0gYSBUZW1wbGF0ZVRhZyB0cmFuc2Zvcm1lclxuICovXG52YXIgdHJpbVJlc3VsdFRyYW5zZm9ybWVyID0gZnVuY3Rpb24gdHJpbVJlc3VsdFRyYW5zZm9ybWVyKCkge1xuICB2YXIgc2lkZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyc7XG4gIHJldHVybiB7XG4gICAgb25FbmRSZXN1bHQ6IGZ1bmN0aW9uIG9uRW5kUmVzdWx0KGVuZFJlc3VsdCkge1xuICAgICAgaWYgKHNpZGUgPT09ICcnKSB7XG4gICAgICAgIHJldHVybiBlbmRSZXN1bHQudHJpbSgpO1xuICAgICAgfVxuXG4gICAgICBzaWRlID0gc2lkZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICBpZiAoc2lkZSA9PT0gJ3N0YXJ0JyB8fCBzaWRlID09PSAnbGVmdCcpIHtcbiAgICAgICAgcmV0dXJuIGVuZFJlc3VsdC5yZXBsYWNlKC9eXFxzKi8sICcnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNpZGUgPT09ICdlbmQnIHx8IHNpZGUgPT09ICdyaWdodCcpIHtcbiAgICAgICAgcmV0dXJuIGVuZFJlc3VsdC5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbiAgICAgIH1cblxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTaWRlIG5vdCBzdXBwb3J0ZWQ6ICcgKyBzaWRlKTtcbiAgICB9XG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCB0cmltUmVzdWx0VHJhbnNmb3JtZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTkwY21sdFVtVnpkV3gwVkhKaGJuTm1iM0p0WlhJdmRISnBiVkpsYzNWc2RGUnlZVzV6Wm05eWJXVnlMbXB6SWwwc0ltNWhiV1Z6SWpwYkluUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUlzSW5OcFpHVWlMQ0p2YmtWdVpGSmxjM1ZzZENJc0ltVnVaRkpsYzNWc2RDSXNJblJ5YVcwaUxDSjBiMHh2ZDJWeVEyRnpaU0lzSW5KbGNHeGhZMlVpTENKRmNuSnZjaUpkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3T3pzN08wRkJTMEVzU1VGQlRVRXNkMEpCUVhkQ0xGTkJRWGhDUVN4eFFrRkJkMEk3UVVGQlFTeE5RVUZEUXl4SlFVRkVMSFZGUVVGUkxFVkJRVkk3UVVGQlFTeFRRVUZuUWp0QlFVTTFRME1zWlVGRU5FTXNkVUpCUTJoRFF5eFRRVVJuUXl4RlFVTnlRanRCUVVOeVFpeFZRVUZKUml4VFFVRlRMRVZCUVdJc1JVRkJhVUk3UVVGRFppeGxRVUZQUlN4VlFVRlZReXhKUVVGV0xFVkJRVkE3UVVGRFJEczdRVUZGUkVnc1lVRkJUMEVzUzBGQlMwa3NWMEZCVEN4RlFVRlFPenRCUVVWQkxGVkJRVWxLTEZOQlFWTXNUMEZCVkN4SlFVRnZRa0VzVTBGQlV5eE5RVUZxUXl4RlFVRjVRenRCUVVOMlF5eGxRVUZQUlN4VlFVRlZSeXhQUVVGV0xFTkJRV3RDTEUxQlFXeENMRVZCUVRCQ0xFVkJRVEZDTEVOQlFWQTdRVUZEUkRzN1FVRkZSQ3hWUVVGSlRDeFRRVUZUTEV0QlFWUXNTVUZCYTBKQkxGTkJRVk1zVDBGQkwwSXNSVUZCZDBNN1FVRkRkRU1zWlVGQlQwVXNWVUZCVlVjc1QwRkJWaXhEUVVGclFpeE5RVUZzUWl4RlFVRXdRaXhGUVVFeFFpeERRVUZRTzBGQlEwUTdPMEZCUlVRc1dVRkJUU3hKUVVGSlF5eExRVUZLTERCQ1FVRnBRMDRzU1VGQmFrTXNRMEZCVGp0QlFVTkVPMEZCYWtJeVF5eEhRVUZvUWp0QlFVRkJMRU5CUVRsQ096dEJRVzlDUVN4bFFVRmxSQ3h4UWtGQlppSXNJbVpwYkdVaU9pSjBjbWx0VW1WemRXeDBWSEpoYm5ObWIzSnRaWEl1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlGUmxiWEJzWVhSbFZHRm5JSFJ5WVc1elptOXliV1Z5SUhSb1lYUWdkSEpwYlhNZ2QyaHBkR1Z6Y0dGalpTQnZiaUIwYUdVZ1pXNWtJSEpsYzNWc2RDQnZaaUJoSUhSaFoyZGxaQ0IwWlcxd2JHRjBaVnh1SUNvZ1FIQmhjbUZ0SUNCN1UzUnlhVzVuZlNCemFXUmxJRDBnSnljZ0xTQlVhR1VnYzJsa1pTQnZaaUIwYUdVZ2MzUnlhVzVuSUhSdklIUnlhVzB1SUVOaGJpQmlaU0FuYzNSaGNuUW5JRzl5SUNkbGJtUW5JQ2hoYkhSbGNtNWhkR2wyWld4NUlDZHNaV1owSnlCdmNpQW5jbWxuYUhRbktWeHVJQ29nUUhKbGRIVnliaUI3VDJKcVpXTjBmU0FnSUNBZ0lDQWdJQ0FnTFNCaElGUmxiWEJzWVhSbFZHRm5JSFJ5WVc1elptOXliV1Z5WEc0Z0tpOWNibU52Ym5OMElIUnlhVzFTWlhOMWJIUlVjbUZ1YzJadmNtMWxjaUE5SUNoemFXUmxJRDBnSnljcElEMCtJQ2g3WEc0Z0lHOXVSVzVrVW1WemRXeDBLR1Z1WkZKbGMzVnNkQ2tnZTF4dUlDQWdJR2xtSUNoemFXUmxJRDA5UFNBbkp5a2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHVnVaRkpsYzNWc2RDNTBjbWx0S0NrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzJsa1pTQTlJSE5wWkdVdWRHOU1iM2RsY2tOaGMyVW9LVHRjYmx4dUlDQWdJR2xtSUNoemFXUmxJRDA5UFNBbmMzUmhjblFuSUh4OElITnBaR1VnUFQwOUlDZHNaV1owSnlrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUdWdVpGSmxjM1ZzZEM1eVpYQnNZV05sS0M5ZVhGeHpLaThzSUNjbktUdGNiaUFnSUNCOVhHNWNiaUFnSUNCcFppQW9jMmxrWlNBOVBUMGdKMlZ1WkNjZ2ZId2djMmxrWlNBOVBUMGdKM0pwWjJoMEp5a2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHVnVaRkpsYzNWc2RDNXlaWEJzWVdObEtDOWNYSE1xSkM4c0lDY25LVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb1lGTnBaR1VnYm05MElITjFjSEJ2Y25SbFpEb2dKSHR6YVdSbGZXQXBPMXh1SUNCOUxGeHVmU2s3WEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUhSeWFXMVNaWE4xYkhSVWNtRnVjMlp2Y20xbGNqdGNiaUpkZlE9PSIsImNvbnN0IFRhYmxlID0gKHRhYmxlU2l6ZSwgcGFyZW50UXVlcnkpID0+IHtcbiAgY29uc3Qgc2VsZiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7cGFyZW50UXVlcnl9IC5iYXR0bGVmaWVsZC10YWJsZWApO1xuXG4gIGZ1bmN0aW9uIGdldE5ld1RhYmxlRWxlbWVudCgpIHtcbiAgICBmdW5jdGlvbiBnZXRDb2xNYXJrZXIoZGF0YXNldFlQb3MpIHtcbiAgICAgIGNvbnN0IGFscGhhYmV0ID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWlwiO1xuICAgICAgY29uc3QgYXJyID0gYWxwaGFiZXQuc3BsaXQoXCJcIik7XG4gICAgICByZXR1cm4gYXJyW2RhdGFzZXRZUG9zXTtcbiAgICB9XG5cbiAgICBjb25zdCB0YWJsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRhYmxlXCIpO1xuICAgIHRhYmxlRWwuY2xhc3NMaXN0ID0gXCJiYXR0bGVmaWVsZC10YWJsZVwiO1xuICAgIGNvbnN0IHRhYmxlQm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiKTtcbiAgICB0YWJsZUVsLmFwcGVuZENoaWxkKHRhYmxlQm9keSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhYmxlU2l6ZTsgaSArPSAxKSB7XG4gICAgICBjb25zdCB0YWJsZVJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0clwiKTtcbiAgICAgIHRhYmxlUm93LmNsYXNzTGlzdCA9IFwiYmF0dGxlZmllbGQtcm93XCI7XG4gICAgICB0YWJsZUJvZHkuYXBwZW5kQ2hpbGQodGFibGVSb3cpO1xuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRhYmxlU2l6ZTsgaiArPSAxKSB7XG4gICAgICAgIGNvbnN0IHRhYmxlRGF0YUNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XG4gICAgICAgIHRhYmxlRGF0YUNlbGwuY2xhc3NMaXN0ID0gXCJiYXR0bGVmaWVsZC1jZWxsXCI7XG4gICAgICAgIHRhYmxlUm93LmFwcGVuZENoaWxkKHRhYmxlRGF0YUNlbGwpO1xuXG4gICAgICAgIGNvbnN0IGJhdHRsZWZpZWxkQ2VsbENvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBiYXR0bGVmaWVsZENlbGxDb250ZW50LmNsYXNzTGlzdCA9IFwiYmF0dGxlZmllbGQtY2VsbC1jb250ZW50XCI7XG4gICAgICAgIGJhdHRsZWZpZWxkQ2VsbENvbnRlbnQuZGF0YXNldC54ID0gajtcbiAgICAgICAgYmF0dGxlZmllbGRDZWxsQ29udGVudC5kYXRhc2V0LnkgPSBpO1xuICAgICAgICB0YWJsZURhdGFDZWxsLmFwcGVuZENoaWxkKGJhdHRsZWZpZWxkQ2VsbENvbnRlbnQpO1xuXG4gICAgICAgIGlmIChiYXR0bGVmaWVsZENlbGxDb250ZW50LmRhdGFzZXQueCA9PT0gMCkge1xuICAgICAgICAgIGNvbnN0IG1hcmtlclJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgbWFya2VyUm93LmNsYXNzTGlzdCA9IFwibWFya2VyIG1hcmtlci1yb3dcIjtcbiAgICAgICAgICBtYXJrZXJSb3cudGV4dENvbnRlbnQgPSBiYXR0bGVmaWVsZENlbGxDb250ZW50LmRhdGFzZXQueCArIDE7XG4gICAgICAgICAgYmF0dGxlZmllbGRDZWxsQ29udGVudC5hcHBlbmRDaGlsZChtYXJrZXJSb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJhdHRsZWZpZWxkQ2VsbENvbnRlbnQuZGF0YXNldC55ID09PSAwKSB7XG4gICAgICAgICAgY29uc3QgbWFya2VyQ29sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICBtYXJrZXJDb2wuY2xhc3NMaXN0ID0gXCJtYXJrZXIgbWFya2VyLWNvbFwiO1xuICAgICAgICAgIG1hcmtlckNvbC50ZXh0Q29udGVudCA9IGdldENvbE1hcmtlcihcbiAgICAgICAgICAgIGJhdHRsZWZpZWxkQ2VsbENvbnRlbnQuZGF0YXNldC55XG4gICAgICAgICAgKTtcbiAgICAgICAgICBiYXR0bGVmaWVsZENlbGxDb250ZW50LmFwcGVuZENoaWxkKG1hcmtlckNvbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFibGVFbDtcbiAgfVxuXG4gIGNvbnN0IHRhYmxlRWwgPSBnZXROZXdUYWJsZUVsZW1lbnQoKTtcblxuICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7cGFyZW50UXVlcnl9LWxhYmVsYCk7XG4gIGlmIChwYXJlbnRRdWVyeSA9PT0gXCIuYmF0dGxlZmllbGQtc2VsZlwiKSB7XG4gICAgbGFiZWwudGV4dENvbnRlbnQgPSBcIllvdVwiO1xuICB9IGVsc2Uge1xuICAgIGxhYmVsLnRleHRDb250ZW50ID0gXCJSaXZhbFwiO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9nZ2xlRGlzYWJsZWQoKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihwYXJlbnRRdWVyeSkuY2xhc3NMaXN0LnRvZ2dsZShcImRpc2FibGVkXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9nZ2xlQXR0YWNrQ3Vyc29yKCkge1xuICAgIGRvY3VtZW50XG4gICAgICAucXVlcnlTZWxlY3RvckFsbChgJHtwYXJlbnRRdWVyeX0gLmJhdHRsZWZpZWxkLWNlbGwtY29udGVudGApXG4gICAgICAuZm9yRWFjaCgodmFsdWUpID0+IHZhbHVlLmNsYXNzTGlzdC50b2dnbGUoXCJhdHRhY2stY3Vyc29yXCIpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZShzaGlwcykge1xuICAgIGNvbnN0IGFyciA9IHNoaXBzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBzaGlwQ2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAke3BhcmVudFF1ZXJ5fSAuYmF0dGxlZmllbGQtY2VsbC1jb250ZW50W2RhdGEteD1cIiR7YXJyW2ldLnh9XCJdW2RhdGEteT1cIiR7YXJyW2ldLnl9XCJdYFxuICAgICAgKTtcbiAgICAgIHNoaXBDZWxsLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlckludmFsaWRTcGFjZShpbnZhbGlkU3BhY2VBcnIpIHtcbiAgICBjb25zdCBhcnIgPSBpbnZhbGlkU3BhY2VBcnI7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgJHtwYXJlbnRRdWVyeX0gLmJhdHRsZWZpZWxkLWNlbGwtY29udGVudFtkYXRhLXg9XCIke2FycltpXVswXX1cIl1bZGF0YS15PVwiJHthcnJbaV1bMV19XCJdYFxuICAgICAgKTtcbiAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImludmFsaWRcIik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyQ2xhc3NuYW1lKGNsYXNzTmFtZSwgYXJyYXkpIHtcbiAgICBjb25zdCBhcnIgPSBhcnJheTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAke3BhcmVudFF1ZXJ5fSAuYmF0dGxlZmllbGQtY2VsbC1jb250ZW50W2RhdGEteD1cIiR7YXJyW2ldLnh9XCJdW2RhdGEteT1cIiR7YXJyW2ldLnl9XCJdYFxuICAgICAgKTtcbiAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICBzZWxmLmlubmVySFRNTCA9IHRhYmxlRWwuaW5uZXJIVE1MO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkQXR0YWNrRXZlbnRMaXN0ZW5lcihhdHRhY2tFdmVudCkge1xuICAgIGRvY3VtZW50XG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgYCR7cGFyZW50UXVlcnl9IC5iYXR0bGVmaWVsZC1jZWxsLWNvbnRlbnQuYXR0YWNrLWN1cnNvcmBcbiAgICAgIClcbiAgICAgIC5mb3JFYWNoKCh2YWx1ZSkgPT4gdmFsdWUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGF0dGFja0V2ZW50KSk7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJBdHRhY2tSZXN1bHQoYXR0YWNrLCBjb29yZHMpIHtcbiAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgIGAke3BhcmVudFF1ZXJ5fSAuYmF0dGxlZmllbGQtY2VsbC1jb250ZW50LmF0dGFjay1jdXJzb3JbZGF0YS14PVwiJHtjb29yZHNbMF19XCJdW2RhdGEteT1cIiR7Y29vcmRzWzFdfVwiXWBcbiAgICApO1xuICAgIGlmIChhdHRhY2subWlzcykge1xuICAgICAgY2VsbC5jbGFzc0xpc3QucmVwbGFjZShcImF0dGFjay1jdXJzb3JcIiwgXCJtaXNzXCIpO1xuICAgICAgY29uc3QgbWlzc0ljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgIG1pc3NJY29uLmNsYXNzTGlzdCA9IFwibWlzcy1pY29uXCI7XG4gICAgICBjZWxsLmFwcGVuZENoaWxkKG1pc3NJY29uKTtcbiAgICB9XG4gICAgaWYgKGF0dGFjay5oaXQgfHwgYXR0YWNrLnN1bmspIHtcbiAgICAgIGNlbGwuY2xhc3NMaXN0LnJlcGxhY2UoXCJhdHRhY2stY3Vyc29yXCIsIFwiaGl0XCIpO1xuICAgICAgY29uc3QgaGl0SWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgaGl0SWNvbi5jbGFzc0xpc3QgPSBcImhpdC1pY29uXCI7XG4gICAgICBjZWxsLmFwcGVuZENoaWxkKGhpdEljb24pO1xuICAgIH1cbiAgICBpZiAoYXR0YWNrLnN1bmspIHtcbiAgICAgIGF0dGFjay5zaGlwQ29yZHMuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgICAgZG9jdW1lbnRcbiAgICAgICAgICAucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgIGAke3BhcmVudFF1ZXJ5fSAuYmF0dGxlZmllbGQtY2VsbC1jb250ZW50W2RhdGEteD1cIiR7dmFsdWUueH1cIl1bZGF0YS15PVwiJHt2YWx1ZS55fVwiXWBcbiAgICAgICAgICApXG4gICAgICAgICAgLmNsYXNzTGlzdC5hZGQoXCJzdW5rXCIpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICByZW5kZXIsXG4gICAgdXBkYXRlLFxuICAgIHJlbmRlckludmFsaWRTcGFjZSxcbiAgICByZW5kZXJDbGFzc25hbWUsXG4gICAgdG9nZ2xlRGlzYWJsZWQsXG4gICAgdG9nZ2xlQXR0YWNrQ3Vyc29yLFxuICAgIGFkZEF0dGFja0V2ZW50TGlzdGVuZXIsXG4gICAgcmVuZGVyQXR0YWNrUmVzdWx0LFxuICB9O1xufTtcblxuZnVuY3Rpb24gcmVuZGVyTm90aWZpY2F0aW9uKG1zZykge1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm5vdGlmaWNhdGlvbi1tZXNzYWdlXCIpLnRleHRDb250ZW50ID0gbXNnO1xufVxuXG5jb25zdCB0YWJsZVNlbGYgPSBUYWJsZSgxMCwgXCIuYmF0dGxlZmllbGQtc2VsZlwiKTtcbmNvbnN0IHRhYmxlUml2YWwgPSBUYWJsZSgxMCwgXCIuYmF0dGxlZmllbGQtcml2YWxcIik7XG5cbnRhYmxlU2VsZi5yZW5kZXIoKTtcbnRhYmxlUml2YWwucmVuZGVyKCk7XG5cbmV4cG9ydCB7IFRhYmxlLCByZW5kZXJOb3RpZmljYXRpb24gfTtcbiIsImltcG9ydCB7IFRhYmxlLCByZW5kZXJOb3RpZmljYXRpb24gfSBmcm9tIFwiLi9ET01cIjtcbmltcG9ydCB7IGxvZ0FycmF5cywgZGlmZmVyZW5jZSB9IGZyb20gXCIuL3V0aWxpdHlcIjtcbmNvbnN0IHsgc3RyaXBJbmRlbnRzIH0gPSByZXF1aXJlKFwiY29tbW9uLXRhZ3NcIik7XG5cbmNvbnN0IFNoaXAgPSAoc2l6ZSwgYXhpcykgPT4ge1xuICBjb25zdCBzaGlwU2l6ZSA9IHNpemU7XG4gIGxldCB0aW1lc0hpdCA9IDA7XG4gIGxldCBzdW5rID0gZmFsc2U7XG4gIGxldCBjb29yZGluYXRlcyA9IFtdO1xuXG4gIGZ1bmN0aW9uIGdldFNpemUoKSB7XG4gICAgcmV0dXJuIHNoaXBTaXplO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QXhpcygpIHtcbiAgICByZXR1cm4gYXhpcztcbiAgfVxuXG4gIGZ1bmN0aW9uIGhpdCgpIHtcbiAgICB0aW1lc0hpdCArPSAxO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNTdW5rKCkge1xuICAgIGlmICh0aW1lc0hpdCA9PT0gc2hpcFNpemUpIHtcbiAgICAgIHN1bmsgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gc3VuaztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENvb3JkaW5hdGVzKCkge1xuICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldENvb3JkaW5hdGVzKGNvcmRzKSB7XG4gICAgY29vcmRpbmF0ZXMgPSBjb3JkcztcbiAgfVxuXG4gIHJldHVybiB7IGdldFNpemUsIGlzU3VuaywgaGl0LCBnZXRDb29yZGluYXRlcywgc2V0Q29vcmRpbmF0ZXMsIGdldEF4aXMgfTtcbn07XG5cbmNvbnN0IEdhbWVib2FyZCA9ICgpID0+IHtcbiAgY29uc3Qgc2l6ZSA9IDEwO1xuXG4gIGZ1bmN0aW9uIGdldENvbE1hcmtlcih5UG9zKSB7XG4gICAgY29uc3QgYWxwaGFiZXQgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXCI7XG4gICAgY29uc3QgYXJyID0gYWxwaGFiZXQuc3BsaXQoXCJcIik7XG4gICAgcmV0dXJuIGFyclt5UG9zXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgY29uc3QgYXJyID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpICs9IDEpIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2l6ZTsgaiArPSAxKSB7XG4gICAgICAgIGFyci5wdXNoKHsgeDogaiwgeTogaSwgcm93OiBpICsgMSwgY29sOiBnZXRDb2xNYXJrZXIoaikgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG4gIH1cblxuICBjb25zdCBtYXAgPSBpbml0KCk7XG5cbiAgZnVuY3Rpb24gZ2V0TWFwRGF0YSgpIHtcbiAgICBmdW5jdGlvbiBnZXREaWN0aW9uYXJ5KG1hcEFyciA9IG1hcC5zbGljZSgpKSB7XG4gICAgICBjb25zdCBkaWN0aW9uYXJ5ID0ge1xuICAgICAgICBjb2x1bW5zOiBbXSxcbiAgICAgICAgcm93czogW10sXG4gICAgICB9O1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3QgYXJyQ29sdW1ucyA9IG1hcEFyci5maWx0ZXIoXG4gICAgICAgICAgKHZhbHVlKSA9PiB2YWx1ZS5jb2wgPT09IGdldENvbE1hcmtlcihpKVxuICAgICAgICApO1xuICAgICAgICBkaWN0aW9uYXJ5LmNvbHVtbnMucHVzaChhcnJDb2x1bW5zKTtcblxuICAgICAgICBjb25zdCBhcnJSb3dzID0gbWFwQXJyLmZpbHRlcigodmFsdWUpID0+IHZhbHVlLnJvdyA9PT0gaSArIDEpO1xuICAgICAgICBkaWN0aW9uYXJ5LnJvd3MucHVzaChhcnJSb3dzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRpY3Rpb25hcnk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0SW5kZXhCeUNvb3JkaW5hdGUoY29vcmRzKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBtYXAuZmluZEluZGV4KFxuICAgICAgICAodmFsdWUpID0+IHZhbHVlLnggPT09IGNvb3Jkc1swXSAmJiB2YWx1ZS55ID09PSBjb29yZHNbMV1cbiAgICAgICk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldENvb3JkaW5hdGVCeUluZGV4KGluZGV4KSB7XG4gICAgICByZXR1cm4gbWFwLnNsaWNlKClbaW5kZXhdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNwYWNlKGNvb3JkKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGdldEluZGV4QnlDb29yZGluYXRlKGNvb3JkKTtcbiAgICAgIGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIGdldENvb3JkaW5hdGVCeUluZGV4KGluZGV4KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaGFzU2hpcCgpIHtcbiAgICAgICAgaWYgKG1hcC5zbGljZSgpW2luZGV4XS5zaGlwKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBpc0hpdCgpIHtcbiAgICAgICAgaWYgKG1hcC5zbGljZSgpW2luZGV4XS5oaXQpIHJldHVybiB0cnVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNldEhpdCgpIHtcbiAgICAgICAgbWFwW2luZGV4XS5oaXQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBoYXNNaXNzZWQoKSB7XG4gICAgICAgIGlmIChtYXAuc2xpY2UoKVtpbmRleF0ubWlzcykgcmV0dXJuIHRydWU7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2V0TWlzc2VkKCkge1xuICAgICAgICBtYXBbaW5kZXhdLm1pc3MgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzZXRPY2N1cGllZChib29sKSB7XG4gICAgICAgIG1hcFtpbmRleF0ub2NjdXBpZWQgPSBib29sO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBpc09jY3VwaWVkKCkge1xuICAgICAgICBpZiAobWFwLnNsaWNlKClbaW5kZXhdLm9jY3VwaWVkKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzZXRTaGlwKHNocCkge1xuICAgICAgICBpZiAoaGFzU2hpcCgpIHx8IGlzT2NjdXBpZWQoKSkgcmV0dXJuO1xuICAgICAgICBtYXBbaW5kZXhdLnNoaXAgPSBzaHA7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNoaXAoKSB7XG4gICAgICAgIGlmICghaGFzU2hpcCgpKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBpcyBub3QgYSBzaGlwIG9uIHRoaXMgdGlsZVwiKTtcbiAgICAgICAgY29uc3Qgc2hwID0gbWFwLnNsaWNlKClbaW5kZXhdLnNoaXA7XG4gICAgICAgIGZ1bmN0aW9uIGdldFNoaXAoKSB7XG4gICAgICAgICAgcmV0dXJuIHNocDtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRMb2coKSB7XG4gICAgICAgICAgcmV0dXJuIHN0cmlwSW5kZW50c2BcbiAgICAgICAgICBUaGVyZSBpcyBhIHNoaXAgYXQgJHtzaHAuZ2V0Q29vcmRpbmF0ZXMoKX1cbiAgICAgICAgICBSb3c6ICR7c2hwLnJvd31cbiAgICAgICAgICBDb2x1bW46ICR7c2hwLmNvbH1cbiAgICAgICAgICBTaXplOiAke3NocC5nZXRTaXplKCl9XG4gICAgICAgICAgQXhpczogJHtzaHAuZ2V0QXhpcygpfVxuICAgICAgICAgIEFsaXZlOiAkeyFzaHAuaXNTdW5rKCl9XG4gICAgICAgICAgYDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBnZXRTaGlwLCBnZXRMb2cgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0LFxuICAgICAgICBzZXRPY2N1cGllZCxcbiAgICAgICAgc2V0U2hpcCxcbiAgICAgICAgaGFzU2hpcCxcbiAgICAgICAgc2hpcCxcbiAgICAgICAgaXNIaXQsXG4gICAgICAgIHNldEhpdCxcbiAgICAgICAgaGFzTWlzc2VkLFxuICAgICAgICBzZXRNaXNzZWQsXG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEZyZWVTcGFjZXMoKSB7XG4gICAgICByZXR1cm4gbWFwLnNsaWNlKCkuZmlsdGVyKCh2YWx1ZSkgPT4gIXZhbHVlLnNoaXAgJiYgIXZhbHVlLm9jY3VwaWVkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhbGxTaGlwcygpIHtcbiAgICAgIGNvbnN0IGFyciA9IG1hcC5zbGljZSgpLmZpbHRlcigodmFsdWUpID0+IHZhbHVlLnNoaXApO1xuXG4gICAgICBjb25zdCBnZXRBbGwgPSAoKSA9PiBhcnI7XG4gICAgICBjb25zdCBsb2cgPSAoKSA9PiBsb2dBcnJheXMoYXJyKTtcbiAgICAgIGNvbnN0IHN1bmsgPSAoKSA9PlxuICAgICAgICBhcnIuZmlsdGVyKCh2YWx1ZSkgPT4gIXZhbHVlLnNoaXAuaXNTdW5rKCkpLmxlbmd0aCA9PT0gMDtcblxuICAgICAgcmV0dXJuIHsgZ2V0QWxsLCBsb2csIHN1bmsgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc3BhY2UsXG4gICAgICBnZXREaWN0aW9uYXJ5LFxuICAgICAgZ2V0RnJlZVNwYWNlcyxcbiAgICAgIGFsbFNoaXBzLFxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBnZXRTaXplKCkge1xuICAgIHJldHVybiBzaXplO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VmFsaWRDb29yZHMoc2hpcFNpemUpIHtcbiAgICBmdW5jdGlvbiB2ZXJ0aWNhbCgpIHtcbiAgICAgIGNvbnN0IG1hcERhdGEgPSBnZXRNYXBEYXRhKCk7XG4gICAgICBjb25zdCBmcmVlU3BhY2VBcnIgPSBtYXBEYXRhLmdldEZyZWVTcGFjZXMoKTtcbiAgICAgIGNvbnN0IHZlcnRpY2FsRnJlZVNwYWNlQXJyID0gbWFwRGF0YS5nZXREaWN0aW9uYXJ5KGZyZWVTcGFjZUFycikuY29sdW1ucztcbiAgICAgIGNvbnN0IHN0YXJ0aW5nWVBvc0FyciA9IFtdO1xuXG4gICAgICBmdW5jdGlvbiBnZXRWZXJ0aWNhbERpZmYoY29sdW1uLCBqLCBrKSB7XG4gICAgICAgIGlmIChqICsgayA+PSBjb2x1bW4ubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGNvbnN0IGRpZmYgPSBkaWZmZXJlbmNlKGNvbHVtbltqXS55LCBjb2x1bW5baiArIGtdLnkpO1xuICAgICAgICBjb25zdCBsb2cgPSB7XG4gICAgICAgICAgc2hpcFN0YXJ0OiBjb2x1bW5bal0sXG4gICAgICAgICAgc2hpcEVuZDogY29sdW1uW2ogKyBrXSxcbiAgICAgICAgICBkaWZmLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoZGlmZiA9PT0gc2hpcFNpemUgLSAxKSByZXR1cm4geyB2YWxpZDogdHJ1ZSwgbG9nIH07XG4gICAgICAgIHJldHVybiB7IHZhbGlkOiBmYWxzZSB9O1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZlcnRpY2FsRnJlZVNwYWNlQXJyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IGNvbHVtbiA9IHZlcnRpY2FsRnJlZVNwYWNlQXJyW2ldO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbHVtbi5sZW5ndGg7IGogKz0gMSkge1xuICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgc2hpcFNpemU7IGsgKz0gMSkge1xuICAgICAgICAgICAgaWYgKGdldFZlcnRpY2FsRGlmZihjb2x1bW4sIGosIGspLnZhbGlkKSB7XG4gICAgICAgICAgICAgIHN0YXJ0aW5nWVBvc0Fyci5wdXNoKGNvbHVtbltqXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RhcnRpbmdZUG9zQXJyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhvcml6b250YWwoKSB7XG4gICAgICBjb25zdCBtYXBEYXRhID0gZ2V0TWFwRGF0YSgpO1xuICAgICAgY29uc3QgZnJlZVNwYWNlQXJyID0gbWFwRGF0YS5nZXRGcmVlU3BhY2VzKCk7XG4gICAgICBjb25zdCBzdGFydGluZ1hQb3NBcnIgPSBbXTtcbiAgICAgIGZ1bmN0aW9uIGdldEhvcml6b250YWxEaWZmKGksIGspIHtcbiAgICAgICAgaWYgKGkgKyBrID49IGZyZWVTcGFjZUFyci5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAgICAgY29uc3QgZGlmZiA9IGRpZmZlcmVuY2UoZnJlZVNwYWNlQXJyW2ldLngsIGZyZWVTcGFjZUFycltpICsga10ueCk7XG4gICAgICAgIGNvbnN0IGxvZyA9IHtcbiAgICAgICAgICBzaGlwU3RhcnQ6IGZyZWVTcGFjZUFycltpXSxcbiAgICAgICAgICBzaGlwRW5kOiBmcmVlU3BhY2VBcnJbaSArIGtdLFxuICAgICAgICAgIGRpZmYsXG4gICAgICAgIH07XG4gICAgICAgIGlmIChkaWZmID09PSBzaGlwU2l6ZSAtIDEpIHJldHVybiB7IHZhbGlkOiB0cnVlLCBsb2cgfTtcbiAgICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlIH07XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJlZVNwYWNlQXJyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgc2hpcFNpemU7IGsgKz0gMSkge1xuICAgICAgICAgIGlmIChnZXRIb3Jpem9udGFsRGlmZihpLCBrKS52YWxpZCkge1xuICAgICAgICAgICAgc3RhcnRpbmdYUG9zQXJyLnB1c2goZnJlZVNwYWNlQXJyW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0YXJ0aW5nWFBvc0FycjtcbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZyh7IHN0YXJ0aW5nWFBvc0Fyciwgc3RhcnRpbmdZUG9zQXJyIH0pO1xuXG4gICAgcmV0dXJuIHsgdmVydGljYWwsIGhvcml6b250YWwgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldE9jY3VwaWVkU3BhY2Uoc2hpcCkge1xuICAgIGNvbnN0IG1hcERhdGEgPSBnZXRNYXBEYXRhKCk7XG4gICAgY29uc3QgY29vcmRzID0gc2hpcC5nZXRDb29yZGluYXRlcygpO1xuICAgIGNvbnN0IHN0YXJ0ID0gY29vcmRzWzBdO1xuICAgIGNvbnN0IGVuZCA9IGNvb3Jkc1tjb29yZHMubGVuZ3RoIC0gMV07XG5cbiAgICBmdW5jdGlvbiBnZXRWZXJ0aWNhbCgpIHtcbiAgICAgIGxldCBhZGphY2VudE9jY3VwaWVkU3BhY2VWZXJ0aWNhbCA9IFtcbiAgICAgICAgW3N0YXJ0LngsIHN0YXJ0LnkgLSAxXSxcbiAgICAgICAgW3N0YXJ0LnggKyAxLCBzdGFydC55IC0gMV0sXG4gICAgICAgIFtzdGFydC54IC0gMSwgc3RhcnQueSAtIDFdLFxuXG4gICAgICAgIFtlbmQueCwgZW5kLnkgKyAxXSxcbiAgICAgICAgW2VuZC54IC0gMSwgZW5kLnkgKyAxXSxcbiAgICAgICAgW2VuZC54ICsgMSwgZW5kLnkgKyAxXSxcbiAgICAgIF07XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29vcmRzLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgIGFkamFjZW50T2NjdXBpZWRTcGFjZVZlcnRpY2FsLnB1c2goW2Nvb3Jkc1tqXS54ICsgMSwgY29vcmRzW2pdLnldKTtcbiAgICAgICAgYWRqYWNlbnRPY2N1cGllZFNwYWNlVmVydGljYWwucHVzaChbY29vcmRzW2pdLnggLSAxLCBjb29yZHNbal0ueV0pO1xuICAgICAgfVxuXG4gICAgICBhZGphY2VudE9jY3VwaWVkU3BhY2VWZXJ0aWNhbCA9IGFkamFjZW50T2NjdXBpZWRTcGFjZVZlcnRpY2FsLmZpbHRlcihcbiAgICAgICAgKHZhbHVlKSA9PlxuICAgICAgICAgICEodmFsdWVbMF0gPiBzaXplIC0gMSkgJiZcbiAgICAgICAgICAhKHZhbHVlWzFdID4gc2l6ZSAtIDEpICYmXG4gICAgICAgICAgISh2YWx1ZVswXSA8IDApICYmXG4gICAgICAgICAgISh2YWx1ZVsxXSA8IDApXG4gICAgICApO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFkamFjZW50T2NjdXBpZWRTcGFjZVZlcnRpY2FsLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIG1hcERhdGEuc3BhY2UoYWRqYWNlbnRPY2N1cGllZFNwYWNlVmVydGljYWxbaV0pLnNldE9jY3VwaWVkKHRydWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFkamFjZW50T2NjdXBpZWRTcGFjZVZlcnRpY2FsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEhvcml6b250YWwoKSB7XG4gICAgICBsZXQgYWRqYWNlbnRPY2N1cGllZFNwYWNlSG9yaXpvbnRhbCA9IFtcbiAgICAgICAgW3N0YXJ0LnggLSAxLCBzdGFydC55XSxcbiAgICAgICAgW3N0YXJ0LnggLSAxLCBzdGFydC55ICsgMV0sXG4gICAgICAgIFtzdGFydC54IC0gMSwgc3RhcnQueSAtIDFdLFxuXG4gICAgICAgIFtlbmQueCArIDEsIGVuZC55XSxcbiAgICAgICAgW2VuZC54ICsgMSwgZW5kLnkgKyAxXSxcbiAgICAgICAgW2VuZC54ICsgMSwgZW5kLnkgLSAxXSxcbiAgICAgIF07XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29vcmRzLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgIGFkamFjZW50T2NjdXBpZWRTcGFjZUhvcml6b250YWwucHVzaChbY29vcmRzW2pdLngsIGNvb3Jkc1tqXS55ICsgMV0pO1xuICAgICAgICBhZGphY2VudE9jY3VwaWVkU3BhY2VIb3Jpem9udGFsLnB1c2goW2Nvb3Jkc1tqXS54LCBjb29yZHNbal0ueSAtIDFdKTtcbiAgICAgIH1cblxuICAgICAgYWRqYWNlbnRPY2N1cGllZFNwYWNlSG9yaXpvbnRhbCA9IGFkamFjZW50T2NjdXBpZWRTcGFjZUhvcml6b250YWwuZmlsdGVyKFxuICAgICAgICAodmFsdWUpID0+XG4gICAgICAgICAgISh2YWx1ZVswXSA+IHNpemUgLSAxKSAmJlxuICAgICAgICAgICEodmFsdWVbMV0gPiBzaXplIC0gMSkgJiZcbiAgICAgICAgICAhKHZhbHVlWzBdIDwgMCkgJiZcbiAgICAgICAgICAhKHZhbHVlWzFdIDwgMClcbiAgICAgICk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWRqYWNlbnRPY2N1cGllZFNwYWNlSG9yaXpvbnRhbC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBtYXBEYXRhLnNwYWNlKGFkamFjZW50T2NjdXBpZWRTcGFjZUhvcml6b250YWxbaV0pLnNldE9jY3VwaWVkKHRydWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFkamFjZW50T2NjdXBpZWRTcGFjZUhvcml6b250YWw7XG4gICAgfVxuXG4gICAgaWYgKHNoaXAuZ2V0QXhpcygpID09PSBcInhcIikge1xuICAgICAgcmV0dXJuIGdldEhvcml6b250YWwoKTtcbiAgICB9XG4gICAgaWYgKHNoaXAuZ2V0QXhpcygpID09PSBcInlcIikge1xuICAgICAgcmV0dXJuIGdldFZlcnRpY2FsKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2VTaGlwUGFydChjb29yZHMsIHNoaXApIHtcbiAgICBnZXRNYXBEYXRhKCkuc3BhY2UoY29vcmRzKS5zZXRTaGlwKHNoaXApO1xuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2VTaGlwKGNvb3Jkcywgc2hpcFNpemUsIGF4aXMpIHtcbiAgICBpZiAoYXhpcyAhPT0gXCJ4XCIgJiYgYXhpcyAhPT0gXCJ5XCIpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTaGlwIG11c3QgaGF2ZSBhIHZhbGlkIGRpcmVjdGlvblwiKTtcbiAgICBpZiAoYXhpcyA9PT0gXCJ4XCIpIHtcbiAgICAgIGlmIChzaGlwU2l6ZSArIGNvb3Jkc1swXSA+IHNpemUpIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGF4aXMgPT09IFwieVwiKSB7XG4gICAgICBpZiAoc2hpcFNpemUgKyBjb29yZHNbMV0gPiBzaXplKSByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2hpcCA9IFNoaXAoc2hpcFNpemUsIGF4aXMpO1xuXG4gICAgY29uc3QgYXJyYXlDb3JkcyA9IFtdO1xuICAgIGNvbnN0IG1hcERhdGEgPSBnZXRNYXBEYXRhKCk7XG4gICAgbGV0IGNvcmREYXRhO1xuXG4gICAgZnVuY3Rpb24gcHVzaENvb3JkRGF0YUludG9TaGlwKGRhdGEpIHtcbiAgICAgIGNvbnN0IG1hcENvb3Jkc0Nsb25lID0gSlNPTi5wYXJzZShcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkobWFwRGF0YS5zcGFjZShkYXRhKS5nZXQoKSlcbiAgICAgICk7XG4gICAgICBkZWxldGUgbWFwQ29vcmRzQ2xvbmUuc2hpcDtcbiAgICAgIGFycmF5Q29yZHMucHVzaChtYXBDb29yZHNDbG9uZSk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2hwU2l6ZSA9IHNoaXAuZ2V0U2l6ZSgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaHBTaXplOyBpICs9IDEpIHtcbiAgICAgIGlmIChzaGlwLmdldEF4aXMoKSA9PT0gXCJ4XCIpIHtcbiAgICAgICAgaWYgKGNvb3Jkc1swXSArIHNocFNpemUgPD0gc2l6ZSkge1xuICAgICAgICAgIGNvcmREYXRhID0gW2Nvb3Jkc1swXSArIGksIGNvb3Jkc1sxXV07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoc2hpcC5nZXRBeGlzKCkgPT09IFwieVwiKSB7XG4gICAgICAgIGlmIChjb29yZHNbMV0gKyBzaHBTaXplIDw9IHNpemUpIHtcbiAgICAgICAgICBjb3JkRGF0YSA9IFtjb29yZHNbMF0sIGNvb3Jkc1sxXSArIGldO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgY29yZERhdGEgPT09IFwidW5kZWZpbmVkXCIgfHwgY29yZERhdGEgPT09IG51bGwpIHtcbiAgICAgICAgY29uc29sZS5sb2coeyBjb29yZHMsIGF4aXMsIHNoaXBTaXplIH0pO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb29yZGluYXRlcyBtdXN0IG5vdCBiZSBudWxsIG9yIHVuZGVmaW5lZFwiKTtcbiAgICAgIH1cblxuICAgICAgcGxhY2VTaGlwUGFydChjb3JkRGF0YSwgc2hpcCk7XG4gICAgICBwdXNoQ29vcmREYXRhSW50b1NoaXAoY29yZERhdGEpO1xuICAgIH1cblxuICAgIHNoaXAuc2V0Q29vcmRpbmF0ZXMoYXJyYXlDb3Jkcyk7XG4gICAgc2V0T2NjdXBpZWRTcGFjZShzaGlwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY2VpdmVBdHRhY2soY29vcmRzKSB7XG4gICAgY29uc3QgbWFwRGF0YSA9IGdldE1hcERhdGEoKTtcbiAgICBpZiAobWFwRGF0YS5zcGFjZShjb29yZHMpLmhhc01pc3NlZCgpIHx8IG1hcERhdGEuc3BhY2UoY29vcmRzKS5pc0hpdCgpKVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgaWYgKG1hcERhdGEuc3BhY2UoY29vcmRzKS5oYXNTaGlwKCkpIHtcbiAgICAgIGNvbnN0IHNocCA9IG1hcERhdGEuc3BhY2UoY29vcmRzKS5zaGlwKCkuZ2V0U2hpcCgpO1xuICAgICAgc2hwLmhpdCgpO1xuICAgICAgbWFwRGF0YS5zcGFjZShjb29yZHMpLnNldEhpdCgpO1xuICAgICAgaWYgKHNocC5pc1N1bmsoKSAmJiAhbWFwRGF0YS5hbGxTaGlwcygpLnN1bmsoKSkge1xuICAgICAgICByZXR1cm4geyBzdW5rOiBzaHAuaXNTdW5rKCksIHNoaXBDb3Jkczogc2hwLmdldENvb3JkaW5hdGVzKCkgfTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXBEYXRhLmFsbFNoaXBzKCkuc3VuaygpKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN1bms6IHNocC5pc1N1bmsoKSxcbiAgICAgICAgICBnYW1lb3ZlcjogdHJ1ZSxcbiAgICAgICAgICBzaGlwQ29yZHM6IHNocC5nZXRDb29yZGluYXRlcygpLFxuICAgICAgICB9O1xuICAgICAgcmV0dXJuIHsgaGl0OiBtYXBEYXRhLnNwYWNlKGNvb3JkcykuaXNIaXQoKSB9O1xuICAgIH1cbiAgICBtYXBEYXRhLnNwYWNlKGNvb3Jkcykuc2V0TWlzc2VkKCk7XG4gICAgcmV0dXJuIHsgbWlzczogbWFwRGF0YS5zcGFjZShjb29yZHMpLmhhc01pc3NlZCgpIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldFNpemUsXG4gICAgcGxhY2VTaGlwLFxuICAgIHBsYWNlU2hpcFBhcnQsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICBnZXRNYXBEYXRhLFxuICAgIGdldFZhbGlkQ29vcmRzLFxuICB9O1xufTtcblxuY29uc3QgUGxheWVyID0gKHRhYmxlUXVlcnlTZWxlY3RvcikgPT4ge1xuICBjb25zdCBnYW1lQnJkID0gR2FtZWJvYXJkKCk7XG4gIGNvbnN0IHBsYXlhYmxlU2hpcHMgPSBbXG4gICAgeyBzaXplOiAxLCBob3dNYW55OiA0IH0sXG4gICAgeyBzaXplOiAyLCBob3dNYW55OiAzIH0sXG4gICAgeyBzaXplOiAzLCBob3dNYW55OiAyIH0sXG4gICAgeyBzaXplOiA0LCBob3dNYW55OiAxIH0sXG4gIF07XG4gIGNvbnN0IHRhYmxlID0gVGFibGUoMTAsIHRhYmxlUXVlcnlTZWxlY3Rvcik7XG4gIGxldCB0dXJuID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gc2V0VHVybihib29sKSB7XG4gICAgdHVybiA9IGJvb2w7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUdXJuKCkge1xuICAgIHJldHVybiB0dXJuO1xuICB9XG5cbiAgLy8gVE9ETyB3cml0ZSB0ZXN0IHRoYXQgbXVsdGlwbGVzIHRoZSBzaXplIGJ5IGhvd01hbnkgYW5kIGV4cGVjdCB3aXRoIHRoZSBkZWZhdWx0IGJvYXJkIHNpemVcbiAgLy8gYW5kIHBsYXlhYmxlIHNoaXBzXG4gIC8vIGl0IHdpbGwgZXF1YWwgMjBcblxuICByZXR1cm4geyBnYW1lQnJkLCBwbGF5YWJsZVNoaXBzLCB0YWJsZSwgc2V0VHVybiwgZ2V0VHVybiB9O1xufTtcblxuLy8gYnkgZGVmYXVsdCB0aGUgZ2FtZSB3aWxsIGhhdmUgMTAgc2hpcHMgb24gYSBncmlkIHdpdGggYSBzaXplIG9mIDEwXG5jb25zdCBHYW1lID0gKCkgPT4ge1xuICBjb25zdCBzZWxmID0gUGxheWVyKFwiLmJhdHRsZWZpZWxkLXNlbGZcIik7XG4gIGNvbnN0IHJpdmFsID0gUGxheWVyKFwiLmJhdHRsZWZpZWxkLXJpdmFsXCIpO1xuICBjb25zdCBwbGF5ZXJzID0gW3NlbGYsIHJpdmFsXTtcblxuICBzZWxmLnNldFR1cm4odHJ1ZSk7XG5cbiAgZnVuY3Rpb24gZ2V0VHVybigpIHtcbiAgICBsZXQgY3VycmVudFR1cm47XG4gICAgbGV0IG5leHRUdXJuO1xuICAgIHBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmdldFR1cm4oKSkge1xuICAgICAgICBjdXJyZW50VHVybiA9IHBsYXllcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5leHRUdXJuID0gcGxheWVyO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB7IGN1cnJlbnRUdXJuLCBuZXh0VHVybiB9O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UmVtYWluaW5nU2hpcHNUb1BsYWNlKHBsYXllcikge1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXIucGxheWFibGVTaGlwcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY291bnQgKz0gcGxheWVyLnBsYXlhYmxlU2hpcHNbaV0uaG93TWFueTtcbiAgICB9XG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG5cbiAgZnVuY3Rpb24gcmFuZG9tKHBsYXllcikge1xuICAgIHdoaWxlIChnZXRSZW1haW5pbmdTaGlwc1RvUGxhY2UocGxheWVyKSA+IDApIHtcbiAgICAgIGNvbnN0IHBsYXlhYmxlU2hpcHMgPSBwbGF5ZXIucGxheWFibGVTaGlwcy5maWx0ZXIoXG4gICAgICAgICh2YWx1ZSkgPT4gdmFsdWUuaG93TWFueSA+IDBcbiAgICAgICk7XG4gICAgICBjb25zdCBwbGF5YWJsZVNoaXBJbmRleCA9IE1hdGguZmxvb3IoXG4gICAgICAgIE1hdGgucmFuZG9tKCkgKiBwbGF5YWJsZVNoaXBzLmxlbmd0aFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHNoaXBTaXplID0gcGxheWFibGVTaGlwc1twbGF5YWJsZVNoaXBJbmRleF0uc2l6ZTtcblxuICAgICAgY29uc3QgcmFuZEF4aXMgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcblxuICAgICAgbGV0IGF4aXM7XG4gICAgICBsZXQgdmFsaWRTdGFydGluZ1Bvc2l0aW9ucztcblxuICAgICAgaWYgKHJhbmRBeGlzID09PSAwKSB7XG4gICAgICAgIGF4aXMgPSBcInhcIjtcbiAgICAgICAgdmFsaWRTdGFydGluZ1Bvc2l0aW9ucyA9IHBsYXllci5nYW1lQnJkXG4gICAgICAgICAgLmdldFZhbGlkQ29vcmRzKHNoaXBTaXplKVxuICAgICAgICAgIC5ob3Jpem9udGFsKCk7XG4gICAgICB9XG4gICAgICBpZiAocmFuZEF4aXMgPT09IDEpIHtcbiAgICAgICAgYXhpcyA9IFwieVwiO1xuICAgICAgICB2YWxpZFN0YXJ0aW5nUG9zaXRpb25zID0gcGxheWVyLmdhbWVCcmRcbiAgICAgICAgICAuZ2V0VmFsaWRDb29yZHMoc2hpcFNpemUpXG4gICAgICAgICAgLnZlcnRpY2FsKCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvb3JkSW5kZXggPSBNYXRoLmZsb29yKFxuICAgICAgICBNYXRoLnJhbmRvbSgpICogdmFsaWRTdGFydGluZ1Bvc2l0aW9ucy5sZW5ndGhcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IGdldFRhcmdldCA9ICgpID0+IHZhbGlkU3RhcnRpbmdQb3NpdGlvbnNbY29vcmRJbmRleF07XG5cbiAgICAgIGxldCB0YXJnZXQgPSBnZXRUYXJnZXQoKTtcbiAgICAgIHdoaWxlICh0YXJnZXQgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT09IG51bGwpIHtcbiAgICAgICAgdGFyZ2V0ID0gZ2V0VGFyZ2V0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxvZyA9IHtcbiAgICAgICAgcGxheWFibGVTaGlwczogcGxheWVyLnBsYXlhYmxlU2hpcHMsXG4gICAgICAgIHRhcmdldCxcbiAgICAgICAgYXhpcyxcbiAgICAgICAgc2hpcFNpemUsXG4gICAgICAgIHJlbWFpbmluZ1NoaXBzOiBnZXRSZW1haW5pbmdTaGlwc1RvUGxhY2UocGxheWVyKSxcbiAgICAgICAgdmFsaWRTdGFydGluZ1Bvc2l0aW9ucyxcbiAgICAgICAgY29vcmRJbmRleCxcbiAgICAgIH07XG5cbiAgICAgIGNvbnNvbGUubG9nKGxvZyk7XG4gICAgICBwbGF5ZXIuZ2FtZUJyZC5wbGFjZVNoaXAoW3RhcmdldC54LCB0YXJnZXQueV0sIHNoaXBTaXplLCBheGlzKTtcblxuICAgICAgcGxheWFibGVTaGlwc1twbGF5YWJsZVNoaXBJbmRleF0uaG93TWFueSAtPSAxO1xuICAgIH1cbiAgICBpZiAoZ2V0UmVtYWluaW5nU2hpcHNUb1BsYWNlKHBsYXllcikgPT09IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKFwic3VjY2Vzc1wiKTtcbiAgICB9XG4gIH1cblxuICByYW5kb20oc2VsZik7XG4gIHJhbmRvbShyaXZhbCk7XG5cbiAgcmV0dXJuIHsgc2VsZiwgcml2YWwsIGdldFR1cm4gfTtcbn07XG5cbmV4cG9ydCB7IEdhbWUsIFNoaXAgfTtcbiIsImltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi9iYXR0bGVzaGlwXCI7XG5pbXBvcnQgeyByZW5kZXJOb3RpZmljYXRpb24gfSBmcm9tIFwiLi9ET01cIjtcblxuY29uc3QgZ2FtZSA9IEdhbWUoKTtcbmdhbWUuc2VsZi50YWJsZS5yZW5kZXIoKTtcbmdhbWUucml2YWwudGFibGUucmVuZGVyKCk7XG5nYW1lLnNlbGYudGFibGUudXBkYXRlKGdhbWUuc2VsZi5nYW1lQnJkLmdldE1hcERhdGEoKS5hbGxTaGlwcygpLmdldEFsbCgpKTtcbmdhbWUucml2YWwudGFibGUudXBkYXRlKGdhbWUucml2YWwuZ2FtZUJyZC5nZXRNYXBEYXRhKCkuYWxsU2hpcHMoKS5nZXRBbGwoKSk7XG5cbmdhbWUuZ2V0VHVybigpLm5leHRUdXJuLnRhYmxlLnRvZ2dsZUF0dGFja0N1cnNvcigpO1xucmVuZGVyTm90aWZpY2F0aW9uKFwiSXQgaXMgeW91ciB0dXJuLCBjbGljayBvbiB5b3VyIFJpdmFscyBib2FyZCB0byBhdHRhY2tcIik7XG5nYW1lLmdldFR1cm4oKS5jdXJyZW50VHVybi50YWJsZS50b2dnbGVEaXNhYmxlZCgpO1xuZ2FtZS5nZXRUdXJuKCkubmV4dFR1cm4udGFibGUuYWRkQXR0YWNrRXZlbnRMaXN0ZW5lcigoZSkgPT4ge1xuICBjb25zdCB4ID0gTnVtYmVyKGUuY3VycmVudFRhcmdldC5kYXRhc2V0LngpO1xuICBjb25zdCB5ID0gTnVtYmVyKGUuY3VycmVudFRhcmdldC5kYXRhc2V0LnkpO1xuICBjb25zdCBhdHRhY2sgPSBnYW1lLmdldFR1cm4oKS5uZXh0VHVybi5nYW1lQnJkLnJlY2VpdmVBdHRhY2soW3gsIHldKTtcbiAgY29uc29sZS5sb2coYXR0YWNrKTtcbiAgaWYgKGF0dGFjayAhPT0gbnVsbClcbiAgICBnYW1lLmdldFR1cm4oKS5uZXh0VHVybi50YWJsZS5yZW5kZXJBdHRhY2tSZXN1bHQoYXR0YWNrLCBbeCwgeV0pO1xufSk7XG4iLCJmdW5jdGlvbiBsb2dBcnJheXMoLi4uYXJyKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBhcnJbaV0ubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgIGNvbnNvbGUubG9nKGFycltpXVtqXSk7XG4gICAgfVxuICB9XG59XG5cbi8vIHVzZSBteSB1dGlsaXR5IGZ1bmN0aW9uISA6RFxuXG5mdW5jdGlvbiBkaWZmZXJlbmNlKG51bTEsIG51bTIpIHtcbiAgcmV0dXJuIE1hdGguYWJzKG51bTEgLSBudW0yKTtcbn1cblxuZXhwb3J0IHsgbG9nQXJyYXlzLCBkaWZmZXJlbmNlIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9tb2R1bGVzL0RPTS5qc1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9tb2R1bGVzL2JhdHRsZXNoaXAuanNcIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvbW9kdWxlcy91dGlsaXR5LmpzXCIpO1xudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvbW9kdWxlcy9tYWluLmpzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9