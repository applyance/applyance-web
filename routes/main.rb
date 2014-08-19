module Applyance
  module Routing
    module Main
      def self.registered(app)

        api_host = app.settings.api_host

        # Investors
        app.get '/investors' do
          erb :'main/investors', :layout => :'layouts/bare'
        end

        # Entity Application
        app.get '/:slug' do
          @api_host = app.settings.api_host
          @api_key = session[:api_key]

          @slug = params[:slug]
          headers = { :content_type => 'application/json' }

          response = RestClient.get(api_host + "/entities/#{@slug}", headers) { |response, request, result| response }
          error 404 unless response.code == 200

          @entity = JSON.parse(response)

          erb :'entities/apply'
        end

        # Home
        app.get '/' do
          if session[:api_key].nil?
            erb :'main/index', :layout => :'layouts/home'
          else
            @api_host = api_host
            @api_key = session[:api_key]
            @me = me(@api_key)
            erb :'review/index'
          end
        end

        # Catch all, go to the app
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
