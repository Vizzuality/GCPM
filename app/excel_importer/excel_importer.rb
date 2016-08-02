require 'roo'
require 'data_extractor'

class ExcelImporter

  def initialize(file)
    @projects_excel_book = Roo::Spreadsheet.open(file, extension: :xlsx)
    @errors = []
  end

  attr_reader :errors

  def import!
    @projects_excel_book.default_sheet = @projects_excel_book.sheets.first
    header = @projects_excel_book.first

    blank_row = Hash[header.map{|column_name| [column_name, nil]}]
    previous_row = nil

    parsed_excel = @projects_excel_book.each_with_index.map do |row, i|
      next if i.zero? # first row is the header

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
      unless row.blank?
        row.each{ |k,v| v.strip! if v.is_a?(String) && !(v.equal? v) }
        begin
          project_data = DataExtractor.new(row)
          project_data.extract_project
          project_data.extract_project_lead
          project_data.extract_collaborators
          project_data.extract_funding_sources
          @errors << project_data.errors.reject(&:blank?) if project_data.errors && !(project_data.errors.reject(&:blank?).blank?)
          Rails.logger.debug 'Project imported'
        rescue => e
          Rails.logger.debug e
          Rails.logger.debug e.backtrace.join("\n")
        end
      end
    end
  end

end
