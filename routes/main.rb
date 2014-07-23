module Applyance
  module Routing
    module Main
      def self.registered(app)

        require 'rest_client'

        # Home page (marketing and app)
        app.get '/' do

          if session[:api_key] == nil
            erb :'main/index', :layout => :'layouts/base'
          else
            erb :'app/home', :layout => :'layouts/app'
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

          values = '{
            "account": {
              "name": ' + params[:account][:name].to_s + ',
              "email": ' + params[:account][:email].to_s + ',
              "password": ' + params[:account][:password].to_s + '
            },
            "entity": {
              "name": ' + params[:entity][:name].to_s + '
            }
          }'

          headers = {
            :content_type => 'application/json'
          }

          RestClient.post 'https://applyance.apiary-mock.com/reviewers/register', values, headers

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

          RestClient.post 'https://applyance.apiary-mock.com/accounts/verify', values, headers

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

          RestClient.post('https://applyance.apiary-mock.com/accounts/auth', values, headers){ |response, request, result, &block|
            case response.code
            when 200
              api_key = response.headers[:authorization].split('auth=')[1]
              session[:api_key] = api_key
              redirect to('/')
            else
              response.return!(request, result, &block)
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

          RestClient.post('https://applyance.apiary-mock.com/accounts/password/reset', values, headers) { |response, request, result, &block|
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

          RestClient.post('https://applyance.apiary-mock.com/accounts/passwords/set', values, headers){ |response, request, result, &block|
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
