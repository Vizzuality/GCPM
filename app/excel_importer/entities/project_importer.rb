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
    project_types = self.validate_project_types(data['project_types'])
    cancer_types = self.validate_cancer_types(data['project_cancer_types'])
    # project.import_project_types_from_excel(row)
    # project.import_diseases_from_excel(row)
    # project.import_funding_source_from_excel(row)
    # project.import_investigator_from_excel(row)
    # project.import_organization_from_excel(row)
    # project.import_location_from_excel(row)
    if project.valid? && @errors == []
      project.project_types = project_types
      project.cancer_types = cancer_types
      project.status = 1
      project.save!
    else
      Rails.logger.info @errors
      return false
    end
  end

  def validate_project_types(project_types)
    return if project_types.blank?
    pt = project_types.split('|').map{|e| e.strip.downcase}
    master_pt = ProjectType.all.pluck(:name).map{|e| e.downcase}
    puts pt
    puts master_pt
    puts pt - master_pt
    wrong_types = pt - master_pt
    if wrong_types != []
      @errors << "Unknow project type(s) #{wrong_types}"
      return
    else
      project_types = ProjectType.where('lower(name) in (?)', pt)
      project_types
    end
  end

  def validate_cancer_types(cancer_types)
    return if cancer_types.blank?
    ct = cancer_types.split('|').map{|e| e.strip.downcase}
    master_ct = CancerType.all.pluck(:name).map{|e| e.downcase}
    wrong_types = ct - master_ct
    if wrong_types != []
      @errors << "Unknow cancer type(s) #{wrong_types}"
      return
    else
      cancer_types = CancerType.where('lower(name) in (?)', ct)
      cancer_types
    end
  end

end
