require 'csv'
namespace :organizations do
  desc "Imports a CSV file into organizations"
  task addressize: :environment do
    file = 'data/addresses.csv'
    CSV.foreach(file, :headers => true) do |row|
      hash = row.to_hash.except!("grid_id")
      address = Address.create!(hash)
      org = Organization.find_by(grid_id: row['grid_id'])
      org.addresses << address
    end
    puts "organizations localized"
  end
end
