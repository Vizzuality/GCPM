module Api
  module V1
    class UsersController < ApiController
      def index
        users = User.where("email ilike ? or name ilike ?", "%#{users_params}%","%#{users_params}%").where.not('confirmed_at is null').order('name ASC').limit(10).offset(params[:offset].to_i)
        render json: users, each_serializer: UserSearchSerializer
      end
      private
      def users_params
        params.require(:q)
      end
    end
  end
end
