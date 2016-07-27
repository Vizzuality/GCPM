class ProjectImporter

  def initialize(project_id, data)
    @project_id = project_id
    @data = data
    @errors = []
    @project
  end

  attr_reader :errors, :data, :project, :project_id

  def import!
    return if data.map{|k,v| v }.compact.blank?
    project = Project.find_or_initialize_by(id: project_id)
    project.title = data['project_title']
    project.project_website = data['project_website']
    project.summary = data['project_summary']
    project.start_date = data['project_start_date']
    project.end_date = data['project_end_date']
    self.validate_project_types(data['project_types'])
    self.validate_project_types(data['project_cancer_types'])
    # project.import_project_types_from_excel(row)
    # project.import_diseases_from_excel(row)
    # project.import_funding_source_from_excel(row)
    # project.import_investigator_from_excel(row)
    # project.import_organization_from_excel(row)
    # project.import_location_from_excel(row)
    project.status = 1
    project.save!
  end

  def validate_project_types(project_types)
  end

  def validate_cancer_types(cancer_types)
  end

end
