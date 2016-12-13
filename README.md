# GCPM - Global Cancer Project Map

TODO: Write a project description

## Requirements:

* NodeJs 4+ [How to install](https://nodejs.org/en/download/)
* Ruby 2.3.1 [How to install](https://gorails.com/setup/osx/10.10-yosemite)
* PostgreSQL 9+ [How to install](http://exponential.io/blog/2015/02/21/install-postgresql-on-mac-os-x-via-brew/)
* Cron or similar tool is required for periodically sending notification emails

## Installation

Install project dependencies:

```
gem install bundler && bundle install
```

Set up environment variables by copying `.env.sample` to `.env` and filling up the necessary values accordingly
See also the [CartoDB integration](#cartodb-integration) section for information on how to configure your CartoDB account.

To set up the database, run:

		bundle exec rake db:create
		bundle exec rake db:migrate

To add existing data, run:

		bundle exec rake db:seed
		bundle exec rake db:geo
		bundle exec rake events:create
		bundle exec rake layers:import

## Running

To run application:

		bundle exec rails server

To send periodic notification emails to users, run the following `rake` task using `cron` or a similar tool:

		rake notifications:send


## Development

## Test

	Run rspec:

```ruby
	bin/rspec
```
	Run teaspoon:

```ruby
	rake teaspoon
```
	Run cucumber:

```ruby
	rake cucumber
```
	Run all (cucumber, spec):

```ruby
	rake
```

capybara-webkit depends on a WebKit implementation from Qt (version >= 4.8), a cross-platform development toolkit. You'll need to download the Qt libraries to build and install the gem. [more](https://github.com/thoughtbot/capybara-webkit/wiki/Installing-Qt-and-compiling-capybara-webkit)

OS X Mavericks:

		brew update
		brew install qt

In cucumber, tag scenarios with '@javascript' to run them using a headless WebKit browser.

In RSpec, use the 'js: true' flag. See the [capybara documentation](http://rubydoc.info/gems/capybara#Using_Capybara_with_RSpec) for more information about using capybara with RSpec.

## CartoDB integration

This project requires a [CartoDB](https://cartodb.com/) account to be configured in the .env files
In your CartoDB account, you should add [these custom functions](extra/cartodb_queries.sql)

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request :D
