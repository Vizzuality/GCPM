source 'https://rubygems.org'

ruby '2.3.0'

gem 'rails', '>= 5.0.0.beta4', '< 5.1'

# Rails plugins
gem 'puma'
gem 'jbuilder', '~> 2.0'
gem 'devise', git: 'http://github.com/plataformatec/devise', branch: 'master'
gem 'dotenv-rails', '2.1.0'
gem 'gon'
gem 's3'
gem 'activeadmin', git: 'http://github.com/activeadmin/activeadmin'
gem 'active_admin_theme'
gem 'turbolinks', '~> 5.0.0'

# Assets pipeline
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.1.0'
gem 'jquery-rails'
gem 'sass-rails'
gem 'autoprefixer-rails'
gem 'bourbon'
gem 'handlebars_assets'
gem 'rails-assets-html2canvas'
gem 'rails-assets-imagesloaded-packaged'

# Email service integration
gem 'sendgrid-ruby'

# Api engine
gem 'cartomodel', git: 'http://github.com/Vizzuality/cartomodel'

source 'https://rails-assets.org' do
  gem 'rails-assets-normalize-css'
  gem 'rails-assets-underscore'
  gem 'rails-assets-backbone'
  gem 'rails-assets-d3'
  gem 'rails-assets-moment'
  gem 'rails-assets-hammerjs'
  gem 'rails-assets-jquery-hammerjs'
end

# Active record
gem 'pg', '~> 0.18'

group :staging do
  gem 'rails_12factor'
end

group :development, :test do
  gem 'teaspoon-mocha', git: 'http://github.com/modeset/teaspoon', branch: 'rails_5'
  gem 'hirb'
  gem 'awesome_print'
  gem 'faker'
  gem 'spring-commands-rspec'
  gem 'rspec-rails', '~> 3.0'
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
  # Deploy
  gem 'capistrano', '3.5'
  gem 'capistrano-rails'
  gem 'capistrano-bundler'
  gem 'capistrano-rvm'
  gem 'capistrano-passenger'
end

group :test do
  gem 'factory_girl_rails'
  gem 'database_cleaner'
end

# group :production do
#   gem 'rails_12factor' # Required for Heroku
# end
