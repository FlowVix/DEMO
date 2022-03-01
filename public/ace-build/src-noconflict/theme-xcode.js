ace.define("ace/theme/xcode",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = false;
exports.cssClass = "ace-xcode";
exports.cssText = ".ace-xcode .ace_gutter {\
background: #FFFFFF;\
color: rgb(128,128,128)\
}\
.ace-xcode .ace_print-margin {\
width: 1px;\
background: #e8e8e8\
}\
.ace-xcode {\
background-color: #FFFFFF;\
color: #000000\
}\
.ace-xcode .ace_cursor {\
color: #000000\
}\
.ace-xcode .ace_marker-layer .ace_selection {\
background: #B5D5FF\
}\
.ace-xcode.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #FFFFFF;\
border-radius: 2px\
}\
.ace-xcode .ace_marker-layer .ace_step {\
background: rgb(198, 219, 174)\
}\
.ace-xcode .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #BFBFBF\
}\
.ace-xcode .ace_marker-layer .ace_active-line {\
background: rgba(0, 0, 0, 0.071)\
}\
.ace-xcode .ace_gutter-active-line {\
background-color: rgba(0, 0, 0, 0.071)\
}\
.ace-xcode .ace_marker-layer .ace_selected-word {\
border: 1px solid #B5D5FF\
}\
.ace-xcode .ace_fold {\
background-color: #C800A4;\
border-color: #000000\
}\
.ace-xcode .ace_keyword {\
color: #C800A4\
}\
.ace-xcode .ace_constant.ace_language {\
color: #C800A4\
}\
.ace-xcode .ace_constant.ace_numeric {\
color: #3A00DC\
}\
.ace-xcode .ace_constant.ace_character {\
color: #275A5E\
}\
.ace-xcode .ace_constant.ace_other {\
color: #275A5E\
}\
.ace-xcode .ace_support.ace_function {\
color: #450084\
}\
.ace-xcode .ace_support.ace_constant {\
color: #450084\
}\
.ace-xcode .ace_support.ace_class {\
color: #790EAD\
}\
.ace-xcode .ace_support.ace_type {\
color: #790EAD\
}\
.ace-xcode .ace_storage {\
color: #C900A4\
}\
.ace-xcode .ace_string {\
color: #DF0002\
}\
.ace-xcode .ace_comment {\
color: #008E00\
}\
.ace-xcode .ace_variable.ace_language {\
color: #C800A4\
}\
.ace-xcode .ace_entity.ace_other.ace_attribute-name {\
color: #450084\
}\
.ace-xcode .ace_entity.ace_name.ace_tag {\
color: #790EAD\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
                (function() {
                    ace.require(["ace/theme/xcode"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            