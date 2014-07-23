require 'sinatra/base'
require 'sinatra/config_file'

require 'sequel'
require 'oj'

require_relative 'routes/init'

module Applyance
  class Client < Sinatra::Base

    # Load config file
    register Sinatra::ConfigFile
    config_file 'config.yml'

    # Config
    set :root, File.dirname(__FILE__)
    enable :sessions, :logging

    configure :development do
      enable :static
      set :show_exceptions, :after_handler
    end

    # Register app stuff
    register Applyance::Routing::Init

  end
end
