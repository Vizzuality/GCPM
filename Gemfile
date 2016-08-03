source 'https://rubygems.org'

ruby '2.3.1'

gem 'rails', '>= 5.0.0.beta4', '< 5.1'

# Rails plugins
gem 'puma'
gem 'jbuilder', '~> 2.0'
gem 'devise', git: 'http://github.com/plataformatec/devise', branch: 'master'
gem 'dotenv-rails', '2.1.0'
gem 's3'
gem 'activeadmin', git: 'http://github.com/activeadmin/activeadmin'
gem 'active_admin_theme'
gem 'turbolinks', '~> 5.0.0'
gem 'active_model_serializers', '~> 0.10.0'
gem 'roo'
gem 'simple_form'

# Assets pipeline
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.1.0'
gem 'jquery-rails'
gem 'sass-rails'
gem 'autoprefixer-rails'
gem 'backbone-syphon-rails'
gem 'pickadate-rails', '~> 3.5', '>= 3.5.6.0'
gem 'handlebars_assets'

# Email service integration
gem 'sendgrid-ruby'

# Api engine
gem 'cartomodel', git: 'http://github.com/Vizzuality/cartomodel'

gem 'sql_query'

source 'https://rails-assets.org' do
  gem 'rails-assets-normalize-css'
  gem 'rails-assets-underscore'
  gem 'rails-assets-backbone'
  gem 'rails-assets-d3', '~> 3.5.17'
  gem 'rails-assets-moment'
  gem 'rails-assets-leaflet'
  gem 'rails-assets-fuse'
  gem 'rails-assets-chosen'
end

# Active record
gem 'pg', '~> 0.18'

group :development, :test do
  gem 'hirb'
  gem 'awesome_print'
  gem 'faker'
end

group :development do
  #gem 'spring'
  gem 'web-console', '~> 3.0'
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'annotate'
  gem 'quiet_assets'
  gem 'listen'
  gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
  gem 'rubocop', require: false
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
  gem 'capybara'
  gem 'capybara-webkit'
  gem 'cucumber-rails', require: false
  gem 'factory_girl_rails'
  gem 'to_factory'
  gem 'bullet'
  gem 'database_cleaner'
  gem 'timecop'
end
