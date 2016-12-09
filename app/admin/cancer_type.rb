ActiveAdmin.register CancerType do
  menu parent: "Entities", priority: 5

  permit_params :name, :description
end
