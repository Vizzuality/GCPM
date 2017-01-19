if AdminUser.all.size == 0
  AdminUser.create!(email: 'admin@example.com', password: 'password', password_confirmation: 'password')
end
if CancerType.all.size == 0
  puts 'creating cancer types'
  diseases = ["All cancers but non-melanoma skin cancer", "Bladder", "Brain, nervous system", "Breast", "Cervix uteri", "Colorectum", "Corpus uteri", "Gallbladder", "Hodgkin lymphoma", "Kaposi sarcoma", "Kidney, renal pelvis and ureter", "Larynx", "Leukaemia", "Lip, oral cavity", "Liver and intrahepatic bile ducts", "Non-Melanoma skin cancer", "Melanoma of skin", "Multiple myeloma and immunoproliferative diseases", "Nasopharynx", "Non-Hodgkin lymphoma", "Oesophagus", "Other pharynx", "Ovary", "Pancreas", "Prostate", "Stomach", "Testis", "Thyroid", "Trachea, bronchus and lung", "Sarcoma", "Thymus"]
  diseases.each do |d|
    CancerType.create(name: d)
  end
end
if ProjectType.all.size == 0
  pt = ["Research, Basic", "Research, Clinical", "Research, Population-Based", "Training", "Capacity Building", "Cancer Prevention", "Cancer Screening", "Cancer Detection", "Cancer Treatment", "Cancer Surveillance, Cancer Registries", "Palliative Care"]
  pt.each do |p|
    ProjectType.create(name: p)
  end
end
if Speciality.all.size == 0
  sp = ["Pediatric oncology or childhood cancer", "Surgery / Surgical oncology", "Radiation Oncology", "Pathology", "Hematology and hematologic malignancies"]
  sp.each do |s|
    Speciality.create(name: s)
  end
end

#
# if Organization.all.size == 0
#   pt = ["Research, Basic", "Research, Clinical", "Research, Population-Based", "Training", "Capacity Building", "Cancer Prevention", "Cancer Screening", "Cancer Detection", "Cancer Treatment", "Cancer Surveillance, Cancer Registries", "Palliative Care"]
#   pt.each do |p|
#     Organization.create(name: p)
#   end
# end
# if Investigator.all.size == 0
#   pt = ["Research, Basic", "Research, Clinical", "Research, Population-Based", "Training", "Capacity Building", "Cancer Prevention", "Cancer Screening", "Cancer Detection", "Cancer Treatment", "Cancer Surveillance, Cancer Registries", "Palliative Care"]
#   pt.each do |p|
#     Investigator.create(name: p)
#   end
# end
OrganizationType.create(name: 'public') unless OrganizationType.find_by(name: 'public')
OrganizationType.create(name: 'non-profit') unless OrganizationType.find_by(name: 'non-profit')
OrganizationType.create(name: 'for-profit') unless OrganizationType.find_by(name: 'for-profit')

Country.create(country_name: 'Hong Kong', region_name: 'Eastern Asia', country_iso: "HK", country_iso_3: "HKG", region_iso: "ES", region_centroid: '{"type":"Point", "coordinates":[38.1739069049899,105.293943572632]}', country_centroid: '{"type":"Point", "coordinates":[‎22.286394,114.149139]}') unless Country.find_by(country_name: 'Hong Kong')

# Static content
if StaticPage.all.size == 0
  content_about = File.read('db/samples/static_pages/about.txt')
  content_terms = File.read('db/samples/static_pages/terms.txt')
  content_faq   = File.read('db/samples/static_pages/faq.txt')

  pages = [
    ['About', 'about', 'about', content_about],
    ['Terms and conditions', 'terms-and-conditions', 'terms', content_terms],
    ['FAQ for The Global Oncology Map', 'faq', 'faq', content_faq]
  ]

  pages.each do |name, slug, path, body|
    page = StaticPage.create( name: name, slug: slug, path_prefix: path, body: body )
    puts "Page #{name} created!"
  end

  puts "All static pages created!"
end
