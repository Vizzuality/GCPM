# == Schema Information
#
# Table name: searches
#
#  searchable_id   :integer
#  searchable_type :text
#  term            :string
#

class Search < ActiveRecord::Base
  extend Textacular

  belongs_to :searchable, polymorphic: true

  def initialize(term, type=nil)
    @term = term
    @type = type
  end

  def results
    if @term.present?
      self.class.where('LOWER(searches.term) LIKE LOWER(?)
                        AND
                        LOWER(searches.searchable_type) LIKE LOWER(?)',
                        "%#{@term}%", "%#{@type}%").preload(:searchable).map(&:searchable).uniq
    else
      Search.none
    end
  end
end
