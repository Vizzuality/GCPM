FactoryGirl.define do
  factory(:admin_user) do
    current_sign_in_at "2016-07-19T08:56 UTC"
    current_sign_in_ip #<IPAddr: IPv6:0000:0000:0000:0000:0000:0000:0000:0001/ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff>
    email "admin@example.com"
    encrypted_password "ToFactory: RubyParser exception parsing this attribute"
    last_sign_in_at "2016-06-29T16:16 UTC"
    last_sign_in_ip #<IPAddr: IPv6:0000:0000:0000:0000:0000:0000:0000:0001/ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff>
    remember_created_at "2016-06-29T16:16 UTC"
    reset_password_sent_at nil
    reset_password_token nil
    sign_in_count 2
  end
end
