module Applyance
  module Routing
    module Spots
      def self.registered(app)

        # Spot
        app.get '/spots/:id' do
          @id = params[:id]
          erb :'spots/show', :layout => :'layouts/public'
        end

        # Spot Application
        app.get '/spots/:id/apply' do
          @id = params[:id]
          headers = { :content_type => 'application/json' }

          spot = RestClient.get(api_host + "/spots/#{@id}", headers)
          @spot = JSON.parse(spot)

          erb :'spots/apply', :layout => :'layouts/application'
        end

      end
    end
  end
end
