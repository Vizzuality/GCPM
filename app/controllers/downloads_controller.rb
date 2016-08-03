class DownloadsController < ApplicationController
  def show
    send_file Rails.root.join('public/downloads', 'gcpm-user-manual.pdf'), type: "application/pdf", x_sendfile: true
  end
end
