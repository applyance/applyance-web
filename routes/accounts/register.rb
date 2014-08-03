module Applyance
  module Routing
    module Accounts
      module Register
        def self.registered(app)

          api_host = app.settings.api_host

          # GET Admin registration
          app.get '/accounts/register' do
            @api_host = api_host
            erb :'accounts/register'
          end

          # POST Admin registration
          app.post '/accounts/register' do

            person_name = params[:account][:name].to_s
            person_email = params[:account][:email].to_s
            person_password = params[:account][:password].to_s
            entity_name = params[:entity][:name].to_s

            #
            # Create entity
            #

            values = { "name" => entity_name }
            headers = { :content_type => 'application/json' }
            response = RestClient.post(api_host + '/entities', JSON.dump(values), headers) { |response, request, result| response }

            @errors = collect_errors(response)
            if @errors.length > 0
              return erb :'accounts/register', :layout => :'layouts/public'
            end

            json_response = JSON.parse(response)
            entity_id = json_response["id"].to_s

            #
            # Create reviewer
            #

            headers = { :content_type => 'application/json' }
            values = {
              "name" => person_name,
              "email" => person_email,
              "password" => person_password
            }

            response = RestClient.post(api_host + "/entities/#{entity_id}/reviewers", JSON.dump(values), headers) { |response, request, result| response }

            @errors = collect_errors(response)
            if @errors.length > 0
              return erb :'accounts/register', :layout => :'layouts/public'
            end

            json_response = JSON.parse(response)
            auth = authenticate({
              "email" => json_response["account"]["email"],
              "password" => person_password
            })

            session[:api_key] = auth['api_key']
            redirect to('/')

          end

        end
      end
    end
  end
end
