FactoryGirl.define do
  factory(:project) do
    end_date Time.now + 1.days
    project_website nil
    start_date Time.now
    status nil
    summary Faker::Lorem.paragraph(5, true, 4)
    title 'Test first project'
  end
end
