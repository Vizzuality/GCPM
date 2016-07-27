require 'roo'

class ExcelImporter

  def initialize(file)
    @projects_excel_book = Roo::Spreadsheet.open(file, extension: :xlsx)
  end

  attr_reader :errors

  def import!
    @errors = []
    @projects_excel_book.default_sheet = @projects_excel_book.sheets.first
    header = @projects_excel_book.first

    blank_row = Hash[header.map{|column_name| [column_name, nil]}]
    previous_row = nil

    parsed_excel = @projects_excel_book.each_with_index.map do |row, i|
      next if i == 0 # first row is the header

      project_id = row[0]

      current_row = if project_id.present?
                      blank_row.clone
                    else
                      previous_row.clone
                    end

      row.each_with_index do |cell, j|
        current_row[header[j]] = cell if project_id.present? || cell.present?
      end

      previous_row = current_row
    end

    parsed_excel.each do |row|
      begin
        Project.import_from_excel(row)
        Rails.logger.debug 'Project imported'
      rescue Exception => e
        Rails.logger.debug e
        Rails.logger.debug e.backtrace.join("\n")
      end
    end
  end

end
