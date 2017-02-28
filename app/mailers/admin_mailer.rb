class AdminMailer < ApplicationMailer
  def user_relation_email(class_name, relation_name, action)
    @date          = DateTime.now.to_date
    @name          = 'Administrator'
    @email         = ENV.fetch('ADMIN_EMAIL') { 'support@globalonc.org' }
    @action        = action        if action.present?
    @relation_name = relation_name if relation_name.present?
    @class_name    = class_name    if class_name.present?

    @subject       = if @action.include?('request')
                       "New #{@class_name} relation request for #{@relation_name}"
                     else
                       "A new #{@class_name} with the name #{relation_name} was #{@action}."
                     end

    mail(to: @email, subject: @subject)
  end
end
