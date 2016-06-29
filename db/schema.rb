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

ActiveRecord::Schema.define(version: 20160623093250) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "addresses", force: :cascade do |t|
    t.string   "city"
    t.string   "country"
    t.string   "country_iso"
    t.float    "latitude"
    t.float    "longitude"
    t.text     "address"
    t.string   "postcode"
    t.boolean  "primary",         default: false
    t.string   "state"
    t.string   "state_code"
    t.string   "geonames_city"
    t.integer  "organization_id"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.index ["organization_id"], name: "index_addresses_on_organization_id", using: :btree
  end

  create_table "organization_types", force: :cascade do |t|
    t.string "name"
  end

  create_table "organizations", force: :cascade do |t|
    t.string   "name"
    t.string   "acronym"
    t.string   "grid_id"
    t.integer  "organization_type_id"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.index ["organization_type_id"], name: "index_organizations_on_organization_type_id", using: :btree
  end

end
