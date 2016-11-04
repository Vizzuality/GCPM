require 'rails_helper'

module Account
  RSpec.describe Ability, type: :model do
    before :each do
      @user      = create(:user)
      @adminuser = create(:admin_user)
    end

    it { Abilities::AdminUser.should include(CanCan::Ability) }
    it { Abilities::AdminUser.should respond_to(:new).with(1).argument }

    it { Abilities::User.should include(CanCan::Ability) }
    it { Abilities::User.should respond_to(:new).with(1).argument }

    it { Abilities::Guest.should include(CanCan::Ability) }
    it { Abilities::Guest.should respond_to(:new).with(1).argument }

    context 'Administrator' do
      it 'can manage objects' do
        Abilities::AdminUser.any_instance.should_receive(:can).with(:manage, :all)
        Abilities::AdminUser.any_instance.should_receive(:cannot).with(:destroy, ::User, id: @adminuser.id)
        Abilities::AdminUser.new @adminuser
      end
    end

    context 'User' do
      it 'can manage objects' do
        Abilities::User.any_instance.should_receive(:can).with(:read, :all)
        Abilities::User.any_instance.should_receive(:can).with(:update, ::User, id: @user.id)
        Abilities::User.any_instance.should_receive(:can).with(:manage, ::Project, project_users: { user_id: @user.id, is_approved: true })
        Abilities::User.any_instance.should_receive(:can).with(:manage, ::Investigator, user_id: @user.id, is_approved: true)
        Abilities::User.any_instance.should_receive(:can).with(:manage, ::Event, user_id: @user.id)
        Abilities::User.any_instance.should_receive(:can).with(:manage, ::Post, user_id: @user.id)
        Abilities::User.any_instance.should_receive(:can).with(:create, :all)
        Abilities::User.any_instance.should_receive(:can).with(:remove_relation,  ::Project, project_users: { user_id: @user.id })
        Abilities::User.any_instance.should_receive(:can).with(:relation_request, ::Project)
        Abilities::User.any_instance.should_receive(:can).with(:remove_relation,  ::Investigator, user_id: @user.id)
        Abilities::User.any_instance.should_receive(:can).with(:relation_request, ::Investigator)
        Abilities::User.new @user
      end
    end

    context 'Guest' do
      it 'can read objects' do
        Abilities::Guest.any_instance.should_receive(:can).with(:read, :all)
        Abilities::Guest.new @user
      end
    end
  end
end
