module Applyance
  module Routing
    module Errors
      def self.registered(app)

        app.not_found do
          status 404
          erb :'errors/404'
        end

        app.error 500 do
          status 500
          erb :'errors/500'
        end

      end
    end
  end
end
