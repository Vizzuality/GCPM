class ResearchUnitImporter
  def initialize(data, is_project_lead)
    @data = data
    @errors = []
    @is_project_lead = is_project_lead
    @research_unit_id
  end

  attr_reader :errors, :data, :is_project_lead, :research_unit_id

  def import!
    return if data.map{|k,v| v }.compact.blank?

    entity_name = is_project_lead ? "investigator" : "collaborator"

    investigator = Investigator.find_or_initialize_by(name: data["#{entity_name}_name"])
    investigator.email = data["#{entity_name}_email_address"]
    investigator.website = data["#{entity_name}_website"]

    organization = Organization.find_or_initialize_by(name: data["#{entity_name}_organization_name"])
    organization_type = self.validate_organization_type(data["#{entity_name}_organization_type"])

    address = Address.new
    address.city = data["#{entity_name}_organization_city"]
    address.country = data["#{entity_name}_organization_country"]
    address.country_code = data["#{entity_name}_organization_country_iso_code"]
    address.latitude = data["#{entity_name}_organization_latitude"]
    address.longitude = data["#{entity_name}_organization_longitude"]
    address.line_1 = data["#{entity_name}_organization_address"]
    address.line_2 = data["#{entity_name}_organization_address_ine_2"]              if data["#{entity_name}_organization_address_line_2"]
    address.line_3 = data["#{entity_name}_organization_address_line_3"]             if data["#{entity_name}_organization_address_line_3"]
    address.postcode = data["#{entity_name}_organization_postcode"]                 if data["#{entity_name}_organization_postcode"]
    address.primary = data["#{entity_name}_organization_primary"]                   if data["#{entity_name}_organization_primary"]
    address.state = data["#{entity_name}_organization_state"]                       if data["#{entity_name}_organization_state"]
    address.state_code = data["#{entity_name}_organization_state_code"]             if data["#{entity_name}_organization_state_code"]
    address.geonames_city_id = data["#{entity_name}_organization_geonames_city_id"] if data["#{entity_name}_organization_geonames_city_id"]

    unless organization.valid?
      @errors << { organization: organization.errors.full_messages }
    end

    unless investigator.valid?
      @errors << { investigator: investigator.errors.full_messages }
    end

    unless address.valid?
      @errors << { address: address.errors.full_messages }
    end

    if @errors.compact.flatten.blank?
      organization.organization_type = organization_type
      organization.save!
      investigator.save!
      def_address = Address.find_or_initialize_by(organization_id: organization.id, latitude: address.latitude, longitude: address.longitude, country: address.country, country_code: address.country_code, city: address.city, line_1: address.line_1)
      def_address.save!
      research_unit = ResearchUnit.find_or_initialize_by(address_id: def_address.id, investigator_id: investigator.id)
      research_unit.save!
      @research_unit_id = research_unit.id
      return true
    else
      Rails.logger.info @errors
      return false
    end
  end

  def validate_organization_type(organization_type)
    return if organization_type.blank?
    ot = organization_type.split('|').map{|e| e.strip.downcase}
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
