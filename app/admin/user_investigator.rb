ActiveAdmin.register_page "UserInvestigator" do
  menu label: "Investigators relations", parent: 'Network', priority: 1

  content title: 'Investigators relations' do
    table class: 'index_table index' do
      thead do
        tr do
          %w[Investigator User Approved Action Remove].each &method(:th)
        end
      end

      tbody do
        Investigator.user_present.each do |investigator|
          tr do
            td do
              investigator.name
            end
            td do
              investigator.user.name if investigator.user.present?
            end
            td do
              investigator.is_approved
            end
            td do
              if investigator.is_approved?
                link_to 'Unpprove', unapprove_admin_investigator_path(investigator), method: :patch
              else
                link_to 'Approve', approve_admin_investigator_path(investigator), method: :patch
              end
            end
            td do
              if investigator.user_id.present?
                link_to 'Remove user from investigator', delete_relation_admin_investigator_path(investigator), method: :patch
              end
            end
          end
        end
      end
    end
  end
end
