class MessagesController < ApplicationController
  def index
    @user = current_user
    @conversations = Mailboxer::Conversation.joins(:receipts).where(mailboxer_receipts: {receiver_id: current_user.id, deleted: false}).uniq.page(params[:page]).per(20)
    # render :whatever
  end
  def show
    @user = current_user
    conversation = Mailboxer::Conversation.find(params[:id])
    #authorize! :show_conversation, conversation
    conversation.receipts_for(current_user).map{|m| m.message.mark_as_read(current_user) if m.message.is_unread?(current_user)}
    @conversation = conversation.messages
    # render :whatever
  end
  def create
    sender = current_user
    if message_params[:in_response].present?
      message = Mailboxer::Message.find(message_params[:in_response])
      receiver = message.receipts.where.not(receiver_id: current_user.id).first.receiver
      #authorize! :create_message, message
      if current_user.reply_to_conversation(message.conversation, message_params[:body])
        # Example redirect: redirect_to message_show_path(current_user, message.conversation), flash: { notice: "Message sent." }
      end
    else
      receiver = User.find_by(slug: message_params[:receiver])
      message = Mailboxer::Message.new(receipts: [Mailboxer::Receipt.new(receiver: receiver)])
      sender = current_user
      #authorize! :create_message, message
      if message = sender.send_message(receiver, message_params[:body], message_params[:subject])
        # Example redirect: redirect_to user_path(receiver), flash: { notice: "Mensaje enviado." }
      end
    end
  end

  def destroy
    message = Mailboxer::Message.find(params[:id])
    # authorize! :destroy_message, message
    conversation = message.conversation
    conversation.mark_as_deleted current_user
    redirect_to messages_path(current_user), flash: { notice: "Conversación eliminada." }
  end

  private
  def message_params
    params.require(:message).permit(:body, :subject, :receiver, :in_response)
  end
end
