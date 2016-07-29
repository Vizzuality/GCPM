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
OrganizationType.create(name: 'public') unless OrganizationType.find_by(name: 'public')
OrganizationType.create(name: 'non-profit') unless OrganizationType.find_by(name: 'non-profit')
OrganizationType.create(name: 'for-profit') unless OrganizationType.find_by(name: 'for-profit')
