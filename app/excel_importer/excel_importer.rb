require 'roo'
# require 'data_extractor'

class ExcelImporter

  def initialize(file)
    @projects_excel_book = Roo::Spreadsheet.open(file, extension: :xlsx)
    @errors = []
  end

  attr_reader :errors

  def import!
    @projects_excel_book.default_sheet = @projects_excel_book.sheets.first
    header = @projects_excel_book.first
    return unless valid_header?(header)
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
          project_data.extract_project_lead if row['investigator_name'].present? || row['investigator_email_address'].present? || row['investigator_website'].present? || row['investigator_organization_name'].present? || row['investigator_organization_type'].present? || row['investigator_organization_address'].present? || row['investigator_organization_city'].present? || row['investigator_organization_country'].present? || row['investigator_organization_country_iso_code'].present? || row['investigator_organization_latitude'].present? || row['investigator_organization_longitude'].present? || row['investigator_organization_grid_id'].present?
          project_data.extract_collaborators if row['collaborator_name'].present? || row['collaborator_email_address'].present? || row['collaborator_website'].present? || row['collaborator_organization_name'].present? || row['collaborator_organization_type'].present? || row['collaborator_organization_address'].present? || row['collaborator_organization_city'].present? || row['collaborator_organization_country'].present? || row['collaborator_organization_country_iso_code'].present? || row['collaborator_organization_latitude'].present? || row['collaborator_organization_longitude'].present? || row['collaborator_organization_grid_id'].present?
          project_data.extract_funding_sources if row['project_funding_source'].present? || row['project_funding_source_grid_id'].present?
          @errors << project_data.errors.reject(&:blank?) if project_data.errors && !(project_data.errors.reject(&:blank?).blank?)
          Rails.logger.debug 'Project imported'
        rescue => e
          Rails.logger.debug e
          Rails.logger.debug e.backtrace.join("\n")
        end
      end
    end
  end

  def valid_header?(header)
    valid_header = %w{project_funding_source_grid_id project_funding_source_organization_type project_funding_source_organization_address project_funding_source_organization_city project_funding_source_organization_country project_funding_source_organization_country_iso_code project_funding_source_organization_latitude project_funding_source_organization_longitude specialties investigator_organization_grid_id collaborator_organization_grid_id id project_title project_funding_source project_website project_summary project_cancer_types project_types project_start_date project_end_date investigator_name investigator_email_address investigator_website investigator_position_title investigator_organization_name investigator_organization_type investigator_organization_address investigator_organization_city investigator_organization_country investigator_organization_country_iso_code investigator_organization_latitude investigator_organization_longitude collaborator_name collaborator_email_address collaborator_website collaborator_position_title collaborator_organization_name collaborator_organization_type collaborator_organization_address collaborator_organization_city collaborator_organization_country collaborator_organization_country_iso_code collaborator_organization_latitude collaborator_organization_longitude}
    missing_fields = valid_header - header
    unknown_fields = header - valid_header
    if missing_fields == [] && unknown_fields == []
      return true
    else
      message = ''
      message += "missing fields: #{missing_fields}" if missing_fields != []
      message += " | unknown fields: #{unknown_fields}" if unknown_fields !=[]
      @errors = [[{ project: 0, errors: [{ format: "bad header #{message}" }] }]]
      return false
    end
  end

end
