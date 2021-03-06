ace.define("ace/theme/tomorrow_night_bright",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-tomorrow-night-bright";
exports.cssText = ".ace-tomorrow-night-bright .ace_gutter {\
background: #000000;\
color: rgb(111,111,111)\
}\
.ace-tomorrow-night-bright .ace_print-margin {\
width: 1px;\
background: #e8e8e8\
}\
.ace-tomorrow-night-bright {\
background-color: #000000;\
color: #DEDEDE\
}\
.ace-tomorrow-night-bright .ace_cursor {\
color: #9F9F9F\
}\
.ace-tomorrow-night-bright .ace_marker-layer .ace_selection {\
background: #424242\
}\
.ace-tomorrow-night-bright.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #000000;\
border-radius: 2px\
}\
.ace-tomorrow-night-bright .ace_marker-layer .ace_step {\
background: rgb(198, 219, 174)\
}\
.ace-tomorrow-night-bright .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #343434\
}\
.ace-tomorrow-night-bright .ace_marker-layer .ace_active-line {\
background: #2A2A2A\
}\
.ace-tomorrow-night-bright .ace_gutter-active-line {\
background-color: #2A2A2A\
}\
.ace-tomorrow-night-bright .ace_marker-layer .ace_selected-word {\
border: 1px solid #424242\
}\
.ace-tomorrow-night-bright .ace_fold {\
background-color: #7AA6DA;\
border-color: #DEDEDE\
}\
.ace-tomorrow-night-bright .ace_keyword {\
color: #C397D8\
}\
.ace-tomorrow-night-bright .ace_keyword.ace_operator {\
color: #70C0B1\
}\
.ace-tomorrow-night-bright .ace_keyword.ace_other.ace_unit {\
color: #E78C45\
}\
.ace-tomorrow-night-bright .ace_constant.ace_language {\
color: #E78C45\
}\
.ace-tomorrow-night-bright .ace_constant.ace_numeric {\
color: #E78C45\
}\
.ace-tomorrow-night-bright .ace_constant.ace_character {\
color: #E78C45\
}\
.ace-tomorrow-night-bright .ace_constant.ace_other {\
color: #EEEEEE\
}\
.ace-tomorrow-night-bright .ace_support.ace_function {\
color: #7AA6DA\
}\
.ace-tomorrow-night-bright .ace_support.ace_constant {\
color: #E78C45\
}\
.ace-tomorrow-night-bright .ace_support.ace_class {\
color: #E7C547\
}\
.ace-tomorrow-night-bright .ace_support.ace_type {\
color: #E7C547\
}\
.ace-tomorrow-night-bright .ace_storage {\
color: #C397D8\
}\
.ace-tomorrow-night-bright .ace_storage.ace_type {\
color: #C397D8\
}\
.ace-tomorrow-night-bright .ace_invalid {\
color: #CED2CF;\
background-color: #DF5F5F\
}\
.ace-tomorrow-night-bright .ace_invalid.ace_deprecated {\
color: #CED2CF;\
background-color: #B798BF\
}\
.ace-tomorrow-night-bright .ace_string {\
color: #B9CA4A\
}\
.ace-tomorrow-night-bright .ace_string.ace_regexp {\
color: #D54E53\
}\
.ace-tomorrow-night-bright .ace_comment {\
color: #969896\
}\
.ace-tomorrow-night-bright .ace_variable {\
color: #D54E53\
}\
.ace-tomorrow-night-bright .ace_variable.ace_parameter {\
color: #E78C45\
}\
.ace-tomorrow-night-bright .ace_meta.ace_tag {\
color: #D54E53\
}\
.ace-tomorrow-night-bright .ace_entity.ace_other.ace_attribute-name {\
color: #D54E53\
}\
.ace-tomorrow-night-bright .ace_entity.ace_name.ace_function {\
color: #7AA6DA\
}\
.ace-tomorrow-night-bright .ace_entity.ace_name.ace_tag {\
color: #D54E53\
}\
.ace-tomorrow-night-bright .ace_markup.ace_heading {\
color: #B9CA4A\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
                (function() {
                    ace.require(["ace/theme/tomorrow_night_bright"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            