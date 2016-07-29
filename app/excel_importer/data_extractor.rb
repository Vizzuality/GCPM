require 'entities/project_importer'
require 'entities/research_unit_importer'
class DataExtractor

  def initialize(row)
    @row = row
    @errors = []
  end

  attr_reader :errors, :row

  def extract
    return if row.blank?

    #Imports project
    project_index = row['project_index']
    project_attributes = row.slice(*%w(project_title project_website project_summary project_start_date project_end_date project_cancer_types project_types))
    project = ProjectImporter.new(project_index, project_attributes)
    unless project.import!
      @errors << { project: row['project_index'], errors: project.errors.compact }
      return false
    end

    #Imports project lead
    main_research_unit_attributes = row.slice(*%w(investigator_name investigator_email_address investigator_website investigator_organization_name investigator_organization_type investigator_organization_address investigator_organization_city investigator_organization_country investigator_organization_country_iso_code investigator_organization_latitude investigator_organization_longitude))
    research_unit = ResearchUnitImporter.new(main_research_unit_attributes, true)
    unless research_unit.import!
      @errors << { project: row['project_index'], errors: research_unit.errors.compact }
      return false
    end

    # Assigns research unit (investigator & organization by address)
    membership = Membership.find_or_initialize_by(project_id: project.project_id, research_unit_id: research_unit.research_unit_id)
    membership.membership_type = 0
    membership.save!

    #Imports other investigators
    secondary_research_unit_attributes = row.slice(*%w(collaborator_name collaborator_email_address collaborator_website collaborator_organization_name collaborator_organization_type collaborator_organization_address collaborator_organization_city collaborator_organization_country collaborator_organization_country_iso_code collaborator_organization_latitude collaborator_organization_longitude))
    secondary_research_unit = ResearchUnitImporter.new(secondary_research_unit_attributes, false)
    unless secondary_research_unit.import!
      @errors << { project: row['project_index'], errors: secondary_research_unit.errors.compact }
      return false
    end

    # Assigns secondary research unit (investigator & organization by address)
    secondary_membership = Membership.find_or_initialize_by(project_id: project.project_id, research_unit_id: secondary_research_unit.research_unit_id)
    secondary_membership.membership_type = 1
    secondary_membership.save!
  end

end
