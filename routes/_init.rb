require_relative '_errors'
require_relative 'accounts/_init'
require_relative 'review'
require_relative 'main'
require_relative 'application'

module Applyance
  module Routing
    module Init
      def self.registered(app)
        app.register Applyance::Routing::Errors
        app.register Applyance::Routing::Accounts::Init
        app.register Applyance::Routing::Review
        app.register Applyance::Routing::Main
        app.register Applyance::Routing::Application
      end
    end
  end
end
