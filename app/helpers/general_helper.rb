module GeneralHelper
  def is_owner?(user1, user2)
    user1 == user2
  end

  def get_user(id)
    User.find_by(id: id)
  end

  def not_blank?(str)
    str.present? && str != ''
  end

  def prop_or_blank(str)
    str.present? ? str : ''
  end

  def get_not_null_user(entity)
    entity.present? && entity.user.present? && entity.user
  end

  def is_controller?(current_controller, controller_name)
    current_controller == controller_name
  end

  def not_me_and_section?(controller_name, user, investigatorUser)
    !is_controller?(controller_name, 'users') && !is_controller?(controller_name, 'investigators') ||
      is_controller?(controller_name, 'users') && !is_owner?(user, current_user) || is_controller?(controller_name, 'investigators') && !is_owner?(investigatorUser, current_user)
  end

end
