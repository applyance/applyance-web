module Applyance
  module Routing
    module Main
      def self.registered(app)

        # Home (marketing page or app)
        app.get '/' do
          if session[:api_key].nil?
            erb :'main/index', :layout => :'layouts/public'
          else
            @api_host = app.settings.api_host
            @api_key = session[:api_key]
            erb :'app/home', :layout => :'layouts/app'
          end
        end
        ["/applications/?*", "/manage/*"].each do |path|
          app.get path do
            if session[:api_key].nil?
              redirect to "/"
            else
              @api_host = app.settings.api_host
              @api_key = session[:api_key]
              erb :'app/home', :layout => :'layouts/app'
            end
          end
        end

        app.get //, :provides => 'html' do
          if session[:api_key].nil?
            error 404
          end
          erb :'app/home', :layout => :'layouts/app'
        end

      end
    end
  end
end
