ace.define("ace/mode/spwn_highlight_rules",[], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var SPWNHighlightRules = function() {

    this.$rules = {
        start: [{
            include: "#root"
        }],
        "#root": [{
            include: "#comments"
        }, {
            include: "#impl"
        }, {
            include: "#obj_or_trigger"
        }, {
            include: "#keywords"
        }, {
            include: "#for_in"
        }, {
            include: "#types"
        }, {
            include: "#constants"
        }, {
            include: "#constants_2"
        }, {
            include: "#ids"
        }, {
            include: "#numbers"
        }, {
            include: "#punctuation"
        }, {
            include: "#func_calls"
        }, {
            include: "#brackets"
        }, {
            include: "#operators"
        }, {
            include: "#strings"
        }],
        "#keywords": [{
            token: "keyword.control.spwn",
            regex: /\b(?:if|else|while|return|extract|break|continue|match|type)\b/
        }, {
            token: "keyword.operator.emerald",
            regex: /\blet\b/
        }, {
            token: "keyword.other.emerald",
            regex: /\b(?:impl|import)\b/
        }],
        "#for_in": [{
            token: "keyword.control.emerald",
            regex: /\bfor\b/,
            push: [{
                token: "keyword.control.emerald",
                regex: /\bin\b/,
                next: "pop"
            }, {
                include: "#root"
            }]
        }],
        "#impl": [{
            token: [
                "keyword.other.spwn",
                "text",
                "entity.name.type.spwn",
                "text",
                "punctuation.other.bracket.curly.begin.spwn"
            ],
            regex: /\b(impl)\b(\s*)(@[a-zA-Z_]\w*)(\s*)({)/,
            push: [{
                token: "punctuation.other.bracket.curly.end.spwn",
                regex: /\}/,
                next: "pop"
            }, {
                token: "variable.parameter.spwn",
                regex: /\b[a-zA-Z_]\w*\b\s*(?=:)/
            }, {
                include: "#root"
            }]
        }],
        "#obj_or_trigger": [{
            token: [
                "keyword.other.spwn",
                "text",
                "punctuation.other.bracket.curly.begin.spwn"
            ],
            regex: /\b(obj|trigger)\b(\s*)({)/,
            push: [{
                token: "punctuation.other.bracket.curly.end.spwn",
                regex: /\}/,
                next: "pop"
            }, {
                token: "variable.parameter.spwn",
                regex: /\b[a-zA-Z_]\w*\b\s*(?=:)/
            }, {
                include: "#root"
            }]
        }],
        "#numbers": [{
            token: "constant.numeric.spwn",
            regex: /\b0b[01](?:_?[01]+)*/
        }, {
            token: "constant.numeric.spwn",
            regex: /\b[0-9][0-9_]*(?:\.[0-9_]+)?/
        }, {
            token: "constant.numeric.spwn",
            regex: /\b0x[a-fA-F0-9](?:_?[a-fA-F0-9]+)*/
        }, {
            token: "constant.numeric.spwn",
            regex: /\b0o[0-7](?:_?[0-7]+)*/
        }, {
            token: "constant.numeric.spwn",
            regex: /\b[0-9][0-9_]*(?:\.[0-9_]+)?/
        }],
        "#constants": [{
            token: "constant.language.spwn",
            regex: /\b(?:true|false|null)\b|\$/
        }],
        "#ids": [{
            token: "constant.numeric.spwn",
            regex: /(?:[0-9]+|\?)[gbci]/
        }],
        "#operators": [{
            token: "keyword.operator.spwn",
            regex: /[+\-*\/=^<>|&%!]+|\bas\b|\.\.|\bin\b/
        }],
        "#constants_2": [{
            token: "variable.language.spwn",
            regex: /\bself\b/
        }],
        "#comments": [{
            token: "punctuation.definition.comment.spwn",
            regex: /\/\*/,
            push: [{
                token: "punctuation.definition.comment.spwn",
                regex: /\*\//,
                next: "pop"
            }, {
                defaultToken: "comment.block.spwn"
            }]
        }, {
            token: "comment.line.spwn",
            regex: /\/\/.*/
        }],
        "#types": [{
            token: "entity.name.type.spwn",
            regex: /\b_\b/
        }, {
            token: "entity.name.type.spwn",
            regex: /@[a-zA-Z_]\w*/
        }],
        "#func_calls": [{
            token: "entity.name.function.spwn",
            regex: /\b[a-zA-Z_]\w*\b\s*(?=\(|![^{=])/
        }],
        "#punctuation": [{
            token: "punctuation.other.spwn",
            regex: /[;,:]|->|=>|(?<!\.)\.(?!\.)/
        }],
        "#brackets": [{
            token: "punctuation.other.bracket.curly.begin.spwn",
            regex: /!\{/,
            push: [{
                token: "punctuation.other.bracket.curly.end.spwn",
                regex: /\}/,
                next: "pop"
            }, {
                include: "#root"
            }]
        }, {
            token: "punctuation.other.bracket.curly.begin.spwn",
            regex: /\{/,
            push: [{
                token: "punctuation.other.bracket.curly.end.spwn",
                regex: /\}/,
                next: "pop"
            }, {
                include: "#root"
            }]
        }, {
            token: "punctuation.other.bracket.square.begin.spwn",
            regex: /\[/,
            push: [{
                token: "punctuation.other.bracket.square.end.spwn",
                regex: /\]/,
                next: "pop"
            }, {
                include: "#root"
            }]
        }, {
            token: "keyword.directive.begin.spwn",
            regex: /#\[/,
            push: [{
                token: "keyword.directive.end.spwn",
                regex: /\]/,
                next: "pop"
            }, {
                token: "support.function.directive.spwn",
                regex: /\b(?:example|desc|constructor)\b/
            }, {
                include: "#root"
            }]
        }, {
            token: "punctuation.other.parameters.begin.spwn",
            regex: /(?<!\w\s*)\((?=\s*[a-zA-Z_]\w*\s*(?:,|:(?!:)|=(?![=>])|\)\s*(?:\{|=>)))/,
            push: [{
                token: "punctuation.other.parameters.end.spwn",
                regex: /\)/,
                next: "pop"
            }, {
                include: "#func_args"
            }, {
                include: "#root"
            }],
            comment: "situations like `(a) =>` vs `(a)`"
        }, {
            token: "punctuation.other.bracket.round.begin.spwn",
            regex: /(?<!\w\s*)\(/,
            push: [{
                token: "punctuation.other.bracket.round.end.spwn",
                regex: /\)/,
                next: "pop"
            }, {
                token: "text",
                regex: /(?=,|\s*[a-zA-Z_]\w*\s*(?:,|:(?!:)|=(?![=>])|\)\s*\{))/,
                push: [{
                    token: "text",
                    regex: /(?=\))/,
                    next: "pop"
                }, {
                    include: "#func_args"
                }]
            }, {
                include: "#root"
            }],
            comment: "other situations like (a, b)"
        }, {
            token: "punctuation.other.bracket.round.begin.spwn",
            regex: /\(/,
            push: [{
                token: "punctuation.other.bracket.round.end.spwn",
                regex: /\)/,
                next: "pop"
            }, {
                token: [
                    "variable.parameter.spwn",
                    "text",
                    "keyword.operator.spwn"
                ],
                regex: /\b([a-zA-Z_]\w*)(\s*)(=)(?![=>])/,
                comment: "A named argument"
            }, {
                include: "#root"
            }],
            comment: "Some sort of function call"
        }],
        "#func_args": [{
            token: "variable.language.spwn",
            regex: /\bself\b/
        }, {
            token: [
                "variable.parameter.spwn",
                "text",
                "punctuation.other.spwn",
                "keyword.operator.spwn"
            ],
            regex: /\b([a-zA-Z_]\w*)(?:(\s*)(?:(:(?!:))|(=(?![=>])))|\b)/,
            push: [{
                token: "text",
                regex: /(?=[,)])/,
                next: "pop"
            }, {
                include: "#root"
            }]
        }, {
            include: "#root"
        }],
        "#strings": [{
            token: "punctuation.definition.string.begin.spwn",
            regex: /"/,
            push: [{
                token: "punctuation.definition.string.end.spwn",
                regex: /"/,
                next: "pop"
            }, {
                token: "constant.character.escape.spwn",
                regex: /\\./
            }, {
                defaultToken: "string.quoted.double.spwn"
            }]
        }, {
            token: "punctuation.definition.string.begin.spwn",
            regex: /'/,
            push: [{
                token: "punctuation.definition.string.end.spwn",
                regex: /'/,
                next: "pop"
            }, {
                token: "constant.character.escape.spwn",
                regex: /\\./
            }, {
                defaultToken: "string.quoted.single.spwn"
            }]
        }]
    }
    
    this.normalizeRules();
};

SPWNHighlightRules.metaData = {
    "$schema": "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
    name: "SPWN",
    scopeName: "source.spwn"
}


oop.inherits(SPWNHighlightRules, TextHighlightRules);

exports.SPWNHighlightRules = SPWNHighlightRules;
});

ace.define("ace/mode/folding/cstyle",[], function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var Range = require("../../range").Range;
var BaseFoldMode = require("./fold_mode").FoldMode;

var FoldMode = exports.FoldMode = function(commentRegex) {
    if (commentRegex) {
        this.foldingStartMarker = new RegExp(
            this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
        );
        this.foldingStopMarker = new RegExp(
            this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
        );
    }
};
oop.inherits(FoldMode, BaseFoldMode);

(function() {
    
    this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
    this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
    this.singleLineBlockCommentRe= /^\s*(\/\*).*\*\/\s*$/;
    this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
    this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
    this._getFoldWidgetBase = this.getFoldWidget;
    this.getFoldWidget = function(session, foldStyle, row) {
        var line = session.getLine(row);
    
        if (this.singleLineBlockCommentRe.test(line)) {
            if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line))
                return "";
        }
    
        var fw = this._getFoldWidgetBase(session, foldStyle, row);
    
        if (!fw && this.startRegionRe.test(line))
            return "start"; // lineCommentRegionStart
    
        return fw;
    };

    this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
        var line = session.getLine(row);
        
        if (this.startRegionRe.test(line))
            return this.getCommentRegionBlock(session, line, row);
        
        var match = line.match(this.foldingStartMarker);
        if (match) {
            var i = match.index;

            if (match[1])
                return this.openingBracketBlock(session, match[1], row, i);
                
            var range = session.getCommentFoldRange(row, i + match[0].length, 1);
            
            if (range && !range.isMultiLine()) {
                if (forceMultiline) {
                    range = this.getSectionRange(session, row);
                } else if (foldStyle != "all")
                    range = null;
            }
            
            return range;
        }

        if (foldStyle === "markbegin")
            return;

        var match = line.match(this.foldingStopMarker);
        if (match) {
            var i = match.index + match[0].length;

            if (match[1])
                return this.closingBracketBlock(session, match[1], row, i);

            return session.getCommentFoldRange(row, i, -1);
        }
    };
    
    this.getSectionRange = function(session, row) {
        var line = session.getLine(row);
        var startIndent = line.search(/\S/);
        var startRow = row;
        var startColumn = line.length;
        row = row + 1;
        var endRow = row;
        var maxRow = session.getLength();
        while (++row < maxRow) {
            line = session.getLine(row);
            var indent = line.search(/\S/);
            if (indent === -1)
                continue;
            if  (startIndent > indent)
                break;
            var subRange = this.getFoldWidgetRange(session, "all", row);
            
            if (subRange) {
                if (subRange.start.row <= startRow) {
                    break;
                } else if (subRange.isMultiLine()) {
                    row = subRange.end.row;
                } else if (startIndent == indent) {
                    break;
                }
            }
            endRow = row;
        }
        
        return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
    };
    this.getCommentRegionBlock = function(session, line, row) {
        var startColumn = line.search(/\s*$/);
        var maxRow = session.getLength();
        var startRow = row;
        
        var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
        var depth = 1;
        while (++row < maxRow) {
            line = session.getLine(row);
            var m = re.exec(line);
            if (!m) continue;
            if (m[1]) depth--;
            else depth++;

            if (!depth) break;
        }

        var endRow = row;
        if (endRow > startRow) {
            return new Range(startRow, startColumn, endRow, line.length);
        }
    };

}).call(FoldMode.prototype);

});

ace.define("ace/mode/spwn",[], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var SPWNHighlightRules = require("./spwn_highlight_rules").SPWNHighlightRules;
var FoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = SPWNHighlightRules;
    this.foldingRules = new FoldMode();
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "//";
    this.blockComment = {start: "/*", end: "*/"};
    this.$quotes = { '"': '"', "'": "'" };
    this.$id = "ace/mode/spwn"
}).call(Mode.prototype);

exports.Mode = Mode;
});                (function() {
                    ace.require(["ace/mode/spwn"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            