class ContactFormsController < ApplicationController
  def new
    @contact_form = ContactForm.new
  end
  def create
    @contact_form = ContactForm.new(contact_form_params)
    @contact_form.request = request
    if @contact_form.deliver
      redirect_to root_path, flash: { notice: "Your email has been sent." }
    else
      render action: :new
    end
  end
  private
  def contact_form_params
    params.require(:contact_form).permit(:name, :email, :message, :subject, :nickname)
  end
end
