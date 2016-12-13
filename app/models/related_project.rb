class RelatedProject
  def initialize(project, options)
    @project = project
    @size    = options[:size]   || 12
    @level   = options[:level]  || [1,2,3,4]
    @strict  = options[:strict] || false
  end

  def related
    projects = Project.includes(:cancer_types, :project_types, :countries, :specialities).published.where.not(id: @project.id)
    projects = projects.by_cancer_types(cancer_type_ids)   if @level.include?(1) && cancer_type_ids.any?
    projects = projects.by_project_types(project_type_ids) if @level.include?(2) && project_type_ids.any?
    projects = projects.by_specialities(speciality_ids)    if @level.include?(3) && speciality_ids.any?
    projects = projects.by_countries(country_isos)         if @level.include?(4) && country_isos.any?
    projects = projects.distinct

    projects = if @strict.blank? && projects.size < @size
                 to_limit = @size - projects.size
                 (projects | related_by_cancer_types.sample(to_limit)).uniq
               elsif projects.size > @size
                 projects.sample(@size)
               end
    projects || []
  end

  private

    def related_by_cancer_types
      Project.joins(:cancer_types).where('cancer_types.id in (?)', cancer_type_ids).published.where.not(id: @project.id)
    end

    def cancer_type_ids
      @project.cancer_types.pluck(:id)
    end

    def project_type_ids
      @project.project_types.pluck(:id)
    end

    def country_isos
      @project.countries.pluck(:country_iso_3)
    end

    def speciality_ids
      @project.specialities.pluck(:id)
    end
end
