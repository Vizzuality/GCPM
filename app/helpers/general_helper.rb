module GeneralHelper
  def is_owner?(user1, user2)
    user1 == user2
  end

  def not_blank?(str)
    str.present? && str != ''
  end

end
