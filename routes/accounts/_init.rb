require_relative 'login'
require_relative 'main'
require_relative 'passwords'
require_relative 'register'

module Applyance
  module Routing
    module Accounts
      module Init
        def self.registered(app)
          app.register Applyance::Routing::Accounts::Main
          app.register Applyance::Routing::Accounts::Login
          app.register Applyance::Routing::Accounts::Passwords
          app.register Applyance::Routing::Accounts::Register
        end
      end
    end
  end
end
