module Applyance
  module Routing
    module Entities
      def self.registered(app)

        # Entity Application
        app.get '/entities/:id/apply' do
          @id = params[:id]
          erb :'entities/apply', :layout => :'layouts/public'
        end

      end
    end
  end
end
