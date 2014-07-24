module Applyance
  module Helpers
    module Auth

      def authenticate(params)
        response = RestClient.post(Applyance::Client.settings.api_host + '/accounts/auth', JSON.dump(params), { :content_type => 'application/json'})
        json_response = JSON.parse(response)
        api_key = response.headers[:authorization].split('auth=')[1]
        {
          'api_key' => api_key,
          'data' => json_response,
          'raw' => response
        }
      end

    end
  end
end
