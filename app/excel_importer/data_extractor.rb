require 'entities/project_importer'
class DataExtractor

  def initialize(row)
    @row = row
    @errors = []
  end

  attr_reader :errors, :row

  def extract
    return if row.blank?
    project_index = row['project_index']
    project_attributes = row.slice(*%w(project_title project_website project_summary project_start_date project_end_date project_cancer_types project_types))
    project = ProjectImporter.new(project_index, project_attributes)
    unless project.import!
      @errors = project.errors.compact
      return false
    end
    main_research_unit_attributes = row.slice(*%w(investigator_name investigator_email_address  investigator_website  investigator_organization_name  investigator_organization_type  investigator_organization_address investigator_organization_city  investigator_organization_country investigator_organization_country_iso_code  investigator_organization_latitude  investigator_organization_longitude))
    research_unit = ResearchUnitImporter.new(project_index, main_research_unit_attributes, true)
    unless research_unit.import!
      @errors = research_unit.errors.compact
      return false
    end
    # project.import_project_types_from_excel(row)
    # project.import_diseases_from_excel(row)
    # project.import_funding_source_from_excel(row)
    # project.import_investigator_from_excel(row)
    # project.import_organization_from_excel(row)
    # project.import_location_from_excel(row)
  end

end
