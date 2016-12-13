# frozen_string_literal: true
class Ability
  include CanCan::Ability

  def initialize(user)
    if user # devise session users
      if user.admin?
        merge Abilities::AdminUser.new(user)
      else
        merge Abilities::User.new(user)
      end
    else
      merge Abilities::Guest.new(user)
    end
  end
end
