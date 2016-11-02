module MessagesHelper
  def conversation_person(c)
    receiver = c.receipts.where.not(receiver_id: current_user.id).first
    if receiver
      receiver.receiver
    end
  end

  def sender(id)
    sender = User.find(id)
  end
end
