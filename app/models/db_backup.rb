# == Schema Information
#
# Table name: db_backups
#
#  id         :integer          not null, primary key
#  notes      :text
#  file_name  :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class DbBackup < ApplicationRecord
  before_save :create_backups
  before_destroy :delete_files!
  def create_backups
    self.file_name = "#{Time.now.to_formatted_s(:rfc822).parameterize}.bak"
    db = "gcpm_#{Rails.env}"
    cmd = "PGPASSWORD=#{ENV["GCPM_DATABASE_PASSWORD"]} pg_dump -t organization_types -t organizations -t admin_users -t addresses -t active_admin_comments -t countries -t cancer_types -t project_types -t project_types_projects -t cancer_types_projects -t research_units -t memberships -t agrupations -t layer_groups -t funders -t projects -t layers -t events -t follows -t posts -t ckeditor_assets -t identities -t project_updates -t users -t mailboxer_receipts -t mailboxer_notifications -t project_users -t mailboxer_conversations -t mailboxer_conversation_opt_outs -t investigators -t specialities -t projects_specialities -t widgets -t featureds -t pictures -t pins -t activity_feeds -t notifications --host localhost --username postgres --verbose --clean --no-owner --no-acl --format=c #{db} > #{Rails.root.to_s.gsub(/ /, '\ ')}/db_backups/#{self.file_name}"
    puts cmd
    system cmd
    cmd_full = "PGPASSWORD=#{ENV["GCPM_DATABASE_PASSWORD"]} pg_dump --host localhost --username postgres --verbose --clean --no-owner --no-acl --format=c #{db} > #{Rails.root.to_s.gsub(/ /, '\ ')}/db_backups/full_#{self.file_name}"
    puts cmd_full
    system cmd_full
  end
  def restore_db!
    file_name = self.file_name.to_s
    db = "gcpm_#{Rails.env}"
    tables = ["organization_types", "organizations", "admin_users", "addresses", "active_admin_comments", "countries", "cancer_types", "project_types", "project_types_projects", "cancer_types_projects", "research_units", "memberships", "agrupations", "layer_groups", "funders", "projects", "layers", "events", "follows", "posts", "ckeditor_assets", "identities", "project_updates", "users", "mailboxer_receipts", "mailboxer_notifications", "project_users", "mailboxer_conversations", "mailboxer_conversation_opt_outs", "investigators", "specialities", "projects_specialities", "widgets", "featureds", "pictures", "pins", "activity_feeds", "notifications"]
    tables.each do |t|
      ActiveRecord::Migration.drop_table t.to_sym, force: :cascade
    end
    cmd = "pg_restore -U postgres -d #{db} -1 #{Rails.root.to_s.gsub(/ /, '\ ')}/db_backups/#{file_name}"
    puts cmd
    system cmd
    ActiveRecord::Base.connection.tables.each do |t|
      ActiveRecord::Base.connection.reset_pk_sequence!(t)
      puts 'reseting ' + t + ' keys'
    end
  end
  def delete_files!
    files = ["#{Rails.root}/db_backups/#{self.file_name}", "#{Rails.root}/db_backups/full_#{self.file_name}"]
    files.each do |f|
      File.delete(f) if File.exist?(f)
    end
  end
end
