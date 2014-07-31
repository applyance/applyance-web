module Applyance
  module Routing
    module Accounts
      module Main
        def self.registered(app)

          api_host = app.settings.api_host

          # GET Verify Email
          app.get '/accounts/verify' do

            values = { "verify_digest" => params[:code] }
            headers = { :content_type => 'application/json' }

            response = RestClient.post(api_host + '/accounts/verify', JSON.dump(values), headers) { |response, request, result| response }
            error 500 unless response.code == 200

            api_key = response.headers[:authorization].split('auth=')[1]
            session[:api_key] = api_key
            redirect to('/')
          end

          # GET Reviewer Claim
          app.get '/reviewers/claim' do
            @code = params[:code]
            erb :'reviewers/claim', :layout => :'layouts/bare'
          end

          # POST Reviewer Claim
          app.post '/reviewers/claim' do

            headers = { :content_type => 'application/json' }
            values = {
              "claim_digest" => params[:account][:code],
              "name" => params[:account][:name],
              "password" => params[:account][:password]
            }

            response = RestClient.post(api_host + '/reviewers/invites/claim', JSON.dump(values), headers) { |response, request, result| response }

            @errors = collect_errors(response)
            if @errors.length > 0
              return erb :'reviewers/claim', :layout => :'layouts/bare'
            end

            json_response = JSON.parse(response)

            auth = authenticate({
              "email" => json_response["account"]["email"],
              "password" => params[:account][:password]
            })

            session[:api_key] = auth['api_key']
            redirect to('/')
          end

        end
      end
    end
  end
end
