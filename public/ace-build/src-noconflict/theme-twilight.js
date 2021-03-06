ace.define("ace/theme/twilight",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-twilight";
exports.cssText = ".ace-twilight .ace_gutter {\
background: #141414;\
color: rgb(134,134,134)\
}\
.ace-twilight .ace_print-margin {\
width: 1px;\
background: #e8e8e8\
}\
.ace-twilight {\
background-color: #141414;\
color: #F8F8F8\
}\
.ace-twilight .ace_cursor {\
color: #A7A7A7\
}\
.ace-twilight .ace_marker-layer .ace_selection {\
background: rgba(221, 240, 255, 0.20)\
}\
.ace-twilight.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #141414;\
border-radius: 2px\
}\
.ace-twilight .ace_marker-layer .ace_step {\
background: rgb(198, 219, 174)\
}\
.ace-twilight .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgba(255, 255, 255, 0.25)\
}\
.ace-twilight .ace_marker-layer .ace_active-line {\
background: rgba(255, 255, 255, 0.031)\
}\
.ace-twilight .ace_gutter-active-line {\
background-color: rgba(255, 255, 255, 0.031)\
}\
.ace-twilight .ace_marker-layer .ace_selected-word {\
border: 1px solid rgba(221, 240, 255, 0.20)\
}\
.ace-twilight .ace_fold {\
background-color: #AC885B;\
border-color: #F8F8F8\
}\
.ace-twilight .ace_keyword {\
color: #CDA869\
}\
.ace-twilight .ace_constant {\
color: #CF6A4C\
}\
.ace-twilight .ace_support {\
color: #9B859D\
}\
.ace-twilight .ace_support.ace_function {\
color: #DAD085\
}\
.ace-twilight .ace_support.ace_constant {\
color: #CF6A4C\
}\
.ace-twilight .ace_storage {\
color: #F9EE98\
}\
.ace-twilight .ace_invalid.ace_illegal {\
color: #F8F8F8;\
background-color: rgba(86, 45, 86, 0.75)\
}\
.ace-twilight .ace_invalid.ace_deprecated {\
text-decoration: underline;\
font-style: italic;\
color: #D2A8A1\
}\
.ace-twilight .ace_string {\
color: #8F9D6A\
}\
.ace-twilight .ace_string.ace_regexp {\
color: #E9C062\
}\
.ace-twilight .ace_comment {\
font-style: italic;\
color: #5F5A60\
}\
.ace-twilight .ace_variable {\
color: #7587A6\
}\
.ace-twilight .ace_meta.ace_tag {\
color: #AC885B\
}\
.ace-twilight .ace_entity.ace_name.ace_function {\
color: #AC885B\
}\
.ace-twilight .ace_markup.ace_heading {\
color: #CF6A4C\
}\
.ace-twilight .ace_markup.ace_list {\
color: #F9EE98\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
                (function() {
                    ace.require(["ace/theme/twilight"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            