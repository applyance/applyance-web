module Applyance
  module Routing
    module Entities
      def self.registered(app)

        api_host = app.settings.api_host

        # Entity Application
        app.get '/entities/:id/apply' do
          @id = params[:id]
          headers = { :content_type => 'application/json' }

          entity = RestClient.get(api_host + "/entities/#{@id}", headers)
          @entity = JSON.parse(entity)

          erb :'entities/apply'
        end

      end
    end
  end
end
