"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsonSchema = exports.getDealSchema = void 0;
var _zodFormData = require("zod-form-data");
var _zod = require("zod");
var _zodToJsonSchema = require("zod-to-json-schema");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Allowed file types for the deal logo.
 * @type {readonly string[]}
 */
var allowedFileTypes = ['jpg', 'jpeg', 'png', 'gif'];

/**
 * Enum values for the deal category.
 * @type {readonly string[]}
 */
var categoryEnum = ['foodDrink', 'bathroom', 'jewelery', 'sports', 'tech', 'auto', 'entertainment', 'travel'];

/**
 * Common schema object.
 * @type {object}
 */
var commonSchemaObject = {
  merchantId: _zodFormData.zfd.text(_zod.z.string().min(1, 'Merchant ID is required')),
  title: _zodFormData.zfd.text(_zod.z.string().max(255, 'Title must be 255 characters or less')),
  originalPrice: _zodFormData.zfd.text(_zod.z.coerce.number().min(0, 'Original Price must be a positive number')),
  discount: _zodFormData.zfd.text(_zod.z.coerce.number().min(0, 'Discount must be at least 0').max(100, 'Discount cannot exceed 100')),
  logo: _zodFormData.zfd.file(_zod.z["instanceof"](File).refine(function (file) {
    var fileType = file.name.split('.').pop().toLowerCase();
    return allowedFileTypes.includes(fileType);
  }, 'Invalid file type')),
  category: _zodFormData.zfd.text(_zod.z["enum"](categoryEnum, 'Category is required'))
};

/**
 * Returns the deal schema with dynamic validation for expiration date.
 * @returns {import('zod').ZodType<DealFormSchema>}
 */
var getDealSchema = exports.getDealSchema = function getDealSchema() {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return _zodFormData.zfd.formData(_objectSpread(_objectSpread({}, commonSchemaObject), {}, {
    expiration: _zodFormData.zfd.text(_zod.z.string().refine(function (val) {
      return !isNaN(Date.parse(val)) && new Date(val) >= today;
    }, 'Expiration must be today\'s date or later'))
  }));
};

/**
 * Static schema for API Gateway validation.
 * This schema doesn't include the dynamic check for expiration date.
 */
var staticDealSchema = _zodFormData.zfd.formData(_objectSpread(_objectSpread({}, commonSchemaObject), {}, {
  expiration: _zodFormData.zfd.text(_zod.z.string().refine(function (val) {
    return !isNaN(Date.parse(val));
  }, 'Expiration must be a valid date'))
}));

/**
 * JSON schema for the deal.
 */
var jsonSchema = exports.jsonSchema = (0, _zodToJsonSchema.zodToJsonSchema)(staticDealSchema, {
  $refStrategy: 'none',
  target: 'openApi3'
});