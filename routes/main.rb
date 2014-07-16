module Applyance
  module Routing
    module Main
      def self.registered(app)

        # Home page
        app.get '/' do
          erb :'main/index', :layout => :'layouts/base'
        end

      end
    end
  end
end
