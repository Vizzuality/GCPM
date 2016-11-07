module Api::V1
  class MembershipsController < ApiController
    include ApiAuthenticable

    before_action :set_user_project,       except: :check_research_unit
    before_action :set_project_membership, except: [:index, :create, :check_research_unit]

    def index
      memberships = @project.memberships.all.includes(:investigator, :organization)
      render json: memberships, each_serializer: MembershipSerializer
    end

    def create
      @membership = Membership.new(membership_params)
      if @membership.save
        render json: { success: true, message: 'Membership created!' }, status: 201
      else
        render json: { success: false, message: 'Error creating membership' }, status: 422
      end
    end

    def check_research_unit
      @ru = ResearchUnit.check_id(params[:investigator_id], params[:address_id])
      if @ru.present?
        render json: { research_unit_id: @ru.id }, status: 200
      else
        render json: { success: false, message: 'Relation not valid!' }, status: 422
      end
    end

    def update
      if @membership.update(membership_params)
        render json: { success: true, message: 'Membership updated!' }, status: 200
      else
        render json: { success: false, message: 'Error updateting membership' }, status: 422
      end
    end

    def destroy
      @membership.destroy
      begin
        render json: { message: 'Membership deleted' }, status: 200
      rescue ActiveRecord::RecordNotDestroyed
        return render json: @membership.erors, message: 'Membership could not be deleted', status: 422
      end
    end

    private

      def set_user_project
        @project = @user.projects.set_by_id_or_slug(params[:project_id])
      end

      def set_project_membership
        @membership = @project.memberships.find(params[:id])
      end

      def membership_params
        params.require(:membership).permit!
      end
  end
end
