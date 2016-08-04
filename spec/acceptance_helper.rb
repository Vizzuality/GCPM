require 'rails_helper'

def json
  JSON.parse(response.body)
end
