namespace :organizations_and_addresses do
  desc "Imports a SQL backup of organizations and addresses"
  task import: :environment do
    tables = ["organizations", "addresses"]
    tables.each do |t|
      ActiveRecord::Migration.drop_table t.to_sym, force: :cascade
    end
    file = "#{Rails.root.to_s.gsub(/ /, '\ ')}/data/organizations_and_addresses.bak"
    cmd = "pg_restore -U postgres -d gcpm_#{Rails.env} -1 #{file}"
    puts cmd
    system cmd
    ActiveRecord::Base.connection.tables.each do |t|
      ActiveRecord::Base.connection.reset_pk_sequence!(t)
    end
    puts "organizations and addresses created"
  end
end
