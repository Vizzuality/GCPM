require 'csv'
namespace :addresses do
  desc "Adds grid_id to addresses"
  task idsize: :environment do
    Organization.all.each do |o|
      organization_grid_id = o.grid_id
      o.addresses.each_with_index do |a, i|
        a.grid_id = "#{organization_grid_id}.#{i.to_s}"
        a.save!
      end
    end
    puts "addresses idsized"
  end
end
