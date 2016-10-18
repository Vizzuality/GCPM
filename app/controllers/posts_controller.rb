class PostsController < InheritedResources::Base
  def index
    if !current_user
      redirect_to new_user_session_path and return
    else
      redirect_to user_path(id: current_user.id, data: 'posts')
    end
  end

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

