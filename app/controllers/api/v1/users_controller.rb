module Api
  module V1
    class UsersController < ApiController
      def index
        users = User.fetch_all(users_params).order('name ASC').limit(10).offset(params[:offset].to_i)
        render json: users, each_serializer: UserSearchSerializer
      end
      private
      def users_params
        params.require(:q)
      end
    end
  end
end
