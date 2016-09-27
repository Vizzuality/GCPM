FROM ruby:2.3.1-alpine

COPY Gemfile /app/
COPY Gemfile.lock /app/

RUN apk update \
  && apk upgrade \
  && apk --update add git build-base postgresql-dev qt-dev \

  && mkdir -p /app \
  && gem install bundler \
  && cd /app \
  && bundle install --without production

COPY . /app
