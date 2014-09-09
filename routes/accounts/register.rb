module Applyance
  module Routing
    module Accounts
      module Register
        def self.registered(app)

          api_host = app.settings.api_host

          # GET Admin registration
          app.get '/:domain/register' do
            @api_host = api_host

            headers = { :content_type => 'application/json' }
            response = RestClient.get(api_host + "/domains/#{params[:domain]}", headers) { |response, request, result| response }

            @errors = collect_errors(response)
            if @errors.length > 0
              return erb :'accounts/register'
            end

            @domain = JSON.parse(response)

            erb :'accounts/register'
          end

        end
      end
    end
  end
end
