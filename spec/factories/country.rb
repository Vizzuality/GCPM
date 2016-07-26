FactoryGirl.define do
  factory(:country) do
    country_centroid "{\"type\":\"point\", \"coordinates\":[42.55,1.58333]}"
    country_iso "AD"
    country_name "Andorra"
    region_centroid nil
    region_iso nil
    region_name nil
  end
end
