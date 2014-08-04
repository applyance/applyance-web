module Applyance
  module Routing
    module Entities
      def self.registered(app)

        api_host = app.settings.api_host

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

      end
    end
  end
end
