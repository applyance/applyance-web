module Applyance
  module Helpers
    module API

      def me(api_key)
        headers = {
          :content_type => 'application/json',
          :authorization => "ApplyanceLogin auth=#{api_key}"
        }
        response = RestClient.get(Applyance::Client.settings.api_host + '/accounts/me', headers) { |response, request, result| response }
        JSON.parse(response)
      end

      def authenticate(params)
        response = RestClient.post(Applyance::Client.settings.api_host + '/accounts/auth', JSON.dump(params), { :content_type => 'application/json'}) { |response, request, result| response }
        json_response = JSON.parse(response)
        if response.headers[:authorization]
          api_key = response.headers[:authorization].split('auth=')[1]
        end
        {
          'api_key' => api_key || nil,
          'data' => json_response,
          'raw' => response
        }
      end

      def collect_errors(response)
        return [] unless response && (response.length > 0)

        errors = []
        json_response = JSON.parse(response)

        unless [200, 201, 204].include?(response.code)
          if json_response['errors'] && json_response['errors'].first['status'] == 400
            errors << json_response['errors'].first['detail']
          else
            error 500
          end
        end

        errors
      end

    end
  end
end
