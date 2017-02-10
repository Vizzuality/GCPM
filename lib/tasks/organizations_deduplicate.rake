require 'csv'
namespace :organizations do
  desc "Imports a CSV file and assign types to organizations"
  task deduplicate: :environment do
    query = "select tn1.name, array_agg(tn2.id) as ids from organizations tn1 join organizations tn2 on tn1.name = tn2.name and tn1.id <> tn2.id group by tn1.name"
    results = ActiveRecord::Base.connection.execute(query)
    results.each do |r|
      organization_ids = r['ids'].delete("{}").split(",").map{|i| i.to_i}
      organizations = Organization.where(id: organization_ids)
      organization = organizations.first
      organizations_to_delete = organizations.where.not(id: organization.id)
      addresses = Address.where(organization_id: organizations_to_delete.map{|o| o.id})
      addresses.each do |a|
        a.organization = organization
        a.save!
      end
      organizations_to_delete.delete_all
    end
    puts "Organizations deduplicated"
  end
end
