require 'csv'
namespace :db do
  task geonames: :environment do
    if Country.all.size == 0
      filename = File.expand_path(File.join(Rails.root, 'data', "geonames_countries.csv"))
      CSV.foreach(filename, :headers => false) do |row|
        country = Country.new
        country.country_name = row[0]
        country.country_iso = row[3]
        country.country_centroid = %Q{{"type":"point", "coordinates":[#{row[1]},#{row[2]}]}}
        country.save!
      end
      puts "Geos loaded"
    end
  end
end