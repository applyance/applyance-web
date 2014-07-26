module Applyance
  module Helpers
    module Auth

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

    end
  end
end
