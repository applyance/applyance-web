module Applyance
  module Routing
    module Spots
      def self.registered(app)

        # Spot
        app.get '/spot/:id' do
          @id = params[:id]
          erb :'spots/show', :layout => :'layouts/base'
        end

        # Spot Application
        app.get '/apply/:id' do
          @id = params[:id]
          erb :'spots/apply', :layout => :'layouts/base'
        end

      end
    end
  end
end
