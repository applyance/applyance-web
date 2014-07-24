module Applyance
  module Routing
    module Main
      def self.registered(app)

        # Home (marketing page or app)
        app.get '/' do
          if session[:api_key] == nil
            erb :'main/index', :layout => :'layouts/base'
          else
            @api_host = app.settings.api_host
            @api_key = session[:api_key]
            erb :'app/home', :layout => :'layouts/app'
          end
        end

      end
    end
  end
end
