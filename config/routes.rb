Rails.application.routes.draw do

  devise_for :users
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  get '/',                      to: 'home#index',         as: 'home'
  get '/map',                   to: 'map#index',          as: 'map'
  get '/countries',             to: 'countries#index',    as: 'countries'
  get '/countries/:iso',        to: 'countries#show',     as: 'country'
  get '/cancer-types',          to: 'cancer_types#index', as: 'cancers'
  get '/about',                 to: 'about#index',        as: 'about'
  get '/downloads/user-manual', to: 'downloads#show',     as: 'download_user_manual'

  resources :projects, only: :show
  resources :events, except: :destroy

  # User profile
  resources :users, only: :show, path: :network do
    resources :projects, controller: 'network_projects', except: :index
    resources :events,   controller: 'network_events',   except: :destroy
  end

  get '/network/:id/projects', to: 'users#show'

  # Admin
  #get 'admin/excel-uploader', to: 'admin/excel_uploader#new', as: :admin_excel_uploader

  namespace :api, defaults: { format: 'json' } do
    scope module: :v1 do
      resources :regions,      only: [:index, :show]
      resources :cancer_types, only: [:index, :show], path: '/cancer-types'
      resources :map, only: [:index]

      get 'lists/countries',    to: 'lists#countries'
      get 'lists/cancer-types', to: 'lists#cancer_types'
    end
  end

  root to: 'home#index'
end
