module Applyance
  module Modeling
    module Init
      def self.registered(app)

        # Connect to Database
        db = Sequel.connect(
          :adapter => 'sqlite',
          :database => "./db/#{app.settings.database_name}.db"
        )
        app.set :db, db

        # Load plugins
        Sequel::Model.plugin(:timestamps)
        Sequel::Model.plugin(:validation_helpers)

        # Require models, can't go at the top because it requires a
        # Sequel connection
        require_relative 'typeform_link'

      end
    end
  end
end
