ace.define("ace/theme/monokai",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-monokai";
exports.cssText = ".ace-monokai .ace_gutter {\
background: #272822;\
color: rgb(144,144,138)\
}\
.ace-monokai .ace_print-margin {\
width: 1px;\
background: #e8e8e8\
}\
.ace-monokai {\
background-color: #272822;\
color: #F8F8F2\
}\
.ace-monokai .ace_cursor {\
color: #F8F8F0\
}\
.ace-monokai .ace_marker-layer .ace_selection {\
background: #49483E\
}\
.ace-monokai.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #272822;\
border-radius: 2px\
}\
.ace-monokai .ace_marker-layer .ace_step {\
background: rgb(198, 219, 174)\
}\
.ace-monokai .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #3B3A32\
}\
.ace-monokai .ace_marker-layer .ace_active-line {\
background: #3E3D32\
}\
.ace-monokai .ace_gutter-active-line {\
background-color: #3E3D32\
}\
.ace-monokai .ace_marker-layer .ace_selected-word {\
border: 1px solid #49483E\
}\
.ace-monokai .ace_fold {\
background-color: #A6E22E;\
border-color: #F8F8F2\
}\
.ace-monokai .ace_keyword {\
color: #F92672\
}\
.ace-monokai .ace_constant.ace_language {\
color: #AE81FF\
}\
.ace-monokai .ace_constant.ace_numeric {\
color: #AE81FF\
}\
.ace-monokai .ace_constant.ace_character {\
color: #AE81FF\
}\
.ace-monokai .ace_constant.ace_other {\
color: #AE81FF\
}\
.ace-monokai .ace_support.ace_function {\
color: #66D9EF\
}\
.ace-monokai .ace_support.ace_constant {\
color: #66D9EF\
}\
.ace-monokai .ace_support.ace_class {\
font-style: italic;\
color: #66D9EF\
}\
.ace-monokai .ace_support.ace_type {\
font-style: italic;\
color: #66D9EF\
}\
.ace-monokai .ace_storage {\
color: #F92672\
}\
.ace-monokai .ace_storage.ace_type {\
font-style: italic;\
color: #66D9EF\
}\
.ace-monokai .ace_invalid {\
color: #F8F8F0;\
background-color: #F92672\
}\
.ace-monokai .ace_invalid.ace_deprecated {\
color: #F8F8F0;\
background-color: #AE81FF\
}\
.ace-monokai .ace_string {\
color: #E6DB74\
}\
.ace-monokai .ace_comment {\
color: #75715E\
}\
.ace-monokai .ace_variable {\
color: #A6E22E\
}\
.ace-monokai .ace_variable.ace_parameter {\
font-style: italic;\
color: #FD971F\
}\
.ace-monokai .ace_entity.ace_other.ace_attribute-name {\
color: #A6E22E\
}\
.ace-monokai .ace_entity.ace_name.ace_function {\
color: #A6E22E\
}\
.ace-monokai .ace_entity.ace_name.ace_tag {\
color: #F92672\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
                (function() {
                    ace.require(["ace/theme/monokai"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            