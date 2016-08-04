ActiveAdmin.register_page "Excel Upload" do
  menu parent: "Administration", priority: 1

  controller do
    skip_before_action :verify_authenticity_token
    after_action :reset_keys, only: :import
    def index
      render 'admin/excel_upload/new', layout: 'active_admin'
    end
    def reset_keys
      Rake::Task['db:keys'].reenable # in case you're going to invoke the same task second time.
      Rake::Task['db:keys'].invoke
    end
  end
   page_action :import, method: :post  do
      importer = ExcelImporter.new(params[:qqfile].tempfile.path)

      if importer.import!

        render json: {
          success: true,
          errors: importer.errors
        }

      else

        render json: {
          success: false
        }

      end

    end
end
