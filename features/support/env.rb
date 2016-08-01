require 'cucumber/rails'
require 'factory_girl'
require 'email_spec'
require 'email_spec/cucumber'

ActionController::Base.allow_rescue = false

begin
  DatabaseCleaner.strategy = :transaction
rescue NameError
  raise "You need to add database_cleaner to your Gemfile (in the :test group) if you wish to use it."
end

Cucumber::Rails::Database.javascript_strategy = :truncation
Capybara.javascript_driver = :webkit

Capybara::Webkit.configure do |config|
  config.allow_url([])
end
