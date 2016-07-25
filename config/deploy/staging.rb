server ENV['STAGING_IP'], user: ENV['SSH_USER'], roles: %w{web app db}, primary: true
set :ssh_options, {
  forward_agent: true
  uth_methods: %w(publickey password),
  password: fetch(:password)
}
