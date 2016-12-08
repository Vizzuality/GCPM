# By default list of parent classes includes only `[ApplicationRecord, ActiveRecord::Base]`.
# ActsAsFollower.custom_parent_classes = [ApplicationRecord]
ActsAsFollower.custom_parent_classes = ['Project', 'Organization', 'CancerType', 'Country', 'Event', 'Investigator', 'User']
