require 'csv'
namespace :organizations do
  desc "Imports a CSV file into organizations"
  task import: :environment do
    file = 'data/institutes.csv'
    CSV.foreach(file, :headers => true) do |row|
      hash = row.to_hash.except!("wikipedia_url")
      begin
        Organization.create!(hash)
      rescue
        puts row["name"]
      end
    end
    puts "organizations created"
  end
end
