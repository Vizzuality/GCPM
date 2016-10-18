class PostsController < InheritedResources::Base

  private

    def post_params
      params.require(:post).permit(:title, :body, :user_id)
    end
end

