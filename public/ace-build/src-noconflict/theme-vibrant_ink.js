ace.define("ace/theme/vibrant_ink",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-vibrant-ink";
exports.cssText = ".ace-vibrant-ink .ace_gutter {\
background: #0F0F0F;\
color: rgb(135,135,135)\
}\
.ace-vibrant-ink .ace_print-margin {\
width: 1px;\
background: #e8e8e8\
}\
.ace-vibrant-ink {\
background-color: #0F0F0F;\
color: #FFFFFF\
}\
.ace-vibrant-ink .ace_cursor {\
color: #FFFFFF\
}\
.ace-vibrant-ink .ace_marker-layer .ace_selection {\
background: #6699CC\
}\
.ace-vibrant-ink.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #0F0F0F;\
border-radius: 2px\
}\
.ace-vibrant-ink .ace_marker-layer .ace_step {\
background: rgb(198, 219, 174)\
}\
.ace-vibrant-ink .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #404040\
}\
.ace-vibrant-ink .ace_marker-layer .ace_active-line {\
background: #333333\
}\
.ace-vibrant-ink .ace_gutter-active-line {\
background-color: #333333\
}\
.ace-vibrant-ink .ace_marker-layer .ace_selected-word {\
border: 1px solid #6699CC\
}\
.ace-vibrant-ink .ace_fold {\
background-color: #FFCC00;\
border-color: #FFFFFF\
}\
.ace-vibrant-ink .ace_keyword {\
color: #FF6600\
}\
.ace-vibrant-ink .ace_constant {\
color: #339999\
}\
.ace-vibrant-ink .ace_constant.ace_numeric {\
color: #99CC99\
}\
.ace-vibrant-ink .ace_support.ace_function {\
color: #FFCC00\
}\
.ace-vibrant-ink .ace_invalid {\
color: #CCFF33;\
background-color: #000000\
}\
.ace-vibrant-ink .ace_invalid.ace_deprecated {\
color: #CCFF33;\
background-color: #000000\
}\
.ace-vibrant-ink .ace_string {\
color: #66FF00\
}\
.ace-vibrant-ink .ace_string.ace_regexp {\
color: #44B4CC\
}\
.ace-vibrant-ink .ace_comment {\
color: #9933CC\
}\
.ace-vibrant-ink .ace_variable {\
color: #FFCC00\
}\
.ace-vibrant-ink .ace_variable.ace_parameter {\
font-style: italic\
}\
.ace-vibrant-ink .ace_entity.ace_other.ace_attribute-name {\
font-style: italic;\
color: #99CC99\
}\
.ace-vibrant-ink .ace_entity.ace_name.ace_function {\
color: #FFCC00\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
                (function() {
                    ace.require(["ace/theme/vibrant_ink"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            