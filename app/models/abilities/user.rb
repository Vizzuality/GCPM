# frozen_string_literal: true
module Abilities
  class User
    include CanCan::Ability

    def initialize(user)
      can :read, :all

      can :update,  ::User,         id: user.id
      can :manage,  ::Investigator, user_id: user.id, is_approved: true
      can :manage,  ::Post,         user_id: user.id
      can :manage,  ::Event,        user_id: user.id
      can :manage,  ::Project,      project_users: { user_id: user.id, is_approved: true }
      can :destroy, ::Project,      created_by: user.id

      can :update, ::Project do |project|
        user_project = project.project_users.find_by(user_id: user.id)
        user_project_approved = user_project.approved? if user_project.present?
        project.project_creator(user.id) || user_project_approved
      end

      can :create, :all

      can :remove_relation,  ::Project, project_users: { user_id: user.id }
      can :relation_request, ::Project
      can :remove_relation,  ::Investigator, user_id: user.id
      can :relation_request, ::Investigator
    end
  end
end
