module Applyance
  module Routing
    module Main
      def self.registered(app)

        api_host = app.settings.api_host

        # Investor landing page
        app.get '/invest' do
          erb :'main/invest', :layout => :'layouts/public'
        end

        # Privacy policy
        app.get '/privacy' do
          erb :'main/privacy', :layout => :'layouts/public'
        end

        # Home
        app.get '/' do
          if session[:api_key].nil?
            erb :'main/index'
          else
            @api_host = api_host
            @api_key = session[:api_key]
            @me = me(@api_key)
            erb :'review/index'
          end
        end

      end
    end
  end
end
