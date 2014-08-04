module Applyance
  module Routing
    module Main
      def self.registered(app)

        # Home
        app.get '/' do
          if session[:api_key].nil?
            erb :'main/index', :layout => :'layouts/home'
          else
            @api_host = app.settings.api_host
            @api_key = session[:api_key]
            @me = me(@api_key)
            erb :'review/index'
          end
        end

        app.get //, :provides => 'html' do
          if session[:api_key].nil?
            redirect to("/")
          end
          @api_host = app.settings.api_host
          @api_key = session[:api_key]
          @me = me(@api_key)
          erb :'review/index'
        end

      end
    end
  end
end
