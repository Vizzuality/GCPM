FactoryGirl.define do
  factory(:project) do
    end_date nil
    project_website nil
    start_date nil
    status nil
    summary Faker::Lorem.paragraph(5, true, 4)
    title 'Test first project'
  end
end
