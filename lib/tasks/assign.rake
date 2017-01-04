# encoding: utf-8

require 'csv'
namespace :assign do
  desc 'Assign slugs to projects, investigators, organizations, cancer_types and events'
  task slugs: :environment do
    puts "Assign slugs to projects"
    Project.find_each do |project|
      project.update(project.attributes) if project.slug.blank?
    end

    puts "Assign slugs to investigators"
    Investigator.find_each do |investigator|
      investigator.update(investigator.attributes) if investigator.slug.blank?
    end

    puts "Assign slugs to organizations"
    Organization.find_each do |organization|
      organization.update(organization.attributes) if organization.slug.blank?
    end

    puts "Assign slugs to cancer_types"
    CancerType.find_each do |cancer_type|
      cancer_type.update(cancer_type.attributes) if cancer_type.slug.blank?
    end

    puts "Assign slugs to events"
    Event.find_each do |event|
      event.update(event.attributes) if event.slug.blank?
    end

    puts "Assign slugs to specialities"
    Speciality.find_each do |speciality|
      speciality.update(speciality.attributes) if speciality.slug.blank?
    end
  end
end
