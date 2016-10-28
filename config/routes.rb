Rails.application.routes.draw do
  devise_for :users, controllers: { sessions: 'users/sessions', omniauth_callbacks: 'users/omniauth_callbacks' }
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  get '/',                      to: 'home#index',         as: 'home'
  get '/map',                   to: 'map#index',          as: 'map'
  get '/countries',             to: 'countries#index',    as: 'countries'
  get '/countries/:iso',        to: 'countries#show',     as: 'country'
  get '/cancer-types',          to: 'cancer_types#index', as: 'cancers'
  get '/cancer-types/:id',      to: 'cancer_types#show',  as: 'cancer'
  get '/organizations/:id',     to: 'organizations#show', as: 'organization'
  get '/about',                 to: 'about#index',        as: 'about'
  get '/downloads/user-manual', to: 'downloads#show',     as: 'download_user_manual'
  get '/network/:id',           to: 'users#show',         as: 'user'

  resources :projects, only: :show do
    patch 'relation_request', on: :member
    patch 'remove_relation',  on: :member
    resources :project_updates
  end

  resources :investigators, only: :show do
    patch 'relation_request', on: :member
    patch 'remove_relation',  on: :member
  end

  resources :projects, only: :show
  resources :events, except: [:index]
  resources :posts

  # User profile
  resources :users, only: :show, path: :network do
    resources :projects, controller: 'network_projects', except: :index do
      patch 'remove_relation',  on: :member
    end

    resources :events,   controller: 'network_events',   except: :index
  end

  # Network
  get '/network/:id/projects', to: 'users#show'

  post 'follows/:resource/:id', to: 'follows#create', as: :follows
  delete 'follows/:resource/:id', to: 'follows#destroy', as: :follow

  post 'block/:user_id', to: 'follows#block', as: :blocks
  delete 'block/:user_id', to: 'follows#unblock', as: :block

  resources :searches, path: 'search', controller: 'search', only: :index

  # Admin
  #get 'admin/excel-uploader', to: 'admin/excel_uploader#new', as: :admin_excel_uploader

  # Mensajes
  post "/message", to: 'messages#create', as: :message
  get "/network/:user_id/messages", to: 'messages#index', as: :messages
  get "/network/:user_id/messages/:id", to: 'messages#show', as: :message_show
  delete "/messages/:id", to: 'messages#destroy', as: :delete_message

  # API
  namespace :api, defaults: { format: 'json' } do
    scope module: :v1 do
      resources :regions,            only: [:index, :show]
      resources :cancer_types,       only: [:index, :show], path: '/cancer-types'
      resources :project_types,      only: [:index],        path: 'project-types'
      resources :organization_types, only: [:index],        path: 'organization-types'
      resources :map,                only: [:index]

      get '/map/projects/:id', to: 'map#show_project'
      get '/map/download',     to: 'map#csv_download'

      resources :projects,      only: [:show, :update, :create] do
        resources :memberships, only: [:index, :create, :destroy]
        post '/memberships/:id', to: 'memberships#update'
      end

      resources :investigators,  only: [:index, :show, :update, :create]
      resources :organizations,  only: [:index, :show]

      get 'funding-sources',     to: 'organizations#index'
      get 'countries',           to: 'countries#index'
      get 'check_research_unit', to: 'memberships#check_research_unit'
      get 'lists/countries',     to: 'lists#countries'
      get 'lists/cancer-types',  to: 'lists#cancer_types'
      get 'map/projects/:id',    to: 'map#show_project'
      get 'map/events/:id',      to: 'map#show_event'
      get 'layer-groups',        to: 'layer_groups#index',          as: 'layer_groups'
      get '/layers',             to: 'layers#index',                as: 'layers'
    end
  end

  root to: 'home#index'
end
