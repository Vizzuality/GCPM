require 'csv'
namespace :organizations do
  desc "Imports a CSV file and assign types to organizations"
  task typeize: :environment do
    file = 'data/types.csv'
    CSV.foreach(file, :headers => true) do |row|
      org = Organization.find_by(grid_id: row['grid_id'])
      type = OrganizationType.find_by(name: row['type'])
      org.organization_type = type
      org.save!
    end
    puts "Organizations clasified"
  end
end
