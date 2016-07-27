require 'csv'
namespace :organization_types do
  desc "Imports a CSV file into organizations"
  task import: :environment do
    file = 'data/types.csv'
    types = []
    CSV.foreach(file, :headers => true) do |row|
      types << row['type'] unless types.include? row['type']
    end
    types = types.sort_by!{ |m| m }
    types.each do |t|
      OrganizationType.create!(name: t)
    end
    puts "Organization types created"
  end
end
