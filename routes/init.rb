require_relative 'errors'
require_relative 'main'

module Applyance
  module Routing
    module Init
      def self.registered(app)
        app.register Applyance::Routing::Errors
        app.register Applyance::Routing::Main
      end
    end
  end
end
