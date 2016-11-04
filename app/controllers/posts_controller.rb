class PostsController < InheritedResources::Base
  load_and_authorize_resource

  before_action :check_user, only: [:new, :create, :index]

  def index
    if current_user
      redirect_to user_path(id: current_user.id, data: 'posts')
    end
  end

  def new
    @post = Post.new
  end

  def create
    @post = Post.new(post_params)
    @post.user = current_user

    if @post.save
      redirect_to post_path(@post.id)
    else
      redirect_to new_post_path(error: true)
    end
  end

  private

  def post_params
    params.require(:post).permit(:title, :body, :user_id)
  end

  def check_user
    if !current_user
      redirect_to new_user_session_path and return
    end
  end
end
