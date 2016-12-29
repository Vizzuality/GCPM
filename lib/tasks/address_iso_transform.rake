require 'csv'
namespace :address do
  task iso_transform: :environment do
    Address.all.each do |a|
      if a.country_code.length == 2
        c = Country.find_by(country_iso: a.country_code)
        begin
          a.country_code = c.country_iso_3
        rescue
          puts a.inspect
        end
        a.save!
      end
    end
    puts "Addresses ISO transformed"
  end
end
