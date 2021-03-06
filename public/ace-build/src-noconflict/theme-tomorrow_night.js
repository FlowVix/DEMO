ace.define("ace/theme/tomorrow_night",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-tomorrow-night";
exports.cssText = ".ace-tomorrow-night .ace_gutter {\
background: #1D1F21;\
color: rgb(113,116,116)\
}\
.ace-tomorrow-night .ace_print-margin {\
width: 1px;\
background: #e8e8e8\
}\
.ace-tomorrow-night {\
background-color: #1D1F21;\
color: #C5C8C6\
}\
.ace-tomorrow-night .ace_cursor {\
color: #AEAFAD\
}\
.ace-tomorrow-night .ace_marker-layer .ace_selection {\
background: #373B41\
}\
.ace-tomorrow-night.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #1D1F21;\
border-radius: 2px\
}\
.ace-tomorrow-night .ace_marker-layer .ace_step {\
background: rgb(198, 219, 174)\
}\
.ace-tomorrow-night .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #4B4E55\
}\
.ace-tomorrow-night .ace_marker-layer .ace_active-line {\
background: #282A2E\
}\
.ace-tomorrow-night .ace_gutter-active-line {\
background-color: #282A2E\
}\
.ace-tomorrow-night .ace_marker-layer .ace_selected-word {\
border: 1px solid #373B41\
}\
.ace-tomorrow-night .ace_fold {\
background-color: #81A2BE;\
border-color: #C5C8C6\
}\
.ace-tomorrow-night .ace_keyword {\
color: #B294BB\
}\
.ace-tomorrow-night .ace_keyword.ace_operator {\
color: #8ABEB7\
}\
.ace-tomorrow-night .ace_keyword.ace_other.ace_unit {\
color: #DE935F\
}\
.ace-tomorrow-night .ace_constant.ace_language {\
color: #DE935F\
}\
.ace-tomorrow-night .ace_constant.ace_numeric {\
color: #DE935F\
}\
.ace-tomorrow-night .ace_constant.ace_character {\
color: #DE935F\
}\
.ace-tomorrow-night .ace_constant.ace_other {\
color: #CED1CF\
}\
.ace-tomorrow-night .ace_support.ace_function {\
color: #81A2BE\
}\
.ace-tomorrow-night .ace_support.ace_constant {\
color: #DE935F\
}\
.ace-tomorrow-night .ace_support.ace_class {\
color: #F0C674\
}\
.ace-tomorrow-night .ace_support.ace_type {\
color: #F0C674\
}\
.ace-tomorrow-night .ace_storage {\
color: #B294BB\
}\
.ace-tomorrow-night .ace_storage.ace_type {\
color: #B294BB\
}\
.ace-tomorrow-night .ace_invalid {\
color: #CED2CF;\
background-color: #DF5F5F\
}\
.ace-tomorrow-night .ace_invalid.ace_deprecated {\
color: #CED2CF;\
background-color: #B798BF\
}\
.ace-tomorrow-night .ace_string {\
color: #B5BD68\
}\
.ace-tomorrow-night .ace_string.ace_regexp {\
color: #CC6666\
}\
.ace-tomorrow-night .ace_comment {\
color: #969896\
}\
.ace-tomorrow-night .ace_variable {\
color: #CC6666\
}\
.ace-tomorrow-night .ace_variable.ace_parameter {\
color: #DE935F\
}\
.ace-tomorrow-night .ace_meta.ace_tag {\
color: #CC6666\
}\
.ace-tomorrow-night .ace_entity.ace_other.ace_attribute-name {\
color: #CC6666\
}\
.ace-tomorrow-night .ace_entity.ace_name.ace_function {\
color: #81A2BE\
}\
.ace-tomorrow-night .ace_entity.ace_name.ace_tag {\
color: #CC6666\
}\
.ace-tomorrow-night .ace_markup.ace_heading {\
color: #B5BD68\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
                (function() {
                    ace.require(["ace/theme/tomorrow_night"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            