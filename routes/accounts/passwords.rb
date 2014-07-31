module Applyance
  module Routing
    module Accounts
      module Passwords
        def self.registered(app)

          api_host = app.settings.api_host

          # GET Password Reset Sent
          app.get '/accounts/passwords/reset/sent' do
            erb :'accounts/passwords/reset_sent', :layout => :'layouts/bare'
          end

          # GET Password Reset
          app.get '/accounts/passwords/reset' do
            erb :'accounts/passwords/reset', :layout => :'layouts/bare'
          end

          # POST Password Reset
          app.post '/accounts/passwords/reset' do

            headers = { :content_type => 'application/json' }
            values = { "email" => params[:account][:email] }

            response = RestClient.post(api_host + '/accounts/passwords/reset', JSON.dump(values), headers) { |response, request, result| response }

            @errors = collect_errors(response)
            if @errors.length > 0
              return erb :'accounts/passwords/reset', :layout => :'layouts/bare'
            end

            redirect to('/accounts/passwords/reset/sent')

          end

          # GET Password Set
          app.get '/accounts/passwords/set' do
            @code = params[:code]
            erb :'accounts/passwords/set', :layout => :'layouts/bare'
          end

          # POST Password Set
          app.post '/accounts/passwords/set' do

            headers = { :content_type => 'application/json' }
            values = {
              "reset_digest" => params[:code],
              "new_password" => params[:account][:password]
            }

            response = RestClient.post(api_host + '/accounts/passwords/set', JSON.dump(values), headers) { |response, request, result| response }

            @errors = collect_errors(response)
            if @errors.length > 0
              return erb :'accounts/passwords/set', :layout => :'layouts/bare'
            end

            api_key = response.headers[:authorization].split('auth=')[1]
            session[:api_key] = api_key
            redirect to('/')

          end

        end
      end
    end
  end
end
