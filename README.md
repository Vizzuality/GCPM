# GCPM - Global Cancer Project Map

TODO: Write a project description



##  Requirements:

* Ruby 2.3.0 [How to install](https://gorails.com/setup/osx/10.10-yosemite)
* PostgreSQL 9+ [How to install](http://exponential.io/blog/2015/02/21/install-postgresql-on-mac-os-x-via-brew/)
* Cron or similar tool is required for periodically sending notification emails 

## Installation

Install global dependencies:

    gem install bundler

Install project dependencies:

    bundle install

Set up environment variables by copying `.env.sample` to `.env` and filling up the necessary values accordingly
See also the [CartoDB integration](#cartodb-integration) section for information on how to configure your CartoDB account.

To set up the database, run:

    bundle exec rake db:create
    bundle exec rake db:migrate

## Running

To run application:

    bundle exec rails server
    
    
To send periodic notification emails to users, run the following `rake` task using `cron` or a similar tool:

    rake notifications:send
    
    
# Development 


## CartoDB integration

This project requires a [CartoDB](https://cartodb.com/) account to be configured in the .env files
In your CartoDB account, you should add [these custom functions](extra/cartodb_queries.sql)

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request :D
