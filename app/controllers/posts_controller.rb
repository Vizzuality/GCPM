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

  def edit
  end

  def update
    if @post.update(post_params)
      @post.build_pins(pins_params) if pins_params.present?
      redirect_to posts_url, notice: 'Post updated'
    else
      render :edit
    end
  end

  def create
    @post = Post.new(post_params)
    @post.user = current_user

    if @post.save
      @post.build_pins(pins_params) if pins_params.present?
      redirect_to post_path(@post.id)
    else
      redirect_to new_post_path(error: true)
    end
  end

  private

    def post_params
      params.require(:post).permit(:title, :body, :user_id, :organizations, :cancer_types, :projects, :countries).tap do |post_params|
        post_params.except(:organizations, :cancer_types, :projects, :countries)
      end
    end

    def pins_params
      options = {}
      options['cancer_types']  = params[:post][:cancer_types]  if params[:post][:cancer_types].present?
      options['organizations'] = params[:post][:organizations] if params[:post][:organizations].present?
      options['projects']      = params[:post][:projects]      if params[:post][:projects].present?
      options['countries']     = params[:post][:countries]     if params[:post][:countries].present?
      options
    end

    def check_user
      if !current_user
        redirect_to new_user_session_path and return
      end
    end
end
