class ContactForm < MailForm::Base
  attribute :name,     validate: true
  attribute :email,    validate: /\A([\w\.%\+\-]+)@([\w\-]+\.)+([\w]{2,})\z/i

  attribute :message
  attribute :subject,   validate: true
  attribute :nickname,  captcha: true
  append :remote_ip

   # Declare the e-mail headers. It accepts anything the mail method
  # in ActionMailer accepts.
  def headers
    {
      subject: "#{subject}",
      to: "data@gcpm.globalonc.org",
      from: %("#{name}" <#{email}>)
    }
  end
end
