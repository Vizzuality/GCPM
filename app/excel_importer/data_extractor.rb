# require 'entities/project_importer'
# require 'entities/research_unit_importer'
# require 'entities/funding_source_importer'
class DataExtractor

  def initialize(row)
    @row = row
    @errors = []
    @project_index = row['id']
  end

  attr_reader :errors, :row, :project_index

  def extract_project
    # Imports project
    project_attributes = row.slice('project_title', 'project_website', 'project_summary', 'project_start_date', 'project_end_date', 'project_cancer_types', 'project_types', 'specialities')
    return if project_attributes.values.compact.blank?
    project = ProjectImporter.new(project_index, project_attributes)
    unless project.import!
      @errors << { project: project_index.to_i, errors: project.errors.compact }
      return false
    end
  end

  def extract_project_lead
    # Imports project lead
    main_research_unit_attributes = row.slice('investigator_name', 'investigator_email_address', 'investigator_website', 'investigator_organization_name', 'investigator_organization_type', 'investigator_organization_address', 'investigator_organization_city', 'investigator_organization_country', 'investigator_organization_country_iso_code', 'investigator_organization_latitude', 'investigator_organization_longitude', 'investigator_organization_grid_id')
    return if main_research_unit_attributes.values.compact.blank?
    research_unit = ResearchUnitImporter.new(main_research_unit_attributes, true)
    unless research_unit.import!
      @errors << { project: project_index.to_i, errors: research_unit.errors.compact }
      return false
    end
    # Assigns research unit (investigator & organization by address)
    membership = Membership.find_or_initialize_by(project_id: project_index, research_unit_id: research_unit.research_unit_id)
    membership.membership_type = 0
    membership.save!
  end

  def extract_collaborators
    # Imports other investigators
    secondary_research_unit_attributes = row.slice('collaborator_name', 'collaborator_email_address', 'collaborator_website', 'collaborator_organization_name', 'collaborator_organization_type', 'collaborator_organization_address', 'collaborator_organization_city', 'collaborator_organization_country', 'collaborator_organization_country_iso_code', 'collaborator_organization_latitude', 'collaborator_organization_longitude', 'collaborator_organization_grid_id')
    return if secondary_research_unit_attributes.values.compact.blank?
    secondary_research_unit = ResearchUnitImporter.new(secondary_research_unit_attributes, false)
    unless secondary_research_unit.import!
      @errors << { project: project_index.to_i, errors: secondary_research_unit.errors.compact }
      return false
    end
    # Assigns secondary research unit (investigator & organization by address)
    secondary_membership = Membership.find_or_initialize_by(project_id: project_index, research_unit_id: secondary_research_unit.research_unit_id)
    secondary_membership.membership_type = 1
    secondary_membership.save!
  end

  def extract_funding_sources
    # Imports funding sources
    funding_source_attributes = row.slice('project_funding_source', 'project_funding_source_grid_id')
    return if funding_source_attributes.values.compact.blank?
    funding_source = FundingSourceImporter.new(funding_source_attributes)
    unless funding_source.import!
      @errors << { project: project_index.to_i, errors: funding_source.errors.compact }
      return false
    end
    funder = Funder.find_or_initialize_by(organization_id: funding_source.funding_source_id, project_id: project_index)
    funder.save!
  end

end
