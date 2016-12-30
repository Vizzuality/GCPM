class FundingSourceImporter

  def initialize(data)
    @data = data
    @errors = []
    @funding_source_id
  end

  attr_reader :errors, :data, :funding_source_id

  def import!
    if data['project_funding_source_grid_id'].present?
      funding_source = Organization.find_by(grid_id: data['project_funding_source_grid_id']&.strip)
      begin
        @funding_source_id = funding_source.id
      rescue
        @errors << { project: "funding source not found" }
        Rails.logger.info @errors
        return false
      end
    else
      funding_source = Organization.find_or_initialize_by(name: data['project_funding_source']&.strip)
      organization_type = self.validate_organization_type(data["project_funding_source_type"])
      address = Address.new
      address.city = data["project_funding_source_organization_city"]
      address.country_name = data["project_funding_source_organization_country"]
      address.country_code = data["project_funding_source_organization_country_iso_code"]
      address.latitude = data["project_funding_source_organization_latitude"]
      address.longitude = data["project_funding_source_organization_longitude"]
      address.line_1 = data["project_funding_source_organization_address"]
      address.postcode = data["project_funding_source_organization_postcode"]                 if data["project_funding_source_organization_postcode"]
      address.primary = data["project_funding_source_organization_primary"]                   if data["project_funding_source_organization_primary"]
      address.state = data["project_funding_source_organization_state"]                       if data["project_funding_source_organization_state"]
      address.state_code = data["project_funding_source_organization_state_code"]             if data["project_funding_source_organization_state_code"]
      address.geonames_city_id = data["project_funding_source_organization_geonames_city_id"] if data["project_funding_source_organization_geonames_city_id"]
      unless funding_source.valid?
        @errors << { funding_source: organization.errors.full_messages }
      end

      unless address.valid?
        @errors << { address: address.errors.full_messages }
      end
      if @errors.compact.flatten.blank?
        funding_source.organization_type = organization_type
        funding_source.save!
        def_address = Address.find_or_initialize_by(organization_id: funding_source.id, latitude: address.latitude, longitude: address.longitude, country_name: address.country_name, country_code: address.country_code, city: address.city, line_1: address.line_1)
        def_address.save!
        @funding_source_id = funding_source.id
        return true
      else
        Rails.logger.info @errors
        return false
      end
    end
  end

  def validate_organization_type(organization_type)
    return if organization_type.blank?
    ot = organization_type.split('|').map{|e| e.downcase}
    master_ot = OrganizationType.all.pluck(:name).map{|e| e.downcase}
    wrong_types = ot - master_ot
    if wrong_types != []
      @errors << "Unknow organization type(s) #{wrong_types}"
      return
    else
      organization_type = OrganizationType.where('lower(name) in (?)', ot).first
      organization_type
    end
  end
end
