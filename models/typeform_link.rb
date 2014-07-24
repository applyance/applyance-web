module Applyance
  class TypeformLink < Sequel::Model

    # Create the application requests from a typeform
    def sync_applications

      puts "  Processing typeform link"
      puts "  ----"
      puts "  " + self.values.to_s
      puts "  ----"

      # Grab new typeforms and submit applications
      request = "https://api.typeform.com/v0/form/#{self.uid}?key=#{self.key}&completed=true"
      if self.last_sync_at
        request = request + "&since=#{self.last_sync_at.to_time.to_i}"
      end

      puts "  Querying typeform"
      puts "  ----"
      puts "  " + request.to_s
      puts "  ----"

      response = RestClient.get(request)

      puts "  Received response"
      puts "  ----"
      puts "  " + response.to_s
      puts "  ----"

      typeform = Oj.load(response)

      applications = []

      if typeform['responses'].count > 0

        typeform['responses'].each do |response|

          answers = {}
          name = nil
          email = nil

          response['answers'].each do |answer|

            question = typeform['questions'].detect { |q| q['id'] == answer[0] }

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

            if answers.key?(definition_label)
              answers[definition_label][:detail] = answers[definition_label][:detail] + ", #{datum_detail}"
            else
              answers[definition_label] = {
                :label => definition_label,
                :type => definition_type,
                :detail => datum_detail
              }
            end

          end

          fields = []
          answers.each do |label, answer|
            fields << {
              'datum' => {
                'detail' => answer[:detail],
                'definition' => {
                  'label' => label,
                  'type' => answer[:type]
                }
              }
            }
          end

          application = {
            'submitter' => {
              'name' => name,
              'email' => email
            },
            'spot_ids' => [self.typeformable_id],
            'fields' => fields
          }

          puts "  Submitting application"
          puts "  ----"
          puts "  " + Oj.dump(application).to_s
          puts "  ----"

          headers = {
            :content_type => 'application/json'
          }

          response = RestClient.post("#{Applyance::Client.settings.api_host}/applications", Oj.dump(application), headers)

          puts "  Response"
          puts "  ----"
          puts "  " + response.to_s
          puts "  ----"

          applications << application

        end

      end

      # Make sure synced time is updated
      self.update(:last_sync_at => DateTime.now)

      applications
    end

  end
end
