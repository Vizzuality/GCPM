class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch('ADMIN_EMAIL') { 'data@globalonc.org' }
  layout 'mailer'
end
