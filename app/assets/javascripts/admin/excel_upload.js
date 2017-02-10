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
        onSubmit: function() {
          document.getElementById('errors').getElementsByTagName('tbody')[0].innerHTML = '';
        },
        onComplete: function(id, fileName, response) {
          console.dir(response);
          window.response=response;
          var errors = response.errors;
          var result = '';

          errors.map(function(error) {
            var specification = '';

            error[0].errors.map(function(error_type) {
              if (typeof error_type === 'object') {
                specification += Object.keys(error_type) + ': ' + error_type[Object.keys(error_type)] + '; ';
              } else {
                specification += error_type;
              }
            });

            result += '<tr><th>' + error[0].project + '</th><td>' + specification + '</td></tr>';
          });

          document.getElementById('errors').getElementsByTagName('tbody')[0].innerHTML = result;
        }
      }
    });
  }
});
