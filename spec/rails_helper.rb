ENV["RAILS_ENV"] ||= 'test'
require 'spec_helper'
require File.expand_path("../../config/environment", __FILE__)
require 'spec_helper'
require 'rspec/rails'
require 'capybara/rails'
require 'capybara/rspec'

Dir[Rails.root.join("spec/support/**/*.rb")].each { |f| require f }

ActiveRecord::Migration.maintain_test_schema!

RSpec.configure do |config|
  config.fixture_path = "#{::Rails.root}/spec/fixtures"

  config.use_transactional_fixtures = true

  config.infer_spec_type_from_file_location!

  config.before(:each, type: :controller) do
    Bullet.start_request
  end

  config.after(:each, type: :controller) do
    Bullet.perform_out_of_channel_notifications if Bullet.notification?
    Bullet.end_request
  end

  config.render_views

  config.infer_spec_type_from_file_location!
  config.include Devise::Test::ControllerHelpers, type: :controller

  Capybara.register_server :puma do |app, port|
    require 'rack/handler/puma'
    Rack::Handler::Puma.run(app, Port: port)
  end
  Capybara.javascript_driver = :webkit
end
