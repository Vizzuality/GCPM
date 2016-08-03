require 'csv'
namespace :events do
  task create: :environment do
    if Event.all.size == 0
      filename = File.expand_path(File.join(Rails.root, 'data', "events.csv"))
      CSV.foreach(filename, :headers => true) do |row|
        Event.create!(row.to_hash)
      end
      puts "Events loaded"
    end
  end
end
