lock '3.5.0'

set :application, 'GCPM'
set :repo_url, 'git@github.com:Vizzuality/GCPM.git'

set :passenger_restart_with_touch, true

set :rvm_type, :auto
set :rvm_ruby_version, '2.3.1'
set :rvm_roles, [:app, :web, :db]

set :branch, 'master'
set :deploy_to, '~/gcpm'

set :keep_releases, 5

set :linked_files, %w{.env}
set :linked_dirs, %w{log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system db_backups public/downloads}

set :rvm_map_bins, fetch(:rvm_map_bins, []).push('rvmsudo')

namespace :deploy do
  after :finishing, 'deploy:cleanup'
  after 'deploy:publishing', 'deploy:symlink:linked_files', 'deploy:symlink:linked_dirs', 'deploy:restart'
end
