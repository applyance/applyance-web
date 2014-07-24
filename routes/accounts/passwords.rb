module Applyance
  module Routing
    module Accounts
      module Passwords
        def self.registered(app)

          api_host = app.settings.api_host

          # GET Password Reset
          app.get '/accounts/passwords/reset' do
            erb :'accounts/passwords/reset', :layout => :'layouts/base'
          end

          # POST Password Reset
          app.post '/accounts/passwords/reset' do

            headers = { :content_type => 'application/json' }
            values = { "email" => params[:account][:email] }

            response = RestClient.post(api_host + '/accounts/password/reset', JSON.dump(values), headers)
            error 500 unless response.code == 201

            # TODO: Do something here

          end

          # GET Password Set
          app.get '/accounts/passwords/set' do
            @token = params[:token]
            @id = params[:id]
            erb :'accounts/passwords/set', :layout => :'layouts/base'
          end

          # POST Password Set
          app.post '/accounts/passwords/set' do

            headers = { :content_type => 'application/json' }
            values = {
              "reset_digest" => params[:token],
              "new_password" => params[:password]
            }

            response = RestClient.post(api_host + '/accounts/passwords/set', JSON.dump(values), headers)
            error 500 unless response.code == 200

            # api_key = response.headers[:authorization].split('auth=')[1]
            # session[:api_key] = api_key
            redirect to('/')

          end

        end
      end
    end
  end
end
