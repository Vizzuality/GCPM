namespace :widgets do

  desc "Deletes widgets and import new ones."
  task import: :environment do
    puts "\n This will delete your current widgets from database and import the last backup, are you sure? [Y/N]"
    answer = STDIN.gets.chomp
    puts answer
    if answer == "Y"
      puts "Deleting widgets..."
      Widget.delete_all
      puts "Importing new widgets..."
      filename = 'db/data/widgets.rb'
      load(filename) if File.exist?(filename)
      ActiveRecord::Base.connection.reset_pk_sequence!('widgets')
      puts "Widgets imported."
    else
      puts "Nothing changed."
    end
  end

  desc "Creates a new export file with widgets."
  task backup: :environment do
    sh "bundle exec rake db:seed:dump FILE=db/data/widgets.rb MODELS=widgets EXCLUDE=[]"
    puts "Backup created."
  end
end
