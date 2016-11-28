class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch('ADMIN_EMAIL') { 'data@gcpm.globalonc.org' }
  layout 'mailer'
end
