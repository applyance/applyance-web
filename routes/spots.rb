module Applyance
  module Routing
    module Spots
      def self.registered(app)

        # Spot
        app.get '/spots/:id' do
          @id = params[:id]
          erb :'spots/show', :layout => :'layouts/base'
        end

        # Spot Application
        app.get '/spots/:id/apply' do
          @id = params[:id]
          erb :'spots/apply', :layout => :'layouts/base'
        end

      end
    end
  end
end
