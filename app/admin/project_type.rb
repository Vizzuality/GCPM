ActiveAdmin.register ProjectType do
  menu parent: "Entities", priority: 10

  permit_params :name
end
