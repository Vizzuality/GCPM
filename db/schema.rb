# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160726110350) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_admin_comments", force: :cascade do |t|
    t.string   "namespace"
    t.text     "body"
    t.string   "resource_id",   null: false
    t.string   "resource_type", null: false
    t.string   "author_type"
    t.integer  "author_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id", using: :btree
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace", using: :btree
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id", using: :btree
  end

  create_table "addresses", force: :cascade do |t|
    t.string   "city"
    t.string   "country"
    t.string   "country_code"
    t.float    "latitude"
    t.float    "longitude"
    t.text     "line_1"
    t.text     "line_2"
    t.text     "line_3"
    t.string   "postcode"
    t.boolean  "primary",          default: false
    t.string   "state"
    t.string   "state_code"
    t.integer  "geonames_city_id"
    t.integer  "organization_id"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.index ["organization_id"], name: "index_addresses_on_organization_id", using: :btree
  end

  create_table "addresses_investigators", id: false, force: :cascade do |t|
    t.integer "address_id"
    t.integer "investigator_id"
    t.index ["address_id"], name: "index_addresses_investigators_on_address_id", using: :btree
    t.index ["investigator_id"], name: "index_addresses_investigators_on_investigator_id", using: :btree
  end

  create_table "admin_users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true, using: :btree
  end

  create_table "cancer_types", force: :cascade do |t|
    t.string   "name"
    t.text     "description"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "cancer_types_projects", id: false, force: :cascade do |t|
    t.integer "project_id"
    t.integer "cancer_type_id"
    t.index ["cancer_type_id"], name: "index_cancer_types_projects_on_cancer_type_id", using: :btree
    t.index ["project_id"], name: "index_cancer_types_projects_on_project_id", using: :btree
  end

  create_table "countries", force: :cascade do |t|
    t.string   "country_name"
    t.string   "region_name"
    t.string   "country_iso"
    t.string   "region_iso"
    t.string   "country_centroid"
    t.string   "region_centroid"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  create_table "investigators", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.string   "position_title"
    t.text     "website"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "members", force: :cascade do |t|
    t.integer  "project_id"
    t.integer  "organization_id"
    t.integer  "investigator_id"
    t.integer  "membership_type"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.index ["investigator_id"], name: "index_members_on_investigator_id", using: :btree
    t.index ["membership_type"], name: "index_members_on_membership_type", using: :btree
    t.index ["organization_id"], name: "index_members_on_organization_id", using: :btree
    t.index ["project_id"], name: "index_members_on_project_id", using: :btree
  end

  create_table "organization_types", force: :cascade do |t|
    t.string "name"
  end

  create_table "organization_types_organizations", id: false, force: :cascade do |t|
    t.integer "organization_id"
    t.integer "organization_type_id"
    t.index ["organization_id"], name: "index_organization_types_organizations_on_organization_id", using: :btree
    t.index ["organization_type_id"], name: "index_organization_types_organizations_on_organization_type_id", using: :btree
  end

  create_table "organizations", force: :cascade do |t|
    t.string   "name"
    t.string   "acronym"
    t.string   "grid_id"
    t.string   "email_address"
    t.integer  "established"
    t.integer  "organization_type_id"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.index ["grid_id"], name: "index_organizations_on_grid_id", using: :btree
    t.index ["organization_type_id"], name: "index_organizations_on_organization_type_id", using: :btree
  end

  create_table "project_types", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "project_types_projects", id: false, force: :cascade do |t|
    t.integer "project_id"
    t.integer "project_type_id"
    t.index ["project_id"], name: "index_project_types_projects_on_project_id", using: :btree
    t.index ["project_type_id"], name: "index_project_types_projects_on_project_type_id", using: :btree
  end

  create_table "projects", force: :cascade do |t|
    t.string   "title"
    t.text     "summary"
    t.text     "project_website"
    t.date     "start_date"
    t.date     "end_date"
    t.integer  "status"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.integer  "failed_attempts",        default: 0,  null: false
    t.string   "unlock_token"
    t.datetime "locked_at"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true, using: :btree
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true, using: :btree
  end

end
