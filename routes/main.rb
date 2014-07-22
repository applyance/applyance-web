module Applyance
  module Routing
    module Main
      def self.registered(app)

        require 'rest_client'


        # Home page
        app.get '/' do
          erb :'main/index', :layout => :'layouts/base'
        end

        # Spot
        app.get '/spot/:id' do
          erb :'main/spot', :layout => :'layouts/base', :locals => {:id => params[:id]}
        end

        # Spot Application
        app.get '/spot/:id/apply' do
          erb :'main/spotApp', :layout => :'layouts/base', :locals => {:id => params[:id]}
        end

        #
        # Account Stuff
        #
        # Reviewer Registration
        app.get '/accounts/register' do
          erb :'accounts/register', :layout => :'layouts/base'
        end
        app.post '/accounts/register' do

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
        app.get '/accounts/verify/:id/:verify_digest' do

          id = params[:id].to_s;
          values = '{
            "verify_digest": ' + params[:verify_digest] + '
          }'

          headers = {
            :content_type => 'application/json',
            :authorization => 'ApplyanceLogin auth=YW55IGNhcm5hbCBwbGVhc3VyZS4='
          }

          RestClient.post 'https://applyance.apiary-mock.com/accounts/' + id + '/verify-email', values, headers

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
              p "It worked!"
              response
              redirect to('/home')
            else
              p "FAIL"
              response.return!(request, result, &block)
            end
          }

        end

        # Reset Password
        app.get '/accounts/resetpassword' do
          erb :'accounts/resetPassword', :layout => :'layouts/base'
        end
        app.post '/accounts/resetpassword' do

          values = '{
            "email": ' + params[:account][:email].to_s + '
          }'

          headers = {
            :content_type => 'application/json'
          }

          RestClient.post('https://applyance.apiary-mock.com/accounts/password/reset', values, headers) { |response, request, result, &block|
            case response.code
            when 200
              p "It worked!"
              response
            else
              p "FAIL"
              response.return!(request, result, &block)
            end
          }

        end

        # Set Password
        app.get '/accounts/setpassword/:id/:token' do
          erb :'accounts/setPassword', :layout => :'layouts/base',
            :locals => {:token => params[:token], :id => params[:id]}
        end
        app.post '/accounts/setpassword' do

          id = params[:id].to_s;
          puts id
          values = '{
            "reset_token": ' + params[:token].to_s + ',
            "new_password": ' + params[:password].to_s + '
          }'
          puts values

          headers = {
            :content_type => 'application/json'
          }

          RestClient.post 'https://applyance.apiary-mock.com/accounts/' + id + '/set-password', values, headers

        end

        #
        # SPA
        #
        # Dashboard
        app.get '/home' do
          erb :'app/home', :layout => :'layouts/app'
        end

      end
    end
  end
end
