module Applyance
  module Routing
    module Review
      def self.registered(app)

        api_host = app.settings.api_host

        app.get '/entities/:id/settings',
                '/entities/:id/entities',
                '/entities/:id/reviewers',
                '/entities/:id/blueprints',
                '/entities/:id/labels',
                '/entities/:id/billing',
                '/entities/:id/billing/plan',
                '/entities/:id/billing/card',
                '/spots/:id/applications',
                '/spots/:id/settings',
                '/spots/:id/blueprints',
                '/entities/:id/spots',
                '/applicants/:id',
                '/entities/:id/applications',
                '/accounts/:id/settings',

          :provides => :html do

          if session[:api_key].nil?
            flash[:notice] = "You are trying to access a page that requires reviewer access. Please login to continue."
            session[:redirect_to] = request.path
            redirect to "/accounts/login"
          end

          @api_host = app.settings.api_host
          @api_key = session[:api_key]
          @me = me(@api_key)

          erb :'review/index'

        end

      end
    end
  end
end
