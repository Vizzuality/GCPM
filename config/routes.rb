Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get '/',          to: 'home#index',      as: 'home'
  get '/map',       to: 'map#index',       as: 'map'
  get '/countries', to: 'countries#index', as: 'countries'
  get '/cancers',   to: 'cancers#index',   as: 'cancers'
  get '/about',     to: 'about#index',     as: 'about'
end
