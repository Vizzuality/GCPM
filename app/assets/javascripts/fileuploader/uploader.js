$(document).ready(function(){
 if (document.getElementById('file-uploader')) {
    var uploader = new qq.FineUploader({
      element: document.getElementById('file-uploader'),
      request: {
        endpoint: '/admin/excel_upload/import'
      },
      text: {
        uploadButton: 'Import projects'
      },
      multiple: false,
      callbacks: {
        onSubmit: function() {},
        onComplete: function(id, fileName, response) {}
      }
    });
  }
});
