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

          entity = RestClient.get(api_host + "/entities/#{@slug}", headers)
          @entity = JSON.parse(entity)

          erb :'entities/apply'
        end

      end
    end
  end
end
