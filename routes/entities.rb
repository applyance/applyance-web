module Applyance
  module Routing
    module Entities
      def self.registered(app)

        # Entity Application
        app.get '/entities/:id/apply' do
          @id = params[:id]
          headers = { :content_type => 'application/json' }

          entity = RestClient.get(api_host + "/entities/#{@id}", headers)
          @entity = JSON.parse(entity)

          erb :'entities/apply', :layout => :'layouts/application'
        end

      end
    end
  end
end
