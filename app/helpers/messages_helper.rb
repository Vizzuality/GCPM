module MessagesHelper
  def conversation_person(c)
    c.receipts.where.not(receiver_id: current_user.id).first.receiver
  end
end
