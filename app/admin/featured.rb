ActiveAdmin.register Featured do
  menu parent: "Entities", priority: 0

  permit_params :featurable_id, :featurable_type, :weight

  index do
    selectable_column
    column :featurable_id
    column :featurable_type
    column :weight
    actions
  end

  form do |f|
    f.semantic_errors
    f.inputs do
      f.input :featurable_type, input_html: { disabled: 'disabled' }
      f.input :featurable_id, input_html: { disabled: 'disabled' }
      f.input :weight
    end
    f.actions
  end


end
