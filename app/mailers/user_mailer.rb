class UserMailer < ApplicationMailer
  def user_relation_email(contact_name, contact_email, relation_name, action)
    @date          = DateTime.now.to_date
    @name          = contact_name
    @email         = contact_email
    @action        = action
    @name_or_email = if contact_name.present?
                       contact_name
                     else
                       contact_email
                     end

    @subject       = if @action.include?('request')
                       'Your request is being revised, please, check your dashboard for updates.'
                     else
                       "The relation was #{@action}."
                     end

    @relation_name = relation_name

    mail(to: @email, subject: @subject)
  end
end
