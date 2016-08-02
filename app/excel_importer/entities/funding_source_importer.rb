class FundingSourceImporter

  def initialize(data)
    @data = data
    @errors = []
    @funding_source_id
  end

  attr_reader :errors, :data, :funding_source_id

  def import!
    funding_source = Organization.find_or_initialize_by(name: data['project_funding_source'])
    if funding_source.valid? && @errors == []
      funding_source.save!
      @funding_source_id = funding_source.id
      return true
    else
      @errors << { project: funding_source.errors.full_messages }
      Rails.logger.info @errors
      return false
    end
  end

end
