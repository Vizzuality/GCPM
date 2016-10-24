class ExcelExporter
  def initialize(json_list)
    @headers   = json_list.first.keys
    @json_list = json_list
    generate_csv
  end

  def to_csv
    @data_to_export
  end

  private

    def generate_csv
      @data_to_export = CSV.generate do |csv|
        csv << @headers
        @json_list.each do |row|
          csv << row.values
        end
      end
    end
end
