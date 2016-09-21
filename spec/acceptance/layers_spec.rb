require 'acceptance_helper'

module Api::V1
  describe 'Layers', type: :request do

    let!(:layer_group) do
      LayerGroup.create!(name: 'environment', id: 1)
    end

    let!(:layers) do
      layers = []
      3.times do |i|
        layers << create(:layer, name: "test layer #{i}", slug: "test-layer-#{i}" , id: i)
      end
      layers.each(&:reload)
    end

    let!(:agrupation) do
      3.times do |i|
        Agrupation.create!(layer_group_id: 1, layer_id: i)
      end
    end

    context "List layers" do
      it 'Get api layers' do
        get "/api/layers"
        expect(status).to eq(200)
        results = json
        expect(results.length).to eq(3)
        names = results.map{ |r| r['name'] }
        expect names.include?(['test layer 0', 'test layer 1', 'test layer 2'])
      end
    end
  end
end
