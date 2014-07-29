module Applyance
  module Routing
    module Units
      def self.registered(app)

        api_host = app.settings.api_host

        # Unit Application
        app.get '/units/:id/apply' do
          @id = params[:id]
          headers = { :content_type => 'application/json' }

          unit = RestClient.get(api_host + "/units/#{@id}", headers)
          @unit = JSON.parse(unit)

          erb :'units/apply', :layout => :'layouts/public/application'
        end

      end
    end
  end
end
