namespace :db do

  desc "Deletes all projects and entities data from db."
  task delete_data: :environment do
    puts "\n This will delete your current data from database, are you sure? [Y/N]"
    answer = STDIN.gets.chomp
    puts answer
    if answer == "Y"
      tables = ["active_admin_comments", "activity_feeds", "addresses", "cancer_types_projects", "featureds", "follows", "funders", "memberships", "organizations", "project_types_projects", "projects", "projects_specialities", "research_units", "project_updates", "project_users", "identities", "investigators"]
      puts "Deleting data..."
      tables.each do |t|
        q = "DELETE FROM #{t}"
        ActiveRecord::Base.connection.execute(q)
        ActiveRecord::Base.connection.reset_pk_sequence!(t)
      end
      puts "Data deleted."
    else
      puts "Nothing changed."
    end
  end
end
