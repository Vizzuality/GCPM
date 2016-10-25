# frozen_string_literal: true
module UserRelationable
  extend ActiveSupport::Concern

  included do
    def relation_request(user_id=nil)
      if self.class.name == 'Project'
        ProjectUser.where(project_id: self.id, user_id: user_id).first_or_create
      else
        update user_id: user_id
      end
    end

    def remove_relation(user_id=nil)
      if self.class.name == 'Project'
        ProjectUser.find_by(project_id: self.id, user_id: user_id).destroy
      else
        update user_id: nil
      end
    end
  end

  class_methods do
  end
end
