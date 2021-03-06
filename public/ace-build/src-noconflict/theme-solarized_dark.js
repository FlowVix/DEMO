ace.define("ace/theme/solarized_dark",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-solarized-dark";
exports.cssText = ".ace-solarized-dark .ace_gutter {\
background: #002B36;\
color: rgb(74,102,108)\
}\
.ace-solarized-dark .ace_print-margin {\
width: 1px;\
background: #e8e8e8\
}\
.ace-solarized-dark {\
background-color: #002B36;\
color: #93A1A1\
}\
.ace-solarized-dark .ace_cursor {\
color: #D30102\
}\
.ace-solarized-dark .ace_marker-layer .ace_selection {\
background: #073642\
}\
.ace-solarized-dark.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #002B36;\
border-radius: 2px\
}\
.ace-solarized-dark .ace_marker-layer .ace_step {\
background: rgb(198, 219, 174)\
}\
.ace-solarized-dark .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgba(147, 161, 161, 0.50)\
}\
.ace-solarized-dark .ace_marker-layer .ace_active-line {\
background: #073642\
}\
.ace-solarized-dark .ace_gutter-active-line {\
background-color: #073642\
}\
.ace-solarized-dark .ace_marker-layer .ace_selected-word {\
border: 1px solid #073642\
}\
.ace-solarized-dark .ace_fold {\
background-color: #268BD2;\
border-color: #93A1A1\
}\
.ace-solarized-dark .ace_keyword {\
color: #859900\
}\
.ace-solarized-dark .ace_constant.ace_language {\
color: #B58900\
}\
.ace-solarized-dark .ace_constant.ace_numeric {\
color: #D33682\
}\
.ace-solarized-dark .ace_constant.ace_character {\
color: #CB4B16\
}\
.ace-solarized-dark .ace_constant.ace_other {\
color: #CB4B16\
}\
.ace-solarized-dark .ace_support.ace_function {\
color: #268BD2\
}\
.ace-solarized-dark .ace_support.ace_class {\
color: #859900\
}\
.ace-solarized-dark .ace_support.ace_type {\
color: #859900\
}\
.ace-solarized-dark .ace_storage {\
color: #93A1A1\
}\
.ace-solarized-dark .ace_string {\
color: #2AA198\
}\
.ace-solarized-dark .ace_string.ace_regexp {\
color: #D30102\
}\
.ace-solarized-dark .ace_comment {\
font-style: italic;\
color: #657B83\
}\
.ace-solarized-dark .ace_variable {\
color: #268BD2\
}\
.ace-solarized-dark .ace_variable.ace_language {\
color: #268BD2\
}\
.ace-solarized-dark .ace_entity.ace_other.ace_attribute-name {\
color: #93A1A1\
}\
.ace-solarized-dark .ace_entity.ace_name.ace_function {\
color: #268BD2\
}\
.ace-solarized-dark .ace_entity.ace_name.ace_tag {\
color: #268BD2\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
                (function() {
                    ace.require(["ace/theme/solarized_dark"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            