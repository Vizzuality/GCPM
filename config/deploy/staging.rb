server ENV['STAGING_IP'], user: ENV['SSH_USER'], roles: %w{web app db}, primary: true
set :ssh_options, {
  forward_agent: true,
  auth_methods: %w(publickey password),
  password: fetch(:password)
}
 set :branch, 'develop-cleanup'
