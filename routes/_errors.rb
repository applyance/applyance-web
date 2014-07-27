module Applyance
  module Routing
    module Errors
      def self.registered(app)

        app.not_found do
          status 404
          erb :'errors/404', :layout => :'layouts/public'
        end

        app.error 500 do
          status 500
          erb :'errors/500', :layout => :'layouts/public'
        end

      end
    end
  end
end
