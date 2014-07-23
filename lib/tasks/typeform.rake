namespace :bundler do
  task :setup do
    require 'rubygems'
    require 'bundler/setup'
  end
end

task :environment, [:env] => 'bundler:setup' do |cmd, args|
  ENV["RACK_ENV"] = args[:env] || "development"
  require "./app"
end

namespace :typeform do

  desc "Create typeform link"
  task :link, [:env, :spot_id, :typeform_uid, :typeform_key] do |cmd, args|
    env = args[:env] || "development"
    Rake::Task['environment'].invoke(env)

    DB = Sequel.connect('sqlite://client.db')
    DB.run("create table if not exists spots (spot_id integer, typeform_uid text, typeform_key text, last_sync_time datetime)")

    spots = DB[:spots]
    spots.insert(
      :spot_id => args[:spot_id],
      :typeform_uid => args[:typeform_uid],
      :typeform_key => args[:typeform_key],
      :last_sync_time => nil)
  end

  desc "Sync typeforms"
  task :sync, :env do |cmd, args|
    env = args[:env] || "development"
    Rake::Task['environment'].invoke(env)

    # Grab Spot IDs and last sync time for each
    DB = Sequel.connect('sqlite://client.db')
    DB.run("create table if not exists spots (spot_id integer, typeform_uid text, typeform_key text, last_sync_time datetime)")
    spots = DB[:spots]

    spots.all.each do |spot|

      puts "Querying typeform"

      # Grab new typeforms and submit applications
      request = "https://api.typeform.com/v0/form/#{spot[:typeform_uid]}?key=#{:typeform_key}&completed=true"
      if spot[:last_sync_time]
        request = request + "&since=#{spot[:last_sync_time].to_time.to_i}"
      end

      response = RestClient.get(request)
      obj = Oj.load(response)

      if obj['responses'].count > 0

        name = nil
        email = nil
        questions = {}

        puts "Going through responses"

        obj['responses'].each do |response|

          puts "  ------------------------  "
          response['answers'].each do |answer|
            question = obj['questions'].detect { |q| q['id'] == answer[0] }

            definition_label = question['question']
            definition_type = question['id'][0, question['id'].index('_')]
            datum_detail = answer[1]

            if definition_label.downcase == "name"
              name = datum_detail
              next
            end

            if definition_label.downcase == "email"
              email = datum_detail
              next
            end

            if questions.key?(definition_label)
              questions[definition_label][:detail] = questions[definition_label][:detail] + ", #{datum_detail}"
            else
              questions[definition_label] = {
                :label => definition_label,
                :type => definition_type,
                :detail => datum_detail
              }
            end

          end
        end

        puts "Going through questions"

        questions.each do |label, question|
          puts "#{label}, #{question[:type]} - #{question[:detail]}"

          fields = []
          fields << {
            :datum => {
              :detail => question[:detail],
              :definition => {
                :label => label,
                :type => question[:type]
              }
            }
          }
        end

        puts "Creating application"

        application = {
          submitter: {
            name: name,
            email: email
          },
          spot_ids: [spot[:spot_id]],
          fields: fields
        }

        headers = {
          :content_type => 'application/json'
        }

        puts "Submitting"

        response = RestClient.post "#{Applyance::Server.settings.api_host}/applications", Oj.dump(application), headers

        spot.update(:last_sync_time => DateTime.now)

        puts "response"
      end

    end

  end

end
