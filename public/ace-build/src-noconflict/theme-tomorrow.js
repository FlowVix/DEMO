ace.define("ace/theme/tomorrow",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = false;
exports.cssClass = "ace-tomorrow";
exports.cssText = ".ace-tomorrow .ace_gutter {\
background: #FFFFFF;\
color: rgb(166,166,166)\
}\
.ace-tomorrow .ace_print-margin {\
width: 1px;\
background: #e8e8e8\
}\
.ace-tomorrow {\
background-color: #FFFFFF;\
color: #4D4D4C\
}\
.ace-tomorrow .ace_cursor {\
color: #AEAFAD\
}\
.ace-tomorrow .ace_marker-layer .ace_selection {\
background: #D6D6D6\
}\
.ace-tomorrow.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #FFFFFF;\
border-radius: 2px\
}\
.ace-tomorrow .ace_marker-layer .ace_step {\
background: rgb(198, 219, 174)\
}\
.ace-tomorrow .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #D1D1D1\
}\
.ace-tomorrow .ace_marker-layer .ace_active-line {\
background: #EFEFEF\
}\
.ace-tomorrow .ace_gutter-active-line {\
background-color: #EFEFEF\
}\
.ace-tomorrow .ace_marker-layer .ace_selected-word {\
border: 1px solid #D6D6D6\
}\
.ace-tomorrow .ace_fold {\
background-color: #4271AE;\
border-color: #4D4D4C\
}\
.ace-tomorrow .ace_keyword {\
color: #8959A8\
}\
.ace-tomorrow .ace_keyword.ace_operator {\
color: #3E999F\
}\
.ace-tomorrow .ace_keyword.ace_other.ace_unit {\
color: #F5871F\
}\
.ace-tomorrow .ace_constant.ace_language {\
color: #F5871F\
}\
.ace-tomorrow .ace_constant.ace_numeric {\
color: #F5871F\
}\
.ace-tomorrow .ace_constant.ace_character {\
color: #F5871F\
}\
.ace-tomorrow .ace_constant.ace_other {\
color: #666969\
}\
.ace-tomorrow .ace_support.ace_function {\
color: #4271AE\
}\
.ace-tomorrow .ace_support.ace_constant {\
color: #F5871F\
}\
.ace-tomorrow .ace_support.ace_class {\
color: #C99E00\
}\
.ace-tomorrow .ace_support.ace_type {\
color: #C99E00\
}\
.ace-tomorrow .ace_storage {\
color: #8959A8\
}\
.ace-tomorrow .ace_storage.ace_type {\
color: #8959A8\
}\
.ace-tomorrow .ace_invalid {\
color: #FFFFFF;\
background-color: #C82829\
}\
.ace-tomorrow .ace_invalid.ace_deprecated {\
color: #FFFFFF;\
background-color: #8959A8\
}\
.ace-tomorrow .ace_string {\
color: #718C00\
}\
.ace-tomorrow .ace_string.ace_regexp {\
color: #C82829\
}\
.ace-tomorrow .ace_comment {\
color: #8E908C\
}\
.ace-tomorrow .ace_variable {\
color: #C82829\
}\
.ace-tomorrow .ace_variable.ace_parameter {\
color: #F5871F\
}\
.ace-tomorrow .ace_meta.ace_tag {\
color: #C82829\
}\
.ace-tomorrow .ace_entity.ace_other.ace_attribute-name {\
color: #C82829\
}\
.ace-tomorrow .ace_entity.ace_name.ace_function {\
color: #4271AE\
}\
.ace-tomorrow .ace_entity.ace_name.ace_tag {\
color: #C82829\
}\
.ace-tomorrow .ace_markup.ace_heading {\
color: #718C00\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
                (function() {
                    ace.require(["ace/theme/tomorrow"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            