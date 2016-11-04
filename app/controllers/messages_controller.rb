class MessagesController < ApplicationController
  respond_to :html, :js

  def index
    @user = current_user
    @conversations = Mailboxer::Conversation.joins(:receipts).where(mailboxer_receipts: { receiver_id: current_user.id, deleted: false }).uniq.page(params[:page]).per(20)
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
    if message_params[:in_response].present?
      message = Mailboxer::Message.find(message_params[:in_response])
      message.receipts.where.not(receiver_id: current_user.id).first.receiver
      #authorize! :create_message, message
      if current_user.reply_to_conversation(message.conversation, message_params[:body])
        message_params[:data] == 'messages' ? renderMessages : renderNotice
      end
    else
      receiver = User.find_by(id: message_params[:receiver])
      Mailboxer::Message.new(receipts: [Mailboxer::Receipt.new(receiver: receiver)])
      sender = current_user
      #authorize! :create_message, message
      if sender.send_message(receiver, message_params[:body], message_params[:subject])
        message_params[:data] == 'messages' ? renderMessages : renderNotice
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

  def renderMessages
    @page = params.key?(:page) && params[:page] ? params[:page].to_i : 1
    limit = 12;
    @conversations = Mailboxer::Conversation.joins(:receipts).where(mailboxer_receipts: { receiver_id: current_user.id, deleted: false }).uniq.page(params[:page]).order('created_at DESC')

    @items = @conversations.limit(limit)
    @more = (@conversations.size > @items.size)
    @items_total = @conversations.size

    respond_with(@items)
  end

  def renderNotice
    respond_with(true)
  end


  private
    def message_params
      params.require(:message).permit(:body, :subject, :receiver, :in_response, :data)
    end

end
