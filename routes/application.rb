module Applyance
  module Routing
    module Application
      def self.registered(app)

        # APPLICATIONS
        #
        # This is a CATCH ALL route for application slugs
        # This will need to be modified for nested applications in the future
        app.get '/*' do
          @api_host = app.settings.api_host
          @api_key = session[:api_key]

          @slug = params[:splat].first
          headers = { :content_type => 'application/json' }

          response = RestClient.get(@api_host + "/entities?slug=#{@slug}", headers) { |response, request, result| response }
          error 404 unless response.code == 200

          @entity = JSON.parse(response)

          erb :'application/index'
        end

      end
    end
  end
end
