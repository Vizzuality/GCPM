<<<<<<< cba6df1067bf790bd3c4ed8f741a8d47e6c4d6fe
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
=======
FROM ruby:2.3.1
MAINTAINER David Inga <david.inga@vizzuality.com>

ENV NAME gcpm

# Install apt based dependencies required to run Rails as
# well as RubyGems. As the Ruby image itself is based on a
# Debian image, we use apt-get to install those.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
    && rm -rf /var/lib/apt/lists/* \
    && curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get install -y nodejs libqt4-dev libqtwebkit-dev \
      qt5-default libqt5webkit5-dev gstreamer1.0-plugins-base \
      gstreamer1.0-tools gstreamer1.0-x

# Configure the main working directory. This is the base
# directory used in any further RUN, COPY, and ENTRYPOINT
# commands.
# RUN mkdir -p /usr/src/$NAME
ADD . /usr/src/$NAME
WORKDIR /usr/src/$NAME

# Copy the Gemfile as well as the Gemfile.lock and install
# the RubyGems. This is a separate step so the dependencies
# will be cached unless changes to one of those two files
# are made.
COPY Gemfile Gemfile.lock ./
RUN bundle install --jobs 20 --retry 5

# Expose port 3000 to the Docker host, so we can access it
# from the outside.
EXPOSE 3000

# The main command to run when the container starts. Also
# tell the Rails dev server to bind to all interfaces by
# default
CMD bundle exec rails server -b 0.0.0.0
>>>>>>> creating the new projects form
