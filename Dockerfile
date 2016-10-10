FROM ruby:2.3.1-alpine

RUN apk add --update --no-cache \
  bash \
  git \
  build-base \
  nodejs \
  tzdata \
  libxml2-dev \
  libxslt-dev \
  postgresql-dev \
  qt-dev \
  && mkdir /myapp

WORKDIR /app
ADD Gemfile /app/Gemfile
ADD Gemfile.lock /app/Gemfile.lock
RUN RAILS_ENV=development bundle install --jobs 5 --retry 5
ADD . /app
CMD bundle exec rails s -p 3000 -b '0.0.0.0'
