Then /^I should have zero projects$/ do
  Project.all.size.should.zero?
end

Then /^I should have one project$/ do
  Project.all.size.should >= 1
end

Then /^I should have two projects$/ do
  Project.all.size.should >= 2
end

Given /^project by user$/ do
  FactoryGirl.create(:project, user_id: User.last.id, title: 'User project', status: :published, cancer_type_ids: [FactoryGirl.create(:cancer_type).id])
end

Given /^first project$/ do
  FactoryGirl.create(:project, user_id: User.last.id, title: 'First project by user', status: :published, cancer_type_ids: [FactoryGirl.create(:cancer_type).id])
end
