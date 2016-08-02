require 'csv'
namespace :geo do
  task iso_transform: :environment do
  filename = File.expand_path(File.join(Rails.root, 'data', "country_codes.csv"))
  CSV.foreach(filename, :headers => true) do |row|
    if country = Country.find_by(country_iso: row['ISO3166-1-Alpha-2'])
      country.country_iso_3 = row['ISO3166-1-Alpha-3']
      country.save!
    end
  end
  puts "Geos transformed"
  end
end
