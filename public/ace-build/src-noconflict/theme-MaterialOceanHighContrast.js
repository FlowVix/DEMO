ace.define("ace/theme/MaterialOceanHighContrast",[], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace--material-ocean-high-contrast";
exports.cssText = ".ace--material-ocean-high-contrast .ace_gutter {\
background: #0F111A;\
color: rgb(79,82,94)\
}\
.ace--material-ocean-high-contrast .ace_print-margin {\
width: 1px;\
background: #e8e8e8\
}\
.ace--material-ocean-high-contrast {\
background-color: #0F111A;\
color: #8F93A2\
}\
.ace--material-ocean-high-contrast .ace_cursor {\
color: #FFCC00\
}\
.ace--material-ocean-high-contrast .ace_marker-layer .ace_selection {\
background: rgba(113, 124, 180, 0.31)\
}\
.ace--material-ocean-high-contrast.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #0F111A;\
border-radius: 2px\
}\
.ace--material-ocean-high-contrast .ace_marker-layer .ace_step {\
background: rgb(198, 219, 174)\
}\
.ace--material-ocean-high-contrast .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgba(143, 147, 162, 0.25)\
}\
.ace--material-ocean-high-contrast .ace_marker-layer .ace_active-line {\
background: rgba(0, 0, 0, 0.31)\
}\
.ace--material-ocean-high-contrast .ace_gutter-active-line {\
background-color: rgba(0, 0, 0, 0.31)\
}\
.ace--material-ocean-high-contrast .ace_marker-layer .ace_selected-word {\
border: 1px solid rgba(113, 124, 180, 0.31)\
}\
.ace--material-ocean-high-contrast .ace_fold {\
background-color: #82AAFF;\
border-color: #8F93A2\
}\
.ace--material-ocean-high-contrast .ace_keyword {\
color: #C792EA\
}\
.ace--material-ocean-high-contrast .ace_keyword.ace_other.ace_unit {\
color: #F78C6C\
}\
.ace--material-ocean-high-contrast .ace_constant.ace_language {\
color: #F78C6C\
}\
.ace--material-ocean-high-contrast .ace_constant.ace_numeric {\
color: #F78C6C\
}\
.ace--material-ocean-high-contrast .ace_constant.ace_character {\
color: #F78C6C\
}\
.ace--material-ocean-high-contrast .ace_constant.ace_character.ace_escape {\
color: #89DDFF\
}\
.ace--material-ocean-high-contrast .ace_support.ace_function {\
color: #82AAFF\
}\
.ace--material-ocean-high-contrast .ace_support.ace_constant {\
color: #F78C6C\
}\
.ace--material-ocean-high-contrast .ace_support.ace_class {\
color: #FFCB6B\
}\
.ace--material-ocean-high-contrast .ace_support.ace_type {\
color: #B2CCD6\
}\
.ace--material-ocean-high-contrast .ace_storage.ace_type {\
color: #C792EA\
}\
.ace--material-ocean-high-contrast .ace_invalid {\
color: #FF5370\
}\
.ace--material-ocean-high-contrast .ace_invalid.ace_illegal {\
color: #FF5370\
}\
.ace--material-ocean-high-contrast .ace_invalid.ace_deprecated {\
color: #C792EA\
}\
.ace--material-ocean-high-contrast .ace_string {\
color: #C3E88D\
}\
.ace--material-ocean-high-contrast .ace_string.ace_regexp {\
color: #89DDFF\
}\
.ace--material-ocean-high-contrast .ace_comment {\
font-style: italic;\
color: #464B5D\
}\
.ace--material-ocean-high-contrast .ace_variable {\
color: #8F93A2\
}\
.ace--material-ocean-high-contrast .ace_variable.ace_language {\
font-style: italic;\
color: #FF5370\
}\
.ace--material-ocean-high-contrast .ace_variable.ace_parameter {\
color: #FF5370\
}\
.ace--material-ocean-high-contrast .ace_entity.ace_other.ace_attribute-name {\
font-style: italic;\
color: #C792EA\
}\
.ace--material-ocean-high-contrast .ace_entity.ace_name.ace_function {\
color: #82AAFF\
}\
.ace--material-ocean-high-contrast .ace_entity.ace_name {\
color: #FFCB6B\
}\
.ace--material-ocean-high-contrast .ace_entity.ace_name.ace_tag {\
color: #f07178\
}\
.ace--material-ocean-high-contrast .ace_markup.ace_heading {\
color: #C3E88D\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});                (function() {
                    ace.require(["ace/theme/MaterialOceanHighContrast"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            