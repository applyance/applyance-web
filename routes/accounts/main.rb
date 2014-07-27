module Applyance
  module Routing
    module Accounts
      module Main
        def self.registered(app)

          api_host = app.settings.api_host

          # GET Verify Email
          app.get '/accounts/verify' do

            values = { "verify_digest" => params[:digest] }
            headers = { :content_type => 'application/json' }

            response = RestClient.post(api_host + '/accounts/verify', JSON.dump(values), headers)

            @id = params[:id]
            erb :'accounts/verify', :layout => :'layouts/public'
          end

        end
      end
    end
  end
end
