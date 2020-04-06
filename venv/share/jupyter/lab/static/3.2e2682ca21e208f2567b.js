(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[3],{

/***/ "dfh3":
/*!***********************************************!*\
  !*** ./node_modules/codemirror/keymap/vim.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

/**
 * Supported keybindings:
 *   Too many to list. Refer to defaultKeymap below.
 *
 * Supported Ex commands:
 *   Refer to defaultExCommandMap below.
 *
 * Registers: unnamed, -, a-z, A-Z, 0-9
 *   (Does not respect the special case for number registers when delete
 *    operator is made with these commands: %, (, ),  , /, ?, n, N, {, } )
 *   TODO: Implement the remaining registers.
 *
 * Marks: a-z, A-Z, and 0-9
 *   TODO: Implement the remaining special marks. They have more complex
 *       behavior.
 *
 * Events:
 *  'vim-mode-change' - raised on the editor anytime the current mode changes,
 *                      Event object: {mode: "visual", subMode: "linewise"}
 *
 * Code structure:
 *  1. Default keymap
 *  2. Variable declarations and short basic helpers
 *  3. Instance (External API) implementation
 *  4. Internal state tracking objects (input state, counter) implementation
 *     and instantiation
 *  5. Key handler (the main command dispatcher) implementation
 *  6. Motion, operator, and action implementations
 *  7. Helper functions for the key handler, motions, operators, and actions
 *  8. Set up Vim to work as a keymap for CodeMirror.
 *  9. Ex command implementations.
 */

(function(mod) {
  if (true) // CommonJS
    mod(__webpack_require__(/*! ../lib/codemirror */ "VrN/"), __webpack_require__(/*! ../addon/search/searchcursor */ "uTOq"), __webpack_require__(/*! ../addon/dialog/dialog */ "Ku0u"), __webpack_require__(/*! ../addon/edit/matchbrackets.js */ "jDMi"));
  else {}
})(function(CodeMirror) {
  'use strict';

  var defaultKeymap = [
    // Key to key mapping. This goes first to make it possible to override
    // existing mappings.
    { keys: '<Left>', type: 'keyToKey', toKeys: 'h' },
    { keys: '<Right>', type: 'keyToKey', toKeys: 'l' },
    { keys: '<Up>', type: 'keyToKey', toKeys: 'k' },
    { keys: '<Down>', type: 'keyToKey', toKeys: 'j' },
    { keys: '<Space>', type: 'keyToKey', toKeys: 'l' },
    { keys: '<BS>', type: 'keyToKey', toKeys: 'h', context: 'normal'},
    { keys: '<Del>', type: 'keyToKey', toKeys: 'x', context: 'normal'},
    { keys: '<C-Space>', type: 'keyToKey', toKeys: 'W' },
    { keys: '<C-BS>', type: 'keyToKey', toKeys: 'B', context: 'normal' },
    { keys: '<S-Space>', type: 'keyToKey', toKeys: 'w' },
    { keys: '<S-BS>', type: 'keyToKey', toKeys: 'b', context: 'normal' },
    { keys: '<C-n>', type: 'keyToKey', toKeys: 'j' },
    { keys: '<C-p>', type: 'keyToKey', toKeys: 'k' },
    { keys: '<C-[>', type: 'keyToKey', toKeys: '<Esc>' },
    { keys: '<C-c>', type: 'keyToKey', toKeys: '<Esc>' },
    { keys: '<C-[>', type: 'keyToKey', toKeys: '<Esc>', context: 'insert' },
    { keys: '<C-c>', type: 'keyToKey', toKeys: '<Esc>', context: 'insert' },
    { keys: 's', type: 'keyToKey', toKeys: 'cl', context: 'normal' },
    { keys: 's', type: 'keyToKey', toKeys: 'c', context: 'visual'},
    { keys: 'S', type: 'keyToKey', toKeys: 'cc', context: 'normal' },
    { keys: 'S', type: 'keyToKey', toKeys: 'VdO', context: 'visual' },
    { keys: '<Home>', type: 'keyToKey', toKeys: '0' },
    { keys: '<End>', type: 'keyToKey', toKeys: '$' },
    { keys: '<PageUp>', type: 'keyToKey', toKeys: '<C-b>' },
    { keys: '<PageDown>', type: 'keyToKey', toKeys: '<C-f>' },
    { keys: '<CR>', type: 'keyToKey', toKeys: 'j^', context: 'normal' },
    { keys: '<Ins>', type: 'action', action: 'toggleOverwrite', context: 'insert' },
    // Motions
    { keys: 'H', type: 'motion', motion: 'moveToTopLine', motionArgs: { linewise: true, toJumplist: true }},
    { keys: 'M', type: 'motion', motion: 'moveToMiddleLine', motionArgs: { linewise: true, toJumplist: true }},
    { keys: 'L', type: 'motion', motion: 'moveToBottomLine', motionArgs: { linewise: true, toJumplist: true }},
    { keys: 'h', type: 'motion', motion: 'moveByCharacters', motionArgs: { forward: false }},
    { keys: 'l', type: 'motion', motion: 'moveByCharacters', motionArgs: { forward: true }},
    { keys: 'j', type: 'motion', motion: 'moveByLines', motionArgs: { forward: true, linewise: true }},
    { keys: 'k', type: 'motion', motion: 'moveByLines', motionArgs: { forward: false, linewise: true }},
    { keys: 'gj', type: 'motion', motion: 'moveByDisplayLines', motionArgs: { forward: true }},
    { keys: 'gk', type: 'motion', motion: 'moveByDisplayLines', motionArgs: { forward: false }},
    { keys: 'w', type: 'motion', motion: 'moveByWords', motionArgs: { forward: true, wordEnd: false }},
    { keys: 'W', type: 'motion', motion: 'moveByWords', motionArgs: { forward: true, wordEnd: false, bigWord: true }},
    { keys: 'e', type: 'motion', motion: 'moveByWords', motionArgs: { forward: true, wordEnd: true, inclusive: true }},
    { keys: 'E', type: 'motion', motion: 'moveByWords', motionArgs: { forward: true, wordEnd: true, bigWord: true, inclusive: true }},
    { keys: 'b', type: 'motion', motion: 'moveByWords', motionArgs: { forward: false, wordEnd: false }},
    { keys: 'B', type: 'motion', motion: 'moveByWords', motionArgs: { forward: false, wordEnd: false, bigWord: true }},
    { keys: 'ge', type: 'motion', motion: 'moveByWords', motionArgs: { forward: false, wordEnd: true, inclusive: true }},
    { keys: 'gE', type: 'motion', motion: 'moveByWords', motionArgs: { forward: false, wordEnd: true, bigWord: true, inclusive: true }},
    { keys: '{', type: 'motion', motion: 'moveByParagraph', motionArgs: { forward: false, toJumplist: true }},
    { keys: '}', type: 'motion', motion: 'moveByParagraph', motionArgs: { forward: true, toJumplist: true }},
    { keys: '(', type: 'motion', motion: 'moveBySentence', motionArgs: { forward: false }},
    { keys: ')', type: 'motion', motion: 'moveBySentence', motionArgs: { forward: true }},
    { keys: '<C-f>', type: 'motion', motion: 'moveByPage', motionArgs: { forward: true }},
    { keys: '<C-b>', type: 'motion', motion: 'moveByPage', motionArgs: { forward: false }},
    { keys: '<C-d>', type: 'motion', motion: 'moveByScroll', motionArgs: { forward: true, explicitRepeat: true }},
    { keys: '<C-u>', type: 'motion', motion: 'moveByScroll', motionArgs: { forward: false, explicitRepeat: true }},
    { keys: 'gg', type: 'motion', motion: 'moveToLineOrEdgeOfDocument', motionArgs: { forward: false, explicitRepeat: true, linewise: true, toJumplist: true }},
    { keys: 'G', type: 'motion', motion: 'moveToLineOrEdgeOfDocument', motionArgs: { forward: true, explicitRepeat: true, linewise: true, toJumplist: true }},
    { keys: '0', type: 'motion', motion: 'moveToStartOfLine' },
    { keys: '^', type: 'motion', motion: 'moveToFirstNonWhiteSpaceCharacter' },
    { keys: '+', type: 'motion', motion: 'moveByLines', motionArgs: { forward: true, toFirstChar:true }},
    { keys: '-', type: 'motion', motion: 'moveByLines', motionArgs: { forward: false, toFirstChar:true }},
    { keys: '_', type: 'motion', motion: 'moveByLines', motionArgs: { forward: true, toFirstChar:true, repeatOffset:-1 }},
    { keys: '$', type: 'motion', motion: 'moveToEol', motionArgs: { inclusive: true }},
    { keys: '%', type: 'motion', motion: 'moveToMatchedSymbol', motionArgs: { inclusive: true, toJumplist: true }},
    { keys: 'f<character>', type: 'motion', motion: 'moveToCharacter', motionArgs: { forward: true , inclusive: true }},
    { keys: 'F<character>', type: 'motion', motion: 'moveToCharacter', motionArgs: { forward: false }},
    { keys: 't<character>', type: 'motion', motion: 'moveTillCharacter', motionArgs: { forward: true, inclusive: true }},
    { keys: 'T<character>', type: 'motion', motion: 'moveTillCharacter', motionArgs: { forward: false }},
    { keys: ';', type: 'motion', motion: 'repeatLastCharacterSearch', motionArgs: { forward: true }},
    { keys: ',', type: 'motion', motion: 'repeatLastCharacterSearch', motionArgs: { forward: false }},
    { keys: '\'<character>', type: 'motion', motion: 'goToMark', motionArgs: {toJumplist: true, linewise: true}},
    { keys: '`<character>', type: 'motion', motion: 'goToMark', motionArgs: {toJumplist: true}},
    { keys: ']`', type: 'motion', motion: 'jumpToMark', motionArgs: { forward: true } },
    { keys: '[`', type: 'motion', motion: 'jumpToMark', motionArgs: { forward: false } },
    { keys: ']\'', type: 'motion', motion: 'jumpToMark', motionArgs: { forward: true, linewise: true } },
    { keys: '[\'', type: 'motion', motion: 'jumpToMark', motionArgs: { forward: false, linewise: true } },
    // the next two aren't motions but must come before more general motion declarations
    { keys: ']p', type: 'action', action: 'paste', isEdit: true, actionArgs: { after: true, isEdit: true, matchIndent: true}},
    { keys: '[p', type: 'action', action: 'paste', isEdit: true, actionArgs: { after: false, isEdit: true, matchIndent: true}},
    { keys: ']<character>', type: 'motion', motion: 'moveToSymbol', motionArgs: { forward: true, toJumplist: true}},
    { keys: '[<character>', type: 'motion', motion: 'moveToSymbol', motionArgs: { forward: false, toJumplist: true}},
    { keys: '|', type: 'motion', motion: 'moveToColumn'},
    { keys: 'o', type: 'motion', motion: 'moveToOtherHighlightedEnd', context:'visual'},
    { keys: 'O', type: 'motion', motion: 'moveToOtherHighlightedEnd', motionArgs: {sameLine: true}, context:'visual'},
    // Operators
    { keys: 'd', type: 'operator', operator: 'delete' },
    { keys: 'y', type: 'operator', operator: 'yank' },
    { keys: 'c', type: 'operator', operator: 'change' },
    { keys: '=', type: 'operator', operator: 'indentAuto' },
    { keys: '>', type: 'operator', operator: 'indent', operatorArgs: { indentRight: true }},
    { keys: '<', type: 'operator', operator: 'indent', operatorArgs: { indentRight: false }},
    { keys: 'g~', type: 'operator', operator: 'changeCase' },
    { keys: 'gu', type: 'operator', operator: 'changeCase', operatorArgs: {toLower: true}, isEdit: true },
    { keys: 'gU', type: 'operator', operator: 'changeCase', operatorArgs: {toLower: false}, isEdit: true },
    { keys: 'n', type: 'motion', motion: 'findNext', motionArgs: { forward: true, toJumplist: true }},
    { keys: 'N', type: 'motion', motion: 'findNext', motionArgs: { forward: false, toJumplist: true }},
    // Operator-Motion dual commands
    { keys: 'x', type: 'operatorMotion', operator: 'delete', motion: 'moveByCharacters', motionArgs: { forward: true }, operatorMotionArgs: { visualLine: false }},
    { keys: 'X', type: 'operatorMotion', operator: 'delete', motion: 'moveByCharacters', motionArgs: { forward: false }, operatorMotionArgs: { visualLine: true }},
    { keys: 'D', type: 'operatorMotion', operator: 'delete', motion: 'moveToEol', motionArgs: { inclusive: true }, context: 'normal'},
    { keys: 'D', type: 'operator', operator: 'delete', operatorArgs: { linewise: true }, context: 'visual'},
    { keys: 'Y', type: 'operatorMotion', operator: 'yank', motion: 'expandToLine', motionArgs: { linewise: true }, context: 'normal'},
    { keys: 'Y', type: 'operator', operator: 'yank', operatorArgs: { linewise: true }, context: 'visual'},
    { keys: 'C', type: 'operatorMotion', operator: 'change', motion: 'moveToEol', motionArgs: { inclusive: true }, context: 'normal'},
    { keys: 'C', type: 'operator', operator: 'change', operatorArgs: { linewise: true }, context: 'visual'},
    { keys: '~', type: 'operatorMotion', operator: 'changeCase', motion: 'moveByCharacters', motionArgs: { forward: true }, operatorArgs: { shouldMoveCursor: true }, context: 'normal'},
    { keys: '~', type: 'operator', operator: 'changeCase', context: 'visual'},
    { keys: '<C-w>', type: 'operatorMotion', operator: 'delete', motion: 'moveByWords', motionArgs: { forward: false, wordEnd: false }, context: 'insert' },
    //ignore C-w in normal mode
    { keys: '<C-w>', type: 'idle', context: 'normal' },
    // Actions
    { keys: '<C-i>', type: 'action', action: 'jumpListWalk', actionArgs: { forward: true }},
    { keys: '<C-o>', type: 'action', action: 'jumpListWalk', actionArgs: { forward: false }},
    { keys: '<C-e>', type: 'action', action: 'scroll', actionArgs: { forward: true, linewise: true }},
    { keys: '<C-y>', type: 'action', action: 'scroll', actionArgs: { forward: false, linewise: true }},
    { keys: 'a', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'charAfter' }, context: 'normal' },
    { keys: 'A', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'eol' }, context: 'normal' },
    { keys: 'A', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'endOfSelectedArea' }, context: 'visual' },
    { keys: 'i', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'inplace' }, context: 'normal' },
    { keys: 'I', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'firstNonBlank'}, context: 'normal' },
    { keys: 'I', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'startOfSelectedArea' }, context: 'visual' },
    { keys: 'o', type: 'action', action: 'newLineAndEnterInsertMode', isEdit: true, interlaceInsertRepeat: true, actionArgs: { after: true }, context: 'normal' },
    { keys: 'O', type: 'action', action: 'newLineAndEnterInsertMode', isEdit: true, interlaceInsertRepeat: true, actionArgs: { after: false }, context: 'normal' },
    { keys: 'v', type: 'action', action: 'toggleVisualMode' },
    { keys: 'V', type: 'action', action: 'toggleVisualMode', actionArgs: { linewise: true }},
    { keys: '<C-v>', type: 'action', action: 'toggleVisualMode', actionArgs: { blockwise: true }},
    { keys: '<C-q>', type: 'action', action: 'toggleVisualMode', actionArgs: { blockwise: true }},
    { keys: 'gv', type: 'action', action: 'reselectLastSelection' },
    { keys: 'J', type: 'action', action: 'joinLines', isEdit: true },
    { keys: 'p', type: 'action', action: 'paste', isEdit: true, actionArgs: { after: true, isEdit: true }},
    { keys: 'P', type: 'action', action: 'paste', isEdit: true, actionArgs: { after: false, isEdit: true }},
    { keys: 'r<character>', type: 'action', action: 'replace', isEdit: true },
    { keys: '@<character>', type: 'action', action: 'replayMacro' },
    { keys: 'q<character>', type: 'action', action: 'enterMacroRecordMode' },
    // Handle Replace-mode as a special case of insert mode.
    { keys: 'R', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { replace: true }},
    { keys: 'u', type: 'action', action: 'undo', context: 'normal' },
    { keys: 'u', type: 'operator', operator: 'changeCase', operatorArgs: {toLower: true}, context: 'visual', isEdit: true },
    { keys: 'U', type: 'operator', operator: 'changeCase', operatorArgs: {toLower: false}, context: 'visual', isEdit: true },
    { keys: '<C-r>', type: 'action', action: 'redo' },
    { keys: 'm<character>', type: 'action', action: 'setMark' },
    { keys: '"<character>', type: 'action', action: 'setRegister' },
    { keys: 'zz', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'center' }},
    { keys: 'z.', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'center' }, motion: 'moveToFirstNonWhiteSpaceCharacter' },
    { keys: 'zt', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'top' }},
    { keys: 'z<CR>', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'top' }, motion: 'moveToFirstNonWhiteSpaceCharacter' },
    { keys: 'z-', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'bottom' }},
    { keys: 'zb', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'bottom' }, motion: 'moveToFirstNonWhiteSpaceCharacter' },
    { keys: '.', type: 'action', action: 'repeatLastEdit' },
    { keys: '<C-a>', type: 'action', action: 'incrementNumberToken', isEdit: true, actionArgs: {increase: true, backtrack: false}},
    { keys: '<C-x>', type: 'action', action: 'incrementNumberToken', isEdit: true, actionArgs: {increase: false, backtrack: false}},
    { keys: '<C-t>', type: 'action', action: 'indent', actionArgs: { indentRight: true }, context: 'insert' },
    { keys: '<C-d>', type: 'action', action: 'indent', actionArgs: { indentRight: false }, context: 'insert' },
    // Text object motions
    { keys: 'a<character>', type: 'motion', motion: 'textObjectManipulation' },
    { keys: 'i<character>', type: 'motion', motion: 'textObjectManipulation', motionArgs: { textObjectInner: true }},
    // Search
    { keys: '/', type: 'search', searchArgs: { forward: true, querySrc: 'prompt', toJumplist: true }},
    { keys: '?', type: 'search', searchArgs: { forward: false, querySrc: 'prompt', toJumplist: true }},
    { keys: '*', type: 'search', searchArgs: { forward: true, querySrc: 'wordUnderCursor', wholeWordOnly: true, toJumplist: true }},
    { keys: '#', type: 'search', searchArgs: { forward: false, querySrc: 'wordUnderCursor', wholeWordOnly: true, toJumplist: true }},
    { keys: 'g*', type: 'search', searchArgs: { forward: true, querySrc: 'wordUnderCursor', toJumplist: true }},
    { keys: 'g#', type: 'search', searchArgs: { forward: false, querySrc: 'wordUnderCursor', toJumplist: true }},
    // Ex command
    { keys: ':', type: 'ex' }
  ];
  var defaultKeymapLength = defaultKeymap.length;

  /**
   * Ex commands
   * Care must be taken when adding to the default Ex command map. For any
   * pair of commands that have a shared prefix, at least one of their
   * shortNames must not match the prefix of the other command.
   */
  var defaultExCommandMap = [
    { name: 'colorscheme', shortName: 'colo' },
    { name: 'map' },
    { name: 'imap', shortName: 'im' },
    { name: 'nmap', shortName: 'nm' },
    { name: 'vmap', shortName: 'vm' },
    { name: 'unmap' },
    { name: 'write', shortName: 'w' },
    { name: 'undo', shortName: 'u' },
    { name: 'redo', shortName: 'red' },
    { name: 'set', shortName: 'se' },
    { name: 'set', shortName: 'se' },
    { name: 'setlocal', shortName: 'setl' },
    { name: 'setglobal', shortName: 'setg' },
    { name: 'sort', shortName: 'sor' },
    { name: 'substitute', shortName: 's', possiblyAsync: true },
    { name: 'nohlsearch', shortName: 'noh' },
    { name: 'yank', shortName: 'y' },
    { name: 'delmarks', shortName: 'delm' },
    { name: 'registers', shortName: 'reg', excludeFromCommandHistory: true },
    { name: 'global', shortName: 'g' }
  ];

  var Pos = CodeMirror.Pos;

  var Vim = function() {
    function enterVimMode(cm) {
      cm.setOption('disableInput', true);
      cm.setOption('showCursorWhenSelecting', false);
      CodeMirror.signal(cm, "vim-mode-change", {mode: "normal"});
      cm.on('cursorActivity', onCursorActivity);
      maybeInitVimState(cm);
      CodeMirror.on(cm.getInputField(), 'paste', getOnPasteFn(cm));
    }

    function leaveVimMode(cm) {
      cm.setOption('disableInput', false);
      cm.off('cursorActivity', onCursorActivity);
      CodeMirror.off(cm.getInputField(), 'paste', getOnPasteFn(cm));
      cm.state.vim = null;
    }

    function detachVimMap(cm, next) {
      if (this == CodeMirror.keyMap.vim) {
        CodeMirror.rmClass(cm.getWrapperElement(), "cm-fat-cursor");
        if (cm.getOption("inputStyle") == "contenteditable" && document.body.style.caretColor != null) {
          disableFatCursorMark(cm);
          cm.getInputField().style.caretColor = "";
        }
      }

      if (!next || next.attach != attachVimMap)
        leaveVimMode(cm);
    }
    function attachVimMap(cm, prev) {
      if (this == CodeMirror.keyMap.vim) {
        CodeMirror.addClass(cm.getWrapperElement(), "cm-fat-cursor");
        if (cm.getOption("inputStyle") == "contenteditable" && document.body.style.caretColor != null) {
          enableFatCursorMark(cm);
          cm.getInputField().style.caretColor = "transparent";
        }
      }

      if (!prev || prev.attach != attachVimMap)
        enterVimMode(cm);
    }

    function updateFatCursorMark(cm) {
      if (!cm.state.fatCursorMarks) return;
      clearFatCursorMark(cm);
      var ranges = cm.listSelections(), result = []
      for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i]
        if (range.empty()) {
          if (range.anchor.ch < cm.getLine(range.anchor.line).length) {
            result.push(cm.markText(range.anchor, Pos(range.anchor.line, range.anchor.ch + 1),
                                    {className: "cm-fat-cursor-mark"}))
          } else {
            var widget = document.createElement("span")
            widget.textContent = "\u00a0"
            widget.className = "cm-fat-cursor-mark"
            result.push(cm.setBookmark(range.anchor, {widget: widget}))
          }
        }
      }
      cm.state.fatCursorMarks = result;
    }

    function clearFatCursorMark(cm) {
      var marks = cm.state.fatCursorMarks;
      if (marks) for (var i = 0; i < marks.length; i++) marks[i].clear();
    }

    function enableFatCursorMark(cm) {
      cm.state.fatCursorMarks = [];
      updateFatCursorMark(cm)
      cm.on("cursorActivity", updateFatCursorMark)
    }

    function disableFatCursorMark(cm) {
      clearFatCursorMark(cm);
      cm.off("cursorActivity", updateFatCursorMark);
      // explicitly set fatCursorMarks to null because event listener above
      // can be invoke after removing it, if off is called from operation
      cm.state.fatCursorMarks = null;
    }

    // Deprecated, simply setting the keymap works again.
    CodeMirror.defineOption('vimMode', false, function(cm, val, prev) {
      if (val && cm.getOption("keyMap") != "vim")
        cm.setOption("keyMap", "vim");
      else if (!val && prev != CodeMirror.Init && /^vim/.test(cm.getOption("keyMap")))
        cm.setOption("keyMap", "default");
    });

    function cmKey(key, cm) {
      if (!cm) { return undefined; }
      if (this[key]) { return this[key]; }
      var vimKey = cmKeyToVimKey(key);
      if (!vimKey) {
        return false;
      }
      var cmd = CodeMirror.Vim.findKey(cm, vimKey);
      if (typeof cmd == 'function') {
        CodeMirror.signal(cm, 'vim-keypress', vimKey);
      }
      return cmd;
    }

    var modifiers = {'Shift': 'S', 'Ctrl': 'C', 'Alt': 'A', 'Cmd': 'D', 'Mod': 'A'};
    var specialKeys = {Enter:'CR',Backspace:'BS',Delete:'Del',Insert:'Ins'};
    function cmKeyToVimKey(key) {
      if (key.charAt(0) == '\'') {
        // Keypress character binding of format "'a'"
        return key.charAt(1);
      }
      var pieces = key.split(/-(?!$)/);
      var lastPiece = pieces[pieces.length - 1];
      if (pieces.length == 1 && pieces[0].length == 1) {
        // No-modifier bindings use literal character bindings above. Skip.
        return false;
      } else if (pieces.length == 2 && pieces[0] == 'Shift' && lastPiece.length == 1) {
        // Ignore Shift+char bindings as they should be handled by literal character.
        return false;
      }
      var hasCharacter = false;
      for (var i = 0; i < pieces.length; i++) {
        var piece = pieces[i];
        if (piece in modifiers) { pieces[i] = modifiers[piece]; }
        else { hasCharacter = true; }
        if (piece in specialKeys) { pieces[i] = specialKeys[piece]; }
      }
      if (!hasCharacter) {
        // Vim does not support modifier only keys.
        return false;
      }
      // TODO: Current bindings expect the character to be lower case, but
      // it looks like vim key notation uses upper case.
      if (isUpperCase(lastPiece)) {
        pieces[pieces.length - 1] = lastPiece.toLowerCase();
      }
      return '<' + pieces.join('-') + '>';
    }

    function getOnPasteFn(cm) {
      var vim = cm.state.vim;
      if (!vim.onPasteFn) {
        vim.onPasteFn = function() {
          if (!vim.insertMode) {
            cm.setCursor(offsetCursor(cm.getCursor(), 0, 1));
            actions.enterInsertMode(cm, {}, vim);
          }
        };
      }
      return vim.onPasteFn;
    }

    var numberRegex = /[\d]/;
    var wordCharTest = [CodeMirror.isWordChar, function(ch) {
      return ch && !CodeMirror.isWordChar(ch) && !/\s/.test(ch);
    }], bigWordCharTest = [function(ch) {
      return /\S/.test(ch);
    }];
    function makeKeyRange(start, size) {
      var keys = [];
      for (var i = start; i < start + size; i++) {
        keys.push(String.fromCharCode(i));
      }
      return keys;
    }
    var upperCaseAlphabet = makeKeyRange(65, 26);
    var lowerCaseAlphabet = makeKeyRange(97, 26);
    var numbers = makeKeyRange(48, 10);
    var validMarks = [].concat(upperCaseAlphabet, lowerCaseAlphabet, numbers, ['<', '>']);
    var validRegisters = [].concat(upperCaseAlphabet, lowerCaseAlphabet, numbers, ['-', '"', '.', ':', '/']);

    function isLine(cm, line) {
      return line >= cm.firstLine() && line <= cm.lastLine();
    }
    function isLowerCase(k) {
      return (/^[a-z]$/).test(k);
    }
    function isMatchableSymbol(k) {
      return '()[]{}'.indexOf(k) != -1;
    }
    function isNumber(k) {
      return numberRegex.test(k);
    }
    function isUpperCase(k) {
      return (/^[A-Z]$/).test(k);
    }
    function isWhiteSpaceString(k) {
      return (/^\s*$/).test(k);
    }
    function isEndOfSentenceSymbol(k) {
      return '.?!'.indexOf(k) != -1;
    }
    function inArray(val, arr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
          return true;
        }
      }
      return false;
    }

    var options = {};
    function defineOption(name, defaultValue, type, aliases, callback) {
      if (defaultValue === undefined && !callback) {
        throw Error('defaultValue is required unless callback is provided');
      }
      if (!type) { type = 'string'; }
      options[name] = {
        type: type,
        defaultValue: defaultValue,
        callback: callback
      };
      if (aliases) {
        for (var i = 0; i < aliases.length; i++) {
          options[aliases[i]] = options[name];
        }
      }
      if (defaultValue) {
        setOption(name, defaultValue);
      }
    }

    function setOption(name, value, cm, cfg) {
      var option = options[name];
      cfg = cfg || {};
      var scope = cfg.scope;
      if (!option) {
        return new Error('Unknown option: ' + name);
      }
      if (option.type == 'boolean') {
        if (value && value !== true) {
          return new Error('Invalid argument: ' + name + '=' + value);
        } else if (value !== false) {
          // Boolean options are set to true if value is not defined.
          value = true;
        }
      }
      if (option.callback) {
        if (scope !== 'local') {
          option.callback(value, undefined);
        }
        if (scope !== 'global' && cm) {
          option.callback(value, cm);
        }
      } else {
        if (scope !== 'local') {
          option.value = option.type == 'boolean' ? !!value : value;
        }
        if (scope !== 'global' && cm) {
          cm.state.vim.options[name] = {value: value};
        }
      }
    }

    function getOption(name, cm, cfg) {
      var option = options[name];
      cfg = cfg || {};
      var scope = cfg.scope;
      if (!option) {
        return new Error('Unknown option: ' + name);
      }
      if (option.callback) {
        var local = cm && option.callback(undefined, cm);
        if (scope !== 'global' && local !== undefined) {
          return local;
        }
        if (scope !== 'local') {
          return option.callback();
        }
        return;
      } else {
        var local = (scope !== 'global') && (cm && cm.state.vim.options[name]);
        return (local || (scope !== 'local') && option || {}).value;
      }
    }

    defineOption('filetype', undefined, 'string', ['ft'], function(name, cm) {
      // Option is local. Do nothing for global.
      if (cm === undefined) {
        return;
      }
      // The 'filetype' option proxies to the CodeMirror 'mode' option.
      if (name === undefined) {
        var mode = cm.getOption('mode');
        return mode == 'null' ? '' : mode;
      } else {
        var mode = name == '' ? 'null' : name;
        cm.setOption('mode', mode);
      }
    });

    var createCircularJumpList = function() {
      var size = 100;
      var pointer = -1;
      var head = 0;
      var tail = 0;
      var buffer = new Array(size);
      function add(cm, oldCur, newCur) {
        var current = pointer % size;
        var curMark = buffer[current];
        function useNextSlot(cursor) {
          var next = ++pointer % size;
          var trashMark = buffer[next];
          if (trashMark) {
            trashMark.clear();
          }
          buffer[next] = cm.setBookmark(cursor);
        }
        if (curMark) {
          var markPos = curMark.find();
          // avoid recording redundant cursor position
          if (markPos && !cursorEqual(markPos, oldCur)) {
            useNextSlot(oldCur);
          }
        } else {
          useNextSlot(oldCur);
        }
        useNextSlot(newCur);
        head = pointer;
        tail = pointer - size + 1;
        if (tail < 0) {
          tail = 0;
        }
      }
      function move(cm, offset) {
        pointer += offset;
        if (pointer > head) {
          pointer = head;
        } else if (pointer < tail) {
          pointer = tail;
        }
        var mark = buffer[(size + pointer) % size];
        // skip marks that are temporarily removed from text buffer
        if (mark && !mark.find()) {
          var inc = offset > 0 ? 1 : -1;
          var newCur;
          var oldCur = cm.getCursor();
          do {
            pointer += inc;
            mark = buffer[(size + pointer) % size];
            // skip marks that are the same as current position
            if (mark &&
                (newCur = mark.find()) &&
                !cursorEqual(oldCur, newCur)) {
              break;
            }
          } while (pointer < head && pointer > tail);
        }
        return mark;
      }
      return {
        cachedCursor: undefined, //used for # and * jumps
        add: add,
        move: move
      };
    };

    // Returns an object to track the changes associated insert mode.  It
    // clones the object that is passed in, or creates an empty object one if
    // none is provided.
    var createInsertModeChanges = function(c) {
      if (c) {
        // Copy construction
        return {
          changes: c.changes,
          expectCursorActivityForChange: c.expectCursorActivityForChange
        };
      }
      return {
        // Change list
        changes: [],
        // Set to true on change, false on cursorActivity.
        expectCursorActivityForChange: false
      };
    };

    function MacroModeState() {
      this.latestRegister = undefined;
      this.isPlaying = false;
      this.isRecording = false;
      this.replaySearchQueries = [];
      this.onRecordingDone = undefined;
      this.lastInsertModeChanges = createInsertModeChanges();
    }
    MacroModeState.prototype = {
      exitMacroRecordMode: function() {
        var macroModeState = vimGlobalState.macroModeState;
        if (macroModeState.onRecordingDone) {
          macroModeState.onRecordingDone(); // close dialog
        }
        macroModeState.onRecordingDone = undefined;
        macroModeState.isRecording = false;
      },
      enterMacroRecordMode: function(cm, registerName) {
        var register =
            vimGlobalState.registerController.getRegister(registerName);
        if (register) {
          register.clear();
          this.latestRegister = registerName;
          if (cm.openDialog) {
            this.onRecordingDone = cm.openDialog(
                '(recording)['+registerName+']', null, {bottom:true});
          }
          this.isRecording = true;
        }
      }
    };

    function maybeInitVimState(cm) {
      if (!cm.state.vim) {
        // Store instance state in the CodeMirror object.
        cm.state.vim = {
          inputState: new InputState(),
          // Vim's input state that triggered the last edit, used to repeat
          // motions and operators with '.'.
          lastEditInputState: undefined,
          // Vim's action command before the last edit, used to repeat actions
          // with '.' and insert mode repeat.
          lastEditActionCommand: undefined,
          // When using jk for navigation, if you move from a longer line to a
          // shorter line, the cursor may clip to the end of the shorter line.
          // If j is pressed again and cursor goes to the next line, the
          // cursor should go back to its horizontal position on the longer
          // line if it can. This is to keep track of the horizontal position.
          lastHPos: -1,
          // Doing the same with screen-position for gj/gk
          lastHSPos: -1,
          // The last motion command run. Cleared if a non-motion command gets
          // executed in between.
          lastMotion: null,
          marks: {},
          // Mark for rendering fake cursor for visual mode.
          fakeCursor: null,
          insertMode: false,
          // Repeat count for changes made in insert mode, triggered by key
          // sequences like 3,i. Only exists when insertMode is true.
          insertModeRepeat: undefined,
          visualMode: false,
          // If we are in visual line mode. No effect if visualMode is false.
          visualLine: false,
          visualBlock: false,
          lastSelection: null,
          lastPastedText: null,
          sel: {},
          // Buffer-local/window-local values of vim options.
          options: {}
        };
      }
      return cm.state.vim;
    }
    var vimGlobalState;
    function resetVimGlobalState() {
      vimGlobalState = {
        // The current search query.
        searchQuery: null,
        // Whether we are searching backwards.
        searchIsReversed: false,
        // Replace part of the last substituted pattern
        lastSubstituteReplacePart: undefined,
        jumpList: createCircularJumpList(),
        macroModeState: new MacroModeState,
        // Recording latest f, t, F or T motion command.
        lastCharacterSearch: {increment:0, forward:true, selectedCharacter:''},
        registerController: new RegisterController({}),
        // search history buffer
        searchHistoryController: new HistoryController(),
        // ex Command history buffer
        exCommandHistoryController : new HistoryController()
      };
      for (var optionName in options) {
        var option = options[optionName];
        option.value = option.defaultValue;
      }
    }

    var lastInsertModeKeyTimer;
    var vimApi= {
      buildKeyMap: function() {
        // TODO: Convert keymap into dictionary format for fast lookup.
      },
      // Testing hook, though it might be useful to expose the register
      // controller anyways.
      getRegisterController: function() {
        return vimGlobalState.registerController;
      },
      // Testing hook.
      resetVimGlobalState_: resetVimGlobalState,

      // Testing hook.
      getVimGlobalState_: function() {
        return vimGlobalState;
      },

      // Testing hook.
      maybeInitVimState_: maybeInitVimState,

      suppressErrorLogging: false,

      InsertModeKey: InsertModeKey,
      map: function(lhs, rhs, ctx) {
        // Add user defined key bindings.
        exCommandDispatcher.map(lhs, rhs, ctx);
      },
      unmap: function(lhs, ctx) {
        exCommandDispatcher.unmap(lhs, ctx);
      },
      // Non-recursive map function.
      // NOTE: This will not create mappings to key maps that aren't present
      // in the default key map. See TODO at bottom of function.
      noremap: function(lhs, rhs, ctx) {
        function toCtxArray(ctx) {
          return ctx ? [ctx] : ['normal', 'insert', 'visual'];
        }
        var ctxsToMap = toCtxArray(ctx);
        // Look through all actual defaults to find a map candidate.
        var actualLength = defaultKeymap.length, origLength = defaultKeymapLength;
        for (var i = actualLength - origLength;
             i < actualLength && ctxsToMap.length;
             i++) {
          var mapping = defaultKeymap[i];
          // Omit mappings that operate in the wrong context(s) and those of invalid type.
          if (mapping.keys == rhs &&
              (!ctx || !mapping.context || mapping.context === ctx) &&
              mapping.type.substr(0, 2) !== 'ex' &&
              mapping.type.substr(0, 3) !== 'key') {
            // Make a shallow copy of the original keymap entry.
            var newMapping = {};
            for (var key in mapping) {
              newMapping[key] = mapping[key];
            }
            // Modify it point to the new mapping with the proper context.
            newMapping.keys = lhs;
            if (ctx && !newMapping.context) {
              newMapping.context = ctx;
            }
            // Add it to the keymap with a higher priority than the original.
            this._mapCommand(newMapping);
            // Record the mapped contexts as complete.
            var mappedCtxs = toCtxArray(mapping.context);
            ctxsToMap = ctxsToMap.filter(function(el) { return mappedCtxs.indexOf(el) === -1; });
          }
        }
        // TODO: Create non-recursive keyToKey mappings for the unmapped contexts once those exist.
      },
      // Remove all user-defined mappings for the provided context.
      mapclear: function(ctx) {
        // Partition the existing keymap into user-defined and true defaults.
        var actualLength = defaultKeymap.length,
            origLength = defaultKeymapLength;
        var userKeymap = defaultKeymap.slice(0, actualLength - origLength);
        defaultKeymap = defaultKeymap.slice(actualLength - origLength);
        if (ctx) {
          // If a specific context is being cleared, we need to keep mappings
          // from all other contexts.
          for (var i = userKeymap.length - 1; i >= 0; i--) {
            var mapping = userKeymap[i];
            if (ctx !== mapping.context) {
              if (mapping.context) {
                this._mapCommand(mapping);
              } else {
                // `mapping` applies to all contexts so create keymap copies
                // for each context except the one being cleared.
                var contexts = ['normal', 'insert', 'visual'];
                for (var j in contexts) {
                  if (contexts[j] !== ctx) {
                    var newMapping = {};
                    for (var key in mapping) {
                      newMapping[key] = mapping[key];
                    }
                    newMapping.context = contexts[j];
                    this._mapCommand(newMapping);
                  }
                }
              }
            }
          }
        }
      },
      // TODO: Expose setOption and getOption as instance methods. Need to decide how to namespace
      // them, or somehow make them work with the existing CodeMirror setOption/getOption API.
      setOption: setOption,
      getOption: getOption,
      defineOption: defineOption,
      defineEx: function(name, prefix, func){
        if (!prefix) {
          prefix = name;
        } else if (name.indexOf(prefix) !== 0) {
          throw new Error('(Vim.defineEx) "'+prefix+'" is not a prefix of "'+name+'", command not registered');
        }
        exCommands[name]=func;
        exCommandDispatcher.commandMap_[prefix]={name:name, shortName:prefix, type:'api'};
      },
      handleKey: function (cm, key, origin) {
        var command = this.findKey(cm, key, origin);
        if (typeof command === 'function') {
          return command();
        }
      },
      /**
       * This is the outermost function called by CodeMirror, after keys have
       * been mapped to their Vim equivalents.
       *
       * Finds a command based on the key (and cached keys if there is a
       * multi-key sequence). Returns `undefined` if no key is matched, a noop
       * function if a partial match is found (multi-key), and a function to
       * execute the bound command if a a key is matched. The function always
       * returns true.
       */
      findKey: function(cm, key, origin) {
        var vim = maybeInitVimState(cm);
        function handleMacroRecording() {
          var macroModeState = vimGlobalState.macroModeState;
          if (macroModeState.isRecording) {
            if (key == 'q') {
              macroModeState.exitMacroRecordMode();
              clearInputState(cm);
              return true;
            }
            if (origin != 'mapping') {
              logKey(macroModeState, key);
            }
          }
        }
        function handleEsc() {
          if (key == '<Esc>') {
            // Clear input state and get back to normal mode.
            clearInputState(cm);
            if (vim.visualMode) {
              exitVisualMode(cm);
            } else if (vim.insertMode) {
              exitInsertMode(cm);
            }
            return true;
          }
        }
        function doKeyToKey(keys) {
          // TODO: prevent infinite recursion.
          var match;
          while (keys) {
            // Pull off one command key, which is either a single character
            // or a special sequence wrapped in '<' and '>', e.g. '<Space>'.
            match = (/<\w+-.+?>|<\w+>|./).exec(keys);
            key = match[0];
            keys = keys.substring(match.index + key.length);
            CodeMirror.Vim.handleKey(cm, key, 'mapping');
          }
        }

        function handleKeyInsertMode() {
          if (handleEsc()) { return true; }
          var keys = vim.inputState.keyBuffer = vim.inputState.keyBuffer + key;
          var keysAreChars = key.length == 1;
          var match = commandDispatcher.matchCommand(keys, defaultKeymap, vim.inputState, 'insert');
          // Need to check all key substrings in insert mode.
          while (keys.length > 1 && match.type != 'full') {
            var keys = vim.inputState.keyBuffer = keys.slice(1);
            var thisMatch = commandDispatcher.matchCommand(keys, defaultKeymap, vim.inputState, 'insert');
            if (thisMatch.type != 'none') { match = thisMatch; }
          }
          if (match.type == 'none') { clearInputState(cm); return false; }
          else if (match.type == 'partial') {
            if (lastInsertModeKeyTimer) { window.clearTimeout(lastInsertModeKeyTimer); }
            lastInsertModeKeyTimer = window.setTimeout(
              function() { if (vim.insertMode && vim.inputState.keyBuffer) { clearInputState(cm); } },
              getOption('insertModeEscKeysTimeout'));
            return !keysAreChars;
          }

          if (lastInsertModeKeyTimer) { window.clearTimeout(lastInsertModeKeyTimer); }
          if (keysAreChars) {
            var selections = cm.listSelections();
            for (var i = 0; i < selections.length; i++) {
              var here = selections[i].head;
              cm.replaceRange('', offsetCursor(here, 0, -(keys.length - 1)), here, '+input');
            }
            vimGlobalState.macroModeState.lastInsertModeChanges.changes.pop();
          }
          clearInputState(cm);
          return match.command;
        }

        function handleKeyNonInsertMode() {
          if (handleMacroRecording() || handleEsc()) { return true; }

          var keys = vim.inputState.keyBuffer = vim.inputState.keyBuffer + key;
          if (/^[1-9]\d*$/.test(keys)) { return true; }

          var keysMatcher = /^(\d*)(.*)$/.exec(keys);
          if (!keysMatcher) { clearInputState(cm); return false; }
          var context = vim.visualMode ? 'visual' :
                                         'normal';
          var match = commandDispatcher.matchCommand(keysMatcher[2] || keysMatcher[1], defaultKeymap, vim.inputState, context);
          if (match.type == 'none') { clearInputState(cm); return false; }
          else if (match.type == 'partial') { return true; }

          vim.inputState.keyBuffer = '';
          var keysMatcher = /^(\d*)(.*)$/.exec(keys);
          if (keysMatcher[1] && keysMatcher[1] != '0') {
            vim.inputState.pushRepeatDigit(keysMatcher[1]);
          }
          return match.command;
        }

        var command;
        if (vim.insertMode) { command = handleKeyInsertMode(); }
        else { command = handleKeyNonInsertMode(); }
        if (command === false) {
          return !vim.insertMode && key.length === 1 ? function() { return true; } : undefined;
        } else if (command === true) {
          // TODO: Look into using CodeMirror's multi-key handling.
          // Return no-op since we are caching the key. Counts as handled, but
          // don't want act on it just yet.
          return function() { return true; };
        } else {
          return function() {
            return cm.operation(function() {
              cm.curOp.isVimOp = true;
              try {
                if (command.type == 'keyToKey') {
                  doKeyToKey(command.toKeys);
                } else {
                  commandDispatcher.processCommand(cm, vim, command);
                }
              } catch (e) {
                // clear VIM state in case it's in a bad state.
                cm.state.vim = undefined;
                maybeInitVimState(cm);
                if (!CodeMirror.Vim.suppressErrorLogging) {
                  console['log'](e);
                }
                throw e;
              }
              return true;
            });
          };
        }
      },
      handleEx: function(cm, input) {
        exCommandDispatcher.processCommand(cm, input);
      },

      defineMotion: defineMotion,
      defineAction: defineAction,
      defineOperator: defineOperator,
      mapCommand: mapCommand,
      _mapCommand: _mapCommand,

      defineRegister: defineRegister,

      exitVisualMode: exitVisualMode,
      exitInsertMode: exitInsertMode
    };

    // Represents the current input state.
    function InputState() {
      this.prefixRepeat = [];
      this.motionRepeat = [];

      this.operator = null;
      this.operatorArgs = null;
      this.motion = null;
      this.motionArgs = null;
      this.keyBuffer = []; // For matching multi-key commands.
      this.registerName = null; // Defaults to the unnamed register.
    }
    InputState.prototype.pushRepeatDigit = function(n) {
      if (!this.operator) {
        this.prefixRepeat = this.prefixRepeat.concat(n);
      } else {
        this.motionRepeat = this.motionRepeat.concat(n);
      }
    };
    InputState.prototype.getRepeat = function() {
      var repeat = 0;
      if (this.prefixRepeat.length > 0 || this.motionRepeat.length > 0) {
        repeat = 1;
        if (this.prefixRepeat.length > 0) {
          repeat *= parseInt(this.prefixRepeat.join(''), 10);
        }
        if (this.motionRepeat.length > 0) {
          repeat *= parseInt(this.motionRepeat.join(''), 10);
        }
      }
      return repeat;
    };

    function clearInputState(cm, reason) {
      cm.state.vim.inputState = new InputState();
      CodeMirror.signal(cm, 'vim-command-done', reason);
    }

    /*
     * Register stores information about copy and paste registers.  Besides
     * text, a register must store whether it is linewise (i.e., when it is
     * pasted, should it insert itself into a new line, or should the text be
     * inserted at the cursor position.)
     */
    function Register(text, linewise, blockwise) {
      this.clear();
      this.keyBuffer = [text || ''];
      this.insertModeChanges = [];
      this.searchQueries = [];
      this.linewise = !!linewise;
      this.blockwise = !!blockwise;
    }
    Register.prototype = {
      setText: function(text, linewise, blockwise) {
        this.keyBuffer = [text || ''];
        this.linewise = !!linewise;
        this.blockwise = !!blockwise;
      },
      pushText: function(text, linewise) {
        // if this register has ever been set to linewise, use linewise.
        if (linewise) {
          if (!this.linewise) {
            this.keyBuffer.push('\n');
          }
          this.linewise = true;
        }
        this.keyBuffer.push(text);
      },
      pushInsertModeChanges: function(changes) {
        this.insertModeChanges.push(createInsertModeChanges(changes));
      },
      pushSearchQuery: function(query) {
        this.searchQueries.push(query);
      },
      clear: function() {
        this.keyBuffer = [];
        this.insertModeChanges = [];
        this.searchQueries = [];
        this.linewise = false;
      },
      toString: function() {
        return this.keyBuffer.join('');
      }
    };

    /**
     * Defines an external register.
     *
     * The name should be a single character that will be used to reference the register.
     * The register should support setText, pushText, clear, and toString(). See Register
     * for a reference implementation.
     */
    function defineRegister(name, register) {
      var registers = vimGlobalState.registerController.registers;
      if (!name || name.length != 1) {
        throw Error('Register name must be 1 character');
      }
      if (registers[name]) {
        throw Error('Register already defined ' + name);
      }
      registers[name] = register;
      validRegisters.push(name);
    }

    /*
     * vim registers allow you to keep many independent copy and paste buffers.
     * See http://usevim.com/2012/04/13/registers/ for an introduction.
     *
     * RegisterController keeps the state of all the registers.  An initial
     * state may be passed in.  The unnamed register '"' will always be
     * overridden.
     */
    function RegisterController(registers) {
      this.registers = registers;
      this.unnamedRegister = registers['"'] = new Register();
      registers['.'] = new Register();
      registers[':'] = new Register();
      registers['/'] = new Register();
    }
    RegisterController.prototype = {
      pushText: function(registerName, operator, text, linewise, blockwise) {
        if (linewise && text.charAt(text.length - 1) !== '\n'){
          text += '\n';
        }
        // Lowercase and uppercase registers refer to the same register.
        // Uppercase just means append.
        var register = this.isValidRegister(registerName) ?
            this.getRegister(registerName) : null;
        // if no register/an invalid register was specified, things go to the
        // default registers
        if (!register) {
          switch (operator) {
            case 'yank':
              // The 0 register contains the text from the most recent yank.
              this.registers['0'] = new Register(text, linewise, blockwise);
              break;
            case 'delete':
            case 'change':
              if (text.indexOf('\n') == -1) {
                // Delete less than 1 line. Update the small delete register.
                this.registers['-'] = new Register(text, linewise);
              } else {
                // Shift down the contents of the numbered registers and put the
                // deleted text into register 1.
                this.shiftNumericRegisters_();
                this.registers['1'] = new Register(text, linewise);
              }
              break;
          }
          // Make sure the unnamed register is set to what just happened
          this.unnamedRegister.setText(text, linewise, blockwise);
          return;
        }

        // If we've gotten to this point, we've actually specified a register
        var append = isUpperCase(registerName);
        if (append) {
          register.pushText(text, linewise);
        } else {
          register.setText(text, linewise, blockwise);
        }
        // The unnamed register always has the same value as the last used
        // register.
        this.unnamedRegister.setText(register.toString(), linewise);
      },
      // Gets the register named @name.  If one of @name doesn't already exist,
      // create it.  If @name is invalid, return the unnamedRegister.
      getRegister: function(name) {
        if (!this.isValidRegister(name)) {
          return this.unnamedRegister;
        }
        name = name.toLowerCase();
        if (!this.registers[name]) {
          this.registers[name] = new Register();
        }
        return this.registers[name];
      },
      isValidRegister: function(name) {
        return name && inArray(name, validRegisters);
      },
      shiftNumericRegisters_: function() {
        for (var i = 9; i >= 2; i--) {
          this.registers[i] = this.getRegister('' + (i - 1));
        }
      }
    };
    function HistoryController() {
        this.historyBuffer = [];
        this.iterator = 0;
        this.initialPrefix = null;
    }
    HistoryController.prototype = {
      // the input argument here acts a user entered prefix for a small time
      // until we start autocompletion in which case it is the autocompleted.
      nextMatch: function (input, up) {
        var historyBuffer = this.historyBuffer;
        var dir = up ? -1 : 1;
        if (this.initialPrefix === null) this.initialPrefix = input;
        for (var i = this.iterator + dir; up ? i >= 0 : i < historyBuffer.length; i+= dir) {
          var element = historyBuffer[i];
          for (var j = 0; j <= element.length; j++) {
            if (this.initialPrefix == element.substring(0, j)) {
              this.iterator = i;
              return element;
            }
          }
        }
        // should return the user input in case we reach the end of buffer.
        if (i >= historyBuffer.length) {
          this.iterator = historyBuffer.length;
          return this.initialPrefix;
        }
        // return the last autocompleted query or exCommand as it is.
        if (i < 0 ) return input;
      },
      pushInput: function(input) {
        var index = this.historyBuffer.indexOf(input);
        if (index > -1) this.historyBuffer.splice(index, 1);
        if (input.length) this.historyBuffer.push(input);
      },
      reset: function() {
        this.initialPrefix = null;
        this.iterator = this.historyBuffer.length;
      }
    };
    var commandDispatcher = {
      matchCommand: function(keys, keyMap, inputState, context) {
        var matches = commandMatches(keys, keyMap, context, inputState);
        if (!matches.full && !matches.partial) {
          return {type: 'none'};
        } else if (!matches.full && matches.partial) {
          return {type: 'partial'};
        }

        var bestMatch;
        for (var i = 0; i < matches.full.length; i++) {
          var match = matches.full[i];
          if (!bestMatch) {
            bestMatch = match;
          }
        }
        if (bestMatch.keys.slice(-11) == '<character>') {
          var character = lastChar(keys);
          if (!character) return {type: 'none'};
          inputState.selectedCharacter = character;
        }
        return {type: 'full', command: bestMatch};
      },
      processCommand: function(cm, vim, command) {
        vim.inputState.repeatOverride = command.repeatOverride;
        switch (command.type) {
          case 'motion':
            this.processMotion(cm, vim, command);
            break;
          case 'operator':
            this.processOperator(cm, vim, command);
            break;
          case 'operatorMotion':
            this.processOperatorMotion(cm, vim, command);
            break;
          case 'action':
            this.processAction(cm, vim, command);
            break;
          case 'search':
            this.processSearch(cm, vim, command);
            break;
          case 'ex':
          case 'keyToEx':
            this.processEx(cm, vim, command);
            break;
          default:
            break;
        }
      },
      processMotion: function(cm, vim, command) {
        vim.inputState.motion = command.motion;
        vim.inputState.motionArgs = copyArgs(command.motionArgs);
        this.evalInput(cm, vim);
      },
      processOperator: function(cm, vim, command) {
        var inputState = vim.inputState;
        if (inputState.operator) {
          if (inputState.operator == command.operator) {
            // Typing an operator twice like 'dd' makes the operator operate
            // linewise
            inputState.motion = 'expandToLine';
            inputState.motionArgs = { linewise: true };
            this.evalInput(cm, vim);
            return;
          } else {
            // 2 different operators in a row doesn't make sense.
            clearInputState(cm);
          }
        }
        inputState.operator = command.operator;
        inputState.operatorArgs = copyArgs(command.operatorArgs);
        if (vim.visualMode) {
          // Operating on a selection in visual mode. We don't need a motion.
          this.evalInput(cm, vim);
        }
      },
      processOperatorMotion: function(cm, vim, command) {
        var visualMode = vim.visualMode;
        var operatorMotionArgs = copyArgs(command.operatorMotionArgs);
        if (operatorMotionArgs) {
          // Operator motions may have special behavior in visual mode.
          if (visualMode && operatorMotionArgs.visualLine) {
            vim.visualLine = true;
          }
        }
        this.processOperator(cm, vim, command);
        if (!visualMode) {
          this.processMotion(cm, vim, command);
        }
      },
      processAction: function(cm, vim, command) {
        var inputState = vim.inputState;
        var repeat = inputState.getRepeat();
        var repeatIsExplicit = !!repeat;
        var actionArgs = copyArgs(command.actionArgs) || {};
        if (inputState.selectedCharacter) {
          actionArgs.selectedCharacter = inputState.selectedCharacter;
        }
        // Actions may or may not have motions and operators. Do these first.
        if (command.operator) {
          this.processOperator(cm, vim, command);
        }
        if (command.motion) {
          this.processMotion(cm, vim, command);
        }
        if (command.motion || command.operator) {
          this.evalInput(cm, vim);
        }
        actionArgs.repeat = repeat || 1;
        actionArgs.repeatIsExplicit = repeatIsExplicit;
        actionArgs.registerName = inputState.registerName;
        clearInputState(cm);
        vim.lastMotion = null;
        if (command.isEdit) {
          this.recordLastEdit(vim, inputState, command);
        }
        actions[command.action](cm, actionArgs, vim);
      },
      processSearch: function(cm, vim, command) {
        if (!cm.getSearchCursor) {
          // Search depends on SearchCursor.
          return;
        }
        var forward = command.searchArgs.forward;
        var wholeWordOnly = command.searchArgs.wholeWordOnly;
        getSearchState(cm).setReversed(!forward);
        var promptPrefix = (forward) ? '/' : '?';
        var originalQuery = getSearchState(cm).getQuery();
        var originalScrollPos = cm.getScrollInfo();
        function handleQuery(query, ignoreCase, smartCase) {
          vimGlobalState.searchHistoryController.pushInput(query);
          vimGlobalState.searchHistoryController.reset();
          try {
            updateSearchQuery(cm, query, ignoreCase, smartCase);
          } catch (e) {
            showConfirm(cm, 'Invalid regex: ' + query);
            clearInputState(cm);
            return;
          }
          commandDispatcher.processMotion(cm, vim, {
            type: 'motion',
            motion: 'findNext',
            motionArgs: { forward: true, toJumplist: command.searchArgs.toJumplist }
          });
        }
        function onPromptClose(query) {
          cm.scrollTo(originalScrollPos.left, originalScrollPos.top);
          handleQuery(query, true /** ignoreCase */, true /** smartCase */);
          var macroModeState = vimGlobalState.macroModeState;
          if (macroModeState.isRecording) {
            logSearchQuery(macroModeState, query);
          }
        }
        function onPromptKeyUp(e, query, close) {
          var keyName = CodeMirror.keyName(e), up, offset;
          if (keyName == 'Up' || keyName == 'Down') {
            up = keyName == 'Up' ? true : false;
            offset = e.target ? e.target.selectionEnd : 0;
            query = vimGlobalState.searchHistoryController.nextMatch(query, up) || '';
            close(query);
            if (offset && e.target) e.target.selectionEnd = e.target.selectionStart = Math.min(offset, e.target.value.length);
          } else {
            if ( keyName != 'Left' && keyName != 'Right' && keyName != 'Ctrl' && keyName != 'Alt' && keyName != 'Shift')
              vimGlobalState.searchHistoryController.reset();
          }
          var parsedQuery;
          try {
            parsedQuery = updateSearchQuery(cm, query,
                true /** ignoreCase */, true /** smartCase */);
          } catch (e) {
            // Swallow bad regexes for incremental search.
          }
          if (parsedQuery) {
            cm.scrollIntoView(findNext(cm, !forward, parsedQuery), 30);
          } else {
            clearSearchHighlight(cm);
            cm.scrollTo(originalScrollPos.left, originalScrollPos.top);
          }
        }
        function onPromptKeyDown(e, query, close) {
          var keyName = CodeMirror.keyName(e);
          if (keyName == 'Esc' || keyName == 'Ctrl-C' || keyName == 'Ctrl-[' ||
              (keyName == 'Backspace' && query == '')) {
            vimGlobalState.searchHistoryController.pushInput(query);
            vimGlobalState.searchHistoryController.reset();
            updateSearchQuery(cm, originalQuery);
            clearSearchHighlight(cm);
            cm.scrollTo(originalScrollPos.left, originalScrollPos.top);
            CodeMirror.e_stop(e);
            clearInputState(cm);
            close();
            cm.focus();
          } else if (keyName == 'Up' || keyName == 'Down') {
            CodeMirror.e_stop(e);
          } else if (keyName == 'Ctrl-U') {
            // Ctrl-U clears input.
            CodeMirror.e_stop(e);
            close('');
          }
        }
        switch (command.searchArgs.querySrc) {
          case 'prompt':
            var macroModeState = vimGlobalState.macroModeState;
            if (macroModeState.isPlaying) {
              var query = macroModeState.replaySearchQueries.shift();
              handleQuery(query, true /** ignoreCase */, false /** smartCase */);
            } else {
              showPrompt(cm, {
                  onClose: onPromptClose,
                  prefix: promptPrefix,
                  desc: searchPromptDesc,
                  onKeyUp: onPromptKeyUp,
                  onKeyDown: onPromptKeyDown
              });
            }
            break;
          case 'wordUnderCursor':
            var word = expandWordUnderCursor(cm, false /** inclusive */,
                true /** forward */, false /** bigWord */,
                true /** noSymbol */);
            var isKeyword = true;
            if (!word) {
              word = expandWordUnderCursor(cm, false /** inclusive */,
                  true /** forward */, false /** bigWord */,
                  false /** noSymbol */);
              isKeyword = false;
            }
            if (!word) {
              return;
            }
            var query = cm.getLine(word.start.line).substring(word.start.ch,
                word.end.ch);
            if (isKeyword && wholeWordOnly) {
                query = '\\b' + query + '\\b';
            } else {
              query = escapeRegex(query);
            }

            // cachedCursor is used to save the old position of the cursor
            // when * or # causes vim to seek for the nearest word and shift
            // the cursor before entering the motion.
            vimGlobalState.jumpList.cachedCursor = cm.getCursor();
            cm.setCursor(word.start);

            handleQuery(query, true /** ignoreCase */, false /** smartCase */);
            break;
        }
      },
      processEx: function(cm, vim, command) {
        function onPromptClose(input) {
          // Give the prompt some time to close so that if processCommand shows
          // an error, the elements don't overlap.
          vimGlobalState.exCommandHistoryController.pushInput(input);
          vimGlobalState.exCommandHistoryController.reset();
          exCommandDispatcher.processCommand(cm, input);
        }
        function onPromptKeyDown(e, input, close) {
          var keyName = CodeMirror.keyName(e), up, offset;
          if (keyName == 'Esc' || keyName == 'Ctrl-C' || keyName == 'Ctrl-[' ||
              (keyName == 'Backspace' && input == '')) {
            vimGlobalState.exCommandHistoryController.pushInput(input);
            vimGlobalState.exCommandHistoryController.reset();
            CodeMirror.e_stop(e);
            clearInputState(cm);
            close();
            cm.focus();
          }
          if (keyName == 'Up' || keyName == 'Down') {
            CodeMirror.e_stop(e);
            up = keyName == 'Up' ? true : false;
            offset = e.target ? e.target.selectionEnd : 0;
            input = vimGlobalState.exCommandHistoryController.nextMatch(input, up) || '';
            close(input);
            if (offset && e.target) e.target.selectionEnd = e.target.selectionStart = Math.min(offset, e.target.value.length);
          } else if (keyName == 'Ctrl-U') {
            // Ctrl-U clears input.
            CodeMirror.e_stop(e);
            close('');
          } else {
            if ( keyName != 'Left' && keyName != 'Right' && keyName != 'Ctrl' && keyName != 'Alt' && keyName != 'Shift')
              vimGlobalState.exCommandHistoryController.reset();
          }
        }
        if (command.type == 'keyToEx') {
          // Handle user defined Ex to Ex mappings
          exCommandDispatcher.processCommand(cm, command.exArgs.input);
        } else {
          if (vim.visualMode) {
            showPrompt(cm, { onClose: onPromptClose, prefix: ':', value: '\'<,\'>',
                onKeyDown: onPromptKeyDown, selectValueOnOpen: false});
          } else {
            showPrompt(cm, { onClose: onPromptClose, prefix: ':',
                onKeyDown: onPromptKeyDown});
          }
        }
      },
      evalInput: function(cm, vim) {
        // If the motion command is set, execute both the operator and motion.
        // Otherwise return.
        var inputState = vim.inputState;
        var motion = inputState.motion;
        var motionArgs = inputState.motionArgs || {};
        var operator = inputState.operator;
        var operatorArgs = inputState.operatorArgs || {};
        var registerName = inputState.registerName;
        var sel = vim.sel;
        // TODO: Make sure cm and vim selections are identical outside visual mode.
        var origHead = copyCursor(vim.visualMode ? clipCursorToContent(cm, sel.head): cm.getCursor('head'));
        var origAnchor = copyCursor(vim.visualMode ? clipCursorToContent(cm, sel.anchor) : cm.getCursor('anchor'));
        var oldHead = copyCursor(origHead);
        var oldAnchor = copyCursor(origAnchor);
        var newHead, newAnchor;
        var repeat;
        if (operator) {
          this.recordLastEdit(vim, inputState);
        }
        if (inputState.repeatOverride !== undefined) {
          // If repeatOverride is specified, that takes precedence over the
          // input state's repeat. Used by Ex mode and can be user defined.
          repeat = inputState.repeatOverride;
        } else {
          repeat = inputState.getRepeat();
        }
        if (repeat > 0 && motionArgs.explicitRepeat) {
          motionArgs.repeatIsExplicit = true;
        } else if (motionArgs.noRepeat ||
            (!motionArgs.explicitRepeat && repeat === 0)) {
          repeat = 1;
          motionArgs.repeatIsExplicit = false;
        }
        if (inputState.selectedCharacter) {
          // If there is a character input, stick it in all of the arg arrays.
          motionArgs.selectedCharacter = operatorArgs.selectedCharacter =
              inputState.selectedCharacter;
        }
        motionArgs.repeat = repeat;
        clearInputState(cm);
        if (motion) {
          var motionResult = motions[motion](cm, origHead, motionArgs, vim);
          vim.lastMotion = motions[motion];
          if (!motionResult) {
            return;
          }
          if (motionArgs.toJumplist) {
            var jumpList = vimGlobalState.jumpList;
            // if the current motion is # or *, use cachedCursor
            var cachedCursor = jumpList.cachedCursor;
            if (cachedCursor) {
              recordJumpPosition(cm, cachedCursor, motionResult);
              delete jumpList.cachedCursor;
            } else {
              recordJumpPosition(cm, origHead, motionResult);
            }
          }
          if (motionResult instanceof Array) {
            newAnchor = motionResult[0];
            newHead = motionResult[1];
          } else {
            newHead = motionResult;
          }
          // TODO: Handle null returns from motion commands better.
          if (!newHead) {
            newHead = copyCursor(origHead);
          }
          if (vim.visualMode) {
            if (!(vim.visualBlock && newHead.ch === Infinity)) {
              newHead = clipCursorToContent(cm, newHead, vim.visualBlock);
            }
            if (newAnchor) {
              newAnchor = clipCursorToContent(cm, newAnchor, true);
            }
            newAnchor = newAnchor || oldAnchor;
            sel.anchor = newAnchor;
            sel.head = newHead;
            updateCmSelection(cm);
            updateMark(cm, vim, '<',
                cursorIsBefore(newAnchor, newHead) ? newAnchor
                    : newHead);
            updateMark(cm, vim, '>',
                cursorIsBefore(newAnchor, newHead) ? newHead
                    : newAnchor);
          } else if (!operator) {
            newHead = clipCursorToContent(cm, newHead);
            cm.setCursor(newHead.line, newHead.ch);
          }
        }
        if (operator) {
          if (operatorArgs.lastSel) {
            // Replaying a visual mode operation
            newAnchor = oldAnchor;
            var lastSel = operatorArgs.lastSel;
            var lineOffset = Math.abs(lastSel.head.line - lastSel.anchor.line);
            var chOffset = Math.abs(lastSel.head.ch - lastSel.anchor.ch);
            if (lastSel.visualLine) {
              // Linewise Visual mode: The same number of lines.
              newHead = Pos(oldAnchor.line + lineOffset, oldAnchor.ch);
            } else if (lastSel.visualBlock) {
              // Blockwise Visual mode: The same number of lines and columns.
              newHead = Pos(oldAnchor.line + lineOffset, oldAnchor.ch + chOffset);
            } else if (lastSel.head.line == lastSel.anchor.line) {
              // Normal Visual mode within one line: The same number of characters.
              newHead = Pos(oldAnchor.line, oldAnchor.ch + chOffset);
            } else {
              // Normal Visual mode with several lines: The same number of lines, in the
              // last line the same number of characters as in the last line the last time.
              newHead = Pos(oldAnchor.line + lineOffset, oldAnchor.ch);
            }
            vim.visualMode = true;
            vim.visualLine = lastSel.visualLine;
            vim.visualBlock = lastSel.visualBlock;
            sel = vim.sel = {
              anchor: newAnchor,
              head: newHead
            };
            updateCmSelection(cm);
          } else if (vim.visualMode) {
            operatorArgs.lastSel = {
              anchor: copyCursor(sel.anchor),
              head: copyCursor(sel.head),
              visualBlock: vim.visualBlock,
              visualLine: vim.visualLine
            };
          }
          var curStart, curEnd, linewise, mode;
          var cmSel;
          if (vim.visualMode) {
            // Init visual op
            curStart = cursorMin(sel.head, sel.anchor);
            curEnd = cursorMax(sel.head, sel.anchor);
            linewise = vim.visualLine || operatorArgs.linewise;
            mode = vim.visualBlock ? 'block' :
                   linewise ? 'line' :
                   'char';
            cmSel = makeCmSelection(cm, {
              anchor: curStart,
              head: curEnd
            }, mode);
            if (linewise) {
              var ranges = cmSel.ranges;
              if (mode == 'block') {
                // Linewise operators in visual block mode extend to end of line
                for (var i = 0; i < ranges.length; i++) {
                  ranges[i].head.ch = lineLength(cm, ranges[i].head.line);
                }
              } else if (mode == 'line') {
                ranges[0].head = Pos(ranges[0].head.line + 1, 0);
              }
            }
          } else {
            // Init motion op
            curStart = copyCursor(newAnchor || oldAnchor);
            curEnd = copyCursor(newHead || oldHead);
            if (cursorIsBefore(curEnd, curStart)) {
              var tmp = curStart;
              curStart = curEnd;
              curEnd = tmp;
            }
            linewise = motionArgs.linewise || operatorArgs.linewise;
            if (linewise) {
              // Expand selection to entire line.
              expandSelectionToLine(cm, curStart, curEnd);
            } else if (motionArgs.forward) {
              // Clip to trailing newlines only if the motion goes forward.
              clipToLine(cm, curStart, curEnd);
            }
            mode = 'char';
            var exclusive = !motionArgs.inclusive || linewise;
            cmSel = makeCmSelection(cm, {
              anchor: curStart,
              head: curEnd
            }, mode, exclusive);
          }
          cm.setSelections(cmSel.ranges, cmSel.primary);
          vim.lastMotion = null;
          operatorArgs.repeat = repeat; // For indent in visual mode.
          operatorArgs.registerName = registerName;
          // Keep track of linewise as it affects how paste and change behave.
          operatorArgs.linewise = linewise;
          var operatorMoveTo = operators[operator](
            cm, operatorArgs, cmSel.ranges, oldAnchor, newHead);
          if (vim.visualMode) {
            exitVisualMode(cm, operatorMoveTo != null);
          }
          if (operatorMoveTo) {
            cm.setCursor(operatorMoveTo);
          }
        }
      },
      recordLastEdit: function(vim, inputState, actionCommand) {
        var macroModeState = vimGlobalState.macroModeState;
        if (macroModeState.isPlaying) { return; }
        vim.lastEditInputState = inputState;
        vim.lastEditActionCommand = actionCommand;
        macroModeState.lastInsertModeChanges.changes = [];
        macroModeState.lastInsertModeChanges.expectCursorActivityForChange = false;
        macroModeState.lastInsertModeChanges.visualBlock = vim.visualBlock ? vim.sel.head.line - vim.sel.anchor.line : 0;
      }
    };

    /**
     * typedef {Object{line:number,ch:number}} Cursor An object containing the
     *     position of the cursor.
     */
    // All of the functions below return Cursor objects.
    var motions = {
      moveToTopLine: function(cm, _head, motionArgs) {
        var line = getUserVisibleLines(cm).top + motionArgs.repeat -1;
        return Pos(line, findFirstNonWhiteSpaceCharacter(cm.getLine(line)));
      },
      moveToMiddleLine: function(cm) {
        var range = getUserVisibleLines(cm);
        var line = Math.floor((range.top + range.bottom) * 0.5);
        return Pos(line, findFirstNonWhiteSpaceCharacter(cm.getLine(line)));
      },
      moveToBottomLine: function(cm, _head, motionArgs) {
        var line = getUserVisibleLines(cm).bottom - motionArgs.repeat +1;
        return Pos(line, findFirstNonWhiteSpaceCharacter(cm.getLine(line)));
      },
      expandToLine: function(_cm, head, motionArgs) {
        // Expands forward to end of line, and then to next line if repeat is
        // >1. Does not handle backward motion!
        var cur = head;
        return Pos(cur.line + motionArgs.repeat - 1, Infinity);
      },
      findNext: function(cm, _head, motionArgs) {
        var state = getSearchState(cm);
        var query = state.getQuery();
        if (!query) {
          return;
        }
        var prev = !motionArgs.forward;
        // If search is initiated with ? instead of /, negate direction.
        prev = (state.isReversed()) ? !prev : prev;
        highlightSearchMatches(cm, query);
        return findNext(cm, prev/** prev */, query, motionArgs.repeat);
      },
      goToMark: function(cm, _head, motionArgs, vim) {
        var pos = getMarkPos(cm, vim, motionArgs.selectedCharacter);
        if (pos) {
          return motionArgs.linewise ? { line: pos.line, ch: findFirstNonWhiteSpaceCharacter(cm.getLine(pos.line)) } : pos;
        }
        return null;
      },
      moveToOtherHighlightedEnd: function(cm, _head, motionArgs, vim) {
        if (vim.visualBlock && motionArgs.sameLine) {
          var sel = vim.sel;
          return [
            clipCursorToContent(cm, Pos(sel.anchor.line, sel.head.ch)),
            clipCursorToContent(cm, Pos(sel.head.line, sel.anchor.ch))
          ];
        } else {
          return ([vim.sel.head, vim.sel.anchor]);
        }
      },
      jumpToMark: function(cm, head, motionArgs, vim) {
        var best = head;
        for (var i = 0; i < motionArgs.repeat; i++) {
          var cursor = best;
          for (var key in vim.marks) {
            if (!isLowerCase(key)) {
              continue;
            }
            var mark = vim.marks[key].find();
            var isWrongDirection = (motionArgs.forward) ?
              cursorIsBefore(mark, cursor) : cursorIsBefore(cursor, mark);

            if (isWrongDirection) {
              continue;
            }
            if (motionArgs.linewise && (mark.line == cursor.line)) {
              continue;
            }

            var equal = cursorEqual(cursor, best);
            var between = (motionArgs.forward) ?
              cursorIsBetween(cursor, mark, best) :
              cursorIsBetween(best, mark, cursor);

            if (equal || between) {
              best = mark;
            }
          }
        }

        if (motionArgs.linewise) {
          // Vim places the cursor on the first non-whitespace character of
          // the line if there is one, else it places the cursor at the end
          // of the line, regardless of whether a mark was found.
          best = Pos(best.line, findFirstNonWhiteSpaceCharacter(cm.getLine(best.line)));
        }
        return best;
      },
      moveByCharacters: function(_cm, head, motionArgs) {
        var cur = head;
        var repeat = motionArgs.repeat;
        var ch = motionArgs.forward ? cur.ch + repeat : cur.ch - repeat;
        return Pos(cur.line, ch);
      },
      moveByLines: function(cm, head, motionArgs, vim) {
        var cur = head;
        var endCh = cur.ch;
        // Depending what our last motion was, we may want to do different
        // things. If our last motion was moving vertically, we want to
        // preserve the HPos from our last horizontal move.  If our last motion
        // was going to the end of a line, moving vertically we should go to
        // the end of the line, etc.
        switch (vim.lastMotion) {
          case this.moveByLines:
          case this.moveByDisplayLines:
          case this.moveByScroll:
          case this.moveToColumn:
          case this.moveToEol:
            endCh = vim.lastHPos;
            break;
          default:
            vim.lastHPos = endCh;
        }
        var repeat = motionArgs.repeat+(motionArgs.repeatOffset||0);
        var line = motionArgs.forward ? cur.line + repeat : cur.line - repeat;
        var first = cm.firstLine();
        var last = cm.lastLine();
        // Vim go to line begin or line end when cursor at first/last line and
        // move to previous/next line is triggered.
        if (line < first && cur.line == first){
          return this.moveToStartOfLine(cm, head, motionArgs, vim);
        }else if (line > last && cur.line == last){
            return this.moveToEol(cm, head, motionArgs, vim, true);
        }
        if (motionArgs.toFirstChar){
          endCh=findFirstNonWhiteSpaceCharacter(cm.getLine(line));
          vim.lastHPos = endCh;
        }
        vim.lastHSPos = cm.charCoords(Pos(line, endCh),'div').left;
        return Pos(line, endCh);
      },
      moveByDisplayLines: function(cm, head, motionArgs, vim) {
        var cur = head;
        switch (vim.lastMotion) {
          case this.moveByDisplayLines:
          case this.moveByScroll:
          case this.moveByLines:
          case this.moveToColumn:
          case this.moveToEol:
            break;
          default:
            vim.lastHSPos = cm.charCoords(cur,'div').left;
        }
        var repeat = motionArgs.repeat;
        var res=cm.findPosV(cur,(motionArgs.forward ? repeat : -repeat),'line',vim.lastHSPos);
        if (res.hitSide) {
          if (motionArgs.forward) {
            var lastCharCoords = cm.charCoords(res, 'div');
            var goalCoords = { top: lastCharCoords.top + 8, left: vim.lastHSPos };
            var res = cm.coordsChar(goalCoords, 'div');
          } else {
            var resCoords = cm.charCoords(Pos(cm.firstLine(), 0), 'div');
            resCoords.left = vim.lastHSPos;
            res = cm.coordsChar(resCoords, 'div');
          }
        }
        vim.lastHPos = res.ch;
        return res;
      },
      moveByPage: function(cm, head, motionArgs) {
        // CodeMirror only exposes functions that move the cursor page down, so
        // doing this bad hack to move the cursor and move it back. evalInput
        // will move the cursor to where it should be in the end.
        var curStart = head;
        var repeat = motionArgs.repeat;
        return cm.findPosV(curStart, (motionArgs.forward ? repeat : -repeat), 'page');
      },
      moveByParagraph: function(cm, head, motionArgs) {
        var dir = motionArgs.forward ? 1 : -1;
        return findParagraph(cm, head, motionArgs.repeat, dir);
      },
      moveBySentence: function(cm, head, motionArgs) {
        var dir = motionArgs.forward ? 1 : -1;
        return findSentence(cm, head, motionArgs.repeat, dir);
      },
      moveByScroll: function(cm, head, motionArgs, vim) {
        var scrollbox = cm.getScrollInfo();
        var curEnd = null;
        var repeat = motionArgs.repeat;
        if (!repeat) {
          repeat = scrollbox.clientHeight / (2 * cm.defaultTextHeight());
        }
        var orig = cm.charCoords(head, 'local');
        motionArgs.repeat = repeat;
        var curEnd = motions.moveByDisplayLines(cm, head, motionArgs, vim);
        if (!curEnd) {
          return null;
        }
        var dest = cm.charCoords(curEnd, 'local');
        cm.scrollTo(null, scrollbox.top + dest.top - orig.top);
        return curEnd;
      },
      moveByWords: function(cm, head, motionArgs) {
        return moveToWord(cm, head, motionArgs.repeat, !!motionArgs.forward,
            !!motionArgs.wordEnd, !!motionArgs.bigWord);
      },
      moveTillCharacter: function(cm, _head, motionArgs) {
        var repeat = motionArgs.repeat;
        var curEnd = moveToCharacter(cm, repeat, motionArgs.forward,
            motionArgs.selectedCharacter);
        var increment = motionArgs.forward ? -1 : 1;
        recordLastCharacterSearch(increment, motionArgs);
        if (!curEnd) return null;
        curEnd.ch += increment;
        return curEnd;
      },
      moveToCharacter: function(cm, head, motionArgs) {
        var repeat = motionArgs.repeat;
        recordLastCharacterSearch(0, motionArgs);
        return moveToCharacter(cm, repeat, motionArgs.forward,
            motionArgs.selectedCharacter) || head;
      },
      moveToSymbol: function(cm, head, motionArgs) {
        var repeat = motionArgs.repeat;
        return findSymbol(cm, repeat, motionArgs.forward,
            motionArgs.selectedCharacter) || head;
      },
      moveToColumn: function(cm, head, motionArgs, vim) {
        var repeat = motionArgs.repeat;
        // repeat is equivalent to which column we want to move to!
        vim.lastHPos = repeat - 1;
        vim.lastHSPos = cm.charCoords(head,'div').left;
        return moveToColumn(cm, repeat);
      },
      moveToEol: function(cm, head, motionArgs, vim, keepHPos) {
        var cur = head;
        var retval= Pos(cur.line + motionArgs.repeat - 1, Infinity);
        var end=cm.clipPos(retval);
        end.ch--;
        if (!keepHPos) {
          vim.lastHPos = Infinity;
          vim.lastHSPos = cm.charCoords(end,'div').left;
        }
        return retval;
      },
      moveToFirstNonWhiteSpaceCharacter: function(cm, head) {
        // Go to the start of the line where the text begins, or the end for
        // whitespace-only lines
        var cursor = head;
        return Pos(cursor.line,
                   findFirstNonWhiteSpaceCharacter(cm.getLine(cursor.line)));
      },
      moveToMatchedSymbol: function(cm, head) {
        var cursor = head;
        var line = cursor.line;
        var ch = cursor.ch;
        var lineText = cm.getLine(line);
        var symbol;
        for (; ch < lineText.length; ch++) {
          symbol = lineText.charAt(ch);
          if (symbol && isMatchableSymbol(symbol)) {
            var style = cm.getTokenTypeAt(Pos(line, ch + 1));
            if (style !== "string" && style !== "comment") {
              break;
            }
          }
        }
        if (ch < lineText.length) {
          // Only include angle brackets in analysis if they are being matched.
          var re = (ch === '<' || ch === '>') ? /[(){}[\]<>]/ : /[(){}[\]]/;
          var matched = cm.findMatchingBracket(Pos(line, ch), {bracketRegex: re});
          return matched.to;
        } else {
          return cursor;
        }
      },
      moveToStartOfLine: function(_cm, head) {
        return Pos(head.line, 0);
      },
      moveToLineOrEdgeOfDocument: function(cm, _head, motionArgs) {
        var lineNum = motionArgs.forward ? cm.lastLine() : cm.firstLine();
        if (motionArgs.repeatIsExplicit) {
          lineNum = motionArgs.repeat - cm.getOption('firstLineNumber');
        }
        return Pos(lineNum,
                   findFirstNonWhiteSpaceCharacter(cm.getLine(lineNum)));
      },
      textObjectManipulation: function(cm, head, motionArgs, vim) {
        // TODO: lots of possible exceptions that can be thrown here. Try da(
        //     outside of a () block.
        var mirroredPairs = {'(': ')', ')': '(',
                             '{': '}', '}': '{',
                             '[': ']', ']': '[',
                             '<': '>', '>': '<'};
        var selfPaired = {'\'': true, '"': true, '`': true};

        var character = motionArgs.selectedCharacter;
        // 'b' refers to  '()' block.
        // 'B' refers to  '{}' block.
        if (character == 'b') {
          character = '(';
        } else if (character == 'B') {
          character = '{';
        }

        // Inclusive is the difference between a and i
        // TODO: Instead of using the additional text object map to perform text
        //     object operations, merge the map into the defaultKeyMap and use
        //     motionArgs to define behavior. Define separate entries for 'aw',
        //     'iw', 'a[', 'i[', etc.
        var inclusive = !motionArgs.textObjectInner;

        var tmp;
        if (mirroredPairs[character]) {
          tmp = selectCompanionObject(cm, head, character, inclusive);
        } else if (selfPaired[character]) {
          tmp = findBeginningAndEnd(cm, head, character, inclusive);
        } else if (character === 'W') {
          tmp = expandWordUnderCursor(cm, inclusive, true /** forward */,
                                                     true /** bigWord */);
        } else if (character === 'w') {
          tmp = expandWordUnderCursor(cm, inclusive, true /** forward */,
                                                     false /** bigWord */);
        } else if (character === 'p') {
          tmp = findParagraph(cm, head, motionArgs.repeat, 0, inclusive);
          motionArgs.linewise = true;
          if (vim.visualMode) {
            if (!vim.visualLine) { vim.visualLine = true; }
          } else {
            var operatorArgs = vim.inputState.operatorArgs;
            if (operatorArgs) { operatorArgs.linewise = true; }
            tmp.end.line--;
          }
        } else {
          // No text object defined for this, don't move.
          return null;
        }

        if (!cm.state.vim.visualMode) {
          return [tmp.start, tmp.end];
        } else {
          return expandSelection(cm, tmp.start, tmp.end);
        }
      },

      repeatLastCharacterSearch: function(cm, head, motionArgs) {
        var lastSearch = vimGlobalState.lastCharacterSearch;
        var repeat = motionArgs.repeat;
        var forward = motionArgs.forward === lastSearch.forward;
        var increment = (lastSearch.increment ? 1 : 0) * (forward ? -1 : 1);
        cm.moveH(-increment, 'char');
        motionArgs.inclusive = forward ? true : false;
        var curEnd = moveToCharacter(cm, repeat, forward, lastSearch.selectedCharacter);
        if (!curEnd) {
          cm.moveH(increment, 'char');
          return head;
        }
        curEnd.ch += increment;
        return curEnd;
      }
    };

    function defineMotion(name, fn) {
      motions[name] = fn;
    }

    function fillArray(val, times) {
      var arr = [];
      for (var i = 0; i < times; i++) {
        arr.push(val);
      }
      return arr;
    }
    /**
     * An operator acts on a text selection. It receives the list of selections
     * as input. The corresponding CodeMirror selection is guaranteed to
    * match the input selection.
     */
    var operators = {
      change: function(cm, args, ranges) {
        var finalHead, text;
        var vim = cm.state.vim;
        if (!vim.visualMode) {
          var anchor = ranges[0].anchor,
              head = ranges[0].head;
          text = cm.getRange(anchor, head);
          var lastState = vim.lastEditInputState || {};
          if (lastState.motion == "moveByWords" && !isWhiteSpaceString(text)) {
            // Exclude trailing whitespace if the range is not all whitespace.
            var match = (/\s+$/).exec(text);
            if (match && lastState.motionArgs && lastState.motionArgs.forward) {
              head = offsetCursor(head, 0, - match[0].length);
              text = text.slice(0, - match[0].length);
            }
          }
          var prevLineEnd = new Pos(anchor.line - 1, Number.MAX_VALUE);
          var wasLastLine = cm.firstLine() == cm.lastLine();
          if (head.line > cm.lastLine() && args.linewise && !wasLastLine) {
            cm.replaceRange('', prevLineEnd, head);
          } else {
            cm.replaceRange('', anchor, head);
          }
          if (args.linewise) {
            // Push the next line back down, if there is a next line.
            if (!wasLastLine) {
              cm.setCursor(prevLineEnd);
              CodeMirror.commands.newlineAndIndent(cm);
            }
            // make sure cursor ends up at the end of the line.
            anchor.ch = Number.MAX_VALUE;
          }
          finalHead = anchor;
        } else {
          text = cm.getSelection();
          var replacement = fillArray('', ranges.length);
          cm.replaceSelections(replacement);
          finalHead = cursorMin(ranges[0].head, ranges[0].anchor);
        }
        vimGlobalState.registerController.pushText(
            args.registerName, 'change', text,
            args.linewise, ranges.length > 1);
        actions.enterInsertMode(cm, {head: finalHead}, cm.state.vim);
      },
      // delete is a javascript keyword.
      'delete': function(cm, args, ranges) {
        var finalHead, text;
        var vim = cm.state.vim;
        if (!vim.visualBlock) {
          var anchor = ranges[0].anchor,
              head = ranges[0].head;
          if (args.linewise &&
              head.line != cm.firstLine() &&
              anchor.line == cm.lastLine() &&
              anchor.line == head.line - 1) {
            // Special case for dd on last line (and first line).
            if (anchor.line == cm.firstLine()) {
              anchor.ch = 0;
            } else {
              anchor = Pos(anchor.line - 1, lineLength(cm, anchor.line - 1));
            }
          }
          text = cm.getRange(anchor, head);
          cm.replaceRange('', anchor, head);
          finalHead = anchor;
          if (args.linewise) {
            finalHead = motions.moveToFirstNonWhiteSpaceCharacter(cm, anchor);
          }
        } else {
          text = cm.getSelection();
          var replacement = fillArray('', ranges.length);
          cm.replaceSelections(replacement);
          finalHead = ranges[0].anchor;
        }
        vimGlobalState.registerController.pushText(
            args.registerName, 'delete', text,
            args.linewise, vim.visualBlock);
        var includeLineBreak = vim.insertMode
        return clipCursorToContent(cm, finalHead, includeLineBreak);
      },
      indent: function(cm, args, ranges) {
        var vim = cm.state.vim;
        var startLine = ranges[0].anchor.line;
        var endLine = vim.visualBlock ?
          ranges[ranges.length - 1].anchor.line :
          ranges[0].head.line;
        // In visual mode, n> shifts the selection right n times, instead of
        // shifting n lines right once.
        var repeat = (vim.visualMode) ? args.repeat : 1;
        if (args.linewise) {
          // The only way to delete a newline is to delete until the start of
          // the next line, so in linewise mode evalInput will include the next
          // line. We don't want this in indent, so we go back a line.
          endLine--;
        }
        for (var i = startLine; i <= endLine; i++) {
          for (var j = 0; j < repeat; j++) {
            cm.indentLine(i, args.indentRight);
          }
        }
        return motions.moveToFirstNonWhiteSpaceCharacter(cm, ranges[0].anchor);
      },
      indentAuto: function(cm, _args, ranges) {
        cm.execCommand("indentAuto");
        return motions.moveToFirstNonWhiteSpaceCharacter(cm, ranges[0].anchor);
      },
      changeCase: function(cm, args, ranges, oldAnchor, newHead) {
        var selections = cm.getSelections();
        var swapped = [];
        var toLower = args.toLower;
        for (var j = 0; j < selections.length; j++) {
          var toSwap = selections[j];
          var text = '';
          if (toLower === true) {
            text = toSwap.toLowerCase();
          } else if (toLower === false) {
            text = toSwap.toUpperCase();
          } else {
            for (var i = 0; i < toSwap.length; i++) {
              var character = toSwap.charAt(i);
              text += isUpperCase(character) ? character.toLowerCase() :
                  character.toUpperCase();
            }
          }
          swapped.push(text);
        }
        cm.replaceSelections(swapped);
        if (args.shouldMoveCursor){
          return newHead;
        } else if (!cm.state.vim.visualMode && args.linewise && ranges[0].anchor.line + 1 == ranges[0].head.line) {
          return motions.moveToFirstNonWhiteSpaceCharacter(cm, oldAnchor);
        } else if (args.linewise){
          return oldAnchor;
        } else {
          return cursorMin(ranges[0].anchor, ranges[0].head);
        }
      },
      yank: function(cm, args, ranges, oldAnchor) {
        var vim = cm.state.vim;
        var text = cm.getSelection();
        var endPos = vim.visualMode
          ? cursorMin(vim.sel.anchor, vim.sel.head, ranges[0].head, ranges[0].anchor)
          : oldAnchor;
        vimGlobalState.registerController.pushText(
            args.registerName, 'yank',
            text, args.linewise, vim.visualBlock);
        return endPos;
      }
    };

    function defineOperator(name, fn) {
      operators[name] = fn;
    }

    var actions = {
      jumpListWalk: function(cm, actionArgs, vim) {
        if (vim.visualMode) {
          return;
        }
        var repeat = actionArgs.repeat;
        var forward = actionArgs.forward;
        var jumpList = vimGlobalState.jumpList;

        var mark = jumpList.move(cm, forward ? repeat : -repeat);
        var markPos = mark ? mark.find() : undefined;
        markPos = markPos ? markPos : cm.getCursor();
        cm.setCursor(markPos);
      },
      scroll: function(cm, actionArgs, vim) {
        if (vim.visualMode) {
          return;
        }
        var repeat = actionArgs.repeat || 1;
        var lineHeight = cm.defaultTextHeight();
        var top = cm.getScrollInfo().top;
        var delta = lineHeight * repeat;
        var newPos = actionArgs.forward ? top + delta : top - delta;
        var cursor = copyCursor(cm.getCursor());
        var cursorCoords = cm.charCoords(cursor, 'local');
        if (actionArgs.forward) {
          if (newPos > cursorCoords.top) {
             cursor.line += (newPos - cursorCoords.top) / lineHeight;
             cursor.line = Math.ceil(cursor.line);
             cm.setCursor(cursor);
             cursorCoords = cm.charCoords(cursor, 'local');
             cm.scrollTo(null, cursorCoords.top);
          } else {
             // Cursor stays within bounds.  Just reposition the scroll window.
             cm.scrollTo(null, newPos);
          }
        } else {
          var newBottom = newPos + cm.getScrollInfo().clientHeight;
          if (newBottom < cursorCoords.bottom) {
             cursor.line -= (cursorCoords.bottom - newBottom) / lineHeight;
             cursor.line = Math.floor(cursor.line);
             cm.setCursor(cursor);
             cursorCoords = cm.charCoords(cursor, 'local');
             cm.scrollTo(
                 null, cursorCoords.bottom - cm.getScrollInfo().clientHeight);
          } else {
             // Cursor stays within bounds.  Just reposition the scroll window.
             cm.scrollTo(null, newPos);
          }
        }
      },
      scrollToCursor: function(cm, actionArgs) {
        var lineNum = cm.getCursor().line;
        var charCoords = cm.charCoords(Pos(lineNum, 0), 'local');
        var height = cm.getScrollInfo().clientHeight;
        var y = charCoords.top;
        var lineHeight = charCoords.bottom - y;
        switch (actionArgs.position) {
          case 'center': y = y - (height / 2) + lineHeight;
            break;
          case 'bottom': y = y - height + lineHeight;
            break;
        }
        cm.scrollTo(null, y);
      },
      replayMacro: function(cm, actionArgs, vim) {
        var registerName = actionArgs.selectedCharacter;
        var repeat = actionArgs.repeat;
        var macroModeState = vimGlobalState.macroModeState;
        if (registerName == '@') {
          registerName = macroModeState.latestRegister;
        } else {
          macroModeState.latestRegister = registerName;
        }
        while(repeat--){
          executeMacroRegister(cm, vim, macroModeState, registerName);
        }
      },
      enterMacroRecordMode: function(cm, actionArgs) {
        var macroModeState = vimGlobalState.macroModeState;
        var registerName = actionArgs.selectedCharacter;
        if (vimGlobalState.registerController.isValidRegister(registerName)) {
          macroModeState.enterMacroRecordMode(cm, registerName);
        }
      },
      toggleOverwrite: function(cm) {
        if (!cm.state.overwrite) {
          cm.toggleOverwrite(true);
          cm.setOption('keyMap', 'vim-replace');
          CodeMirror.signal(cm, "vim-mode-change", {mode: "replace"});
        } else {
          cm.toggleOverwrite(false);
          cm.setOption('keyMap', 'vim-insert');
          CodeMirror.signal(cm, "vim-mode-change", {mode: "insert"});
        }
      },
      enterInsertMode: function(cm, actionArgs, vim) {
        if (cm.getOption('readOnly')) { return; }
        vim.insertMode = true;
        vim.insertModeRepeat = actionArgs && actionArgs.repeat || 1;
        var insertAt = (actionArgs) ? actionArgs.insertAt : null;
        var sel = vim.sel;
        var head = actionArgs.head || cm.getCursor('head');
        var height = cm.listSelections().length;
        if (insertAt == 'eol') {
          head = Pos(head.line, lineLength(cm, head.line));
        } else if (insertAt == 'charAfter') {
          head = offsetCursor(head, 0, 1);
        } else if (insertAt == 'firstNonBlank') {
          head = motions.moveToFirstNonWhiteSpaceCharacter(cm, head);
        } else if (insertAt == 'startOfSelectedArea') {
          if (!vim.visualMode)
              return;
          if (!vim.visualBlock) {
            if (sel.head.line < sel.anchor.line) {
              head = sel.head;
            } else {
              head = Pos(sel.anchor.line, 0);
            }
          } else {
            head = Pos(
                Math.min(sel.head.line, sel.anchor.line),
                Math.min(sel.head.ch, sel.anchor.ch));
            height = Math.abs(sel.head.line - sel.anchor.line) + 1;
          }
        } else if (insertAt == 'endOfSelectedArea') {
            if (!vim.visualMode)
              return;
          if (!vim.visualBlock) {
            if (sel.head.line >= sel.anchor.line) {
              head = offsetCursor(sel.head, 0, 1);
            } else {
              head = Pos(sel.anchor.line, 0);
            }
          } else {
            head = Pos(
                Math.min(sel.head.line, sel.anchor.line),
                Math.max(sel.head.ch + 1, sel.anchor.ch));
            height = Math.abs(sel.head.line - sel.anchor.line) + 1;
          }
        } else if (insertAt == 'inplace') {
          if (vim.visualMode){
            return;
          }
        }
        cm.setOption('disableInput', false);
        if (actionArgs && actionArgs.replace) {
          // Handle Replace-mode as a special case of insert mode.
          cm.toggleOverwrite(true);
          cm.setOption('keyMap', 'vim-replace');
          CodeMirror.signal(cm, "vim-mode-change", {mode: "replace"});
        } else {
          cm.toggleOverwrite(false);
          cm.setOption('keyMap', 'vim-insert');
          CodeMirror.signal(cm, "vim-mode-change", {mode: "insert"});
        }
        if (!vimGlobalState.macroModeState.isPlaying) {
          // Only record if not replaying.
          cm.on('change', onChange);
          CodeMirror.on(cm.getInputField(), 'keydown', onKeyEventTargetKeyDown);
        }
        if (vim.visualMode) {
          exitVisualMode(cm);
        }
        selectForInsert(cm, head, height);
      },
      toggleVisualMode: function(cm, actionArgs, vim) {
        var repeat = actionArgs.repeat;
        var anchor = cm.getCursor();
        var head;
        // TODO: The repeat should actually select number of characters/lines
        //     equal to the repeat times the size of the previous visual
        //     operation.
        if (!vim.visualMode) {
          // Entering visual mode
          vim.visualMode = true;
          vim.visualLine = !!actionArgs.linewise;
          vim.visualBlock = !!actionArgs.blockwise;
          head = clipCursorToContent(
              cm, Pos(anchor.line, anchor.ch + repeat - 1),
              true /** includeLineBreak */);
          vim.sel = {
            anchor: anchor,
            head: head
          };
          CodeMirror.signal(cm, "vim-mode-change", {mode: "visual", subMode: vim.visualLine ? "linewise" : vim.visualBlock ? "blockwise" : ""});
          updateCmSelection(cm);
          updateMark(cm, vim, '<', cursorMin(anchor, head));
          updateMark(cm, vim, '>', cursorMax(anchor, head));
        } else if (vim.visualLine ^ actionArgs.linewise ||
            vim.visualBlock ^ actionArgs.blockwise) {
          // Toggling between modes
          vim.visualLine = !!actionArgs.linewise;
          vim.visualBlock = !!actionArgs.blockwise;
          CodeMirror.signal(cm, "vim-mode-change", {mode: "visual", subMode: vim.visualLine ? "linewise" : vim.visualBlock ? "blockwise" : ""});
          updateCmSelection(cm);
        } else {
          exitVisualMode(cm);
        }
      },
      reselectLastSelection: function(cm, _actionArgs, vim) {
        var lastSelection = vim.lastSelection;
        if (vim.visualMode) {
          updateLastSelection(cm, vim);
        }
        if (lastSelection) {
          var anchor = lastSelection.anchorMark.find();
          var head = lastSelection.headMark.find();
          if (!anchor || !head) {
            // If the marks have been destroyed due to edits, do nothing.
            return;
          }
          vim.sel = {
            anchor: anchor,
            head: head
          };
          vim.visualMode = true;
          vim.visualLine = lastSelection.visualLine;
          vim.visualBlock = lastSelection.visualBlock;
          updateCmSelection(cm);
          updateMark(cm, vim, '<', cursorMin(anchor, head));
          updateMark(cm, vim, '>', cursorMax(anchor, head));
          CodeMirror.signal(cm, 'vim-mode-change', {
            mode: 'visual',
            subMode: vim.visualLine ? 'linewise' :
                     vim.visualBlock ? 'blockwise' : ''});
        }
      },
      joinLines: function(cm, actionArgs, vim) {
        var curStart, curEnd;
        if (vim.visualMode) {
          curStart = cm.getCursor('anchor');
          curEnd = cm.getCursor('head');
          if (cursorIsBefore(curEnd, curStart)) {
            var tmp = curEnd;
            curEnd = curStart;
            curStart = tmp;
          }
          curEnd.ch = lineLength(cm, curEnd.line) - 1;
        } else {
          // Repeat is the number of lines to join. Minimum 2 lines.
          var repeat = Math.max(actionArgs.repeat, 2);
          curStart = cm.getCursor();
          curEnd = clipCursorToContent(cm, Pos(curStart.line + repeat - 1,
                                               Infinity));
        }
        var finalCh = 0;
        for (var i = curStart.line; i < curEnd.line; i++) {
          finalCh = lineLength(cm, curStart.line);
          var tmp = Pos(curStart.line + 1,
                        lineLength(cm, curStart.line + 1));
          var text = cm.getRange(curStart, tmp);
          text = text.replace(/\n\s*/g, ' ');
          cm.replaceRange(text, curStart, tmp);
        }
        var curFinalPos = Pos(curStart.line, finalCh);
        if (vim.visualMode) {
          exitVisualMode(cm, false);
        }
        cm.setCursor(curFinalPos);
      },
      newLineAndEnterInsertMode: function(cm, actionArgs, vim) {
        vim.insertMode = true;
        var insertAt = copyCursor(cm.getCursor());
        if (insertAt.line === cm.firstLine() && !actionArgs.after) {
          // Special case for inserting newline before start of document.
          cm.replaceRange('\n', Pos(cm.firstLine(), 0));
          cm.setCursor(cm.firstLine(), 0);
        } else {
          insertAt.line = (actionArgs.after) ? insertAt.line :
              insertAt.line - 1;
          insertAt.ch = lineLength(cm, insertAt.line);
          cm.setCursor(insertAt);
          var newlineFn = CodeMirror.commands.newlineAndIndentContinueComment ||
              CodeMirror.commands.newlineAndIndent;
          newlineFn(cm);
        }
        this.enterInsertMode(cm, { repeat: actionArgs.repeat }, vim);
      },
      paste: function(cm, actionArgs, vim) {
        var cur = copyCursor(cm.getCursor());
        var register = vimGlobalState.registerController.getRegister(
            actionArgs.registerName);
        var text = register.toString();
        if (!text) {
          return;
        }
        if (actionArgs.matchIndent) {
          var tabSize = cm.getOption("tabSize");
          // length that considers tabs and tabSize
          var whitespaceLength = function(str) {
            var tabs = (str.split("\t").length - 1);
            var spaces = (str.split(" ").length - 1);
            return tabs * tabSize + spaces * 1;
          };
          var currentLine = cm.getLine(cm.getCursor().line);
          var indent = whitespaceLength(currentLine.match(/^\s*/)[0]);
          // chomp last newline b/c don't want it to match /^\s*/gm
          var chompedText = text.replace(/\n$/, '');
          var wasChomped = text !== chompedText;
          var firstIndent = whitespaceLength(text.match(/^\s*/)[0]);
          var text = chompedText.replace(/^\s*/gm, function(wspace) {
            var newIndent = indent + (whitespaceLength(wspace) - firstIndent);
            if (newIndent < 0) {
              return "";
            }
            else if (cm.getOption("indentWithTabs")) {
              var quotient = Math.floor(newIndent / tabSize);
              return Array(quotient + 1).join('\t');
            }
            else {
              return Array(newIndent + 1).join(' ');
            }
          });
          text += wasChomped ? "\n" : "";
        }
        if (actionArgs.repeat > 1) {
          var text = Array(actionArgs.repeat + 1).join(text);
        }
        var linewise = register.linewise;
        var blockwise = register.blockwise;
        if (blockwise) {
          text = text.split('\n');
          if (linewise) {
              text.pop();
          }
          for (var i = 0; i < text.length; i++) {
            text[i] = (text[i] == '') ? ' ' : text[i];
          }
          cur.ch += actionArgs.after ? 1 : 0;
          cur.ch = Math.min(lineLength(cm, cur.line), cur.ch);
        } else if (linewise) {
          if(vim.visualMode) {
            text = vim.visualLine ? text.slice(0, -1) : '\n' + text.slice(0, text.length - 1) + '\n';
          } else if (actionArgs.after) {
            // Move the newline at the end to the start instead, and paste just
            // before the newline character of the line we are on right now.
            text = '\n' + text.slice(0, text.length - 1);
            cur.ch = lineLength(cm, cur.line);
          } else {
            cur.ch = 0;
          }
        } else {
          cur.ch += actionArgs.after ? 1 : 0;
        }
        var curPosFinal;
        var idx;
        if (vim.visualMode) {
          //  save the pasted text for reselection if the need arises
          vim.lastPastedText = text;
          var lastSelectionCurEnd;
          var selectedArea = getSelectedAreaRange(cm, vim);
          var selectionStart = selectedArea[0];
          var selectionEnd = selectedArea[1];
          var selectedText = cm.getSelection();
          var selections = cm.listSelections();
          var emptyStrings = new Array(selections.length).join('1').split('1');
          // save the curEnd marker before it get cleared due to cm.replaceRange.
          if (vim.lastSelection) {
            lastSelectionCurEnd = vim.lastSelection.headMark.find();
          }
          // push the previously selected text to unnamed register
          vimGlobalState.registerController.unnamedRegister.setText(selectedText);
          if (blockwise) {
            // first delete the selected text
            cm.replaceSelections(emptyStrings);
            // Set new selections as per the block length of the yanked text
            selectionEnd = Pos(selectionStart.line + text.length-1, selectionStart.ch);
            cm.setCursor(selectionStart);
            selectBlock(cm, selectionEnd);
            cm.replaceSelections(text);
            curPosFinal = selectionStart;
          } else if (vim.visualBlock) {
            cm.replaceSelections(emptyStrings);
            cm.setCursor(selectionStart);
            cm.replaceRange(text, selectionStart, selectionStart);
            curPosFinal = selectionStart;
          } else {
            cm.replaceRange(text, selectionStart, selectionEnd);
            curPosFinal = cm.posFromIndex(cm.indexFromPos(selectionStart) + text.length - 1);
          }
          // restore the the curEnd marker
          if(lastSelectionCurEnd) {
            vim.lastSelection.headMark = cm.setBookmark(lastSelectionCurEnd);
          }
          if (linewise) {
            curPosFinal.ch=0;
          }
        } else {
          if (blockwise) {
            cm.setCursor(cur);
            for (var i = 0; i < text.length; i++) {
              var line = cur.line+i;
              if (line > cm.lastLine()) {
                cm.replaceRange('\n',  Pos(line, 0));
              }
              var lastCh = lineLength(cm, line);
              if (lastCh < cur.ch) {
                extendLineToColumn(cm, line, cur.ch);
              }
            }
            cm.setCursor(cur);
            selectBlock(cm, Pos(cur.line + text.length-1, cur.ch));
            cm.replaceSelections(text);
            curPosFinal = cur;
          } else {
            cm.replaceRange(text, cur);
            // Now fine tune the cursor to where we want it.
            if (linewise && actionArgs.after) {
              curPosFinal = Pos(
              cur.line + 1,
              findFirstNonWhiteSpaceCharacter(cm.getLine(cur.line + 1)));
            } else if (linewise && !actionArgs.after) {
              curPosFinal = Pos(
                cur.line,
                findFirstNonWhiteSpaceCharacter(cm.getLine(cur.line)));
            } else if (!linewise && actionArgs.after) {
              idx = cm.indexFromPos(cur);
              curPosFinal = cm.posFromIndex(idx + text.length - 1);
            } else {
              idx = cm.indexFromPos(cur);
              curPosFinal = cm.posFromIndex(idx + text.length);
            }
          }
        }
        if (vim.visualMode) {
          exitVisualMode(cm, false);
        }
        cm.setCursor(curPosFinal);
      },
      undo: function(cm, actionArgs) {
        cm.operation(function() {
          repeatFn(cm, CodeMirror.commands.undo, actionArgs.repeat)();
          cm.setCursor(cm.getCursor('anchor'));
        });
      },
      redo: function(cm, actionArgs) {
        repeatFn(cm, CodeMirror.commands.redo, actionArgs.repeat)();
      },
      setRegister: function(_cm, actionArgs, vim) {
        vim.inputState.registerName = actionArgs.selectedCharacter;
      },
      setMark: function(cm, actionArgs, vim) {
        var markName = actionArgs.selectedCharacter;
        updateMark(cm, vim, markName, cm.getCursor());
      },
      replace: function(cm, actionArgs, vim) {
        var replaceWith = actionArgs.selectedCharacter;
        var curStart = cm.getCursor();
        var replaceTo;
        var curEnd;
        var selections = cm.listSelections();
        if (vim.visualMode) {
          curStart = cm.getCursor('start');
          curEnd = cm.getCursor('end');
        } else {
          var line = cm.getLine(curStart.line);
          replaceTo = curStart.ch + actionArgs.repeat;
          if (replaceTo > line.length) {
            replaceTo=line.length;
          }
          curEnd = Pos(curStart.line, replaceTo);
        }
        if (replaceWith=='\n') {
          if (!vim.visualMode) cm.replaceRange('', curStart, curEnd);
          // special case, where vim help says to replace by just one line-break
          (CodeMirror.commands.newlineAndIndentContinueComment || CodeMirror.commands.newlineAndIndent)(cm);
        } else {
          var replaceWithStr = cm.getRange(curStart, curEnd);
          //replace all characters in range by selected, but keep linebreaks
          replaceWithStr = replaceWithStr.replace(/[^\n]/g, replaceWith);
          if (vim.visualBlock) {
            // Tabs are split in visua block before replacing
            var spaces = new Array(cm.getOption("tabSize")+1).join(' ');
            replaceWithStr = cm.getSelection();
            replaceWithStr = replaceWithStr.replace(/\t/g, spaces).replace(/[^\n]/g, replaceWith).split('\n');
            cm.replaceSelections(replaceWithStr);
          } else {
            cm.replaceRange(replaceWithStr, curStart, curEnd);
          }
          if (vim.visualMode) {
            curStart = cursorIsBefore(selections[0].anchor, selections[0].head) ?
                         selections[0].anchor : selections[0].head;
            cm.setCursor(curStart);
            exitVisualMode(cm, false);
          } else {
            cm.setCursor(offsetCursor(curEnd, 0, -1));
          }
        }
      },
      incrementNumberToken: function(cm, actionArgs) {
        var cur = cm.getCursor();
        var lineStr = cm.getLine(cur.line);
        var re = /(-?)(?:(0x)([\da-f]+)|(0b|0|)(\d+))/gi;
        var match;
        var start;
        var end;
        var numberStr;
        while ((match = re.exec(lineStr)) !== null) {
          start = match.index;
          end = start + match[0].length;
          if (cur.ch < end)break;
        }
        if (!actionArgs.backtrack && (end <= cur.ch))return;
        if (match) {
          var baseStr = match[2] || match[4]
          var digits = match[3] || match[5]
          var increment = actionArgs.increase ? 1 : -1;
          var base = {'0b': 2, '0': 8, '': 10, '0x': 16}[baseStr.toLowerCase()];
          var number = parseInt(match[1] + digits, base) + (increment * actionArgs.repeat);
          numberStr = number.toString(base);
          var zeroPadding = baseStr ? new Array(digits.length - numberStr.length + 1 + match[1].length).join('0') : ''
          if (numberStr.charAt(0) === '-') {
            numberStr = '-' + baseStr + zeroPadding + numberStr.substr(1);
          } else {
            numberStr = baseStr + zeroPadding + numberStr;
          }
          var from = Pos(cur.line, start);
          var to = Pos(cur.line, end);
          cm.replaceRange(numberStr, from, to);
        } else {
          return;
        }
        cm.setCursor(Pos(cur.line, start + numberStr.length - 1));
      },
      repeatLastEdit: function(cm, actionArgs, vim) {
        var lastEditInputState = vim.lastEditInputState;
        if (!lastEditInputState) { return; }
        var repeat = actionArgs.repeat;
        if (repeat && actionArgs.repeatIsExplicit) {
          vim.lastEditInputState.repeatOverride = repeat;
        } else {
          repeat = vim.lastEditInputState.repeatOverride || repeat;
        }
        repeatLastEdit(cm, vim, repeat, false /** repeatForInsert */);
      },
      indent: function(cm, actionArgs) {
        cm.indentLine(cm.getCursor().line, actionArgs.indentRight);
      },
      exitInsertMode: exitInsertMode
    };

    function defineAction(name, fn) {
      actions[name] = fn;
    }

    /*
     * Below are miscellaneous utility functions used by vim.js
     */

    /**
     * Clips cursor to ensure that line is within the buffer's range
     * If includeLineBreak is true, then allow cur.ch == lineLength.
     */
    function clipCursorToContent(cm, cur, includeLineBreak) {
      var line = Math.min(Math.max(cm.firstLine(), cur.line), cm.lastLine() );
      var maxCh = lineLength(cm, line) - 1;
      maxCh = (includeLineBreak) ? maxCh + 1 : maxCh;
      var ch = Math.min(Math.max(0, cur.ch), maxCh);
      return Pos(line, ch);
    }
    function copyArgs(args) {
      var ret = {};
      for (var prop in args) {
        if (args.hasOwnProperty(prop)) {
          ret[prop] = args[prop];
        }
      }
      return ret;
    }
    function offsetCursor(cur, offsetLine, offsetCh) {
      if (typeof offsetLine === 'object') {
        offsetCh = offsetLine.ch;
        offsetLine = offsetLine.line;
      }
      return Pos(cur.line + offsetLine, cur.ch + offsetCh);
    }
    function commandMatches(keys, keyMap, context, inputState) {
      // Partial matches are not applied. They inform the key handler
      // that the current key sequence is a subsequence of a valid key
      // sequence, so that the key buffer is not cleared.
      var match, partial = [], full = [];
      for (var i = 0; i < keyMap.length; i++) {
        var command = keyMap[i];
        if (context == 'insert' && command.context != 'insert' ||
            command.context && command.context != context ||
            inputState.operator && command.type == 'action' ||
            !(match = commandMatch(keys, command.keys))) { continue; }
        if (match == 'partial') { partial.push(command); }
        if (match == 'full') { full.push(command); }
      }
      return {
        partial: partial.length && partial,
        full: full.length && full
      };
    }
    function commandMatch(pressed, mapped) {
      if (mapped.slice(-11) == '<character>') {
        // Last character matches anything.
        var prefixLen = mapped.length - 11;
        var pressedPrefix = pressed.slice(0, prefixLen);
        var mappedPrefix = mapped.slice(0, prefixLen);
        return pressedPrefix == mappedPrefix && pressed.length > prefixLen ? 'full' :
               mappedPrefix.indexOf(pressedPrefix) == 0 ? 'partial' : false;
      } else {
        return pressed == mapped ? 'full' :
               mapped.indexOf(pressed) == 0 ? 'partial' : false;
      }
    }
    function lastChar(keys) {
      var match = /^.*(<[^>]+>)$/.exec(keys);
      var selectedCharacter = match ? match[1] : keys.slice(-1);
      if (selectedCharacter.length > 1){
        switch(selectedCharacter){
          case '<CR>':
            selectedCharacter='\n';
            break;
          case '<Space>':
            selectedCharacter=' ';
            break;
          default:
            selectedCharacter='';
            break;
        }
      }
      return selectedCharacter;
    }
    function repeatFn(cm, fn, repeat) {
      return function() {
        for (var i = 0; i < repeat; i++) {
          fn(cm);
        }
      };
    }
    function copyCursor(cur) {
      return Pos(cur.line, cur.ch);
    }
    function cursorEqual(cur1, cur2) {
      return cur1.ch == cur2.ch && cur1.line == cur2.line;
    }
    function cursorIsBefore(cur1, cur2) {
      if (cur1.line < cur2.line) {
        return true;
      }
      if (cur1.line == cur2.line && cur1.ch < cur2.ch) {
        return true;
      }
      return false;
    }
    function cursorMin(cur1, cur2) {
      if (arguments.length > 2) {
        cur2 = cursorMin.apply(undefined, Array.prototype.slice.call(arguments, 1));
      }
      return cursorIsBefore(cur1, cur2) ? cur1 : cur2;
    }
    function cursorMax(cur1, cur2) {
      if (arguments.length > 2) {
        cur2 = cursorMax.apply(undefined, Array.prototype.slice.call(arguments, 1));
      }
      return cursorIsBefore(cur1, cur2) ? cur2 : cur1;
    }
    function cursorIsBetween(cur1, cur2, cur3) {
      // returns true if cur2 is between cur1 and cur3.
      var cur1before2 = cursorIsBefore(cur1, cur2);
      var cur2before3 = cursorIsBefore(cur2, cur3);
      return cur1before2 && cur2before3;
    }
    function lineLength(cm, lineNum) {
      return cm.getLine(lineNum).length;
    }
    function trim(s) {
      if (s.trim) {
        return s.trim();
      }
      return s.replace(/^\s+|\s+$/g, '');
    }
    function escapeRegex(s) {
      return s.replace(/([.?*+$\[\]\/\\(){}|\-])/g, '\\$1');
    }
    function extendLineToColumn(cm, lineNum, column) {
      var endCh = lineLength(cm, lineNum);
      var spaces = new Array(column-endCh+1).join(' ');
      cm.setCursor(Pos(lineNum, endCh));
      cm.replaceRange(spaces, cm.getCursor());
    }
    // This functions selects a rectangular block
    // of text with selectionEnd as any of its corner
    // Height of block:
    // Difference in selectionEnd.line and first/last selection.line
    // Width of the block:
    // Distance between selectionEnd.ch and any(first considered here) selection.ch
    function selectBlock(cm, selectionEnd) {
      var selections = [], ranges = cm.listSelections();
      var head = copyCursor(cm.clipPos(selectionEnd));
      var isClipped = !cursorEqual(selectionEnd, head);
      var curHead = cm.getCursor('head');
      var primIndex = getIndex(ranges, curHead);
      var wasClipped = cursorEqual(ranges[primIndex].head, ranges[primIndex].anchor);
      var max = ranges.length - 1;
      var index = max - primIndex > primIndex ? max : 0;
      var base = ranges[index].anchor;

      var firstLine = Math.min(base.line, head.line);
      var lastLine = Math.max(base.line, head.line);
      var baseCh = base.ch, headCh = head.ch;

      var dir = ranges[index].head.ch - baseCh;
      var newDir = headCh - baseCh;
      if (dir > 0 && newDir <= 0) {
        baseCh++;
        if (!isClipped) { headCh--; }
      } else if (dir < 0 && newDir >= 0) {
        baseCh--;
        if (!wasClipped) { headCh++; }
      } else if (dir < 0 && newDir == -1) {
        baseCh--;
        headCh++;
      }
      for (var line = firstLine; line <= lastLine; line++) {
        var range = {anchor: new Pos(line, baseCh), head: new Pos(line, headCh)};
        selections.push(range);
      }
      cm.setSelections(selections);
      selectionEnd.ch = headCh;
      base.ch = baseCh;
      return base;
    }
    function selectForInsert(cm, head, height) {
      var sel = [];
      for (var i = 0; i < height; i++) {
        var lineHead = offsetCursor(head, i, 0);
        sel.push({anchor: lineHead, head: lineHead});
      }
      cm.setSelections(sel, 0);
    }
    // getIndex returns the index of the cursor in the selections.
    function getIndex(ranges, cursor, end) {
      for (var i = 0; i < ranges.length; i++) {
        var atAnchor = end != 'head' && cursorEqual(ranges[i].anchor, cursor);
        var atHead = end != 'anchor' && cursorEqual(ranges[i].head, cursor);
        if (atAnchor || atHead) {
          return i;
        }
      }
      return -1;
    }
    function getSelectedAreaRange(cm, vim) {
      var lastSelection = vim.lastSelection;
      var getCurrentSelectedAreaRange = function() {
        var selections = cm.listSelections();
        var start =  selections[0];
        var end = selections[selections.length-1];
        var selectionStart = cursorIsBefore(start.anchor, start.head) ? start.anchor : start.head;
        var selectionEnd = cursorIsBefore(end.anchor, end.head) ? end.head : end.anchor;
        return [selectionStart, selectionEnd];
      };
      var getLastSelectedAreaRange = function() {
        var selectionStart = cm.getCursor();
        var selectionEnd = cm.getCursor();
        var block = lastSelection.visualBlock;
        if (block) {
          var width = block.width;
          var height = block.height;
          selectionEnd = Pos(selectionStart.line + height, selectionStart.ch + width);
          var selections = [];
          // selectBlock creates a 'proper' rectangular block.
          // We do not want that in all cases, so we manually set selections.
          for (var i = selectionStart.line; i < selectionEnd.line; i++) {
            var anchor = Pos(i, selectionStart.ch);
            var head = Pos(i, selectionEnd.ch);
            var range = {anchor: anchor, head: head};
            selections.push(range);
          }
          cm.setSelections(selections);
        } else {
          var start = lastSelection.anchorMark.find();
          var end = lastSelection.headMark.find();
          var line = end.line - start.line;
          var ch = end.ch - start.ch;
          selectionEnd = {line: selectionEnd.line + line, ch: line ? selectionEnd.ch : ch + selectionEnd.ch};
          if (lastSelection.visualLine) {
            selectionStart = Pos(selectionStart.line, 0);
            selectionEnd = Pos(selectionEnd.line, lineLength(cm, selectionEnd.line));
          }
          cm.setSelection(selectionStart, selectionEnd);
        }
        return [selectionStart, selectionEnd];
      };
      if (!vim.visualMode) {
      // In case of replaying the action.
        return getLastSelectedAreaRange();
      } else {
        return getCurrentSelectedAreaRange();
      }
    }
    // Updates the previous selection with the current selection's values. This
    // should only be called in visual mode.
    function updateLastSelection(cm, vim) {
      var anchor = vim.sel.anchor;
      var head = vim.sel.head;
      // To accommodate the effect of lastPastedText in the last selection
      if (vim.lastPastedText) {
        head = cm.posFromIndex(cm.indexFromPos(anchor) + vim.lastPastedText.length);
        vim.lastPastedText = null;
      }
      vim.lastSelection = {'anchorMark': cm.setBookmark(anchor),
                           'headMark': cm.setBookmark(head),
                           'anchor': copyCursor(anchor),
                           'head': copyCursor(head),
                           'visualMode': vim.visualMode,
                           'visualLine': vim.visualLine,
                           'visualBlock': vim.visualBlock};
    }
    function expandSelection(cm, start, end) {
      var sel = cm.state.vim.sel;
      var head = sel.head;
      var anchor = sel.anchor;
      var tmp;
      if (cursorIsBefore(end, start)) {
        tmp = end;
        end = start;
        start = tmp;
      }
      if (cursorIsBefore(head, anchor)) {
        head = cursorMin(start, head);
        anchor = cursorMax(anchor, end);
      } else {
        anchor = cursorMin(start, anchor);
        head = cursorMax(head, end);
        head = offsetCursor(head, 0, -1);
        if (head.ch == -1 && head.line != cm.firstLine()) {
          head = Pos(head.line - 1, lineLength(cm, head.line - 1));
        }
      }
      return [anchor, head];
    }
    /**
     * Updates the CodeMirror selection to match the provided vim selection.
     * If no arguments are given, it uses the current vim selection state.
     */
    function updateCmSelection(cm, sel, mode) {
      var vim = cm.state.vim;
      sel = sel || vim.sel;
      var mode = mode ||
        vim.visualLine ? 'line' : vim.visualBlock ? 'block' : 'char';
      var cmSel = makeCmSelection(cm, sel, mode);
      cm.setSelections(cmSel.ranges, cmSel.primary);
      updateFakeCursor(cm);
    }
    function makeCmSelection(cm, sel, mode, exclusive) {
      var head = copyCursor(sel.head);
      var anchor = copyCursor(sel.anchor);
      if (mode == 'char') {
        var headOffset = !exclusive && !cursorIsBefore(sel.head, sel.anchor) ? 1 : 0;
        var anchorOffset = cursorIsBefore(sel.head, sel.anchor) ? 1 : 0;
        head = offsetCursor(sel.head, 0, headOffset);
        anchor = offsetCursor(sel.anchor, 0, anchorOffset);
        return {
          ranges: [{anchor: anchor, head: head}],
          primary: 0
        };
      } else if (mode == 'line') {
        if (!cursorIsBefore(sel.head, sel.anchor)) {
          anchor.ch = 0;

          var lastLine = cm.lastLine();
          if (head.line > lastLine) {
            head.line = lastLine;
          }
          head.ch = lineLength(cm, head.line);
        } else {
          head.ch = 0;
          anchor.ch = lineLength(cm, anchor.line);
        }
        return {
          ranges: [{anchor: anchor, head: head}],
          primary: 0
        };
      } else if (mode == 'block') {
        var top = Math.min(anchor.line, head.line),
            left = Math.min(anchor.ch, head.ch),
            bottom = Math.max(anchor.line, head.line),
            right = Math.max(anchor.ch, head.ch) + 1;
        var height = bottom - top + 1;
        var primary = head.line == top ? 0 : height - 1;
        var ranges = [];
        for (var i = 0; i < height; i++) {
          ranges.push({
            anchor: Pos(top + i, left),
            head: Pos(top + i, right)
          });
        }
        return {
          ranges: ranges,
          primary: primary
        };
      }
    }
    function getHead(cm) {
      var cur = cm.getCursor('head');
      if (cm.getSelection().length == 1) {
        // Small corner case when only 1 character is selected. The "real"
        // head is the left of head and anchor.
        cur = cursorMin(cur, cm.getCursor('anchor'));
      }
      return cur;
    }

    /**
     * If moveHead is set to false, the CodeMirror selection will not be
     * touched. The caller assumes the responsibility of putting the cursor
    * in the right place.
     */
    function exitVisualMode(cm, moveHead) {
      var vim = cm.state.vim;
      if (moveHead !== false) {
        cm.setCursor(clipCursorToContent(cm, vim.sel.head));
      }
      updateLastSelection(cm, vim);
      vim.visualMode = false;
      vim.visualLine = false;
      vim.visualBlock = false;
      CodeMirror.signal(cm, "vim-mode-change", {mode: "normal"});
      if (vim.fakeCursor) {
        vim.fakeCursor.clear();
      }
    }

    // Remove any trailing newlines from the selection. For
    // example, with the caret at the start of the last word on the line,
    // 'dw' should word, but not the newline, while 'w' should advance the
    // caret to the first character of the next line.
    function clipToLine(cm, curStart, curEnd) {
      var selection = cm.getRange(curStart, curEnd);
      // Only clip if the selection ends with trailing newline + whitespace
      if (/\n\s*$/.test(selection)) {
        var lines = selection.split('\n');
        // We know this is all whitespace.
        lines.pop();

        // Cases:
        // 1. Last word is an empty line - do not clip the trailing '\n'
        // 2. Last word is not an empty line - clip the trailing '\n'
        var line;
        // Find the line containing the last word, and clip all whitespace up
        // to it.
        for (var line = lines.pop(); lines.length > 0 && line && isWhiteSpaceString(line); line = lines.pop()) {
          curEnd.line--;
          curEnd.ch = 0;
        }
        // If the last word is not an empty line, clip an additional newline
        if (line) {
          curEnd.line--;
          curEnd.ch = lineLength(cm, curEnd.line);
        } else {
          curEnd.ch = 0;
        }
      }
    }

    // Expand the selection to line ends.
    function expandSelectionToLine(_cm, curStart, curEnd) {
      curStart.ch = 0;
      curEnd.ch = 0;
      curEnd.line++;
    }

    function findFirstNonWhiteSpaceCharacter(text) {
      if (!text) {
        return 0;
      }
      var firstNonWS = text.search(/\S/);
      return firstNonWS == -1 ? text.length : firstNonWS;
    }

    function expandWordUnderCursor(cm, inclusive, _forward, bigWord, noSymbol) {
      var cur = getHead(cm);
      var line = cm.getLine(cur.line);
      var idx = cur.ch;

      // Seek to first word or non-whitespace character, depending on if
      // noSymbol is true.
      var test = noSymbol ? wordCharTest[0] : bigWordCharTest [0];
      while (!test(line.charAt(idx))) {
        idx++;
        if (idx >= line.length) { return null; }
      }

      if (bigWord) {
        test = bigWordCharTest[0];
      } else {
        test = wordCharTest[0];
        if (!test(line.charAt(idx))) {
          test = wordCharTest[1];
        }
      }

      var end = idx, start = idx;
      while (test(line.charAt(end)) && end < line.length) { end++; }
      while (test(line.charAt(start)) && start >= 0) { start--; }
      start++;

      if (inclusive) {
        // If present, include all whitespace after word.
        // Otherwise, include all whitespace before word, except indentation.
        var wordEnd = end;
        while (/\s/.test(line.charAt(end)) && end < line.length) { end++; }
        if (wordEnd == end) {
          var wordStart = start;
          while (/\s/.test(line.charAt(start - 1)) && start > 0) { start--; }
          if (!start) { start = wordStart; }
        }
      }
      return { start: Pos(cur.line, start), end: Pos(cur.line, end) };
    }

    function recordJumpPosition(cm, oldCur, newCur) {
      if (!cursorEqual(oldCur, newCur)) {
        vimGlobalState.jumpList.add(cm, oldCur, newCur);
      }
    }

    function recordLastCharacterSearch(increment, args) {
        vimGlobalState.lastCharacterSearch.increment = increment;
        vimGlobalState.lastCharacterSearch.forward = args.forward;
        vimGlobalState.lastCharacterSearch.selectedCharacter = args.selectedCharacter;
    }

    var symbolToMode = {
        '(': 'bracket', ')': 'bracket', '{': 'bracket', '}': 'bracket',
        '[': 'section', ']': 'section',
        '*': 'comment', '/': 'comment',
        'm': 'method', 'M': 'method',
        '#': 'preprocess'
    };
    var findSymbolModes = {
      bracket: {
        isComplete: function(state) {
          if (state.nextCh === state.symb) {
            state.depth++;
            if (state.depth >= 1)return true;
          } else if (state.nextCh === state.reverseSymb) {
            state.depth--;
          }
          return false;
        }
      },
      section: {
        init: function(state) {
          state.curMoveThrough = true;
          state.symb = (state.forward ? ']' : '[') === state.symb ? '{' : '}';
        },
        isComplete: function(state) {
          return state.index === 0 && state.nextCh === state.symb;
        }
      },
      comment: {
        isComplete: function(state) {
          var found = state.lastCh === '*' && state.nextCh === '/';
          state.lastCh = state.nextCh;
          return found;
        }
      },
      // TODO: The original Vim implementation only operates on level 1 and 2.
      // The current implementation doesn't check for code block level and
      // therefore it operates on any levels.
      method: {
        init: function(state) {
          state.symb = (state.symb === 'm' ? '{' : '}');
          state.reverseSymb = state.symb === '{' ? '}' : '{';
        },
        isComplete: function(state) {
          if (state.nextCh === state.symb)return true;
          return false;
        }
      },
      preprocess: {
        init: function(state) {
          state.index = 0;
        },
        isComplete: function(state) {
          if (state.nextCh === '#') {
            var token = state.lineText.match(/#(\w+)/)[1];
            if (token === 'endif') {
              if (state.forward && state.depth === 0) {
                return true;
              }
              state.depth++;
            } else if (token === 'if') {
              if (!state.forward && state.depth === 0) {
                return true;
              }
              state.depth--;
            }
            if (token === 'else' && state.depth === 0)return true;
          }
          return false;
        }
      }
    };
    function findSymbol(cm, repeat, forward, symb) {
      var cur = copyCursor(cm.getCursor());
      var increment = forward ? 1 : -1;
      var endLine = forward ? cm.lineCount() : -1;
      var curCh = cur.ch;
      var line = cur.line;
      var lineText = cm.getLine(line);
      var state = {
        lineText: lineText,
        nextCh: lineText.charAt(curCh),
        lastCh: null,
        index: curCh,
        symb: symb,
        reverseSymb: (forward ?  { ')': '(', '}': '{' } : { '(': ')', '{': '}' })[symb],
        forward: forward,
        depth: 0,
        curMoveThrough: false
      };
      var mode = symbolToMode[symb];
      if (!mode)return cur;
      var init = findSymbolModes[mode].init;
      var isComplete = findSymbolModes[mode].isComplete;
      if (init) { init(state); }
      while (line !== endLine && repeat) {
        state.index += increment;
        state.nextCh = state.lineText.charAt(state.index);
        if (!state.nextCh) {
          line += increment;
          state.lineText = cm.getLine(line) || '';
          if (increment > 0) {
            state.index = 0;
          } else {
            var lineLen = state.lineText.length;
            state.index = (lineLen > 0) ? (lineLen-1) : 0;
          }
          state.nextCh = state.lineText.charAt(state.index);
        }
        if (isComplete(state)) {
          cur.line = line;
          cur.ch = state.index;
          repeat--;
        }
      }
      if (state.nextCh || state.curMoveThrough) {
        return Pos(line, state.index);
      }
      return cur;
    }

    /*
     * Returns the boundaries of the next word. If the cursor in the middle of
     * the word, then returns the boundaries of the current word, starting at
     * the cursor. If the cursor is at the start/end of a word, and we are going
     * forward/backward, respectively, find the boundaries of the next word.
     *
     * @param {CodeMirror} cm CodeMirror object.
     * @param {Cursor} cur The cursor position.
     * @param {boolean} forward True to search forward. False to search
     *     backward.
     * @param {boolean} bigWord True if punctuation count as part of the word.
     *     False if only [a-zA-Z0-9] characters count as part of the word.
     * @param {boolean} emptyLineIsWord True if empty lines should be treated
     *     as words.
     * @return {Object{from:number, to:number, line: number}} The boundaries of
     *     the word, or null if there are no more words.
     */
    function findWord(cm, cur, forward, bigWord, emptyLineIsWord) {
      var lineNum = cur.line;
      var pos = cur.ch;
      var line = cm.getLine(lineNum);
      var dir = forward ? 1 : -1;
      var charTests = bigWord ? bigWordCharTest: wordCharTest;

      if (emptyLineIsWord && line == '') {
        lineNum += dir;
        line = cm.getLine(lineNum);
        if (!isLine(cm, lineNum)) {
          return null;
        }
        pos = (forward) ? 0 : line.length;
      }

      while (true) {
        if (emptyLineIsWord && line == '') {
          return { from: 0, to: 0, line: lineNum };
        }
        var stop = (dir > 0) ? line.length : -1;
        var wordStart = stop, wordEnd = stop;
        // Find bounds of next word.
        while (pos != stop) {
          var foundWord = false;
          for (var i = 0; i < charTests.length && !foundWord; ++i) {
            if (charTests[i](line.charAt(pos))) {
              wordStart = pos;
              // Advance to end of word.
              while (pos != stop && charTests[i](line.charAt(pos))) {
                pos += dir;
              }
              wordEnd = pos;
              foundWord = wordStart != wordEnd;
              if (wordStart == cur.ch && lineNum == cur.line &&
                  wordEnd == wordStart + dir) {
                // We started at the end of a word. Find the next one.
                continue;
              } else {
                return {
                  from: Math.min(wordStart, wordEnd + 1),
                  to: Math.max(wordStart, wordEnd),
                  line: lineNum };
              }
            }
          }
          if (!foundWord) {
            pos += dir;
          }
        }
        // Advance to next/prev line.
        lineNum += dir;
        if (!isLine(cm, lineNum)) {
          return null;
        }
        line = cm.getLine(lineNum);
        pos = (dir > 0) ? 0 : line.length;
      }
    }

    /**
     * @param {CodeMirror} cm CodeMirror object.
     * @param {Pos} cur The position to start from.
     * @param {int} repeat Number of words to move past.
     * @param {boolean} forward True to search forward. False to search
     *     backward.
     * @param {boolean} wordEnd True to move to end of word. False to move to
     *     beginning of word.
     * @param {boolean} bigWord True if punctuation count as part of the word.
     *     False if only alphabet characters count as part of the word.
     * @return {Cursor} The position the cursor should move to.
     */
    function moveToWord(cm, cur, repeat, forward, wordEnd, bigWord) {
      var curStart = copyCursor(cur);
      var words = [];
      if (forward && !wordEnd || !forward && wordEnd) {
        repeat++;
      }
      // For 'e', empty lines are not considered words, go figure.
      var emptyLineIsWord = !(forward && wordEnd);
      for (var i = 0; i < repeat; i++) {
        var word = findWord(cm, cur, forward, bigWord, emptyLineIsWord);
        if (!word) {
          var eodCh = lineLength(cm, cm.lastLine());
          words.push(forward
              ? {line: cm.lastLine(), from: eodCh, to: eodCh}
              : {line: 0, from: 0, to: 0});
          break;
        }
        words.push(word);
        cur = Pos(word.line, forward ? (word.to - 1) : word.from);
      }
      var shortCircuit = words.length != repeat;
      var firstWord = words[0];
      var lastWord = words.pop();
      if (forward && !wordEnd) {
        // w
        if (!shortCircuit && (firstWord.from != curStart.ch || firstWord.line != curStart.line)) {
          // We did not start in the middle of a word. Discard the extra word at the end.
          lastWord = words.pop();
        }
        return Pos(lastWord.line, lastWord.from);
      } else if (forward && wordEnd) {
        return Pos(lastWord.line, lastWord.to - 1);
      } else if (!forward && wordEnd) {
        // ge
        if (!shortCircuit && (firstWord.to != curStart.ch || firstWord.line != curStart.line)) {
          // We did not start in the middle of a word. Discard the extra word at the end.
          lastWord = words.pop();
        }
        return Pos(lastWord.line, lastWord.to);
      } else {
        // b
        return Pos(lastWord.line, lastWord.from);
      }
    }

    function moveToCharacter(cm, repeat, forward, character) {
      var cur = cm.getCursor();
      var start = cur.ch;
      var idx;
      for (var i = 0; i < repeat; i ++) {
        var line = cm.getLine(cur.line);
        idx = charIdxInLine(start, line, character, forward, true);
        if (idx == -1) {
          return null;
        }
        start = idx;
      }
      return Pos(cm.getCursor().line, idx);
    }

    function moveToColumn(cm, repeat) {
      // repeat is always >= 1, so repeat - 1 always corresponds
      // to the column we want to go to.
      var line = cm.getCursor().line;
      return clipCursorToContent(cm, Pos(line, repeat - 1));
    }

    function updateMark(cm, vim, markName, pos) {
      if (!inArray(markName, validMarks)) {
        return;
      }
      if (vim.marks[markName]) {
        vim.marks[markName].clear();
      }
      vim.marks[markName] = cm.setBookmark(pos);
    }

    function charIdxInLine(start, line, character, forward, includeChar) {
      // Search for char in line.
      // motion_options: {forward, includeChar}
      // If includeChar = true, include it too.
      // If forward = true, search forward, else search backwards.
      // If char is not found on this line, do nothing
      var idx;
      if (forward) {
        idx = line.indexOf(character, start + 1);
        if (idx != -1 && !includeChar) {
          idx -= 1;
        }
      } else {
        idx = line.lastIndexOf(character, start - 1);
        if (idx != -1 && !includeChar) {
          idx += 1;
        }
      }
      return idx;
    }

    function findParagraph(cm, head, repeat, dir, inclusive) {
      var line = head.line;
      var min = cm.firstLine();
      var max = cm.lastLine();
      var start, end, i = line;
      function isEmpty(i) { return !cm.getLine(i); }
      function isBoundary(i, dir, any) {
        if (any) { return isEmpty(i) != isEmpty(i + dir); }
        return !isEmpty(i) && isEmpty(i + dir);
      }
      if (dir) {
        while (min <= i && i <= max && repeat > 0) {
          if (isBoundary(i, dir)) { repeat--; }
          i += dir;
        }
        return new Pos(i, 0);
      }

      var vim = cm.state.vim;
      if (vim.visualLine && isBoundary(line, 1, true)) {
        var anchor = vim.sel.anchor;
        if (isBoundary(anchor.line, -1, true)) {
          if (!inclusive || anchor.line != line) {
            line += 1;
          }
        }
      }
      var startState = isEmpty(line);
      for (i = line; i <= max && repeat; i++) {
        if (isBoundary(i, 1, true)) {
          if (!inclusive || isEmpty(i) != startState) {
            repeat--;
          }
        }
      }
      end = new Pos(i, 0);
      // select boundary before paragraph for the last one
      if (i > max && !startState) { startState = true; }
      else { inclusive = false; }
      for (i = line; i > min; i--) {
        if (!inclusive || isEmpty(i) == startState || i == line) {
          if (isBoundary(i, -1, true)) { break; }
        }
      }
      start = new Pos(i, 0);
      return { start: start, end: end };
    }

    function findSentence(cm, cur, repeat, dir) {

      /*
        Takes an index object
        {
          line: the line string,
          ln: line number,
          pos: index in line,
          dir: direction of traversal (-1 or 1)
        }
        and modifies the line, ln, and pos members to represent the
        next valid position or sets them to null if there are
        no more valid positions.
       */
      function nextChar(cm, idx) {
        if (idx.pos + idx.dir < 0 || idx.pos + idx.dir >= idx.line.length) {
          idx.ln += idx.dir;
          if (!isLine(cm, idx.ln)) {
            idx.line = null;
            idx.ln = null;
            idx.pos = null;
            return;
          }
          idx.line = cm.getLine(idx.ln);
          idx.pos = (idx.dir > 0) ? 0 : idx.line.length - 1;
        }
        else {
          idx.pos += idx.dir;
        }
      }

      /*
        Performs one iteration of traversal in forward direction
        Returns an index object of the new location
       */
      function forward(cm, ln, pos, dir) {
        var line = cm.getLine(ln);
        var stop = (line === "");

        var curr = {
          line: line,
          ln: ln,
          pos: pos,
          dir: dir,
        }

        var last_valid = {
          ln: curr.ln,
          pos: curr.pos,
        }

        var skip_empty_lines = (curr.line === "");

        // Move one step to skip character we start on
        nextChar(cm, curr);

        while (curr.line !== null) {
          last_valid.ln = curr.ln;
          last_valid.pos = curr.pos;

          if (curr.line === "" && !skip_empty_lines) {
            return { ln: curr.ln, pos: curr.pos, };
          }
          else if (stop && curr.line !== "" && !isWhiteSpaceString(curr.line[curr.pos])) {
            return { ln: curr.ln, pos: curr.pos, };
          }
          else if (isEndOfSentenceSymbol(curr.line[curr.pos])
            && !stop
            && (curr.pos === curr.line.length - 1
              || isWhiteSpaceString(curr.line[curr.pos + 1]))) {
            stop = true;
          }

          nextChar(cm, curr);
        }

        /*
          Set the position to the last non whitespace character on the last
          valid line in the case that we reach the end of the document.
        */
        var line = cm.getLine(last_valid.ln);
        last_valid.pos = 0;
        for(var i = line.length - 1; i >= 0; --i) {
          if (!isWhiteSpaceString(line[i])) {
            last_valid.pos = i;
            break;
          }
        }

        return last_valid;

      }

      /*
        Performs one iteration of traversal in reverse direction
        Returns an index object of the new location
       */
      function reverse(cm, ln, pos, dir) {
        var line = cm.getLine(ln);

        var curr = {
          line: line,
          ln: ln,
          pos: pos,
          dir: dir,
        }

        var last_valid = {
          ln: curr.ln,
          pos: null,
        };

        var skip_empty_lines = (curr.line === "");

        // Move one step to skip character we start on
        nextChar(cm, curr);

        while (curr.line !== null) {

          if (curr.line === "" && !skip_empty_lines) {
            if (last_valid.pos !== null) {
              return last_valid;
            }
            else {
              return { ln: curr.ln, pos: curr.pos };
            }
          }
          else if (isEndOfSentenceSymbol(curr.line[curr.pos])
              && last_valid.pos !== null
              && !(curr.ln === last_valid.ln && curr.pos + 1 === last_valid.pos)) {
            return last_valid;
          }
          else if (curr.line !== "" && !isWhiteSpaceString(curr.line[curr.pos])) {
            skip_empty_lines = false;
            last_valid = { ln: curr.ln, pos: curr.pos }
          }

          nextChar(cm, curr);
        }

        /*
          Set the position to the first non whitespace character on the last
          valid line in the case that we reach the beginning of the document.
        */
        var line = cm.getLine(last_valid.ln);
        last_valid.pos = 0;
        for(var i = 0; i < line.length; ++i) {
          if (!isWhiteSpaceString(line[i])) {
            last_valid.pos = i;
            break;
          }
        }
        return last_valid;
      }

      var curr_index = {
        ln: cur.line,
        pos: cur.ch,
      };

      while (repeat > 0) {
        if (dir < 0) {
          curr_index = reverse(cm, curr_index.ln, curr_index.pos, dir);
        }
        else {
          curr_index = forward(cm, curr_index.ln, curr_index.pos, dir);
        }
        repeat--;
      }

      return Pos(curr_index.ln, curr_index.pos);
    }

    // TODO: perhaps this finagling of start and end positions belonds
    // in codemirror/replaceRange?
    function selectCompanionObject(cm, head, symb, inclusive) {
      var cur = head, start, end;

      var bracketRegexp = ({
        '(': /[()]/, ')': /[()]/,
        '[': /[[\]]/, ']': /[[\]]/,
        '{': /[{}]/, '}': /[{}]/,
        '<': /[<>]/, '>': /[<>]/})[symb];
      var openSym = ({
        '(': '(', ')': '(',
        '[': '[', ']': '[',
        '{': '{', '}': '{',
        '<': '<', '>': '<'})[symb];
      var curChar = cm.getLine(cur.line).charAt(cur.ch);
      // Due to the behavior of scanForBracket, we need to add an offset if the
      // cursor is on a matching open bracket.
      var offset = curChar === openSym ? 1 : 0;

      start = cm.scanForBracket(Pos(cur.line, cur.ch + offset), -1, undefined, {'bracketRegex': bracketRegexp});
      end = cm.scanForBracket(Pos(cur.line, cur.ch + offset), 1, undefined, {'bracketRegex': bracketRegexp});

      if (!start || !end) {
        return { start: cur, end: cur };
      }

      start = start.pos;
      end = end.pos;

      if ((start.line == end.line && start.ch > end.ch)
          || (start.line > end.line)) {
        var tmp = start;
        start = end;
        end = tmp;
      }

      if (inclusive) {
        end.ch += 1;
      } else {
        start.ch += 1;
      }

      return { start: start, end: end };
    }

    // Takes in a symbol and a cursor and tries to simulate text objects that
    // have identical opening and closing symbols
    // TODO support across multiple lines
    function findBeginningAndEnd(cm, head, symb, inclusive) {
      var cur = copyCursor(head);
      var line = cm.getLine(cur.line);
      var chars = line.split('');
      var start, end, i, len;
      var firstIndex = chars.indexOf(symb);

      // the decision tree is to always look backwards for the beginning first,
      // but if the cursor is in front of the first instance of the symb,
      // then move the cursor forward
      if (cur.ch < firstIndex) {
        cur.ch = firstIndex;
        // Why is this line even here???
        // cm.setCursor(cur.line, firstIndex+1);
      }
      // otherwise if the cursor is currently on the closing symbol
      else if (firstIndex < cur.ch && chars[cur.ch] == symb) {
        end = cur.ch; // assign end to the current cursor
        --cur.ch; // make sure to look backwards
      }

      // if we're currently on the symbol, we've got a start
      if (chars[cur.ch] == symb && !end) {
        start = cur.ch + 1; // assign start to ahead of the cursor
      } else {
        // go backwards to find the start
        for (i = cur.ch; i > -1 && !start; i--) {
          if (chars[i] == symb) {
            start = i + 1;
          }
        }
      }

      // look forwards for the end symbol
      if (start && !end) {
        for (i = start, len = chars.length; i < len && !end; i++) {
          if (chars[i] == symb) {
            end = i;
          }
        }
      }

      // nothing found
      if (!start || !end) {
        return { start: cur, end: cur };
      }

      // include the symbols
      if (inclusive) {
        --start; ++end;
      }

      return {
        start: Pos(cur.line, start),
        end: Pos(cur.line, end)
      };
    }

    // Search functions
    defineOption('pcre', true, 'boolean');
    function SearchState() {}
    SearchState.prototype = {
      getQuery: function() {
        return vimGlobalState.query;
      },
      setQuery: function(query) {
        vimGlobalState.query = query;
      },
      getOverlay: function() {
        return this.searchOverlay;
      },
      setOverlay: function(overlay) {
        this.searchOverlay = overlay;
      },
      isReversed: function() {
        return vimGlobalState.isReversed;
      },
      setReversed: function(reversed) {
        vimGlobalState.isReversed = reversed;
      },
      getScrollbarAnnotate: function() {
        return this.annotate;
      },
      setScrollbarAnnotate: function(annotate) {
        this.annotate = annotate;
      }
    };
    function getSearchState(cm) {
      var vim = cm.state.vim;
      return vim.searchState_ || (vim.searchState_ = new SearchState());
    }
    function dialog(cm, template, shortText, onClose, options) {
      if (cm.openDialog) {
        cm.openDialog(template, onClose, { bottom: true, value: options.value,
            onKeyDown: options.onKeyDown, onKeyUp: options.onKeyUp,
            selectValueOnOpen: false});
      }
      else {
        onClose(prompt(shortText, ''));
      }
    }
    function splitBySlash(argString) {
      return splitBySeparator(argString, '/');
    }

    function findUnescapedSlashes(argString) {
      return findUnescapedSeparators(argString, '/');
    }

    function splitBySeparator(argString, separator) {
      var slashes = findUnescapedSeparators(argString, separator) || [];
      if (!slashes.length) return [];
      var tokens = [];
      // in case of strings like foo/bar
      if (slashes[0] !== 0) return;
      for (var i = 0; i < slashes.length; i++) {
        if (typeof slashes[i] == 'number')
          tokens.push(argString.substring(slashes[i] + 1, slashes[i+1]));
      }
      return tokens;
    }

    function findUnescapedSeparators(str, separator) {
      if (!separator)
        separator = '/';

      var escapeNextChar = false;
      var slashes = [];
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i);
        if (!escapeNextChar && c == separator) {
          slashes.push(i);
        }
        escapeNextChar = !escapeNextChar && (c == '\\');
      }
      return slashes;
    }

    // Translates a search string from ex (vim) syntax into javascript form.
    function translateRegex(str) {
      // When these match, add a '\' if unescaped or remove one if escaped.
      var specials = '|(){';
      // Remove, but never add, a '\' for these.
      var unescape = '}';
      var escapeNextChar = false;
      var out = [];
      for (var i = -1; i < str.length; i++) {
        var c = str.charAt(i) || '';
        var n = str.charAt(i+1) || '';
        var specialComesNext = (n && specials.indexOf(n) != -1);
        if (escapeNextChar) {
          if (c !== '\\' || !specialComesNext) {
            out.push(c);
          }
          escapeNextChar = false;
        } else {
          if (c === '\\') {
            escapeNextChar = true;
            // Treat the unescape list as special for removing, but not adding '\'.
            if (n && unescape.indexOf(n) != -1) {
              specialComesNext = true;
            }
            // Not passing this test means removing a '\'.
            if (!specialComesNext || n === '\\') {
              out.push(c);
            }
          } else {
            out.push(c);
            if (specialComesNext && n !== '\\') {
              out.push('\\');
            }
          }
        }
      }
      return out.join('');
    }

    // Translates the replace part of a search and replace from ex (vim) syntax into
    // javascript form.  Similar to translateRegex, but additionally fixes back references
    // (translates '\[0..9]' to '$[0..9]') and follows different rules for escaping '$'.
    var charUnescapes = {'\\n': '\n', '\\r': '\r', '\\t': '\t'};
    function translateRegexReplace(str) {
      var escapeNextChar = false;
      var out = [];
      for (var i = -1; i < str.length; i++) {
        var c = str.charAt(i) || '';
        var n = str.charAt(i+1) || '';
        if (charUnescapes[c + n]) {
          out.push(charUnescapes[c+n]);
          i++;
        } else if (escapeNextChar) {
          // At any point in the loop, escapeNextChar is true if the previous
          // character was a '\' and was not escaped.
          out.push(c);
          escapeNextChar = false;
        } else {
          if (c === '\\') {
            escapeNextChar = true;
            if ((isNumber(n) || n === '$')) {
              out.push('$');
            } else if (n !== '/' && n !== '\\') {
              out.push('\\');
            }
          } else {
            if (c === '$') {
              out.push('$');
            }
            out.push(c);
            if (n === '/') {
              out.push('\\');
            }
          }
        }
      }
      return out.join('');
    }

    // Unescape \ and / in the replace part, for PCRE mode.
    var unescapes = {'\\/': '/', '\\\\': '\\', '\\n': '\n', '\\r': '\r', '\\t': '\t'};
    function unescapeRegexReplace(str) {
      var stream = new CodeMirror.StringStream(str);
      var output = [];
      while (!stream.eol()) {
        // Search for \.
        while (stream.peek() && stream.peek() != '\\') {
          output.push(stream.next());
        }
        var matched = false;
        for (var matcher in unescapes) {
          if (stream.match(matcher, true)) {
            matched = true;
            output.push(unescapes[matcher]);
            break;
          }
        }
        if (!matched) {
          // Don't change anything
          output.push(stream.next());
        }
      }
      return output.join('');
    }

    /**
     * Extract the regular expression from the query and return a Regexp object.
     * Returns null if the query is blank.
     * If ignoreCase is passed in, the Regexp object will have the 'i' flag set.
     * If smartCase is passed in, and the query contains upper case letters,
     *   then ignoreCase is overridden, and the 'i' flag will not be set.
     * If the query contains the /i in the flag part of the regular expression,
     *   then both ignoreCase and smartCase are ignored, and 'i' will be passed
     *   through to the Regex object.
     */
    function parseQuery(query, ignoreCase, smartCase) {
      // First update the last search register
      var lastSearchRegister = vimGlobalState.registerController.getRegister('/');
      lastSearchRegister.setText(query);
      // Check if the query is already a regex.
      if (query instanceof RegExp) { return query; }
      // First try to extract regex + flags from the input. If no flags found,
      // extract just the regex. IE does not accept flags directly defined in
      // the regex string in the form /regex/flags
      var slashes = findUnescapedSlashes(query);
      var regexPart;
      var forceIgnoreCase;
      if (!slashes.length) {
        // Query looks like 'regexp'
        regexPart = query;
      } else {
        // Query looks like 'regexp/...'
        regexPart = query.substring(0, slashes[0]);
        var flagsPart = query.substring(slashes[0]);
        forceIgnoreCase = (flagsPart.indexOf('i') != -1);
      }
      if (!regexPart) {
        return null;
      }
      if (!getOption('pcre')) {
        regexPart = translateRegex(regexPart);
      }
      if (smartCase) {
        ignoreCase = (/^[^A-Z]*$/).test(regexPart);
      }
      var regexp = new RegExp(regexPart,
          (ignoreCase || forceIgnoreCase) ? 'i' : undefined);
      return regexp;
    }
    function showConfirm(cm, text) {
      if (cm.openNotification) {
        cm.openNotification('<span style="color: red">' + text + '</span>',
                            {bottom: true, duration: 5000});
      } else {
        alert(text);
      }
    }
    function makePrompt(prefix, desc) {
      var raw = '<span style="font-family: monospace; white-space: pre">' +
          (prefix || "") + '<input type="text"></span>';
      if (desc)
        raw += ' <span style="color: #888">' + desc + '</span>';
      return raw;
    }
    var searchPromptDesc = '(Javascript regexp)';
    function showPrompt(cm, options) {
      var shortText = (options.prefix || '') + ' ' + (options.desc || '');
      var prompt = makePrompt(options.prefix, options.desc);
      dialog(cm, prompt, shortText, options.onClose, options);
    }
    function regexEqual(r1, r2) {
      if (r1 instanceof RegExp && r2 instanceof RegExp) {
          var props = ['global', 'multiline', 'ignoreCase', 'source'];
          for (var i = 0; i < props.length; i++) {
              var prop = props[i];
              if (r1[prop] !== r2[prop]) {
                  return false;
              }
          }
          return true;
      }
      return false;
    }
    // Returns true if the query is valid.
    function updateSearchQuery(cm, rawQuery, ignoreCase, smartCase) {
      if (!rawQuery) {
        return;
      }
      var state = getSearchState(cm);
      var query = parseQuery(rawQuery, !!ignoreCase, !!smartCase);
      if (!query) {
        return;
      }
      highlightSearchMatches(cm, query);
      if (regexEqual(query, state.getQuery())) {
        return query;
      }
      state.setQuery(query);
      return query;
    }
    function searchOverlay(query) {
      if (query.source.charAt(0) == '^') {
        var matchSol = true;
      }
      return {
        token: function(stream) {
          if (matchSol && !stream.sol()) {
            stream.skipToEnd();
            return;
          }
          var match = stream.match(query, false);
          if (match) {
            if (match[0].length == 0) {
              // Matched empty string, skip to next.
              stream.next();
              return 'searching';
            }
            if (!stream.sol()) {
              // Backtrack 1 to match \b
              stream.backUp(1);
              if (!query.exec(stream.next() + match[0])) {
                stream.next();
                return null;
              }
            }
            stream.match(query);
            return 'searching';
          }
          while (!stream.eol()) {
            stream.next();
            if (stream.match(query, false)) break;
          }
        },
        query: query
      };
    }
    function highlightSearchMatches(cm, query) {
      var searchState = getSearchState(cm);
      var overlay = searchState.getOverlay();
      if (!overlay || query != overlay.query) {
        if (overlay) {
          cm.removeOverlay(overlay);
        }
        overlay = searchOverlay(query);
        cm.addOverlay(overlay);
        if (cm.showMatchesOnScrollbar) {
          if (searchState.getScrollbarAnnotate()) {
            searchState.getScrollbarAnnotate().clear();
          }
          searchState.setScrollbarAnnotate(cm.showMatchesOnScrollbar(query));
        }
        searchState.setOverlay(overlay);
      }
    }
    function findNext(cm, prev, query, repeat) {
      if (repeat === undefined) { repeat = 1; }
      return cm.operation(function() {
        var pos = cm.getCursor();
        var cursor = cm.getSearchCursor(query, pos);
        for (var i = 0; i < repeat; i++) {
          var found = cursor.find(prev);
          if (i == 0 && found && cursorEqual(cursor.from(), pos)) { found = cursor.find(prev); }
          if (!found) {
            // SearchCursor may have returned null because it hit EOF, wrap
            // around and try again.
            cursor = cm.getSearchCursor(query,
                (prev) ? Pos(cm.lastLine()) : Pos(cm.firstLine(), 0) );
            if (!cursor.find(prev)) {
              return;
            }
          }
        }
        return cursor.from();
      });
    }
    function clearSearchHighlight(cm) {
      var state = getSearchState(cm);
      cm.removeOverlay(getSearchState(cm).getOverlay());
      state.setOverlay(null);
      if (state.getScrollbarAnnotate()) {
        state.getScrollbarAnnotate().clear();
        state.setScrollbarAnnotate(null);
      }
    }
    /**
     * Check if pos is in the specified range, INCLUSIVE.
     * Range can be specified with 1 or 2 arguments.
     * If the first range argument is an array, treat it as an array of line
     * numbers. Match pos against any of the lines.
     * If the first range argument is a number,
     *   if there is only 1 range argument, check if pos has the same line
     *       number
     *   if there are 2 range arguments, then check if pos is in between the two
     *       range arguments.
     */
    function isInRange(pos, start, end) {
      if (typeof pos != 'number') {
        // Assume it is a cursor position. Get the line number.
        pos = pos.line;
      }
      if (start instanceof Array) {
        return inArray(pos, start);
      } else {
        if (end) {
          return (pos >= start && pos <= end);
        } else {
          return pos == start;
        }
      }
    }
    function getUserVisibleLines(cm) {
      var scrollInfo = cm.getScrollInfo();
      var occludeToleranceTop = 6;
      var occludeToleranceBottom = 10;
      var from = cm.coordsChar({left:0, top: occludeToleranceTop + scrollInfo.top}, 'local');
      var bottomY = scrollInfo.clientHeight - occludeToleranceBottom + scrollInfo.top;
      var to = cm.coordsChar({left:0, top: bottomY}, 'local');
      return {top: from.line, bottom: to.line};
    }

    function getMarkPos(cm, vim, markName) {
      if (markName == '\'') {
        var history = cm.doc.history.done;
        var event = history[history.length - 2];
        return event && event.ranges && event.ranges[0].head;
      } else if (markName == '.') {
        if (cm.doc.history.lastModTime == 0) {
          return  // If no changes, bail out; don't bother to copy or reverse history array.
        } else {
          var changeHistory = cm.doc.history.done.filter(function(el){ if (el.changes !== undefined) { return el } });
          changeHistory.reverse();
          var lastEditPos = changeHistory[0].changes[0].to;
        }
        return lastEditPos;
      }

      var mark = vim.marks[markName];
      return mark && mark.find();
    }

    var ExCommandDispatcher = function() {
      this.buildCommandMap_();
    };
    ExCommandDispatcher.prototype = {
      processCommand: function(cm, input, opt_params) {
        var that = this;
        cm.operation(function () {
          cm.curOp.isVimOp = true;
          that._processCommand(cm, input, opt_params);
        });
      },
      _processCommand: function(cm, input, opt_params) {
        var vim = cm.state.vim;
        var commandHistoryRegister = vimGlobalState.registerController.getRegister(':');
        var previousCommand = commandHistoryRegister.toString();
        if (vim.visualMode) {
          exitVisualMode(cm);
        }
        var inputStream = new CodeMirror.StringStream(input);
        // update ": with the latest command whether valid or invalid
        commandHistoryRegister.setText(input);
        var params = opt_params || {};
        params.input = input;
        try {
          this.parseInput_(cm, inputStream, params);
        } catch(e) {
          showConfirm(cm, e);
          throw e;
        }
        var command;
        var commandName;
        if (!params.commandName) {
          // If only a line range is defined, move to the line.
          if (params.line !== undefined) {
            commandName = 'move';
          }
        } else {
          command = this.matchCommand_(params.commandName);
          if (command) {
            commandName = command.name;
            if (command.excludeFromCommandHistory) {
              commandHistoryRegister.setText(previousCommand);
            }
            this.parseCommandArgs_(inputStream, params, command);
            if (command.type == 'exToKey') {
              // Handle Ex to Key mapping.
              for (var i = 0; i < command.toKeys.length; i++) {
                CodeMirror.Vim.handleKey(cm, command.toKeys[i], 'mapping');
              }
              return;
            } else if (command.type == 'exToEx') {
              // Handle Ex to Ex mapping.
              this.processCommand(cm, command.toInput);
              return;
            }
          }
        }
        if (!commandName) {
          showConfirm(cm, 'Not an editor command ":' + input + '"');
          return;
        }
        try {
          exCommands[commandName](cm, params);
          // Possibly asynchronous commands (e.g. substitute, which might have a
          // user confirmation), are responsible for calling the callback when
          // done. All others have it taken care of for them here.
          if ((!command || !command.possiblyAsync) && params.callback) {
            params.callback();
          }
        } catch(e) {
          showConfirm(cm, e);
          throw e;
        }
      },
      parseInput_: function(cm, inputStream, result) {
        inputStream.eatWhile(':');
        // Parse range.
        if (inputStream.eat('%')) {
          result.line = cm.firstLine();
          result.lineEnd = cm.lastLine();
        } else {
          result.line = this.parseLineSpec_(cm, inputStream);
          if (result.line !== undefined && inputStream.eat(',')) {
            result.lineEnd = this.parseLineSpec_(cm, inputStream);
          }
        }

        // Parse command name.
        var commandMatch = inputStream.match(/^(\w+)/);
        if (commandMatch) {
          result.commandName = commandMatch[1];
        } else {
          result.commandName = inputStream.match(/.*/)[0];
        }

        return result;
      },
      parseLineSpec_: function(cm, inputStream) {
        var numberMatch = inputStream.match(/^(\d+)/);
        if (numberMatch) {
          // Absolute line number plus offset (N+M or N-M) is probably a typo,
          // not something the user actually wanted. (NB: vim does allow this.)
          return parseInt(numberMatch[1], 10) - 1;
        }
        switch (inputStream.next()) {
          case '.':
            return this.parseLineSpecOffset_(inputStream, cm.getCursor().line);
          case '$':
            return this.parseLineSpecOffset_(inputStream, cm.lastLine());
          case '\'':
            var markName = inputStream.next();
            var markPos = getMarkPos(cm, cm.state.vim, markName);
            if (!markPos) throw new Error('Mark not set');
            return this.parseLineSpecOffset_(inputStream, markPos.line);
          case '-':
          case '+':
            inputStream.backUp(1);
            // Offset is relative to current line if not otherwise specified.
            return this.parseLineSpecOffset_(inputStream, cm.getCursor().line);
          default:
            inputStream.backUp(1);
            return undefined;
        }
      },
      parseLineSpecOffset_: function(inputStream, line) {
        var offsetMatch = inputStream.match(/^([+-])?(\d+)/);
        if (offsetMatch) {
          var offset = parseInt(offsetMatch[2], 10);
          if (offsetMatch[1] == "-") {
            line -= offset;
          } else {
            line += offset;
          }
        }
        return line;
      },
      parseCommandArgs_: function(inputStream, params, command) {
        if (inputStream.eol()) {
          return;
        }
        params.argString = inputStream.match(/.*/)[0];
        // Parse command-line arguments
        var delim = command.argDelimiter || /\s+/;
        var args = trim(params.argString).split(delim);
        if (args.length && args[0]) {
          params.args = args;
        }
      },
      matchCommand_: function(commandName) {
        // Return the command in the command map that matches the shortest
        // prefix of the passed in command name. The match is guaranteed to be
        // unambiguous if the defaultExCommandMap's shortNames are set up
        // correctly. (see @code{defaultExCommandMap}).
        for (var i = commandName.length; i > 0; i--) {
          var prefix = commandName.substring(0, i);
          if (this.commandMap_[prefix]) {
            var command = this.commandMap_[prefix];
            if (command.name.indexOf(commandName) === 0) {
              return command;
            }
          }
        }
        return null;
      },
      buildCommandMap_: function() {
        this.commandMap_ = {};
        for (var i = 0; i < defaultExCommandMap.length; i++) {
          var command = defaultExCommandMap[i];
          var key = command.shortName || command.name;
          this.commandMap_[key] = command;
        }
      },
      map: function(lhs, rhs, ctx) {
        if (lhs != ':' && lhs.charAt(0) == ':') {
          if (ctx) { throw Error('Mode not supported for ex mappings'); }
          var commandName = lhs.substring(1);
          if (rhs != ':' && rhs.charAt(0) == ':') {
            // Ex to Ex mapping
            this.commandMap_[commandName] = {
              name: commandName,
              type: 'exToEx',
              toInput: rhs.substring(1),
              user: true
            };
          } else {
            // Ex to key mapping
            this.commandMap_[commandName] = {
              name: commandName,
              type: 'exToKey',
              toKeys: rhs,
              user: true
            };
          }
        } else {
          if (rhs != ':' && rhs.charAt(0) == ':') {
            // Key to Ex mapping.
            var mapping = {
              keys: lhs,
              type: 'keyToEx',
              exArgs: { input: rhs.substring(1) }
            };
            if (ctx) { mapping.context = ctx; }
            defaultKeymap.unshift(mapping);
          } else {
            // Key to key mapping
            var mapping = {
              keys: lhs,
              type: 'keyToKey',
              toKeys: rhs
            };
            if (ctx) { mapping.context = ctx; }
            defaultKeymap.unshift(mapping);
          }
        }
      },
      unmap: function(lhs, ctx) {
        if (lhs != ':' && lhs.charAt(0) == ':') {
          // Ex to Ex or Ex to key mapping
          if (ctx) { throw Error('Mode not supported for ex mappings'); }
          var commandName = lhs.substring(1);
          if (this.commandMap_[commandName] && this.commandMap_[commandName].user) {
            delete this.commandMap_[commandName];
            return;
          }
        } else {
          // Key to Ex or key to key mapping
          var keys = lhs;
          for (var i = 0; i < defaultKeymap.length; i++) {
            if (keys == defaultKeymap[i].keys
                && defaultKeymap[i].context === ctx) {
              defaultKeymap.splice(i, 1);
              return;
            }
          }
        }
        throw Error('No such mapping.');
      }
    };

    var exCommands = {
      colorscheme: function(cm, params) {
        if (!params.args || params.args.length < 1) {
          showConfirm(cm, cm.getOption('theme'));
          return;
        }
        cm.setOption('theme', params.args[0]);
      },
      map: function(cm, params, ctx) {
        var mapArgs = params.args;
        if (!mapArgs || mapArgs.length < 2) {
          if (cm) {
            showConfirm(cm, 'Invalid mapping: ' + params.input);
          }
          return;
        }
        exCommandDispatcher.map(mapArgs[0], mapArgs[1], ctx);
      },
      imap: function(cm, params) { this.map(cm, params, 'insert'); },
      nmap: function(cm, params) { this.map(cm, params, 'normal'); },
      vmap: function(cm, params) { this.map(cm, params, 'visual'); },
      unmap: function(cm, params, ctx) {
        var mapArgs = params.args;
        if (!mapArgs || mapArgs.length < 1) {
          if (cm) {
            showConfirm(cm, 'No such mapping: ' + params.input);
          }
          return;
        }
        exCommandDispatcher.unmap(mapArgs[0], ctx);
      },
      move: function(cm, params) {
        commandDispatcher.processCommand(cm, cm.state.vim, {
            type: 'motion',
            motion: 'moveToLineOrEdgeOfDocument',
            motionArgs: { forward: false, explicitRepeat: true,
              linewise: true },
            repeatOverride: params.line+1});
      },
      set: function(cm, params) {
        var setArgs = params.args;
        // Options passed through to the setOption/getOption calls. May be passed in by the
        // local/global versions of the set command
        var setCfg = params.setCfg || {};
        if (!setArgs || setArgs.length < 1) {
          if (cm) {
            showConfirm(cm, 'Invalid mapping: ' + params.input);
          }
          return;
        }
        var expr = setArgs[0].split('=');
        var optionName = expr[0];
        var value = expr[1];
        var forceGet = false;

        if (optionName.charAt(optionName.length - 1) == '?') {
          // If post-fixed with ?, then the set is actually a get.
          if (value) { throw Error('Trailing characters: ' + params.argString); }
          optionName = optionName.substring(0, optionName.length - 1);
          forceGet = true;
        }
        if (value === undefined && optionName.substring(0, 2) == 'no') {
          // To set boolean options to false, the option name is prefixed with
          // 'no'.
          optionName = optionName.substring(2);
          value = false;
        }

        var optionIsBoolean = options[optionName] && options[optionName].type == 'boolean';
        if (optionIsBoolean && value == undefined) {
          // Calling set with a boolean option sets it to true.
          value = true;
        }
        // If no value is provided, then we assume this is a get.
        if (!optionIsBoolean && value === undefined || forceGet) {
          var oldValue = getOption(optionName, cm, setCfg);
          if (oldValue instanceof Error) {
            showConfirm(cm, oldValue.message);
          } else if (oldValue === true || oldValue === false) {
            showConfirm(cm, ' ' + (oldValue ? '' : 'no') + optionName);
          } else {
            showConfirm(cm, '  ' + optionName + '=' + oldValue);
          }
        } else {
          var setOptionReturn = setOption(optionName, value, cm, setCfg);
          if (setOptionReturn instanceof Error) {
            showConfirm(cm, setOptionReturn.message);
          }
        }
      },
      setlocal: function (cm, params) {
        // setCfg is passed through to setOption
        params.setCfg = {scope: 'local'};
        this.set(cm, params);
      },
      setglobal: function (cm, params) {
        // setCfg is passed through to setOption
        params.setCfg = {scope: 'global'};
        this.set(cm, params);
      },
      registers: function(cm, params) {
        var regArgs = params.args;
        var registers = vimGlobalState.registerController.registers;
        var regInfo = '----------Registers----------<br><br>';
        if (!regArgs) {
          for (var registerName in registers) {
            var text = registers[registerName].toString();
            if (text.length) {
              regInfo += '"' + registerName + '    ' + text + '<br>';
            }
          }
        } else {
          var registerName;
          regArgs = regArgs.join('');
          for (var i = 0; i < regArgs.length; i++) {
            registerName = regArgs.charAt(i);
            if (!vimGlobalState.registerController.isValidRegister(registerName)) {
              continue;
            }
            var register = registers[registerName] || new Register();
            regInfo += '"' + registerName + '    ' + register.toString() + '<br>';
          }
        }
        showConfirm(cm, regInfo);
      },
      sort: function(cm, params) {
        var reverse, ignoreCase, unique, number, pattern;
        function parseArgs() {
          if (params.argString) {
            var args = new CodeMirror.StringStream(params.argString);
            if (args.eat('!')) { reverse = true; }
            if (args.eol()) { return; }
            if (!args.eatSpace()) { return 'Invalid arguments'; }
            var opts = args.match(/([dinuox]+)?\s*(\/.+\/)?\s*/);
            if (!opts && !args.eol()) { return 'Invalid arguments'; }
            if (opts[1]) {
              ignoreCase = opts[1].indexOf('i') != -1;
              unique = opts[1].indexOf('u') != -1;
              var decimal = opts[1].indexOf('d') != -1 || opts[1].indexOf('n') != -1 && 1;
              var hex = opts[1].indexOf('x') != -1 && 1;
              var octal = opts[1].indexOf('o') != -1 && 1;
              if (decimal + hex + octal > 1) { return 'Invalid arguments'; }
              number = decimal && 'decimal' || hex && 'hex' || octal && 'octal';
            }
            if (opts[2]) {
              pattern = new RegExp(opts[2].substr(1, opts[2].length - 2), ignoreCase ? 'i' : '');
            }
          }
        }
        var err = parseArgs();
        if (err) {
          showConfirm(cm, err + ': ' + params.argString);
          return;
        }
        var lineStart = params.line || cm.firstLine();
        var lineEnd = params.lineEnd || params.line || cm.lastLine();
        if (lineStart == lineEnd) { return; }
        var curStart = Pos(lineStart, 0);
        var curEnd = Pos(lineEnd, lineLength(cm, lineEnd));
        var text = cm.getRange(curStart, curEnd).split('\n');
        var numberRegex = pattern ? pattern :
           (number == 'decimal') ? /(-?)([\d]+)/ :
           (number == 'hex') ? /(-?)(?:0x)?([0-9a-f]+)/i :
           (number == 'octal') ? /([0-7]+)/ : null;
        var radix = (number == 'decimal') ? 10 : (number == 'hex') ? 16 : (number == 'octal') ? 8 : null;
        var numPart = [], textPart = [];
        if (number || pattern) {
          for (var i = 0; i < text.length; i++) {
            var matchPart = pattern ? text[i].match(pattern) : null;
            if (matchPart && matchPart[0] != '') {
              numPart.push(matchPart);
            } else if (!pattern && numberRegex.exec(text[i])) {
              numPart.push(text[i]);
            } else {
              textPart.push(text[i]);
            }
          }
        } else {
          textPart = text;
        }
        function compareFn(a, b) {
          if (reverse) { var tmp; tmp = a; a = b; b = tmp; }
          if (ignoreCase) { a = a.toLowerCase(); b = b.toLowerCase(); }
          var anum = number && numberRegex.exec(a);
          var bnum = number && numberRegex.exec(b);
          if (!anum) { return a < b ? -1 : 1; }
          anum = parseInt((anum[1] + anum[2]).toLowerCase(), radix);
          bnum = parseInt((bnum[1] + bnum[2]).toLowerCase(), radix);
          return anum - bnum;
        }
        function comparePatternFn(a, b) {
          if (reverse) { var tmp; tmp = a; a = b; b = tmp; }
          if (ignoreCase) { a[0] = a[0].toLowerCase(); b[0] = b[0].toLowerCase(); }
          return (a[0] < b[0]) ? -1 : 1;
        }
        numPart.sort(pattern ? comparePatternFn : compareFn);
        if (pattern) {
          for (var i = 0; i < numPart.length; i++) {
            numPart[i] = numPart[i].input;
          }
        } else if (!number) { textPart.sort(compareFn); }
        text = (!reverse) ? textPart.concat(numPart) : numPart.concat(textPart);
        if (unique) { // Remove duplicate lines
          var textOld = text;
          var lastLine;
          text = [];
          for (var i = 0; i < textOld.length; i++) {
            if (textOld[i] != lastLine) {
              text.push(textOld[i]);
            }
            lastLine = textOld[i];
          }
        }
        cm.replaceRange(text.join('\n'), curStart, curEnd);
      },
      global: function(cm, params) {
        // a global command is of the form
        // :[range]g/pattern/[cmd]
        // argString holds the string /pattern/[cmd]
        var argString = params.argString;
        if (!argString) {
          showConfirm(cm, 'Regular Expression missing from global');
          return;
        }
        // range is specified here
        var lineStart = (params.line !== undefined) ? params.line : cm.firstLine();
        var lineEnd = params.lineEnd || params.line || cm.lastLine();
        // get the tokens from argString
        var tokens = splitBySlash(argString);
        var regexPart = argString, cmd;
        if (tokens.length) {
          regexPart = tokens[0];
          cmd = tokens.slice(1, tokens.length).join('/');
        }
        if (regexPart) {
          // If regex part is empty, then use the previous query. Otherwise
          // use the regex part as the new query.
          try {
           updateSearchQuery(cm, regexPart, true /** ignoreCase */,
             true /** smartCase */);
          } catch (e) {
           showConfirm(cm, 'Invalid regex: ' + regexPart);
           return;
          }
        }
        // now that we have the regexPart, search for regex matches in the
        // specified range of lines
        var query = getSearchState(cm).getQuery();
        var matchedLines = [], content = '';
        for (var i = lineStart; i <= lineEnd; i++) {
          var matched = query.test(cm.getLine(i));
          if (matched) {
            matchedLines.push(i+1);
            content+= cm.getLine(i) + '<br>';
          }
        }
        // if there is no [cmd], just display the list of matched lines
        if (!cmd) {
          showConfirm(cm, content);
          return;
        }
        var index = 0;
        var nextCommand = function() {
          if (index < matchedLines.length) {
            var command = matchedLines[index] + cmd;
            exCommandDispatcher.processCommand(cm, command, {
              callback: nextCommand
            });
          }
          index++;
        };
        nextCommand();
      },
      substitute: function(cm, params) {
        if (!cm.getSearchCursor) {
          throw new Error('Search feature not available. Requires searchcursor.js or ' +
              'any other getSearchCursor implementation.');
        }
        var argString = params.argString;
        var tokens = argString ? splitBySeparator(argString, argString[0]) : [];
        var regexPart, replacePart = '', trailing, flagsPart, count;
        var confirm = false; // Whether to confirm each replace.
        var global = false; // True to replace all instances on a line, false to replace only 1.
        if (tokens.length) {
          regexPart = tokens[0];
          replacePart = tokens[1];
          if (regexPart && regexPart[regexPart.length - 1] === '$') {
            regexPart = regexPart.slice(0, regexPart.length - 1) + '\\n';
            replacePart = replacePart ? replacePart + '\n' : '\n';
          }
          if (replacePart !== undefined) {
            if (getOption('pcre')) {
              replacePart = unescapeRegexReplace(replacePart);
            } else {
              replacePart = translateRegexReplace(replacePart);
            }
            vimGlobalState.lastSubstituteReplacePart = replacePart;
          }
          trailing = tokens[2] ? tokens[2].split(' ') : [];
        } else {
          // either the argString is empty or its of the form ' hello/world'
          // actually splitBySlash returns a list of tokens
          // only if the string starts with a '/'
          if (argString && argString.length) {
            showConfirm(cm, 'Substitutions should be of the form ' +
                ':s/pattern/replace/');
            return;
          }
        }
        // After the 3rd slash, we can have flags followed by a space followed
        // by count.
        if (trailing) {
          flagsPart = trailing[0];
          count = parseInt(trailing[1]);
          if (flagsPart) {
            if (flagsPart.indexOf('c') != -1) {
              confirm = true;
              flagsPart.replace('c', '');
            }
            if (flagsPart.indexOf('g') != -1) {
              global = true;
              flagsPart.replace('g', '');
            }
            regexPart = regexPart.replace(/\//g, "\\/") + '/' + flagsPart;
          }
        }
        if (regexPart) {
          // If regex part is empty, then use the previous query. Otherwise use
          // the regex part as the new query.
          try {
            updateSearchQuery(cm, regexPart, true /** ignoreCase */,
              true /** smartCase */);
          } catch (e) {
            showConfirm(cm, 'Invalid regex: ' + regexPart);
            return;
          }
        }
        replacePart = replacePart || vimGlobalState.lastSubstituteReplacePart;
        if (replacePart === undefined) {
          showConfirm(cm, 'No previous substitute regular expression');
          return;
        }
        var state = getSearchState(cm);
        var query = state.getQuery();
        var lineStart = (params.line !== undefined) ? params.line : cm.getCursor().line;
        var lineEnd = params.lineEnd || lineStart;
        if (lineStart == cm.firstLine() && lineEnd == cm.lastLine()) {
          lineEnd = Infinity;
        }
        if (count) {
          lineStart = lineEnd;
          lineEnd = lineStart + count - 1;
        }
        var startPos = clipCursorToContent(cm, Pos(lineStart, 0));
        var cursor = cm.getSearchCursor(query, startPos);
        doReplace(cm, confirm, global, lineStart, lineEnd, cursor, query, replacePart, params.callback);
      },
      redo: CodeMirror.commands.redo,
      undo: CodeMirror.commands.undo,
      write: function(cm) {
        if (CodeMirror.commands.save) {
          // If a save command is defined, call it.
          CodeMirror.commands.save(cm);
        } else if (cm.save) {
          // Saves to text area if no save command is defined and cm.save() is available.
          cm.save();
        }
      },
      nohlsearch: function(cm) {
        clearSearchHighlight(cm);
      },
      yank: function (cm) {
        var cur = copyCursor(cm.getCursor());
        var line = cur.line;
        var lineText = cm.getLine(line);
        vimGlobalState.registerController.pushText(
          '0', 'yank', lineText, true, true);
      },
      delmarks: function(cm, params) {
        if (!params.argString || !trim(params.argString)) {
          showConfirm(cm, 'Argument required');
          return;
        }

        var state = cm.state.vim;
        var stream = new CodeMirror.StringStream(trim(params.argString));
        while (!stream.eol()) {
          stream.eatSpace();

          // Record the streams position at the beginning of the loop for use
          // in error messages.
          var count = stream.pos;

          if (!stream.match(/[a-zA-Z]/, false)) {
            showConfirm(cm, 'Invalid argument: ' + params.argString.substring(count));
            return;
          }

          var sym = stream.next();
          // Check if this symbol is part of a range
          if (stream.match('-', true)) {
            // This symbol is part of a range.

            // The range must terminate at an alphabetic character.
            if (!stream.match(/[a-zA-Z]/, false)) {
              showConfirm(cm, 'Invalid argument: ' + params.argString.substring(count));
              return;
            }

            var startMark = sym;
            var finishMark = stream.next();
            // The range must terminate at an alphabetic character which
            // shares the same case as the start of the range.
            if (isLowerCase(startMark) && isLowerCase(finishMark) ||
                isUpperCase(startMark) && isUpperCase(finishMark)) {
              var start = startMark.charCodeAt(0);
              var finish = finishMark.charCodeAt(0);
              if (start >= finish) {
                showConfirm(cm, 'Invalid argument: ' + params.argString.substring(count));
                return;
              }

              // Because marks are always ASCII values, and we have
              // determined that they are the same case, we can use
              // their char codes to iterate through the defined range.
              for (var j = 0; j <= finish - start; j++) {
                var mark = String.fromCharCode(start + j);
                delete state.marks[mark];
              }
            } else {
              showConfirm(cm, 'Invalid argument: ' + startMark + '-');
              return;
            }
          } else {
            // This symbol is a valid mark, and is not part of a range.
            delete state.marks[sym];
          }
        }
      }
    };

    var exCommandDispatcher = new ExCommandDispatcher();

    /**
    * @param {CodeMirror} cm CodeMirror instance we are in.
    * @param {boolean} confirm Whether to confirm each replace.
    * @param {Cursor} lineStart Line to start replacing from.
    * @param {Cursor} lineEnd Line to stop replacing at.
    * @param {RegExp} query Query for performing matches with.
    * @param {string} replaceWith Text to replace matches with. May contain $1,
    *     $2, etc for replacing captured groups using Javascript replace.
    * @param {function()} callback A callback for when the replace is done.
    */
    function doReplace(cm, confirm, global, lineStart, lineEnd, searchCursor, query,
        replaceWith, callback) {
      // Set up all the functions.
      cm.state.vim.exMode = true;
      var done = false;
      var lastPos = searchCursor.from();
      function replaceAll() {
        cm.operation(function() {
          while (!done) {
            replace();
            next();
          }
          stop();
        });
      }
      function replace() {
        var text = cm.getRange(searchCursor.from(), searchCursor.to());
        var newText = text.replace(query, replaceWith);
        searchCursor.replace(newText);
      }
      function next() {
        // The below only loops to skip over multiple occurrences on the same
        // line when 'global' is not true.
        while(searchCursor.findNext() &&
              isInRange(searchCursor.from(), lineStart, lineEnd)) {
          if (!global && lastPos && searchCursor.from().line == lastPos.line) {
            continue;
          }
          cm.scrollIntoView(searchCursor.from(), 30);
          cm.setSelection(searchCursor.from(), searchCursor.to());
          lastPos = searchCursor.from();
          done = false;
          return;
        }
        done = true;
      }
      function stop(close) {
        if (close) { close(); }
        cm.focus();
        if (lastPos) {
          cm.setCursor(lastPos);
          var vim = cm.state.vim;
          vim.exMode = false;
          vim.lastHPos = vim.lastHSPos = lastPos.ch;
        }
        if (callback) { callback(); }
      }
      function onPromptKeyDown(e, _value, close) {
        // Swallow all keys.
        CodeMirror.e_stop(e);
        var keyName = CodeMirror.keyName(e);
        switch (keyName) {
          case 'Y':
            replace(); next(); break;
          case 'N':
            next(); break;
          case 'A':
            // replaceAll contains a call to close of its own. We don't want it
            // to fire too early or multiple times.
            var savedCallback = callback;
            callback = undefined;
            cm.operation(replaceAll);
            callback = savedCallback;
            break;
          case 'L':
            replace();
            // fall through and exit.
          case 'Q':
          case 'Esc':
          case 'Ctrl-C':
          case 'Ctrl-[':
            stop(close);
            break;
        }
        if (done) { stop(close); }
        return true;
      }

      // Actually do replace.
      next();
      if (done) {
        showConfirm(cm, 'No matches for ' + query.source);
        return;
      }
      if (!confirm) {
        replaceAll();
        if (callback) { callback(); }
        return;
      }
      showPrompt(cm, {
        prefix: 'replace with <strong>' + replaceWith + '</strong> (y/n/a/q/l)',
        onKeyDown: onPromptKeyDown
      });
    }

    CodeMirror.keyMap.vim = {
      attach: attachVimMap,
      detach: detachVimMap,
      call: cmKey
    };

    function exitInsertMode(cm) {
      var vim = cm.state.vim;
      var macroModeState = vimGlobalState.macroModeState;
      var insertModeChangeRegister = vimGlobalState.registerController.getRegister('.');
      var isPlaying = macroModeState.isPlaying;
      var lastChange = macroModeState.lastInsertModeChanges;
      if (!isPlaying) {
        cm.off('change', onChange);
        CodeMirror.off(cm.getInputField(), 'keydown', onKeyEventTargetKeyDown);
      }
      if (!isPlaying && vim.insertModeRepeat > 1) {
        // Perform insert mode repeat for commands like 3,a and 3,o.
        repeatLastEdit(cm, vim, vim.insertModeRepeat - 1,
            true /** repeatForInsert */);
        vim.lastEditInputState.repeatOverride = vim.insertModeRepeat;
      }
      delete vim.insertModeRepeat;
      vim.insertMode = false;
      cm.setCursor(cm.getCursor().line, cm.getCursor().ch-1);
      cm.setOption('keyMap', 'vim');
      cm.setOption('disableInput', true);
      cm.toggleOverwrite(false); // exit replace mode if we were in it.
      // update the ". register before exiting insert mode
      insertModeChangeRegister.setText(lastChange.changes.join(''));
      CodeMirror.signal(cm, "vim-mode-change", {mode: "normal"});
      if (macroModeState.isRecording) {
        logInsertModeChange(macroModeState);
      }
    }

    function _mapCommand(command) {
      defaultKeymap.unshift(command);
    }

    function mapCommand(keys, type, name, args, extra) {
      var command = {keys: keys, type: type};
      command[type] = name;
      command[type + "Args"] = args;
      for (var key in extra)
        command[key] = extra[key];
      _mapCommand(command);
    }

    // The timeout in milliseconds for the two-character ESC keymap should be
    // adjusted according to your typing speed to prevent false positives.
    defineOption('insertModeEscKeysTimeout', 200, 'number');

    CodeMirror.keyMap['vim-insert'] = {
      // TODO: override navigation keys so that Esc will cancel automatic
      // indentation from o, O, i_<CR>
      fallthrough: ['default'],
      attach: attachVimMap,
      detach: detachVimMap,
      call: cmKey
    };

    CodeMirror.keyMap['vim-replace'] = {
      'Backspace': 'goCharLeft',
      fallthrough: ['vim-insert'],
      attach: attachVimMap,
      detach: detachVimMap,
      call: cmKey
    };

    function executeMacroRegister(cm, vim, macroModeState, registerName) {
      var register = vimGlobalState.registerController.getRegister(registerName);
      if (registerName == ':') {
        // Read-only register containing last Ex command.
        if (register.keyBuffer[0]) {
          exCommandDispatcher.processCommand(cm, register.keyBuffer[0]);
        }
        macroModeState.isPlaying = false;
        return;
      }
      var keyBuffer = register.keyBuffer;
      var imc = 0;
      macroModeState.isPlaying = true;
      macroModeState.replaySearchQueries = register.searchQueries.slice(0);
      for (var i = 0; i < keyBuffer.length; i++) {
        var text = keyBuffer[i];
        var match, key;
        while (text) {
          // Pull off one command key, which is either a single character
          // or a special sequence wrapped in '<' and '>', e.g. '<Space>'.
          match = (/<\w+-.+?>|<\w+>|./).exec(text);
          key = match[0];
          text = text.substring(match.index + key.length);
          CodeMirror.Vim.handleKey(cm, key, 'macro');
          if (vim.insertMode) {
            var changes = register.insertModeChanges[imc++].changes;
            vimGlobalState.macroModeState.lastInsertModeChanges.changes =
                changes;
            repeatInsertModeChanges(cm, changes, 1);
            exitInsertMode(cm);
          }
        }
      }
      macroModeState.isPlaying = false;
    }

    function logKey(macroModeState, key) {
      if (macroModeState.isPlaying) { return; }
      var registerName = macroModeState.latestRegister;
      var register = vimGlobalState.registerController.getRegister(registerName);
      if (register) {
        register.pushText(key);
      }
    }

    function logInsertModeChange(macroModeState) {
      if (macroModeState.isPlaying) { return; }
      var registerName = macroModeState.latestRegister;
      var register = vimGlobalState.registerController.getRegister(registerName);
      if (register && register.pushInsertModeChanges) {
        register.pushInsertModeChanges(macroModeState.lastInsertModeChanges);
      }
    }

    function logSearchQuery(macroModeState, query) {
      if (macroModeState.isPlaying) { return; }
      var registerName = macroModeState.latestRegister;
      var register = vimGlobalState.registerController.getRegister(registerName);
      if (register && register.pushSearchQuery) {
        register.pushSearchQuery(query);
      }
    }

    /**
     * Listens for changes made in insert mode.
     * Should only be active in insert mode.
     */
    function onChange(cm, changeObj) {
      var macroModeState = vimGlobalState.macroModeState;
      var lastChange = macroModeState.lastInsertModeChanges;
      if (!macroModeState.isPlaying) {
        while(changeObj) {
          lastChange.expectCursorActivityForChange = true;
          if (lastChange.ignoreCount > 1) {
            lastChange.ignoreCount--;
          } else if (changeObj.origin == '+input' || changeObj.origin == 'paste'
              || changeObj.origin === undefined /* only in testing */) {
            var selectionCount = cm.listSelections().length;
            if (selectionCount > 1)
              lastChange.ignoreCount = selectionCount;
            var text = changeObj.text.join('\n');
            if (lastChange.maybeReset) {
              lastChange.changes = [];
              lastChange.maybeReset = false;
            }
            if (text) {
              if (cm.state.overwrite && !/\n/.test(text)) {
                lastChange.changes.push([text]);
              } else {
                lastChange.changes.push(text);
              }
            }
          }
          // Change objects may be chained with next.
          changeObj = changeObj.next;
        }
      }
    }

    /**
    * Listens for any kind of cursor activity on CodeMirror.
    */
    function onCursorActivity(cm) {
      var vim = cm.state.vim;
      if (vim.insertMode) {
        // Tracking cursor activity in insert mode (for macro support).
        var macroModeState = vimGlobalState.macroModeState;
        if (macroModeState.isPlaying) { return; }
        var lastChange = macroModeState.lastInsertModeChanges;
        if (lastChange.expectCursorActivityForChange) {
          lastChange.expectCursorActivityForChange = false;
        } else {
          // Cursor moved outside the context of an edit. Reset the change.
          lastChange.maybeReset = true;
        }
      } else if (!cm.curOp.isVimOp) {
        handleExternalSelection(cm, vim);
      }
      if (vim.visualMode) {
        updateFakeCursor(cm);
      }
    }
    function updateFakeCursor(cm) {
      var vim = cm.state.vim;
      var from = clipCursorToContent(cm, copyCursor(vim.sel.head));
      var to = offsetCursor(from, 0, 1);
      if (vim.fakeCursor) {
        vim.fakeCursor.clear();
      }
      vim.fakeCursor = cm.markText(from, to, {className: 'cm-animate-fat-cursor'});
    }
    function handleExternalSelection(cm, vim) {
      var anchor = cm.getCursor('anchor');
      var head = cm.getCursor('head');
      // Enter or exit visual mode to match mouse selection.
      if (vim.visualMode && !cm.somethingSelected()) {
        exitVisualMode(cm, false);
      } else if (!vim.visualMode && !vim.insertMode && cm.somethingSelected()) {
        vim.visualMode = true;
        vim.visualLine = false;
        CodeMirror.signal(cm, "vim-mode-change", {mode: "visual"});
      }
      if (vim.visualMode) {
        // Bind CodeMirror selection model to vim selection model.
        // Mouse selections are considered visual characterwise.
        var headOffset = !cursorIsBefore(head, anchor) ? -1 : 0;
        var anchorOffset = cursorIsBefore(head, anchor) ? -1 : 0;
        head = offsetCursor(head, 0, headOffset);
        anchor = offsetCursor(anchor, 0, anchorOffset);
        vim.sel = {
          anchor: anchor,
          head: head
        };
        updateMark(cm, vim, '<', cursorMin(head, anchor));
        updateMark(cm, vim, '>', cursorMax(head, anchor));
      } else if (!vim.insertMode) {
        // Reset lastHPos if selection was modified by something outside of vim mode e.g. by mouse.
        vim.lastHPos = cm.getCursor().ch;
      }
    }

    /** Wrapper for special keys pressed in insert mode */
    function InsertModeKey(keyName) {
      this.keyName = keyName;
    }

    /**
    * Handles raw key down events from the text area.
    * - Should only be active in insert mode.
    * - For recording deletes in insert mode.
    */
    function onKeyEventTargetKeyDown(e) {
      var macroModeState = vimGlobalState.macroModeState;
      var lastChange = macroModeState.lastInsertModeChanges;
      var keyName = CodeMirror.keyName(e);
      if (!keyName) { return; }
      function onKeyFound() {
        if (lastChange.maybeReset) {
          lastChange.changes = [];
          lastChange.maybeReset = false;
        }
        lastChange.changes.push(new InsertModeKey(keyName));
        return true;
      }
      if (keyName.indexOf('Delete') != -1 || keyName.indexOf('Backspace') != -1) {
        CodeMirror.lookupKey(keyName, 'vim-insert', onKeyFound);
      }
    }

    /**
     * Repeats the last edit, which includes exactly 1 command and at most 1
     * insert. Operator and motion commands are read from lastEditInputState,
     * while action commands are read from lastEditActionCommand.
     *
     * If repeatForInsert is true, then the function was called by
     * exitInsertMode to repeat the insert mode changes the user just made. The
     * corresponding enterInsertMode call was made with a count.
     */
    function repeatLastEdit(cm, vim, repeat, repeatForInsert) {
      var macroModeState = vimGlobalState.macroModeState;
      macroModeState.isPlaying = true;
      var isAction = !!vim.lastEditActionCommand;
      var cachedInputState = vim.inputState;
      function repeatCommand() {
        if (isAction) {
          commandDispatcher.processAction(cm, vim, vim.lastEditActionCommand);
        } else {
          commandDispatcher.evalInput(cm, vim);
        }
      }
      function repeatInsert(repeat) {
        if (macroModeState.lastInsertModeChanges.changes.length > 0) {
          // For some reason, repeat cw in desktop VIM does not repeat
          // insert mode changes. Will conform to that behavior.
          repeat = !vim.lastEditActionCommand ? 1 : repeat;
          var changeObject = macroModeState.lastInsertModeChanges;
          repeatInsertModeChanges(cm, changeObject.changes, repeat);
        }
      }
      vim.inputState = vim.lastEditInputState;
      if (isAction && vim.lastEditActionCommand.interlaceInsertRepeat) {
        // o and O repeat have to be interlaced with insert repeats so that the
        // insertions appear on separate lines instead of the last line.
        for (var i = 0; i < repeat; i++) {
          repeatCommand();
          repeatInsert(1);
        }
      } else {
        if (!repeatForInsert) {
          // Hack to get the cursor to end up at the right place. If I is
          // repeated in insert mode repeat, cursor will be 1 insert
          // change set left of where it should be.
          repeatCommand();
        }
        repeatInsert(repeat);
      }
      vim.inputState = cachedInputState;
      if (vim.insertMode && !repeatForInsert) {
        // Don't exit insert mode twice. If repeatForInsert is set, then we
        // were called by an exitInsertMode call lower on the stack.
        exitInsertMode(cm);
      }
      macroModeState.isPlaying = false;
    }

    function repeatInsertModeChanges(cm, changes, repeat) {
      function keyHandler(binding) {
        if (typeof binding == 'string') {
          CodeMirror.commands[binding](cm);
        } else {
          binding(cm);
        }
        return true;
      }
      var head = cm.getCursor('head');
      var visualBlock = vimGlobalState.macroModeState.lastInsertModeChanges.visualBlock;
      if (visualBlock) {
        // Set up block selection again for repeating the changes.
        selectForInsert(cm, head, visualBlock + 1);
        repeat = cm.listSelections().length;
        cm.setCursor(head);
      }
      for (var i = 0; i < repeat; i++) {
        if (visualBlock) {
          cm.setCursor(offsetCursor(head, i, 0));
        }
        for (var j = 0; j < changes.length; j++) {
          var change = changes[j];
          if (change instanceof InsertModeKey) {
            CodeMirror.lookupKey(change.keyName, 'vim-insert', keyHandler);
          } else if (typeof change == "string") {
            var cur = cm.getCursor();
            cm.replaceRange(change, cur, cur);
          } else {
            var start = cm.getCursor();
            var end = offsetCursor(start, 0, change[0].length);
            cm.replaceRange(change[0], start, end);
          }
        }
      }
      if (visualBlock) {
        cm.setCursor(offsetCursor(head, 0, 1));
      }
    }

    resetVimGlobalState();
    return vimApi;
  };
  // Initialize Vim and make it available as an API.
  CodeMirror.Vim = Vim();
});


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29kZW1pcnJvci9rZXltYXAvdmltLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUVBQXFFLEdBQUc7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQU0sSUFBdUQ7QUFDN0QsUUFBUSxtQkFBTyxDQUFDLCtCQUFtQixHQUFHLG1CQUFPLENBQUMsMENBQThCLEdBQUcsbUJBQU8sQ0FBQyxvQ0FBd0IsR0FBRyxtQkFBTyxDQUFDLDRDQUFnQztBQUMxSixPQUFPLEVBR2E7QUFDcEIsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUssZ0RBQWdEO0FBQ3JELEtBQUssaURBQWlEO0FBQ3RELEtBQUssOENBQThDO0FBQ25ELEtBQUssZ0RBQWdEO0FBQ3JELEtBQUssaURBQWlEO0FBQ3RELEtBQUssZ0VBQWdFO0FBQ3JFLEtBQUssaUVBQWlFO0FBQ3RFLEtBQUssbURBQW1EO0FBQ3hELEtBQUssbUVBQW1FO0FBQ3hFLEtBQUssbURBQW1EO0FBQ3hELEtBQUssbUVBQW1FO0FBQ3hFLEtBQUssK0NBQStDO0FBQ3BELEtBQUssK0NBQStDO0FBQ3BELEtBQUssbURBQW1EO0FBQ3hELEtBQUssbURBQW1EO0FBQ3hELEtBQUssc0VBQXNFO0FBQzNFLEtBQUssc0VBQXNFO0FBQzNFLEtBQUssK0RBQStEO0FBQ3BFLEtBQUssNkRBQTZEO0FBQ2xFLEtBQUssK0RBQStEO0FBQ3BFLEtBQUssZ0VBQWdFO0FBQ3JFLEtBQUssZ0RBQWdEO0FBQ3JELEtBQUssK0NBQStDO0FBQ3BELEtBQUssc0RBQXNE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UDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsdUJBQXVCLFFBQVE7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsd0NBQXdDO0FBQ2pGO0FBQ0EseUJBQXlCLHFCQUFxQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEIsU0FBUztBQUNULGtCQUFrQjtBQUNsQjs7QUFFQTtBQUNBLHVCQUF1Qix5QkFBeUI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQixPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSw0QkFBNEI7QUFDNUIscUVBQXFFO0FBQ3JFLFdBQVc7QUFDWCw0QkFBNEI7QUFDNUIsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixtQkFBbUI7QUFDbEQ7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsdUNBQXVDLFFBQVE7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0IsT0FBTyx1QkFBdUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsNEVBQTRFO0FBQ3BIO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsdUJBQXVCLHVCQUF1QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFD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O0FBQ0E7QUFDQTtBQUNBLCtCQUErQixjQUFjO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QiwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIscUJBQXFCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsY0FBYyxXQUFXO0FBQ3pCLGNBQWMsUUFBUTtBQUN0QixjQUFjLE9BQU87QUFDckIsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsT0FBTztBQUNyQixjQUFjLE9BQU87QUFDckI7QUFDQSxjQUFjLFdBQVc7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFNBQVM7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsWUFBWTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixRQUFRO0FBQzlCO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixhQUFhO0FBQ2hDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixZQUFZO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEM7QUFDQTtBQUNBLGdEQUFnRCxlQUFlO0FBQy9EO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixzQkFBc0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFDQUFxQyxRQUFRO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFDQUFxQyxRQUFRO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFDQUFxQyxRQUFRO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLFFBQVE7QUFDL0M7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QyxtQ0FBbUM7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLGtEQUFrRCxlQUFlO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLFFBQVE7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsWUFBWTtBQUNuQztBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLFlBQVk7QUFDakM7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLG9CQUFvQjtBQUMzQztBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsImZpbGUiOiIzLjJlMjY4MmNhMjFlMjA4ZjI1NjdiLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29kZU1pcnJvciwgY29weXJpZ2h0IChjKSBieSBNYXJpam4gSGF2ZXJiZWtlIGFuZCBvdGhlcnNcbi8vIERpc3RyaWJ1dGVkIHVuZGVyIGFuIE1JVCBsaWNlbnNlOiBodHRwczovL2NvZGVtaXJyb3IubmV0L0xJQ0VOU0VcblxuLyoqXG4gKiBTdXBwb3J0ZWQga2V5YmluZGluZ3M6XG4gKiAgIFRvbyBtYW55IHRvIGxpc3QuIFJlZmVyIHRvIGRlZmF1bHRLZXltYXAgYmVsb3cuXG4gKlxuICogU3VwcG9ydGVkIEV4IGNvbW1hbmRzOlxuICogICBSZWZlciB0byBkZWZhdWx0RXhDb21tYW5kTWFwIGJlbG93LlxuICpcbiAqIFJlZ2lzdGVyczogdW5uYW1lZCwgLSwgYS16LCBBLVosIDAtOVxuICogICAoRG9lcyBub3QgcmVzcGVjdCB0aGUgc3BlY2lhbCBjYXNlIGZvciBudW1iZXIgcmVnaXN0ZXJzIHdoZW4gZGVsZXRlXG4gKiAgICBvcGVyYXRvciBpcyBtYWRlIHdpdGggdGhlc2UgY29tbWFuZHM6ICUsICgsICksICAsIC8sID8sIG4sIE4sIHssIH0gKVxuICogICBUT0RPOiBJbXBsZW1lbnQgdGhlIHJlbWFpbmluZyByZWdpc3RlcnMuXG4gKlxuICogTWFya3M6IGEteiwgQS1aLCBhbmQgMC05XG4gKiAgIFRPRE86IEltcGxlbWVudCB0aGUgcmVtYWluaW5nIHNwZWNpYWwgbWFya3MuIFRoZXkgaGF2ZSBtb3JlIGNvbXBsZXhcbiAqICAgICAgIGJlaGF2aW9yLlxuICpcbiAqIEV2ZW50czpcbiAqICAndmltLW1vZGUtY2hhbmdlJyAtIHJhaXNlZCBvbiB0aGUgZWRpdG9yIGFueXRpbWUgdGhlIGN1cnJlbnQgbW9kZSBjaGFuZ2VzLFxuICogICAgICAgICAgICAgICAgICAgICAgRXZlbnQgb2JqZWN0OiB7bW9kZTogXCJ2aXN1YWxcIiwgc3ViTW9kZTogXCJsaW5ld2lzZVwifVxuICpcbiAqIENvZGUgc3RydWN0dXJlOlxuICogIDEuIERlZmF1bHQga2V5bWFwXG4gKiAgMi4gVmFyaWFibGUgZGVjbGFyYXRpb25zIGFuZCBzaG9ydCBiYXNpYyBoZWxwZXJzXG4gKiAgMy4gSW5zdGFuY2UgKEV4dGVybmFsIEFQSSkgaW1wbGVtZW50YXRpb25cbiAqICA0LiBJbnRlcm5hbCBzdGF0ZSB0cmFja2luZyBvYmplY3RzIChpbnB1dCBzdGF0ZSwgY291bnRlcikgaW1wbGVtZW50YXRpb25cbiAqICAgICBhbmQgaW5zdGFudGlhdGlvblxuICogIDUuIEtleSBoYW5kbGVyICh0aGUgbWFpbiBjb21tYW5kIGRpc3BhdGNoZXIpIGltcGxlbWVudGF0aW9uXG4gKiAgNi4gTW90aW9uLCBvcGVyYXRvciwgYW5kIGFjdGlvbiBpbXBsZW1lbnRhdGlvbnNcbiAqICA3LiBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUga2V5IGhhbmRsZXIsIG1vdGlvbnMsIG9wZXJhdG9ycywgYW5kIGFjdGlvbnNcbiAqICA4LiBTZXQgdXAgVmltIHRvIHdvcmsgYXMgYSBrZXltYXAgZm9yIENvZGVNaXJyb3IuXG4gKiAgOS4gRXggY29tbWFuZCBpbXBsZW1lbnRhdGlvbnMuXG4gKi9cblxuKGZ1bmN0aW9uKG1vZCkge1xuICBpZiAodHlwZW9mIGV4cG9ydHMgPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgbW9kdWxlID09IFwib2JqZWN0XCIpIC8vIENvbW1vbkpTXG4gICAgbW9kKHJlcXVpcmUoXCIuLi9saWIvY29kZW1pcnJvclwiKSwgcmVxdWlyZShcIi4uL2FkZG9uL3NlYXJjaC9zZWFyY2hjdXJzb3JcIiksIHJlcXVpcmUoXCIuLi9hZGRvbi9kaWFsb2cvZGlhbG9nXCIpLCByZXF1aXJlKFwiLi4vYWRkb24vZWRpdC9tYXRjaGJyYWNrZXRzLmpzXCIpKTtcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkgLy8gQU1EXG4gICAgZGVmaW5lKFtcIi4uL2xpYi9jb2RlbWlycm9yXCIsIFwiLi4vYWRkb24vc2VhcmNoL3NlYXJjaGN1cnNvclwiLCBcIi4uL2FkZG9uL2RpYWxvZy9kaWFsb2dcIiwgXCIuLi9hZGRvbi9lZGl0L21hdGNoYnJhY2tldHNcIl0sIG1vZCk7XG4gIGVsc2UgLy8gUGxhaW4gYnJvd3NlciBlbnZcbiAgICBtb2QoQ29kZU1pcnJvcik7XG59KShmdW5jdGlvbihDb2RlTWlycm9yKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgZGVmYXVsdEtleW1hcCA9IFtcbiAgICAvLyBLZXkgdG8ga2V5IG1hcHBpbmcuIFRoaXMgZ29lcyBmaXJzdCB0byBtYWtlIGl0IHBvc3NpYmxlIHRvIG92ZXJyaWRlXG4gICAgLy8gZXhpc3RpbmcgbWFwcGluZ3MuXG4gICAgeyBrZXlzOiAnPExlZnQ+JywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnaCcgfSxcbiAgICB7IGtleXM6ICc8UmlnaHQ+JywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnbCcgfSxcbiAgICB7IGtleXM6ICc8VXA+JywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnaycgfSxcbiAgICB7IGtleXM6ICc8RG93bj4nLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICdqJyB9LFxuICAgIHsga2V5czogJzxTcGFjZT4nLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICdsJyB9LFxuICAgIHsga2V5czogJzxCUz4nLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICdoJywgY29udGV4dDogJ25vcm1hbCd9LFxuICAgIHsga2V5czogJzxEZWw+JywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAneCcsIGNvbnRleHQ6ICdub3JtYWwnfSxcbiAgICB7IGtleXM6ICc8Qy1TcGFjZT4nLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICdXJyB9LFxuICAgIHsga2V5czogJzxDLUJTPicsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJ0InLCBjb250ZXh0OiAnbm9ybWFsJyB9LFxuICAgIHsga2V5czogJzxTLVNwYWNlPicsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJ3cnIH0sXG4gICAgeyBrZXlzOiAnPFMtQlM+JywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnYicsIGNvbnRleHQ6ICdub3JtYWwnIH0sXG4gICAgeyBrZXlzOiAnPEMtbj4nLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICdqJyB9LFxuICAgIHsga2V5czogJzxDLXA+JywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnaycgfSxcbiAgICB7IGtleXM6ICc8Qy1bPicsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJzxFc2M+JyB9LFxuICAgIHsga2V5czogJzxDLWM+JywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnPEVzYz4nIH0sXG4gICAgeyBrZXlzOiAnPEMtWz4nLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICc8RXNjPicsIGNvbnRleHQ6ICdpbnNlcnQnIH0sXG4gICAgeyBrZXlzOiAnPEMtYz4nLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICc8RXNjPicsIGNvbnRleHQ6ICdpbnNlcnQnIH0sXG4gICAgeyBrZXlzOiAncycsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJ2NsJywgY29udGV4dDogJ25vcm1hbCcgfSxcbiAgICB7IGtleXM6ICdzJywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnYycsIGNvbnRleHQ6ICd2aXN1YWwnfSxcbiAgICB7IGtleXM6ICdTJywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnY2MnLCBjb250ZXh0OiAnbm9ybWFsJyB9LFxuICAgIHsga2V5czogJ1MnLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICdWZE8nLCBjb250ZXh0OiAndmlzdWFsJyB9LFxuICAgIHsga2V5czogJzxIb21lPicsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJzAnIH0sXG4gICAgeyBrZXlzOiAnPEVuZD4nLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICckJyB9LFxuICAgIHsga2V5czogJzxQYWdlVXA+JywgdHlwZTogJ2tleVRvS2V5JywgdG9LZXlzOiAnPEMtYj4nIH0sXG4gICAgeyBrZXlzOiAnPFBhZ2VEb3duPicsIHR5cGU6ICdrZXlUb0tleScsIHRvS2V5czogJzxDLWY+JyB9LFxuICAgIHsga2V5czogJzxDUj4nLCB0eXBlOiAna2V5VG9LZXknLCB0b0tleXM6ICdqXicsIGNvbnRleHQ6ICdub3JtYWwnIH0sXG4gICAgeyBrZXlzOiAnPElucz4nLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAndG9nZ2xlT3ZlcndyaXRlJywgY29udGV4dDogJ2luc2VydCcgfSxcbiAgICAvLyBNb3Rpb25zXG4gICAgeyBrZXlzOiAnSCcsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlVG9Ub3BMaW5lJywgbW90aW9uQXJnczogeyBsaW5ld2lzZTogdHJ1ZSwgdG9KdW1wbGlzdDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdNJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVUb01pZGRsZUxpbmUnLCBtb3Rpb25BcmdzOiB7IGxpbmV3aXNlOiB0cnVlLCB0b0p1bXBsaXN0OiB0cnVlIH19LFxuICAgIHsga2V5czogJ0wnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZVRvQm90dG9tTGluZScsIG1vdGlvbkFyZ3M6IHsgbGluZXdpc2U6IHRydWUsIHRvSnVtcGxpc3Q6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnaCcsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlDaGFyYWN0ZXJzJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSB9fSxcbiAgICB7IGtleXM6ICdsJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeUNoYXJhY3RlcnMnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnaicsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlMaW5lcycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSwgbGluZXdpc2U6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnaycsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlMaW5lcycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UsIGxpbmV3aXNlOiB0cnVlIH19LFxuICAgIHsga2V5czogJ2dqJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeURpc3BsYXlMaW5lcycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdnaycsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlEaXNwbGF5TGluZXMnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlIH19LFxuICAgIHsga2V5czogJ3cnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5V29yZHMnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUsIHdvcmRFbmQ6IGZhbHNlIH19LFxuICAgIHsga2V5czogJ1cnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5V29yZHMnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUsIHdvcmRFbmQ6IGZhbHNlLCBiaWdXb3JkOiB0cnVlIH19LFxuICAgIHsga2V5czogJ2UnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5V29yZHMnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUsIHdvcmRFbmQ6IHRydWUsIGluY2x1c2l2ZTogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdFJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeVdvcmRzJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlLCB3b3JkRW5kOiB0cnVlLCBiaWdXb3JkOiB0cnVlLCBpbmNsdXNpdmU6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnYicsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlXb3JkcycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UsIHdvcmRFbmQ6IGZhbHNlIH19LFxuICAgIHsga2V5czogJ0InLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5V29yZHMnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlLCB3b3JkRW5kOiBmYWxzZSwgYmlnV29yZDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdnZScsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlXb3JkcycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UsIHdvcmRFbmQ6IHRydWUsIGluY2x1c2l2ZTogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdnRScsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlXb3JkcycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UsIHdvcmRFbmQ6IHRydWUsIGJpZ1dvcmQ6IHRydWUsIGluY2x1c2l2ZTogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICd7JywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeVBhcmFncmFwaCcsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UsIHRvSnVtcGxpc3Q6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnfScsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlQYXJhZ3JhcGgnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUsIHRvSnVtcGxpc3Q6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnKCcsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlTZW50ZW5jZScsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UgfX0sXG4gICAgeyBrZXlzOiAnKScsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlTZW50ZW5jZScsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICc8Qy1mPicsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlQYWdlJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlIH19LFxuICAgIHsga2V5czogJzxDLWI+JywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeVBhZ2UnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlIH19LFxuICAgIHsga2V5czogJzxDLWQ+JywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeVNjcm9sbCcsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSwgZXhwbGljaXRSZXBlYXQ6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnPEMtdT4nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZUJ5U2Nyb2xsJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSwgZXhwbGljaXRSZXBlYXQ6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnZ2cnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZVRvTGluZU9yRWRnZU9mRG9jdW1lbnQnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlLCBleHBsaWNpdFJlcGVhdDogdHJ1ZSwgbGluZXdpc2U6IHRydWUsIHRvSnVtcGxpc3Q6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnRycsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlVG9MaW5lT3JFZGdlT2ZEb2N1bWVudCcsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSwgZXhwbGljaXRSZXBlYXQ6IHRydWUsIGxpbmV3aXNlOiB0cnVlLCB0b0p1bXBsaXN0OiB0cnVlIH19LFxuICAgIHsga2V5czogJzAnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZVRvU3RhcnRPZkxpbmUnIH0sXG4gICAgeyBrZXlzOiAnXicsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlVG9GaXJzdE5vbldoaXRlU3BhY2VDaGFyYWN0ZXInIH0sXG4gICAgeyBrZXlzOiAnKycsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlQnlMaW5lcycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSwgdG9GaXJzdENoYXI6dHJ1ZSB9fSxcbiAgICB7IGtleXM6ICctJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeUxpbmVzJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSwgdG9GaXJzdENoYXI6dHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdfJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVCeUxpbmVzJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlLCB0b0ZpcnN0Q2hhcjp0cnVlLCByZXBlYXRPZmZzZXQ6LTEgfX0sXG4gICAgeyBrZXlzOiAnJCcsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlVG9Fb2wnLCBtb3Rpb25BcmdzOiB7IGluY2x1c2l2ZTogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICclJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVUb01hdGNoZWRTeW1ib2wnLCBtb3Rpb25BcmdzOiB7IGluY2x1c2l2ZTogdHJ1ZSwgdG9KdW1wbGlzdDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdmPGNoYXJhY3Rlcj4nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZVRvQ2hhcmFjdGVyJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlICwgaW5jbHVzaXZlOiB0cnVlIH19LFxuICAgIHsga2V5czogJ0Y8Y2hhcmFjdGVyPicsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlVG9DaGFyYWN0ZXInLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlIH19LFxuICAgIHsga2V5czogJ3Q8Y2hhcmFjdGVyPicsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlVGlsbENoYXJhY3RlcicsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSwgaW5jbHVzaXZlOiB0cnVlIH19LFxuICAgIHsga2V5czogJ1Q8Y2hhcmFjdGVyPicsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdtb3ZlVGlsbENoYXJhY3RlcicsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UgfX0sXG4gICAgeyBrZXlzOiAnOycsIHR5cGU6ICdtb3Rpb24nLCBtb3Rpb246ICdyZXBlYXRMYXN0Q2hhcmFjdGVyU2VhcmNoJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlIH19LFxuICAgIHsga2V5czogJywnLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAncmVwZWF0TGFzdENoYXJhY3RlclNlYXJjaCcsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UgfX0sXG4gICAgeyBrZXlzOiAnXFwnPGNoYXJhY3Rlcj4nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnZ29Ub01hcmsnLCBtb3Rpb25BcmdzOiB7dG9KdW1wbGlzdDogdHJ1ZSwgbGluZXdpc2U6IHRydWV9fSxcbiAgICB7IGtleXM6ICdgPGNoYXJhY3Rlcj4nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnZ29Ub01hcmsnLCBtb3Rpb25BcmdzOiB7dG9KdW1wbGlzdDogdHJ1ZX19LFxuICAgIHsga2V5czogJ11gJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ2p1bXBUb01hcmsnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUgfSB9LFxuICAgIHsga2V5czogJ1tgJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ2p1bXBUb01hcmsnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlIH0gfSxcbiAgICB7IGtleXM6ICddXFwnJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ2p1bXBUb01hcmsnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IHRydWUsIGxpbmV3aXNlOiB0cnVlIH0gfSxcbiAgICB7IGtleXM6ICdbXFwnJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ2p1bXBUb01hcmsnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlLCBsaW5ld2lzZTogdHJ1ZSB9IH0sXG4gICAgLy8gdGhlIG5leHQgdHdvIGFyZW4ndCBtb3Rpb25zIGJ1dCBtdXN0IGNvbWUgYmVmb3JlIG1vcmUgZ2VuZXJhbCBtb3Rpb24gZGVjbGFyYXRpb25zXG4gICAgeyBrZXlzOiAnXXAnLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAncGFzdGUnLCBpc0VkaXQ6IHRydWUsIGFjdGlvbkFyZ3M6IHsgYWZ0ZXI6IHRydWUsIGlzRWRpdDogdHJ1ZSwgbWF0Y2hJbmRlbnQ6IHRydWV9fSxcbiAgICB7IGtleXM6ICdbcCcsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdwYXN0ZScsIGlzRWRpdDogdHJ1ZSwgYWN0aW9uQXJnczogeyBhZnRlcjogZmFsc2UsIGlzRWRpdDogdHJ1ZSwgbWF0Y2hJbmRlbnQ6IHRydWV9fSxcbiAgICB7IGtleXM6ICddPGNoYXJhY3Rlcj4nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZVRvU3ltYm9sJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlLCB0b0p1bXBsaXN0OiB0cnVlfX0sXG4gICAgeyBrZXlzOiAnWzxjaGFyYWN0ZXI+JywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVUb1N5bWJvbCcsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UsIHRvSnVtcGxpc3Q6IHRydWV9fSxcbiAgICB7IGtleXM6ICd8JywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ21vdmVUb0NvbHVtbid9LFxuICAgIHsga2V5czogJ28nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZVRvT3RoZXJIaWdobGlnaHRlZEVuZCcsIGNvbnRleHQ6J3Zpc3VhbCd9LFxuICAgIHsga2V5czogJ08nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnbW92ZVRvT3RoZXJIaWdobGlnaHRlZEVuZCcsIG1vdGlvbkFyZ3M6IHtzYW1lTGluZTogdHJ1ZX0sIGNvbnRleHQ6J3Zpc3VhbCd9LFxuICAgIC8vIE9wZXJhdG9yc1xuICAgIHsga2V5czogJ2QnLCB0eXBlOiAnb3BlcmF0b3InLCBvcGVyYXRvcjogJ2RlbGV0ZScgfSxcbiAgICB7IGtleXM6ICd5JywgdHlwZTogJ29wZXJhdG9yJywgb3BlcmF0b3I6ICd5YW5rJyB9LFxuICAgIHsga2V5czogJ2MnLCB0eXBlOiAnb3BlcmF0b3InLCBvcGVyYXRvcjogJ2NoYW5nZScgfSxcbiAgICB7IGtleXM6ICc9JywgdHlwZTogJ29wZXJhdG9yJywgb3BlcmF0b3I6ICdpbmRlbnRBdXRvJyB9LFxuICAgIHsga2V5czogJz4nLCB0eXBlOiAnb3BlcmF0b3InLCBvcGVyYXRvcjogJ2luZGVudCcsIG9wZXJhdG9yQXJnczogeyBpbmRlbnRSaWdodDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICc8JywgdHlwZTogJ29wZXJhdG9yJywgb3BlcmF0b3I6ICdpbmRlbnQnLCBvcGVyYXRvckFyZ3M6IHsgaW5kZW50UmlnaHQ6IGZhbHNlIH19LFxuICAgIHsga2V5czogJ2d+JywgdHlwZTogJ29wZXJhdG9yJywgb3BlcmF0b3I6ICdjaGFuZ2VDYXNlJyB9LFxuICAgIHsga2V5czogJ2d1JywgdHlwZTogJ29wZXJhdG9yJywgb3BlcmF0b3I6ICdjaGFuZ2VDYXNlJywgb3BlcmF0b3JBcmdzOiB7dG9Mb3dlcjogdHJ1ZX0sIGlzRWRpdDogdHJ1ZSB9LFxuICAgIHsga2V5czogJ2dVJywgdHlwZTogJ29wZXJhdG9yJywgb3BlcmF0b3I6ICdjaGFuZ2VDYXNlJywgb3BlcmF0b3JBcmdzOiB7dG9Mb3dlcjogZmFsc2V9LCBpc0VkaXQ6IHRydWUgfSxcbiAgICB7IGtleXM6ICduJywgdHlwZTogJ21vdGlvbicsIG1vdGlvbjogJ2ZpbmROZXh0JywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlLCB0b0p1bXBsaXN0OiB0cnVlIH19LFxuICAgIHsga2V5czogJ04nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAnZmluZE5leHQnLCBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlLCB0b0p1bXBsaXN0OiB0cnVlIH19LFxuICAgIC8vIE9wZXJhdG9yLU1vdGlvbiBkdWFsIGNvbW1hbmRzXG4gICAgeyBrZXlzOiAneCcsIHR5cGU6ICdvcGVyYXRvck1vdGlvbicsIG9wZXJhdG9yOiAnZGVsZXRlJywgbW90aW9uOiAnbW92ZUJ5Q2hhcmFjdGVycycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSB9LCBvcGVyYXRvck1vdGlvbkFyZ3M6IHsgdmlzdWFsTGluZTogZmFsc2UgfX0sXG4gICAgeyBrZXlzOiAnWCcsIHR5cGU6ICdvcGVyYXRvck1vdGlvbicsIG9wZXJhdG9yOiAnZGVsZXRlJywgbW90aW9uOiAnbW92ZUJ5Q2hhcmFjdGVycycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UgfSwgb3BlcmF0b3JNb3Rpb25BcmdzOiB7IHZpc3VhbExpbmU6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnRCcsIHR5cGU6ICdvcGVyYXRvck1vdGlvbicsIG9wZXJhdG9yOiAnZGVsZXRlJywgbW90aW9uOiAnbW92ZVRvRW9sJywgbW90aW9uQXJnczogeyBpbmNsdXNpdmU6IHRydWUgfSwgY29udGV4dDogJ25vcm1hbCd9LFxuICAgIHsga2V5czogJ0QnLCB0eXBlOiAnb3BlcmF0b3InLCBvcGVyYXRvcjogJ2RlbGV0ZScsIG9wZXJhdG9yQXJnczogeyBsaW5ld2lzZTogdHJ1ZSB9LCBjb250ZXh0OiAndmlzdWFsJ30sXG4gICAgeyBrZXlzOiAnWScsIHR5cGU6ICdvcGVyYXRvck1vdGlvbicsIG9wZXJhdG9yOiAneWFuaycsIG1vdGlvbjogJ2V4cGFuZFRvTGluZScsIG1vdGlvbkFyZ3M6IHsgbGluZXdpc2U6IHRydWUgfSwgY29udGV4dDogJ25vcm1hbCd9LFxuICAgIHsga2V5czogJ1knLCB0eXBlOiAnb3BlcmF0b3InLCBvcGVyYXRvcjogJ3lhbmsnLCBvcGVyYXRvckFyZ3M6IHsgbGluZXdpc2U6IHRydWUgfSwgY29udGV4dDogJ3Zpc3VhbCd9LFxuICAgIHsga2V5czogJ0MnLCB0eXBlOiAnb3BlcmF0b3JNb3Rpb24nLCBvcGVyYXRvcjogJ2NoYW5nZScsIG1vdGlvbjogJ21vdmVUb0VvbCcsIG1vdGlvbkFyZ3M6IHsgaW5jbHVzaXZlOiB0cnVlIH0sIGNvbnRleHQ6ICdub3JtYWwnfSxcbiAgICB7IGtleXM6ICdDJywgdHlwZTogJ29wZXJhdG9yJywgb3BlcmF0b3I6ICdjaGFuZ2UnLCBvcGVyYXRvckFyZ3M6IHsgbGluZXdpc2U6IHRydWUgfSwgY29udGV4dDogJ3Zpc3VhbCd9LFxuICAgIHsga2V5czogJ34nLCB0eXBlOiAnb3BlcmF0b3JNb3Rpb24nLCBvcGVyYXRvcjogJ2NoYW5nZUNhc2UnLCBtb3Rpb246ICdtb3ZlQnlDaGFyYWN0ZXJzJywgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlIH0sIG9wZXJhdG9yQXJnczogeyBzaG91bGRNb3ZlQ3Vyc29yOiB0cnVlIH0sIGNvbnRleHQ6ICdub3JtYWwnfSxcbiAgICB7IGtleXM6ICd+JywgdHlwZTogJ29wZXJhdG9yJywgb3BlcmF0b3I6ICdjaGFuZ2VDYXNlJywgY29udGV4dDogJ3Zpc3VhbCd9LFxuICAgIHsga2V5czogJzxDLXc+JywgdHlwZTogJ29wZXJhdG9yTW90aW9uJywgb3BlcmF0b3I6ICdkZWxldGUnLCBtb3Rpb246ICdtb3ZlQnlXb3JkcycsIG1vdGlvbkFyZ3M6IHsgZm9yd2FyZDogZmFsc2UsIHdvcmRFbmQ6IGZhbHNlIH0sIGNvbnRleHQ6ICdpbnNlcnQnIH0sXG4gICAgLy9pZ25vcmUgQy13IGluIG5vcm1hbCBtb2RlXG4gICAgeyBrZXlzOiAnPEMtdz4nLCB0eXBlOiAnaWRsZScsIGNvbnRleHQ6ICdub3JtYWwnIH0sXG4gICAgLy8gQWN0aW9uc1xuICAgIHsga2V5czogJzxDLWk+JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ2p1bXBMaXN0V2FsaycsIGFjdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICc8Qy1vPicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdqdW1wTGlzdFdhbGsnLCBhY3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlIH19LFxuICAgIHsga2V5czogJzxDLWU+JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3Njcm9sbCcsIGFjdGlvbkFyZ3M6IHsgZm9yd2FyZDogdHJ1ZSwgbGluZXdpc2U6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnPEMteT4nLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnc2Nyb2xsJywgYWN0aW9uQXJnczogeyBmb3J3YXJkOiBmYWxzZSwgbGluZXdpc2U6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnYScsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdlbnRlckluc2VydE1vZGUnLCBpc0VkaXQ6IHRydWUsIGFjdGlvbkFyZ3M6IHsgaW5zZXJ0QXQ6ICdjaGFyQWZ0ZXInIH0sIGNvbnRleHQ6ICdub3JtYWwnIH0sXG4gICAgeyBrZXlzOiAnQScsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdlbnRlckluc2VydE1vZGUnLCBpc0VkaXQ6IHRydWUsIGFjdGlvbkFyZ3M6IHsgaW5zZXJ0QXQ6ICdlb2wnIH0sIGNvbnRleHQ6ICdub3JtYWwnIH0sXG4gICAgeyBrZXlzOiAnQScsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdlbnRlckluc2VydE1vZGUnLCBpc0VkaXQ6IHRydWUsIGFjdGlvbkFyZ3M6IHsgaW5zZXJ0QXQ6ICdlbmRPZlNlbGVjdGVkQXJlYScgfSwgY29udGV4dDogJ3Zpc3VhbCcgfSxcbiAgICB7IGtleXM6ICdpJywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ2VudGVySW5zZXJ0TW9kZScsIGlzRWRpdDogdHJ1ZSwgYWN0aW9uQXJnczogeyBpbnNlcnRBdDogJ2lucGxhY2UnIH0sIGNvbnRleHQ6ICdub3JtYWwnIH0sXG4gICAgeyBrZXlzOiAnSScsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdlbnRlckluc2VydE1vZGUnLCBpc0VkaXQ6IHRydWUsIGFjdGlvbkFyZ3M6IHsgaW5zZXJ0QXQ6ICdmaXJzdE5vbkJsYW5rJ30sIGNvbnRleHQ6ICdub3JtYWwnIH0sXG4gICAgeyBrZXlzOiAnSScsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdlbnRlckluc2VydE1vZGUnLCBpc0VkaXQ6IHRydWUsIGFjdGlvbkFyZ3M6IHsgaW5zZXJ0QXQ6ICdzdGFydE9mU2VsZWN0ZWRBcmVhJyB9LCBjb250ZXh0OiAndmlzdWFsJyB9LFxuICAgIHsga2V5czogJ28nLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnbmV3TGluZUFuZEVudGVySW5zZXJ0TW9kZScsIGlzRWRpdDogdHJ1ZSwgaW50ZXJsYWNlSW5zZXJ0UmVwZWF0OiB0cnVlLCBhY3Rpb25BcmdzOiB7IGFmdGVyOiB0cnVlIH0sIGNvbnRleHQ6ICdub3JtYWwnIH0sXG4gICAgeyBrZXlzOiAnTycsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICduZXdMaW5lQW5kRW50ZXJJbnNlcnRNb2RlJywgaXNFZGl0OiB0cnVlLCBpbnRlcmxhY2VJbnNlcnRSZXBlYXQ6IHRydWUsIGFjdGlvbkFyZ3M6IHsgYWZ0ZXI6IGZhbHNlIH0sIGNvbnRleHQ6ICdub3JtYWwnIH0sXG4gICAgeyBrZXlzOiAndicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICd0b2dnbGVWaXN1YWxNb2RlJyB9LFxuICAgIHsga2V5czogJ1YnLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAndG9nZ2xlVmlzdWFsTW9kZScsIGFjdGlvbkFyZ3M6IHsgbGluZXdpc2U6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnPEMtdj4nLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAndG9nZ2xlVmlzdWFsTW9kZScsIGFjdGlvbkFyZ3M6IHsgYmxvY2t3aXNlOiB0cnVlIH19LFxuICAgIHsga2V5czogJzxDLXE+JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3RvZ2dsZVZpc3VhbE1vZGUnLCBhY3Rpb25BcmdzOiB7IGJsb2Nrd2lzZTogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdndicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdyZXNlbGVjdExhc3RTZWxlY3Rpb24nIH0sXG4gICAgeyBrZXlzOiAnSicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdqb2luTGluZXMnLCBpc0VkaXQ6IHRydWUgfSxcbiAgICB7IGtleXM6ICdwJywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3Bhc3RlJywgaXNFZGl0OiB0cnVlLCBhY3Rpb25BcmdzOiB7IGFmdGVyOiB0cnVlLCBpc0VkaXQ6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnUCcsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdwYXN0ZScsIGlzRWRpdDogdHJ1ZSwgYWN0aW9uQXJnczogeyBhZnRlcjogZmFsc2UsIGlzRWRpdDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdyPGNoYXJhY3Rlcj4nLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAncmVwbGFjZScsIGlzRWRpdDogdHJ1ZSB9LFxuICAgIHsga2V5czogJ0A8Y2hhcmFjdGVyPicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdyZXBsYXlNYWNybycgfSxcbiAgICB7IGtleXM6ICdxPGNoYXJhY3Rlcj4nLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnZW50ZXJNYWNyb1JlY29yZE1vZGUnIH0sXG4gICAgLy8gSGFuZGxlIFJlcGxhY2UtbW9kZSBhcyBhIHNwZWNpYWwgY2FzZSBvZiBpbnNlcnQgbW9kZS5cbiAgICB7IGtleXM6ICdSJywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ2VudGVySW5zZXJ0TW9kZScsIGlzRWRpdDogdHJ1ZSwgYWN0aW9uQXJnczogeyByZXBsYWNlOiB0cnVlIH19LFxuICAgIHsga2V5czogJ3UnLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAndW5kbycsIGNvbnRleHQ6ICdub3JtYWwnIH0sXG4gICAgeyBrZXlzOiAndScsIHR5cGU6ICdvcGVyYXRvcicsIG9wZXJhdG9yOiAnY2hhbmdlQ2FzZScsIG9wZXJhdG9yQXJnczoge3RvTG93ZXI6IHRydWV9LCBjb250ZXh0OiAndmlzdWFsJywgaXNFZGl0OiB0cnVlIH0sXG4gICAgeyBrZXlzOiAnVScsIHR5cGU6ICdvcGVyYXRvcicsIG9wZXJhdG9yOiAnY2hhbmdlQ2FzZScsIG9wZXJhdG9yQXJnczoge3RvTG93ZXI6IGZhbHNlfSwgY29udGV4dDogJ3Zpc3VhbCcsIGlzRWRpdDogdHJ1ZSB9LFxuICAgIHsga2V5czogJzxDLXI+JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3JlZG8nIH0sXG4gICAgeyBrZXlzOiAnbTxjaGFyYWN0ZXI+JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3NldE1hcmsnIH0sXG4gICAgeyBrZXlzOiAnXCI8Y2hhcmFjdGVyPicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdzZXRSZWdpc3RlcicgfSxcbiAgICB7IGtleXM6ICd6eicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdzY3JvbGxUb0N1cnNvcicsIGFjdGlvbkFyZ3M6IHsgcG9zaXRpb246ICdjZW50ZXInIH19LFxuICAgIHsga2V5czogJ3ouJywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3Njcm9sbFRvQ3Vyc29yJywgYWN0aW9uQXJnczogeyBwb3NpdGlvbjogJ2NlbnRlcicgfSwgbW90aW9uOiAnbW92ZVRvRmlyc3ROb25XaGl0ZVNwYWNlQ2hhcmFjdGVyJyB9LFxuICAgIHsga2V5czogJ3p0JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3Njcm9sbFRvQ3Vyc29yJywgYWN0aW9uQXJnczogeyBwb3NpdGlvbjogJ3RvcCcgfX0sXG4gICAgeyBrZXlzOiAnejxDUj4nLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnc2Nyb2xsVG9DdXJzb3InLCBhY3Rpb25BcmdzOiB7IHBvc2l0aW9uOiAndG9wJyB9LCBtb3Rpb246ICdtb3ZlVG9GaXJzdE5vbldoaXRlU3BhY2VDaGFyYWN0ZXInIH0sXG4gICAgeyBrZXlzOiAnei0nLCB0eXBlOiAnYWN0aW9uJywgYWN0aW9uOiAnc2Nyb2xsVG9DdXJzb3InLCBhY3Rpb25BcmdzOiB7IHBvc2l0aW9uOiAnYm90dG9tJyB9fSxcbiAgICB7IGtleXM6ICd6YicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdzY3JvbGxUb0N1cnNvcicsIGFjdGlvbkFyZ3M6IHsgcG9zaXRpb246ICdib3R0b20nIH0sIG1vdGlvbjogJ21vdmVUb0ZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcicgfSxcbiAgICB7IGtleXM6ICcuJywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ3JlcGVhdExhc3RFZGl0JyB9LFxuICAgIHsga2V5czogJzxDLWE+JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ2luY3JlbWVudE51bWJlclRva2VuJywgaXNFZGl0OiB0cnVlLCBhY3Rpb25BcmdzOiB7aW5jcmVhc2U6IHRydWUsIGJhY2t0cmFjazogZmFsc2V9fSxcbiAgICB7IGtleXM6ICc8Qy14PicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdpbmNyZW1lbnROdW1iZXJUb2tlbicsIGlzRWRpdDogdHJ1ZSwgYWN0aW9uQXJnczoge2luY3JlYXNlOiBmYWxzZSwgYmFja3RyYWNrOiBmYWxzZX19LFxuICAgIHsga2V5czogJzxDLXQ+JywgdHlwZTogJ2FjdGlvbicsIGFjdGlvbjogJ2luZGVudCcsIGFjdGlvbkFyZ3M6IHsgaW5kZW50UmlnaHQ6IHRydWUgfSwgY29udGV4dDogJ2luc2VydCcgfSxcbiAgICB7IGtleXM6ICc8Qy1kPicsIHR5cGU6ICdhY3Rpb24nLCBhY3Rpb246ICdpbmRlbnQnLCBhY3Rpb25BcmdzOiB7IGluZGVudFJpZ2h0OiBmYWxzZSB9LCBjb250ZXh0OiAnaW5zZXJ0JyB9LFxuICAgIC8vIFRleHQgb2JqZWN0IG1vdGlvbnNcbiAgICB7IGtleXM6ICdhPGNoYXJhY3Rlcj4nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAndGV4dE9iamVjdE1hbmlwdWxhdGlvbicgfSxcbiAgICB7IGtleXM6ICdpPGNoYXJhY3Rlcj4nLCB0eXBlOiAnbW90aW9uJywgbW90aW9uOiAndGV4dE9iamVjdE1hbmlwdWxhdGlvbicsIG1vdGlvbkFyZ3M6IHsgdGV4dE9iamVjdElubmVyOiB0cnVlIH19LFxuICAgIC8vIFNlYXJjaFxuICAgIHsga2V5czogJy8nLCB0eXBlOiAnc2VhcmNoJywgc2VhcmNoQXJnczogeyBmb3J3YXJkOiB0cnVlLCBxdWVyeVNyYzogJ3Byb21wdCcsIHRvSnVtcGxpc3Q6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnPycsIHR5cGU6ICdzZWFyY2gnLCBzZWFyY2hBcmdzOiB7IGZvcndhcmQ6IGZhbHNlLCBxdWVyeVNyYzogJ3Byb21wdCcsIHRvSnVtcGxpc3Q6IHRydWUgfX0sXG4gICAgeyBrZXlzOiAnKicsIHR5cGU6ICdzZWFyY2gnLCBzZWFyY2hBcmdzOiB7IGZvcndhcmQ6IHRydWUsIHF1ZXJ5U3JjOiAnd29yZFVuZGVyQ3Vyc29yJywgd2hvbGVXb3JkT25seTogdHJ1ZSwgdG9KdW1wbGlzdDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICcjJywgdHlwZTogJ3NlYXJjaCcsIHNlYXJjaEFyZ3M6IHsgZm9yd2FyZDogZmFsc2UsIHF1ZXJ5U3JjOiAnd29yZFVuZGVyQ3Vyc29yJywgd2hvbGVXb3JkT25seTogdHJ1ZSwgdG9KdW1wbGlzdDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdnKicsIHR5cGU6ICdzZWFyY2gnLCBzZWFyY2hBcmdzOiB7IGZvcndhcmQ6IHRydWUsIHF1ZXJ5U3JjOiAnd29yZFVuZGVyQ3Vyc29yJywgdG9KdW1wbGlzdDogdHJ1ZSB9fSxcbiAgICB7IGtleXM6ICdnIycsIHR5cGU6ICdzZWFyY2gnLCBzZWFyY2hBcmdzOiB7IGZvcndhcmQ6IGZhbHNlLCBxdWVyeVNyYzogJ3dvcmRVbmRlckN1cnNvcicsIHRvSnVtcGxpc3Q6IHRydWUgfX0sXG4gICAgLy8gRXggY29tbWFuZFxuICAgIHsga2V5czogJzonLCB0eXBlOiAnZXgnIH1cbiAgXTtcbiAgdmFyIGRlZmF1bHRLZXltYXBMZW5ndGggPSBkZWZhdWx0S2V5bWFwLmxlbmd0aDtcblxuICAvKipcbiAgICogRXggY29tbWFuZHNcbiAgICogQ2FyZSBtdXN0IGJlIHRha2VuIHdoZW4gYWRkaW5nIHRvIHRoZSBkZWZhdWx0IEV4IGNvbW1hbmQgbWFwLiBGb3IgYW55XG4gICAqIHBhaXIgb2YgY29tbWFuZHMgdGhhdCBoYXZlIGEgc2hhcmVkIHByZWZpeCwgYXQgbGVhc3Qgb25lIG9mIHRoZWlyXG4gICAqIHNob3J0TmFtZXMgbXVzdCBub3QgbWF0Y2ggdGhlIHByZWZpeCBvZiB0aGUgb3RoZXIgY29tbWFuZC5cbiAgICovXG4gIHZhciBkZWZhdWx0RXhDb21tYW5kTWFwID0gW1xuICAgIHsgbmFtZTogJ2NvbG9yc2NoZW1lJywgc2hvcnROYW1lOiAnY29sbycgfSxcbiAgICB7IG5hbWU6ICdtYXAnIH0sXG4gICAgeyBuYW1lOiAnaW1hcCcsIHNob3J0TmFtZTogJ2ltJyB9LFxuICAgIHsgbmFtZTogJ25tYXAnLCBzaG9ydE5hbWU6ICdubScgfSxcbiAgICB7IG5hbWU6ICd2bWFwJywgc2hvcnROYW1lOiAndm0nIH0sXG4gICAgeyBuYW1lOiAndW5tYXAnIH0sXG4gICAgeyBuYW1lOiAnd3JpdGUnLCBzaG9ydE5hbWU6ICd3JyB9LFxuICAgIHsgbmFtZTogJ3VuZG8nLCBzaG9ydE5hbWU6ICd1JyB9LFxuICAgIHsgbmFtZTogJ3JlZG8nLCBzaG9ydE5hbWU6ICdyZWQnIH0sXG4gICAgeyBuYW1lOiAnc2V0Jywgc2hvcnROYW1lOiAnc2UnIH0sXG4gICAgeyBuYW1lOiAnc2V0Jywgc2hvcnROYW1lOiAnc2UnIH0sXG4gICAgeyBuYW1lOiAnc2V0bG9jYWwnLCBzaG9ydE5hbWU6ICdzZXRsJyB9LFxuICAgIHsgbmFtZTogJ3NldGdsb2JhbCcsIHNob3J0TmFtZTogJ3NldGcnIH0sXG4gICAgeyBuYW1lOiAnc29ydCcsIHNob3J0TmFtZTogJ3NvcicgfSxcbiAgICB7IG5hbWU6ICdzdWJzdGl0dXRlJywgc2hvcnROYW1lOiAncycsIHBvc3NpYmx5QXN5bmM6IHRydWUgfSxcbiAgICB7IG5hbWU6ICdub2hsc2VhcmNoJywgc2hvcnROYW1lOiAnbm9oJyB9LFxuICAgIHsgbmFtZTogJ3lhbmsnLCBzaG9ydE5hbWU6ICd5JyB9LFxuICAgIHsgbmFtZTogJ2RlbG1hcmtzJywgc2hvcnROYW1lOiAnZGVsbScgfSxcbiAgICB7IG5hbWU6ICdyZWdpc3RlcnMnLCBzaG9ydE5hbWU6ICdyZWcnLCBleGNsdWRlRnJvbUNvbW1hbmRIaXN0b3J5OiB0cnVlIH0sXG4gICAgeyBuYW1lOiAnZ2xvYmFsJywgc2hvcnROYW1lOiAnZycgfVxuICBdO1xuXG4gIHZhciBQb3MgPSBDb2RlTWlycm9yLlBvcztcblxuICB2YXIgVmltID0gZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gZW50ZXJWaW1Nb2RlKGNtKSB7XG4gICAgICBjbS5zZXRPcHRpb24oJ2Rpc2FibGVJbnB1dCcsIHRydWUpO1xuICAgICAgY20uc2V0T3B0aW9uKCdzaG93Q3Vyc29yV2hlblNlbGVjdGluZycsIGZhbHNlKTtcbiAgICAgIENvZGVNaXJyb3Iuc2lnbmFsKGNtLCBcInZpbS1tb2RlLWNoYW5nZVwiLCB7bW9kZTogXCJub3JtYWxcIn0pO1xuICAgICAgY20ub24oJ2N1cnNvckFjdGl2aXR5Jywgb25DdXJzb3JBY3Rpdml0eSk7XG4gICAgICBtYXliZUluaXRWaW1TdGF0ZShjbSk7XG4gICAgICBDb2RlTWlycm9yLm9uKGNtLmdldElucHV0RmllbGQoKSwgJ3Bhc3RlJywgZ2V0T25QYXN0ZUZuKGNtKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGVhdmVWaW1Nb2RlKGNtKSB7XG4gICAgICBjbS5zZXRPcHRpb24oJ2Rpc2FibGVJbnB1dCcsIGZhbHNlKTtcbiAgICAgIGNtLm9mZignY3Vyc29yQWN0aXZpdHknLCBvbkN1cnNvckFjdGl2aXR5KTtcbiAgICAgIENvZGVNaXJyb3Iub2ZmKGNtLmdldElucHV0RmllbGQoKSwgJ3Bhc3RlJywgZ2V0T25QYXN0ZUZuKGNtKSk7XG4gICAgICBjbS5zdGF0ZS52aW0gPSBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRldGFjaFZpbU1hcChjbSwgbmV4dCkge1xuICAgICAgaWYgKHRoaXMgPT0gQ29kZU1pcnJvci5rZXlNYXAudmltKSB7XG4gICAgICAgIENvZGVNaXJyb3Iucm1DbGFzcyhjbS5nZXRXcmFwcGVyRWxlbWVudCgpLCBcImNtLWZhdC1jdXJzb3JcIik7XG4gICAgICAgIGlmIChjbS5nZXRPcHRpb24oXCJpbnB1dFN0eWxlXCIpID09IFwiY29udGVudGVkaXRhYmxlXCIgJiYgZG9jdW1lbnQuYm9keS5zdHlsZS5jYXJldENvbG9yICE9IG51bGwpIHtcbiAgICAgICAgICBkaXNhYmxlRmF0Q3Vyc29yTWFyayhjbSk7XG4gICAgICAgICAgY20uZ2V0SW5wdXRGaWVsZCgpLnN0eWxlLmNhcmV0Q29sb3IgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghbmV4dCB8fCBuZXh0LmF0dGFjaCAhPSBhdHRhY2hWaW1NYXApXG4gICAgICAgIGxlYXZlVmltTW9kZShjbSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGF0dGFjaFZpbU1hcChjbSwgcHJldikge1xuICAgICAgaWYgKHRoaXMgPT0gQ29kZU1pcnJvci5rZXlNYXAudmltKSB7XG4gICAgICAgIENvZGVNaXJyb3IuYWRkQ2xhc3MoY20uZ2V0V3JhcHBlckVsZW1lbnQoKSwgXCJjbS1mYXQtY3Vyc29yXCIpO1xuICAgICAgICBpZiAoY20uZ2V0T3B0aW9uKFwiaW5wdXRTdHlsZVwiKSA9PSBcImNvbnRlbnRlZGl0YWJsZVwiICYmIGRvY3VtZW50LmJvZHkuc3R5bGUuY2FyZXRDb2xvciAhPSBudWxsKSB7XG4gICAgICAgICAgZW5hYmxlRmF0Q3Vyc29yTWFyayhjbSk7XG4gICAgICAgICAgY20uZ2V0SW5wdXRGaWVsZCgpLnN0eWxlLmNhcmV0Q29sb3IgPSBcInRyYW5zcGFyZW50XCI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFwcmV2IHx8IHByZXYuYXR0YWNoICE9IGF0dGFjaFZpbU1hcClcbiAgICAgICAgZW50ZXJWaW1Nb2RlKGNtKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVGYXRDdXJzb3JNYXJrKGNtKSB7XG4gICAgICBpZiAoIWNtLnN0YXRlLmZhdEN1cnNvck1hcmtzKSByZXR1cm47XG4gICAgICBjbGVhckZhdEN1cnNvck1hcmsoY20pO1xuICAgICAgdmFyIHJhbmdlcyA9IGNtLmxpc3RTZWxlY3Rpb25zKCksIHJlc3VsdCA9IFtdXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcmFuZ2UgPSByYW5nZXNbaV1cbiAgICAgICAgaWYgKHJhbmdlLmVtcHR5KCkpIHtcbiAgICAgICAgICBpZiAocmFuZ2UuYW5jaG9yLmNoIDwgY20uZ2V0TGluZShyYW5nZS5hbmNob3IubGluZSkubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChjbS5tYXJrVGV4dChyYW5nZS5hbmNob3IsIFBvcyhyYW5nZS5hbmNob3IubGluZSwgcmFuZ2UuYW5jaG9yLmNoICsgMSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Y2xhc3NOYW1lOiBcImNtLWZhdC1jdXJzb3ItbWFya1wifSkpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB3aWRnZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKVxuICAgICAgICAgICAgd2lkZ2V0LnRleHRDb250ZW50ID0gXCJcXHUwMGEwXCJcbiAgICAgICAgICAgIHdpZGdldC5jbGFzc05hbWUgPSBcImNtLWZhdC1jdXJzb3ItbWFya1wiXG4gICAgICAgICAgICByZXN1bHQucHVzaChjbS5zZXRCb29rbWFyayhyYW5nZS5hbmNob3IsIHt3aWRnZXQ6IHdpZGdldH0pKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY20uc3RhdGUuZmF0Q3Vyc29yTWFya3MgPSByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJGYXRDdXJzb3JNYXJrKGNtKSB7XG4gICAgICB2YXIgbWFya3MgPSBjbS5zdGF0ZS5mYXRDdXJzb3JNYXJrcztcbiAgICAgIGlmIChtYXJrcykgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXJrcy5sZW5ndGg7IGkrKykgbWFya3NbaV0uY2xlYXIoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbmFibGVGYXRDdXJzb3JNYXJrKGNtKSB7XG4gICAgICBjbS5zdGF0ZS5mYXRDdXJzb3JNYXJrcyA9IFtdO1xuICAgICAgdXBkYXRlRmF0Q3Vyc29yTWFyayhjbSlcbiAgICAgIGNtLm9uKFwiY3Vyc29yQWN0aXZpdHlcIiwgdXBkYXRlRmF0Q3Vyc29yTWFyaylcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkaXNhYmxlRmF0Q3Vyc29yTWFyayhjbSkge1xuICAgICAgY2xlYXJGYXRDdXJzb3JNYXJrKGNtKTtcbiAgICAgIGNtLm9mZihcImN1cnNvckFjdGl2aXR5XCIsIHVwZGF0ZUZhdEN1cnNvck1hcmspO1xuICAgICAgLy8gZXhwbGljaXRseSBzZXQgZmF0Q3Vyc29yTWFya3MgdG8gbnVsbCBiZWNhdXNlIGV2ZW50IGxpc3RlbmVyIGFib3ZlXG4gICAgICAvLyBjYW4gYmUgaW52b2tlIGFmdGVyIHJlbW92aW5nIGl0LCBpZiBvZmYgaXMgY2FsbGVkIGZyb20gb3BlcmF0aW9uXG4gICAgICBjbS5zdGF0ZS5mYXRDdXJzb3JNYXJrcyA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gRGVwcmVjYXRlZCwgc2ltcGx5IHNldHRpbmcgdGhlIGtleW1hcCB3b3JrcyBhZ2Fpbi5cbiAgICBDb2RlTWlycm9yLmRlZmluZU9wdGlvbigndmltTW9kZScsIGZhbHNlLCBmdW5jdGlvbihjbSwgdmFsLCBwcmV2KSB7XG4gICAgICBpZiAodmFsICYmIGNtLmdldE9wdGlvbihcImtleU1hcFwiKSAhPSBcInZpbVwiKVxuICAgICAgICBjbS5zZXRPcHRpb24oXCJrZXlNYXBcIiwgXCJ2aW1cIik7XG4gICAgICBlbHNlIGlmICghdmFsICYmIHByZXYgIT0gQ29kZU1pcnJvci5Jbml0ICYmIC9edmltLy50ZXN0KGNtLmdldE9wdGlvbihcImtleU1hcFwiKSkpXG4gICAgICAgIGNtLnNldE9wdGlvbihcImtleU1hcFwiLCBcImRlZmF1bHRcIik7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBjbUtleShrZXksIGNtKSB7XG4gICAgICBpZiAoIWNtKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgICAgIGlmICh0aGlzW2tleV0pIHsgcmV0dXJuIHRoaXNba2V5XTsgfVxuICAgICAgdmFyIHZpbUtleSA9IGNtS2V5VG9WaW1LZXkoa2V5KTtcbiAgICAgIGlmICghdmltS2V5KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHZhciBjbWQgPSBDb2RlTWlycm9yLlZpbS5maW5kS2V5KGNtLCB2aW1LZXkpO1xuICAgICAgaWYgKHR5cGVvZiBjbWQgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBDb2RlTWlycm9yLnNpZ25hbChjbSwgJ3ZpbS1rZXlwcmVzcycsIHZpbUtleSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY21kO1xuICAgIH1cblxuICAgIHZhciBtb2RpZmllcnMgPSB7J1NoaWZ0JzogJ1MnLCAnQ3RybCc6ICdDJywgJ0FsdCc6ICdBJywgJ0NtZCc6ICdEJywgJ01vZCc6ICdBJ307XG4gICAgdmFyIHNwZWNpYWxLZXlzID0ge0VudGVyOidDUicsQmFja3NwYWNlOidCUycsRGVsZXRlOidEZWwnLEluc2VydDonSW5zJ307XG4gICAgZnVuY3Rpb24gY21LZXlUb1ZpbUtleShrZXkpIHtcbiAgICAgIGlmIChrZXkuY2hhckF0KDApID09ICdcXCcnKSB7XG4gICAgICAgIC8vIEtleXByZXNzIGNoYXJhY3RlciBiaW5kaW5nIG9mIGZvcm1hdCBcIidhJ1wiXG4gICAgICAgIHJldHVybiBrZXkuY2hhckF0KDEpO1xuICAgICAgfVxuICAgICAgdmFyIHBpZWNlcyA9IGtleS5zcGxpdCgvLSg/ISQpLyk7XG4gICAgICB2YXIgbGFzdFBpZWNlID0gcGllY2VzW3BpZWNlcy5sZW5ndGggLSAxXTtcbiAgICAgIGlmIChwaWVjZXMubGVuZ3RoID09IDEgJiYgcGllY2VzWzBdLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgIC8vIE5vLW1vZGlmaWVyIGJpbmRpbmdzIHVzZSBsaXRlcmFsIGNoYXJhY3RlciBiaW5kaW5ncyBhYm92ZS4gU2tpcC5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIGlmIChwaWVjZXMubGVuZ3RoID09IDIgJiYgcGllY2VzWzBdID09ICdTaGlmdCcgJiYgbGFzdFBpZWNlLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgIC8vIElnbm9yZSBTaGlmdCtjaGFyIGJpbmRpbmdzIGFzIHRoZXkgc2hvdWxkIGJlIGhhbmRsZWQgYnkgbGl0ZXJhbCBjaGFyYWN0ZXIuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHZhciBoYXNDaGFyYWN0ZXIgPSBmYWxzZTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGllY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwaWVjZSA9IHBpZWNlc1tpXTtcbiAgICAgICAgaWYgKHBpZWNlIGluIG1vZGlmaWVycykgeyBwaWVjZXNbaV0gPSBtb2RpZmllcnNbcGllY2VdOyB9XG4gICAgICAgIGVsc2UgeyBoYXNDaGFyYWN0ZXIgPSB0cnVlOyB9XG4gICAgICAgIGlmIChwaWVjZSBpbiBzcGVjaWFsS2V5cykgeyBwaWVjZXNbaV0gPSBzcGVjaWFsS2V5c1twaWVjZV07IH1cbiAgICAgIH1cbiAgICAgIGlmICghaGFzQ2hhcmFjdGVyKSB7XG4gICAgICAgIC8vIFZpbSBkb2VzIG5vdCBzdXBwb3J0IG1vZGlmaWVyIG9ubHkga2V5cy5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gVE9ETzogQ3VycmVudCBiaW5kaW5ncyBleHBlY3QgdGhlIGNoYXJhY3RlciB0byBiZSBsb3dlciBjYXNlLCBidXRcbiAgICAgIC8vIGl0IGxvb2tzIGxpa2UgdmltIGtleSBub3RhdGlvbiB1c2VzIHVwcGVyIGNhc2UuXG4gICAgICBpZiAoaXNVcHBlckNhc2UobGFzdFBpZWNlKSkge1xuICAgICAgICBwaWVjZXNbcGllY2VzLmxlbmd0aCAtIDFdID0gbGFzdFBpZWNlLnRvTG93ZXJDYXNlKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gJzwnICsgcGllY2VzLmpvaW4oJy0nKSArICc+JztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRPblBhc3RlRm4oY20pIHtcbiAgICAgIHZhciB2aW0gPSBjbS5zdGF0ZS52aW07XG4gICAgICBpZiAoIXZpbS5vblBhc3RlRm4pIHtcbiAgICAgICAgdmltLm9uUGFzdGVGbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICghdmltLmluc2VydE1vZGUpIHtcbiAgICAgICAgICAgIGNtLnNldEN1cnNvcihvZmZzZXRDdXJzb3IoY20uZ2V0Q3Vyc29yKCksIDAsIDEpKTtcbiAgICAgICAgICAgIGFjdGlvbnMuZW50ZXJJbnNlcnRNb2RlKGNtLCB7fSwgdmltKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gdmltLm9uUGFzdGVGbjtcbiAgICB9XG5cbiAgICB2YXIgbnVtYmVyUmVnZXggPSAvW1xcZF0vO1xuICAgIHZhciB3b3JkQ2hhclRlc3QgPSBbQ29kZU1pcnJvci5pc1dvcmRDaGFyLCBmdW5jdGlvbihjaCkge1xuICAgICAgcmV0dXJuIGNoICYmICFDb2RlTWlycm9yLmlzV29yZENoYXIoY2gpICYmICEvXFxzLy50ZXN0KGNoKTtcbiAgICB9XSwgYmlnV29yZENoYXJUZXN0ID0gW2Z1bmN0aW9uKGNoKSB7XG4gICAgICByZXR1cm4gL1xcUy8udGVzdChjaCk7XG4gICAgfV07XG4gICAgZnVuY3Rpb24gbWFrZUtleVJhbmdlKHN0YXJ0LCBzaXplKSB7XG4gICAgICB2YXIga2V5cyA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgc3RhcnQgKyBzaXplOyBpKyspIHtcbiAgICAgICAga2V5cy5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoaSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGtleXM7XG4gICAgfVxuICAgIHZhciB1cHBlckNhc2VBbHBoYWJldCA9IG1ha2VLZXlSYW5nZSg2NSwgMjYpO1xuICAgIHZhciBsb3dlckNhc2VBbHBoYWJldCA9IG1ha2VLZXlSYW5nZSg5NywgMjYpO1xuICAgIHZhciBudW1iZXJzID0gbWFrZUtleVJhbmdlKDQ4LCAxMCk7XG4gICAgdmFyIHZhbGlkTWFya3MgPSBbXS5jb25jYXQodXBwZXJDYXNlQWxwaGFiZXQsIGxvd2VyQ2FzZUFscGhhYmV0LCBudW1iZXJzLCBbJzwnLCAnPiddKTtcbiAgICB2YXIgdmFsaWRSZWdpc3RlcnMgPSBbXS5jb25jYXQodXBwZXJDYXNlQWxwaGFiZXQsIGxvd2VyQ2FzZUFscGhhYmV0LCBudW1iZXJzLCBbJy0nLCAnXCInLCAnLicsICc6JywgJy8nXSk7XG5cbiAgICBmdW5jdGlvbiBpc0xpbmUoY20sIGxpbmUpIHtcbiAgICAgIHJldHVybiBsaW5lID49IGNtLmZpcnN0TGluZSgpICYmIGxpbmUgPD0gY20ubGFzdExpbmUoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNMb3dlckNhc2Uoaykge1xuICAgICAgcmV0dXJuICgvXlthLXpdJC8pLnRlc3Qoayk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzTWF0Y2hhYmxlU3ltYm9sKGspIHtcbiAgICAgIHJldHVybiAnKClbXXt9Jy5pbmRleE9mKGspICE9IC0xO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc051bWJlcihrKSB7XG4gICAgICByZXR1cm4gbnVtYmVyUmVnZXgudGVzdChrKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNVcHBlckNhc2Uoaykge1xuICAgICAgcmV0dXJuICgvXltBLVpdJC8pLnRlc3Qoayk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzV2hpdGVTcGFjZVN0cmluZyhrKSB7XG4gICAgICByZXR1cm4gKC9eXFxzKiQvKS50ZXN0KGspO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc0VuZE9mU2VudGVuY2VTeW1ib2woaykge1xuICAgICAgcmV0dXJuICcuPyEnLmluZGV4T2YoaykgIT0gLTE7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGluQXJyYXkodmFsLCBhcnIpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhcnJbaV0gPT0gdmFsKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgIGZ1bmN0aW9uIGRlZmluZU9wdGlvbihuYW1lLCBkZWZhdWx0VmFsdWUsIHR5cGUsIGFsaWFzZXMsIGNhbGxiYWNrKSB7XG4gICAgICBpZiAoZGVmYXVsdFZhbHVlID09PSB1bmRlZmluZWQgJiYgIWNhbGxiYWNrKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdkZWZhdWx0VmFsdWUgaXMgcmVxdWlyZWQgdW5sZXNzIGNhbGxiYWNrIGlzIHByb3ZpZGVkJyk7XG4gICAgICB9XG4gICAgICBpZiAoIXR5cGUpIHsgdHlwZSA9ICdzdHJpbmcnOyB9XG4gICAgICBvcHRpb25zW25hbWVdID0ge1xuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBkZWZhdWx0VmFsdWU6IGRlZmF1bHRWYWx1ZSxcbiAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgICB9O1xuICAgICAgaWYgKGFsaWFzZXMpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGlhc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgb3B0aW9uc1thbGlhc2VzW2ldXSA9IG9wdGlvbnNbbmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgc2V0T3B0aW9uKG5hbWUsIGRlZmF1bHRWYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0T3B0aW9uKG5hbWUsIHZhbHVlLCBjbSwgY2ZnKSB7XG4gICAgICB2YXIgb3B0aW9uID0gb3B0aW9uc1tuYW1lXTtcbiAgICAgIGNmZyA9IGNmZyB8fCB7fTtcbiAgICAgIHZhciBzY29wZSA9IGNmZy5zY29wZTtcbiAgICAgIGlmICghb3B0aW9uKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ1Vua25vd24gb3B0aW9uOiAnICsgbmFtZSk7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9uLnR5cGUgPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZSAhPT0gdHJ1ZSkge1xuICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ0ludmFsaWQgYXJndW1lbnQ6ICcgKyBuYW1lICsgJz0nICsgdmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlICE9PSBmYWxzZSkge1xuICAgICAgICAgIC8vIEJvb2xlYW4gb3B0aW9ucyBhcmUgc2V0IHRvIHRydWUgaWYgdmFsdWUgaXMgbm90IGRlZmluZWQuXG4gICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9uLmNhbGxiYWNrKSB7XG4gICAgICAgIGlmIChzY29wZSAhPT0gJ2xvY2FsJykge1xuICAgICAgICAgIG9wdGlvbi5jYWxsYmFjayh2YWx1ZSwgdW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2NvcGUgIT09ICdnbG9iYWwnICYmIGNtKSB7XG4gICAgICAgICAgb3B0aW9uLmNhbGxiYWNrKHZhbHVlLCBjbSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzY29wZSAhPT0gJ2xvY2FsJykge1xuICAgICAgICAgIG9wdGlvbi52YWx1ZSA9IG9wdGlvbi50eXBlID09ICdib29sZWFuJyA/ICEhdmFsdWUgOiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2NvcGUgIT09ICdnbG9iYWwnICYmIGNtKSB7XG4gICAgICAgICAgY20uc3RhdGUudmltLm9wdGlvbnNbbmFtZV0gPSB7dmFsdWU6IHZhbHVlfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE9wdGlvbihuYW1lLCBjbSwgY2ZnKSB7XG4gICAgICB2YXIgb3B0aW9uID0gb3B0aW9uc1tuYW1lXTtcbiAgICAgIGNmZyA9IGNmZyB8fCB7fTtcbiAgICAgIHZhciBzY29wZSA9IGNmZy5zY29wZTtcbiAgICAgIGlmICghb3B0aW9uKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ1Vua25vd24gb3B0aW9uOiAnICsgbmFtZSk7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9uLmNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBsb2NhbCA9IGNtICYmIG9wdGlvbi5jYWxsYmFjayh1bmRlZmluZWQsIGNtKTtcbiAgICAgICAgaWYgKHNjb3BlICE9PSAnZ2xvYmFsJyAmJiBsb2NhbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzY29wZSAhPT0gJ2xvY2FsJykge1xuICAgICAgICAgIHJldHVybiBvcHRpb24uY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbG9jYWwgPSAoc2NvcGUgIT09ICdnbG9iYWwnKSAmJiAoY20gJiYgY20uc3RhdGUudmltLm9wdGlvbnNbbmFtZV0pO1xuICAgICAgICByZXR1cm4gKGxvY2FsIHx8IChzY29wZSAhPT0gJ2xvY2FsJykgJiYgb3B0aW9uIHx8IHt9KS52YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkZWZpbmVPcHRpb24oJ2ZpbGV0eXBlJywgdW5kZWZpbmVkLCAnc3RyaW5nJywgWydmdCddLCBmdW5jdGlvbihuYW1lLCBjbSkge1xuICAgICAgLy8gT3B0aW9uIGlzIGxvY2FsLiBEbyBub3RoaW5nIGZvciBnbG9iYWwuXG4gICAgICBpZiAoY20gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBUaGUgJ2ZpbGV0eXBlJyBvcHRpb24gcHJveGllcyB0byB0aGUgQ29kZU1pcnJvciAnbW9kZScgb3B0aW9uLlxuICAgICAgaWYgKG5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YXIgbW9kZSA9IGNtLmdldE9wdGlvbignbW9kZScpO1xuICAgICAgICByZXR1cm4gbW9kZSA9PSAnbnVsbCcgPyAnJyA6IG1vZGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbW9kZSA9IG5hbWUgPT0gJycgPyAnbnVsbCcgOiBuYW1lO1xuICAgICAgICBjbS5zZXRPcHRpb24oJ21vZGUnLCBtb2RlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjcmVhdGVDaXJjdWxhckp1bXBMaXN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2l6ZSA9IDEwMDtcbiAgICAgIHZhciBwb2ludGVyID0gLTE7XG4gICAgICB2YXIgaGVhZCA9IDA7XG4gICAgICB2YXIgdGFpbCA9IDA7XG4gICAgICB2YXIgYnVmZmVyID0gbmV3IEFycmF5KHNpemUpO1xuICAgICAgZnVuY3Rpb24gYWRkKGNtLCBvbGRDdXIsIG5ld0N1cikge1xuICAgICAgICB2YXIgY3VycmVudCA9IHBvaW50ZXIgJSBzaXplO1xuICAgICAgICB2YXIgY3VyTWFyayA9IGJ1ZmZlcltjdXJyZW50XTtcbiAgICAgICAgZnVuY3Rpb24gdXNlTmV4dFNsb3QoY3Vyc29yKSB7XG4gICAgICAgICAgdmFyIG5leHQgPSArK3BvaW50ZXIgJSBzaXplO1xuICAgICAgICAgIHZhciB0cmFzaE1hcmsgPSBidWZmZXJbbmV4dF07XG4gICAgICAgICAgaWYgKHRyYXNoTWFyaykge1xuICAgICAgICAgICAgdHJhc2hNYXJrLmNsZWFyKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJ1ZmZlcltuZXh0XSA9IGNtLnNldEJvb2ttYXJrKGN1cnNvcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN1ck1hcmspIHtcbiAgICAgICAgICB2YXIgbWFya1BvcyA9IGN1ck1hcmsuZmluZCgpO1xuICAgICAgICAgIC8vIGF2b2lkIHJlY29yZGluZyByZWR1bmRhbnQgY3Vyc29yIHBvc2l0aW9uXG4gICAgICAgICAgaWYgKG1hcmtQb3MgJiYgIWN1cnNvckVxdWFsKG1hcmtQb3MsIG9sZEN1cikpIHtcbiAgICAgICAgICAgIHVzZU5leHRTbG90KG9sZEN1cik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVzZU5leHRTbG90KG9sZEN1cik7XG4gICAgICAgIH1cbiAgICAgICAgdXNlTmV4dFNsb3QobmV3Q3VyKTtcbiAgICAgICAgaGVhZCA9IHBvaW50ZXI7XG4gICAgICAgIHRhaWwgPSBwb2ludGVyIC0gc2l6ZSArIDE7XG4gICAgICAgIGlmICh0YWlsIDwgMCkge1xuICAgICAgICAgIHRhaWwgPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBtb3ZlKGNtLCBvZmZzZXQpIHtcbiAgICAgICAgcG9pbnRlciArPSBvZmZzZXQ7XG4gICAgICAgIGlmIChwb2ludGVyID4gaGVhZCkge1xuICAgICAgICAgIHBvaW50ZXIgPSBoZWFkO1xuICAgICAgICB9IGVsc2UgaWYgKHBvaW50ZXIgPCB0YWlsKSB7XG4gICAgICAgICAgcG9pbnRlciA9IHRhaWw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1hcmsgPSBidWZmZXJbKHNpemUgKyBwb2ludGVyKSAlIHNpemVdO1xuICAgICAgICAvLyBza2lwIG1hcmtzIHRoYXQgYXJlIHRlbXBvcmFyaWx5IHJlbW92ZWQgZnJvbSB0ZXh0IGJ1ZmZlclxuICAgICAgICBpZiAobWFyayAmJiAhbWFyay5maW5kKCkpIHtcbiAgICAgICAgICB2YXIgaW5jID0gb2Zmc2V0ID4gMCA/IDEgOiAtMTtcbiAgICAgICAgICB2YXIgbmV3Q3VyO1xuICAgICAgICAgIHZhciBvbGRDdXIgPSBjbS5nZXRDdXJzb3IoKTtcbiAgICAgICAgICBkbyB7XG4gICAgICAgICAgICBwb2ludGVyICs9IGluYztcbiAgICAgICAgICAgIG1hcmsgPSBidWZmZXJbKHNpemUgKyBwb2ludGVyKSAlIHNpemVdO1xuICAgICAgICAgICAgLy8gc2tpcCBtYXJrcyB0aGF0IGFyZSB0aGUgc2FtZSBhcyBjdXJyZW50IHBvc2l0aW9uXG4gICAgICAgICAgICBpZiAobWFyayAmJlxuICAgICAgICAgICAgICAgIChuZXdDdXIgPSBtYXJrLmZpbmQoKSkgJiZcbiAgICAgICAgICAgICAgICAhY3Vyc29yRXF1YWwob2xkQ3VyLCBuZXdDdXIpKSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gd2hpbGUgKHBvaW50ZXIgPCBoZWFkICYmIHBvaW50ZXIgPiB0YWlsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWFyaztcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNhY2hlZEN1cnNvcjogdW5kZWZpbmVkLCAvL3VzZWQgZm9yICMgYW5kICoganVtcHNcbiAgICAgICAgYWRkOiBhZGQsXG4gICAgICAgIG1vdmU6IG1vdmVcbiAgICAgIH07XG4gICAgfTtcblxuICAgIC8vIFJldHVybnMgYW4gb2JqZWN0IHRvIHRyYWNrIHRoZSBjaGFuZ2VzIGFzc29jaWF0ZWQgaW5zZXJ0IG1vZGUuICBJdFxuICAgIC8vIGNsb25lcyB0aGUgb2JqZWN0IHRoYXQgaXMgcGFzc2VkIGluLCBvciBjcmVhdGVzIGFuIGVtcHR5IG9iamVjdCBvbmUgaWZcbiAgICAvLyBub25lIGlzIHByb3ZpZGVkLlxuICAgIHZhciBjcmVhdGVJbnNlcnRNb2RlQ2hhbmdlcyA9IGZ1bmN0aW9uKGMpIHtcbiAgICAgIGlmIChjKSB7XG4gICAgICAgIC8vIENvcHkgY29uc3RydWN0aW9uXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY2hhbmdlczogYy5jaGFuZ2VzLFxuICAgICAgICAgIGV4cGVjdEN1cnNvckFjdGl2aXR5Rm9yQ2hhbmdlOiBjLmV4cGVjdEN1cnNvckFjdGl2aXR5Rm9yQ2hhbmdlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICAvLyBDaGFuZ2UgbGlzdFxuICAgICAgICBjaGFuZ2VzOiBbXSxcbiAgICAgICAgLy8gU2V0IHRvIHRydWUgb24gY2hhbmdlLCBmYWxzZSBvbiBjdXJzb3JBY3Rpdml0eS5cbiAgICAgICAgZXhwZWN0Q3Vyc29yQWN0aXZpdHlGb3JDaGFuZ2U6IGZhbHNlXG4gICAgICB9O1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBNYWNyb01vZGVTdGF0ZSgpIHtcbiAgICAgIHRoaXMubGF0ZXN0UmVnaXN0ZXIgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmlzUGxheWluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5pc1JlY29yZGluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5yZXBsYXlTZWFyY2hRdWVyaWVzID0gW107XG4gICAgICB0aGlzLm9uUmVjb3JkaW5nRG9uZSA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMubGFzdEluc2VydE1vZGVDaGFuZ2VzID0gY3JlYXRlSW5zZXJ0TW9kZUNoYW5nZXMoKTtcbiAgICB9XG4gICAgTWFjcm9Nb2RlU3RhdGUucHJvdG90eXBlID0ge1xuICAgICAgZXhpdE1hY3JvUmVjb3JkTW9kZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtYWNyb01vZGVTdGF0ZSA9IHZpbUdsb2JhbFN0YXRlLm1hY3JvTW9kZVN0YXRlO1xuICAgICAgICBpZiAobWFjcm9Nb2RlU3RhdGUub25SZWNvcmRpbmdEb25lKSB7XG4gICAgICAgICAgbWFjcm9Nb2RlU3RhdGUub25SZWNvcmRpbmdEb25lKCk7IC8vIGNsb3NlIGRpYWxvZ1xuICAgICAgICB9XG4gICAgICAgIG1hY3JvTW9kZVN0YXRlLm9uUmVjb3JkaW5nRG9uZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgbWFjcm9Nb2RlU3RhdGUuaXNSZWNvcmRpbmcgPSBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBlbnRlck1hY3JvUmVjb3JkTW9kZTogZnVuY3Rpb24oY20sIHJlZ2lzdGVyTmFtZSkge1xuICAgICAgICB2YXIgcmVnaXN0ZXIgPVxuICAgICAgICAgICAgdmltR2xvYmFsU3RhdGUucmVnaXN0ZXJDb250cm9sbGVyLmdldFJlZ2lzdGVyKHJlZ2lzdGVyTmFtZSk7XG4gICAgICAgIGlmIChyZWdpc3Rlcikge1xuICAgICAgICAgIHJlZ2lzdGVyLmNsZWFyKCk7XG4gICAgICAgICAgdGhpcy5sYXRlc3RSZWdpc3RlciA9IHJlZ2lzdGVyTmFtZTtcbiAgICAgICAgICBpZiAoY20ub3BlbkRpYWxvZykge1xuICAgICAgICAgICAgdGhpcy5vblJlY29yZGluZ0RvbmUgPSBjbS5vcGVuRGlhbG9nKFxuICAgICAgICAgICAgICAgICcocmVjb3JkaW5nKVsnK3JlZ2lzdGVyTmFtZSsnXScsIG51bGwsIHtib3R0b206dHJ1ZX0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmlzUmVjb3JkaW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBtYXliZUluaXRWaW1TdGF0ZShjbSkge1xuICAgICAgaWYgKCFjbS5zdGF0ZS52aW0pIHtcbiAgICAgICAgLy8gU3RvcmUgaW5zdGFuY2Ugc3RhdGUgaW4gdGhlIENvZGVNaXJyb3Igb2JqZWN0LlxuICAgICAgICBjbS5zdGF0ZS52aW0gPSB7XG4gICAgICAgICAgaW5wdXRTdGF0ZTogbmV3IElucHV0U3RhdGUoKSxcbiAgICAgICAgICAvLyBWaW0ncyBpbnB1dCBzdGF0ZSB0aGF0IHRyaWdnZXJlZCB0aGUgbGFzdCBlZGl0LCB1c2VkIHRvIHJlcGVhdFxuICAgICAgICAgIC8vIG1vdGlvbnMgYW5kIG9wZXJhdG9ycyB3aXRoICcuJy5cbiAgICAgICAgICBsYXN0RWRpdElucHV0U3RhdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAvLyBWaW0ncyBhY3Rpb24gY29tbWFuZCBiZWZvcmUgdGhlIGxhc3QgZWRpdCwgdXNlZCB0byByZXBlYXQgYWN0aW9uc1xuICAgICAgICAgIC8vIHdpdGggJy4nIGFuZCBpbnNlcnQgbW9kZSByZXBlYXQuXG4gICAgICAgICAgbGFzdEVkaXRBY3Rpb25Db21tYW5kOiB1bmRlZmluZWQsXG4gICAgICAgICAgLy8gV2hlbiB1c2luZyBqayBmb3IgbmF2aWdhdGlvbiwgaWYgeW91IG1vdmUgZnJvbSBhIGxvbmdlciBsaW5lIHRvIGFcbiAgICAgICAgICAvLyBzaG9ydGVyIGxpbmUsIHRoZSBjdXJzb3IgbWF5IGNsaXAgdG8gdGhlIGVuZCBvZiB0aGUgc2hvcnRlciBsaW5lLlxuICAgICAgICAgIC8vIElmIGogaXMgcHJlc3NlZCBhZ2FpbiBhbmQgY3Vyc29yIGdvZXMgdG8gdGhlIG5leHQgbGluZSwgdGhlXG4gICAgICAgICAgLy8gY3Vyc29yIHNob3VsZCBnbyBiYWNrIHRvIGl0cyBob3Jpem9udGFsIHBvc2l0aW9uIG9uIHRoZSBsb25nZXJcbiAgICAgICAgICAvLyBsaW5lIGlmIGl0IGNhbi4gVGhpcyBpcyB0byBrZWVwIHRyYWNrIG9mIHRoZSBob3Jpem9udGFsIHBvc2l0aW9uLlxuICAgICAgICAgIGxhc3RIUG9zOiAtMSxcbiAgICAgICAgICAvLyBEb2luZyB0aGUgc2FtZSB3aXRoIHNjcmVlbi1wb3NpdGlvbiBmb3IgZ2ovZ2tcbiAgICAgICAgICBsYXN0SFNQb3M6IC0xLFxuICAgICAgICAgIC8vIFRoZSBsYXN0IG1vdGlvbiBjb21tYW5kIHJ1bi4gQ2xlYXJlZCBpZiBhIG5vbi1tb3Rpb24gY29tbWFuZCBnZXRzXG4gICAgICAgICAgLy8gZXhlY3V0ZWQgaW4gYmV0d2Vlbi5cbiAgICAgICAgICBsYXN0TW90aW9uOiBudWxsLFxuICAgICAgICAgIG1hcmtzOiB7fSxcbiAgICAgICAgICAvLyBNYXJrIGZvciByZW5kZXJpbmcgZmFrZSBjdXJzb3IgZm9yIHZpc3VhbCBtb2RlLlxuICAgICAgICAgIGZha2VDdXJzb3I6IG51bGwsXG4gICAgICAgICAgaW5zZXJ0TW9kZTogZmFsc2UsXG4gICAgICAgICAgLy8gUmVwZWF0IGNvdW50IGZvciBjaGFuZ2VzIG1hZGUgaW4gaW5zZXJ0IG1vZGUsIHRyaWdnZXJlZCBieSBrZXlcbiAgICAgICAgICAvLyBzZXF1ZW5jZXMgbGlrZSAzLGkuIE9ubHkgZXhpc3RzIHdoZW4gaW5zZXJ0TW9kZSBpcyB0cnVlLlxuICAgICAgICAgIGluc2VydE1vZGVSZXBlYXQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICB2aXN1YWxNb2RlOiBmYWxzZSxcbiAgICAgICAgICAvLyBJZiB3ZSBhcmUgaW4gdmlzdWFsIGxpbmUgbW9kZS4gTm8gZWZmZWN0IGlmIHZpc3VhbE1vZGUgaXMgZmFsc2UuXG4gICAgICAgICAgdmlzdWFsTGluZTogZmFsc2UsXG4gICAgICAgICAgdmlzdWFsQmxvY2s6IGZhbHNlLFxuICAgICAgICAgIGxhc3RTZWxlY3Rpb246IG51bGwsXG4gICAgICAgICAgbGFzdFBhc3RlZFRleHQ6IG51bGwsXG4gICAgICAgICAgc2VsOiB7fSxcbiAgICAgICAgICAvLyBCdWZmZXItbG9jYWwvd2luZG93LWxvY2FsIHZhbHVlcyBvZiB2aW0gb3B0aW9ucy5cbiAgICAgICAgICBvcHRpb25zOiB7fVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNtLnN0YXRlLnZpbTtcbiAgICB9XG4gICAgdmFyIHZpbUdsb2JhbFN0YXRlO1xuICAgIGZ1bmN0aW9uIHJlc2V0VmltR2xvYmFsU3RhdGUoKSB7XG4gICAgICB2aW1HbG9iYWxTdGF0ZSA9IHtcbiAgICAgICAgLy8gVGhlIGN1cnJlbnQgc2VhcmNoIHF1ZXJ5LlxuICAgICAgICBzZWFyY2hRdWVyeTogbnVsbCxcbiAgICAgICAgLy8gV2hldGhlciB3ZSBhcmUgc2VhcmNoaW5nIGJhY2t3YXJkcy5cbiAgICAgICAgc2VhcmNoSXNSZXZlcnNlZDogZmFsc2UsXG4gICAgICAgIC8vIFJlcGxhY2UgcGFydCBvZiB0aGUgbGFzdCBzdWJzdGl0dXRlZCBwYXR0ZXJuXG4gICAgICAgIGxhc3RTdWJzdGl0dXRlUmVwbGFjZVBhcnQ6IHVuZGVmaW5lZCxcbiAgICAgICAganVtcExpc3Q6IGNyZWF0ZUNpcmN1bGFySnVtcExpc3QoKSxcbiAgICAgICAgbWFjcm9Nb2RlU3RhdGU6IG5ldyBNYWNyb01vZGVTdGF0ZSxcbiAgICAgICAgLy8gUmVjb3JkaW5nIGxhdGVzdCBmLCB0LCBGIG9yIFQgbW90aW9uIGNvbW1hbmQuXG4gICAgICAgIGxhc3RDaGFyYWN0ZXJTZWFyY2g6IHtpbmNyZW1lbnQ6MCwgZm9yd2FyZDp0cnVlLCBzZWxlY3RlZENoYXJhY3RlcjonJ30sXG4gICAgICAgIHJlZ2lzdGVyQ29udHJvbGxlcjogbmV3IFJlZ2lzdGVyQ29udHJvbGxlcih7fSksXG4gICAgICAgIC8vIHNlYXJjaCBoaXN0b3J5IGJ1ZmZlclxuICAgICAgICBzZWFyY2hIaXN0b3J5Q29udHJvbGxlcjogbmV3IEhpc3RvcnlDb250cm9sbGVyKCksXG4gICAgICAgIC8vIGV4IENvbW1hbmQgaGlzdG9yeSBidWZmZXJcbiAgICAgICAgZXhDb21tYW5kSGlzdG9yeUNvbnRyb2xsZXIgOiBuZXcgSGlzdG9yeUNvbnRyb2xsZXIoKVxuICAgICAgfTtcbiAgICAgIGZvciAodmFyIG9wdGlvbk5hbWUgaW4gb3B0aW9ucykge1xuICAgICAgICB2YXIgb3B0aW9uID0gb3B0aW9uc1tvcHRpb25OYW1lXTtcbiAgICAgICAgb3B0aW9uLnZhbHVlID0gb3B0aW9uLmRlZmF1bHRWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGFzdEluc2VydE1vZGVLZXlUaW1lcjtcbiAgICB2YXIgdmltQXBpPSB7XG4gICAgICBidWlsZEtleU1hcDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIFRPRE86IENvbnZlcnQga2V5bWFwIGludG8gZGljdGlvbmFyeSBmb3JtYXQgZm9yIGZhc3QgbG9va3VwLlxuICAgICAgfSxcbiAgICAgIC8vIFRlc3RpbmcgaG9vaywgdGhvdWdoIGl0IG1pZ2h0IGJlIHVzZWZ1bCB0byBleHBvc2UgdGhlIHJlZ2lzdGVyXG4gICAgICAvLyBjb250cm9sbGVyIGFueXdheXMuXG4gICAgICBnZXRSZWdpc3RlckNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdmltR2xvYmFsU3RhdGUucmVnaXN0ZXJDb250cm9sbGVyO1xuICAgICAgfSxcbiAgICAgIC8vIFRlc3RpbmcgaG9vay5cbiAgICAgIHJlc2V0VmltR2xvYmFsU3RhdGVfOiByZXNldFZpbUdsb2JhbFN0YXRlLFxuXG4gICAgICAvLyBUZXN0aW5nIGhvb2suXG4gICAgICBnZXRWaW1HbG9iYWxTdGF0ZV86IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdmltR2xvYmFsU3RhdGU7XG4gICAgICB9LFxuXG4gICAgICAvLyBUZXN0aW5nIGhvb2suXG4gICAgICBtYXliZUluaXRWaW1TdGF0ZV86IG1heWJlSW5pdFZpbVN0YXRlLFxuXG4gICAgICBzdXBwcmVzc0Vycm9yTG9nZ2luZzogZmFsc2UsXG5cbiAgICAgIEluc2VydE1vZGVLZXk6IEluc2VydE1vZGVLZXksXG4gICAgICBtYXA6IGZ1bmN0aW9uKGxocywgcmhzLCBjdHgpIHtcbiAgICAgICAgLy8gQWRkIHVzZXIgZGVmaW5lZCBrZXkgYmluZGluZ3MuXG4gICAgICAgIGV4Q29tbWFuZERpc3BhdGNoZXIubWFwKGxocywgcmhzLCBjdHgpO1xuICAgICAgfSxcbiAgICAgIHVubWFwOiBmdW5jdGlvbihsaHMsIGN0eCkge1xuICAgICAgICBleENvbW1hbmREaXNwYXRjaGVyLnVubWFwKGxocywgY3R4KTtcbiAgICAgIH0sXG4gICAgICAvLyBOb24tcmVjdXJzaXZlIG1hcCBmdW5jdGlvbi5cbiAgICAgIC8vIE5PVEU6IFRoaXMgd2lsbCBub3QgY3JlYXRlIG1hcHBpbmdzIHRvIGtleSBtYXBzIHRoYXQgYXJlbid0IHByZXNlbnRcbiAgICAgIC8vIGluIHRoZSBkZWZhdWx0IGtleSBtYXAuIFNlZSBUT0RPIGF0IGJvdHRvbSBvZiBmdW5jdGlvbi5cbiAgICAgIG5vcmVtYXA6IGZ1bmN0aW9uKGxocywgcmhzLCBjdHgpIHtcbiAgICAgICAgZnVuY3Rpb24gdG9DdHhBcnJheShjdHgpIHtcbiAgICAgICAgICByZXR1cm4gY3R4ID8gW2N0eF0gOiBbJ25vcm1hbCcsICdpbnNlcnQnLCAndmlzdWFsJ107XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGN0eHNUb01hcCA9IHRvQ3R4QXJyYXkoY3R4KTtcbiAgICAgICAgLy8gTG9vayB0aHJvdWdoIGFsbCBhY3R1YWwgZGVmYXVsdHMgdG8gZmluZCBhIG1hcCBjYW5kaWRhdGUuXG4gICAgICAgIHZhciBhY3R1YWxMZW5ndGggPSBkZWZhdWx0S2V5bWFwLmxlbmd0aCwgb3JpZ0xlbmd0aCA9IGRlZmF1bHRLZXltYXBMZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGkgPSBhY3R1YWxMZW5ndGggLSBvcmlnTGVuZ3RoO1xuICAgICAgICAgICAgIGkgPCBhY3R1YWxMZW5ndGggJiYgY3R4c1RvTWFwLmxlbmd0aDtcbiAgICAgICAgICAgICBpKyspIHtcbiAgICAgICAgICB2YXIgbWFwcGluZyA9IGRlZmF1bHRLZXltYXBbaV07XG4gICAgICAgICAgLy8gT21pdCBtYXBwaW5ncyB0aGF0IG9wZXJhdGUgaW4gdGhlIHdyb25nIGNvbnRleHQocykgYW5kIHRob3NlIG9mIGludmFsaWQgdHlwZS5cbiAgICAgICAgICBpZiAobWFwcGluZy5rZXlzID09IHJocyAmJlxuICAgICAgICAgICAgICAoIWN0eCB8fCAhbWFwcGluZy5jb250ZXh0IHx8IG1hcHBpbmcuY29udGV4dCA9PT0gY3R4KSAmJlxuICAgICAgICAgICAgICBtYXBwaW5nLnR5cGUuc3Vic3RyKDAsIDIpICE9PSAnZXgnICYmXG4gICAgICAgICAgICAgIG1hcHBpbmcudHlwZS5zdWJzdHIoMCwgMykgIT09ICdrZXknKSB7XG4gICAgICAgICAgICAvLyBNYWtlIGEgc2hhbGxvdyBjb3B5IG9mIHRoZSBvcmlnaW5hbCBrZXltYXAgZW50cnkuXG4gICAgICAgICAgICB2YXIgbmV3TWFwcGluZyA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIG1hcHBpbmcpIHtcbiAgICAgICAgICAgICAgbmV3TWFwcGluZ1trZXldID0gbWFwcGluZ1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTW9kaWZ5IGl0IHBvaW50IHRvIHRoZSBuZXcgbWFwcGluZyB3aXRoIHRoZSBwcm9wZXIgY29udGV4dC5cbiAgICAgICAgICAgIG5ld01hcHBpbmcua2V5cyA9IGxocztcbiAgICAgICAgICAgIGlmIChjdHggJiYgIW5ld01hcHBpbmcuY29udGV4dCkge1xuICAgICAgICAgICAgICBuZXdNYXBwaW5nLmNvbnRleHQgPSBjdHg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBBZGQgaXQgdG8gdGhlIGtleW1hcCB3aXRoIGEgaGlnaGVyIHByaW9yaXR5IHRoYW4gdGhlIG9yaWdpbmFsLlxuICAgICAgICAgICAgdGhpcy5fbWFwQ29tbWFuZChuZXdNYXBwaW5nKTtcbiAgICAgICAgICAgIC8vIFJlY29yZCB0aGUgbWFwcGVkIGNvbnRleHRzIGFzIGNvbXBsZXRlLlxuICAgICAgICAgICAgdmFyIG1hcHBlZEN0eHMgPSB0b0N0eEFycmF5KG1hcHBpbmcuY29udGV4dCk7XG4gICAgICAgICAgICBjdHhzVG9NYXAgPSBjdHhzVG9NYXAuZmlsdGVyKGZ1bmN0aW9uKGVsKSB7IHJldHVybiBtYXBwZWRDdHhzLmluZGV4T2YoZWwpID09PSAtMTsgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFRPRE86IENyZWF0ZSBub24tcmVjdXJzaXZlIGtleVRvS2V5IG1hcHBpbmdzIGZvciB0aGUgdW5tYXBwZWQgY29udGV4dHMgb25jZSB0aG9zZSBleGlzdC5cbiAgICAgIH0sXG4gICAgICAvLyBSZW1vdmUgYWxsIHVzZXItZGVmaW5lZCBtYXBwaW5ncyBmb3IgdGhlIHByb3ZpZGVkIGNvbnRleHQuXG4gICAgICBtYXBjbGVhcjogZnVuY3Rpb24oY3R4KSB7XG4gICAgICAgIC8vIFBhcnRpdGlvbiB0aGUgZXhpc3Rpbmcga2V5bWFwIGludG8gdXNlci1kZWZpbmVkIGFuZCB0cnVlIGRlZmF1bHRzLlxuICAgICAgICB2YXIgYWN0dWFsTGVuZ3RoID0gZGVmYXVsdEtleW1hcC5sZW5ndGgsXG4gICAgICAgICAgICBvcmlnTGVuZ3RoID0gZGVmYXVsdEtleW1hcExlbmd0aDtcbiAgICAgICAgdmFyIHVzZXJLZXltYXAgPSBkZWZhdWx0S2V5bWFwLnNsaWNlKDAsIGFjdHVhbExlbmd0aCAtIG9yaWdMZW5ndGgpO1xuICAgICAgICBkZWZhdWx0S2V5bWFwID0gZGVmYXVsdEtleW1hcC5zbGljZShhY3R1YWxMZW5ndGggLSBvcmlnTGVuZ3RoKTtcbiAgICAgICAgaWYgKGN0eCkge1xuICAgICAgICAgIC8vIElmIGEgc3BlY2lmaWMgY29udGV4dCBpcyBiZWluZyBjbGVhcmVkLCB3ZSBuZWVkIHRvIGtlZXAgbWFwcGluZ3NcbiAgICAgICAgICAvLyBmcm9tIGFsbCBvdGhlciBjb250ZXh0cy5cbiAgICAgICAgICBmb3IgKHZhciBpID0gdXNlcktleW1hcC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdmFyIG1hcHBpbmcgPSB1c2VyS2V5bWFwW2ldO1xuICAgICAgICAgICAgaWYgKGN0eCAhPT0gbWFwcGluZy5jb250ZXh0KSB7XG4gICAgICAgICAgICAgIGlmIChtYXBwaW5nLmNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXBDb21tYW5kKG1hcHBpbmcpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGBtYXBwaW5nYCBhcHBsaWVzIHRvIGFsbCBjb250ZXh0cyBzbyBjcmVhdGUga2V5bWFwIGNvcGllc1xuICAgICAgICAgICAgICAgIC8vIGZvciBlYWNoIGNvbnRleHQgZXhjZXB0IHRoZSBvbmUgYmVpbmcgY2xlYXJlZC5cbiAgICAgICAgICAgICAgICB2YXIgY29udGV4dHMgPSBbJ25vcm1hbCcsICdpbnNlcnQnLCAndmlzdWFsJ107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBjb250ZXh0cykge1xuICAgICAgICAgICAgICAgICAgaWYgKGNvbnRleHRzW2pdICE9PSBjdHgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld01hcHBpbmcgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIG1hcHBpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICBuZXdNYXBwaW5nW2tleV0gPSBtYXBwaW5nW2tleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV3TWFwcGluZy5jb250ZXh0ID0gY29udGV4dHNbal07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21hcENvbW1hbmQobmV3TWFwcGluZyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gVE9ETzogRXhwb3NlIHNldE9wdGlvbiBhbmQgZ2V0T3B0aW9uIGFzIGluc3RhbmNlIG1ldGhvZHMuIE5lZWQgdG8gZGVjaWRlIGhvdyB0byBuYW1lc3BhY2VcbiAgICAgIC8vIHRoZW0sIG9yIHNvbWVob3cgbWFrZSB0aGVtIHdvcmsgd2l0aCB0aGUgZXhpc3RpbmcgQ29kZU1pcnJvciBzZXRPcHRpb24vZ2V0T3B0aW9uIEFQSS5cbiAgICAgIHNldE9wdGlvbjogc2V0T3B0aW9uLFxuICAgICAgZ2V0T3B0aW9uOiBnZXRPcHRpb24sXG4gICAgICBkZWZpbmVPcHRpb246IGRlZmluZU9wdGlvbixcbiAgICAgIGRlZmluZUV4OiBmdW5jdGlvbihuYW1lLCBwcmVmaXgsIGZ1bmMpe1xuICAgICAgICBpZiAoIXByZWZpeCkge1xuICAgICAgICAgIHByZWZpeCA9IG5hbWU7XG4gICAgICAgIH0gZWxzZSBpZiAobmFtZS5pbmRleE9mKHByZWZpeCkgIT09IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJyhWaW0uZGVmaW5lRXgpIFwiJytwcmVmaXgrJ1wiIGlzIG5vdCBhIHByZWZpeCBvZiBcIicrbmFtZSsnXCIsIGNvbW1hbmQgbm90IHJlZ2lzdGVyZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBleENvbW1hbmRzW25hbWVdPWZ1bmM7XG4gICAgICAgIGV4Q29tbWFuZERpc3BhdGNoZXIuY29tbWFuZE1hcF9bcHJlZml4XT17bmFtZTpuYW1lLCBzaG9ydE5hbWU6cHJlZml4LCB0eXBlOidhcGknfTtcbiAgICAgIH0sXG4gICAgICBoYW5kbGVLZXk6IGZ1bmN0aW9uIChjbSwga2V5LCBvcmlnaW4pIHtcbiAgICAgICAgdmFyIGNvbW1hbmQgPSB0aGlzLmZpbmRLZXkoY20sIGtleSwgb3JpZ2luKTtcbiAgICAgICAgaWYgKHR5cGVvZiBjb21tYW5kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbW1hbmQoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8qKlxuICAgICAgICogVGhpcyBpcyB0aGUgb3V0ZXJtb3N0IGZ1bmN0aW9uIGNhbGxlZCBieSBDb2RlTWlycm9yLCBhZnRlciBrZXlzIGhhdmVcbiAgICAgICAqIGJlZW4gbWFwcGVkIHRvIHRoZWlyIFZpbSBlcXVpdmFsZW50cy5cbiAgICAgICAqXG4gICAgICAgKiBGaW5kcyBhIGNvbW1hbmQgYmFzZWQgb24gdGhlIGtleSAoYW5kIGNhY2hlZCBrZXlzIGlmIHRoZXJlIGlzIGFcbiAgICAgICAqIG11bHRpLWtleSBzZXF1ZW5jZSkuIFJldHVybnMgYHVuZGVmaW5lZGAgaWYgbm8ga2V5IGlzIG1hdGNoZWQsIGEgbm9vcFxuICAgICAgICogZnVuY3Rpb24gaWYgYSBwYXJ0aWFsIG1hdGNoIGlzIGZvdW5kIChtdWx0aS1rZXkpLCBhbmQgYSBmdW5jdGlvbiB0b1xuICAgICAgICogZXhlY3V0ZSB0aGUgYm91bmQgY29tbWFuZCBpZiBhIGEga2V5IGlzIG1hdGNoZWQuIFRoZSBmdW5jdGlvbiBhbHdheXNcbiAgICAgICAqIHJldHVybnMgdHJ1ZS5cbiAgICAgICAqL1xuICAgICAgZmluZEtleTogZnVuY3Rpb24oY20sIGtleSwgb3JpZ2luKSB7XG4gICAgICAgIHZhciB2aW0gPSBtYXliZUluaXRWaW1TdGF0ZShjbSk7XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZU1hY3JvUmVjb3JkaW5nKCkge1xuICAgICAgICAgIHZhciBtYWNyb01vZGVTdGF0ZSA9IHZpbUdsb2JhbFN0YXRlLm1hY3JvTW9kZVN0YXRlO1xuICAgICAgICAgIGlmIChtYWNyb01vZGVTdGF0ZS5pc1JlY29yZGluZykge1xuICAgICAgICAgICAgaWYgKGtleSA9PSAncScpIHtcbiAgICAgICAgICAgICAgbWFjcm9Nb2RlU3RhdGUuZXhpdE1hY3JvUmVjb3JkTW9kZSgpO1xuICAgICAgICAgICAgICBjbGVhcklucHV0U3RhdGUoY20pO1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcmlnaW4gIT0gJ21hcHBpbmcnKSB7XG4gICAgICAgICAgICAgIGxvZ0tleShtYWNyb01vZGVTdGF0ZSwga2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlRXNjKCkge1xuICAgICAgICAgIGlmIChrZXkgPT0gJzxFc2M+Jykge1xuICAgICAgICAgICAgLy8gQ2xlYXIgaW5wdXQgc3RhdGUgYW5kIGdldCBiYWNrIHRvIG5vcm1hbCBtb2RlLlxuICAgICAgICAgICAgY2xlYXJJbnB1dFN0YXRlKGNtKTtcbiAgICAgICAgICAgIGlmICh2aW0udmlzdWFsTW9kZSkge1xuICAgICAgICAgICAgICBleGl0VmlzdWFsTW9kZShjbSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZpbS5pbnNlcnRNb2RlKSB7XG4gICAgICAgICAgICAgIGV4aXRJbnNlcnRNb2RlKGNtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkb0tleVRvS2V5KGtleXMpIHtcbiAgICAgICAgICAvLyBUT0RPOiBwcmV2ZW50IGluZmluaXRlIHJlY3Vyc2lvbi5cbiAgICAgICAgICB2YXIgbWF0Y2g7XG4gICAgICAgICAgd2hpbGUgKGtleXMpIHtcbiAgICAgICAgICAgIC8vIFB1bGwgb2ZmIG9uZSBjb21tYW5kIGtleSwgd2hpY2ggaXMgZWl0aGVyIGEgc2luZ2xlIGNoYXJhY3RlclxuICAgICAgICAgICAgLy8gb3IgYSBzcGVjaWFsIHNlcXVlbmNlIHdyYXBwZWQgaW4gJzwnIGFuZCAnPicsIGUuZy4gJzxTcGFjZT4nLlxuICAgICAgICAgICAgbWF0Y2ggPSAoLzxcXHcrLS4rPz58PFxcdys+fC4vKS5leGVjKGtleXMpO1xuICAgICAgICAgICAga2V5ID0gbWF0Y2hbMF07XG4gICAgICAgICAgICBrZXlzID0ga2V5cy5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBrZXkubGVuZ3RoKTtcbiAgICAgICAgICAgIENvZGVNaXJyb3IuVmltLmhhbmRsZUtleShjbSwga2V5LCAnbWFwcGluZycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUtleUluc2VydE1vZGUoKSB7XG4gICAgICAgICAgaWYgKGhhbmRsZUVzYygpKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICAgICAgdmFyIGtleXMgPSB2aW0uaW5wdXRTdGF0ZS5rZXlCdWZmZXIgPSB2aW0uaW5wdXRTdGF0ZS5rZXlCdWZmZXIgKyBrZXk7XG4gICAgICAgICAgdmFyIGtleXNBcmVDaGFycyA9IGtleS5sZW5ndGggPT0gMTtcbiAgICAgICAgICB2YXIgbWF0Y2ggPSBjb21tYW5kRGlzcGF0Y2hlci5tYXRjaENvbW1hbmQoa2V5cywgZGVmYXVsdEtleW1hcCwgdmltLmlucHV0U3RhdGUsICdpbnNlcnQnKTtcbiAgICAgICAgICAvLyBOZWVkIHRvIGNoZWNrIGFsbCBrZXkgc3Vic3RyaW5ncyBpbiBpbnNlcnQgbW9kZS5cbiAgICAgICAgICB3aGlsZSAoa2V5cy5sZW5ndGggPiAxICYmIG1hdGNoLnR5cGUgIT0gJ2Z1bGwnKSB7XG4gICAgICAgICAgICB2YXIga2V5cyA9IHZpbS5pbnB1dFN0YXRlLmtleUJ1ZmZlciA9IGtleXMuc2xpY2UoMSk7XG4gICAgICAgICAgICB2YXIgdGhpc01hdGNoID0gY29tbWFuZERpc3BhdGNoZXIubWF0Y2hDb21tYW5kKGtleXMsIGRlZmF1bHRLZXltYXAsIHZpbS5pbnB1dFN0YXRlLCAnaW5zZXJ0Jyk7XG4gICAgICAgICAgICBpZiAodGhpc01hdGNoLnR5cGUgIT0gJ25vbmUnKSB7IG1hdGNoID0gdGhpc01hdGNoOyB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChtYXRjaC50eXBlID09ICdub25lJykgeyBjbGVhcklucHV0U3RhdGUoY20pOyByZXR1cm4gZmFsc2U7IH1cbiAgICAgICAgICBlbHNlIGlmIChtYXRjaC50eXBlID09ICdwYXJ0aWFsJykge1xuICAgICAgICAgICAgaWYgKGxhc3RJbnNlcnRNb2RlS2V5VGltZXIpIHsgd2luZG93LmNsZWFyVGltZW91dChsYXN0SW5zZXJ0TW9kZUtleVRpbWVyKTsgfVxuICAgICAgICAgICAgbGFzdEluc2VydE1vZGVLZXlUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KFxuICAgICAgICAgICAgICBmdW5jdGlvbigpIHsgaWYgKHZpbS5pbnNlcnRNb2RlICYmIHZpbS5pbnB1dFN0YXRlLmtleUJ1ZmZlcikgeyBjbGVhcklucHV0U3RhdGUoY20pOyB9IH0sXG4gICAgICAgICAgICAgIGdldE9wdGlvbignaW5zZXJ0TW9kZUVzY0tleXNUaW1lb3V0JykpO1xuICAgICAgICAgICAgcmV0dXJuICFrZXlzQXJlQ2hhcnM7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGxhc3RJbnNlcnRNb2RlS2V5VGltZXIpIHsgd2luZG93LmNsZWFyVGltZW91dChsYXN0SW5zZXJ0TW9kZUtleVRpbWVyKTsgfVxuICAgICAgICAgIGlmIChrZXlzQXJlQ2hhcnMpIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3Rpb25zID0gY20ubGlzdFNlbGVjdGlvbnMoKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICB2YXIgaGVyZSA9IHNlbGVjdGlvbnNbaV0uaGVhZDtcbiAgICAgICAgICAgICAgY20ucmVwbGFjZVJhbmdlKCcnLCBvZmZzZXRDdXJzb3IoaGVyZSwgMCwgLShrZXlzLmxlbmd0aCAtIDEpKSwgaGVyZSwgJytpbnB1dCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmltR2xvYmFsU3RhdGUubWFjcm9Nb2RlU3RhdGUubGFzdEluc2VydE1vZGVDaGFuZ2VzLmNoYW5nZXMucG9wKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNsZWFySW5wdXRTdGF0ZShjbSk7XG4gICAgICAgICAgcmV0dXJuIG1hdGNoLmNvbW1hbmQ7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVLZXlOb25JbnNlcnRNb2RlKCkge1xuICAgICAgICAgIGlmIChoYW5kbGVNYWNyb1JlY29yZGluZygpIHx8IGhhbmRsZUVzYygpKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgICAgICAgICB2YXIga2V5cyA9IHZpbS5pbnB1dFN0YXRlLmtleUJ1ZmZlciA9IHZpbS5pbnB1dFN0YXRlLmtleUJ1ZmZlciArIGtleTtcbiAgICAgICAgICBpZiAoL15bMS05XVxcZCokLy50ZXN0KGtleXMpKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgICAgICAgICB2YXIga2V5c01hdGNoZXIgPSAvXihcXGQqKSguKikkLy5leGVjKGtleXMpO1xuICAgICAgICAgIGlmICgha2V5c01hdGNoZXIpIHsgY2xlYXJJbnB1dFN0YXRlKGNtKTsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICAgICAgdmFyIGNvbnRleHQgPSB2aW0udmlzdWFsTW9kZSA/ICd2aXN1YWwnIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ25vcm1hbCc7XG4gICAgICAgICAgdmFyIG1hdGNoID0gY29tbWFuZERpc3BhdGNoZXIubWF0Y2hDb21tYW5kKGtleXNNYXRjaGVyWzJdIHx8IGtleXNNYXRjaGVyWzFdLCBkZWZhdWx0S2V5bWFwLCB2aW0uaW5wdXRTdGF0ZSwgY29udGV4dCk7XG4gICAgICAgICAgaWYgKG1hdGNoLnR5cGUgPT0gJ25vbmUnKSB7IGNsZWFySW5wdXRTdGF0ZShjbSk7IHJldHVybiBmYWxzZTsgfVxuICAgICAgICAgIGVsc2UgaWYgKG1hdGNoLnR5cGUgPT0gJ3BhcnRpYWwnKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgICAgICAgICB2aW0uaW5wdXRTdGF0ZS5rZXlCdWZmZXIgPSAnJztcbiAgICAgICAgICB2YXIga2V5c01hdGNoZXIgPSAvXihcXGQqKSguKikkLy5leGVjKGtleXMpO1xuICAgICAgICAgIGlmIChrZXlzTWF0Y2hlclsxXSAmJiBrZXlzTWF0Y2hlclsxXSAhPSAnMCcpIHtcbiAgICAgICAgICAgIHZpbS5pbnB1dFN0YXRlLnB1c2hSZXBlYXREaWdpdChrZXlzTWF0Y2hlclsxXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBtYXRjaC5jb21tYW5kO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvbW1hbmQ7XG4gICAgICAgIGlmICh2aW0uaW5zZXJ0TW9kZSkgeyBjb21tYW5kID0gaGFuZGxlS2V5SW5zZXJ0TW9kZSgpOyB9XG4gICAgICAgIGVsc2UgeyBjb21tYW5kID0gaGFuZGxlS2V5Tm9uSW5zZXJ0TW9kZSgpOyB9XG4gICAgICAgIGlmIChjb21tYW5kID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiAhdmltLmluc2VydE1vZGUgJiYga2V5Lmxlbmd0aCA9PT0gMSA/IGZ1bmN0aW9uKCkgeyByZXR1cm4gdHJ1ZTsgfSA6IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kID09PSB0cnVlKSB7XG4gICAgICAgICAgLy8gVE9ETzogTG9vayBpbnRvIHVzaW5nIENvZGVNaXJyb3IncyBtdWx0aS1rZXkgaGFuZGxpbmcuXG4gICAgICAgICAgLy8gUmV0dXJuIG5vLW9wIHNpbmNlIHdlIGFyZSBjYWNoaW5nIHRoZSBrZXkuIENvdW50cyBhcyBoYW5kbGVkLCBidXRcbiAgICAgICAgICAvLyBkb24ndCB3YW50IGFjdCBvbiBpdCBqdXN0IHlldC5cbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7IHJldHVybiB0cnVlOyB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjbS5vcGVyYXRpb24oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGNtLmN1ck9wLmlzVmltT3AgPSB0cnVlO1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChjb21tYW5kLnR5cGUgPT0gJ2tleVRvS2V5Jykge1xuICAgICAgICAgICAgICAgICAgZG9LZXlUb0tleShjb21tYW5kLnRvS2V5cyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGNvbW1hbmREaXNwYXRjaGVyLnByb2Nlc3NDb21tYW5kKGNtLCB2aW0sIGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIC8vIGNsZWFyIFZJTSBzdGF0ZSBpbiBjYXNlIGl0J3MgaW4gYSBiYWQgc3RhdGUuXG4gICAgICAgICAgICAgICAgY20uc3RhdGUudmltID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIG1heWJlSW5pdFZpbVN0YXRlKGNtKTtcbiAgICAgICAgICAgICAgICBpZiAoIUNvZGVNaXJyb3IuVmltLnN1cHByZXNzRXJyb3JMb2dnaW5nKSB7XG4gICAgICAgICAgICAgICAgICBjb25zb2xlWydsb2cnXShlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBoYW5kbGVFeDogZnVuY3Rpb24oY20sIGlucHV0KSB7XG4gICAgICAgIGV4Q29tbWFuZERpc3BhdGNoZXIucHJvY2Vzc0NvbW1hbmQoY20sIGlucHV0KTtcbiAgICAgIH0sXG5cbiAgICAgIGRlZmluZU1vdGlvbjogZGVmaW5lTW90aW9uLFxuICAgICAgZGVmaW5lQWN0aW9uOiBkZWZpbmVBY3Rpb24sXG4gICAgICBkZWZpbmVPcGVyYXRvcjogZGVmaW5lT3BlcmF0b3IsXG4gICAgICBtYXBDb21tYW5kOiBtYXBDb21tYW5kLFxuICAgICAgX21hcENvbW1hbmQ6IF9tYXBDb21tYW5kLFxuXG4gICAgICBkZWZpbmVSZWdpc3RlcjogZGVmaW5lUmVnaXN0ZXIsXG5cbiAgICAgIGV4aXRWaXN1YWxNb2RlOiBleGl0VmlzdWFsTW9kZSxcbiAgICAgIGV4aXRJbnNlcnRNb2RlOiBleGl0SW5zZXJ0TW9kZVxuICAgIH07XG5cbiAgICAvLyBSZXByZXNlbnRzIHRoZSBjdXJyZW50IGlucHV0IHN0YXRlLlxuICAgIGZ1bmN0aW9uIElucHV0U3RhdGUoKSB7XG4gICAgICB0aGlzLnByZWZpeFJlcGVhdCA9IFtdO1xuICAgICAgdGhpcy5tb3Rpb25SZXBlYXQgPSBbXTtcblxuICAgICAgdGhpcy5vcGVyYXRvciA9IG51bGw7XG4gICAgICB0aGlzLm9wZXJhdG9yQXJncyA9IG51bGw7XG4gICAgICB0aGlzLm1vdGlvbiA9IG51bGw7XG4gICAgICB0aGlzLm1vdGlvbkFyZ3MgPSBudWxsO1xuICAgICAgdGhpcy5rZXlCdWZmZXIgPSBbXTsgLy8gRm9yIG1hdGNoaW5nIG11bHRpLWtleSBjb21tYW5kcy5cbiAgICAgIHRoaXMucmVnaXN0ZXJOYW1lID0gbnVsbDsgLy8gRGVmYXVsdHMgdG8gdGhlIHVubmFtZWQgcmVnaXN0ZXIuXG4gICAgfVxuICAgIElucHV0U3RhdGUucHJvdG90eXBlLnB1c2hSZXBlYXREaWdpdCA9IGZ1bmN0aW9uKG4pIHtcbiAgICAgIGlmICghdGhpcy5vcGVyYXRvcikge1xuICAgICAgICB0aGlzLnByZWZpeFJlcGVhdCA9IHRoaXMucHJlZml4UmVwZWF0LmNvbmNhdChuKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubW90aW9uUmVwZWF0ID0gdGhpcy5tb3Rpb25SZXBlYXQuY29uY2F0KG4pO1xuICAgICAgfVxuICAgIH07XG4gICAgSW5wdXRTdGF0ZS5wcm90b3R5cGUuZ2V0UmVwZWF0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVwZWF0ID0gMDtcbiAgICAgIGlmICh0aGlzLnByZWZpeFJlcGVhdC5sZW5ndGggPiAwIHx8IHRoaXMubW90aW9uUmVwZWF0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVwZWF0ID0gMTtcbiAgICAgICAgaWYgKHRoaXMucHJlZml4UmVwZWF0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXBlYXQgKj0gcGFyc2VJbnQodGhpcy5wcmVmaXhSZXBlYXQuam9pbignJyksIDEwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5tb3Rpb25SZXBlYXQubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJlcGVhdCAqPSBwYXJzZUludCh0aGlzLm1vdGlvblJlcGVhdC5qb2luKCcnKSwgMTApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVwZWF0O1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBjbGVhcklucHV0U3RhdGUoY20sIHJlYXNvbikge1xuICAgICAgY20uc3RhdGUudmltLmlucHV0U3RhdGUgPSBuZXcgSW5wdXRTdGF0ZSgpO1xuICAgICAgQ29kZU1pcnJvci5zaWduYWwoY20sICd2aW0tY29tbWFuZC1kb25lJywgcmVhc29uKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJlZ2lzdGVyIHN0b3JlcyBpbmZvcm1hdGlvbiBhYm91dCBjb3B5IGFuZCBwYXN0ZSByZWdpc3RlcnMuICBCZXNpZGVzXG4gICAgICogdGV4dCwgYSByZWdpc3RlciBtdXN0IHN0b3JlIHdoZXRoZXIgaXQgaXMgbGluZXdpc2UgKGkuZS4sIHdoZW4gaXQgaXNcbiAgICAgKiBwYXN0ZWQsIHNob3VsZCBpdCBpbnNlcnQgaXRzZWxmIGludG8gYSBuZXcgbGluZSwgb3Igc2hvdWxkIHRoZSB0ZXh0IGJlXG4gICAgICogaW5zZXJ0ZWQgYXQgdGhlIGN1cnNvciBwb3NpdGlvbi4pXG4gICAgICovXG4gICAgZnVuY3Rpb24gUmVnaXN0ZXIodGV4dCwgbGluZXdpc2UsIGJsb2Nrd2lzZSkge1xuICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgdGhpcy5rZXlCdWZmZXIgPSBbdGV4dCB8fCAnJ107XG4gICAgICB0aGlzLmluc2VydE1vZGVDaGFuZ2VzID0gW107XG4gICAgICB0aGlzLnNlYXJjaFF1ZXJpZXMgPSBbXTtcbiAgICAgIHRoaXMubGluZXdpc2UgPSAhIWxpbmV3aXNlO1xuICAgICAgdGhpcy5ibG9ja3dpc2UgPSAhIWJsb2Nrd2lzZTtcbiAgICB9XG4gICAgUmVnaXN0ZXIucHJvdG90eXBlID0ge1xuICAgICAgc2V0VGV4dDogZnVuY3Rpb24odGV4dCwgbGluZXdpc2UsIGJsb2Nrd2lzZSkge1xuICAgICAgICB0aGlzLmtleUJ1ZmZlciA9IFt0ZXh0IHx8ICcnXTtcbiAgICAgICAgdGhpcy5saW5ld2lzZSA9ICEhbGluZXdpc2U7XG4gICAgICAgIHRoaXMuYmxvY2t3aXNlID0gISFibG9ja3dpc2U7XG4gICAgICB9LFxuICAgICAgcHVzaFRleHQ6IGZ1bmN0aW9uKHRleHQsIGxpbmV3aXNlKSB7XG4gICAgICAgIC8vIGlmIHRoaXMgcmVnaXN0ZXIgaGFzIGV2ZXIgYmVlbiBzZXQgdG8gbGluZXdpc2UsIHVzZSBsaW5ld2lzZS5cbiAgICAgICAgaWYgKGxpbmV3aXNlKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLmxpbmV3aXNlKSB7XG4gICAgICAgICAgICB0aGlzLmtleUJ1ZmZlci5wdXNoKCdcXG4nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5saW5ld2lzZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5rZXlCdWZmZXIucHVzaCh0ZXh0KTtcbiAgICAgIH0sXG4gICAgICBwdXNoSW5zZXJ0TW9kZUNoYW5nZXM6IGZ1bmN0aW9uKGNoYW5nZXMpIHtcbiAgICAgICAgdGhpcy5pbnNlcnRNb2RlQ2hhbmdlcy5wdXNoKGNyZWF0ZUluc2VydE1vZGVDaGFuZ2VzKGNoYW5nZXMpKTtcbiAgICAgIH0sXG4gICAgICBwdXNoU2VhcmNoUXVlcnk6IGZ1bmN0aW9uKHF1ZXJ5KSB7XG4gICAgICAgIHRoaXMuc2VhcmNoUXVlcmllcy5wdXNoKHF1ZXJ5KTtcbiAgICAgIH0sXG4gICAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMua2V5QnVmZmVyID0gW107XG4gICAgICAgIHRoaXMuaW5zZXJ0TW9kZUNoYW5nZXMgPSBbXTtcbiAgICAgICAgdGhpcy5zZWFyY2hRdWVyaWVzID0gW107XG4gICAgICAgIHRoaXMubGluZXdpc2UgPSBmYWxzZTtcbiAgICAgIH0sXG4gICAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmtleUJ1ZmZlci5qb2luKCcnKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyBhbiBleHRlcm5hbCByZWdpc3Rlci5cbiAgICAgKlxuICAgICAqIFRoZSBuYW1lIHNob3VsZCBiZSBhIHNpbmdsZSBjaGFyYWN0ZXIgdGhhdCB3aWxsIGJlIHVzZWQgdG8gcmVmZXJlbmNlIHRoZSByZWdpc3Rlci5cbiAgICAgKiBUaGUgcmVnaXN0ZXIgc2hvdWxkIHN1cHBvcnQgc2V0VGV4dCwgcHVzaFRleHQsIGNsZWFyLCBhbmQgdG9TdHJpbmcoKS4gU2VlIFJlZ2lzdGVyXG4gICAgICogZm9yIGEgcmVmZXJlbmNlIGltcGxlbWVudGF0aW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRlZmluZVJlZ2lzdGVyKG5hbWUsIHJlZ2lzdGVyKSB7XG4gICAgICB2YXIgcmVnaXN0ZXJzID0gdmltR2xvYmFsU3RhdGUucmVnaXN0ZXJDb250cm9sbGVyLnJlZ2lzdGVycztcbiAgICAgIGlmICghbmFtZSB8fCBuYW1lLmxlbmd0aCAhPSAxKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdSZWdpc3RlciBuYW1lIG11c3QgYmUgMSBjaGFyYWN0ZXInKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZWdpc3RlcnNbbmFtZV0pIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ1JlZ2lzdGVyIGFscmVhZHkgZGVmaW5lZCAnICsgbmFtZSk7XG4gICAgICB9XG4gICAgICByZWdpc3RlcnNbbmFtZV0gPSByZWdpc3RlcjtcbiAgICAgIHZhbGlkUmVnaXN0ZXJzLnB1c2gobmFtZSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiB2aW0gcmVnaXN0ZXJzIGFsbG93IHlvdSB0byBrZWVwIG1hbnkgaW5kZXBlbmRlbnQgY29weSBhbmQgcGFzdGUgYnVmZmVycy5cbiAgICAgKiBTZWUgaHR0cDovL3VzZXZpbS5jb20vMjAxMi8wNC8xMy9yZWdpc3RlcnMvIGZvciBhbiBpbnRyb2R1Y3Rpb24uXG4gICAgICpcbiAgICAgKiBSZWdpc3RlckNvbnRyb2xsZXIga2VlcHMgdGhlIHN0YXRlIG9mIGFsbCB0aGUgcmVnaXN0ZXJzLiAgQW4gaW5pdGlhbFxuICAgICAqIHN0YXRlIG1heSBiZSBwYXNzZWQgaW4uICBUaGUgdW5uYW1lZCByZWdpc3RlciAnXCInIHdpbGwgYWx3YXlzIGJlXG4gICAgICogb3ZlcnJpZGRlbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBSZWdpc3RlckNvbnRyb2xsZXIocmVnaXN0ZXJzKSB7XG4gICAgICB0aGlzLnJlZ2lzdGVycyA9IHJlZ2lzdGVycztcbiAgICAgIHRoaXMudW5uYW1lZFJlZ2lzdGVyID0gcmVnaXN0ZXJzWydcIiddID0gbmV3IFJlZ2lzdGVyKCk7XG4gICAgICByZWdpc3RlcnNbJy4nXSA9IG5ldyBSZWdpc3RlcigpO1xuICAgICAgcmVnaXN0ZXJzWyc6J10gPSBuZXcgUmVnaXN0ZXIoKTtcbiAgICAgIHJlZ2lzdGVyc1snLyddID0gbmV3IFJlZ2lzdGVyKCk7XG4gICAgfVxuICAgIFJlZ2lzdGVyQ29udHJvbGxlci5wcm90b3R5cGUgPSB7XG4gICAgICBwdXNoVGV4dDogZnVuY3Rpb24ocmVnaXN0ZXJOYW1lLCBvcGVyYXRvciwgdGV4dCwgbGluZXdpc2UsIGJsb2Nrd2lzZSkge1xuICAgICAgICBpZiAobGluZXdpc2UgJiYgdGV4dC5jaGFyQXQodGV4dC5sZW5ndGggLSAxKSAhPT0gJ1xcbicpe1xuICAgICAgICAgIHRleHQgKz0gJ1xcbic7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTG93ZXJjYXNlIGFuZCB1cHBlcmNhc2UgcmVnaXN0ZXJzIHJlZmVyIHRvIHRoZSBzYW1lIHJlZ2lzdGVyLlxuICAgICAgICAvLyBVcHBlcmNhc2UganVzdCBtZWFucyBhcHBlbmQuXG4gICAgICAgIHZhciByZWdpc3RlciA9IHRoaXMuaXNWYWxpZFJlZ2lzdGVyKHJlZ2lzdGVyTmFtZSkgP1xuICAgICAgICAgICAgdGhpcy5nZXRSZWdpc3RlcihyZWdpc3Rlck5hbWUpIDogbnVsbDtcbiAgICAgICAgLy8gaWYgbm8gcmVnaXN0ZXIvYW4gaW52YWxpZCByZWdpc3RlciB3YXMgc3BlY2lmaWVkLCB0aGluZ3MgZ28gdG8gdGhlXG4gICAgICAgIC8vIGRlZmF1bHQgcmVnaXN0ZXJzXG4gICAgICAgIGlmICghcmVnaXN0ZXIpIHtcbiAgICAgICAgICBzd2l0Y2ggKG9wZXJhdG9yKSB7XG4gICAgICAgICAgICBjYXNlICd5YW5rJzpcbiAgICAgICAgICAgICAgLy8gVGhlIDAgcmVnaXN0ZXIgY29udGFpbnMgdGhlIHRleHQgZnJvbSB0aGUgbW9zdCByZWNlbnQgeWFuay5cbiAgICAgICAgICAgICAgdGhpcy5yZWdpc3RlcnNbJzAnXSA9IG5ldyBSZWdpc3Rlcih0ZXh0LCBsaW5ld2lzZSwgYmxvY2t3aXNlKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkZWxldGUnOlxuICAgICAgICAgICAgY2FzZSAnY2hhbmdlJzpcbiAgICAgICAgICAgICAgaWYgKHRleHQuaW5kZXhPZignXFxuJykgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBEZWxldGUgbGVzcyB0aGFuIDEgbGluZS4gVXBkYXRlIHRoZSBzbWFsbCBkZWxldGUgcmVnaXN0ZXIuXG4gICAgICAgICAgICAgICAgdGhpcy5yZWdpc3RlcnNbJy0nXSA9IG5ldyBSZWdpc3Rlcih0ZXh0LCBsaW5ld2lzZSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gU2hpZnQgZG93biB0aGUgY29udGVudHMgb2YgdGhlIG51bWJlcmVkIHJlZ2lzdGVycyBhbmQgcHV0IHRoZVxuICAgICAgICAgICAgICAgIC8vIGRlbGV0ZWQgdGV4dCBpbnRvIHJlZ2lzdGVyIDEuXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlmdE51bWVyaWNSZWdpc3RlcnNfKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWdpc3RlcnNbJzEnXSA9IG5ldyBSZWdpc3Rlcih0ZXh0LCBsaW5ld2lzZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgdW5uYW1lZCByZWdpc3RlciBpcyBzZXQgdG8gd2hhdCBqdXN0IGhhcHBlbmVkXG4gICAgICAgICAgdGhpcy51bm5hbWVkUmVnaXN0ZXIuc2V0VGV4dCh0ZXh0LCBsaW5ld2lzZSwgYmxvY2t3aXNlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB3ZSd2ZSBnb3R0ZW4gdG8gdGhpcyBwb2ludCwgd2UndmUgYWN0dWFsbHkgc3BlY2lmaWVkIGEgcmVnaXN0ZXJcbiAgICAgICAgdmFyIGFwcGVuZCA9IGlzVXBwZXJDYXNlKHJlZ2lzdGVyTmFtZSk7XG4gICAgICAgIGlmIChhcHBlbmQpIHtcbiAgICAgICAgICByZWdpc3Rlci5wdXNoVGV4dCh0ZXh0LCBsaW5ld2lzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVnaXN0ZXIuc2V0VGV4dCh0ZXh0LCBsaW5ld2lzZSwgYmxvY2t3aXNlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUaGUgdW5uYW1lZCByZWdpc3RlciBhbHdheXMgaGFzIHRoZSBzYW1lIHZhbHVlIGFzIHRoZSBsYXN0IHVzZWRcbiAgICAgICAgLy8gcmVnaXN0ZXIuXG4gICAgICAgIHRoaXMudW5uYW1lZFJlZ2lzdGVyLnNldFRleHQocmVnaXN0ZXIudG9TdHJpbmcoKSwgbGluZXdpc2UpO1xuICAgICAgfSxcbiAgICAgIC8vIEdldHMgdGhlIHJlZ2lzdGVyIG5hbWVkIEBuYW1lLiAgSWYgb25lIG9mIEBuYW1lIGRvZXNuJ3QgYWxyZWFkeSBleGlzdCxcbiAgICAgIC8vIGNyZWF0ZSBpdC4gIElmIEBuYW1lIGlzIGludmFsaWQsIHJldHVybiB0aGUgdW5uYW1lZFJlZ2lzdGVyLlxuICAgICAgZ2V0UmVnaXN0ZXI6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWRSZWdpc3RlcihuYW1lKSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnVubmFtZWRSZWdpc3RlcjtcbiAgICAgICAgfVxuICAgICAgICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoIXRoaXMucmVnaXN0ZXJzW25hbWVdKSB7XG4gICAgICAgICAgdGhpcy5yZWdpc3RlcnNbbmFtZV0gPSBuZXcgUmVnaXN0ZXIoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5yZWdpc3RlcnNbbmFtZV07XG4gICAgICB9LFxuICAgICAgaXNWYWxpZFJlZ2lzdGVyOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHJldHVybiBuYW1lICYmIGluQXJyYXkobmFtZSwgdmFsaWRSZWdpc3RlcnMpO1xuICAgICAgfSxcbiAgICAgIHNoaWZ0TnVtZXJpY1JlZ2lzdGVyc186IGZ1bmN0aW9uKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gOTsgaSA+PSAyOyBpLS0pIHtcbiAgICAgICAgICB0aGlzLnJlZ2lzdGVyc1tpXSA9IHRoaXMuZ2V0UmVnaXN0ZXIoJycgKyAoaSAtIDEpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgZnVuY3Rpb24gSGlzdG9yeUNvbnRyb2xsZXIoKSB7XG4gICAgICAgIHRoaXMuaGlzdG9yeUJ1ZmZlciA9IFtdO1xuICAgICAgICB0aGlzLml0ZXJhdG9yID0gMDtcbiAgICAgICAgdGhpcy5pbml0aWFsUHJlZml4ID0gbnVsbDtcbiAgICB9XG4gICAgSGlzdG9yeUNvbnRyb2xsZXIucHJvdG90eXBlID0ge1xuICAgICAgLy8gdGhlIGlucHV0IGFyZ3VtZW50IGhlcmUgYWN0cyBhIHVzZXIgZW50ZXJlZCBwcmVmaXggZm9yIGEgc21hbGwgdGltZVxuICAgICAgLy8gdW50aWwgd2Ugc3RhcnQgYXV0b2NvbXBsZXRpb24gaW4gd2hpY2ggY2FzZSBpdCBpcyB0aGUgYXV0b2NvbXBsZXRlZC5cbiAgICAgIG5leHRNYXRjaDogZnVuY3Rpb24gKGlucHV0LCB1cCkge1xuICAgICAgICB2YXIgaGlzdG9yeUJ1ZmZlciA9IHRoaXMuaGlzdG9yeUJ1ZmZlcjtcbiAgICAgICAgdmFyIGRpciA9IHVwID8gLTEgOiAxO1xuICAgICAgICBpZiAodGhpcy5pbml0aWFsUHJlZml4ID09PSBudWxsKSB0aGlzLmluaXRpYWxQcmVmaXggPSBpbnB1dDtcbiAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMuaXRlcmF0b3IgKyBkaXI7IHVwID8gaSA+PSAwIDogaSA8IGhpc3RvcnlCdWZmZXIubGVuZ3RoOyBpKz0gZGlyKSB7XG4gICAgICAgICAgdmFyIGVsZW1lbnQgPSBoaXN0b3J5QnVmZmVyW2ldO1xuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDw9IGVsZW1lbnQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmluaXRpYWxQcmVmaXggPT0gZWxlbWVudC5zdWJzdHJpbmcoMCwgaikpIHtcbiAgICAgICAgICAgICAgdGhpcy5pdGVyYXRvciA9IGk7XG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBzaG91bGQgcmV0dXJuIHRoZSB1c2VyIGlucHV0IGluIGNhc2Ugd2UgcmVhY2ggdGhlIGVuZCBvZiBidWZmZXIuXG4gICAgICAgIGlmIChpID49IGhpc3RvcnlCdWZmZXIubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5pdGVyYXRvciA9IGhpc3RvcnlCdWZmZXIubGVuZ3RoO1xuICAgICAgICAgIHJldHVybiB0aGlzLmluaXRpYWxQcmVmaXg7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmV0dXJuIHRoZSBsYXN0IGF1dG9jb21wbGV0ZWQgcXVlcnkgb3IgZXhDb21tYW5kIGFzIGl0IGlzLlxuICAgICAgICBpZiAoaSA8IDAgKSByZXR1cm4gaW5wdXQ7XG4gICAgICB9LFxuICAgICAgcHVzaElucHV0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmhpc3RvcnlCdWZmZXIuaW5kZXhPZihpbnB1dCk7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB0aGlzLmhpc3RvcnlCdWZmZXIuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgaWYgKGlucHV0Lmxlbmd0aCkgdGhpcy5oaXN0b3J5QnVmZmVyLnB1c2goaW5wdXQpO1xuICAgICAgfSxcbiAgICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsUHJlZml4ID0gbnVsbDtcbiAgICAgICAgdGhpcy5pdGVyYXRvciA9IHRoaXMuaGlzdG9yeUJ1ZmZlci5sZW5ndGg7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgY29tbWFuZERpc3BhdGNoZXIgPSB7XG4gICAgICBtYXRjaENvbW1hbmQ6IGZ1bmN0aW9uKGtleXMsIGtleU1hcCwgaW5wdXRTdGF0ZSwgY29udGV4dCkge1xuICAgICAgICB2YXIgbWF0Y2hlcyA9IGNvbW1hbmRNYXRjaGVzKGtleXMsIGtleU1hcCwgY29udGV4dCwgaW5wdXRTdGF0ZSk7XG4gICAgICAgIGlmICghbWF0Y2hlcy5mdWxsICYmICFtYXRjaGVzLnBhcnRpYWwpIHtcbiAgICAgICAgICByZXR1cm4ge3R5cGU6ICdub25lJ307XG4gICAgICAgIH0gZWxzZSBpZiAoIW1hdGNoZXMuZnVsbCAmJiBtYXRjaGVzLnBhcnRpYWwpIHtcbiAgICAgICAgICByZXR1cm4ge3R5cGU6ICdwYXJ0aWFsJ307XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYmVzdE1hdGNoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1hdGNoZXMuZnVsbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBtYXRjaCA9IG1hdGNoZXMuZnVsbFtpXTtcbiAgICAgICAgICBpZiAoIWJlc3RNYXRjaCkge1xuICAgICAgICAgICAgYmVzdE1hdGNoID0gbWF0Y2g7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChiZXN0TWF0Y2gua2V5cy5zbGljZSgtMTEpID09ICc8Y2hhcmFjdGVyPicpIHtcbiAgICAgICAgICB2YXIgY2hhcmFjdGVyID0gbGFzdENoYXIoa2V5cyk7XG4gICAgICAgICAgaWYgKCFjaGFyYWN0ZXIpIHJldHVybiB7dHlwZTogJ25vbmUnfTtcbiAgICAgICAgICBpbnB1dFN0YXRlLnNlbGVjdGVkQ2hhcmFjdGVyID0gY2hhcmFjdGVyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7dHlwZTogJ2Z1bGwnLCBjb21tYW5kOiBiZXN0TWF0Y2h9O1xuICAgICAgfSxcbiAgICAgIHByb2Nlc3NDb21tYW5kOiBmdW5jdGlvbihjbSwgdmltLCBjb21tYW5kKSB7XG4gICAgICAgIHZpbS5pbnB1dFN0YXRlLnJlcGVhdE92ZXJyaWRlID0gY29tbWFuZC5yZXBlYXRPdmVycmlkZTtcbiAgICAgICAgc3dpdGNoIChjb21tYW5kLnR5cGUpIHtcbiAgICAgICAgICBjYXNlICdtb3Rpb24nOlxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTW90aW9uKGNtLCB2aW0sIGNvbW1hbmQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnb3BlcmF0b3InOlxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzT3BlcmF0b3IoY20sIHZpbSwgY29tbWFuZCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdvcGVyYXRvck1vdGlvbic6XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NPcGVyYXRvck1vdGlvbihjbSwgdmltLCBjb21tYW5kKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2FjdGlvbic6XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NBY3Rpb24oY20sIHZpbSwgY29tbWFuZCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdzZWFyY2gnOlxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzU2VhcmNoKGNtLCB2aW0sIGNvbW1hbmQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnZXgnOlxuICAgICAgICAgIGNhc2UgJ2tleVRvRXgnOlxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzRXgoY20sIHZpbSwgY29tbWFuZCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwcm9jZXNzTW90aW9uOiBmdW5jdGlvbihjbSwgdmltLCBjb21tYW5kKSB7XG4gICAgICAgIHZpbS5pbnB1dFN0YXRlLm1vdGlvbiA9IGNvbW1hbmQubW90aW9uO1xuICAgICAgICB2aW0uaW5wdXRTdGF0ZS5tb3Rpb25BcmdzID0gY29weUFyZ3MoY29tbWFuZC5tb3Rpb25BcmdzKTtcbiAgICAgICAgdGhpcy5ldmFsSW5wdXQoY20sIHZpbSk7XG4gICAgICB9LFxuICAgICAgcHJvY2Vzc09wZXJhdG9yOiBmdW5jdGlvbihjbSwgdmltLCBjb21tYW5kKSB7XG4gICAgICAgIHZhciBpbnB1dFN0YXRlID0gdmltLmlucHV0U3RhdGU7XG4gICAgICAgIGlmIChpbnB1dFN0YXRlLm9wZXJhdG9yKSB7XG4gICAgICAgICAgaWYgKGlucHV0U3RhdGUub3BlcmF0b3IgPT0gY29tbWFuZC5vcGVyYXRvcikge1xuICAgICAgICAgICAgLy8gVHlwaW5nIGFuIG9wZXJhdG9yIHR3aWNlIGxpa2UgJ2RkJyBtYWtlcyB0aGUgb3BlcmF0b3Igb3BlcmF0ZVxuICAgICAgICAgICAgLy8gbGluZXdpc2VcbiAgICAgICAgICAgIGlucHV0U3RhdGUubW90aW9uID0gJ2V4cGFuZFRvTGluZSc7XG4gICAgICAgICAgICBpbnB1dFN0YXRlLm1vdGlvbkFyZ3MgPSB7IGxpbmV3aXNlOiB0cnVlIH07XG4gICAgICAgICAgICB0aGlzLmV2YWxJbnB1dChjbSwgdmltKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gMiBkaWZmZXJlbnQgb3BlcmF0b3JzIGluIGEgcm93IGRvZXNuJ3QgbWFrZSBzZW5zZS5cbiAgICAgICAgICAgIGNsZWFySW5wdXRTdGF0ZShjbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlucHV0U3RhdGUub3BlcmF0b3IgPSBjb21tYW5kLm9wZXJhdG9yO1xuICAgICAgICBpbnB1dFN0YXRlLm9wZXJhdG9yQXJncyA9IGNvcHlBcmdzKGNvbW1hbmQub3BlcmF0b3JBcmdzKTtcbiAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgLy8gT3BlcmF0aW5nIG9uIGEgc2VsZWN0aW9uIGluIHZpc3VhbCBtb2RlLiBXZSBkb24ndCBuZWVkIGEgbW90aW9uLlxuICAgICAgICAgIHRoaXMuZXZhbElucHV0KGNtLCB2aW0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcHJvY2Vzc09wZXJhdG9yTW90aW9uOiBmdW5jdGlvbihjbSwgdmltLCBjb21tYW5kKSB7XG4gICAgICAgIHZhciB2aXN1YWxNb2RlID0gdmltLnZpc3VhbE1vZGU7XG4gICAgICAgIHZhciBvcGVyYXRvck1vdGlvbkFyZ3MgPSBjb3B5QXJncyhjb21tYW5kLm9wZXJhdG9yTW90aW9uQXJncyk7XG4gICAgICAgIGlmIChvcGVyYXRvck1vdGlvbkFyZ3MpIHtcbiAgICAgICAgICAvLyBPcGVyYXRvciBtb3Rpb25zIG1heSBoYXZlIHNwZWNpYWwgYmVoYXZpb3IgaW4gdmlzdWFsIG1vZGUuXG4gICAgICAgICAgaWYgKHZpc3VhbE1vZGUgJiYgb3BlcmF0b3JNb3Rpb25BcmdzLnZpc3VhbExpbmUpIHtcbiAgICAgICAgICAgIHZpbS52aXN1YWxMaW5lID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcm9jZXNzT3BlcmF0b3IoY20sIHZpbSwgY29tbWFuZCk7XG4gICAgICAgIGlmICghdmlzdWFsTW9kZSkge1xuICAgICAgICAgIHRoaXMucHJvY2Vzc01vdGlvbihjbSwgdmltLCBjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHByb2Nlc3NBY3Rpb246IGZ1bmN0aW9uKGNtLCB2aW0sIGNvbW1hbmQpIHtcbiAgICAgICAgdmFyIGlucHV0U3RhdGUgPSB2aW0uaW5wdXRTdGF0ZTtcbiAgICAgICAgdmFyIHJlcGVhdCA9IGlucHV0U3RhdGUuZ2V0UmVwZWF0KCk7XG4gICAgICAgIHZhciByZXBlYXRJc0V4cGxpY2l0ID0gISFyZXBlYXQ7XG4gICAgICAgIHZhciBhY3Rpb25BcmdzID0gY29weUFyZ3MoY29tbWFuZC5hY3Rpb25BcmdzKSB8fCB7fTtcbiAgICAgICAgaWYgKGlucHV0U3RhdGUuc2VsZWN0ZWRDaGFyYWN0ZXIpIHtcbiAgICAgICAgICBhY3Rpb25BcmdzLnNlbGVjdGVkQ2hhcmFjdGVyID0gaW5wdXRTdGF0ZS5zZWxlY3RlZENoYXJhY3RlcjtcbiAgICAgICAgfVxuICAgICAgICAvLyBBY3Rpb25zIG1heSBvciBtYXkgbm90IGhhdmUgbW90aW9ucyBhbmQgb3BlcmF0b3JzLiBEbyB0aGVzZSBmaXJzdC5cbiAgICAgICAgaWYgKGNvbW1hbmQub3BlcmF0b3IpIHtcbiAgICAgICAgICB0aGlzLnByb2Nlc3NPcGVyYXRvcihjbSwgdmltLCBjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29tbWFuZC5tb3Rpb24pIHtcbiAgICAgICAgICB0aGlzLnByb2Nlc3NNb3Rpb24oY20sIHZpbSwgY29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbW1hbmQubW90aW9uIHx8IGNvbW1hbmQub3BlcmF0b3IpIHtcbiAgICAgICAgICB0aGlzLmV2YWxJbnB1dChjbSwgdmltKTtcbiAgICAgICAgfVxuICAgICAgICBhY3Rpb25BcmdzLnJlcGVhdCA9IHJlcGVhdCB8fCAxO1xuICAgICAgICBhY3Rpb25BcmdzLnJlcGVhdElzRXhwbGljaXQgPSByZXBlYXRJc0V4cGxpY2l0O1xuICAgICAgICBhY3Rpb25BcmdzLnJlZ2lzdGVyTmFtZSA9IGlucHV0U3RhdGUucmVnaXN0ZXJOYW1lO1xuICAgICAgICBjbGVhcklucHV0U3RhdGUoY20pO1xuICAgICAgICB2aW0ubGFzdE1vdGlvbiA9IG51bGw7XG4gICAgICAgIGlmIChjb21tYW5kLmlzRWRpdCkge1xuICAgICAgICAgIHRoaXMucmVjb3JkTGFzdEVkaXQodmltLCBpbnB1dFN0YXRlLCBjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgICBhY3Rpb25zW2NvbW1hbmQuYWN0aW9uXShjbSwgYWN0aW9uQXJncywgdmltKTtcbiAgICAgIH0sXG4gICAgICBwcm9jZXNzU2VhcmNoOiBmdW5jdGlvbihjbSwgdmltLCBjb21tYW5kKSB7XG4gICAgICAgIGlmICghY20uZ2V0U2VhcmNoQ3Vyc29yKSB7XG4gICAgICAgICAgLy8gU2VhcmNoIGRlcGVuZHMgb24gU2VhcmNoQ3Vyc29yLlxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZm9yd2FyZCA9IGNvbW1hbmQuc2VhcmNoQXJncy5mb3J3YXJkO1xuICAgICAgICB2YXIgd2hvbGVXb3JkT25seSA9IGNvbW1hbmQuc2VhcmNoQXJncy53aG9sZVdvcmRPbmx5O1xuICAgICAgICBnZXRTZWFyY2hTdGF0ZShjbSkuc2V0UmV2ZXJzZWQoIWZvcndhcmQpO1xuICAgICAgICB2YXIgcHJvbXB0UHJlZml4ID0gKGZvcndhcmQpID8gJy8nIDogJz8nO1xuICAgICAgICB2YXIgb3JpZ2luYWxRdWVyeSA9IGdldFNlYXJjaFN0YXRlKGNtKS5nZXRRdWVyeSgpO1xuICAgICAgICB2YXIgb3JpZ2luYWxTY3JvbGxQb3MgPSBjbS5nZXRTY3JvbGxJbmZvKCk7XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVF1ZXJ5KHF1ZXJ5LCBpZ25vcmVDYXNlLCBzbWFydENhc2UpIHtcbiAgICAgICAgICB2aW1HbG9iYWxTdGF0ZS5zZWFyY2hIaXN0b3J5Q29udHJvbGxlci5wdXNoSW5wdXQocXVlcnkpO1xuICAgICAgICAgIHZpbUdsb2JhbFN0YXRlLnNlYXJjaEhpc3RvcnlDb250cm9sbGVyLnJlc2V0KCk7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHVwZGF0ZVNlYXJjaFF1ZXJ5KGNtLCBxdWVyeSwgaWdub3JlQ2FzZSwgc21hcnRDYXNlKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBzaG93Q29uZmlybShjbSwgJ0ludmFsaWQgcmVnZXg6ICcgKyBxdWVyeSk7XG4gICAgICAgICAgICBjbGVhcklucHV0U3RhdGUoY20pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb21tYW5kRGlzcGF0Y2hlci5wcm9jZXNzTW90aW9uKGNtLCB2aW0sIHtcbiAgICAgICAgICAgIHR5cGU6ICdtb3Rpb24nLFxuICAgICAgICAgICAgbW90aW9uOiAnZmluZE5leHQnLFxuICAgICAgICAgICAgbW90aW9uQXJnczogeyBmb3J3YXJkOiB0cnVlLCB0b0p1bXBsaXN0OiBjb21tYW5kLnNlYXJjaEFyZ3MudG9KdW1wbGlzdCB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gb25Qcm9tcHRDbG9zZShxdWVyeSkge1xuICAgICAgICAgIGNtLnNjcm9sbFRvKG9yaWdpbmFsU2Nyb2xsUG9zLmxlZnQsIG9yaWdpbmFsU2Nyb2xsUG9zLnRvcCk7XG4gICAgICAgICAgaGFuZGxlUXVlcnkocXVlcnksIHRydWUgLyoqIGlnbm9yZUNhc2UgKi8sIHRydWUgLyoqIHNtYXJ0Q2FzZSAqLyk7XG4gICAgICAgICAgdmFyIG1hY3JvTW9kZVN0YXRlID0gdmltR2xvYmFsU3RhdGUubWFjcm9Nb2RlU3RhdGU7XG4gICAgICAgICAgaWYgKG1hY3JvTW9kZVN0YXRlLmlzUmVjb3JkaW5nKSB7XG4gICAgICAgICAgICBsb2dTZWFyY2hRdWVyeShtYWNyb01vZGVTdGF0ZSwgcXVlcnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBvblByb21wdEtleVVwKGUsIHF1ZXJ5LCBjbG9zZSkge1xuICAgICAgICAgIHZhciBrZXlOYW1lID0gQ29kZU1pcnJvci5rZXlOYW1lKGUpLCB1cCwgb2Zmc2V0O1xuICAgICAgICAgIGlmIChrZXlOYW1lID09ICdVcCcgfHwga2V5TmFtZSA9PSAnRG93bicpIHtcbiAgICAgICAgICAgIHVwID0ga2V5TmFtZSA9PSAnVXAnID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgb2Zmc2V0ID0gZS50YXJnZXQgPyBlLnRhcmdldC5zZWxlY3Rpb25FbmQgOiAwO1xuICAgICAgICAgICAgcXVlcnkgPSB2aW1HbG9iYWxTdGF0ZS5zZWFyY2hIaXN0b3J5Q29udHJvbGxlci5uZXh0TWF0Y2gocXVlcnksIHVwKSB8fCAnJztcbiAgICAgICAgICAgIGNsb3NlKHF1ZXJ5KTtcbiAgICAgICAgICAgIGlmIChvZmZzZXQgJiYgZS50YXJnZXQpIGUudGFyZ2V0LnNlbGVjdGlvbkVuZCA9IGUudGFyZ2V0LnNlbGVjdGlvblN0YXJ0ID0gTWF0aC5taW4ob2Zmc2V0LCBlLnRhcmdldC52YWx1ZS5sZW5ndGgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIGtleU5hbWUgIT0gJ0xlZnQnICYmIGtleU5hbWUgIT0gJ1JpZ2h0JyAmJiBrZXlOYW1lICE9ICdDdHJsJyAmJiBrZXlOYW1lICE9ICdBbHQnICYmIGtleU5hbWUgIT0gJ1NoaWZ0JylcbiAgICAgICAgICAgICAgdmltR2xvYmFsU3RhdGUuc2VhcmNoSGlzdG9yeUNvbnRyb2xsZXIucmVzZXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHBhcnNlZFF1ZXJ5O1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwYXJzZWRRdWVyeSA9IHVwZGF0ZVNlYXJjaFF1ZXJ5KGNtLCBxdWVyeSxcbiAgICAgICAgICAgICAgICB0cnVlIC8qKiBpZ25vcmVDYXNlICovLCB0cnVlIC8qKiBzbWFydENhc2UgKi8pO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIFN3YWxsb3cgYmFkIHJlZ2V4ZXMgZm9yIGluY3JlbWVudGFsIHNlYXJjaC5cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHBhcnNlZFF1ZXJ5KSB7XG4gICAgICAgICAgICBjbS5zY3JvbGxJbnRvVmlldyhmaW5kTmV4dChjbSwgIWZvcndhcmQsIHBhcnNlZFF1ZXJ5KSwgMzApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbGVhclNlYXJjaEhpZ2hsaWdodChjbSk7XG4gICAgICAgICAgICBjbS5zY3JvbGxUbyhvcmlnaW5hbFNjcm9sbFBvcy5sZWZ0LCBvcmlnaW5hbFNjcm9sbFBvcy50b3ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBvblByb21wdEtleURvd24oZSwgcXVlcnksIGNsb3NlKSB7XG4gICAgICAgICAgdmFyIGtleU5hbWUgPSBDb2RlTWlycm9yLmtleU5hbWUoZSk7XG4gICAgICAgICAgaWYgKGtleU5hbWUgPT0gJ0VzYycgfHwga2V5TmFtZSA9PSAnQ3RybC1DJyB8fCBrZXlOYW1lID09ICdDdHJsLVsnIHx8XG4gICAgICAgICAgICAgIChrZXlOYW1lID09ICdCYWNrc3BhY2UnICYmIHF1ZXJ5ID09ICcnKSkge1xuICAgICAgICAgICAgdmltR2xvYmFsU3RhdGUuc2VhcmNoSGlzdG9yeUNvbnRyb2xsZXIucHVzaElucHV0KHF1ZXJ5KTtcbiAgICAgICAgICAgIHZpbUdsb2JhbFN0YXRlLnNlYXJjaEhpc3RvcnlDb250cm9sbGVyLnJlc2V0KCk7XG4gICAgICAgICAgICB1cGRhdGVTZWFyY2hRdWVyeShjbSwgb3JpZ2luYWxRdWVyeSk7XG4gICAgICAgICAgICBjbGVhclNlYXJjaEhpZ2hsaWdodChjbSk7XG4gICAgICAgICAgICBjbS5zY3JvbGxUbyhvcmlnaW5hbFNjcm9sbFBvcy5sZWZ0LCBvcmlnaW5hbFNjcm9sbFBvcy50b3ApO1xuICAgICAgICAgICAgQ29kZU1pcnJvci5lX3N0b3AoZSk7XG4gICAgICAgICAgICBjbGVhcklucHV0U3RhdGUoY20pO1xuICAgICAgICAgICAgY2xvc2UoKTtcbiAgICAgICAgICAgIGNtLmZvY3VzKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChrZXlOYW1lID09ICdVcCcgfHwga2V5TmFtZSA9PSAnRG93bicpIHtcbiAgICAgICAgICAgIENvZGVNaXJyb3IuZV9zdG9wKGUpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoa2V5TmFtZSA9PSAnQ3RybC1VJykge1xuICAgICAgICAgICAgLy8gQ3RybC1VIGNsZWFycyBpbnB1dC5cbiAgICAgICAgICAgIENvZGVNaXJyb3IuZV9zdG9wKGUpO1xuICAgICAgICAgICAgY2xvc2UoJycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGNvbW1hbmQuc2VhcmNoQXJncy5xdWVyeVNyYykge1xuICAgICAgICAgIGNhc2UgJ3Byb21wdCc6XG4gICAgICAgICAgICB2YXIgbWFjcm9Nb2RlU3RhdGUgPSB2aW1HbG9iYWxTdGF0ZS5tYWNyb01vZGVTdGF0ZTtcbiAgICAgICAgICAgIGlmIChtYWNyb01vZGVTdGF0ZS5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gbWFjcm9Nb2RlU3RhdGUucmVwbGF5U2VhcmNoUXVlcmllcy5zaGlmdCgpO1xuICAgICAgICAgICAgICBoYW5kbGVRdWVyeShxdWVyeSwgdHJ1ZSAvKiogaWdub3JlQ2FzZSAqLywgZmFsc2UgLyoqIHNtYXJ0Q2FzZSAqLyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzaG93UHJvbXB0KGNtLCB7XG4gICAgICAgICAgICAgICAgICBvbkNsb3NlOiBvblByb21wdENsb3NlLFxuICAgICAgICAgICAgICAgICAgcHJlZml4OiBwcm9tcHRQcmVmaXgsXG4gICAgICAgICAgICAgICAgICBkZXNjOiBzZWFyY2hQcm9tcHREZXNjLFxuICAgICAgICAgICAgICAgICAgb25LZXlVcDogb25Qcm9tcHRLZXlVcCxcbiAgICAgICAgICAgICAgICAgIG9uS2V5RG93bjogb25Qcm9tcHRLZXlEb3duXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnd29yZFVuZGVyQ3Vyc29yJzpcbiAgICAgICAgICAgIHZhciB3b3JkID0gZXhwYW5kV29yZFVuZGVyQ3Vyc29yKGNtLCBmYWxzZSAvKiogaW5jbHVzaXZlICovLFxuICAgICAgICAgICAgICAgIHRydWUgLyoqIGZvcndhcmQgKi8sIGZhbHNlIC8qKiBiaWdXb3JkICovLFxuICAgICAgICAgICAgICAgIHRydWUgLyoqIG5vU3ltYm9sICovKTtcbiAgICAgICAgICAgIHZhciBpc0tleXdvcmQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKCF3b3JkKSB7XG4gICAgICAgICAgICAgIHdvcmQgPSBleHBhbmRXb3JkVW5kZXJDdXJzb3IoY20sIGZhbHNlIC8qKiBpbmNsdXNpdmUgKi8sXG4gICAgICAgICAgICAgICAgICB0cnVlIC8qKiBmb3J3YXJkICovLCBmYWxzZSAvKiogYmlnV29yZCAqLyxcbiAgICAgICAgICAgICAgICAgIGZhbHNlIC8qKiBub1N5bWJvbCAqLyk7XG4gICAgICAgICAgICAgIGlzS2V5d29yZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF3b3JkKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBxdWVyeSA9IGNtLmdldExpbmUod29yZC5zdGFydC5saW5lKS5zdWJzdHJpbmcod29yZC5zdGFydC5jaCxcbiAgICAgICAgICAgICAgICB3b3JkLmVuZC5jaCk7XG4gICAgICAgICAgICBpZiAoaXNLZXl3b3JkICYmIHdob2xlV29yZE9ubHkpIHtcbiAgICAgICAgICAgICAgICBxdWVyeSA9ICdcXFxcYicgKyBxdWVyeSArICdcXFxcYic7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBxdWVyeSA9IGVzY2FwZVJlZ2V4KHF1ZXJ5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY2FjaGVkQ3Vyc29yIGlzIHVzZWQgdG8gc2F2ZSB0aGUgb2xkIHBvc2l0aW9uIG9mIHRoZSBjdXJzb3JcbiAgICAgICAgICAgIC8vIHdoZW4gKiBvciAjIGNhdXNlcyB2aW0gdG8gc2VlayBmb3IgdGhlIG5lYXJlc3Qgd29yZCBhbmQgc2hpZnRcbiAgICAgICAgICAgIC8vIHRoZSBjdXJzb3IgYmVmb3JlIGVudGVyaW5nIHRoZSBtb3Rpb24uXG4gICAgICAgICAgICB2aW1HbG9iYWxTdGF0ZS5qdW1wTGlzdC5jYWNoZWRDdXJzb3IgPSBjbS5nZXRDdXJzb3IoKTtcbiAgICAgICAgICAgIGNtLnNldEN1cnNvcih3b3JkLnN0YXJ0KTtcblxuICAgICAgICAgICAgaGFuZGxlUXVlcnkocXVlcnksIHRydWUgLyoqIGlnbm9yZUNhc2UgKi8sIGZhbHNlIC8qKiBzbWFydENhc2UgKi8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwcm9jZXNzRXg6IGZ1bmN0aW9uKGNtLCB2aW0sIGNvbW1hbmQpIHtcbiAgICAgICAgZnVuY3Rpb24gb25Qcm9tcHRDbG9zZShpbnB1dCkge1xuICAgICAgICAgIC8vIEdpdmUgdGhlIHByb21wdCBzb21lIHRpbWUgdG8gY2xvc2Ugc28gdGhhdCBpZiBwcm9jZXNzQ29tbWFuZCBzaG93c1xuICAgICAgICAgIC8vIGFuIGVycm9yLCB0aGUgZWxlbWVudHMgZG9uJ3Qgb3ZlcmxhcC5cbiAgICAgICAgICB2aW1HbG9iYWxTdGF0ZS5leENvbW1hbmRIaXN0b3J5Q29udHJvbGxlci5wdXNoSW5wdXQoaW5wdXQpO1xuICAgICAgICAgIHZpbUdsb2JhbFN0YXRlLmV4Q29tbWFuZEhpc3RvcnlDb250cm9sbGVyLnJlc2V0KCk7XG4gICAgICAgICAgZXhDb21tYW5kRGlzcGF0Y2hlci5wcm9jZXNzQ29tbWFuZChjbSwgaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG9uUHJvbXB0S2V5RG93bihlLCBpbnB1dCwgY2xvc2UpIHtcbiAgICAgICAgICB2YXIga2V5TmFtZSA9IENvZGVNaXJyb3Iua2V5TmFtZShlKSwgdXAsIG9mZnNldDtcbiAgICAgICAgICBpZiAoa2V5TmFtZSA9PSAnRXNjJyB8fCBrZXlOYW1lID09ICdDdHJsLUMnIHx8IGtleU5hbWUgPT0gJ0N0cmwtWycgfHxcbiAgICAgICAgICAgICAgKGtleU5hbWUgPT0gJ0JhY2tzcGFjZScgJiYgaW5wdXQgPT0gJycpKSB7XG4gICAgICAgICAgICB2aW1HbG9iYWxTdGF0ZS5leENvbW1hbmRIaXN0b3J5Q29udHJvbGxlci5wdXNoSW5wdXQoaW5wdXQpO1xuICAgICAgICAgICAgdmltR2xvYmFsU3RhdGUuZXhDb21tYW5kSGlzdG9yeUNvbnRyb2xsZXIucmVzZXQoKTtcbiAgICAgICAgICAgIENvZGVNaXJyb3IuZV9zdG9wKGUpO1xuICAgICAgICAgICAgY2xlYXJJbnB1dFN0YXRlKGNtKTtcbiAgICAgICAgICAgIGNsb3NlKCk7XG4gICAgICAgICAgICBjbS5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoa2V5TmFtZSA9PSAnVXAnIHx8IGtleU5hbWUgPT0gJ0Rvd24nKSB7XG4gICAgICAgICAgICBDb2RlTWlycm9yLmVfc3RvcChlKTtcbiAgICAgICAgICAgIHVwID0ga2V5TmFtZSA9PSAnVXAnID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgb2Zmc2V0ID0gZS50YXJnZXQgPyBlLnRhcmdldC5zZWxlY3Rpb25FbmQgOiAwO1xuICAgICAgICAgICAgaW5wdXQgPSB2aW1HbG9iYWxTdGF0ZS5leENvbW1hbmRIaXN0b3J5Q29udHJvbGxlci5uZXh0TWF0Y2goaW5wdXQsIHVwKSB8fCAnJztcbiAgICAgICAgICAgIGNsb3NlKGlucHV0KTtcbiAgICAgICAgICAgIGlmIChvZmZzZXQgJiYgZS50YXJnZXQpIGUudGFyZ2V0LnNlbGVjdGlvbkVuZCA9IGUudGFyZ2V0LnNlbGVjdGlvblN0YXJ0ID0gTWF0aC5taW4ob2Zmc2V0LCBlLnRhcmdldC52YWx1ZS5sZW5ndGgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoa2V5TmFtZSA9PSAnQ3RybC1VJykge1xuICAgICAgICAgICAgLy8gQ3RybC1VIGNsZWFycyBpbnB1dC5cbiAgICAgICAgICAgIENvZGVNaXJyb3IuZV9zdG9wKGUpO1xuICAgICAgICAgICAgY2xvc2UoJycpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIGtleU5hbWUgIT0gJ0xlZnQnICYmIGtleU5hbWUgIT0gJ1JpZ2h0JyAmJiBrZXlOYW1lICE9ICdDdHJsJyAmJiBrZXlOYW1lICE9ICdBbHQnICYmIGtleU5hbWUgIT0gJ1NoaWZ0JylcbiAgICAgICAgICAgICAgdmltR2xvYmFsU3RhdGUuZXhDb21tYW5kSGlzdG9yeUNvbnRyb2xsZXIucmVzZXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbW1hbmQudHlwZSA9PSAna2V5VG9FeCcpIHtcbiAgICAgICAgICAvLyBIYW5kbGUgdXNlciBkZWZpbmVkIEV4IHRvIEV4IG1hcHBpbmdzXG4gICAgICAgICAgZXhDb21tYW5kRGlzcGF0Y2hlci5wcm9jZXNzQ29tbWFuZChjbSwgY29tbWFuZC5leEFyZ3MuaW5wdXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh2aW0udmlzdWFsTW9kZSkge1xuICAgICAgICAgICAgc2hvd1Byb21wdChjbSwgeyBvbkNsb3NlOiBvblByb21wdENsb3NlLCBwcmVmaXg6ICc6JywgdmFsdWU6ICdcXCc8LFxcJz4nLFxuICAgICAgICAgICAgICAgIG9uS2V5RG93bjogb25Qcm9tcHRLZXlEb3duLCBzZWxlY3RWYWx1ZU9uT3BlbjogZmFsc2V9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2hvd1Byb21wdChjbSwgeyBvbkNsb3NlOiBvblByb21wdENsb3NlLCBwcmVmaXg6ICc6JyxcbiAgICAgICAgICAgICAgICBvbktleURvd246IG9uUHJvbXB0S2V5RG93bn0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGV2YWxJbnB1dDogZnVuY3Rpb24oY20sIHZpbSkge1xuICAgICAgICAvLyBJZiB0aGUgbW90aW9uIGNvbW1hbmQgaXMgc2V0LCBleGVjdXRlIGJvdGggdGhlIG9wZXJhdG9yIGFuZCBtb3Rpb24uXG4gICAgICAgIC8vIE90aGVyd2lzZSByZXR1cm4uXG4gICAgICAgIHZhciBpbnB1dFN0YXRlID0gdmltLmlucHV0U3RhdGU7XG4gICAgICAgIHZhciBtb3Rpb24gPSBpbnB1dFN0YXRlLm1vdGlvbjtcbiAgICAgICAgdmFyIG1vdGlvbkFyZ3MgPSBpbnB1dFN0YXRlLm1vdGlvbkFyZ3MgfHwge307XG4gICAgICAgIHZhciBvcGVyYXRvciA9IGlucHV0U3RhdGUub3BlcmF0b3I7XG4gICAgICAgIHZhciBvcGVyYXRvckFyZ3MgPSBpbnB1dFN0YXRlLm9wZXJhdG9yQXJncyB8fCB7fTtcbiAgICAgICAgdmFyIHJlZ2lzdGVyTmFtZSA9IGlucHV0U3RhdGUucmVnaXN0ZXJOYW1lO1xuICAgICAgICB2YXIgc2VsID0gdmltLnNlbDtcbiAgICAgICAgLy8gVE9ETzogTWFrZSBzdXJlIGNtIGFuZCB2aW0gc2VsZWN0aW9ucyBhcmUgaWRlbnRpY2FsIG91dHNpZGUgdmlzdWFsIG1vZGUuXG4gICAgICAgIHZhciBvcmlnSGVhZCA9IGNvcHlDdXJzb3IodmltLnZpc3VhbE1vZGUgPyBjbGlwQ3Vyc29yVG9Db250ZW50KGNtLCBzZWwuaGVhZCk6IGNtLmdldEN1cnNvcignaGVhZCcpKTtcbiAgICAgICAgdmFyIG9yaWdBbmNob3IgPSBjb3B5Q3Vyc29yKHZpbS52aXN1YWxNb2RlID8gY2xpcEN1cnNvclRvQ29udGVudChjbSwgc2VsLmFuY2hvcikgOiBjbS5nZXRDdXJzb3IoJ2FuY2hvcicpKTtcbiAgICAgICAgdmFyIG9sZEhlYWQgPSBjb3B5Q3Vyc29yKG9yaWdIZWFkKTtcbiAgICAgICAgdmFyIG9sZEFuY2hvciA9IGNvcHlDdXJzb3Iob3JpZ0FuY2hvcik7XG4gICAgICAgIHZhciBuZXdIZWFkLCBuZXdBbmNob3I7XG4gICAgICAgIHZhciByZXBlYXQ7XG4gICAgICAgIGlmIChvcGVyYXRvcikge1xuICAgICAgICAgIHRoaXMucmVjb3JkTGFzdEVkaXQodmltLCBpbnB1dFN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5wdXRTdGF0ZS5yZXBlYXRPdmVycmlkZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgLy8gSWYgcmVwZWF0T3ZlcnJpZGUgaXMgc3BlY2lmaWVkLCB0aGF0IHRha2VzIHByZWNlZGVuY2Ugb3ZlciB0aGVcbiAgICAgICAgICAvLyBpbnB1dCBzdGF0ZSdzIHJlcGVhdC4gVXNlZCBieSBFeCBtb2RlIGFuZCBjYW4gYmUgdXNlciBkZWZpbmVkLlxuICAgICAgICAgIHJlcGVhdCA9IGlucHV0U3RhdGUucmVwZWF0T3ZlcnJpZGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVwZWF0ID0gaW5wdXRTdGF0ZS5nZXRSZXBlYXQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVwZWF0ID4gMCAmJiBtb3Rpb25BcmdzLmV4cGxpY2l0UmVwZWF0KSB7XG4gICAgICAgICAgbW90aW9uQXJncy5yZXBlYXRJc0V4cGxpY2l0ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChtb3Rpb25BcmdzLm5vUmVwZWF0IHx8XG4gICAgICAgICAgICAoIW1vdGlvbkFyZ3MuZXhwbGljaXRSZXBlYXQgJiYgcmVwZWF0ID09PSAwKSkge1xuICAgICAgICAgIHJlcGVhdCA9IDE7XG4gICAgICAgICAgbW90aW9uQXJncy5yZXBlYXRJc0V4cGxpY2l0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlucHV0U3RhdGUuc2VsZWN0ZWRDaGFyYWN0ZXIpIHtcbiAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBhIGNoYXJhY3RlciBpbnB1dCwgc3RpY2sgaXQgaW4gYWxsIG9mIHRoZSBhcmcgYXJyYXlzLlxuICAgICAgICAgIG1vdGlvbkFyZ3Muc2VsZWN0ZWRDaGFyYWN0ZXIgPSBvcGVyYXRvckFyZ3Muc2VsZWN0ZWRDaGFyYWN0ZXIgPVxuICAgICAgICAgICAgICBpbnB1dFN0YXRlLnNlbGVjdGVkQ2hhcmFjdGVyO1xuICAgICAgICB9XG4gICAgICAgIG1vdGlvbkFyZ3MucmVwZWF0ID0gcmVwZWF0O1xuICAgICAgICBjbGVhcklucHV0U3RhdGUoY20pO1xuICAgICAgICBpZiAobW90aW9uKSB7XG4gICAgICAgICAgdmFyIG1vdGlvblJlc3VsdCA9IG1vdGlvbnNbbW90aW9uXShjbSwgb3JpZ0hlYWQsIG1vdGlvbkFyZ3MsIHZpbSk7XG4gICAgICAgICAgdmltLmxhc3RNb3Rpb24gPSBtb3Rpb25zW21vdGlvbl07XG4gICAgICAgICAgaWYgKCFtb3Rpb25SZXN1bHQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG1vdGlvbkFyZ3MudG9KdW1wbGlzdCkge1xuICAgICAgICAgICAgdmFyIGp1bXBMaXN0ID0gdmltR2xvYmFsU3RhdGUuanVtcExpc3Q7XG4gICAgICAgICAgICAvLyBpZiB0aGUgY3VycmVudCBtb3Rpb24gaXMgIyBvciAqLCB1c2UgY2FjaGVkQ3Vyc29yXG4gICAgICAgICAgICB2YXIgY2FjaGVkQ3Vyc29yID0ganVtcExpc3QuY2FjaGVkQ3Vyc29yO1xuICAgICAgICAgICAgaWYgKGNhY2hlZEN1cnNvcikge1xuICAgICAgICAgICAgICByZWNvcmRKdW1wUG9zaXRpb24oY20sIGNhY2hlZEN1cnNvciwgbW90aW9uUmVzdWx0KTtcbiAgICAgICAgICAgICAgZGVsZXRlIGp1bXBMaXN0LmNhY2hlZEN1cnNvcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlY29yZEp1bXBQb3NpdGlvbihjbSwgb3JpZ0hlYWQsIG1vdGlvblJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChtb3Rpb25SZXN1bHQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgbmV3QW5jaG9yID0gbW90aW9uUmVzdWx0WzBdO1xuICAgICAgICAgICAgbmV3SGVhZCA9IG1vdGlvblJlc3VsdFsxXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3SGVhZCA9IG1vdGlvblJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gVE9ETzogSGFuZGxlIG51bGwgcmV0dXJucyBmcm9tIG1vdGlvbiBjb21tYW5kcyBiZXR0ZXIuXG4gICAgICAgICAgaWYgKCFuZXdIZWFkKSB7XG4gICAgICAgICAgICBuZXdIZWFkID0gY29weUN1cnNvcihvcmlnSGVhZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh2aW0udmlzdWFsTW9kZSkge1xuICAgICAgICAgICAgaWYgKCEodmltLnZpc3VhbEJsb2NrICYmIG5ld0hlYWQuY2ggPT09IEluZmluaXR5KSkge1xuICAgICAgICAgICAgICBuZXdIZWFkID0gY2xpcEN1cnNvclRvQ29udGVudChjbSwgbmV3SGVhZCwgdmltLnZpc3VhbEJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChuZXdBbmNob3IpIHtcbiAgICAgICAgICAgICAgbmV3QW5jaG9yID0gY2xpcEN1cnNvclRvQ29udGVudChjbSwgbmV3QW5jaG9yLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld0FuY2hvciA9IG5ld0FuY2hvciB8fCBvbGRBbmNob3I7XG4gICAgICAgICAgICBzZWwuYW5jaG9yID0gbmV3QW5jaG9yO1xuICAgICAgICAgICAgc2VsLmhlYWQgPSBuZXdIZWFkO1xuICAgICAgICAgICAgdXBkYXRlQ21TZWxlY3Rpb24oY20pO1xuICAgICAgICAgICAgdXBkYXRlTWFyayhjbSwgdmltLCAnPCcsXG4gICAgICAgICAgICAgICAgY3Vyc29ySXNCZWZvcmUobmV3QW5jaG9yLCBuZXdIZWFkKSA/IG5ld0FuY2hvclxuICAgICAgICAgICAgICAgICAgICA6IG5ld0hlYWQpO1xuICAgICAgICAgICAgdXBkYXRlTWFyayhjbSwgdmltLCAnPicsXG4gICAgICAgICAgICAgICAgY3Vyc29ySXNCZWZvcmUobmV3QW5jaG9yLCBuZXdIZWFkKSA/IG5ld0hlYWRcbiAgICAgICAgICAgICAgICAgICAgOiBuZXdBbmNob3IpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIW9wZXJhdG9yKSB7XG4gICAgICAgICAgICBuZXdIZWFkID0gY2xpcEN1cnNvclRvQ29udGVudChjbSwgbmV3SGVhZCk7XG4gICAgICAgICAgICBjbS5zZXRDdXJzb3IobmV3SGVhZC5saW5lLCBuZXdIZWFkLmNoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wZXJhdG9yKSB7XG4gICAgICAgICAgaWYgKG9wZXJhdG9yQXJncy5sYXN0U2VsKSB7XG4gICAgICAgICAgICAvLyBSZXBsYXlpbmcgYSB2aXN1YWwgbW9kZSBvcGVyYXRpb25cbiAgICAgICAgICAgIG5ld0FuY2hvciA9IG9sZEFuY2hvcjtcbiAgICAgICAgICAgIHZhciBsYXN0U2VsID0gb3BlcmF0b3JBcmdzLmxhc3RTZWw7XG4gICAgICAgICAgICB2YXIgbGluZU9mZnNldCA9IE1hdGguYWJzKGxhc3RTZWwuaGVhZC5saW5lIC0gbGFzdFNlbC5hbmNob3IubGluZSk7XG4gICAgICAgICAgICB2YXIgY2hPZmZzZXQgPSBNYXRoLmFicyhsYXN0U2VsLmhlYWQuY2ggLSBsYXN0U2VsLmFuY2hvci5jaCk7XG4gICAgICAgICAgICBpZiAobGFzdFNlbC52aXN1YWxMaW5lKSB7XG4gICAgICAgICAgICAgIC8vIExpbmV3aXNlIFZpc3VhbCBtb2RlOiBUaGUgc2FtZSBudW1iZXIgb2YgbGluZXMuXG4gICAgICAgICAgICAgIG5ld0hlYWQgPSBQb3Mob2xkQW5jaG9yLmxpbmUgKyBsaW5lT2Zmc2V0LCBvbGRBbmNob3IuY2gpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChsYXN0U2VsLnZpc3VhbEJsb2NrKSB7XG4gICAgICAgICAgICAgIC8vIEJsb2Nrd2lzZSBWaXN1YWwgbW9kZTogVGhlIHNhbWUgbnVtYmVyIG9mIGxpbmVzIGFuZCBjb2x1bW5zLlxuICAgICAgICAgICAgICBuZXdIZWFkID0gUG9zKG9sZEFuY2hvci5saW5lICsgbGluZU9mZnNldCwgb2xkQW5jaG9yLmNoICsgY2hPZmZzZXQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChsYXN0U2VsLmhlYWQubGluZSA9PSBsYXN0U2VsLmFuY2hvci5saW5lKSB7XG4gICAgICAgICAgICAgIC8vIE5vcm1hbCBWaXN1YWwgbW9kZSB3aXRoaW4gb25lIGxpbmU6IFRoZSBzYW1lIG51bWJlciBvZiBjaGFyYWN0ZXJzLlxuICAgICAgICAgICAgICBuZXdIZWFkID0gUG9zKG9sZEFuY2hvci5saW5lLCBvbGRBbmNob3IuY2ggKyBjaE9mZnNldCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBOb3JtYWwgVmlzdWFsIG1vZGUgd2l0aCBzZXZlcmFsIGxpbmVzOiBUaGUgc2FtZSBudW1iZXIgb2YgbGluZXMsIGluIHRoZVxuICAgICAgICAgICAgICAvLyBsYXN0IGxpbmUgdGhlIHNhbWUgbnVtYmVyIG9mIGNoYXJhY3RlcnMgYXMgaW4gdGhlIGxhc3QgbGluZSB0aGUgbGFzdCB0aW1lLlxuICAgICAgICAgICAgICBuZXdIZWFkID0gUG9zKG9sZEFuY2hvci5saW5lICsgbGluZU9mZnNldCwgb2xkQW5jaG9yLmNoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZpbS52aXN1YWxNb2RlID0gdHJ1ZTtcbiAgICAgICAgICAgIHZpbS52aXN1YWxMaW5lID0gbGFzdFNlbC52aXN1YWxMaW5lO1xuICAgICAgICAgICAgdmltLnZpc3VhbEJsb2NrID0gbGFzdFNlbC52aXN1YWxCbG9jaztcbiAgICAgICAgICAgIHNlbCA9IHZpbS5zZWwgPSB7XG4gICAgICAgICAgICAgIGFuY2hvcjogbmV3QW5jaG9yLFxuICAgICAgICAgICAgICBoZWFkOiBuZXdIZWFkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdXBkYXRlQ21TZWxlY3Rpb24oY20pO1xuICAgICAgICAgIH0gZWxzZSBpZiAodmltLnZpc3VhbE1vZGUpIHtcbiAgICAgICAgICAgIG9wZXJhdG9yQXJncy5sYXN0U2VsID0ge1xuICAgICAgICAgICAgICBhbmNob3I6IGNvcHlDdXJzb3Ioc2VsLmFuY2hvciksXG4gICAgICAgICAgICAgIGhlYWQ6IGNvcHlDdXJzb3Ioc2VsLmhlYWQpLFxuICAgICAgICAgICAgICB2aXN1YWxCbG9jazogdmltLnZpc3VhbEJsb2NrLFxuICAgICAgICAgICAgICB2aXN1YWxMaW5lOiB2aW0udmlzdWFsTGluZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGN1clN0YXJ0LCBjdXJFbmQsIGxpbmV3aXNlLCBtb2RlO1xuICAgICAgICAgIHZhciBjbVNlbDtcbiAgICAgICAgICBpZiAodmltLnZpc3VhbE1vZGUpIHtcbiAgICAgICAgICAgIC8vIEluaXQgdmlzdWFsIG9wXG4gICAgICAgICAgICBjdXJTdGFydCA9IGN1cnNvck1pbihzZWwuaGVhZCwgc2VsLmFuY2hvcik7XG4gICAgICAgICAgICBjdXJFbmQgPSBjdXJzb3JNYXgoc2VsLmhlYWQsIHNlbC5hbmNob3IpO1xuICAgICAgICAgICAgbGluZXdpc2UgPSB2aW0udmlzdWFsTGluZSB8fCBvcGVyYXRvckFyZ3MubGluZXdpc2U7XG4gICAgICAgICAgICBtb2RlID0gdmltLnZpc3VhbEJsb2NrID8gJ2Jsb2NrJyA6XG4gICAgICAgICAgICAgICAgICAgbGluZXdpc2UgPyAnbGluZScgOlxuICAgICAgICAgICAgICAgICAgICdjaGFyJztcbiAgICAgICAgICAgIGNtU2VsID0gbWFrZUNtU2VsZWN0aW9uKGNtLCB7XG4gICAgICAgICAgICAgIGFuY2hvcjogY3VyU3RhcnQsXG4gICAgICAgICAgICAgIGhlYWQ6IGN1ckVuZFxuICAgICAgICAgICAgfSwgbW9kZSk7XG4gICAgICAgICAgICBpZiAobGluZXdpc2UpIHtcbiAgICAgICAgICAgICAgdmFyIHJhbmdlcyA9IGNtU2VsLnJhbmdlcztcbiAgICAgICAgICAgICAgaWYgKG1vZGUgPT0gJ2Jsb2NrJykge1xuICAgICAgICAgICAgICAgIC8vIExpbmV3aXNlIG9wZXJhdG9ycyBpbiB2aXN1YWwgYmxvY2sgbW9kZSBleHRlbmQgdG8gZW5kIG9mIGxpbmVcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgcmFuZ2VzW2ldLmhlYWQuY2ggPSBsaW5lTGVuZ3RoKGNtLCByYW5nZXNbaV0uaGVhZC5saW5lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAobW9kZSA9PSAnbGluZScpIHtcbiAgICAgICAgICAgICAgICByYW5nZXNbMF0uaGVhZCA9IFBvcyhyYW5nZXNbMF0uaGVhZC5saW5lICsgMSwgMCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSW5pdCBtb3Rpb24gb3BcbiAgICAgICAgICAgIGN1clN0YXJ0ID0gY29weUN1cnNvcihuZXdBbmNob3IgfHwgb2xkQW5jaG9yKTtcbiAgICAgICAgICAgIGN1ckVuZCA9IGNvcHlDdXJzb3IobmV3SGVhZCB8fCBvbGRIZWFkKTtcbiAgICAgICAgICAgIGlmIChjdXJzb3JJc0JlZm9yZShjdXJFbmQsIGN1clN0YXJ0KSkge1xuICAgICAgICAgICAgICB2YXIgdG1wID0gY3VyU3RhcnQ7XG4gICAgICAgICAgICAgIGN1clN0YXJ0ID0gY3VyRW5kO1xuICAgICAgICAgICAgICBjdXJFbmQgPSB0bXA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsaW5ld2lzZSA9IG1vdGlvbkFyZ3MubGluZXdpc2UgfHwgb3BlcmF0b3JBcmdzLmxpbmV3aXNlO1xuICAgICAgICAgICAgaWYgKGxpbmV3aXNlKSB7XG4gICAgICAgICAgICAgIC8vIEV4cGFuZCBzZWxlY3Rpb24gdG8gZW50aXJlIGxpbmUuXG4gICAgICAgICAgICAgIGV4cGFuZFNlbGVjdGlvblRvTGluZShjbSwgY3VyU3RhcnQsIGN1ckVuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1vdGlvbkFyZ3MuZm9yd2FyZCkge1xuICAgICAgICAgICAgICAvLyBDbGlwIHRvIHRyYWlsaW5nIG5ld2xpbmVzIG9ubHkgaWYgdGhlIG1vdGlvbiBnb2VzIGZvcndhcmQuXG4gICAgICAgICAgICAgIGNsaXBUb0xpbmUoY20sIGN1clN0YXJ0LCBjdXJFbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbW9kZSA9ICdjaGFyJztcbiAgICAgICAgICAgIHZhciBleGNsdXNpdmUgPSAhbW90aW9uQXJncy5pbmNsdXNpdmUgfHwgbGluZXdpc2U7XG4gICAgICAgICAgICBjbVNlbCA9IG1ha2VDbVNlbGVjdGlvbihjbSwge1xuICAgICAgICAgICAgICBhbmNob3I6IGN1clN0YXJ0LFxuICAgICAgICAgICAgICBoZWFkOiBjdXJFbmRcbiAgICAgICAgICAgIH0sIG1vZGUsIGV4Y2x1c2l2ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNtLnNldFNlbGVjdGlvbnMoY21TZWwucmFuZ2VzLCBjbVNlbC5wcmltYXJ5KTtcbiAgICAgICAgICB2aW0ubGFzdE1vdGlvbiA9IG51bGw7XG4gICAgICAgICAgb3BlcmF0b3JBcmdzLnJlcGVhdCA9IHJlcGVhdDsgLy8gRm9yIGluZGVudCBpbiB2aXN1YWwgbW9kZS5cbiAgICAgICAgICBvcGVyYXRvckFyZ3MucmVnaXN0ZXJOYW1lID0gcmVnaXN0ZXJOYW1lO1xuICAgICAgICAgIC8vIEtlZXAgdHJhY2sgb2YgbGluZXdpc2UgYXMgaXQgYWZmZWN0cyBob3cgcGFzdGUgYW5kIGNoYW5nZSBiZWhhdmUuXG4gICAgICAgICAgb3BlcmF0b3JBcmdzLmxpbmV3aXNlID0gbGluZXdpc2U7XG4gICAgICAgICAgdmFyIG9wZXJhdG9yTW92ZVRvID0gb3BlcmF0b3JzW29wZXJhdG9yXShcbiAgICAgICAgICAgIGNtLCBvcGVyYXRvckFyZ3MsIGNtU2VsLnJhbmdlcywgb2xkQW5jaG9yLCBuZXdIZWFkKTtcbiAgICAgICAgICBpZiAodmltLnZpc3VhbE1vZGUpIHtcbiAgICAgICAgICAgIGV4aXRWaXN1YWxNb2RlKGNtLCBvcGVyYXRvck1vdmVUbyAhPSBudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG9wZXJhdG9yTW92ZVRvKSB7XG4gICAgICAgICAgICBjbS5zZXRDdXJzb3Iob3BlcmF0b3JNb3ZlVG8pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHJlY29yZExhc3RFZGl0OiBmdW5jdGlvbih2aW0sIGlucHV0U3RhdGUsIGFjdGlvbkNvbW1hbmQpIHtcbiAgICAgICAgdmFyIG1hY3JvTW9kZVN0YXRlID0gdmltR2xvYmFsU3RhdGUubWFjcm9Nb2RlU3RhdGU7XG4gICAgICAgIGlmIChtYWNyb01vZGVTdGF0ZS5pc1BsYXlpbmcpIHsgcmV0dXJuOyB9XG4gICAgICAgIHZpbS5sYXN0RWRpdElucHV0U3RhdGUgPSBpbnB1dFN0YXRlO1xuICAgICAgICB2aW0ubGFzdEVkaXRBY3Rpb25Db21tYW5kID0gYWN0aW9uQ29tbWFuZDtcbiAgICAgICAgbWFjcm9Nb2RlU3RhdGUubGFzdEluc2VydE1vZGVDaGFuZ2VzLmNoYW5nZXMgPSBbXTtcbiAgICAgICAgbWFjcm9Nb2RlU3RhdGUubGFzdEluc2VydE1vZGVDaGFuZ2VzLmV4cGVjdEN1cnNvckFjdGl2aXR5Rm9yQ2hhbmdlID0gZmFsc2U7XG4gICAgICAgIG1hY3JvTW9kZVN0YXRlLmxhc3RJbnNlcnRNb2RlQ2hhbmdlcy52aXN1YWxCbG9jayA9IHZpbS52aXN1YWxCbG9jayA/IHZpbS5zZWwuaGVhZC5saW5lIC0gdmltLnNlbC5hbmNob3IubGluZSA6IDA7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIHR5cGVkZWYge09iamVjdHtsaW5lOm51bWJlcixjaDpudW1iZXJ9fSBDdXJzb3IgQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlXG4gICAgICogICAgIHBvc2l0aW9uIG9mIHRoZSBjdXJzb3IuXG4gICAgICovXG4gICAgLy8gQWxsIG9mIHRoZSBmdW5jdGlvbnMgYmVsb3cgcmV0dXJuIEN1cnNvciBvYmplY3RzLlxuICAgIHZhciBtb3Rpb25zID0ge1xuICAgICAgbW92ZVRvVG9wTGluZTogZnVuY3Rpb24oY20sIF9oZWFkLCBtb3Rpb25BcmdzKSB7XG4gICAgICAgIHZhciBsaW5lID0gZ2V0VXNlclZpc2libGVMaW5lcyhjbSkudG9wICsgbW90aW9uQXJncy5yZXBlYXQgLTE7XG4gICAgICAgIHJldHVybiBQb3MobGluZSwgZmluZEZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcihjbS5nZXRMaW5lKGxpbmUpKSk7XG4gICAgICB9LFxuICAgICAgbW92ZVRvTWlkZGxlTGluZTogZnVuY3Rpb24oY20pIHtcbiAgICAgICAgdmFyIHJhbmdlID0gZ2V0VXNlclZpc2libGVMaW5lcyhjbSk7XG4gICAgICAgIHZhciBsaW5lID0gTWF0aC5mbG9vcigocmFuZ2UudG9wICsgcmFuZ2UuYm90dG9tKSAqIDAuNSk7XG4gICAgICAgIHJldHVybiBQb3MobGluZSwgZmluZEZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcihjbS5nZXRMaW5lKGxpbmUpKSk7XG4gICAgICB9LFxuICAgICAgbW92ZVRvQm90dG9tTGluZTogZnVuY3Rpb24oY20sIF9oZWFkLCBtb3Rpb25BcmdzKSB7XG4gICAgICAgIHZhciBsaW5lID0gZ2V0VXNlclZpc2libGVMaW5lcyhjbSkuYm90dG9tIC0gbW90aW9uQXJncy5yZXBlYXQgKzE7XG4gICAgICAgIHJldHVybiBQb3MobGluZSwgZmluZEZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcihjbS5nZXRMaW5lKGxpbmUpKSk7XG4gICAgICB9LFxuICAgICAgZXhwYW5kVG9MaW5lOiBmdW5jdGlvbihfY20sIGhlYWQsIG1vdGlvbkFyZ3MpIHtcbiAgICAgICAgLy8gRXhwYW5kcyBmb3J3YXJkIHRvIGVuZCBvZiBsaW5lLCBhbmQgdGhlbiB0byBuZXh0IGxpbmUgaWYgcmVwZWF0IGlzXG4gICAgICAgIC8vID4xLiBEb2VzIG5vdCBoYW5kbGUgYmFja3dhcmQgbW90aW9uIVxuICAgICAgICB2YXIgY3VyID0gaGVhZDtcbiAgICAgICAgcmV0dXJuIFBvcyhjdXIubGluZSArIG1vdGlvbkFyZ3MucmVwZWF0IC0gMSwgSW5maW5pdHkpO1xuICAgICAgfSxcbiAgICAgIGZpbmROZXh0OiBmdW5jdGlvbihjbSwgX2hlYWQsIG1vdGlvbkFyZ3MpIHtcbiAgICAgICAgdmFyIHN0YXRlID0gZ2V0U2VhcmNoU3RhdGUoY20pO1xuICAgICAgICB2YXIgcXVlcnkgPSBzdGF0ZS5nZXRRdWVyeSgpO1xuICAgICAgICBpZiAoIXF1ZXJ5KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwcmV2ID0gIW1vdGlvbkFyZ3MuZm9yd2FyZDtcbiAgICAgICAgLy8gSWYgc2VhcmNoIGlzIGluaXRpYXRlZCB3aXRoID8gaW5zdGVhZCBvZiAvLCBuZWdhdGUgZGlyZWN0aW9uLlxuICAgICAgICBwcmV2ID0gKHN0YXRlLmlzUmV2ZXJzZWQoKSkgPyAhcHJldiA6IHByZXY7XG4gICAgICAgIGhpZ2hsaWdodFNlYXJjaE1hdGNoZXMoY20sIHF1ZXJ5KTtcbiAgICAgICAgcmV0dXJuIGZpbmROZXh0KGNtLCBwcmV2LyoqIHByZXYgKi8sIHF1ZXJ5LCBtb3Rpb25BcmdzLnJlcGVhdCk7XG4gICAgICB9LFxuICAgICAgZ29Ub01hcms6IGZ1bmN0aW9uKGNtLCBfaGVhZCwgbW90aW9uQXJncywgdmltKSB7XG4gICAgICAgIHZhciBwb3MgPSBnZXRNYXJrUG9zKGNtLCB2aW0sIG1vdGlvbkFyZ3Muc2VsZWN0ZWRDaGFyYWN0ZXIpO1xuICAgICAgICBpZiAocG9zKSB7XG4gICAgICAgICAgcmV0dXJuIG1vdGlvbkFyZ3MubGluZXdpc2UgPyB7IGxpbmU6IHBvcy5saW5lLCBjaDogZmluZEZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcihjbS5nZXRMaW5lKHBvcy5saW5lKSkgfSA6IHBvcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0sXG4gICAgICBtb3ZlVG9PdGhlckhpZ2hsaWdodGVkRW5kOiBmdW5jdGlvbihjbSwgX2hlYWQsIG1vdGlvbkFyZ3MsIHZpbSkge1xuICAgICAgICBpZiAodmltLnZpc3VhbEJsb2NrICYmIG1vdGlvbkFyZ3Muc2FtZUxpbmUpIHtcbiAgICAgICAgICB2YXIgc2VsID0gdmltLnNlbDtcbiAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgY2xpcEN1cnNvclRvQ29udGVudChjbSwgUG9zKHNlbC5hbmNob3IubGluZSwgc2VsLmhlYWQuY2gpKSxcbiAgICAgICAgICAgIGNsaXBDdXJzb3JUb0NvbnRlbnQoY20sIFBvcyhzZWwuaGVhZC5saW5lLCBzZWwuYW5jaG9yLmNoKSlcbiAgICAgICAgICBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAoW3ZpbS5zZWwuaGVhZCwgdmltLnNlbC5hbmNob3JdKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGp1bXBUb01hcms6IGZ1bmN0aW9uKGNtLCBoZWFkLCBtb3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgdmFyIGJlc3QgPSBoZWFkO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1vdGlvbkFyZ3MucmVwZWF0OyBpKyspIHtcbiAgICAgICAgICB2YXIgY3Vyc29yID0gYmVzdDtcbiAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdmltLm1hcmtzKSB7XG4gICAgICAgICAgICBpZiAoIWlzTG93ZXJDYXNlKGtleSkpIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbWFyayA9IHZpbS5tYXJrc1trZXldLmZpbmQoKTtcbiAgICAgICAgICAgIHZhciBpc1dyb25nRGlyZWN0aW9uID0gKG1vdGlvbkFyZ3MuZm9yd2FyZCkgP1xuICAgICAgICAgICAgICBjdXJzb3JJc0JlZm9yZShtYXJrLCBjdXJzb3IpIDogY3Vyc29ySXNCZWZvcmUoY3Vyc29yLCBtYXJrKTtcblxuICAgICAgICAgICAgaWYgKGlzV3JvbmdEaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobW90aW9uQXJncy5saW5ld2lzZSAmJiAobWFyay5saW5lID09IGN1cnNvci5saW5lKSkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGVxdWFsID0gY3Vyc29yRXF1YWwoY3Vyc29yLCBiZXN0KTtcbiAgICAgICAgICAgIHZhciBiZXR3ZWVuID0gKG1vdGlvbkFyZ3MuZm9yd2FyZCkgP1xuICAgICAgICAgICAgICBjdXJzb3JJc0JldHdlZW4oY3Vyc29yLCBtYXJrLCBiZXN0KSA6XG4gICAgICAgICAgICAgIGN1cnNvcklzQmV0d2VlbihiZXN0LCBtYXJrLCBjdXJzb3IpO1xuXG4gICAgICAgICAgICBpZiAoZXF1YWwgfHwgYmV0d2Vlbikge1xuICAgICAgICAgICAgICBiZXN0ID0gbWFyaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW90aW9uQXJncy5saW5ld2lzZSkge1xuICAgICAgICAgIC8vIFZpbSBwbGFjZXMgdGhlIGN1cnNvciBvbiB0aGUgZmlyc3Qgbm9uLXdoaXRlc3BhY2UgY2hhcmFjdGVyIG9mXG4gICAgICAgICAgLy8gdGhlIGxpbmUgaWYgdGhlcmUgaXMgb25lLCBlbHNlIGl0IHBsYWNlcyB0aGUgY3Vyc29yIGF0IHRoZSBlbmRcbiAgICAgICAgICAvLyBvZiB0aGUgbGluZSwgcmVnYXJkbGVzcyBvZiB3aGV0aGVyIGEgbWFyayB3YXMgZm91bmQuXG4gICAgICAgICAgYmVzdCA9IFBvcyhiZXN0LmxpbmUsIGZpbmRGaXJzdE5vbldoaXRlU3BhY2VDaGFyYWN0ZXIoY20uZ2V0TGluZShiZXN0LmxpbmUpKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJlc3Q7XG4gICAgICB9LFxuICAgICAgbW92ZUJ5Q2hhcmFjdGVyczogZnVuY3Rpb24oX2NtLCBoZWFkLCBtb3Rpb25BcmdzKSB7XG4gICAgICAgIHZhciBjdXIgPSBoZWFkO1xuICAgICAgICB2YXIgcmVwZWF0ID0gbW90aW9uQXJncy5yZXBlYXQ7XG4gICAgICAgIHZhciBjaCA9IG1vdGlvbkFyZ3MuZm9yd2FyZCA/IGN1ci5jaCArIHJlcGVhdCA6IGN1ci5jaCAtIHJlcGVhdDtcbiAgICAgICAgcmV0dXJuIFBvcyhjdXIubGluZSwgY2gpO1xuICAgICAgfSxcbiAgICAgIG1vdmVCeUxpbmVzOiBmdW5jdGlvbihjbSwgaGVhZCwgbW90aW9uQXJncywgdmltKSB7XG4gICAgICAgIHZhciBjdXIgPSBoZWFkO1xuICAgICAgICB2YXIgZW5kQ2ggPSBjdXIuY2g7XG4gICAgICAgIC8vIERlcGVuZGluZyB3aGF0IG91ciBsYXN0IG1vdGlvbiB3YXMsIHdlIG1heSB3YW50IHRvIGRvIGRpZmZlcmVudFxuICAgICAgICAvLyB0aGluZ3MuIElmIG91ciBsYXN0IG1vdGlvbiB3YXMgbW92aW5nIHZlcnRpY2FsbHksIHdlIHdhbnQgdG9cbiAgICAgICAgLy8gcHJlc2VydmUgdGhlIEhQb3MgZnJvbSBvdXIgbGFzdCBob3Jpem9udGFsIG1vdmUuICBJZiBvdXIgbGFzdCBtb3Rpb25cbiAgICAgICAgLy8gd2FzIGdvaW5nIHRvIHRoZSBlbmQgb2YgYSBsaW5lLCBtb3ZpbmcgdmVydGljYWxseSB3ZSBzaG91bGQgZ28gdG9cbiAgICAgICAgLy8gdGhlIGVuZCBvZiB0aGUgbGluZSwgZXRjLlxuICAgICAgICBzd2l0Y2ggKHZpbS5sYXN0TW90aW9uKSB7XG4gICAgICAgICAgY2FzZSB0aGlzLm1vdmVCeUxpbmVzOlxuICAgICAgICAgIGNhc2UgdGhpcy5tb3ZlQnlEaXNwbGF5TGluZXM6XG4gICAgICAgICAgY2FzZSB0aGlzLm1vdmVCeVNjcm9sbDpcbiAgICAgICAgICBjYXNlIHRoaXMubW92ZVRvQ29sdW1uOlxuICAgICAgICAgIGNhc2UgdGhpcy5tb3ZlVG9Fb2w6XG4gICAgICAgICAgICBlbmRDaCA9IHZpbS5sYXN0SFBvcztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB2aW0ubGFzdEhQb3MgPSBlbmRDaDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVwZWF0ID0gbW90aW9uQXJncy5yZXBlYXQrKG1vdGlvbkFyZ3MucmVwZWF0T2Zmc2V0fHwwKTtcbiAgICAgICAgdmFyIGxpbmUgPSBtb3Rpb25BcmdzLmZvcndhcmQgPyBjdXIubGluZSArIHJlcGVhdCA6IGN1ci5saW5lIC0gcmVwZWF0O1xuICAgICAgICB2YXIgZmlyc3QgPSBjbS5maXJzdExpbmUoKTtcbiAgICAgICAgdmFyIGxhc3QgPSBjbS5sYXN0TGluZSgpO1xuICAgICAgICAvLyBWaW0gZ28gdG8gbGluZSBiZWdpbiBvciBsaW5lIGVuZCB3aGVuIGN1cnNvciBhdCBmaXJzdC9sYXN0IGxpbmUgYW5kXG4gICAgICAgIC8vIG1vdmUgdG8gcHJldmlvdXMvbmV4dCBsaW5lIGlzIHRyaWdnZXJlZC5cbiAgICAgICAgaWYgKGxpbmUgPCBmaXJzdCAmJiBjdXIubGluZSA9PSBmaXJzdCl7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubW92ZVRvU3RhcnRPZkxpbmUoY20sIGhlYWQsIG1vdGlvbkFyZ3MsIHZpbSk7XG4gICAgICAgIH1lbHNlIGlmIChsaW5lID4gbGFzdCAmJiBjdXIubGluZSA9PSBsYXN0KXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1vdmVUb0VvbChjbSwgaGVhZCwgbW90aW9uQXJncywgdmltLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobW90aW9uQXJncy50b0ZpcnN0Q2hhcil7XG4gICAgICAgICAgZW5kQ2g9ZmluZEZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcihjbS5nZXRMaW5lKGxpbmUpKTtcbiAgICAgICAgICB2aW0ubGFzdEhQb3MgPSBlbmRDaDtcbiAgICAgICAgfVxuICAgICAgICB2aW0ubGFzdEhTUG9zID0gY20uY2hhckNvb3JkcyhQb3MobGluZSwgZW5kQ2gpLCdkaXYnKS5sZWZ0O1xuICAgICAgICByZXR1cm4gUG9zKGxpbmUsIGVuZENoKTtcbiAgICAgIH0sXG4gICAgICBtb3ZlQnlEaXNwbGF5TGluZXM6IGZ1bmN0aW9uKGNtLCBoZWFkLCBtb3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgdmFyIGN1ciA9IGhlYWQ7XG4gICAgICAgIHN3aXRjaCAodmltLmxhc3RNb3Rpb24pIHtcbiAgICAgICAgICBjYXNlIHRoaXMubW92ZUJ5RGlzcGxheUxpbmVzOlxuICAgICAgICAgIGNhc2UgdGhpcy5tb3ZlQnlTY3JvbGw6XG4gICAgICAgICAgY2FzZSB0aGlzLm1vdmVCeUxpbmVzOlxuICAgICAgICAgIGNhc2UgdGhpcy5tb3ZlVG9Db2x1bW46XG4gICAgICAgICAgY2FzZSB0aGlzLm1vdmVUb0VvbDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB2aW0ubGFzdEhTUG9zID0gY20uY2hhckNvb3JkcyhjdXIsJ2RpdicpLmxlZnQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlcGVhdCA9IG1vdGlvbkFyZ3MucmVwZWF0O1xuICAgICAgICB2YXIgcmVzPWNtLmZpbmRQb3NWKGN1ciwobW90aW9uQXJncy5mb3J3YXJkID8gcmVwZWF0IDogLXJlcGVhdCksJ2xpbmUnLHZpbS5sYXN0SFNQb3MpO1xuICAgICAgICBpZiAocmVzLmhpdFNpZGUpIHtcbiAgICAgICAgICBpZiAobW90aW9uQXJncy5mb3J3YXJkKSB7XG4gICAgICAgICAgICB2YXIgbGFzdENoYXJDb29yZHMgPSBjbS5jaGFyQ29vcmRzKHJlcywgJ2RpdicpO1xuICAgICAgICAgICAgdmFyIGdvYWxDb29yZHMgPSB7IHRvcDogbGFzdENoYXJDb29yZHMudG9wICsgOCwgbGVmdDogdmltLmxhc3RIU1BvcyB9O1xuICAgICAgICAgICAgdmFyIHJlcyA9IGNtLmNvb3Jkc0NoYXIoZ29hbENvb3JkcywgJ2RpdicpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgcmVzQ29vcmRzID0gY20uY2hhckNvb3JkcyhQb3MoY20uZmlyc3RMaW5lKCksIDApLCAnZGl2Jyk7XG4gICAgICAgICAgICByZXNDb29yZHMubGVmdCA9IHZpbS5sYXN0SFNQb3M7XG4gICAgICAgICAgICByZXMgPSBjbS5jb29yZHNDaGFyKHJlc0Nvb3JkcywgJ2RpdicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2aW0ubGFzdEhQb3MgPSByZXMuY2g7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9LFxuICAgICAgbW92ZUJ5UGFnZTogZnVuY3Rpb24oY20sIGhlYWQsIG1vdGlvbkFyZ3MpIHtcbiAgICAgICAgLy8gQ29kZU1pcnJvciBvbmx5IGV4cG9zZXMgZnVuY3Rpb25zIHRoYXQgbW92ZSB0aGUgY3Vyc29yIHBhZ2UgZG93biwgc29cbiAgICAgICAgLy8gZG9pbmcgdGhpcyBiYWQgaGFjayB0byBtb3ZlIHRoZSBjdXJzb3IgYW5kIG1vdmUgaXQgYmFjay4gZXZhbElucHV0XG4gICAgICAgIC8vIHdpbGwgbW92ZSB0aGUgY3Vyc29yIHRvIHdoZXJlIGl0IHNob3VsZCBiZSBpbiB0aGUgZW5kLlxuICAgICAgICB2YXIgY3VyU3RhcnQgPSBoZWFkO1xuICAgICAgICB2YXIgcmVwZWF0ID0gbW90aW9uQXJncy5yZXBlYXQ7XG4gICAgICAgIHJldHVybiBjbS5maW5kUG9zVihjdXJTdGFydCwgKG1vdGlvbkFyZ3MuZm9yd2FyZCA/IHJlcGVhdCA6IC1yZXBlYXQpLCAncGFnZScpO1xuICAgICAgfSxcbiAgICAgIG1vdmVCeVBhcmFncmFwaDogZnVuY3Rpb24oY20sIGhlYWQsIG1vdGlvbkFyZ3MpIHtcbiAgICAgICAgdmFyIGRpciA9IG1vdGlvbkFyZ3MuZm9yd2FyZCA/IDEgOiAtMTtcbiAgICAgICAgcmV0dXJuIGZpbmRQYXJhZ3JhcGgoY20sIGhlYWQsIG1vdGlvbkFyZ3MucmVwZWF0LCBkaXIpO1xuICAgICAgfSxcbiAgICAgIG1vdmVCeVNlbnRlbmNlOiBmdW5jdGlvbihjbSwgaGVhZCwgbW90aW9uQXJncykge1xuICAgICAgICB2YXIgZGlyID0gbW90aW9uQXJncy5mb3J3YXJkID8gMSA6IC0xO1xuICAgICAgICByZXR1cm4gZmluZFNlbnRlbmNlKGNtLCBoZWFkLCBtb3Rpb25BcmdzLnJlcGVhdCwgZGlyKTtcbiAgICAgIH0sXG4gICAgICBtb3ZlQnlTY3JvbGw6IGZ1bmN0aW9uKGNtLCBoZWFkLCBtb3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgdmFyIHNjcm9sbGJveCA9IGNtLmdldFNjcm9sbEluZm8oKTtcbiAgICAgICAgdmFyIGN1ckVuZCA9IG51bGw7XG4gICAgICAgIHZhciByZXBlYXQgPSBtb3Rpb25BcmdzLnJlcGVhdDtcbiAgICAgICAgaWYgKCFyZXBlYXQpIHtcbiAgICAgICAgICByZXBlYXQgPSBzY3JvbGxib3guY2xpZW50SGVpZ2h0IC8gKDIgKiBjbS5kZWZhdWx0VGV4dEhlaWdodCgpKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb3JpZyA9IGNtLmNoYXJDb29yZHMoaGVhZCwgJ2xvY2FsJyk7XG4gICAgICAgIG1vdGlvbkFyZ3MucmVwZWF0ID0gcmVwZWF0O1xuICAgICAgICB2YXIgY3VyRW5kID0gbW90aW9ucy5tb3ZlQnlEaXNwbGF5TGluZXMoY20sIGhlYWQsIG1vdGlvbkFyZ3MsIHZpbSk7XG4gICAgICAgIGlmICghY3VyRW5kKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlc3QgPSBjbS5jaGFyQ29vcmRzKGN1ckVuZCwgJ2xvY2FsJyk7XG4gICAgICAgIGNtLnNjcm9sbFRvKG51bGwsIHNjcm9sbGJveC50b3AgKyBkZXN0LnRvcCAtIG9yaWcudG9wKTtcbiAgICAgICAgcmV0dXJuIGN1ckVuZDtcbiAgICAgIH0sXG4gICAgICBtb3ZlQnlXb3JkczogZnVuY3Rpb24oY20sIGhlYWQsIG1vdGlvbkFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIG1vdmVUb1dvcmQoY20sIGhlYWQsIG1vdGlvbkFyZ3MucmVwZWF0LCAhIW1vdGlvbkFyZ3MuZm9yd2FyZCxcbiAgICAgICAgICAgICEhbW90aW9uQXJncy53b3JkRW5kLCAhIW1vdGlvbkFyZ3MuYmlnV29yZCk7XG4gICAgICB9LFxuICAgICAgbW92ZVRpbGxDaGFyYWN0ZXI6IGZ1bmN0aW9uKGNtLCBfaGVhZCwgbW90aW9uQXJncykge1xuICAgICAgICB2YXIgcmVwZWF0ID0gbW90aW9uQXJncy5yZXBlYXQ7XG4gICAgICAgIHZhciBjdXJFbmQgPSBtb3ZlVG9DaGFyYWN0ZXIoY20sIHJlcGVhdCwgbW90aW9uQXJncy5mb3J3YXJkLFxuICAgICAgICAgICAgbW90aW9uQXJncy5zZWxlY3RlZENoYXJhY3Rlcik7XG4gICAgICAgIHZhciBpbmNyZW1lbnQgPSBtb3Rpb25BcmdzLmZvcndhcmQgPyAtMSA6IDE7XG4gICAgICAgIHJlY29yZExhc3RDaGFyYWN0ZXJTZWFyY2goaW5jcmVtZW50LCBtb3Rpb25BcmdzKTtcbiAgICAgICAgaWYgKCFjdXJFbmQpIHJldHVybiBudWxsO1xuICAgICAgICBjdXJFbmQuY2ggKz0gaW5jcmVtZW50O1xuICAgICAgICByZXR1cm4gY3VyRW5kO1xuICAgICAgfSxcbiAgICAgIG1vdmVUb0NoYXJhY3RlcjogZnVuY3Rpb24oY20sIGhlYWQsIG1vdGlvbkFyZ3MpIHtcbiAgICAgICAgdmFyIHJlcGVhdCA9IG1vdGlvbkFyZ3MucmVwZWF0O1xuICAgICAgICByZWNvcmRMYXN0Q2hhcmFjdGVyU2VhcmNoKDAsIG1vdGlvbkFyZ3MpO1xuICAgICAgICByZXR1cm4gbW92ZVRvQ2hhcmFjdGVyKGNtLCByZXBlYXQsIG1vdGlvbkFyZ3MuZm9yd2FyZCxcbiAgICAgICAgICAgIG1vdGlvbkFyZ3Muc2VsZWN0ZWRDaGFyYWN0ZXIpIHx8IGhlYWQ7XG4gICAgICB9LFxuICAgICAgbW92ZVRvU3ltYm9sOiBmdW5jdGlvbihjbSwgaGVhZCwgbW90aW9uQXJncykge1xuICAgICAgICB2YXIgcmVwZWF0ID0gbW90aW9uQXJncy5yZXBlYXQ7XG4gICAgICAgIHJldHVybiBmaW5kU3ltYm9sKGNtLCByZXBlYXQsIG1vdGlvbkFyZ3MuZm9yd2FyZCxcbiAgICAgICAgICAgIG1vdGlvbkFyZ3Muc2VsZWN0ZWRDaGFyYWN0ZXIpIHx8IGhlYWQ7XG4gICAgICB9LFxuICAgICAgbW92ZVRvQ29sdW1uOiBmdW5jdGlvbihjbSwgaGVhZCwgbW90aW9uQXJncywgdmltKSB7XG4gICAgICAgIHZhciByZXBlYXQgPSBtb3Rpb25BcmdzLnJlcGVhdDtcbiAgICAgICAgLy8gcmVwZWF0IGlzIGVxdWl2YWxlbnQgdG8gd2hpY2ggY29sdW1uIHdlIHdhbnQgdG8gbW92ZSB0byFcbiAgICAgICAgdmltLmxhc3RIUG9zID0gcmVwZWF0IC0gMTtcbiAgICAgICAgdmltLmxhc3RIU1BvcyA9IGNtLmNoYXJDb29yZHMoaGVhZCwnZGl2JykubGVmdDtcbiAgICAgICAgcmV0dXJuIG1vdmVUb0NvbHVtbihjbSwgcmVwZWF0KTtcbiAgICAgIH0sXG4gICAgICBtb3ZlVG9Fb2w6IGZ1bmN0aW9uKGNtLCBoZWFkLCBtb3Rpb25BcmdzLCB2aW0sIGtlZXBIUG9zKSB7XG4gICAgICAgIHZhciBjdXIgPSBoZWFkO1xuICAgICAgICB2YXIgcmV0dmFsPSBQb3MoY3VyLmxpbmUgKyBtb3Rpb25BcmdzLnJlcGVhdCAtIDEsIEluZmluaXR5KTtcbiAgICAgICAgdmFyIGVuZD1jbS5jbGlwUG9zKHJldHZhbCk7XG4gICAgICAgIGVuZC5jaC0tO1xuICAgICAgICBpZiAoIWtlZXBIUG9zKSB7XG4gICAgICAgICAgdmltLmxhc3RIUG9zID0gSW5maW5pdHk7XG4gICAgICAgICAgdmltLmxhc3RIU1BvcyA9IGNtLmNoYXJDb29yZHMoZW5kLCdkaXYnKS5sZWZ0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXR2YWw7XG4gICAgICB9LFxuICAgICAgbW92ZVRvRmlyc3ROb25XaGl0ZVNwYWNlQ2hhcmFjdGVyOiBmdW5jdGlvbihjbSwgaGVhZCkge1xuICAgICAgICAvLyBHbyB0byB0aGUgc3RhcnQgb2YgdGhlIGxpbmUgd2hlcmUgdGhlIHRleHQgYmVnaW5zLCBvciB0aGUgZW5kIGZvclxuICAgICAgICAvLyB3aGl0ZXNwYWNlLW9ubHkgbGluZXNcbiAgICAgICAgdmFyIGN1cnNvciA9IGhlYWQ7XG4gICAgICAgIHJldHVybiBQb3MoY3Vyc29yLmxpbmUsXG4gICAgICAgICAgICAgICAgICAgZmluZEZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcihjbS5nZXRMaW5lKGN1cnNvci5saW5lKSkpO1xuICAgICAgfSxcbiAgICAgIG1vdmVUb01hdGNoZWRTeW1ib2w6IGZ1bmN0aW9uKGNtLCBoZWFkKSB7XG4gICAgICAgIHZhciBjdXJzb3IgPSBoZWFkO1xuICAgICAgICB2YXIgbGluZSA9IGN1cnNvci5saW5lO1xuICAgICAgICB2YXIgY2ggPSBjdXJzb3IuY2g7XG4gICAgICAgIHZhciBsaW5lVGV4dCA9IGNtLmdldExpbmUobGluZSk7XG4gICAgICAgIHZhciBzeW1ib2w7XG4gICAgICAgIGZvciAoOyBjaCA8IGxpbmVUZXh0Lmxlbmd0aDsgY2grKykge1xuICAgICAgICAgIHN5bWJvbCA9IGxpbmVUZXh0LmNoYXJBdChjaCk7XG4gICAgICAgICAgaWYgKHN5bWJvbCAmJiBpc01hdGNoYWJsZVN5bWJvbChzeW1ib2wpKSB7XG4gICAgICAgICAgICB2YXIgc3R5bGUgPSBjbS5nZXRUb2tlblR5cGVBdChQb3MobGluZSwgY2ggKyAxKSk7XG4gICAgICAgICAgICBpZiAoc3R5bGUgIT09IFwic3RyaW5nXCIgJiYgc3R5bGUgIT09IFwiY29tbWVudFwiKSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY2ggPCBsaW5lVGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAvLyBPbmx5IGluY2x1ZGUgYW5nbGUgYnJhY2tldHMgaW4gYW5hbHlzaXMgaWYgdGhleSBhcmUgYmVpbmcgbWF0Y2hlZC5cbiAgICAgICAgICB2YXIgcmUgPSAoY2ggPT09ICc8JyB8fCBjaCA9PT0gJz4nKSA/IC9bKCl7fVtcXF08Pl0vIDogL1soKXt9W1xcXV0vO1xuICAgICAgICAgIHZhciBtYXRjaGVkID0gY20uZmluZE1hdGNoaW5nQnJhY2tldChQb3MobGluZSwgY2gpLCB7YnJhY2tldFJlZ2V4OiByZX0pO1xuICAgICAgICAgIHJldHVybiBtYXRjaGVkLnRvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBjdXJzb3I7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBtb3ZlVG9TdGFydE9mTGluZTogZnVuY3Rpb24oX2NtLCBoZWFkKSB7XG4gICAgICAgIHJldHVybiBQb3MoaGVhZC5saW5lLCAwKTtcbiAgICAgIH0sXG4gICAgICBtb3ZlVG9MaW5lT3JFZGdlT2ZEb2N1bWVudDogZnVuY3Rpb24oY20sIF9oZWFkLCBtb3Rpb25BcmdzKSB7XG4gICAgICAgIHZhciBsaW5lTnVtID0gbW90aW9uQXJncy5mb3J3YXJkID8gY20ubGFzdExpbmUoKSA6IGNtLmZpcnN0TGluZSgpO1xuICAgICAgICBpZiAobW90aW9uQXJncy5yZXBlYXRJc0V4cGxpY2l0KSB7XG4gICAgICAgICAgbGluZU51bSA9IG1vdGlvbkFyZ3MucmVwZWF0IC0gY20uZ2V0T3B0aW9uKCdmaXJzdExpbmVOdW1iZXInKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUG9zKGxpbmVOdW0sXG4gICAgICAgICAgICAgICAgICAgZmluZEZpcnN0Tm9uV2hpdGVTcGFjZUNoYXJhY3RlcihjbS5nZXRMaW5lKGxpbmVOdW0pKSk7XG4gICAgICB9LFxuICAgICAgdGV4dE9iamVjdE1hbmlwdWxhdGlvbjogZnVuY3Rpb24oY20sIGhlYWQsIG1vdGlvbkFyZ3MsIHZpbSkge1xuICAgICAgICAvLyBUT0RPOiBsb3RzIG9mIHBvc3NpYmxlIGV4Y2VwdGlvbnMgdGhhdCBjYW4gYmUgdGhyb3duIGhlcmUuIFRyeSBkYShcbiAgICAgICAgLy8gICAgIG91dHNpZGUgb2YgYSAoKSBibG9jay5cbiAgICAgICAgdmFyIG1pcnJvcmVkUGFpcnMgPSB7JygnOiAnKScsICcpJzogJygnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAneyc6ICd9JywgJ30nOiAneycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICdbJzogJ10nLCAnXSc6ICdbJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwnOiAnPicsICc+JzogJzwnfTtcbiAgICAgICAgdmFyIHNlbGZQYWlyZWQgPSB7J1xcJyc6IHRydWUsICdcIic6IHRydWUsICdgJzogdHJ1ZX07XG5cbiAgICAgICAgdmFyIGNoYXJhY3RlciA9IG1vdGlvbkFyZ3Muc2VsZWN0ZWRDaGFyYWN0ZXI7XG4gICAgICAgIC8vICdiJyByZWZlcnMgdG8gICcoKScgYmxvY2suXG4gICAgICAgIC8vICdCJyByZWZlcnMgdG8gICd7fScgYmxvY2suXG4gICAgICAgIGlmIChjaGFyYWN0ZXIgPT0gJ2InKSB7XG4gICAgICAgICAgY2hhcmFjdGVyID0gJygnO1xuICAgICAgICB9IGVsc2UgaWYgKGNoYXJhY3RlciA9PSAnQicpIHtcbiAgICAgICAgICBjaGFyYWN0ZXIgPSAneyc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbmNsdXNpdmUgaXMgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBhIGFuZCBpXG4gICAgICAgIC8vIFRPRE86IEluc3RlYWQgb2YgdXNpbmcgdGhlIGFkZGl0aW9uYWwgdGV4dCBvYmplY3QgbWFwIHRvIHBlcmZvcm0gdGV4dFxuICAgICAgICAvLyAgICAgb2JqZWN0IG9wZXJhdGlvbnMsIG1lcmdlIHRoZSBtYXAgaW50byB0aGUgZGVmYXVsdEtleU1hcCBhbmQgdXNlXG4gICAgICAgIC8vICAgICBtb3Rpb25BcmdzIHRvIGRlZmluZSBiZWhhdmlvci4gRGVmaW5lIHNlcGFyYXRlIGVudHJpZXMgZm9yICdhdycsXG4gICAgICAgIC8vICAgICAnaXcnLCAnYVsnLCAnaVsnLCBldGMuXG4gICAgICAgIHZhciBpbmNsdXNpdmUgPSAhbW90aW9uQXJncy50ZXh0T2JqZWN0SW5uZXI7XG5cbiAgICAgICAgdmFyIHRtcDtcbiAgICAgICAgaWYgKG1pcnJvcmVkUGFpcnNbY2hhcmFjdGVyXSkge1xuICAgICAgICAgIHRtcCA9IHNlbGVjdENvbXBhbmlvbk9iamVjdChjbSwgaGVhZCwgY2hhcmFjdGVyLCBpbmNsdXNpdmUpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlbGZQYWlyZWRbY2hhcmFjdGVyXSkge1xuICAgICAgICAgIHRtcCA9IGZpbmRCZWdpbm5pbmdBbmRFbmQoY20sIGhlYWQsIGNoYXJhY3RlciwgaW5jbHVzaXZlKTtcbiAgICAgICAgfSBlbHNlIGlmIChjaGFyYWN0ZXIgPT09ICdXJykge1xuICAgICAgICAgIHRtcCA9IGV4cGFuZFdvcmRVbmRlckN1cnNvcihjbSwgaW5jbHVzaXZlLCB0cnVlIC8qKiBmb3J3YXJkICovLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlIC8qKiBiaWdXb3JkICovKTtcbiAgICAgICAgfSBlbHNlIGlmIChjaGFyYWN0ZXIgPT09ICd3Jykge1xuICAgICAgICAgIHRtcCA9IGV4cGFuZFdvcmRVbmRlckN1cnNvcihjbSwgaW5jbHVzaXZlLCB0cnVlIC8qKiBmb3J3YXJkICovLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSAvKiogYmlnV29yZCAqLyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hhcmFjdGVyID09PSAncCcpIHtcbiAgICAgICAgICB0bXAgPSBmaW5kUGFyYWdyYXBoKGNtLCBoZWFkLCBtb3Rpb25BcmdzLnJlcGVhdCwgMCwgaW5jbHVzaXZlKTtcbiAgICAgICAgICBtb3Rpb25BcmdzLmxpbmV3aXNlID0gdHJ1ZTtcbiAgICAgICAgICBpZiAodmltLnZpc3VhbE1vZGUpIHtcbiAgICAgICAgICAgIGlmICghdmltLnZpc3VhbExpbmUpIHsgdmltLnZpc3VhbExpbmUgPSB0cnVlOyB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBvcGVyYXRvckFyZ3MgPSB2aW0uaW5wdXRTdGF0ZS5vcGVyYXRvckFyZ3M7XG4gICAgICAgICAgICBpZiAob3BlcmF0b3JBcmdzKSB7IG9wZXJhdG9yQXJncy5saW5ld2lzZSA9IHRydWU7IH1cbiAgICAgICAgICAgIHRtcC5lbmQubGluZS0tO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBObyB0ZXh0IG9iamVjdCBkZWZpbmVkIGZvciB0aGlzLCBkb24ndCBtb3ZlLlxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjbS5zdGF0ZS52aW0udmlzdWFsTW9kZSkge1xuICAgICAgICAgIHJldHVybiBbdG1wLnN0YXJ0LCB0bXAuZW5kXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZXhwYW5kU2VsZWN0aW9uKGNtLCB0bXAuc3RhcnQsIHRtcC5lbmQpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICByZXBlYXRMYXN0Q2hhcmFjdGVyU2VhcmNoOiBmdW5jdGlvbihjbSwgaGVhZCwgbW90aW9uQXJncykge1xuICAgICAgICB2YXIgbGFzdFNlYXJjaCA9IHZpbUdsb2JhbFN0YXRlLmxhc3RDaGFyYWN0ZXJTZWFyY2g7XG4gICAgICAgIHZhciByZXBlYXQgPSBtb3Rpb25BcmdzLnJlcGVhdDtcbiAgICAgICAgdmFyIGZvcndhcmQgPSBtb3Rpb25BcmdzLmZvcndhcmQgPT09IGxhc3RTZWFyY2guZm9yd2FyZDtcbiAgICAgICAgdmFyIGluY3JlbWVudCA9IChsYXN0U2VhcmNoLmluY3JlbWVudCA/IDEgOiAwKSAqIChmb3J3YXJkID8gLTEgOiAxKTtcbiAgICAgICAgY20ubW92ZUgoLWluY3JlbWVudCwgJ2NoYXInKTtcbiAgICAgICAgbW90aW9uQXJncy5pbmNsdXNpdmUgPSBmb3J3YXJkID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB2YXIgY3VyRW5kID0gbW92ZVRvQ2hhcmFjdGVyKGNtLCByZXBlYXQsIGZvcndhcmQsIGxhc3RTZWFyY2guc2VsZWN0ZWRDaGFyYWN0ZXIpO1xuICAgICAgICBpZiAoIWN1ckVuZCkge1xuICAgICAgICAgIGNtLm1vdmVIKGluY3JlbWVudCwgJ2NoYXInKTtcbiAgICAgICAgICByZXR1cm4gaGVhZDtcbiAgICAgICAgfVxuICAgICAgICBjdXJFbmQuY2ggKz0gaW5jcmVtZW50O1xuICAgICAgICByZXR1cm4gY3VyRW5kO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBkZWZpbmVNb3Rpb24obmFtZSwgZm4pIHtcbiAgICAgIG1vdGlvbnNbbmFtZV0gPSBmbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWxsQXJyYXkodmFsLCB0aW1lcykge1xuICAgICAgdmFyIGFyciA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aW1lczsgaSsrKSB7XG4gICAgICAgIGFyci5wdXNoKHZhbCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYXJyO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBbiBvcGVyYXRvciBhY3RzIG9uIGEgdGV4dCBzZWxlY3Rpb24uIEl0IHJlY2VpdmVzIHRoZSBsaXN0IG9mIHNlbGVjdGlvbnNcbiAgICAgKiBhcyBpbnB1dC4gVGhlIGNvcnJlc3BvbmRpbmcgQ29kZU1pcnJvciBzZWxlY3Rpb24gaXMgZ3VhcmFudGVlZCB0b1xuICAgICogbWF0Y2ggdGhlIGlucHV0IHNlbGVjdGlvbi5cbiAgICAgKi9cbiAgICB2YXIgb3BlcmF0b3JzID0ge1xuICAgICAgY2hhbmdlOiBmdW5jdGlvbihjbSwgYXJncywgcmFuZ2VzKSB7XG4gICAgICAgIHZhciBmaW5hbEhlYWQsIHRleHQ7XG4gICAgICAgIHZhciB2aW0gPSBjbS5zdGF0ZS52aW07XG4gICAgICAgIGlmICghdmltLnZpc3VhbE1vZGUpIHtcbiAgICAgICAgICB2YXIgYW5jaG9yID0gcmFuZ2VzWzBdLmFuY2hvcixcbiAgICAgICAgICAgICAgaGVhZCA9IHJhbmdlc1swXS5oZWFkO1xuICAgICAgICAgIHRleHQgPSBjbS5nZXRSYW5nZShhbmNob3IsIGhlYWQpO1xuICAgICAgICAgIHZhciBsYXN0U3RhdGUgPSB2aW0ubGFzdEVkaXRJbnB1dFN0YXRlIHx8IHt9O1xuICAgICAgICAgIGlmIChsYXN0U3RhdGUubW90aW9uID09IFwibW92ZUJ5V29yZHNcIiAmJiAhaXNXaGl0ZVNwYWNlU3RyaW5nKHRleHQpKSB7XG4gICAgICAgICAgICAvLyBFeGNsdWRlIHRyYWlsaW5nIHdoaXRlc3BhY2UgaWYgdGhlIHJhbmdlIGlzIG5vdCBhbGwgd2hpdGVzcGFjZS5cbiAgICAgICAgICAgIHZhciBtYXRjaCA9ICgvXFxzKyQvKS5leGVjKHRleHQpO1xuICAgICAgICAgICAgaWYgKG1hdGNoICYmIGxhc3RTdGF0ZS5tb3Rpb25BcmdzICYmIGxhc3RTdGF0ZS5tb3Rpb25BcmdzLmZvcndhcmQpIHtcbiAgICAgICAgICAgICAgaGVhZCA9IG9mZnNldEN1cnNvcihoZWFkLCAwLCAtIG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICAgIHRleHQgPSB0ZXh0LnNsaWNlKDAsIC0gbWF0Y2hbMF0ubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHByZXZMaW5lRW5kID0gbmV3IFBvcyhhbmNob3IubGluZSAtIDEsIE51bWJlci5NQVhfVkFMVUUpO1xuICAgICAgICAgIHZhciB3YXNMYXN0TGluZSA9IGNtLmZpcnN0TGluZSgpID09IGNtLmxhc3RMaW5lKCk7XG4gICAgICAgICAgaWYgKGhlYWQubGluZSA+IGNtLmxhc3RMaW5lKCkgJiYgYXJncy5saW5ld2lzZSAmJiAhd2FzTGFzdExpbmUpIHtcbiAgICAgICAgICAgIGNtLnJlcGxhY2VSYW5nZSgnJywgcHJldkxpbmVFbmQsIGhlYWQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbS5yZXBsYWNlUmFuZ2UoJycsIGFuY2hvciwgaGVhZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChhcmdzLmxpbmV3aXNlKSB7XG4gICAgICAgICAgICAvLyBQdXNoIHRoZSBuZXh0IGxpbmUgYmFjayBkb3duLCBpZiB0aGVyZSBpcyBhIG5leHQgbGluZS5cbiAgICAgICAgICAgIGlmICghd2FzTGFzdExpbmUpIHtcbiAgICAgICAgICAgICAgY20uc2V0Q3Vyc29yKHByZXZMaW5lRW5kKTtcbiAgICAgICAgICAgICAgQ29kZU1pcnJvci5jb21tYW5kcy5uZXdsaW5lQW5kSW5kZW50KGNtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSBjdXJzb3IgZW5kcyB1cCBhdCB0aGUgZW5kIG9mIHRoZSBsaW5lLlxuICAgICAgICAgICAgYW5jaG9yLmNoID0gTnVtYmVyLk1BWF9WQUxVRTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZmluYWxIZWFkID0gYW5jaG9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRleHQgPSBjbS5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICB2YXIgcmVwbGFjZW1lbnQgPSBmaWxsQXJyYXkoJycsIHJhbmdlcy5sZW5ndGgpO1xuICAgICAgICAgIGNtLnJlcGxhY2VTZWxlY3Rpb25zKHJlcGxhY2VtZW50KTtcbiAgICAgICAgICBmaW5hbEhlYWQgPSBjdXJzb3JNaW4ocmFuZ2VzWzBdLmhlYWQsIHJhbmdlc1swXS5hbmNob3IpO1xuICAgICAgICB9XG4gICAgICAgIHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci5wdXNoVGV4dChcbiAgICAgICAgICAgIGFyZ3MucmVnaXN0ZXJOYW1lLCAnY2hhbmdlJywgdGV4dCxcbiAgICAgICAgICAgIGFyZ3MubGluZXdpc2UsIHJhbmdlcy5sZW5ndGggPiAxKTtcbiAgICAgICAgYWN0aW9ucy5lbnRlckluc2VydE1vZGUoY20sIHtoZWFkOiBmaW5hbEhlYWR9LCBjbS5zdGF0ZS52aW0pO1xuICAgICAgfSxcbiAgICAgIC8vIGRlbGV0ZSBpcyBhIGphdmFzY3JpcHQga2V5d29yZC5cbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbihjbSwgYXJncywgcmFuZ2VzKSB7XG4gICAgICAgIHZhciBmaW5hbEhlYWQsIHRleHQ7XG4gICAgICAgIHZhciB2aW0gPSBjbS5zdGF0ZS52aW07XG4gICAgICAgIGlmICghdmltLnZpc3VhbEJsb2NrKSB7XG4gICAgICAgICAgdmFyIGFuY2hvciA9IHJhbmdlc1swXS5hbmNob3IsXG4gICAgICAgICAgICAgIGhlYWQgPSByYW5nZXNbMF0uaGVhZDtcbiAgICAgICAgICBpZiAoYXJncy5saW5ld2lzZSAmJlxuICAgICAgICAgICAgICBoZWFkLmxpbmUgIT0gY20uZmlyc3RMaW5lKCkgJiZcbiAgICAgICAgICAgICAgYW5jaG9yLmxpbmUgPT0gY20ubGFzdExpbmUoKSAmJlxuICAgICAgICAgICAgICBhbmNob3IubGluZSA9PSBoZWFkLmxpbmUgLSAxKSB7XG4gICAgICAgICAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIGRkIG9uIGxhc3QgbGluZSAoYW5kIGZpcnN0IGxpbmUpLlxuICAgICAgICAgICAgaWYgKGFuY2hvci5saW5lID09IGNtLmZpcnN0TGluZSgpKSB7XG4gICAgICAgICAgICAgIGFuY2hvci5jaCA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhbmNob3IgPSBQb3MoYW5jaG9yLmxpbmUgLSAxLCBsaW5lTGVuZ3RoKGNtLCBhbmNob3IubGluZSAtIDEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdGV4dCA9IGNtLmdldFJhbmdlKGFuY2hvciwgaGVhZCk7XG4gICAgICAgICAgY20ucmVwbGFjZVJhbmdlKCcnLCBhbmNob3IsIGhlYWQpO1xuICAgICAgICAgIGZpbmFsSGVhZCA9IGFuY2hvcjtcbiAgICAgICAgICBpZiAoYXJncy5saW5ld2lzZSkge1xuICAgICAgICAgICAgZmluYWxIZWFkID0gbW90aW9ucy5tb3ZlVG9GaXJzdE5vbldoaXRlU3BhY2VDaGFyYWN0ZXIoY20sIGFuY2hvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRleHQgPSBjbS5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICB2YXIgcmVwbGFjZW1lbnQgPSBmaWxsQXJyYXkoJycsIHJhbmdlcy5sZW5ndGgpO1xuICAgICAgICAgIGNtLnJlcGxhY2VTZWxlY3Rpb25zKHJlcGxhY2VtZW50KTtcbiAgICAgICAgICBmaW5hbEhlYWQgPSByYW5nZXNbMF0uYW5jaG9yO1xuICAgICAgICB9XG4gICAgICAgIHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci5wdXNoVGV4dChcbiAgICAgICAgICAgIGFyZ3MucmVnaXN0ZXJOYW1lLCAnZGVsZXRlJywgdGV4dCxcbiAgICAgICAgICAgIGFyZ3MubGluZXdpc2UsIHZpbS52aXN1YWxCbG9jayk7XG4gICAgICAgIHZhciBpbmNsdWRlTGluZUJyZWFrID0gdmltLmluc2VydE1vZGVcbiAgICAgICAgcmV0dXJuIGNsaXBDdXJzb3JUb0NvbnRlbnQoY20sIGZpbmFsSGVhZCwgaW5jbHVkZUxpbmVCcmVhayk7XG4gICAgICB9LFxuICAgICAgaW5kZW50OiBmdW5jdGlvbihjbSwgYXJncywgcmFuZ2VzKSB7XG4gICAgICAgIHZhciB2aW0gPSBjbS5zdGF0ZS52aW07XG4gICAgICAgIHZhciBzdGFydExpbmUgPSByYW5nZXNbMF0uYW5jaG9yLmxpbmU7XG4gICAgICAgIHZhciBlbmRMaW5lID0gdmltLnZpc3VhbEJsb2NrID9cbiAgICAgICAgICByYW5nZXNbcmFuZ2VzLmxlbmd0aCAtIDFdLmFuY2hvci5saW5lIDpcbiAgICAgICAgICByYW5nZXNbMF0uaGVhZC5saW5lO1xuICAgICAgICAvLyBJbiB2aXN1YWwgbW9kZSwgbj4gc2hpZnRzIHRoZSBzZWxlY3Rpb24gcmlnaHQgbiB0aW1lcywgaW5zdGVhZCBvZlxuICAgICAgICAvLyBzaGlmdGluZyBuIGxpbmVzIHJpZ2h0IG9uY2UuXG4gICAgICAgIHZhciByZXBlYXQgPSAodmltLnZpc3VhbE1vZGUpID8gYXJncy5yZXBlYXQgOiAxO1xuICAgICAgICBpZiAoYXJncy5saW5ld2lzZSkge1xuICAgICAgICAgIC8vIFRoZSBvbmx5IHdheSB0byBkZWxldGUgYSBuZXdsaW5lIGlzIHRvIGRlbGV0ZSB1bnRpbCB0aGUgc3RhcnQgb2ZcbiAgICAgICAgICAvLyB0aGUgbmV4dCBsaW5lLCBzbyBpbiBsaW5ld2lzZSBtb2RlIGV2YWxJbnB1dCB3aWxsIGluY2x1ZGUgdGhlIG5leHRcbiAgICAgICAgICAvLyBsaW5lLiBXZSBkb24ndCB3YW50IHRoaXMgaW4gaW5kZW50LCBzbyB3ZSBnbyBiYWNrIGEgbGluZS5cbiAgICAgICAgICBlbmRMaW5lLS07XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IHN0YXJ0TGluZTsgaSA8PSBlbmRMaW5lOyBpKyspIHtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJlcGVhdDsgaisrKSB7XG4gICAgICAgICAgICBjbS5pbmRlbnRMaW5lKGksIGFyZ3MuaW5kZW50UmlnaHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbW90aW9ucy5tb3ZlVG9GaXJzdE5vbldoaXRlU3BhY2VDaGFyYWN0ZXIoY20sIHJhbmdlc1swXS5hbmNob3IpO1xuICAgICAgfSxcbiAgICAgIGluZGVudEF1dG86IGZ1bmN0aW9uKGNtLCBfYXJncywgcmFuZ2VzKSB7XG4gICAgICAgIGNtLmV4ZWNDb21tYW5kKFwiaW5kZW50QXV0b1wiKTtcbiAgICAgICAgcmV0dXJuIG1vdGlvbnMubW92ZVRvRmlyc3ROb25XaGl0ZVNwYWNlQ2hhcmFjdGVyKGNtLCByYW5nZXNbMF0uYW5jaG9yKTtcbiAgICAgIH0sXG4gICAgICBjaGFuZ2VDYXNlOiBmdW5jdGlvbihjbSwgYXJncywgcmFuZ2VzLCBvbGRBbmNob3IsIG5ld0hlYWQpIHtcbiAgICAgICAgdmFyIHNlbGVjdGlvbnMgPSBjbS5nZXRTZWxlY3Rpb25zKCk7XG4gICAgICAgIHZhciBzd2FwcGVkID0gW107XG4gICAgICAgIHZhciB0b0xvd2VyID0gYXJncy50b0xvd2VyO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNlbGVjdGlvbnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICB2YXIgdG9Td2FwID0gc2VsZWN0aW9uc1tqXTtcbiAgICAgICAgICB2YXIgdGV4dCA9ICcnO1xuICAgICAgICAgIGlmICh0b0xvd2VyID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0ZXh0ID0gdG9Td2FwLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgfSBlbHNlIGlmICh0b0xvd2VyID09PSBmYWxzZSkge1xuICAgICAgICAgICAgdGV4dCA9IHRvU3dhcC50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvU3dhcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICB2YXIgY2hhcmFjdGVyID0gdG9Td2FwLmNoYXJBdChpKTtcbiAgICAgICAgICAgICAgdGV4dCArPSBpc1VwcGVyQ2FzZShjaGFyYWN0ZXIpID8gY2hhcmFjdGVyLnRvTG93ZXJDYXNlKCkgOlxuICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHN3YXBwZWQucHVzaCh0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBjbS5yZXBsYWNlU2VsZWN0aW9ucyhzd2FwcGVkKTtcbiAgICAgICAgaWYgKGFyZ3Muc2hvdWxkTW92ZUN1cnNvcil7XG4gICAgICAgICAgcmV0dXJuIG5ld0hlYWQ7XG4gICAgICAgIH0gZWxzZSBpZiAoIWNtLnN0YXRlLnZpbS52aXN1YWxNb2RlICYmIGFyZ3MubGluZXdpc2UgJiYgcmFuZ2VzWzBdLmFuY2hvci5saW5lICsgMSA9PSByYW5nZXNbMF0uaGVhZC5saW5lKSB7XG4gICAgICAgICAgcmV0dXJuIG1vdGlvbnMubW92ZVRvRmlyc3ROb25XaGl0ZVNwYWNlQ2hhcmFjdGVyKGNtLCBvbGRBbmNob3IpO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZ3MubGluZXdpc2Upe1xuICAgICAgICAgIHJldHVybiBvbGRBbmNob3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGN1cnNvck1pbihyYW5nZXNbMF0uYW5jaG9yLCByYW5nZXNbMF0uaGVhZCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB5YW5rOiBmdW5jdGlvbihjbSwgYXJncywgcmFuZ2VzLCBvbGRBbmNob3IpIHtcbiAgICAgICAgdmFyIHZpbSA9IGNtLnN0YXRlLnZpbTtcbiAgICAgICAgdmFyIHRleHQgPSBjbS5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgdmFyIGVuZFBvcyA9IHZpbS52aXN1YWxNb2RlXG4gICAgICAgICAgPyBjdXJzb3JNaW4odmltLnNlbC5hbmNob3IsIHZpbS5zZWwuaGVhZCwgcmFuZ2VzWzBdLmhlYWQsIHJhbmdlc1swXS5hbmNob3IpXG4gICAgICAgICAgOiBvbGRBbmNob3I7XG4gICAgICAgIHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci5wdXNoVGV4dChcbiAgICAgICAgICAgIGFyZ3MucmVnaXN0ZXJOYW1lLCAneWFuaycsXG4gICAgICAgICAgICB0ZXh0LCBhcmdzLmxpbmV3aXNlLCB2aW0udmlzdWFsQmxvY2spO1xuICAgICAgICByZXR1cm4gZW5kUG9zO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBkZWZpbmVPcGVyYXRvcihuYW1lLCBmbikge1xuICAgICAgb3BlcmF0b3JzW25hbWVdID0gZm47XG4gICAgfVxuXG4gICAgdmFyIGFjdGlvbnMgPSB7XG4gICAgICBqdW1wTGlzdFdhbGs6IGZ1bmN0aW9uKGNtLCBhY3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXBlYXQgPSBhY3Rpb25BcmdzLnJlcGVhdDtcbiAgICAgICAgdmFyIGZvcndhcmQgPSBhY3Rpb25BcmdzLmZvcndhcmQ7XG4gICAgICAgIHZhciBqdW1wTGlzdCA9IHZpbUdsb2JhbFN0YXRlLmp1bXBMaXN0O1xuXG4gICAgICAgIHZhciBtYXJrID0ganVtcExpc3QubW92ZShjbSwgZm9yd2FyZCA/IHJlcGVhdCA6IC1yZXBlYXQpO1xuICAgICAgICB2YXIgbWFya1BvcyA9IG1hcmsgPyBtYXJrLmZpbmQoKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgbWFya1BvcyA9IG1hcmtQb3MgPyBtYXJrUG9zIDogY20uZ2V0Q3Vyc29yKCk7XG4gICAgICAgIGNtLnNldEN1cnNvcihtYXJrUG9zKTtcbiAgICAgIH0sXG4gICAgICBzY3JvbGw6IGZ1bmN0aW9uKGNtLCBhY3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXBlYXQgPSBhY3Rpb25BcmdzLnJlcGVhdCB8fCAxO1xuICAgICAgICB2YXIgbGluZUhlaWdodCA9IGNtLmRlZmF1bHRUZXh0SGVpZ2h0KCk7XG4gICAgICAgIHZhciB0b3AgPSBjbS5nZXRTY3JvbGxJbmZvKCkudG9wO1xuICAgICAgICB2YXIgZGVsdGEgPSBsaW5lSGVpZ2h0ICogcmVwZWF0O1xuICAgICAgICB2YXIgbmV3UG9zID0gYWN0aW9uQXJncy5mb3J3YXJkID8gdG9wICsgZGVsdGEgOiB0b3AgLSBkZWx0YTtcbiAgICAgICAgdmFyIGN1cnNvciA9IGNvcHlDdXJzb3IoY20uZ2V0Q3Vyc29yKCkpO1xuICAgICAgICB2YXIgY3Vyc29yQ29vcmRzID0gY20uY2hhckNvb3JkcyhjdXJzb3IsICdsb2NhbCcpO1xuICAgICAgICBpZiAoYWN0aW9uQXJncy5mb3J3YXJkKSB7XG4gICAgICAgICAgaWYgKG5ld1BvcyA+IGN1cnNvckNvb3Jkcy50b3ApIHtcbiAgICAgICAgICAgICBjdXJzb3IubGluZSArPSAobmV3UG9zIC0gY3Vyc29yQ29vcmRzLnRvcCkgLyBsaW5lSGVpZ2h0O1xuICAgICAgICAgICAgIGN1cnNvci5saW5lID0gTWF0aC5jZWlsKGN1cnNvci5saW5lKTtcbiAgICAgICAgICAgICBjbS5zZXRDdXJzb3IoY3Vyc29yKTtcbiAgICAgICAgICAgICBjdXJzb3JDb29yZHMgPSBjbS5jaGFyQ29vcmRzKGN1cnNvciwgJ2xvY2FsJyk7XG4gICAgICAgICAgICAgY20uc2Nyb2xsVG8obnVsbCwgY3Vyc29yQ29vcmRzLnRvcCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAvLyBDdXJzb3Igc3RheXMgd2l0aGluIGJvdW5kcy4gIEp1c3QgcmVwb3NpdGlvbiB0aGUgc2Nyb2xsIHdpbmRvdy5cbiAgICAgICAgICAgICBjbS5zY3JvbGxUbyhudWxsLCBuZXdQb3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgbmV3Qm90dG9tID0gbmV3UG9zICsgY20uZ2V0U2Nyb2xsSW5mbygpLmNsaWVudEhlaWdodDtcbiAgICAgICAgICBpZiAobmV3Qm90dG9tIDwgY3Vyc29yQ29vcmRzLmJvdHRvbSkge1xuICAgICAgICAgICAgIGN1cnNvci5saW5lIC09IChjdXJzb3JDb29yZHMuYm90dG9tIC0gbmV3Qm90dG9tKSAvIGxpbmVIZWlnaHQ7XG4gICAgICAgICAgICAgY3Vyc29yLmxpbmUgPSBNYXRoLmZsb29yKGN1cnNvci5saW5lKTtcbiAgICAgICAgICAgICBjbS5zZXRDdXJzb3IoY3Vyc29yKTtcbiAgICAgICAgICAgICBjdXJzb3JDb29yZHMgPSBjbS5jaGFyQ29vcmRzKGN1cnNvciwgJ2xvY2FsJyk7XG4gICAgICAgICAgICAgY20uc2Nyb2xsVG8oXG4gICAgICAgICAgICAgICAgIG51bGwsIGN1cnNvckNvb3Jkcy5ib3R0b20gLSBjbS5nZXRTY3JvbGxJbmZvKCkuY2xpZW50SGVpZ2h0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgIC8vIEN1cnNvciBzdGF5cyB3aXRoaW4gYm91bmRzLiAgSnVzdCByZXBvc2l0aW9uIHRoZSBzY3JvbGwgd2luZG93LlxuICAgICAgICAgICAgIGNtLnNjcm9sbFRvKG51bGwsIG5ld1Bvcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc2Nyb2xsVG9DdXJzb3I6IGZ1bmN0aW9uKGNtLCBhY3Rpb25BcmdzKSB7XG4gICAgICAgIHZhciBsaW5lTnVtID0gY20uZ2V0Q3Vyc29yKCkubGluZTtcbiAgICAgICAgdmFyIGNoYXJDb29yZHMgPSBjbS5jaGFyQ29vcmRzKFBvcyhsaW5lTnVtLCAwKSwgJ2xvY2FsJyk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBjbS5nZXRTY3JvbGxJbmZvKCkuY2xpZW50SGVpZ2h0O1xuICAgICAgICB2YXIgeSA9IGNoYXJDb29yZHMudG9wO1xuICAgICAgICB2YXIgbGluZUhlaWdodCA9IGNoYXJDb29yZHMuYm90dG9tIC0geTtcbiAgICAgICAgc3dpdGNoIChhY3Rpb25BcmdzLnBvc2l0aW9uKSB7XG4gICAgICAgICAgY2FzZSAnY2VudGVyJzogeSA9IHkgLSAoaGVpZ2h0IC8gMikgKyBsaW5lSGVpZ2h0O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnYm90dG9tJzogeSA9IHkgLSBoZWlnaHQgKyBsaW5lSGVpZ2h0O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY20uc2Nyb2xsVG8obnVsbCwgeSk7XG4gICAgICB9LFxuICAgICAgcmVwbGF5TWFjcm86IGZ1bmN0aW9uKGNtLCBhY3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgdmFyIHJlZ2lzdGVyTmFtZSA9IGFjdGlvbkFyZ3Muc2VsZWN0ZWRDaGFyYWN0ZXI7XG4gICAgICAgIHZhciByZXBlYXQgPSBhY3Rpb25BcmdzLnJlcGVhdDtcbiAgICAgICAgdmFyIG1hY3JvTW9kZVN0YXRlID0gdmltR2xvYmFsU3RhdGUubWFjcm9Nb2RlU3RhdGU7XG4gICAgICAgIGlmIChyZWdpc3Rlck5hbWUgPT0gJ0AnKSB7XG4gICAgICAgICAgcmVnaXN0ZXJOYW1lID0gbWFjcm9Nb2RlU3RhdGUubGF0ZXN0UmVnaXN0ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWFjcm9Nb2RlU3RhdGUubGF0ZXN0UmVnaXN0ZXIgPSByZWdpc3Rlck5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUocmVwZWF0LS0pe1xuICAgICAgICAgIGV4ZWN1dGVNYWNyb1JlZ2lzdGVyKGNtLCB2aW0sIG1hY3JvTW9kZVN0YXRlLCByZWdpc3Rlck5hbWUpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZW50ZXJNYWNyb1JlY29yZE1vZGU6IGZ1bmN0aW9uKGNtLCBhY3Rpb25BcmdzKSB7XG4gICAgICAgIHZhciBtYWNyb01vZGVTdGF0ZSA9IHZpbUdsb2JhbFN0YXRlLm1hY3JvTW9kZVN0YXRlO1xuICAgICAgICB2YXIgcmVnaXN0ZXJOYW1lID0gYWN0aW9uQXJncy5zZWxlY3RlZENoYXJhY3RlcjtcbiAgICAgICAgaWYgKHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci5pc1ZhbGlkUmVnaXN0ZXIocmVnaXN0ZXJOYW1lKSkge1xuICAgICAgICAgIG1hY3JvTW9kZVN0YXRlLmVudGVyTWFjcm9SZWNvcmRNb2RlKGNtLCByZWdpc3Rlck5hbWUpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdG9nZ2xlT3ZlcndyaXRlOiBmdW5jdGlvbihjbSkge1xuICAgICAgICBpZiAoIWNtLnN0YXRlLm92ZXJ3cml0ZSkge1xuICAgICAgICAgIGNtLnRvZ2dsZU92ZXJ3cml0ZSh0cnVlKTtcbiAgICAgICAgICBjbS5zZXRPcHRpb24oJ2tleU1hcCcsICd2aW0tcmVwbGFjZScpO1xuICAgICAgICAgIENvZGVNaXJyb3Iuc2lnbmFsKGNtLCBcInZpbS1tb2RlLWNoYW5nZVwiLCB7bW9kZTogXCJyZXBsYWNlXCJ9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjbS50b2dnbGVPdmVyd3JpdGUoZmFsc2UpO1xuICAgICAgICAgIGNtLnNldE9wdGlvbigna2V5TWFwJywgJ3ZpbS1pbnNlcnQnKTtcbiAgICAgICAgICBDb2RlTWlycm9yLnNpZ25hbChjbSwgXCJ2aW0tbW9kZS1jaGFuZ2VcIiwge21vZGU6IFwiaW5zZXJ0XCJ9KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGVudGVySW5zZXJ0TW9kZTogZnVuY3Rpb24oY20sIGFjdGlvbkFyZ3MsIHZpbSkge1xuICAgICAgICBpZiAoY20uZ2V0T3B0aW9uKCdyZWFkT25seScpKSB7IHJldHVybjsgfVxuICAgICAgICB2aW0uaW5zZXJ0TW9kZSA9IHRydWU7XG4gICAgICAgIHZpbS5pbnNlcnRNb2RlUmVwZWF0ID0gYWN0aW9uQXJncyAmJiBhY3Rpb25BcmdzLnJlcGVhdCB8fCAxO1xuICAgICAgICB2YXIgaW5zZXJ0QXQgPSAoYWN0aW9uQXJncykgPyBhY3Rpb25BcmdzLmluc2VydEF0IDogbnVsbDtcbiAgICAgICAgdmFyIHNlbCA9IHZpbS5zZWw7XG4gICAgICAgIHZhciBoZWFkID0gYWN0aW9uQXJncy5oZWFkIHx8IGNtLmdldEN1cnNvcignaGVhZCcpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gY20ubGlzdFNlbGVjdGlvbnMoKS5sZW5ndGg7XG4gICAgICAgIGlmIChpbnNlcnRBdCA9PSAnZW9sJykge1xuICAgICAgICAgIGhlYWQgPSBQb3MoaGVhZC5saW5lLCBsaW5lTGVuZ3RoKGNtLCBoZWFkLmxpbmUpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpbnNlcnRBdCA9PSAnY2hhckFmdGVyJykge1xuICAgICAgICAgIGhlYWQgPSBvZmZzZXRDdXJzb3IoaGVhZCwgMCwgMSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5zZXJ0QXQgPT0gJ2ZpcnN0Tm9uQmxhbmsnKSB7XG4gICAgICAgICAgaGVhZCA9IG1vdGlvbnMubW92ZVRvRmlyc3ROb25XaGl0ZVNwYWNlQ2hhcmFjdGVyKGNtLCBoZWFkKTtcbiAgICAgICAgfSBlbHNlIGlmIChpbnNlcnRBdCA9PSAnc3RhcnRPZlNlbGVjdGVkQXJlYScpIHtcbiAgICAgICAgICBpZiAoIXZpbS52aXN1YWxNb2RlKVxuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgaWYgKCF2aW0udmlzdWFsQmxvY2spIHtcbiAgICAgICAgICAgIGlmIChzZWwuaGVhZC5saW5lIDwgc2VsLmFuY2hvci5saW5lKSB7XG4gICAgICAgICAgICAgIGhlYWQgPSBzZWwuaGVhZDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGhlYWQgPSBQb3Moc2VsLmFuY2hvci5saW5lLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGVhZCA9IFBvcyhcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihzZWwuaGVhZC5saW5lLCBzZWwuYW5jaG9yLmxpbmUpLFxuICAgICAgICAgICAgICAgIE1hdGgubWluKHNlbC5oZWFkLmNoLCBzZWwuYW5jaG9yLmNoKSk7XG4gICAgICAgICAgICBoZWlnaHQgPSBNYXRoLmFicyhzZWwuaGVhZC5saW5lIC0gc2VsLmFuY2hvci5saW5lKSArIDE7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGluc2VydEF0ID09ICdlbmRPZlNlbGVjdGVkQXJlYScpIHtcbiAgICAgICAgICAgIGlmICghdmltLnZpc3VhbE1vZGUpXG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICBpZiAoIXZpbS52aXN1YWxCbG9jaykge1xuICAgICAgICAgICAgaWYgKHNlbC5oZWFkLmxpbmUgPj0gc2VsLmFuY2hvci5saW5lKSB7XG4gICAgICAgICAgICAgIGhlYWQgPSBvZmZzZXRDdXJzb3Ioc2VsLmhlYWQsIDAsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaGVhZCA9IFBvcyhzZWwuYW5jaG9yLmxpbmUsIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoZWFkID0gUG9zKFxuICAgICAgICAgICAgICAgIE1hdGgubWluKHNlbC5oZWFkLmxpbmUsIHNlbC5hbmNob3IubGluZSksXG4gICAgICAgICAgICAgICAgTWF0aC5tYXgoc2VsLmhlYWQuY2ggKyAxLCBzZWwuYW5jaG9yLmNoKSk7XG4gICAgICAgICAgICBoZWlnaHQgPSBNYXRoLmFicyhzZWwuaGVhZC5saW5lIC0gc2VsLmFuY2hvci5saW5lKSArIDE7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGluc2VydEF0ID09ICdpbnBsYWNlJykge1xuICAgICAgICAgIGlmICh2aW0udmlzdWFsTW9kZSl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNtLnNldE9wdGlvbignZGlzYWJsZUlucHV0JywgZmFsc2UpO1xuICAgICAgICBpZiAoYWN0aW9uQXJncyAmJiBhY3Rpb25BcmdzLnJlcGxhY2UpIHtcbiAgICAgICAgICAvLyBIYW5kbGUgUmVwbGFjZS1tb2RlIGFzIGEgc3BlY2lhbCBjYXNlIG9mIGluc2VydCBtb2RlLlxuICAgICAgICAgIGNtLnRvZ2dsZU92ZXJ3cml0ZSh0cnVlKTtcbiAgICAgICAgICBjbS5zZXRPcHRpb24oJ2tleU1hcCcsICd2aW0tcmVwbGFjZScpO1xuICAgICAgICAgIENvZGVNaXJyb3Iuc2lnbmFsKGNtLCBcInZpbS1tb2RlLWNoYW5nZVwiLCB7bW9kZTogXCJyZXBsYWNlXCJ9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjbS50b2dnbGVPdmVyd3JpdGUoZmFsc2UpO1xuICAgICAgICAgIGNtLnNldE9wdGlvbigna2V5TWFwJywgJ3ZpbS1pbnNlcnQnKTtcbiAgICAgICAgICBDb2RlTWlycm9yLnNpZ25hbChjbSwgXCJ2aW0tbW9kZS1jaGFuZ2VcIiwge21vZGU6IFwiaW5zZXJ0XCJ9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXZpbUdsb2JhbFN0YXRlLm1hY3JvTW9kZVN0YXRlLmlzUGxheWluZykge1xuICAgICAgICAgIC8vIE9ubHkgcmVjb3JkIGlmIG5vdCByZXBsYXlpbmcuXG4gICAgICAgICAgY20ub24oJ2NoYW5nZScsIG9uQ2hhbmdlKTtcbiAgICAgICAgICBDb2RlTWlycm9yLm9uKGNtLmdldElucHV0RmllbGQoKSwgJ2tleWRvd24nLCBvbktleUV2ZW50VGFyZ2V0S2V5RG93bik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgZXhpdFZpc3VhbE1vZGUoY20pO1xuICAgICAgICB9XG4gICAgICAgIHNlbGVjdEZvckluc2VydChjbSwgaGVhZCwgaGVpZ2h0KTtcbiAgICAgIH0sXG4gICAgICB0b2dnbGVWaXN1YWxNb2RlOiBmdW5jdGlvbihjbSwgYWN0aW9uQXJncywgdmltKSB7XG4gICAgICAgIHZhciByZXBlYXQgPSBhY3Rpb25BcmdzLnJlcGVhdDtcbiAgICAgICAgdmFyIGFuY2hvciA9IGNtLmdldEN1cnNvcigpO1xuICAgICAgICB2YXIgaGVhZDtcbiAgICAgICAgLy8gVE9ETzogVGhlIHJlcGVhdCBzaG91bGQgYWN0dWFsbHkgc2VsZWN0IG51bWJlciBvZiBjaGFyYWN0ZXJzL2xpbmVzXG4gICAgICAgIC8vICAgICBlcXVhbCB0byB0aGUgcmVwZWF0IHRpbWVzIHRoZSBzaXplIG9mIHRoZSBwcmV2aW91cyB2aXN1YWxcbiAgICAgICAgLy8gICAgIG9wZXJhdGlvbi5cbiAgICAgICAgaWYgKCF2aW0udmlzdWFsTW9kZSkge1xuICAgICAgICAgIC8vIEVudGVyaW5nIHZpc3VhbCBtb2RlXG4gICAgICAgICAgdmltLnZpc3VhbE1vZGUgPSB0cnVlO1xuICAgICAgICAgIHZpbS52aXN1YWxMaW5lID0gISFhY3Rpb25BcmdzLmxpbmV3aXNlO1xuICAgICAgICAgIHZpbS52aXN1YWxCbG9jayA9ICEhYWN0aW9uQXJncy5ibG9ja3dpc2U7XG4gICAgICAgICAgaGVhZCA9IGNsaXBDdXJzb3JUb0NvbnRlbnQoXG4gICAgICAgICAgICAgIGNtLCBQb3MoYW5jaG9yLmxpbmUsIGFuY2hvci5jaCArIHJlcGVhdCAtIDEpLFxuICAgICAgICAgICAgICB0cnVlIC8qKiBpbmNsdWRlTGluZUJyZWFrICovKTtcbiAgICAgICAgICB2aW0uc2VsID0ge1xuICAgICAgICAgICAgYW5jaG9yOiBhbmNob3IsXG4gICAgICAgICAgICBoZWFkOiBoZWFkXG4gICAgICAgICAgfTtcbiAgICAgICAgICBDb2RlTWlycm9yLnNpZ25hbChjbSwgXCJ2aW0tbW9kZS1jaGFuZ2VcIiwge21vZGU6IFwidmlzdWFsXCIsIHN1Yk1vZGU6IHZpbS52aXN1YWxMaW5lID8gXCJsaW5ld2lzZVwiIDogdmltLnZpc3VhbEJsb2NrID8gXCJibG9ja3dpc2VcIiA6IFwiXCJ9KTtcbiAgICAgICAgICB1cGRhdGVDbVNlbGVjdGlvbihjbSk7XG4gICAgICAgICAgdXBkYXRlTWFyayhjbSwgdmltLCAnPCcsIGN1cnNvck1pbihhbmNob3IsIGhlYWQpKTtcbiAgICAgICAgICB1cGRhdGVNYXJrKGNtLCB2aW0sICc+JywgY3Vyc29yTWF4KGFuY2hvciwgaGVhZCkpO1xuICAgICAgICB9IGVsc2UgaWYgKHZpbS52aXN1YWxMaW5lIF4gYWN0aW9uQXJncy5saW5ld2lzZSB8fFxuICAgICAgICAgICAgdmltLnZpc3VhbEJsb2NrIF4gYWN0aW9uQXJncy5ibG9ja3dpc2UpIHtcbiAgICAgICAgICAvLyBUb2dnbGluZyBiZXR3ZWVuIG1vZGVzXG4gICAgICAgICAgdmltLnZpc3VhbExpbmUgPSAhIWFjdGlvbkFyZ3MubGluZXdpc2U7XG4gICAgICAgICAgdmltLnZpc3VhbEJsb2NrID0gISFhY3Rpb25BcmdzLmJsb2Nrd2lzZTtcbiAgICAgICAgICBDb2RlTWlycm9yLnNpZ25hbChjbSwgXCJ2aW0tbW9kZS1jaGFuZ2VcIiwge21vZGU6IFwidmlzdWFsXCIsIHN1Yk1vZGU6IHZpbS52aXN1YWxMaW5lID8gXCJsaW5ld2lzZVwiIDogdmltLnZpc3VhbEJsb2NrID8gXCJibG9ja3dpc2VcIiA6IFwiXCJ9KTtcbiAgICAgICAgICB1cGRhdGVDbVNlbGVjdGlvbihjbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXhpdFZpc3VhbE1vZGUoY20pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcmVzZWxlY3RMYXN0U2VsZWN0aW9uOiBmdW5jdGlvbihjbSwgX2FjdGlvbkFyZ3MsIHZpbSkge1xuICAgICAgICB2YXIgbGFzdFNlbGVjdGlvbiA9IHZpbS5sYXN0U2VsZWN0aW9uO1xuICAgICAgICBpZiAodmltLnZpc3VhbE1vZGUpIHtcbiAgICAgICAgICB1cGRhdGVMYXN0U2VsZWN0aW9uKGNtLCB2aW0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsYXN0U2VsZWN0aW9uKSB7XG4gICAgICAgICAgdmFyIGFuY2hvciA9IGxhc3RTZWxlY3Rpb24uYW5jaG9yTWFyay5maW5kKCk7XG4gICAgICAgICAgdmFyIGhlYWQgPSBsYXN0U2VsZWN0aW9uLmhlYWRNYXJrLmZpbmQoKTtcbiAgICAgICAgICBpZiAoIWFuY2hvciB8fCAhaGVhZCkge1xuICAgICAgICAgICAgLy8gSWYgdGhlIG1hcmtzIGhhdmUgYmVlbiBkZXN0cm95ZWQgZHVlIHRvIGVkaXRzLCBkbyBub3RoaW5nLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2aW0uc2VsID0ge1xuICAgICAgICAgICAgYW5jaG9yOiBhbmNob3IsXG4gICAgICAgICAgICBoZWFkOiBoZWFkXG4gICAgICAgICAgfTtcbiAgICAgICAgICB2aW0udmlzdWFsTW9kZSA9IHRydWU7XG4gICAgICAgICAgdmltLnZpc3VhbExpbmUgPSBsYXN0U2VsZWN0aW9uLnZpc3VhbExpbmU7XG4gICAgICAgICAgdmltLnZpc3VhbEJsb2NrID0gbGFzdFNlbGVjdGlvbi52aXN1YWxCbG9jaztcbiAgICAgICAgICB1cGRhdGVDbVNlbGVjdGlvbihjbSk7XG4gICAgICAgICAgdXBkYXRlTWFyayhjbSwgdmltLCAnPCcsIGN1cnNvck1pbihhbmNob3IsIGhlYWQpKTtcbiAgICAgICAgICB1cGRhdGVNYXJrKGNtLCB2aW0sICc+JywgY3Vyc29yTWF4KGFuY2hvciwgaGVhZCkpO1xuICAgICAgICAgIENvZGVNaXJyb3Iuc2lnbmFsKGNtLCAndmltLW1vZGUtY2hhbmdlJywge1xuICAgICAgICAgICAgbW9kZTogJ3Zpc3VhbCcsXG4gICAgICAgICAgICBzdWJNb2RlOiB2aW0udmlzdWFsTGluZSA/ICdsaW5ld2lzZScgOlxuICAgICAgICAgICAgICAgICAgICAgdmltLnZpc3VhbEJsb2NrID8gJ2Jsb2Nrd2lzZScgOiAnJ30pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgam9pbkxpbmVzOiBmdW5jdGlvbihjbSwgYWN0aW9uQXJncywgdmltKSB7XG4gICAgICAgIHZhciBjdXJTdGFydCwgY3VyRW5kO1xuICAgICAgICBpZiAodmltLnZpc3VhbE1vZGUpIHtcbiAgICAgICAgICBjdXJTdGFydCA9IGNtLmdldEN1cnNvcignYW5jaG9yJyk7XG4gICAgICAgICAgY3VyRW5kID0gY20uZ2V0Q3Vyc29yKCdoZWFkJyk7XG4gICAgICAgICAgaWYgKGN1cnNvcklzQmVmb3JlKGN1ckVuZCwgY3VyU3RhcnQpKSB7XG4gICAgICAgICAgICB2YXIgdG1wID0gY3VyRW5kO1xuICAgICAgICAgICAgY3VyRW5kID0gY3VyU3RhcnQ7XG4gICAgICAgICAgICBjdXJTdGFydCA9IHRtcDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VyRW5kLmNoID0gbGluZUxlbmd0aChjbSwgY3VyRW5kLmxpbmUpIC0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBSZXBlYXQgaXMgdGhlIG51bWJlciBvZiBsaW5lcyB0byBqb2luLiBNaW5pbXVtIDIgbGluZXMuXG4gICAgICAgICAgdmFyIHJlcGVhdCA9IE1hdGgubWF4KGFjdGlvbkFyZ3MucmVwZWF0LCAyKTtcbiAgICAgICAgICBjdXJTdGFydCA9IGNtLmdldEN1cnNvcigpO1xuICAgICAgICAgIGN1ckVuZCA9IGNsaXBDdXJzb3JUb0NvbnRlbnQoY20sIFBvcyhjdXJTdGFydC5saW5lICsgcmVwZWF0IC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5maW5pdHkpKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZmluYWxDaCA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSBjdXJTdGFydC5saW5lOyBpIDwgY3VyRW5kLmxpbmU7IGkrKykge1xuICAgICAgICAgIGZpbmFsQ2ggPSBsaW5lTGVuZ3RoKGNtLCBjdXJTdGFydC5saW5lKTtcbiAgICAgICAgICB2YXIgdG1wID0gUG9zKGN1clN0YXJ0LmxpbmUgKyAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZUxlbmd0aChjbSwgY3VyU3RhcnQubGluZSArIDEpKTtcbiAgICAgICAgICB2YXIgdGV4dCA9IGNtLmdldFJhbmdlKGN1clN0YXJ0LCB0bXApO1xuICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoL1xcblxccyovZywgJyAnKTtcbiAgICAgICAgICBjbS5yZXBsYWNlUmFuZ2UodGV4dCwgY3VyU3RhcnQsIHRtcCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGN1ckZpbmFsUG9zID0gUG9zKGN1clN0YXJ0LmxpbmUsIGZpbmFsQ2gpO1xuICAgICAgICBpZiAodmltLnZpc3VhbE1vZGUpIHtcbiAgICAgICAgICBleGl0VmlzdWFsTW9kZShjbSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGNtLnNldEN1cnNvcihjdXJGaW5hbFBvcyk7XG4gICAgICB9LFxuICAgICAgbmV3TGluZUFuZEVudGVySW5zZXJ0TW9kZTogZnVuY3Rpb24oY20sIGFjdGlvbkFyZ3MsIHZpbSkge1xuICAgICAgICB2aW0uaW5zZXJ0TW9kZSA9IHRydWU7XG4gICAgICAgIHZhciBpbnNlcnRBdCA9IGNvcHlDdXJzb3IoY20uZ2V0Q3Vyc29yKCkpO1xuICAgICAgICBpZiAoaW5zZXJ0QXQubGluZSA9PT0gY20uZmlyc3RMaW5lKCkgJiYgIWFjdGlvbkFyZ3MuYWZ0ZXIpIHtcbiAgICAgICAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIGluc2VydGluZyBuZXdsaW5lIGJlZm9yZSBzdGFydCBvZiBkb2N1bWVudC5cbiAgICAgICAgICBjbS5yZXBsYWNlUmFuZ2UoJ1xcbicsIFBvcyhjbS5maXJzdExpbmUoKSwgMCkpO1xuICAgICAgICAgIGNtLnNldEN1cnNvcihjbS5maXJzdExpbmUoKSwgMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5zZXJ0QXQubGluZSA9IChhY3Rpb25BcmdzLmFmdGVyKSA/IGluc2VydEF0LmxpbmUgOlxuICAgICAgICAgICAgICBpbnNlcnRBdC5saW5lIC0gMTtcbiAgICAgICAgICBpbnNlcnRBdC5jaCA9IGxpbmVMZW5ndGgoY20sIGluc2VydEF0LmxpbmUpO1xuICAgICAgICAgIGNtLnNldEN1cnNvcihpbnNlcnRBdCk7XG4gICAgICAgICAgdmFyIG5ld2xpbmVGbiA9IENvZGVNaXJyb3IuY29tbWFuZHMubmV3bGluZUFuZEluZGVudENvbnRpbnVlQ29tbWVudCB8fFxuICAgICAgICAgICAgICBDb2RlTWlycm9yLmNvbW1hbmRzLm5ld2xpbmVBbmRJbmRlbnQ7XG4gICAgICAgICAgbmV3bGluZUZuKGNtKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVudGVySW5zZXJ0TW9kZShjbSwgeyByZXBlYXQ6IGFjdGlvbkFyZ3MucmVwZWF0IH0sIHZpbSk7XG4gICAgICB9LFxuICAgICAgcGFzdGU6IGZ1bmN0aW9uKGNtLCBhY3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgdmFyIGN1ciA9IGNvcHlDdXJzb3IoY20uZ2V0Q3Vyc29yKCkpO1xuICAgICAgICB2YXIgcmVnaXN0ZXIgPSB2aW1HbG9iYWxTdGF0ZS5yZWdpc3RlckNvbnRyb2xsZXIuZ2V0UmVnaXN0ZXIoXG4gICAgICAgICAgICBhY3Rpb25BcmdzLnJlZ2lzdGVyTmFtZSk7XG4gICAgICAgIHZhciB0ZXh0ID0gcmVnaXN0ZXIudG9TdHJpbmcoKTtcbiAgICAgICAgaWYgKCF0ZXh0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3Rpb25BcmdzLm1hdGNoSW5kZW50KSB7XG4gICAgICAgICAgdmFyIHRhYlNpemUgPSBjbS5nZXRPcHRpb24oXCJ0YWJTaXplXCIpO1xuICAgICAgICAgIC8vIGxlbmd0aCB0aGF0IGNvbnNpZGVycyB0YWJzIGFuZCB0YWJTaXplXG4gICAgICAgICAgdmFyIHdoaXRlc3BhY2VMZW5ndGggPSBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgIHZhciB0YWJzID0gKHN0ci5zcGxpdChcIlxcdFwiKS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIHZhciBzcGFjZXMgPSAoc3RyLnNwbGl0KFwiIFwiKS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIHJldHVybiB0YWJzICogdGFiU2l6ZSArIHNwYWNlcyAqIDE7XG4gICAgICAgICAgfTtcbiAgICAgICAgICB2YXIgY3VycmVudExpbmUgPSBjbS5nZXRMaW5lKGNtLmdldEN1cnNvcigpLmxpbmUpO1xuICAgICAgICAgIHZhciBpbmRlbnQgPSB3aGl0ZXNwYWNlTGVuZ3RoKGN1cnJlbnRMaW5lLm1hdGNoKC9eXFxzKi8pWzBdKTtcbiAgICAgICAgICAvLyBjaG9tcCBsYXN0IG5ld2xpbmUgYi9jIGRvbid0IHdhbnQgaXQgdG8gbWF0Y2ggL15cXHMqL2dtXG4gICAgICAgICAgdmFyIGNob21wZWRUZXh0ID0gdGV4dC5yZXBsYWNlKC9cXG4kLywgJycpO1xuICAgICAgICAgIHZhciB3YXNDaG9tcGVkID0gdGV4dCAhPT0gY2hvbXBlZFRleHQ7XG4gICAgICAgICAgdmFyIGZpcnN0SW5kZW50ID0gd2hpdGVzcGFjZUxlbmd0aCh0ZXh0Lm1hdGNoKC9eXFxzKi8pWzBdKTtcbiAgICAgICAgICB2YXIgdGV4dCA9IGNob21wZWRUZXh0LnJlcGxhY2UoL15cXHMqL2dtLCBmdW5jdGlvbih3c3BhY2UpIHtcbiAgICAgICAgICAgIHZhciBuZXdJbmRlbnQgPSBpbmRlbnQgKyAod2hpdGVzcGFjZUxlbmd0aCh3c3BhY2UpIC0gZmlyc3RJbmRlbnQpO1xuICAgICAgICAgICAgaWYgKG5ld0luZGVudCA8IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjbS5nZXRPcHRpb24oXCJpbmRlbnRXaXRoVGFic1wiKSkge1xuICAgICAgICAgICAgICB2YXIgcXVvdGllbnQgPSBNYXRoLmZsb29yKG5ld0luZGVudCAvIHRhYlNpemUpO1xuICAgICAgICAgICAgICByZXR1cm4gQXJyYXkocXVvdGllbnQgKyAxKS5qb2luKCdcXHQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gQXJyYXkobmV3SW5kZW50ICsgMSkuam9pbignICcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRleHQgKz0gd2FzQ2hvbXBlZCA/IFwiXFxuXCIgOiBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3Rpb25BcmdzLnJlcGVhdCA+IDEpIHtcbiAgICAgICAgICB2YXIgdGV4dCA9IEFycmF5KGFjdGlvbkFyZ3MucmVwZWF0ICsgMSkuam9pbih0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGluZXdpc2UgPSByZWdpc3Rlci5saW5ld2lzZTtcbiAgICAgICAgdmFyIGJsb2Nrd2lzZSA9IHJlZ2lzdGVyLmJsb2Nrd2lzZTtcbiAgICAgICAgaWYgKGJsb2Nrd2lzZSkge1xuICAgICAgICAgIHRleHQgPSB0ZXh0LnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICBpZiAobGluZXdpc2UpIHtcbiAgICAgICAgICAgICAgdGV4dC5wb3AoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0ZXh0W2ldID0gKHRleHRbaV0gPT0gJycpID8gJyAnIDogdGV4dFtpXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VyLmNoICs9IGFjdGlvbkFyZ3MuYWZ0ZXIgPyAxIDogMDtcbiAgICAgICAgICBjdXIuY2ggPSBNYXRoLm1pbihsaW5lTGVuZ3RoKGNtLCBjdXIubGluZSksIGN1ci5jaCk7XG4gICAgICAgIH0gZWxzZSBpZiAobGluZXdpc2UpIHtcbiAgICAgICAgICBpZih2aW0udmlzdWFsTW9kZSkge1xuICAgICAgICAgICAgdGV4dCA9IHZpbS52aXN1YWxMaW5lID8gdGV4dC5zbGljZSgwLCAtMSkgOiAnXFxuJyArIHRleHQuc2xpY2UoMCwgdGV4dC5sZW5ndGggLSAxKSArICdcXG4nO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uQXJncy5hZnRlcikge1xuICAgICAgICAgICAgLy8gTW92ZSB0aGUgbmV3bGluZSBhdCB0aGUgZW5kIHRvIHRoZSBzdGFydCBpbnN0ZWFkLCBhbmQgcGFzdGUganVzdFxuICAgICAgICAgICAgLy8gYmVmb3JlIHRoZSBuZXdsaW5lIGNoYXJhY3RlciBvZiB0aGUgbGluZSB3ZSBhcmUgb24gcmlnaHQgbm93LlxuICAgICAgICAgICAgdGV4dCA9ICdcXG4nICsgdGV4dC5zbGljZSgwLCB0ZXh0Lmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgY3VyLmNoID0gbGluZUxlbmd0aChjbSwgY3VyLmxpbmUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjdXIuY2ggPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdXIuY2ggKz0gYWN0aW9uQXJncy5hZnRlciA/IDEgOiAwO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjdXJQb3NGaW5hbDtcbiAgICAgICAgdmFyIGlkeDtcbiAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgLy8gIHNhdmUgdGhlIHBhc3RlZCB0ZXh0IGZvciByZXNlbGVjdGlvbiBpZiB0aGUgbmVlZCBhcmlzZXNcbiAgICAgICAgICB2aW0ubGFzdFBhc3RlZFRleHQgPSB0ZXh0O1xuICAgICAgICAgIHZhciBsYXN0U2VsZWN0aW9uQ3VyRW5kO1xuICAgICAgICAgIHZhciBzZWxlY3RlZEFyZWEgPSBnZXRTZWxlY3RlZEFyZWFSYW5nZShjbSwgdmltKTtcbiAgICAgICAgICB2YXIgc2VsZWN0aW9uU3RhcnQgPSBzZWxlY3RlZEFyZWFbMF07XG4gICAgICAgICAgdmFyIHNlbGVjdGlvbkVuZCA9IHNlbGVjdGVkQXJlYVsxXTtcbiAgICAgICAgICB2YXIgc2VsZWN0ZWRUZXh0ID0gY20uZ2V0U2VsZWN0aW9uKCk7XG4gICAgICAgICAgdmFyIHNlbGVjdGlvbnMgPSBjbS5saXN0U2VsZWN0aW9ucygpO1xuICAgICAgICAgIHZhciBlbXB0eVN0cmluZ3MgPSBuZXcgQXJyYXkoc2VsZWN0aW9ucy5sZW5ndGgpLmpvaW4oJzEnKS5zcGxpdCgnMScpO1xuICAgICAgICAgIC8vIHNhdmUgdGhlIGN1ckVuZCBtYXJrZXIgYmVmb3JlIGl0IGdldCBjbGVhcmVkIGR1ZSB0byBjbS5yZXBsYWNlUmFuZ2UuXG4gICAgICAgICAgaWYgKHZpbS5sYXN0U2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBsYXN0U2VsZWN0aW9uQ3VyRW5kID0gdmltLmxhc3RTZWxlY3Rpb24uaGVhZE1hcmsuZmluZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBwdXNoIHRoZSBwcmV2aW91c2x5IHNlbGVjdGVkIHRleHQgdG8gdW5uYW1lZCByZWdpc3RlclxuICAgICAgICAgIHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci51bm5hbWVkUmVnaXN0ZXIuc2V0VGV4dChzZWxlY3RlZFRleHQpO1xuICAgICAgICAgIGlmIChibG9ja3dpc2UpIHtcbiAgICAgICAgICAgIC8vIGZpcnN0IGRlbGV0ZSB0aGUgc2VsZWN0ZWQgdGV4dFxuICAgICAgICAgICAgY20ucmVwbGFjZVNlbGVjdGlvbnMoZW1wdHlTdHJpbmdzKTtcbiAgICAgICAgICAgIC8vIFNldCBuZXcgc2VsZWN0aW9ucyBhcyBwZXIgdGhlIGJsb2NrIGxlbmd0aCBvZiB0aGUgeWFua2VkIHRleHRcbiAgICAgICAgICAgIHNlbGVjdGlvbkVuZCA9IFBvcyhzZWxlY3Rpb25TdGFydC5saW5lICsgdGV4dC5sZW5ndGgtMSwgc2VsZWN0aW9uU3RhcnQuY2gpO1xuICAgICAgICAgICAgY20uc2V0Q3Vyc29yKHNlbGVjdGlvblN0YXJ0KTtcbiAgICAgICAgICAgIHNlbGVjdEJsb2NrKGNtLCBzZWxlY3Rpb25FbmQpO1xuICAgICAgICAgICAgY20ucmVwbGFjZVNlbGVjdGlvbnModGV4dCk7XG4gICAgICAgICAgICBjdXJQb3NGaW5hbCA9IHNlbGVjdGlvblN0YXJ0O1xuICAgICAgICAgIH0gZWxzZSBpZiAodmltLnZpc3VhbEJsb2NrKSB7XG4gICAgICAgICAgICBjbS5yZXBsYWNlU2VsZWN0aW9ucyhlbXB0eVN0cmluZ3MpO1xuICAgICAgICAgICAgY20uc2V0Q3Vyc29yKHNlbGVjdGlvblN0YXJ0KTtcbiAgICAgICAgICAgIGNtLnJlcGxhY2VSYW5nZSh0ZXh0LCBzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uU3RhcnQpO1xuICAgICAgICAgICAgY3VyUG9zRmluYWwgPSBzZWxlY3Rpb25TdGFydDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY20ucmVwbGFjZVJhbmdlKHRleHQsIHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpO1xuICAgICAgICAgICAgY3VyUG9zRmluYWwgPSBjbS5wb3NGcm9tSW5kZXgoY20uaW5kZXhGcm9tUG9zKHNlbGVjdGlvblN0YXJ0KSArIHRleHQubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHJlc3RvcmUgdGhlIHRoZSBjdXJFbmQgbWFya2VyXG4gICAgICAgICAgaWYobGFzdFNlbGVjdGlvbkN1ckVuZCkge1xuICAgICAgICAgICAgdmltLmxhc3RTZWxlY3Rpb24uaGVhZE1hcmsgPSBjbS5zZXRCb29rbWFyayhsYXN0U2VsZWN0aW9uQ3VyRW5kKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGxpbmV3aXNlKSB7XG4gICAgICAgICAgICBjdXJQb3NGaW5hbC5jaD0wO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoYmxvY2t3aXNlKSB7XG4gICAgICAgICAgICBjbS5zZXRDdXJzb3IoY3VyKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICB2YXIgbGluZSA9IGN1ci5saW5lK2k7XG4gICAgICAgICAgICAgIGlmIChsaW5lID4gY20ubGFzdExpbmUoKSkge1xuICAgICAgICAgICAgICAgIGNtLnJlcGxhY2VSYW5nZSgnXFxuJywgIFBvcyhsaW5lLCAwKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdmFyIGxhc3RDaCA9IGxpbmVMZW5ndGgoY20sIGxpbmUpO1xuICAgICAgICAgICAgICBpZiAobGFzdENoIDwgY3VyLmNoKSB7XG4gICAgICAgICAgICAgICAgZXh0ZW5kTGluZVRvQ29sdW1uKGNtLCBsaW5lLCBjdXIuY2gpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjbS5zZXRDdXJzb3IoY3VyKTtcbiAgICAgICAgICAgIHNlbGVjdEJsb2NrKGNtLCBQb3MoY3VyLmxpbmUgKyB0ZXh0Lmxlbmd0aC0xLCBjdXIuY2gpKTtcbiAgICAgICAgICAgIGNtLnJlcGxhY2VTZWxlY3Rpb25zKHRleHQpO1xuICAgICAgICAgICAgY3VyUG9zRmluYWwgPSBjdXI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNtLnJlcGxhY2VSYW5nZSh0ZXh0LCBjdXIpO1xuICAgICAgICAgICAgLy8gTm93IGZpbmUgdHVuZSB0aGUgY3Vyc29yIHRvIHdoZXJlIHdlIHdhbnQgaXQuXG4gICAgICAgICAgICBpZiAobGluZXdpc2UgJiYgYWN0aW9uQXJncy5hZnRlcikge1xuICAgICAgICAgICAgICBjdXJQb3NGaW5hbCA9IFBvcyhcbiAgICAgICAgICAgICAgY3VyLmxpbmUgKyAxLFxuICAgICAgICAgICAgICBmaW5kRmlyc3ROb25XaGl0ZVNwYWNlQ2hhcmFjdGVyKGNtLmdldExpbmUoY3VyLmxpbmUgKyAxKSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChsaW5ld2lzZSAmJiAhYWN0aW9uQXJncy5hZnRlcikge1xuICAgICAgICAgICAgICBjdXJQb3NGaW5hbCA9IFBvcyhcbiAgICAgICAgICAgICAgICBjdXIubGluZSxcbiAgICAgICAgICAgICAgICBmaW5kRmlyc3ROb25XaGl0ZVNwYWNlQ2hhcmFjdGVyKGNtLmdldExpbmUoY3VyLmxpbmUpKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFsaW5ld2lzZSAmJiBhY3Rpb25BcmdzLmFmdGVyKSB7XG4gICAgICAgICAgICAgIGlkeCA9IGNtLmluZGV4RnJvbVBvcyhjdXIpO1xuICAgICAgICAgICAgICBjdXJQb3NGaW5hbCA9IGNtLnBvc0Zyb21JbmRleChpZHggKyB0ZXh0Lmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWR4ID0gY20uaW5kZXhGcm9tUG9zKGN1cik7XG4gICAgICAgICAgICAgIGN1clBvc0ZpbmFsID0gY20ucG9zRnJvbUluZGV4KGlkeCArIHRleHQubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgZXhpdFZpc3VhbE1vZGUoY20sIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBjbS5zZXRDdXJzb3IoY3VyUG9zRmluYWwpO1xuICAgICAgfSxcbiAgICAgIHVuZG86IGZ1bmN0aW9uKGNtLCBhY3Rpb25BcmdzKSB7XG4gICAgICAgIGNtLm9wZXJhdGlvbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXBlYXRGbihjbSwgQ29kZU1pcnJvci5jb21tYW5kcy51bmRvLCBhY3Rpb25BcmdzLnJlcGVhdCkoKTtcbiAgICAgICAgICBjbS5zZXRDdXJzb3IoY20uZ2V0Q3Vyc29yKCdhbmNob3InKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHJlZG86IGZ1bmN0aW9uKGNtLCBhY3Rpb25BcmdzKSB7XG4gICAgICAgIHJlcGVhdEZuKGNtLCBDb2RlTWlycm9yLmNvbW1hbmRzLnJlZG8sIGFjdGlvbkFyZ3MucmVwZWF0KSgpO1xuICAgICAgfSxcbiAgICAgIHNldFJlZ2lzdGVyOiBmdW5jdGlvbihfY20sIGFjdGlvbkFyZ3MsIHZpbSkge1xuICAgICAgICB2aW0uaW5wdXRTdGF0ZS5yZWdpc3Rlck5hbWUgPSBhY3Rpb25BcmdzLnNlbGVjdGVkQ2hhcmFjdGVyO1xuICAgICAgfSxcbiAgICAgIHNldE1hcms6IGZ1bmN0aW9uKGNtLCBhY3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgdmFyIG1hcmtOYW1lID0gYWN0aW9uQXJncy5zZWxlY3RlZENoYXJhY3RlcjtcbiAgICAgICAgdXBkYXRlTWFyayhjbSwgdmltLCBtYXJrTmFtZSwgY20uZ2V0Q3Vyc29yKCkpO1xuICAgICAgfSxcbiAgICAgIHJlcGxhY2U6IGZ1bmN0aW9uKGNtLCBhY3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgdmFyIHJlcGxhY2VXaXRoID0gYWN0aW9uQXJncy5zZWxlY3RlZENoYXJhY3RlcjtcbiAgICAgICAgdmFyIGN1clN0YXJ0ID0gY20uZ2V0Q3Vyc29yKCk7XG4gICAgICAgIHZhciByZXBsYWNlVG87XG4gICAgICAgIHZhciBjdXJFbmQ7XG4gICAgICAgIHZhciBzZWxlY3Rpb25zID0gY20ubGlzdFNlbGVjdGlvbnMoKTtcbiAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgY3VyU3RhcnQgPSBjbS5nZXRDdXJzb3IoJ3N0YXJ0Jyk7XG4gICAgICAgICAgY3VyRW5kID0gY20uZ2V0Q3Vyc29yKCdlbmQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgbGluZSA9IGNtLmdldExpbmUoY3VyU3RhcnQubGluZSk7XG4gICAgICAgICAgcmVwbGFjZVRvID0gY3VyU3RhcnQuY2ggKyBhY3Rpb25BcmdzLnJlcGVhdDtcbiAgICAgICAgICBpZiAocmVwbGFjZVRvID4gbGluZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlcGxhY2VUbz1saW5lLmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VyRW5kID0gUG9zKGN1clN0YXJ0LmxpbmUsIHJlcGxhY2VUbyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlcGxhY2VXaXRoPT0nXFxuJykge1xuICAgICAgICAgIGlmICghdmltLnZpc3VhbE1vZGUpIGNtLnJlcGxhY2VSYW5nZSgnJywgY3VyU3RhcnQsIGN1ckVuZCk7XG4gICAgICAgICAgLy8gc3BlY2lhbCBjYXNlLCB3aGVyZSB2aW0gaGVscCBzYXlzIHRvIHJlcGxhY2UgYnkganVzdCBvbmUgbGluZS1icmVha1xuICAgICAgICAgIChDb2RlTWlycm9yLmNvbW1hbmRzLm5ld2xpbmVBbmRJbmRlbnRDb250aW51ZUNvbW1lbnQgfHwgQ29kZU1pcnJvci5jb21tYW5kcy5uZXdsaW5lQW5kSW5kZW50KShjbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHJlcGxhY2VXaXRoU3RyID0gY20uZ2V0UmFuZ2UoY3VyU3RhcnQsIGN1ckVuZCk7XG4gICAgICAgICAgLy9yZXBsYWNlIGFsbCBjaGFyYWN0ZXJzIGluIHJhbmdlIGJ5IHNlbGVjdGVkLCBidXQga2VlcCBsaW5lYnJlYWtzXG4gICAgICAgICAgcmVwbGFjZVdpdGhTdHIgPSByZXBsYWNlV2l0aFN0ci5yZXBsYWNlKC9bXlxcbl0vZywgcmVwbGFjZVdpdGgpO1xuICAgICAgICAgIGlmICh2aW0udmlzdWFsQmxvY2spIHtcbiAgICAgICAgICAgIC8vIFRhYnMgYXJlIHNwbGl0IGluIHZpc3VhIGJsb2NrIGJlZm9yZSByZXBsYWNpbmdcbiAgICAgICAgICAgIHZhciBzcGFjZXMgPSBuZXcgQXJyYXkoY20uZ2V0T3B0aW9uKFwidGFiU2l6ZVwiKSsxKS5qb2luKCcgJyk7XG4gICAgICAgICAgICByZXBsYWNlV2l0aFN0ciA9IGNtLmdldFNlbGVjdGlvbigpO1xuICAgICAgICAgICAgcmVwbGFjZVdpdGhTdHIgPSByZXBsYWNlV2l0aFN0ci5yZXBsYWNlKC9cXHQvZywgc3BhY2VzKS5yZXBsYWNlKC9bXlxcbl0vZywgcmVwbGFjZVdpdGgpLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICAgIGNtLnJlcGxhY2VTZWxlY3Rpb25zKHJlcGxhY2VXaXRoU3RyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY20ucmVwbGFjZVJhbmdlKHJlcGxhY2VXaXRoU3RyLCBjdXJTdGFydCwgY3VyRW5kKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgICBjdXJTdGFydCA9IGN1cnNvcklzQmVmb3JlKHNlbGVjdGlvbnNbMF0uYW5jaG9yLCBzZWxlY3Rpb25zWzBdLmhlYWQpID9cbiAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25zWzBdLmFuY2hvciA6IHNlbGVjdGlvbnNbMF0uaGVhZDtcbiAgICAgICAgICAgIGNtLnNldEN1cnNvcihjdXJTdGFydCk7XG4gICAgICAgICAgICBleGl0VmlzdWFsTW9kZShjbSwgZmFsc2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbS5zZXRDdXJzb3Iob2Zmc2V0Q3Vyc29yKGN1ckVuZCwgMCwgLTEpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBpbmNyZW1lbnROdW1iZXJUb2tlbjogZnVuY3Rpb24oY20sIGFjdGlvbkFyZ3MpIHtcbiAgICAgICAgdmFyIGN1ciA9IGNtLmdldEN1cnNvcigpO1xuICAgICAgICB2YXIgbGluZVN0ciA9IGNtLmdldExpbmUoY3VyLmxpbmUpO1xuICAgICAgICB2YXIgcmUgPSAvKC0/KSg/OigweCkoW1xcZGEtZl0rKXwoMGJ8MHwpKFxcZCspKS9naTtcbiAgICAgICAgdmFyIG1hdGNoO1xuICAgICAgICB2YXIgc3RhcnQ7XG4gICAgICAgIHZhciBlbmQ7XG4gICAgICAgIHZhciBudW1iZXJTdHI7XG4gICAgICAgIHdoaWxlICgobWF0Y2ggPSByZS5leGVjKGxpbmVTdHIpKSAhPT0gbnVsbCkge1xuICAgICAgICAgIHN0YXJ0ID0gbWF0Y2guaW5kZXg7XG4gICAgICAgICAgZW5kID0gc3RhcnQgKyBtYXRjaFswXS5sZW5ndGg7XG4gICAgICAgICAgaWYgKGN1ci5jaCA8IGVuZClicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWFjdGlvbkFyZ3MuYmFja3RyYWNrICYmIChlbmQgPD0gY3VyLmNoKSlyZXR1cm47XG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgIHZhciBiYXNlU3RyID0gbWF0Y2hbMl0gfHwgbWF0Y2hbNF1cbiAgICAgICAgICB2YXIgZGlnaXRzID0gbWF0Y2hbM10gfHwgbWF0Y2hbNV1cbiAgICAgICAgICB2YXIgaW5jcmVtZW50ID0gYWN0aW9uQXJncy5pbmNyZWFzZSA/IDEgOiAtMTtcbiAgICAgICAgICB2YXIgYmFzZSA9IHsnMGInOiAyLCAnMCc6IDgsICcnOiAxMCwgJzB4JzogMTZ9W2Jhc2VTdHIudG9Mb3dlckNhc2UoKV07XG4gICAgICAgICAgdmFyIG51bWJlciA9IHBhcnNlSW50KG1hdGNoWzFdICsgZGlnaXRzLCBiYXNlKSArIChpbmNyZW1lbnQgKiBhY3Rpb25BcmdzLnJlcGVhdCk7XG4gICAgICAgICAgbnVtYmVyU3RyID0gbnVtYmVyLnRvU3RyaW5nKGJhc2UpO1xuICAgICAgICAgIHZhciB6ZXJvUGFkZGluZyA9IGJhc2VTdHIgPyBuZXcgQXJyYXkoZGlnaXRzLmxlbmd0aCAtIG51bWJlclN0ci5sZW5ndGggKyAxICsgbWF0Y2hbMV0ubGVuZ3RoKS5qb2luKCcwJykgOiAnJ1xuICAgICAgICAgIGlmIChudW1iZXJTdHIuY2hhckF0KDApID09PSAnLScpIHtcbiAgICAgICAgICAgIG51bWJlclN0ciA9ICctJyArIGJhc2VTdHIgKyB6ZXJvUGFkZGluZyArIG51bWJlclN0ci5zdWJzdHIoMSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG51bWJlclN0ciA9IGJhc2VTdHIgKyB6ZXJvUGFkZGluZyArIG51bWJlclN0cjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGZyb20gPSBQb3MoY3VyLmxpbmUsIHN0YXJ0KTtcbiAgICAgICAgICB2YXIgdG8gPSBQb3MoY3VyLmxpbmUsIGVuZCk7XG4gICAgICAgICAgY20ucmVwbGFjZVJhbmdlKG51bWJlclN0ciwgZnJvbSwgdG8pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjbS5zZXRDdXJzb3IoUG9zKGN1ci5saW5lLCBzdGFydCArIG51bWJlclN0ci5sZW5ndGggLSAxKSk7XG4gICAgICB9LFxuICAgICAgcmVwZWF0TGFzdEVkaXQ6IGZ1bmN0aW9uKGNtLCBhY3Rpb25BcmdzLCB2aW0pIHtcbiAgICAgICAgdmFyIGxhc3RFZGl0SW5wdXRTdGF0ZSA9IHZpbS5sYXN0RWRpdElucHV0U3RhdGU7XG4gICAgICAgIGlmICghbGFzdEVkaXRJbnB1dFN0YXRlKSB7IHJldHVybjsgfVxuICAgICAgICB2YXIgcmVwZWF0ID0gYWN0aW9uQXJncy5yZXBlYXQ7XG4gICAgICAgIGlmIChyZXBlYXQgJiYgYWN0aW9uQXJncy5yZXBlYXRJc0V4cGxpY2l0KSB7XG4gICAgICAgICAgdmltLmxhc3RFZGl0SW5wdXRTdGF0ZS5yZXBlYXRPdmVycmlkZSA9IHJlcGVhdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXBlYXQgPSB2aW0ubGFzdEVkaXRJbnB1dFN0YXRlLnJlcGVhdE92ZXJyaWRlIHx8IHJlcGVhdDtcbiAgICAgICAgfVxuICAgICAgICByZXBlYXRMYXN0RWRpdChjbSwgdmltLCByZXBlYXQsIGZhbHNlIC8qKiByZXBlYXRGb3JJbnNlcnQgKi8pO1xuICAgICAgfSxcbiAgICAgIGluZGVudDogZnVuY3Rpb24oY20sIGFjdGlvbkFyZ3MpIHtcbiAgICAgICAgY20uaW5kZW50TGluZShjbS5nZXRDdXJzb3IoKS5saW5lLCBhY3Rpb25BcmdzLmluZGVudFJpZ2h0KTtcbiAgICAgIH0sXG4gICAgICBleGl0SW5zZXJ0TW9kZTogZXhpdEluc2VydE1vZGVcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZGVmaW5lQWN0aW9uKG5hbWUsIGZuKSB7XG4gICAgICBhY3Rpb25zW25hbWVdID0gZm47XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBCZWxvdyBhcmUgbWlzY2VsbGFuZW91cyB1dGlsaXR5IGZ1bmN0aW9ucyB1c2VkIGJ5IHZpbS5qc1xuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQ2xpcHMgY3Vyc29yIHRvIGVuc3VyZSB0aGF0IGxpbmUgaXMgd2l0aGluIHRoZSBidWZmZXIncyByYW5nZVxuICAgICAqIElmIGluY2x1ZGVMaW5lQnJlYWsgaXMgdHJ1ZSwgdGhlbiBhbGxvdyBjdXIuY2ggPT0gbGluZUxlbmd0aC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjbGlwQ3Vyc29yVG9Db250ZW50KGNtLCBjdXIsIGluY2x1ZGVMaW5lQnJlYWspIHtcbiAgICAgIHZhciBsaW5lID0gTWF0aC5taW4oTWF0aC5tYXgoY20uZmlyc3RMaW5lKCksIGN1ci5saW5lKSwgY20ubGFzdExpbmUoKSApO1xuICAgICAgdmFyIG1heENoID0gbGluZUxlbmd0aChjbSwgbGluZSkgLSAxO1xuICAgICAgbWF4Q2ggPSAoaW5jbHVkZUxpbmVCcmVhaykgPyBtYXhDaCArIDEgOiBtYXhDaDtcbiAgICAgIHZhciBjaCA9IE1hdGgubWluKE1hdGgubWF4KDAsIGN1ci5jaCksIG1heENoKTtcbiAgICAgIHJldHVybiBQb3MobGluZSwgY2gpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjb3B5QXJncyhhcmdzKSB7XG4gICAgICB2YXIgcmV0ID0ge307XG4gICAgICBmb3IgKHZhciBwcm9wIGluIGFyZ3MpIHtcbiAgICAgICAgaWYgKGFyZ3MuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICByZXRbcHJvcF0gPSBhcmdzW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBvZmZzZXRDdXJzb3IoY3VyLCBvZmZzZXRMaW5lLCBvZmZzZXRDaCkge1xuICAgICAgaWYgKHR5cGVvZiBvZmZzZXRMaW5lID09PSAnb2JqZWN0Jykge1xuICAgICAgICBvZmZzZXRDaCA9IG9mZnNldExpbmUuY2g7XG4gICAgICAgIG9mZnNldExpbmUgPSBvZmZzZXRMaW5lLmxpbmU7XG4gICAgICB9XG4gICAgICByZXR1cm4gUG9zKGN1ci5saW5lICsgb2Zmc2V0TGluZSwgY3VyLmNoICsgb2Zmc2V0Q2gpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjb21tYW5kTWF0Y2hlcyhrZXlzLCBrZXlNYXAsIGNvbnRleHQsIGlucHV0U3RhdGUpIHtcbiAgICAgIC8vIFBhcnRpYWwgbWF0Y2hlcyBhcmUgbm90IGFwcGxpZWQuIFRoZXkgaW5mb3JtIHRoZSBrZXkgaGFuZGxlclxuICAgICAgLy8gdGhhdCB0aGUgY3VycmVudCBrZXkgc2VxdWVuY2UgaXMgYSBzdWJzZXF1ZW5jZSBvZiBhIHZhbGlkIGtleVxuICAgICAgLy8gc2VxdWVuY2UsIHNvIHRoYXQgdGhlIGtleSBidWZmZXIgaXMgbm90IGNsZWFyZWQuXG4gICAgICB2YXIgbWF0Y2gsIHBhcnRpYWwgPSBbXSwgZnVsbCA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlNYXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNvbW1hbmQgPSBrZXlNYXBbaV07XG4gICAgICAgIGlmIChjb250ZXh0ID09ICdpbnNlcnQnICYmIGNvbW1hbmQuY29udGV4dCAhPSAnaW5zZXJ0JyB8fFxuICAgICAgICAgICAgY29tbWFuZC5jb250ZXh0ICYmIGNvbW1hbmQuY29udGV4dCAhPSBjb250ZXh0IHx8XG4gICAgICAgICAgICBpbnB1dFN0YXRlLm9wZXJhdG9yICYmIGNvbW1hbmQudHlwZSA9PSAnYWN0aW9uJyB8fFxuICAgICAgICAgICAgIShtYXRjaCA9IGNvbW1hbmRNYXRjaChrZXlzLCBjb21tYW5kLmtleXMpKSkgeyBjb250aW51ZTsgfVxuICAgICAgICBpZiAobWF0Y2ggPT0gJ3BhcnRpYWwnKSB7IHBhcnRpYWwucHVzaChjb21tYW5kKTsgfVxuICAgICAgICBpZiAobWF0Y2ggPT0gJ2Z1bGwnKSB7IGZ1bGwucHVzaChjb21tYW5kKTsgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcGFydGlhbDogcGFydGlhbC5sZW5ndGggJiYgcGFydGlhbCxcbiAgICAgICAgZnVsbDogZnVsbC5sZW5ndGggJiYgZnVsbFxuICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY29tbWFuZE1hdGNoKHByZXNzZWQsIG1hcHBlZCkge1xuICAgICAgaWYgKG1hcHBlZC5zbGljZSgtMTEpID09ICc8Y2hhcmFjdGVyPicpIHtcbiAgICAgICAgLy8gTGFzdCBjaGFyYWN0ZXIgbWF0Y2hlcyBhbnl0aGluZy5cbiAgICAgICAgdmFyIHByZWZpeExlbiA9IG1hcHBlZC5sZW5ndGggLSAxMTtcbiAgICAgICAgdmFyIHByZXNzZWRQcmVmaXggPSBwcmVzc2VkLnNsaWNlKDAsIHByZWZpeExlbik7XG4gICAgICAgIHZhciBtYXBwZWRQcmVmaXggPSBtYXBwZWQuc2xpY2UoMCwgcHJlZml4TGVuKTtcbiAgICAgICAgcmV0dXJuIHByZXNzZWRQcmVmaXggPT0gbWFwcGVkUHJlZml4ICYmIHByZXNzZWQubGVuZ3RoID4gcHJlZml4TGVuID8gJ2Z1bGwnIDpcbiAgICAgICAgICAgICAgIG1hcHBlZFByZWZpeC5pbmRleE9mKHByZXNzZWRQcmVmaXgpID09IDAgPyAncGFydGlhbCcgOiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwcmVzc2VkID09IG1hcHBlZCA/ICdmdWxsJyA6XG4gICAgICAgICAgICAgICBtYXBwZWQuaW5kZXhPZihwcmVzc2VkKSA9PSAwID8gJ3BhcnRpYWwnIDogZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGxhc3RDaGFyKGtleXMpIHtcbiAgICAgIHZhciBtYXRjaCA9IC9eLiooPFtePl0rPikkLy5leGVjKGtleXMpO1xuICAgICAgdmFyIHNlbGVjdGVkQ2hhcmFjdGVyID0gbWF0Y2ggPyBtYXRjaFsxXSA6IGtleXMuc2xpY2UoLTEpO1xuICAgICAgaWYgKHNlbGVjdGVkQ2hhcmFjdGVyLmxlbmd0aCA+IDEpe1xuICAgICAgICBzd2l0Y2goc2VsZWN0ZWRDaGFyYWN0ZXIpe1xuICAgICAgICAgIGNhc2UgJzxDUj4nOlxuICAgICAgICAgICAgc2VsZWN0ZWRDaGFyYWN0ZXI9J1xcbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICc8U3BhY2U+JzpcbiAgICAgICAgICAgIHNlbGVjdGVkQ2hhcmFjdGVyPScgJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBzZWxlY3RlZENoYXJhY3Rlcj0nJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZWN0ZWRDaGFyYWN0ZXI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlcGVhdEZuKGNtLCBmbiwgcmVwZWF0KSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVwZWF0OyBpKyspIHtcbiAgICAgICAgICBmbihjbSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNvcHlDdXJzb3IoY3VyKSB7XG4gICAgICByZXR1cm4gUG9zKGN1ci5saW5lLCBjdXIuY2gpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjdXJzb3JFcXVhbChjdXIxLCBjdXIyKSB7XG4gICAgICByZXR1cm4gY3VyMS5jaCA9PSBjdXIyLmNoICYmIGN1cjEubGluZSA9PSBjdXIyLmxpbmU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGN1cnNvcklzQmVmb3JlKGN1cjEsIGN1cjIpIHtcbiAgICAgIGlmIChjdXIxLmxpbmUgPCBjdXIyLmxpbmUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoY3VyMS5saW5lID09IGN1cjIubGluZSAmJiBjdXIxLmNoIDwgY3VyMi5jaCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY3Vyc29yTWluKGN1cjEsIGN1cjIpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMikge1xuICAgICAgICBjdXIyID0gY3Vyc29yTWluLmFwcGx5KHVuZGVmaW5lZCwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY3Vyc29ySXNCZWZvcmUoY3VyMSwgY3VyMikgPyBjdXIxIDogY3VyMjtcbiAgICB9XG4gICAgZnVuY3Rpb24gY3Vyc29yTWF4KGN1cjEsIGN1cjIpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMikge1xuICAgICAgICBjdXIyID0gY3Vyc29yTWF4LmFwcGx5KHVuZGVmaW5lZCwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY3Vyc29ySXNCZWZvcmUoY3VyMSwgY3VyMikgPyBjdXIyIDogY3VyMTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY3Vyc29ySXNCZXR3ZWVuKGN1cjEsIGN1cjIsIGN1cjMpIHtcbiAgICAgIC8vIHJldHVybnMgdHJ1ZSBpZiBjdXIyIGlzIGJldHdlZW4gY3VyMSBhbmQgY3VyMy5cbiAgICAgIHZhciBjdXIxYmVmb3JlMiA9IGN1cnNvcklzQmVmb3JlKGN1cjEsIGN1cjIpO1xuICAgICAgdmFyIGN1cjJiZWZvcmUzID0gY3Vyc29ySXNCZWZvcmUoY3VyMiwgY3VyMyk7XG4gICAgICByZXR1cm4gY3VyMWJlZm9yZTIgJiYgY3VyMmJlZm9yZTM7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGxpbmVMZW5ndGgoY20sIGxpbmVOdW0pIHtcbiAgICAgIHJldHVybiBjbS5nZXRMaW5lKGxpbmVOdW0pLmxlbmd0aDtcbiAgICB9XG4gICAgZnVuY3Rpb24gdHJpbShzKSB7XG4gICAgICBpZiAocy50cmltKSB7XG4gICAgICAgIHJldHVybiBzLnRyaW0oKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZXNjYXBlUmVnZXgocykge1xuICAgICAgcmV0dXJuIHMucmVwbGFjZSgvKFsuPyorJFxcW1xcXVxcL1xcXFwoKXt9fFxcLV0pL2csICdcXFxcJDEnKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZXh0ZW5kTGluZVRvQ29sdW1uKGNtLCBsaW5lTnVtLCBjb2x1bW4pIHtcbiAgICAgIHZhciBlbmRDaCA9IGxpbmVMZW5ndGgoY20sIGxpbmVOdW0pO1xuICAgICAgdmFyIHNwYWNlcyA9IG5ldyBBcnJheShjb2x1bW4tZW5kQ2grMSkuam9pbignICcpO1xuICAgICAgY20uc2V0Q3Vyc29yKFBvcyhsaW5lTnVtLCBlbmRDaCkpO1xuICAgICAgY20ucmVwbGFjZVJhbmdlKHNwYWNlcywgY20uZ2V0Q3Vyc29yKCkpO1xuICAgIH1cbiAgICAvLyBUaGlzIGZ1bmN0aW9ucyBzZWxlY3RzIGEgcmVjdGFuZ3VsYXIgYmxvY2tcbiAgICAvLyBvZiB0ZXh0IHdpdGggc2VsZWN0aW9uRW5kIGFzIGFueSBvZiBpdHMgY29ybmVyXG4gICAgLy8gSGVpZ2h0IG9mIGJsb2NrOlxuICAgIC8vIERpZmZlcmVuY2UgaW4gc2VsZWN0aW9uRW5kLmxpbmUgYW5kIGZpcnN0L2xhc3Qgc2VsZWN0aW9uLmxpbmVcbiAgICAvLyBXaWR0aCBvZiB0aGUgYmxvY2s6XG4gICAgLy8gRGlzdGFuY2UgYmV0d2VlbiBzZWxlY3Rpb25FbmQuY2ggYW5kIGFueShmaXJzdCBjb25zaWRlcmVkIGhlcmUpIHNlbGVjdGlvbi5jaFxuICAgIGZ1bmN0aW9uIHNlbGVjdEJsb2NrKGNtLCBzZWxlY3Rpb25FbmQpIHtcbiAgICAgIHZhciBzZWxlY3Rpb25zID0gW10sIHJhbmdlcyA9IGNtLmxpc3RTZWxlY3Rpb25zKCk7XG4gICAgICB2YXIgaGVhZCA9IGNvcHlDdXJzb3IoY20uY2xpcFBvcyhzZWxlY3Rpb25FbmQpKTtcbiAgICAgIHZhciBpc0NsaXBwZWQgPSAhY3Vyc29yRXF1YWwoc2VsZWN0aW9uRW5kLCBoZWFkKTtcbiAgICAgIHZhciBjdXJIZWFkID0gY20uZ2V0Q3Vyc29yKCdoZWFkJyk7XG4gICAgICB2YXIgcHJpbUluZGV4ID0gZ2V0SW5kZXgocmFuZ2VzLCBjdXJIZWFkKTtcbiAgICAgIHZhciB3YXNDbGlwcGVkID0gY3Vyc29yRXF1YWwocmFuZ2VzW3ByaW1JbmRleF0uaGVhZCwgcmFuZ2VzW3ByaW1JbmRleF0uYW5jaG9yKTtcbiAgICAgIHZhciBtYXggPSByYW5nZXMubGVuZ3RoIC0gMTtcbiAgICAgIHZhciBpbmRleCA9IG1heCAtIHByaW1JbmRleCA+IHByaW1JbmRleCA/IG1heCA6IDA7XG4gICAgICB2YXIgYmFzZSA9IHJhbmdlc1tpbmRleF0uYW5jaG9yO1xuXG4gICAgICB2YXIgZmlyc3RMaW5lID0gTWF0aC5taW4oYmFzZS5saW5lLCBoZWFkLmxpbmUpO1xuICAgICAgdmFyIGxhc3RMaW5lID0gTWF0aC5tYXgoYmFzZS5saW5lLCBoZWFkLmxpbmUpO1xuICAgICAgdmFyIGJhc2VDaCA9IGJhc2UuY2gsIGhlYWRDaCA9IGhlYWQuY2g7XG5cbiAgICAgIHZhciBkaXIgPSByYW5nZXNbaW5kZXhdLmhlYWQuY2ggLSBiYXNlQ2g7XG4gICAgICB2YXIgbmV3RGlyID0gaGVhZENoIC0gYmFzZUNoO1xuICAgICAgaWYgKGRpciA+IDAgJiYgbmV3RGlyIDw9IDApIHtcbiAgICAgICAgYmFzZUNoKys7XG4gICAgICAgIGlmICghaXNDbGlwcGVkKSB7IGhlYWRDaC0tOyB9XG4gICAgICB9IGVsc2UgaWYgKGRpciA8IDAgJiYgbmV3RGlyID49IDApIHtcbiAgICAgICAgYmFzZUNoLS07XG4gICAgICAgIGlmICghd2FzQ2xpcHBlZCkgeyBoZWFkQ2grKzsgfVxuICAgICAgfSBlbHNlIGlmIChkaXIgPCAwICYmIG5ld0RpciA9PSAtMSkge1xuICAgICAgICBiYXNlQ2gtLTtcbiAgICAgICAgaGVhZENoKys7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBsaW5lID0gZmlyc3RMaW5lOyBsaW5lIDw9IGxhc3RMaW5lOyBsaW5lKyspIHtcbiAgICAgICAgdmFyIHJhbmdlID0ge2FuY2hvcjogbmV3IFBvcyhsaW5lLCBiYXNlQ2gpLCBoZWFkOiBuZXcgUG9zKGxpbmUsIGhlYWRDaCl9O1xuICAgICAgICBzZWxlY3Rpb25zLnB1c2gocmFuZ2UpO1xuICAgICAgfVxuICAgICAgY20uc2V0U2VsZWN0aW9ucyhzZWxlY3Rpb25zKTtcbiAgICAgIHNlbGVjdGlvbkVuZC5jaCA9IGhlYWRDaDtcbiAgICAgIGJhc2UuY2ggPSBiYXNlQ2g7XG4gICAgICByZXR1cm4gYmFzZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2VsZWN0Rm9ySW5zZXJ0KGNtLCBoZWFkLCBoZWlnaHQpIHtcbiAgICAgIHZhciBzZWwgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGVpZ2h0OyBpKyspIHtcbiAgICAgICAgdmFyIGxpbmVIZWFkID0gb2Zmc2V0Q3Vyc29yKGhlYWQsIGksIDApO1xuICAgICAgICBzZWwucHVzaCh7YW5jaG9yOiBsaW5lSGVhZCwgaGVhZDogbGluZUhlYWR9KTtcbiAgICAgIH1cbiAgICAgIGNtLnNldFNlbGVjdGlvbnMoc2VsLCAwKTtcbiAgICB9XG4gICAgLy8gZ2V0SW5kZXggcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGN1cnNvciBpbiB0aGUgc2VsZWN0aW9ucy5cbiAgICBmdW5jdGlvbiBnZXRJbmRleChyYW5nZXMsIGN1cnNvciwgZW5kKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYXRBbmNob3IgPSBlbmQgIT0gJ2hlYWQnICYmIGN1cnNvckVxdWFsKHJhbmdlc1tpXS5hbmNob3IsIGN1cnNvcik7XG4gICAgICAgIHZhciBhdEhlYWQgPSBlbmQgIT0gJ2FuY2hvcicgJiYgY3Vyc29yRXF1YWwocmFuZ2VzW2ldLmhlYWQsIGN1cnNvcik7XG4gICAgICAgIGlmIChhdEFuY2hvciB8fCBhdEhlYWQpIHtcbiAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRTZWxlY3RlZEFyZWFSYW5nZShjbSwgdmltKSB7XG4gICAgICB2YXIgbGFzdFNlbGVjdGlvbiA9IHZpbS5sYXN0U2VsZWN0aW9uO1xuICAgICAgdmFyIGdldEN1cnJlbnRTZWxlY3RlZEFyZWFSYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZWN0aW9ucyA9IGNtLmxpc3RTZWxlY3Rpb25zKCk7XG4gICAgICAgIHZhciBzdGFydCA9ICBzZWxlY3Rpb25zWzBdO1xuICAgICAgICB2YXIgZW5kID0gc2VsZWN0aW9uc1tzZWxlY3Rpb25zLmxlbmd0aC0xXTtcbiAgICAgICAgdmFyIHNlbGVjdGlvblN0YXJ0ID0gY3Vyc29ySXNCZWZvcmUoc3RhcnQuYW5jaG9yLCBzdGFydC5oZWFkKSA/IHN0YXJ0LmFuY2hvciA6IHN0YXJ0LmhlYWQ7XG4gICAgICAgIHZhciBzZWxlY3Rpb25FbmQgPSBjdXJzb3JJc0JlZm9yZShlbmQuYW5jaG9yLCBlbmQuaGVhZCkgPyBlbmQuaGVhZCA6IGVuZC5hbmNob3I7XG4gICAgICAgIHJldHVybiBbc2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZF07XG4gICAgICB9O1xuICAgICAgdmFyIGdldExhc3RTZWxlY3RlZEFyZWFSYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZWN0aW9uU3RhcnQgPSBjbS5nZXRDdXJzb3IoKTtcbiAgICAgICAgdmFyIHNlbGVjdGlvbkVuZCA9IGNtLmdldEN1cnNvcigpO1xuICAgICAgICB2YXIgYmxvY2sgPSBsYXN0U2VsZWN0aW9uLnZpc3VhbEJsb2NrO1xuICAgICAgICBpZiAoYmxvY2spIHtcbiAgICAgICAgICB2YXIgd2lkdGggPSBibG9jay53aWR0aDtcbiAgICAgICAgICB2YXIgaGVpZ2h0ID0gYmxvY2suaGVpZ2h0O1xuICAgICAgICAgIHNlbGVjdGlvbkVuZCA9IFBvcyhzZWxlY3Rpb25TdGFydC5saW5lICsgaGVpZ2h0LCBzZWxlY3Rpb25TdGFydC5jaCArIHdpZHRoKTtcbiAgICAgICAgICB2YXIgc2VsZWN0aW9ucyA9IFtdO1xuICAgICAgICAgIC8vIHNlbGVjdEJsb2NrIGNyZWF0ZXMgYSAncHJvcGVyJyByZWN0YW5ndWxhciBibG9jay5cbiAgICAgICAgICAvLyBXZSBkbyBub3Qgd2FudCB0aGF0IGluIGFsbCBjYXNlcywgc28gd2UgbWFudWFsbHkgc2V0IHNlbGVjdGlvbnMuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IHNlbGVjdGlvblN0YXJ0LmxpbmU7IGkgPCBzZWxlY3Rpb25FbmQubGluZTsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYW5jaG9yID0gUG9zKGksIHNlbGVjdGlvblN0YXJ0LmNoKTtcbiAgICAgICAgICAgIHZhciBoZWFkID0gUG9zKGksIHNlbGVjdGlvbkVuZC5jaCk7XG4gICAgICAgICAgICB2YXIgcmFuZ2UgPSB7YW5jaG9yOiBhbmNob3IsIGhlYWQ6IGhlYWR9O1xuICAgICAgICAgICAgc2VsZWN0aW9ucy5wdXNoKHJhbmdlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY20uc2V0U2VsZWN0aW9ucyhzZWxlY3Rpb25zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgc3RhcnQgPSBsYXN0U2VsZWN0aW9uLmFuY2hvck1hcmsuZmluZCgpO1xuICAgICAgICAgIHZhciBlbmQgPSBsYXN0U2VsZWN0aW9uLmhlYWRNYXJrLmZpbmQoKTtcbiAgICAgICAgICB2YXIgbGluZSA9IGVuZC5saW5lIC0gc3RhcnQubGluZTtcbiAgICAgICAgICB2YXIgY2ggPSBlbmQuY2ggLSBzdGFydC5jaDtcbiAgICAgICAgICBzZWxlY3Rpb25FbmQgPSB7bGluZTogc2VsZWN0aW9uRW5kLmxpbmUgKyBsaW5lLCBjaDogbGluZSA/IHNlbGVjdGlvbkVuZC5jaCA6IGNoICsgc2VsZWN0aW9uRW5kLmNofTtcbiAgICAgICAgICBpZiAobGFzdFNlbGVjdGlvbi52aXN1YWxMaW5lKSB7XG4gICAgICAgICAgICBzZWxlY3Rpb25TdGFydCA9IFBvcyhzZWxlY3Rpb25TdGFydC5saW5lLCAwKTtcbiAgICAgICAgICAgIHNlbGVjdGlvbkVuZCA9IFBvcyhzZWxlY3Rpb25FbmQubGluZSwgbGluZUxlbmd0aChjbSwgc2VsZWN0aW9uRW5kLmxpbmUpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY20uc2V0U2VsZWN0aW9uKHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbc2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZF07XG4gICAgICB9O1xuICAgICAgaWYgKCF2aW0udmlzdWFsTW9kZSkge1xuICAgICAgLy8gSW4gY2FzZSBvZiByZXBsYXlpbmcgdGhlIGFjdGlvbi5cbiAgICAgICAgcmV0dXJuIGdldExhc3RTZWxlY3RlZEFyZWFSYW5nZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGdldEN1cnJlbnRTZWxlY3RlZEFyZWFSYW5nZSgpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBVcGRhdGVzIHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gd2l0aCB0aGUgY3VycmVudCBzZWxlY3Rpb24ncyB2YWx1ZXMuIFRoaXNcbiAgICAvLyBzaG91bGQgb25seSBiZSBjYWxsZWQgaW4gdmlzdWFsIG1vZGUuXG4gICAgZnVuY3Rpb24gdXBkYXRlTGFzdFNlbGVjdGlvbihjbSwgdmltKSB7XG4gICAgICB2YXIgYW5jaG9yID0gdmltLnNlbC5hbmNob3I7XG4gICAgICB2YXIgaGVhZCA9IHZpbS5zZWwuaGVhZDtcbiAgICAgIC8vIFRvIGFjY29tbW9kYXRlIHRoZSBlZmZlY3Qgb2YgbGFzdFBhc3RlZFRleHQgaW4gdGhlIGxhc3Qgc2VsZWN0aW9uXG4gICAgICBpZiAodmltLmxhc3RQYXN0ZWRUZXh0KSB7XG4gICAgICAgIGhlYWQgPSBjbS5wb3NGcm9tSW5kZXgoY20uaW5kZXhGcm9tUG9zKGFuY2hvcikgKyB2aW0ubGFzdFBhc3RlZFRleHQubGVuZ3RoKTtcbiAgICAgICAgdmltLmxhc3RQYXN0ZWRUZXh0ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHZpbS5sYXN0U2VsZWN0aW9uID0geydhbmNob3JNYXJrJzogY20uc2V0Qm9va21hcmsoYW5jaG9yKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWFkTWFyayc6IGNtLnNldEJvb2ttYXJrKGhlYWQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FuY2hvcic6IGNvcHlDdXJzb3IoYW5jaG9yKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWFkJzogY29weUN1cnNvcihoZWFkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICd2aXN1YWxNb2RlJzogdmltLnZpc3VhbE1vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAndmlzdWFsTGluZSc6IHZpbS52aXN1YWxMaW5lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Zpc3VhbEJsb2NrJzogdmltLnZpc3VhbEJsb2NrfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZXhwYW5kU2VsZWN0aW9uKGNtLCBzdGFydCwgZW5kKSB7XG4gICAgICB2YXIgc2VsID0gY20uc3RhdGUudmltLnNlbDtcbiAgICAgIHZhciBoZWFkID0gc2VsLmhlYWQ7XG4gICAgICB2YXIgYW5jaG9yID0gc2VsLmFuY2hvcjtcbiAgICAgIHZhciB0bXA7XG4gICAgICBpZiAoY3Vyc29ySXNCZWZvcmUoZW5kLCBzdGFydCkpIHtcbiAgICAgICAgdG1wID0gZW5kO1xuICAgICAgICBlbmQgPSBzdGFydDtcbiAgICAgICAgc3RhcnQgPSB0bXA7XG4gICAgICB9XG4gICAgICBpZiAoY3Vyc29ySXNCZWZvcmUoaGVhZCwgYW5jaG9yKSkge1xuICAgICAgICBoZWFkID0gY3Vyc29yTWluKHN0YXJ0LCBoZWFkKTtcbiAgICAgICAgYW5jaG9yID0gY3Vyc29yTWF4KGFuY2hvciwgZW5kKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFuY2hvciA9IGN1cnNvck1pbihzdGFydCwgYW5jaG9yKTtcbiAgICAgICAgaGVhZCA9IGN1cnNvck1heChoZWFkLCBlbmQpO1xuICAgICAgICBoZWFkID0gb2Zmc2V0Q3Vyc29yKGhlYWQsIDAsIC0xKTtcbiAgICAgICAgaWYgKGhlYWQuY2ggPT0gLTEgJiYgaGVhZC5saW5lICE9IGNtLmZpcnN0TGluZSgpKSB7XG4gICAgICAgICAgaGVhZCA9IFBvcyhoZWFkLmxpbmUgLSAxLCBsaW5lTGVuZ3RoKGNtLCBoZWFkLmxpbmUgLSAxKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBbYW5jaG9yLCBoZWFkXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgQ29kZU1pcnJvciBzZWxlY3Rpb24gdG8gbWF0Y2ggdGhlIHByb3ZpZGVkIHZpbSBzZWxlY3Rpb24uXG4gICAgICogSWYgbm8gYXJndW1lbnRzIGFyZSBnaXZlbiwgaXQgdXNlcyB0aGUgY3VycmVudCB2aW0gc2VsZWN0aW9uIHN0YXRlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVwZGF0ZUNtU2VsZWN0aW9uKGNtLCBzZWwsIG1vZGUpIHtcbiAgICAgIHZhciB2aW0gPSBjbS5zdGF0ZS52aW07XG4gICAgICBzZWwgPSBzZWwgfHwgdmltLnNlbDtcbiAgICAgIHZhciBtb2RlID0gbW9kZSB8fFxuICAgICAgICB2aW0udmlzdWFsTGluZSA/ICdsaW5lJyA6IHZpbS52aXN1YWxCbG9jayA/ICdibG9jaycgOiAnY2hhcic7XG4gICAgICB2YXIgY21TZWwgPSBtYWtlQ21TZWxlY3Rpb24oY20sIHNlbCwgbW9kZSk7XG4gICAgICBjbS5zZXRTZWxlY3Rpb25zKGNtU2VsLnJhbmdlcywgY21TZWwucHJpbWFyeSk7XG4gICAgICB1cGRhdGVGYWtlQ3Vyc29yKGNtKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gbWFrZUNtU2VsZWN0aW9uKGNtLCBzZWwsIG1vZGUsIGV4Y2x1c2l2ZSkge1xuICAgICAgdmFyIGhlYWQgPSBjb3B5Q3Vyc29yKHNlbC5oZWFkKTtcbiAgICAgIHZhciBhbmNob3IgPSBjb3B5Q3Vyc29yKHNlbC5hbmNob3IpO1xuICAgICAgaWYgKG1vZGUgPT0gJ2NoYXInKSB7XG4gICAgICAgIHZhciBoZWFkT2Zmc2V0ID0gIWV4Y2x1c2l2ZSAmJiAhY3Vyc29ySXNCZWZvcmUoc2VsLmhlYWQsIHNlbC5hbmNob3IpID8gMSA6IDA7XG4gICAgICAgIHZhciBhbmNob3JPZmZzZXQgPSBjdXJzb3JJc0JlZm9yZShzZWwuaGVhZCwgc2VsLmFuY2hvcikgPyAxIDogMDtcbiAgICAgICAgaGVhZCA9IG9mZnNldEN1cnNvcihzZWwuaGVhZCwgMCwgaGVhZE9mZnNldCk7XG4gICAgICAgIGFuY2hvciA9IG9mZnNldEN1cnNvcihzZWwuYW5jaG9yLCAwLCBhbmNob3JPZmZzZXQpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJhbmdlczogW3thbmNob3I6IGFuY2hvciwgaGVhZDogaGVhZH1dLFxuICAgICAgICAgIHByaW1hcnk6IDBcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSBpZiAobW9kZSA9PSAnbGluZScpIHtcbiAgICAgICAgaWYgKCFjdXJzb3JJc0JlZm9yZShzZWwuaGVhZCwgc2VsLmFuY2hvcikpIHtcbiAgICAgICAgICBhbmNob3IuY2ggPSAwO1xuXG4gICAgICAgICAgdmFyIGxhc3RMaW5lID0gY20ubGFzdExpbmUoKTtcbiAgICAgICAgICBpZiAoaGVhZC5saW5lID4gbGFzdExpbmUpIHtcbiAgICAgICAgICAgIGhlYWQubGluZSA9IGxhc3RMaW5lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBoZWFkLmNoID0gbGluZUxlbmd0aChjbSwgaGVhZC5saW5lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBoZWFkLmNoID0gMDtcbiAgICAgICAgICBhbmNob3IuY2ggPSBsaW5lTGVuZ3RoKGNtLCBhbmNob3IubGluZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByYW5nZXM6IFt7YW5jaG9yOiBhbmNob3IsIGhlYWQ6IGhlYWR9XSxcbiAgICAgICAgICBwcmltYXJ5OiAwXG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKG1vZGUgPT0gJ2Jsb2NrJykge1xuICAgICAgICB2YXIgdG9wID0gTWF0aC5taW4oYW5jaG9yLmxpbmUsIGhlYWQubGluZSksXG4gICAgICAgICAgICBsZWZ0ID0gTWF0aC5taW4oYW5jaG9yLmNoLCBoZWFkLmNoKSxcbiAgICAgICAgICAgIGJvdHRvbSA9IE1hdGgubWF4KGFuY2hvci5saW5lLCBoZWFkLmxpbmUpLFxuICAgICAgICAgICAgcmlnaHQgPSBNYXRoLm1heChhbmNob3IuY2gsIGhlYWQuY2gpICsgMTtcbiAgICAgICAgdmFyIGhlaWdodCA9IGJvdHRvbSAtIHRvcCArIDE7XG4gICAgICAgIHZhciBwcmltYXJ5ID0gaGVhZC5saW5lID09IHRvcCA/IDAgOiBoZWlnaHQgLSAxO1xuICAgICAgICB2YXIgcmFuZ2VzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGVpZ2h0OyBpKyspIHtcbiAgICAgICAgICByYW5nZXMucHVzaCh7XG4gICAgICAgICAgICBhbmNob3I6IFBvcyh0b3AgKyBpLCBsZWZ0KSxcbiAgICAgICAgICAgIGhlYWQ6IFBvcyh0b3AgKyBpLCByaWdodClcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJhbmdlczogcmFuZ2VzLFxuICAgICAgICAgIHByaW1hcnk6IHByaW1hcnlcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0SGVhZChjbSkge1xuICAgICAgdmFyIGN1ciA9IGNtLmdldEN1cnNvcignaGVhZCcpO1xuICAgICAgaWYgKGNtLmdldFNlbGVjdGlvbigpLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgIC8vIFNtYWxsIGNvcm5lciBjYXNlIHdoZW4gb25seSAxIGNoYXJhY3RlciBpcyBzZWxlY3RlZC4gVGhlIFwicmVhbFwiXG4gICAgICAgIC8vIGhlYWQgaXMgdGhlIGxlZnQgb2YgaGVhZCBhbmQgYW5jaG9yLlxuICAgICAgICBjdXIgPSBjdXJzb3JNaW4oY3VyLCBjbS5nZXRDdXJzb3IoJ2FuY2hvcicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgbW92ZUhlYWQgaXMgc2V0IHRvIGZhbHNlLCB0aGUgQ29kZU1pcnJvciBzZWxlY3Rpb24gd2lsbCBub3QgYmVcbiAgICAgKiB0b3VjaGVkLiBUaGUgY2FsbGVyIGFzc3VtZXMgdGhlIHJlc3BvbnNpYmlsaXR5IG9mIHB1dHRpbmcgdGhlIGN1cnNvclxuICAgICogaW4gdGhlIHJpZ2h0IHBsYWNlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGV4aXRWaXN1YWxNb2RlKGNtLCBtb3ZlSGVhZCkge1xuICAgICAgdmFyIHZpbSA9IGNtLnN0YXRlLnZpbTtcbiAgICAgIGlmIChtb3ZlSGVhZCAhPT0gZmFsc2UpIHtcbiAgICAgICAgY20uc2V0Q3Vyc29yKGNsaXBDdXJzb3JUb0NvbnRlbnQoY20sIHZpbS5zZWwuaGVhZCkpO1xuICAgICAgfVxuICAgICAgdXBkYXRlTGFzdFNlbGVjdGlvbihjbSwgdmltKTtcbiAgICAgIHZpbS52aXN1YWxNb2RlID0gZmFsc2U7XG4gICAgICB2aW0udmlzdWFsTGluZSA9IGZhbHNlO1xuICAgICAgdmltLnZpc3VhbEJsb2NrID0gZmFsc2U7XG4gICAgICBDb2RlTWlycm9yLnNpZ25hbChjbSwgXCJ2aW0tbW9kZS1jaGFuZ2VcIiwge21vZGU6IFwibm9ybWFsXCJ9KTtcbiAgICAgIGlmICh2aW0uZmFrZUN1cnNvcikge1xuICAgICAgICB2aW0uZmFrZUN1cnNvci5jbGVhcigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSBhbnkgdHJhaWxpbmcgbmV3bGluZXMgZnJvbSB0aGUgc2VsZWN0aW9uLiBGb3JcbiAgICAvLyBleGFtcGxlLCB3aXRoIHRoZSBjYXJldCBhdCB0aGUgc3RhcnQgb2YgdGhlIGxhc3Qgd29yZCBvbiB0aGUgbGluZSxcbiAgICAvLyAnZHcnIHNob3VsZCB3b3JkLCBidXQgbm90IHRoZSBuZXdsaW5lLCB3aGlsZSAndycgc2hvdWxkIGFkdmFuY2UgdGhlXG4gICAgLy8gY2FyZXQgdG8gdGhlIGZpcnN0IGNoYXJhY3RlciBvZiB0aGUgbmV4dCBsaW5lLlxuICAgIGZ1bmN0aW9uIGNsaXBUb0xpbmUoY20sIGN1clN0YXJ0LCBjdXJFbmQpIHtcbiAgICAgIHZhciBzZWxlY3Rpb24gPSBjbS5nZXRSYW5nZShjdXJTdGFydCwgY3VyRW5kKTtcbiAgICAgIC8vIE9ubHkgY2xpcCBpZiB0aGUgc2VsZWN0aW9uIGVuZHMgd2l0aCB0cmFpbGluZyBuZXdsaW5lICsgd2hpdGVzcGFjZVxuICAgICAgaWYgKC9cXG5cXHMqJC8udGVzdChzZWxlY3Rpb24pKSB7XG4gICAgICAgIHZhciBsaW5lcyA9IHNlbGVjdGlvbi5zcGxpdCgnXFxuJyk7XG4gICAgICAgIC8vIFdlIGtub3cgdGhpcyBpcyBhbGwgd2hpdGVzcGFjZS5cbiAgICAgICAgbGluZXMucG9wKCk7XG5cbiAgICAgICAgLy8gQ2FzZXM6XG4gICAgICAgIC8vIDEuIExhc3Qgd29yZCBpcyBhbiBlbXB0eSBsaW5lIC0gZG8gbm90IGNsaXAgdGhlIHRyYWlsaW5nICdcXG4nXG4gICAgICAgIC8vIDIuIExhc3Qgd29yZCBpcyBub3QgYW4gZW1wdHkgbGluZSAtIGNsaXAgdGhlIHRyYWlsaW5nICdcXG4nXG4gICAgICAgIHZhciBsaW5lO1xuICAgICAgICAvLyBGaW5kIHRoZSBsaW5lIGNvbnRhaW5pbmcgdGhlIGxhc3Qgd29yZCwgYW5kIGNsaXAgYWxsIHdoaXRlc3BhY2UgdXBcbiAgICAgICAgLy8gdG8gaXQuXG4gICAgICAgIGZvciAodmFyIGxpbmUgPSBsaW5lcy5wb3AoKTsgbGluZXMubGVuZ3RoID4gMCAmJiBsaW5lICYmIGlzV2hpdGVTcGFjZVN0cmluZyhsaW5lKTsgbGluZSA9IGxpbmVzLnBvcCgpKSB7XG4gICAgICAgICAgY3VyRW5kLmxpbmUtLTtcbiAgICAgICAgICBjdXJFbmQuY2ggPSAwO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIHRoZSBsYXN0IHdvcmQgaXMgbm90IGFuIGVtcHR5IGxpbmUsIGNsaXAgYW4gYWRkaXRpb25hbCBuZXdsaW5lXG4gICAgICAgIGlmIChsaW5lKSB7XG4gICAgICAgICAgY3VyRW5kLmxpbmUtLTtcbiAgICAgICAgICBjdXJFbmQuY2ggPSBsaW5lTGVuZ3RoKGNtLCBjdXJFbmQubGluZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3VyRW5kLmNoID0gMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEV4cGFuZCB0aGUgc2VsZWN0aW9uIHRvIGxpbmUgZW5kcy5cbiAgICBmdW5jdGlvbiBleHBhbmRTZWxlY3Rpb25Ub0xpbmUoX2NtLCBjdXJTdGFydCwgY3VyRW5kKSB7XG4gICAgICBjdXJTdGFydC5jaCA9IDA7XG4gICAgICBjdXJFbmQuY2ggPSAwO1xuICAgICAgY3VyRW5kLmxpbmUrKztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5kRmlyc3ROb25XaGl0ZVNwYWNlQ2hhcmFjdGVyKHRleHQpIHtcbiAgICAgIGlmICghdGV4dCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICAgIHZhciBmaXJzdE5vbldTID0gdGV4dC5zZWFyY2goL1xcUy8pO1xuICAgICAgcmV0dXJuIGZpcnN0Tm9uV1MgPT0gLTEgPyB0ZXh0Lmxlbmd0aCA6IGZpcnN0Tm9uV1M7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXhwYW5kV29yZFVuZGVyQ3Vyc29yKGNtLCBpbmNsdXNpdmUsIF9mb3J3YXJkLCBiaWdXb3JkLCBub1N5bWJvbCkge1xuICAgICAgdmFyIGN1ciA9IGdldEhlYWQoY20pO1xuICAgICAgdmFyIGxpbmUgPSBjbS5nZXRMaW5lKGN1ci5saW5lKTtcbiAgICAgIHZhciBpZHggPSBjdXIuY2g7XG5cbiAgICAgIC8vIFNlZWsgdG8gZmlyc3Qgd29yZCBvciBub24td2hpdGVzcGFjZSBjaGFyYWN0ZXIsIGRlcGVuZGluZyBvbiBpZlxuICAgICAgLy8gbm9TeW1ib2wgaXMgdHJ1ZS5cbiAgICAgIHZhciB0ZXN0ID0gbm9TeW1ib2wgPyB3b3JkQ2hhclRlc3RbMF0gOiBiaWdXb3JkQ2hhclRlc3QgWzBdO1xuICAgICAgd2hpbGUgKCF0ZXN0KGxpbmUuY2hhckF0KGlkeCkpKSB7XG4gICAgICAgIGlkeCsrO1xuICAgICAgICBpZiAoaWR4ID49IGxpbmUubGVuZ3RoKSB7IHJldHVybiBudWxsOyB9XG4gICAgICB9XG5cbiAgICAgIGlmIChiaWdXb3JkKSB7XG4gICAgICAgIHRlc3QgPSBiaWdXb3JkQ2hhclRlc3RbMF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXN0ID0gd29yZENoYXJUZXN0WzBdO1xuICAgICAgICBpZiAoIXRlc3QobGluZS5jaGFyQXQoaWR4KSkpIHtcbiAgICAgICAgICB0ZXN0ID0gd29yZENoYXJUZXN0WzFdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBlbmQgPSBpZHgsIHN0YXJ0ID0gaWR4O1xuICAgICAgd2hpbGUgKHRlc3QobGluZS5jaGFyQXQoZW5kKSkgJiYgZW5kIDwgbGluZS5sZW5ndGgpIHsgZW5kKys7IH1cbiAgICAgIHdoaWxlICh0ZXN0KGxpbmUuY2hhckF0KHN0YXJ0KSkgJiYgc3RhcnQgPj0gMCkgeyBzdGFydC0tOyB9XG4gICAgICBzdGFydCsrO1xuXG4gICAgICBpZiAoaW5jbHVzaXZlKSB7XG4gICAgICAgIC8vIElmIHByZXNlbnQsIGluY2x1ZGUgYWxsIHdoaXRlc3BhY2UgYWZ0ZXIgd29yZC5cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBpbmNsdWRlIGFsbCB3aGl0ZXNwYWNlIGJlZm9yZSB3b3JkLCBleGNlcHQgaW5kZW50YXRpb24uXG4gICAgICAgIHZhciB3b3JkRW5kID0gZW5kO1xuICAgICAgICB3aGlsZSAoL1xccy8udGVzdChsaW5lLmNoYXJBdChlbmQpKSAmJiBlbmQgPCBsaW5lLmxlbmd0aCkgeyBlbmQrKzsgfVxuICAgICAgICBpZiAod29yZEVuZCA9PSBlbmQpIHtcbiAgICAgICAgICB2YXIgd29yZFN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgICAgd2hpbGUgKC9cXHMvLnRlc3QobGluZS5jaGFyQXQoc3RhcnQgLSAxKSkgJiYgc3RhcnQgPiAwKSB7IHN0YXJ0LS07IH1cbiAgICAgICAgICBpZiAoIXN0YXJ0KSB7IHN0YXJ0ID0gd29yZFN0YXJ0OyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7IHN0YXJ0OiBQb3MoY3VyLmxpbmUsIHN0YXJ0KSwgZW5kOiBQb3MoY3VyLmxpbmUsIGVuZCkgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWNvcmRKdW1wUG9zaXRpb24oY20sIG9sZEN1ciwgbmV3Q3VyKSB7XG4gICAgICBpZiAoIWN1cnNvckVxdWFsKG9sZEN1ciwgbmV3Q3VyKSkge1xuICAgICAgICB2aW1HbG9iYWxTdGF0ZS5qdW1wTGlzdC5hZGQoY20sIG9sZEN1ciwgbmV3Q3VyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWNvcmRMYXN0Q2hhcmFjdGVyU2VhcmNoKGluY3JlbWVudCwgYXJncykge1xuICAgICAgICB2aW1HbG9iYWxTdGF0ZS5sYXN0Q2hhcmFjdGVyU2VhcmNoLmluY3JlbWVudCA9IGluY3JlbWVudDtcbiAgICAgICAgdmltR2xvYmFsU3RhdGUubGFzdENoYXJhY3RlclNlYXJjaC5mb3J3YXJkID0gYXJncy5mb3J3YXJkO1xuICAgICAgICB2aW1HbG9iYWxTdGF0ZS5sYXN0Q2hhcmFjdGVyU2VhcmNoLnNlbGVjdGVkQ2hhcmFjdGVyID0gYXJncy5zZWxlY3RlZENoYXJhY3RlcjtcbiAgICB9XG5cbiAgICB2YXIgc3ltYm9sVG9Nb2RlID0ge1xuICAgICAgICAnKCc6ICdicmFja2V0JywgJyknOiAnYnJhY2tldCcsICd7JzogJ2JyYWNrZXQnLCAnfSc6ICdicmFja2V0JyxcbiAgICAgICAgJ1snOiAnc2VjdGlvbicsICddJzogJ3NlY3Rpb24nLFxuICAgICAgICAnKic6ICdjb21tZW50JywgJy8nOiAnY29tbWVudCcsXG4gICAgICAgICdtJzogJ21ldGhvZCcsICdNJzogJ21ldGhvZCcsXG4gICAgICAgICcjJzogJ3ByZXByb2Nlc3MnXG4gICAgfTtcbiAgICB2YXIgZmluZFN5bWJvbE1vZGVzID0ge1xuICAgICAgYnJhY2tldDoge1xuICAgICAgICBpc0NvbXBsZXRlOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgICAgIGlmIChzdGF0ZS5uZXh0Q2ggPT09IHN0YXRlLnN5bWIpIHtcbiAgICAgICAgICAgIHN0YXRlLmRlcHRoKys7XG4gICAgICAgICAgICBpZiAoc3RhdGUuZGVwdGggPj0gMSlyZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRlLm5leHRDaCA9PT0gc3RhdGUucmV2ZXJzZVN5bWIpIHtcbiAgICAgICAgICAgIHN0YXRlLmRlcHRoLS07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHNlY3Rpb246IHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgICBzdGF0ZS5jdXJNb3ZlVGhyb3VnaCA9IHRydWU7XG4gICAgICAgICAgc3RhdGUuc3ltYiA9IChzdGF0ZS5mb3J3YXJkID8gJ10nIDogJ1snKSA9PT0gc3RhdGUuc3ltYiA/ICd7JyA6ICd9JztcbiAgICAgICAgfSxcbiAgICAgICAgaXNDb21wbGV0ZTogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgICByZXR1cm4gc3RhdGUuaW5kZXggPT09IDAgJiYgc3RhdGUubmV4dENoID09PSBzdGF0ZS5zeW1iO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY29tbWVudDoge1xuICAgICAgICBpc0NvbXBsZXRlOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgICAgIHZhciBmb3VuZCA9IHN0YXRlLmxhc3RDaCA9PT0gJyonICYmIHN0YXRlLm5leHRDaCA9PT0gJy8nO1xuICAgICAgICAgIHN0YXRlLmxhc3RDaCA9IHN0YXRlLm5leHRDaDtcbiAgICAgICAgICByZXR1cm4gZm91bmQ7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyBUT0RPOiBUaGUgb3JpZ2luYWwgVmltIGltcGxlbWVudGF0aW9uIG9ubHkgb3BlcmF0ZXMgb24gbGV2ZWwgMSBhbmQgMi5cbiAgICAgIC8vIFRoZSBjdXJyZW50IGltcGxlbWVudGF0aW9uIGRvZXNuJ3QgY2hlY2sgZm9yIGNvZGUgYmxvY2sgbGV2ZWwgYW5kXG4gICAgICAvLyB0aGVyZWZvcmUgaXQgb3BlcmF0ZXMgb24gYW55IGxldmVscy5cbiAgICAgIG1ldGhvZDoge1xuICAgICAgICBpbml0OiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgICAgIHN0YXRlLnN5bWIgPSAoc3RhdGUuc3ltYiA9PT0gJ20nID8gJ3snIDogJ30nKTtcbiAgICAgICAgICBzdGF0ZS5yZXZlcnNlU3ltYiA9IHN0YXRlLnN5bWIgPT09ICd7JyA/ICd9JyA6ICd7JztcbiAgICAgICAgfSxcbiAgICAgICAgaXNDb21wbGV0ZTogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgICBpZiAoc3RhdGUubmV4dENoID09PSBzdGF0ZS5zeW1iKXJldHVybiB0cnVlO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHByZXByb2Nlc3M6IHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgICBzdGF0ZS5pbmRleCA9IDA7XG4gICAgICAgIH0sXG4gICAgICAgIGlzQ29tcGxldGU6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICAgICAgaWYgKHN0YXRlLm5leHRDaCA9PT0gJyMnKSB7XG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBzdGF0ZS5saW5lVGV4dC5tYXRjaCgvIyhcXHcrKS8pWzFdO1xuICAgICAgICAgICAgaWYgKHRva2VuID09PSAnZW5kaWYnKSB7XG4gICAgICAgICAgICAgIGlmIChzdGF0ZS5mb3J3YXJkICYmIHN0YXRlLmRlcHRoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc3RhdGUuZGVwdGgrKztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG9rZW4gPT09ICdpZicpIHtcbiAgICAgICAgICAgICAgaWYgKCFzdGF0ZS5mb3J3YXJkICYmIHN0YXRlLmRlcHRoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc3RhdGUuZGVwdGgtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0b2tlbiA9PT0gJ2Vsc2UnICYmIHN0YXRlLmRlcHRoID09PSAwKXJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGZ1bmN0aW9uIGZpbmRTeW1ib2woY20sIHJlcGVhdCwgZm9yd2FyZCwgc3ltYikge1xuICAgICAgdmFyIGN1ciA9IGNvcHlDdXJzb3IoY20uZ2V0Q3Vyc29yKCkpO1xuICAgICAgdmFyIGluY3JlbWVudCA9IGZvcndhcmQgPyAxIDogLTE7XG4gICAgICB2YXIgZW5kTGluZSA9IGZvcndhcmQgPyBjbS5saW5lQ291bnQoKSA6IC0xO1xuICAgICAgdmFyIGN1ckNoID0gY3VyLmNoO1xuICAgICAgdmFyIGxpbmUgPSBjdXIubGluZTtcbiAgICAgIHZhciBsaW5lVGV4dCA9IGNtLmdldExpbmUobGluZSk7XG4gICAgICB2YXIgc3RhdGUgPSB7XG4gICAgICAgIGxpbmVUZXh0OiBsaW5lVGV4dCxcbiAgICAgICAgbmV4dENoOiBsaW5lVGV4dC5jaGFyQXQoY3VyQ2gpLFxuICAgICAgICBsYXN0Q2g6IG51bGwsXG4gICAgICAgIGluZGV4OiBjdXJDaCxcbiAgICAgICAgc3ltYjogc3ltYixcbiAgICAgICAgcmV2ZXJzZVN5bWI6IChmb3J3YXJkID8gIHsgJyknOiAnKCcsICd9JzogJ3snIH0gOiB7ICcoJzogJyknLCAneyc6ICd9JyB9KVtzeW1iXSxcbiAgICAgICAgZm9yd2FyZDogZm9yd2FyZCxcbiAgICAgICAgZGVwdGg6IDAsXG4gICAgICAgIGN1ck1vdmVUaHJvdWdoOiBmYWxzZVxuICAgICAgfTtcbiAgICAgIHZhciBtb2RlID0gc3ltYm9sVG9Nb2RlW3N5bWJdO1xuICAgICAgaWYgKCFtb2RlKXJldHVybiBjdXI7XG4gICAgICB2YXIgaW5pdCA9IGZpbmRTeW1ib2xNb2Rlc1ttb2RlXS5pbml0O1xuICAgICAgdmFyIGlzQ29tcGxldGUgPSBmaW5kU3ltYm9sTW9kZXNbbW9kZV0uaXNDb21wbGV0ZTtcbiAgICAgIGlmIChpbml0KSB7IGluaXQoc3RhdGUpOyB9XG4gICAgICB3aGlsZSAobGluZSAhPT0gZW5kTGluZSAmJiByZXBlYXQpIHtcbiAgICAgICAgc3RhdGUuaW5kZXggKz0gaW5jcmVtZW50O1xuICAgICAgICBzdGF0ZS5uZXh0Q2ggPSBzdGF0ZS5saW5lVGV4dC5jaGFyQXQoc3RhdGUuaW5kZXgpO1xuICAgICAgICBpZiAoIXN0YXRlLm5leHRDaCkge1xuICAgICAgICAgIGxpbmUgKz0gaW5jcmVtZW50O1xuICAgICAgICAgIHN0YXRlLmxpbmVUZXh0ID0gY20uZ2V0TGluZShsaW5lKSB8fCAnJztcbiAgICAgICAgICBpZiAoaW5jcmVtZW50ID4gMCkge1xuICAgICAgICAgICAgc3RhdGUuaW5kZXggPSAwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbGluZUxlbiA9IHN0YXRlLmxpbmVUZXh0Lmxlbmd0aDtcbiAgICAgICAgICAgIHN0YXRlLmluZGV4ID0gKGxpbmVMZW4gPiAwKSA/IChsaW5lTGVuLTEpIDogMDtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RhdGUubmV4dENoID0gc3RhdGUubGluZVRleHQuY2hhckF0KHN0YXRlLmluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNDb21wbGV0ZShzdGF0ZSkpIHtcbiAgICAgICAgICBjdXIubGluZSA9IGxpbmU7XG4gICAgICAgICAgY3VyLmNoID0gc3RhdGUuaW5kZXg7XG4gICAgICAgICAgcmVwZWF0LS07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdGF0ZS5uZXh0Q2ggfHwgc3RhdGUuY3VyTW92ZVRocm91Z2gpIHtcbiAgICAgICAgcmV0dXJuIFBvcyhsaW5lLCBzdGF0ZS5pbmRleCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY3VyO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyB0aGUgYm91bmRhcmllcyBvZiB0aGUgbmV4dCB3b3JkLiBJZiB0aGUgY3Vyc29yIGluIHRoZSBtaWRkbGUgb2ZcbiAgICAgKiB0aGUgd29yZCwgdGhlbiByZXR1cm5zIHRoZSBib3VuZGFyaWVzIG9mIHRoZSBjdXJyZW50IHdvcmQsIHN0YXJ0aW5nIGF0XG4gICAgICogdGhlIGN1cnNvci4gSWYgdGhlIGN1cnNvciBpcyBhdCB0aGUgc3RhcnQvZW5kIG9mIGEgd29yZCwgYW5kIHdlIGFyZSBnb2luZ1xuICAgICAqIGZvcndhcmQvYmFja3dhcmQsIHJlc3BlY3RpdmVseSwgZmluZCB0aGUgYm91bmRhcmllcyBvZiB0aGUgbmV4dCB3b3JkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtDb2RlTWlycm9yfSBjbSBDb2RlTWlycm9yIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge0N1cnNvcn0gY3VyIFRoZSBjdXJzb3IgcG9zaXRpb24uXG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3J3YXJkIFRydWUgdG8gc2VhcmNoIGZvcndhcmQuIEZhbHNlIHRvIHNlYXJjaFxuICAgICAqICAgICBiYWNrd2FyZC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGJpZ1dvcmQgVHJ1ZSBpZiBwdW5jdHVhdGlvbiBjb3VudCBhcyBwYXJ0IG9mIHRoZSB3b3JkLlxuICAgICAqICAgICBGYWxzZSBpZiBvbmx5IFthLXpBLVowLTldIGNoYXJhY3RlcnMgY291bnQgYXMgcGFydCBvZiB0aGUgd29yZC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVtcHR5TGluZUlzV29yZCBUcnVlIGlmIGVtcHR5IGxpbmVzIHNob3VsZCBiZSB0cmVhdGVkXG4gICAgICogICAgIGFzIHdvcmRzLlxuICAgICAqIEByZXR1cm4ge09iamVjdHtmcm9tOm51bWJlciwgdG86bnVtYmVyLCBsaW5lOiBudW1iZXJ9fSBUaGUgYm91bmRhcmllcyBvZlxuICAgICAqICAgICB0aGUgd29yZCwgb3IgbnVsbCBpZiB0aGVyZSBhcmUgbm8gbW9yZSB3b3Jkcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmaW5kV29yZChjbSwgY3VyLCBmb3J3YXJkLCBiaWdXb3JkLCBlbXB0eUxpbmVJc1dvcmQpIHtcbiAgICAgIHZhciBsaW5lTnVtID0gY3VyLmxpbmU7XG4gICAgICB2YXIgcG9zID0gY3VyLmNoO1xuICAgICAgdmFyIGxpbmUgPSBjbS5nZXRMaW5lKGxpbmVOdW0pO1xuICAgICAgdmFyIGRpciA9IGZvcndhcmQgPyAxIDogLTE7XG4gICAgICB2YXIgY2hhclRlc3RzID0gYmlnV29yZCA/IGJpZ1dvcmRDaGFyVGVzdDogd29yZENoYXJUZXN0O1xuXG4gICAgICBpZiAoZW1wdHlMaW5lSXNXb3JkICYmIGxpbmUgPT0gJycpIHtcbiAgICAgICAgbGluZU51bSArPSBkaXI7XG4gICAgICAgIGxpbmUgPSBjbS5nZXRMaW5lKGxpbmVOdW0pO1xuICAgICAgICBpZiAoIWlzTGluZShjbSwgbGluZU51bSkpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBwb3MgPSAoZm9yd2FyZCkgPyAwIDogbGluZS5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGlmIChlbXB0eUxpbmVJc1dvcmQgJiYgbGluZSA9PSAnJykge1xuICAgICAgICAgIHJldHVybiB7IGZyb206IDAsIHRvOiAwLCBsaW5lOiBsaW5lTnVtIH07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0b3AgPSAoZGlyID4gMCkgPyBsaW5lLmxlbmd0aCA6IC0xO1xuICAgICAgICB2YXIgd29yZFN0YXJ0ID0gc3RvcCwgd29yZEVuZCA9IHN0b3A7XG4gICAgICAgIC8vIEZpbmQgYm91bmRzIG9mIG5leHQgd29yZC5cbiAgICAgICAgd2hpbGUgKHBvcyAhPSBzdG9wKSB7XG4gICAgICAgICAgdmFyIGZvdW5kV29yZCA9IGZhbHNlO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhclRlc3RzLmxlbmd0aCAmJiAhZm91bmRXb3JkOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChjaGFyVGVzdHNbaV0obGluZS5jaGFyQXQocG9zKSkpIHtcbiAgICAgICAgICAgICAgd29yZFN0YXJ0ID0gcG9zO1xuICAgICAgICAgICAgICAvLyBBZHZhbmNlIHRvIGVuZCBvZiB3b3JkLlxuICAgICAgICAgICAgICB3aGlsZSAocG9zICE9IHN0b3AgJiYgY2hhclRlc3RzW2ldKGxpbmUuY2hhckF0KHBvcykpKSB7XG4gICAgICAgICAgICAgICAgcG9zICs9IGRpcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB3b3JkRW5kID0gcG9zO1xuICAgICAgICAgICAgICBmb3VuZFdvcmQgPSB3b3JkU3RhcnQgIT0gd29yZEVuZDtcbiAgICAgICAgICAgICAgaWYgKHdvcmRTdGFydCA9PSBjdXIuY2ggJiYgbGluZU51bSA9PSBjdXIubGluZSAmJlxuICAgICAgICAgICAgICAgICAgd29yZEVuZCA9PSB3b3JkU3RhcnQgKyBkaXIpIHtcbiAgICAgICAgICAgICAgICAvLyBXZSBzdGFydGVkIGF0IHRoZSBlbmQgb2YgYSB3b3JkLiBGaW5kIHRoZSBuZXh0IG9uZS5cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgZnJvbTogTWF0aC5taW4od29yZFN0YXJ0LCB3b3JkRW5kICsgMSksXG4gICAgICAgICAgICAgICAgICB0bzogTWF0aC5tYXgod29yZFN0YXJ0LCB3b3JkRW5kKSxcbiAgICAgICAgICAgICAgICAgIGxpbmU6IGxpbmVOdW0gfTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWZvdW5kV29yZCkge1xuICAgICAgICAgICAgcG9zICs9IGRpcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWR2YW5jZSB0byBuZXh0L3ByZXYgbGluZS5cbiAgICAgICAgbGluZU51bSArPSBkaXI7XG4gICAgICAgIGlmICghaXNMaW5lKGNtLCBsaW5lTnVtKSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGxpbmUgPSBjbS5nZXRMaW5lKGxpbmVOdW0pO1xuICAgICAgICBwb3MgPSAoZGlyID4gMCkgPyAwIDogbGluZS5sZW5ndGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtDb2RlTWlycm9yfSBjbSBDb2RlTWlycm9yIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge1Bvc30gY3VyIFRoZSBwb3NpdGlvbiB0byBzdGFydCBmcm9tLlxuICAgICAqIEBwYXJhbSB7aW50fSByZXBlYXQgTnVtYmVyIG9mIHdvcmRzIHRvIG1vdmUgcGFzdC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcndhcmQgVHJ1ZSB0byBzZWFyY2ggZm9yd2FyZC4gRmFsc2UgdG8gc2VhcmNoXG4gICAgICogICAgIGJhY2t3YXJkLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gd29yZEVuZCBUcnVlIHRvIG1vdmUgdG8gZW5kIG9mIHdvcmQuIEZhbHNlIHRvIG1vdmUgdG9cbiAgICAgKiAgICAgYmVnaW5uaW5nIG9mIHdvcmQuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBiaWdXb3JkIFRydWUgaWYgcHVuY3R1YXRpb24gY291bnQgYXMgcGFydCBvZiB0aGUgd29yZC5cbiAgICAgKiAgICAgRmFsc2UgaWYgb25seSBhbHBoYWJldCBjaGFyYWN0ZXJzIGNvdW50IGFzIHBhcnQgb2YgdGhlIHdvcmQuXG4gICAgICogQHJldHVybiB7Q3Vyc29yfSBUaGUgcG9zaXRpb24gdGhlIGN1cnNvciBzaG91bGQgbW92ZSB0by5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtb3ZlVG9Xb3JkKGNtLCBjdXIsIHJlcGVhdCwgZm9yd2FyZCwgd29yZEVuZCwgYmlnV29yZCkge1xuICAgICAgdmFyIGN1clN0YXJ0ID0gY29weUN1cnNvcihjdXIpO1xuICAgICAgdmFyIHdvcmRzID0gW107XG4gICAgICBpZiAoZm9yd2FyZCAmJiAhd29yZEVuZCB8fCAhZm9yd2FyZCAmJiB3b3JkRW5kKSB7XG4gICAgICAgIHJlcGVhdCsrO1xuICAgICAgfVxuICAgICAgLy8gRm9yICdlJywgZW1wdHkgbGluZXMgYXJlIG5vdCBjb25zaWRlcmVkIHdvcmRzLCBnbyBmaWd1cmUuXG4gICAgICB2YXIgZW1wdHlMaW5lSXNXb3JkID0gIShmb3J3YXJkICYmIHdvcmRFbmQpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXBlYXQ7IGkrKykge1xuICAgICAgICB2YXIgd29yZCA9IGZpbmRXb3JkKGNtLCBjdXIsIGZvcndhcmQsIGJpZ1dvcmQsIGVtcHR5TGluZUlzV29yZCk7XG4gICAgICAgIGlmICghd29yZCkge1xuICAgICAgICAgIHZhciBlb2RDaCA9IGxpbmVMZW5ndGgoY20sIGNtLmxhc3RMaW5lKCkpO1xuICAgICAgICAgIHdvcmRzLnB1c2goZm9yd2FyZFxuICAgICAgICAgICAgICA/IHtsaW5lOiBjbS5sYXN0TGluZSgpLCBmcm9tOiBlb2RDaCwgdG86IGVvZENofVxuICAgICAgICAgICAgICA6IHtsaW5lOiAwLCBmcm9tOiAwLCB0bzogMH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHdvcmRzLnB1c2god29yZCk7XG4gICAgICAgIGN1ciA9IFBvcyh3b3JkLmxpbmUsIGZvcndhcmQgPyAod29yZC50byAtIDEpIDogd29yZC5mcm9tKTtcbiAgICAgIH1cbiAgICAgIHZhciBzaG9ydENpcmN1aXQgPSB3b3Jkcy5sZW5ndGggIT0gcmVwZWF0O1xuICAgICAgdmFyIGZpcnN0V29yZCA9IHdvcmRzWzBdO1xuICAgICAgdmFyIGxhc3RXb3JkID0gd29yZHMucG9wKCk7XG4gICAgICBpZiAoZm9yd2FyZCAmJiAhd29yZEVuZCkge1xuICAgICAgICAvLyB3XG4gICAgICAgIGlmICghc2hvcnRDaXJjdWl0ICYmIChmaXJzdFdvcmQuZnJvbSAhPSBjdXJTdGFydC5jaCB8fCBmaXJzdFdvcmQubGluZSAhPSBjdXJTdGFydC5saW5lKSkge1xuICAgICAgICAgIC8vIFdlIGRpZCBub3Qgc3RhcnQgaW4gdGhlIG1pZGRsZSBvZiBhIHdvcmQuIERpc2NhcmQgdGhlIGV4dHJhIHdvcmQgYXQgdGhlIGVuZC5cbiAgICAgICAgICBsYXN0V29yZCA9IHdvcmRzLnBvcCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQb3MobGFzdFdvcmQubGluZSwgbGFzdFdvcmQuZnJvbSk7XG4gICAgICB9IGVsc2UgaWYgKGZvcndhcmQgJiYgd29yZEVuZCkge1xuICAgICAgICByZXR1cm4gUG9zKGxhc3RXb3JkLmxpbmUsIGxhc3RXb3JkLnRvIC0gMSk7XG4gICAgICB9IGVsc2UgaWYgKCFmb3J3YXJkICYmIHdvcmRFbmQpIHtcbiAgICAgICAgLy8gZ2VcbiAgICAgICAgaWYgKCFzaG9ydENpcmN1aXQgJiYgKGZpcnN0V29yZC50byAhPSBjdXJTdGFydC5jaCB8fCBmaXJzdFdvcmQubGluZSAhPSBjdXJTdGFydC5saW5lKSkge1xuICAgICAgICAgIC8vIFdlIGRpZCBub3Qgc3RhcnQgaW4gdGhlIG1pZGRsZSBvZiBhIHdvcmQuIERpc2NhcmQgdGhlIGV4dHJhIHdvcmQgYXQgdGhlIGVuZC5cbiAgICAgICAgICBsYXN0V29yZCA9IHdvcmRzLnBvcCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQb3MobGFzdFdvcmQubGluZSwgbGFzdFdvcmQudG8pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gYlxuICAgICAgICByZXR1cm4gUG9zKGxhc3RXb3JkLmxpbmUsIGxhc3RXb3JkLmZyb20pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vdmVUb0NoYXJhY3RlcihjbSwgcmVwZWF0LCBmb3J3YXJkLCBjaGFyYWN0ZXIpIHtcbiAgICAgIHZhciBjdXIgPSBjbS5nZXRDdXJzb3IoKTtcbiAgICAgIHZhciBzdGFydCA9IGN1ci5jaDtcbiAgICAgIHZhciBpZHg7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlcGVhdDsgaSArKykge1xuICAgICAgICB2YXIgbGluZSA9IGNtLmdldExpbmUoY3VyLmxpbmUpO1xuICAgICAgICBpZHggPSBjaGFySWR4SW5MaW5lKHN0YXJ0LCBsaW5lLCBjaGFyYWN0ZXIsIGZvcndhcmQsIHRydWUpO1xuICAgICAgICBpZiAoaWR4ID09IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc3RhcnQgPSBpZHg7XG4gICAgICB9XG4gICAgICByZXR1cm4gUG9zKGNtLmdldEN1cnNvcigpLmxpbmUsIGlkeCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW92ZVRvQ29sdW1uKGNtLCByZXBlYXQpIHtcbiAgICAgIC8vIHJlcGVhdCBpcyBhbHdheXMgPj0gMSwgc28gcmVwZWF0IC0gMSBhbHdheXMgY29ycmVzcG9uZHNcbiAgICAgIC8vIHRvIHRoZSBjb2x1bW4gd2Ugd2FudCB0byBnbyB0by5cbiAgICAgIHZhciBsaW5lID0gY20uZ2V0Q3Vyc29yKCkubGluZTtcbiAgICAgIHJldHVybiBjbGlwQ3Vyc29yVG9Db250ZW50KGNtLCBQb3MobGluZSwgcmVwZWF0IC0gMSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZU1hcmsoY20sIHZpbSwgbWFya05hbWUsIHBvcykge1xuICAgICAgaWYgKCFpbkFycmF5KG1hcmtOYW1lLCB2YWxpZE1hcmtzKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodmltLm1hcmtzW21hcmtOYW1lXSkge1xuICAgICAgICB2aW0ubWFya3NbbWFya05hbWVdLmNsZWFyKCk7XG4gICAgICB9XG4gICAgICB2aW0ubWFya3NbbWFya05hbWVdID0gY20uc2V0Qm9va21hcmsocG9zKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGFySWR4SW5MaW5lKHN0YXJ0LCBsaW5lLCBjaGFyYWN0ZXIsIGZvcndhcmQsIGluY2x1ZGVDaGFyKSB7XG4gICAgICAvLyBTZWFyY2ggZm9yIGNoYXIgaW4gbGluZS5cbiAgICAgIC8vIG1vdGlvbl9vcHRpb25zOiB7Zm9yd2FyZCwgaW5jbHVkZUNoYXJ9XG4gICAgICAvLyBJZiBpbmNsdWRlQ2hhciA9IHRydWUsIGluY2x1ZGUgaXQgdG9vLlxuICAgICAgLy8gSWYgZm9yd2FyZCA9IHRydWUsIHNlYXJjaCBmb3J3YXJkLCBlbHNlIHNlYXJjaCBiYWNrd2FyZHMuXG4gICAgICAvLyBJZiBjaGFyIGlzIG5vdCBmb3VuZCBvbiB0aGlzIGxpbmUsIGRvIG5vdGhpbmdcbiAgICAgIHZhciBpZHg7XG4gICAgICBpZiAoZm9yd2FyZCkge1xuICAgICAgICBpZHggPSBsaW5lLmluZGV4T2YoY2hhcmFjdGVyLCBzdGFydCArIDEpO1xuICAgICAgICBpZiAoaWR4ICE9IC0xICYmICFpbmNsdWRlQ2hhcikge1xuICAgICAgICAgIGlkeCAtPSAxO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZHggPSBsaW5lLmxhc3RJbmRleE9mKGNoYXJhY3Rlciwgc3RhcnQgLSAxKTtcbiAgICAgICAgaWYgKGlkeCAhPSAtMSAmJiAhaW5jbHVkZUNoYXIpIHtcbiAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGlkeDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5kUGFyYWdyYXBoKGNtLCBoZWFkLCByZXBlYXQsIGRpciwgaW5jbHVzaXZlKSB7XG4gICAgICB2YXIgbGluZSA9IGhlYWQubGluZTtcbiAgICAgIHZhciBtaW4gPSBjbS5maXJzdExpbmUoKTtcbiAgICAgIHZhciBtYXggPSBjbS5sYXN0TGluZSgpO1xuICAgICAgdmFyIHN0YXJ0LCBlbmQsIGkgPSBsaW5lO1xuICAgICAgZnVuY3Rpb24gaXNFbXB0eShpKSB7IHJldHVybiAhY20uZ2V0TGluZShpKTsgfVxuICAgICAgZnVuY3Rpb24gaXNCb3VuZGFyeShpLCBkaXIsIGFueSkge1xuICAgICAgICBpZiAoYW55KSB7IHJldHVybiBpc0VtcHR5KGkpICE9IGlzRW1wdHkoaSArIGRpcik7IH1cbiAgICAgICAgcmV0dXJuICFpc0VtcHR5KGkpICYmIGlzRW1wdHkoaSArIGRpcik7XG4gICAgICB9XG4gICAgICBpZiAoZGlyKSB7XG4gICAgICAgIHdoaWxlIChtaW4gPD0gaSAmJiBpIDw9IG1heCAmJiByZXBlYXQgPiAwKSB7XG4gICAgICAgICAgaWYgKGlzQm91bmRhcnkoaSwgZGlyKSkgeyByZXBlYXQtLTsgfVxuICAgICAgICAgIGkgKz0gZGlyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgUG9zKGksIDApO1xuICAgICAgfVxuXG4gICAgICB2YXIgdmltID0gY20uc3RhdGUudmltO1xuICAgICAgaWYgKHZpbS52aXN1YWxMaW5lICYmIGlzQm91bmRhcnkobGluZSwgMSwgdHJ1ZSkpIHtcbiAgICAgICAgdmFyIGFuY2hvciA9IHZpbS5zZWwuYW5jaG9yO1xuICAgICAgICBpZiAoaXNCb3VuZGFyeShhbmNob3IubGluZSwgLTEsIHRydWUpKSB7XG4gICAgICAgICAgaWYgKCFpbmNsdXNpdmUgfHwgYW5jaG9yLmxpbmUgIT0gbGluZSkge1xuICAgICAgICAgICAgbGluZSArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIHN0YXJ0U3RhdGUgPSBpc0VtcHR5KGxpbmUpO1xuICAgICAgZm9yIChpID0gbGluZTsgaSA8PSBtYXggJiYgcmVwZWF0OyBpKyspIHtcbiAgICAgICAgaWYgKGlzQm91bmRhcnkoaSwgMSwgdHJ1ZSkpIHtcbiAgICAgICAgICBpZiAoIWluY2x1c2l2ZSB8fCBpc0VtcHR5KGkpICE9IHN0YXJ0U3RhdGUpIHtcbiAgICAgICAgICAgIHJlcGVhdC0tO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZW5kID0gbmV3IFBvcyhpLCAwKTtcbiAgICAgIC8vIHNlbGVjdCBib3VuZGFyeSBiZWZvcmUgcGFyYWdyYXBoIGZvciB0aGUgbGFzdCBvbmVcbiAgICAgIGlmIChpID4gbWF4ICYmICFzdGFydFN0YXRlKSB7IHN0YXJ0U3RhdGUgPSB0cnVlOyB9XG4gICAgICBlbHNlIHsgaW5jbHVzaXZlID0gZmFsc2U7IH1cbiAgICAgIGZvciAoaSA9IGxpbmU7IGkgPiBtaW47IGktLSkge1xuICAgICAgICBpZiAoIWluY2x1c2l2ZSB8fCBpc0VtcHR5KGkpID09IHN0YXJ0U3RhdGUgfHwgaSA9PSBsaW5lKSB7XG4gICAgICAgICAgaWYgKGlzQm91bmRhcnkoaSwgLTEsIHRydWUpKSB7IGJyZWFrOyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHN0YXJ0ID0gbmV3IFBvcyhpLCAwKTtcbiAgICAgIHJldHVybiB7IHN0YXJ0OiBzdGFydCwgZW5kOiBlbmQgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5kU2VudGVuY2UoY20sIGN1ciwgcmVwZWF0LCBkaXIpIHtcblxuICAgICAgLypcbiAgICAgICAgVGFrZXMgYW4gaW5kZXggb2JqZWN0XG4gICAgICAgIHtcbiAgICAgICAgICBsaW5lOiB0aGUgbGluZSBzdHJpbmcsXG4gICAgICAgICAgbG46IGxpbmUgbnVtYmVyLFxuICAgICAgICAgIHBvczogaW5kZXggaW4gbGluZSxcbiAgICAgICAgICBkaXI6IGRpcmVjdGlvbiBvZiB0cmF2ZXJzYWwgKC0xIG9yIDEpXG4gICAgICAgIH1cbiAgICAgICAgYW5kIG1vZGlmaWVzIHRoZSBsaW5lLCBsbiwgYW5kIHBvcyBtZW1iZXJzIHRvIHJlcHJlc2VudCB0aGVcbiAgICAgICAgbmV4dCB2YWxpZCBwb3NpdGlvbiBvciBzZXRzIHRoZW0gdG8gbnVsbCBpZiB0aGVyZSBhcmVcbiAgICAgICAgbm8gbW9yZSB2YWxpZCBwb3NpdGlvbnMuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIG5leHRDaGFyKGNtLCBpZHgpIHtcbiAgICAgICAgaWYgKGlkeC5wb3MgKyBpZHguZGlyIDwgMCB8fCBpZHgucG9zICsgaWR4LmRpciA+PSBpZHgubGluZS5sZW5ndGgpIHtcbiAgICAgICAgICBpZHgubG4gKz0gaWR4LmRpcjtcbiAgICAgICAgICBpZiAoIWlzTGluZShjbSwgaWR4LmxuKSkge1xuICAgICAgICAgICAgaWR4LmxpbmUgPSBudWxsO1xuICAgICAgICAgICAgaWR4LmxuID0gbnVsbDtcbiAgICAgICAgICAgIGlkeC5wb3MgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZHgubGluZSA9IGNtLmdldExpbmUoaWR4LmxuKTtcbiAgICAgICAgICBpZHgucG9zID0gKGlkeC5kaXIgPiAwKSA/IDAgOiBpZHgubGluZS5sZW5ndGggLSAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlkeC5wb3MgKz0gaWR4LmRpcjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKlxuICAgICAgICBQZXJmb3JtcyBvbmUgaXRlcmF0aW9uIG9mIHRyYXZlcnNhbCBpbiBmb3J3YXJkIGRpcmVjdGlvblxuICAgICAgICBSZXR1cm5zIGFuIGluZGV4IG9iamVjdCBvZiB0aGUgbmV3IGxvY2F0aW9uXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGZvcndhcmQoY20sIGxuLCBwb3MsIGRpcikge1xuICAgICAgICB2YXIgbGluZSA9IGNtLmdldExpbmUobG4pO1xuICAgICAgICB2YXIgc3RvcCA9IChsaW5lID09PSBcIlwiKTtcblxuICAgICAgICB2YXIgY3VyciA9IHtcbiAgICAgICAgICBsaW5lOiBsaW5lLFxuICAgICAgICAgIGxuOiBsbixcbiAgICAgICAgICBwb3M6IHBvcyxcbiAgICAgICAgICBkaXI6IGRpcixcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsYXN0X3ZhbGlkID0ge1xuICAgICAgICAgIGxuOiBjdXJyLmxuLFxuICAgICAgICAgIHBvczogY3Vyci5wb3MsXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2tpcF9lbXB0eV9saW5lcyA9IChjdXJyLmxpbmUgPT09IFwiXCIpO1xuXG4gICAgICAgIC8vIE1vdmUgb25lIHN0ZXAgdG8gc2tpcCBjaGFyYWN0ZXIgd2Ugc3RhcnQgb25cbiAgICAgICAgbmV4dENoYXIoY20sIGN1cnIpO1xuXG4gICAgICAgIHdoaWxlIChjdXJyLmxpbmUgIT09IG51bGwpIHtcbiAgICAgICAgICBsYXN0X3ZhbGlkLmxuID0gY3Vyci5sbjtcbiAgICAgICAgICBsYXN0X3ZhbGlkLnBvcyA9IGN1cnIucG9zO1xuXG4gICAgICAgICAgaWYgKGN1cnIubGluZSA9PT0gXCJcIiAmJiAhc2tpcF9lbXB0eV9saW5lcykge1xuICAgICAgICAgICAgcmV0dXJuIHsgbG46IGN1cnIubG4sIHBvczogY3Vyci5wb3MsIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKHN0b3AgJiYgY3Vyci5saW5lICE9PSBcIlwiICYmICFpc1doaXRlU3BhY2VTdHJpbmcoY3Vyci5saW5lW2N1cnIucG9zXSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IGxuOiBjdXJyLmxuLCBwb3M6IGN1cnIucG9zLCB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChpc0VuZE9mU2VudGVuY2VTeW1ib2woY3Vyci5saW5lW2N1cnIucG9zXSlcbiAgICAgICAgICAgICYmICFzdG9wXG4gICAgICAgICAgICAmJiAoY3Vyci5wb3MgPT09IGN1cnIubGluZS5sZW5ndGggLSAxXG4gICAgICAgICAgICAgIHx8IGlzV2hpdGVTcGFjZVN0cmluZyhjdXJyLmxpbmVbY3Vyci5wb3MgKyAxXSkpKSB7XG4gICAgICAgICAgICBzdG9wID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0Q2hhcihjbSwgY3Vycik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgIFNldCB0aGUgcG9zaXRpb24gdG8gdGhlIGxhc3Qgbm9uIHdoaXRlc3BhY2UgY2hhcmFjdGVyIG9uIHRoZSBsYXN0XG4gICAgICAgICAgdmFsaWQgbGluZSBpbiB0aGUgY2FzZSB0aGF0IHdlIHJlYWNoIHRoZSBlbmQgb2YgdGhlIGRvY3VtZW50LlxuICAgICAgICAqL1xuICAgICAgICB2YXIgbGluZSA9IGNtLmdldExpbmUobGFzdF92YWxpZC5sbik7XG4gICAgICAgIGxhc3RfdmFsaWQucG9zID0gMDtcbiAgICAgICAgZm9yKHZhciBpID0gbGluZS5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICAgIGlmICghaXNXaGl0ZVNwYWNlU3RyaW5nKGxpbmVbaV0pKSB7XG4gICAgICAgICAgICBsYXN0X3ZhbGlkLnBvcyA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGFzdF92YWxpZDtcblxuICAgICAgfVxuXG4gICAgICAvKlxuICAgICAgICBQZXJmb3JtcyBvbmUgaXRlcmF0aW9uIG9mIHRyYXZlcnNhbCBpbiByZXZlcnNlIGRpcmVjdGlvblxuICAgICAgICBSZXR1cm5zIGFuIGluZGV4IG9iamVjdCBvZiB0aGUgbmV3IGxvY2F0aW9uXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIHJldmVyc2UoY20sIGxuLCBwb3MsIGRpcikge1xuICAgICAgICB2YXIgbGluZSA9IGNtLmdldExpbmUobG4pO1xuXG4gICAgICAgIHZhciBjdXJyID0ge1xuICAgICAgICAgIGxpbmU6IGxpbmUsXG4gICAgICAgICAgbG46IGxuLFxuICAgICAgICAgIHBvczogcG9zLFxuICAgICAgICAgIGRpcjogZGlyLFxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxhc3RfdmFsaWQgPSB7XG4gICAgICAgICAgbG46IGN1cnIubG4sXG4gICAgICAgICAgcG9zOiBudWxsLFxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBza2lwX2VtcHR5X2xpbmVzID0gKGN1cnIubGluZSA9PT0gXCJcIik7XG5cbiAgICAgICAgLy8gTW92ZSBvbmUgc3RlcCB0byBza2lwIGNoYXJhY3RlciB3ZSBzdGFydCBvblxuICAgICAgICBuZXh0Q2hhcihjbSwgY3Vycik7XG5cbiAgICAgICAgd2hpbGUgKGN1cnIubGluZSAhPT0gbnVsbCkge1xuXG4gICAgICAgICAgaWYgKGN1cnIubGluZSA9PT0gXCJcIiAmJiAhc2tpcF9lbXB0eV9saW5lcykge1xuICAgICAgICAgICAgaWYgKGxhc3RfdmFsaWQucG9zICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIHJldHVybiBsYXN0X3ZhbGlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IGxuOiBjdXJyLmxuLCBwb3M6IGN1cnIucG9zIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKGlzRW5kT2ZTZW50ZW5jZVN5bWJvbChjdXJyLmxpbmVbY3Vyci5wb3NdKVxuICAgICAgICAgICAgICAmJiBsYXN0X3ZhbGlkLnBvcyAhPT0gbnVsbFxuICAgICAgICAgICAgICAmJiAhKGN1cnIubG4gPT09IGxhc3RfdmFsaWQubG4gJiYgY3Vyci5wb3MgKyAxID09PSBsYXN0X3ZhbGlkLnBvcykpIHtcbiAgICAgICAgICAgIHJldHVybiBsYXN0X3ZhbGlkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChjdXJyLmxpbmUgIT09IFwiXCIgJiYgIWlzV2hpdGVTcGFjZVN0cmluZyhjdXJyLmxpbmVbY3Vyci5wb3NdKSkge1xuICAgICAgICAgICAgc2tpcF9lbXB0eV9saW5lcyA9IGZhbHNlO1xuICAgICAgICAgICAgbGFzdF92YWxpZCA9IHsgbG46IGN1cnIubG4sIHBvczogY3Vyci5wb3MgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHRDaGFyKGNtLCBjdXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAgU2V0IHRoZSBwb3NpdGlvbiB0byB0aGUgZmlyc3Qgbm9uIHdoaXRlc3BhY2UgY2hhcmFjdGVyIG9uIHRoZSBsYXN0XG4gICAgICAgICAgdmFsaWQgbGluZSBpbiB0aGUgY2FzZSB0aGF0IHdlIHJlYWNoIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGRvY3VtZW50LlxuICAgICAgICAqL1xuICAgICAgICB2YXIgbGluZSA9IGNtLmdldExpbmUobGFzdF92YWxpZC5sbik7XG4gICAgICAgIGxhc3RfdmFsaWQucG9zID0gMDtcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGxpbmUubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICBpZiAoIWlzV2hpdGVTcGFjZVN0cmluZyhsaW5lW2ldKSkge1xuICAgICAgICAgICAgbGFzdF92YWxpZC5wb3MgPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsYXN0X3ZhbGlkO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3Vycl9pbmRleCA9IHtcbiAgICAgICAgbG46IGN1ci5saW5lLFxuICAgICAgICBwb3M6IGN1ci5jaCxcbiAgICAgIH07XG5cbiAgICAgIHdoaWxlIChyZXBlYXQgPiAwKSB7XG4gICAgICAgIGlmIChkaXIgPCAwKSB7XG4gICAgICAgICAgY3Vycl9pbmRleCA9IHJldmVyc2UoY20sIGN1cnJfaW5kZXgubG4sIGN1cnJfaW5kZXgucG9zLCBkaXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGN1cnJfaW5kZXggPSBmb3J3YXJkKGNtLCBjdXJyX2luZGV4LmxuLCBjdXJyX2luZGV4LnBvcywgZGlyKTtcbiAgICAgICAgfVxuICAgICAgICByZXBlYXQtLTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFBvcyhjdXJyX2luZGV4LmxuLCBjdXJyX2luZGV4LnBvcyk7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogcGVyaGFwcyB0aGlzIGZpbmFnbGluZyBvZiBzdGFydCBhbmQgZW5kIHBvc2l0aW9ucyBiZWxvbmRzXG4gICAgLy8gaW4gY29kZW1pcnJvci9yZXBsYWNlUmFuZ2U/XG4gICAgZnVuY3Rpb24gc2VsZWN0Q29tcGFuaW9uT2JqZWN0KGNtLCBoZWFkLCBzeW1iLCBpbmNsdXNpdmUpIHtcbiAgICAgIHZhciBjdXIgPSBoZWFkLCBzdGFydCwgZW5kO1xuXG4gICAgICB2YXIgYnJhY2tldFJlZ2V4cCA9ICh7XG4gICAgICAgICcoJzogL1soKV0vLCAnKSc6IC9bKCldLyxcbiAgICAgICAgJ1snOiAvW1tcXF1dLywgJ10nOiAvW1tcXF1dLyxcbiAgICAgICAgJ3snOiAvW3t9XS8sICd9JzogL1t7fV0vLFxuICAgICAgICAnPCc6IC9bPD5dLywgJz4nOiAvWzw+XS99KVtzeW1iXTtcbiAgICAgIHZhciBvcGVuU3ltID0gKHtcbiAgICAgICAgJygnOiAnKCcsICcpJzogJygnLFxuICAgICAgICAnWyc6ICdbJywgJ10nOiAnWycsXG4gICAgICAgICd7JzogJ3snLCAnfSc6ICd7JyxcbiAgICAgICAgJzwnOiAnPCcsICc+JzogJzwnfSlbc3ltYl07XG4gICAgICB2YXIgY3VyQ2hhciA9IGNtLmdldExpbmUoY3VyLmxpbmUpLmNoYXJBdChjdXIuY2gpO1xuICAgICAgLy8gRHVlIHRvIHRoZSBiZWhhdmlvciBvZiBzY2FuRm9yQnJhY2tldCwgd2UgbmVlZCB0byBhZGQgYW4gb2Zmc2V0IGlmIHRoZVxuICAgICAgLy8gY3Vyc29yIGlzIG9uIGEgbWF0Y2hpbmcgb3BlbiBicmFja2V0LlxuICAgICAgdmFyIG9mZnNldCA9IGN1ckNoYXIgPT09IG9wZW5TeW0gPyAxIDogMDtcblxuICAgICAgc3RhcnQgPSBjbS5zY2FuRm9yQnJhY2tldChQb3MoY3VyLmxpbmUsIGN1ci5jaCArIG9mZnNldCksIC0xLCB1bmRlZmluZWQsIHsnYnJhY2tldFJlZ2V4JzogYnJhY2tldFJlZ2V4cH0pO1xuICAgICAgZW5kID0gY20uc2NhbkZvckJyYWNrZXQoUG9zKGN1ci5saW5lLCBjdXIuY2ggKyBvZmZzZXQpLCAxLCB1bmRlZmluZWQsIHsnYnJhY2tldFJlZ2V4JzogYnJhY2tldFJlZ2V4cH0pO1xuXG4gICAgICBpZiAoIXN0YXJ0IHx8ICFlbmQpIHtcbiAgICAgICAgcmV0dXJuIHsgc3RhcnQ6IGN1ciwgZW5kOiBjdXIgfTtcbiAgICAgIH1cblxuICAgICAgc3RhcnQgPSBzdGFydC5wb3M7XG4gICAgICBlbmQgPSBlbmQucG9zO1xuXG4gICAgICBpZiAoKHN0YXJ0LmxpbmUgPT0gZW5kLmxpbmUgJiYgc3RhcnQuY2ggPiBlbmQuY2gpXG4gICAgICAgICAgfHwgKHN0YXJ0LmxpbmUgPiBlbmQubGluZSkpIHtcbiAgICAgICAgdmFyIHRtcCA9IHN0YXJ0O1xuICAgICAgICBzdGFydCA9IGVuZDtcbiAgICAgICAgZW5kID0gdG1wO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5jbHVzaXZlKSB7XG4gICAgICAgIGVuZC5jaCArPSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhcnQuY2ggKz0gMTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHsgc3RhcnQ6IHN0YXJ0LCBlbmQ6IGVuZCB9O1xuICAgIH1cblxuICAgIC8vIFRha2VzIGluIGEgc3ltYm9sIGFuZCBhIGN1cnNvciBhbmQgdHJpZXMgdG8gc2ltdWxhdGUgdGV4dCBvYmplY3RzIHRoYXRcbiAgICAvLyBoYXZlIGlkZW50aWNhbCBvcGVuaW5nIGFuZCBjbG9zaW5nIHN5bWJvbHNcbiAgICAvLyBUT0RPIHN1cHBvcnQgYWNyb3NzIG11bHRpcGxlIGxpbmVzXG4gICAgZnVuY3Rpb24gZmluZEJlZ2lubmluZ0FuZEVuZChjbSwgaGVhZCwgc3ltYiwgaW5jbHVzaXZlKSB7XG4gICAgICB2YXIgY3VyID0gY29weUN1cnNvcihoZWFkKTtcbiAgICAgIHZhciBsaW5lID0gY20uZ2V0TGluZShjdXIubGluZSk7XG4gICAgICB2YXIgY2hhcnMgPSBsaW5lLnNwbGl0KCcnKTtcbiAgICAgIHZhciBzdGFydCwgZW5kLCBpLCBsZW47XG4gICAgICB2YXIgZmlyc3RJbmRleCA9IGNoYXJzLmluZGV4T2Yoc3ltYik7XG5cbiAgICAgIC8vIHRoZSBkZWNpc2lvbiB0cmVlIGlzIHRvIGFsd2F5cyBsb29rIGJhY2t3YXJkcyBmb3IgdGhlIGJlZ2lubmluZyBmaXJzdCxcbiAgICAgIC8vIGJ1dCBpZiB0aGUgY3Vyc29yIGlzIGluIGZyb250IG9mIHRoZSBmaXJzdCBpbnN0YW5jZSBvZiB0aGUgc3ltYixcbiAgICAgIC8vIHRoZW4gbW92ZSB0aGUgY3Vyc29yIGZvcndhcmRcbiAgICAgIGlmIChjdXIuY2ggPCBmaXJzdEluZGV4KSB7XG4gICAgICAgIGN1ci5jaCA9IGZpcnN0SW5kZXg7XG4gICAgICAgIC8vIFdoeSBpcyB0aGlzIGxpbmUgZXZlbiBoZXJlPz8/XG4gICAgICAgIC8vIGNtLnNldEN1cnNvcihjdXIubGluZSwgZmlyc3RJbmRleCsxKTtcbiAgICAgIH1cbiAgICAgIC8vIG90aGVyd2lzZSBpZiB0aGUgY3Vyc29yIGlzIGN1cnJlbnRseSBvbiB0aGUgY2xvc2luZyBzeW1ib2xcbiAgICAgIGVsc2UgaWYgKGZpcnN0SW5kZXggPCBjdXIuY2ggJiYgY2hhcnNbY3VyLmNoXSA9PSBzeW1iKSB7XG4gICAgICAgIGVuZCA9IGN1ci5jaDsgLy8gYXNzaWduIGVuZCB0byB0aGUgY3VycmVudCBjdXJzb3JcbiAgICAgICAgLS1jdXIuY2g7IC8vIG1ha2Ugc3VyZSB0byBsb29rIGJhY2t3YXJkc1xuICAgICAgfVxuXG4gICAgICAvLyBpZiB3ZSdyZSBjdXJyZW50bHkgb24gdGhlIHN5bWJvbCwgd2UndmUgZ290IGEgc3RhcnRcbiAgICAgIGlmIChjaGFyc1tjdXIuY2hdID09IHN5bWIgJiYgIWVuZCkge1xuICAgICAgICBzdGFydCA9IGN1ci5jaCArIDE7IC8vIGFzc2lnbiBzdGFydCB0byBhaGVhZCBvZiB0aGUgY3Vyc29yXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBnbyBiYWNrd2FyZHMgdG8gZmluZCB0aGUgc3RhcnRcbiAgICAgICAgZm9yIChpID0gY3VyLmNoOyBpID4gLTEgJiYgIXN0YXJ0OyBpLS0pIHtcbiAgICAgICAgICBpZiAoY2hhcnNbaV0gPT0gc3ltYikge1xuICAgICAgICAgICAgc3RhcnQgPSBpICsgMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gbG9vayBmb3J3YXJkcyBmb3IgdGhlIGVuZCBzeW1ib2xcbiAgICAgIGlmIChzdGFydCAmJiAhZW5kKSB7XG4gICAgICAgIGZvciAoaSA9IHN0YXJ0LCBsZW4gPSBjaGFycy5sZW5ndGg7IGkgPCBsZW4gJiYgIWVuZDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGNoYXJzW2ldID09IHN5bWIpIHtcbiAgICAgICAgICAgIGVuZCA9IGk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIG5vdGhpbmcgZm91bmRcbiAgICAgIGlmICghc3RhcnQgfHwgIWVuZCkge1xuICAgICAgICByZXR1cm4geyBzdGFydDogY3VyLCBlbmQ6IGN1ciB9O1xuICAgICAgfVxuXG4gICAgICAvLyBpbmNsdWRlIHRoZSBzeW1ib2xzXG4gICAgICBpZiAoaW5jbHVzaXZlKSB7XG4gICAgICAgIC0tc3RhcnQ7ICsrZW5kO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGFydDogUG9zKGN1ci5saW5lLCBzdGFydCksXG4gICAgICAgIGVuZDogUG9zKGN1ci5saW5lLCBlbmQpXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIFNlYXJjaCBmdW5jdGlvbnNcbiAgICBkZWZpbmVPcHRpb24oJ3BjcmUnLCB0cnVlLCAnYm9vbGVhbicpO1xuICAgIGZ1bmN0aW9uIFNlYXJjaFN0YXRlKCkge31cbiAgICBTZWFyY2hTdGF0ZS5wcm90b3R5cGUgPSB7XG4gICAgICBnZXRRdWVyeTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB2aW1HbG9iYWxTdGF0ZS5xdWVyeTtcbiAgICAgIH0sXG4gICAgICBzZXRRdWVyeTogZnVuY3Rpb24ocXVlcnkpIHtcbiAgICAgICAgdmltR2xvYmFsU3RhdGUucXVlcnkgPSBxdWVyeTtcbiAgICAgIH0sXG4gICAgICBnZXRPdmVybGF5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoT3ZlcmxheTtcbiAgICAgIH0sXG4gICAgICBzZXRPdmVybGF5OiBmdW5jdGlvbihvdmVybGF5KSB7XG4gICAgICAgIHRoaXMuc2VhcmNoT3ZlcmxheSA9IG92ZXJsYXk7XG4gICAgICB9LFxuICAgICAgaXNSZXZlcnNlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB2aW1HbG9iYWxTdGF0ZS5pc1JldmVyc2VkO1xuICAgICAgfSxcbiAgICAgIHNldFJldmVyc2VkOiBmdW5jdGlvbihyZXZlcnNlZCkge1xuICAgICAgICB2aW1HbG9iYWxTdGF0ZS5pc1JldmVyc2VkID0gcmV2ZXJzZWQ7XG4gICAgICB9LFxuICAgICAgZ2V0U2Nyb2xsYmFyQW5ub3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbm5vdGF0ZTtcbiAgICAgIH0sXG4gICAgICBzZXRTY3JvbGxiYXJBbm5vdGF0ZTogZnVuY3Rpb24oYW5ub3RhdGUpIHtcbiAgICAgICAgdGhpcy5hbm5vdGF0ZSA9IGFubm90YXRlO1xuICAgICAgfVxuICAgIH07XG4gICAgZnVuY3Rpb24gZ2V0U2VhcmNoU3RhdGUoY20pIHtcbiAgICAgIHZhciB2aW0gPSBjbS5zdGF0ZS52aW07XG4gICAgICByZXR1cm4gdmltLnNlYXJjaFN0YXRlXyB8fCAodmltLnNlYXJjaFN0YXRlXyA9IG5ldyBTZWFyY2hTdGF0ZSgpKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZGlhbG9nKGNtLCB0ZW1wbGF0ZSwgc2hvcnRUZXh0LCBvbkNsb3NlLCBvcHRpb25zKSB7XG4gICAgICBpZiAoY20ub3BlbkRpYWxvZykge1xuICAgICAgICBjbS5vcGVuRGlhbG9nKHRlbXBsYXRlLCBvbkNsb3NlLCB7IGJvdHRvbTogdHJ1ZSwgdmFsdWU6IG9wdGlvbnMudmFsdWUsXG4gICAgICAgICAgICBvbktleURvd246IG9wdGlvbnMub25LZXlEb3duLCBvbktleVVwOiBvcHRpb25zLm9uS2V5VXAsXG4gICAgICAgICAgICBzZWxlY3RWYWx1ZU9uT3BlbjogZmFsc2V9KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBvbkNsb3NlKHByb21wdChzaG9ydFRleHQsICcnKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNwbGl0QnlTbGFzaChhcmdTdHJpbmcpIHtcbiAgICAgIHJldHVybiBzcGxpdEJ5U2VwYXJhdG9yKGFyZ1N0cmluZywgJy8nKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5kVW5lc2NhcGVkU2xhc2hlcyhhcmdTdHJpbmcpIHtcbiAgICAgIHJldHVybiBmaW5kVW5lc2NhcGVkU2VwYXJhdG9ycyhhcmdTdHJpbmcsICcvJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3BsaXRCeVNlcGFyYXRvcihhcmdTdHJpbmcsIHNlcGFyYXRvcikge1xuICAgICAgdmFyIHNsYXNoZXMgPSBmaW5kVW5lc2NhcGVkU2VwYXJhdG9ycyhhcmdTdHJpbmcsIHNlcGFyYXRvcikgfHwgW107XG4gICAgICBpZiAoIXNsYXNoZXMubGVuZ3RoKSByZXR1cm4gW107XG4gICAgICB2YXIgdG9rZW5zID0gW107XG4gICAgICAvLyBpbiBjYXNlIG9mIHN0cmluZ3MgbGlrZSBmb28vYmFyXG4gICAgICBpZiAoc2xhc2hlc1swXSAhPT0gMCkgcmV0dXJuO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGFzaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2xhc2hlc1tpXSA9PSAnbnVtYmVyJylcbiAgICAgICAgICB0b2tlbnMucHVzaChhcmdTdHJpbmcuc3Vic3RyaW5nKHNsYXNoZXNbaV0gKyAxLCBzbGFzaGVzW2krMV0pKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b2tlbnM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmluZFVuZXNjYXBlZFNlcGFyYXRvcnMoc3RyLCBzZXBhcmF0b3IpIHtcbiAgICAgIGlmICghc2VwYXJhdG9yKVxuICAgICAgICBzZXBhcmF0b3IgPSAnLyc7XG5cbiAgICAgIHZhciBlc2NhcGVOZXh0Q2hhciA9IGZhbHNlO1xuICAgICAgdmFyIHNsYXNoZXMgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjID0gc3RyLmNoYXJBdChpKTtcbiAgICAgICAgaWYgKCFlc2NhcGVOZXh0Q2hhciAmJiBjID09IHNlcGFyYXRvcikge1xuICAgICAgICAgIHNsYXNoZXMucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgICBlc2NhcGVOZXh0Q2hhciA9ICFlc2NhcGVOZXh0Q2hhciAmJiAoYyA9PSAnXFxcXCcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNsYXNoZXM7XG4gICAgfVxuXG4gICAgLy8gVHJhbnNsYXRlcyBhIHNlYXJjaCBzdHJpbmcgZnJvbSBleCAodmltKSBzeW50YXggaW50byBqYXZhc2NyaXB0IGZvcm0uXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlUmVnZXgoc3RyKSB7XG4gICAgICAvLyBXaGVuIHRoZXNlIG1hdGNoLCBhZGQgYSAnXFwnIGlmIHVuZXNjYXBlZCBvciByZW1vdmUgb25lIGlmIGVzY2FwZWQuXG4gICAgICB2YXIgc3BlY2lhbHMgPSAnfCgpeyc7XG4gICAgICAvLyBSZW1vdmUsIGJ1dCBuZXZlciBhZGQsIGEgJ1xcJyBmb3IgdGhlc2UuXG4gICAgICB2YXIgdW5lc2NhcGUgPSAnfSc7XG4gICAgICB2YXIgZXNjYXBlTmV4dENoYXIgPSBmYWxzZTtcbiAgICAgIHZhciBvdXQgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAtMTsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYyA9IHN0ci5jaGFyQXQoaSkgfHwgJyc7XG4gICAgICAgIHZhciBuID0gc3RyLmNoYXJBdChpKzEpIHx8ICcnO1xuICAgICAgICB2YXIgc3BlY2lhbENvbWVzTmV4dCA9IChuICYmIHNwZWNpYWxzLmluZGV4T2YobikgIT0gLTEpO1xuICAgICAgICBpZiAoZXNjYXBlTmV4dENoYXIpIHtcbiAgICAgICAgICBpZiAoYyAhPT0gJ1xcXFwnIHx8ICFzcGVjaWFsQ29tZXNOZXh0KSB7XG4gICAgICAgICAgICBvdXQucHVzaChjKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZXNjYXBlTmV4dENoYXIgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoYyA9PT0gJ1xcXFwnKSB7XG4gICAgICAgICAgICBlc2NhcGVOZXh0Q2hhciA9IHRydWU7XG4gICAgICAgICAgICAvLyBUcmVhdCB0aGUgdW5lc2NhcGUgbGlzdCBhcyBzcGVjaWFsIGZvciByZW1vdmluZywgYnV0IG5vdCBhZGRpbmcgJ1xcJy5cbiAgICAgICAgICAgIGlmIChuICYmIHVuZXNjYXBlLmluZGV4T2YobikgIT0gLTEpIHtcbiAgICAgICAgICAgICAgc3BlY2lhbENvbWVzTmV4dCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBOb3QgcGFzc2luZyB0aGlzIHRlc3QgbWVhbnMgcmVtb3ZpbmcgYSAnXFwnLlxuICAgICAgICAgICAgaWYgKCFzcGVjaWFsQ29tZXNOZXh0IHx8IG4gPT09ICdcXFxcJykge1xuICAgICAgICAgICAgICBvdXQucHVzaChjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0LnB1c2goYyk7XG4gICAgICAgICAgICBpZiAoc3BlY2lhbENvbWVzTmV4dCAmJiBuICE9PSAnXFxcXCcpIHtcbiAgICAgICAgICAgICAgb3V0LnB1c2goJ1xcXFwnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXQuam9pbignJyk7XG4gICAgfVxuXG4gICAgLy8gVHJhbnNsYXRlcyB0aGUgcmVwbGFjZSBwYXJ0IG9mIGEgc2VhcmNoIGFuZCByZXBsYWNlIGZyb20gZXggKHZpbSkgc3ludGF4IGludG9cbiAgICAvLyBqYXZhc2NyaXB0IGZvcm0uICBTaW1pbGFyIHRvIHRyYW5zbGF0ZVJlZ2V4LCBidXQgYWRkaXRpb25hbGx5IGZpeGVzIGJhY2sgcmVmZXJlbmNlc1xuICAgIC8vICh0cmFuc2xhdGVzICdcXFswLi45XScgdG8gJyRbMC4uOV0nKSBhbmQgZm9sbG93cyBkaWZmZXJlbnQgcnVsZXMgZm9yIGVzY2FwaW5nICckJy5cbiAgICB2YXIgY2hhclVuZXNjYXBlcyA9IHsnXFxcXG4nOiAnXFxuJywgJ1xcXFxyJzogJ1xccicsICdcXFxcdCc6ICdcXHQnfTtcbiAgICBmdW5jdGlvbiB0cmFuc2xhdGVSZWdleFJlcGxhY2Uoc3RyKSB7XG4gICAgICB2YXIgZXNjYXBlTmV4dENoYXIgPSBmYWxzZTtcbiAgICAgIHZhciBvdXQgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAtMTsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYyA9IHN0ci5jaGFyQXQoaSkgfHwgJyc7XG4gICAgICAgIHZhciBuID0gc3RyLmNoYXJBdChpKzEpIHx8ICcnO1xuICAgICAgICBpZiAoY2hhclVuZXNjYXBlc1tjICsgbl0pIHtcbiAgICAgICAgICBvdXQucHVzaChjaGFyVW5lc2NhcGVzW2Mrbl0pO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfSBlbHNlIGlmIChlc2NhcGVOZXh0Q2hhcikge1xuICAgICAgICAgIC8vIEF0IGFueSBwb2ludCBpbiB0aGUgbG9vcCwgZXNjYXBlTmV4dENoYXIgaXMgdHJ1ZSBpZiB0aGUgcHJldmlvdXNcbiAgICAgICAgICAvLyBjaGFyYWN0ZXIgd2FzIGEgJ1xcJyBhbmQgd2FzIG5vdCBlc2NhcGVkLlxuICAgICAgICAgIG91dC5wdXNoKGMpO1xuICAgICAgICAgIGVzY2FwZU5leHRDaGFyID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGMgPT09ICdcXFxcJykge1xuICAgICAgICAgICAgZXNjYXBlTmV4dENoYXIgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKChpc051bWJlcihuKSB8fCBuID09PSAnJCcpKSB7XG4gICAgICAgICAgICAgIG91dC5wdXNoKCckJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG4gIT09ICcvJyAmJiBuICE9PSAnXFxcXCcpIHtcbiAgICAgICAgICAgICAgb3V0LnB1c2goJ1xcXFwnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGMgPT09ICckJykge1xuICAgICAgICAgICAgICBvdXQucHVzaCgnJCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3V0LnB1c2goYyk7XG4gICAgICAgICAgICBpZiAobiA9PT0gJy8nKSB7XG4gICAgICAgICAgICAgIG91dC5wdXNoKCdcXFxcJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0LmpvaW4oJycpO1xuICAgIH1cblxuICAgIC8vIFVuZXNjYXBlIFxcIGFuZCAvIGluIHRoZSByZXBsYWNlIHBhcnQsIGZvciBQQ1JFIG1vZGUuXG4gICAgdmFyIHVuZXNjYXBlcyA9IHsnXFxcXC8nOiAnLycsICdcXFxcXFxcXCc6ICdcXFxcJywgJ1xcXFxuJzogJ1xcbicsICdcXFxccic6ICdcXHInLCAnXFxcXHQnOiAnXFx0J307XG4gICAgZnVuY3Rpb24gdW5lc2NhcGVSZWdleFJlcGxhY2Uoc3RyKSB7XG4gICAgICB2YXIgc3RyZWFtID0gbmV3IENvZGVNaXJyb3IuU3RyaW5nU3RyZWFtKHN0cik7XG4gICAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgICB3aGlsZSAoIXN0cmVhbS5lb2woKSkge1xuICAgICAgICAvLyBTZWFyY2ggZm9yIFxcLlxuICAgICAgICB3aGlsZSAoc3RyZWFtLnBlZWsoKSAmJiBzdHJlYW0ucGVlaygpICE9ICdcXFxcJykge1xuICAgICAgICAgIG91dHB1dC5wdXNoKHN0cmVhbS5uZXh0KCkpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtYXRjaGVkID0gZmFsc2U7XG4gICAgICAgIGZvciAodmFyIG1hdGNoZXIgaW4gdW5lc2NhcGVzKSB7XG4gICAgICAgICAgaWYgKHN0cmVhbS5tYXRjaChtYXRjaGVyLCB0cnVlKSkge1xuICAgICAgICAgICAgbWF0Y2hlZCA9IHRydWU7XG4gICAgICAgICAgICBvdXRwdXQucHVzaCh1bmVzY2FwZXNbbWF0Y2hlcl0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghbWF0Y2hlZCkge1xuICAgICAgICAgIC8vIERvbid0IGNoYW5nZSBhbnl0aGluZ1xuICAgICAgICAgIG91dHB1dC5wdXNoKHN0cmVhbS5uZXh0KCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0LmpvaW4oJycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4dHJhY3QgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiBmcm9tIHRoZSBxdWVyeSBhbmQgcmV0dXJuIGEgUmVnZXhwIG9iamVjdC5cbiAgICAgKiBSZXR1cm5zIG51bGwgaWYgdGhlIHF1ZXJ5IGlzIGJsYW5rLlxuICAgICAqIElmIGlnbm9yZUNhc2UgaXMgcGFzc2VkIGluLCB0aGUgUmVnZXhwIG9iamVjdCB3aWxsIGhhdmUgdGhlICdpJyBmbGFnIHNldC5cbiAgICAgKiBJZiBzbWFydENhc2UgaXMgcGFzc2VkIGluLCBhbmQgdGhlIHF1ZXJ5IGNvbnRhaW5zIHVwcGVyIGNhc2UgbGV0dGVycyxcbiAgICAgKiAgIHRoZW4gaWdub3JlQ2FzZSBpcyBvdmVycmlkZGVuLCBhbmQgdGhlICdpJyBmbGFnIHdpbGwgbm90IGJlIHNldC5cbiAgICAgKiBJZiB0aGUgcXVlcnkgY29udGFpbnMgdGhlIC9pIGluIHRoZSBmbGFnIHBhcnQgb2YgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbixcbiAgICAgKiAgIHRoZW4gYm90aCBpZ25vcmVDYXNlIGFuZCBzbWFydENhc2UgYXJlIGlnbm9yZWQsIGFuZCAnaScgd2lsbCBiZSBwYXNzZWRcbiAgICAgKiAgIHRocm91Z2ggdG8gdGhlIFJlZ2V4IG9iamVjdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwYXJzZVF1ZXJ5KHF1ZXJ5LCBpZ25vcmVDYXNlLCBzbWFydENhc2UpIHtcbiAgICAgIC8vIEZpcnN0IHVwZGF0ZSB0aGUgbGFzdCBzZWFyY2ggcmVnaXN0ZXJcbiAgICAgIHZhciBsYXN0U2VhcmNoUmVnaXN0ZXIgPSB2aW1HbG9iYWxTdGF0ZS5yZWdpc3RlckNvbnRyb2xsZXIuZ2V0UmVnaXN0ZXIoJy8nKTtcbiAgICAgIGxhc3RTZWFyY2hSZWdpc3Rlci5zZXRUZXh0KHF1ZXJ5KTtcbiAgICAgIC8vIENoZWNrIGlmIHRoZSBxdWVyeSBpcyBhbHJlYWR5IGEgcmVnZXguXG4gICAgICBpZiAocXVlcnkgaW5zdGFuY2VvZiBSZWdFeHApIHsgcmV0dXJuIHF1ZXJ5OyB9XG4gICAgICAvLyBGaXJzdCB0cnkgdG8gZXh0cmFjdCByZWdleCArIGZsYWdzIGZyb20gdGhlIGlucHV0LiBJZiBubyBmbGFncyBmb3VuZCxcbiAgICAgIC8vIGV4dHJhY3QganVzdCB0aGUgcmVnZXguIElFIGRvZXMgbm90IGFjY2VwdCBmbGFncyBkaXJlY3RseSBkZWZpbmVkIGluXG4gICAgICAvLyB0aGUgcmVnZXggc3RyaW5nIGluIHRoZSBmb3JtIC9yZWdleC9mbGFnc1xuICAgICAgdmFyIHNsYXNoZXMgPSBmaW5kVW5lc2NhcGVkU2xhc2hlcyhxdWVyeSk7XG4gICAgICB2YXIgcmVnZXhQYXJ0O1xuICAgICAgdmFyIGZvcmNlSWdub3JlQ2FzZTtcbiAgICAgIGlmICghc2xhc2hlcy5sZW5ndGgpIHtcbiAgICAgICAgLy8gUXVlcnkgbG9va3MgbGlrZSAncmVnZXhwJ1xuICAgICAgICByZWdleFBhcnQgPSBxdWVyeTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFF1ZXJ5IGxvb2tzIGxpa2UgJ3JlZ2V4cC8uLi4nXG4gICAgICAgIHJlZ2V4UGFydCA9IHF1ZXJ5LnN1YnN0cmluZygwLCBzbGFzaGVzWzBdKTtcbiAgICAgICAgdmFyIGZsYWdzUGFydCA9IHF1ZXJ5LnN1YnN0cmluZyhzbGFzaGVzWzBdKTtcbiAgICAgICAgZm9yY2VJZ25vcmVDYXNlID0gKGZsYWdzUGFydC5pbmRleE9mKCdpJykgIT0gLTEpO1xuICAgICAgfVxuICAgICAgaWYgKCFyZWdleFBhcnQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBpZiAoIWdldE9wdGlvbigncGNyZScpKSB7XG4gICAgICAgIHJlZ2V4UGFydCA9IHRyYW5zbGF0ZVJlZ2V4KHJlZ2V4UGFydCk7XG4gICAgICB9XG4gICAgICBpZiAoc21hcnRDYXNlKSB7XG4gICAgICAgIGlnbm9yZUNhc2UgPSAoL15bXkEtWl0qJC8pLnRlc3QocmVnZXhQYXJ0KTtcbiAgICAgIH1cbiAgICAgIHZhciByZWdleHAgPSBuZXcgUmVnRXhwKHJlZ2V4UGFydCxcbiAgICAgICAgICAoaWdub3JlQ2FzZSB8fCBmb3JjZUlnbm9yZUNhc2UpID8gJ2knIDogdW5kZWZpbmVkKTtcbiAgICAgIHJldHVybiByZWdleHA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNob3dDb25maXJtKGNtLCB0ZXh0KSB7XG4gICAgICBpZiAoY20ub3Blbk5vdGlmaWNhdGlvbikge1xuICAgICAgICBjbS5vcGVuTm90aWZpY2F0aW9uKCc8c3BhbiBzdHlsZT1cImNvbG9yOiByZWRcIj4nICsgdGV4dCArICc8L3NwYW4+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Ym90dG9tOiB0cnVlLCBkdXJhdGlvbjogNTAwMH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxlcnQodGV4dCk7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIG1ha2VQcm9tcHQocHJlZml4LCBkZXNjKSB7XG4gICAgICB2YXIgcmF3ID0gJzxzcGFuIHN0eWxlPVwiZm9udC1mYW1pbHk6IG1vbm9zcGFjZTsgd2hpdGUtc3BhY2U6IHByZVwiPicgK1xuICAgICAgICAgIChwcmVmaXggfHwgXCJcIikgKyAnPGlucHV0IHR5cGU9XCJ0ZXh0XCI+PC9zcGFuPic7XG4gICAgICBpZiAoZGVzYylcbiAgICAgICAgcmF3ICs9ICcgPHNwYW4gc3R5bGU9XCJjb2xvcjogIzg4OFwiPicgKyBkZXNjICsgJzwvc3Bhbj4nO1xuICAgICAgcmV0dXJuIHJhdztcbiAgICB9XG4gICAgdmFyIHNlYXJjaFByb21wdERlc2MgPSAnKEphdmFzY3JpcHQgcmVnZXhwKSc7XG4gICAgZnVuY3Rpb24gc2hvd1Byb21wdChjbSwgb3B0aW9ucykge1xuICAgICAgdmFyIHNob3J0VGV4dCA9IChvcHRpb25zLnByZWZpeCB8fCAnJykgKyAnICcgKyAob3B0aW9ucy5kZXNjIHx8ICcnKTtcbiAgICAgIHZhciBwcm9tcHQgPSBtYWtlUHJvbXB0KG9wdGlvbnMucHJlZml4LCBvcHRpb25zLmRlc2MpO1xuICAgICAgZGlhbG9nKGNtLCBwcm9tcHQsIHNob3J0VGV4dCwgb3B0aW9ucy5vbkNsb3NlLCBvcHRpb25zKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVnZXhFcXVhbChyMSwgcjIpIHtcbiAgICAgIGlmIChyMSBpbnN0YW5jZW9mIFJlZ0V4cCAmJiByMiBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgIHZhciBwcm9wcyA9IFsnZ2xvYmFsJywgJ211bHRpbGluZScsICdpZ25vcmVDYXNlJywgJ3NvdXJjZSddO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgdmFyIHByb3AgPSBwcm9wc1tpXTtcbiAgICAgICAgICAgICAgaWYgKHIxW3Byb3BdICE9PSByMltwcm9wXSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBSZXR1cm5zIHRydWUgaWYgdGhlIHF1ZXJ5IGlzIHZhbGlkLlxuICAgIGZ1bmN0aW9uIHVwZGF0ZVNlYXJjaFF1ZXJ5KGNtLCByYXdRdWVyeSwgaWdub3JlQ2FzZSwgc21hcnRDYXNlKSB7XG4gICAgICBpZiAoIXJhd1F1ZXJ5KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBzdGF0ZSA9IGdldFNlYXJjaFN0YXRlKGNtKTtcbiAgICAgIHZhciBxdWVyeSA9IHBhcnNlUXVlcnkocmF3UXVlcnksICEhaWdub3JlQ2FzZSwgISFzbWFydENhc2UpO1xuICAgICAgaWYgKCFxdWVyeSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBoaWdobGlnaHRTZWFyY2hNYXRjaGVzKGNtLCBxdWVyeSk7XG4gICAgICBpZiAocmVnZXhFcXVhbChxdWVyeSwgc3RhdGUuZ2V0UXVlcnkoKSkpIHtcbiAgICAgICAgcmV0dXJuIHF1ZXJ5O1xuICAgICAgfVxuICAgICAgc3RhdGUuc2V0UXVlcnkocXVlcnkpO1xuICAgICAgcmV0dXJuIHF1ZXJ5O1xuICAgIH1cbiAgICBmdW5jdGlvbiBzZWFyY2hPdmVybGF5KHF1ZXJ5KSB7XG4gICAgICBpZiAocXVlcnkuc291cmNlLmNoYXJBdCgwKSA9PSAnXicpIHtcbiAgICAgICAgdmFyIG1hdGNoU29sID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRva2VuOiBmdW5jdGlvbihzdHJlYW0pIHtcbiAgICAgICAgICBpZiAobWF0Y2hTb2wgJiYgIXN0cmVhbS5zb2woKSkge1xuICAgICAgICAgICAgc3RyZWFtLnNraXBUb0VuZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgbWF0Y2ggPSBzdHJlYW0ubWF0Y2gocXVlcnksIGZhbHNlKTtcbiAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIGlmIChtYXRjaFswXS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAvLyBNYXRjaGVkIGVtcHR5IHN0cmluZywgc2tpcCB0byBuZXh0LlxuICAgICAgICAgICAgICBzdHJlYW0ubmV4dCgpO1xuICAgICAgICAgICAgICByZXR1cm4gJ3NlYXJjaGluZyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXN0cmVhbS5zb2woKSkge1xuICAgICAgICAgICAgICAvLyBCYWNrdHJhY2sgMSB0byBtYXRjaCBcXGJcbiAgICAgICAgICAgICAgc3RyZWFtLmJhY2tVcCgxKTtcbiAgICAgICAgICAgICAgaWYgKCFxdWVyeS5leGVjKHN0cmVhbS5uZXh0KCkgKyBtYXRjaFswXSkpIHtcbiAgICAgICAgICAgICAgICBzdHJlYW0ubmV4dCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdHJlYW0ubWF0Y2gocXVlcnkpO1xuICAgICAgICAgICAgcmV0dXJuICdzZWFyY2hpbmcnO1xuICAgICAgICAgIH1cbiAgICAgICAgICB3aGlsZSAoIXN0cmVhbS5lb2woKSkge1xuICAgICAgICAgICAgc3RyZWFtLm5leHQoKTtcbiAgICAgICAgICAgIGlmIChzdHJlYW0ubWF0Y2gocXVlcnksIGZhbHNlKSkgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBxdWVyeTogcXVlcnlcbiAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGhpZ2hsaWdodFNlYXJjaE1hdGNoZXMoY20sIHF1ZXJ5KSB7XG4gICAgICB2YXIgc2VhcmNoU3RhdGUgPSBnZXRTZWFyY2hTdGF0ZShjbSk7XG4gICAgICB2YXIgb3ZlcmxheSA9IHNlYXJjaFN0YXRlLmdldE92ZXJsYXkoKTtcbiAgICAgIGlmICghb3ZlcmxheSB8fCBxdWVyeSAhPSBvdmVybGF5LnF1ZXJ5KSB7XG4gICAgICAgIGlmIChvdmVybGF5KSB7XG4gICAgICAgICAgY20ucmVtb3ZlT3ZlcmxheShvdmVybGF5KTtcbiAgICAgICAgfVxuICAgICAgICBvdmVybGF5ID0gc2VhcmNoT3ZlcmxheShxdWVyeSk7XG4gICAgICAgIGNtLmFkZE92ZXJsYXkob3ZlcmxheSk7XG4gICAgICAgIGlmIChjbS5zaG93TWF0Y2hlc09uU2Nyb2xsYmFyKSB7XG4gICAgICAgICAgaWYgKHNlYXJjaFN0YXRlLmdldFNjcm9sbGJhckFubm90YXRlKCkpIHtcbiAgICAgICAgICAgIHNlYXJjaFN0YXRlLmdldFNjcm9sbGJhckFubm90YXRlKCkuY2xlYXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2VhcmNoU3RhdGUuc2V0U2Nyb2xsYmFyQW5ub3RhdGUoY20uc2hvd01hdGNoZXNPblNjcm9sbGJhcihxdWVyeSkpO1xuICAgICAgICB9XG4gICAgICAgIHNlYXJjaFN0YXRlLnNldE92ZXJsYXkob3ZlcmxheSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZpbmROZXh0KGNtLCBwcmV2LCBxdWVyeSwgcmVwZWF0KSB7XG4gICAgICBpZiAocmVwZWF0ID09PSB1bmRlZmluZWQpIHsgcmVwZWF0ID0gMTsgfVxuICAgICAgcmV0dXJuIGNtLm9wZXJhdGlvbihmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHBvcyA9IGNtLmdldEN1cnNvcigpO1xuICAgICAgICB2YXIgY3Vyc29yID0gY20uZ2V0U2VhcmNoQ3Vyc29yKHF1ZXJ5LCBwb3MpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlcGVhdDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGZvdW5kID0gY3Vyc29yLmZpbmQocHJldik7XG4gICAgICAgICAgaWYgKGkgPT0gMCAmJiBmb3VuZCAmJiBjdXJzb3JFcXVhbChjdXJzb3IuZnJvbSgpLCBwb3MpKSB7IGZvdW5kID0gY3Vyc29yLmZpbmQocHJldik7IH1cbiAgICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICAvLyBTZWFyY2hDdXJzb3IgbWF5IGhhdmUgcmV0dXJuZWQgbnVsbCBiZWNhdXNlIGl0IGhpdCBFT0YsIHdyYXBcbiAgICAgICAgICAgIC8vIGFyb3VuZCBhbmQgdHJ5IGFnYWluLlxuICAgICAgICAgICAgY3Vyc29yID0gY20uZ2V0U2VhcmNoQ3Vyc29yKHF1ZXJ5LFxuICAgICAgICAgICAgICAgIChwcmV2KSA/IFBvcyhjbS5sYXN0TGluZSgpKSA6IFBvcyhjbS5maXJzdExpbmUoKSwgMCkgKTtcbiAgICAgICAgICAgIGlmICghY3Vyc29yLmZpbmQocHJldikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3Vyc29yLmZyb20oKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjbGVhclNlYXJjaEhpZ2hsaWdodChjbSkge1xuICAgICAgdmFyIHN0YXRlID0gZ2V0U2VhcmNoU3RhdGUoY20pO1xuICAgICAgY20ucmVtb3ZlT3ZlcmxheShnZXRTZWFyY2hTdGF0ZShjbSkuZ2V0T3ZlcmxheSgpKTtcbiAgICAgIHN0YXRlLnNldE92ZXJsYXkobnVsbCk7XG4gICAgICBpZiAoc3RhdGUuZ2V0U2Nyb2xsYmFyQW5ub3RhdGUoKSkge1xuICAgICAgICBzdGF0ZS5nZXRTY3JvbGxiYXJBbm5vdGF0ZSgpLmNsZWFyKCk7XG4gICAgICAgIHN0YXRlLnNldFNjcm9sbGJhckFubm90YXRlKG51bGwpO1xuICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBwb3MgaXMgaW4gdGhlIHNwZWNpZmllZCByYW5nZSwgSU5DTFVTSVZFLlxuICAgICAqIFJhbmdlIGNhbiBiZSBzcGVjaWZpZWQgd2l0aCAxIG9yIDIgYXJndW1lbnRzLlxuICAgICAqIElmIHRoZSBmaXJzdCByYW5nZSBhcmd1bWVudCBpcyBhbiBhcnJheSwgdHJlYXQgaXQgYXMgYW4gYXJyYXkgb2YgbGluZVxuICAgICAqIG51bWJlcnMuIE1hdGNoIHBvcyBhZ2FpbnN0IGFueSBvZiB0aGUgbGluZXMuXG4gICAgICogSWYgdGhlIGZpcnN0IHJhbmdlIGFyZ3VtZW50IGlzIGEgbnVtYmVyLFxuICAgICAqICAgaWYgdGhlcmUgaXMgb25seSAxIHJhbmdlIGFyZ3VtZW50LCBjaGVjayBpZiBwb3MgaGFzIHRoZSBzYW1lIGxpbmVcbiAgICAgKiAgICAgICBudW1iZXJcbiAgICAgKiAgIGlmIHRoZXJlIGFyZSAyIHJhbmdlIGFyZ3VtZW50cywgdGhlbiBjaGVjayBpZiBwb3MgaXMgaW4gYmV0d2VlbiB0aGUgdHdvXG4gICAgICogICAgICAgcmFuZ2UgYXJndW1lbnRzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzSW5SYW5nZShwb3MsIHN0YXJ0LCBlbmQpIHtcbiAgICAgIGlmICh0eXBlb2YgcG9zICE9ICdudW1iZXInKSB7XG4gICAgICAgIC8vIEFzc3VtZSBpdCBpcyBhIGN1cnNvciBwb3NpdGlvbi4gR2V0IHRoZSBsaW5lIG51bWJlci5cbiAgICAgICAgcG9zID0gcG9zLmxpbmU7XG4gICAgICB9XG4gICAgICBpZiAoc3RhcnQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICByZXR1cm4gaW5BcnJheShwb3MsIHN0YXJ0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChlbmQpIHtcbiAgICAgICAgICByZXR1cm4gKHBvcyA+PSBzdGFydCAmJiBwb3MgPD0gZW5kKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcG9zID09IHN0YXJ0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldFVzZXJWaXNpYmxlTGluZXMoY20pIHtcbiAgICAgIHZhciBzY3JvbGxJbmZvID0gY20uZ2V0U2Nyb2xsSW5mbygpO1xuICAgICAgdmFyIG9jY2x1ZGVUb2xlcmFuY2VUb3AgPSA2O1xuICAgICAgdmFyIG9jY2x1ZGVUb2xlcmFuY2VCb3R0b20gPSAxMDtcbiAgICAgIHZhciBmcm9tID0gY20uY29vcmRzQ2hhcih7bGVmdDowLCB0b3A6IG9jY2x1ZGVUb2xlcmFuY2VUb3AgKyBzY3JvbGxJbmZvLnRvcH0sICdsb2NhbCcpO1xuICAgICAgdmFyIGJvdHRvbVkgPSBzY3JvbGxJbmZvLmNsaWVudEhlaWdodCAtIG9jY2x1ZGVUb2xlcmFuY2VCb3R0b20gKyBzY3JvbGxJbmZvLnRvcDtcbiAgICAgIHZhciB0byA9IGNtLmNvb3Jkc0NoYXIoe2xlZnQ6MCwgdG9wOiBib3R0b21ZfSwgJ2xvY2FsJyk7XG4gICAgICByZXR1cm4ge3RvcDogZnJvbS5saW5lLCBib3R0b206IHRvLmxpbmV9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE1hcmtQb3MoY20sIHZpbSwgbWFya05hbWUpIHtcbiAgICAgIGlmIChtYXJrTmFtZSA9PSAnXFwnJykge1xuICAgICAgICB2YXIgaGlzdG9yeSA9IGNtLmRvYy5oaXN0b3J5LmRvbmU7XG4gICAgICAgIHZhciBldmVudCA9IGhpc3RvcnlbaGlzdG9yeS5sZW5ndGggLSAyXTtcbiAgICAgICAgcmV0dXJuIGV2ZW50ICYmIGV2ZW50LnJhbmdlcyAmJiBldmVudC5yYW5nZXNbMF0uaGVhZDtcbiAgICAgIH0gZWxzZSBpZiAobWFya05hbWUgPT0gJy4nKSB7XG4gICAgICAgIGlmIChjbS5kb2MuaGlzdG9yeS5sYXN0TW9kVGltZSA9PSAwKSB7XG4gICAgICAgICAgcmV0dXJuICAvLyBJZiBubyBjaGFuZ2VzLCBiYWlsIG91dDsgZG9uJ3QgYm90aGVyIHRvIGNvcHkgb3IgcmV2ZXJzZSBoaXN0b3J5IGFycmF5LlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBjaGFuZ2VIaXN0b3J5ID0gY20uZG9jLmhpc3RvcnkuZG9uZS5maWx0ZXIoZnVuY3Rpb24oZWwpeyBpZiAoZWwuY2hhbmdlcyAhPT0gdW5kZWZpbmVkKSB7IHJldHVybiBlbCB9IH0pO1xuICAgICAgICAgIGNoYW5nZUhpc3RvcnkucmV2ZXJzZSgpO1xuICAgICAgICAgIHZhciBsYXN0RWRpdFBvcyA9IGNoYW5nZUhpc3RvcnlbMF0uY2hhbmdlc1swXS50bztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGFzdEVkaXRQb3M7XG4gICAgICB9XG5cbiAgICAgIHZhciBtYXJrID0gdmltLm1hcmtzW21hcmtOYW1lXTtcbiAgICAgIHJldHVybiBtYXJrICYmIG1hcmsuZmluZCgpO1xuICAgIH1cblxuICAgIHZhciBFeENvbW1hbmREaXNwYXRjaGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmJ1aWxkQ29tbWFuZE1hcF8oKTtcbiAgICB9O1xuICAgIEV4Q29tbWFuZERpc3BhdGNoZXIucHJvdG90eXBlID0ge1xuICAgICAgcHJvY2Vzc0NvbW1hbmQ6IGZ1bmN0aW9uKGNtLCBpbnB1dCwgb3B0X3BhcmFtcykge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIGNtLm9wZXJhdGlvbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY20uY3VyT3AuaXNWaW1PcCA9IHRydWU7XG4gICAgICAgICAgdGhhdC5fcHJvY2Vzc0NvbW1hbmQoY20sIGlucHV0LCBvcHRfcGFyYW1zKTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgX3Byb2Nlc3NDb21tYW5kOiBmdW5jdGlvbihjbSwgaW5wdXQsIG9wdF9wYXJhbXMpIHtcbiAgICAgICAgdmFyIHZpbSA9IGNtLnN0YXRlLnZpbTtcbiAgICAgICAgdmFyIGNvbW1hbmRIaXN0b3J5UmVnaXN0ZXIgPSB2aW1HbG9iYWxTdGF0ZS5yZWdpc3RlckNvbnRyb2xsZXIuZ2V0UmVnaXN0ZXIoJzonKTtcbiAgICAgICAgdmFyIHByZXZpb3VzQ29tbWFuZCA9IGNvbW1hbmRIaXN0b3J5UmVnaXN0ZXIudG9TdHJpbmcoKTtcbiAgICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgICAgZXhpdFZpc3VhbE1vZGUoY20pO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpbnB1dFN0cmVhbSA9IG5ldyBDb2RlTWlycm9yLlN0cmluZ1N0cmVhbShpbnB1dCk7XG4gICAgICAgIC8vIHVwZGF0ZSBcIjogd2l0aCB0aGUgbGF0ZXN0IGNvbW1hbmQgd2hldGhlciB2YWxpZCBvciBpbnZhbGlkXG4gICAgICAgIGNvbW1hbmRIaXN0b3J5UmVnaXN0ZXIuc2V0VGV4dChpbnB1dCk7XG4gICAgICAgIHZhciBwYXJhbXMgPSBvcHRfcGFyYW1zIHx8IHt9O1xuICAgICAgICBwYXJhbXMuaW5wdXQgPSBpbnB1dDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGlzLnBhcnNlSW5wdXRfKGNtLCBpbnB1dFN0cmVhbSwgcGFyYW1zKTtcbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgc2hvd0NvbmZpcm0oY20sIGUpO1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvbW1hbmQ7XG4gICAgICAgIHZhciBjb21tYW5kTmFtZTtcbiAgICAgICAgaWYgKCFwYXJhbXMuY29tbWFuZE5hbWUpIHtcbiAgICAgICAgICAvLyBJZiBvbmx5IGEgbGluZSByYW5nZSBpcyBkZWZpbmVkLCBtb3ZlIHRvIHRoZSBsaW5lLlxuICAgICAgICAgIGlmIChwYXJhbXMubGluZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb21tYW5kTmFtZSA9ICdtb3ZlJztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29tbWFuZCA9IHRoaXMubWF0Y2hDb21tYW5kXyhwYXJhbXMuY29tbWFuZE5hbWUpO1xuICAgICAgICAgIGlmIChjb21tYW5kKSB7XG4gICAgICAgICAgICBjb21tYW5kTmFtZSA9IGNvbW1hbmQubmFtZTtcbiAgICAgICAgICAgIGlmIChjb21tYW5kLmV4Y2x1ZGVGcm9tQ29tbWFuZEhpc3RvcnkpIHtcbiAgICAgICAgICAgICAgY29tbWFuZEhpc3RvcnlSZWdpc3Rlci5zZXRUZXh0KHByZXZpb3VzQ29tbWFuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnBhcnNlQ29tbWFuZEFyZ3NfKGlucHV0U3RyZWFtLCBwYXJhbXMsIGNvbW1hbmQpO1xuICAgICAgICAgICAgaWYgKGNvbW1hbmQudHlwZSA9PSAnZXhUb0tleScpIHtcbiAgICAgICAgICAgICAgLy8gSGFuZGxlIEV4IHRvIEtleSBtYXBwaW5nLlxuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbW1hbmQudG9LZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgQ29kZU1pcnJvci5WaW0uaGFuZGxlS2V5KGNtLCBjb21tYW5kLnRvS2V5c1tpXSwgJ21hcHBpbmcnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQudHlwZSA9PSAnZXhUb0V4Jykge1xuICAgICAgICAgICAgICAvLyBIYW5kbGUgRXggdG8gRXggbWFwcGluZy5cbiAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzQ29tbWFuZChjbSwgY29tbWFuZC50b0lucHV0KTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNvbW1hbmROYW1lKSB7XG4gICAgICAgICAgc2hvd0NvbmZpcm0oY20sICdOb3QgYW4gZWRpdG9yIGNvbW1hbmQgXCI6JyArIGlucHV0ICsgJ1wiJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZXhDb21tYW5kc1tjb21tYW5kTmFtZV0oY20sIHBhcmFtcyk7XG4gICAgICAgICAgLy8gUG9zc2libHkgYXN5bmNocm9ub3VzIGNvbW1hbmRzIChlLmcuIHN1YnN0aXR1dGUsIHdoaWNoIG1pZ2h0IGhhdmUgYVxuICAgICAgICAgIC8vIHVzZXIgY29uZmlybWF0aW9uKSwgYXJlIHJlc3BvbnNpYmxlIGZvciBjYWxsaW5nIHRoZSBjYWxsYmFjayB3aGVuXG4gICAgICAgICAgLy8gZG9uZS4gQWxsIG90aGVycyBoYXZlIGl0IHRha2VuIGNhcmUgb2YgZm9yIHRoZW0gaGVyZS5cbiAgICAgICAgICBpZiAoKCFjb21tYW5kIHx8ICFjb21tYW5kLnBvc3NpYmx5QXN5bmMpICYmIHBhcmFtcy5jYWxsYmFjaykge1xuICAgICAgICAgICAgcGFyYW1zLmNhbGxiYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICBzaG93Q29uZmlybShjbSwgZSk7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHBhcnNlSW5wdXRfOiBmdW5jdGlvbihjbSwgaW5wdXRTdHJlYW0sIHJlc3VsdCkge1xuICAgICAgICBpbnB1dFN0cmVhbS5lYXRXaGlsZSgnOicpO1xuICAgICAgICAvLyBQYXJzZSByYW5nZS5cbiAgICAgICAgaWYgKGlucHV0U3RyZWFtLmVhdCgnJScpKSB7XG4gICAgICAgICAgcmVzdWx0LmxpbmUgPSBjbS5maXJzdExpbmUoKTtcbiAgICAgICAgICByZXN1bHQubGluZUVuZCA9IGNtLmxhc3RMaW5lKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0LmxpbmUgPSB0aGlzLnBhcnNlTGluZVNwZWNfKGNtLCBpbnB1dFN0cmVhbSk7XG4gICAgICAgICAgaWYgKHJlc3VsdC5saW5lICE9PSB1bmRlZmluZWQgJiYgaW5wdXRTdHJlYW0uZWF0KCcsJykpIHtcbiAgICAgICAgICAgIHJlc3VsdC5saW5lRW5kID0gdGhpcy5wYXJzZUxpbmVTcGVjXyhjbSwgaW5wdXRTdHJlYW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBhcnNlIGNvbW1hbmQgbmFtZS5cbiAgICAgICAgdmFyIGNvbW1hbmRNYXRjaCA9IGlucHV0U3RyZWFtLm1hdGNoKC9eKFxcdyspLyk7XG4gICAgICAgIGlmIChjb21tYW5kTWF0Y2gpIHtcbiAgICAgICAgICByZXN1bHQuY29tbWFuZE5hbWUgPSBjb21tYW5kTWF0Y2hbMV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0LmNvbW1hbmROYW1lID0gaW5wdXRTdHJlYW0ubWF0Y2goLy4qLylbMF07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSxcbiAgICAgIHBhcnNlTGluZVNwZWNfOiBmdW5jdGlvbihjbSwgaW5wdXRTdHJlYW0pIHtcbiAgICAgICAgdmFyIG51bWJlck1hdGNoID0gaW5wdXRTdHJlYW0ubWF0Y2goL14oXFxkKykvKTtcbiAgICAgICAgaWYgKG51bWJlck1hdGNoKSB7XG4gICAgICAgICAgLy8gQWJzb2x1dGUgbGluZSBudW1iZXIgcGx1cyBvZmZzZXQgKE4rTSBvciBOLU0pIGlzIHByb2JhYmx5IGEgdHlwbyxcbiAgICAgICAgICAvLyBub3Qgc29tZXRoaW5nIHRoZSB1c2VyIGFjdHVhbGx5IHdhbnRlZC4gKE5COiB2aW0gZG9lcyBhbGxvdyB0aGlzLilcbiAgICAgICAgICByZXR1cm4gcGFyc2VJbnQobnVtYmVyTWF0Y2hbMV0sIDEwKSAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChpbnB1dFN0cmVhbS5uZXh0KCkpIHtcbiAgICAgICAgICBjYXNlICcuJzpcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlTGluZVNwZWNPZmZzZXRfKGlucHV0U3RyZWFtLCBjbS5nZXRDdXJzb3IoKS5saW5lKTtcbiAgICAgICAgICBjYXNlICckJzpcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlTGluZVNwZWNPZmZzZXRfKGlucHV0U3RyZWFtLCBjbS5sYXN0TGluZSgpKTtcbiAgICAgICAgICBjYXNlICdcXCcnOlxuICAgICAgICAgICAgdmFyIG1hcmtOYW1lID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICAgICAgICAgICAgdmFyIG1hcmtQb3MgPSBnZXRNYXJrUG9zKGNtLCBjbS5zdGF0ZS52aW0sIG1hcmtOYW1lKTtcbiAgICAgICAgICAgIGlmICghbWFya1BvcykgdGhyb3cgbmV3IEVycm9yKCdNYXJrIG5vdCBzZXQnKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlTGluZVNwZWNPZmZzZXRfKGlucHV0U3RyZWFtLCBtYXJrUG9zLmxpbmUpO1xuICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgaW5wdXRTdHJlYW0uYmFja1VwKDEpO1xuICAgICAgICAgICAgLy8gT2Zmc2V0IGlzIHJlbGF0aXZlIHRvIGN1cnJlbnQgbGluZSBpZiBub3Qgb3RoZXJ3aXNlIHNwZWNpZmllZC5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlTGluZVNwZWNPZmZzZXRfKGlucHV0U3RyZWFtLCBjbS5nZXRDdXJzb3IoKS5saW5lKTtcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgaW5wdXRTdHJlYW0uYmFja1VwKDEpO1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHBhcnNlTGluZVNwZWNPZmZzZXRfOiBmdW5jdGlvbihpbnB1dFN0cmVhbSwgbGluZSkge1xuICAgICAgICB2YXIgb2Zmc2V0TWF0Y2ggPSBpbnB1dFN0cmVhbS5tYXRjaCgvXihbKy1dKT8oXFxkKykvKTtcbiAgICAgICAgaWYgKG9mZnNldE1hdGNoKSB7XG4gICAgICAgICAgdmFyIG9mZnNldCA9IHBhcnNlSW50KG9mZnNldE1hdGNoWzJdLCAxMCk7XG4gICAgICAgICAgaWYgKG9mZnNldE1hdGNoWzFdID09IFwiLVwiKSB7XG4gICAgICAgICAgICBsaW5lIC09IG9mZnNldDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGluZSArPSBvZmZzZXQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsaW5lO1xuICAgICAgfSxcbiAgICAgIHBhcnNlQ29tbWFuZEFyZ3NfOiBmdW5jdGlvbihpbnB1dFN0cmVhbSwgcGFyYW1zLCBjb21tYW5kKSB7XG4gICAgICAgIGlmIChpbnB1dFN0cmVhbS5lb2woKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBwYXJhbXMuYXJnU3RyaW5nID0gaW5wdXRTdHJlYW0ubWF0Y2goLy4qLylbMF07XG4gICAgICAgIC8vIFBhcnNlIGNvbW1hbmQtbGluZSBhcmd1bWVudHNcbiAgICAgICAgdmFyIGRlbGltID0gY29tbWFuZC5hcmdEZWxpbWl0ZXIgfHwgL1xccysvO1xuICAgICAgICB2YXIgYXJncyA9IHRyaW0ocGFyYW1zLmFyZ1N0cmluZykuc3BsaXQoZGVsaW0pO1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggJiYgYXJnc1swXSkge1xuICAgICAgICAgIHBhcmFtcy5hcmdzID0gYXJncztcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG1hdGNoQ29tbWFuZF86IGZ1bmN0aW9uKGNvbW1hbmROYW1lKSB7XG4gICAgICAgIC8vIFJldHVybiB0aGUgY29tbWFuZCBpbiB0aGUgY29tbWFuZCBtYXAgdGhhdCBtYXRjaGVzIHRoZSBzaG9ydGVzdFxuICAgICAgICAvLyBwcmVmaXggb2YgdGhlIHBhc3NlZCBpbiBjb21tYW5kIG5hbWUuIFRoZSBtYXRjaCBpcyBndWFyYW50ZWVkIHRvIGJlXG4gICAgICAgIC8vIHVuYW1iaWd1b3VzIGlmIHRoZSBkZWZhdWx0RXhDb21tYW5kTWFwJ3Mgc2hvcnROYW1lcyBhcmUgc2V0IHVwXG4gICAgICAgIC8vIGNvcnJlY3RseS4gKHNlZSBAY29kZXtkZWZhdWx0RXhDb21tYW5kTWFwfSkuXG4gICAgICAgIGZvciAodmFyIGkgPSBjb21tYW5kTmFtZS5sZW5ndGg7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICB2YXIgcHJlZml4ID0gY29tbWFuZE5hbWUuc3Vic3RyaW5nKDAsIGkpO1xuICAgICAgICAgIGlmICh0aGlzLmNvbW1hbmRNYXBfW3ByZWZpeF0pIHtcbiAgICAgICAgICAgIHZhciBjb21tYW5kID0gdGhpcy5jb21tYW5kTWFwX1twcmVmaXhdO1xuICAgICAgICAgICAgaWYgKGNvbW1hbmQubmFtZS5pbmRleE9mKGNvbW1hbmROYW1lKSA9PT0gMCkge1xuICAgICAgICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9LFxuICAgICAgYnVpbGRDb21tYW5kTWFwXzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuY29tbWFuZE1hcF8gPSB7fTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkZWZhdWx0RXhDb21tYW5kTWFwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGNvbW1hbmQgPSBkZWZhdWx0RXhDb21tYW5kTWFwW2ldO1xuICAgICAgICAgIHZhciBrZXkgPSBjb21tYW5kLnNob3J0TmFtZSB8fCBjb21tYW5kLm5hbWU7XG4gICAgICAgICAgdGhpcy5jb21tYW5kTWFwX1trZXldID0gY29tbWFuZDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG1hcDogZnVuY3Rpb24obGhzLCByaHMsIGN0eCkge1xuICAgICAgICBpZiAobGhzICE9ICc6JyAmJiBsaHMuY2hhckF0KDApID09ICc6Jykge1xuICAgICAgICAgIGlmIChjdHgpIHsgdGhyb3cgRXJyb3IoJ01vZGUgbm90IHN1cHBvcnRlZCBmb3IgZXggbWFwcGluZ3MnKTsgfVxuICAgICAgICAgIHZhciBjb21tYW5kTmFtZSA9IGxocy5zdWJzdHJpbmcoMSk7XG4gICAgICAgICAgaWYgKHJocyAhPSAnOicgJiYgcmhzLmNoYXJBdCgwKSA9PSAnOicpIHtcbiAgICAgICAgICAgIC8vIEV4IHRvIEV4IG1hcHBpbmdcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZE1hcF9bY29tbWFuZE5hbWVdID0ge1xuICAgICAgICAgICAgICBuYW1lOiBjb21tYW5kTmFtZSxcbiAgICAgICAgICAgICAgdHlwZTogJ2V4VG9FeCcsXG4gICAgICAgICAgICAgIHRvSW5wdXQ6IHJocy5zdWJzdHJpbmcoMSksXG4gICAgICAgICAgICAgIHVzZXI6IHRydWVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEV4IHRvIGtleSBtYXBwaW5nXG4gICAgICAgICAgICB0aGlzLmNvbW1hbmRNYXBfW2NvbW1hbmROYW1lXSA9IHtcbiAgICAgICAgICAgICAgbmFtZTogY29tbWFuZE5hbWUsXG4gICAgICAgICAgICAgIHR5cGU6ICdleFRvS2V5JyxcbiAgICAgICAgICAgICAgdG9LZXlzOiByaHMsXG4gICAgICAgICAgICAgIHVzZXI6IHRydWVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChyaHMgIT0gJzonICYmIHJocy5jaGFyQXQoMCkgPT0gJzonKSB7XG4gICAgICAgICAgICAvLyBLZXkgdG8gRXggbWFwcGluZy5cbiAgICAgICAgICAgIHZhciBtYXBwaW5nID0ge1xuICAgICAgICAgICAgICBrZXlzOiBsaHMsXG4gICAgICAgICAgICAgIHR5cGU6ICdrZXlUb0V4JyxcbiAgICAgICAgICAgICAgZXhBcmdzOiB7IGlucHV0OiByaHMuc3Vic3RyaW5nKDEpIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoY3R4KSB7IG1hcHBpbmcuY29udGV4dCA9IGN0eDsgfVxuICAgICAgICAgICAgZGVmYXVsdEtleW1hcC51bnNoaWZ0KG1hcHBpbmcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBLZXkgdG8ga2V5IG1hcHBpbmdcbiAgICAgICAgICAgIHZhciBtYXBwaW5nID0ge1xuICAgICAgICAgICAgICBrZXlzOiBsaHMsXG4gICAgICAgICAgICAgIHR5cGU6ICdrZXlUb0tleScsXG4gICAgICAgICAgICAgIHRvS2V5czogcmhzXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGN0eCkgeyBtYXBwaW5nLmNvbnRleHQgPSBjdHg7IH1cbiAgICAgICAgICAgIGRlZmF1bHRLZXltYXAudW5zaGlmdChtYXBwaW5nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB1bm1hcDogZnVuY3Rpb24obGhzLCBjdHgpIHtcbiAgICAgICAgaWYgKGxocyAhPSAnOicgJiYgbGhzLmNoYXJBdCgwKSA9PSAnOicpIHtcbiAgICAgICAgICAvLyBFeCB0byBFeCBvciBFeCB0byBrZXkgbWFwcGluZ1xuICAgICAgICAgIGlmIChjdHgpIHsgdGhyb3cgRXJyb3IoJ01vZGUgbm90IHN1cHBvcnRlZCBmb3IgZXggbWFwcGluZ3MnKTsgfVxuICAgICAgICAgIHZhciBjb21tYW5kTmFtZSA9IGxocy5zdWJzdHJpbmcoMSk7XG4gICAgICAgICAgaWYgKHRoaXMuY29tbWFuZE1hcF9bY29tbWFuZE5hbWVdICYmIHRoaXMuY29tbWFuZE1hcF9bY29tbWFuZE5hbWVdLnVzZXIpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmNvbW1hbmRNYXBfW2NvbW1hbmROYW1lXTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gS2V5IHRvIEV4IG9yIGtleSB0byBrZXkgbWFwcGluZ1xuICAgICAgICAgIHZhciBrZXlzID0gbGhzO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVmYXVsdEtleW1hcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGtleXMgPT0gZGVmYXVsdEtleW1hcFtpXS5rZXlzXG4gICAgICAgICAgICAgICAgJiYgZGVmYXVsdEtleW1hcFtpXS5jb250ZXh0ID09PSBjdHgpIHtcbiAgICAgICAgICAgICAgZGVmYXVsdEtleW1hcC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgRXJyb3IoJ05vIHN1Y2ggbWFwcGluZy4nKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGV4Q29tbWFuZHMgPSB7XG4gICAgICBjb2xvcnNjaGVtZTogZnVuY3Rpb24oY20sIHBhcmFtcykge1xuICAgICAgICBpZiAoIXBhcmFtcy5hcmdzIHx8IHBhcmFtcy5hcmdzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICBzaG93Q29uZmlybShjbSwgY20uZ2V0T3B0aW9uKCd0aGVtZScpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY20uc2V0T3B0aW9uKCd0aGVtZScsIHBhcmFtcy5hcmdzWzBdKTtcbiAgICAgIH0sXG4gICAgICBtYXA6IGZ1bmN0aW9uKGNtLCBwYXJhbXMsIGN0eCkge1xuICAgICAgICB2YXIgbWFwQXJncyA9IHBhcmFtcy5hcmdzO1xuICAgICAgICBpZiAoIW1hcEFyZ3MgfHwgbWFwQXJncy5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgaWYgKGNtKSB7XG4gICAgICAgICAgICBzaG93Q29uZmlybShjbSwgJ0ludmFsaWQgbWFwcGluZzogJyArIHBhcmFtcy5pbnB1dCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBleENvbW1hbmREaXNwYXRjaGVyLm1hcChtYXBBcmdzWzBdLCBtYXBBcmdzWzFdLCBjdHgpO1xuICAgICAgfSxcbiAgICAgIGltYXA6IGZ1bmN0aW9uKGNtLCBwYXJhbXMpIHsgdGhpcy5tYXAoY20sIHBhcmFtcywgJ2luc2VydCcpOyB9LFxuICAgICAgbm1hcDogZnVuY3Rpb24oY20sIHBhcmFtcykgeyB0aGlzLm1hcChjbSwgcGFyYW1zLCAnbm9ybWFsJyk7IH0sXG4gICAgICB2bWFwOiBmdW5jdGlvbihjbSwgcGFyYW1zKSB7IHRoaXMubWFwKGNtLCBwYXJhbXMsICd2aXN1YWwnKTsgfSxcbiAgICAgIHVubWFwOiBmdW5jdGlvbihjbSwgcGFyYW1zLCBjdHgpIHtcbiAgICAgICAgdmFyIG1hcEFyZ3MgPSBwYXJhbXMuYXJncztcbiAgICAgICAgaWYgKCFtYXBBcmdzIHx8IG1hcEFyZ3MubGVuZ3RoIDwgMSkge1xuICAgICAgICAgIGlmIChjbSkge1xuICAgICAgICAgICAgc2hvd0NvbmZpcm0oY20sICdObyBzdWNoIG1hcHBpbmc6ICcgKyBwYXJhbXMuaW5wdXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZXhDb21tYW5kRGlzcGF0Y2hlci51bm1hcChtYXBBcmdzWzBdLCBjdHgpO1xuICAgICAgfSxcbiAgICAgIG1vdmU6IGZ1bmN0aW9uKGNtLCBwYXJhbXMpIHtcbiAgICAgICAgY29tbWFuZERpc3BhdGNoZXIucHJvY2Vzc0NvbW1hbmQoY20sIGNtLnN0YXRlLnZpbSwge1xuICAgICAgICAgICAgdHlwZTogJ21vdGlvbicsXG4gICAgICAgICAgICBtb3Rpb246ICdtb3ZlVG9MaW5lT3JFZGdlT2ZEb2N1bWVudCcsXG4gICAgICAgICAgICBtb3Rpb25BcmdzOiB7IGZvcndhcmQ6IGZhbHNlLCBleHBsaWNpdFJlcGVhdDogdHJ1ZSxcbiAgICAgICAgICAgICAgbGluZXdpc2U6IHRydWUgfSxcbiAgICAgICAgICAgIHJlcGVhdE92ZXJyaWRlOiBwYXJhbXMubGluZSsxfSk7XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbihjbSwgcGFyYW1zKSB7XG4gICAgICAgIHZhciBzZXRBcmdzID0gcGFyYW1zLmFyZ3M7XG4gICAgICAgIC8vIE9wdGlvbnMgcGFzc2VkIHRocm91Z2ggdG8gdGhlIHNldE9wdGlvbi9nZXRPcHRpb24gY2FsbHMuIE1heSBiZSBwYXNzZWQgaW4gYnkgdGhlXG4gICAgICAgIC8vIGxvY2FsL2dsb2JhbCB2ZXJzaW9ucyBvZiB0aGUgc2V0IGNvbW1hbmRcbiAgICAgICAgdmFyIHNldENmZyA9IHBhcmFtcy5zZXRDZmcgfHwge307XG4gICAgICAgIGlmICghc2V0QXJncyB8fCBzZXRBcmdzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICBpZiAoY20pIHtcbiAgICAgICAgICAgIHNob3dDb25maXJtKGNtLCAnSW52YWxpZCBtYXBwaW5nOiAnICsgcGFyYW1zLmlucHV0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBleHByID0gc2V0QXJnc1swXS5zcGxpdCgnPScpO1xuICAgICAgICB2YXIgb3B0aW9uTmFtZSA9IGV4cHJbMF07XG4gICAgICAgIHZhciB2YWx1ZSA9IGV4cHJbMV07XG4gICAgICAgIHZhciBmb3JjZUdldCA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChvcHRpb25OYW1lLmNoYXJBdChvcHRpb25OYW1lLmxlbmd0aCAtIDEpID09ICc/Jykge1xuICAgICAgICAgIC8vIElmIHBvc3QtZml4ZWQgd2l0aCA/LCB0aGVuIHRoZSBzZXQgaXMgYWN0dWFsbHkgYSBnZXQuXG4gICAgICAgICAgaWYgKHZhbHVlKSB7IHRocm93IEVycm9yKCdUcmFpbGluZyBjaGFyYWN0ZXJzOiAnICsgcGFyYW1zLmFyZ1N0cmluZyk7IH1cbiAgICAgICAgICBvcHRpb25OYW1lID0gb3B0aW9uTmFtZS5zdWJzdHJpbmcoMCwgb3B0aW9uTmFtZS5sZW5ndGggLSAxKTtcbiAgICAgICAgICBmb3JjZUdldCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgb3B0aW9uTmFtZS5zdWJzdHJpbmcoMCwgMikgPT0gJ25vJykge1xuICAgICAgICAgIC8vIFRvIHNldCBib29sZWFuIG9wdGlvbnMgdG8gZmFsc2UsIHRoZSBvcHRpb24gbmFtZSBpcyBwcmVmaXhlZCB3aXRoXG4gICAgICAgICAgLy8gJ25vJy5cbiAgICAgICAgICBvcHRpb25OYW1lID0gb3B0aW9uTmFtZS5zdWJzdHJpbmcoMik7XG4gICAgICAgICAgdmFsdWUgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvcHRpb25Jc0Jvb2xlYW4gPSBvcHRpb25zW29wdGlvbk5hbWVdICYmIG9wdGlvbnNbb3B0aW9uTmFtZV0udHlwZSA9PSAnYm9vbGVhbic7XG4gICAgICAgIGlmIChvcHRpb25Jc0Jvb2xlYW4gJiYgdmFsdWUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgLy8gQ2FsbGluZyBzZXQgd2l0aCBhIGJvb2xlYW4gb3B0aW9uIHNldHMgaXQgdG8gdHJ1ZS5cbiAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgbm8gdmFsdWUgaXMgcHJvdmlkZWQsIHRoZW4gd2UgYXNzdW1lIHRoaXMgaXMgYSBnZXQuXG4gICAgICAgIGlmICghb3B0aW9uSXNCb29sZWFuICYmIHZhbHVlID09PSB1bmRlZmluZWQgfHwgZm9yY2VHZXQpIHtcbiAgICAgICAgICB2YXIgb2xkVmFsdWUgPSBnZXRPcHRpb24ob3B0aW9uTmFtZSwgY20sIHNldENmZyk7XG4gICAgICAgICAgaWYgKG9sZFZhbHVlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHNob3dDb25maXJtKGNtLCBvbGRWYWx1ZS5tZXNzYWdlKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG9sZFZhbHVlID09PSB0cnVlIHx8IG9sZFZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgc2hvd0NvbmZpcm0oY20sICcgJyArIChvbGRWYWx1ZSA/ICcnIDogJ25vJykgKyBvcHRpb25OYW1lKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2hvd0NvbmZpcm0oY20sICcgICcgKyBvcHRpb25OYW1lICsgJz0nICsgb2xkVmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgc2V0T3B0aW9uUmV0dXJuID0gc2V0T3B0aW9uKG9wdGlvbk5hbWUsIHZhbHVlLCBjbSwgc2V0Q2ZnKTtcbiAgICAgICAgICBpZiAoc2V0T3B0aW9uUmV0dXJuIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHNob3dDb25maXJtKGNtLCBzZXRPcHRpb25SZXR1cm4ubWVzc2FnZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc2V0bG9jYWw6IGZ1bmN0aW9uIChjbSwgcGFyYW1zKSB7XG4gICAgICAgIC8vIHNldENmZyBpcyBwYXNzZWQgdGhyb3VnaCB0byBzZXRPcHRpb25cbiAgICAgICAgcGFyYW1zLnNldENmZyA9IHtzY29wZTogJ2xvY2FsJ307XG4gICAgICAgIHRoaXMuc2V0KGNtLCBwYXJhbXMpO1xuICAgICAgfSxcbiAgICAgIHNldGdsb2JhbDogZnVuY3Rpb24gKGNtLCBwYXJhbXMpIHtcbiAgICAgICAgLy8gc2V0Q2ZnIGlzIHBhc3NlZCB0aHJvdWdoIHRvIHNldE9wdGlvblxuICAgICAgICBwYXJhbXMuc2V0Q2ZnID0ge3Njb3BlOiAnZ2xvYmFsJ307XG4gICAgICAgIHRoaXMuc2V0KGNtLCBwYXJhbXMpO1xuICAgICAgfSxcbiAgICAgIHJlZ2lzdGVyczogZnVuY3Rpb24oY20sIHBhcmFtcykge1xuICAgICAgICB2YXIgcmVnQXJncyA9IHBhcmFtcy5hcmdzO1xuICAgICAgICB2YXIgcmVnaXN0ZXJzID0gdmltR2xvYmFsU3RhdGUucmVnaXN0ZXJDb250cm9sbGVyLnJlZ2lzdGVycztcbiAgICAgICAgdmFyIHJlZ0luZm8gPSAnLS0tLS0tLS0tLVJlZ2lzdGVycy0tLS0tLS0tLS08YnI+PGJyPic7XG4gICAgICAgIGlmICghcmVnQXJncykge1xuICAgICAgICAgIGZvciAodmFyIHJlZ2lzdGVyTmFtZSBpbiByZWdpc3RlcnMpIHtcbiAgICAgICAgICAgIHZhciB0ZXh0ID0gcmVnaXN0ZXJzW3JlZ2lzdGVyTmFtZV0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmICh0ZXh0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICByZWdJbmZvICs9ICdcIicgKyByZWdpc3Rlck5hbWUgKyAnICAgICcgKyB0ZXh0ICsgJzxicj4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgcmVnaXN0ZXJOYW1lO1xuICAgICAgICAgIHJlZ0FyZ3MgPSByZWdBcmdzLmpvaW4oJycpO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVnQXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcmVnaXN0ZXJOYW1lID0gcmVnQXJncy5jaGFyQXQoaSk7XG4gICAgICAgICAgICBpZiAoIXZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci5pc1ZhbGlkUmVnaXN0ZXIocmVnaXN0ZXJOYW1lKSkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByZWdpc3RlciA9IHJlZ2lzdGVyc1tyZWdpc3Rlck5hbWVdIHx8IG5ldyBSZWdpc3RlcigpO1xuICAgICAgICAgICAgcmVnSW5mbyArPSAnXCInICsgcmVnaXN0ZXJOYW1lICsgJyAgICAnICsgcmVnaXN0ZXIudG9TdHJpbmcoKSArICc8YnI+JztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2hvd0NvbmZpcm0oY20sIHJlZ0luZm8pO1xuICAgICAgfSxcbiAgICAgIHNvcnQ6IGZ1bmN0aW9uKGNtLCBwYXJhbXMpIHtcbiAgICAgICAgdmFyIHJldmVyc2UsIGlnbm9yZUNhc2UsIHVuaXF1ZSwgbnVtYmVyLCBwYXR0ZXJuO1xuICAgICAgICBmdW5jdGlvbiBwYXJzZUFyZ3MoKSB7XG4gICAgICAgICAgaWYgKHBhcmFtcy5hcmdTdHJpbmcpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gbmV3IENvZGVNaXJyb3IuU3RyaW5nU3RyZWFtKHBhcmFtcy5hcmdTdHJpbmcpO1xuICAgICAgICAgICAgaWYgKGFyZ3MuZWF0KCchJykpIHsgcmV2ZXJzZSA9IHRydWU7IH1cbiAgICAgICAgICAgIGlmIChhcmdzLmVvbCgpKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgaWYgKCFhcmdzLmVhdFNwYWNlKCkpIHsgcmV0dXJuICdJbnZhbGlkIGFyZ3VtZW50cyc7IH1cbiAgICAgICAgICAgIHZhciBvcHRzID0gYXJncy5tYXRjaCgvKFtkaW51b3hdKyk/XFxzKihcXC8uK1xcLyk/XFxzKi8pO1xuICAgICAgICAgICAgaWYgKCFvcHRzICYmICFhcmdzLmVvbCgpKSB7IHJldHVybiAnSW52YWxpZCBhcmd1bWVudHMnOyB9XG4gICAgICAgICAgICBpZiAob3B0c1sxXSkge1xuICAgICAgICAgICAgICBpZ25vcmVDYXNlID0gb3B0c1sxXS5pbmRleE9mKCdpJykgIT0gLTE7XG4gICAgICAgICAgICAgIHVuaXF1ZSA9IG9wdHNbMV0uaW5kZXhPZigndScpICE9IC0xO1xuICAgICAgICAgICAgICB2YXIgZGVjaW1hbCA9IG9wdHNbMV0uaW5kZXhPZignZCcpICE9IC0xIHx8IG9wdHNbMV0uaW5kZXhPZignbicpICE9IC0xICYmIDE7XG4gICAgICAgICAgICAgIHZhciBoZXggPSBvcHRzWzFdLmluZGV4T2YoJ3gnKSAhPSAtMSAmJiAxO1xuICAgICAgICAgICAgICB2YXIgb2N0YWwgPSBvcHRzWzFdLmluZGV4T2YoJ28nKSAhPSAtMSAmJiAxO1xuICAgICAgICAgICAgICBpZiAoZGVjaW1hbCArIGhleCArIG9jdGFsID4gMSkgeyByZXR1cm4gJ0ludmFsaWQgYXJndW1lbnRzJzsgfVxuICAgICAgICAgICAgICBudW1iZXIgPSBkZWNpbWFsICYmICdkZWNpbWFsJyB8fCBoZXggJiYgJ2hleCcgfHwgb2N0YWwgJiYgJ29jdGFsJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRzWzJdKSB7XG4gICAgICAgICAgICAgIHBhdHRlcm4gPSBuZXcgUmVnRXhwKG9wdHNbMl0uc3Vic3RyKDEsIG9wdHNbMl0ubGVuZ3RoIC0gMiksIGlnbm9yZUNhc2UgPyAnaScgOiAnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBlcnIgPSBwYXJzZUFyZ3MoKTtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHNob3dDb25maXJtKGNtLCBlcnIgKyAnOiAnICsgcGFyYW1zLmFyZ1N0cmluZyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsaW5lU3RhcnQgPSBwYXJhbXMubGluZSB8fCBjbS5maXJzdExpbmUoKTtcbiAgICAgICAgdmFyIGxpbmVFbmQgPSBwYXJhbXMubGluZUVuZCB8fCBwYXJhbXMubGluZSB8fCBjbS5sYXN0TGluZSgpO1xuICAgICAgICBpZiAobGluZVN0YXJ0ID09IGxpbmVFbmQpIHsgcmV0dXJuOyB9XG4gICAgICAgIHZhciBjdXJTdGFydCA9IFBvcyhsaW5lU3RhcnQsIDApO1xuICAgICAgICB2YXIgY3VyRW5kID0gUG9zKGxpbmVFbmQsIGxpbmVMZW5ndGgoY20sIGxpbmVFbmQpKTtcbiAgICAgICAgdmFyIHRleHQgPSBjbS5nZXRSYW5nZShjdXJTdGFydCwgY3VyRW5kKS5zcGxpdCgnXFxuJyk7XG4gICAgICAgIHZhciBudW1iZXJSZWdleCA9IHBhdHRlcm4gPyBwYXR0ZXJuIDpcbiAgICAgICAgICAgKG51bWJlciA9PSAnZGVjaW1hbCcpID8gLygtPykoW1xcZF0rKS8gOlxuICAgICAgICAgICAobnVtYmVyID09ICdoZXgnKSA/IC8oLT8pKD86MHgpPyhbMC05YS1mXSspL2kgOlxuICAgICAgICAgICAobnVtYmVyID09ICdvY3RhbCcpID8gLyhbMC03XSspLyA6IG51bGw7XG4gICAgICAgIHZhciByYWRpeCA9IChudW1iZXIgPT0gJ2RlY2ltYWwnKSA/IDEwIDogKG51bWJlciA9PSAnaGV4JykgPyAxNiA6IChudW1iZXIgPT0gJ29jdGFsJykgPyA4IDogbnVsbDtcbiAgICAgICAgdmFyIG51bVBhcnQgPSBbXSwgdGV4dFBhcnQgPSBbXTtcbiAgICAgICAgaWYgKG51bWJlciB8fCBwYXR0ZXJuKSB7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2hQYXJ0ID0gcGF0dGVybiA/IHRleHRbaV0ubWF0Y2gocGF0dGVybikgOiBudWxsO1xuICAgICAgICAgICAgaWYgKG1hdGNoUGFydCAmJiBtYXRjaFBhcnRbMF0gIT0gJycpIHtcbiAgICAgICAgICAgICAgbnVtUGFydC5wdXNoKG1hdGNoUGFydCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFwYXR0ZXJuICYmIG51bWJlclJlZ2V4LmV4ZWModGV4dFtpXSkpIHtcbiAgICAgICAgICAgICAgbnVtUGFydC5wdXNoKHRleHRbaV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGV4dFBhcnQucHVzaCh0ZXh0W2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGV4dFBhcnQgPSB0ZXh0O1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNvbXBhcmVGbihhLCBiKSB7XG4gICAgICAgICAgaWYgKHJldmVyc2UpIHsgdmFyIHRtcDsgdG1wID0gYTsgYSA9IGI7IGIgPSB0bXA7IH1cbiAgICAgICAgICBpZiAoaWdub3JlQ2FzZSkgeyBhID0gYS50b0xvd2VyQ2FzZSgpOyBiID0gYi50b0xvd2VyQ2FzZSgpOyB9XG4gICAgICAgICAgdmFyIGFudW0gPSBudW1iZXIgJiYgbnVtYmVyUmVnZXguZXhlYyhhKTtcbiAgICAgICAgICB2YXIgYm51bSA9IG51bWJlciAmJiBudW1iZXJSZWdleC5leGVjKGIpO1xuICAgICAgICAgIGlmICghYW51bSkgeyByZXR1cm4gYSA8IGIgPyAtMSA6IDE7IH1cbiAgICAgICAgICBhbnVtID0gcGFyc2VJbnQoKGFudW1bMV0gKyBhbnVtWzJdKS50b0xvd2VyQ2FzZSgpLCByYWRpeCk7XG4gICAgICAgICAgYm51bSA9IHBhcnNlSW50KChibnVtWzFdICsgYm51bVsyXSkudG9Mb3dlckNhc2UoKSwgcmFkaXgpO1xuICAgICAgICAgIHJldHVybiBhbnVtIC0gYm51bTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjb21wYXJlUGF0dGVybkZuKGEsIGIpIHtcbiAgICAgICAgICBpZiAocmV2ZXJzZSkgeyB2YXIgdG1wOyB0bXAgPSBhOyBhID0gYjsgYiA9IHRtcDsgfVxuICAgICAgICAgIGlmIChpZ25vcmVDYXNlKSB7IGFbMF0gPSBhWzBdLnRvTG93ZXJDYXNlKCk7IGJbMF0gPSBiWzBdLnRvTG93ZXJDYXNlKCk7IH1cbiAgICAgICAgICByZXR1cm4gKGFbMF0gPCBiWzBdKSA/IC0xIDogMTtcbiAgICAgICAgfVxuICAgICAgICBudW1QYXJ0LnNvcnQocGF0dGVybiA/IGNvbXBhcmVQYXR0ZXJuRm4gOiBjb21wYXJlRm4pO1xuICAgICAgICBpZiAocGF0dGVybikge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtUGFydC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbnVtUGFydFtpXSA9IG51bVBhcnRbaV0uaW5wdXQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCFudW1iZXIpIHsgdGV4dFBhcnQuc29ydChjb21wYXJlRm4pOyB9XG4gICAgICAgIHRleHQgPSAoIXJldmVyc2UpID8gdGV4dFBhcnQuY29uY2F0KG51bVBhcnQpIDogbnVtUGFydC5jb25jYXQodGV4dFBhcnQpO1xuICAgICAgICBpZiAodW5pcXVlKSB7IC8vIFJlbW92ZSBkdXBsaWNhdGUgbGluZXNcbiAgICAgICAgICB2YXIgdGV4dE9sZCA9IHRleHQ7XG4gICAgICAgICAgdmFyIGxhc3RMaW5lO1xuICAgICAgICAgIHRleHQgPSBbXTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHRPbGQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0ZXh0T2xkW2ldICE9IGxhc3RMaW5lKSB7XG4gICAgICAgICAgICAgIHRleHQucHVzaCh0ZXh0T2xkW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxhc3RMaW5lID0gdGV4dE9sZFtpXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY20ucmVwbGFjZVJhbmdlKHRleHQuam9pbignXFxuJyksIGN1clN0YXJ0LCBjdXJFbmQpO1xuICAgICAgfSxcbiAgICAgIGdsb2JhbDogZnVuY3Rpb24oY20sIHBhcmFtcykge1xuICAgICAgICAvLyBhIGdsb2JhbCBjb21tYW5kIGlzIG9mIHRoZSBmb3JtXG4gICAgICAgIC8vIDpbcmFuZ2VdZy9wYXR0ZXJuL1tjbWRdXG4gICAgICAgIC8vIGFyZ1N0cmluZyBob2xkcyB0aGUgc3RyaW5nIC9wYXR0ZXJuL1tjbWRdXG4gICAgICAgIHZhciBhcmdTdHJpbmcgPSBwYXJhbXMuYXJnU3RyaW5nO1xuICAgICAgICBpZiAoIWFyZ1N0cmluZykge1xuICAgICAgICAgIHNob3dDb25maXJtKGNtLCAnUmVndWxhciBFeHByZXNzaW9uIG1pc3NpbmcgZnJvbSBnbG9iYWwnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmFuZ2UgaXMgc3BlY2lmaWVkIGhlcmVcbiAgICAgICAgdmFyIGxpbmVTdGFydCA9IChwYXJhbXMubGluZSAhPT0gdW5kZWZpbmVkKSA/IHBhcmFtcy5saW5lIDogY20uZmlyc3RMaW5lKCk7XG4gICAgICAgIHZhciBsaW5lRW5kID0gcGFyYW1zLmxpbmVFbmQgfHwgcGFyYW1zLmxpbmUgfHwgY20ubGFzdExpbmUoKTtcbiAgICAgICAgLy8gZ2V0IHRoZSB0b2tlbnMgZnJvbSBhcmdTdHJpbmdcbiAgICAgICAgdmFyIHRva2VucyA9IHNwbGl0QnlTbGFzaChhcmdTdHJpbmcpO1xuICAgICAgICB2YXIgcmVnZXhQYXJ0ID0gYXJnU3RyaW5nLCBjbWQ7XG4gICAgICAgIGlmICh0b2tlbnMubGVuZ3RoKSB7XG4gICAgICAgICAgcmVnZXhQYXJ0ID0gdG9rZW5zWzBdO1xuICAgICAgICAgIGNtZCA9IHRva2Vucy5zbGljZSgxLCB0b2tlbnMubGVuZ3RoKS5qb2luKCcvJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlZ2V4UGFydCkge1xuICAgICAgICAgIC8vIElmIHJlZ2V4IHBhcnQgaXMgZW1wdHksIHRoZW4gdXNlIHRoZSBwcmV2aW91cyBxdWVyeS4gT3RoZXJ3aXNlXG4gICAgICAgICAgLy8gdXNlIHRoZSByZWdleCBwYXJ0IGFzIHRoZSBuZXcgcXVlcnkuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgdXBkYXRlU2VhcmNoUXVlcnkoY20sIHJlZ2V4UGFydCwgdHJ1ZSAvKiogaWdub3JlQ2FzZSAqLyxcbiAgICAgICAgICAgICB0cnVlIC8qKiBzbWFydENhc2UgKi8pO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgc2hvd0NvbmZpcm0oY20sICdJbnZhbGlkIHJlZ2V4OiAnICsgcmVnZXhQYXJ0KTtcbiAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBub3cgdGhhdCB3ZSBoYXZlIHRoZSByZWdleFBhcnQsIHNlYXJjaCBmb3IgcmVnZXggbWF0Y2hlcyBpbiB0aGVcbiAgICAgICAgLy8gc3BlY2lmaWVkIHJhbmdlIG9mIGxpbmVzXG4gICAgICAgIHZhciBxdWVyeSA9IGdldFNlYXJjaFN0YXRlKGNtKS5nZXRRdWVyeSgpO1xuICAgICAgICB2YXIgbWF0Y2hlZExpbmVzID0gW10sIGNvbnRlbnQgPSAnJztcbiAgICAgICAgZm9yICh2YXIgaSA9IGxpbmVTdGFydDsgaSA8PSBsaW5lRW5kOyBpKyspIHtcbiAgICAgICAgICB2YXIgbWF0Y2hlZCA9IHF1ZXJ5LnRlc3QoY20uZ2V0TGluZShpKSk7XG4gICAgICAgICAgaWYgKG1hdGNoZWQpIHtcbiAgICAgICAgICAgIG1hdGNoZWRMaW5lcy5wdXNoKGkrMSk7XG4gICAgICAgICAgICBjb250ZW50Kz0gY20uZ2V0TGluZShpKSArICc8YnI+JztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gW2NtZF0sIGp1c3QgZGlzcGxheSB0aGUgbGlzdCBvZiBtYXRjaGVkIGxpbmVzXG4gICAgICAgIGlmICghY21kKSB7XG4gICAgICAgICAgc2hvd0NvbmZpcm0oY20sIGNvbnRlbnQpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgICB2YXIgbmV4dENvbW1hbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoaW5kZXggPCBtYXRjaGVkTGluZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgY29tbWFuZCA9IG1hdGNoZWRMaW5lc1tpbmRleF0gKyBjbWQ7XG4gICAgICAgICAgICBleENvbW1hbmREaXNwYXRjaGVyLnByb2Nlc3NDb21tYW5kKGNtLCBjb21tYW5kLCB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrOiBuZXh0Q29tbWFuZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgIH07XG4gICAgICAgIG5leHRDb21tYW5kKCk7XG4gICAgICB9LFxuICAgICAgc3Vic3RpdHV0ZTogZnVuY3Rpb24oY20sIHBhcmFtcykge1xuICAgICAgICBpZiAoIWNtLmdldFNlYXJjaEN1cnNvcikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2VhcmNoIGZlYXR1cmUgbm90IGF2YWlsYWJsZS4gUmVxdWlyZXMgc2VhcmNoY3Vyc29yLmpzIG9yICcgK1xuICAgICAgICAgICAgICAnYW55IG90aGVyIGdldFNlYXJjaEN1cnNvciBpbXBsZW1lbnRhdGlvbi4nKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYXJnU3RyaW5nID0gcGFyYW1zLmFyZ1N0cmluZztcbiAgICAgICAgdmFyIHRva2VucyA9IGFyZ1N0cmluZyA/IHNwbGl0QnlTZXBhcmF0b3IoYXJnU3RyaW5nLCBhcmdTdHJpbmdbMF0pIDogW107XG4gICAgICAgIHZhciByZWdleFBhcnQsIHJlcGxhY2VQYXJ0ID0gJycsIHRyYWlsaW5nLCBmbGFnc1BhcnQsIGNvdW50O1xuICAgICAgICB2YXIgY29uZmlybSA9IGZhbHNlOyAvLyBXaGV0aGVyIHRvIGNvbmZpcm0gZWFjaCByZXBsYWNlLlxuICAgICAgICB2YXIgZ2xvYmFsID0gZmFsc2U7IC8vIFRydWUgdG8gcmVwbGFjZSBhbGwgaW5zdGFuY2VzIG9uIGEgbGluZSwgZmFsc2UgdG8gcmVwbGFjZSBvbmx5IDEuXG4gICAgICAgIGlmICh0b2tlbnMubGVuZ3RoKSB7XG4gICAgICAgICAgcmVnZXhQYXJ0ID0gdG9rZW5zWzBdO1xuICAgICAgICAgIHJlcGxhY2VQYXJ0ID0gdG9rZW5zWzFdO1xuICAgICAgICAgIGlmIChyZWdleFBhcnQgJiYgcmVnZXhQYXJ0W3JlZ2V4UGFydC5sZW5ndGggLSAxXSA9PT0gJyQnKSB7XG4gICAgICAgICAgICByZWdleFBhcnQgPSByZWdleFBhcnQuc2xpY2UoMCwgcmVnZXhQYXJ0Lmxlbmd0aCAtIDEpICsgJ1xcXFxuJztcbiAgICAgICAgICAgIHJlcGxhY2VQYXJ0ID0gcmVwbGFjZVBhcnQgPyByZXBsYWNlUGFydCArICdcXG4nIDogJ1xcbic7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXBsYWNlUGFydCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoZ2V0T3B0aW9uKCdwY3JlJykpIHtcbiAgICAgICAgICAgICAgcmVwbGFjZVBhcnQgPSB1bmVzY2FwZVJlZ2V4UmVwbGFjZShyZXBsYWNlUGFydCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXBsYWNlUGFydCA9IHRyYW5zbGF0ZVJlZ2V4UmVwbGFjZShyZXBsYWNlUGFydCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2aW1HbG9iYWxTdGF0ZS5sYXN0U3Vic3RpdHV0ZVJlcGxhY2VQYXJ0ID0gcmVwbGFjZVBhcnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRyYWlsaW5nID0gdG9rZW5zWzJdID8gdG9rZW5zWzJdLnNwbGl0KCcgJykgOiBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBlaXRoZXIgdGhlIGFyZ1N0cmluZyBpcyBlbXB0eSBvciBpdHMgb2YgdGhlIGZvcm0gJyBoZWxsby93b3JsZCdcbiAgICAgICAgICAvLyBhY3R1YWxseSBzcGxpdEJ5U2xhc2ggcmV0dXJucyBhIGxpc3Qgb2YgdG9rZW5zXG4gICAgICAgICAgLy8gb25seSBpZiB0aGUgc3RyaW5nIHN0YXJ0cyB3aXRoIGEgJy8nXG4gICAgICAgICAgaWYgKGFyZ1N0cmluZyAmJiBhcmdTdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICBzaG93Q29uZmlybShjbSwgJ1N1YnN0aXR1dGlvbnMgc2hvdWxkIGJlIG9mIHRoZSBmb3JtICcgK1xuICAgICAgICAgICAgICAgICc6cy9wYXR0ZXJuL3JlcGxhY2UvJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEFmdGVyIHRoZSAzcmQgc2xhc2gsIHdlIGNhbiBoYXZlIGZsYWdzIGZvbGxvd2VkIGJ5IGEgc3BhY2UgZm9sbG93ZWRcbiAgICAgICAgLy8gYnkgY291bnQuXG4gICAgICAgIGlmICh0cmFpbGluZykge1xuICAgICAgICAgIGZsYWdzUGFydCA9IHRyYWlsaW5nWzBdO1xuICAgICAgICAgIGNvdW50ID0gcGFyc2VJbnQodHJhaWxpbmdbMV0pO1xuICAgICAgICAgIGlmIChmbGFnc1BhcnQpIHtcbiAgICAgICAgICAgIGlmIChmbGFnc1BhcnQuaW5kZXhPZignYycpICE9IC0xKSB7XG4gICAgICAgICAgICAgIGNvbmZpcm0gPSB0cnVlO1xuICAgICAgICAgICAgICBmbGFnc1BhcnQucmVwbGFjZSgnYycsICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmbGFnc1BhcnQuaW5kZXhPZignZycpICE9IC0xKSB7XG4gICAgICAgICAgICAgIGdsb2JhbCA9IHRydWU7XG4gICAgICAgICAgICAgIGZsYWdzUGFydC5yZXBsYWNlKCdnJywgJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVnZXhQYXJ0ID0gcmVnZXhQYXJ0LnJlcGxhY2UoL1xcLy9nLCBcIlxcXFwvXCIpICsgJy8nICsgZmxhZ3NQYXJ0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVnZXhQYXJ0KSB7XG4gICAgICAgICAgLy8gSWYgcmVnZXggcGFydCBpcyBlbXB0eSwgdGhlbiB1c2UgdGhlIHByZXZpb3VzIHF1ZXJ5LiBPdGhlcndpc2UgdXNlXG4gICAgICAgICAgLy8gdGhlIHJlZ2V4IHBhcnQgYXMgdGhlIG5ldyBxdWVyeS5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdXBkYXRlU2VhcmNoUXVlcnkoY20sIHJlZ2V4UGFydCwgdHJ1ZSAvKiogaWdub3JlQ2FzZSAqLyxcbiAgICAgICAgICAgICAgdHJ1ZSAvKiogc21hcnRDYXNlICovKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBzaG93Q29uZmlybShjbSwgJ0ludmFsaWQgcmVnZXg6ICcgKyByZWdleFBhcnQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXBsYWNlUGFydCA9IHJlcGxhY2VQYXJ0IHx8IHZpbUdsb2JhbFN0YXRlLmxhc3RTdWJzdGl0dXRlUmVwbGFjZVBhcnQ7XG4gICAgICAgIGlmIChyZXBsYWNlUGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgc2hvd0NvbmZpcm0oY20sICdObyBwcmV2aW91cyBzdWJzdGl0dXRlIHJlZ3VsYXIgZXhwcmVzc2lvbicpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3RhdGUgPSBnZXRTZWFyY2hTdGF0ZShjbSk7XG4gICAgICAgIHZhciBxdWVyeSA9IHN0YXRlLmdldFF1ZXJ5KCk7XG4gICAgICAgIHZhciBsaW5lU3RhcnQgPSAocGFyYW1zLmxpbmUgIT09IHVuZGVmaW5lZCkgPyBwYXJhbXMubGluZSA6IGNtLmdldEN1cnNvcigpLmxpbmU7XG4gICAgICAgIHZhciBsaW5lRW5kID0gcGFyYW1zLmxpbmVFbmQgfHwgbGluZVN0YXJ0O1xuICAgICAgICBpZiAobGluZVN0YXJ0ID09IGNtLmZpcnN0TGluZSgpICYmIGxpbmVFbmQgPT0gY20ubGFzdExpbmUoKSkge1xuICAgICAgICAgIGxpbmVFbmQgPSBJbmZpbml0eTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY291bnQpIHtcbiAgICAgICAgICBsaW5lU3RhcnQgPSBsaW5lRW5kO1xuICAgICAgICAgIGxpbmVFbmQgPSBsaW5lU3RhcnQgKyBjb3VudCAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0YXJ0UG9zID0gY2xpcEN1cnNvclRvQ29udGVudChjbSwgUG9zKGxpbmVTdGFydCwgMCkpO1xuICAgICAgICB2YXIgY3Vyc29yID0gY20uZ2V0U2VhcmNoQ3Vyc29yKHF1ZXJ5LCBzdGFydFBvcyk7XG4gICAgICAgIGRvUmVwbGFjZShjbSwgY29uZmlybSwgZ2xvYmFsLCBsaW5lU3RhcnQsIGxpbmVFbmQsIGN1cnNvciwgcXVlcnksIHJlcGxhY2VQYXJ0LCBwYXJhbXMuY2FsbGJhY2spO1xuICAgICAgfSxcbiAgICAgIHJlZG86IENvZGVNaXJyb3IuY29tbWFuZHMucmVkbyxcbiAgICAgIHVuZG86IENvZGVNaXJyb3IuY29tbWFuZHMudW5kbyxcbiAgICAgIHdyaXRlOiBmdW5jdGlvbihjbSkge1xuICAgICAgICBpZiAoQ29kZU1pcnJvci5jb21tYW5kcy5zYXZlKSB7XG4gICAgICAgICAgLy8gSWYgYSBzYXZlIGNvbW1hbmQgaXMgZGVmaW5lZCwgY2FsbCBpdC5cbiAgICAgICAgICBDb2RlTWlycm9yLmNvbW1hbmRzLnNhdmUoY20pO1xuICAgICAgICB9IGVsc2UgaWYgKGNtLnNhdmUpIHtcbiAgICAgICAgICAvLyBTYXZlcyB0byB0ZXh0IGFyZWEgaWYgbm8gc2F2ZSBjb21tYW5kIGlzIGRlZmluZWQgYW5kIGNtLnNhdmUoKSBpcyBhdmFpbGFibGUuXG4gICAgICAgICAgY20uc2F2ZSgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgbm9obHNlYXJjaDogZnVuY3Rpb24oY20pIHtcbiAgICAgICAgY2xlYXJTZWFyY2hIaWdobGlnaHQoY20pO1xuICAgICAgfSxcbiAgICAgIHlhbms6IGZ1bmN0aW9uIChjbSkge1xuICAgICAgICB2YXIgY3VyID0gY29weUN1cnNvcihjbS5nZXRDdXJzb3IoKSk7XG4gICAgICAgIHZhciBsaW5lID0gY3VyLmxpbmU7XG4gICAgICAgIHZhciBsaW5lVGV4dCA9IGNtLmdldExpbmUobGluZSk7XG4gICAgICAgIHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci5wdXNoVGV4dChcbiAgICAgICAgICAnMCcsICd5YW5rJywgbGluZVRleHQsIHRydWUsIHRydWUpO1xuICAgICAgfSxcbiAgICAgIGRlbG1hcmtzOiBmdW5jdGlvbihjbSwgcGFyYW1zKSB7XG4gICAgICAgIGlmICghcGFyYW1zLmFyZ1N0cmluZyB8fCAhdHJpbShwYXJhbXMuYXJnU3RyaW5nKSkge1xuICAgICAgICAgIHNob3dDb25maXJtKGNtLCAnQXJndW1lbnQgcmVxdWlyZWQnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3RhdGUgPSBjbS5zdGF0ZS52aW07XG4gICAgICAgIHZhciBzdHJlYW0gPSBuZXcgQ29kZU1pcnJvci5TdHJpbmdTdHJlYW0odHJpbShwYXJhbXMuYXJnU3RyaW5nKSk7XG4gICAgICAgIHdoaWxlICghc3RyZWFtLmVvbCgpKSB7XG4gICAgICAgICAgc3RyZWFtLmVhdFNwYWNlKCk7XG5cbiAgICAgICAgICAvLyBSZWNvcmQgdGhlIHN0cmVhbXMgcG9zaXRpb24gYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgbG9vcCBmb3IgdXNlXG4gICAgICAgICAgLy8gaW4gZXJyb3IgbWVzc2FnZXMuXG4gICAgICAgICAgdmFyIGNvdW50ID0gc3RyZWFtLnBvcztcblxuICAgICAgICAgIGlmICghc3RyZWFtLm1hdGNoKC9bYS16QS1aXS8sIGZhbHNlKSkge1xuICAgICAgICAgICAgc2hvd0NvbmZpcm0oY20sICdJbnZhbGlkIGFyZ3VtZW50OiAnICsgcGFyYW1zLmFyZ1N0cmluZy5zdWJzdHJpbmcoY291bnQpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgc3ltID0gc3RyZWFtLm5leHQoKTtcbiAgICAgICAgICAvLyBDaGVjayBpZiB0aGlzIHN5bWJvbCBpcyBwYXJ0IG9mIGEgcmFuZ2VcbiAgICAgICAgICBpZiAoc3RyZWFtLm1hdGNoKCctJywgdHJ1ZSkpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgc3ltYm9sIGlzIHBhcnQgb2YgYSByYW5nZS5cblxuICAgICAgICAgICAgLy8gVGhlIHJhbmdlIG11c3QgdGVybWluYXRlIGF0IGFuIGFscGhhYmV0aWMgY2hhcmFjdGVyLlxuICAgICAgICAgICAgaWYgKCFzdHJlYW0ubWF0Y2goL1thLXpBLVpdLywgZmFsc2UpKSB7XG4gICAgICAgICAgICAgIHNob3dDb25maXJtKGNtLCAnSW52YWxpZCBhcmd1bWVudDogJyArIHBhcmFtcy5hcmdTdHJpbmcuc3Vic3RyaW5nKGNvdW50KSk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHN0YXJ0TWFyayA9IHN5bTtcbiAgICAgICAgICAgIHZhciBmaW5pc2hNYXJrID0gc3RyZWFtLm5leHQoKTtcbiAgICAgICAgICAgIC8vIFRoZSByYW5nZSBtdXN0IHRlcm1pbmF0ZSBhdCBhbiBhbHBoYWJldGljIGNoYXJhY3RlciB3aGljaFxuICAgICAgICAgICAgLy8gc2hhcmVzIHRoZSBzYW1lIGNhc2UgYXMgdGhlIHN0YXJ0IG9mIHRoZSByYW5nZS5cbiAgICAgICAgICAgIGlmIChpc0xvd2VyQ2FzZShzdGFydE1hcmspICYmIGlzTG93ZXJDYXNlKGZpbmlzaE1hcmspIHx8XG4gICAgICAgICAgICAgICAgaXNVcHBlckNhc2Uoc3RhcnRNYXJrKSAmJiBpc1VwcGVyQ2FzZShmaW5pc2hNYXJrKSkge1xuICAgICAgICAgICAgICB2YXIgc3RhcnQgPSBzdGFydE1hcmsuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAgICAgdmFyIGZpbmlzaCA9IGZpbmlzaE1hcmsuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAgICAgaWYgKHN0YXJ0ID49IGZpbmlzaCkge1xuICAgICAgICAgICAgICAgIHNob3dDb25maXJtKGNtLCAnSW52YWxpZCBhcmd1bWVudDogJyArIHBhcmFtcy5hcmdTdHJpbmcuc3Vic3RyaW5nKGNvdW50KSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLy8gQmVjYXVzZSBtYXJrcyBhcmUgYWx3YXlzIEFTQ0lJIHZhbHVlcywgYW5kIHdlIGhhdmVcbiAgICAgICAgICAgICAgLy8gZGV0ZXJtaW5lZCB0aGF0IHRoZXkgYXJlIHRoZSBzYW1lIGNhc2UsIHdlIGNhbiB1c2VcbiAgICAgICAgICAgICAgLy8gdGhlaXIgY2hhciBjb2RlcyB0byBpdGVyYXRlIHRocm91Z2ggdGhlIGRlZmluZWQgcmFuZ2UuXG4gICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDw9IGZpbmlzaCAtIHN0YXJ0OyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgbWFyayA9IFN0cmluZy5mcm9tQ2hhckNvZGUoc3RhcnQgKyBqKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgc3RhdGUubWFya3NbbWFya107XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNob3dDb25maXJtKGNtLCAnSW52YWxpZCBhcmd1bWVudDogJyArIHN0YXJ0TWFyayArICctJyk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVGhpcyBzeW1ib2wgaXMgYSB2YWxpZCBtYXJrLCBhbmQgaXMgbm90IHBhcnQgb2YgYSByYW5nZS5cbiAgICAgICAgICAgIGRlbGV0ZSBzdGF0ZS5tYXJrc1tzeW1dO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZXhDb21tYW5kRGlzcGF0Y2hlciA9IG5ldyBFeENvbW1hbmREaXNwYXRjaGVyKCk7XG5cbiAgICAvKipcbiAgICAqIEBwYXJhbSB7Q29kZU1pcnJvcn0gY20gQ29kZU1pcnJvciBpbnN0YW5jZSB3ZSBhcmUgaW4uXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbmZpcm0gV2hldGhlciB0byBjb25maXJtIGVhY2ggcmVwbGFjZS5cbiAgICAqIEBwYXJhbSB7Q3Vyc29yfSBsaW5lU3RhcnQgTGluZSB0byBzdGFydCByZXBsYWNpbmcgZnJvbS5cbiAgICAqIEBwYXJhbSB7Q3Vyc29yfSBsaW5lRW5kIExpbmUgdG8gc3RvcCByZXBsYWNpbmcgYXQuXG4gICAgKiBAcGFyYW0ge1JlZ0V4cH0gcXVlcnkgUXVlcnkgZm9yIHBlcmZvcm1pbmcgbWF0Y2hlcyB3aXRoLlxuICAgICogQHBhcmFtIHtzdHJpbmd9IHJlcGxhY2VXaXRoIFRleHQgdG8gcmVwbGFjZSBtYXRjaGVzIHdpdGguIE1heSBjb250YWluICQxLFxuICAgICogICAgICQyLCBldGMgZm9yIHJlcGxhY2luZyBjYXB0dXJlZCBncm91cHMgdXNpbmcgSmF2YXNjcmlwdCByZXBsYWNlLlxuICAgICogQHBhcmFtIHtmdW5jdGlvbigpfSBjYWxsYmFjayBBIGNhbGxiYWNrIGZvciB3aGVuIHRoZSByZXBsYWNlIGlzIGRvbmUuXG4gICAgKi9cbiAgICBmdW5jdGlvbiBkb1JlcGxhY2UoY20sIGNvbmZpcm0sIGdsb2JhbCwgbGluZVN0YXJ0LCBsaW5lRW5kLCBzZWFyY2hDdXJzb3IsIHF1ZXJ5LFxuICAgICAgICByZXBsYWNlV2l0aCwgY2FsbGJhY2spIHtcbiAgICAgIC8vIFNldCB1cCBhbGwgdGhlIGZ1bmN0aW9ucy5cbiAgICAgIGNtLnN0YXRlLnZpbS5leE1vZGUgPSB0cnVlO1xuICAgICAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgICAgIHZhciBsYXN0UG9zID0gc2VhcmNoQ3Vyc29yLmZyb20oKTtcbiAgICAgIGZ1bmN0aW9uIHJlcGxhY2VBbGwoKSB7XG4gICAgICAgIGNtLm9wZXJhdGlvbihmdW5jdGlvbigpIHtcbiAgICAgICAgICB3aGlsZSAoIWRvbmUpIHtcbiAgICAgICAgICAgIHJlcGxhY2UoKTtcbiAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RvcCgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIHJlcGxhY2UoKSB7XG4gICAgICAgIHZhciB0ZXh0ID0gY20uZ2V0UmFuZ2Uoc2VhcmNoQ3Vyc29yLmZyb20oKSwgc2VhcmNoQ3Vyc29yLnRvKCkpO1xuICAgICAgICB2YXIgbmV3VGV4dCA9IHRleHQucmVwbGFjZShxdWVyeSwgcmVwbGFjZVdpdGgpO1xuICAgICAgICBzZWFyY2hDdXJzb3IucmVwbGFjZShuZXdUZXh0KTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgIC8vIFRoZSBiZWxvdyBvbmx5IGxvb3BzIHRvIHNraXAgb3ZlciBtdWx0aXBsZSBvY2N1cnJlbmNlcyBvbiB0aGUgc2FtZVxuICAgICAgICAvLyBsaW5lIHdoZW4gJ2dsb2JhbCcgaXMgbm90IHRydWUuXG4gICAgICAgIHdoaWxlKHNlYXJjaEN1cnNvci5maW5kTmV4dCgpICYmXG4gICAgICAgICAgICAgIGlzSW5SYW5nZShzZWFyY2hDdXJzb3IuZnJvbSgpLCBsaW5lU3RhcnQsIGxpbmVFbmQpKSB7XG4gICAgICAgICAgaWYgKCFnbG9iYWwgJiYgbGFzdFBvcyAmJiBzZWFyY2hDdXJzb3IuZnJvbSgpLmxpbmUgPT0gbGFzdFBvcy5saW5lKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY20uc2Nyb2xsSW50b1ZpZXcoc2VhcmNoQ3Vyc29yLmZyb20oKSwgMzApO1xuICAgICAgICAgIGNtLnNldFNlbGVjdGlvbihzZWFyY2hDdXJzb3IuZnJvbSgpLCBzZWFyY2hDdXJzb3IudG8oKSk7XG4gICAgICAgICAgbGFzdFBvcyA9IHNlYXJjaEN1cnNvci5mcm9tKCk7XG4gICAgICAgICAgZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIHN0b3AoY2xvc2UpIHtcbiAgICAgICAgaWYgKGNsb3NlKSB7IGNsb3NlKCk7IH1cbiAgICAgICAgY20uZm9jdXMoKTtcbiAgICAgICAgaWYgKGxhc3RQb3MpIHtcbiAgICAgICAgICBjbS5zZXRDdXJzb3IobGFzdFBvcyk7XG4gICAgICAgICAgdmFyIHZpbSA9IGNtLnN0YXRlLnZpbTtcbiAgICAgICAgICB2aW0uZXhNb2RlID0gZmFsc2U7XG4gICAgICAgICAgdmltLmxhc3RIUG9zID0gdmltLmxhc3RIU1BvcyA9IGxhc3RQb3MuY2g7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7IGNhbGxiYWNrKCk7IH1cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIG9uUHJvbXB0S2V5RG93bihlLCBfdmFsdWUsIGNsb3NlKSB7XG4gICAgICAgIC8vIFN3YWxsb3cgYWxsIGtleXMuXG4gICAgICAgIENvZGVNaXJyb3IuZV9zdG9wKGUpO1xuICAgICAgICB2YXIga2V5TmFtZSA9IENvZGVNaXJyb3Iua2V5TmFtZShlKTtcbiAgICAgICAgc3dpdGNoIChrZXlOYW1lKSB7XG4gICAgICAgICAgY2FzZSAnWSc6XG4gICAgICAgICAgICByZXBsYWNlKCk7IG5leHQoKTsgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnTic6XG4gICAgICAgICAgICBuZXh0KCk7IGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ0EnOlxuICAgICAgICAgICAgLy8gcmVwbGFjZUFsbCBjb250YWlucyBhIGNhbGwgdG8gY2xvc2Ugb2YgaXRzIG93bi4gV2UgZG9uJ3Qgd2FudCBpdFxuICAgICAgICAgICAgLy8gdG8gZmlyZSB0b28gZWFybHkgb3IgbXVsdGlwbGUgdGltZXMuXG4gICAgICAgICAgICB2YXIgc2F2ZWRDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICAgICAgY2FsbGJhY2sgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjbS5vcGVyYXRpb24ocmVwbGFjZUFsbCk7XG4gICAgICAgICAgICBjYWxsYmFjayA9IHNhdmVkQ2FsbGJhY2s7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdMJzpcbiAgICAgICAgICAgIHJlcGxhY2UoKTtcbiAgICAgICAgICAgIC8vIGZhbGwgdGhyb3VnaCBhbmQgZXhpdC5cbiAgICAgICAgICBjYXNlICdRJzpcbiAgICAgICAgICBjYXNlICdFc2MnOlxuICAgICAgICAgIGNhc2UgJ0N0cmwtQyc6XG4gICAgICAgICAgY2FzZSAnQ3RybC1bJzpcbiAgICAgICAgICAgIHN0b3AoY2xvc2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRvbmUpIHsgc3RvcChjbG9zZSk7IH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEFjdHVhbGx5IGRvIHJlcGxhY2UuXG4gICAgICBuZXh0KCk7XG4gICAgICBpZiAoZG9uZSkge1xuICAgICAgICBzaG93Q29uZmlybShjbSwgJ05vIG1hdGNoZXMgZm9yICcgKyBxdWVyeS5zb3VyY2UpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIWNvbmZpcm0pIHtcbiAgICAgICAgcmVwbGFjZUFsbCgpO1xuICAgICAgICBpZiAoY2FsbGJhY2spIHsgY2FsbGJhY2soKTsgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzaG93UHJvbXB0KGNtLCB7XG4gICAgICAgIHByZWZpeDogJ3JlcGxhY2Ugd2l0aCA8c3Ryb25nPicgKyByZXBsYWNlV2l0aCArICc8L3N0cm9uZz4gKHkvbi9hL3EvbCknLFxuICAgICAgICBvbktleURvd246IG9uUHJvbXB0S2V5RG93blxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgQ29kZU1pcnJvci5rZXlNYXAudmltID0ge1xuICAgICAgYXR0YWNoOiBhdHRhY2hWaW1NYXAsXG4gICAgICBkZXRhY2g6IGRldGFjaFZpbU1hcCxcbiAgICAgIGNhbGw6IGNtS2V5XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGV4aXRJbnNlcnRNb2RlKGNtKSB7XG4gICAgICB2YXIgdmltID0gY20uc3RhdGUudmltO1xuICAgICAgdmFyIG1hY3JvTW9kZVN0YXRlID0gdmltR2xvYmFsU3RhdGUubWFjcm9Nb2RlU3RhdGU7XG4gICAgICB2YXIgaW5zZXJ0TW9kZUNoYW5nZVJlZ2lzdGVyID0gdmltR2xvYmFsU3RhdGUucmVnaXN0ZXJDb250cm9sbGVyLmdldFJlZ2lzdGVyKCcuJyk7XG4gICAgICB2YXIgaXNQbGF5aW5nID0gbWFjcm9Nb2RlU3RhdGUuaXNQbGF5aW5nO1xuICAgICAgdmFyIGxhc3RDaGFuZ2UgPSBtYWNyb01vZGVTdGF0ZS5sYXN0SW5zZXJ0TW9kZUNoYW5nZXM7XG4gICAgICBpZiAoIWlzUGxheWluZykge1xuICAgICAgICBjbS5vZmYoJ2NoYW5nZScsIG9uQ2hhbmdlKTtcbiAgICAgICAgQ29kZU1pcnJvci5vZmYoY20uZ2V0SW5wdXRGaWVsZCgpLCAna2V5ZG93bicsIG9uS2V5RXZlbnRUYXJnZXRLZXlEb3duKTtcbiAgICAgIH1cbiAgICAgIGlmICghaXNQbGF5aW5nICYmIHZpbS5pbnNlcnRNb2RlUmVwZWF0ID4gMSkge1xuICAgICAgICAvLyBQZXJmb3JtIGluc2VydCBtb2RlIHJlcGVhdCBmb3IgY29tbWFuZHMgbGlrZSAzLGEgYW5kIDMsby5cbiAgICAgICAgcmVwZWF0TGFzdEVkaXQoY20sIHZpbSwgdmltLmluc2VydE1vZGVSZXBlYXQgLSAxLFxuICAgICAgICAgICAgdHJ1ZSAvKiogcmVwZWF0Rm9ySW5zZXJ0ICovKTtcbiAgICAgICAgdmltLmxhc3RFZGl0SW5wdXRTdGF0ZS5yZXBlYXRPdmVycmlkZSA9IHZpbS5pbnNlcnRNb2RlUmVwZWF0O1xuICAgICAgfVxuICAgICAgZGVsZXRlIHZpbS5pbnNlcnRNb2RlUmVwZWF0O1xuICAgICAgdmltLmluc2VydE1vZGUgPSBmYWxzZTtcbiAgICAgIGNtLnNldEN1cnNvcihjbS5nZXRDdXJzb3IoKS5saW5lLCBjbS5nZXRDdXJzb3IoKS5jaC0xKTtcbiAgICAgIGNtLnNldE9wdGlvbigna2V5TWFwJywgJ3ZpbScpO1xuICAgICAgY20uc2V0T3B0aW9uKCdkaXNhYmxlSW5wdXQnLCB0cnVlKTtcbiAgICAgIGNtLnRvZ2dsZU92ZXJ3cml0ZShmYWxzZSk7IC8vIGV4aXQgcmVwbGFjZSBtb2RlIGlmIHdlIHdlcmUgaW4gaXQuXG4gICAgICAvLyB1cGRhdGUgdGhlIFwiLiByZWdpc3RlciBiZWZvcmUgZXhpdGluZyBpbnNlcnQgbW9kZVxuICAgICAgaW5zZXJ0TW9kZUNoYW5nZVJlZ2lzdGVyLnNldFRleHQobGFzdENoYW5nZS5jaGFuZ2VzLmpvaW4oJycpKTtcbiAgICAgIENvZGVNaXJyb3Iuc2lnbmFsKGNtLCBcInZpbS1tb2RlLWNoYW5nZVwiLCB7bW9kZTogXCJub3JtYWxcIn0pO1xuICAgICAgaWYgKG1hY3JvTW9kZVN0YXRlLmlzUmVjb3JkaW5nKSB7XG4gICAgICAgIGxvZ0luc2VydE1vZGVDaGFuZ2UobWFjcm9Nb2RlU3RhdGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9tYXBDb21tYW5kKGNvbW1hbmQpIHtcbiAgICAgIGRlZmF1bHRLZXltYXAudW5zaGlmdChjb21tYW5kKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXBDb21tYW5kKGtleXMsIHR5cGUsIG5hbWUsIGFyZ3MsIGV4dHJhKSB7XG4gICAgICB2YXIgY29tbWFuZCA9IHtrZXlzOiBrZXlzLCB0eXBlOiB0eXBlfTtcbiAgICAgIGNvbW1hbmRbdHlwZV0gPSBuYW1lO1xuICAgICAgY29tbWFuZFt0eXBlICsgXCJBcmdzXCJdID0gYXJncztcbiAgICAgIGZvciAodmFyIGtleSBpbiBleHRyYSlcbiAgICAgICAgY29tbWFuZFtrZXldID0gZXh0cmFba2V5XTtcbiAgICAgIF9tYXBDb21tYW5kKGNvbW1hbmQpO1xuICAgIH1cblxuICAgIC8vIFRoZSB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyBmb3IgdGhlIHR3by1jaGFyYWN0ZXIgRVNDIGtleW1hcCBzaG91bGQgYmVcbiAgICAvLyBhZGp1c3RlZCBhY2NvcmRpbmcgdG8geW91ciB0eXBpbmcgc3BlZWQgdG8gcHJldmVudCBmYWxzZSBwb3NpdGl2ZXMuXG4gICAgZGVmaW5lT3B0aW9uKCdpbnNlcnRNb2RlRXNjS2V5c1RpbWVvdXQnLCAyMDAsICdudW1iZXInKTtcblxuICAgIENvZGVNaXJyb3Iua2V5TWFwWyd2aW0taW5zZXJ0J10gPSB7XG4gICAgICAvLyBUT0RPOiBvdmVycmlkZSBuYXZpZ2F0aW9uIGtleXMgc28gdGhhdCBFc2Mgd2lsbCBjYW5jZWwgYXV0b21hdGljXG4gICAgICAvLyBpbmRlbnRhdGlvbiBmcm9tIG8sIE8sIGlfPENSPlxuICAgICAgZmFsbHRocm91Z2g6IFsnZGVmYXVsdCddLFxuICAgICAgYXR0YWNoOiBhdHRhY2hWaW1NYXAsXG4gICAgICBkZXRhY2g6IGRldGFjaFZpbU1hcCxcbiAgICAgIGNhbGw6IGNtS2V5XG4gICAgfTtcblxuICAgIENvZGVNaXJyb3Iua2V5TWFwWyd2aW0tcmVwbGFjZSddID0ge1xuICAgICAgJ0JhY2tzcGFjZSc6ICdnb0NoYXJMZWZ0JyxcbiAgICAgIGZhbGx0aHJvdWdoOiBbJ3ZpbS1pbnNlcnQnXSxcbiAgICAgIGF0dGFjaDogYXR0YWNoVmltTWFwLFxuICAgICAgZGV0YWNoOiBkZXRhY2hWaW1NYXAsXG4gICAgICBjYWxsOiBjbUtleVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBleGVjdXRlTWFjcm9SZWdpc3RlcihjbSwgdmltLCBtYWNyb01vZGVTdGF0ZSwgcmVnaXN0ZXJOYW1lKSB7XG4gICAgICB2YXIgcmVnaXN0ZXIgPSB2aW1HbG9iYWxTdGF0ZS5yZWdpc3RlckNvbnRyb2xsZXIuZ2V0UmVnaXN0ZXIocmVnaXN0ZXJOYW1lKTtcbiAgICAgIGlmIChyZWdpc3Rlck5hbWUgPT0gJzonKSB7XG4gICAgICAgIC8vIFJlYWQtb25seSByZWdpc3RlciBjb250YWluaW5nIGxhc3QgRXggY29tbWFuZC5cbiAgICAgICAgaWYgKHJlZ2lzdGVyLmtleUJ1ZmZlclswXSkge1xuICAgICAgICAgIGV4Q29tbWFuZERpc3BhdGNoZXIucHJvY2Vzc0NvbW1hbmQoY20sIHJlZ2lzdGVyLmtleUJ1ZmZlclswXSk7XG4gICAgICAgIH1cbiAgICAgICAgbWFjcm9Nb2RlU3RhdGUuaXNQbGF5aW5nID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBrZXlCdWZmZXIgPSByZWdpc3Rlci5rZXlCdWZmZXI7XG4gICAgICB2YXIgaW1jID0gMDtcbiAgICAgIG1hY3JvTW9kZVN0YXRlLmlzUGxheWluZyA9IHRydWU7XG4gICAgICBtYWNyb01vZGVTdGF0ZS5yZXBsYXlTZWFyY2hRdWVyaWVzID0gcmVnaXN0ZXIuc2VhcmNoUXVlcmllcy5zbGljZSgwKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5QnVmZmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0ZXh0ID0ga2V5QnVmZmVyW2ldO1xuICAgICAgICB2YXIgbWF0Y2gsIGtleTtcbiAgICAgICAgd2hpbGUgKHRleHQpIHtcbiAgICAgICAgICAvLyBQdWxsIG9mZiBvbmUgY29tbWFuZCBrZXksIHdoaWNoIGlzIGVpdGhlciBhIHNpbmdsZSBjaGFyYWN0ZXJcbiAgICAgICAgICAvLyBvciBhIHNwZWNpYWwgc2VxdWVuY2Ugd3JhcHBlZCBpbiAnPCcgYW5kICc+JywgZS5nLiAnPFNwYWNlPicuXG4gICAgICAgICAgbWF0Y2ggPSAoLzxcXHcrLS4rPz58PFxcdys+fC4vKS5leGVjKHRleHQpO1xuICAgICAgICAgIGtleSA9IG1hdGNoWzBdO1xuICAgICAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cmluZyhtYXRjaC5pbmRleCArIGtleS5sZW5ndGgpO1xuICAgICAgICAgIENvZGVNaXJyb3IuVmltLmhhbmRsZUtleShjbSwga2V5LCAnbWFjcm8nKTtcbiAgICAgICAgICBpZiAodmltLmluc2VydE1vZGUpIHtcbiAgICAgICAgICAgIHZhciBjaGFuZ2VzID0gcmVnaXN0ZXIuaW5zZXJ0TW9kZUNoYW5nZXNbaW1jKytdLmNoYW5nZXM7XG4gICAgICAgICAgICB2aW1HbG9iYWxTdGF0ZS5tYWNyb01vZGVTdGF0ZS5sYXN0SW5zZXJ0TW9kZUNoYW5nZXMuY2hhbmdlcyA9XG4gICAgICAgICAgICAgICAgY2hhbmdlcztcbiAgICAgICAgICAgIHJlcGVhdEluc2VydE1vZGVDaGFuZ2VzKGNtLCBjaGFuZ2VzLCAxKTtcbiAgICAgICAgICAgIGV4aXRJbnNlcnRNb2RlKGNtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG1hY3JvTW9kZVN0YXRlLmlzUGxheWluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvZ0tleShtYWNyb01vZGVTdGF0ZSwga2V5KSB7XG4gICAgICBpZiAobWFjcm9Nb2RlU3RhdGUuaXNQbGF5aW5nKSB7IHJldHVybjsgfVxuICAgICAgdmFyIHJlZ2lzdGVyTmFtZSA9IG1hY3JvTW9kZVN0YXRlLmxhdGVzdFJlZ2lzdGVyO1xuICAgICAgdmFyIHJlZ2lzdGVyID0gdmltR2xvYmFsU3RhdGUucmVnaXN0ZXJDb250cm9sbGVyLmdldFJlZ2lzdGVyKHJlZ2lzdGVyTmFtZSk7XG4gICAgICBpZiAocmVnaXN0ZXIpIHtcbiAgICAgICAgcmVnaXN0ZXIucHVzaFRleHQoa2V5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2dJbnNlcnRNb2RlQ2hhbmdlKG1hY3JvTW9kZVN0YXRlKSB7XG4gICAgICBpZiAobWFjcm9Nb2RlU3RhdGUuaXNQbGF5aW5nKSB7IHJldHVybjsgfVxuICAgICAgdmFyIHJlZ2lzdGVyTmFtZSA9IG1hY3JvTW9kZVN0YXRlLmxhdGVzdFJlZ2lzdGVyO1xuICAgICAgdmFyIHJlZ2lzdGVyID0gdmltR2xvYmFsU3RhdGUucmVnaXN0ZXJDb250cm9sbGVyLmdldFJlZ2lzdGVyKHJlZ2lzdGVyTmFtZSk7XG4gICAgICBpZiAocmVnaXN0ZXIgJiYgcmVnaXN0ZXIucHVzaEluc2VydE1vZGVDaGFuZ2VzKSB7XG4gICAgICAgIHJlZ2lzdGVyLnB1c2hJbnNlcnRNb2RlQ2hhbmdlcyhtYWNyb01vZGVTdGF0ZS5sYXN0SW5zZXJ0TW9kZUNoYW5nZXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvZ1NlYXJjaFF1ZXJ5KG1hY3JvTW9kZVN0YXRlLCBxdWVyeSkge1xuICAgICAgaWYgKG1hY3JvTW9kZVN0YXRlLmlzUGxheWluZykgeyByZXR1cm47IH1cbiAgICAgIHZhciByZWdpc3Rlck5hbWUgPSBtYWNyb01vZGVTdGF0ZS5sYXRlc3RSZWdpc3RlcjtcbiAgICAgIHZhciByZWdpc3RlciA9IHZpbUdsb2JhbFN0YXRlLnJlZ2lzdGVyQ29udHJvbGxlci5nZXRSZWdpc3RlcihyZWdpc3Rlck5hbWUpO1xuICAgICAgaWYgKHJlZ2lzdGVyICYmIHJlZ2lzdGVyLnB1c2hTZWFyY2hRdWVyeSkge1xuICAgICAgICByZWdpc3Rlci5wdXNoU2VhcmNoUXVlcnkocXVlcnkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExpc3RlbnMgZm9yIGNoYW5nZXMgbWFkZSBpbiBpbnNlcnQgbW9kZS5cbiAgICAgKiBTaG91bGQgb25seSBiZSBhY3RpdmUgaW4gaW5zZXJ0IG1vZGUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gb25DaGFuZ2UoY20sIGNoYW5nZU9iaikge1xuICAgICAgdmFyIG1hY3JvTW9kZVN0YXRlID0gdmltR2xvYmFsU3RhdGUubWFjcm9Nb2RlU3RhdGU7XG4gICAgICB2YXIgbGFzdENoYW5nZSA9IG1hY3JvTW9kZVN0YXRlLmxhc3RJbnNlcnRNb2RlQ2hhbmdlcztcbiAgICAgIGlmICghbWFjcm9Nb2RlU3RhdGUuaXNQbGF5aW5nKSB7XG4gICAgICAgIHdoaWxlKGNoYW5nZU9iaikge1xuICAgICAgICAgIGxhc3RDaGFuZ2UuZXhwZWN0Q3Vyc29yQWN0aXZpdHlGb3JDaGFuZ2UgPSB0cnVlO1xuICAgICAgICAgIGlmIChsYXN0Q2hhbmdlLmlnbm9yZUNvdW50ID4gMSkge1xuICAgICAgICAgICAgbGFzdENoYW5nZS5pZ25vcmVDb3VudC0tO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY2hhbmdlT2JqLm9yaWdpbiA9PSAnK2lucHV0JyB8fCBjaGFuZ2VPYmoub3JpZ2luID09ICdwYXN0ZSdcbiAgICAgICAgICAgICAgfHwgY2hhbmdlT2JqLm9yaWdpbiA9PT0gdW5kZWZpbmVkIC8qIG9ubHkgaW4gdGVzdGluZyAqLykge1xuICAgICAgICAgICAgdmFyIHNlbGVjdGlvbkNvdW50ID0gY20ubGlzdFNlbGVjdGlvbnMoKS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoc2VsZWN0aW9uQ291bnQgPiAxKVxuICAgICAgICAgICAgICBsYXN0Q2hhbmdlLmlnbm9yZUNvdW50ID0gc2VsZWN0aW9uQ291bnQ7XG4gICAgICAgICAgICB2YXIgdGV4dCA9IGNoYW5nZU9iai50ZXh0LmpvaW4oJ1xcbicpO1xuICAgICAgICAgICAgaWYgKGxhc3RDaGFuZ2UubWF5YmVSZXNldCkge1xuICAgICAgICAgICAgICBsYXN0Q2hhbmdlLmNoYW5nZXMgPSBbXTtcbiAgICAgICAgICAgICAgbGFzdENoYW5nZS5tYXliZVJlc2V0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGV4dCkge1xuICAgICAgICAgICAgICBpZiAoY20uc3RhdGUub3ZlcndyaXRlICYmICEvXFxuLy50ZXN0KHRleHQpKSB7XG4gICAgICAgICAgICAgICAgbGFzdENoYW5nZS5jaGFuZ2VzLnB1c2goW3RleHRdKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsYXN0Q2hhbmdlLmNoYW5nZXMucHVzaCh0ZXh0KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBDaGFuZ2Ugb2JqZWN0cyBtYXkgYmUgY2hhaW5lZCB3aXRoIG5leHQuXG4gICAgICAgICAgY2hhbmdlT2JqID0gY2hhbmdlT2JqLm5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAqIExpc3RlbnMgZm9yIGFueSBraW5kIG9mIGN1cnNvciBhY3Rpdml0eSBvbiBDb2RlTWlycm9yLlxuICAgICovXG4gICAgZnVuY3Rpb24gb25DdXJzb3JBY3Rpdml0eShjbSkge1xuICAgICAgdmFyIHZpbSA9IGNtLnN0YXRlLnZpbTtcbiAgICAgIGlmICh2aW0uaW5zZXJ0TW9kZSkge1xuICAgICAgICAvLyBUcmFja2luZyBjdXJzb3IgYWN0aXZpdHkgaW4gaW5zZXJ0IG1vZGUgKGZvciBtYWNybyBzdXBwb3J0KS5cbiAgICAgICAgdmFyIG1hY3JvTW9kZVN0YXRlID0gdmltR2xvYmFsU3RhdGUubWFjcm9Nb2RlU3RhdGU7XG4gICAgICAgIGlmIChtYWNyb01vZGVTdGF0ZS5pc1BsYXlpbmcpIHsgcmV0dXJuOyB9XG4gICAgICAgIHZhciBsYXN0Q2hhbmdlID0gbWFjcm9Nb2RlU3RhdGUubGFzdEluc2VydE1vZGVDaGFuZ2VzO1xuICAgICAgICBpZiAobGFzdENoYW5nZS5leHBlY3RDdXJzb3JBY3Rpdml0eUZvckNoYW5nZSkge1xuICAgICAgICAgIGxhc3RDaGFuZ2UuZXhwZWN0Q3Vyc29yQWN0aXZpdHlGb3JDaGFuZ2UgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBDdXJzb3IgbW92ZWQgb3V0c2lkZSB0aGUgY29udGV4dCBvZiBhbiBlZGl0LiBSZXNldCB0aGUgY2hhbmdlLlxuICAgICAgICAgIGxhc3RDaGFuZ2UubWF5YmVSZXNldCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIWNtLmN1ck9wLmlzVmltT3ApIHtcbiAgICAgICAgaGFuZGxlRXh0ZXJuYWxTZWxlY3Rpb24oY20sIHZpbSk7XG4gICAgICB9XG4gICAgICBpZiAodmltLnZpc3VhbE1vZGUpIHtcbiAgICAgICAgdXBkYXRlRmFrZUN1cnNvcihjbSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZGF0ZUZha2VDdXJzb3IoY20pIHtcbiAgICAgIHZhciB2aW0gPSBjbS5zdGF0ZS52aW07XG4gICAgICB2YXIgZnJvbSA9IGNsaXBDdXJzb3JUb0NvbnRlbnQoY20sIGNvcHlDdXJzb3IodmltLnNlbC5oZWFkKSk7XG4gICAgICB2YXIgdG8gPSBvZmZzZXRDdXJzb3IoZnJvbSwgMCwgMSk7XG4gICAgICBpZiAodmltLmZha2VDdXJzb3IpIHtcbiAgICAgICAgdmltLmZha2VDdXJzb3IuY2xlYXIoKTtcbiAgICAgIH1cbiAgICAgIHZpbS5mYWtlQ3Vyc29yID0gY20ubWFya1RleHQoZnJvbSwgdG8sIHtjbGFzc05hbWU6ICdjbS1hbmltYXRlLWZhdC1jdXJzb3InfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGhhbmRsZUV4dGVybmFsU2VsZWN0aW9uKGNtLCB2aW0pIHtcbiAgICAgIHZhciBhbmNob3IgPSBjbS5nZXRDdXJzb3IoJ2FuY2hvcicpO1xuICAgICAgdmFyIGhlYWQgPSBjbS5nZXRDdXJzb3IoJ2hlYWQnKTtcbiAgICAgIC8vIEVudGVyIG9yIGV4aXQgdmlzdWFsIG1vZGUgdG8gbWF0Y2ggbW91c2Ugc2VsZWN0aW9uLlxuICAgICAgaWYgKHZpbS52aXN1YWxNb2RlICYmICFjbS5zb21ldGhpbmdTZWxlY3RlZCgpKSB7XG4gICAgICAgIGV4aXRWaXN1YWxNb2RlKGNtLCBmYWxzZSk7XG4gICAgICB9IGVsc2UgaWYgKCF2aW0udmlzdWFsTW9kZSAmJiAhdmltLmluc2VydE1vZGUgJiYgY20uc29tZXRoaW5nU2VsZWN0ZWQoKSkge1xuICAgICAgICB2aW0udmlzdWFsTW9kZSA9IHRydWU7XG4gICAgICAgIHZpbS52aXN1YWxMaW5lID0gZmFsc2U7XG4gICAgICAgIENvZGVNaXJyb3Iuc2lnbmFsKGNtLCBcInZpbS1tb2RlLWNoYW5nZVwiLCB7bW9kZTogXCJ2aXN1YWxcIn0pO1xuICAgICAgfVxuICAgICAgaWYgKHZpbS52aXN1YWxNb2RlKSB7XG4gICAgICAgIC8vIEJpbmQgQ29kZU1pcnJvciBzZWxlY3Rpb24gbW9kZWwgdG8gdmltIHNlbGVjdGlvbiBtb2RlbC5cbiAgICAgICAgLy8gTW91c2Ugc2VsZWN0aW9ucyBhcmUgY29uc2lkZXJlZCB2aXN1YWwgY2hhcmFjdGVyd2lzZS5cbiAgICAgICAgdmFyIGhlYWRPZmZzZXQgPSAhY3Vyc29ySXNCZWZvcmUoaGVhZCwgYW5jaG9yKSA/IC0xIDogMDtcbiAgICAgICAgdmFyIGFuY2hvck9mZnNldCA9IGN1cnNvcklzQmVmb3JlKGhlYWQsIGFuY2hvcikgPyAtMSA6IDA7XG4gICAgICAgIGhlYWQgPSBvZmZzZXRDdXJzb3IoaGVhZCwgMCwgaGVhZE9mZnNldCk7XG4gICAgICAgIGFuY2hvciA9IG9mZnNldEN1cnNvcihhbmNob3IsIDAsIGFuY2hvck9mZnNldCk7XG4gICAgICAgIHZpbS5zZWwgPSB7XG4gICAgICAgICAgYW5jaG9yOiBhbmNob3IsXG4gICAgICAgICAgaGVhZDogaGVhZFxuICAgICAgICB9O1xuICAgICAgICB1cGRhdGVNYXJrKGNtLCB2aW0sICc8JywgY3Vyc29yTWluKGhlYWQsIGFuY2hvcikpO1xuICAgICAgICB1cGRhdGVNYXJrKGNtLCB2aW0sICc+JywgY3Vyc29yTWF4KGhlYWQsIGFuY2hvcikpO1xuICAgICAgfSBlbHNlIGlmICghdmltLmluc2VydE1vZGUpIHtcbiAgICAgICAgLy8gUmVzZXQgbGFzdEhQb3MgaWYgc2VsZWN0aW9uIHdhcyBtb2RpZmllZCBieSBzb21ldGhpbmcgb3V0c2lkZSBvZiB2aW0gbW9kZSBlLmcuIGJ5IG1vdXNlLlxuICAgICAgICB2aW0ubGFzdEhQb3MgPSBjbS5nZXRDdXJzb3IoKS5jaDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogV3JhcHBlciBmb3Igc3BlY2lhbCBrZXlzIHByZXNzZWQgaW4gaW5zZXJ0IG1vZGUgKi9cbiAgICBmdW5jdGlvbiBJbnNlcnRNb2RlS2V5KGtleU5hbWUpIHtcbiAgICAgIHRoaXMua2V5TmFtZSA9IGtleU5hbWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBIYW5kbGVzIHJhdyBrZXkgZG93biBldmVudHMgZnJvbSB0aGUgdGV4dCBhcmVhLlxuICAgICogLSBTaG91bGQgb25seSBiZSBhY3RpdmUgaW4gaW5zZXJ0IG1vZGUuXG4gICAgKiAtIEZvciByZWNvcmRpbmcgZGVsZXRlcyBpbiBpbnNlcnQgbW9kZS5cbiAgICAqL1xuICAgIGZ1bmN0aW9uIG9uS2V5RXZlbnRUYXJnZXRLZXlEb3duKGUpIHtcbiAgICAgIHZhciBtYWNyb01vZGVTdGF0ZSA9IHZpbUdsb2JhbFN0YXRlLm1hY3JvTW9kZVN0YXRlO1xuICAgICAgdmFyIGxhc3RDaGFuZ2UgPSBtYWNyb01vZGVTdGF0ZS5sYXN0SW5zZXJ0TW9kZUNoYW5nZXM7XG4gICAgICB2YXIga2V5TmFtZSA9IENvZGVNaXJyb3Iua2V5TmFtZShlKTtcbiAgICAgIGlmICgha2V5TmFtZSkgeyByZXR1cm47IH1cbiAgICAgIGZ1bmN0aW9uIG9uS2V5Rm91bmQoKSB7XG4gICAgICAgIGlmIChsYXN0Q2hhbmdlLm1heWJlUmVzZXQpIHtcbiAgICAgICAgICBsYXN0Q2hhbmdlLmNoYW5nZXMgPSBbXTtcbiAgICAgICAgICBsYXN0Q2hhbmdlLm1heWJlUmVzZXQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsYXN0Q2hhbmdlLmNoYW5nZXMucHVzaChuZXcgSW5zZXJ0TW9kZUtleShrZXlOYW1lKSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGtleU5hbWUuaW5kZXhPZignRGVsZXRlJykgIT0gLTEgfHwga2V5TmFtZS5pbmRleE9mKCdCYWNrc3BhY2UnKSAhPSAtMSkge1xuICAgICAgICBDb2RlTWlycm9yLmxvb2t1cEtleShrZXlOYW1lLCAndmltLWluc2VydCcsIG9uS2V5Rm91bmQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlcGVhdHMgdGhlIGxhc3QgZWRpdCwgd2hpY2ggaW5jbHVkZXMgZXhhY3RseSAxIGNvbW1hbmQgYW5kIGF0IG1vc3QgMVxuICAgICAqIGluc2VydC4gT3BlcmF0b3IgYW5kIG1vdGlvbiBjb21tYW5kcyBhcmUgcmVhZCBmcm9tIGxhc3RFZGl0SW5wdXRTdGF0ZSxcbiAgICAgKiB3aGlsZSBhY3Rpb24gY29tbWFuZHMgYXJlIHJlYWQgZnJvbSBsYXN0RWRpdEFjdGlvbkNvbW1hbmQuXG4gICAgICpcbiAgICAgKiBJZiByZXBlYXRGb3JJbnNlcnQgaXMgdHJ1ZSwgdGhlbiB0aGUgZnVuY3Rpb24gd2FzIGNhbGxlZCBieVxuICAgICAqIGV4aXRJbnNlcnRNb2RlIHRvIHJlcGVhdCB0aGUgaW5zZXJ0IG1vZGUgY2hhbmdlcyB0aGUgdXNlciBqdXN0IG1hZGUuIFRoZVxuICAgICAqIGNvcnJlc3BvbmRpbmcgZW50ZXJJbnNlcnRNb2RlIGNhbGwgd2FzIG1hZGUgd2l0aCBhIGNvdW50LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlcGVhdExhc3RFZGl0KGNtLCB2aW0sIHJlcGVhdCwgcmVwZWF0Rm9ySW5zZXJ0KSB7XG4gICAgICB2YXIgbWFjcm9Nb2RlU3RhdGUgPSB2aW1HbG9iYWxTdGF0ZS5tYWNyb01vZGVTdGF0ZTtcbiAgICAgIG1hY3JvTW9kZVN0YXRlLmlzUGxheWluZyA9IHRydWU7XG4gICAgICB2YXIgaXNBY3Rpb24gPSAhIXZpbS5sYXN0RWRpdEFjdGlvbkNvbW1hbmQ7XG4gICAgICB2YXIgY2FjaGVkSW5wdXRTdGF0ZSA9IHZpbS5pbnB1dFN0YXRlO1xuICAgICAgZnVuY3Rpb24gcmVwZWF0Q29tbWFuZCgpIHtcbiAgICAgICAgaWYgKGlzQWN0aW9uKSB7XG4gICAgICAgICAgY29tbWFuZERpc3BhdGNoZXIucHJvY2Vzc0FjdGlvbihjbSwgdmltLCB2aW0ubGFzdEVkaXRBY3Rpb25Db21tYW5kKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb21tYW5kRGlzcGF0Y2hlci5ldmFsSW5wdXQoY20sIHZpbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIHJlcGVhdEluc2VydChyZXBlYXQpIHtcbiAgICAgICAgaWYgKG1hY3JvTW9kZVN0YXRlLmxhc3RJbnNlcnRNb2RlQ2hhbmdlcy5jaGFuZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAvLyBGb3Igc29tZSByZWFzb24sIHJlcGVhdCBjdyBpbiBkZXNrdG9wIFZJTSBkb2VzIG5vdCByZXBlYXRcbiAgICAgICAgICAvLyBpbnNlcnQgbW9kZSBjaGFuZ2VzLiBXaWxsIGNvbmZvcm0gdG8gdGhhdCBiZWhhdmlvci5cbiAgICAgICAgICByZXBlYXQgPSAhdmltLmxhc3RFZGl0QWN0aW9uQ29tbWFuZCA/IDEgOiByZXBlYXQ7XG4gICAgICAgICAgdmFyIGNoYW5nZU9iamVjdCA9IG1hY3JvTW9kZVN0YXRlLmxhc3RJbnNlcnRNb2RlQ2hhbmdlcztcbiAgICAgICAgICByZXBlYXRJbnNlcnRNb2RlQ2hhbmdlcyhjbSwgY2hhbmdlT2JqZWN0LmNoYW5nZXMsIHJlcGVhdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZpbS5pbnB1dFN0YXRlID0gdmltLmxhc3RFZGl0SW5wdXRTdGF0ZTtcbiAgICAgIGlmIChpc0FjdGlvbiAmJiB2aW0ubGFzdEVkaXRBY3Rpb25Db21tYW5kLmludGVybGFjZUluc2VydFJlcGVhdCkge1xuICAgICAgICAvLyBvIGFuZCBPIHJlcGVhdCBoYXZlIHRvIGJlIGludGVybGFjZWQgd2l0aCBpbnNlcnQgcmVwZWF0cyBzbyB0aGF0IHRoZVxuICAgICAgICAvLyBpbnNlcnRpb25zIGFwcGVhciBvbiBzZXBhcmF0ZSBsaW5lcyBpbnN0ZWFkIG9mIHRoZSBsYXN0IGxpbmUuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVwZWF0OyBpKyspIHtcbiAgICAgICAgICByZXBlYXRDb21tYW5kKCk7XG4gICAgICAgICAgcmVwZWF0SW5zZXJ0KDEpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIXJlcGVhdEZvckluc2VydCkge1xuICAgICAgICAgIC8vIEhhY2sgdG8gZ2V0IHRoZSBjdXJzb3IgdG8gZW5kIHVwIGF0IHRoZSByaWdodCBwbGFjZS4gSWYgSSBpc1xuICAgICAgICAgIC8vIHJlcGVhdGVkIGluIGluc2VydCBtb2RlIHJlcGVhdCwgY3Vyc29yIHdpbGwgYmUgMSBpbnNlcnRcbiAgICAgICAgICAvLyBjaGFuZ2Ugc2V0IGxlZnQgb2Ygd2hlcmUgaXQgc2hvdWxkIGJlLlxuICAgICAgICAgIHJlcGVhdENvbW1hbmQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXBlYXRJbnNlcnQocmVwZWF0KTtcbiAgICAgIH1cbiAgICAgIHZpbS5pbnB1dFN0YXRlID0gY2FjaGVkSW5wdXRTdGF0ZTtcbiAgICAgIGlmICh2aW0uaW5zZXJ0TW9kZSAmJiAhcmVwZWF0Rm9ySW5zZXJ0KSB7XG4gICAgICAgIC8vIERvbid0IGV4aXQgaW5zZXJ0IG1vZGUgdHdpY2UuIElmIHJlcGVhdEZvckluc2VydCBpcyBzZXQsIHRoZW4gd2VcbiAgICAgICAgLy8gd2VyZSBjYWxsZWQgYnkgYW4gZXhpdEluc2VydE1vZGUgY2FsbCBsb3dlciBvbiB0aGUgc3RhY2suXG4gICAgICAgIGV4aXRJbnNlcnRNb2RlKGNtKTtcbiAgICAgIH1cbiAgICAgIG1hY3JvTW9kZVN0YXRlLmlzUGxheWluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlcGVhdEluc2VydE1vZGVDaGFuZ2VzKGNtLCBjaGFuZ2VzLCByZXBlYXQpIHtcbiAgICAgIGZ1bmN0aW9uIGtleUhhbmRsZXIoYmluZGluZykge1xuICAgICAgICBpZiAodHlwZW9mIGJpbmRpbmcgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBDb2RlTWlycm9yLmNvbW1hbmRzW2JpbmRpbmddKGNtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBiaW5kaW5nKGNtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHZhciBoZWFkID0gY20uZ2V0Q3Vyc29yKCdoZWFkJyk7XG4gICAgICB2YXIgdmlzdWFsQmxvY2sgPSB2aW1HbG9iYWxTdGF0ZS5tYWNyb01vZGVTdGF0ZS5sYXN0SW5zZXJ0TW9kZUNoYW5nZXMudmlzdWFsQmxvY2s7XG4gICAgICBpZiAodmlzdWFsQmxvY2spIHtcbiAgICAgICAgLy8gU2V0IHVwIGJsb2NrIHNlbGVjdGlvbiBhZ2FpbiBmb3IgcmVwZWF0aW5nIHRoZSBjaGFuZ2VzLlxuICAgICAgICBzZWxlY3RGb3JJbnNlcnQoY20sIGhlYWQsIHZpc3VhbEJsb2NrICsgMSk7XG4gICAgICAgIHJlcGVhdCA9IGNtLmxpc3RTZWxlY3Rpb25zKCkubGVuZ3RoO1xuICAgICAgICBjbS5zZXRDdXJzb3IoaGVhZCk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlcGVhdDsgaSsrKSB7XG4gICAgICAgIGlmICh2aXN1YWxCbG9jaykge1xuICAgICAgICAgIGNtLnNldEN1cnNvcihvZmZzZXRDdXJzb3IoaGVhZCwgaSwgMCkpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY2hhbmdlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIHZhciBjaGFuZ2UgPSBjaGFuZ2VzW2pdO1xuICAgICAgICAgIGlmIChjaGFuZ2UgaW5zdGFuY2VvZiBJbnNlcnRNb2RlS2V5KSB7XG4gICAgICAgICAgICBDb2RlTWlycm9yLmxvb2t1cEtleShjaGFuZ2Uua2V5TmFtZSwgJ3ZpbS1pbnNlcnQnLCBrZXlIYW5kbGVyKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjaGFuZ2UgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdmFyIGN1ciA9IGNtLmdldEN1cnNvcigpO1xuICAgICAgICAgICAgY20ucmVwbGFjZVJhbmdlKGNoYW5nZSwgY3VyLCBjdXIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgc3RhcnQgPSBjbS5nZXRDdXJzb3IoKTtcbiAgICAgICAgICAgIHZhciBlbmQgPSBvZmZzZXRDdXJzb3Ioc3RhcnQsIDAsIGNoYW5nZVswXS5sZW5ndGgpO1xuICAgICAgICAgICAgY20ucmVwbGFjZVJhbmdlKGNoYW5nZVswXSwgc3RhcnQsIGVuZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodmlzdWFsQmxvY2spIHtcbiAgICAgICAgY20uc2V0Q3Vyc29yKG9mZnNldEN1cnNvcihoZWFkLCAwLCAxKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVzZXRWaW1HbG9iYWxTdGF0ZSgpO1xuICAgIHJldHVybiB2aW1BcGk7XG4gIH07XG4gIC8vIEluaXRpYWxpemUgVmltIGFuZCBtYWtlIGl0IGF2YWlsYWJsZSBhcyBhbiBBUEkuXG4gIENvZGVNaXJyb3IuVmltID0gVmltKCk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=