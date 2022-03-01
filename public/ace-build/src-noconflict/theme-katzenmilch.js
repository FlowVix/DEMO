ace.define("ace/theme/katzenmilch",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = false;
exports.cssClass = "ace-katzenmilch";
exports.cssText = ".ace-katzenmilch .ace_gutter {\
background: #f3f2f3;\
color: rgb(129,121,126)\
}\
.ace-katzenmilch .ace_print-margin {\
width: 1px;\
background: #e8e8e8\
}\
.ace-katzenmilch {\
background-color: #f3f2f3;\
color: rgba(15, 0, 9, 1.0)\
}\
.ace-katzenmilch .ace_cursor {\
color: #100011\
}\
.ace-katzenmilch .ace_marker-layer .ace_selection {\
background: rgba(100, 5, 208, 0.27)\
}\
.ace-katzenmilch.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #f3f2f3;\
border-radius: 2px\
}\
.ace-katzenmilch .ace_marker-layer .ace_step {\
background: rgb(198, 219, 174)\
}\
.ace-katzenmilch .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #000000\
}\
.ace-katzenmilch .ace_marker-layer .ace_active-line {\
background: #ffffff\
}\
.ace-katzenmilch .ace_gutter-active-line {\
background-color: #ffffff\
}\
.ace-katzenmilch .ace_marker-layer .ace_selected-word {\
border: 1px solid rgba(100, 5, 208, 0.27)\
}\
.ace-katzenmilch .ace_fold {\
background-color: rgba(2, 95, 73, 0.97);\
border-color: rgba(15, 0, 9, 1.0)\
}\
.ace-katzenmilch .ace_keyword {\
color: #674Aa8;\
background-color: rgba(163, 170, 216, 0.055)\
}\
.ace-katzenmilch .ace_constant.ace_language {\
color: #7D7e52;\
background-color: rgba(189, 190, 130, 0.059)\
}\
.ace-katzenmilch .ace_constant.ace_numeric {\
color: rgba(79, 130, 123, 0.93);\
background-color: rgba(119, 194, 187, 0.059)\
}\
.ace-katzenmilch .ace_constant.ace_character {\
color: rgba(2, 95, 105, 1.0);\
background-color: rgba(127, 34, 153, 0.063)\
}\
.ace-katzenmilch .ace_constant.ace_other {\
color: rgba(2, 95, 105, 1.0);\
background-color: rgba(127, 34, 153, 0.063)\
}\
.ace-katzenmilch .ace_support.ace_function {\
color: #9D7e62;\
background-color: rgba(189, 190, 130, 0.039)\
}\
.ace-katzenmilch .ace_support.ace_class {\
color: rgba(239, 106, 167, 1.0);\
background-color: rgba(239, 106, 167, 0.063)\
}\
.ace-katzenmilch .ace_storage {\
color: rgba(123, 92, 191, 1.0);\
background-color: rgba(139, 93, 223, 0.051)\
}\
.ace-katzenmilch .ace_invalid {\
color: #DFDFD5;\
background-color: #CC1B27\
}\
.ace-katzenmilch .ace_string {\
color: #5a5f9b;\
background-color: rgba(170, 175, 219, 0.035)\
}\
.ace-katzenmilch .ace_comment {\
font-style: italic;\
color: rgba(64, 79, 80, 0.67);\
background-color: rgba(95, 15, 255, 0.0078)\
}\
.ace-katzenmilch .ace_variable {\
color: rgba(2, 95, 73, 0.97);\
background-color: rgba(34, 255, 73, 0.12)\
}\
.ace-katzenmilch .ace_variable.ace_language {\
color: #316fcf;\
background-color: rgba(58, 175, 255, 0.039)\
}\
.ace-katzenmilch .ace_variable.ace_parameter {\
font-style: italic;\
color: rgba(51, 150, 159, 0.87);\
background-color: rgba(5, 214, 249, 0.043)\
}\
.ace-katzenmilch .ace_entity.ace_other.ace_attribute-name {\
color: rgba(73, 70, 194, 0.93);\
background-color: rgba(73, 134, 194, 0.035)\
}\
.ace-katzenmilch .ace_entity.ace_name.ace_function {\
color: rgba(2, 95, 73, 0.97);\
background-color: rgba(34, 255, 73, 0.12)\
}\
.ace-katzenmilch .ace_entity.ace_name.ace_tag {\
color: #3976a2;\
background-color: rgba(73, 166, 210, 0.039)\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
                (function() {
                    ace.require(["ace/theme/katzenmilch"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            