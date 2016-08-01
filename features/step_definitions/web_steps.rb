module WithinHelpers
  def with_scope(locator)
    locator ? within(locator) { yield } : yield
  end
end
World(WithinHelpers)

Given /^(?:|I )am on (.+)$/ do |page_name|
  visit path_to(page_name)
end

When /^(?:|I )go to (.+)$/ do |page_name|
  visit path_to(page_name)
end

When /^(?:|I )press "([^"]*)"(?: within "([^"]*)")?$/ do |button, selector|
  with_scope(selector) do
    click_button(button)
  end
end

When /^(?:|I )follow "([^"]*)"(?: within "([^"]*)")?$/ do |link, selector|
  with_scope(selector) do
    click_link(link)
  end
end

When /^(?:|I )double click on "([^"]*)"(?: within "([^"]*)")?$/ do |div, selector|
  with_scope(selector) do
    find(div).double_click
  end
end

When /^(?:|I )click on "([^"]*)"(?: within "([^"]*)")?$/ do |div, selector|
  with_scope(selector) do
    find(div).click
  end
end

When /^(?:|I )click on overlapping "([^"]*)"(?: within "([^"]*)")?$/ do |div, selector|
  with_scope(selector) do
    page.find(div).trigger(:click)
  end
end

When /^(?:|I )click on hidden "([^"]*)" on "([^"]*)"(?: within "([^"]*)")?$/ do |div, hidden_el, selector|
  with_scope(selector) do
    page.execute_script("$('#{hidden_el}').show()")
    page.execute_script("$('#{div}').click()")
  end
end

Then(/^I should see tab "(.*?)" within "(.*?)"$/) do |div, selector|
  with_scope(selector) do
    page.execute_script("$('#{div}').show()")
  end
end

When /^(?:|I )fill in "([^"]*)" with "([^"]*)"(?: within "([^"]*)")?$/ do |field, value, selector|
  with_scope(selector) do
    fill_in(field, with: value)
  end
end

When /^(?:|I )fill in hidden field "([^"]*)" with "([^"]*)"(?: within "([^"]*)")?$/ do |field, value, selector|
  with_scope(selector) do
    page.execute_script("$('#{field} input').show()")
    page.execute_script("$('#{field} input').val('#{value}')")
  end
end

When /^(?:|I )select datetime "([^ ]*) ([^ ]*) ([^ ]*)" as the "([^"]*)"(?: within "([^"]*)")?$/ do |year, month, day, field, selector|
  with_scope(selector) do
    select(year,   from: "#{field}_1i")
    select(month,  from: "#{field}_2i")
    select(day,    from: "#{field}_3i")
  end
end

When /^(?:|I )fill in "([^"]*)" for "([^"]*)"(?: within "([^"]*)")?$/ do |value, field, selector|
  with_scope(selector) do
    fill_in(field, with: value)
  end
end

When /^I fill in the following field "(.*?)" with "([^"]*)"(?: within "([^"]*)")?$/ do |div, value, selector|
  with_scope(selector) do
    first("#{div}").set("#{value}")
  end
end

When /^I select from the following field "(.*?)" with "([^"]*)"(?: within "([^"]*)")?$/ do |div, value, selector|
  with_scope(selector) do
    first("#{div}").select("#{value}")
  end
end

When /^I select from the following hidden field "(.*?)" with "([^"]*)"(?: within "([^"]*)")?$/ do |div, value, selector|
  with_scope(selector) do
    page.execute_script("$('#{div}').show()")
    first("#{div}").select("#{value}")
  end
end

When /^I should not be able to select from the following field "(.*?)" with "([^"]*)"(?: within "([^"]*)")?$/ do |div, value, selector|
  with_scope(selector) do
    options_text = first("#{div}")
    RSpec::Expectations.configuration.warn_about_potential_false_positives = false
    expect { options_text.has_selector?('option') && options_text.find(:xpath, XPath::HTML.option(value)) }.to raise_error
  end
end

# Use this to fill in an entire form with data from a table. Example:
#
#   When I fill in the following:
#     | Account Number | 5002       |
#     | Expiry date    | 2009-11-01 |
#     | Note           | Nice guy   |
#     | Wants Email?   |            |
#
# TODO: Add support for checkbox, select og option
# based on naming conventions.
#
When /^(?:|I )fill in the following(?: within "([^"]*)")?:$/ do |selector, fields|
  with_scope(selector) do
    fields.rows_hash.each do |name, value|
      When %{I fill in "#{name}" with "#{value}"}
    end
  end
end

When /^(?:|I )select "([^"]*)" from "([^"]*)"(?: within "([^"]*)")?$/ do |value, field, selector|
  with_scope(selector) do
    select(value, from: field)
  end
end

When /^(?:|I )select_chosen "([^"]*)" from "([^"]*)"(?: within "([^"]*)")?$/ do |value, field, selector|
  with_scope(selector) do
    find("##{field}", visible: false).set "#{value}"
  end
end

When /^(?:|I )check "([^"]*)"(?: within "([^"]*)")?$/ do |field, selector|
  with_scope(selector) do
    check(field)
  end
end

When /^(?:|I )uncheck "([^"]*)"(?: within "([^"]*)")?$/ do |field, selector|
  with_scope(selector) do
    uncheck(field)
  end
end

When /^(?:|I )choose "([^"]*)"(?: within "([^"]*)")?$/ do |field, selector|
  with_scope(selector) do
    choose(field)
  end
end

When /^(?:|I )attach the file "([^"]*)" to "([^"]*)"(?: within "([^"]*)")?$/ do |path, field, selector|
  with_scope(selector) do
    attach_file(field, File.expand_path(path))
  end
end

Then /^(?:|I )should see JSON:$/ do |expected_json|
  require 'json'
  expected = JSON.pretty_generate(JSON.parse(expected_json))
  actual   = JSON.pretty_generate(JSON.parse(response.body))
  expect(expected).to eq(actual)
end

Then /^(?:|I )should see "([^"]*)"(?: within "([^"]*)")?$/ do |text, selector|
  with_scope(selector) do
    if page.respond_to? :should
      expect(page).to have_content(text)
    else
      assert page.has_content?(text)
    end
  end
end

Then /^(?:|I )should see \/([^\/]*)\/(?: within "([^"]*)")?$/ do |regexp, selector|
  regexp = Regexp.new(regexp)
  with_scope(selector) do
    if page.respond_to? :should
      expect(page).to have_xpath('//*', text: regexp)
    else
      assert page.has_xpath?('//*', text: regexp)
    end
  end
end

Then /^(?:|I )should not see "([^"]*)"(?: within "([^"]*)")?$/ do |text, selector|
  with_scope(selector) do
    if page.respond_to? :should
      expect(page).to have_no_content(text)
    else
      assert page.has_no_content?(text)
    end
  end
end

Then /^(?:|I )should not see \/([^\/]*)\/(?: within "([^"]*)")?$/ do |regexp, selector|
  regexp = Regexp.new(regexp)
  with_scope(selector) do
    if page.respond_to? :should
      expect(page).to have_no_xpath('//*', text: regexp)
    else
      assert page.has_no_xpath?('//*', text: regexp)
    end
  end
end

Then /^the "([^"]*)" field(?: within "([^"]*)")? should contain "([^"]*)"$/ do |field, selector, value|
  with_scope(selector) do
    field = find_field(field)
    field_value = field.tag_name == 'textarea' ? field.text : field.value
    if field_value.respond_to? :should
      field_value.should =~ /#{value}/
    else
      assert_match(/#{value}/, field_value)
    end
  end
end

Then /^the "([^"]*)" field(?: within "([^"]*)")? should not contain "([^"]*)"$/ do |field, selector, value|
  with_scope(selector) do
    field = find_field(field)
    field_value = field.tag_name == 'textarea' ? field.text : field.value
    if field_value.respond_to? :should_not
      field_value.should_not =~ /#{value}/
    else
      assert_no_match(/#{value}/, field_value)
    end
  end
end

Then /^the "([^"]*)" checkbox(?: within "([^"]*)")? should be checked$/ do |label, selector|
  with_scope(selector) do
    field_checked = find_field(label)['checked']
    if field_checked.respond_to? :should
      field_checked.should be_true
    else
      assert field_checked
    end
  end
end

Then /^the "([^"]*)" checkbox(?: within "([^"]*)")? should not be checked$/ do |label, selector|
  with_scope(selector) do
    field_checked = find_field(label)['checked']
    if field_checked.respond_to? :should
      field_checked.should be_false
    else
      assert !field_checked
    end
  end
end

Then /^(?:|I )should be on (.+)$/ do |page_name|
  current_path = URI.parse(current_url).path
  expect(current_path).to eq(path_to(page_name))
end

Then /^(?:|I )should have the following query string:$/ do |expected_pairs|
  query = URI.parse(current_url).query
  actual_params = query ? CGI.parse(query) : {}
  expected_params = {}
  expected_pairs.rows_hash.each_pair{|k,v| expected_params[k] = v.split(',')}

 expect(actual_params).to eq(expected_params)
end

Then /^show me the page$/ do
  save_and_open_page
end

Given(/^I accept_alert$/) do
  Capybara::Session#accept_confirm
end

Then /^I should have locale "([^\"]*)"$/ do |locale|
  I18n.locale.to_s.should == locale
end

Then /^the field "([^\"]*)" should contain "([^"]*)"(?: within "([^"]*)")?$/ do |field, value, selector|
  with_scope(selector) do
    field = field_labeled(field)
    unless field
      field = field_labeled(field, disabled: true)
    end
    expect(field.value).to match(/#{value}/)
  end
end

Then /^the select field "([^\"]*)" should contain "([^"]*)"(?: within "([^"]*)")?$/ do |field, value, selector|
  with_scope(selector) do
    field = field_labeled(field)
    unless field
      field = field_labeled(field, disabled: true)
    end
    expect(field.find('option[selected]')).to match(/#{value}/)
  end
end

Then /^the disabled field "([^\"]*)" should contain "([^"]*)"(?: within "([^"]*)")?$/ do |field, value, selector|
  with_scope(selector) do
    field = field_labeled(field, disabled: true)
    expect(field.value).to match(/#{value}/)
  end
end

Then /^the disabled select field "([^\"]*)" should contain "([^"]*)"(?: within "([^"]*)")?$/ do |field, value, selector|
  with_scope(selector) do
    field = field_labeled(field, disabled: true)
    expect(field.find('option[selected]')).to match(/#{value}/)
  end
end
