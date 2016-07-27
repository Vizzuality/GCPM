namespace :db do
  task keys: :environment do
    ActiveRecord::Base.connection.tables.each do |t|
      ActiveRecord::Base.connection.reset_pk_sequence!(t)
      puts 'reseting ' + t + ' keys'
    end
  end
end
