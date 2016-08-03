module RoutesHelper
  def add_address_path(name, f, association, class_name=nil)
    form_name = 'address_relation_form'
    common_nested_path(form_name, name, f, association, class_name)
  end

  def add_membership_path(name, f, association, class_name=nil)
    form_name = 'membership_relation_form'
    common_nested_path(form_name, name, f, association, class_name)
  end

  def add_membership_orga_path(name, f, association, class_name=nil)
    form_name = 'membership_orga_relation_form'
    common_nested_path(form_name, name, f, association, class_name)
  end

  def add_membership_address_path(name, f, association, class_name=nil)
    form_name = 'membership_address_relation_form'
    common_nested_path(form_name, name, f, association, class_name)
  end

  def common_nested_path(form_name, name, f, association, class_name=nil)
    new_object = f.object.send(association).klass.new
    id         = new_object.object_id

    fields = f.fields_for(association, new_object, child_index: id) do |actions_form|
      render(form_name, f: actions_form)
    end
    link_to(name, '', class: class_name, data: { id: id, fields: fields.gsub("\n", '') })
  end
end
