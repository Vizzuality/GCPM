class PostsController < InheritedResources::Base

  def new
    if !current_user
      redirect_to new_user_session_path and return
    end

    @post = Post.new
    @post.user_id = current_user.id
  end

  private

    def post_params
      params.require(:post).permit(:title, :body, :user_id)
    end
end

