source 'http://rubygems.org'

ruby '2.3.1'

gem 'rails', '~> 5.0.0', '>= 5.0.0.1'

# Rails plugins
gem 'puma', '~> 3.0'
gem 'jbuilder', '~> 2.0'
gem 'dotenv-rails', '2.1.0'
gem 's3'
gem 'activeadmin', git: 'https://github.com/activeadmin/activeadmin'
gem 'inherited_resources', git: 'https://github.com/activeadmin/inherited_resources'
gem 'active_admin_theme'
gem 'active_model_serializers', '~> 0.10.0'
gem 'roo'
gem 'seed_dump'
gem 'simple_form'
gem 'carrierwave'
gem 'mini_magick'
gem 'ckeditor'

# User login
gem 'devise'

# Omniauth
gem 'omniauth'
gem 'omniauth-linkedin'
gem 'omniauth-google-oauth2'

# Assets pipeline
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.2'
gem 'jquery-rails'
gem 'sass-rails', '~> 5.0'
gem 'autoprefixer-rails'
gem 'pickadate-rails', '~> 3.5', '>= 3.5.6.0'
gem "select2-rails"
gem 'handlebars_assets'
gem 'gon'

# Email service integration
gem 'sendgrid-ruby'

# Api engine
gem 'cartomodel', git: 'https://github.com/Vizzuality/cartomodel'

# gem 'rack-cors', require: 'rack/cors'

# SQL.erb
gem 'sql_query'
gem 'textacular'

# Follows
gem "acts_as_follower", git: 'https://github.com/tcocca/acts_as_follower'

# Messages
gem 'mailboxer'

source 'https://rails-assets.org' do
  gem 'rails-assets-normalize-css'
  gem 'rails-assets-underscore'
  gem 'rails-assets-backbone'
  gem 'rails-assets-d3', '~> 3.5.17'
  gem 'rails-assets-moment'
  gem 'rails-assets-leaflet'
  gem 'rails-assets-fuse'
  gem 'rails-assets-URIjs'
end

# Active record
gem 'pg', '~> 0.18'

group :development, :test do
  gem 'hirb'
  gem 'awesome_print'
  gem 'faker'
end

group :development do
  gem 'listen', '~> 3.0.5'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'web-console', '~> 3.0'
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'annotate'
  gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
  gem 'rubocop', require: false
  gem 'byebug'
  gem 'rails_db'
  # Deploy
  gem 'capistrano', '3.5'
  gem 'capistrano-env-config'
  gem 'capistrano-rails'
  gem 'capistrano-bundler'
  gem 'capistrano-rvm'
  gem 'capistrano-passenger'
end

group :test do
  gem 'rspec-rails', '~> 3.0'
  gem 'spring-commands-rspec'
  gem 'email_spec'
  # gem 'capybara'
  # gem 'capybara-webkit'
  gem 'cucumber-rails', require: false
  gem 'factory_girl_rails'
  gem 'to_factory'
  gem 'bullet'
  gem 'database_cleaner'
  gem 'timecop'
end
