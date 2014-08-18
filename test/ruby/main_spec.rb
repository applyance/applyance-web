ENV['RACK_ENV'] = 'test'

require_relative '../../app.rb'
require 'rspec'
require 'rack/test'
require 'factory_girl'

require_relative '_config'

describe Applyance::Client do

  include Rack::Test::Methods

  def app
    @app ||= Applyance::Client
  end

  describe "GET /" do
    context "not logged in" do
      it "returns 200" do
        get "/"
        expect(last_response.status).to eq(200)
      end
    end
  end

end
