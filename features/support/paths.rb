module NavigationHelpers
  # Maps a name to a path. Used by the
  #
  #   When /^I go to (.+)$/ do |page_name|
  #
  # step definition in web_steps.rb
  #
  def path_to(page_name)
    case page_name

    when /the home\s?page/
      '/'
    when /the login page/
      '/users/sign_in'
    when /the logout page/
      '/users/sign_out'
    when /the register page/
      '/users/sign_up'
    when /the profile edit page for "(.*)"$/
      edit_user_registration_path(User.find_by_email($1))
    when /the profile page for "(.*)"$/
      user_path(User.find_by_email($1))
    when /the user projects page for "(.*)"$/
      user_path(User.find_by_email($1))
    when /the project page for "(.*)"$/
      project_path(Project.find_by_title($1))
    when /the project page for "(.*)" "(.*)"$/
      user_project_path(User.find_by_email($1), Project.find_by_title($2))
    when /the edit project page for "(.*)" "(.*)"$/
      edit_user_project_path(User.find_by_email($1), Project.find_by_title($2))
    when /the new project page for "(.*)"$/
      new_user_project_path(User.find_by_email($1))
    else
      begin
        page_name =~ /the (.*) page/
        path_components = $1.split(/\s+/)
        self.send(path_components.push('path').join('_').to_sym)
      rescue
        raise "Can't find mapping from \"#{page_name}\" to a path.\n" +
          "Now, go and add a mapping in #{__FILE__}"
      end
    end
  end
end

World(NavigationHelpers)
