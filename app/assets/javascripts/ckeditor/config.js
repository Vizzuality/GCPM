CKEDITOR.editorConfig = function (config) {
  config.language = 'en';

  //config.toolbar_mini = [
  //  ["Bold",  "Italic",  "Underline",  "Strike",  "-",  "Subscript",  "Superscript"],
  //];
  config.toolbarGroups = [
    { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
    { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
    { name: 'links', groups: [ 'links' ] },
    { name: 'insert', groups: [ 'insert' ] },
    { name: 'forms', groups: [ 'forms' ] },
    { name: 'tools', groups: [ 'tools' ] },
    { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
    { name: 'others', groups: [ 'others' ] },
    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
    { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
    { name: 'styles', groups: [ 'styles' ] },
    { name: 'colors', groups: [ 'colors' ] },
    { name: 'about', groups: [ 'about' ] }
  ];

  config.removeButtons = 'Subscript,Superscript,Scayt,Anchor,Table,HorizontalRule,SpecialChar,Maximize,Styles,About';
  config.toolbar = "simple";

  // ... rest of the original config.js  ...
}
