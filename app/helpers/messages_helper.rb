module MessagesHelper
  def conversation_person(c)
    receiver = c.receipts.where.not(receiver_id: current_user.id).first
    receiver&.receiver
  end

  def sender(id)
    User.find(id)
  end
end
