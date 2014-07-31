require 'sinatra/base'
require 'sinatra/config_file'

require 'sequel'
require 'oj'
require 'json'
require 'rest_client'

require_relative 'helpers/_init'
require_relative 'models/_init'
require_relative 'routes/_init'

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

    # Helpers
    helpers Applyance::Helpers::API

    # Models
    register Applyance::Modeling::Init

    # Routing
    register Applyance::Routing::Init

  end
end
