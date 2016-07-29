class ResearchUnitImporter
#investigator_name investigator_email_address  investigator_website  investigator_organization_name  investigator_organization_type  investigator_organization_address investigator_organization_city  investigator_organization_country investigator_organization_country_iso_code  investigator_organization_latitude  investigator_organization_longitude

#name email position_title website

#investigator_organization_name investigator_organization_type  investigator_organization_address investigator_organization_city  investigator_organization_country investigator_organization_country_iso_code  investigator_organization_latitude  investigator_organization_longitude

#name organization_type_id

  def initialize(project_id, data, is_team_lead?)
    @project_id = project_id
    @data = data
    @errors = []
    @is_team_lead? = is_team_lead?
    @project
  end

  attr_reader :errors, :data, :project, :project_id

  def import!
    return if data.map{|k,v| v }.compact.blank?

    investigator = Investigator.find_or_initialize_by(name: data['investigator_name'])
    investigator.email = data['investigator_email']
    investigator.website = data['investigator_website']

    organization = Organization.find_or_initialize_by(name: data['investigator_organization_name'])
    organization.assign_organization_type(data['investigator_organization_type'])


    project.title = data['project_title']
    project.project_website = data['project_website']
    project.summary = data['project_summary']
    project.start_date = data['project_start_date']
    project.end_date = data['project_end_date']
    project_types = self.validate_project_types(data['project_types'])
    cancer_types = self.validate_cancer_types(data['project_cancer_types'])


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
