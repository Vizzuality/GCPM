class UserMailer < ApplicationMailer
  def user_relation_email(contact_name, contact_email, relation_name, action)
    @date          = DateTime.now.to_date
    @name          = contact_name  if contact_name.present?
    @email         = contact_email if contact_email.present?
    @action        = action        if action.present?
    @name_or_email = if @name.present?
                       @name
                     else
                       @email
                     end

    @subject       = if @action.include?('request')
                       'Your request is being reviewed, please, check your dashboard for updates.'
                     else
                       "The relation was #{@action}."
                     end

    @relation_name = relation_name

    mail(to: @email, subject: @subject)
  end
end
