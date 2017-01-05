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
    gon.server_params = {
      'post[countries][]': @post.countries.pluck(:id),
      'post[organizations][]': @post.organizations.pluck(:id),
      'post[projects][]': @post.projects.pluck(:id),
      'post[cancer_types][]': @post.cancer_types.pluck(:id),
      'post[specialities][]': @post.specialities.pluck(:id)
    }
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
      params.require(:post).permit(:title, :body, :user_id, { organizations: [] }, { cancer_types: [] }, { projects: [] }, { countries: [] }, { specialities: [] })
                           .except(:organizations, :cancer_types, :projects, :countries, :specialities)
    end

    def pins_params
      params.require(:post).permit(:title, :body, :user_id, { organizations: [] }, { cancer_types: [] }, { projects: [] }, { countries: [] }, { specialities: [] })
                           .except(:title, :body, :user_id)
    end

    def check_user
      if !current_user
        redirect_to new_user_session_path and return
      end
    end
end
