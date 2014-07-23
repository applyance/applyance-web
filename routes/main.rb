module Applyance
  module Routing
    module Main
      def self.registered(app)

        require 'rubygems'
        require 'json'
        require 'rest_client'

        api_host = Applyance::Client.settings.api_host

        # Home page (marketing and app)
        app.get '/' do

          if session[:api_key] == nil
            erb :'main/index', :layout => :'layouts/base'
          else
            locals = { :api_host => api_host, :api_key => session[:api_key] }
            erb :'app/home', :layout => :'layouts/app', :locals => locals
          end

        end

        # Spot
        app.get '/spot/:id' do
          erb :'main/spot', :layout => :'layouts/base', :locals => {:id => params[:id]}
        end

        # Spot Application
        app.get '/apply/:id' do
          erb :'main/spotApp', :layout => :'layouts/base', :locals => {:id => params[:id]}
        end

        #
        # Account Stuff
        #

        # Logout
        app.get '/accounts/logout' do
          session.clear
          redirect to ('/')
        end

        # Reviewer Registration
        app.get '/register' do
          erb :'accounts/register', :layout => :'layouts/base'
        end
        app.post '/register' do

          # values = '{
          #   "account": {
          #     "name": ' + params[:account][:name].to_s + ',
          #     "email": ' + params[:account][:email].to_s + ',
          #     "password": ' + params[:account][:password].to_s + '
          #   },
          #   "entity": {
          #     "name": ' + params[:entity][:name].to_s + '
          #   }
          # }'

          person_name = params[:account][:name].to_s
          person_email = params[:account][:email].to_s
          person_password = params[:account][:password].to_s
          entity_name = params[:entity][:name].to_s

          values = '{
              "name": "' + entity_name + '"
          }'

          headers = {
            :content_type => 'application/json'
          }

          #create entity
          RestClient.post(api_host + '/entities', values, headers){ |response, request, result, &block|
            case response.code
            when 201

              #create admin for this entity
              json_response = JSON.parse(response)
              entity_id = json_response["id"].to_s

              values = '{
                "name": "' + person_name + '",
                "email": "' + person_email + '",
                "password": "' + person_password + '"
              }'

              RestClient.post(api_host + '/entities/' + entity_id + '/admins', values, headers){ |response, request, result, &block|
                case response.code
                when 201

                  p "ADMIN created. creating UNIT......."

                  values = '{
                    "name": "' + entity_name + '"
                  }'

                  #create unit for this entity
                  RestClient.post(api_host + '/entities/' + entity_id + '/units', values, headers){ |response, request, result, &block|
                    case response.code
                    when 201

                      p "UNIT created. creating spot......."

                      json_response = JSON.parse(response)
                      unit_id = json_response["id"].to_s

                      values = '{
                        "name": "' + entity_name + '",
                        "detail": "",
                        "status": "open"
                      }'

                      #create spot for this unit
                      RestClient.post(api_host + '/units/' + unit_id + '/spots', values, headers){ |response, request, result, &block|
                        case response.code
                        when 201

                          p "SUCCESS"

                          redirect to('/')

                        else
                          erb :'accounts/register', :layout => :'layouts/base'
                        end
                      }

                    else
                      p response
                      # erb :'accounts/register', :layout => :'layouts/base'
                    end
                  }

                else
                  # erb :'accounts/register', :layout => :'layouts/base'
                end
              }

            else
              # erb :'accounts/register', :layout => :'layouts/base'
            end
          }

        end

        # Verify Email
        app.get '/accounts/verify' do

          values = '{
            "verify_digest": ' + params[:digest] + '
          }'

          headers = {
            :content_type => 'application/json',
            :authorization => 'ApplyanceLogin auth=YW55IGNhcm5hbCBwbGVhc3VyZS4='
          }

          RestClient.post api_host + '/accounts/verify', values, headers

          erb :'accounts/verify', :layout => :'layouts/base', :locals => {:id => params[:id]}
        end

        # Login
        app.get '/accounts/login' do
          erb :'accounts/login', :layout => :'layouts/base'
        end
        app.post '/accounts/login' do

          values = '{
            "email": ' + params[:account][:email].to_s + ',
            "password": ' + params[:account][:password].to_s + '
          }'

          headers = {
            :content_type => 'application/json'
          }

          RestClient.post(api_host + '/accounts/auth', values, headers){ |response, request, result, &block|
            case response.code
            when 200
              api_key = response.headers[:authorization].split('auth=')[1]
              session[:api_key] = api_key

              redirect to('/')
            else
              erb :'accounts/login', :layout => :'layouts/base'
            end
          }

        end

        # Reset Password
        app.get '/accounts/password/reset' do
          erb :'accounts/resetPassword', :layout => :'layouts/base'
        end
        app.post '/accounts/password/reset' do

          values = '{
            "email": ' + params[:account][:email].to_s + '
          }'

          headers = {
            :content_type => 'application/json'
          }

          RestClient.post(api_host + '/accounts/password/reset', values, headers) { |response, request, result, &block|
            case response.code
            when 201
              response
            else
              response.return!(request, result, &block)
            end
          }

        end

        # Set Password
        app.get '/accounts/password/set' do
          erb :'accounts/setPassword', :layout => :'layouts/base',
            :locals => {:token => params[:token], :id => params[:id]}
        end
        app.post '/accounts/password/set' do

          values = '{
            "reset_token": ' + params[:token].to_s + ',
            "new_password": ' + params[:password].to_s + '
          }'

          headers = {
            :content_type => 'application/json'
          }

          RestClient.post(api_host + '/accounts/passwords/set', values, headers){ |response, request, result, &block|
            case response.code
            when 200
              # api_key = response.headers[:authorization].split('auth=')[1]
              # session[:api_key] = api_key
              redirect to('/')
            else
              response.return!(request, result, &block)
            end
          }

        end

      end
    end
  end
end
