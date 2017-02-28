class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch('ADMIN_EMAIL') { 'support@globalonc.org' }
  layout 'mailer'
end
