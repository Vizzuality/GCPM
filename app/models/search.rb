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
    @term = term.delete('()')
    @type = type
  end

  def results
    if @term.present?
      sanitized_term = ActiveRecord::Base.send(:sanitize_sql_array, ["to_tsquery('english', ?)", @term.gsub(/\s/,'+')])
      results = self.class.where("to_tsvector('english', searches.term) @@ #{sanitized_term} AND
                                  LOWER(searches.searchable_type) LIKE LOWER(?)",
                                  "%#{@type}%").preload(:searchable).map(&:searchable).uniq
      if results.empty?
        results = self.class.where('LOWER(searches.term) LIKE LOWER(?)
                                    AND
                                    LOWER(searches.searchable_type) LIKE LOWER(?)',
                                    "%#{@term}%", "%#{@type}%").preload(:searchable).map(&:searchable).uniq
      end
      results
    else
      Search.none
    end
  end
end
